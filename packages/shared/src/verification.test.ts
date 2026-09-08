import assert from "node:assert/strict";
import { test } from "node:test";
import {
  JsonDocumentError,
  VERIFICATION_ATTEMPT_SCHEMA,
  VerificationAttemptValidationError,
  createSubject,
  parseVerificationAttempt,
  parseVerificationAttemptJson,
  type VerificationAttemptDocument,
} from "./index.js";

const digest = (char: string) => ({
  algorithm: "sha256" as const,
  value: char.repeat(64),
});

function confirmedAttempt(): VerificationAttemptDocument {
  const subject = createSubject({
    kind: "filesystem",
    treeDigest: digest("a"),
    ignorePolicyDigest: digest("b"),
    entryCount: 3,
  });
  return {
    schemaId: VERIFICATION_ATTEMPT_SCHEMA.id,
    schemaVersion: VERIFICATION_ATTEMPT_SCHEMA.version,
    attemptId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    subjectId: subject.subjectId,
    observationId: "urn:uuid:22345678-1234-4123-8123-123456789abc",
    recipe: {
      id: "verglos.hunt.recipe.sql-injection",
      version: "1.0.0",
      digest: digest("c"),
      signatureStatus: "verified",
      signer: "verglos.recipe-release",
      trustPolicyDigest: digest("d"),
    },
    approval: {
      required: true,
      status: "approved",
      actor: "local-user",
      approvedAt: "2026-09-09T00:00:00.000Z",
    },
    sandbox: {
      isolation: "container",
      runtime: "local-container-runtime 1.0.0",
      runtimeDigest: digest("e"),
      filesystem: "ephemeral-write",
      network: { mode: "denied", destinations: [] },
      nonRoot: true,
      cleanup: "succeeded",
    },
    inputDigest: digest("f"),
    parameterDigest: digest("1"),
    secretInputs: "none",
    limits: {
      timeoutMs: 30000,
      cpuMs: 10000,
      memoryBytes: 268435456,
      diskBytes: 104857600,
      maxProcesses: 16,
      maxOutputBytes: 1048576,
      maxNetworkRequests: 0,
    },
    executed: true,
    startedAt: "2026-09-09T00:00:01.000Z",
    completedAt: "2026-09-09T00:00:02.000Z",
    usage: {
      durationMs: 1000,
      cpuMs: 500,
      peakMemoryBytes: 1048576,
      diskBytes: 4096,
      processes: 2,
      outputBytes: 128,
      networkRequests: 0,
    },
    output: {
      evidenceDigest: digest("2"),
      stdout: {
        digest: digest("3"),
        size: 128,
        truncated: false,
        redaction: "applied",
      },
      artifacts: [],
    },
    verdict: "confirmed",
    reason: "The bounded recipe reproduced the observation.",
    limitations: ["This attempt covers only the recorded subject and recipe inputs."],
  };
}

function nonExecuted(
  verdict: "not_supported" | "policy_denied",
): VerificationAttemptDocument {
  const attempt = confirmedAttempt();
  return {
    ...attempt,
    approval: {
      required: true,
      status: verdict === "policy_denied" ? "denied" : "not-requested",
    },
    sandbox: { ...attempt.sandbox, isolation: "none", cleanup: "not-started" },
    executed: false,
    startedAt: undefined,
    usage: {
      durationMs: 0,
      cpuMs: 0,
      peakMemoryBytes: 0,
      diskBytes: 0,
      processes: 0,
      outputBytes: 0,
      networkRequests: 0,
    },
    output: { artifacts: [] },
    verdict,
    reason:
      verdict === "policy_denied"
        ? "Execution was denied by policy."
        : "No compatible recipe supports this observation.",
  };
}

test("confirmed and not-reproduced attempts require execution evidence", () => {
  const confirmed = confirmedAttempt();
  assert.deepEqual(parseVerificationAttempt(confirmed), confirmed);
  assert.deepEqual(parseVerificationAttemptJson(JSON.stringify(confirmed)), confirmed);
  assert.equal(
    parseVerificationAttempt({ ...confirmed, verdict: "not_reproduced" }).verdict,
    "not_reproduced",
  );
  assertAttemptError(
    () => parseVerificationAttempt({ ...confirmed, output: { artifacts: [] } }),
    "output.evidenceDigest",
  );
});

test("not-supported and policy-denied attempts cannot execute", () => {
  assert.equal(parseVerificationAttempt(nonExecuted("not_supported")).executed, false);
  assert.equal(parseVerificationAttempt(nonExecuted("policy_denied")).executed, false);
  assertAttemptError(
    () => parseVerificationAttempt({ ...confirmedAttempt(), verdict: "policy_denied" }),
    "executed",
  );
});

