import { createHash, createPublicKey, verify } from "node:crypto";
import { canonicalizeJson } from "./schema.js";

/** ENT-CLI-001 · outbound-only private runner protocol.
 *
 * The runner receives a signed, short-lived recipe reference; it never
 * receives an arbitrary shell command. Results are reduced to digests and
 * bounded counters before they leave the private runner.
 */
export const PRIVATE_RUNNER_PROTOCOL_VERSION = "1.0.0" as const;
export const PRIVATE_RUNNER_NETWORK_MODES = ["denied", "allowlisted"] as const;
export type PrivateRunnerNetworkMode = (typeof PRIVATE_RUNNER_NETWORK_MODES)[number];
export const PRIVATE_RUNNER_RESULT_STATES = ["completed", "failed", "timed_out", "rejected"] as const;
export type PrivateRunnerResultState = (typeof PRIVATE_RUNNER_RESULT_STATES)[number];

export type PrivateRunnerJob = Readonly<{
  protocolVersion: typeof PRIVATE_RUNNER_PROTOCOL_VERSION;
  jobId: string;
  tenantId: string;
  runnerId: string;
  recipeId: string;
  targetSubjectId: string;
  targetDigest: string;
  issuedAt: string;
  expiresAt: string;
  nonce: string;
  network: Readonly<{ mode: PrivateRunnerNetworkMode; destinations: readonly string[] }>;
  limits: Readonly<{ timeoutMs: number; outputBytes: number; memoryMb: number; processes: number }>;
  signature: string;
}>;

export type PrivateRunnerAdmissionFailure =
  | "invalid_job"
  | "invalid_signature"
  | "tenant_mismatch"
  | "runner_mismatch"
  | "job_expired"
  | "job_not_yet_valid"
  | "job_replayed"
  | "target_not_allowlisted"
  | "network_not_bounded"
  | "limits_out_of_range";

export type PrivateRunnerAdmission = Readonly<
  | { admitted: true; job: PrivateRunnerJob }
  | { admitted: false; reason: PrivateRunnerAdmissionFailure }
>;

export type PrivateRunnerResultInput = Readonly<{
  jobId: string;
  tenantId: string;
  runnerId: string;
  state: PrivateRunnerResultState;
  startedAt: string;
  finishedAt: string;
  evidenceDigest: string | null;
  findingCount: number;
  coverage: "complete" | "incomplete" | "unavailable";
}>;

export type PrivateRunnerResult = Readonly<PrivateRunnerResultInput & { protocolVersion: typeof PRIVATE_RUNNER_PROTOCOL_VERSION }>;

const ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,255}$/u;
const DIGEST = /^sha256:[a-f0-9]{64}$/u;
const NONCE = /^[A-Za-z0-9_-]{16,256}$/u;
const SIGNATURE = /^[A-Za-z0-9+/]+={0,2}$/u;
const MIN_TIMEOUT = 100;
const MAX_TIMEOUT = 15 * 60 * 1000;
const MAX_OUTPUT = 1 * 1024 * 1024;
const MAX_MEMORY = 4096;
const MAX_PROCESSES = 256;

function validDate(value: unknown): value is string {
  return typeof value === "string" && Number.isFinite(Date.parse(value));
}

function validLimits(limits: PrivateRunnerJob["limits"]): boolean {
  return Number.isSafeInteger(limits.timeoutMs) && limits.timeoutMs >= MIN_TIMEOUT && limits.timeoutMs <= MAX_TIMEOUT
    && Number.isSafeInteger(limits.outputBytes) && limits.outputBytes > 0 && limits.outputBytes <= MAX_OUTPUT
    && Number.isSafeInteger(limits.memoryMb) && limits.memoryMb > 0 && limits.memoryMb <= MAX_MEMORY
    && Number.isSafeInteger(limits.processes) && limits.processes > 0 && limits.processes <= MAX_PROCESSES;
}

