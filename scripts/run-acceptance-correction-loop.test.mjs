import assert from "node:assert/strict";
import test from "node:test";
import { runAcceptanceCorrectionLoop } from "./run-acceptance-correction-loop.mjs";

const SHA = "sha256:" + "a".repeat(64);
const CANDIDATE = {
  cliCommit: "3d4bca1f3d306a2d69798d0af58f1361cec69620",
  webCommit: "16ceddc9855e75e04f10ddd276fae16c7ef09e01",
  version: "2.0.0-alpha.4",
};
const FROZEN = "2026-10-22T10:00:00.000Z";
const REVIEWED = "2026-10-22T11:00:00.000Z";

function input(overrides = {}) {
  return {
    schema: "verglos.private.acceptance-correction-loop.v1",
    candidate: CANDIDATE,
    corpus: {
      manifestSha256: SHA,
      fixtures: [
        { name: "train-fixture", exactCommit: "1111111" },
        { name: "holdout-fixture", exactCommit: "2222222" },
      ],
    },
    split: {
      train: ["train-fixture"],
      holdout: ["holdout-fixture"],
      holdoutFrozenAt: FROZEN,
      holdoutReviewAt: REVIEWED,
    },
    observations: [
      { id: "train-finding", fixture: "train-fixture", kind: "finding", impact: "high", digest: SHA },
      { id: "holdout-claim", fixture: "holdout-fixture", kind: "claim", impact: "high", digest: SHA },
      { id: "low-observation", fixture: "holdout-fixture", kind: "finding", impact: "normal", digest: SHA },
    ],
    adjudications: [
      { observationId: "train-finding", outcome: "false_positive", reviewer: "owner-review", reviewedAt: FROZEN },
      { observationId: "holdout-claim", outcome: "supported", reviewer: "owner-review", reviewedAt: REVIEWED },
    ],
    corrections: [
      { id: "rule-correction-1", kind: "rule", status: "applied", sourceObservationIds: ["train-finding"], changedPaths: ["packages/scanner/src/rules.ts"], createdAt: FROZEN },
    ],
    finalHoldout: {
      candidateCliCommit: CANDIDATE.cliCommit,
      candidateWebCommit: CANDIDATE.webCommit,
      tuningAppliedAfterFreeze: false,
      correctionIds: [],
      reviewedObservationIds: ["holdout-claim"],
    },
    ...overrides,
  };
}

test("acceptance correction loop protects the holdout and emits digest-only adjudications", () => {
  const report = runAcceptanceCorrectionLoop(input(), { now: new Date("2026-10-23T12:00:00.000Z") });
  assert.equal(report.gate.protocolStatus, "complete");
  assert.equal(report.split.holdoutProtected, true);
  assert.equal(report.summary.highImpactReviewedCount, 2);
  assert.equal(report.summary.correctionCount, 1);
  assert.equal(report.corrections[0].sourceObservationIds[0], "train-finding");
  assert.equal("digest" in report.adjudications[0], false);
  assert.equal(report.gate.customerAcceptance, "not-claimed");
  assert.equal(report.gate.independentReview, "required");
});

test("rejects a correction derived from a holdout observation", () => {
  assert.throws(() => runAcceptanceCorrectionLoop(input({
    corrections: [{ id: "bad", kind: "copy", status: "applied", sourceObservationIds: ["holdout-claim"], changedPaths: ["docs/public.md"], createdAt: FROZEN }],
  })), /references a holdout observation/u);
});

test("rejects a high-impact observation without adjudication", () => {
  assert.throws(() => runAcceptanceCorrectionLoop(input({
    adjudications: [{ observationId: "train-finding", outcome: "false_positive", reviewer: "owner-review", reviewedAt: FROZEN }],
    finalHoldout: { ...input().finalHoldout, reviewedObservationIds: [] },
  })), /every high-impact finding\/claim requires adjudication/u);
});

test("rejects overlap between training and holdout partitions", () => {
  assert.throws(() => runAcceptanceCorrectionLoop(input({
    split: { ...input().split, holdout: ["train-fixture", "holdout-fixture"] },
  })), /partitions overlap/u);
});

test("rejects corrections created after the holdout freeze", () => {
  assert.throws(() => runAcceptanceCorrectionLoop(input({
    corrections: [{ id: "late", kind: "evidence", status: "applied", sourceObservationIds: ["train-finding"], changedPaths: ["docs/evidence.md"], createdAt: REVIEWED }],
  })), /created after holdout freeze/u);
});

test("rejects non-string protocol dates instead of coercing them", () => {
  assert.throws(() => runAcceptanceCorrectionLoop(input({
    split: { ...input().split, holdoutFrozenAt: null },
  })), /holdoutFrozenAt is invalid/u);
});

test("rejects a future holdout review timestamp", () => {
  assert.throws(() => runAcceptanceCorrectionLoop(input({
    split: { ...input().split, holdoutReviewAt: "2026-10-23T13:00:00.000Z" },
  }), { now: "2026-10-23T12:00:00.000Z" }), /holdoutReviewAt is in the future/u);
});

test("rejects a malformed candidate version", () => {
  assert.throws(() => runAcceptanceCorrectionLoop(input({ candidate: { ...CANDIDATE, version: "latest" } })), /candidate version is invalid/u);
});
