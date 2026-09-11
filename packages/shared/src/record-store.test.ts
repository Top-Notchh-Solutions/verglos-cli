import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { putRecordMember, putRecordMemberFromFile, putRecordMembers, readRecordMember } from "./record-store.js";

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

test("record store rejects a symlinked store root", async () => {
  const parent = await mkdtemp(join(tmpdir(), "verglos-record-root-"));
  const target = await mkdtemp(join(tmpdir(), "verglos-record-target-"));
  try {
    const link = join(parent, "store");
    await symlink(target, link);
    await assert.rejects(() => putRecordMember(link, "report.json", new Uint8Array()), /regular directory/);
    await assert.rejects(() => readRecordMember(link, "sha256:" + "a".repeat(64)), /regular directory/);
  } finally { await rm(parent, { recursive: true, force: true }); await rm(target, { recursive: true, force: true }); }
});

test("record store batch publishing rejects duplicate paths and enforces count bounds", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-batch-"));
  try {
    const bytes = new TextEncoder().encode("{}");
    await assert.rejects(() => putRecordMembers(root, [{ path: "a.json", bytes }, { path: "a.json", bytes }]), /path is duplicated/);
    await assert.rejects(() => putRecordMembers(root, [{ path: "a.json", bytes }], 0), /count limit is invalid/);
    const result = await putRecordMembers(root, [{ path: "b.json", bytes }, { path: "a.json", bytes }]);
    assert.deepEqual(result.map((entry) => entry.path), ["a.json", "b.json"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record store streams regular files into the content-addressed layout", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-stream-"));
  try {
    const source = join(root, "source.bin");
    await writeFile(source, Buffer.alloc(128 * 1024, 7));
    const result = await putRecordMemberFromFile(join(root, "store"), "evidence.bin", source);
    assert.equal((await readRecordMember(join(root, "store"), result.digest)).byteLength, 128 * 1024);
    const link = join(root, "link-source"); await symlink(source, link);
    await assert.rejects(() => putRecordMemberFromFile(join(root, "store"), "link.bin", link), /regular file/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
