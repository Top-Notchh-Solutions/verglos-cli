import { writeFile } from "node:fs/promises";
import { readBoundedJsonFile } from "./read-bounded-json.mjs";

const INPUT_SCHEMA = "verglos.private.acceptance-correction-loop.v1";
const OUTPUT_SCHEMA = "verglos.private.acceptance-correction-loop-result.v1";
const COMMIT = /^[a-f0-9]{7,64}$/u;
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
const SHA256 = /^sha256:[a-f0-9]{64}$/u;
const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;
const SAFE_PATH = /^(?!\/)(?!.*\.\.)[^\u0000-\u001f]{1,512}$/u;
const IMPACTS = new Set(["high", "normal"]);
const KINDS = new Set(["finding", "claim"]);
const OUTCOMES = new Set([
  "true_positive",
  "false_positive",
  "false_truth",
  "supported",
  "unsupported",
  "inconclusive",
  "not_reproduced",
  "environment_error",
]);
const CORRECTION_KINDS = new Set(["rule", "copy", "evidence"]);
const CORRECTION_STATUSES = new Set(["applied", "accepted", "not-needed"]);
const MAX_FIXTURES = 64;
const MAX_OBSERVATIONS = 100_000;
const MAX_CORRECTIONS = 4096;

/**
 * Validate the ACCEPT-013 protocol boundary and emit a digest-only result.
 *
 * The correction loop deliberately has two phases: training observations and
 * corrections must be frozen before the holdout review starts. A correction
 * may reference only training observations, and the final holdout evaluation
 * is bound to the same immutable CLI/Web candidate. This proves protocol
 * integrity; it does not claim independent review, customer acceptance, or a
 * release decision.
 */
