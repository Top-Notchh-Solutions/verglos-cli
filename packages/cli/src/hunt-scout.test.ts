import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeHuntScout } from "./hunt-scout.js";

test("hunt scout emits a bounded manifest for a local package without running its scripts", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-cli-hunt-scout-"));
  const marker = join(root, "executed.txt");
  const logs: string[] = [];
  const originalLog = console.log;
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({
      name: "cli-scout-fixture",
      version: "1.0.0",
      dependencies: { express: "^5.0.0" },
      scripts: { prepare: `node -e \"require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'executed')\"` },
    }));
    await writeFile(join(root, "package-lock.json"), JSON.stringify({ lockfileVersion: 3 }));
    await writeFile(join(root, "app.js"), `const app = { get() {} }; app.get("/health", () => fetch("https://example.test"));`);
    console.log = (line?: unknown) => logs.push(String(line));
    assert.equal(await executeHuntScout(root, true, true), 0);
    const output = JSON.parse(logs[0]!) as { status: string; targetKind: string; subjectId: string; manifest: Record<string, unknown> };
    assert.equal(output.status, "ok");
    assert.equal(output.targetKind, "package");
    assert.match(output.subjectId, /^urn:verglos:subject:package:sha256:/);
    const manifestText = JSON.stringify(output.manifest);
    assert.equal(manifestText.includes(root), false);
    assert.equal(manifestText.includes("writeFileSync"), false);
    assert.equal((output.manifest.routes as Array<Record<string, string>>)[0]?.path, "/health");
    assert.deepEqual((output.manifest.frameworks as string[]), ["express"]);
    await assert.rejects(readFile(marker));
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});

test("hunt scout rejects control characters before touching a target", async () => {
  const logs: string[] = [];
  const originalLog = console.log;
  try {
    console.log = (line?: unknown) => logs.push(String(line));
    assert.equal(await executeHuntScout("bad\u0000target", true, true), 2);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "error", code: "HUNT_SCOUT_INPUT", message: "hunt scout target is invalid" });
  } finally { console.log = originalLog; }
});
