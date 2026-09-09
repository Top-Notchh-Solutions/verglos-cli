import assert from "node:assert/strict";
import { test } from "node:test";
import { createTrivyRunMetadata } from "./trivy-run-metadata.js";

test("Trivy run metadata records attributable component digests and capabilities", () => {
  const metadata = createTrivyRunMetadata({ version: "0.60.0", binary: "bin", database: "db", checks: "checks", config: "cfg", source: "managed", capabilities: ["trivy.scan", "trivy.scan"], startedAt: "2026-09-09T00:00:00.000Z", completedAt: "2026-09-09T00:00:01.000Z" });
  assert.equal(metadata.license, "Apache-2.0"); assert.deepEqual(metadata.capabilities, ["trivy.scan"]); assert.match(metadata.binaryDigest, /^sha256:/); assert.match(metadata.databaseDigest ?? "", /^sha256:/);
});
test("Trivy run metadata rejects contradictory timing", () => {
  assert.throws(() => createTrivyRunMetadata({ version: "1", binary: "bin", source: "system", capabilities: [], startedAt: "2026-09-09T00:00:01.000Z", completedAt: "2026-09-09T00:00:00.000Z" }), /timestamps/);
});
