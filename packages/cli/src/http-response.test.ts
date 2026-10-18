import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchJsonResponse, readJsonResponse } from "./http-response.js";

function abortError(): Error {
  const error = new Error("response body timed out");
  error.name = "AbortError";
  return error;
}

function responseThatWaitsForAbort(signal: AbortSignal): Response {
  return new Response(new ReadableStream<Uint8Array>({
    pull() {
      return new Promise<void>((_resolve, reject) => {
        if (signal.aborted) {
          reject(abortError());
          return;
        }
        signal.addEventListener("abort", () => reject(abortError()), { once: true });
      });
    },
  }), { status: 200 });
}

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

test("fetch JSON keeps its deadline active after headers arrive", async () => {
  const started = Date.now();
  await assert.rejects(
    fetchJsonResponse("https://example.test/slow", { method: "GET" }, {
      timeoutMs: 10,
      fetchImpl: async (_input, init) => responseThatWaitsForAbort(init?.signal as AbortSignal),
    }),
  );
  assert.ok(Date.now() - started < 250, "body timeout must remain bounded");
});
