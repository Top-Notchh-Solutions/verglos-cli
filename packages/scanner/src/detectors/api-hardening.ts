import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import { isMetadataKeyLine } from "../context.js";
import type { Detector } from "./types.js";

/**
 * API-hardening detector (D7 — Pro tier `rule_pack_api_hardening`).
 *
 * Adjacent to but not overlapping with the Free tier:
 *   - Free `misconfig.ts` catches wildcard CORS on non-auth apps
 *     (D5-002) and AI-001 (in ai-patterns.ts) catches wildcard CORS
 *     on an app WITH auth. This pack catches the strictly harder
 *     shape: `credentials: true` combined with wildcard/reflect
 *     origin — a spec-violating auth bypass.
 *   - Free `misconfig.ts` (D5-004) checks Next.js security headers
 *     but not helmet() on Express.
 *
 * Rules shipped:
 *
 *   API-001  Auth-shape route with no rate-limit middleware in-file
 *   API-002  Explicit unbounded / oversized body-parser limit
 *   API-004  CORS credentials + wildcard/reflect origin (spec violation)
 *   API-005  Express app that never installs helmet()
 *
 * Numbering leaves API-003 (timeouts) and API-006 (multipart limits)
 * open for follow-up shipments — both are useful but easier to
 * false-positive on first cut.
 */

// ── AUTH ROUTE / RATE-LIMIT PAIR (API-001) ────────────────────────────────

/**
 * Route strings that must have rate limiting. Anything that authenticates
 * a caller, hands out a code, or resets credentials. Case-insensitive
 * substring match on the route path.
 */
const AUTH_ROUTE_PATHS = [
  "/login",
  "/signin",
  "/sign-in",
  "/register",
  "/signup",
  "/sign-up",
  "/reset-password",
  "/forgot-password",
  "/forgot",
  "/verify",
  "/otp",
  "/mfa",
  "/token",
  "/auth/callback",
];

const AUTH_ROUTE_LINE =
  /(?:app|router|api|hono|elysia|fastify)\s*\.(?:post|put|patch|all)\s*\(\s*['"`]([^'"`]+)['"`]/i;

/**
 * Names of rate-limit middlewares we recognise. Matched anywhere in
 * the file (not just on the route line) — an app-level global limiter
 * still counts.
 */
const RATE_LIMIT_PATTERNS = [
  /\brateLimit\s*\(/,
  /\bexpress-rate-limit\b/,
  /\bfastify-rate-limit\b/,
  /\bhono[/\-]rate-limiter\b/,
  /\bratelimit\.(?:limit|check|consume)\s*\(/i,
  /\bslowDown\s*\(/,
  /@upstash\/ratelimit/,
];

function hasRateLimit(content: string): boolean {
  return RATE_LIMIT_PATTERNS.some((rx) => rx.test(content));
}

function isAuthRoutePath(pathValue: string): boolean {
  const p = pathValue.toLowerCase();
  return AUTH_ROUTE_PATHS.some((needle) => p.includes(needle));
}

// ── BODY PARSER LIMITS (API-002) ──────────────────────────────────────────

/**
 * Explicit oversize / infinity — Infinity or a limit > 10mb reads as
 * "the AI followed a StackOverflow answer and never scoped it down."
 */
const BODY_LIMIT_INFINITY =
  /(?:express\.(?:json|urlencoded|raw|text)|bodyParser\.(?:json|urlencoded|raw|text))\s*\(\s*\{[^)]*\blimit\s*:\s*(?:Infinity|['"`]?(?:[0-9]+(?:gb|GB)|(?:[5-9]|[1-9][0-9]+)(?:0)?[0-9]*mb))/;

const FASTIFY_BODY_LIMIT_INFINITY =
  /\bbodyLimit\s*:\s*(?:Infinity|0|(?:[0-9]+_?[0-9]*(?:e[0-9]+|\s*\*\s*1024\s*\*\s*1024\s*\*\s*[1-9]))|(?:1024\s*\*\s*1024\s*\*\s*(?:[5-9]|[1-9][0-9]+)[0-9]*))/;

