import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeReleaseRollbackPlan, executeReleaseRollbackRehearsal } from "./release-rollback-plan.js";

test("rollback-plan emits an admitted immutable transition only with approval", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-rollback-plan-"));
  await writeFile(join(root, "current.json"), JSON.stringify({ kind: "npm-package", identity: "verglos", immutableRef: "v2.0.0-alpha.1" }));
  await writeFile(join(root, "target.json"), JSON.stringify({ kind: "npm-package", identity: "verglos", immutableRef: `sha256:${"a".repeat(64)}` }));
  const lines: string[] = []; const original = console.log; console.log = (value?: unknown) => lines.push(String(value));
  try { assert.equal(await executeReleaseRollbackPlan({ currentPath: join(root, "current.json"), targetPath: join(root, "target.json"), reason: "revert compromised publication", approved: true, json: true }), 0); }
  finally { console.log = original; }
  assert.equal(JSON.parse(lines[0]!).allowed, true);
});

test("rollback-plan fails closed without approval", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-rollback-denied-"));
  const ref = JSON.stringify({ kind: "web-deployment", identity: "verglos.com", immutableRef: "https://vercel.com/deployments/abc" });
  await writeFile(join(root, "current.json"), ref); await writeFile(join(root, "target.json"), JSON.stringify({ kind: "web-deployment", identity: "verglos.com", immutableRef: "https://vercel.com/deployments/def" }));
  assert.equal(await executeReleaseRollbackPlan({ currentPath: join(root, "current.json"), targetPath: join(root, "target.json"), reason: "operator review", approved: false, json: true, quiet: true }), 78);
});

test("rollback-rehearsal covers every provider boundary and preserves historical records", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-rollback-rehearsal-"));
  const digest = (letter: string) => `sha256:${letter.repeat(64)}`;
  const ref = (kind: string, identity: string, letter: string) => ({ kind, identity, immutableRef: digest(letter) });
  await writeFile(join(root, "manifest.json"), JSON.stringify({
    operations: [
      { id: "npm", current: ref("npm-package", "verglos@bad", "a"), target: ref("npm-package", "verglos@good", "b"), reason: "bad npm release", approved: true },
      { id: "engine", current: ref("engine-manifest", "trivy@bad", "c"), target: ref("engine-manifest", "trivy@good", "d"), reason: "bad engine manifest", approved: true },
      { id: "hunt", current: ref("hunt-feed", "feed-bad", "e"), target: ref("hunt-feed", "feed-good", "f"), reason: "bad recipe feed", approved: true },
      { id: "signing", current: ref("signing-identity", "key-old", "1"), target: ref("signing-identity", "key-revoked", "2"), replacement: ref("signing-identity", "key-new", "3"), reason: "signing identity compromise", approved: true },
      { id: "web", current: ref("web-deployment", "verglos.com", "4"), target: ref("web-deployment", "verglos.com-previous", "5"), reason: "bad web deployment", approved: true },
    ],
    historicalRecords: [
      { id: "record-pass", digest: digest("6") },
      { id: "record-review", digest: digest("7") },
    ],
  }), "utf8");
  const lines: string[] = [];
  const original = console.log;
  console.log = (value?: unknown) => lines.push(String(value));
  try {
    assert.equal(await executeReleaseRollbackRehearsal({ manifestPath: join(root, "manifest.json"), json: true }), 0);
  } finally {
    console.log = original;
  }
  const report = JSON.parse(lines[0]!) as { status: string; operationCount: number; historicalRecordCount: number; historicalRecordsPreserved: boolean; operations: Array<{ id: string; action: string }> };
  assert.equal(report.status, "passed");
  assert.equal(report.operationCount, 5);
  assert.equal(report.historicalRecordCount, 2);
  assert.equal(report.historicalRecordsPreserved, true);
  assert.deepEqual(report.operations.map((operation) => [operation.id, operation.action]), [["npm", "rollback"], ["engine", "rollback"], ["hunt", "rollback"], ["signing", "revoke"], ["web", "rollback"]]);
});

