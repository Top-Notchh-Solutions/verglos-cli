import assert from "node:assert/strict";
import { test } from "node:test";
import { redactHuntOutput, synthesizeHuntInput } from "./hunt-redaction.js";

test("Hunt output redaction removes credential-shaped values and caps output", () => { const output = redactHuntOutput("token=super-secret-value sk_live_1234567890123456 export API_TOKEN=abc123", "ok", 20); assert.equal(output.stderr, "ok"); assert.equal(output.truncated, true); assert.doesNotMatch(output.stdout, /super-secret|sk_live|abc123/); });
test("Hunt synthetic input replaces secret-shaped values", () => { const input = synthesizeHuntInput("token=real-value password:another"); assert.equal(input, "token=[synthetic-secret] password=[synthetic-secret]"); });
