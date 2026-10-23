import { writeFile } from "node:fs/promises";
import { readBoundedJsonFile } from "./read-bounded-json.mjs";

const SCHEMA = "verglos.private.release-candidate-freeze.v1";
const SHA256 = /^sha256:[a-f0-9]{64}$/u;
const COMMIT = /^[a-f0-9]{7,64}$/u;
const GATE_STATES = new Set(["open", "passed"]);
const DECISIONS = new Set(["open", "go", "no-go"]);
const REQUIRED_ARTIFACT_KINDS = Object.freeze([
  "version",
  "schema",
  "migration",
  "manifest",
  "plan-catalog",
  "compatibility",
  "docs",
  "runbook",
  "notice",
  "sbom",
  "provenance",
  "rollback",
]);
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
 * Freeze an exact release-candidate manifest without pretending that a
 * release is ready. Every listed artifact is digest-bound and every critical
 * gate is explicit. An owner can record a no-go while blocked, but a GO is
 * rejected until all required artifacts and gates are present.
 */
export function freezeReleaseCandidate(input) {
  const run = validateRun(input);
  const artifacts = run.artifacts.map(validateArtifact);
  const paths = new Set();
  for (const artifact of artifacts) {
    if (paths.has(artifact.path)) throw new Error(`duplicate freeze artifact: ${artifact.path}`);
    paths.add(artifact.path);
  }
  const gates = validateGates(run.gates);
  const openGates = GATE_NAMES.filter((name) => gates[name] === "open");
  const missingArtifacts = artifacts.filter((artifact) => artifact.required && artifact.present === false).map((artifact) => artifact.path);
  const presentRequiredKinds = new Set(artifacts.filter((artifact) => artifact.required && artifact.present).map((artifact) => artifact.kind));
  const missingArtifactKinds = REQUIRED_ARTIFACT_KINDS.filter((kind) => !presentRequiredKinds.has(kind));
  const ready = openGates.length === 0 && missingArtifacts.length === 0 && missingArtifactKinds.length === 0;
  if (run.decision === "go" && !ready) throw new Error("GO cannot freeze a candidate while required artifacts or gates remain open");

  return Object.freeze({
    schema: SCHEMA,
    generatedAt: new Date().toISOString(),
    candidate: Object.freeze({ ...run.candidate }),
    artifacts: Object.freeze(artifacts),
    summary: Object.freeze({
      artifactCount: artifacts.length,
      requiredArtifactCount: artifacts.filter((artifact) => artifact.required).length,
      presentArtifactCount: artifacts.filter((artifact) => artifact.present).length,
      missingArtifactCount: missingArtifacts.length,
      missingArtifactKindCount: missingArtifactKinds.length,
      openGateCount: openGates.length,
    }),
    missingArtifacts: Object.freeze(missingArtifacts),
    missingArtifactKinds: Object.freeze(missingArtifactKinds),
    openGates: Object.freeze(openGates),
    freeze: Object.freeze({
      status: ready ? "ready-for-signoff" : "blocked",
      decision: run.decision,
      goEligible: ready,
    }),
  });
}

export async function freezeReleaseCandidateFile(inputPath, outputPath) {
  const input = await readBoundedJsonFile(inputPath, "release candidate freeze input");
  const report = freezeReleaseCandidate(input);
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return report;
}

function validateRun(input) {
  if (!input || typeof input !== "object") throw new Error("release freeze input must be an object");
  if (input.schema !== SCHEMA) throw new Error("unsupported release freeze schema");
  if (!input.candidate || typeof input.candidate !== "object") throw new Error("candidate is required");
  if (typeof input.candidate.cliCommit !== "string" || !COMMIT.test(input.candidate.cliCommit)) throw new Error("candidate cliCommit is invalid");
  if (typeof input.candidate.webCommit !== "string" || !COMMIT.test(input.candidate.webCommit)) throw new Error("candidate webCommit is invalid");
  if (typeof input.candidate.version !== "string" || input.candidate.version.length === 0 || input.candidate.version.length > 128) throw new Error("candidate version is invalid");
  if (!Array.isArray(input.artifacts) || input.artifacts.length === 0 || input.artifacts.length > 1024) throw new Error("artifacts are invalid");
  if (!input.gates || typeof input.gates !== "object") throw new Error("gates are required");
  if (!DECISIONS.has(input.decision)) throw new Error("decision is invalid");
  return input;
}

function validateArtifact(input) {
  if (!input || typeof input !== "object" || typeof input.path !== "string" || input.path.length === 0 || input.path.length > 512) throw new Error("freeze artifact path is invalid");
  if (input.path.startsWith("/") || input.path.includes("..")) throw new Error(`unsafe freeze artifact path: ${input.path}`);
  if (typeof input.kind !== "string" || input.kind.length === 0 || input.kind.length > 128) throw new Error(`freeze artifact kind is invalid: ${input.path}`);
  if (!SHA256.test(input.sha256)) throw new Error(`freeze artifact digest is invalid: ${input.path}`);
  if (typeof input.required !== "boolean" || typeof input.present !== "boolean") throw new Error(`freeze artifact flags are invalid: ${input.path}`);
  return Object.freeze({ path: input.path, kind: input.kind, sha256: input.sha256, required: input.required, present: input.present });
}

function validateGates(input) {
  const output = {};
  for (const name of GATE_NAMES) {
    if (!GATE_STATES.has(input[name])) throw new Error(`freeze gate state is invalid: ${name}`);
    output[name] = input[name];
  }
  return Object.freeze(output);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) throw new Error("usage: node scripts/freeze-release-candidate.mjs INPUT.json OUTPUT.json");
  const report = await freezeReleaseCandidateFile(inputPath, outputPath);
  process.stdout.write(`${JSON.stringify({ schema: report.schema, status: report.freeze.status, openGates: report.summary.openGateCount, missingArtifacts: report.summary.missingArtifactCount, missingArtifactKinds: report.summary.missingArtifactKindCount })}\n`);
}
