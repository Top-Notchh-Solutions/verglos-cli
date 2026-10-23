import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { readBoundedJsonFile } from "./read-bounded-json.mjs";

const INPUT_SCHEMA = "verglos.private.hunt-adjudication-study.v1";
const OUTPUT_SCHEMA = "verglos.private.hunt-adjudication-report.v1";
const SHA256 = /^sha256:[a-f0-9]{64}$/u;
const COMMIT = /^[a-f0-9]{7,64}$/u;
const SAFE_ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,127}$/u;
const LABELS = new Set(["confirmed", "not-reproduced", "environment-failure", "out-of-scope"]);
const CONFIDENCES = new Set(["low", "medium", "high"]);
const RESOLUTION_METHODS = new Set(["third-reviewer", "documented-consensus"]);
const MIN_SAMPLES = 100;
const MAX_SAMPLES = 4096;
const MAX_COMMANDS = 512;
const MAX_REVIEWERS_PER_SAMPLE = 2;
const SECRET_LIKE = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/u,
  /(?:DATABASE_URL|CLERK_SECRET_KEY|RAZORPAY_KEY_SECRET|NPM_TOKEN|NODE_AUTH_TOKEN)\s*=/iu,
  /\b(?:rzp|sk|whsec|ghp|github_pat)_(?:live|test)?_[A-Za-z0-9_-]{8,}\b/u,
];

/**
 * Validate the preregistered Hunt adjudication boundary and emit only
 * digest-bound metadata and aggregate counts. This does not claim that a
 * reviewer is independent or that a final release decision exists.
 */
