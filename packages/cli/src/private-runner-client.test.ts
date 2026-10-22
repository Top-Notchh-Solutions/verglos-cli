import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { chmod, lstat, mkdtemp, mkdir, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { privateRunnerJobSigningBytes, type PrivateRunnerJob } from "@verglos/shared";
import { enrollPrivateRunner, pollPrivateRunnerJob, privateRunnerResultSummary, uploadPrivateRunnerResult } from "./private-runner-client.js";

const home = await mkdtemp(join(tmpdir(), "verglos-private-runner-client-"));
process.env.HOME = home;
const runnerCredential = `prc_${"a".repeat(43)}`;

async function writeRunnerCredentials(): Promise<void> {
  await mkdir(join(home, ".verglos"), { recursive: true });
  await writeFile(join(home, ".verglos", "credentials.json"), JSON.stringify({ apiUrl: "https://example.test", licenseKey: "owner-license-sentinel", privateRunner: { tenantId: "org_acme", runnerId: "runner_1", credential: runnerCredential, credentialExpiresAt: "2099-01-01T00:00:00.000Z" } }));
}

async function assertPrivateMode(path: string, expected: number): Promise<void> {
  const actual = (await lstat(path)).mode & 0o777;
  if (process.platform === "win32") {
    assert.notEqual(actual & 0o200, 0, `${path} must remain owner-writable`);
    return;
  }
  assert.equal(actual, expected, `${path} must have mode ${expected.toString(8)}`);
}

function makeJob(privateKey: ReturnType<typeof generateKeyPairSync>["privateKey"]): PrivateRunnerJob {
  const unsigned: PrivateRunnerJob = {
    protocolVersion: "1.0.0", jobId: "job_1", tenantId: "org_acme", runnerId: "runner_1", recipeId: "recipe_cve", targetSubjectId: "subject_app", targetDigest: `sha256:${"a".repeat(64)}`,
    issuedAt: "2026-10-06T00:00:00.000Z", expiresAt: "2026-10-06T00:10:00.000Z", nonce: "nonce_123456789012", network: { mode: "denied", destinations: [] }, limits: { timeoutMs: 1_000, outputBytes: 10_000, memoryMb: 256, processes: 8 }, signature: "",
  };
  return { ...unsigned, signature: sign(null, privateRunnerJobSigningBytes(unsigned), privateKey).toString("base64") };
}

function abortError(): Error {
  const error = new Error("response body timed out");
  error.name = "AbortError";
  return error;
}

function responseThatWaitsForAbort(signal: AbortSignal): Response {
  return new Response(new ReadableStream<Uint8Array>({
    pull() {
      return new Promise<void>((_resolve, reject) => {
        if (signal.aborted) {
          reject(abortError());
          return;
        }
        signal.addEventListener("abort", () => reject(abortError()), { once: true });
      });
    },
  }), { status: 200 });
}

async function withDeadline<T>(promise: Promise<T>, timeoutMs = 250): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_resolve, reject) => { timer = setTimeout(() => reject(new Error("test deadline exceeded")), timeoutMs); }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

test("private runner poll uses authenticated GET, verifies, admits, and persists only replay state", async () => {
  const keys = generateKeyPairSync("ed25519");
  const root = await mkdtemp(join(tmpdir(), "verglos-runner-fixture-"));
  const keyPath = join(root, "runner-public.pem");
  const replayPath = join(root, "replay.json");
  await chmod(root, 0o755);
  await writeFile(keyPath, keys.publicKey.export({ type: "spki", format: "pem" }));
  await writeRunnerCredentials();
  const calls: Array<{ url: string; method: string | undefined; authorization: string | null; redirect: string | undefined }> = [];
  const result = await pollPrivateRunnerJob({ tenantId: "org_acme", runnerId: "runner_1", trustedKeyPath: keyPath, allowedTargets: ["subject_app"], replayPath, now: "2026-10-06T00:01:00.000Z", fetchImpl: async (input, init) => {
    calls.push({ url: String(input), method: init?.method, authorization: new Headers(init?.headers).get("authorization"), redirect: init?.redirect });
    return new Response(JSON.stringify({ job: makeJob(keys.privateKey) }), { status: 200 });
  } });
  assert.equal(result.status, "ready");
  assert.equal(calls[0]?.method, "GET");
  assert.equal(calls[0]?.authorization, `Bearer ${runnerCredential}`);
  assert.equal(calls[0]?.redirect, "error");
  assert.equal((await readFile(replayPath, "utf8")).includes("job_1"), true);
  await assertPrivateMode(root, 0o700);
  await assertPrivateMode(replayPath, 0o600);
  const summary = privateRunnerResultSummary(result);
  assert.equal(typeof summary, "object");
  assert.equal("rawOutput" in (summary as Record<string, unknown>), false);
});

