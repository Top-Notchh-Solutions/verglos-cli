import assert from "node:assert/strict";
import { test } from "node:test";
import { renderLocalViewer } from "./viewer-renderer.js";

test("local viewer renderer escapes dynamic text and emits semantic script-free markup", () => {
  const html = renderLocalViewer({ decision: "INCOMPLETE", subjectId: "<subject>", policy: { id: "policy", version: "1.0.0", digest: "sha256:abc" }, generatedAt: "2026-09-09T00:00:00Z", signerStatus: "unknown", limitations: ["<missing evidence>"], nextAction: "Review & rescan" });
  assert.match(html, /&lt;subject&gt;/); assert.match(html, /<main>/); assert.match(html, /<h1>Release decision<\/h1>/); assert.equal(html.includes("<script"), false); assert.equal(html.includes("http://"), false); assert.equal(html.includes("<missing evidence>"), false);
});

test("local viewer shows all subject digests and does not claim unproven coverage", () => {
  const html = renderLocalViewer({ decision: "INCOMPLETE", subjectId: "urn:verglos:subject:filesystem:sha256:abc", subjects: [{ subjectId: "urn:verglos:subject:filesystem:sha256:abc", role: "primary", identityDigest: "sha256:abc", memberDigest: "sha256:def", contentDigests: [{ purpose: "filesystem-tree", digest: "sha256:ghi" }] }], policy: { id: "policy", version: "1.0.0", digest: "sha256:abc" }, generatedAt: "2026-09-09T00:00:00Z", signerStatus: "unknown", coverageStatus: "incomplete", lineage: { status: "recorded", edgeCount: 1, matched: 0, mismatched: 1, unavailable: 0, unverifiable: 0, gapCount: 1 }, limitations: ["missing evidence"], nextAction: "review" });
  assert.match(html, /Coverage: incomplete/); assert.match(html, /filesystem-tree: <code>sha256:ghi/); assert.match(html, /Verified record member: <code>sha256:def/); assert.match(html, /Edges: 1 \(matched 0, mismatched 1, unavailable 0, unverifiable 0\)/);
});
