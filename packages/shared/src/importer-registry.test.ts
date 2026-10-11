import assert from "node:assert/strict";
import { test } from "node:test";
import { importBoundedJson, ImporterError } from "./importer-registry.js";

test("importer registry detects SARIF and preserves source digest", () => { const result = importBoundedJson(new TextEncoder().encode(JSON.stringify({ version: "2.1.0", runs: [] }))); assert.equal(result.format, "sarif"); assert.equal(result.version, "2.1.0"); assert.equal(result.sourceDigest.algorithm, "sha256"); });
test("importer registry rejects oversized and ambiguous documents", () => { assert.throws(() => importBoundedJson(new TextEncoder().encode("{}"), 1), (e: unknown) => e instanceof ImporterError && e.code === "TOO_LARGE"); assert.throws(() => importBoundedJson(new TextEncoder().encode(JSON.stringify({ version: "2.1.0", runs: [], bomFormat: "CycloneDX", specVersion: "1.5" }))), (e: unknown) => e instanceof ImporterError && e.code === "AMBIGUOUS_FORMAT"); });

test("importer registry rejects deeply nested and structurally excessive JSON before format processing", () => {
  const nested = new TextEncoder().encode(`{"version":"2.1.0","runs":[],"untrusted":${"[".repeat(65)}0${"]".repeat(65)}}`);
  assert.throws(() => importBoundedJson(nested), (error: unknown) => error instanceof ImporterError && error.code === "TOO_COMPLEX");
  const manyItems = new TextEncoder().encode(JSON.stringify({ version: "2.1.0", runs: [], untrusted: Array.from({ length: 200_001 }, () => 0) }));
  assert.throws(() => importBoundedJson(manyItems), (error: unknown) => error instanceof ImporterError && error.code === "TOO_COMPLEX");
});

test("importer registry validates explicit byte limits and invalid UTF-8 without exposing input", () => {
  assert.throws(() => importBoundedJson(new TextEncoder().encode("{}"), 0), (error: unknown) => error instanceof ImporterError && error.code === "TOO_LARGE");
  assert.throws(() => importBoundedJson(new Uint8Array([0xff])), (error: unknown) => error instanceof ImporterError && error.code === "INVALID_JSON");
});
