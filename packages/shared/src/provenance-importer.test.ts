import assert from "node:assert/strict";
import { test } from "node:test";
import { importInTotoProvenance, ProvenanceImportError } from "./provenance-importer.js";
test("in-toto importer preserves subjects and unverified signature state", () => { const result = importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [{ name: "artifact", digest: { sha256: "a".repeat(64) } }], predicate: { builder: { id: "builder" } } }))); assert.equal(result.subjects.length, 1); assert.equal(result.signatureStatus, "unverified"); });
test("in-toto importer rejects statements without subjects", () => { assert.throws(() => importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [], predicate: {} }))), (e: unknown) => e instanceof ProvenanceImportError && e.code === "MISSING_SUBJECT"); });
test("in-toto importer rejects malformed envelopes and digest maps", () => {
  assert.throws(() => importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [], payload: null }))), (e: unknown) => e instanceof ProvenanceImportError && e.code === "INVALID_ENVELOPE");
  assert.throws(() => importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [{ name: "a", digest: { sha256: 42 } }] }))), (e: unknown) => e instanceof ProvenanceImportError && e.code === "INVALID_STATEMENT");
  assert.throws(() => importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [{ name: "a", digest: {} }], predicate: [] }))), (e: unknown) => e instanceof ProvenanceImportError && e.code === "INVALID_STATEMENT");
});
