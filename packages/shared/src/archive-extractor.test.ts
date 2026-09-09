import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { ArchiveExtractionError, downloadArchive, extractArchiveMembers } from "./archive-extractor.js";

test("safe extraction writes bounded payloads and removes partial output", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-archive-"));
  await extractArchiveMembers(join(root, "out"), [{ path: "bin/tool", kind: "file", size: 3, data: new TextEncoder().encode("ok\n") }]);
  assert.equal(await readFile(join(root, "out/bin/tool"), "utf8"), "ok\n");
  await assert.rejects(() => extractArchiveMembers(join(root, "bad"), [{ path: "bin/tool", kind: "file", size: 3 }]), (error: unknown) => error instanceof ArchiveExtractionError && error.code === "MISSING_DATA");
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
});
