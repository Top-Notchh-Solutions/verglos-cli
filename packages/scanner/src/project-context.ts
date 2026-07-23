import { readFile, access } from "node:fs/promises";
import { join } from "node:path";

/**
 * Repo-level context that multiple detectors read (auth presence,
 * framework hints, etc.). Cheap to compute once and memoize —
 * every AI-* rule that cares about "does this app have logged-in
 * users" (AI-001, AI-010) checks these.
 *
 * Cached per (projectRoot) for the lifetime of the process.
 */

export interface ProjectContext {
  hasAuth: boolean;
  authSources: string[]; // human-readable hints for signal detail
}

const cache = new Map<string, ProjectContext>();

const AUTH_PACKAGE_PATTERNS = [
  { pkg: "@clerk/", label: "Clerk" },
  { pkg: "next-auth", label: "NextAuth" },
  { pkg: "@auth/", label: "Auth.js" },
  { pkg: "express-session", label: "express-session" },
  { pkg: "passport", label: "Passport" },
  { pkg: "@auth0/", label: "Auth0" },
  { pkg: "iron-session", label: "iron-session" },
  { pkg: "lucia", label: "Lucia" },
  { pkg: "@supabase/auth", label: "Supabase Auth" },
  { pkg: "firebase/auth", label: "Firebase Auth" },
  { pkg: "@workos-inc", label: "WorkOS" },
  { pkg: "@descope", label: "Descope" },
  { pkg: "next-firebase-auth", label: "Next Firebase Auth" },
  { pkg: "jose", label: "jose (JWT)" },
  { pkg: "jsonwebtoken", label: "jsonwebtoken" },
];

const AUTH_FOLDER_PATTERNS = [
  "src/auth",
  "app/auth",
  "app/(auth)",
  "middleware.ts",
  "middleware.js",
];

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function detectAuthFromPackageJson(
  projectRoot: string,
): Promise<{ hits: string[] }> {
  const hits: string[] = [];
  try {
    const raw = await readFile(join(projectRoot, "package.json"), "utf8");
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const names = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ];
    for (const name of names) {
      for (const { pkg: needle, label } of AUTH_PACKAGE_PATTERNS) {
        if (name.startsWith(needle)) {
          hits.push(label);
          break;
        }
      }
    }
  } catch {
    // no package.json
  }
  return { hits: [...new Set(hits)] };
}

async function detectAuthFromLayout(
  projectRoot: string,
): Promise<{ hits: string[] }> {
  const hits: string[] = [];
  for (const rel of AUTH_FOLDER_PATTERNS) {
    if (await fileExists(join(projectRoot, rel))) {
      hits.push(rel);
    }
  }
  return { hits };
}

export async function getProjectContext(
  projectRoot: string,
): Promise<ProjectContext> {
  const cached = cache.get(projectRoot);
  if (cached) return cached;

  const [pkgHits, layoutHits] = await Promise.all([
    detectAuthFromPackageJson(projectRoot),
    detectAuthFromLayout(projectRoot),
  ]);

  const authSources = [...pkgHits.hits, ...layoutHits.hits];
  const context: ProjectContext = {
    hasAuth: authSources.length > 0,
    authSources,
  };
  cache.set(projectRoot, context);
  return context;
}

/** Test hook — clears the memoization cache between runs. */
export function _resetProjectContextCache(): void {
  cache.clear();
}
