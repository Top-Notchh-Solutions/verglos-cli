import { execFile } from "node:child_process";
import { constants } from "node:fs";
import { lstat, open } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const defaultRun = promisify(execFile);
const MAX_ARTIFACT_BYTES = 16 * 1024 * 1024;
const MAX_TOOL_BYTES = 128 * 1024 * 1024;
const MAX_TOOL_OUTPUT_BYTES = 128 * 1024;
const MAX_TOOL_TIMEOUT_MS = 120_000;
const JSON_ARTIFACTS = new Map([
  ["report.sarif", "SARIF"],
  ["SBOM.cdx.json", "CycloneDX"],
  ["SBOM.spdx.json", "SPDX"],
]);

/**
 * Run the official validators against bounded release qualification artifacts.
 * Tool output is deliberately discarded: the result is a bounded status
 * record, not a transport for arbitrary validator output or local paths.
 */
export async function validateStandardArtifacts(input) {
  const root = await validateArtifactRoot(input?.artifactRoot);
  const run = input.run ?? defaultRun;
  const tools = input.tools ?? {};
  const strict = input.strict === true;
  const checks = [];

  const artifacts = new Map();
  for (const [name, format] of JSON_ARTIFACTS) {
    const artifact = await inspectArtifact(root, name, format);
    artifacts.set(name, artifact);
  }

  checks.push(await validateSarif(artifacts.get("report.sarif"), root, tools.sarif ?? process.env.VERGLOS_SARIF_MULTITOOL ?? "sarif-multitool", run));
  checks.push(await validateCycloneDx(artifacts.get("SBOM.cdx.json"), root, tools.cyclonedx ?? process.env.VERGLOS_CYCLONEDX_CLI ?? "cyclonedx", run));
  checks.push(await validateSpdx(artifacts.get("SBOM.spdx.json"), root, tools.spdxJavaJar ?? process.env.VERGLOS_SPDX_TOOL_JAR, run));
  checks.push(await validateSigstore(root, input.sigstore, tools.cosign ?? process.env.VERGLOS_COSIGN ?? "cosign", run));

  const failed = checks.filter((check) => check.status === "failed").length;
  const unsupported = checks.filter((check) => check.status === "not-supported").length;
  const passed = checks.filter((check) => check.status === "passed").length;
  const result = failed > 0 || (strict && unsupported > 0)
    ? "failed"
    : unsupported > 0
      ? "inconclusive"
      : "passed";

  return Object.freeze({
    schema: "urn:verglos:standard-validation:v1",
    artifactRoot: basename(root),
    strict,
    result,
    passed,
    unsupported,
    failed,
    checks: Object.freeze(checks.map((check) => Object.freeze(check))),
  });
}

async function validateArtifactRoot(value) {
  if (typeof value !== "string" || !value) throw new Error("standard validation artifact root is required");
  const root = resolve(value);
  const entry = await lstat(root);
  if (!entry.isDirectory() || entry.isSymbolicLink()) throw new Error("standard validation artifact root must be a regular directory");
  return root;
}