test("private runner poll refuses a locally replayed job and never executes it", async () => {
  const keys = generateKeyPairSync("ed25519");
  const root = await mkdtemp(join(tmpdir(), "verglos-runner-replay-"));
  const keyPath = join(root, "runner-public.pem");
  const replayPath = join(root, "replay.json");
  await writeFile(keyPath, keys.publicKey.export({ type: "spki", format: "pem" }));
  await writeFile(replayPath, JSON.stringify({ jobIds: ["job_1"], nonces: ["nonce_123456789012"] }));
  await writeRunnerCredentials();
  const result = await pollPrivateRunnerJob({ tenantId: "org_acme", runnerId: "runner_1", trustedKeyPath: keyPath, allowedTargets: ["subject_app"], replayPath, now: "2026-10-06T00:01:00.000Z", fetchImpl: async () => new Response(JSON.stringify({ job: makeJob(keys.privateKey) }), { status: 200 }) });
  assert.deepEqual(result, { status: "denied", endpoint: "https://example.test/api/v1/private-runner/jobs?tenant_id=org_acme&runner_id=runner_1", reason: "replayed_local" });
});

test("private runner poll rejects malformed signatures before admission", async () => {
  const keys = generateKeyPairSync("ed25519");
  const root = await mkdtemp(join(tmpdir(), "verglos-runner-signature-"));
  const keyPath = join(root, "runner-public.pem");
  await writeFile(keyPath, keys.publicKey.export({ type: "spki", format: "pem" }));
  await writeRunnerCredentials();
  const job = makeJob(keys.privateKey);
  const result = await pollPrivateRunnerJob({ tenantId: "org_acme", runnerId: "runner_1", trustedKeyPath: keyPath, allowedTargets: ["subject_app"], replayPath: join(root, "replay.json"), now: "2026-10-06T00:01:00.000Z", fetchImpl: async () => new Response(JSON.stringify({ job: { ...job, targetSubjectId: "subject_other" } }), { status: 200 }) });
  assert.equal(result.status, "denied");
  assert.equal(result.status === "denied" ? result.reason : "", "invalid_signature");
});

test("private runner poll keeps its timeout active while reading a response body", async () => {
  const keys = generateKeyPairSync("ed25519");
  const root = await mkdtemp(join(tmpdir(), "verglos-runner-body-timeout-"));
  const keyPath = join(root, "runner-public.pem");
  await writeFile(keyPath, keys.publicKey.export({ type: "spki", format: "pem" }));
  await writeRunnerCredentials();
  const result = await withDeadline(pollPrivateRunnerJob({ tenantId: "org_acme", runnerId: "runner_1", trustedKeyPath: keyPath, allowedTargets: ["subject_app"], replayPath: join(root, "replay.json"), timeoutMs: 10, fetchImpl: async (_input, init) => responseThatWaitsForAbort(init?.signal as AbortSignal) }));
  assert.deepEqual(result, { status: "error", endpoint: "https://example.test/api/v1/private-runner/jobs?tenant_id=org_acme&runner_id=runner_1", reason: "network" });
});

test("private runner poll refuses a same-origin route override before reading credentials", async () => {
  let called = false;
  const result = await pollPrivateRunnerJob({
    tenantId: "org_acme",
    runnerId: "runner_1",
    trustedKeyPath: "/tmp/not-read",
    allowedTargets: ["subject_app"],
    endpoint: "/api/license/unlock",
    fetchImpl: async () => {
      called = true;
      return new Response();
    },
  });
  assert.deepEqual(result, { status: "error", reason: "invalid_input" });
  assert.equal(called, false);
});

test("private runner result upload uses authenticated POST and sends only the shared projection", async () => {
  const result = {
    protocolVersion: "1.0.0", jobId: "job_1", tenantId: "org_acme", runnerId: "runner_1", state: "completed",
    startedAt: "2026-10-06T00:01:00.000Z", finishedAt: "2026-10-06T00:01:01.000Z", evidenceDigest: `sha256:${"b".repeat(64)}`, findingCount: 2, coverage: "complete",
  } as const;
  let requestBody = "";
  const response = await uploadPrivateRunnerResult({ result, fetchImpl: async (input, init) => {
    assert.equal(String(input), "https://example.test/api/v1/private-runner/results");
    assert.equal(init?.method, "POST");
    assert.equal(init?.redirect, "error");
    assert.equal(new Headers(init?.headers).get("authorization"), `Bearer ${runnerCredential}`);
    requestBody = String(init?.body);
    return new Response(JSON.stringify({ ok: true, resultDigest: `sha256:${"c".repeat(64)}`, idempotent: false }), { status: 201 });
  } });
  assert.deepEqual(response, { status: "uploaded", endpoint: "https://example.test/api/v1/private-runner/results", resultDigest: `sha256:${"c".repeat(64)}`, idempotent: false });
  assert.deepEqual(JSON.parse(requestBody), result);
  assert.equal(requestBody.includes("rawOutput"), false);
});

