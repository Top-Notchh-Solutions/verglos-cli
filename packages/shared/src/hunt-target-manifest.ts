import { readdir, readFile, lstat } from "node:fs/promises";
import { basename, extname, join, relative, resolve } from "node:path";
import { z } from "zod";
import { VERGLOS_SCHEMA_IDS, classifySchemaCompatibility, type SchemaDescriptor } from "./schema.js";
import { RelativeSubjectPathSchema, SubjectIdSchema } from "./subject.js";

export const HUNT_TARGET_MANIFEST_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.huntTargetManifest,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

const MAX_FILES = 512;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024;
const MAX_FILE_BYTES = 512 * 1024;
const MAX_DEPTH = 12;
const MAX_ITEMS = 128;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;
const SOURCE_EXTENSIONS = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);
const IGNORED_DIRECTORIES = new Set([".git", ".next", ".worktrees", "build", "coverage", "dist", "node_modules", "vendor"]);
const BUILTIN_MODULES = new Set([
  "assert", "buffer", "child_process", "cluster", "crypto", "events", "fs", "http", "https", "module",
  "net", "os", "path", "perf_hooks", "process", "querystring", "readline", "stream", "string_decoder",
  "timers", "tls", "tty", "url", "util", "v8", "vm", "worker_threads", "zlib",
]);
const FRAMEWORK_PACKAGES = new Set([
  "@angular/core", "@nestjs/core", "astro", "express", "fastify", "hono", "koa", "next", "nuxt",
  "react", "remix", "svelte", "vue",
]);

const SafeTextSchema = z.string().min(1).max(512).refine((value) => !CONTROL_CHARACTERS.test(value), "text contains control characters");
const RoutePathSchema = z.string().min(1).max(512).refine((value) => !CONTROL_CHARACTERS.test(value), "route contains control characters");

const HuntEntrypointSchema = z.object({
  path: RelativeSubjectPathSchema,
  kind: z.enum(["config", "script", "source", "test"]),
  name: SafeTextSchema.optional(),
}).strict();

const HuntRouteSchema = z.object({
  method: z.string().min(1).max(16).regex(/^[A-Z]+$/u),
  path: RoutePathSchema,
  file: RelativeSubjectPathSchema,
}).strict();

const HuntCandidateSinkSchema = z.object({
  kind: z.enum(["command-execution", "dynamic-code", "file-boundary", "network-request", "xss"]),
  path: RelativeSubjectPathSchema,
  line: z.number().int().positive().safe(),
  confidence: z.literal("candidate"),
}).strict();

const HuntCoverageSchema = z.object({
  status: z.enum(["complete", "incomplete"]),
  filesInspected: z.number().int().nonnegative().safe(),
  bytesInspected: z.number().int().nonnegative().safe(),
  limitations: z.array(SafeTextSchema).max(32),
}).strict();

export const HuntTargetManifestSchema = z.object({
  schemaId: z.literal(HUNT_TARGET_MANIFEST_SCHEMA.id),
  schemaVersion: z.literal(HUNT_TARGET_MANIFEST_SCHEMA.version),
  targetSubjectId: SubjectIdSchema,
  frameworks: z.array(SafeTextSchema).max(MAX_ITEMS),
  entrypoints: z.array(HuntEntrypointSchema).max(MAX_ITEMS),
  routes: z.array(HuntRouteSchema).max(MAX_ITEMS),
  apis: z.array(HuntRouteSchema).max(MAX_ITEMS),
  dependencyBoundaries: z.array(SafeTextSchema).max(MAX_ITEMS),
  agentMcpTools: z.array(SafeTextSchema).max(MAX_ITEMS),
  candidateSinks: z.array(HuntCandidateSinkSchema).max(MAX_ITEMS),
  coverage: HuntCoverageSchema,
}).strict();

export type HuntTargetManifest = z.infer<typeof HuntTargetManifestSchema>;
export type HuntTargetEntrypoint = z.infer<typeof HuntEntrypointSchema>;
export type HuntTargetRoute = z.infer<typeof HuntRouteSchema>;
export type HuntCandidateSink = z.infer<typeof HuntCandidateSinkSchema>;

