import assert from "node:assert/strict";
import { test } from "node:test";
import { selectEngineSource, selectVerifiedEngineSource } from "./engine-source.js";

test("engine source selection prefers cache and permits explicit HTTPS mirrors", () => { assert.deepEqual(selectEngineSource({ cachedPath: "/cache/trivy", mirrorUrl: "https://mirror.example/engines" }), { kind: "cache", location: "/cache/trivy" }); assert.deepEqual(selectEngineSource({ mirrorUrl: "https://mirror.example/engines" }), { kind: "mirror", location: "https://mirror.example/engines" }); });
test("engine source selection fails closed offline or for unsafe mirrors", () => { assert.deepEqual(selectEngineSource({ offline: true }), { kind: "unavailable", reason: "offline" }); assert.deepEqual(selectEngineSource({ mirrorUrl: "http://mirror.example" }), { kind: "unavailable", reason: "no-source" }); });

test("verified source mode requires signed fresh cache or allowlisted mirror metadata", () => {
  const metadata = { manifestDigest: `sha256:${"a".repeat(64)}` as const, databaseDigest: `sha256:${"b".repeat(64)}` as const, checkedAt: "2026-09-09T00:00:00.000Z", signatureVerified: true };
  assert.deepEqual(selectVerifiedEngineSource({ cachedPath: "/cache/trivy", allowedOrigins: [], metadata, now: new Date("2026-09-09T01:00:00.000Z") }), { kind: "cache", location: "/cache/trivy" });
  assert.deepEqual(selectVerifiedEngineSource({ mirrorUrl: "https://mirror.example/engines", allowedOrigins: ["https://mirror.example"], metadata, now: new Date("2026-09-09T01:00:00.000Z") }), { kind: "mirror", location: "https://mirror.example/engines" });
  assert.deepEqual(selectVerifiedEngineSource({ mirrorUrl: "https://evil.example/engines", allowedOrigins: ["https://mirror.example"], metadata, now: new Date("2026-09-09T01:00:00.000Z") }), { kind: "unavailable", reason: "untrusted" });
  assert.deepEqual(selectVerifiedEngineSource({ cachedPath: "/cache/trivy", allowedOrigins: [], metadata: { ...metadata, signatureVerified: false }, now: new Date("2026-09-09T01:00:00.000Z") }), { kind: "unavailable", reason: "untrusted" });
  assert.deepEqual(selectVerifiedEngineSource({ cachedPath: "/cache/trivy", allowedOrigins: [], metadata, now: new Date("2026-09-11T00:00:00.000Z") }), { kind: "unavailable", reason: "stale" });
});
