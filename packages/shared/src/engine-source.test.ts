import assert from "node:assert/strict";
import { test } from "node:test";
import { selectEngineSource } from "./engine-source.js";

test("engine source selection prefers cache and permits explicit HTTPS mirrors", () => { assert.deepEqual(selectEngineSource({ cachedPath: "/cache/trivy", mirrorUrl: "https://mirror.example/engines" }), { kind: "cache", location: "/cache/trivy" }); assert.deepEqual(selectEngineSource({ mirrorUrl: "https://mirror.example/engines" }), { kind: "mirror", location: "https://mirror.example/engines" }); });
test("engine source selection fails closed offline or for unsafe mirrors", () => { assert.deepEqual(selectEngineSource({ offline: true }), { kind: "unavailable", reason: "offline" }); assert.deepEqual(selectEngineSource({ mirrorUrl: "http://mirror.example" }), { kind: "unavailable", reason: "no-source" }); });
