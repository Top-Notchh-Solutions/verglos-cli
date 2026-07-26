import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import { getProjectContext } from "../project-context.js";
import { isMetadataKeyLine } from "../context.js";
import type { Detector } from "./types.js";

/**
 * AI-* rules for deterministic failure modes common in generated code.
 */

/**
 * AI-002 — Math.random() / Date.now() reaching a token, OTP, session ID,
 * password-reset, or nonce sink. Certain confidence, critical severity.
 */
const AI_002_SOURCE = /\b(Math\.random\s*\(\s*\)|Date\.now\s*\(\s*\))/;

/**
 * Variable / property names that indicate a security-sensitive sink.
 * Matched against the LHS of an assignment or the key in an object literal
 * on the same line as the source, OR within the previous 3 lines when the
 * variable is declared first and the source is used in its initializer.
 */
const AI_002_SINK_NAMES = [
  "token",
  "accessToken",
  "refreshToken",
  "sessionToken",
  "authToken",
  "csrfToken",
  "otp",
  "otpCode",
  "verificationCode",
  "verifyCode",
  "resetToken",
  "passwordResetToken",
  "pin",
  "nonce",
  "sessionId",
  "session_id",
  "secret",
  "apiKey",
  "api_key",
];

/**
 * Same-line "we just returned this thing as a token" pattern —
 * catches `res.json({ token: Math.random()... })`, the very common
 * inline-init case `const otp = Math.floor(Math.random() * 900000)`,
 * and object-literal keys `{ sessionToken: Math.random() }`.
 */
const AI_002_INLINE_SINK = new RegExp(
  String.raw`\b(` + AI_002_SINK_NAMES.join("|") + String.raw`)\s*[:=]`,
  "i",
);

/**
 * AI-001 — Wildcard CORS on an app that has authentication.
 *
 * `Access-Control-Allow-Origin: *` is the default in every CORS
 * tutorial because it's the shortest snippet that makes an example
 * "work." On an app with logged-in users it's catastrophic —
 * combined with any cookie or Authorization header handling, it
 * lets any web page in a browser call your API as the victim.
 * Certain severity: critical when auth is present.
 */
