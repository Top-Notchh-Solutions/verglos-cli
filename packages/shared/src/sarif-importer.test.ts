import assert from "node:assert/strict";
import { test } from "node:test";
import { importSarif, SarifImportError } from "./sarif-importer.js";

test("SARIF importer preserves runs and source digest", () => { const result = importSarif(new TextEncoder().encode(JSON.stringify({ version: "2.1.0", runs: [{ tool: { driver: { name: "fixture" } }, results: [] }] }))); assert.equal(result.runs.length, 1); assert.equal(result.sourceDigest.algorithm, "sha256"); });
test("SARIF importer rejects unsupported versions and malformed runs", () => { assert.throws(() => importSarif(new TextEncoder().encode(JSON.stringify({ version: "2.0.0", runs: [] }))), (e: unknown) => e instanceof SarifImportError && e.code === "UNSUPPORTED_VERSION"); assert.throws(() => importSarif(new TextEncoder().encode(JSON.stringify({ version: "2.1.0", runs: [{ results: {} }] }))), (e: unknown) => e instanceof SarifImportError && e.code === "MALFORMED_RUN"); });
test("SARIF importer rejects unsafe artifact URIs", () => { assert.throws(() => importSarif(new TextEncoder().encode(JSON.stringify({ version: "2.1.0", runs: [{ results: [{ locations: [{ physicalLocation: { artifactLocation: { uri: "../../secret" } } }] }] }] }))), (e: unknown) => e instanceof SarifImportError && e.code === "MALFORMED_URI"); });
