import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { ConfidenceLevel, Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import { getProjectContext } from "../project-context.js";
import { isMetadataKeyLine } from "../context.js";
import type { Detector } from "./types.js";

const SECURITY_HEADERS = [
  "Content-Security-Policy",
  "X-Frame-Options",
  "X-Content-Type-Options",
  "Strict-Transport-Security",
  "Referrer-Policy",
];

const RANDOM_HIGH_CONTEXT =
  /\b(?:otp|one[._-]?time|pin|verification[._-]?code|auth[._-]?code|session|sessionId|sessionToken|token|authToken|accessToken|secret|password|passwd|pwd|csrf|xsrf)\b/i;

/**
 * When the current line contains one of these sink names AND Math.random(),
 * the AI-002 detector (in ai-patterns.ts) takes precedence with certain
 * confidence and critical severity. This misconfig rule steps back so the
 * finding isn't double-reported.
 */
const AI002_SINK_ON_LINE =
  /\b(?:otp|verificationCode|verifyCode|token|accessToken|refreshToken|sessionToken|authToken|csrfToken|resetToken|passwordResetToken|sessionId|nonce|pin|secret|apiKey|api_key)\s*[:=]/i;

const RANDOM_MEDIUM_CONTEXT =
  /\b(?:uuid|userId|requestId|auth middleware|middleware auth)\b/i;

const RANDOM_LOW_CONTEXT =
  /tracking|analytics|\bui\b|element|correlationId|traceId|requestId|delay|animation|visual|randomness|\bid\b/i;

const LINE_HAS_CODE_SHAPE =
  /[={};]|=>|\breturn\b|\b(?:const|let|var)\b|\bfunction\b|\bawait\b|\bnew\b|\.[a-zA-Z_$][\w$]*\s*\(|\$\{/;

const SENSITIVE_LOG_CONTEXT =
  /\b(?:password|secret|token|key|credential|auth|private|ssn|dob|creditcard|credit_card|apiKey|api_key)\b/i;

function nearbyContext(lines: string[], index: number, radius: number): string {
  const start = Math.max(0, index - radius);
  const end = Math.min(lines.length, index + radius + 1);
  return lines.slice(start, end).join("\n");
}

function classifyMathRandom(lines: string[], index: number): {
  severity: Finding["severity"];
  description: string;
  confidence: ConfidenceLevel;
} | undefined {
  const context = nearbyContext(lines, index, 5);
  const line = lines[index] ?? "";
  const currentLineLooksLowRisk =
    RANDOM_LOW_CONTEXT.test(line) && !RANDOM_HIGH_CONTEXT.test(line);
  const currentLineLooksHighRisk = RANDOM_HIGH_CONTEXT.test(line);

  // Delegate the flagship "Math.random for a token" case to AI-002 —
  // that detector emits `certain` confidence + `critical` severity and
  // owns the screenshot-selling headline. Skip here to avoid double-
  // reporting the same line under two rules.
  if (AI002_SINK_ON_LINE.test(line)) return undefined;

  // Require some code shape on the line — otherwise Math.random() sitting
  // inside JSX text ("Math.random() for OTP") or a doc paragraph fires
  // this rule despite being pure prose. Strip the match itself first —
  // `.random(` would otherwise satisfy the check on its own.
  const residual = line.replace(/Math\.random\s*\(\s*\)|Date\.now\s*\(\s*\)/g, "");
  if (!LINE_HAS_CODE_SHAPE.test(residual)) return undefined;

  if (currentLineLooksHighRisk && !currentLineLooksLowRisk) {
    return {
      severity: "high",
      description:
        "Math.random() is not cryptographically secure and is being used near authentication, token, password, OTP, session, or CSRF context.",
      confidence: "high",
    };
  }

  if (RANDOM_MEDIUM_CONTEXT.test(line) && /\bauth|middleware\b/i.test(context)) {
    return {
      severity: "medium",
      description:
        "Math.random() appears to be used for an identifier in an authentication-adjacent context.",
      confidence: "high",
    };
  }

  if (
    RANDOM_LOW_CONTEXT.test(line) ||
    /tracking|analytics|logging only|no cryptographic property|animation|visual/i.test(context)
  ) {
    return {
      severity: "low",
      description:
        "Math.random() appears to be used for non-security tracking, UI, correlation, delay, animation, or logging identifiers.",
      confidence: "high",
    };
  }

  return undefined;
}

export const misconfigDetector: Detector = {
  id: "misconfig",
  async run(files: ScannedFile[], projectRoot: string): Promise<Finding[]> {
    const findings: Finding[] = [];
    const projectContext = await getProjectContext(projectRoot);

    // Check .env committed
    const envFiles = [".env", ".env.local", ".env.production"];
    for (const envFile of envFiles) {
      try {
        await access(join(projectRoot, envFile));
        const gitignore = await readFile(join(projectRoot, ".gitignore"), "utf8").catch(
          () => "",
        );
        if (!gitignore.includes(".env")) {
          findings.push({
            id: randomUUID(),
            detector: "misconfig",
            rule: "D5-001",
            domain: "D5",
            severity: "critical",
            title: `${envFile} may be committed to git`,
            description: `Environment file ${envFile} exists and .gitignore may not exclude it.`,
            why: "A committed .env leaks every credential in it. Deleting the file later doesn't undo the exposure — the values are already in git history.",
            file: envFile,
            fix: `Add "${envFile}" and ".env*" to .gitignore. Never commit secrets.`,
            confidence: "high",
            category: "Security Misconfiguration",
          });
        }
      } catch {
        // file doesn't exist
      }
    }

    for (const file of files) {
      if (/\.(md|mdx|markdown|txt|rst)$/i.test(file.relativePath)) continue;

      let content: string;
      try {
        content = await readFile(file.path, "utf8");
      } catch {
        continue;
      }

      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? "";
        if (isMetadataKeyLine(line)) continue;

        if (/Access-Control-Allow-Origin['":\s]*\*|origin:\s*['"]?\*['"]?/i.test(line)) {
          // AI-001 owns the "wildcard CORS on an app with auth" case
          // (critical + high confidence). D5-002 stays for the plain
          // misconfig case where no auth is detected.
          if (!projectContext.hasAuth) {
            findings.push({
              id: randomUUID(),
              detector: "misconfig",
              rule: "D5-002",
              domain: "D5",
              severity: "high",
              title: "Wildcard CORS configuration",
              description:
                "Access-Control-Allow-Origin is set to * which allows any origin.",
              why: "Wildcard CORS lets any web page in a browser call your API. Combined with any missing CSRF check, it's game over. Every CORS tutorial uses *; the AI copied that.",
              file: file.relativePath,
              line: i + 1,
              snippet: line.trim().slice(0, 100),
              fix: "Restrict CORS to specific trusted origins instead of *.",
              confidence: "certain",
              category: "Security Misconfiguration",
            });
          }
        }

        if (/\beval\s*\(/i.test(line)) {
          findings.push({
            id: randomUUID(),
            detector: "misconfig",
            rule: "D5-003",
            domain: "D5",
            severity: "high",
            title: "Use of eval()",
            description: "eval() executes arbitrary code and is a security risk.",
            why: "eval() turns any user-controlled string into executable code. If any input reaches it, remote code execution is one line away.",
            file: file.relativePath,
            line: i + 1,
            snippet: line.trim().slice(0, 100),
            fix: "Remove eval() and use safer alternatives.",
            confidence: "certain",
            category: "Security Misconfiguration",
          });
        }

        if (/Math\.random\s*\(\)/.test(line)) {
          const classified = classifyMathRandom(lines, i);
          if (!classified) continue;
          findings.push({
            id: randomUUID(),
            detector: "misconfig",
            rule: "D4-003",
            domain: "D4",
            severity: classified.severity,
            title: "Math.random() used for security-sensitive value",
            description: classified.description,
            why: "Math.random() is a predictable pseudo-random generator seeded from clock/context. An attacker who sees a few outputs can predict the next one — fine for animation, catastrophic for tokens or OTPs.",
            file: file.relativePath,
            line: i + 1,
            snippet: line.trim().slice(0, 100),
            fix: "Use crypto.randomBytes() or crypto.getRandomValues() instead.",
            confidence: classified.confidence,
            category: "Cryptography",
          });
        }

        if (/console\.log\s*\(/i.test(line) && SENSITIVE_LOG_CONTEXT.test(line)) {
          findings.push({
            id: randomUUID(),
            detector: "misconfig",
            rule: "D8-001",
            domain: "D8",
            severity: "medium",
            title: "Sensitive data logged to console",
            description: "Logging sensitive fields can expose secrets in log files.",
            why: "Log aggregators (Datadog, Vercel, Sentry, Papertrail) ingest console output. A password or token logged once ends up in log storage for the retention window — often 30-90 days.",
            file: file.relativePath,
            line: i + 1,
            snippet: line.trim().slice(0, 100),
            fix: "Remove logging of sensitive fields or redact them.",
            confidence: "high",
            category: "Data Exposure",
          });
        }
      }
    }

    // Check for missing security headers in Next.js config
    const nextConfigFiles = files.filter((f) =>
      /next\.config\.(js|ts|mjs)$/.test(f.relativePath),
    );
    for (const configFile of nextConfigFiles) {
      const content = await readFile(configFile.path, "utf8").catch(() => "");
      const missingHeaders = SECURITY_HEADERS.filter(
        (h) => !content.includes(h),
      );
      if (missingHeaders.length > 0) {
        findings.push({
          id: randomUUID(),
          detector: "misconfig",
          rule: "D5-004",
          domain: "D5",
          severity: "medium",
          title: "Missing security headers in Next.js config",
          description: `Headers not configured: ${missingHeaders.join(", ")}`,
          why: "Modern browsers only enforce security policy when the response says so. Without CSP + HSTS + X-Frame-Options, XSS and clickjacking work by default.",
          file: configFile.relativePath,
          fix: "Run `verglos fix` to add security headers, or configure them in next.config.",
          confidence: "high",
          category: "Security Misconfiguration",
        });
      }
    }

    return findings;
  },
};
