import { readFile, writeFile } from "node:fs/promises";

const INPUT_SCHEMA = "verglos.private.final-regression.v1";
const OUTPUT_SCHEMA = "verglos.private.final-regression-result.v1";
const VERIFICATION_SCHEMA = "verglos.private.public-oss-corpus-verification.v1";
const COMMIT = /^[a-f0-9]{7,64}$/u;
const SHA256 = /^sha256:[a-f0-9]{64}$/u;
const SAFE_PATH = /^(?!\/)(?!.*\.\.)[^\u0000-\u001f]{1,512}$/u;
const STATUS = new Set(["passed", "failed"]);
const COVERAGE = new Set(["complete", "partial", "incomplete"]);
const GATE_STATES = new Set(["open", "passed"]);
const DECISIONS = new Set(["go", "no-go"]);
const PLANS = Object.freeze(["free", "pro", "team", "studio", "enterprise"]);
const USER_ROLES = Object.freeze(["owner", "admin", "approver", "member", "viewer"]);
const TENANT_MODES = Object.freeze(["single", "multi"]);
const ARCHITECTURE_SHAPES = Object.freeze(["small", "multi-user", "multi-tenant-team", "enterprise-like"]);
const GATE_NAMES = Object.freeze([
  "truthRegistry",
  "riskReview",
  "heldOutCorrection",
  "providerLifecycle",
  "finalRelease",
]);
const MAX_FIXTURES = 64;
const MAX_RUNS = 4096;
const MAX_EVIDENCE_PER_RUN = 16;

/**
 * Reconcile a frozen corpus rerun across plan, user, and tenant scenarios.
 * The contract is deliberately fail-closed: it binds every run to the
 * candidate CLI commit, requires complete matrix coverage and digest-only
 * evidence, reports deltas, and cannot recommend GO while a required gate,
 * run failure, coverage gap, performance regression, or finding regression is
 * present.
 */
