import assert from "node:assert/strict";
import { test } from "node:test";
import { fingerprintV1 } from "./fingerprint-v1.js";
const base = { subjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64), location: "src/a.ts:4", package: "pkg:npm/a@1", advisory: "CVE-1", rule: "D1-001", evidenceClass: "native" as const };
test("fingerprint v1 is stable and excludes presentation ordering", () => { assert.equal(fingerprintV1(base), fingerprintV1({ ...base })); assert.match(fingerprintV1(base), /^sha256:[a-f0-9]{64}$/); });
test("fingerprint v1 changes for identity boundaries", () => { assert.notEqual(fingerprintV1(base), fingerprintV1({ ...base, location: "src/b.ts:4" })); assert.notEqual(fingerprintV1(base), fingerprintV1({ ...base, evidenceClass: "imported" })); });
