/**
 * check_package — pre-install verdict for a single npm package.
 *
 * Answers three questions before an agent runs `npm install`:
 *   1. Does this package exist? (AI-005 slopsquat)
 *   2. Does it look like a typo of a top-N package? (AI-006)
 *   3. Does the requested version have known CVEs? (D6-001, OSV)
 *
 * Each question is a lightweight network call. No temp files, no
 * detector orchestration — this is a straight lookup.
 */

const NPM_REGISTRY = "https://registry.npmjs.org";
const OSV_URL = "https://api.osv.dev/v1/query";
const HTTP_TIMEOUT_MS = 4000;

/**
 * Small top-N list — same shape as slopsquat.ts. Kept private to
 * the MCP hot path so the tool can answer without loading the full
 * scanner list. Refresh occasionally.
 */
const TOP_NPM_PACKAGES = [
  "react", "react-dom", "next", "vue", "svelte", "solid-js",
  "express", "fastify", "koa", "nestjs", "hono",
  "lodash", "underscore", "ramda", "immer",
  "axios", "node-fetch", "got", "ky",
  "moment", "dayjs", "date-fns", "luxon",
  "typescript", "eslint", "prettier", "vite", "webpack", "rollup", "esbuild",
  "vitest", "jest", "mocha", "playwright", "cypress",
  "chalk", "commander", "yargs", "inquirer", "ora",
  "chokidar", "fs-extra", "fast-glob", "globby",
  "dotenv",
  "zod", "yup", "joi", "ajv", "valibot",
  "prisma", "@prisma/client", "drizzle-orm", "sequelize", "typeorm", "mongoose", "kysely",
  "pg", "mysql2", "sqlite3", "better-sqlite3", "postgres",
  "redis", "ioredis",
  "socket.io", "ws",
  "graphql", "@apollo/client", "@tanstack/react-query", "swr",
  "next-auth", "@clerk/nextjs", "passport", "jsonwebtoken", "jose",
  "bcrypt", "bcryptjs", "argon2",
  "stripe",
  "@aws-sdk/client-s3",
  "@sentry/nextjs", "@sentry/node",
  "openai", "@anthropic-ai/sdk", "ai",
  "tsx", "ts-node", "tsup",
  "react-router", "@tanstack/react-router",
  "tailwindcss", "postcss",
  "clsx", "tailwind-merge",
  "uuid", "nanoid",
  "pino", "winston",
];
const TYPOSQUAT_MAX_DISTANCE = 2;

export interface CheckPackageInput {
  packageName: string;
  version?: string;
}

export type CheckPackageVerdict = "safe" | "warn" | "block";

export interface CheckPackageResult {
  verdict: CheckPackageVerdict;
  packageName: string;
  version: string;
  exists: boolean;
  typosquat?: { top: string; distance: number };
  cves: { id: string; severity: string; summary?: string }[];
  reasoning: string;
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    p,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

async function packageExists(name: string): Promise<boolean | null> {
  const res = await withTimeout(
    fetch(`${NPM_REGISTRY}/${encodeURIComponent(name)}`, { method: "HEAD" }),
    HTTP_TIMEOUT_MS,
  );
  if (!res) return null;
  if (res.status === 200) return true;
  if (res.status === 404) return false;
  return null;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const prev = new Array<number>(b.length + 1);
  const curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        (curr[j - 1] ?? 0) + 1,
        (prev[j] ?? 0) + 1,
        (prev[j - 1] ?? 0) + cost,
      );
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j] ?? 0;
  }
  return prev[b.length] ?? 0;
}

function findTyposquat(name: string): { top: string; distance: number } | null {
  const lower = name.toLowerCase();
  let best: { top: string; distance: number } | null = null;
  for (const top of TOP_NPM_PACKAGES) {
    const d = levenshtein(lower, top.toLowerCase());
    if (d === 0) return null;
    if (d > TYPOSQUAT_MAX_DISTANCE) continue;
    if (!best || d < best.distance) best = { top, distance: d };
  }
  return best;
}