export function runFinalRegression(input, { now = new Date() } = {}) {
  const run = validateInput(input);
  const generatedAt = validDate(now, "now").toISOString();
  const fixtures = validateCorpus(run.corpus);
  const fixtureMap = new Map(fixtures.map((fixture) => [fixture.name, fixture]));
  const scenarioRuns = run.runs.map((entry, index) => validateScenarioRun(entry, index, run.candidate, fixtureMap));
  const keys = new Set();
  for (const entry of scenarioRuns) {
    const key = `${entry.fixture}:${entry.scenario.plan}:${entry.scenario.userRole}:${entry.scenario.tenantMode}`;
    if (keys.has(key)) throw new Error(`duplicate regression scenario: ${key}`);
    keys.add(key);
  }

  const observedPlans = unique(scenarioRuns.map((entry) => entry.scenario.plan));
  const observedRoles = unique(scenarioRuns.map((entry) => entry.scenario.userRole));
  const observedTenantModes = unique(scenarioRuns.map((entry) => entry.scenario.tenantMode));
  const observedFixtures = unique(scenarioRuns.map((entry) => entry.fixture));
  const missingPlans = PLANS.filter((plan) => !observedPlans.includes(plan));
  const missingRoles = USER_ROLES.filter((role) => !observedRoles.includes(role));
  const missingTenantModes = TENANT_MODES.filter((mode) => !observedTenantModes.includes(mode));
  const missingFixtures = fixtures.map((fixture) => fixture.name).filter((name) => !observedFixtures.includes(name));

  const deltas = scenarioRuns.map((entry) => compareScenario(entry, run.thresholds.maxDurationIncreasePercent));
  const failedRuns = deltas.filter((entry) => entry.candidate.status !== "passed" || entry.candidate.exitCode !== 0 || entry.candidate.coverage !== "complete");
  const performanceRegressions = deltas.filter((entry) => entry.performanceRegression);
  const findingRegressions = deltas.filter((entry) => entry.findingDelta > 0);
  const openGates = GATE_NAMES.filter((name) => run.gates[name] === "open");
  const matrixComplete = missingPlans.length === 0
    && missingRoles.length === 0
    && missingTenantModes.length === 0
    && missingFixtures.length === 0;
  const goEligible = matrixComplete
    && failedRuns.length === 0
    && performanceRegressions.length === 0
    && findingRegressions.length === 0
    && openGates.length === 0;

  if (run.decision === "go" && !goEligible) {
    throw new Error("GO cannot be recommended while regression coverage, deltas, or gates remain open");
  }

  return Object.freeze({
    schema: OUTPUT_SCHEMA,
    generatedAt,
    candidate: Object.freeze({ ...run.candidate }),
    corpus: Object.freeze({
      verificationSchema: VERIFICATION_SCHEMA,
      manifestSha256: run.corpus.manifestSha256,
      fixtureCount: fixtures.length,
      architectureShapes: unique(fixtures.flatMap((fixture) => fixture.architectureShapes)),
    }),
    matrix: Object.freeze({
      requiredPlans: PLANS,
      observedPlans,
      missingPlans,
      requiredUserRoles: USER_ROLES,
      observedUserRoles: observedRoles,
      missingUserRoles: missingRoles,
      requiredTenantModes: TENANT_MODES,
      observedTenantModes,
      missingTenantModes,
      fixtureCount: fixtures.length,
      observedFixtureCount: observedFixtures.length,
      missingFixtures,
      complete: matrixComplete,
    }),
    runs: Object.freeze(deltas),
    summary: Object.freeze({
      runCount: deltas.length,
      failedRunCount: failedRuns.length,
      performanceRegressionCount: performanceRegressions.length,
      findingRegressionCount: findingRegressions.length,
      totalFindingDelta: deltas.reduce((total, entry) => total + entry.findingDelta, 0),
      totalDurationDeltaMs: deltas.reduce((total, entry) => total + entry.durationDeltaMs, 0),
      matrixComplete,
      openGateCount: openGates.length,
    }),
    gates: Object.freeze({ ...run.gates }),
    release: Object.freeze({
      requestedDecision: run.decision,
      recommendation: goEligible ? "go" : "no-go",
      goEligible,
      status: goEligible ? "ready-for-signoff" : "blocked",
      openGates,
      failedRuns: failedRuns.map((entry) => entry.key),
      performanceRegressions: performanceRegressions.map((entry) => entry.key),
      findingRegressions: findingRegressions.map((entry) => entry.key),
    }),
  });
}

export async function runFinalRegressionFile(inputPath, outputPath, options = {}) {
  const input = JSON.parse(await readFile(inputPath, "utf8"));
  const report = runFinalRegression(input, options);
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return report;
}

function validateInput(input) {
  if (!input || typeof input !== "object" || input.schema !== INPUT_SCHEMA) throw new Error("unsupported final regression schema");
  if (!input.candidate || typeof input.candidate !== "object") throw new Error("candidate is required");
  for (const key of ["cliCommit", "webCommit"]) {
    if (typeof input.candidate[key] !== "string" || !COMMIT.test(input.candidate[key])) throw new Error(`candidate ${key} is invalid`);
  }
  if (typeof input.candidate.version !== "string" || input.candidate.version.length === 0 || input.candidate.version.length > 128) throw new Error("candidate version is invalid");
  if (!input.corpus || typeof input.corpus !== "object") throw new Error("corpus is required");
  if (!Array.isArray(input.runs) || input.runs.length === 0 || input.runs.length > MAX_RUNS) throw new Error("regression runs are invalid");
  if (!input.thresholds || typeof input.thresholds !== "object") throw new Error("thresholds are required");
  const maxDurationIncreasePercent = input.thresholds.maxDurationIncreasePercent;
  if (typeof maxDurationIncreasePercent !== "number" || !Number.isFinite(maxDurationIncreasePercent) || maxDurationIncreasePercent < 0 || maxDurationIncreasePercent > 1000) {
    throw new Error("max duration increase threshold is invalid");
  }
  if (!input.gates || typeof input.gates !== "object") throw new Error("regression gates are required");
  for (const name of GATE_NAMES) if (!GATE_STATES.has(input.gates[name])) throw new Error(`regression gate state is invalid: ${name}`);
  if (!DECISIONS.has(input.decision)) throw new Error("regression decision is invalid");
  return input;
}