test("private runner result upload refuses malformed projections before network", async () => {
  let called = false;
  const response = await uploadPrivateRunnerResult({ result: { protocolVersion: "1.0.0", jobId: "job_1", command: "rm -rf" }, fetchImpl: async () => { called = true; return new Response(); } });
  assert.deepEqual(response, { status: "error", reason: "invalid_result" });
  assert.equal(called, false);
});

test("private runner result upload refuses a malformed successful response", async () => {
  const result = {
    protocolVersion: "1.0.0", jobId: "job_1", tenantId: "org_acme", runnerId: "runner_1", state: "completed",
    startedAt: "2026-10-06T00:01:00.000Z", finishedAt: "2026-10-06T00:01:01.000Z", evidenceDigest: `sha256:${"b".repeat(64)}`, findingCount: 2, coverage: "complete",
  } as const;
  const response = await uploadPrivateRunnerResult({ result, fetchImpl: async () => new Response(JSON.stringify({ ok: true, resultDigest: "not-a-digest", idempotent: false }), { status: 201 }) });
  assert.deepEqual(response, { status: "error", endpoint: "https://example.test/api/v1/private-runner/results", reason: "http" });
});

test("private runner result upload keeps its timeout active while reading a response body", async () => {
  const result = {
    protocolVersion: "1.0.0", jobId: "job_1", tenantId: "org_acme", runnerId: "runner_1", state: "completed",
    startedAt: "2026-10-06T00:01:00.000Z", finishedAt: "2026-10-06T00:01:01.000Z", evidenceDigest: `sha256:${"b".repeat(64)}`, findingCount: 2, coverage: "complete",
  } as const;
  const response = await withDeadline(uploadPrivateRunnerResult({ result, timeoutMs: 10, fetchImpl: async (_input, init) => responseThatWaitsForAbort(init?.signal as AbortSignal) }));
  assert.deepEqual(response, { status: "error", endpoint: "https://example.test/api/v1/private-runner/results", reason: "network" });
});

test("private runner result upload refuses a same-origin route override before network access", async () => {
  const result = await uploadPrivateRunnerResult({
    result: {
      protocolVersion: "1.0.0", jobId: "job_1", tenantId: "org_acme", runnerId: "runner_1", state: "completed",
      startedAt: "2026-10-06T00:01:00.000Z", finishedAt: "2026-10-06T00:01:01.000Z", evidenceDigest: `sha256:${"b".repeat(64)}`, findingCount: 2, coverage: "complete",
    },
    endpoint: "/api/license/unlock",
    fetchImpl: async () => { throw new Error("network must not be reached"); },
  });
  assert.deepEqual(result, { status: "error", reason: "invalid_input" });
});

test("private runner enrollment redeems once, stores the runner credential, and never sends the owner license", async () => {
  await writeFile(join(home, ".verglos", "credentials.json"), JSON.stringify({ apiUrl: "https://example.test", licenseKey: "owner-license-sentinel" }));
  const credential = `prc_${"b".repeat(43)}`;
  const result = await enrollPrivateRunner({ tenantId: "org_acme", runnerId: "runner_1", enrollmentToken: `pr_${"c".repeat(43)}`, fetchImpl: async (input, init) => {
    assert.equal(String(input), "https://example.test/api/v1/private-runner/enroll");
    assert.equal(init?.method, "POST");
    assert.equal(new Headers(init?.headers).get("authorization"), null);
    assert.equal(JSON.parse(String(init?.body)).enrollmentToken, `pr_${"c".repeat(43)}`);
    return new Response(JSON.stringify({ ok: true, tenantId: "org_acme", runnerId: "runner_1", runnerCredential: credential, credentialExpiresAt: "2099-01-01T00:00:00.000Z" }), { status: 201 });
  } });
  assert.deepEqual(result, { status: "enrolled", endpoint: "https://example.test/api/v1/private-runner/enroll", tenantId: "org_acme", runnerId: "runner_1", credentialExpiresAt: "2099-01-01T00:00:00.000Z" });
  const stored = JSON.parse(await readFile(join(home, ".verglos", "credentials.json"), "utf8")) as { licenseKey: string; privateRunner: { credential: string } };
  assert.equal(stored.licenseKey, "owner-license-sentinel");
  assert.equal(stored.privateRunner.credential, credential);
});
