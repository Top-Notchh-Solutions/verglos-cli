import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { assembleReleaseRecord } from "./record-assembly.js";
import { createReleaseDecision } from "./release-decision.js";
import { createPolicyEvaluation } from "./policy-evaluation.js";
import { createSubject } from "./subject.js";
import { projectPublicRecord, projectVerifiedPublicRecord } from "./public-record-projection.js";

test("public record projection allowlists safe manifest fields", () => { const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["preparatory"] }); const projection = projectPublicRecord(manifest); assert.equal(projection.manifestId, manifest.manifestId); assert.equal("members" in projection, false); });

test("public projection freezes redaction state", () => {
  const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: "decision.json", kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 2, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: ["preparatory"] });
  const projection = projectPublicRecord(manifest);
  assert.throws(() => { (projection.redaction as { status: string }).status = "complete"; }, TypeError);
});

test("verified public projection checks decision bytes and excludes private fields", () => {
  const tenantCanary = "TENANT-CANARY-DO-NOT-PUBLISH-7f3a";
  const sourceCanary = "SOURCE-CANARY-PRIVATE-8e21";
  const secretCanary = "SECRET-CANARY-PRIVATE-91bc";
  const limitationCanary = `client=${tenantCanary} path=src/private/${sourceCanary} token=${secretCanary}`;
  const subject = createSubject({ kind: "filesystem", treeDigest: { algorithm: "sha256", value: "b".repeat(64) }, ignorePolicyDigest: { algorithm: "sha256", value: "a".repeat(64) }, entryCount: 1 });
  const evaluation = createPolicyEvaluation({
    schemaId: "urn:verglos:schema:policy-evaluation", schemaVersion: "1.0.0", evaluationId: "urn:uuid:32345678-1234-4123-8123-123456789abc", subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId }, policy: { id: `verglos.policy.${tenantCanary.toLowerCase()}`, version: "1.0.0", digest: { algorithm: "sha256", value: "c".repeat(64) } }, checks: [{ id: "verglos.check.release-evidence", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [{ algorithm: "sha256", value: "d".repeat(64) }], observationIds: [], freshness: { status: "current", checkedAt: "2026-01-01T00:00:00Z", validUntil: "2026-01-02T00:00:00Z" }, owner: "release-owner", reason: `finding ${sourceCanary} secret ${secretCanary}`, nextAction: "Preserve evidence." }], limitations: [limitationCanary], evaluatedAt: "2026-01-01T00:00:00Z",
  });
  const decision = createReleaseDecision({
    decisionId: "urn:uuid:22345678-1234-4123-8123-123456789abc",
    evaluation,
    subjects: [{ subjectId: subject.subjectId, role: "primary" }],
    issuedBy: { kind: "service", id: tenantCanary, authority: "policy" }, generatedAt: "2026-01-01T00:00:01Z", limitations: [limitationCanary],
  });
  const bytes = new TextEncoder().encode(JSON.stringify(decision));
  const digest = createHash("sha256").update(bytes).digest("hex");
  const sourceBytes = new TextEncoder().encode(`private source ${sourceCanary} ${secretCanary}`);
  const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:02Z", generator: { id: "verglos", version: "2.0.0" }, members: [{ path: `source/${tenantCanary}/private/${sourceCanary}.txt`, kind: "metadata", mediaType: "text/plain", digest: { algorithm: "sha256", value: createHash("sha256").update(sourceBytes).digest("hex") }, size: sourceBytes.byteLength, required: false, redaction: "none" }, { path: `internal/${tenantCanary}/decision.json`, kind: "release-decision", mediaType: "application/json", digest: { algorithm: "sha256", value: digest }, size: bytes.byteLength, required: true, redaction: "none", schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } }], redaction: { status: "not-required" }, limitations: [limitationCanary] });
  const projection = projectVerifiedPublicRecord(manifest, new Map([[`internal/${tenantCanary}/decision.json`, bytes], [`source/${tenantCanary}/private/${sourceCanary}.txt`, sourceBytes]]));
  assert.equal(projection.decision, "PASS"); assert.equal(projection.signerStatus, "unsigned"); assert.equal(projection.subjects[0]?.subjectId, decision.subjects[0]?.subjectId); assert.equal("issuedBy" in projection, false); assert.equal("paths" in projection, false);
  assert.equal("policy" in projection, false);
  assert.deepEqual(projection.limitations, ["Limitation details withheld from this public projection."]);
  const serialized = JSON.stringify(projection);
  for (const canary of [tenantCanary, sourceCanary, secretCanary, "private source", "internal/"]) assert.equal(serialized.includes(canary), false, `public projection leaked ${canary}`);
  assert.equal(Object.keys(projection).sort().join(","), "decision,decisionMemberDigest,generatedAt,limitations,manifestDigest,manifestId,redaction,signerStatus,subjects");
});
