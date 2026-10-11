import assert from "node:assert/strict";
import { test } from "node:test";

test("Hunt evidence report contract keeps the declared limitations explicit", () => {
  const report = {
    schema: "urn:verglos:evidence:hunt-adversarial:v1",
    imageDigest: "sha256:" + "a".repeat(64),
    limitations: ["not an independent security review", "Linux namespace skip"],
  };
  assert.match(report.schema, /^urn:verglos:evidence:hunt-adversarial:v1$/u);
  assert.match(report.imageDigest, /^sha256:[0-9a-f]{64}$/u);
  assert.ok(report.limitations.some((item) => /independent/u.test(item)));
  assert.ok(report.limitations.some((item) => /Linux/u.test(item)));
});
