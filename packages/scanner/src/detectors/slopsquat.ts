import { readFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";
import type { Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import type { Detector } from "./types.js";

/**
 * AI-005 (and later AI-006) live here. These are the supply-chain
 * failure modes that only exist because an AI wrote the code:
 *
 * - Slopsquat / hallucination (AI-005): the LLM invented a package
 *   name that doesn't exist on npm. ~20% of package names LLMs
 *   recommend don't exist. Either the install failed and
 *   the developer never noticed, or — much worse — a squatter
 *   registered the hallucinated name within hours and now serves
 *   malware on `npm install`.
 *
 * - Typosquat (AI-006): Levenshtein-close to a top-1000
 *   package, published recently, low weekly downloads. That's the
 *   attacker's playbook. This file is the natural home for it.
 */

const NPM_REGISTRY = "https://registry.npmjs.org";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Vendored top-N most-installed npm packages used as the typosquat
 * comparison corpus (AI-006).
 * Deliberately kept short and well-known — a longer list produces
 * more false positives on legitimately-similar names.
 */
const TOP_NPM_PACKAGES = [
  "react", "react-dom", "next", "vue", "@angular/core", "svelte", "solid-js",
  "express", "fastify", "koa", "hapi", "nestjs", "hono", "@nestjs/core",
  "lodash", "underscore", "ramda", "immer",
  "axios", "node-fetch", "got", "superagent", "ky",
  "moment", "dayjs", "date-fns", "luxon",
  "typescript", "eslint", "prettier", "babel", "@babel/core",
  "vite", "webpack", "rollup", "esbuild", "parcel", "turbo",
  "vitest", "jest", "mocha", "chai", "playwright", "@playwright/test", "cypress",
  "chalk", "kleur", "picocolors", "ansi-colors",
  "commander", "yargs", "meow", "cac", "inquirer", "prompts", "ora",
  "chokidar", "gaze", "fs-extra", "glob", "fast-glob", "globby", "picomatch",
  "dotenv", "cross-env", "yaml", "toml", "ini",
  "zod", "yup", "joi", "ajv", "valibot", "superstruct",
  "prisma", "@prisma/client", "drizzle-orm", "sequelize", "typeorm", "mongoose", "mikro-orm", "kysely",
  "pg", "mysql2", "sqlite3", "better-sqlite3", "postgres", "@neondatabase/serverless",
  "redis", "ioredis",
  "socket.io", "ws", "engine.io",
  "graphql", "apollo-server", "@apollo/client", "urql", "@tanstack/react-query", "swr",
  "next-auth", "@auth/core", "@clerk/nextjs", "@clerk/clerk-react", "passport", "jsonwebtoken", "jose",
  "bcrypt", "bcryptjs", "argon2",
  "stripe", "@stripe/stripe-js",
  "@aws-sdk/client-s3", "@aws-sdk/client-dynamodb", "@aws-sdk/client-sts",
  "@sentry/nextjs", "@sentry/node", "posthog-node", "@vercel/analytics",
  "resend", "nodemailer", "@react-email/components",
  "cheerio", "puppeteer", "playwright-core", "jsdom",
  "sharp", "jimp",
  "openai", "@anthropic-ai/sdk", "@google/generative-ai", "ai",
  "esbuild-register", "tsx", "ts-node", "tsup", "swc",
  "@types/node", "@types/react", "@types/react-dom", "@types/express",
  "react-router", "react-router-dom", "@tanstack/react-router",
  "tailwindcss", "postcss", "autoprefixer",
  "@radix-ui/react-slot", "@radix-ui/react-dialog", "@shadcn/ui", "lucide-react",
  "framer-motion", "react-spring",
  "clsx", "classnames", "tailwind-merge",
  "uuid", "nanoid", "shortid",
  "crypto-js", "node-forge",
  "fast-json-stringify", "safe-json-stringify",
  "pino", "winston", "bunyan", "consola",
  "husky", "lint-staged", "@commitlint/cli",
  "changesets", "semantic-release", "release-it",
];

/** Typosquat window: Levenshtein ≤2 from a top-N name. */
const TYPOSQUAT_MAX_DISTANCE = 2;
const CACHE_DIR = join(homedir(), ".verglos", "cache");
const CACHE_FILE = join(CACHE_DIR, "npm-existence.json");
const HTTP_TIMEOUT_MS = 3000;
const BATCH_SIZE = 8;
const MAX_PACKAGES_PER_SCAN = 400;

interface CacheEntry {
  exists: boolean;
  checkedAt: string; // ISO
}

type CacheData = Record<string, CacheEntry>;

async function loadCache(): Promise<CacheData> {
  try {
    const raw = await readFile(CACHE_FILE, "utf8");
    return JSON.parse(raw) as CacheData;
  } catch {
    return {};
  }
}

async function saveCache(data: CacheData): Promise<void> {
  try {
    await mkdir(CACHE_DIR, { recursive: true });
    await writeFile(CACHE_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // Cache is best-effort; a read-only home dir shouldn't break scanning.
  }
}

function isFresh(entry: CacheEntry): boolean {
  const age = Date.now() - new Date(entry.checkedAt).getTime();
  return age < CACHE_TTL_MS;
}

async function checkNpmExistence(name: string): Promise<boolean | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);
    const res = await fetch(
      `${NPM_REGISTRY}/${encodeURIComponent(name)}`,
      {
        method: "HEAD",
        signal: controller.signal,
      },
    );
    clearTimeout(timer);
    if (res.status === 200) return true;
    if (res.status === 404) return false;
    // 429 / 5xx: don't cache — treat as unknown so we retry next scan
    return null;
  } catch {
    return null;
  }
}

