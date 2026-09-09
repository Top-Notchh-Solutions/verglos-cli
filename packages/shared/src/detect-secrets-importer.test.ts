import assert from "node:assert/strict";
import { test } from "node:test";
import { importDetectSecretsBaseline, DetectSecretsImportError } from "./detect-secrets-importer.js";
test("detect-secrets importer preserves baseline metadata and findings", () => { const result = importDetectSecretsBaseline(new TextEncoder().encode(JSON.stringify({ version: "1.5.0", generated_at: "2026-01-01T00:00:00Z", plugins_used: [{ name: "AWSKeyDetector" }], results: { "src/a.ts": [{ type: "Secret", is_secret: false }] } }))); assert.equal(result.plugins.length, 1); assert.equal(result.results["src/a.ts"]?.length, 1); });
test("detect-secrets importer rejects malformed baselines", () => { assert.throws(() => importDetectSecretsBaseline(new TextEncoder().encode(JSON.stringify({ version: "1.5.0", results: [] }))), (e: unknown) => e instanceof DetectSecretsImportError); });
