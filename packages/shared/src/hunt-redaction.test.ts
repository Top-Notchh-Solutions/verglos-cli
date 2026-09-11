import assert from "node:assert/strict";
import { test } from "node:test";
import { HuntOutputLimitError, huntEvidenceDigest, redactHuntOutput, synthesizeHuntInput } from "./hunt-redaction.js";

test("Hunt output redaction removes credential-shaped values and caps output", () => { const output = redactHuntOutput("token=super-secret-value sk_live_1234567890123456 export API_TOKEN=abc123", "ok", 20); assert.equal(output.stderr, "ok"); assert.equal(output.truncated, true); assert.doesNotMatch(output.stdout, /super-secret|sk_live|abc123/); });
test("Hunt output redaction removes JWT and private-key-shaped credentials", () => {
  const output = redactHuntOutput("jwt eyJheader-value.payload-value.signature-value", "-----BEGIN PRIVATE KEY-----secret-----END PRIVATE KEY-----");
  assert.doesNotMatch(output.stdout, /eyJheader|payload-value/);
  assert.doesNotMatch(output.stderr, /PRIVATE KEY|secret/);
});
test("Hunt synthetic input replaces secret-shaped values", () => { const input = synthesizeHuntInput("token=real-value password:another"); assert.equal(input, "token=[synthetic-secret] password=[synthetic-secret]"); });
test("Hunt evidence digest binds redacted output without storing raw content", () => { assert.match(huntEvidenceDigest({ stdout: "safe", stderr: "", truncated: false }), /^sha256:[a-f0-9]{64}$/); });
test("Hunt output redaction rejects unsafe limits and preserves UTF-8 byte bounds", () => {
  assert.throws(() => redactHuntOutput("x", "", 0), HuntOutputLimitError);
  const output = redactHuntOutput("🙂🙂🙂", "", 5);
  assert.ok(Buffer.byteLength(output.stdout, "utf8") <= 5);
  assert.equal(output.truncated, true);
});
