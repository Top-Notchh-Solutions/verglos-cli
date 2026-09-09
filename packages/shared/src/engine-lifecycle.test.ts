import assert from "node:assert/strict";
import { test } from "node:test";
import { planEngineLifecycle } from "./engine-lifecycle.js";

test("engine lifecycle plans read-only status and approved mutations", () => {
  assert.deepEqual(planEngineLifecycle({ action: "status", engineId: "trivy", sourceAvailable: false, compatible: false }), { allowed: true, action: "status", requiresMutation: false });
  assert.deepEqual(planEngineLifecycle({ action: "install", engineId: "trivy", requestedVersion: "1.0.0", sourceAvailable: true, compatible: true }), { allowed: false, reason: "approval-required" });
  assert.deepEqual(planEngineLifecycle({ action: "install", engineId: "trivy", requestedVersion: "1.0.0", approvalGranted: true, sourceAvailable: true, compatible: true }), { allowed: true, action: "install", requiresMutation: true, targetVersion: "1.0.0" });
});

test("engine lifecycle rejects unavailable, incompatible, and unsafe transitions", () => {
  const unavailable = planEngineLifecycle({ action: "update", engineId: "trivy", requestedVersion: "2", sourceAvailable: false, compatible: true, approvalGranted: true });
  assert.equal(unavailable.allowed, false); if (!unavailable.allowed) assert.equal(unavailable.reason, "source-unavailable");
  const incompatible = planEngineLifecycle({ action: "update", engineId: "trivy", requestedVersion: "2", currentVersion: "1", sourceAvailable: true, compatible: false, approvalGranted: true });
  assert.equal(incompatible.allowed, false); if (!incompatible.allowed) assert.equal(incompatible.reason, "incompatible");
  const invalid = planEngineLifecycle({ action: "rollback", engineId: "trivy", currentVersion: "1", rollbackVersion: "1", sourceAvailable: true, compatible: true, approvalGranted: true });
  assert.equal(invalid.allowed, false); if (!invalid.allowed) assert.equal(invalid.reason, "invalid-transition");
});
