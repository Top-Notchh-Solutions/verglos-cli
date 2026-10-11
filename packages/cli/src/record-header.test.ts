import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeRecordCreate } from "./record-create.js";
import { executeRecordHeader } from "./record-header.js";
import { assembleReleaseRecord, createLineageGraphDocument, createReleaseDecision, createPolicyEvaluation, createSubject, describeRecordMember, LINEAGE_GRAPH_SCHEMA } from "@verglos/shared";

test("record header verifies the store and emits decision-first JSON", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-header-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const digest = (value: string) => ({ algorithm: "sha256" as const, value: value.repeat(64) });
    const subjects = [
      createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 1 }),
      createSubject({ kind: "repository-tree", vcs: "git", commit: { algorithm: "sha1", value: "1".repeat(40) }, tree: { algorithm: "sha1", value: "2".repeat(40) }, dirty: true, submoduleState: "none", shallow: false, worktreeDigest: digest("3") }),
      createSubject({ kind: "package", ecosystem: "npm", name: "example", version: "1.0.0", digest: digest("4") }),
      createSubject({ kind: "sbom", format: "cyclonedx-json", documentDigest: digest("5") }),
      createSubject({ kind: "artifact", digest: digest("6"), size: 1, mediaType: "application/json" }),
      createSubject({ kind: "oci-manifest", registry: "registry.example", repository: "team/app", digest: digest("7"), platform: { os: "linux", architecture: "arm64" } }),
      createSubject({ kind: "oci-index", registry: "registry.example", repository: "team/app", digest: digest("8"), manifests: [
        { digest: digest("9"), platform: { os: "linux", architecture: "amd64" } },
        { digest: digest("c"), platform: { os: "linux", architecture: "arm64" } },
      ] }),
    ];
    const subjectDigests = [
      ["filesystem-tree", digest("a"), "ignore-policy", digest("b")],
      ["git-commit", { algorithm: "sha1", value: "1".repeat(40) }, "git-tree", { algorithm: "sha1", value: "2".repeat(40) }, "worktree", digest("3")],
      ["package", digest("4")],
      ["sbom-document", digest("5")],
      ["artifact", digest("6")],
      ["oci-manifest", digest("7")],
      ["oci-index", digest("8"), "oci-manifest-1", digest("9"), "oci-manifest-2", digest("c")],
    ];
    const formatDigest = (value: { algorithm: string; value: string }) => `${value.algorithm}:${value.value}`;
    const evaluation = createPolicyEvaluation({ schemaId: "urn:verglos:schema:policy-evaluation", schemaVersion: "1.0.0", evaluationId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", subjectId: subjects[0]!.subjectId, policy: { id: "verglos.policy.local-default", version: "1.0.0", digest: { algorithm: "sha256", value: "c".repeat(64) } }, subjectMatch: { status: "matched", observedSubjectId: subjects[0]!.subjectId }, evaluatedAt: "2026-01-01T00:00:00Z", checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", status: "error", evidenceDigests: [], observationIds: [], freshness: { status: "unknown", checkedAt: "2026-01-01T00:00:00Z" }, owner: "application-security", reason: "Coverage unavailable.", nextAction: "Review coverage." }], limitations: ["coverage unavailable"] });
    const primary = subjects[0]!;
    const decision = createReleaseDecision({ decisionId: "urn:uuid:223e4567-e89b-12d3-a456-426614174000", evaluation, subjects: subjects.map((subject, index) => ({ subjectId: subject.subjectId, role: index === 0 ? "primary" as const : "supporting" as const })), issuedBy: { kind: "service", id: "verglos", authority: "local" }, generatedAt: "2026-01-01T00:00:01Z", limitations: ["coverage unavailable"] });
    const bytes = new TextEncoder().encode(JSON.stringify(decision));
    await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const subjectMembers = await Promise.all(subjects.map(async (subject, index) => {
      const subjectBytes = new TextEncoder().encode(JSON.stringify(subject));
      const path = `subject-${index}.json`;
      await writeFile(join(source, path), subjectBytes);
      return describeRecordMember({ path, kind: "subject", mediaType: "application/json", bytes: subjectBytes, required: true });
    }));
    const lineageBytes = new TextEncoder().encode(JSON.stringify(createLineageGraphDocument({ subjectIds: subjects.map((subject) => subject.subjectId), edges: [{ fromSubjectId: subjects[1]!.subjectId, toSubjectId: subjects[0]!.subjectId, relation: "build-output", status: "mismatched" }], gaps: ["Source and artifact digests differ."] })));
    await writeFile(join(source, "lineage.json"), lineageBytes);
    const lineageMember = { ...describeRecordMember({ path: "lineage.json", kind: "lineage", mediaType: "application/json", bytes: lineageBytes, required: true }), schema: LINEAGE_GRAPH_SCHEMA };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:323e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:02Z", generator: { id: "verglos", version: "2.0.0" }, members: [member, ...subjectMembers, lineageMember], redaction: { status: "not-required" }, limitations: ["coverage unavailable"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(manifest));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 0);
    const originalLog = console.log; let headerJson = "";
    try { console.log = (value?: unknown) => { headerJson = String(value); }; assert.equal(await executeRecordHeader(output, join(output, "manifest.json"), true, true), 0); }
    finally { console.log = originalLog; }
    const header = JSON.parse(headerJson);
    assert.equal(header.decision, "INCOMPLETE"); assert.equal(header.coverageStatus, "incomplete");
    assert.equal(header.subjectId, primary.subjectId);
    assert.deepEqual(header.subjects, subjects.map((subject, index) => ({
      subjectId: subject.subjectId,
      role: index === 0 ? "primary" : "supporting",
      identityDigest: `sha256:${subject.subjectId.split(":").at(-1)}`,
      memberDigest: `sha256:${subjectMembers[index]!.digest.value}`,
      contentDigests: Array.from({ length: subjectDigests[index]!.length / 2 }, (_, digestIndex) => ({ purpose: subjectDigests[index]![digestIndex * 2] as string, digest: formatDigest(subjectDigests[index]![digestIndex * 2 + 1] as { algorithm: string; value: string }) })),
    })));
    assert.ok(header.limitations.includes("coverage unavailable"));
    assert.deepEqual(header.lineage, { status: "recorded", edgeCount: 1, matched: 0, mismatched: 1, unavailable: 0, unverifiable: 0, gapCount: 1 });
    assert.ok((await readFile(join(output, "manifest.json"))).byteLength > 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});
