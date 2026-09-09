import assert from "node:assert/strict";
import { test } from "node:test";
import { trivyAdapter, trivyExecutionProfile } from "./trivy-adapter.js";

test("Trivy adapter reports unavailable health explicitly when binary is absent", async () => {
  const health = await trivyAdapter.health();
  assert.ok(["healthy", "unavailable"].includes(health.state));
});

test("Trivy profiles map subjects without executing target code", () => {
  assert.deepEqual(trivyExecutionProfile("repository-tree", "subject-1").command, "repo");
  assert.deepEqual(trivyExecutionProfile("oci-manifest", "subject-1").command, "image");
  assert.equal(trivyExecutionProfile("filesystem", "subject-1").executesTargetCode, false);
  assert.throws(() => trivyExecutionProfile("artifact", ""), /identity/);
});