function validateCorpus(input) {
  if (input.verificationSchema !== VERIFICATION_SCHEMA) throw new Error("unsupported corpus verification schema");
  if (typeof input.manifestSha256 !== "string" || !SHA256.test(input.manifestSha256)) throw new Error("corpus manifest digest is invalid");
  if (!Array.isArray(input.fixtures) || input.fixtures.length === 0 || input.fixtures.length > MAX_FIXTURES) throw new Error("corpus fixtures are invalid");
  if (input.fixtureCount !== input.fixtures.length) throw new Error("corpus fixture count does not match fixtures");
  const names = new Set();
  const fixtures = input.fixtures.map((fixture) => {
    if (!fixture || typeof fixture !== "object" || typeof fixture.name !== "string" || !/^[a-z0-9][a-z0-9-]{0,63}$/u.test(fixture.name)) throw new Error("corpus fixture name is invalid");
    if (names.has(fixture.name)) throw new Error(`duplicate corpus fixture: ${fixture.name}`);
    names.add(fixture.name);
    if (typeof fixture.exactCommit !== "string" || !COMMIT.test(fixture.exactCommit)) throw new Error(`corpus fixture commit is invalid: ${fixture.name}`);
    if (typeof fixture.reportSha256 !== "string" || !SHA256.test(fixture.reportSha256)) throw new Error(`corpus report digest is invalid: ${fixture.name}`);
    if (!Array.isArray(fixture.architectureShapes) || fixture.architectureShapes.length === 0 || fixture.architectureShapes.some((shape) => !ARCHITECTURE_SHAPES.includes(shape))) throw new Error(`corpus architecture shape is invalid: ${fixture.name}`);
    return Object.freeze({
      name: fixture.name,
      exactCommit: fixture.exactCommit,
      reportSha256: fixture.reportSha256,
      architectureShapes: Object.freeze(unique(fixture.architectureShapes)),
    });
  });
  const shapes = unique(fixtures.flatMap((fixture) => fixture.architectureShapes));
  for (const shape of ARCHITECTURE_SHAPES) if (!shapes.includes(shape)) throw new Error(`corpus architecture shape is missing: ${shape}`);
  return Object.freeze(fixtures);
}

function validateScenarioRun(input, index, candidate, fixtureMap) {
  if (!input || typeof input !== "object") throw new Error(`regression run ${index} is invalid`);
  if (typeof input.fixture !== "string" || !fixtureMap.has(input.fixture)) throw new Error(`regression run ${index} fixture is invalid`);
  if (typeof input.sourceCommit !== "string" || input.sourceCommit !== candidate.cliCommit) throw new Error(`regression run ${index} is not bound to candidate CLI commit`);
  const scenario = input.scenario;
  if (!scenario || typeof scenario !== "object" || !PLANS.includes(scenario.plan) || !USER_ROLES.includes(scenario.userRole) || !TENANT_MODES.includes(scenario.tenantMode)) throw new Error(`regression run ${index} scenario is invalid`);
  const baseline = validateMeasurement(input.baseline, `regression run ${index} baseline`);
  const candidateMeasurement = validateMeasurement(input.candidate, `regression run ${index} candidate`);
  const evidence = validateEvidence(input.evidence, index);
  return Object.freeze({
    fixture: input.fixture,
    sourceCommit: input.sourceCommit,
    scenario: Object.freeze({ plan: scenario.plan, userRole: scenario.userRole, tenantMode: scenario.tenantMode }),
    baseline,
    candidate: candidateMeasurement,
    evidence: Object.freeze(evidence),
  });
}

