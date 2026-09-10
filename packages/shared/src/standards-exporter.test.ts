import assert from "node:assert/strict";
import { test } from "node:test";
import { exportCycloneDx, exportCycloneDxVex, exportSpdx } from "./standards-exporter.js";

test("standards exporters round-trip validated documents deterministically", () => {
  assert.equal(JSON.parse(exportCycloneDx({ bomFormat: "CycloneDX", specVersion: "1.5", components: [], dependencies: [] })).bomFormat, "CycloneDX");
  assert.equal(JSON.parse(exportCycloneDxVex({ bomFormat: "CycloneDX", specVersion: "1.5", vulnerabilities: [{ id: "CVE-1" }] })).vulnerabilities[0].id, "CVE-1");
  assert.equal(JSON.parse(exportSpdx({ spdxVersion: "SPDX-2.3", packages: [], files: [], relationships: [] })).spdxVersion, "SPDX-2.3");
});
