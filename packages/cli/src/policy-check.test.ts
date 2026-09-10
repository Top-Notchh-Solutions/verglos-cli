import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executePolicyCheck } from "./policy-check.js";
import { assembleReleaseRecord, createPolicyEvaluation, createReleaseDecision, createSubject, describeRecordMember, POLICY_EVALUATION_SCHEMA, putRecordMember, RELEASE_DECISION_SCHEMA } from "@verglos/shared";

function validEvaluation(status: "satisfied" | "failed" | "stale" = "satisfied") {
  const digest = (value: string) => ({ algorithm: "sha256" as const, value: value.repeat(64) });
  const subject = createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 1 });
  return createPolicyEvaluation({
    schemaId: POLICY_EVALUATION_SCHEMA.id, schemaVersion: POLICY_EVALUATION_SCHEMA.version,
    evaluationId: "urn:uuid:72345678-1234-4123-8123-123456789abc",
    policy: { id: "verglos.policy.local-default", version: "1.0.0", digest: digest("c") },
    subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId },
    evaluatedAt: "2026-09-09T02:00:00.000Z",
    checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", status, evidenceDigests: [digest("d")], observationIds: [], freshness: { status: status === "stale" ? "stale" : "current", checkedAt: "2026-09-09T01:00:00.000Z", validUntil: status === "stale" ? "2026-09-09T02:00:00.000Z" : "2026-09-10T02:00:00.000Z" }, owner: "security", reason: "Evidence is current.", nextAction: "Preserve the evidence." }],
    limitations: ["Preparatory fixture."],
  });
}

