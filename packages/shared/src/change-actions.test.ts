import assert from "node:assert/strict";
import { test } from "node:test";
import { projectChangeActions } from "./change-actions.js";
import { diffReleaseSnapshots } from "./release-diff.js";
import { createReleaseSnapshot } from "./release-snapshot.js";
import { createSubject } from "./subject.js";

const subject = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "e".repeat(64) }, size: 1, mediaType: "application/octet-stream" });
const digest = `sha256:${"a".repeat(64)}`;

function observation(severity: "high" | "critical") {
  return {
    schemaId: "urn:verglos:schema:observation",
    schemaVersion: "1.0.0",
    observationId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    subjectId: subject.subjectId,
    origin: { kind: "native", producerId: "verglos.native-scanner", runId: "urn:uuid:22345678-1234-4123-8123-123456789abc", ruleId: "D1-001" },
    coverageClass: "native",
    category: "security.test",
    title: "Test observation",
    description: "Validated test observation.",
    locations: [{ kind: "artifact", path: "finding.json" }],
    severity: { original: { system: "test", value: severity }, normalized: severity, mapping: { id: "test.severity-map", version: "1.0.0" } },
    confidence: { level: "high", method: "test.confidence", mappingVersion: "1.0.0" },
    remediation: { summary: "Apply the documented fix." },
    evidence: [], references: [], extensions: {},
  };
}

function snapshot(severity: "high" | "critical") {
  const coverage = { schemaVersion: "1.0.0" as const, status: "complete" as const, target: { state: "complete" as const, limitations: [] }, producers: [{ producer: "native" as const, state: "complete" as const, observationCount: 1, runIds: [], sourceDigests: [], limitations: [] }] };
  return createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [{ fingerprint: digest, producerIds: ["verglos.native-scanner"], payloads: [observation(severity)], disagreement: false }], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage });
}

test("change actions expose remediation, owner, rescan, Hunt, and decision-scope blockers honestly", () => {
  const base = snapshot("high");
  const head = snapshot("critical");
  const diff = diffReleaseSnapshots(base, head);
  const actions = projectChangeActions(diff, base, head);
  assert.equal(actions.changes[0]?.status, "worsened");
  assert.deepEqual(actions.changes[0]?.remediation, ["Apply the documented fix."]);
  assert.equal(actions.changes[0]?.owner.status, "unassigned");
  assert.equal(actions.changes[0]?.rescan.status, "required");
  assert.equal(actions.changes[0]?.huntEligibility.status, "not-evaluated");
  assert.deepEqual(actions.blockers, []);
});

test("legacy or incomplete snapshots remain explicit blockers, not implied clean comparisons", () => {
  const base = snapshot("high");
  const head = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [{ fingerprint: digest, producerIds: ["unknown"], payloads: [], disagreement: false }], lineage: { edges: [], gaps: [] }, policyInputs: {}, coverage: { schemaVersion: "1.0.0", status: "incomplete", target: { state: "complete", limitations: [] }, producers: [{ producer: "native", state: "failed", observationCount: 0, runIds: [], sourceDigests: [], limitations: ["scan failed"] }] } });
  const diff = diffReleaseSnapshots(base, head);
  const actions = projectChangeActions(diff, base, head);
  assert.deepEqual(diff.severityUnassessed, [digest]);
  assert.ok(actions.blockers.some((blocker) => blocker.code === "coverage-incomplete"));
  assert.ok(actions.blockers.some((blocker) => blocker.code === "severity-unassessed"));
  assert.ok(actions.nextActions.some((action) => action.includes("Refresh or import complete severity evidence")));
});
