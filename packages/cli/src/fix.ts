import { lstat, readFile, writeFile, access, mkdir, open } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import chalk from "chalk";
import { detectProjectType } from "@verglos/scanner";
import { authorizeAgentAction, putApprovalReceipt, type ApprovalReceipt, type ProjectType } from "@verglos/shared";

/**
 * Framework-aware security header injection for `verglos fix`.
 *
 * Two shapes:
 *
 *   1. Next.js — direct patch of next.config.js. Existing behavior;
 *      the file is standard and users expect security headers to
 *      live there. Only modifies if the file already declares
 *      `const nextConfig = { ... }` and doesn't already have CSP.
 *
 *   2. Everything else — write a new file at
 *      `src/verglos-security-headers.ts` (or the closest equivalent
 *      given the framework), then print a snippet the user pastes
 *      into their app entry. Never edits the entry file.
 */

interface FixResult {
  file: string;
  action: "created" | "patched" | "skipped";
  instructions?: string;
}

export interface HeaderFixPlan {
  readonly file: string;
  readonly action: "create" | "patch" | "skip";
  readonly preview?: readonly string[];
}

export function authorizeHeaderFix(receipt: ApprovalReceipt, plannedFiles: readonly string[], at: string): { readonly allowed: boolean; readonly reason?: string } {
  const authorization = authorizeAgentAction("mutate", receipt, at);
  if (!authorization.allowed) return { allowed: false, reason: authorization.reason };
  const planned = [...new Set(plannedFiles)].sort();
  const approved = [...new Set(receipt.files)].sort();
  if (planned.length !== approved.length || planned.some((file, index) => file !== approved[index])) return { allowed: false, reason: "file-scope-mismatch" };
  return { allowed: true };
}

/** Write an already-planned regular file without following a replacement symlink. */
async function replaceRegularFile(path: string, content: string): Promise<void> {
  const handle = await open(path, constants.O_WRONLY | constants.O_TRUNC | constants.O_NOFOLLOW);
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > 1 * 1024 * 1024) throw new Error("Next.js config changed before mutation.");
    await handle.writeFile(content, "utf8");
  } finally {
    await handle.close();
  }
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function pickSrcDir(projectRoot: string): Promise<string> {
  if (await fileExists(join(projectRoot, "src"))) return "src";
  return ".";
}

const NEXT_HEADERS_BLOCK = `
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';" },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },`;

function previewLines(value: string): readonly string[] {
  return value.trim().split("\n").map((line) => `+${line}`);
}

function samePlannedFiles(left: readonly string[], right: readonly string[]): boolean {
  const a = [...new Set(left)].sort();
  const b = [...new Set(right)].sort();
  return a.length === b.length && a.every((file, index) => file === b[index]);
}

// Approval receipts use stable POSIX-relative paths across hosts. Keep the
// filesystem writer native, but never let Windows separators alter the
// mutation scope that was shown to and approved by the caller.
function contractPath(path: string): string {
  return path.replaceAll("\\", "/");
}

/** Plans header changes without reading beyond bounded config/helper files or mutating the project. */
export async function planHeaderFixes(projectRoot: string): Promise<readonly HeaderFixPlan[]> {
  const { type } = await detectProjectType(projectRoot);
  if (type === "nextjs") {
    for (const name of ["next.config.js", "next.config.mjs", "next.config.ts"]) {
      const path = join(projectRoot, name);
      try {
        const entry = await lstat(path);
        if (!entry.isFile() || entry.size > 1 * 1024 * 1024) continue;
        const content = await readFile(path, "utf8");
        if (Buffer.byteLength(content, "utf8") > 1 * 1024 * 1024) continue;
        if (content.includes("Content-Security-Policy") || content.includes("X-Frame-Options")) return [{ file: name, action: "skip" }];
        if (NEXT_CONFIG_DECL.test(content)) return [{ file: name, action: "patch", preview: previewLines(NEXT_HEADERS_BLOCK) }];
      } catch { /* unavailable config is not a mutation target */ }
    }
    return [];
  }
  if (type === "express" || type === "fastify" || type === "node" || type === "react") {
    const file = contractPath(join(await pickSrcDir(projectRoot), "verglos-security-headers.ts"));
    const filesystemFile = join(projectRoot, ...file.split("/"));
    return [{ file, action: await fileExists(filesystemFile) ? "skip" : "create", ...(await fileExists(filesystemFile) ? {} : { preview: previewLines(HEADERS_HELPER_TS) }) }];
  }
  return [];
}

