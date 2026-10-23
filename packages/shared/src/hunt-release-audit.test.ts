import assert from "node:assert/strict";
import { test } from "node:test";
import { assembleReleaseRecordBundle } from "./record-assembly.js";
import { canonicalizeJson } from "./schema.js";
import { createSubject, SUBJECT_SCHEMA } from "./subject.js";
import { createLineageGraphDocument, LINEAGE_GRAPH_SCHEMA } from "./lineage-graph.js";
import { POLICY_DOCUMENT_SCHEMA, parsePolicyDocument, policyDocumentDigest } from "./policy-document.js";
import { createPolicyEvaluation, POLICY_EVALUATION_SCHEMA } from "./policy-evaluation.js";
import { createReleaseDecision, RELEASE_DECISION_SCHEMA } from "./release-decision.js";
import { OBSERVATION_SCHEMA } from "./observation.js";
import { TOOL_RUN_SCHEMA } from "./engine.js";
import { VERIFICATION_ATTEMPT_SCHEMA } from "./verification.js";
import { auditHuntReleaseEvidence, HUNT_RELEASE_EVIDENCE_SCHEMA, parseHuntReleaseEvidence } from "./hunt-release-audit.js";

const digest = (char: string) => ({ algorithm: "sha256" as const, value: char.repeat(64) });
const bytes = (value: unknown) => new TextEncoder().encode(canonicalizeJson(value));
const subject = createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 1 });
const runId = "urn:uuid:12345678-1234-4123-8123-123456789abc";
const observationId = "urn:uuid:22345678-1234-4123-8123-123456789abc";
const findingId = "finding-hunt-a1";
const ruleId = "hunt.a1.utf8-contains";
const recipeDigest = `sha256:${"c".repeat(64)}`;
const trustPolicyDigest = `sha256:${"d".repeat(64)}`;
const approvalRequestDigest = `sha256:${"e".repeat(64)}`;
const evidenceDigest = digest("1");

const run = {
  schemaId: TOOL_RUN_SCHEMA.id,
  schemaVersion: TOOL_RUN_SCHEMA.version,
  runId,
  subjectId: subject.subjectId,
  engine: {
    producer: { id: "verglos.native-scanner", kind: "native", name: "Verglos scanner", version: "1.0.0" },
    observedAt: "2026-10-13T00:00:00.000Z",
    state: "healthy",
    components: [{ id: "scanner.binary", kind: "binary", name: "Verglos scanner", version: "1.0.0", digest: digest("2"), source: "bundled", trust: "verified" }],
    capabilities: [{ id: "repository.scan", subjectKinds: ["filesystem"], status: "supported" }],
    freshness: [],
    incompleteReasons: [],
  },
  requestedCapabilities: ["repository.scan"],
  executedCapabilities: ["repository.scan"],
  executionClass: "in-process",
  networkAccess: "none",
  targetCodeExecuted: false,
  startedAt: "2026-10-13T00:00:00.000Z",
  completedAt: "2026-10-13T00:00:01.000Z",
  durationMs: 1000,
  timeoutMs: 30000,
  outcome: "succeeded",
  processResult: { kind: "exited", code: 0 },
  coverage: "complete",
  incompleteReasons: [],
};

const observation = {
  schemaId: OBSERVATION_SCHEMA.id,
  schemaVersion: OBSERVATION_SCHEMA.version,
  observationId,
  subjectId: subject.subjectId,
  origin: { kind: "native", producerId: "verglos.native-scanner", runId, ruleId },
  coverageClass: "native",
  category: "injection",
  title: "Hunt candidate",
  description: "A bounded Hunt candidate was recorded.",
  locations: [{ kind: "source", path: "app.js", startLine: 1 }],
  severity: { original: { system: "verglos", value: "high" }, normalized: "high", mapping: { id: "verglos.severity", version: "1.0.0" } },
  confidence: { level: "high", score: 0.9, method: "verglos.confidence", mappingVersion: "1.0.0" },
  evidence: [],
  references: [],
  extensions: {},
};

