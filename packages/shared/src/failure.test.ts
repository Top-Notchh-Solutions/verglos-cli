import assert from "node:assert/strict";
import { test } from "node:test";
import {
  FAILURE_CATEGORIES,
  FAILURE_EXIT_CODES,
  FAILURE_SCHEMA,
  FailureValidationError,
  createFailure,
  parseFailure,
  parseFailureJson,
} from "./index.js";

const base = {
  failureId: "urn:uuid:e2345678-1234-4123-8123-123456789abc",
  operation: "record.verify",
  message: "The member digest does not match its payload.",
  limitation: "The record cannot be trusted until the original bytes are recovered.",
  action: "Quarantine the record and obtain a fresh export.",
  occurredAt: "2026-09-09T05:00:00.000Z",
};

test("each taxonomy category has one stable exit mapping", () => {
  for (const category of FAILURE_CATEGORIES) {
    const failure = createFailure({
      ...base,
      category,
      code: `verglos.failure.${category}.observed`,
      retry: category === "quota" ? "after-window" : category === "infrastructure" ? "safe" : "never",
    });
    assert.equal(failure.schemaId, FAILURE_SCHEMA.id);
    assert.equal(failure.exitCode, FAILURE_EXIT_CODES[category]);
    assert.deepEqual(parseFailureJson(JSON.stringify(failure)), failure);
  }
});

test("failure codes cannot cross category namespaces or lie about exits", () => {
  assertFailureError(
    () => createFailure({ ...base, category: "integrity", code: "verglos.failure.internal.crash", retry: "never" }),
    "code",
  );
  assertFailureError(
    () => parseFailure({ ...base, schemaId: FAILURE_SCHEMA.id, schemaVersion: "1.0.0", category: "quota", code: "verglos.failure.quota.exhausted", exitCode: 1, retry: "after-window" }),
    "exitCode",
  );
});

test("blind retry is rejected for usage, policy, authorization, and integrity failures", () => {
  for (const category of ["usage", "policy-block", "authorization", "integrity"] as const) {
    assertFailureError(
      () => createFailure({ ...base, category, code: `verglos.failure.${category}.retry`, retry: "safe" }),
      "retry",
    );
  }
});

test("failure documents are strict and future versions are not guessed", () => {
  assertFailureError(
    () => parseFailure({ ...createFailure({ ...base, category: "internal", code: "verglos.failure.internal.crash", retry: "never" }), extra: true }),
    "",
  );
  assertFailureError(
    () => parseFailure({ ...createFailure({ ...base, category: "internal", code: "verglos.failure.internal.crash", retry: "never" }), schemaVersion: "2.0.0" }),
    "schemaVersion",
  );
});

function assertFailureError(operation: () => unknown, path: string): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof FailureValidationError);
    assert.ok(error.issues.some((entry) => entry.path === path || entry.path.startsWith(`${path}.`)));
    return true;
  });
}
