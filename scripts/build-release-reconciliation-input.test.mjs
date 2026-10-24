import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildReleaseReconciliationInput } from "./build-release-reconciliation-input.mjs";

const gates = {
  providerLifecycle: "open",
  customerConsent: "passed",
  independentReview: "open",
  authenticatedBrowser: "open",
  fieldCwv: "open",
  accountDeletion: "open",
  finalRelease: "open",
};

function config(evidence = ["evidence.md"]) {
  return {
    schema: "verglos.private.release-gate-input-config.v1",
    completedAt: "2026-10-24T00:00:00.000Z",
    candidate: { cliCommit: "cd9d572e28462741103cb21a2274e5892939d5d4", webCommit: "cb266b83406bbfffbd5ab02189556e60973a63a6", version: "2.0.0-alpha.4" },
    rows: [{ id: "ACCEPT-014", state: "partial", evidence }],
    gates,
    corrections: [{ id: "ACCEPT-014", action: "reconcile observed regression" }],
    rollback: [],
    decision: { result: "no-go", status: "recorded" },
  };
}

test("binds configured evidence to current bytes", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-release-input-"));
  await writeFile(join(root, "evidence.md"), "current evidence\n");
  const output = await buildReleaseReconciliationInput(config(), { evidenceRoot: root });
  assert.equal(output.schema, "verglos.private.release-gate-reconciliation.v1");
  assert.equal(output.candidate.cliCommit, "cd9d572e28462741103cb21a2274e5892939d5d4");
  assert.match(output.rows[0].evidence[0].sha256, /^sha256:[a-f0-9]{64}$/u);
});

test("rejects evidence paths that escape the configured root", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-release-input-"));
  await assert.rejects(() => buildReleaseReconciliationInput(config(["../outside.md"]), { evidenceRoot: root }), /invalid|unsafe|escape/u);
});
