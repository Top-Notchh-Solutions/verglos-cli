import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "node:test";

const run = promisify(execFile);

test("release rollback evidence generator records all five boundaries without provider writes", async () => {
  const output = await mkdtemp(join(tmpdir(), "verglos-release-rollback-evidence-"));
  try {
    const result = await run(process.execPath, ["scripts/release-rollback-evidence.mjs", output], { maxBuffer: 64 * 1024 });
    const report = JSON.parse(await readFile(join(output, "report.json"), "utf8"));
    assert.equal(result.stderr, "");
    assert.equal(report.status, "passed");
    assert.equal(report.operationCount, 5);
    assert.equal(report.historicalRecordCount, 2);
    assert.equal(report.historicalRecordsPreserved, true);
    assert.deepEqual(report.operations.map((operation) => [operation.kind, operation.action]), [
      ["npm-package", "rollback"],
      ["engine-manifest", "rollback"],
      ["hunt-feed", "rollback"],
      ["signing-identity", "revoke"],
      ["web-deployment", "rollback"],
    ]);
    assert.match(report.limitations[0], /does not call npm/u);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
