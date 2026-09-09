import assert from "node:assert/strict";
import { test } from "node:test";
import { exportSarif } from "./sarif-exporter.js";

test("SARIF exporter emits bounded public Verglos properties", () => {
  const document = JSON.parse(exportSarif([{ ruleId: "rule-1", message: "finding", subjectId: "subject-1", decision: "BLOCK", uri: "src/a.ts", startLine: 3 }]));
  assert.equal(document.version, "2.1.0"); assert.equal(document.runs[0].results[0].properties["verglos.decision"], "BLOCK"); assert.equal(document.runs[0].results[0].locations[0].physicalLocation.region.startLine, 3); assert.equal("secret" in document.runs[0].results[0], false);
});
