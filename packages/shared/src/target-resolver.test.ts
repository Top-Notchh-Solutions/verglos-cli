import assert from "node:assert/strict";
import { test } from "node:test";
import { assertNoExecutionContext, parseTargetSpec, targetCapabilityFor } from "./target-resolver.js";

test("target syntax is explicit and capability mapping is stable", () => {
  assert.deepEqual(parseTargetSpec({ kind: "repository", value: "/repo" }), { kind: "repository", value: "/repo" });
  assert.deepEqual(parseTargetSpec({ kind: "oci", value: "registry.example/app@sha256:" + "a".repeat(64), platform: "linux/arm64" }), {
    kind: "oci", value: "registry.example/app@sha256:" + "a".repeat(64), platform: "linux/arm64",
  });
  assert.equal(targetCapabilityFor("sbom"), "resolve-sbom");
  assert.throws(() => parseTargetSpec({ kind: "repository", value: "" }));
  assert.throws(() => parseTargetSpec({ kind: "unknown", value: "/repo" }));
});

test("target resolution context forbids project execution", () => {
  assert.doesNotThrow(() => assertNoExecutionContext({ cwd: "/repo", allowNetwork: false, executeProjectCode: false }));
  assert.throws(() => assertNoExecutionContext({ cwd: "/repo", allowNetwork: false, executeProjectCode: true as false }));
});
