import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createReleaseSnapshot, createSubject } from "@verglos/shared";
import { executeDiff } from "./diff.js";

test("diff command rejects malformed snapshots with usage exit", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-diff-"));
  try {
    await writeFile(join(root, "base.json"), "{}", "utf8");
    await writeFile(join(root, "head.json"), "{}", "utf8");
    assert.equal(await executeDiff(join(root, "base.json"), join(root, "head.json"), true), 2);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("diff command rejects snapshots with excessive observation collections", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-diff-large-"));
  try {
    const observation = { fingerprint: "sha256:" + "a".repeat(64), producerIds: ["native"], disagreement: false };
    const snapshot = { schemaVersion: "1.0.0", primarySubjectId: "subject", subjectIds: [], observations: Array.from({ length: 20_001 }, () => observation), lineage: { edges: [], gaps: [] }, policyInputDigest: "sha256:" + "b".repeat(64) };
    await writeFile(join(root, "base.json"), JSON.stringify(snapshot), "utf8");
    await writeFile(join(root, "head.json"), JSON.stringify(snapshot), "utf8");
    assert.equal(await executeDiff(join(root, "base.json"), join(root, "head.json"), true), 2);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("diff command rejects symlink snapshot inputs before parsing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-diff-link-"));
  try {
    await writeFile(join(root, "base.json"), "{}", "utf8");
    await writeFile(join(root, "head.json"), "{}", "utf8");
    await symlink(join(root, "base.json"), join(root, "base-link.json"));
    assert.equal(await executeDiff(join(root, "base-link.json"), join(root, "head.json"), true), 2);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("diff command exposes digest-verified change and action projections in JSON", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-diff-actions-"));
  const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "e".repeat(64) }, size: 1, mediaType: "application/octet-stream" });
  const coverage = (observationCount: number) => ({ schemaVersion: "1.0.0" as const, status: "complete" as const, target: { state: "complete" as const, limitations: [] }, producers: [{ producer: "native" as const, state: "complete" as const, observationCount, runIds: [], sourceDigests: [], limitations: [] }] });
  const makeSnapshot = (fingerprints: string[]) => createReleaseSnapshot({
    primarySubject: subject,
    subjects: [subject],
    observations: fingerprints.map((fingerprint) => ({ fingerprint, producerIds: ["native"], payloads: [], disagreement: false })),
    lineage: { edges: [], gaps: [] },
    policyInputs: {},
    coverage: coverage(fingerprints.length),
  });
  let output = "";
  const originalLog = console.log;
  console.log = (message?: unknown) => { output = String(message); };
  try {
    const existing = `sha256:${"b".repeat(64)}`;
    const added = `sha256:${"a".repeat(64)}`;
    await writeFile(join(root, "base.json"), JSON.stringify(makeSnapshot([existing])));
    await writeFile(join(root, "head.json"), JSON.stringify(makeSnapshot([existing, added])));
    assert.equal(await executeDiff(join(root, "base.json"), join(root, "head.json"), true, true), 3);
    const report = JSON.parse(output);
    assert.deepEqual(report.added, [added]);
    assert.equal(report.coverageDelta.before.producers[0].observationCount, 1);
    assert.equal(report.coverageDelta.after.producers[0].observationCount, 2);
    const action = report.actions.changes.find((change: { fingerprint: string }) => change.fingerprint === added);
    assert.equal(action.status, "added");
    assert.equal(action.owner.status, "unassigned");
    assert.equal(action.rescan.status, "required");
    assert.equal(action.huntEligibility.status, "not-evaluated");
    assert.ok(report.actions.blockers.some((blocker: { code: string }) => blocker.code === "severity-unassessed"));
  } finally { console.log = originalLog; await rm(root, { recursive: true, force: true }); }
});
