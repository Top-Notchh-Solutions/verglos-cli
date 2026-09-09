import assert from "node:assert/strict";
import { test } from "node:test";
import { importBoundedJson, ImporterError } from "./importer-registry.js";

test("importer registry detects SARIF and preserves source digest", () => { const result = importBoundedJson(new TextEncoder().encode(JSON.stringify({ version: "2.1.0", runs: [] }))); assert.equal(result.format, "sarif"); assert.equal(result.version, "2.1.0"); assert.equal(result.sourceDigest.algorithm, "sha256"); });
test("importer registry rejects oversized and ambiguous documents", () => { assert.throws(() => importBoundedJson(new TextEncoder().encode("{}"), 1), (e: unknown) => e instanceof ImporterError && e.code === "TOO_LARGE"); assert.throws(() => importBoundedJson(new TextEncoder().encode(JSON.stringify({ version: "2.1.0", runs: [], bomFormat: "CycloneDX", specVersion: "1.5" }))), (e: unknown) => e instanceof ImporterError && e.code === "AMBIGUOUS_FORMAT"); });