test("rollback-rehearsal fails closed when one operation is not approved", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-rollback-rehearsal-denied-"));
  const digest = `sha256:${"a".repeat(64)}`;
  await writeFile(join(root, "manifest.json"), JSON.stringify({
    operations: [
      { id: "npm", current: { kind: "npm-package", identity: "bad", immutableRef: digest }, target: { kind: "npm-package", identity: "good", immutableRef: `sha256:${"b".repeat(64)}` }, reason: "operator review", approved: false },
      { id: "engine", current: { kind: "engine-manifest", identity: "trivy@bad", immutableRef: `sha256:${"c".repeat(64)}` }, target: { kind: "engine-manifest", identity: "trivy@good", immutableRef: `sha256:${"d".repeat(64)}` }, reason: "engine review", approved: true },
      { id: "hunt", current: { kind: "hunt-feed", identity: "feed-bad", immutableRef: `sha256:${"e".repeat(64)}` }, target: { kind: "hunt-feed", identity: "feed-good", immutableRef: `sha256:${"f".repeat(64)}` }, reason: "feed review", approved: true },
      { id: "signing", current: { kind: "signing-identity", identity: "key-old", immutableRef: `sha256:${"1".repeat(64)}` }, target: { kind: "signing-identity", identity: "key-revoked", immutableRef: `sha256:${"2".repeat(64)}` }, replacement: { kind: "signing-identity", identity: "key-new", immutableRef: `sha256:${"3".repeat(64)}` }, reason: "signing review", approved: true },
      { id: "web", current: { kind: "web-deployment", identity: "verglos.com", immutableRef: `sha256:${"4".repeat(64)}` }, target: { kind: "web-deployment", identity: "verglos.com-previous", immutableRef: `sha256:${"5".repeat(64)}` }, reason: "web review", approved: true },
    ],
    historicalRecords: [{ id: "record", digest }],
  }), "utf8");
  const lines: string[] = [];
  const original = console.log;
  console.log = (value?: unknown) => lines.push(String(value));
  try {
    assert.equal(await executeReleaseRollbackRehearsal({ manifestPath: join(root, "manifest.json"), json: true }), 78);
  } finally {
    console.log = original;
  }
  assert.deepEqual(JSON.parse(lines[0]!), { status: "failed", failedOperation: "npm", reason: "approval-required", operations: [], historicalRecordsPreserved: true });
});

test("rollback-rehearsal rejects an incomplete or duplicated provider-boundary set", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-rollback-rehearsal-boundaries-"));
  const digest = (letter: string) => `sha256:${letter.repeat(64)}`;
  const ref = (kind: string, identity: string, letter: string) => ({ kind, identity, immutableRef: digest(letter) });
  await writeFile(join(root, "manifest.json"), JSON.stringify({
    operations: [
      { id: "npm", current: ref("npm-package", "verglos@bad", "a"), target: ref("npm-package", "verglos@good", "b"), reason: "bad npm release", approved: true },
      { id: "engine", current: ref("engine-manifest", "trivy@bad", "c"), target: ref("engine-manifest", "trivy@good", "d"), reason: "bad engine manifest", approved: true },
      { id: "hunt", current: ref("hunt-feed", "feed-bad", "e"), target: ref("hunt-feed", "feed-good", "f"), reason: "bad recipe feed", approved: true },
      { id: "duplicate", current: ref("npm-package", "verglos@other-bad", "1"), target: ref("npm-package", "verglos@other-good", "2"), reason: "duplicate boundary", approved: true },
      { id: "web", current: ref("web-deployment", "verglos.com", "4"), target: ref("web-deployment", "verglos.com-previous", "5"), reason: "bad web deployment", approved: true },
    ],
    historicalRecords: [{ id: "record", digest: digest("6") }],
  }), "utf8");
  const lines: string[] = [];
  const original = console.log;
  console.log = (value?: unknown) => lines.push(String(value));
  try {
    assert.equal(await executeReleaseRollbackRehearsal({ manifestPath: join(root, "manifest.json"), json: true }), 78);
  } finally {
    console.log = original;
  }
  assert.deepEqual(JSON.parse(lines[0]!), { status: "invalid-input", historicalRecordsPreserved: false });
});