const NEXT_ROUTE_LARGE_BODY =
  /api\s*:\s*\{[^}]*bodyParser\s*:\s*\{[^}]*sizeLimit\s*:\s*['"`](?:[5-9]|[1-9][0-9]+)(?:0)?[0-9]*mb['"`]/i;

// ── CORS: CREDENTIALS + WILDCARD (API-004) ────────────────────────────────

/**
 * The dangerous combo: origin is wildcard/reflect AND credentials:true.
 * Modern browsers refuse the wildcard+credentials combo per spec, but
 * the reflect-any-origin case (`origin: true`) is real and works — an
 * attacker page can forge authenticated requests.
 */
const CORS_CREDENTIALS_BAD_ORIGIN =
  /cors\s*\(\s*\{[^)}]*origin\s*:\s*(?:['"`]\*['"`]|true)[^)}]*credentials\s*:\s*true/;

const CORS_CREDENTIALS_BAD_ORIGIN_REORDERED =
  /cors\s*\(\s*\{[^)}]*credentials\s*:\s*true[^)}]*origin\s*:\s*(?:['"`]\*['"`]|true)/;

// ── HELMET ON EXPRESS (API-005) ───────────────────────────────────────────

const EXPRESS_IMPORT = /\bfrom\s+['"`]express['"`]|require\s*\(\s*['"`]express['"`]/;
const EXPRESS_APP_INIT = /\b(?:const|let|var)\s+(?:app|server)\s*=\s*express\s*\(/;
const HELMET_PRESENT = /\bhelmet\s*\(/;

// ── DETECTOR ──────────────────────────────────────────────────────────────

export const apiHardeningDetector: Detector = {
  id: "api-hardening",
  async run(files: ScannedFile[]): Promise<Finding[]> {
    const findings: Finding[] = [];

    for (const file of files) {
      if (/\.(md|mdx|markdown|txt|rst)$/i.test(file.relativePath)) continue;
      if (!/\.(m?[jt]sx?|mts|cts)$/i.test(file.relativePath)) continue;

      let content: string;
      try {
        content = await readFile(file.path, "utf8");
      } catch {
        continue;
      }
      const lines = content.split("\n");
      const rateLimited = hasRateLimit(content);
      const declaresExpress =
        EXPRESS_IMPORT.test(content) && EXPRESS_APP_INIT.test(content);
      const usesHelmet = HELMET_PRESENT.test(content);

      // API-005 — Express app without helmet(). One finding per file
      // (whole-file smell, not a line smell).
      if (declaresExpress && !usesHelmet) {
        findings.push({
          id: randomUUID(),
          detector: "api-hardening",
          rule: "API-005",
          domain: "D7",
          severity: "medium",
          title: "Express app initialised without helmet()",
          description:
            "This file constructs an Express app but never applies the helmet() middleware.",
          why: "helmet() sets the baseline security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) that browsers only enforce when the response asks for them. AI-generated Express scaffolds skip this because the tutorial that trained the model skipped it.",
          file: file.relativePath,
          fix: "Install `helmet` and call `app.use(helmet())` before your routes.",
          confidence: "high",
          category: "API Hardening",
        });
      }

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? "";
        if (isMetadataKeyLine(line)) continue;

        // API-001 — auth-shape route + no rate-limit in this file.
        const authRouteMatch = AUTH_ROUTE_LINE.exec(line);
        if (authRouteMatch && isAuthRoutePath(authRouteMatch[1] ?? "") && !rateLimited) {
          findings.push({
            id: randomUUID(),
            detector: "api-hardening",
            rule: "API-001",
            domain: "D7",
            severity: "high",
            title: `Auth-adjacent route with no rate limit: ${authRouteMatch[1]}`,
            description: `The route ${authRouteMatch[1]} accepts state-changing requests but no rate-limit middleware is installed in this file.`,
            why: "Auth-adjacent routes (login, register, reset, verify, MFA) are the primary target for credential stuffing and enumeration attacks. Without a rate limit, a botnet can try thousands of passwords per second against every account.",
            file: file.relativePath,
            line: i + 1,
            snippet: line.trim().slice(0, 120),
            fix: "Apply `express-rate-limit`, `@upstash/ratelimit`, `hono/rate-limiter`, or `fastify-rate-limit` in front of this route with a small, per-IP quota (e.g. 10/min for login).",
            confidence: "high",
            category: "API Hardening",
          });
        }

        // API-002 — explicit unbounded / oversized body limit.
        if (
          BODY_LIMIT_INFINITY.test(line) ||
          FASTIFY_BODY_LIMIT_INFINITY.test(line) ||
          NEXT_ROUTE_LARGE_BODY.test(line)
        ) {
          findings.push({
            id: randomUUID(),
            detector: "api-hardening",
            rule: "API-002",
            domain: "D7",
            severity: "high",
            title: "Explicitly unbounded or oversized request-body limit",
            description:
              "This body-parser / route config declares a size limit that is Infinity, 0 (Fastify treats 0 as unlimited), 50MB+, or otherwise well above the framework default.",
            why: "An unbounded body lets one attacker exhaust the process's memory with a single request. Even without a full OOM crash, a large multipart payload burns CPU on JSON.parse and blocks the event loop, denying service to every other user.",
            file: file.relativePath,
            line: i + 1,
            snippet: line.trim().slice(0, 120),
            fix: "Set an explicit small limit (e.g. `limit: '1mb'`) and validate that legitimate payloads never approach it. For file uploads, use a streaming multipart parser with a per-file size cap.",
            confidence: "high",
            category: "API Hardening",
          });
        }

        // API-004 — CORS: credentials:true + wildcard/reflect origin.
        if (
          CORS_CREDENTIALS_BAD_ORIGIN.test(line) ||
          CORS_CREDENTIALS_BAD_ORIGIN_REORDERED.test(line)
        ) {
          findings.push({
            id: randomUUID(),
            detector: "api-hardening",
            rule: "API-004",
            domain: "D7",
            severity: "critical",
            title: "CORS allows credentials from a wildcard or reflected origin",
            description:
              "cors() is configured with credentials: true AND an origin that is either '*' or a boolean reflecting whatever the caller sends.",
            why: "Wildcard-plus-credentials is spec-forbidden — browsers refuse it and your API silently breaks in production. Worse, `origin: true` reflects any origin as the Access-Control-Allow-Origin: an attacker's page can make authenticated cross-origin calls against your API and read the response.",
            file: file.relativePath,
            line: i + 1,
            snippet: line.trim().slice(0, 120),
            fix: "Replace the origin with an explicit allowlist of trusted domains (array of strings or an origin function that checks against a list). Never combine credentials: true with '*' or true.",
            confidence: "certain",
            category: "API Hardening",
          });
        }
      }
    }

    return findings;
  },
};
