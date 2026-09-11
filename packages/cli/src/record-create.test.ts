import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
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

test("record create rejects a symlinked output root", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-link-"));
  try {
    const source = join(root, "source");
    const output = join(root, "output");
    const target = join(root, "target");
    await mkdir(source); await mkdir(target);
    const bytes = new TextEncoder().encode("decision");
    await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json");
    await writeFile(manifestPath, JSON.stringify(manifest));
    await symlink(target, output);
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 78);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create prevalidates all members before publishing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-preflight-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const bytes = new TextEncoder().encode("decision"); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify({ ...manifest, members: [{ ...member, size: member.size + 1 }] }));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 78);
    await assert.rejects(() => readdir(output));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create rejects an existing manifest before publishing new blobs", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-existing-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source); await mkdir(output);
    const bytes = new TextEncoder().encode("decision"); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(manifest));
    await writeFile(join(output, "manifest.json"), "existing\n");
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 78);
    assert.deepEqual(await readdir(output), ["manifest.json"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create complete mode enforces the graph gate", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-complete-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const bytes = new TextEncoder().encode("decision"); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(manifest));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true, true), 78);
    await assert.rejects(() => readdir(output));
  } finally { await rm(root, { recursive: true, force: true }); }
});
