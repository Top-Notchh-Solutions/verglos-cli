import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeConfigInspect } from "./config-inspect.js";

test("config inspect reports migration warnings without mutating input", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-config-inspect-"));
  try {
    const path = join(root, "config.json");
    const source = JSON.stringify({ plan: "pro", hunt: { sandbox: "firecracker" } });
    await writeFile(path, source);
    assert.equal(await executeConfigInspect(path, true, true), 0);
    assert.equal(await (await import("node:fs/promises")).readFile(path, "utf8"), source);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("config inspect rejects malformed JSON and oversized files", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-config-inspect-invalid-"));
  try {
    const path = join(root, "config.json"); await writeFile(path, "not-json");
    assert.equal(await executeConfigInspect(path, true, true), 78);
  } finally { await rm(root, { recursive: true, force: true }); }
});
