import { lstat, readFile, writeFile, access, mkdir, open, realpath, rename, unlink } from "node:fs/promises";
import { spawn, type ChildProcess } from "node:child_process";
import { constants } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import { randomUUID, createHash } from "node:crypto";
import chalk from "chalk";
import { detectProjectType } from "@verglos/scanner";
import { authorizeAgentAction, canonicalizeJson, putApprovalReceipt, type ApprovalReceipt, type ProjectType } from "@verglos/shared";

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
  readonly diff?: string;
}

export interface HeaderFixTestFile {
  readonly path: string;
  readonly sha256: string;
  readonly size: number;
  readonly absolutePath: string;
}

export interface HeaderFixTestPlan {
  readonly target: string;
  readonly files: readonly HeaderFixTestFile[];
  readonly policyEffect: string;
}

export interface HeaderFixTestResult {
  readonly status: "passed";
  readonly exitCode: 0;
  readonly durationMs: number;
  readonly outputBytes: number;
  readonly outputTruncated: boolean;
}

export interface HeaderFixSnapshot {
  readonly path: string;
  readonly existed: boolean;
  readonly bytes?: Buffer;
  readonly mode?: number;
}

const MAX_FIX_SNAPSHOT_BYTES = 1 * 1024 * 1024;
const MAX_FIX_TEST_FILES = 16;
const MAX_FIX_TEST_FILE_BYTES = 1 * 1024 * 1024;
const MAX_FIX_TEST_TOTAL_BYTES = 4 * 1024 * 1024;
const MAX_FIX_TEST_OUTPUT_BYTES = 256 * 1024;
const MAX_FIX_TEST_DURATION_MS = 120_000;

async function readFixSnapshot(path: string): Promise<Buffer> {
  const handle = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > MAX_FIX_SNAPSHOT_BYTES) throw new Error("fix rollback snapshot target is not a bounded regular file");
    const chunks: Buffer[] = [];
    let total = 0;
    while (true) {
      const buffer = Buffer.alloc(Math.min(64 * 1024, MAX_FIX_SNAPSHOT_BYTES + 1 - total));
      const result = await handle.read(buffer, 0, buffer.byteLength, total);
      if (result.bytesRead === 0) break;
      total += result.bytesRead;
      if (total > MAX_FIX_SNAPSHOT_BYTES) throw new Error("fix rollback snapshot target is not a bounded regular file");
      chunks.push(buffer.subarray(0, result.bytesRead));
    }
    return Buffer.concat(chunks, total);
  } finally {
    await handle.close();
  }
}

async function replaceWithRegularFile(path: string, bytes: Buffer, mode: number): Promise<void> {
  if (!Number.isInteger(mode) || mode < 0 || mode > 0o777) throw new Error("regular-file replacement mode is invalid");
  const temporaryPath = join(dirname(path), `.verglos-rollback-${randomUUID()}.tmp`);
  try {
    const handle = await open(temporaryPath, "wx", mode);
    try {
      const stat = await handle.stat();
      if (!stat.isFile()) throw new Error("fix rollback temporary file is not regular");
      await handle.chmod(mode);
      await handle.writeFile(bytes);
      await handle.sync();
    } finally {
      await handle.close();
    }
    // Rename replaces a raced-in symlink itself; opening the destination with
    // O_NOFOLLOW is not portable (notably on Windows) and can follow it.
    await rename(temporaryPath, path);
  } finally {
    await unlink(temporaryPath).catch(() => undefined);
  }
}

async function restoreFixSnapshot(path: string, bytes: Buffer, mode: number): Promise<void> {
  if (bytes.byteLength > MAX_FIX_SNAPSHOT_BYTES) throw new Error("fix rollback snapshot target is not a bounded regular file");
  await replaceWithRegularFile(path, bytes, mode);
}

export async function captureHeaderFixSnapshots(projectRoot: string, plannedFiles: readonly string[]): Promise<readonly HeaderFixSnapshot[]> {
  const root = await realpath(projectRoot);
  return Promise.all(plannedFiles.map(async (file) => {
    const path = resolve(root, file);
    const fromRoot = relative(root, path);
    if (!fromRoot || fromRoot === ".." || fromRoot.startsWith(`..${sep}`) || isAbsolute(fromRoot)) {
      throw new Error("fix rollback snapshot path is outside the workspace");
    }
    let entry;
    try {
      entry = await lstat(path);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return { path, existed: false };
      throw error;
    }
    if (!entry.isFile() || entry.size > MAX_FIX_SNAPSHOT_BYTES) throw new Error("fix rollback snapshot target is not a bounded regular file");
    return { path, existed: true, bytes: await readFixSnapshot(path), mode: entry.mode & 0o777 };
  }));
}

