import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeRecordCreate } from "./record-create.js";
import { assembleReleaseRecord, describeRecordMember } from "@verglos/shared";

test("record create materializes verified members and a canonical manifest", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-"));
  try {
    const source = join(root, "source");
    const output = join(root, "output");
    await mkdir(source);
    const bytes = new TextEncoder().encode("decision");
    await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json");
    await writeFile(manifestPath, JSON.stringify(manifest));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 0);
    assert.deepEqual(JSON.parse(await readFile(join(output, "manifest.json"), "utf8")).members[0].path, "decision.json");
  } finally { await rm(root, { recursive: true, force: true }); }
});