// ── Next.js ────────────────────────────────────────────────────────────────

async function fixNextjs(projectRoot: string): Promise<FixResult | null> {
  const candidates = ["next.config.js", "next.config.mjs", "next.config.ts"];
  for (const name of candidates) {
    const path = join(projectRoot, name);
    let content: string;
    try {
      const entry = await lstat(path);
      if (!entry.isFile()) continue;
      if (entry.size > 1 * 1024 * 1024) throw new Error("Next.js config exceeds the 1 MiB limit.");
      content = await readFile(path, "utf8");
      if (Buffer.byteLength(content, "utf8") > 1 * 1024 * 1024) throw new Error("Next.js config exceeds the 1 MiB limit.");
    } catch (error) {
      if (error instanceof Error && error.message === "Next.js config exceeds the 1 MiB limit.") throw error;
      continue;
    }

    if (content.includes("Content-Security-Policy") || content.includes("X-Frame-Options")) {
      return { file: name, action: "skipped" };
    }

    if (NEXT_CONFIG_DECL.test(content)) {
      const updated = content.replace(
        NEXT_CONFIG_DECL,
        (match) => `${match}${NEXT_HEADERS_BLOCK}`,
      );
      const beforeWrite = await lstat(path);
      if (!beforeWrite.isFile() || beforeWrite.size > 1 * 1024 * 1024) throw new Error("Next.js config changed before mutation.");
      await replaceRegularFile(path, updated);
      return { file: name, action: "patched" };
    }
  }
  return null;
}

/**
 * Matches every real-world shape of the Next.js config declaration we
 * expect to encounter. Kept exported for unit testing.
 *
 * Accepts:
 *   const nextConfig = {
 *   let nextConfig = {
 *   const nextConfig: NextConfig = {                      ← Next 14/15 default
 *   const nextConfig: NextConfig<Options> = {             ← generic type arg
 *   const nextConfig satisfies NextConfig = {             ← satisfies clause
 *
 * Rejects deliberately:
 *   const nextConfig: NextConfig<{ inline: object }> = {  ← inline object
 *     types are exotic in real configs and would require a real parser
 *     to disambiguate the closing `>` from the declaration `= {`. When
 *     hit, `verglos fix` falls through to the middleware-style path
 *     (writes src/verglos-security-headers.ts) which is safe.
 *
 * The identifier-name-first alternation and the tight character class
 * inside the generic argument prevent this from matching arbitrary
 * `= {` on unrelated lines.
 */
export const NEXT_CONFIG_DECL =
  /(?:const|let)\s+nextConfig(?:\s*:\s*[A-Za-z_$][\w$]*(?:\s*<\s*[\w$,\s]+\s*>)?|\s+satisfies\s+[A-Za-z_$][\w$]*(?:\s*<\s*[\w$,\s]+\s*>)?)?\s*=\s*\{/;

// ── Middleware-style frameworks (Express / Hono / Fastify / Nest) ─────────

const HEADERS_HELPER_TS = `/**
 * Verglos security headers. Injected by \`verglos fix --headers\`.
 * @see https://verglos.com/docs/headers
 */

export const VERGLOS_SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
`;

const HEADERS_HELPER_EXTRAS: Partial<Record<ProjectType, string>> = {
  express: `
export function verglosSecurityHeadersExpress(_req: unknown, res: {
  setHeader(name: string, value: string): void;
}, next: () => void) {
  for (const [k, v] of Object.entries(VERGLOS_SECURITY_HEADERS)) {
    res.setHeader(k, v);
  }
  next();
}
`,
  fastify: `
export function verglosSecurityHeadersFastify(
  _req: unknown,
  reply: { header(name: string, value: string): void },
  done: () => void,
) {
  for (const [k, v] of Object.entries(VERGLOS_SECURITY_HEADERS)) {
    reply.header(k, v);
  }
  done();
}
`,
};

const WIRE_INSTRUCTIONS: Partial<Record<ProjectType, string>> = {
  express:
    "Wire it in with:\n" +
    "  import { verglosSecurityHeadersExpress } from './verglos-security-headers';\n" +
    "  app.use(verglosSecurityHeadersExpress);",
  fastify:
    "Wire it in with:\n" +
    "  import { verglosSecurityHeadersFastify } from './verglos-security-headers';\n" +
    "  app.addHook('onSend', verglosSecurityHeadersFastify);",
  node:
    "In your request handler:\n" +
    "  import { VERGLOS_SECURITY_HEADERS } from './verglos-security-headers';\n" +
    "  for (const [k, v] of Object.entries(VERGLOS_SECURITY_HEADERS)) res.setHeader(k, v);",
  react:
    "React apps set headers server-side. Configure your host (Vercel / Netlify / nginx) using VERGLOS_SECURITY_HEADERS as the source of truth.",
};

async function fixWithHelperFile(
  projectRoot: string,
  projectType: ProjectType,
): Promise<FixResult> {
  const srcDir = await pickSrcDir(projectRoot);
  const helperPath = join(projectRoot, srcDir, "verglos-security-headers.ts");
  const alreadyExists = await fileExists(helperPath);
  if (alreadyExists) return { file: helperPath, action: "skipped" };

  await mkdir(dirname(helperPath), { recursive: true });
  const extras = HEADERS_HELPER_EXTRAS[projectType] ?? "";
  try {
    await writeFile(helperPath, HEADERS_HELPER_TS + extras, { encoding: "utf8", flag: "wx" });
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "EEXIST") return { file: helperPath, action: "skipped" };
    throw error;
  }

  const wire = WIRE_INSTRUCTIONS[projectType] ??
    "Import VERGLOS_SECURITY_HEADERS and set each key on your outgoing responses.";
  return {
    file: helperPath,
    action: "created",
    instructions: wire,
  };
}

