import assert from "node:assert/strict";
import { test } from "node:test";
import { parseSupportedTrivyFixture, TrivyCompatibilityError } from "./trivy-compatibility.js";

test("Trivy compatibility fixture freezes major and output schema", () => {
  const fixture = parseSupportedTrivyFixture(new TextEncoder().encode('{"Results":[]}'), "0.60.0");
  assert.equal(fixture.engineMajor, 0); assert.equal(fixture.outputSchema, "trivy-json-v1"); assert.deepEqual(fixture.observations, []);
});
test("unknown Trivy majors are incomplete rather than guessed", () => {
  assert.throws(() => parseSupportedTrivyFixture(new TextEncoder().encode('{"Results":[]}'), "1.0.0"), (e: unknown) => e instanceof TrivyCompatibilityError && e.code === "UNKNOWN_MAJOR");
});