export function validateHuntAdjudicationStudy(input, { now = new Date() } = {}) {
  rejectSecretLike(input);
  const run = validateInput(input);
  const currentTime = parseDate(now, "now");
  const completedAt = parseDate(run.completedAt, "completedAt");
  if (completedAt > currentTime) throw new Error("completedAt is in the future");
  const manifestFrozenAt = parseDate(run.manifest.frozenAt, "Hunt sample manifest frozenAt");
  const commandsFrozenAt = parseDate(run.commands.frozenAt, "Hunt commands frozenAt");
  if (commandsFrozenAt > manifestFrozenAt) throw new Error("Hunt commands must be frozen before the sample manifest");
  if (manifestFrozenAt > completedAt) throw new Error("Hunt sample manifest is frozen after completion");

  const samples = [...run.manifest.samples].sort((left, right) => left.sampleId.localeCompare(right.sampleId));
  const sampleMap = new Map(samples.map((sample) => [sample.sampleId, sample]));
  const commandMap = new Map(run.commands.entries.map((command) => [command.commandId, command]));
  const reviewMap = new Map(samples.map((sample) => [sample.sampleId, []]));
  for (const review of run.adjudications) reviewMap.get(review.sampleId).push(review);

  const finalSamples = [];
  const confidenceDistribution = { low: 0, medium: 0, high: 0 };
  let disagreementCount = 0;
  let environmentFailureCount = 0;
  let excludedCount = 0;
  let changedOriginalFindingCount = 0;
  let limitationCount = 0;

  for (const sample of samples) {
    const reviews = reviewMap.get(sample.sampleId);
    if (reviews.length !== MAX_REVIEWERS_PER_SAMPLE) throw new Error(`sample ${sample.sampleId} does not have exactly two independent reviews`);
    const labels = new Set(reviews.map((review) => review.label));
    const disagreement = labels.size > 1;
    let finalLabel = reviews[0].label;
    if (disagreement) {
      disagreementCount += 1;
      const resolution = run.resolutions.get(sample.sampleId);
      if (!resolution) throw new Error(`sample ${sample.sampleId} has an unresolved reviewer disagreement`);
      finalLabel = resolution.resolvedLabel;
      const latestReview = Math.max(...reviews.map((review) => parseDate(review.reviewedAt, `review ${sample.sampleId}`).getTime()));
      if (parseDate(resolution.resolvedAt, `resolution ${sample.sampleId}`).getTime() <= latestReview) {
        throw new Error(`resolution ${sample.sampleId} was recorded before labels were frozen`);
      }
      if (resolution.method === "third-reviewer") {
        const primaryReviewers = new Set(reviews.map((review) => review.reviewerDigest));
        if (primaryReviewers.has(resolution.reviewerDigest) || resolution.reviewerDigest === run.implementationAuthorDigest) {
          throw new Error(`third reviewer for ${sample.sampleId} is not independent`);
        }
      }
    } else if (run.resolutions.has(sample.sampleId)) {
      throw new Error(`sample ${sample.sampleId} has a resolution without disagreement`);
    }

    if (finalLabel === "out-of-scope") {
      excludedCount += 1;
      if (disagreement) {
        if (!run.resolutions.get(sample.sampleId).exclusionReasonDigest) throw new Error(`out-of-scope resolution ${sample.sampleId} lacks an exclusion reason`);
      } else if (reviews.some((review) => !review.exclusionReasonDigest)) {
        throw new Error(`out-of-scope sample ${sample.sampleId} lacks an exclusion reason`);
      }
    }
    if (finalLabel === "environment-failure") environmentFailureCount += 1;
    for (const review of reviews) {
      confidenceDistribution[review.confidence] += 1;
      if (review.changedOriginalFinding) changedOriginalFindingCount += 1;
      if (review.limitationDigest) limitationCount += 1;
    }
    finalSamples.push(Object.freeze({
      sampleId: sample.sampleId,
      findingDigest: sample.findingDigest,
      detector: sample.detector,
      sourceFixture: sample.sourceFixture,
      finalLabel,
      reviewCount: reviews.length,
      disagreement,
    }));
  }

  const validSampleCount = samples.length - excludedCount;
  if (validSampleCount < MIN_SAMPLES) throw new Error(`hunt adjudication requires at least ${MIN_SAMPLES} valid samples`);

  return Object.freeze({
    schema: OUTPUT_SCHEMA,
    protocolVersion: run.protocolVersion,
    completedAt: completedAt.toISOString(),
    manifest: Object.freeze({
      sampleManifestSha256: run.manifest.manifestSha256,
      sampleCount: samples.length,
      validSampleCount,
      excludedCount,
      frozenAt: run.manifest.frozenAt,
      commandsDigest: run.commands.commandsDigest,
      commandsFrozenAt: run.commands.frozenAt,
    }),
    summary: Object.freeze({
      denominator: validSampleCount,
      labelCounts: Object.freeze(finalSamples.reduce((counts, sample) => {
        counts[sample.finalLabel] += 1;
        return counts;
      }, { confirmed: 0, "not-reproduced": 0, "environment-failure": 0, "out-of-scope": 0 })),
      disagreementCount,
      confidenceDistribution: Object.freeze(confidenceDistribution),
      environmentFailureCount,
      changedOriginalFindingReviewCount: changedOriginalFindingCount,
      limitationReviewCount: limitationCount,
    }),
    samples: Object.freeze(finalSamples),
    gate: Object.freeze({
      adjudicationStatus: "complete",
      disagreementStatus: disagreementCount === 0 ? "none-observed" : "resolved",
      reproducibilityStatus: "digest-bound",
      independentReview: "required",
      customerAcceptance: "not-claimed",
      finalAcceptance: "required",
    }),
  });
}

export async function validateHuntAdjudicationFile(inputPath, outputPath, options = {}) {
  const input = await readBoundedJsonFile(inputPath, "Hunt adjudication input");
  const report = validateHuntAdjudicationStudy(input, options);
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return report;
}

export function digestHuntManifest(samples) {
  return digestPayload(samples.map(canonicalSample).sort((left, right) => left.sampleId.localeCompare(right.sampleId)));
}

export function digestHuntCommands(commands) {
  return digestPayload(commands.map(canonicalCommand).sort((left, right) => left.commandId.localeCompare(right.commandId)));
}

