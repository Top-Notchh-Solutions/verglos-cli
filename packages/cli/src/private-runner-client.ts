import { constants } from "node:fs";
import { randomUUID } from "node:crypto";
import { chmod, lstat, mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import { dirname } from "node:path";
import { homedir } from "node:os";
import {
  admitPrivateRunnerJob,
  privateRunnerJobDigest,
  projectPrivateRunnerResult,
  verifyPrivateRunnerJobSignature,
  type PrivateRunnerJob,
  type PrivateRunnerAdmissionFailure,
  type PrivateRunnerResult,
  type PrivateRunnerResultInput,
} from "@verglos/shared";
import { DEFAULT_API_URL, getTrustedApiOrigin, loadCredentials } from "./credentials.js";

const MAX_KEY_BYTES = 16 * 1024;
const MAX_RESPONSE_BYTES = 1 * 1024 * 1024;
const MAX_REPLAY_BYTES = 256 * 1024;
const MAX_REPLAY_ENTRIES = 4096;
const DEFAULT_TIMEOUT_MS = 8_000;
const ID = /^[A-Za-z0-9][A-Za-z0-9._:/-]{0,255}$/u;
const MAX_RESULT_BYTES = 64 * 1024;

export type PrivateRunnerPollResult = Readonly<
  | { status: "empty"; endpoint: string }
  | { status: "ready"; endpoint: string; job: PrivateRunnerJob; jobDigest: string }
  | { status: "denied"; endpoint: string; reason: PrivateRunnerAdmissionFailure | "invalid_response" | "invalid_signature" | "replayed_local" }
  | { status: "error"; endpoint?: string; reason: "no_license" | "network" | "http" | "response_too_large" | "invalid_json" | "invalid_input" }
>;

export type PrivateRunnerUploadResult = Readonly<
  | { status: "uploaded"; endpoint: string; resultDigest: string; idempotent: boolean }
  | { status: "error"; endpoint?: string; reason: "no_license" | "network" | "http" | "response_too_large" | "invalid_json" | "invalid_result" | "invalid_input" }
>;

type ReplayState = Readonly<{ jobIds: readonly string[]; nonces: readonly string[] }>;

function defaultReplayPath(): string {
  const home = process.env.HOME || process.env.USERPROFILE || homedir();
  return `${home}/.verglos/private-runner-replay.json`;
}

function validId(value: string): boolean {
  return ID.test(value);
}

async function readBoundedFile(path: string, maxBytes: number, message: string): Promise<Buffer> {
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > maxBytes) throw new Error(message);
  const bytes = await readFile(path);
  if (bytes.byteLength > maxBytes) throw new Error(message);
  return bytes;
}

async function readPublicKey(path: string): Promise<string> {
  const bytes = await readBoundedFile(path, MAX_KEY_BYTES, "trusted runner key must be a bounded regular file");
  const value = bytes.toString("utf8");
  if (!value.trim()) throw new Error("trusted runner key is empty");
  return value;
}

function parseReplay(value: unknown): ReplayState {
  if (value === undefined) return { jobIds: [], nonces: [] };
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("runner replay cache is invalid");
  const record = value as Record<string, unknown>;
  const jobIds = record.jobIds;
  const nonces = record.nonces;
  if (!Array.isArray(jobIds) || !Array.isArray(nonces) || jobIds.length > MAX_REPLAY_ENTRIES || nonces.length > MAX_REPLAY_ENTRIES) throw new Error("runner replay cache is invalid");
  if (![...jobIds, ...nonces].some((entry) => typeof entry !== "string" || !validId(entry))) return { jobIds: jobIds as string[], nonces: nonces as string[] };
  throw new Error("runner replay cache is invalid");
}

async function readReplay(path: string): Promise<ReplayState> {
  try {
    const bytes = await readBoundedFile(path, MAX_REPLAY_BYTES, "runner replay cache is invalid");
    return parseReplay(JSON.parse(bytes.toString("utf8")));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return { jobIds: [], nonces: [] };
    if (error instanceof SyntaxError) throw new Error("runner replay cache is invalid");
    throw error;
  }
}

