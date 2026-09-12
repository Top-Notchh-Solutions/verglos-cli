import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { executeRecordProject } from "./record-project.js";
import { runCliFixture } from "./cli-fixture.js";

test("record project fails closed before parsing a missing manifest", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-project-"));
  try {
    const lines: string[] = [];
    const previous = console.log;
    console.log = (line?: unknown) => lines.push(String(line));
    try { assert.equal(await executeRecordProject(root, join(root, "missing.json"), true, true), 78); } finally { console.log = previous; }
    assert.equal(JSON.parse(lines[0]!).code, "RECORD_PROJECT_INPUT");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record project rejects non-JSON manifest input", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-project-invalid-"));
  try {
    const manifest = join(root, "manifest.json"); await writeFile(manifest, "not-json");
    assert.equal(await executeRecordProject(root, manifest, true, true), 78);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record project JSON error is process-safe", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-project-process-"));
  try {
    const manifest = join(root, "manifest.json"); await writeFile(manifest, "not-json");
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "record", "project", join(root, "store"), manifest, "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 78);
    assert.equal(result.stderr, "");
    assert.equal(JSON.parse(result.stdout).code, "RECORD_PROJECT_INPUT");
    assert.deepEqual(result.files, []);
  } finally { await rm(root, { recursive: true, force: true }); }
});
