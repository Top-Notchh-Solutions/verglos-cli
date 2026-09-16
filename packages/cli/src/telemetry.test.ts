import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import type { ScanResult } from "@verglos/shared";
import {
  buildCoarseTelemetryEvent,
  isTelemetryDisabled,
  readTelemetryConsent,
  writeTelemetryConsent,
} from "./telemetry.js";

function withTemporaryEnvironment<T>(run: () => Promise<T>, value: string): Promise<T> {
  const previousHome = process.env.HOME;
  const previousUserProfile = process.env.USERPROFILE;
  const previousTelemetry = process.env.VERGLOS_TELEMETRY;
  process.env.HOME = value;
  process.env.USERPROFILE = value;
  delete process.env.VERGLOS_TELEMETRY;
  return run().finally(() => {
    if (previousHome === undefined) delete process.env.HOME;
    else process.env.HOME = previousHome;
    if (previousUserProfile === undefined) delete process.env.USERPROFILE;
    else process.env.USERPROFILE = previousUserProfile;
    if (previousTelemetry === undefined) delete process.env.VERGLOS_TELEMETRY;
    else process.env.VERGLOS_TELEMETRY = previousTelemetry;
  });
}

test("analytics preference requires affirmative versioned consent and revocation is durable", async () => {
  const home = await mkdtemp(join(tmpdir(), "verglos-consent-"));
  await withTemporaryEnvironment(async () => {
    assert.equal(await isTelemetryDisabled(), true);
    assert.equal(await isTelemetryDisabled(undefined, true), true);

    const accepted = await writeTelemetryConsent(true);
    assert.equal(accepted.schemaVersion, 1);
    assert.equal(accepted.policyVersion, "2026-09-08");
    assert.equal(await isTelemetryDisabled(), false, "saved affirmative consent is eligible for a future qualified collection path");
    assert.equal(await isTelemetryDisabled(undefined, true), true, "saved interactive consent does not silently enable CI/quiet/agent use");

    process.env.VERGLOS_TELEMETRY = "1";
    assert.equal(await isTelemetryDisabled(undefined, true), false, "an explicit environment opt-in enables a non-interactive run");
    process.env.VERGLOS_TELEMETRY = "0";
    assert.equal(await isTelemetryDisabled(), true, "the environment opt-out is a hard override");

    await writeTelemetryConsent(false);
    delete process.env.VERGLOS_TELEMETRY;
    assert.equal(await isTelemetryDisabled(), true);
    assert.equal((await readTelemetryConsent())?.enabled, false);

    const bytes = await readFile(join(home, ".verglos", "telemetry-consent.json"), "utf8");
    const saved = JSON.parse(bytes) as Record<string, unknown>;
    assert.deepEqual(Object.keys(saved).sort(), ["enabled", "policyVersion", "schemaVersion", "updatedAt"]);
  }, home).finally(() => rm(home, { recursive: true, force: true }));
});

test("consent reader fails closed on unsupported versions and symlinks", async () => {
  const home = await mkdtemp(join(tmpdir(), "verglos-consent-shape-"));
  await withTemporaryEnvironment(async () => {
    const stateDir = join(home, ".verglos");
    const target = join(home, "outside.json");
    await mkdir(stateDir, { recursive: true });
    await writeFile(target, JSON.stringify({ schemaVersion: 999, policyVersion: "future", enabled: true, updatedAt: new Date().toISOString() }));
    await writeFile(join(stateDir, "telemetry-consent.json"), JSON.stringify({ schemaVersion: 999, policyVersion: "future", enabled: true, updatedAt: new Date().toISOString() }));
    assert.equal(await readTelemetryConsent(), null);
    await rm(join(stateDir, "telemetry-consent.json"));
    await symlink(target, join(stateDir, "telemetry-consent.json"));
    assert.equal(await readTelemetryConsent(), null);
    await assert.rejects(writeTelemetryConsent(true), /regular file/u);
  }, home).finally(() => rm(home, { recursive: true, force: true }));
});

test("coarse telemetry event excludes project identity and raw scan data", () => {
  const result = {
    projectRoot: "/Users/example/private-customer-repo",
    projectType: "node",
    scannedAt: "2026-09-13T00:00:00.000Z",
    durationMs: 8_000,
    findings: [{ title: "FINDING_SENTINEL", file: "/private/customer/source.ts", description: "SECRET_SENTINEL" }],
    score: {
      value: 83,
      riskLevel: "medium",
      counts: { critical: 1, high: 3, medium: 5, low: 0, info: 0 },
      testFileFindings: { total: 0, included: false, note: "" },
    },
    unlocked: true,
    provenance: { aiAuthoredPercent: 45, findingDensityAI: 1, findingDensityHuman: 1, densityRatio: 1, criticalsInAIFiles: 1, criticalsTotal: 1, confidence: "high", method: "private" },
  } as unknown as ScanResult;
  const event = buildCoarseTelemetryEvent(result, {
    cliVersion: "2.4.7",
    durationMs: 8_000,
  }, { cliVersion: "2.4.7", nodeVersion: "v22.19.0", platform: "darwin" });
  const serialized = JSON.stringify(event);
  assert.deepEqual(Object.keys(event).sort(), [
    "cli_version", "critical_count_band", "duration_band", "event_id", "finding_count_band", "node_major", "platform_family", "result_band", "schema_version", "score_band",
  ]);
  assert.equal(event.cli_version, "2.4");
  assert.equal(event.node_major, "22");
  assert.equal(event.platform_family, "macos");
  assert.equal(event.score_band, 80);
  assert.equal(event.finding_count_band, "5-19");
  assert.equal(event.critical_count_band, "1-4");
  assert.equal(event.duration_band, "5-15s");
  for (const sentinel of ["private-customer-repo", "FINDING_SENTINEL", "SECRET_SENTINEL", "/private/customer/source.ts", "dependencies"]) {
    assert.equal(serialized.includes(sentinel), false, `telemetry event leaked ${sentinel}`);
  }
  assert.match(event.event_id, /^[0-9a-f-]{36}$/u);
});
