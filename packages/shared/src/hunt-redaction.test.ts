import assert from "node:assert/strict";
import { test } from "node:test";
import { redactHuntOutput } from "./hunt-redaction.js";

test("Hunt output redaction removes credential-shaped values and caps output", () => { const output = redactHuntOutput("token=super-secret-value sk_live_1234567890123456", "ok", 20); assert.equal(output.stderr, "ok"); assert.equal(output.truncated, true); assert.doesNotMatch(output.stdout, /super-secret|sk_live/); });
