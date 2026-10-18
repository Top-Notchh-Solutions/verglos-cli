import assert from "node:assert/strict";
import { test } from "node:test";
import { readJsonResponse } from "./http-response.js";

test("bounded response reader parses valid JSON", async () => {
  assert.deepEqual(await readJsonResponse(new Response('{"ok":true}', { headers: { "content-type": "application/json" } })), { ok: true });
});

test("bounded response reader rejects malformed and oversized payloads", async () => {
  assert.equal(await readJsonResponse(new Response("not-json")), null);
  const oversized = new Response("x".repeat(1_048_577));
  assert.equal(await readJsonResponse(oversized), null);
  const declaredOversized = new Response("{}", { headers: { "content-length": "99999999" } });
  assert.equal(await readJsonResponse(declaredOversized), null);
});

test("bounded response reader cancels a streamed body at the cap", async () => {
  let cancelled = false;
  const response = new Response(new ReadableStream<Uint8Array>({
    pull(controller) { controller.enqueue(new Uint8Array(1_048_577)); },
    cancel() { cancelled = true; },
  }));
  assert.equal(await readJsonResponse(response), null);
  assert.equal(cancelled, true);
});
