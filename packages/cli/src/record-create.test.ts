import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { executeRecordCreate } from "./record-create.js";
import { runCliFixture } from "./cli-fixture.js";
import { assembleReleaseRecord, assembleReleaseRecordBundle, canonicalizeJson, createLineageGraphDocument, createPolicyEvaluation, createReleaseDecision, createSubject, describeRecordMember, LINEAGE_GRAPH_SCHEMA, parsePolicyDocument, policyDocumentDigest, POLICY_DOCUMENT_SCHEMA, POLICY_EVALUATION_SCHEMA, RELEASE_DECISION_SCHEMA, SUBJECT_SCHEMA } from "@verglos/shared";
import { executeRecordVerify } from "./record-verify.js";

test("record create materializes verified members and a canonical manifest", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-"));
  try {
    const source = join(root, "source");
    const output = join(root, "output");
    await mkdir(source);
    const bytes = new TextEncoder().encode("decision");
    await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json");
    await writeFile(manifestPath, JSON.stringify(manifest));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 0);
    assert.deepEqual(JSON.parse(await readFile(join(output, "manifest.json"), "utf8")).members[0].path, "decision.json");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create rejects a symlinked output root", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-link-"));
  try {
    const source = join(root, "source");
    const output = join(root, "output");
    const target = join(root, "target");
    await mkdir(source); await mkdir(target);
    const bytes = new TextEncoder().encode("decision");
    await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json");
    await writeFile(manifestPath, JSON.stringify(manifest));
    await symlink(target, output);
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 78);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create prevalidates all members before publishing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-preflight-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const bytes = new TextEncoder().encode("decision"); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify({ ...manifest, members: [{ ...member, size: member.size + 1 }] }));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 78);
    await assert.rejects(() => readdir(output));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create rejects an existing manifest before publishing new blobs", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-existing-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source); await mkdir(output);
    const bytes = new TextEncoder().encode("decision"); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(manifest));
    await writeFile(join(output, "manifest.json"), "existing\n");
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 78);
    assert.deepEqual(await readdir(output), ["manifest.json"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create complete mode enforces the graph gate", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-complete-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const bytes = new TextEncoder().encode("decision"); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(manifest));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true, true), 78);
    await assert.rejects(() => readdir(output));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("complete record create and verify preserve canonical policy and subject bindings", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-complete-valid-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const digest = (char: string) => ({ algorithm: "sha256" as const, value: char.repeat(64) });
    const subject = createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 1 });
    const policy = parsePolicyDocument({ schemaId: POLICY_DOCUMENT_SCHEMA.id, schemaVersion: "1.0.0", policyId: "verglos.policy.release", policyVersion: "1.0.0", checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", severities: ["critical"], minimumConfidence: 0, freshness: "current", coverage: "complete", artifactMatch: "not-required", hunt: "not-required" }], exceptions: { enabled: false, requireApproval: false }, approvals: { required: false, authorities: [] } });
    const policyDigest = policyDocumentDigest(policy).slice("sha256:".length);
    const evaluation = createPolicyEvaluation({ schemaId: POLICY_EVALUATION_SCHEMA.id, schemaVersion: "1.0.0", evaluationId: "urn:uuid:72345678-1234-4123-8123-123456789abc", policy: { id: policy.policyId, version: policy.policyVersion, digest: { algorithm: "sha256", value: policyDigest } }, subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId }, evaluatedAt: "2026-09-10T02:00:00.000Z", checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [digest("c")], observationIds: [], freshness: { status: "current", checkedAt: "2026-09-10T01:00:00.000Z", sourceUpdatedAt: "2026-09-10T00:00:00.000Z", validUntil: "2026-09-11T02:00:00.000Z" }, owner: "appsec", reason: "Current evidence is available.", nextAction: "Retain evidence." }], limitations: ["Fixture only."] });
    const decision = createReleaseDecision({ decisionId: "urn:uuid:82345678-1234-4123-8123-123456789abc", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], issuedBy: { kind: "person", id: "release-owner", authority: "release-decision" }, generatedAt: "2026-09-10T03:00:00.000Z", limitations: ["Fixture only."] });
    const payloads = [
      { path: "subjects/0001.json", kind: "subject" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(subject)), required: true, schema: SUBJECT_SCHEMA },
      { path: "lineage.json", kind: "lineage" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(createLineageGraphDocument({ subjectIds: [subject.subjectId], edges: [], gaps: ["Source lineage was not included in this fixture."] }))), required: true, schema: LINEAGE_GRAPH_SCHEMA },
      { path: "policy.json", kind: "policy" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(policy)), required: true, schema: POLICY_DOCUMENT_SCHEMA },
      { path: "policy-evaluation.json", kind: "policy-evaluation" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(evaluation)), required: true, schema: POLICY_EVALUATION_SCHEMA },
      { path: "release-decision.json", kind: "release-decision" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(decision)), required: true, schema: RELEASE_DECISION_SCHEMA },
    ];
    const bundle = assembleReleaseRecordBundle({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:92345678-1234-4123-8123-123456789abc", generatedAt: "2026-09-10T04:00:00.000Z", generator: { id: "verglos.record-builder", version: "1.0.0" }, redaction: { status: "not-required" }, limitations: ["Fixture only."], payloads });
    for (const payload of payloads) { const path = join(source, payload.path); await mkdir(join(path, ".."), { recursive: true }); await writeFile(path, payload.bytes); }
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(bundle.manifest));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true, true), 0);
    assert.equal(await executeRecordVerify(output, join(output, "manifest.json"), true, true, undefined, undefined, undefined, undefined, true), 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create JSON success is process-safe", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-process-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const bytes = new TextEncoder().encode("decision"); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(manifest));
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "record", "create", source, manifestPath, output, "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0, `${result.stdout}\n${result.stderr}`);
    assert.equal(result.stderr, "");
    const parsed = JSON.parse(result.stdout) as { members: number; manifestPath: string };
    assert.equal(parsed.members, 1);
    assert.equal(basename(parsed.manifestPath), "manifest.json");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create JSON failures are process-safe", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-json-error-"));
  const logs: string[] = [];
  const original = console.log;
  console.log = (line?: unknown) => logs.push(String(line));
  try {
    assert.equal(await executeRecordCreate(root, join(root, "missing.json"), join(root, "output"), true, true), 78);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "error", code: "RECORD_CREATE_INPUT", message: "record creation failed" });
  } finally {
    console.log = original;
    await rm(root, { recursive: true, force: true });
  }
});
