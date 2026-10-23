import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { readBoundedJsonFile } from "./read-bounded-json.mjs";

export const COMPREHENSION_QUESTION_IDS = Object.freeze([
  "artifact-subject",
  "release-decision",
  "change-since-previous",
  "remaining-risk",
  "authenticity",
  "outside-coverage",
]);

const PARTICIPANT_ROLES = new Set(["developer", "lead", "recipient"]);
const PARTICIPANT_KINDS = new Set(["consenting-participant", "owner-controlled-synthetic"]);
const SHA256 = /^sha256:[a-f0-9]{64}$/u;
const MAX_ANSWER_BYTES = 4096;
const MAX_TERM_BYTES = 160;
const MAX_PARTICIPANTS = 256;
const SECRET_LIKE = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/u,
  /(?:DATABASE_URL|CLERK_SECRET_KEY|RAZORPAY_KEY_SECRET)\s*=/iu,
  /\brzp_(?:test|live)_[A-Za-z0-9]{12,}\b/u,
];

/**
 * Score a preregistered comprehension run without storing participant
 * identity or raw answers in the emitted report. The caller cannot mark an
 * answer correct: scoring is derived from the frozen rubric carried by the
 * exact artifact under test.
 */
export function scoreComprehensionRun(input, { now = new Date() } = {}) {
  rejectSecretLike(input);
  const run = validateRun(input);
  const completedAt = parseDate(run.completedAt, "completedAt");
  const currentTime = now instanceof Date ? now : parseDate(now, "now");
  if (completedAt > currentTime) throw new Error("completedAt is in the future");

  const artifact = validateArtifact(run.artifact);
  const participants = run.participants.map((participant) => scoreParticipant(participant, artifact, completedAt));
  const participantKinds = [...new Set(participants.map((participant) => participant.participantKind))];
  const criticalHallucinations = participants.reduce((total, participant) => total + participant.criticalHallucinations, 0);
  const failedParticipants = participants.filter((participant) => !participant.passed).length;
  const passed = criticalHallucinations === 0 && failedParticipants === 0;

  return Object.freeze({
    schema: "verglos.private.comprehension-score.v1",
    protocolVersion: run.protocolVersion,
    completedAt: completedAt.toISOString(),
    artifact: Object.freeze({
      digest: artifact.digest,
      subjectDigest: digestText(artifact.subject),
      decision: artifact.decision,
    }),
    participants: Object.freeze(participants),
    aggregate: Object.freeze({
      participantCount: participants.length,
      passedParticipants: participants.length - failedParticipants,
      failedParticipants,
      criticalHallucinations,
      requiredCorrectPerParticipant: 5,
      questionCount: COMPREHENSION_QUESTION_IDS.length,
      participantKinds: Object.freeze(participantKinds),
    }),
    gate: Object.freeze({
      participantRun: passed ? "passed" : "failed",
      independentReview: "required",
      acceptanceStatus: "open",
      evidenceClass: participantKinds.length === 1 ? participantKinds[0] : "mixed-participant-sources",
    }),
  });
}

export async function scoreComprehensionFile(inputPath, outputPath, options = {}) {
  const input = await readBoundedJsonFile(inputPath, "comprehension run input");
  const report = scoreComprehensionRun(input, options);
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return report;
}

function validateRun(input) {
  if (!input || typeof input !== "object") throw new Error("comprehension run must be an object");
  if (input.schema !== "verglos.private.comprehension-run.v1") throw new Error("unsupported comprehension run schema");
  if (typeof input.protocolVersion !== "string" || input.protocolVersion.length === 0 || input.protocolVersion.length > 64) {
    throw new Error("comprehension run protocolVersion is invalid");
  }
  if (!Array.isArray(input.participants) || input.participants.length === 0 || input.participants.length > MAX_PARTICIPANTS) {
    throw new Error("comprehension run requires a bounded participant list");
  }
  const participantDigests = new Set();
  for (const participant of input.participants) {
    if (!participant || typeof participant !== "object" || typeof participant.participantDigest !== "string" || !SHA256.test(participant.participantDigest)) continue;
    if (participantDigests.has(participant.participantDigest)) throw new Error("comprehension run contains duplicate participant identity");
    participantDigests.add(participant.participantDigest);
  }
  return input;
}

function validateArtifact(input) {
  if (!input || typeof input !== "object") throw new Error("comprehension artifact is required");
  if (typeof input.digest !== "string" || !SHA256.test(input.digest)) throw new Error("comprehension artifact digest is invalid");
  if (typeof input.subject !== "string" || input.subject.trim().length === 0 || input.subject.length > 512) throw new Error("comprehension artifact subject is invalid");
  if (!new Set(["go", "no-go", "conditional"]).has(input.decision)) throw new Error("comprehension artifact decision is invalid");
  if (!input.rubric || typeof input.rubric !== "object") throw new Error("comprehension artifact rubric is required");
  for (const questionId of COMPREHENSION_QUESTION_IDS) {
    const groups = input.rubric[questionId];
    if (!Array.isArray(groups) || groups.length === 0 || groups.some((group) => !Array.isArray(group) || group.length === 0)) {
      throw new Error(`comprehension rubric is incomplete for ${questionId}`);
    }
    for (const group of groups) for (const term of group) validateTerm(term, `rubric ${questionId}`);
  }
  if (!Array.isArray(input.forbiddenTerms) || input.forbiddenTerms.length === 0) throw new Error("comprehension forbiddenTerms are required");
  for (const term of input.forbiddenTerms) validateTerm(term, "forbiddenTerms");
  if (input.digest !== digestText(canonicalArtifactPayload(input))) throw new Error("comprehension artifact digest does not match rubric payload");
  return input;
}

