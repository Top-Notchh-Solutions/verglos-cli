import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { readBoundedJsonFile, readBoundedJsonFileWithDigest } from "./read-bounded-json.mjs";

const INPUT_SCHEMA = "verglos.private.public-oss-corpus-verification.v1";
const OUTPUT_SCHEMA = "verglos.private.public-oss-corpus-triage.v1";
const SEVERITIES = new Set(["critical", "high", "medium", "low", "info", "unknown"]);
const COMMIT = /^[a-f0-9]{7,64}$/u;
const SHA256 = /^[a-f0-9]{64}$/u;
const MAX_FIXTURES = 64;
const MAX_FINDINGS = 100_000;

/**
 * Convert a public-corpus verification manifest into bounded product-feedback
 * triage. This classifies observations without adjudicating whether a finding
 * is a real vulnerability and never copies report snippets, paths, or source.
 */
export async function triagePublicOssCorpus(input) {
  validateInput(input);
  const fixtures = [];
  const ruleMap = new Map();
  let findingCount = 0;
  let coverageGapCount = 0;

  for (const fixture of input.fixtures) {
    if (!fixture.reportJson || typeof fixture.reportJson.path !== "string" || typeof fixture.name !== "string") throw new Error("fixture report reference is invalid");
    if (!Number.isInteger(fixture.reportJson.bytes) || fixture.reportJson.bytes <= 0 || !SHA256.test(fixture.reportJson.sha256)) {
      throw new Error(`fixture report integrity metadata is invalid: ${fixture.name}`);
    }
    const reportResult = await readBoundedJsonFileWithDigest(fixture.reportJson.path, `${fixture.name} report`);
    if (reportResult.bytes !== fixture.reportJson.bytes || reportResult.sha256 !== `sha256:${fixture.reportJson.sha256}`) {
      throw new Error(`fixture report integrity mismatch: ${fixture.name}`);
    }
    const report = reportResult.value;
    const findings = Array.isArray(report.findings) ? report.findings : [];
    if (findings.length > MAX_FINDINGS - findingCount) throw new Error("corpus findings exceed the bounded triage limit");
    const findingSummaries = findings.map((finding) => {
      const summary = summarizeFinding(fixture.name, finding);
      findingCount += 1;
      const aggregate = ruleMap.get(summary.rule) ?? { rule: summary.rule, observedCount: 0, severities: new Set() };
      aggregate.observedCount += 1;
      aggregate.severities.add(summary.severity);
      ruleMap.set(summary.rule, aggregate);
      return summary;
    });
    const coverage = report.coverage ?? {};
    const limitations = Array.isArray(coverage.limitations) ? coverage.limitations : [];
    const complete = coverage.status === "complete" && limitations.length === 0;
    if (!complete) coverageGapCount += 1;
    fixtures.push({
      name: fixture.name,
      exactCommit: fixture.commit,
      findingCount: findingSummaries.length,
      coverage: Object.freeze({
        status: typeof coverage.status === "string" ? coverage.status : "unknown",
        limitationsCount: limitations.length,
        filesWalked: Number.isInteger(coverage.filesWalked) ? coverage.filesWalked : null,
        triage: complete ? "no-coverage-gap-observed" : "coverage-gap-requires-review",
      }),
      findings: Object.freeze(findingSummaries),
    });
  }

  const feedback = [...ruleMap.values()]
    .sort((a, b) => a.rule.localeCompare(b.rule))
    .map((entry) => ({
      rule: entry.rule,
      observedCount: entry.observedCount,
      severities: [...entry.severities].sort(),
      status: "unadjudicated-observation",
      action: "reproduce-and-review-detector-precision-before-product-change",
      customerClaim: false,
    }));

  return Object.freeze({
    schema: OUTPUT_SCHEMA,
    generatedAt: typeof input.verifiedAt === "string" ? input.verifiedAt : new Date().toISOString(),
    source: Object.freeze({
      verificationSchema: INPUT_SCHEMA,
      cliCommit: input.cliCommit,
      fixtureCount: input.fixtureCount,
    }),
    summary: Object.freeze({
      fixtureCount: fixtures.length,
      findingCount,
      ruleCount: feedback.length,
      coverageGapCount,
    }),
    fixtures: Object.freeze(fixtures),
    feedback: Object.freeze(feedback),
    gate: Object.freeze({
      classificationStatus: "complete",
      adjudicationStatus: "open",
      customerAcceptance: "not-claimed",
      independentReview: "required",
    }),
  });
}

export async function triagePublicOssCorpusFile(inputPath, outputPath) {
  const input = await readBoundedJsonFile(inputPath, "public OSS corpus input");
  const report = await triagePublicOssCorpus(input);
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return report;
}

function validateInput(input) {
  if (!input || typeof input !== "object" || input.schema !== INPUT_SCHEMA) throw new Error("unsupported public-corpus verification schema");
  if (typeof input.cliCommit !== "string" || !COMMIT.test(input.cliCommit)) throw new Error("verification CLI commit is invalid");
  if (!Array.isArray(input.fixtures) || input.fixtures.length === 0 || input.fixtures.length > MAX_FIXTURES) throw new Error("verification fixtures are invalid");
  if (!Number.isInteger(input.fixtureCount) || input.fixtureCount !== input.fixtures.length) throw new Error("verification fixture count is invalid");
  if (typeof input.verifiedAt !== "string" || !Number.isFinite(new Date(input.verifiedAt).getTime())) throw new Error("verification timestamp is invalid");
  for (const fixture of input.fixtures) {
    if (!fixture || typeof fixture !== "object" || typeof fixture.name !== "string" || !COMMIT.test(fixture.commit)) {
      throw new Error("verification fixture commit is invalid");
    }
  }
}

function summarizeFinding(fixtureName, finding) {
  if (!finding || typeof finding !== "object") throw new Error(`finding is invalid in ${fixtureName}`);
  if (typeof finding.id !== "string" || finding.id.length === 0 || finding.id.length > 128) throw new Error(`finding id is invalid in ${fixtureName}`);
  if (typeof finding.rule !== "string" || finding.rule.length === 0 || finding.rule.length > 128) throw new Error(`finding rule is invalid in ${fixtureName}`);
  const severity = typeof finding.severity === "string" && SEVERITIES.has(finding.severity) ? finding.severity : "unknown";
  const category = typeof finding.category === "string" && finding.category.length <= 160 ? finding.category : "uncategorized";
  const findingDigest = `sha256:${createHash("sha256").update(JSON.stringify([fixtureName, finding.id, finding.rule, severity, category])).digest("hex")}`;
  return Object.freeze({
    findingDigest,
    rule: finding.rule,
    severity,
    category,
    status: "unadjudicated-observation",
    action: "reproduce-and-review-detector-precision-before-product-change",
    customerClaim: false,
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) throw new Error("usage: node scripts/triage-public-oss-corpus.mjs VERIFICATION.json TRIAGE.json");
  const report = await triagePublicOssCorpusFile(inputPath, outputPath);
  process.stdout.write(`${JSON.stringify({ schema: report.schema, fixtureCount: report.summary.fixtureCount, findingCount: report.summary.findingCount, ruleCount: report.summary.ruleCount, coverageGapCount: report.summary.coverageGapCount, adjudicationStatus: report.gate.adjudicationStatus })}\n`);
}
