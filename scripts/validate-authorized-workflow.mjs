import { writeFile } from "node:fs/promises";
import { readBoundedJsonFile } from "./read-bounded-json.mjs";

const INPUT_SCHEMA = "verglos.private.authorized-workflow.v1";
const OUTPUT_SCHEMA = "verglos.private.authorized-workflow-result.v1";
const COMMIT = /^[a-f0-9]{7,64}$/u;
const SHA256 = /^sha256:[a-f0-9]{64}$/u;
const SAFE_PATH = /^(?!\/)(?!.*\.\.)[^\u0000-\u001f]{1,512}$/u;
const SUBJECT_KINDS = new Set(["external-repository-owner"]);
const NETWORK_MODES = new Set(["denied", "allowlisted"]);
const RETENTION_MODES = new Set(["digest-only", "derived-redacted", "raw"]);
const OUTCOMES = new Set(["passed", "failed"]);
const COVERAGE = new Set(["complete", "partial", "incomplete"]);
const DISPOSITIONS = new Set(["deleted", "expired"]);
const SECRET_LIKE = [
  /-----BEGIN [^-]*PRIVATE KEY-----/u,
  /(?:DATABASE_URL|CLERK_SECRET_KEY|NPM_TOKEN|NODE_AUTH_TOKEN)\s*=/iu,
  /(?:sk|rzp|whsec|ghp|github_pat)_(?:live|test)?_[A-Za-z0-9_-]{8,}/u,
];

/**
 * Validate one exact, consented repository workflow record. This contract
 * checks authorization and bounded execution evidence but never turns a
 * public fixture, synthetic run, or owner assertion into customer acceptance.
 */
export function validateAuthorizedWorkflow(input, { now = new Date() } = {}) {
  rejectSecretLike(input);
  if (!input || typeof input !== "object" || input.schema !== INPUT_SCHEMA) throw new Error("unsupported authorized workflow schema");
  const currentTime = validDate(now, "now");
  const consent = validateConsent(input.consent, currentTime);
  const execution = validateExecution(input.execution, consent, currentTime);
  const deletion = validateDeletion(input.deletion, execution.completedAt, currentTime);
  const failures = [];

  if (execution.outcome !== "passed") failures.push("workflow-outcome-failed");
  if (execution.exitCode !== 0) failures.push("command-exit-nonzero");
  if (execution.coverage !== "complete" || execution.limitations.length > 0) failures.push("coverage-incomplete-or-limited");
  if (execution.preflight.secretScan !== "passed" || execution.preflight.personalDataScan !== "passed" || execution.preflight.scopeCheck !== "passed" || execution.preflight.redactionCheck !== "passed") failures.push("preflight-not-passed");
  if (!execution.ownerSummaryDelivered) failures.push("owner-summary-not-delivered");
  if (!DISPOSITIONS.has(deletion.disposition)) failures.push("deletion-or-expiry-not-recorded");
  if (deletion.status !== "confirmed") failures.push("deletion-or-expiry-not-confirmed");
  if (consent.findingsMayBeStored === false && execution.retentionMode !== "digest-only") failures.push("retention-exceeds-consent");
  if (execution.retentionMode === "raw") failures.push("raw-artifact-retention-forbidden");

  const accepted = failures.length === 0;
  return Object.freeze({
    schema: OUTPUT_SCHEMA,
    completedAt: execution.completedAt.toISOString(),
    consent: Object.freeze({
      subjectKind: consent.subjectKind,
      ownerIdentityDigest: consent.ownerIdentityDigest,
      repositoryUrl: consent.repositoryUrl,
      exactCommit: consent.exactCommit,
      scopeDigest: consent.scopeDigest,
      networkMode: consent.networkMode,
      findingsMayBeStored: consent.findingsMayBeStored,
      expiresAt: consent.expiresAt.toISOString(),
    }),
    execution: Object.freeze({
      cliCommit: execution.cliCommit,
      version: execution.version,
      cloneDigest: execution.cloneDigest,
      requestedPathCount: execution.requestedPaths.length,
      commandCount: execution.commands.length,
      sourceUpload: execution.sourceUpload,
      retentionMode: execution.retentionMode,
      exitCode: execution.exitCode,
      coverage: execution.coverage,
      findingCount: execution.findingCount,
      reportDigest: execution.reportDigest,
      evidenceDigest: execution.evidenceDigest,
      ownerSummaryDelivered: execution.ownerSummaryDelivered,
    }),
    deletion: Object.freeze({ disposition: deletion.disposition, status: deletion.status, recordedAt: deletion.recordedAt.toISOString(), evidenceDigest: deletion.evidenceDigest }),
    summary: Object.freeze({ failureCount: failures.length, failures, accepted }),
    gate: Object.freeze({
      workflowStatus: accepted ? "accepted" : "failed",
      customerAcceptance: "not-claimed",
      independentReview: "required",
    }),
  });
}

