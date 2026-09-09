import assert from "node:assert/strict";
import { test } from "node:test";
import { importInTotoProvenance, ProvenanceImportError } from "./provenance-importer.js";
test("in-toto importer preserves subjects and unverified signature state", () => { const result = importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [{ name: "artifact", digest: { sha256: "a".repeat(64) } }], predicate: { builder: { id: "builder" } } }))); assert.equal(result.subjects.length, 1); assert.equal(result.signatureStatus, "unverified"); });
test("in-toto importer rejects statements without subjects", () => { assert.throws(() => importInTotoProvenance(new TextEncoder().encode(JSON.stringify({ _type: "link", subject: [], predicate: {} }))), (e: unknown) => e instanceof ProvenanceImportError && e.code === "MISSING_SUBJECT"); });