export interface HuntTargetManifestOptions {
  readonly root: string;
  readonly targetSubjectId: string;
}

interface PackageMetadata {
  readonly dependencies: Set<string>;
  readonly frameworks: Set<string>;
  readonly scripts: Set<string>;
}

interface ScanState {
  readonly entrypoints: HuntTargetEntrypoint[];
  readonly routes: HuntTargetRoute[];
  readonly apis: HuntTargetRoute[];
  readonly dependencies: Set<string>;
  readonly frameworks: Set<string>;
  readonly tools: Set<string>;
  readonly sinks: HuntCandidateSink[];
  readonly limitations: Set<string>;
  filesInspected: number;
  bytesInspected: number;
  stopped: boolean;
}

function addBounded<T>(items: T[], value: T): void {
  if (items.length < MAX_ITEMS) items.push(value);
}

function addUniqueBounded(items: Set<string>, value: string): void {
  if (items.size < MAX_ITEMS || items.has(value)) items.add(value);
}

function relativePath(root: string, path: string): string {
  return relative(root, path).split("\\").join("/");
}

function isSafeText(value: string): boolean {
  return value.length > 0 && value.length <= 512 && !CONTROL_CHARACTERS.test(value);
}

function packageNameFromSpecifier(specifier: string): string | undefined {
  if (!specifier || specifier.startsWith(".") || specifier.startsWith("/") || specifier.startsWith("#") || specifier.startsWith("node:")) return undefined;
  const first = specifier.split("/")[0];
  const name = first?.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : first;
  if (!name || BUILTIN_MODULES.has(name) || !isSafeText(name)) return undefined;
  return name;
}

function sourceKind(path: string): HuntTargetEntrypoint["kind"] {
  const name = basename(path).toLowerCase();
  if (name === "package.json" || name.startsWith("tsconfig") || /(?:^|\.)config\.[cm]?[jt]s$/u.test(name)) return "config";
  if (/(?:^|[./_-])(test|tests|spec|__tests__)(?:[./_-]|$)/u.test(path.toLowerCase()) || /\.(test|spec)\.[^.]+$/u.test(name)) return "test";
  if (SOURCE_EXTENSIONS.has(extname(name))) return "source";
  return "config";
}

function addEntrypoint(state: ScanState, path: string, kind: HuntTargetEntrypoint["kind"], name?: string): void {
  if (state.entrypoints.some((entrypoint) => entrypoint.path === path && entrypoint.name === name)) return;
  addBounded(state.entrypoints, name ? { path: path as HuntTargetEntrypoint["path"], kind, name } : { path: path as HuntTargetEntrypoint["path"], kind });
}

function addCandidateSink(state: ScanState, path: string, kind: HuntCandidateSink["kind"], line: number): void {
  if (state.sinks.some((sink) => sink.path === path && sink.kind === kind && sink.line === line)) return;
  addBounded(state.sinks, { kind, path: path as HuntCandidateSink["path"], line, confidence: "candidate" });
}

function lineAt(source: string, index: number): number {
  let line = 1;
  for (let cursor = 0; cursor < index; cursor += 1) if (source[cursor] === "\n") line += 1;
  return line;
}

function collectMatches(source: string, pattern: RegExp, onMatch: (match: RegExpExecArray) => void): void {
  pattern.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    onMatch(match);
    if (match[0].length === 0) pattern.lastIndex += 1;
  }
}