async function writeReplay(path: string, state: ReplayState): Promise<void> {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  await chmod(dirname(path), 0o700);
  const temporaryPath = `${path}.tmp-${randomUUID()}`;
  const bytes = Buffer.from(`${JSON.stringify(state)}\n`, "utf8");
  const handle = await open(temporaryPath, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL, 0o600);
  try {
    await handle.writeFile(bytes);
    await handle.sync();
  } finally {
    await handle.close();
  }
  try {
    await rename(temporaryPath, path);
  } finally {
    await unlink(temporaryPath).catch(() => undefined);
  }
}

function rememberReplay(state: ReplayState, job: PrivateRunnerJob): ReplayState {
  return {
    jobIds: [...state.jobIds, job.jobId].slice(-MAX_REPLAY_ENTRIES),
    nonces: [...state.nonces, job.nonce].slice(-MAX_REPLAY_ENTRIES),
  };
}

function parseJobResponse(value: unknown): PrivateRunnerJob | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("invalid runner response");
  const record = value as Record<string, unknown>;
  if (record.job === null || record.status === "empty") return null;
  const job = record.job;
  if (typeof job !== "object" || job === null || Array.isArray(job)) throw new Error("invalid runner response");
  return job as PrivateRunnerJob;
}

function endpointFor(apiUrl: string, tenantId: string, runnerId: string, endpoint?: string): string {
  const path = endpoint ?? `/api/v1/private-runner/jobs?tenant_id=${encodeURIComponent(tenantId)}&runner_id=${encodeURIComponent(runnerId)}`;
  if (!path.startsWith("/") || path.startsWith("//") || /[\u0000-\u001f\u007f]/u.test(path)) throw new Error("runner endpoint must be a relative API path");
  return `${apiUrl}${path}`;
}

function relativeEndpointFor(apiUrl: string, path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || /[\u0000-\u001f\u007f]/u.test(path)) throw new Error("runner endpoint must be a relative API path");
  return `${apiUrl}${path}`;
}

function parseSourceFreeResult(value: unknown): PrivateRunnerResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("private runner result must be an object");
  const record = value as Record<string, unknown>;
  const input: PrivateRunnerResultInput = {
    jobId: record.jobId as string,
    tenantId: record.tenantId as string,
    runnerId: record.runnerId as string,
    state: record.state as PrivateRunnerResultInput["state"],
    startedAt: record.startedAt as string,
    finishedAt: record.finishedAt as string,
    evidenceDigest: record.evidenceDigest as string | null,
    findingCount: record.findingCount as number,
    coverage: record.coverage as PrivateRunnerResultInput["coverage"],
  };
  return projectPrivateRunnerResult(input);
}

/** Poll one signed private-runner job. This function never executes a job or uploads a result. */
export async function pollPrivateRunnerJob(input: Readonly<{
  tenantId: string;
  runnerId: string;
  trustedKeyPath: string;
  allowedTargets: readonly string[];
  replayPath?: string;
  endpoint?: string;
  now?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}>): Promise<PrivateRunnerPollResult> {
  if (!validId(input.tenantId) || !validId(input.runnerId) || input.allowedTargets.length === 0 || input.allowedTargets.some((target) => !validId(target))) return { status: "error", reason: "invalid_input" };
  const creds = await loadCredentials();
  if (!creds.licenseKey) return { status: "error", reason: "no_license" };
  const apiOrigin = getTrustedApiOrigin(creds.apiUrl ?? DEFAULT_API_URL);
  if (!apiOrigin) return { status: "error", reason: "invalid_input" };
  let endpoint: string;
  try { endpoint = endpointFor(apiOrigin, input.tenantId, input.runnerId, input.endpoint); } catch { return { status: "error", reason: "invalid_input" }; }

  let trustedKey: string;
  let replay: ReplayState;
  try {
    trustedKey = await readPublicKey(input.trustedKeyPath);
    replay = await readReplay(input.replayPath ?? defaultReplayPath());
  } catch { return { status: "error", endpoint, reason: "invalid_input" }; }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  let response: Response;
  try {
    response = await (input.fetchImpl ?? fetch)(endpoint, {
      method: "GET",
      headers: { Accept: "application/json", Authorization: `Bearer ${creds.licenseKey}` },
      signal: controller.signal,
    });
  } catch {
    return { status: "error", endpoint, reason: "network" };
  } finally {
    clearTimeout(timer);
  }
  const contentLength = Number(response.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_RESPONSE_BYTES) return { status: "error", endpoint, reason: "response_too_large" };
  let body: unknown;
  try {
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > MAX_RESPONSE_BYTES) return { status: "error", endpoint, reason: "response_too_large" };
    body = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return { status: "error", endpoint, reason: "invalid_json" };
  }
  if (!response.ok) return { status: "error", endpoint, reason: "http" };
  let job: PrivateRunnerJob | null;
  try { job = parseJobResponse(body); } catch { return { status: "denied", endpoint, reason: "invalid_response" }; }
  if (!job) return { status: "empty", endpoint };
  if (!verifyPrivateRunnerJobSignature(job, trustedKey)) return { status: "denied", endpoint, reason: "invalid_signature" };
  if (replay.jobIds.includes(job.jobId) || replay.nonces.includes(job.nonce)) return { status: "denied", endpoint, reason: "replayed_local" };
  const admission = admitPrivateRunnerJob({
    job,
    tenantId: input.tenantId,
    runnerId: input.runnerId,
    now: input.now ?? new Date().toISOString(),
    allowedTargets: new Set(input.allowedTargets),
    trustedPublicKeyPem: trustedKey,
    replayedJobIds: new Set(replay.jobIds),
  });
  if (!admission.admitted) return { status: "denied", endpoint, reason: admission.reason };
  try { await writeReplay(input.replayPath ?? defaultReplayPath(), rememberReplay(replay, job)); }
  catch { return { status: "error", endpoint, reason: "invalid_input" }; }
  return { status: "ready", endpoint, job, jobDigest: privateRunnerJobDigest(job) };
}