export async function rollbackHeaderFixSnapshots(snapshots: readonly HeaderFixSnapshot[]): Promise<void> {
  const outcomes = await Promise.allSettled(snapshots.map(async (snapshot) => {
    if (snapshot.existed && snapshot.bytes) await restoreFixSnapshot(snapshot.path, snapshot.bytes, snapshot.mode ?? 0o600);
    else await unlink(snapshot.path).catch((error: unknown) => {
      if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) throw error;
    });
  }));
  const failures = outcomes.filter((outcome): outcome is PromiseRejectedResult => outcome.status === "rejected");
  if (failures.length > 0) throw new AggregateError(failures.map((failure) => failure.reason), "one or more fix rollback operations failed");
}

export class HeaderFixRollbackError extends Error {
  constructor(readonly rollbackSucceeded: boolean, readonly phase: "tests" | "rescan" = "rescan") {
    super(rollbackSucceeded ? `post-fix ${phase} failed; the approved mutation was rolled back` : `post-fix ${phase} failed and rollback could not be verified`);
    this.name = "HeaderFixRollbackError";
  }
}

export async function verifyOrRollbackHeaderFix(
  snapshots: readonly HeaderFixSnapshot[],
  checks: readonly { readonly phase: "tests" | "rescan"; readonly run: () => Promise<unknown> }[],
): Promise<void> {
  for (const check of checks) {
    try {
      await check.run();
    } catch {
      try {
        await rollbackHeaderFixSnapshots(snapshots);
        throw new HeaderFixRollbackError(true, check.phase);
      } catch (error) {
        if (error instanceof HeaderFixRollbackError) throw error;
        throw new HeaderFixRollbackError(false, check.phase);
      }
    }
  }
}

export async function rescanOrRollbackHeaderFix(snapshots: readonly HeaderFixSnapshot[], rescan: () => Promise<unknown>): Promise<void> {
  return verifyOrRollbackHeaderFix(snapshots, [{ phase: "rescan", run: rescan }]);
}

function normalizeFixTestPath(value: string): string {
  if (value.length === 0 || value.length > 512 || /[\u0000-\u001f\u007f]/.test(value)) throw new Error("selected test path is invalid");
  const normalized = value.replaceAll("\\", "/");
  if (normalized.startsWith("/") || /^[A-Za-z]:/.test(normalized) || normalized.split("/").some((part) => part === ".." || part === "" || part === ".")) {
    throw new Error("selected test path must be a normalized relative path inside the workspace");
  }
  if (!/\.(?:c|m)?js$/i.test(normalized)) throw new Error("selected tests must be explicit .js, .cjs, or .mjs files supported by Node's built-in test runner");
  return normalized;
}

async function readBoundedFixTestFile(root: string, path: string): Promise<Buffer> {
  const parts = path.split("/");
  let current = root;
  for (const part of parts.slice(0, -1)) {
    current = join(current, part);
    const entry = await lstat(current);
    if (!entry.isDirectory()) throw new Error("selected test path contains a non-directory or symlink component");
  }
  const absolutePath = join(root, ...parts);
  const entry = await lstat(absolutePath);
  if (!entry.isFile() || entry.size > MAX_FIX_TEST_FILE_BYTES) throw new Error("selected test must be a bounded regular file");
  const handle = await open(absolutePath, constants.O_RDONLY | constants.O_NOFOLLOW);
  try {
    const opened = await handle.stat();
    if (!opened.isFile() || opened.size > MAX_FIX_TEST_FILE_BYTES) throw new Error("selected test must be a bounded regular file");
    const chunks: Buffer[] = [];
    let total = 0;
    while (true) {
      if (total > MAX_FIX_TEST_FILE_BYTES) throw new Error("selected test exceeds the 1 MiB limit");
      const buffer = Buffer.alloc(Math.min(64 * 1024, MAX_FIX_TEST_FILE_BYTES + 1 - total));
      const read = await handle.read(buffer, 0, buffer.byteLength, total);
      if (read.bytesRead === 0) break;
      total += read.bytesRead;
      if (total > MAX_FIX_TEST_FILE_BYTES) throw new Error("selected test exceeds the 1 MiB limit");
      chunks.push(buffer.subarray(0, read.bytesRead));
    }
    return Buffer.concat(chunks, total);
  } finally {
    await handle.close();
  }
}

function fixTestPolicyEffect(files: readonly Pick<HeaderFixTestFile, "path" | "sha256" | "size">[]): string {
  const binding = createHash("sha256").update(canonicalizeJson(files.map(({ path, sha256, size }) => ({ path, sha256, size }))), "utf8").digest("hex");
  return `Run Node --test on selected project files with normal OS permissions (filesystem/process/network are not sandboxed); selection sha256:${binding}`;
}