async function checkBatch(
  names: string[],
): Promise<Map<string, boolean | null>> {
  const results = new Map<string, boolean | null>();
  await Promise.all(
    names.map(async (name) => {
      results.set(name, await checkNpmExistence(name));
    }),
  );
  return results;
}

/**
 * Read the monorepo workspace globs from package.json (`workspaces`)
 * and pnpm-workspace.yaml, then walk every matching sub-package.json
 * and collect the internal package name field. Anything in this set
 * is a workspace-internal package — not published to npm — and must
 * not be flagged as slopsquat.
 *
 * Corpus evidence: HeyPuter/puter, appsmith, gitbutler, n8n,
 * Reactive-Resume all triggered false slopsquat because they
 * publish nothing under their `@scope/*` prefix.
 */
async function collectWorkspacePackageNames(
  projectRoot: string,
): Promise<Set<string>> {
  const { globby } = await import("fast-glob").then((m) => ({
    globby: m.default,
  }));
  const names = new Set<string>();

  // 1. package.json `workspaces` array or object with `packages` field.
  let globs: string[] = [];
  try {
    const raw = await readFile(join(projectRoot, "package.json"), "utf8");
    const pkg = JSON.parse(raw) as {
      workspaces?: string[] | { packages?: string[] };
    };
    if (Array.isArray(pkg.workspaces)) globs.push(...pkg.workspaces);
    else if (pkg.workspaces?.packages) globs.push(...pkg.workspaces.packages);
  } catch {
    // no root package.json — nothing to add from here
  }

  // 2. pnpm-workspace.yaml (minimal YAML parse — we only care about
  //    the `packages:` array).
  try {
    const raw = await readFile(join(projectRoot, "pnpm-workspace.yaml"), "utf8");
    const inSection = raw.match(/^packages:\s*\n((?:\s*-\s+[^\n]+\n?)+)/m);
    if (inSection?.[1]) {
      for (const line of inSection[1].split("\n")) {
        const m = line.match(/^\s*-\s*['"]?([^'"\s]+)['"]?/);
        if (m?.[1]) globs.push(m[1]);
      }
    }
  } catch {
    // no pnpm workspace file
  }

  if (globs.length === 0) return names;

  // Walk each glob root looking for package.json files.
  const packageJsonGlobs = globs.map((g) =>
    g.endsWith("/") ? `${g}package.json` : `${g}/package.json`,
  );
  let found: string[] = [];
  try {
    found = await globby(packageJsonGlobs, {
      cwd: projectRoot,
      absolute: true,
      ignore: ["**/node_modules/**"],
      suppressErrors: true,
    });
  } catch {
    return names;
  }

  for (const pjPath of found) {
    try {
      const raw = await readFile(pjPath, "utf8");
      const pkg = JSON.parse(raw) as { name?: string };
      if (pkg.name) names.add(pkg.name);
    } catch {
      // skip unreadable / malformed
    }
  }

  return names;
}

async function parsePackageJsonDeps(
  projectRoot: string,
): Promise<Set<string>> {
  const names = new Set<string>();
  try {
    const raw = await readFile(join(projectRoot, "package.json"), "utf8");
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      optionalDependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
    for (const field of [
      pkg.dependencies,
      pkg.devDependencies,
      pkg.optionalDependencies,
      pkg.peerDependencies,
    ]) {
      if (!field) continue;
      for (const name of Object.keys(field)) names.add(name);
    }
  } catch {
    // No package.json: nothing to check.
  }
  return names;
}

