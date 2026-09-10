import assert from "node:assert/strict";
import { test } from "node:test";
import { inspectConfigMigration } from "./config.js";

test("config migration inspection is current and warning-free for defaults", () => {
  assert.deepEqual(inspectConfigMigration({}), { status: "current", warnings: [] });
});

test("config migration inspection reports obsolete and deferred fields deterministically", () => {
  const result = inspectConfigMigration({ plan: "pro", hunt: { sandbox: "firecracker" }, attest: { verifyUrlBase: "https://example.com/verify", whiteLabel: {} }, zed: true });
  assert.equal(result.status, "legacy");
  assert.deepEqual(result.warnings.map((warning) => warning.id), ["obsolete-sandbox", "legacy-plan", "legacy-attest", "unknown-field"]);
});

test("config migration inspection does not accept malformed values", () => {
  assert.deepEqual(inspectConfigMigration({ failThreshold: 101 }), { status: "invalid", warnings: [] });
});
