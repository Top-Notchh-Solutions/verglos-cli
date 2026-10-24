import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { readBoundedFileWithDigest, readBoundedJsonFile } from "./read-bounded-json.mjs";

const CONFIG_SCHEMA = "verglos.private.release-gate-input-config.v1";
const OUTPUT_SCHEMA = "verglos.private.release-gate-reconciliation.v1";
const SHA256 = /^sha256:[a-f0-9]{64}$/u;
const COMMIT = /^[a-f0-9]{7,64}$/u;
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
const ROW_ID = /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/u;
const STATES = new Set(["shipped", "partial", "planned"]);
const GATE_STATES = new Set(["open", "passed"]);
const DECISION_RESULTS = new Set(["go", "no-go"]);
const DECISION_STATUS = new Set(["open", "recorded"]);
const SAFE_PATH = /^(?!\/)(?!.*\.\.)[^\u0000-\u001f]{1,512}$/u;

/**
 * Bind a release-gate reconciliation input to the bytes that exist now.
 * The config contains only safe relative evidence paths; this builder adds
 * the digests consumed by reconcile-release-gates.mjs.
 */
export async function buildReleaseReconciliationInput(config, { evidenceRoot = process.cwd() } = {}) {
  validateConfig(config);
  const root = resolve(evidenceRoot);
  const rows = [];
  const rowIds = new Set();
  for (const row of config.rows) {
    if (rowIds.has(row.id)) throw new Error(`duplicate release row: ${row.id}`);
    rowIds.add(row.id);
    const evidencePaths = new Set();
    const evidence = [];
    for (const path of row.evidence) {
      if (!SAFE_PATH.test(path) || evidencePaths.has(path)) throw new Error(`unsafe or duplicate release evidence path: ${row.id}`);
      evidencePaths.add(path);
      const absolute = resolve(root, path);
      if (absolute !== root && !absolute.startsWith(`${root}/`)) throw new Error(`release evidence path escapes root: ${path}`);
      const result = await readBoundedFileWithDigest(absolute, `release evidence ${path}`);
      if (!SHA256.test(result.sha256)) throw new Error(`release evidence digest is invalid: ${path}`);
      evidence.push({ path, sha256: result.sha256 });
    }
    rows.push({ id: row.id, state: row.state, evidence });
  }
  return {
    schema: OUTPUT_SCHEMA,
    completedAt: new Date(config.completedAt).toISOString(),
    candidate: { ...config.candidate },
    rows,
    gates: { ...config.gates },
    corrections: config.corrections.map((item) => ({ ...item })),
    rollback: config.rollback.map((item) => ({ ...item })),
    decision: { ...config.decision },
  };
}

export async function buildReleaseReconciliationInputFile(configPath, outputPath, options = {}) {
  const config = await readBoundedJsonFile(configPath, "release-gate input config");
  const output = await buildReleaseReconciliationInput(config, options);
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return output;
}

function validateConfig(input) {
  if (!input || typeof input !== "object" || input.schema !== CONFIG_SCHEMA) throw new Error("unsupported release-gate input config schema");
  if (typeof input.completedAt !== "string" || !Number.isFinite(new Date(input.completedAt).getTime())) throw new Error("completedAt is invalid");
  if (!input.candidate || typeof input.candidate !== "object") throw new Error("candidate is required");
  if (typeof input.candidate.cliCommit !== "string" || !COMMIT.test(input.candidate.cliCommit)) throw new Error("candidate cliCommit is invalid");
  if (typeof input.candidate.webCommit !== "string" || !COMMIT.test(input.candidate.webCommit)) throw new Error("candidate webCommit is invalid");
  if (typeof input.candidate.version !== "string" || !VERSION.test(input.candidate.version)) throw new Error("candidate version is invalid");
  if (!Array.isArray(input.rows) || input.rows.length === 0 || input.rows.length > 512) throw new Error("rows are invalid");
  for (const row of input.rows) {
    if (!row || typeof row !== "object" || typeof row.id !== "string" || !ROW_ID.test(row.id)) throw new Error("release row id is invalid");
    if (!STATES.has(row.state)) throw new Error(`release row state is invalid: ${row.id}`);
    if (!Array.isArray(row.evidence) || row.evidence.length > 256 || row.evidence.some((path) => typeof path !== "string" || !SAFE_PATH.test(path))) throw new Error(`release evidence paths are invalid: ${row.id}`);
  }
  if (!input.gates || typeof input.gates !== "object") throw new Error("gates are required");
  for (const name of ["providerLifecycle", "customerConsent", "independentReview", "authenticatedBrowser", "fieldCwv", "accountDeletion", "finalRelease"]) {
    if (!GATE_STATES.has(input.gates[name])) throw new Error(`gate state is invalid: ${name}`);
  }
  validateWork(input.corrections, "corrections");
  validateWork(input.rollback, "rollback");
  if (!input.decision || typeof input.decision !== "object" || !DECISION_RESULTS.has(input.decision.result) || !DECISION_STATUS.has(input.decision.status)) throw new Error("decision is invalid");
}

function validateWork(input, label) {
  if (!Array.isArray(input) || input.length > 256) throw new Error(`${label} work is invalid`);
  for (const item of input) {
    if (!item || typeof item !== "object" || typeof item.id !== "string" || !ROW_ID.test(item.id) || typeof item.action !== "string" || item.action.trim().length === 0 || item.action.length > 512) throw new Error(`${label} item is invalid`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const configPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!configPath || !outputPath) throw new Error("usage: node scripts/build-release-reconciliation-input.mjs CONFIG.json OUTPUT.json");
  const output = await buildReleaseReconciliationInputFile(configPath, outputPath, { evidenceRoot: process.env.VERGLOS_EVIDENCE_ROOT ?? process.cwd() });
  process.stdout.write(`${JSON.stringify({ schema: output.schema, rowCount: output.rows.length, candidate: output.candidate })}\n`);
}
