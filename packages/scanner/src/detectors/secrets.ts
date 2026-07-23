import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import type { Detector } from "./types.js";
import {
  detectLiveKeyKind,
  verifyGitHubKey,
  verifyStripeKey,
  type LiveKeyResult,
} from "../live-key-verify.js";

interface SecretPattern {
  name: string;
  pattern: RegExp;
  severity: Finding["severity"];
  requiresContext?: RegExp;
}

const SECRET_PATTERNS: SecretPattern[] = [
  { name: "AWS Access Key", pattern: /AKIA[0-9A-Z]{16}/g, severity: "critical" },
  {
    name: "AWS Secret Key",
    pattern: /(?:aws_secret_access_key|AWS_SECRET_ACCESS_KEY)\s*[=:]\s*['"]?[A-Za-z0-9/+=]{40}/gi,
    severity: "critical",
  },
  {
    name: "Stripe Secret Key",
    pattern: /sk_(?:live|test)_[0-9a-zA-Z]{24,}/g,
    severity: "critical",
  },
  {
    name: "GitHub Token",
    pattern: /ghp_[0-9a-zA-Z]{36,}/g,
    severity: "critical",
  },
  {
    name: "GitHub OAuth",
    pattern: /gho_[0-9a-zA-Z]{36,}/g,
    severity: "critical",
  },
  {
    name: "Slack Token",
    pattern: /xox[baprs]-[0-9a-zA-Z-]{10,}/g,
    severity: "critical",
  },
  {
    name: "OpenAI API Key",
    pattern: /sk-[a-zA-Z0-9]{20,}T3BlbkFJ[a-zA-Z0-9]{20,}/g,
    severity: "critical",
  },
  {
    name: "Anthropic API Key",
    pattern: /sk-ant-api[0-9a-zA-Z_-]{20,}/g,
    severity: "critical",
  },
  {
    name: "Google API Key",
    pattern: /AIza[0-9A-Za-z_-]{35}/g,
    severity: "critical",
  },
  {
    name: "Private Key PEM",
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
    severity: "critical",
  },
  {
    name: "JWT Secret",
    pattern: /(?:jwt[_-]?secret|JWT_SECRET)\s*[=:]\s*['"][^'"]{8,}['"]/gi,
    severity: "critical",
  },
  {
    name: "Database URL",
    pattern: /(?:postgres|mysql|mongodb)(?:\+srv)?:\/\/[^\s'"]+:[^\s'"]+@/gi,
    severity: "critical",
  },
  {
    name: "Generic API Key",
    pattern: /(?:api[_-]?key|apikey|secret[_-]?key)\s*[=:]\s*['"][a-zA-Z0-9_\-]{16,}['"]/gi,
    severity: "high",
  },
  {
    name: "Bearer Token",
    pattern: /Bearer\s+[a-zA-Z0-9_\-.]{20,}/g,
    severity: "high",
  },
  {
    name: "SendGrid API Key",
    pattern: /SG\.[0-9A-Za-z_-]{22}\.[0-9A-Za-z_-]{43}/g,
    severity: "critical",
  },
  {
    name: "Twilio API Key",
    pattern: /SK[0-9a-fA-F]{32}/g,
    severity: "critical",
  },
  {
    name: "Heroku API Key",
    pattern: /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g,
    severity: "medium",
    requiresContext: /\bheroku\b/i,
  },
  {
    name: "NPM Token",
    pattern: /npm_[0-9a-zA-Z]{36}/g,
    severity: "critical",
  },
  {
    name: "Discord Token",
    pattern: /[MN][A-Za-z\d]{23,}\.[\w-]{6}\.[\w-]{27,}/g,
    severity: "critical",
  },
];

function shannonEntropy(str: string): number {
  const len = str.length;
  if (len === 0) return 0;
  const freq = new Map<string, number>();
  for (const char of str) {
    freq.set(char, (freq.get(char) ?? 0) + 1);
  }
  let entropy = 0;
  for (const count of freq.values()) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

const PUBLIC_STRING_PREFIXES = [
  "sha512-",
  "sha384-",
  "sha256-",
  "sha1-",
  "pk_test_",
  "pk_live_",
  "whsec_",
];

const CREDENTIAL_HINT =
  /\b(?:api[_-]?key|apikey|secret|token|password|passwd|pwd|bearer|authorization|credential|private[_-]?key|access[_-]?key)\b/i;

const PLACEHOLDER_VALUE =
  /example|sample|test|placeholder|dummy|fake|your_key_here|replace_me|insert_here|xxx|yyy|123456|changeme|secret_here|api_key_here|put_your|my_secret|demo|mock|stub|fixture|default|todo/i;

const PLACEHOLDER_NAME =
  /example|sample|test|mock|dummy|placeholder|fake/i;

function isLikelySecret(value: string): boolean {
  if (value.length < 20) return false;
  if (/^(true|false|null|undefined|password|secret|changeme)$/i.test(value))
    return false;
  for (const prefix of PUBLIC_STRING_PREFIXES) {
    if (value.startsWith(prefix)) return false;
  }
  const entropy = shannonEntropy(value);
  return entropy > 4.0;
}

const ENTROPY_PATTERN =
  /(?:['"])([A-Za-z0-9+/=_\-]{32,})(?:['"])/g;

const ENTROPY_SKIP_FILES = [
  /(?:^|\/)package-lock\.json$/,
  /(?:^|\/)pnpm-lock\.yaml$/,
  /(?:^|\/)yarn\.lock$/,
  /(?:^|\/)bun\.lockb?$/,
  /(?:^|\/)Cargo\.lock$/,
  /(?:^|\/)poetry\.lock$/,
  /(?:^|\/)Gemfile\.lock$/,
  /(?:^|\/)composer\.lock$/,
  /\.(?:test|spec)\.[cm]?[jt]sx?$/,
  /(?:^|\/)(?:tests?|__tests__|__fixtures__)\//,
];

function shouldSkipEntropyScan(relativePath: string): boolean {
  return ENTROPY_SKIP_FILES.some((rx) => rx.test(relativePath));
}

function redactSnippet(snippet: string): string {
  return snippet.slice(0, 80).replace(/[A-Za-z0-9+/=_\-]{8,}/g, (m) =>
    m.slice(0, 4) + "****" + m.slice(-4),
  );
}

function extractVariableName(line: string): string | undefined {
  const match = line.match(
    /\b(?:const|let|var|export\s+const|readonly)?\s*([A-Za-z_$][\w$-]*)\s*(?::[^=]+)?[=:]/,
  );
  return match?.[1];
}

function extractSecretValue(line: string, matched: string, name: string): string {
  if (name === "Bearer Token") {
    return matched.replace(/^Bearer\s+/i, "");
  }

  const quoted = matched.match(/['"]([^'"]+)['"]\s*$/);
  if (quoted?.[1]) return quoted[1];

  const assignment = line.match(/[=:]\s*['"]?([^'"\s,;]+)/);
  if (assignment?.[1]) return assignment[1];

  return matched;
}

function normalizeIdentifier(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function similarity(a: string, b: string): number {
  const left = normalizeIdentifier(a);
  const right = normalizeIdentifier(b);
  if (!left || !right) return 0;
  if (left.includes(right) || right.includes(left)) return 1;

  const previous = Array.from({ length: right.length + 1 }, (_, i) => i);
  for (let i = 1; i <= left.length; i++) {
    let last = i - 1;
    previous[0] = i;
    for (let j = 1; j <= right.length; j++) {
      const old = previous[j] ?? 0;
      previous[j] = Math.min(
        (previous[j] ?? 0) + 1,
        (previous[j - 1] ?? 0) + 1,
        last + (left[i - 1] === right[j - 1] ? 0 : 1),
      );
      last = old;
    }
  }

  const distance = previous[right.length] ?? Math.max(left.length, right.length);
  return 1 - distance / Math.max(left.length, right.length);
}

function classifiedSecretFinding(input: {
  name: string;
  severity: Finding["severity"];
  line: string;
  matched: string;
}): Pick<Finding, "severity" | "title" | "description" | "context"> {
  const variableName = extractVariableName(input.line);
  const value = extractSecretValue(input.line, input.matched, input.name);
  const nameIsPlaceholder = variableName ? PLACEHOLDER_NAME.test(variableName) : false;
  const valueIsPlaceholder = PLACEHOLDER_VALUE.test(value);
  const enumLike =
    !!variableName &&
    (normalizeIdentifier(value) === normalizeIdentifier(variableName) ||
      similarity(value, variableName) > 0.8);
  const bearerIsFixture =
    input.name === "Bearer Token" &&
    /test|example|sample|mock|fake|complex\.payload\.token|oaut_123|clie_oken|pass_oken/i.test(value);
  const assertionLine =
    input.name === "Bearer Token" &&
    /\b(?:toBe|toEqual|assertEqual|expect)\s*\(/.test(input.line);

  if (valueIsPlaceholder || nameIsPlaceholder || bearerIsFixture || assertionLine) {
    return {
      severity: "info",
      title: `[Placeholder] Exposed secret: ${input.name}`,
      description:
        "The matched value or key name looks like a placeholder, sample, fixture, mock, or expected assertion value. Verify it is not a real credential.",
      context: "placeholder",
    };
  }

  if (enumLike) {
    return {
      severity: "info",
      title:
        "[Enum/Constant] Not a real secret — this appears to be a constant name, not a credential value.",
      description:
        "The detected value mirrors the variable or enum key name, which usually means this is a constant label rather than a credential.",
      context: "enum",
    };
  }

  return {
    severity: input.severity,
    title: `Exposed secret: ${input.name}`,
    description: `A ${input.name} was found in source code. Rotate immediately and move to environment variables.`,
    context: "production",
  };
}

/**
 * Ping the provider API for a single-value key type we know how to
 * verify. AWS keys need two halves (access-key + secret-key) that
 * usually live on different lines; auto-verification for AWS is a
 * follow-up. Verified-live keys get upgraded to a distinct rule
 * with `certain` confidence + `critical` severity..
 */
async function verifyLive(value: string): Promise<LiveKeyResult | null> {
  const kind = detectLiveKeyKind(value);
  if (!kind) return null;
  if (kind === "github") return verifyGitHubKey(value);
  if (kind === "stripe") return verifyStripeKey(value);
  // aws — auto-verify skipped until we can pair the AKIA... line
  // with its secret-key counterpart in the same file.
  return null;
}

export const secretsDetector: Detector = {
  id: "secrets",
  async run(
    files: ScannedFile[],
    _projectRoot: string,
    context,
  ): Promise<Finding[]> {
    const findings: Finding[] = [];
    const seen = new Set<string>();
    const verifySecrets = context?.verifySecrets === true;

    for (const file of files) {
      if (file.relativePath.includes("node_modules")) continue;
      if (file.relativePath.endsWith(".lock")) continue;

      let content: string;
      try {
        content = await readFile(file.path, "utf8");
      } catch {
        continue;
      }

      const lines = content.split("\n");
      const entropyScanEnabled = !shouldSkipEntropyScan(file.relativePath);

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx] ?? "";

        for (const { name, pattern, severity, requiresContext } of SECRET_PATTERNS) {
          if (requiresContext && !requiresContext.test(line)) continue;
          const regex = new RegExp(pattern.source, pattern.flags);
          const match = regex.exec(line);
          if (match) {
            const key = `${file.relativePath}:${lineIdx}:${name}`;
            if (seen.has(key)) continue;
            seen.add(key);
            const classified = classifiedSecretFinding({
              name,
              severity,
              line,
              matched: match[0],
            });

            // If the caller opted into live-key verification AND
            // the classifier decided this is a production candidate
            // (not a placeholder/enum), actually try the credential
            // against the provider's API before emitting the
            // finding. A verified-live key gets D4-004 with a
            // distinct title so the user can grep for it.
            let ruleId = "D4-001";
            let title = classified.title;
            let description = classified.description;
            let live: LiveKeyResult | null = null;
            if (
              verifySecrets &&
              classified.context === "production"
            ) {
              live = await verifyLive(match[0]);
              if (live && live.live) {
                ruleId = "D4-004";
                title = `[LIVE] ${classified.title} — verified against the provider API`;
                description = `${classified.description}\n\nVerified live: ${live.detail ?? "auth accepted"}. Rotate immediately.`;
              }
            }

            findings.push({
              id: randomUUID(),
              detector: "secrets",
              rule: ruleId,
              domain: "D4",
              severity: classified.severity,
              context: classified.context,
              title,
              description,
              why: "A committed credential lets anyone with repo access (or a leak of build artifacts, logs, CI env, or a stolen laptop) act as your service. Rotation is not optional.",
              file: file.relativePath,
              line: lineIdx + 1,
              snippet: redactSnippet(line.trim()),
              fix: "Move this value to a .env file (and ensure .env is in .gitignore). Rotate the compromised credential.",
              confidence: "certain",
              category: "Cryptography",
            });
          }
        }

        if (!entropyScanEnabled) continue;
        if (!CREDENTIAL_HINT.test(line)) continue;

        const entropyRegex = new RegExp(ENTROPY_PATTERN.source, ENTROPY_PATTERN.flags);
        let match: RegExpExecArray | null;
        while ((match = entropyRegex.exec(line)) !== null) {
          const value = match[1];
          if (!value || !isLikelySecret(value)) continue;
          const key = `${file.relativePath}:${lineIdx}:entropy`;
          if (seen.has(key)) continue;
          seen.add(key);
          const variableName = extractVariableName(line);
          const placeholder =
            PLACEHOLDER_VALUE.test(value) ||
            (variableName ? PLACEHOLDER_NAME.test(variableName) : false);

          findings.push({
            id: randomUUID(),
            detector: "secrets",
            rule: "D4-002",
            domain: "D4",
            severity: placeholder ? "info" : "high",
            context: placeholder ? "placeholder" : "production",
            title: placeholder
              ? "[Placeholder] High-entropy string (possible secret)"
              : "High-entropy string (possible secret)",
            description:
              placeholder
                ? "The high-entropy value appears to be a placeholder or test fixture. Verify it is not a real credential."
                : "A high-entropy string was detected that may be a secret or API key.",
            why: "Long, high-entropy random-looking strings adjacent to credential-shaped identifiers are frequently secrets that dodged the named-pattern list.",
            file: file.relativePath,
            line: lineIdx + 1,
            snippet: redactSnippet(line.trim()),
            fix: "Verify this is not a secret. If it is, move to environment variables and rotate.",
            confidence: "medium",
            category: "Cryptography",
          });
        }
      }
    }

    return findings;
  },
};