async function inspectArtifact(root, name, format) {
  const path = join(root, name);
  let handle;
  try {
    const before = await lstat(path);
    if (before.isSymbolicLink() || !before.isFile() || before.size > MAX_ARTIFACT_BYTES) {
      return { name, path, status: "failed", reason: "invalid-artifact-file" };
    }
    handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    const opened = await handle.stat();
    if (opened.isSymbolicLink() || !opened.isFile() || opened.size !== before.size || opened.size > MAX_ARTIFACT_BYTES) {
      return { name, path, status: "failed", reason: "artifact-changed-or-unbounded" };
    }
    const chunks = [];
    let total = 0;
    const buffer = Buffer.alloc(Math.min(64 * 1024, MAX_ARTIFACT_BYTES + 1));
    while (total <= MAX_ARTIFACT_BYTES) {
      const length = Math.min(buffer.byteLength, MAX_ARTIFACT_BYTES + 1 - total);
      const { bytesRead } = await handle.read(buffer, 0, length, total);
      if (bytesRead === 0) break;
      total += bytesRead;
      if (total > MAX_ARTIFACT_BYTES) return { name, path, status: "failed", reason: "artifact-changed-or-unbounded" };
      chunks.push(Buffer.from(buffer.subarray(0, bytesRead)));
    }
    if ((await handle.stat()).size !== total || total !== before.size) return { name, path, status: "failed", reason: "artifact-changed-or-unbounded" };
    JSON.parse(Buffer.concat(chunks, total).toString("utf8"));
    return { name, path, status: "ready", format };
  } catch (error) {
    if (error?.code === "ENOENT") return { name, path, status: "failed", reason: "missing-artifact" };
    if (error instanceof SyntaxError) return { name, path, status: "failed", reason: "invalid-json" };
    return { name, path, status: "failed", reason: "unreadable-artifact" };
  } finally {
    if (handle) await handle.close().catch(() => undefined);
  }
}

async function validateSarif(artifact, root, tool, run) {
  return validateExternalTool({
    id: "sarif",
    format: "SARIF 2.1.0",
    artifact,
    root,
    tool,
    args: (path) => ["validate", path],
    run,
  });
}

async function validateCycloneDx(artifact, root, tool, run) {
  const args = basename(tool) === "cdx-validate"
    ? (path) => ["-i", path]
    : (path) => ["validate", "--input-file", path, "--fail-on-errors"];
  return validateExternalTool({
    id: "cyclonedx",
    format: "CycloneDX",
    artifact,
    root,
    tool,
    args,
    run,
  });
}

async function validateSpdx(artifact, root, jar, run) {
  const base = { id: "spdx", format: "SPDX", artifact: artifact?.name ?? "SBOM.spdx.json" };
  if (artifact?.status !== "ready") return resultForArtifact(base, artifact);
  if (typeof jar !== "string" || !jar) return { ...base, status: "not-supported", reason: "official-spdx-tool-not-configured" };
  const jarPath = resolve(jar);
  try {
    const entry = await lstat(jarPath);
    if (entry.isSymbolicLink() || !entry.isFile() || entry.size > MAX_TOOL_BYTES) return { ...base, status: "failed", reason: "invalid-spdx-tool" };
  } catch (error) {
    return error?.code === "ENOENT" ? { ...base, status: "not-supported", reason: "official-spdx-tool-not-installed" } : { ...base, status: "failed", reason: "invalid-spdx-tool" };
  }
  return runExternalTool({ ...base, tool: "java", args: ["-jar", jarPath, "Verify", artifact.path], cwd: root, run });
}

async function validateSigstore(root, configured, tool, run) {
  const config = configured ?? {};
  const payloadPath = resolve(config.payloadPath ?? join(root, "sigstore.payload"));
  const bundlePath = resolve(config.bundlePath ?? join(root, "sigstore.bundle.json"));
  const keyPath = config.keyPath === undefined ? resolve(join(root, "sigstore.pub")) : resolve(config.keyPath);
  const trustedRootPath = config.trustedRootPath === undefined ? undefined : resolve(config.trustedRootPath);
  const identity = config.identity;
  const issuer = config.issuer;
  const names = { id: "sigstore", format: "Sigstore bundle", artifact: basename(payloadPath) };
  const paths = [payloadPath, bundlePath, trustedRootPath ?? keyPath];
  const states = await Promise.all(paths.map((path) => boundedPathState(path)));
  const anyPresent = states.some((state) => state === "present");
  if (!anyPresent) return { ...names, status: "not-supported", reason: "sigstore-fixture-not-configured" };
  if (states.some((state) => state !== "present")) return { ...names, status: "failed", reason: "incomplete-sigstore-fixture" };

  const args = ["verify-blob", "--bundle", bundlePath, "--offline=true"];
  if (trustedRootPath !== undefined) {
    if (typeof identity !== "string" || !identity || typeof issuer !== "string" || !issuer) return { ...names, status: "failed", reason: "sigstore-identity-policy-missing" };
    args.push("--trusted-root", trustedRootPath, "--certificate-identity", identity, "--certificate-oidc-issuer", issuer);
  } else {
    // The qualification fixture is intentionally offline and does not submit
    // a public Rekor entry. Keep the verification explicit about that scope.
    args.push("--insecure-ignore-tlog", "--key", keyPath);
  }
  args.push(payloadPath);
  return runExternalTool({ ...names, tool, args, cwd: root, run });
}

