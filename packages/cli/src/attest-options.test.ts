import assert from "node:assert/strict";
import { test } from "node:test";
import { executeAttest } from "./attest.js";

test("attest rejects malformed options before entitlement lookup", async () => {
  const logs: string[] = [];
  const original = console.log;
  console.log = (value?: unknown) => logs.push(String(value));
  try {
    assert.equal(await executeAttest({ verifyUrl: "http://example.com", json: true }), 2);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "error", code: "ATTEST_INPUT", message: "attest options are invalid" });
  } finally { console.log = original; }
});

test("attest rejects control-character report paths", async () => {
  assert.equal(await executeAttest({ report: "report\u0000.json", quiet: true }), 2);
});

test("legacy attest returns fixed retirement metadata without echoing local paths or URLs", async () => {
  const logs: string[] = [];
  const original = console.log;
  console.log = (value?: unknown) => logs.push(String(value));
  try {
    const code = await executeAttest(
      { report: "/private/customer/project/report.json", verifyUrl: "https://example.com/verify/customer-secret", sign: true, json: true },
      { resolveEntitlement: async () => ({ plan: "studio", stale: false }), warnIfStale: () => {} },
    );
    assert.equal(code, 78);
    assert.deepEqual(JSON.parse(logs[0]!), {
      status: "unavailable",
      code: "LEGACY_ATTEST_RETIRED",
      reason: "legacy_shell",
      canonicalWorkflow: "record create/sign/verify",
      signingPerformed: false,
      publicationPerformed: false,
    });
    assert.doesNotMatch(logs[0]!, /customer|report\.json|example\.com/);
  } finally { console.log = original; }
});