export async function validateAuthorizedWorkflowFile(inputPath, outputPath, options = {}) {
  const input = await readBoundedJsonFile(inputPath, "authorized workflow input");
  const report = validateAuthorizedWorkflow(input, options);
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return report;
}

function validateConsent(input, now) {
  if (!input || typeof input !== "object" || !SUBJECT_KINDS.has(input.subjectKind)) throw new Error("authorized workflow consent subject is invalid");
  const repositoryUrl = validRepositoryUrl(input.repositoryUrl);
  if (typeof input.exactCommit !== "string" || !COMMIT.test(input.exactCommit)) throw new Error("authorized workflow consent commit is invalid");
  if (!SHA256.test(input.ownerIdentityDigest) || !SHA256.test(input.scopeDigest)) throw new Error("authorized workflow consent identity/scope digest is invalid");
  const permittedPaths = relativePaths(input.permittedPaths, "permitted paths");
  const permittedCommands = boundedStrings(input.permittedCommands, "permitted commands", 64);
  const network = validateNetwork(input.networkPolicy);
  if (typeof input.findingsMayBeStored !== "boolean") throw new Error("authorized workflow findings storage decision is required");
  const allowedEvidenceFields = boundedStrings(input.allowedEvidenceFields, "allowed evidence fields", 64);
  const approvedAt = validDate(input.approvedAt, "owner approval time");
  const founderApprovedAt = validDate(input.founderApprovedAt, "founder approval time");
  const expiresAt = validDate(input.expiresAt, "consent expiry");
  if (approvedAt > now || founderApprovedAt > now || expiresAt <= now || expiresAt <= approvedAt || expiresAt <= founderApprovedAt) throw new Error("authorized workflow consent window is invalid");
  if (typeof input.revocationChannel !== "string" || input.revocationChannel.trim().length === 0 || input.revocationChannel.length > 512) throw new Error("authorized workflow revocation channel is invalid");
  if (input.revokedAt !== undefined && input.revokedAt !== null) throw new Error("revoked consent cannot authorize a workflow");
  return { subjectKind: input.subjectKind, repositoryUrl, exactCommit: input.exactCommit, ownerIdentityDigest: input.ownerIdentityDigest, scopeDigest: input.scopeDigest, permittedPaths, permittedCommands, networkMode: network.mode, networkDestinations: network.destinations, findingsMayBeStored: input.findingsMayBeStored, allowedEvidenceFields, expiresAt };
}

