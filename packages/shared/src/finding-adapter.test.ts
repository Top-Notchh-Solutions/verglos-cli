import assert from "node:assert/strict";
import { test } from "node:test";
import { projectNativeFinding } from "./finding-adapter.js";
test("native finding projection preserves provenance and remediation", () => { const result = projectNativeFinding({ id: "f-1", detector: "secrets", severity: "high", title: "Secret", description: "desc", confidence: 0.8, category: "D4", file: "src/a.ts", line: 2, fix: "rotate", refs: ["CWE-798"] }); assert.equal(result.origin, "native"); assert.equal(result.confidence, 0.8); assert.equal(result.fix, "rotate"); });
