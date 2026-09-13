import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { runCliFixture } from "./cli-fixture.js";

const cliEntry = join(process.cwd(), "src", "index.ts");
const tsx = fileURLToPath(import.meta.resolve("tsx"));

test("privacy telemetry commands preview, record versioned consent, and revoke it", async () => {
  const cwd = await mkdtemp(join(tmpdir(), "verglos-privacy-cwd-"));
  const home = await mkdtemp(join(tmpdir(), "verglos-privacy-home-"));
  const commonEnv = { HOME: home, USERPROFILE: home, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_TELEMETRY: "0" };

  try {
    const args = (action: string, ...flags: string[]) => ["--import", tsx, cliEntry, "privacy", "telemetry", action, ...flags];
    const preview = await runCliFixture(process.execPath, args("preview", "--json"), cwd, { env: commonEnv });
    assert.equal(preview.exitCode, 0, preview.stderr);
    const previewJson = JSON.parse(preview.stdout) as { purpose: string; fields: string[]; excluded: string[]; consentRequired: boolean; transmission: string };
    assert.equal(previewJson.consentRequired, true);
    assert.equal(previewJson.transmission, "disabled-pending-hosted-retention-controls");
    assert.ok(previewJson.fields.includes("finding-count bands"));
    for (const excluded of ["project/repository identity", "license/account credentials", "source", "paths", "finding text", "matched secret values"]) {
      assert.ok(previewJson.excluded.includes(excluded));
    }

    const withoutApproval = await runCliFixture(process.execPath, args("enable", "--json"), cwd, { env: commonEnv });
    assert.equal(withoutApproval.exitCode, 2);
    assert.equal((JSON.parse(withoutApproval.stdout) as { status: string }).status, "consent-required");

    const before = await runCliFixture(process.execPath, args("status", "--json"), cwd, { env: { ...commonEnv, VERGLOS_TELEMETRY: "" } });
    assert.equal((JSON.parse(before.stdout) as { enabled: boolean }).enabled, false);

    const enable = await runCliFixture(process.execPath, args("enable", "--yes", "--json"), cwd, { env: { ...commonEnv, VERGLOS_TELEMETRY: "" } });
    assert.equal(enable.exitCode, 0, enable.stderr);
    assert.equal((JSON.parse(enable.stdout) as { enabled: boolean; consentSaved: boolean; transmission: string; consentPolicyVersion: string }).enabled, false);
    assert.equal((JSON.parse(enable.stdout) as { consentSaved: boolean }).consentSaved, true);
    assert.equal((JSON.parse(enable.stdout) as { transmission: string }).transmission, "disabled-pending-hosted-retention-controls");
    const persisted = JSON.parse(await readFile(join(home, ".verglos", "telemetry-consent.json"), "utf8")) as { schemaVersion: number; policyVersion: string; enabled: boolean; updatedAt: string };
    assert.deepEqual(persisted, { schemaVersion: 1, policyVersion: "2026-09-08", enabled: true, updatedAt: persisted.updatedAt });

    const disable = await runCliFixture(process.execPath, args("disable", "--json"), cwd, { env: { ...commonEnv, VERGLOS_TELEMETRY: "" } });
    assert.equal(disable.exitCode, 0, disable.stderr);
    assert.equal((JSON.parse(disable.stdout) as { enabled: boolean }).enabled, false);
    const finalStatus = await runCliFixture(process.execPath, args("status", "--json"), cwd, { env: { ...commonEnv, VERGLOS_TELEMETRY: "" } });
    assert.equal((JSON.parse(finalStatus.stdout) as { enabled: boolean; storedConsent: boolean }).enabled, false);
    assert.equal((JSON.parse(finalStatus.stdout) as { storedConsent: boolean }).storedConsent, false);
  } finally {
    await rm(cwd, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  }
});
