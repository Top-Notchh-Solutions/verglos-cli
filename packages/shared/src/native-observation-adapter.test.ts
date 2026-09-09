import assert from "node:assert/strict";
import { test } from "node:test";
import { nativeFindingToObservation } from "./native-observation-adapter.js";

test("native finding adapter is subject-bound and deterministic", () => {
  const finding = { origin: "native" as const, findingId: "f-1", detector: "auth-check", severity: "high", confidence: 0.9, title: "Auth issue", description: "Review auth", file: "src/auth.ts", line: 4, refs: ["https://example.com/rule"] };
  const input = { finding, subjectId: `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`, producerId: "verglos.native", runId: "urn:uuid:11111111-1111-4111-8111-111111111111" as const };
  const first = nativeFindingToObservation(input); const second = nativeFindingToObservation(input);
  assert.equal(first.observationId, second.observationId); assert.equal(first.subjectId, input.subjectId); assert.equal(first.origin.kind, "native"); assert.equal(first.severity.normalized, "high");
});
