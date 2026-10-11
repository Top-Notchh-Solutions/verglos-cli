import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { ArchiveExtractionError, downloadArchive, extractArchiveMembers, verifyArchiveDigest } from "./archive-extractor.js";

test("safe extraction writes declared bounded payloads and cleans partial output", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-archive-"));
  try {
    await extractArchiveMembers(join(root, "out"), [{ path: "bin/tool", kind: "file", size: 3, data: new TextEncoder().encode("ok\n") }]);
    assert.equal(await readFile(join(root, "out/bin/tool"), "utf8"), "ok\n");
    const missing = join(root, "missing");
    await assert.rejects(() => extractArchiveMembers(missing, [{ path: "bin/tool", kind: "file", size: 3 }]), (error: unknown) => error instanceof ArchiveExtractionError && error.code === "MISSING_DATA");
    await assert.rejects(() => readdir(missing));
    const partial = join(root, "partial");
    await assert.rejects(() => extractArchiveMembers(partial, [
      { path: "parent", kind: "file", size: 1, data: new Uint8Array([1]) },
      { path: "parent/child", kind: "file", size: 1, data: new Uint8Array([2]) },
    ]), (error: unknown) => error instanceof ArchiveExtractionError && error.code === "WRITE_FAILED");
    await assert.rejects(() => readdir(partial));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("safe extraction rejects links and duplicate paths", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-archive-"));
  await assert.rejects(() => extractArchiveMembers(join(root, "out"), [{ path: "link", kind: "symlink", size: 0, linkTarget: "tool" }]), /links/);
  await assert.rejects(() => extractArchiveMembers(join(root, "out"), [{ path: "x", kind: "file", size: 1, data: new Uint8Array([1]) }, { path: "x", kind: "file", size: 1, data: new Uint8Array([1]) }]), /duplicate/);
});

test("archive download enforces declared and streamed size limits", async () => {
  const response = (body: Uint8Array, length = body.byteLength) => new Response(body, { status: 200, headers: { "content-length": String(length) } });
  const bytes = await downloadArchive("https://mirror.invalid/tool.tar", { fetchImpl: async () => response(new Uint8Array([1, 2, 3])) });
  assert.deepEqual([...bytes], [1, 2, 3]);
  await assert.rejects(() => downloadArchive("https://mirror.invalid/tool.tar", { maxBytes: 2, fetchImpl: async () => response(new Uint8Array([1, 2, 3])) }), /size limit/);
  await assert.rejects(() => downloadArchive("https://mirror.invalid/tool.tar", { maxBytes: 0, fetchImpl: async () => response(new Uint8Array()) }), /positive safe integer/);
  await assert.rejects(() => downloadArchive("http://mirror.invalid/tool.tar"), /HTTPS URL/);
});

test("safe extraction never deletes an existing output and rejects payload-size bombs before writes", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-archive-preserve-"));
  try {
    const existing = join(root, "existing");
    await mkdir(existing);
    await writeFile(join(existing, "user-data.txt"), "preserve me", "utf8");
    await assert.rejects(() => extractArchiveMembers(existing, [{ path: "replacement.txt", kind: "file", size: 1, data: new Uint8Array([0]) }]));
    assert.equal(await readFile(join(existing, "user-data.txt"), "utf8"), "preserve me");
    assert.deepEqual(await readdir(existing), ["user-data.txt"]);

    const mismatch = join(root, "mismatch");
    await assert.rejects(() => extractArchiveMembers(mismatch, [{ path: "bomb", kind: "file", size: 1, data: new Uint8Array(1024 * 1024) }], { maxBytes: 1 }), /payload size does not match/u);
    await assert.rejects(() => readdir(mismatch));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("archive digest verification is pinned and fail-closed", () => {
  const bytes = new TextEncoder().encode("archive");
  verifyArchiveDigest(bytes, "0eb3e36bfb24dcd9bb1d1bece1531216b59539a8fde17ee80224af0653c92aa3");
  assert.throws(() => verifyArchiveDigest(bytes, "0".repeat(64)), /checksum/);
  assert.throws(() => verifyArchiveDigest(bytes, "not-a-digest"), /SHA-256/);
});
