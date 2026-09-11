import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
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

test("diff command exposes bounded change actions in JSON", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-diff-actions-"));
  try {
    const base = { schemaVersion: "1.0.0", primarySubjectId: "subject", subjectIds: ["subject"], observations: [], lineage: { edges: [], gaps: [] }, policyInputDigest: "sha256:" + "b".repeat(64) };
    const head = { ...base, observations: [{ fingerprint: "sha256:" + "a".repeat(64), producerIds: ["native"], disagreement: false }] };
    await writeFile(join(root, "base.json"), JSON.stringify(base)); await writeFile(join(root, "head.json"), JSON.stringify(head));
    assert.equal(await executeDiff(join(root, "base.json"), join(root, "head.json"), true, true), 1);
  } finally { await rm(root, { recursive: true, force: true }); }
});
