import { writeFile } from "node:fs/promises";
import { readBoundedJsonFile } from "./read-bounded-json.mjs";

const SCHEMA = "verglos.private.release-gate-reconciliation.v1";
const SHA256 = /^sha256:[a-f0-9]{64}$/u;
const COMMIT = /^[a-f0-9]{7,64}$/u;
const ROW_ID = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/u;
const STATES = new Set(["shipped", "partial", "planned"]);
const GATE_STATES = new Set(["open", "passed"]);
const DECISION_RESULTS = new Set(["go", "no-go"]);
const DECISION_STATUS = new Set(["open", "recorded"]);
const GATE_NAMES = Object.freeze([
  "providerLifecycle",
  "customerConsent",
  "independentReview",
  "authenticatedBrowser",
  "fieldCwv",
  "accountDeletion",
  "finalRelease",
]);

/**
 * Reconcile release claims from explicit bounded inputs. This tool never
 * upgrades a partial row or an open gate: a recorded GO is rejected unless
 * every row is shipped, every required gate is passed, and correction/rollback
 * work is empty.
 */
export function reconcileReleaseGates(input, { now = new Date() } = {}) {
  const run = validateRun(input);
  const completedAt = parseDate(run.completedAt, "completedAt");
  const currentTime = now instanceof Date ? now : new Date(now);
  if (!Number.isFinite(currentTime.getTime())) throw new Error("now must be a valid date");
  if (completedAt > currentTime) throw new Error("completedAt cannot be in the future");
  const rows = run.rows.map(validateRow);
  const ids = new Set();
  for (const row of rows) {
    if (ids.has(row.id)) throw new Error(`duplicate release row: ${row.id}`);
    ids.add(row.id);
  }
  const gates = validateGates(run.gates);
  const corrections = validateWork(run.corrections, "corrections");
  const rollback = validateWork(run.rollback, "rollback");
  const openGates = GATE_NAMES.filter((name) => gates[name] === "open");
  const partialRows = rows.filter((row) => row.state === "partial").map((row) => row.id);
  const plannedRows = rows.filter((row) => row.state === "planned").map((row) => row.id);
  const shippedRows = rows.filter((row) => row.state === "shipped").map((row) => row.id);
  const correctionIds = corrections.map((item) => item.id);
  const rollbackIds = rollback.map((item) => item.id);
  const goEligible = openGates.length === 0
    && partialRows.length === 0
    && plannedRows.length === 0
    && corrections.length === 0
    && rollback.length === 0;

  if (run.decision.status === "recorded" && run.decision.result === "go" && !goEligible) {
    throw new Error("recorded GO is not eligible while rows, gates, corrections, or rollback work remain open");
  }

  return Object.freeze({
    schema: SCHEMA,
    completedAt: completedAt.toISOString(),
    candidate: Object.freeze({ ...run.candidate }),
    summary: Object.freeze({
      rowCount: rows.length,
      shippedCount: shippedRows.length,
      partialCount: partialRows.length,
      plannedCount: plannedRows.length,
      openGateCount: openGates.length,
      correctionCount: corrections.length,
      rollbackCount: rollback.length,
    }),
    shippedRows: Object.freeze(shippedRows),
    partialRows: Object.freeze(partialRows),
    plannedRows: Object.freeze(plannedRows),
    openGates: Object.freeze(openGates),
    correctionIds: Object.freeze(correctionIds),
    rollbackIds: Object.freeze(rollbackIds),
    decision: Object.freeze({
      requested: run.decision.result,
      status: run.decision.status,
      goEligible,
      recommendation: goEligible ? "go" : "no-go",
    }),
    gate: Object.freeze({
      reconciliationStatus: "complete",
      finalReleaseStatus: gates.finalRelease,
      acceptanceStatus: goEligible ? "ready-for-signoff" : "open",
    }),
  });
}

export async function reconcileReleaseGatesFile(inputPath, outputPath, options = {}) {
  const input = await readBoundedJsonFile(inputPath, "release-gate reconciliation input");
  const report = reconcileReleaseGates(input, options);
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return report;
}