export function runAcceptanceCorrectionLoop(input, { now = new Date() } = {}) {
  const run = validateInput(input);
  const currentTime = validDate(now, "now");
  const generatedAt = currentTime.toISOString();
  const holdoutFrozenAt = validDate(run.split.holdoutFrozenAt, "holdoutFrozenAt");
  const holdoutReviewAt = validDate(run.split.holdoutReviewAt, "holdoutReviewAt");
  if (holdoutFrozenAt > currentTime) throw new Error("holdoutFrozenAt is in the future");
  if (holdoutReviewAt > currentTime) throw new Error("holdoutReviewAt is in the future");
  const fixtureMap = new Map(run.corpus.fixtures.map((fixture) => [fixture.name, fixture]));
  const observationMap = new Map(run.observations.map((observation) => [observation.id, observation]));
  const trainSet = new Set(run.split.train);
  const holdoutSet = new Set(run.split.holdout);

  const highImpact = run.observations.filter((observation) => observation.impact === "high");
  const highImpactIds = new Set(highImpact.map((observation) => observation.id));
  const adjudicationMap = new Map(run.adjudications.map((adjudication) => [adjudication.observationId, adjudication]));
  const missingHighImpact = highImpact.filter((observation) => !adjudicationMap.has(observation.id));
  if (missingHighImpact.length > 0) {
    throw new Error(`every high-impact finding/claim requires adjudication: ${missingHighImpact.map((item) => item.id).join(",")}`);
  }

  for (const observation of highImpact) {
    const adjudication = adjudicationMap.get(observation.id);
    const reviewedAt = validDate(adjudication.reviewedAt, `adjudication ${observation.id} reviewedAt`);
    const frozenAt = holdoutFrozenAt;
    if (reviewedAt > currentTime) throw new Error(`adjudication ${observation.id} is in the future`);
    if (trainSet.has(observation.fixture) && reviewedAt > frozenAt) {
      throw new Error(`training adjudication occurs after holdout freeze: ${observation.id}`);
    }
    if (holdoutSet.has(observation.fixture) && reviewedAt < frozenAt) {
      throw new Error(`holdout adjudication occurs before holdout freeze: ${observation.id}`);
    }
  }

  const corrections = run.corrections.map((correction) => {
    const sourceObservations = correction.sourceObservationIds.map((id) => observationMap.get(id));
    if (sourceObservations.some((observation) => !observation)) throw new Error(`correction ${correction.id} references an unknown observation`);
    if (sourceObservations.some((observation) => holdoutSet.has(observation.fixture))) {
      throw new Error(`correction ${correction.id} references a holdout observation`);
    }
    const createdAt = validDate(correction.createdAt, `correction ${correction.id} createdAt`);
    if (createdAt > currentTime) throw new Error(`correction ${correction.id} is in the future`);
    if (createdAt > holdoutFrozenAt) {
      throw new Error(`correction ${correction.id} was created after holdout freeze`);
    }
    return Object.freeze({
      id: correction.id,
      kind: correction.kind,
      status: correction.status,
      sourceObservationIds: Object.freeze([...correction.sourceObservationIds]),
      changedPaths: Object.freeze([...correction.changedPaths]),
      createdAt: correction.createdAt,
    });
  });

  const holdoutHighImpactIds = highImpact.filter((observation) => holdoutSet.has(observation.fixture)).map((observation) => observation.id).sort();
  const reviewedHoldoutIds = [...highImpactIds]
    .filter((id) => holdoutSet.has(observationMap.get(id).fixture))
    .sort();
  if (JSON.stringify(reviewedHoldoutIds) !== JSON.stringify(holdoutHighImpactIds)) {
    throw new Error("holdout high-impact review set is incomplete");
  }
  if (run.finalHoldout.candidateCliCommit !== run.candidate.cliCommit || run.finalHoldout.candidateWebCommit !== run.candidate.webCommit) {
    throw new Error("final holdout evaluation is not bound to the candidate");
  }
  if (run.finalHoldout.tuningAppliedAfterFreeze !== false) throw new Error("holdout tuning must be explicitly false");
  if (run.finalHoldout.correctionIds.length !== 0) throw new Error("corrections cannot be applied to the final holdout");
  if (run.finalHoldout.reviewedObservationIds.slice().sort().join("\n") !== reviewedHoldoutIds.join("\n")) {
    throw new Error("final holdout reviewed observation set is incomplete");
  }

  const openHighImpact = highImpact.filter((observation) => {
    const outcome = adjudicationMap.get(observation.id).outcome;
    return outcome === "inconclusive" || outcome === "environment_error";
  }).map((observation) => observation.id);
  for (const observation of highImpact) {
    const reviewedAt = validDate(adjudicationMap.get(observation.id).reviewedAt, `adjudication ${observation.id} reviewedAt`);
    if (reviewedAt > holdoutReviewAt) throw new Error(`adjudication occurs after declared holdout review: ${observation.id}`);
  }

  return Object.freeze({
    schema: OUTPUT_SCHEMA,
    generatedAt,
    candidate: Object.freeze({ ...run.candidate }),
    corpus: Object.freeze({
      manifestSha256: run.corpus.manifestSha256,
      fixtureCount: run.corpus.fixtures.length,
      trainFixtures: Object.freeze([...run.split.train]),
      holdoutFixtures: Object.freeze([...run.split.holdout]),
    }),
    split: Object.freeze({
      holdoutFrozenAt: run.split.holdoutFrozenAt,
      holdoutReviewAt: run.split.holdoutReviewAt,
      holdoutProtected: true,
      tuningAppliedAfterFreeze: false,
    }),
    summary: Object.freeze({
      observationCount: run.observations.length,
      highImpactCount: highImpact.length,
      highImpactReviewedCount: highImpact.length,
      trainingHighImpactReviewedCount: highImpact.filter((observation) => trainSet.has(observation.fixture)).length,
      holdoutHighImpactReviewedCount: holdoutHighImpactIds.length,
      correctionCount: corrections.length,
      openHighImpactCount: openHighImpact.length,
    }),
    adjudications: Object.freeze(highImpact.map((observation) => {
      const adjudication = adjudicationMap.get(observation.id);
      return Object.freeze({
        observationId: observation.id,
        fixture: observation.fixture,
        kind: observation.kind,
        impact: observation.impact,
        outcome: adjudication.outcome,
        reviewer: adjudication.reviewer,
        reviewedAt: adjudication.reviewedAt,
      });
    })),
    corrections: Object.freeze(corrections),
    gate: Object.freeze({
      protocolStatus: openHighImpact.length === 0 ? "complete" : "open-review-items",
      holdoutStatus: "reviewed",
      correctionsTrainingOnly: true,
      independentReview: "required",
      customerAcceptance: "not-claimed",
      finalAcceptance: "required",
    }),
  });
}