test("non-executed attempts cannot invent usage or output", () => {
  const attempt = nonExecuted("not_supported");
  assertAttemptError(
    () => parseVerificationAttempt({ ...attempt, usage: { ...attempt.usage, cpuMs: 1 } }),
    "usage",
  );
  assertAttemptError(
    () => parseVerificationAttempt({ ...attempt, output: { ...attempt.output, stderr: confirmedAttempt().output.stdout } }),
    "output",
  );
});

test("unverified or invalid recipes must not execute", () => {
  for (const signatureStatus of ["unverified", "invalid"] as const) {
    const attempt = confirmedAttempt();
    assertAttemptError(
      () => parseVerificationAttempt({ ...attempt, recipe: { ...attempt.recipe, signatureStatus } }),
      "recipe.signatureStatus",
    );
  }
});

test("executed attempts require approval and declared isolation", () => {
  const attempt = confirmedAttempt();
  assertAttemptError(
    () => parseVerificationAttempt({ ...attempt, approval: { required: true, status: "denied" } }),
    "approval.status",
  );
  assertAttemptError(
    () => parseVerificationAttempt({ ...attempt, sandbox: { ...attempt.sandbox, isolation: "none" } }),
    "sandbox.isolation",
  );
  assertAttemptError(
    () => parseVerificationAttempt({ ...attempt, sandbox: { ...attempt.sandbox, nonRoot: false } }),
    "sandbox.nonRoot",
  );
  assertAttemptError(
    () => parseVerificationAttempt({ ...attempt, sandbox: { ...attempt.sandbox, cleanup: "not-started" } }),
    "sandbox.cleanup",
  );
});

test("network denial and resource limits are enforced against recorded usage", () => {
  const attempt = confirmedAttempt();
  assertAttemptError(
    () => parseVerificationAttempt({ ...attempt, usage: { ...attempt.usage, networkRequests: 1 } }),
    "usage.networkRequests",
  );
  assertAttemptError(
    () => parseVerificationAttempt({ ...attempt, usage: { ...attempt.usage, processes: 17 } }),
    "usage.processes",
  );
});

test("allowlisted network must name destinations and denied mode must not", () => {
  const attempt = confirmedAttempt();
  assertAttemptError(
    () => parseVerificationAttempt({ ...attempt, sandbox: { ...attempt.sandbox, network: { mode: "allowlist", destinations: [] } } }),
    "sandbox.network.destinations",
  );
  assertAttemptError(
    () => parseVerificationAttempt({ ...attempt, sandbox: { ...attempt.sandbox, network: { mode: "denied", destinations: ["https://example.com"] } } }),
    "sandbox.network.destinations",
  );
  for (const destination of [
    "not-a-url",
    "http://example.com",
    "https://user:secret@example.com",
    "https://example.com/path?token=secret",
  ]) {
    assertAttemptError(
      () =>
        parseVerificationAttempt({
          ...attempt,
          sandbox: {
            ...attempt.sandbox,
            network: { mode: "allowlist", destinations: [destination] },
          },
        }),
      "sandbox.network.destinations.0",
    );
  }
});

test("managed isolation requires an immutable runtime digest", () => {
  const attempt = confirmedAttempt();
  const { runtimeDigest: _runtimeDigest, ...sandbox } = attempt.sandbox;
  assertAttemptError(
    () => parseVerificationAttempt({ ...attempt, sandbox }),
    "sandbox.runtimeDigest",
  );
});

test("attempt completion cannot precede execution start", () => {
  assertAttemptError(
    () => parseVerificationAttempt({ ...confirmedAttempt(), completedAt: "2026-09-09T00:00:00.000Z" }),
    "completedAt",
  );
});

test("all non-boolean verdicts remain distinct", () => {
  const base = confirmedAttempt();
  for (const verdict of ["inconclusive", "environment_error"] as const) {
    assert.equal(parseVerificationAttempt({ ...base, verdict }).verdict, verdict);
  }
});

test("future verification schema versions fail with an actionable upgrade", () => {
  assert.throws(
    () => parseVerificationAttemptJson(JSON.stringify({ ...confirmedAttempt(), schemaVersion: "2.0.0" })),
    (error: unknown) =>
      error instanceof JsonDocumentError &&
      error.code === "SCHEMA_UPGRADE_REQUIRED" &&
      /Upgrade/.test(error.action),
  );
});

function assertAttemptError(operation: () => unknown, path: string): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof VerificationAttemptValidationError);
    assert.ok(error.issues.some((issue) => issue.path === path || issue.path.startsWith(`${path}.`)));
    return true;
  });
}
