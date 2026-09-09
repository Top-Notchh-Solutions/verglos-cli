import assert from "node:assert/strict";
import { test } from "node:test";
import { importCycloneDx, CycloneDxImportError } from "./cyclonedx-importer.js";
test("CycloneDX importer preserves components and dependencies", () => { const result = importCycloneDx(new TextEncoder().encode(JSON.stringify({ bomFormat: "CycloneDX", specVersion: "1.5", serialNumber: "urn:uuid:x", components: [{ type: "library", "bom-ref": "pkg:npm/a@1" }], dependencies: [{ ref: "pkg:npm/a@1", dependsOn: [] }] }))); assert.equal(result.components.length, 1); assert.equal(result.serialNumber, "urn:uuid:x"); });
test("CycloneDX importer rejects malformed component arrays", () => { assert.throws(() => importCycloneDx(new TextEncoder().encode(JSON.stringify({ bomFormat: "CycloneDX", specVersion: "1.5", components: [null] }))), (e: unknown) => e instanceof CycloneDxImportError && e.code === "MALFORMED_COMPONENT"); });