/** Upload only the shared least-evidence result projection; this function never uploads raw output. */
export async function uploadPrivateRunnerResult(input: Readonly<{
  result: unknown;
  endpoint?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}>): Promise<PrivateRunnerUploadResult> {
  let result: PrivateRunnerResult;
  try { result = parseSourceFreeResult(input.result); } catch { return { status: "error", reason: "invalid_result" }; }
  const creds = await loadCredentials();
  if (!creds.licenseKey) return { status: "error", reason: "no_license" };
  const apiOrigin = getTrustedApiOrigin(creds.apiUrl ?? DEFAULT_API_URL);
  if (!apiOrigin) return { status: "error", reason: "invalid_input" };
  let endpoint: string;
  try { endpoint = relativeEndpointFor(apiOrigin, input.endpoint ?? "/api/v1/private-runner/results"); } catch { return { status: "error", reason: "invalid_input" }; }
  const body = JSON.stringify(result);
  if (Buffer.byteLength(body, "utf8") > MAX_RESULT_BYTES) return { status: "error", endpoint, reason: "invalid_input" };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs ?? DEFAULT_TIMEOUT_MS);
  let response: Response;
  try {
    response = await (input.fetchImpl ?? fetch)(endpoint, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json", Authorization: `Bearer ${creds.licenseKey}` },
      body,
      signal: controller.signal,
    });
  } catch {
    return { status: "error", endpoint, reason: "network" };
  } finally {
    clearTimeout(timer);
  }
  const contentLength = Number(response.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_RESULT_BYTES) return { status: "error", endpoint, reason: "response_too_large" };
  let value: unknown;
  try {
    const bytes = await response.arrayBuffer();
    if (bytes.byteLength > MAX_RESULT_BYTES) return { status: "error", endpoint, reason: "response_too_large" };
    value = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return { status: "error", endpoint, reason: "invalid_json" };
  }
  if (!response.ok || typeof value !== "object" || value === null || (value as Record<string, unknown>).ok !== true || typeof (value as Record<string, unknown>).resultDigest !== "string") {
    return { status: "error", endpoint, reason: "http" };
  }
  const record = value as Record<string, unknown>;
  return { status: "uploaded", endpoint, resultDigest: record.resultDigest as string, idempotent: record.idempotent === true };
}

export function privateRunnerResultSummary(result: PrivateRunnerPollResult): unknown {
  if (result.status === "ready") {
    return {
      status: result.status,
      protocolVersion: result.job.protocolVersion,
      jobId: result.job.jobId,
      tenantId: result.job.tenantId,
      runnerId: result.job.runnerId,
      recipeId: result.job.recipeId,
      targetSubjectId: result.job.targetSubjectId,
      targetDigest: result.job.targetDigest,
      expiresAt: result.job.expiresAt,
      network: result.job.network.mode,
      limits: result.job.limits,
      jobDigest: result.jobDigest,
      execution: "not-executed",
      resultUpload: "not-performed",
    };
  }
  return result;
}
