import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { gzipSync } from "node:zlib";
import { extractTarArchive } from "./tar-extractor.js";

function tarFile(name: string, content: string): Uint8Array { const header = new Uint8Array(512); new TextEncoder().encode(name).forEach((v, i) => { header[i] = v; }); const size = content.length.toString(8).padStart(11, "0"); new TextEncoder().encode(size).forEach((v, i) => { header[124 + i] = v; }); header[156] = 48; const data = new TextEncoder().encode(content); const out = new Uint8Array(1024); out.set(header); out.set(data, 512); return out; }
test("tar extractor stages and publishes validated files", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-tar-")); const destination = join(root, "out"); await extractTarArchive(tarFile("bin/tool", "ok"), destination); assert.equal((await readFile(join(destination, "bin/tool"))).toString(), "ok"); });
test("tar extractor accepts bounded gzip archives", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-tar-")); const destination = join(root, "out"); const { extractTarGzipArchive } = await import("./tar-extractor.js"); await extractTarGzipArchive(gzipSync(tarFile("tool", "ok")), destination); assert.equal((await readFile(join(destination, "tool"))).toString(), "ok"); });

test("tar extraction rejects traversal and preserves an existing destination", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-tar-paths-"));
  try {
    await assert.rejects(() => extractTarArchive(tarFile("../outside", "bad"), join(root, "traversal")), /escapes/u);
    const destination = join(root, "existing");
    await mkdir(destination);
    await writeFile(join(destination, "keep.txt"), "user data", "utf8");
    await assert.rejects(() => extractTarArchive(tarFile("tool", "replacement"), destination));
    assert.equal(await readFile(join(destination, "keep.txt"), "utf8"), "user data");
    assert.deepEqual((await readdir(root)).sort(), ["existing"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("gzip extraction bounds decompression bombs before staging files", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-tar-bomb-"));
  try {
    const { extractTarGzipArchive } = await import("./tar-extractor.js");
    const compressed = gzipSync(Buffer.alloc(2 * 1024 * 1024));
    await assert.rejects(() => extractTarGzipArchive(compressed, join(root, "out"), 1024), /safely decompressed/u);
    assert.deepEqual(await readdir(root), []);
  } finally { await rm(root, { recursive: true, force: true }); }
});
