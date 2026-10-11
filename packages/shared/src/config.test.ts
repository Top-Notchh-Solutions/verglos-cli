import assert from "node:assert/strict";
import { test } from "node:test";
import { VerglosConfigSchema, inspectConfigMigration } from "./config.js";

test("versioned config inspection is current and warning-free", () => {
  assert.deepEqual(inspectConfigMigration({ schemaVersion: "1.0.0" }), { status: "current", warnings: [] });
});

test("unversioned configs remain readable but receive an actionable version warning", () => {
  const result = inspectConfigMigration({ failOnCritical: true });
  assert.equal(result.status, "legacy");
  assert.deepEqual(result.warnings.map((warning) => warning.id), ["unversioned-config"]);
  assert.match(result.warnings[0]!.message, /schemaVersion: '1\.0\.0'/);
});

test("config migration inspection reports obsolete and deferred fields deterministically", () => {
  const result = inspectConfigMigration({ plan: "pro", hunt: { sandbox: "firecracker" }, attest: { verifyUrlBase: "https://example.com/verify", whiteLabel: {} }, zed: true });
  assert.equal(result.status, "invalid");
  assert.deepEqual(result.warnings.map((warning) => warning.id), ["obsolete-sandbox", "unversioned-config", "legacy-plan", "inactive-section", "legacy-attest", "unknown-field"]);
  assert.match(result.warnings[0]!.message, /select a supported adapter/);
});

test("config migration inspection does not accept malformed values", () => {
  const inspection = inspectConfigMigration({ schemaVersion: "1.0.0", failThreshold: 101 });
  assert.equal(inspection.status, "invalid");
  assert.match(inspection.warnings[0]!.message, /failThreshold/);
});

test("config migration inspection reports unknown nested fields without applying them", () => {
  const result = inspectConfigMigration({ schemaVersion: "1.0.0", hunt: { maxDurationMs: 1000, unsafe: true }, attest: { whiteLabel: { footer: "x", palette: "dark" } } });
  assert.equal(result.status, "legacy");
  assert.deepEqual(result.warnings.map((warning) => warning.message), [
    "hunt settings are validated for migration only; they do not execute recipes or enable the unsupported Hunt command.",
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

test("config validates versioned engine, record, Hunt, and telemetry sections without granting authority", () => {
  const config = {
    schemaVersion: "1.0.0",
    engine: { id: "trivy" },
    hunt: { sandbox: "docker", maxDurationMs: 30_000, skip: ["D1-001"] },
    record: { output: "release.vgl" },
    telemetry: { enabled: true },
  };
  assert.equal(VerglosConfigSchema.safeParse(config).success, true);
  const inspection = inspectConfigMigration(config);
  assert.equal(inspection.status, "legacy");
  assert.equal(inspection.warnings.filter((warning) => warning.id === "inactive-section").length, 4);
  assert.ok(inspection.warnings.every((warning) => !/consent granted|transmission enabled/i.test(warning.message)));
});

test("version and strict section validation reject unsupported and malformed settings", () => {
  assert.equal(VerglosConfigSchema.safeParse({ schemaVersion: "2.0.0" }).success, false);
  assert.equal(VerglosConfigSchema.safeParse({ schemaVersion: "1.0.0", engine: { id: "trivy", path: "/tmp/trivy" } }).success, false);
  assert.equal(VerglosConfigSchema.safeParse({ schemaVersion: "1.0.0", record: { output: "x", upload: true } }).success, false);
  assert.equal(VerglosConfigSchema.safeParse({ schemaVersion: "1.0.0", telemetry: { enabled: "yes" } }).success, false);
  assert.equal(VerglosConfigSchema.safeParse({ schemaVersion: "1.0.0", hunt: { sandbox: "firecracker" } }).success, false);
  const result = inspectConfigMigration({ schemaVersion: "2.0.0" });
  assert.equal(result.status, "invalid");
  assert.match(result.warnings[0]!.message, /reader for that version/);
});

test("config accepts the canonical contracted Enterprise tier", () => {
  const parsed = VerglosConfigSchema.parse({ plan: "enterprise" });
  assert.equal(parsed.plan, "enterprise");
});

test("bounded config fields remain compatible with migration inspection", () => {
  const inspection = inspectConfigMigration({ hunt: { sandbox: "firecracker", maxDurationMs: 30_000 } });
  assert.equal(inspection.status, "invalid");
  assert.deepEqual(inspection.warnings.map((warning) => warning.id), ["obsolete-sandbox", "unversioned-config", "inactive-section"]);
});

test("validated but inactive engine, record, and telemetry sections remain migration warnings", () => {
  const inspection = inspectConfigMigration({ schemaVersion: "1.0.0", engine: { id: "trivy" }, record: { output: ".vgl" }, telemetry: { enabled: true } });
  assert.equal(inspection.status, "legacy");
  assert.deepEqual(inspection.warnings.map((warning) => warning.id), ["inactive-section", "inactive-section", "inactive-section"]);
});
