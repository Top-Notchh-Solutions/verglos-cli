import assert from "node:assert/strict";
import { test } from "node:test";
import { VerglosConfigSchema, inspectConfigMigration } from "./config.js";

test("config bounds ignore and Hunt collections before scan use", () => {
  assert.equal(VerglosConfigSchema.safeParse({ ignorePaths: ["x".repeat(513)] }).success, false);
  assert.equal(VerglosConfigSchema.safeParse({ ignorePaths: Array.from({ length: 257 }, () => "x") }).success, false);
  assert.equal(VerglosConfigSchema.safeParse({ hunt: { skip: ["x".repeat(513)] } }).success, false);
  assert.equal(VerglosConfigSchema.safeParse({ hunt: { maxDurationMs: 10 * 60 * 1000 + 1 } }).success, false);
});

test("bounded config fields remain compatible with migration inspection", () => {
  const inspection = inspectConfigMigration({ hunt: { sandbox: "firecracker", maxDurationMs: 30_000 } });
  assert.equal(inspection.status, "legacy");
  assert.deepEqual(inspection.warnings.map((warning) => warning.id), ["obsolete-sandbox"]);
});
