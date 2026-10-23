import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  digestHuntCommands,
  digestHuntManifest,
  validateHuntAdjudicationFile,
  validateHuntAdjudicationStudy,
} from "./validate-hunt-adjudication.mjs";

const NOW = new Date("2026-10-23T13:00:00.000Z");
const FROZEN_AT = "2026-10-23T12:00:00.000Z";
const REVIEWED_AT = "2026-10-23T12:01:00.000Z";
const CLI_COMMIT = "a".repeat(40);

function digest(value) {
  let hash = 0;
  for (const character of value) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return `sha256:${hash.toString(16).padStart(64, "0")}`;
}

function study({ sampleCount = 100, disagreement = false } = {}) {
  const environmentDigest = digest("environment");
  const commands = [{
    commandId: "cmd-a",
    commandDigest: digest("command-a"),
    environmentDigest,
    toolVersion: "verglos-hunt-test/1",
    cliCommit: CLI_COMMIT,
  }];
  const samples = Array.from({ length: sampleCount }, (_, index) => ({
    sampleId: `sample-${String(index).padStart(3, "0")}`,
    findingDigest: digest(`finding-${index}`),
    detector: `detector-${index % 2}`,
    sourceFixture: `fixture-${index % 4}`,
    cliCommit: CLI_COMMIT,
    recipeDigest: digest(`recipe-${index}`),
    environmentDigest,
    commandId: "cmd-a",
  }));
  const implementationAuthorDigest = digest("implementation-author");
  const reviewerA = digest("reviewer-a");
  const reviewerB = digest("reviewer-b");
  const adjudications = samples.flatMap((sample, index) => [
    {
      sampleId: sample.sampleId,
      reviewerDigest: reviewerA,
      label: disagreement && index === 0 ? "confirmed" : index % 2 === 0 ? "confirmed" : "not-reproduced",
      confidence: "high",
      commandDigest: commands[0].commandDigest,
      resultDigest: digest(`result-a-${index}`),
      reviewedAt: REVIEWED_AT,
      changedOriginalFinding: index % 5 === 0,
    },
    {
      sampleId: sample.sampleId,
      reviewerDigest: reviewerB,
      label: disagreement && index === 0 ? "not-reproduced" : index % 2 === 0 ? "confirmed" : "not-reproduced",
      confidence: index % 3 === 0 ? "medium" : "high",
      commandDigest: commands[0].commandDigest,
      resultDigest: digest(`result-b-${index}`),
      reviewedAt: REVIEWED_AT,
      changedOriginalFinding: false,
    },
  ]);
  const result = {
    schema: "verglos.private.hunt-adjudication-study.v1",
    protocolVersion: "2026-10-23",
    completedAt: NOW.toISOString(),
    implementationAuthorDigest,
    manifest: {
      frozenAt: FROZEN_AT,
      samples,
      manifestSha256: digestHuntManifest(samples),
    },
    commands: {
      frozenAt: "2026-10-23T11:59:00.000Z",
      entries: commands,
      commandsDigest: digestHuntCommands(commands),
    },
    adjudications,
    resolutions: disagreement ? [{
      sampleId: samples[0].sampleId,
      method: "third-reviewer",
      resolvedLabel: "confirmed",
      reviewerDigest: digest("reviewer-third"),
      resolutionDigest: digest("resolution-0"),
      resolvedAt: "2026-10-23T12:02:00.000Z",
    }] : [],
  };
  return result;
}

test("Hunt adjudication emits a digest-only aggregate for 100 independently reviewed samples", () => {
  const report = validateHuntAdjudicationStudy(study(), { now: NOW });
  assert.equal(report.summary.denominator, 100);
  assert.equal(report.summary.disagreementCount, 0);
  assert.equal(report.summary.labelCounts.confirmed, 50);
  assert.equal(report.summary.labelCounts["not-reproduced"], 50);
  assert.equal(report.gate.adjudicationStatus, "complete");
  assert.equal(report.gate.independentReview, "required");
  assert.equal("resultDigest" in report.samples[0], false);
  assert.equal("reviewerDigest" in report.samples[0], false);
});

test("Hunt adjudication resolves disagreements only after both primary labels", () => {
  const input = study({ disagreement: true });
  const report = validateHuntAdjudicationStudy(input, { now: NOW });
  assert.equal(report.summary.disagreementCount, 1);
  assert.equal(report.gate.disagreementStatus, "resolved");
  assert.equal(report.samples[0].finalLabel, "confirmed");

  input.resolutions = [];
  assert.throws(() => validateHuntAdjudicationStudy(input, { now: NOW }), /disagreement resolution coverage is incomplete/u);
});

test("Hunt adjudication binds the frozen manifest and reproducibility commands", () => {
  const manifestMismatch = study();
  manifestMismatch.manifest.manifestSha256 = digest("tampered-manifest");
  assert.throws(() => validateHuntAdjudicationStudy(manifestMismatch, { now: NOW }), /manifest digest does not match/u);

  const commandMismatch = study();
  commandMismatch.adjudications[0].commandDigest = digest("wrong-command");
  assert.throws(() => validateHuntAdjudicationStudy(commandMismatch, { now: NOW }), /command binding is invalid/u);
});

test("Hunt adjudication rejects a sole implementation-author reviewer and pre-freeze labels", () => {
  const authorReview = study();
  authorReview.adjudications[0].reviewerDigest = authorReview.implementationAuthorDigest;
  assert.throws(() => validateHuntAdjudicationStudy(authorReview, { now: NOW }), /review is invalid/u);

  const preFreeze = study();
  preFreeze.adjudications[0].reviewedAt = "2026-10-23T11:59:59.000Z";
  assert.throws(() => validateHuntAdjudicationStudy(preFreeze, { now: NOW }), /outside the frozen study window/u);
});

test("Hunt adjudication requires 100 valid samples and records environment limitations", () => {
  const tooSmall = study({ sampleCount: 99 });
  assert.throws(() => validateHuntAdjudicationStudy(tooSmall, { now: NOW }), /at least 100 bounded samples/u);

  const environmentFailure = study();
  environmentFailure.adjudications[0].label = "environment-failure";
  assert.throws(() => validateHuntAdjudicationStudy(environmentFailure, { now: NOW }), /needs a limitation digest/u);
  environmentFailure.adjudications[0].limitationDigest = digest("docker unavailable");
  environmentFailure.adjudications[1].label = "environment-failure";
  environmentFailure.adjudications[1].limitationDigest = digest("docker unavailable");
  const report = validateHuntAdjudicationStudy(environmentFailure, { now: NOW });
  assert.equal(report.summary.environmentFailureCount, 1);
  assert.equal(report.summary.limitationReviewCount, 2);
});

test("Hunt adjudication rejects secret-like material and file output refuses overwrite", async () => {
  const secret = study();
  secret.adjudications[0].resultDigest = "DATABASE_URL=secret";
  assert.throws(() => validateHuntAdjudicationStudy(secret, { now: NOW }), /secret-like material/u);

  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adjudication-"));
  try {
    const inputPath = join(root, "study.json");
    const outputPath = join(root, "report.json");
    await writeFile(inputPath, `${JSON.stringify(study())}\n`, "utf8");
    const report = await validateHuntAdjudicationFile(inputPath, outputPath, { now: NOW });
    assert.equal(report.schema, "verglos.private.hunt-adjudication-report.v1");
    assert.equal(JSON.parse(await readFile(outputPath, "utf8")).summary.denominator, 100);
    await assert.rejects(validateHuntAdjudicationFile(inputPath, outputPath, { now: NOW }), /EEXIST/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