function scoreParticipant(input, artifact, completedAt) {
  if (!input || typeof input !== "object") throw new Error("participant is invalid");
  if (typeof input.participantDigest !== "string" || !SHA256.test(input.participantDigest)) throw new Error("participant identity must be a digest");
  if (typeof input.role !== "string" || !PARTICIPANT_ROLES.has(input.role)) throw new Error("participant role is invalid");
  if (typeof input.participantKind !== "string" || !PARTICIPANT_KINDS.has(input.participantKind)) throw new Error("participant kind is invalid");
  const consentedAt = parseDate(input.consentedAt, "participant consentedAt");
  const expiresAt = parseDate(input.expiresAt, "participant expiresAt");
  if (consentedAt > completedAt || expiresAt <= completedAt || expiresAt <= consentedAt) {
    throw new Error("participant consent window does not cover the completed run");
  }
  if (!Array.isArray(input.answers) || input.answers.length !== COMPREHENSION_QUESTION_IDS.length) {
    throw new Error("participant must answer all six comprehension questions");
  }

  const answers = new Map();
  for (const answer of input.answers) {
    if (!answer || typeof answer !== "object" || typeof answer.questionId !== "string" || typeof answer.answer !== "string") {
      throw new Error("participant answer is invalid");
    }
    if (!COMPREHENSION_QUESTION_IDS.includes(answer.questionId) || answers.has(answer.questionId)) {
      throw new Error("participant answers contain an unknown or duplicate question");
    }
    if (answer.answer.length === 0 || Buffer.byteLength(answer.answer, "utf8") > MAX_ANSWER_BYTES) {
      throw new Error("participant answer is empty or too long");
    }
    if (SECRET_LIKE.some((pattern) => pattern.test(answer.answer))) throw new Error("participant answer contains secret-like material");
    answers.set(answer.questionId, answer.answer);
  }
  if (answers.size !== COMPREHENSION_QUESTION_IDS.length) throw new Error("participant answers are incomplete");

  const forbidden = artifact.forbiddenTerms.map(normalizeTerm);
  const scored = COMPREHENSION_QUESTION_IDS.map((questionId) => {
    const answer = answers.get(questionId);
    const normalized = normalizeTerm(answer);
    const matchedGroups = artifact.rubric[questionId].map((group) => group.some((term) => normalized.includes(normalizeTerm(term))));
    const hallucinations = forbidden.filter((term) => normalized.includes(term));
    const correct = matchedGroups.every(Boolean) && hallucinations.length === 0;
    return Object.freeze({
      questionId,
      correct,
      matchedGroups: matchedGroups.filter(Boolean).length,
      requiredGroups: matchedGroups.length,
      criticalHallucinations: hallucinations.length,
      answerDigest: digestText(answer),
    });
  });
  const correctCount = scored.filter((question) => question.correct).length;
  const criticalHallucinations = scored.reduce((total, question) => total + question.criticalHallucinations, 0);
  return Object.freeze({
    participantDigest: input.participantDigest,
    role: input.role,
    participantKind: input.participantKind,
    correctAnswers: correctCount,
    questionCount: scored.length,
    criticalHallucinations,
    passed: correctCount >= 5 && criticalHallucinations === 0,
    questions: Object.freeze(scored),
  });
}

function validateTerm(term, context) {
  if (typeof term !== "string" || term.trim().length === 0 || Buffer.byteLength(term, "utf8") > MAX_TERM_BYTES) {
    throw new Error(`${context} contains an invalid term`);
  }
}

function normalizeTerm(value) {
  return value.normalize("NFKC").toLocaleLowerCase("en-US").replace(/\s+/gu, " ").trim();
}

function digestText(value) {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

function canonicalArtifactPayload(input) {
  return JSON.stringify({ subject: input.subject, decision: input.decision, rubric: input.rubric, forbiddenTerms: input.forbiddenTerms });
}

function rejectSecretLike(input) {
  if (SECRET_LIKE.some((pattern) => pattern.test(JSON.stringify(input)))) throw new Error("comprehension input contains secret-like material");
}

function parseDate(value, label) {
  if (typeof value !== "string") throw new Error(`${label} is invalid`);
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error(`${label} is invalid`);
  return date;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) throw new Error("usage: node scripts/score-comprehension-test.mjs INPUT.json OUTPUT.json");
  const report = await scoreComprehensionFile(inputPath, outputPath);
  process.stdout.write(`${JSON.stringify({ schema: report.schema, participantCount: report.aggregate.participantCount, participantRun: report.gate.participantRun, acceptanceStatus: report.gate.acceptanceStatus })}\n`);
  if (report.gate.participantRun !== "passed") process.exitCode = 1;
}
