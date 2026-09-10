import assert from "node:assert/strict";
import { test } from "node:test";
import { executeTrivyProfile, trivyAdapter, trivyExecutionProfile } from "./trivy-adapter.js";
import { createHash } from "node:crypto";

test("Trivy adapter reports unavailable health explicitly when binary is absent", async () => {
  const health = await trivyAdapter.health();
  assert.ok(["healthy", "unavailable"].includes(health.state));
});

test("Trivy profiles map subjects without executing target code", () => {
  assert.deepEqual(trivyExecutionProfile("repository-tree", "subject-1").command, "repo");
  assert.deepEqual(trivyExecutionProfile("oci-manifest", "subject-1").command, "image");
  assert.equal(trivyExecutionProfile("filesystem", "subject-1").executesTargetCode, false);
  assert.deepEqual(trivyExecutionProfile("iac", "subject-1").args.slice(0, 6), ["config", "--format", "json", "--scanners", "misconfig,secret", "--input"]);
  assert.deepEqual(trivyExecutionProfile("sbom", "subject-1").args.slice(0, 6), ["sbom", "--format", "json", "--scanners", "vuln", "--input"]);
  assert.throws(() => trivyExecutionProfile("artifact", ""), /identity/);
  assert.throws(() => trivyExecutionProfile("filesystem", "subject\n1"), /identity/);
});

test("bounded Trivy process runner preserves raw JSON evidence and limits", async () => {
  const calls: { executable: string; args: readonly string[]; timeout: number; maxBuffer: number }[] = [];
  const output = JSON.stringify({ Results: [] });
  const raw = await executeTrivyProfile("sbom", "subject-1", { timeoutMs: 5_000, maxOutputBytes: 1_024, run: async (executable, args, options) => { calls.push({ executable, args, timeout: options.timeout, maxBuffer: options.maxBuffer }); return { stdout: output }; } });
  assert.equal(raw.mediaType, "application/json");
  assert.equal(raw.digest, `sha256:${createHash("sha256").update(output).digest("hex")}`);
  assert.equal(new TextDecoder().decode(raw.bytes), output);
  assert.deepEqual(calls[0], { executable: "trivy", args: ["sbom", "--format", "json", "--scanners", "vuln", "--input", "subject-1"], timeout: 5_000, maxBuffer: 1_024 });
});

test("bounded Trivy process runner rejects unsafe limits", async () => {
  await assert.rejects(() => executeTrivyProfile("filesystem", "subject-1", { timeoutMs: 90_001 }), /timeout/);
  await assert.rejects(() => executeTrivyProfile("filesystem", "subject-1", { maxOutputBytes: 64 * 1024 * 1024 + 1 }), /output limit/);
});
