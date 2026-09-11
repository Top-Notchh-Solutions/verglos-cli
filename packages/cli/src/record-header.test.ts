import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeRecordCreate } from "./record-create.js";
import { executeRecordHeader } from "./record-header.js";
import { assembleReleaseRecord, createReleaseDecision, createPolicyEvaluation, createSubject, describeRecordMember } from "@verglos/shared";

test("record header verifies the store and emits decision-first JSON", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-header-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const subject = createSubject({ kind: "filesystem", treeDigest: { algorithm: "sha256", value: "a".repeat(64) }, ignorePolicyDigest: { algorithm: "sha256", value: "b".repeat(64) }, entryCount: 1 });
    const evaluation = createPolicyEvaluation({ schemaId: "urn:verglos:schema:policy-evaluation", schemaVersion: "1.0.0", evaluationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", subjectId: subject.subjectId, policy: { id: "verglos.policy.local-default", version: "1.0.0", digest: { algorithm: "sha256", value: "c".repeat(64) } }, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId }, evaluatedAt: "2026-01-01T00:00:00Z", checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", status: "error", evidenceDigests: [], observationIds: [], freshness: { status: "unknown", checkedAt: "2026-01-01T00:00:00Z" }, owner: "application-security", reason: "Coverage unavailable.", nextAction: "Review coverage." }], limitations: ["coverage unavailable"] });
    const decision = createReleaseDecision({ decisionId: "urn:uuid:223e4567-e89b-12d3-a456-426614174000", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], issuedBy: { kind: "service", id: "verglos", authority: "local" }, generatedAt: "2026-01-01T00:00:01Z", limitations: ["coverage unavailable"] });
    const bytes = new TextEncoder().encode(JSON.stringify(decision)); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:323e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:02Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["coverage unavailable"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(manifest));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 0);
    assert.equal(await executeRecordHeader(output, join(output, "manifest.json"), true, true), 0);
    assert.ok((await readFile(join(output, "manifest.json"))).byteLength > 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});
