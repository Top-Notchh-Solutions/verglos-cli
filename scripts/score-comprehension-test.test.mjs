import assert from "node:assert/strict";
import { test } from "node:test";
import { COMPREHENSION_QUESTION_IDS, scoreComprehensionRun } from "./score-comprehension-test.mjs";

const participantDigest = `sha256:${"a".repeat(64)}`;
const artifact = {
  digest: `sha256:${"b".repeat(64)}`,
  subject: "release-candidate/2026-10-19",
  decision: "no-go",
  rubric: {
    "artifact-subject": [["release-candidate/2026-10-19"], ["artifact"]],
    "release-decision": [["no-go"], ["decision"]],
    "change-since-previous": [["manifest"], ["digest"]],
    "remaining-risk": [["provider"], ["acceptance"]],
    authenticity: [["source commit"], ["sha256"]],
    "outside-coverage": [["customer"], ["production"]],
  },
  forbiddenTerms: ["customer acceptance", "production deletion", "appsec pass"],
};

function answers(extra = {}) {
  return COMPREHENSION_QUESTION_IDS.map((questionId) => ({
    questionId,
    answer: {
      "artifact-subject": "The release-candidate/2026-10-19 artifact is the bounded report.",
      "release-decision": "The decision is no-go until the remaining gates are accepted.",
      "change-since-previous": "The manifest digest records the change since the previous report.",
      "remaining-risk": "Provider and acceptance risk remain open.",
      authenticity: "The source commit and sha256 digest establish authenticity.",
      "outside-coverage": "Customer and production actions are outside coverage.",
    }[questionId],
    ...extra[questionId],
  }));
}

function run(overrides = {}) {
  return {
    schema: "verglos.private.comprehension-run.v1",
    protocolVersion: "2026-10-19",
    completedAt: "2026-10-19T12:00:00.000Z",
    artifact,
    participants: [{
      participantDigest,
      role: "developer",
      consentedAt: "2026-10-19T10:00:00.000Z",
      expiresAt: "2026-10-20T10:00:00.000Z",
      answers: answers(),
    }],
    ...overrides,
  };
}

test("scores the exact six-question rubric and emits only bounded answer digests", () => {
  const report = scoreComprehensionRun(run(), { now: new Date("2026-10-19T12:01:00.000Z") });
  assert.equal(report.aggregate.participantCount, 1);
  assert.equal(report.participants[0].correctAnswers, 6);
  assert.equal(report.participants[0].passed, true);
  assert.equal(report.gate.participantRun, "passed");
  assert.equal(report.gate.acceptanceStatus, "open");
  assert.equal("answer" in report.participants[0].questions[0], false);
  assert.match(report.participants[0].questions[0].answerDigest, /^sha256:[a-f0-9]{64}$/u);
});

test("does not trust a caller-provided correct flag and detects critical hallucination", () => {
  const input = run();
  input.participants[0].answers[0].correct = true;
  input.participants[0].answers[5].answer = "Customer acceptance and production deletion are covered.";
  const report = scoreComprehensionRun(input);
  assert.equal(report.participants[0].correctAnswers, 5);
  assert.equal(report.participants[0].criticalHallucinations, 2);
  assert.equal(report.participants[0].passed, false);
  assert.equal(report.gate.participantRun, "failed");
});

test("requires a valid consent window and every unique question", () => {
  const expired = run();
  expired.participants[0].expiresAt = "2026-10-19T11:59:59.000Z";
  assert.throws(() => scoreComprehensionRun(expired), /consent window/u);

  const duplicate = run();
  duplicate.participants[0].answers[5].questionId = duplicate.participants[0].answers[0].questionId;
  assert.throws(() => scoreComprehensionRun(duplicate), /unknown or duplicate question/u);
});

test("rejects raw secret-like participant answers before scoring", () => {
  const input = run();
  input.participants[0].answers[0].answer = "DATABASE_URL=should-never-be-recorded";
  assert.throws(() => scoreComprehensionRun(input), /secret-like material/u);
});
