import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { MAX_RELEASE_ARTIFACT_BYTES, readBoundedRegularFile } from "./release-artifact-files.mjs";

const execFileAsync = promisify(execFile);
const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = process.argv[2] ?? join(repositoryRoot, ".artifacts", "release-rollback");
const manifestPath = join(repositoryRoot, "scripts", "fixtures", "release-rollback-rehearsal.json");
const manifestBytes = await readBoundedRegularFile(
  manifestPath,
  MAX_RELEASE_ARTIFACT_BYTES,
  "release rollback rehearsal manifest",
);
const manifestDigest = `sha256:${createHash("sha256").update(manifestBytes).digest("hex")}`;
const command = [
  join(repositoryRoot, "packages", "cli", "dist", "index.js"),
  "release",
  "rollback-rehearsal",
  manifestPath,
  "--json",
  "--quiet",
];

function boundedText(value, maxBytes = 16 * 1024) {
  const text = String(value ?? "");
  return Buffer.byteLength(text, "utf8") <= maxBytes
    ? text
    : `${Buffer.from(text, "utf8").subarray(0, maxBytes).toString("utf8")}\n[truncated]`;
}

const startedAt = new Date().toISOString();
let execution;
try {
  execution = await execFileAsync(process.execPath, command, {
    cwd: repositoryRoot,
    encoding: "utf8",
    maxBuffer: 64 * 1024,
  });
} catch (error) {
  execution = error;
}

const stdout = boundedText(execution.stdout);
const stderr = boundedText(execution.stderr);
let rehearsal;
try {
  rehearsal = JSON.parse(stdout);
} catch {
  rehearsal = undefined;
}

const report = {
  schema: "urn:verglos:evidence:release-rollback-rehearsal:v1",
  startedAt,
  completedAt: new Date().toISOString(),
  sourceCommit: (await execFileAsync("git", ["rev-parse", "HEAD"], { cwd: repositoryRoot, encoding: "utf8" })).stdout.trim(),
  command: `node packages/cli/dist/index.js release rollback-rehearsal scripts/fixtures/release-rollback-rehearsal.json --json --quiet`,
  platform: process.platform,
  arch: process.arch,
  node: process.version,
  exitCode: typeof execution.code === "number" ? execution.code : 0,
  status: rehearsal?.status ?? "invalid-output",
  manifestDigest: typeof rehearsal?.manifestDigest === "string" ? rehearsal.manifestDigest : null,
  manifestDigestMatchesFixture: rehearsal?.manifestDigest === manifestDigest,
  operationCount: rehearsal?.operationCount ?? 0,
  historicalRecordCount: rehearsal?.historicalRecordCount ?? 0,
  historicalRecordsPreserved: rehearsal?.historicalRecordsPreserved === true,
  operations: Array.isArray(rehearsal?.operations)
    ? rehearsal.operations.map((operation) => ({ id: operation.id, kind: operation.kind, action: operation.action }))
    : [],
  limitations: [
    "This is a local decision-contract rehearsal; it does not call npm, a registry, a signing provider, a Hunt feed provider, or Vercel.",
    "Fixture references are synthetic immutable identifiers and do not represent a live release or revoked credential.",
    "Historical-record preservation is checked by comparing bounded fixture references before and after the in-memory rehearsal.",
  ],
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(join(outputDirectory, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeFile(join(outputDirectory, "run.log"), `${stdout}${stderr ? `\n${stderr}` : ""}`, "utf8");

const passed = report.exitCode === 0
  && report.status === "passed"
  && report.manifestDigest === manifestDigest
  && report.manifestDigestMatchesFixture
  && report.operationCount === 5
  && report.historicalRecordsPreserved;
if (!passed) {
  process.stderr.write(`Release rollback rehearsal failed; see ${join(outputDirectory, "run.log")}\n`);
  process.exit(report.exitCode || 1);
}
process.stdout.write(`${JSON.stringify(report)}\n`);