export async function runAcceptanceCorrectionLoopFile(inputPath, outputPath, options = {}) {
  const input = await readBoundedJsonFile(inputPath, "acceptance correction-loop input");
  const report = runAcceptanceCorrectionLoop(input, options);
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return report;
}

function validateInput(input) {
  if (!input || typeof input !== "object" || input.schema !== INPUT_SCHEMA) throw new Error("unsupported acceptance correction-loop schema");
  if (!input.candidate || typeof input.candidate !== "object") throw new Error("correction-loop candidate is required");
  for (const key of ["cliCommit", "webCommit"]) {
    if (typeof input.candidate[key] !== "string" || !COMMIT.test(input.candidate[key])) throw new Error(`candidate ${key} is invalid`);
  }
  if (typeof input.candidate.version !== "string" || !VERSION.test(input.candidate.version)) throw new Error("candidate version is invalid");
  if (!input.corpus || typeof input.corpus !== "object" || typeof input.corpus.manifestSha256 !== "string" || !SHA256.test(input.corpus.manifestSha256)) throw new Error("correction-loop corpus is invalid");
  if (!Array.isArray(input.corpus.fixtures) || input.corpus.fixtures.length < 2 || input.corpus.fixtures.length > MAX_FIXTURES) throw new Error("correction-loop fixtures are invalid");
  const fixtureNames = new Set();
  for (const fixture of input.corpus.fixtures) {
    if (!fixture || typeof fixture.name !== "string" || !SAFE_ID.test(fixture.name) || fixtureNames.has(fixture.name)) throw new Error("correction-loop fixture name is invalid");
    if (typeof fixture.exactCommit !== "string" || !COMMIT.test(fixture.exactCommit)) throw new Error(`correction-loop fixture commit is invalid: ${fixture.name}`);
    fixtureNames.add(fixture.name);
  }
  if (!input.split || typeof input.split !== "object") throw new Error("correction-loop split is required");
  const train = validatePartition(input.split.train, "train", fixtureNames);
  const holdout = validatePartition(input.split.holdout, "holdout", fixtureNames);
  if (train.length === 0 || holdout.length === 0) throw new Error("train and holdout partitions must both be non-empty");
  if (train.some((name) => holdout.includes(name))) throw new Error("train and holdout partitions overlap");
  if (new Set([...train, ...holdout]).size !== fixtureNames.size) throw new Error("train and holdout partitions do not cover the corpus");
  validDate(input.split.holdoutFrozenAt, "holdoutFrozenAt");
  validDate(input.split.holdoutReviewAt, "holdoutReviewAt");
  if (validDate(input.split.holdoutReviewAt, "holdoutReviewAt") < validDate(input.split.holdoutFrozenAt, "holdoutFrozenAt")) throw new Error("holdout review precedes holdout freeze");

  if (!Array.isArray(input.observations) || input.observations.length === 0 || input.observations.length > MAX_OBSERVATIONS) throw new Error("correction-loop observations are invalid");
  const observationIds = new Set();
  for (const observation of input.observations) {
    if (!observation || typeof observation !== "object" || typeof observation.id !== "string" || !SAFE_ID.test(observation.id) || observationIds.has(observation.id)) throw new Error("correction-loop observation id is invalid");
    if (!fixtureNames.has(observation.fixture) || !KINDS.has(observation.kind) || !IMPACTS.has(observation.impact)) throw new Error(`correction-loop observation boundary is invalid: ${observation.id}`);
    if (typeof observation.digest !== "string" || !SHA256.test(observation.digest)) throw new Error(`correction-loop observation digest is invalid: ${observation.id}`);
    observationIds.add(observation.id);
  }
  if (!Array.isArray(input.adjudications)) throw new Error("correction-loop adjudications are invalid");
  const adjudicationIds = new Set();
  for (const adjudication of input.adjudications) {
    if (!adjudication || typeof adjudication !== "object" || typeof adjudication.observationId !== "string" || !observationIds.has(adjudication.observationId) || adjudicationIds.has(adjudication.observationId)) throw new Error("correction-loop adjudication identity is invalid");
    if (!OUTCOMES.has(adjudication.outcome) || typeof adjudication.reviewer !== "string" || adjudication.reviewer.length === 0 || adjudication.reviewer.length > 128) throw new Error(`correction-loop adjudication is invalid: ${adjudication.observationId}`);
    validDate(adjudication.reviewedAt, `adjudication ${adjudication.observationId} reviewedAt`);
    adjudicationIds.add(adjudication.observationId);
  }
  if (!Array.isArray(input.corrections) || input.corrections.length > MAX_CORRECTIONS) throw new Error("correction-loop corrections are invalid");
  const correctionIds = new Set();
  for (const correction of input.corrections) {
    if (!correction || typeof correction !== "object" || typeof correction.id !== "string" || !SAFE_ID.test(correction.id) || correctionIds.has(correction.id)) throw new Error("correction-loop correction identity is invalid");
    if (!CORRECTION_KINDS.has(correction.kind) || !CORRECTION_STATUSES.has(correction.status) || !Array.isArray(correction.sourceObservationIds) || correction.sourceObservationIds.length === 0 || correction.sourceObservationIds.some((id) => !observationIds.has(id))) throw new Error(`correction-loop correction is invalid: ${correction.id}`);
    if (!Array.isArray(correction.changedPaths) || correction.changedPaths.length === 0 || correction.changedPaths.some((path) => typeof path !== "string" || !SAFE_PATH.test(path) || path.startsWith(".env"))) throw new Error(`correction-loop changed paths are invalid: ${correction.id}`);
    validDate(correction.createdAt, `correction ${correction.id} createdAt`);
    correctionIds.add(correction.id);
  }
  if (!input.finalHoldout || typeof input.finalHoldout !== "object") throw new Error("final holdout evaluation is required");
  if (!Array.isArray(input.finalHoldout.reviewedObservationIds) || !Array.isArray(input.finalHoldout.correctionIds)) throw new Error("final holdout evaluation sets are invalid");
  if (input.finalHoldout.reviewedObservationIds.some((id) => !observationIds.has(id)) || input.finalHoldout.correctionIds.some((id) => !correctionIds.has(id))) throw new Error("final holdout evaluation references an unknown item");
  return Object.freeze({
    candidate: input.candidate,
    corpus: Object.freeze({ manifestSha256: input.corpus.manifestSha256, fixtures: Object.freeze(input.corpus.fixtures.map((fixture) => Object.freeze({ name: fixture.name, exactCommit: fixture.exactCommit }))) }),
    split: Object.freeze({ train, holdout, holdoutFrozenAt: input.split.holdoutFrozenAt, holdoutReviewAt: input.split.holdoutReviewAt }),
    observations: Object.freeze(input.observations.map((observation) => Object.freeze({ ...observation }))),
    adjudications: Object.freeze(input.adjudications.map((adjudication) => Object.freeze({ ...adjudication }))),
    corrections: Object.freeze(input.corrections.map((correction) => Object.freeze({ ...correction }))),
    finalHoldout: Object.freeze({ ...input.finalHoldout }),
  });
}

function validatePartition(value, label, fixtureNames) {
  if (!Array.isArray(value) || value.length === 0 || value.some((name) => typeof name !== "string" || !fixtureNames.has(name)) || new Set(value).size !== value.length) throw new Error(`${label} partition is invalid`);
  return Object.freeze([...value]);
}

function validDate(value, label) {
  if (!(value instanceof Date) && typeof value !== "string") throw new Error(`${label} is invalid`);
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error(`${label} is invalid`);
  return date;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) throw new Error("usage: node scripts/run-acceptance-correction-loop.mjs INPUT.json OUTPUT.json");
  const report = await runAcceptanceCorrectionLoopFile(inputPath, outputPath);
  process.stdout.write(`${JSON.stringify({ schema: report.schema, protocolStatus: report.gate.protocolStatus, holdoutProtected: report.split.holdoutProtected, highImpactReviewedCount: report.summary.highImpactReviewedCount, correctionCount: report.summary.correctionCount })}\n`);
}