function validateInput(input) {
  if (!input || typeof input !== "object" || input.schema !== INPUT_SCHEMA) throw new Error("unsupported Hunt adjudication schema");
  if (typeof input.protocolVersion !== "string" || input.protocolVersion.length === 0 || input.protocolVersion.length > 64) throw new Error("Hunt adjudication protocolVersion is invalid");
  if (typeof input.completedAt !== "string") throw new Error("Hunt adjudication completedAt is required");
  if (!SHA256.test(input.implementationAuthorDigest)) throw new Error("implementation author identity must be a digest");
  const manifest = validateManifest(input.manifest);
  const commands = validateCommands(input.commands, manifest);
  if (!Array.isArray(input.adjudications) || input.adjudications.length !== manifest.samples.length * MAX_REVIEWERS_PER_SAMPLE) throw new Error("every Hunt sample requires exactly two adjudications");
  const adjudications = input.adjudications.map((review) => validateReview(review, manifest, commands, input.implementationAuthorDigest, input.completedAt));
  const reviewKeys = new Set();
  const reviewCounts = new Map(manifest.samples.map((sample) => [sample.sampleId, 0]));
  for (const review of adjudications) {
    const key = `${review.sampleId}:${review.reviewerDigest}`;
    if (reviewKeys.has(key)) throw new Error(`duplicate reviewer for sample ${review.sampleId}`);
    reviewKeys.add(key);
    reviewCounts.set(review.sampleId, (reviewCounts.get(review.sampleId) ?? 0) + 1);
  }
  if ([...reviewCounts.values()].some((count) => count !== MAX_REVIEWERS_PER_SAMPLE)) throw new Error("Hunt samples do not have two distinct reviewers");
  const resolutions = validateResolutions(input.resolutions, manifest, adjudications, input.implementationAuthorDigest, input.completedAt);
  return Object.freeze({
    protocolVersion: input.protocolVersion,
    completedAt: input.completedAt,
    implementationAuthorDigest: input.implementationAuthorDigest,
    manifest,
    commands,
    adjudications: Object.freeze(adjudications),
    resolutions,
  });
}

function validateManifest(input) {
  if (!input || typeof input !== "object" || typeof input.frozenAt !== "string" || !Array.isArray(input.samples) || input.samples.length < MIN_SAMPLES || input.samples.length > MAX_SAMPLES || !SHA256.test(input.manifestSha256)) {
    throw new Error(`Hunt sample manifest must contain at least ${MIN_SAMPLES} bounded samples`);
  }
  const samples = input.samples.map(validateSample);
  const ids = new Set(samples.map((sample) => sample.sampleId));
  if (ids.size !== samples.length) throw new Error("Hunt sample manifest contains duplicate sample IDs");
  if (digestHuntManifest(samples) !== input.manifestSha256) throw new Error("Hunt sample manifest digest does not match samples");
  return Object.freeze({ frozenAt: input.frozenAt, manifestSha256: input.manifestSha256, samples: Object.freeze(samples) });
}

function validateSample(input) {
  if (!input || typeof input !== "object") throw new Error("Hunt sample is invalid");
  for (const key of ["sampleId", "detector", "sourceFixture", "commandId"]) {
    if (typeof input[key] !== "string" || !SAFE_ID.test(input[key])) throw new Error(`Hunt sample ${key} is invalid`);
  }
  for (const key of ["findingDigest", "recipeDigest", "environmentDigest"]) {
    if (!SHA256.test(input[key])) throw new Error(`Hunt sample ${key} must be a digest`);
  }
  if (!COMMIT.test(input.cliCommit)) throw new Error("Hunt sample CLI commit is invalid");
  return Object.freeze({
    sampleId: input.sampleId,
    findingDigest: input.findingDigest,
    detector: input.detector,
    sourceFixture: input.sourceFixture,
    cliCommit: input.cliCommit,
    recipeDigest: input.recipeDigest,
    environmentDigest: input.environmentDigest,
    commandId: input.commandId,
  });
}

