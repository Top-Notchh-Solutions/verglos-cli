import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { assembleReleaseRecord, createPolicyEvaluation, createReleaseDecision, createSubject, describeRecordMember, putRecordMember } from "@verglos/shared";
import { executeRecordProject } from "./record-project.js";
import { runCliFixture } from "./cli-fixture.js";

test("record project fails closed before parsing a missing manifest", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-project-"));
  try {
    const lines: string[] = [];
    const previous = console.log;
    console.log = (line?: unknown) => lines.push(String(line));
    try { assert.equal(await executeRecordProject(root, join(root, "missing.json"), true, true), 78); } finally { console.log = previous; }
    assert.equal(JSON.parse(lines[0]!).code, "RECORD_PROJECT_INPUT");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record project rejects non-JSON manifest input", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-project-invalid-"));
  try {
    const manifest = join(root, "manifest.json"); await writeFile(manifest, "not-json");
    assert.equal(await executeRecordProject(root, manifest, true, true), 78);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record project JSON error is process-safe", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-project-process-"));
  try {
    const manifest = join(root, "manifest.json"); await writeFile(manifest, "not-json");
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "record", "project", join(root, "store"), manifest, "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 78);
    assert.equal(result.stderr, "");
    assert.equal(JSON.parse(result.stdout).code, "RECORD_PROJECT_INPUT");
    assert.deepEqual(result.files, []);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record project CLI output withholds free-form limitation, path, source, tenant, and policy canaries", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-project-redaction-"));
  const store = join(root, "store");
  const manifestPath = join(root, "manifest.json");
  const tenantCanary = "TENANT-CANARY-DO-NOT-PUBLISH-7f3a";
  const sourceCanary = "SOURCE-CANARY-PRIVATE-8e21";
  const secretCanary = "SECRET-CANARY-PRIVATE-91bc";
  const limitation = `client=${tenantCanary} path=src/private/${sourceCanary} token=${secretCanary}`;
  try {
    const subject = createSubject({ kind: "filesystem", treeDigest: { algorithm: "sha256", value: "a".repeat(64) }, ignorePolicyDigest: { algorithm: "sha256", value: "b".repeat(64) }, entryCount: 1 });
    const evaluation = createPolicyEvaluation({ schemaId: "urn:verglos:schema:policy-evaluation", schemaVersion: "1.0.0", evaluationId: "urn:uuid:32345678-1234-4123-8123-123456789abc", subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId }, policy: { id: `verglos.policy.${tenantCanary.toLowerCase()}`, version: "1.0.0", digest: { algorithm: "sha256", value: "c".repeat(64) } }, checks: [{ id: "verglos.check.release-evidence", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [{ algorithm: "sha256", value: "d".repeat(64) }], observationIds: [], freshness: { status: "current", checkedAt: "2026-01-01T00:00:00Z", validUntil: "2026-01-02T00:00:00Z" }, owner: "release-owner", reason: `finding ${sourceCanary} secret ${secretCanary}`, nextAction: "Preserve evidence." }], limitations: [limitation], evaluatedAt: "2026-01-01T00:00:00Z" });
    const decisionBytes = new TextEncoder().encode(JSON.stringify(createReleaseDecision({ decisionId: "urn:uuid:22345678-1234-4123-8123-123456789abc", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], issuedBy: { kind: "service", id: tenantCanary, authority: "policy" }, generatedAt: "2026-01-01T00:00:01Z", limitations: [limitation] })));
    const sourceBytes = new TextEncoder().encode(`private source ${sourceCanary} ${secretCanary}`);
    const decisionPath = `internal/${tenantCanary}/decision.json`;
    const sourcePath = `source/${tenantCanary}/private/${sourceCanary}.txt`;
    const decisionBlob = await putRecordMember(store, decisionPath, decisionBytes);
    const sourceBlob = await putRecordMember(store, sourcePath, sourceBytes);
    const decisionMember = { ...describeRecordMember({ path: decisionPath, kind: "release-decision", mediaType: "application/json", bytes: decisionBytes, required: true }), digest: { algorithm: "sha256" as const, value: decisionBlob.digest.slice("sha256:".length) }, schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const sourceMember = { ...describeRecordMember({ path: sourcePath, kind: "metadata", mediaType: "text/plain", bytes: sourceBytes, required: false }), digest: { algorithm: "sha256" as const, value: sourceBlob.digest.slice("sha256:".length) } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:02Z", generator: { id: "verglos", version: "2.0.0" }, members: [sourceMember, decisionMember], redaction: { status: "not-required" }, limitations: [limitation] });
    await writeFile(manifestPath, JSON.stringify(manifest));

    const lines: string[] = [];
    const previous = console.log;
    console.log = (line?: unknown) => lines.push(String(line));
    try { assert.equal(await executeRecordProject(store, manifestPath, true, true), 0); } finally { console.log = previous; }

    const projection = JSON.parse(lines[0]!) as { limitations: string[]; [key: string]: unknown };
    assert.deepEqual(projection.limitations, ["Limitation details withheld from this public projection."]);
    assert.equal("policy" in projection, false);
    const serialized = JSON.stringify(projection);
    for (const canary of [tenantCanary, sourceCanary, secretCanary, "private source", "internal/"]) assert.equal(serialized.includes(canary), false, `record project output leaked ${canary}`);
  } finally { await rm(root, { recursive: true, force: true }); }
});