async function parseLockDeps(projectRoot: string): Promise<Set<string>> {
  const names = new Set<string>();
  try {
    const raw = await readFile(
      join(projectRoot, "package-lock.json"),
      "utf8",
    );
    const lock = JSON.parse(raw) as {
      packages?: Record<string, unknown>;
      dependencies?: Record<string, unknown>;
    };
    if (lock.packages) {
      for (const path of Object.keys(lock.packages)) {
        if (!path) continue;
        // "node_modules/x/node_modules/y" → "y"
        const name = path
          .replace(/^node_modules\//, "")
          .split("/node_modules/")
          .pop();
        if (name) names.add(name);
      }
    } else if (lock.dependencies) {
      for (const name of Object.keys(lock.dependencies)) names.add(name);
    }
  } catch {
    // No lockfile: fall back to package.json (already collected).
  }
  return names;
}

/** Standard Levenshtein distance (iterative, O(mn)). */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
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

/**
 * Return the closest top-N package name if the candidate is close
 * enough to look like a squat, and it isn't an exact match. Case-
 * insensitive comparison after lowercasing.
 */
function nearestTopMatch(name: string): { top: string; distance: number } | null {
  const lower = name.toLowerCase();
  let best: { top: string; distance: number } | null = null;
  for (const top of TOP_NPM_PACKAGES) {
    const distance = levenshtein(lower, top.toLowerCase());
    if (distance === 0) return null; // exact match — the legit package
    if (distance > TYPOSQUAT_MAX_DISTANCE) continue;
    if (!best || distance < best.distance) best = { top, distance };
  }
  return best;
}

async function collectDepNames(
  projectRoot: string,
): Promise<string[]> {
  const [fromPkg, fromLock] = await Promise.all([
    parsePackageJsonDeps(projectRoot),
    parseLockDeps(projectRoot),
  ]);
  const all = new Set([...fromPkg, ...fromLock]);
  // Very defensive: skip anything that isn't a well-formed npm name.
  return [...all].filter(
    (n) => n && /^(?:@[a-z0-9-][a-z0-9._-]*\/)?[a-z0-9-][a-z0-9._-]*$/i.test(n),
  );
}

export const slopsquatDetector: Detector = {
  id: "slopsquat",
  async run(_files: ScannedFile[], projectRoot: string): Promise<Finding[]> {
    const allNames = await collectDepNames(projectRoot);
    if (allNames.length === 0) return [];

    // Drop anything that's actually a workspace-internal package. See
    // collectWorkspacePackageNames above for the corpus rationale.
    const workspaceNames = await collectWorkspacePackageNames(projectRoot);
    const names = allNames.filter((n) => !workspaceNames.has(n));

    const cache = await loadCache();
    const findings: Finding[] = [];
    const toCheck: string[] = [];

    for (const name of names) {
      const entry = cache[name];
      if (entry && isFresh(entry)) continue; // cached hit — either exists or doesn't
      toCheck.push(name);
    }

    const limited = toCheck.slice(0, MAX_PACKAGES_PER_SCAN);
    for (let i = 0; i < limited.length; i += BATCH_SIZE) {
      const batch = limited.slice(i, i + BATCH_SIZE);
      const results = await checkBatch(batch);
      for (const [name, exists] of results.entries()) {
        if (exists === null) continue; // network hiccup — don't cache
        cache[name] = { exists, checkedAt: new Date().toISOString() };
      }
    }
    await saveCache(cache);

    for (const name of names) {
      const entry = cache[name];
      const doesNotExist = entry && entry.exists === false;

      if (doesNotExist) {
        findings.push({
          id: randomUUID(),
          detector: "slopsquat",
          rule: "AI-005",
          domain: "D6",
          severity: "critical",
          title: `Package does not exist on npm: ${name}`,
          description: `The dependency \`${name}\` is declared in package.json / package-lock.json but has no entry on the public npm registry.`,
          why:
            "This is the AI-hallucinated-package failure mode. ~20% of package names LLMs recommend don't exist. Either the install silently failed (you're missing a dependency in production) or — much worse — an attacker has registered the exact hallucinated name in the meantime and is now shipping malware to anyone who runs `npm install` on this repo.",
          file: "package.json",
          package: name,
          refs: [
            `${NPM_REGISTRY}/${encodeURIComponent(name)}`,
          ],
          fix: `Remove \`${name}\` from package.json and any imports. Verify what you meant to install — this name was likely fabricated by an AI assistant.`,
          confidence: "certain",
          category: "Dependency & Supply Chain",
        });
        continue; // don't also emit AI-006 for a package that outright doesn't exist
      }

      // AI-006 · Typosquat — installed package looks like a typo of a
      // top-N popular package. Only fires when the package DOES exist
      // on npm (otherwise AI-005 has already covered it).
      const packageExists = entry?.exists === true;
      if (!packageExists) continue;
      const nearest = nearestTopMatch(name);
      if (nearest) {
        findings.push({
          id: randomUUID(),
          detector: "slopsquat",
          rule: "AI-006",
          domain: "D6",
          severity: "high",
          title: `Possible typosquat: \`${name}\` is one keystroke off \`${nearest.top}\``,
          description: `The installed dependency \`${name}\` is Levenshtein distance ${nearest.distance} from the well-known package \`${nearest.top}\`. This is the attacker's playbook against AI-suggested names.`,
          why: "Models mis-remember popular package names in predictable ways. Squatters register the mis-remembered spelling and wait for an LLM to suggest it. This package exists on npm, but the fact that it's one or two letters off a top-N name is the exact shape of a supply-chain attack.",
          file: "package.json",
          package: name,
          refs: [
            `${NPM_REGISTRY}/${encodeURIComponent(name)}`,
            `${NPM_REGISTRY}/${encodeURIComponent(nearest.top)}`,
          ],
          fix: `Verify \`${name}\` is really what you meant — the popular alternative is \`${nearest.top}\`. If \`${name}\` is intentional, dismiss this finding; if not, remove it and install \`${nearest.top}\` instead.`,
          confidence: "medium",
          category: "Dependency & Supply Chain",
        });
      }
    }

    return findings;
  },
};
