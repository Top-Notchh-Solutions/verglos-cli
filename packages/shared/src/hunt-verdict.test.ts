import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyHuntOutcome } from "./hunt-verdict.js";

test("Hunt verdict classifier preserves infrastructure and policy outcomes", () => {
  assert.equal(classifyHuntOutcome({ policyAllowed: false, supported: true }), "policy-denied");
  assert.equal(classifyHuntOutcome({ policyAllowed: true, supported: false }), "not-supported");
  assert.equal(classifyHuntOutcome({ policyAllowed: true, supported: true, environmentError: true }), "environment-error");
  assert.equal(classifyHuntOutcome({ policyAllowed: true, supported: true, assertionMatched: false }), "not-reproduced");
  assert.equal(classifyHuntOutcome({ policyAllowed: true, supported: true, assertionMatched: true }), "confirmed");
  assert.equal(classifyHuntOutcome({ policyAllowed: true, supported: true }), "inconclusive");
  assert.equal(classifyHuntOutcome({ policyAllowed: true, supported: true, timedOut: true, assertionMatched: true }), "inconclusive");
  assert.equal(classifyHuntOutcome({ policyAllowed: true, supported: true, environmentError: true, timedOut: true }), "environment-error");
  assert.equal(classifyHuntOutcome({ policyAllowed: false, supported: true, environmentError: true }), "policy-denied");
});

test("Hunt verdict precedence is exhaustive and infrastructure failure never becomes not-reproduced", () => {
  const assertions = [undefined, false, true] as const;
  const booleans = [false, true] as const;
  let cases = 0;
  for (const assertionMatched of assertions) {
    for (const supported of booleans) {
      for (const policyAllowed of booleans) {
        for (const environmentError of booleans) {
          for (const timedOut of booleans) {
            cases += 1;
            const actual = classifyHuntOutcome({ assertionMatched, supported, policyAllowed, environmentError, timedOut });
            const expected = !policyAllowed
              ? "policy-denied"
              : !supported
                ? "not-supported"
                : environmentError
                  ? "environment-error"
                  : timedOut
                    ? "inconclusive"
                    : assertionMatched === true
                      ? "confirmed"
                      : assertionMatched === false
                        ? "not-reproduced"
                        : "inconclusive";
            assert.equal(actual, expected);
            if (environmentError && policyAllowed && supported) assert.notEqual(actual, "not-reproduced");
          }
        }
      }
    }
  }
  assert.equal(cases, 48);
});
