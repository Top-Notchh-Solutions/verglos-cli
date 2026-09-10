import assert from "node:assert/strict";
import { test } from "node:test";
import { runFixtureEngine } from "./fixture-engine.js";

test("fixture engine drills success and failure without target execution", () => {
  const raw = new TextEncoder().encode('{"Results":[]}');
  const success = runFixtureEngine(raw); assert.equal(success.status, "success"); assert.equal(success.targetCodeExecuted, false); assert.deepEqual(success.observations, []);
  const failure = runFixtureEngine(raw, { fail: true }); assert.equal(failure.status, "failure"); assert.deepEqual(failure.observations, []);
});