function validateCommands(input, manifest) {
  if (!input || typeof input !== "object" || typeof input.frozenAt !== "string" || !Array.isArray(input.entries) || input.entries.length === 0 || input.entries.length > MAX_COMMANDS || !SHA256.test(input.commandsDigest)) {
    throw new Error("Hunt reproducibility commands are invalid");
  }
  const entries = input.entries.map((command) => {
    if (!command || typeof command !== "object" || typeof command.commandId !== "string" || !SAFE_ID.test(command.commandId) || !SHA256.test(command.commandDigest) || !SHA256.test(command.environmentDigest) || typeof command.toolVersion !== "string" || command.toolVersion.length === 0 || command.toolVersion.length > 128 || !COMMIT.test(command.cliCommit)) {
      throw new Error("Hunt reproducibility command is invalid");
    }
    return Object.freeze({ commandId: command.commandId, commandDigest: command.commandDigest, environmentDigest: command.environmentDigest, toolVersion: command.toolVersion, cliCommit: command.cliCommit });
  });
  if (new Set(entries.map((command) => command.commandId)).size !== entries.length) throw new Error("Hunt reproducibility commands contain duplicates");
  if (digestHuntCommands(entries) !== input.commandsDigest) throw new Error("Hunt commands digest does not match entries");
  const commandMap = new Map(entries.map((command) => [command.commandId, command]));
  for (const sample of manifest.samples) {
    const command = commandMap.get(sample.commandId);
    if (!command || command.cliCommit !== sample.cliCommit || command.environmentDigest !== sample.environmentDigest) throw new Error(`Hunt sample ${sample.sampleId} is not bound to a reproducibility command`);
  }
  return Object.freeze({ frozenAt: input.frozenAt, commandsDigest: input.commandsDigest, entries: Object.freeze(entries) });
}

function validateReview(input, manifest, commands, implementationAuthorDigest, completedAt) {
  if (!input || typeof input !== "object" || typeof input.sampleId !== "string" || !SHA256.test(input.reviewerDigest) || input.reviewerDigest === implementationAuthorDigest || !LABELS.has(input.label) || !CONFIDENCES.has(input.confidence) || !SHA256.test(input.resultDigest) || typeof input.reviewedAt !== "string" || typeof input.changedOriginalFinding !== "boolean") {
    throw new Error("Hunt adjudication review is invalid");
  }
  const sample = manifest.samples.find((entry) => entry.sampleId === input.sampleId);
  if (!sample) throw new Error(`Hunt review references unknown sample: ${input.sampleId}`);
  const command = commands.entries.find((entry) => entry.commandId === sample.commandId);
  if (input.commandDigest !== command.commandDigest) throw new Error(`Hunt review command binding is invalid: ${input.sampleId}`);
  const reviewedAt = parseDate(input.reviewedAt, `Hunt review ${input.sampleId}`);
  const frozenAt = parseDate(manifest.frozenAt, "Hunt sample manifest frozenAt");
  const completed = parseDate(completedAt, "completedAt");
  if (reviewedAt < frozenAt || reviewedAt > completed) throw new Error(`Hunt review ${input.sampleId} is outside the frozen study window`);
  if (input.label === "environment-failure" && !SHA256.test(input.limitationDigest)) throw new Error(`environment-failure review ${input.sampleId} needs a limitation digest`);
  if (input.label === "out-of-scope" && !SHA256.test(input.exclusionReasonDigest)) throw new Error(`out-of-scope review ${input.sampleId} needs an exclusion reason digest`);
  if (input.limitationDigest !== undefined && !SHA256.test(input.limitationDigest)) throw new Error(`Hunt review limitation digest is invalid: ${input.sampleId}`);
  return Object.freeze({
    sampleId: input.sampleId,
    reviewerDigest: input.reviewerDigest,
    label: input.label,
    confidence: input.confidence,
    commandDigest: input.commandDigest,
    resultDigest: input.resultDigest,
    reviewedAt: input.reviewedAt,
    changedOriginalFinding: input.changedOriginalFinding,
    limitationDigest: input.limitationDigest,
    exclusionReasonDigest: input.exclusionReasonDigest,
  });
}

