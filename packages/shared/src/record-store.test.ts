import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { putRecordMember, readRecordMember } from "./record-store.js";

test("record store publishes content-addressed members and rejects traversal", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-record-")); try { const member = await putRecordMember(root, "report.json", new TextEncoder().encode("{}")); assert.equal(Buffer.from(await readRecordMember(root, member.digest)).toString(), "{}"); await assert.rejects(() => putRecordMember(root, "../escape", new Uint8Array())); } finally { await rm(root, { recursive: true, force: true }); } });

test("record store rejects symlinked members before reading", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-link-"));
  try {
    const digest = "sha256:" + "a".repeat(64);
    await writeFile(join(root, "target"), "{}");
    await symlink(join(root, "target"), join(root, digest.replace(":", "-")));
    await assert.rejects(() => readRecordMember(root, digest), /bounded regular file/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
