import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { extractTarArchive } from "./tar-extractor.js";

function tarFile(name: string, content: string): Uint8Array { const header = new Uint8Array(512); new TextEncoder().encode(name).forEach((v, i) => { header[i] = v; }); const size = content.length.toString(8).padStart(11, "0"); new TextEncoder().encode(size).forEach((v, i) => { header[124 + i] = v; }); header[156] = 48; const data = new TextEncoder().encode(content); const out = new Uint8Array(1024); out.set(header); out.set(data, 512); return out; }
test("tar extractor stages and publishes validated files", async () => { const root = await mkdtemp(join(tmpdir(), "verglos-tar-")); const destination = join(root, "out"); await extractTarArchive(tarFile("bin/tool", "ok"), destination); assert.equal((await readFile(join(destination, "bin/tool"))).toString(), "ok"); });