function validateResolutions(input, manifest, adjudications, implementationAuthorDigest, completedAt) {
  if (!Array.isArray(input) || input.length > manifest.samples.length) throw new Error("Hunt resolutions are invalid");
  const reviewsBySample = new Map(manifest.samples.map((sample) => [sample.sampleId, []]));
  for (const review of adjudications) reviewsBySample.get(review.sampleId).push(review);
  const resolutions = new Map();
  for (const resolution of input) {
    if (!resolution || typeof resolution !== "object" || typeof resolution.sampleId !== "string" || !LABELS.has(resolution.resolvedLabel) || !RESOLUTION_METHODS.has(resolution.method) || !SHA256.test(resolution.resolutionDigest) || typeof resolution.resolvedAt !== "string") throw new Error("Hunt resolution is invalid");
    const reviews = reviewsBySample.get(resolution.sampleId);
    if (!reviews || resolutions.has(resolution.sampleId)) throw new Error(`duplicate or unknown Hunt resolution: ${resolution.sampleId}`);
    if (new Set(reviews.map((review) => review.label)).size < 2) throw new Error(`Hunt resolution without disagreement: ${resolution.sampleId}`);
    const resolvedAt = parseDate(resolution.resolvedAt, `Hunt resolution ${resolution.sampleId}`);
    const completed = parseDate(completedAt, "completedAt");
    if (resolvedAt > completed) throw new Error(`Hunt resolution ${resolution.sampleId} is in the future`);
    if (resolvedAt <= Math.max(...reviews.map((review) => parseDate(review.reviewedAt, `Hunt review ${resolution.sampleId}`).getTime()))) throw new Error(`Hunt resolution ${resolution.sampleId} must follow both labels`);
    if (resolution.limitationDigest !== undefined && !SHA256.test(resolution.limitationDigest)) throw new Error(`Hunt resolution limitation digest is invalid: ${resolution.sampleId}`);
    if (resolution.method === "third-reviewer" && (!SHA256.test(resolution.reviewerDigest) || resolution.reviewerDigest === implementationAuthorDigest || reviews.some((review) => review.reviewerDigest === resolution.reviewerDigest))) {
      throw new Error(`Hunt third reviewer ${resolution.sampleId} is not independent`);
    }
    if (resolution.resolvedLabel === "out-of-scope" && !SHA256.test(resolution.exclusionReasonDigest)) throw new Error(`Hunt out-of-scope resolution ${resolution.sampleId} needs an exclusion reason`);
    if (resolution.resolvedLabel === "environment-failure" && !SHA256.test(resolution.limitationDigest)) throw new Error(`Hunt environment-failure resolution ${resolution.sampleId} needs a limitation digest`);
    resolutions.set(resolution.sampleId, Object.freeze({
      sampleId: resolution.sampleId,
      method: resolution.method,
      resolvedLabel: resolution.resolvedLabel,
      resolutionDigest: resolution.resolutionDigest,
      resolvedAt: resolution.resolvedAt,
      reviewerDigest: resolution.reviewerDigest,
      exclusionReasonDigest: resolution.exclusionReasonDigest,
      limitationDigest: resolution.limitationDigest,
    }));
  }
  for (const [sampleId, reviews] of reviewsBySample) {
    const disagreement = new Set(reviews.map((review) => review.label)).size > 1;
    if (disagreement !== resolutions.has(sampleId)) throw new Error(`Hunt disagreement resolution coverage is incomplete: ${sampleId}`);
  }
  return resolutions;
}

function canonicalSample(sample) {
  return {
    sampleId: sample.sampleId,
    findingDigest: sample.findingDigest,
    detector: sample.detector,
    sourceFixture: sample.sourceFixture,
    cliCommit: sample.cliCommit,
    recipeDigest: sample.recipeDigest,
    environmentDigest: sample.environmentDigest,
    commandId: sample.commandId,
  };
}

function canonicalCommand(command) {
  return {
    commandId: command.commandId,
    commandDigest: command.commandDigest,
    environmentDigest: command.environmentDigest,
    toolVersion: command.toolVersion,
    cliCommit: command.cliCommit,
  };
}

function digestPayload(value) {
  return `sha256:${createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex")}`;
}

function parseDate(value, label) {
  if (!(value instanceof Date) && typeof value !== "string") throw new Error(`${label} is invalid`);
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error(`${label} is invalid`);
  return date;
}

function rejectSecretLike(input) {
  if (SECRET_LIKE.some((pattern) => pattern.test(JSON.stringify(input)))) throw new Error("Hunt adjudication input contains secret-like material");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) throw new Error("usage: node scripts/validate-hunt-adjudication.mjs INPUT.json OUTPUT.json");
  const report = await validateHuntAdjudicationFile(inputPath, outputPath);
  process.stdout.write(`${JSON.stringify({ schema: report.schema, denominator: report.summary.denominator, disagreementCount: report.summary.disagreementCount, adjudicationStatus: report.gate.adjudicationStatus, independentReview: report.gate.independentReview })}\n`);
}