/** Plan explicit Node test entrypoints; this does not execute project code. */
export async function planHeaderFixTests(projectRoot: string, selectedPaths: readonly string[]): Promise<HeaderFixTestPlan> {
  if (selectedPaths.length === 0 || selectedPaths.length > MAX_FIX_TEST_FILES) throw new Error(`select between 1 and ${MAX_FIX_TEST_FILES} explicit test files`);
  const root = await realpath(projectRoot);
  const normalized = selectedPaths.map(normalizeFixTestPath).sort();
  if (new Set(normalized).size !== normalized.length) throw new Error("selected test files must be unique");
  let totalBytes = 0;
  const files: HeaderFixTestFile[] = [];
  for (const path of normalized) {
    const bytes = await readBoundedFixTestFile(root, path);
    totalBytes += bytes.byteLength;
    if (totalBytes > MAX_FIX_TEST_TOTAL_BYTES) throw new Error("selected test files exceed the 4 MiB total limit");
    files.push({ path, sha256: createHash("sha256").update(bytes).digest("hex"), size: bytes.byteLength, absolutePath: join(root, ...path.split("/")) });
  }
  return {
    target: `workspace:${root}`,
    files,
    policyEffect: fixTestPolicyEffect(files),
  };
}

export async function authorizeHeaderFixTests(receipt: ApprovalReceipt, plan: HeaderFixTestPlan, at: string, projectRoot: string): Promise<{ readonly allowed: boolean; readonly reason?: string }> {
  const authorization = authorizeAgentAction("execute", receipt, at);
  if (!authorization.allowed) return { allowed: false, reason: authorization.reason };
  if (receipt.target !== `workspace:${await realpath(resolve(projectRoot))}` || receipt.target !== plan.target) return { allowed: false, reason: "workspace-target-mismatch" };
  const selected = plan.files.map((file) => file.path);
  const approved = [...receipt.files].sort();
  if (selected.length !== approved.length || selected.some((file, index) => file !== approved[index])) return { allowed: false, reason: "test-file-scope-mismatch" };
  if (receipt.policyEffect !== plan.policyEffect) return { allowed: false, reason: "test-content-mismatch" };
  return { allowed: true };
}