const AI_001_WILDCARD_CORS =
  /(?:Access-Control-Allow-Origin['":\s]*\*|\borigin\s*:\s*['"]?\*['"]?|\bcors\s*\(\s*\{\s*origin\s*:\s*['"]?\*['"]?)/i;

/**
 * AI-003 — Route reads an ID from the request, then queries the DB
 * by that ID, with no ownership check anywhere in the handler body.
 * The IDOR that AI writes because tutorials skip the "AND userId =
 * req.user.id" part. High confidence, high severity.
 *
 * Heuristic — a full taint analysis is out of scope. The three checks
 * inside AI_003_HANDLER_WINDOW are:
 *   1. Line contains an ID accessor (req.params.id / req.query.id /
 *      params.id / etc.)
 *   2. Within the next ~40 lines OR to the next handler-boundary,
 *      there's a DB query pattern that filters by id
 *   3. Within that same window there is NO ownership predicate
 *      (req.user, session.user, auth().userId, etc.)
 */
const AI_003_ID_SOURCE =
  /\b(?:req\.params\.id|req\.query\.id|req\.body\.id|params\s*\.\s*id|params\s*\?\.\s*id|context\.params\.id)\b/;

const AI_003_QUERY_BY_ID =
  /\.(?:find(?:One|First|Unique|ById|ByPk)?|get|query|update|delete|remove|deleteOne|findByIdAndDelete|findByIdAndUpdate)\s*\(\s*[^)]*\bid\b|\bwhere\s*:\s*\{\s*id\b/;

const AI_003_OWNERSHIP =
  /\b(?:req\.user|req\.auth|session\.user|session\.userId|context\.user|auth\s*\(\s*\)\.userId|currentUser|getCurrentUser|getUser|ownerId|userId\s*[:=]|user_id\s*[:=]|req\.session\.user)\b/;

const AI_003_HANDLER_WINDOW = 40;

/**
 * AI-004 — Mass assignment via spread. `Model.create({ ...req.body })`,
 * `new Model({ ...req.body })`, `Object.assign(user, req.body)` and
 * friends. Spec §4: concise, idiomatic, in every quickstart, ends
 * with a user setting `isAdmin: true` on themselves.
 */
const AI_004_SPREAD =
  /(?:\.\s*(?:create|update|updateOne|updateMany|upsert|save|patch|put)\s*\(\s*\{\s*\.\.\.\s*(?:req\.body|req\.body\.\w+|body|payload|data)\b|new\s+[A-Z]\w*\s*\(\s*\{\s*\.\.\.\s*(?:req\.body|body|payload)\b|Object\.assign\s*\(\s*[^,]+,\s*(?:req\.body|body|payload)\s*\))/;

/**
 * AI-007 — Test-shaped or example-shaped keys committed as real
 * values. Stripe test keys (`sk_test_…`, `pk_test_…`, `rk_test_…`,
 * `whsec_test_…`), plus example-shaped prefixes that look like
 * they got copy-pasted from a docs page ("your_key_here" style
 * long strings that are still base62-encoded). Medium confidence
 *.
 *
 * Not a placeholder — that goes through the SECRET_PATTERNS
 * classifier in secrets.ts and gets demoted to info. AI-007 fires
 * on values that LOOK like real committed test keys but the AI
 * pulled them from an example verbatim.
 */
const AI_007_TEST_KEY =
  /\b(sk|pk|rk)_test_[A-Za-z0-9]{20,}/;
const AI_007_EXAMPLE_HINT =
  /example|sample|test|placeholder|dummy|fake|your_key_here|replace_me|xxxx/i;

/**
 * AI-008 — `catch` handler sending `err.stack` / `err.message` to
 * the HTTP response. Verbose error handlers are what makes a demo
 * feel debuggable, and models optimize for the demo working.
 * High confidence, high severity.
 */
const AI_008_STACK_LEAK =
  /\bres\s*\.\s*(?:send|json|end|write|status\s*\(\s*\d+\s*\)\s*\.\s*(?:send|json|end))\s*\(\s*[^)]*\b(?:err|error|e)\s*\.\s*(?:stack|message)\b/;

/**
 * AI-009 — Permissive generated config defaults. Model defaults
 * pick "the setting that doesn't throw an error" over "the setting
 * that's safe." Spec §4, medium confidence.
 *
 * Each entry: regex + short name for the finding title. Kept as a
 * table so adding a rule is one line, and so the title can name
 * the specific bad setting for the fix message.
 */
/**
 * AI-010 — Auth-without-authz. The handler that accepts an
 * authenticated user, mutates something, but never checks whether
 * this user should be allowed to mutate this thing. Spec §4,
 * medium confidence.
 *
 * Heuristic: on a line that performs a DB mutation, check the
 * surrounding handler window for BOTH the presence of `req.user`
 * (auth is being consumed) AND the absence of any role /
 * permission / access check. A file that uses auth but never
 * checks a role has almost certainly leaked authz on at least
 * one endpoint.
 */
const AI_010_MUTATION =
  /\.(?:delete(?:One|Many)?|destroy|remove|removeMany|drop|deleteMany|updateMany)\s*\(/;
const AI_010_AUTH_USED = /\b(?:req\.user|session\.user|context\.user|req\.auth|auth\s*\(\s*\)\.userId|currentUser|getCurrentUser)\b/;
const AI_010_AUTHZ_CHECK =
  /\b(?:role|roles|permission|permissions|hasPermission|hasAccess|can\s*\(|ability|isAdmin|isOwner|checkAccess|authorize|policy|abac|rbac|hasRole|adminOnly|requireRole)\b/i;
const AI_010_WINDOW = 30;

const AI_009_PERMISSIVE: { rx: RegExp; label: string }[] = [
  { rx: /\bcsrf\w*\s*:\s*false\b/i, label: "csrf: false" },
  { rx: /\brejectUnauthorized\s*:\s*false\b/, label: "rejectUnauthorized: false" },
  { rx: /\bhttpOnly\s*:\s*false\b/i, label: "httpOnly: false" },
  { rx: /\bsecure\s*:\s*false\b/i, label: "secure: false (cookie)" },
  { rx: /\bsameSite\s*:\s*['"]?none['"]?/i, label: "sameSite: 'none'" },
  { rx: /\bstrictSSL\s*:\s*false\b/i, label: "strictSSL: false" },
  { rx: /\bhelmet\s*\(\s*\{\s*contentSecurityPolicy\s*:\s*false/i, label: "helmet CSP disabled" },
  { rx: /\bhelmet\.contentSecurityPolicy\s*=\s*false/i, label: "helmet CSP disabled" },
  { rx: /\btls\s*:\s*\{\s*[^}]*rejectUnauthorized\s*:\s*false/i, label: "TLS verify disabled" },
];

/** File extensions this detector inspects. */
const SUPPORTED_EXT = /\.(?:m?[jt]sx?|mts|cts)$/;

/**
 * True when the same line contains a security-sensitive sink name
 * alongside the insecure random source. Cross-line taint (helper
 * function returns Math.random(), caller assigns to a token var) is
 * intentionally left to a future taint-analysis pass — a false
 * negative there is a much better failure mode than a false
 * positive where an unrelated `const secret` several lines above a
 * random tracking id gets flagged as an OTP leak.
 */
/**
 * Date.now() used AS a time source — default param, comparison, or
 * assigned to a clock/deadline/timestamp variable — is not producing
 * a secret. Skip these to keep AI-002 precise.
 *
 * Concrete ICP-300 false positives fixed by this:
 *   verifyTotpCode(secret, code, now = Date.now())
 *     `now` param default is time-of-check, not the secret.
 *   const token: DeadlineToken = { expiresAt: Date.now() + timeoutMs }
 *     `expiresAt` is a deadline timestamp, not an auth token.
 */
const TIME_PARAM_NAMES =
  /\b(now|time|when|ts|timestamp|deadline|clock|since|until|expires?(?:At)?|createdAt|updatedAt)\s*=/i;

function isTimeSourceContext(line: string): boolean {
  // Default parameter shape: `foo = Date.now()`
  if (TIME_PARAM_NAMES.test(line) && /Date\.now\s*\(\s*\)/.test(line)) return true;
  // Deadline shape: `expiresAt: Date.now() + N` — the value is a moment,
  // not a secret, even if the surrounding variable name matches a sink.
  if (/(?:expires?At|deadline|timeout|ttl|maxAge|validUntil)\s*[:=]\s*Date\.now\s*\(\s*\)/i.test(line)) return true;
  // Comparison shape: `Date.now() < token.expiry` — Date.now() being
  // compared to something else is checking time, not producing a secret.
  if (/Date\.now\s*\(\s*\)\s*[<>]=?/.test(line)) return true;
  if (/[<>]=?\s*Date\.now\s*\(\s*\)/.test(line)) return true;
  return false;
}

/**
 * `nonce` is the tricky sink — cryptographic nonces are critical,
 * but React/redux/mobx state also uses `nonce` as a cache-buster or
 * change-token. Downgrade only when the surrounding same-line context
 * clearly indicates UI/render/state semantics.
 *
 * Kept STRICT to preserve real crypto nonces at critical.
 * Concrete ICP-300 false positives fixed:
 *   TesslateAI OpenSail: setMarketplaceFocus({ nonce: Date.now(), ... })
 *   Bottelet DaybydayCRM: var nonce = { guid: Date.now() } — jQuery internal
 */
const UI_STATE_NONCE_CONTEXT =
  /\b(setState|dispatch|useState|useReducer|createSlice|reducer|action|redux|zustand|mobx|render|animation|focus|reveal|request|refresh|invalidate|cacheBust|cache-bust|guid|payload)\b/i;

function isUiStateNonce(line: string, sinkName: string): boolean {
  if (sinkName !== "nonce") return false;
  return UI_STATE_NONCE_CONTEXT.test(line);
}

function classifyAi002(
  lines: string[],
  index: number,
): { sinkName: string } | undefined {
  const line = lines[index] ?? "";
  if (isTimeSourceContext(line)) return undefined;
  const match = line.match(AI_002_INLINE_SINK);
  if (!match) return undefined;
  const sinkName = match[1]!.toLowerCase();
  if (isUiStateNonce(line, sinkName)) return undefined;
  return { sinkName };
}

export const aiPatternsDetector: Detector = {
  id: "ai-patterns",
  async run(
    files: ScannedFile[],
    projectRoot: string,
  ): Promise<Finding[]> {
    const findings: Finding[] = [];
    const seen = new Set<string>();
    const projectContext = await getProjectContext(projectRoot);

    for (const file of files) {
      if (!SUPPORTED_EXT.test(file.relativePath)) continue;

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

        // AI-002 · Math.random / Date.now feeding a token sink
        if (AI_002_SOURCE.test(line)) {
          const classified = classifyAi002(lines, i);
          if (classified) {
            const key = `${file.relativePath}:${i}:AI-002:${classified.sinkName}`;
            if (!seen.has(key)) {
              seen.add(key);
              const source =
                line.match(AI_002_SOURCE)?.[1] ?? "Math.random()";
              findings.push({
                id: randomUUID(),
                detector: "ai-patterns",
                rule: "AI-002",
                domain: "D4",
                severity: "critical",
                title: `${source} feeding a ${classified.sinkName} — predictable secret`,
                description: `A non-cryptographic random source (${source}) is being used to produce ${classified.sinkName}. Predictable across processes and observable within minutes to a determined attacker.`,
                why: "Math.random() and Date.now() are deterministic pseudo-random generators. An attacker who observes a few outputs — or knows roughly when a value was generated — can predict the next one. That is the difference between a secret and a value the attacker already knows. Every OTP/token/session tutorial uses one of these because they 'just work' at demo time.",
                file: file.relativePath,
                line: i + 1,
                snippet: line.trim().slice(0, 120),
                fix:
                  "Use crypto.randomBytes() / crypto.randomInt() (Node) or crypto.getRandomValues() (browser). For OTPs: crypto.randomInt(100000, 1000000). For tokens: crypto.randomBytes(32).toString('base64url').",
                refs: ["CWE-338", "CWE-330"],
                confidence: "certain",
                category: "Cryptography",
              });
            }
          }
        }

        // AI-010 · Auth-without-authz on mutation
        if (AI_010_MUTATION.test(line)) {
          const start = Math.max(0, i - Math.floor(AI_010_WINDOW / 2));
          const window = lines
            .slice(start, i + AI_010_WINDOW)
            .join("\n");
          if (
            AI_010_AUTH_USED.test(window) &&
            !AI_010_AUTHZ_CHECK.test(window)
          ) {
            const key = `${file.relativePath}:${i}:AI-010`;
            if (!seen.has(key)) {
              seen.add(key);
              findings.push({
                id: randomUUID(),
                detector: "ai-patterns",
                rule: "AI-010",
                domain: "D3",
                severity: "medium",
                title: "Mutation on an authenticated route with no authorization check",
                description:
                  "A destructive operation runs inside a handler that uses the authenticated user, but nothing in the surrounding handler checks a role, permission, ownership, or policy.",
                why: "Models implement 'who are you' well (that's in every tutorial) and skip 'may you' (that's app-specific). The result is an endpoint that only requires being logged in to delete another user's data. This is the specific pattern calls 'the domain AI code fails hardest.'",
                file: file.relativePath,
                line: i + 1,
                snippet: line.trim().slice(0, 120),
                fix: "Before the mutation, verify the caller has the right to perform it: check a role (`if (req.user.role !== 'admin')`), an ownership predicate (`{ userId: req.user.id }` in the where clause), or a policy helper (`ability.cannot('delete', record)`).",
                refs: ["CWE-285", "CWE-862", "OWASP: A01 Broken Access Control"],
                confidence: "medium",
                category: "Authorization",
              });
            }
          }
        }

        // AI-009 · Permissive generated config defaults
        for (const { rx, label } of AI_009_PERMISSIVE) {
          if (rx.test(line)) {
            const key = `${file.relativePath}:${i}:AI-009:${label}`;
            if (!seen.has(key)) {
              seen.add(key);
              findings.push({
                id: randomUUID(),
                detector: "ai-patterns",
                rule: "AI-009",
                domain: "D5",
                severity: "medium",
                title: `Permissive default: ${label}`,
                description: `A security-relevant configuration flag is set to a permissive value (${label}).`,
                why: "Model defaults pick 'the setting that doesn't throw an error' over 'the setting that's safe.' Every one of these disables a check that a browser or the runtime would otherwise enforce.",
                file: file.relativePath,
                line: i + 1,
                snippet: line.trim().slice(0, 120),
                fix: "Flip the flag to the secure default. If you specifically need the permissive value for local development, gate it on NODE_ENV !== 'production'.",
                refs: ["CWE-732"],
                confidence: "medium",
                category: "Security Misconfiguration",
              });
            }
            break; // one AI-009 finding per line is plenty
          }
        }

        // AI-008 · err.stack / err.message leaked in response
        if (AI_008_STACK_LEAK.test(line)) {
          const key = `${file.relativePath}:${i}:AI-008`;
          if (!seen.has(key)) {
            seen.add(key);
            findings.push({
              id: randomUUID(),
              detector: "ai-patterns",
              rule: "AI-008",
              domain: "D8",
              severity: "high",
              title: "Stack trace / error message leaked in HTTP response",
              description:
                "An error's stack or message is being sent back to the client. Stack traces disclose file paths, package versions, and internal function names; error messages often include ids and database internals.",
              why: "res.send(err.stack) is the debuggable version of a catch handler. It's how you make a demo feel responsive. In production it hands attackers your directory layout, dependency versions, database schema, and — often — the actual query that failed. Every internal-scan-turns-into-a-CVE story includes one of these lines.",
              file: file.relativePath,
              line: i + 1,
              snippet: line.trim().slice(0, 120),
              fix: "Log the error server-side (pino/winston/sentry). Return a generic message: `res.status(500).json({ error: 'Internal server error' })`.",
              refs: ["CWE-209", "CWE-497"],
              confidence: "high",
              category: "Data Exposure",
            });
          }
        }

        // AI-007 · Test-shaped key committed as a real value
        {
          const match = line.match(AI_007_TEST_KEY);
          if (match && !AI_007_EXAMPLE_HINT.test(line)) {
            const key = `${file.relativePath}:${i}:AI-007`;
            if (!seen.has(key)) {
              seen.add(key);
              findings.push({
                id: randomUUID(),
                detector: "ai-patterns",
                rule: "AI-007",
                domain: "D4",
                severity: "high",
                title: `Test-mode key committed as a real value: ${match[0].slice(0, 8)}…`,
                description:
                  "A Stripe / example test-mode key appears to be committed as a real value in source, not as an obvious placeholder.",
                why: "Test-mode keys aren't harmless — they let anyone with the key see test customers, charge test cards, exfiltrate merchant IDs, and pivot to production account reconnaissance. And the value the AI copy-pasted from the docs became a real key that got committed. Rotate anyway.",
                file: file.relativePath,
                line: i + 1,
                snippet: line
                  .trim()
                  .slice(0, 120)
                  .replace(
                    AI_007_TEST_KEY,
                    (m) => m.slice(0, 8) + "****" + m.slice(-4),
                  ),
                fix: "Move to a .env file, rotate the key in the Stripe dashboard, and add `.env*` to .gitignore.",
                confidence: "medium",
                category: "Cryptography",
              });
            }
          }
        }

        // AI-004 · Mass assignment via spread
        if (AI_004_SPREAD.test(line)) {
          const key = `${file.relativePath}:${i}:AI-004`;
          if (!seen.has(key)) {
            seen.add(key);
            findings.push({
              id: randomUUID(),
              detector: "ai-patterns",
              rule: "AI-004",
              domain: "D3",
              severity: "high",
              title: "Mass assignment — spreading request body into a model",
              description:
                "Spreading req.body / body / payload directly into a model constructor or update call lets a user set fields you never intended to expose.",
              why: "Concise, idiomatic, in every quickstart. Then a user posts `{ isAdmin: true }` (or `stripe_customer_id`, or `email_verified`) and it lands in your database. Models trained on tutorials write this pattern by default because tutorials never enumerate a fields allowlist.",
              file: file.relativePath,
              line: i + 1,
              snippet: line.trim().slice(0, 120),
              fix: "Explicitly pick allowed fields: `{ name: body.name, email: body.email }`. Or use a validation library (zod, valibot) to parse into a typed subset before persisting.",
              refs: ["CWE-915", "OWASP: A08 Software and Data Integrity Failures"],
              confidence: "high",
              category: "Authorization",
            });
          }
        }

        // AI-003 · Missing ownership predicate on ID routes
        if (AI_003_ID_SOURCE.test(line)) {
          const window = lines
            .slice(i, i + AI_003_HANDLER_WINDOW)
            .join("\n");
          if (
            AI_003_QUERY_BY_ID.test(window) &&
            !AI_003_OWNERSHIP.test(window)
          ) {
            const key = `${file.relativePath}:${i}:AI-003`;
            if (!seen.has(key)) {
              seen.add(key);
              findings.push({
                id: randomUUID(),
                detector: "ai-patterns",
                rule: "AI-003",
                domain: "D3",
                severity: "high",
                title: "IDOR — record looked up by user-supplied id without ownership check",
                description:
                  "A route reads an id from the request and queries the database by that id, with no ownership predicate in the handler body. Any authenticated user can pass another user's id.",
                why: "Models can infer 'who are you' (auth is well-documented in tutorials) but not 'may you' (authorization depends on the app's data model). The result is the classic IDOR: /api/invoice/1234 → /api/invoice/1235 returns someone else's record. Every one of these is the same shape.",
                file: file.relativePath,
                line: i + 1,
                snippet: line.trim().slice(0, 120),
                fix: "Add an ownership predicate to the query: `where: { id, userId: req.user.id }`. Never trust that authentication alone implies authorization.",
                refs: ["CWE-639", "CWE-284", "OWASP: A01 Broken Access Control"],
                confidence: "high",
                category: "Authorization",
              });
            }
          }
        }

        // AI-001 · Wildcard CORS on an app with auth
        if (
          projectContext.hasAuth &&
          AI_001_WILDCARD_CORS.test(line)
        ) {
          const key = `${file.relativePath}:${i}:AI-001`;
          if (!seen.has(key)) {
            seen.add(key);
            const authList = projectContext.authSources
              .slice(0, 3)
              .join(", ");
            findings.push({
              id: randomUUID(),
              detector: "ai-patterns",
              rule: "AI-001",
              domain: "D5",
              severity: "critical",
              title: "Wildcard CORS on an app with authentication",
              description:
                "Access-Control-Allow-Origin: * lets any web page in a browser call this API. On an app with logged-in users this is catastrophic — combined with cookie or Authorization-header handling it enables full session hijack from any origin.",
              why: `This app has authentication (${authList || "detected via package.json / middleware"}). Wildcard CORS on an authenticated app means every credentialed request the browser sends can be triggered by an attacker's page. Every CORS tutorial writes '*' because that's the shortest snippet that makes an example work; the AI copied that.`,
              file: file.relativePath,
              line: i + 1,
              snippet: line.trim().slice(0, 120),
              fix: "Restrict origin to an explicit allowlist of trusted domains. Never combine `Access-Control-Allow-Origin: *` with credentials.",
              refs: ["CWE-942", "CWE-346"],
              confidence: "high",
              category: "Security Misconfiguration",
            });
          }
        }
      }
    }

    return findings;
  },
};