const attempt = {
  schemaId: VERIFICATION_ATTEMPT_SCHEMA.id,
  schemaVersion: VERIFICATION_ATTEMPT_SCHEMA.version,
  attemptId: "urn:uuid:32345678-1234-4123-8123-123456789abc",
  subjectId: subject.subjectId,
  observationId,
  findingId,
  ruleId,
  recipe: {
    id: "verglos.hunt.a1.utf8-contains",
    version: "1.0.0",
    digest: digest("c"),
    signatureStatus: "verified",
    signer: "fixture-signer",
    trustPolicyDigest: digest("d"),
  },
  approval: { required: true, status: "approved", requestDigest: digest("e"), actor: "owner", approvedAt: "2026-10-13T00:01:00.000Z" },
  sandbox: { isolation: "container", runtime: "fixture-container", runtimeDigest: digest("3"), filesystem: "ephemeral-write", network: { mode: "denied", destinations: [] }, nonRoot: true, cleanup: "succeeded" },
  inputDigest: digest("4"),
  parameterDigest: digest("5"),
  secretInputs: "none",
  limits: { timeoutMs: 30000, cpuMs: 10000, memoryBytes: 268435456, diskBytes: 104857600, maxProcesses: 16, maxOutputBytes: 1048576, maxNetworkRequests: 0 },
  executed: true,
  startedAt: "2026-10-13T00:02:00.000Z",
  completedAt: "2026-10-13T00:02:01.000Z",
  usage: { durationMs: 1000, cpuMs: 500, peakMemoryBytes: 1048576, diskBytes: 4096, processes: 2, outputBytes: 128, networkRequests: 0 },
  output: { evidenceDigest, artifacts: [] },
  verdict: "confirmed",
  reason: "The bounded Hunt recipe reproduced the observation.",
  limitations: ["Fixture covers one exact subject and recipe."],
};

const evidence = {
  schemaId: HUNT_RELEASE_EVIDENCE_SCHEMA.id,
  schemaVersion: HUNT_RELEASE_EVIDENCE_SCHEMA.version,
  kind: "proof" as const,
  status: "completed" as const,
  executes: true,
  hypothesisDigest: digest("6"),
  targetSubjectId: subject.subjectId,
  findingId,
  ruleId,
  observationId,
  execution: { recipeDigest, trustPolicyDigest, approvalRequestDigest },
  sandbox: "docker",
  outcome: { findingId, verdict: "true" as const, canonicalVerdict: "confirmed" as const, reason: "The finding reproduced.", durationMs: 1000, evidenceDigest: "sha256:" + "1".repeat(64), executionStatus: "completed" as const },
  counterexample: { findingId, verdict: "false" as const, canonicalVerdict: "not-reproduced" as const, reason: "The negative control did not reproduce.", durationMs: 1000, evidenceDigest: "sha256:" + "7".repeat(64), executionStatus: "completed" as const },
  verificationAttempt: attempt,
  proof: { status: "confirmed" as const, negativeControl: "passed" as const, limitation: "Fixture proof is bounded to a deterministic control." },
};

function completeRecord() {
  const policy = parsePolicyDocument({
    schemaId: POLICY_DOCUMENT_SCHEMA.id,
    schemaVersion: POLICY_DOCUMENT_SCHEMA.version,
    policyId: "verglos.policy.release",
    policyVersion: "1.0.0",
    checks: [{ id: "verglos.check.hunt", requirement: "required", onFailure: "BLOCK", severities: ["high"], minimumConfidence: 0, freshness: "current", coverage: "complete", artifactMatch: "not-required", hunt: "required" }],
    exceptions: { enabled: false, requireApproval: false },
    approvals: { required: false, authorities: [] },
  });
  const evaluation = createPolicyEvaluation({
    schemaId: POLICY_EVALUATION_SCHEMA.id,
    schemaVersion: POLICY_EVALUATION_SCHEMA.version,
    evaluationId: "urn:uuid:42345678-1234-4123-8123-123456789abc",
    policy: { id: policy.policyId, version: policy.policyVersion, digest: { algorithm: "sha256", value: policyDocumentDigest(policy).slice("sha256:".length) } },
    subjectId: subject.subjectId,
    subjectMatch: { status: "matched", observedSubjectId: subject.subjectId },
    evaluatedAt: "2026-10-13T00:03:00.000Z",
    checks: [{ id: "verglos.check.hunt", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [evidenceDigest], observationIds: [observationId], freshness: { status: "current", checkedAt: "2026-10-13T00:03:00.000Z", validUntil: "2026-10-14T00:03:00.000Z" }, owner: "owner", reason: "Hunt evidence is bound.", nextAction: "Retain the evidence." }],
    limitations: ["Fixture record only."],
  });
  const decision = createReleaseDecision({ decisionId: "urn:uuid:52345678-1234-4123-8123-123456789abc", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], issuedBy: { kind: "person", id: "owner", authority: "release-decision" }, generatedAt: "2026-10-13T00:04:00.000Z", limitations: ["Fixture record only."] });
  return assembleReleaseRecordBundle({
    schemaId: "urn:verglos:schema:release-record-manifest",
    schemaVersion: "1.0.0",
    bundleVersion: "1.0.0",
    manifestId: "urn:uuid:62345678-1234-4123-8123-123456789abc",
    generatedAt: "2026-10-13T00:05:00.000Z",
    generator: { id: "verglos.record-builder", version: "1.0.0" },
    redaction: { status: "not-required" },
    limitations: ["Fixture record only."],
    payloads: [
      { path: "subjects/0001.json", kind: "subject" as const, mediaType: "application/json", bytes: bytes(subject), required: true, schema: SUBJECT_SCHEMA },
      { path: "lineage.json", kind: "lineage" as const, mediaType: "application/json", bytes: bytes(createLineageGraphDocument({ subjectIds: [subject.subjectId], edges: [], gaps: ["Fixture has no source lineage."] })), required: true, schema: LINEAGE_GRAPH_SCHEMA },
      { path: "runs/scan.json", kind: "tool-run" as const, mediaType: "application/json", bytes: bytes(run), required: true, schema: TOOL_RUN_SCHEMA },
      { path: "observations/hunt.json", kind: "observation" as const, mediaType: "application/json", bytes: bytes(observation), required: true, schema: OBSERVATION_SCHEMA },
      { path: "attempts/hunt.json", kind: "verification-attempt" as const, mediaType: "application/json", bytes: bytes(attempt), required: true, schema: VERIFICATION_ATTEMPT_SCHEMA },
      { path: "policy.json", kind: "policy" as const, mediaType: "application/json", bytes: bytes(policy), required: true, schema: POLICY_DOCUMENT_SCHEMA },
      { path: "policy-evaluation.json", kind: "policy-evaluation" as const, mediaType: "application/json", bytes: bytes(evaluation), required: true, schema: POLICY_EVALUATION_SCHEMA },
      { path: "release-decision.json", kind: "release-decision" as const, mediaType: "application/json", bytes: bytes(decision), required: true, schema: RELEASE_DECISION_SCHEMA },
    ],
  });
}

