import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { test } from "node:test";
import { importInTotoProvenance, ProvenanceImportError } from "./provenance-importer.js";
test("in-toto importer preserves subjects and unverified signature state", () => { const result = importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [{ name: "artifact", digest: { sha256: "a".repeat(64) } }], predicate: { builder: { id: "builder" } } }))); assert.equal(result.subjects.length, 1); assert.equal(result.signatureStatus, "unverified"); });
test("in-toto importer rejects statements without subjects", () => { assert.throws(() => importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [], predicate: {} }))), (e: unknown) => e instanceof ProvenanceImportError && e.code === "MISSING_SUBJECT"); });
test("in-toto importer rejects malformed envelopes and digest maps", () => {
  assert.throws(() => importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [], payload: null }))), (e: unknown) => e instanceof ProvenanceImportError && e.code === "INVALID_ENVELOPE");
  assert.throws(() => importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [{ name: "a", digest: { sha256: 42 } }] }))), (e: unknown) => e instanceof ProvenanceImportError && e.code === "INVALID_STATEMENT");
  assert.throws(() => importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [{ name: "a", digest: {} }], predicate: [] }))), (e: unknown) => e instanceof ProvenanceImportError && e.code === "INVALID_STATEMENT");
});

test("DSSE importer preserves its original source digest and signature presence without claiming verification", () => {
  const statement = { _type: "https://in-toto.io/Statement/v1", subject: [{ name: "artifact", digest: { sha256: "a".repeat(64) } }], predicateType: "https://slsa.dev/provenance/v1", predicate: { runDetails: { builder: { id: "builder" }, metadata: { invocationId: "fixture-run" } } } };
  const payload = Buffer.from(JSON.stringify(statement));
  const bytes = new TextEncoder().encode(JSON.stringify({ payloadType: "application/vnd.in-toto+json", payload: payload.toString("base64"), signatures: [{ keyid: "fixture-key", sig: "fixture-signature" }] }));
  const imported = importInTotoProvenance(bytes);
  assert.equal(imported.envelopeType, "dsse");
  assert.equal(imported.signatureCount, 1);
  assert.equal(imported.signatureStatus, "unverified");
  assert.deepEqual(imported.statement, statement);
  assert.equal(imported.sourceDigest.value, createHash("sha256").update(bytes).digest("hex"));
  assert.equal(imported.builder?.id, "builder");
  assert.equal(imported.invocation?.invocationId, "fixture-run");
});

test("DSSE importer rejects unsupported payload types and non-canonical base64", () => {
  const statement = JSON.stringify({ _type: "https://in-toto.io/Statement/v1", subject: [{ name: "a", digest: { sha256: "a".repeat(64) } }] });
  const base = { payloadType: "application/vnd.in-toto+json", payload: Buffer.from(statement).toString("base64"), signatures: [{ sig: "sig" }] };
  assert.throws(() => importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ ...base, payloadType: "text/plain" }))), (e: unknown) => e instanceof ProvenanceImportError && e.code === "INVALID_ENVELOPE");
  assert.throws(() => importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ ...base, payload: `${base.payload}!` }))), (e: unknown) => e instanceof ProvenanceImportError && e.code === "INVALID_ENVELOPE");
});
