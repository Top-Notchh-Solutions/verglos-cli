import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "node:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPackageLicenseTexts } from "./package-license-text.mjs";

const run = promisify(execFile);

test("third-party notices are deterministic and contain provenance disclaimers", async () => {
  const first = (await run("node", ["scripts/generate-third-party-notices.mjs"], { maxBuffer: 16 * 1024 * 1024 })).stdout;
  const second = (await run("node", ["scripts/generate-third-party-notices.mjs"], { maxBuffer: 16 * 1024 * 1024 })).stdout;
  assert.equal(first, second);
  assert.match(first, /^THIRD-PARTY NOTICES\n/);
  assert.match(first, /preserves upstream identity/);
  assert.match(first, /License:/);
  assert.doesNotMatch(first, /node_modules[\\/]/);
});

test("license text collection retains separate LICENSE and NOTICE files", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-package-license-"));
  try {
    await writeFile(join(root, "LICENSE"), "permission text\n");
    await writeFile(join(root, "NOTICE"), "attribution text\n");
    assert.deepEqual(await readPackageLicenseTexts(root), [
      { kind: "License", file: "LICENSE", text: "permission text" },
      { kind: "Notice", file: "NOTICE", text: "attribution text" },
    ]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("license text collection retains notices across installed versions and deduplicates identical license text", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-package-license-versions-"));
  const first = join(root, "first");
  const second = join(root, "second");
  try {
    await mkdir(first);
    await mkdir(second);
    await writeFile(join(first, "LICENSE"), "shared permission text\n");
    await writeFile(join(second, "LICENSE"), "shared permission text\n");
    await writeFile(join(first, "NOTICE"), "first attribution\n");
    await writeFile(join(second, "NOTICE"), "second attribution\n");
    assert.deepEqual(await readPackageLicenseTexts([second, first]), [
      { kind: "License", file: "LICENSE", text: "shared permission text" },
      { kind: "Notice", file: "NOTICE", text: "first attribution" },
      { kind: "Notice", file: "NOTICE", text: "second attribution" },
    ]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("license text collection refuses non-files and files above the size bound", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-package-license-bounds-"));
  const nonFile = join(root, "non-file");
  const oversized = join(root, "oversized");
  try {
    await mkdir(nonFile);
    await mkdir(oversized);
    await mkdir(join(nonFile, "LICENSE"));
    await writeFile(join(oversized, "LICENSE"), Buffer.alloc(512 * 1024 + 1));
    assert.deepEqual(await readPackageLicenseTexts([nonFile, oversized]), [
      { kind: "License", file: "LICENSE", text: "[not included: License source exceeds 512 KiB; review required]" },
      { kind: "License", file: "LICENSE", text: "[not included: License source is not a regular file; review required]" },
    ]);
  } finally { await rm(root, { recursive: true, force: true }); }
});
