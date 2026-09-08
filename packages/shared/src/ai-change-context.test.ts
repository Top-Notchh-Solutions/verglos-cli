import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AI_CHANGE_CONTEXT_SCHEMA,
  AIChangeContextValidationError,
  JsonDocumentError,
  createSubject,
  parseAIChangeContext,
  parseAIChangeContextJson,
  type AIChangeContextDocument,
} from "./index.js";

const digest = (char: string) => ({
  algorithm: "sha256" as const,
  value: char.repeat(64),
});

function baseDocument(): Omit<AIChangeContextDocument, "evidence"> {
  const subject = createSubject({
    kind: "filesystem",
    treeDigest: digest("a"),
    ignorePolicyDigest: digest("b"),
    entryCount: 5,
  });
  return {
    schemaId: AI_CHANGE_CONTEXT_SCHEMA.id,
    schemaVersion: AI_CHANGE_CONTEXT_SCHEMA.version,
    contextId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    subjectId: subject.subjectId,
    scope: { kind: "path", path: "src/index.ts" },
    observedAt: "2026-09-09T00:00:00.000Z",
  };
}

function heuristic(): AIChangeContextDocument {
  return {
    ...baseDocument(),
    evidence: {
      basis: "heuristic",
      presentation: "estimate",
      classification: "ai-assisted",
      likelihood: 0.78,
      confidence: "medium",
      method: {
        id: "verglos.ai-change-heuristic",
        version: "1.0.0",
        configurationDigest: digest("c"),
      },
      inputDigest: digest("d"),
      signals: [
        {
          id: "git.commit-shape",
          direction: "ai-assisted",
          strength: 0.6,
          detail: "Commit-shape signal matched the configured heuristic.",
        },
      ],
      limitations: ["This is a likelihood estimate, not an authorship fact."],
    },
  };
}

test("heuristic context round-trips only as an estimate", () => {
  const context = heuristic();
  assert.deepEqual(parseAIChangeContext(context), context);
  assert.deepEqual(parseAIChangeContextJson(JSON.stringify(context)), context);
  assert.equal(context.evidence.presentation, "estimate");
});

test("heuristics require reproducible method/input and visible limitations", () => {
  const context = heuristic();
  assertContextError(
    () =>
      parseAIChangeContext({
        ...context,
        evidence: { ...context.evidence, limitations: [] },
      }),
    "evidence.limitations",
  );
  assertContextError(
    () =>
      parseAIChangeContext({
        ...context,
        evidence: { ...context.evidence, presentation: "verified-declaration" },
      }),
    "evidence",
  );
});

test("Git trailers and tool metadata remain unverified declarations", () => {
  const context = parseAIChangeContext({
    ...baseDocument(),
    evidence: {
      basis: "declared",
      presentation: "declared-claim",
      classification: "ai-assisted",
      declarationKind: "git-trailer",
      declarer: { kind: "tool", id: "cursor" },
      declarationDigest: digest("e"),
      method: {
        id: "verglos.git-trailer-reader",
        version: "1.0.0",
        configurationDigest: digest("f"),
      },
      authenticity: "not-cryptographically-verified",
      limitations: ["A trailer is a declaration and can be added or removed."],
    },
  });
  assert.equal(context.evidence.basis, "declared");
  assert.equal(context.evidence.authenticity, "not-cryptographically-verified");
});

test("verified cryptographic declarations require verification evidence", () => {
  const evidence = {
    basis: "cryptographic" as const,
    presentation: "verified-declaration" as const,
    claimKind: "ai-change" as const,
    classification: "ai-assisted" as const,
    statementFormat: "in-toto" as const,
    statementDigest: digest("1"),
    signatureStatus: "verified" as const,
    signer: { identity: "developer@example.com", issuer: "https://issuer.example.com" },
    trustPolicy: { id: "verglos.user-provenance", version: "1.0.0", digest: digest("2") },
    limitations: ["The signature proves the declaration, not line-level authorship."],
  };
  assertContextError(
    () => parseAIChangeContext({ ...baseDocument(), evidence }),
    "evidence.verifiedAt",
  );
  const parsed = parseAIChangeContext({
    ...baseDocument(),
    evidence: {
      ...evidence,
      verificationBundleDigest: digest("3"),
      verifiedAt: "2026-09-09T00:01:00.000Z",
    },
  });
  assert.equal(parsed.evidence.presentation, "verified-declaration");
});

test("invalid or unverified signatures cannot render as verified", () => {
  for (const signatureStatus of ["invalid", "unverified"] as const) {
    assertContextError(
      () =>
        parseAIChangeContext({
          ...baseDocument(),
          evidence: {
            basis: "cryptographic",
            presentation: "verified-declaration",
            claimKind: "ai-change",
            classification: "unknown",
            statementFormat: "signed-commit",
            statementDigest: digest("4"),
            signatureStatus,
            signer: { identity: "key:123" },
            trustPolicy: { id: "verglos.commit-policy", version: "1.0.0", digest: digest("5") },
            limitations: ["Signature validity is not established."],
          },
        }),
      "evidence.presentation",
    );
  }
});

test("signed build provenance cannot be relabeled as AI authorship", () => {
  assertContextError(
    () =>
      parseAIChangeContext({
        ...baseDocument(),
        evidence: {
          basis: "cryptographic",
          presentation: "unverified-declaration",
          claimKind: "build-provenance",
          classification: "ai-assisted",
          statementFormat: "slsa",
          statementDigest: digest("6"),
          signatureStatus: "unverified",
          signer: { identity: "builder.example.com" },
          trustPolicy: { id: "verglos.build-policy", version: "1.0.0", digest: digest("7") },
          limitations: ["Build provenance does not assert change authorship."],
        },
      }),
    "evidence.classification",
  );
});

test("range scopes are subject-bound and ordered", () => {
  assertContextError(
    () =>
      parseAIChangeContext({
        ...heuristic(),
        scope: { kind: "range", path: "src/index.ts", startLine: 9, endLine: 3 },
      }),
    "scope.endLine",
  );
  assertContextError(
    () => parseAIChangeContext({ ...heuristic(), subjectId: "repo:latest" }),
    "subjectId",
  );
});

test("future schema versions fail with an actionable upgrade", () => {
  assert.throws(
    () =>
      parseAIChangeContextJson(
        JSON.stringify({ ...heuristic(), schemaVersion: "2.0.0" }),
      ),
    (error: unknown) =>
      error instanceof JsonDocumentError &&
      error.code === "SCHEMA_UPGRADE_REQUIRED" &&
      /Upgrade/.test(error.action),
  );
});

function assertContextError(operation: () => unknown, path: string): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof AIChangeContextValidationError);
    assert.ok(
      error.issues.some(
        (issue) => issue.path === path || issue.path.startsWith(`${path}.`),
      ),
    );
    return true;
  });
}