function validateExecution(input, consent, now) {
  if (!input || typeof input !== "object") throw new Error("authorized workflow execution is required");
  if (validRepositoryUrl(input.repositoryUrl) !== consent.repositoryUrl || input.exactCommit !== consent.exactCommit) throw new Error("authorized workflow execution is not bound to consented repository/commit");
  const completedAt = validDate(input.completedAt, "workflow completion time");
  if (completedAt > now || completedAt > consent.expiresAt) throw new Error("authorized workflow completed outside the consent window");
  if (typeof input.cliCommit !== "string" || !COMMIT.test(input.cliCommit)) throw new Error("authorized workflow CLI commit is invalid");
  if (typeof input.version !== "string" || input.version.length === 0 || input.version.length > 128) throw new Error("authorized workflow version is invalid");
  if (!SHA256.test(input.cloneDigest) || !SHA256.test(input.reportDigest) || !SHA256.test(input.evidenceDigest)) throw new Error("authorized workflow digest is invalid");
  const requestedPaths = relativePaths(input.requestedPaths, "requested paths");
  for (const path of requestedPaths) if (!consent.permittedPaths.includes(path) && !consent.permittedPaths.includes(".")) throw new Error(`requested path is outside consent: ${path}`);
  const commands = boundedStrings(input.commands, "executed commands", 64);
  for (const command of commands) if (!consent.permittedCommands.includes(command)) throw new Error(`executed command is outside consent: ${command}`);
  const networkDestinations = boundedStrings(input.networkDestinations ?? [], "network destinations", 64);
  if (consent.networkMode === "denied" && networkDestinations.length > 0) throw new Error("network destination is outside denied policy");
  for (const destination of networkDestinations) if (!consent.networkDestinations.includes(destination)) throw new Error(`network destination is outside consent: ${destination}`);
  if (input.sourceUpload !== "none") throw new Error("source upload must be none");
  if (!RETENTION_MODES.has(input.retentionMode) || input.retentionMode === "raw") throw new Error("workflow retention mode is unsafe");
  if (!OUTCOMES.has(input.outcome) || !Number.isInteger(input.exitCode) || input.exitCode < 0 || input.exitCode > 255) throw new Error("workflow outcome/exit code is invalid");
  if (!COVERAGE.has(input.coverage) || !Array.isArray(input.limitations) || input.limitations.some((item) => typeof item !== "string" || item.length > 256)) throw new Error("workflow coverage is invalid");
  if (!Number.isInteger(input.findingCount) || input.findingCount < 0 || !Number.isInteger(input.filesWalked) || input.filesWalked <= 0) throw new Error("workflow result counts are invalid");
  if (!input.preflight || typeof input.preflight !== "object") throw new Error("workflow preflight is required");
  for (const key of ["secretScan", "personalDataScan", "scopeCheck", "redactionCheck"]) if (input.preflight[key] !== "passed" && input.preflight[key] !== "failed") throw new Error(`workflow preflight state is invalid: ${key}`);
  if (typeof input.ownerSummaryDelivered !== "boolean") throw new Error("owner summary delivery state is required");
  return { repositoryUrl: consent.repositoryUrl, exactCommit: consent.exactCommit, completedAt, cliCommit: input.cliCommit, version: input.version, cloneDigest: input.cloneDigest, requestedPaths, commands, networkDestinations, sourceUpload: input.sourceUpload, retentionMode: input.retentionMode, outcome: input.outcome, exitCode: input.exitCode, coverage: input.coverage, limitations: input.limitations, findingCount: input.findingCount, filesWalked: input.filesWalked, preflight: input.preflight, ownerSummaryDelivered: input.ownerSummaryDelivered, reportDigest: input.reportDigest, evidenceDigest: input.evidenceDigest };
}

function validateDeletion(input, completedAt, now) {
  if (!input || typeof input !== "object" || !DISPOSITIONS.has(input.disposition) || input.status !== "confirmed") throw new Error("workflow deletion/expiry record is incomplete");
  const recordedAt = validDate(input.recordedAt, "deletion/expiry record time");
  if (recordedAt < completedAt || recordedAt > now) throw new Error("deletion/expiry record time is invalid");
  if (!SHA256.test(input.evidenceDigest)) throw new Error("deletion/expiry evidence digest is invalid");
  return { disposition: input.disposition, status: input.status, recordedAt, evidenceDigest: input.evidenceDigest };
}

function validRepositoryUrl(value) {
  if (typeof value !== "string" || value.length > 512) throw new Error("repository URL is invalid");
  let url;
  try { url = new URL(value); } catch { throw new Error("repository URL is invalid"); }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) throw new Error("repository URL must be an HTTPS URL without credentials/query/fragment");
  return url.toString().replace(/\/$/u, "");
}

function validateNetwork(input) {
  if (!input || typeof input !== "object" || !NETWORK_MODES.has(input.mode)) throw new Error("network policy is invalid");
  const destinations = boundedStrings(input.destinations ?? [], "network destinations", 64);
  if (input.mode === "denied" && destinations.length > 0) throw new Error("denied network policy cannot list destinations");
  for (const destination of destinations) validRepositoryUrl(destination);
  return { mode: input.mode, destinations };
}

function relativePaths(input, label) {
  if (!Array.isArray(input) || input.length === 0 || input.length > 256 || input.some((item) => typeof item !== "string" || !SAFE_PATH.test(item))) throw new Error(`${label} are invalid`);
  return [...new Set(input)];
}

function boundedStrings(input, label, max) {
  if (!Array.isArray(input) || input.length > max || input.some((item) => typeof item !== "string" || item.length === 0 || item.length > 512)) throw new Error(`${label} are invalid`);
  return [...new Set(input)];
}

function validDate(value, label) {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error(`${label} is invalid`);
  return date;
}

function rejectSecretLike(input) {
  const serialized = JSON.stringify(input);
  if (SECRET_LIKE.some((pattern) => pattern.test(serialized))) throw new Error("secret-like material is not allowed in workflow records");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) throw new Error("usage: node scripts/validate-authorized-workflow.mjs INPUT.json OUTPUT.json");
  const report = await validateAuthorizedWorkflowFile(inputPath, outputPath);
  process.stdout.write(`${JSON.stringify({ schema: report.schema, workflowStatus: report.gate.workflowStatus, customerAcceptance: report.gate.customerAcceptance, failureCount: report.summary.failureCount })}\n`);
}
