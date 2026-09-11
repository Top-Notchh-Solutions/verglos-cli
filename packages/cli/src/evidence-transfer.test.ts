import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { inspectEvidence, transferEvidence } from "./evidence-transfer.js";

const document = { bomFormat: "CycloneDX", specVersion: "1.5", serialNumber: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", components: [], dependencies: [] };

test("evidence transfer reports bounded metadata and refuses overwrite", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-evidence-transfer-"));
  try {
    const input = join(root, "input.json");
    const output = join(root, "output.json");
    await writeFile(input, JSON.stringify(document), "utf8");
    const inspected = await inspectEvidence(input);
    assert.equal(inspected.format, "cyclonedx");
    assert.equal(inspected.version, "1.5");
    const transferred = await transferEvidence(input, output);
    assert.equal(transferred.format, "cyclonedx");
    assert.equal(JSON.parse(await readFile(output, "utf8")).bomFormat, "CycloneDX");
    await assert.rejects(() => transferEvidence(input, output), /already exists/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("evidence transfer rejects symlinks and oversized files before parsing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-evidence-boundary-"));
  try {
    const target = join(root, "input.json");
    const link = join(root, "input-link.json");
    await writeFile(target, JSON.stringify(document), "utf8");
    await symlink(target, link);
    await assert.rejects(() => inspectEvidence(link), /regular file/);
    const oversized = join(root, "oversized.json");
    await writeFile(oversized, Buffer.alloc(8 * 1024 * 1024 + 1));
    await assert.rejects(() => inspectEvidence(oversized), /8 MiB limit/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