// ── Public entry point ────────────────────────────────────────────────────

/**
 * Returns the number of files created or patched. Prints per-file
 * status to stdout; instructions when a helper file was created.
 */
export async function applyHeaderFixes(projectRoot: string, options: { readonly approvalReceipt?: ApprovalReceipt; readonly now?: string; readonly approvalStoreRoot?: string; readonly quiet?: boolean } = {}): Promise<number> {
  const plan = await planHeaderFixes(projectRoot);
  const plannedFiles = plan.filter((item) => item.action !== "skip").map((item) => item.file);
  if (plannedFiles.length > 0) {
    if (!options.approvalReceipt) throw new Error("header fix requires an approval receipt before changing files");
    const authorization = authorizeHeaderFix(options.approvalReceipt, plannedFiles, options.now ?? new Date().toISOString());
    if (!authorization.allowed) throw new Error(`header fix approval denied: ${authorization.reason}`);
    if (options.approvalStoreRoot) await putApprovalReceipt(options.approvalStoreRoot, options.approvalReceipt);
  }
  // Re-plan immediately before selecting the writer. A project can change
  // between the approval preview and this call; never let that turn an
  // approved file set into an unapproved helper-file mutation.
  const currentPlan = await planHeaderFixes(projectRoot);
  const currentFiles = currentPlan.filter((item) => item.action !== "skip").map((item) => item.file);
  if (!samePlannedFiles(plannedFiles, currentFiles)) throw new Error("header fix plan changed before mutation");
  const { type } = await detectProjectType(projectRoot);
  let changed = 0;

  if (type === "nextjs") {
    const result = await fixNextjs(projectRoot);
    if (result?.action === "patched") {
      if (!options.quiet) console.log(chalk.green(`  ✓ Patched ${result.file} with security headers`));
      changed++;
    } else if (result?.action === "skipped") {
      if (!options.quiet) console.log(chalk.gray(`  · ${result.file} already declares security headers`));
    } else {
      if (!options.quiet) console.log(
        chalk.gray(
          "  · No next.config.* with a `const nextConfig = { … }` block — skipping.",
        ),
      );
    }
    return changed;
  }

  if (type === "express" || type === "fastify" || type === "node" || type === "react") {
    const result = await fixWithHelperFile(projectRoot, type);
    if (result.action === "created") {
      if (!options.quiet) console.log(chalk.green(`  ✓ Created ${result.file}`));
      if (result.instructions) {
        if (!options.quiet) {
          console.log("");
          for (const line of result.instructions.split("\n")) {
            console.log(chalk.gray("    " + line));
          }
        }
      }
      changed++;
    } else {
      if (!options.quiet) console.log(chalk.gray(`  · ${result.file} already exists — skipping.`));
    }
    return changed;
  }

  if (!options.quiet) console.log(
    chalk.gray(
      `  · Detected project type "${type}" — no header template available yet.`,
    ),
  );
  return changed;
}
