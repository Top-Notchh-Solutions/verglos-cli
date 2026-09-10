import assert from "node:assert/strict";
import { test } from "node:test";
import { renderLocalViewer } from "./viewer-renderer.js";

test("local viewer renderer escapes dynamic text and emits semantic script-free markup", () => {
  const html = renderLocalViewer({ decision: "INCOMPLETE", subjectId: "<subject>", policy: { id: "policy", version: "1.0.0", digest: "sha256:abc" }, generatedAt: "2026-09-09T00:00:00Z", signerStatus: "unknown", limitations: ["<missing evidence>"], nextAction: "Review & rescan" });
  assert.match(html, /&lt;subject&gt;/); assert.match(html, /<main>/); assert.match(html, /<h1>Release decision<\/h1>/); assert.equal(html.includes("<script"), false); assert.equal(html.includes("http://"), false); assert.equal(html.includes("<missing evidence>"), false);
});