function validateMeasurement(input, label) {
  if (!input || typeof input !== "object" || !STATUS.has(input.status) || !Number.isInteger(input.exitCode) || input.exitCode < 0 || input.exitCode > 255) throw new Error(`${label} status is invalid`);
  if (!COVERAGE.has(input.coverage) || !Number.isInteger(input.filesWalked) || input.filesWalked <= 0 || !Number.isInteger(input.findingCount) || input.findingCount < 0 || !Number.isInteger(input.durationMs) || input.durationMs < 0 || input.durationMs > 86_400_000) throw new Error(`${label} measurements are invalid`);
  if (!Array.isArray(input.limitations) || input.limitations.some((item) => typeof item !== "string" || item.length > 256)) throw new Error(`${label} limitations are invalid`);
  return Object.freeze({
    status: input.status,
    exitCode: input.exitCode,
    coverage: input.coverage,
    filesWalked: input.filesWalked,
    findingCount: input.findingCount,
    durationMs: input.durationMs,
    limitations: Object.freeze([...input.limitations]),
  });
}

function validateEvidence(input, index) {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_EVIDENCE_PER_RUN) throw new Error(`regression run ${index} evidence is invalid`);
  const paths = new Set();
  return input.map((item) => {
    if (!item || typeof item !== "object" || typeof item.path !== "string" || !SAFE_PATH.test(item.path) || item.path.startsWith(".env")) throw new Error(`regression run ${index} evidence path is invalid`);
    if (paths.has(item.path)) throw new Error(`regression run ${index} evidence path is duplicated`);
    if (typeof item.sha256 !== "string" || !SHA256.test(item.sha256)) throw new Error(`regression run ${index} evidence digest is invalid`);
    paths.add(item.path);
    return Object.freeze({ path: item.path, sha256: item.sha256 });
  });
}

function compareScenario(entry, threshold) {
  const key = `${entry.fixture}:${entry.scenario.plan}:${entry.scenario.userRole}:${entry.scenario.tenantMode}`;
  const durationDeltaMs = entry.candidate.durationMs - entry.baseline.durationMs;
  const performanceDeltaPercent = entry.baseline.durationMs === 0
    ? (durationDeltaMs > 0 ? null : 0)
    : Number(((durationDeltaMs / entry.baseline.durationMs) * 100).toFixed(3));
  const performanceRegression = entry.baseline.durationMs === 0
    ? durationDeltaMs > 0
    : performanceDeltaPercent > threshold;
  return Object.freeze({
    key,
    fixture: entry.fixture,
    scenario: entry.scenario,
    sourceCommit: entry.sourceCommit,
    evidence: entry.evidence,
    baseline: Object.freeze({ status: entry.baseline.status, coverage: entry.baseline.coverage, filesWalked: entry.baseline.filesWalked, findingCount: entry.baseline.findingCount, durationMs: entry.baseline.durationMs }),
    candidate: Object.freeze({ status: entry.candidate.status, coverage: entry.candidate.coverage, filesWalked: entry.candidate.filesWalked, findingCount: entry.candidate.findingCount, durationMs: entry.candidate.durationMs, exitCode: entry.candidate.exitCode }),
    findingDelta: entry.candidate.findingCount - entry.baseline.findingCount,
    filesWalkedDelta: entry.candidate.filesWalked - entry.baseline.filesWalked,
    durationDeltaMs,
    performanceDeltaPercent,
    performanceRegression,
  });
}

function unique(values) {
  return [...new Set(values)].sort();
}

function validDate(value, label) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error(`${label} must be a valid date`);
  return date;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) throw new Error("usage: node scripts/run-final-regression.mjs INPUT.json OUTPUT.json");
  const report = await runFinalRegressionFile(inputPath, outputPath);
  process.stdout.write(`${JSON.stringify({ schema: report.schema, recommendation: report.release.recommendation, goEligible: report.release.goEligible, runCount: report.summary.runCount, openGates: report.summary.openGateCount })}\n`);
}