function validateRun(input) {
  if (!input || typeof input !== "object") throw new Error("release reconciliation input must be an object");
  if (input.schema !== SCHEMA) throw new Error("unsupported release reconciliation schema");
  if (typeof input.completedAt !== "string") throw new Error("completedAt is required");
  if (!input.candidate || typeof input.candidate !== "object") throw new Error("candidate is required");
  for (const key of ["cliCommit", "webCommit", "version"]) {
    if (typeof input.candidate[key] !== "string" || input.candidate[key].trim().length === 0 || input.candidate[key].length > 128) {
      throw new Error(`candidate ${key} is invalid`);
    }
  }
  if (!COMMIT.test(input.candidate.cliCommit) || !COMMIT.test(input.candidate.webCommit)) throw new Error("candidate commits are invalid");
  if (!Array.isArray(input.rows) || input.rows.length === 0 || input.rows.length > 512) throw new Error("rows are invalid");
  if (!input.gates || typeof input.gates !== "object") throw new Error("gates are required");
  if (!input.decision || typeof input.decision !== "object") throw new Error("decision is required");
  if (!DECISION_RESULTS.has(input.decision.result) || !DECISION_STATUS.has(input.decision.status)) throw new Error("decision is invalid");
  return input;
}

function validateRow(input) {
  if (!input || typeof input !== "object" || typeof input.id !== "string" || !ROW_ID.test(input.id)) throw new Error("release row id is invalid");
  if (!STATES.has(input.state)) throw new Error(`release row state is invalid: ${input.id}`);
  if (!Array.isArray(input.evidence) || input.evidence.length > 256) throw new Error(`release row evidence is invalid: ${input.id}`);
  const evidencePaths = new Set();
  const evidence = input.evidence.map((item) => {
    if (!item || typeof item !== "object" || typeof item.path !== "string" || item.path.length === 0 || item.path.length > 512) throw new Error(`release evidence path is invalid: ${input.id}`);
    if (item.path.startsWith("/") || item.path.includes("..") || evidencePaths.has(item.path)) throw new Error(`release evidence path is unsafe or duplicated: ${input.id}`);
    if (!SHA256.test(item.sha256)) throw new Error(`release evidence digest is invalid: ${input.id}`);
    evidencePaths.add(item.path);
    return Object.freeze({ path: item.path, sha256: item.sha256 });
  });
  if (input.state === "shipped" && evidence.length === 0) throw new Error(`shipped row has no evidence: ${input.id}`);
  return Object.freeze({ id: input.id, state: input.state, evidence: Object.freeze(evidence) });
}

function validateGates(input) {
  const output = {};
  for (const name of GATE_NAMES) {
    if (!GATE_STATES.has(input[name])) throw new Error(`gate state is invalid: ${name}`);
    output[name] = input[name];
  }
  return Object.freeze(output);
}

function validateWork(input, label) {
  if (!Array.isArray(input) || input.length > 256) throw new Error(`${label} work is invalid`);
  return Object.freeze(input.map((item) => {
    if (!item || typeof item !== "object" || typeof item.id !== "string" || !ROW_ID.test(item.id)) throw new Error(`${label} item id is invalid`);
    if (typeof item.action !== "string" || item.action.trim().length === 0 || item.action.length > 512) throw new Error(`${label} item action is invalid`);
    return Object.freeze({ id: item.id, action: item.action });
  }));
}

function parseDate(value, label) {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error(`${label} is invalid`);
  return date;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) throw new Error("usage: node scripts/reconcile-release-gates.mjs INPUT.json OUTPUT.json");
  const report = await reconcileReleaseGatesFile(inputPath, outputPath);
  process.stdout.write(`${JSON.stringify({ schema: report.schema, recommendation: report.decision.recommendation, openGates: report.summary.openGateCount, partialRows: report.summary.partialCount, plannedRows: report.summary.plannedCount })}\n`);
}