function validShape(job: PrivateRunnerJob): boolean {
  try {
    return job.protocolVersion === PRIVATE_RUNNER_PROTOCOL_VERSION
      && ID.test(job.jobId) && ID.test(job.tenantId) && ID.test(job.runnerId) && ID.test(job.recipeId)
      && ID.test(job.targetSubjectId) && DIGEST.test(job.targetDigest)
      && validDate(job.issuedAt) && validDate(job.expiresAt) && NONCE.test(job.nonce)
      && (job.network.mode === "denied" || job.network.mode === "allowlisted")
      && Array.isArray(job.network.destinations)
      && job.network.destinations.length <= 16 && job.network.destinations.every((value) => /^https:\/\//u.test(value) && value.length <= 512)
      && SIGNATURE.test(job.signature) && validLimits(job.limits);
  } catch {
    return false;
  }
}

/** Return the exact canonical bytes a trusted runner signs for a job. */
export function privateRunnerJobSigningBytes(job: PrivateRunnerJob): Buffer {
  const unsigned = { ...job } as Record<string, unknown>;
  delete unsigned.signature;
  return Buffer.from(canonicalizeJson(unsigned), "utf8");
}

/** Verify the Ed25519 signature before any job fields are acted upon. */
export function verifyPrivateRunnerJobSignature(job: PrivateRunnerJob, publicKeyPem: string): boolean {
  try {
    if (!validShape(job)) return false;
    const key = createPublicKey(publicKeyPem);
    return key.asymmetricKeyType === "ed25519"
      && verify(null, privateRunnerJobSigningBytes(job), key, Buffer.from(job.signature, "base64"));
  } catch {
    return false;
  }
}

export function privateRunnerJobDigest(job: PrivateRunnerJob): string {
  return `sha256:${createHash("sha256").update(canonicalizeJson(job), "utf8").digest("hex")}`;
}

/** Admit exactly one job; callers persist `jobId`/`nonce` before execution. */
export function admitPrivateRunnerJob(input: Readonly<{
  job: PrivateRunnerJob;
  tenantId: string;
  runnerId: string;
  now: string;
  replayedJobIds?: ReadonlySet<string>;
  allowedTargets: ReadonlySet<string>;
  trustedPublicKeyPem?: string;
}>): PrivateRunnerAdmission {
  const { job } = input;
  if (!validShape(job)) return { admitted: false, reason: "invalid_job" };
  if (input.trustedPublicKeyPem !== undefined && !verifyPrivateRunnerJobSignature(job, input.trustedPublicKeyPem)) return { admitted: false, reason: "invalid_signature" };
  if (job.tenantId !== input.tenantId) return { admitted: false, reason: "tenant_mismatch" };
  if (job.runnerId !== input.runnerId) return { admitted: false, reason: "runner_mismatch" };
  const now = Date.parse(input.now);
  const issued = Date.parse(job.issuedAt);
  const expires = Date.parse(job.expiresAt);
  if (!Number.isFinite(now) || issued > now) return { admitted: false, reason: "job_not_yet_valid" };
  if (expires <= now || expires <= issued) return { admitted: false, reason: "job_expired" };
  if (input.replayedJobIds?.has(job.jobId)) return { admitted: false, reason: "job_replayed" };
  if (!input.allowedTargets.has(job.targetSubjectId)) return { admitted: false, reason: "target_not_allowlisted" };
  if (job.network.mode === "denied" && job.network.destinations.length > 0) return { admitted: false, reason: "network_not_bounded" };
  if (job.network.mode === "allowlisted" && job.network.destinations.length === 0) return { admitted: false, reason: "network_not_bounded" };
  return { admitted: true, job };
}

/** Project only least-evidence result fields; raw output never crosses this boundary. */
export function projectPrivateRunnerResult(input: PrivateRunnerResultInput): PrivateRunnerResult {
  if (!ID.test(input.jobId) || !ID.test(input.tenantId) || !ID.test(input.runnerId)) throw new Error("runner result identity is invalid");
  if (!validDate(input.startedAt) || !validDate(input.finishedAt) || Date.parse(input.finishedAt) < Date.parse(input.startedAt)) throw new Error("runner result timing is invalid");
  if (!PRIVATE_RUNNER_RESULT_STATES.includes(input.state) || !["complete", "incomplete", "unavailable"].includes(input.coverage)) throw new Error("runner result state is invalid");
  if (!Number.isSafeInteger(input.findingCount) || input.findingCount < 0 || input.findingCount > 100_000) throw new Error("runner result count is invalid");
  if (input.evidenceDigest !== null && !DIGEST.test(input.evidenceDigest)) throw new Error("runner result digest is invalid");
  if (input.state === "completed" && input.evidenceDigest === null) throw new Error("completed runner result requires evidence digest");
  return Object.freeze({ protocolVersion: PRIVATE_RUNNER_PROTOCOL_VERSION, ...input });
}

/** Stable digest for lease/result correlation; no raw result data is included. */
export function privateRunnerResultDigest(result: PrivateRunnerResult): string {
  return `sha256:${createHash("sha256").update(JSON.stringify(result)).digest("hex")}`;
}
