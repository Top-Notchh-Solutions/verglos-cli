import assert from "node:assert/strict";
import { test } from "node:test";
import { assertPolicyCheckCoverage } from "./policy-boundary.js";
import { createFreePolicyProfile } from "./policy-profiles.js";

test("policy boundary rejects missing configured checks", () => { assert.throws(() => assertPolicyCheckCoverage(createFreePolicyProfile(), []), /missing configured checks/); });
