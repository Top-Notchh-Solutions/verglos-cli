import assert from "node:assert/strict";
import { test } from "node:test";
import { VerglosConfigSchema, inspectConfigMigration } from "./config.js";

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

test("config migration inspection reports unknown nested fields without applying them", () => {
  const result = inspectConfigMigration({ hunt: { maxDurationMs: 1000, unsafe: true }, attest: { whiteLabel: { footer: "x", palette: "dark" } } });
  assert.equal(result.status, "legacy");
  assert.deepEqual(result.warnings.map((warning) => warning.message), [
    "attest hosted verification and white-label fields are deferred; they are not activated by local config.",
    "unknown config field 'hunt.unsafe' is ignored until a versioned migration defines it.",
    "unknown config field 'attest.whiteLabel.palette' is ignored until a versioned migration defines it.",
  ]);
});

test("config bounds ignore and Hunt collections before scan use", () => {
  assert.equal(VerglosConfigSchema.safeParse({ ignorePaths: ["x".repeat(513)] }).success, false);
  assert.equal(VerglosConfigSchema.safeParse({ ignorePaths: Array.from({ length: 257 }, () => "x") }).success, false);
  assert.equal(VerglosConfigSchema.safeParse({ hunt: { skip: ["x".repeat(513)] } }).success, false);
  assert.equal(VerglosConfigSchema.safeParse({ hunt: { maxDurationMs: 10 * 60 * 1000 + 1 } }).success, false);
});

test("config accepts the canonical Team tier as legacy metadata", () => {
  const parsed = VerglosConfigSchema.parse({ plan: "team" });
  assert.equal(parsed.plan, "team");
  assert.equal(inspectConfigMigration({ plan: "team" }).status, "legacy");
});

test("config accepts the canonical contracted Enterprise tier", () => {
  const parsed = VerglosConfigSchema.parse({ plan: "enterprise" });
  assert.equal(parsed.plan, "enterprise");
});

test("bounded config fields remain compatible with migration inspection", () => {
  const inspection = inspectConfigMigration({ hunt: { sandbox: "firecracker", maxDurationMs: 30_000 } });
  assert.equal(inspection.status, "legacy");
  assert.deepEqual(inspection.warnings.map((warning) => warning.id), ["obsolete-sandbox"]);
});

test("undeclared engine, record, and telemetry sections remain migration warnings", () => {
  const inspection = inspectConfigMigration({
    engine: { id: "trivy" },
    record: { output: ".vgl" },
    telemetry: { enabled: true },
  });
  assert.equal(inspection.status, "legacy");
  assert.deepEqual(inspection.warnings.map((warning) => warning.message), [
    "unknown config field 'engine' is ignored until a versioned migration defines it.",
    "unknown config field 'record' is ignored until a versioned migration defines it.",
    "unknown config field 'telemetry' is ignored until a versioned migration defines it.",
  ]);
});
