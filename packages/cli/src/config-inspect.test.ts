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
    const source = JSON.stringify({ schemaVersion: "1.0.0", plan: "pro", hunt: { sandbox: "docker" } });
    await writeFile(path, source);
    assert.equal(await executeConfigInspect(path, true, true), 0);
    assert.equal(await (await import("node:fs/promises")).readFile(path, "utf8"), source);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("config inspect fails closed on obsolete sandbox defaults with migration guidance", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-config-inspect-obsolete-"));
  try {
    const path = join(root, "config.json");
    await writeFile(path, JSON.stringify({ schemaVersion: "1.0.0", hunt: { sandbox: "firecracker" } }));
    assert.equal(await executeConfigInspect(path, true, true), 78);
    assert.equal(await (await import("node:fs/promises")).readFile(path, "utf8"), JSON.stringify({ schemaVersion: "1.0.0", hunt: { sandbox: "firecracker" } }));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("config inspect warns on legacy JavaScript without evaluating or modifying it", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-config-inspect-js-"));
  const path = join(root, ".verglos.config.js");
  const source = "throw new Error('must not execute'); module.exports = { failThreshold: 1 };";
  const logs: string[] = [];
  const original = console.log;
  console.log = (message?: unknown) => { logs.push(String(message)); };
  try {
    await writeFile(path, source);
    assert.equal(await executeConfigInspect(path, true, false), 0);
    const result = JSON.parse(logs[0]!);
    assert.equal(result.status, "legacy");
    assert.match(result.warnings[0].message, /not evaluated/);
    assert.doesNotMatch(logs[0]!, /must not execute|failThreshold/);
    assert.equal(await (await import("node:fs/promises")).readFile(path, "utf8"), source);
  } finally {
    console.log = original;
    await rm(root, { recursive: true, force: true });
  }
});

test("config inspect rejects malformed JSON and oversized files", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-config-inspect-invalid-"));
  try {
    const path = join(root, "config.json"); await writeFile(path, "not-json");
    assert.equal(await executeConfigInspect(path, true, true), 78);
  } finally { await rm(root, { recursive: true, force: true }); }
});
