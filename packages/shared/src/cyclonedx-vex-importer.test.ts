import assert from "node:assert/strict";
import { test } from "node:test";
import { importCycloneDxVex, CycloneDxVexError } from "./cyclonedx-vex-importer.js";
test("CycloneDX VEX importer preserves analysis as assertions", () => { const result = importCycloneDxVex(new TextEncoder().encode(JSON.stringify({ bomFormat: "CycloneDX", specVersion: "1.5", vulnerabilities: [{ id: "CVE-1", affects: [{ ref: "pkg:npm/a@1" }], analysis: { state: "resolved", justification: "code_not_present", detail: "reviewed", response: ["update"] } }] }))); assert.equal(result.assertionsOnly, true); assert.equal(result.vulnerabilities.length, 1); });
test("CycloneDX VEX importer rejects malformed analysis", () => { assert.throws(() => importCycloneDxVex(new TextEncoder().encode(JSON.stringify({ bomFormat: "CycloneDX", specVersion: "1.5", vulnerabilities: [{ analysis: "verified" }] }))), (e: unknown) => e instanceof CycloneDxVexError && e.code === "MALFORMED_VULNERABILITY"); });