interface OsvVuln {
  id: string;
  summary?: string;
  database_specific?: { severity?: string };
}

async function queryOsv(
  name: string,
  version: string,
): Promise<OsvVuln[]> {
  try {
    const res = await withTimeout(
      fetch(OSV_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          package: { name, ecosystem: "npm" },
          version,
        }),
      }),
      HTTP_TIMEOUT_MS,
    );
    if (!res || !res.ok) return [];
    const data = (await res.json()) as { vulns?: OsvVuln[] };
    return data.vulns ?? [];
  } catch {
    return [];
  }
}

async function resolveLatest(name: string): Promise<string | null> {
  const res = await withTimeout(
    fetch(`${NPM_REGISTRY}/${encodeURIComponent(name)}/latest`),
    HTTP_TIMEOUT_MS,
  );
  if (!res || !res.ok) return null;
  try {
    const data = (await res.json()) as { version?: string };
    return data.version ?? null;
  } catch {
    return null;
  }
}

export async function checkPackage(
  input: CheckPackageInput,
): Promise<CheckPackageResult> {
  const packageName = input.packageName.trim();

  const exists = await packageExists(packageName);
  if (exists === false) {
    // AI-005 — package doesn't exist. Block.
    return {
      verdict: "block",
      packageName,
      version: input.version ?? "unknown",
      exists: false,
      cves: [],
      reasoning: `\`${packageName}\` does not exist on the public npm registry. This is the AI-005 slopsquat failure mode — either the install will fail, or worse, an attacker has registered the exact hallucinated name and is now shipping malware to anyone who runs \`npm install\`. Do not install.`,
    };
  }
  if (exists === null) {
    // Network flaky — respond with a soft warn so the agent can proceed at its own risk.
    return {
      verdict: "warn",
      packageName,
      version: input.version ?? "unknown",
      exists: false,
      cves: [],
      reasoning: `Could not reach registry.npmjs.org to verify \`${packageName}\`. Retry later, or check manually before installing.`,
    };
  }

  // Resolve version if not given (we need it for OSV).
  const version =
    input.version && input.version !== "latest"
      ? input.version
      : ((await resolveLatest(packageName)) ?? "latest");

  const typosquat = findTyposquat(packageName);
  const cves = await queryOsv(packageName, version);

  const cvesFmt = cves.map((v) => ({
    id: v.id,
    severity: v.database_specific?.severity ?? "UNKNOWN",
    summary: v.summary,
  }));

  const criticals = cvesFmt.filter(
    (v) => v.severity === "CRITICAL" || v.severity === "HIGH",
  );

  let verdict: CheckPackageVerdict = "safe";
  const notes: string[] = [];

  if (criticals.length > 0) {
    verdict = "block";
    notes.push(
      `${criticals.length} critical/high CVE${criticals.length === 1 ? "" : "s"} for ${packageName}@${version}: ${criticals
        .slice(0, 3)
        .map((c) => c.id)
        .join(", ")}${criticals.length > 3 ? "…" : ""}`,
    );
  } else if (cvesFmt.length > 0) {
    verdict = "warn";
    notes.push(
      `${cvesFmt.length} known vulnerabilit${cvesFmt.length === 1 ? "y" : "ies"} in ${packageName}@${version}. Review before installing.`,
    );
  }

  if (typosquat) {
    // Typosquat elevates from safe → warn; if a CVE already put us at
    // block or warn, we compound but don't downgrade.
    if (verdict === "safe") verdict = "warn";
    notes.push(
      `\`${packageName}\` is Levenshtein distance ${typosquat.distance} from \`${typosquat.top}\`. If you meant \`${typosquat.top}\`, install that instead — the near-miss is exactly what squatters register.`,
    );
  }

  if (notes.length === 0) {
    notes.push(
      `\`${packageName}@${version}\` exists on npm and has no known CVEs recorded by OSV.dev.`,
    );
  }

  return {
    verdict,
    packageName,
    version,
    exists: true,
    typosquat: typosquat ?? undefined,
    cves: cvesFmt,
    reasoning: notes.join("\n\n"),
  };
}