async function boundedPathState(path) {
  try {
    const entry = await lstat(path);
    return entry.isFile() && !entry.isSymbolicLink() && entry.size <= MAX_ARTIFACT_BYTES ? "present" : "invalid";
  } catch (error) {
    return error?.code === "ENOENT" ? "missing" : "invalid";
  }
}

function resultForArtifact(base, artifact) {
  return { ...base, status: artifact?.status === "ready" ? "failed" : "failed", reason: artifact?.reason ?? "invalid-artifact-file" };
}

async function validateExternalTool({ id, format, artifact, root, tool, args, run }) {
  const base = { id, format, artifact: artifact?.name ?? "unknown" };
  if (artifact?.status !== "ready") return resultForArtifact(base, artifact);
  return runExternalTool({ ...base, tool, args: args(artifact.path), cwd: root, run });
}

async function runExternalTool({ id, format, artifact, tool, args, cwd, run }) {
  try {
    const result = await run(tool, args, {
      cwd,
      timeout: MAX_TOOL_TIMEOUT_MS,
      maxBuffer: MAX_TOOL_OUTPUT_BYTES,
      encoding: "utf8",
      shell: false,
    });
    const exitCode = result?.exitCode;
    if (exitCode !== undefined && (!Number.isSafeInteger(exitCode) || exitCode < 0 || exitCode > 255)) {
      return { id, format, artifact, tool: basename(tool), status: "failed", reason: "invalid-tool-exit-code" };
    }
    return { id, format, artifact, tool: basename(tool), status: "passed" };
  } catch (error) {
    if (error?.code === "ENOENT") return { id, format, artifact, tool: basename(tool), status: "not-supported", reason: "official-tool-not-installed" };
    return { id, format, artifact, tool: basename(tool), status: "failed", reason: error?.code === "ETIMEDOUT" ? "official-tool-timeout" : "official-tool-rejected-artifact" };
  }
}

function parseArguments(argv) {
  const args = [...argv];
  const artifactRoot = args.shift();
  if (!artifactRoot) throw new Error("usage: node scripts/verify-standard-validation.mjs <artifact-root> [--strict] [--json]");
  const strict = args.includes("--strict");
  const json = args.includes("--json");
  if (args.some((arg) => arg !== "--strict" && arg !== "--json")) throw new Error("unsupported standard validation option");
  return { artifactRoot, strict, json };
}

async function main() {
  try {
    const options = parseArguments(process.argv.slice(2));
    const result = await validateStandardArtifacts(options);
    if (options.json) process.stdout.write(`${JSON.stringify(result)}\n`);
    else process.stdout.write(`standard validation ${result.result}: ${result.passed} passed, ${result.unsupported} unsupported, ${result.failed} failed\n`);
    process.exitCode = result.result === "failed" ? 1 : 0;
  } catch (error) {
    process.stderr.write(`standard validation failed: ${error instanceof Error ? error.message : "invalid input"}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();

export const STANDARD_VALIDATION_LIMITS = Object.freeze({ MAX_ARTIFACT_BYTES, MAX_TOOL_BYTES, MAX_TOOL_OUTPUT_BYTES, MAX_TOOL_TIMEOUT_MS });
