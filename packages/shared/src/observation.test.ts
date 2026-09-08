import assert from "node:assert/strict";
import { test } from "node:test";
import {
  JsonDocumentError,
  OBSERVATION_SCHEMA,
  ObservationValidationError,
  createSubject,
  parseObservation,
  parseObservationJson,
  type ObservationDocument,
} from "./index.js";

const digest = { algorithm: "sha256" as const, value: "a".repeat(64) };

function nativeObservation(): ObservationDocument {
  const subject = createSubject({
    kind: "filesystem",
    treeDigest: digest,
    ignorePolicyDigest: { algorithm: "sha256", value: "b".repeat(64) },
    entryCount: 4,
  });
  return {
    schemaId: OBSERVATION_SCHEMA.id,
    schemaVersion: OBSERVATION_SCHEMA.version,
    observationId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    subjectId: subject.subjectId,
    origin: {
      kind: "native",
      producerId: "verglos.native-scanner",
      runId: "urn:uuid:22345678-1234-4123-8123-123456789abc",
      ruleId: "D4-005",
      ruleVersion: "1.0.0",
      producerObservationId: "finding-123",
    },
    coverageClass: "native",
    category: "cryptography.secrets",
    title: "Credential-like value",
    description: "A credential-like value was found in source.",
    locations: [{ kind: "source", path: "src/config.ts", startLine: 10, endLine: 10 }],
    severity: {
      original: { system: "verglos.severity", value: "high" },
      normalized: "high",
      mapping: { id: "verglos.severity-map", version: "1.0.0" },
    },
    confidence: {
      original: 0.8,
      level: "high",
      score: 0.8,
      method: "verglos.native-confidence",
      mappingVersion: "1.0.0",
    },
    remediation: { summary: "Move the value to a secret manager." },
    evidence: [
      {
        kind: "excerpt",
        classification: "sensitive",
        handling: "redacted",
        description: "Matched source excerpt",
        content: "token = [REDACTED]",
      },
    ],
    references: [{ id: "CWE-798", url: "https://cwe.mitre.org/data/definitions/798.html" }],
    extensions: {},
  };
}

test("native observations preserve original and normalized evidence fields", () => {
  const observation = nativeObservation();
  assert.deepEqual(parseObservation(observation), observation);
  assert.deepEqual(parseObservationJson(JSON.stringify(observation)), observation);
  assert.equal(parseObservation(observation).severity.original.value, "high");
});

test("adapter and imported observations require raw evidence lineage", () => {
  const base = nativeObservation();
  for (const kind of ["adapter", "imported"] as const) {
    assertObservationError(
      () => parseObservation({ ...base, origin: { ...base.origin, kind }, coverageClass: kind === "adapter" ? "external" : "imported" }),
      "origin.rawEvidenceDigest",
    );
    assert.equal(
      parseObservation({
        ...base,
        origin: { ...base.origin, kind, rawEvidenceDigest: digest },
        coverageClass: kind === "adapter" ? "external" : "imported",
      }).origin.kind,
      kind,
    );
  }
});

test("coverage class cannot relabel producer origin", () => {
  assertObservationError(
    () => parseObservation({ ...nativeObservation(), coverageClass: "imported" }),
    "coverageClass",
  );
});

test("source and package locations enforce exact bounded identity", () => {
  const base = nativeObservation();
  assertObservationError(
    () => parseObservation({ ...base, locations: [{ kind: "source", path: "../secret", startLine: 1 }] }),
    "locations.0.path",
  );
  assertObservationError(
    () => parseObservation({ ...base, locations: [{ kind: "source", path: "src/a.ts", startLine: 4, endLine: 3 }] }),
    "locations.0.endLine",
  );
  assertObservationError(
    () => parseObservation({ ...base, locations: [{ kind: "package", ecosystem: "npm", name: "left-pad" }] }),
    "locations.0.version",
  );
});

test("secret and sensitive excerpts cannot be included raw", () => {
  const base = nativeObservation();
  assertObservationError(
    () => parseObservation({ ...base, evidence: [{ kind: "excerpt", classification: "secret", handling: "included", description: "secret", content: "raw" }] }),
    "evidence.0.handling",
  );
  assertObservationError(
    () => parseObservation({ ...base, evidence: [{ kind: "excerpt", classification: "sensitive", handling: "included", description: "sensitive", content: "raw" }] }),
    "evidence.0.handling",
  );
  assertObservationError(
    () => parseObservation({ ...base, evidence: [{ kind: "excerpt", classification: "secret", handling: "omitted", description: "secret", content: "raw" }] }),
    "evidence.0.content",
  );
});

test("extensions require namespaced canonical JSON and bounded size", () => {
  const base = nativeObservation();
  assertObservationError(() => parseObservation({ ...base, extensions: { raw: true } }), "extensions.raw");
  assertObservationError(
    () => parseObservation({ ...base, extensions: { "trivy.detail": undefined } }),
    "extensions.trivy.detail",
  );
  assertObservationError(
    () => parseObservation({ ...base, extensions: { "trivy.detail": "x".repeat(66_000) } }),
    "extensions.trivy.detail",
  );
});

test("references use HTTPS so renderers do not inherit unsafe schemes", () => {
  assertObservationError(
    () => parseObservation({ ...nativeObservation(), references: [{ url: "javascript:alert(1)" }] }),
    "references.0.url",
  );
});

test("unknown normalized values and mapping versions stay explicit", () => {
  const base = nativeObservation();
  const parsed = parseObservation({
    ...base,
    severity: { ...base.severity, original: { system: "vendor.rating", value: "vendor-new" }, normalized: "unknown" },
    confidence: { ...base.confidence, original: "not-provided", level: "unknown", score: undefined },
  });
  assert.equal(parsed.severity.original.value, "vendor-new");
  assert.equal(parsed.severity.normalized, "unknown");
});

test("future observation versions produce an actionable upgrade error", () => {
  assert.throws(
    () => parseObservationJson(JSON.stringify({ ...nativeObservation(), schemaVersion: "2.0.0" })),
    (error: unknown) => error instanceof JsonDocumentError && error.code === "SCHEMA_UPGRADE_REQUIRED" && /Upgrade/.test(error.action),
  );
});

test("unknown fields fail instead of escaping through the stable contract", () => {
  assertObservationError(() => parseObservation({ ...nativeObservation(), trivySeverity: "HIGH" }), "");
});

function assertObservationError(operation: () => unknown, path: string): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof ObservationValidationError);
    assert.ok(error.issues.some((issue) => issue.path === path || issue.path.startsWith(`${path}.`)));
    return true;
  });
}