function inspectSource(state: ScanState, path: string, source: string): void {
  collectMatches(source, /(?:from\s*["'`]([^"'`\r\n]+)|import\s*["'`]([^"'`\r\n]+)|require\s*\(\s*["'`]([^"'`\r\n]+)|import\s*\(\s*["'`]([^"'`\r\n]+))/gu, (match) => {
    const specifier = [match[1], match[2], match[3], match[4]].find((value): value is string => Boolean(value));
    const packageName = specifier ? packageNameFromSpecifier(specifier) : undefined;
    if (packageName) {
      addUniqueBounded(state.dependencies, packageName);
      if (FRAMEWORK_PACKAGES.has(packageName)) addUniqueBounded(state.frameworks, packageName);
    }
  });

  collectMatches(source, /\.(get|post|put|patch|delete|head|options|use)\s*\(\s*["'`]([^"'`\r\n]{1,512})["'`]/gu, (match) => {
    const method = match[1]?.toUpperCase();
    const pathValue = match[2];
    if (method && pathValue && isSafeText(pathValue)) {
      const route = { method, path: pathValue, file: path as HuntTargetRoute["file"] };
      if (!state.routes.some((item) => item.method === route.method && item.path === route.path && item.file === route.file)) {
        addBounded(state.routes, route);
        addBounded(state.apis, route);
      }
    }
  });

  collectMatches(source, /\.(?:tool|registerTool|addTool)\s*\(\s*["'`]([^"'`\r\n]{1,512})["'`]/gu, (match) => {
    const tool = match[1];
    if (tool && isSafeText(tool)) addUniqueBounded(state.tools, tool);
  });

  const sinkPatterns: ReadonlyArray<readonly [HuntCandidateSink["kind"], RegExp]> = [
    ["command-execution", /\b(?:exec|execFile|spawn|fork)\s*\(/gu],
    ["network-request", /\b(?:fetch|axios(?:\.[A-Za-z]+)?|https?\.request)\s*\(/gu],
    ["file-boundary", /\b(?:readFile|writeFile|createReadStream|createWriteStream)\s*\(/gu],
    ["dynamic-code", /\b(?:eval|Function)\s*\(|\bnew\s+Function\s*\(/gu],
    ["xss", /(?:innerHTML\s*=|dangerouslySetInnerHTML\s*[:=])/gu],
  ];
  for (const [kind, pattern] of sinkPatterns) collectMatches(source, pattern, (match) => addCandidateSink(state, path, kind, lineAt(source, match.index)));
}

function metadataRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function inspectPackageMetadata(state: ScanState, path: string, source: string): PackageMetadata {
  const dependencies = new Set<string>();
  const frameworks = new Set<string>();
  const scripts = new Set<string>();
  try {
    const metadata = metadataRecord(JSON.parse(source));
    if (!metadata) throw new Error("package metadata is not an object");
    for (const field of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
      const values = metadataRecord(metadata[field]);
      for (const name of Object.keys(values ?? {})) {
        if (!isSafeText(name)) continue;
        addUniqueBounded(dependencies, name);
        if (FRAMEWORK_PACKAGES.has(name)) addUniqueBounded(frameworks, name);
      }
    }
    const values = metadataRecord(metadata.scripts);
    for (const name of Object.keys(values ?? {})) if (isSafeText(name)) scripts.add(name);
  } catch {
    state.limitations.add("package.json could not be parsed as bounded metadata");
  }
  for (const name of scripts) addEntrypoint(state, path, "script", name);
  return { dependencies, frameworks, scripts };
}

async function scanRoot(root: string): Promise<ScanState> {
  const state: ScanState = {
    entrypoints: [], routes: [], apis: [], dependencies: new Set(), frameworks: new Set(), tools: new Set(), sinks: [], limitations: new Set(),
    filesInspected: 0, bytesInspected: 0, stopped: false,
  };
  async function visit(directory: string, depth: number): Promise<void> {
    if (state.stopped) return;
    if (depth > MAX_DEPTH) { state.limitations.add("directory depth limit reached"); state.stopped = true; return; }
    let entries;
    try { entries = (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name)); }
    catch { state.limitations.add("a directory could not be read"); return; }
    for (const entry of entries) {
      if (state.stopped) return;
      if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
      const absolute = join(directory, entry.name);
      const path = relativePath(root, absolute);
      if (!path || path.startsWith("..")) { state.limitations.add("an out-of-scope path was skipped"); continue; }
      if (entry.isSymbolicLink()) { state.limitations.add("symbolic links were skipped"); continue; }
      if (entry.isDirectory()) { await visit(absolute, depth + 1); continue; }
      if (!entry.isFile()) continue;
      if (state.filesInspected >= MAX_FILES) { state.limitations.add("file inspection limit reached"); state.stopped = true; return; }
      let stat;
      try { stat = await lstat(absolute); } catch { state.limitations.add("a file could not be inspected"); continue; }
      addEntrypoint(state, path, sourceKind(path));
      if (stat.size > MAX_FILE_BYTES || state.bytesInspected + stat.size > MAX_TOTAL_BYTES) {
        state.limitations.add("file byte inspection limit reached");
        continue;
      }
      let bytes: Buffer;
      try { bytes = await readFile(absolute); } catch { state.limitations.add("a file could not be read"); continue; }
      state.filesInspected += 1;
      state.bytesInspected += bytes.byteLength;
      if (path === "package.json") {
        const metadata = inspectPackageMetadata(state, path, bytes.toString("utf8"));
        for (const dependency of metadata.dependencies) addUniqueBounded(state.dependencies, dependency);
        for (const framework of metadata.frameworks) addUniqueBounded(state.frameworks, framework);
      } else if (SOURCE_EXTENSIONS.has(extname(path).toLowerCase())) {
        inspectSource(state, path, bytes.toString("utf8"));
      }
    }
  }
  await visit(root, 0);
  return state;
}

export async function buildHuntTargetManifest(options: HuntTargetManifestOptions): Promise<HuntTargetManifest> {
  const targetSubjectId = SubjectIdSchema.parse(options.targetSubjectId);
  const root = resolve(options.root);
  const rootInfo = await lstat(root);
  if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) throw new Error("Hunt Scout requires a non-symlink directory target.");
  const state = await scanRoot(root);
  const limitations = new Set(state.limitations);
  limitations.add("Static candidate inventory is not reachability or vulnerability proof.");
  limitations.add("Project scripts and source are not executed or uploaded.");
  const manifest = {
    schemaId: HUNT_TARGET_MANIFEST_SCHEMA.id,
    schemaVersion: HUNT_TARGET_MANIFEST_SCHEMA.version,
    targetSubjectId,
    frameworks: [...state.frameworks].sort(),
    entrypoints: [...state.entrypoints].sort((a, b) => `${a.path}:${a.name ?? ""}`.localeCompare(`${b.path}:${b.name ?? ""}`)),
    routes: [...state.routes].sort((a, b) => `${a.file}:${a.method}:${a.path}`.localeCompare(`${b.file}:${b.method}:${b.path}`)),
    apis: [...state.apis].sort((a, b) => `${a.file}:${a.method}:${a.path}`.localeCompare(`${b.file}:${b.method}:${b.path}`)),
    dependencyBoundaries: [...state.dependencies].sort(),
    agentMcpTools: [...state.tools].sort(),
    candidateSinks: [...state.sinks].sort((a, b) => `${a.path}:${a.line}:${a.kind}`.localeCompare(`${b.path}:${b.line}:${b.kind}`)),
    coverage: {
      status: state.limitations.size === 0 ? "complete" as const : "incomplete" as const,
      filesInspected: state.filesInspected,
      bytesInspected: state.bytesInspected,
      limitations: [...limitations].sort(),
    },
  };
  return HuntTargetManifestSchema.parse(manifest);
}

export function parseHuntTargetManifest(value: unknown): HuntTargetManifest {
  const parsed = HuntTargetManifestSchema.safeParse(value);
  if (!parsed.success) throw new Error(`Invalid Hunt target manifest: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`);
  const compatibility = classifySchemaCompatibility(parsed.data.schemaVersion, HUNT_TARGET_MANIFEST_SCHEMA.version);
  if (compatibility === "upgrade-required" || compatibility === "incompatible") throw new Error(`Hunt target manifest schema ${parsed.data.schemaVersion} requires an explicit reader upgrade or migration.`);
  return parsed.data;
}
