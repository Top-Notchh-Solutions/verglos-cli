import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { assembleReleaseRecord, createPolicyEvaluation, createReleaseDecision, createSubject, describeRecordMember, putRecordMember } from "@verglos/shared";
import { executeRecordVerify } from "./record-verify.js";

test("record verify checks content-addressed members and emits JSON", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-cli-"));
  const store = join(root, "store"); const manifestPath = join(root, "manifest.json");
    const subject = createSubject({ kind: "filesystem", treeDigest: { algorithm: "sha256", value: "a".repeat(64) }, ignorePolicyDigest: { algorithm: "sha256", value: "b".repeat(64) }, entryCount: 1 });
    const evaluation = createPolicyEvaluation({ schemaId: "urn:verglos:schema:policy-evaluation", schemaVersion: "1.0.0", evaluationId: "urn:uuid:22345678-1234-4123-8123-123456789abc", subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId }, policy: { id: "verglos.policy.local-default", version: "1.0.0", digest: { algorithm: "sha256", value: "c".repeat(64) } }, checks: [{ id: "verglos.check.record", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [{ algorithm: "sha256", value: "d".repeat(64) }], observationIds: [], freshness: { status: "current", checkedAt: "2026-01-01T00:00:00Z", validUntil: "2026-01-02T00:00:00Z" }, owner: "release", reason: "Evidence is current.", nextAction: "Preserve evidence." }], limitations: ["fixture"], evaluatedAt: "2026-01-01T00:00:00Z" });
    const bytes = new TextEncoder().encode(JSON.stringify(createReleaseDecision({ decisionId: "urn:uuid:32345678-1234-4123-8123-123456789abc", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], issuedBy: { kind: "service", id: "fixture", authority: "release" }, generatedAt: "2026-01-01T00:00:01Z", limitations: ["fixture"] })));
  try {
    const stored = await putRecordMember(store, "decision.json", bytes);
    const member = describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true });
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos.record-builder", version: "1.0.0" }, members: [{ ...member, digest: { algorithm: "sha256", value: stored.digest.slice(7) }, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["fixture"] });
    await writeFile(manifestPath, JSON.stringify(manifest));
    const lines: string[] = []; const previous = console.log; console.log = (line?: unknown) => lines.push(String(line));
    try { assert.equal(await executeRecordVerify(store, manifestPath, true, true), 0); } finally { console.log = previous; }
    const result = JSON.parse(lines[0]!); assert.equal(result.verified, true); assert.equal(result.decision, "PASS"); assert.deepEqual(result.paths, ["decision.json"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record verify rejects a missing or tampered member", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-cli-invalid-"));
  try { assert.equal(await executeRecordVerify(root, join(root, "missing.json"), true, true), 78); }
  finally { await rm(root, { recursive: true, force: true }); }
});