test("Hunt release evidence schema requires a typed proof envelope", () => {
  assert.equal(parseHuntReleaseEvidence(evidence).kind, "proof");
  assert.equal(parseHuntReleaseEvidence({
    schemaId: HUNT_RELEASE_EVIDENCE_SCHEMA.id,
    schemaVersion: HUNT_RELEASE_EVIDENCE_SCHEMA.version,
    kind: "retest",
    status: "completed",
    executes: true,
    beforeSubjectId: `urn:verglos:subject:filesystem:sha256:${"9".repeat(64)}`,
    afterSubjectId: subject.subjectId,
    findingId,
    ruleId,
    remediation: { proposalDigest: `sha256:${"8".repeat(64)}`, approvalRequestDigest: `sha256:${"7".repeat(64)}`, approved: true, applied: false, limitation: "Fixture remediation was not applied." },
    proof: evidence,
    retest: { status: "cleared", sameProof: true, limitation: "Fixture retest only." },
  }).kind, "retest");
  assert.throws(() => parseHuntReleaseEvidence({ ...evidence, execution: { ...evidence.execution, approvalRequestDigest: "sha256:bad" } }), /validation failed/);
  assert.throws(
    () => parseHuntReleaseEvidence({ ...evidence, verificationAttempt: undefined }),
    (error: unknown) => error instanceof Error && "issues" in error && Array.isArray((error as { issues?: unknown }).issues) && ((error as { issues: Array<{ path: string }> }).issues.some((issue) => issue.path === "verificationAttempt")),
  );
});

test("Hunt release audit binds exact recipe, trust, approval, finding, rule, subject, and observation identities", () => {
  const record = completeRecord();
  const result = auditHuntReleaseEvidence({ evidence, manifest: record.manifest, payloads: record.payloads });
  assert.equal(result.status, "auditable", result.reasons.join("; "));
  assert.deepEqual(result.matchedVerificationAttemptPaths, ["attempts/hunt.json"]);
  assert.equal(result.decision, "PASS");

  const tampered = { ...evidence, execution: { ...evidence.execution, approvalRequestDigest: `sha256:${"f".repeat(64)}` } };
  const denied = auditHuntReleaseEvidence({ evidence: tampered, manifest: record.manifest, payloads: record.payloads });
  assert.equal(denied.status, "not-auditable");
  assert.match(denied.reasons.join("\n"), /exact Hunt recipe, trust policy, approval/);

  const detached = { ...evidence, verificationAttempt: { ...attempt, attemptId: "urn:uuid:72345678-1234-4123-8123-123456789abc" } };
  const detachedResult = auditHuntReleaseEvidence({ evidence: detached, manifest: record.manifest, payloads: record.payloads });
  assert.equal(detachedResult.status, "not-auditable");
  assert.match(detachedResult.reasons.join("\n"), /does not contain the emitted Hunt verification attempt/);
});