test("policy check returns usage exit for invalid input without mutation", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  try {
    const path = join(root, "evaluation.json");
    await writeFile(path, "{}", "utf8");
    assert.equal(await executePolicyCheck(path, true, true), 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check rejects record and snapshot inputs with a stable JSON error", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  const original = console.log;
  const lines: string[] = [];
  console.log = (line?: unknown) => lines.push(String(line));
  try {
    const path = join(root, "release.vgl");
    await writeFile(path, "not-a-record", "utf8");
    assert.equal(await executePolicyCheck(path, true, true), 2);
    assert.deepEqual(JSON.parse(lines[0]!), {
      status: "error",
      code: "POLICY_CHECK_INPUT",
      message: "record and snapshot inputs require --record-store or an embedded policy evaluation",
    });
  } finally {
    console.log = original;
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check verifies a record store and evaluates its policy member", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-record-"));
  try {
    const store = join(root, "store");
    const evaluation = validEvaluation();
    const decision = createReleaseDecision({
      decisionId: "urn:uuid:82345678-1234-4123-8123-123456789abc",
      evaluation,
      subjects: [{ subjectId: evaluation.subjectId, role: "primary" }],
      issuedBy: { kind: "service", id: "verglos-test", authority: "test" },
      generatedAt: "2026-09-09T03:00:00.000Z",
      limitations: ["test fixture"],
    });
    const policyBytes = Buffer.from(JSON.stringify(evaluation));
    const decisionBytes = Buffer.from(JSON.stringify(decision));
    const policyStored = await putRecordMember(store, "policy-evaluation.json", policyBytes);
    const decisionStored = await putRecordMember(store, "decision.json", decisionBytes);
    const manifest = assembleReleaseRecord({
      schemaId: "urn:verglos:schema:release-record-manifest",
      schemaVersion: "1.0.0",
      bundleVersion: "1.0.0",
      manifestId: "urn:uuid:92345678-1234-4123-8123-123456789abc",
      generatedAt: "2026-09-09T03:00:00.000Z",
      generator: { id: "verglos-test", version: "1.0.0" },
      members: [
        { ...describeRecordMember({ path: "policy-evaluation.json", kind: "policy-evaluation", mediaType: "application/json", bytes: policyBytes, required: true }), digest: { algorithm: "sha256", value: policyStored.digest.slice(7) }, schema: { id: POLICY_EVALUATION_SCHEMA.id, version: POLICY_EVALUATION_SCHEMA.version } },
        { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes: decisionBytes, required: true }), digest: { algorithm: "sha256", value: decisionStored.digest.slice(7) }, schema: { id: RELEASE_DECISION_SCHEMA.id, version: RELEASE_DECISION_SCHEMA.version } },
      ],
      redaction: { status: "not-required" },
      limitations: ["test fixture"],
    });
    const manifestPath = join(root, "manifest.json");
    await writeFile(manifestPath, JSON.stringify(manifest), "utf8");
    assert.equal(await executePolicyCheck(manifestPath, true, true, { recordStore: store }), 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check rejects oversized inputs before parsing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  try {
    const path = join(root, "evaluation.json");
    await writeFile(path, Buffer.alloc(8 * 1024 * 1024 + 1));
    assert.equal(await executePolicyCheck(path, true, true), 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check accepts an evaluator named with snapshot text", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  try {
    const path = join(root, "snapshot-evaluation.json");
    await writeFile(path, JSON.stringify(validEvaluation()), "utf8");
    assert.equal(await executePolicyCheck(path, true, true), 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check returns INCOMPLETE for a snapshot without an evaluated decision", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-snapshot-"));
  try {
    const path = join(root, "release.snapshot.json");
    const subject = createSubject({ kind: "filesystem", treeDigest: { algorithm: "sha256", value: "a".repeat(64) }, ignorePolicyDigest: { algorithm: "sha256", value: "b".repeat(64) }, entryCount: 1 });
    await writeFile(path, JSON.stringify({ schemaVersion: "1.0.0", primarySubjectId: subject.subjectId, subjectIds: [subject.subjectId], observations: [], lineage: { edges: [], gaps: [] }, policyInputDigest: `sha256:${"c".repeat(64)}`, snapshotDigest: `sha256:${"d".repeat(64)}` }), "utf8");
    assert.equal(await executePolicyCheck(path, true, true), 3);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("policy check quiet mode emits no human output on success", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  const original = console.log;
  const lines: string[] = [];
  console.log = (line?: unknown) => lines.push(String(line));
  try {
    await writeFile(join(root, "evaluation.json"), JSON.stringify(validEvaluation()), "utf8");
    assert.equal(await executePolicyCheck(join(root, "evaluation.json"), false, true), 0);
    assert.deepEqual(lines, []);
  } finally {
    console.log = original;
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check quiet mode suppresses input errors", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-quiet-error-"));
  const original = console.error; const lines: string[] = [];
  console.error = (line?: unknown) => lines.push(String(line));
  try { const path = join(root, "invalid.json"); await writeFile(path, "{}", "utf8"); assert.equal(await executePolicyCheck(path, false, true), 2); assert.deepEqual(lines, []); }
  finally { console.error = original; await rm(root, { recursive: true, force: true }); }
});

test("policy check preserves BLOCK and INCOMPLETE exit codes", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-exits-"));
  try {
    const blocked = join(root, "blocked.json");
    const incomplete = join(root, "incomplete.json");
    await writeFile(blocked, JSON.stringify(validEvaluation("failed")), "utf8");
    await writeFile(incomplete, JSON.stringify(validEvaluation("stale")), "utf8");
    assert.equal(await executePolicyCheck(blocked, true, true), 1);
    assert.equal(await executePolicyCheck(incomplete, true, true), 3);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("policy check rejects directory inputs before parsing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-dir-"));
  try {
    assert.equal(await executePolicyCheck(root, true, true), 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check rejects symlink inputs before parsing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-link-"));
  try {
    const target = join(root, "evaluation.json");
    const link = join(root, "evaluation-link.json");
    await writeFile(target, JSON.stringify(validEvaluation()), "utf8");
    await symlink(target, link);
    assert.equal(await executePolicyCheck(link, true, true), 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