function killTestProcessTree(child: ChildProcess): void {
  if (!child.pid) return;
  if (process.platform === "win32") {
    const systemRoot = process.env.SystemRoot ?? "C:\\Windows";
    const killer = spawn(join(systemRoot, "System32", "taskkill.exe"), ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore", windowsHide: true });
    killer.on("error", () => child.kill("SIGKILL"));
    return;
  }
  try { process.kill(-child.pid, "SIGTERM"); } catch { child.kill("SIGTERM"); }
  const force = setTimeout(() => {
    try { process.kill(-child.pid!, "SIGKILL"); } catch { child.kill("SIGKILL"); }
  }, 500);
  force.unref();
}

export class HeaderFixTestsError extends Error {
  constructor(readonly reason: "approval-denied" | "changed-after-approval" | "failed" | "timed-out" | "output-limit" | "launch-failed", readonly exitCode?: number) {
    super(`selected post-fix tests ${reason.replaceAll("-", " ")}`);
    this.name = "HeaderFixTestsError";
  }
}

/** Run only the approved Node test entrypoints, without a shell, with bounded time and output. */
export async function runApprovedHeaderFixTests(
  projectRoot: string,
  plan: HeaderFixTestPlan,
  receipt: ApprovalReceipt,
  now = new Date().toISOString(),
  testLimits: { readonly timeoutMs?: number; readonly outputBytes?: number } = {},
): Promise<HeaderFixTestResult> {
  const authorization = await authorizeHeaderFixTests(receipt, plan, now, projectRoot);
  if (!authorization.allowed) throw new HeaderFixTestsError("approval-denied");
  const current = await planHeaderFixTests(projectRoot, plan.files.map((file) => file.path));
  if (current.policyEffect !== plan.policyEffect) throw new HeaderFixTestsError("changed-after-approval");
  const timeoutMs = Number.isInteger(testLimits.timeoutMs) ? Math.max(1, Math.min(MAX_FIX_TEST_DURATION_MS, testLimits.timeoutMs!)) : MAX_FIX_TEST_DURATION_MS;
  const outputLimit = Number.isInteger(testLimits.outputBytes) ? Math.max(1, Math.min(MAX_FIX_TEST_OUTPUT_BYTES, testLimits.outputBytes!)) : MAX_FIX_TEST_OUTPUT_BYTES;
  const root = await realpath(projectRoot);
  const started = Date.now();
  const child = spawn(process.execPath, ["--max-old-space-size=256", "--test", "--test-concurrency=1", ...current.files.map((file) => file.absolutePath)], {
    cwd: root,
    shell: false,
    detached: process.platform !== "win32",
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: Object.fromEntries(["PATH", "SystemRoot", "WINDIR", "HOME", "USERPROFILE", "TMPDIR", "TMP", "TEMP"].flatMap((key) => process.env[key] === undefined ? [] : [[key, process.env[key] as string]])),
  });
  let outputBytes = 0;
  let outputTruncated = false;
  let failure: "timed-out" | "output-limit" | undefined;
  let timer: NodeJS.Timeout | undefined;
  const collect = (chunk: Buffer): void => {
    outputBytes += chunk.byteLength;
    if (outputBytes > outputLimit && !failure) {
      outputTruncated = true;
      failure = "output-limit";
      killTestProcessTree(child);
    }
  };
  child.stdout.on("data", collect);
  child.stderr.on("data", collect);
  const exit = await new Promise<{ code: number | null; signal: NodeJS.Signals | null; spawnError?: Error }>((resolveExit) => {
    child.once("error", (error) => resolveExit({ code: null, signal: null, spawnError: error }));
    child.once("close", (code, signal) => resolveExit({ code, signal }));
    timer = setTimeout(() => {
      if (!failure) { failure = "timed-out"; killTestProcessTree(child); }
    }, timeoutMs);
  });
  if (timer) clearTimeout(timer);
  if (exit.spawnError) throw new HeaderFixTestsError("launch-failed");
  if (failure) throw new HeaderFixTestsError(failure, exit.code ?? undefined);
  if (exit.code !== 0) throw new HeaderFixTestsError("failed", exit.code ?? undefined);
  return { status: "passed", exitCode: 0, durationMs: Date.now() - started, outputBytes, outputTruncated };
}

function unifiedDiff(file: string, before: string, after: string): string {
  const oldLines = before.replace(/\n$/, "").split("\n");
  const newLines = after.replace(/\n$/, "").split("\n");
  return [`--- a/${file}`, `+++ b/${file}`, `@@ -1,${oldLines.length} +1,${newLines.length} @@`, ...oldLines.map((line) => `-${line}`), ...newLines.map((line) => `+${line}`)].join("\n");
}

/** Stable approval identity for the exact workspace being modified. */
export async function headerFixWorkspaceTarget(projectRoot: string): Promise<string> {
  return `workspace:${await realpath(resolve(projectRoot))}`;
}

export async function authorizeHeaderFix(receipt: ApprovalReceipt, plannedFiles: readonly string[], at: string, projectRoot: string): Promise<{ readonly allowed: boolean; readonly reason?: string }> {
  const authorization = authorizeAgentAction("mutate", receipt, at);
  if (!authorization.allowed) return { allowed: false, reason: authorization.reason };
  if (receipt.target !== await headerFixWorkspaceTarget(projectRoot)) return { allowed: false, reason: "workspace-target-mismatch" };
  const planned = [...new Set(plannedFiles)].sort();
  const approved = [...new Set(receipt.files)].sort();
  if (planned.length !== approved.length || planned.some((file, index) => file !== approved[index])) return { allowed: false, reason: "file-scope-mismatch" };
  return { allowed: true };
}

/** Atomically replace an already-planned regular file without following a raced-in symlink. */
async function replaceRegularFile(path: string, content: string): Promise<void> {
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > 1 * 1024 * 1024) throw new Error("Next.js config changed before mutation.");
  await replaceWithRegularFile(path, Buffer.from(content, "utf8"), entry.mode & 0o777);
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
  try {
    const entry = await lstat(join(projectRoot, "src"));
    if (entry.isDirectory() && !entry.isSymbolicLink()) return "src";
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) throw error;
  }
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
        if (NEXT_CONFIG_DECL.test(content)) {
          const updated = content.replace(NEXT_CONFIG_DECL, (match) => `${match}${NEXT_HEADERS_BLOCK}`);
          return [{ file: name, action: "patch", preview: previewLines(NEXT_HEADERS_BLOCK), diff: unifiedDiff(name, content, updated) }];
        }
      } catch { /* unavailable config is not a mutation target */ }
    }
    return [];
  }
  if (type === "express" || type === "fastify" || type === "node" || type === "react") {
    const file = contractPath(join(await pickSrcDir(projectRoot), "verglos-security-headers.ts"));
    const filesystemFile = join(projectRoot, ...file.split("/"));
    if (await fileExists(filesystemFile)) return [{ file, action: "skip" }];
    const content = HEADERS_HELPER_TS + (HEADERS_HELPER_EXTRAS[type] ?? "");
    return [{ file, action: "create", preview: previewLines(content), diff: unifiedDiff(file, "", content) }];
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
    const authorization = await authorizeHeaderFix(options.approvalReceipt, plannedFiles, options.now ?? new Date().toISOString(), projectRoot);
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
