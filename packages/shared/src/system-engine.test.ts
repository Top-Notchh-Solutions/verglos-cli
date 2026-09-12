import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { inspectSystemEngine, SystemEngineError, type SystemEngineProbe } from "./system-engine.js";

async function fixtureBinary(): Promise<{ root: string; path: string; bytes: Buffer }> {
  const root = await mkdtemp(join(tmpdir(), "verglos-system-engine-"));
  const path = join(root, "trivy-fixture");
  const bytes = Buffer.from("fixture executable bytes");
  await writeFile(path, bytes);
  return { root, path, bytes };
}

const completeProbe: SystemEngineProbe = async (_path, args, bounds) => {
  assert.deepEqual(bounds, { timeoutMs: 5_000, maxOutputBytes: 256 * 1024 });
  if (args[0] === "--help") return { stdout: "Usage: trivy [global flags] command target\n" };
  if (args[0] === "--version") return { stdout: "Trivy 0.60.0\n" };
  return { stdout: `Usage: trivy ${args[0]} [flags]\n` };
};

test("system engine requires an explicit absolute regular file path", async () => {
  await assert.rejects(() => inspectSystemEngine("trivy"), (error: unknown) => error instanceof SystemEngineError && error.code === "PATH_REQUIRED");
  const root = await mkdtemp(join(tmpdir(), "verglos-engine-dir-"));
  try { await assert.rejects(() => inspectSystemEngine(root), (error: unknown) => error instanceof SystemEngineError && error.code === "NOT_EXECUTABLE"); }
  finally { await rm(root, { recursive: true, force: true }); }
});

test("system engine hashes the explicit binary and confirms bounded Trivy capability probes", async () => {
  const fixture = await fixtureBinary();
  try {
    const calls: string[][] = [];
    const probe: SystemEngineProbe = async (path, args, bounds) => {
      assert.equal(path, fixture.path);
      calls.push([...args]);
      return completeProbe(path, args, bounds);
    };
    const result = await inspectSystemEngine(fixture.path, { probe });
    assert.equal(result.version, "0.60.0");
    assert.equal(result.digest.value, createHash("sha256").update(fixture.bytes).digest("hex"));
    assert.equal(result.trust, "computed-only");
    assert.equal(result.state, "capabilities-confirmed");
    assert.deepEqual(result.capabilities, ["filesystem", "repository", "image", "configuration", "sbom"]);
    assert.deepEqual(result.unsupportedCapabilities, []);
    assert.match(result.limitations.join(" "), /computed-only/);
    assert.deepEqual(calls, [["--help"], ["--version"], ["fs", "--help"], ["repo", "--help"], ["image", "--help"], ["config", "--help"], ["sbom", "--help"]]);
  } finally { await rm(fixture.root, { recursive: true, force: true }); }
});

test("unsupported or unbounded capability probes remain partial rather than inferred", async () => {
  const fixture = await fixtureBinary();
  try {
    const result = await inspectSystemEngine(fixture.path, { probe: async (path, args, bounds) => {
      if (args[0] === "image") throw new Error("untrusted stderr must not escape");
      return completeProbe(path, args, bounds);
    } });
    assert.equal(result.state, "partial");
    assert.ok(result.capabilities.includes("filesystem"));
    assert.deepEqual(result.unsupportedCapabilities, ["image"]);
    assert.equal(JSON.stringify(result).includes("untrusted stderr"), false);
  } finally { await rm(fixture.root, { recursive: true, force: true }); }
});

test("unrecognized version and binary replacement fail closed", async () => {
  const fixture = await fixtureBinary();
  try {
    const unrecognized = await inspectSystemEngine(fixture.path, { probe: async (_path, args) => ({ stdout: args[0] === "--help" ? "Usage: trivy command target" : "Trivy development build" }) });
    assert.equal(unrecognized.state, "unavailable");
    assert.deepEqual(unrecognized.capabilities, []);
    await assert.rejects(() => inspectSystemEngine(fixture.path, { probe: async (_path, args) => {
      if (args[0] === "--help") return { stdout: "Usage: trivy command target" };
      if (args[0] === "--version") {
        await writeFile(fixture.path, "replaced binary bytes");
        return { stdout: "Trivy 0.60.0" };
      }
      return { stdout: `Usage: trivy ${args[0]} [flags]` };
    } }), (error: unknown) => error instanceof SystemEngineError && error.code === "BINARY_CHANGED");
  } finally { await rm(fixture.root, { recursive: true, force: true }); }
});

test("default system-engine probes do not inherit the caller environment", { skip: process.platform === "win32" }, async () => {
  const fixture = await fixtureBinary();
  const key = "VERGLOS_ENGINE_PROBE_SENTINEL";
  const previous = process.env[key];
  try {
    await writeFile(fixture.path, `#!/bin/sh\ncase "$1" in\n  --help) if [ "$${key}" = "sensitive-value" ]; then printf 'not a Trivy executable\\n'; else printf 'Usage: trivy [global flags] command target\\n'; fi ;;\n  --version) printf 'Trivy 0.60.0\\n' ;;\n  fs) printf 'Usage: trivy filesystem [flags] PATH\\n' ;;\n  repo) printf 'Usage: trivy repository [flags] PATH\\n' ;;\n  image) printf 'Usage: trivy image [flags] IMAGE\\n' ;;\n  config) printf 'Usage: trivy config [flags] DIR\\n' ;;\n  sbom) printf 'Usage: trivy sbom [flags] SBOM\\n' ;;\nesac\n`);
    await chmod(fixture.path, 0o700);
    process.env[key] = "sensitive-value";
    const result = await inspectSystemEngine(fixture.path);
    assert.equal(result.state, "capabilities-confirmed");
    assert.deepEqual(result.capabilities, ["filesystem", "repository", "image", "configuration", "sbom"]);
  } finally {
    if (previous === undefined) delete process.env[key]; else process.env[key] = previous;
    await rm(fixture.root, { recursive: true, force: true });
  }
});
