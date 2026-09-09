import assert from "node:assert/strict";
import { test } from "node:test";
import { importSpdx, SpdxImportError } from "./spdx-importer.js";
test("SPDX importer preserves namespace and collections", () => { const result = importSpdx(new TextEncoder().encode(JSON.stringify({ spdxVersion: "SPDX-2.3", documentNamespace: "https://example.com/spdx/1", packages: [{ SPDXID: "SPDXRef-Package" }], files: [], relationships: [] }))); assert.equal(result.namespace, "https://example.com/spdx/1"); assert.equal(result.packages.length, 1); });
test("SPDX importer rejects malformed collections", () => { assert.throws(() => importSpdx(new TextEncoder().encode(JSON.stringify({ spdxVersion: "SPDX-2.3", packages: [null] }))), (e: unknown) => e instanceof SpdxImportError && e.code === "MALFORMED_COLLECTION"); });
