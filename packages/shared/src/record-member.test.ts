import assert from "node:assert/strict";
import { test } from "node:test";
import { describeRecordMember } from "./record-store.js";

test("record member descriptor binds bytes and manifest metadata", () => { const member = describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes: new TextEncoder().encode("{}"), required: true }); assert.equal(member.size, 2); assert.equal(member.digest.algorithm, "sha256"); assert.throws(() => describeRecordMember({ path: "../escape", kind: "metadata", mediaType: "application/json", bytes: new Uint8Array(), required: false })); });
