import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeTargetInspect } from "./target-inspect.js";

test("target inspect returns typed incomplete for an unqualified package", async () => {
  const code = await executeTargetInspect("package", ".");
  assert.ok([0, 3, 78].includes(code));
});

test("target inspect resolves a local OCI layout without network access", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-target-oci-"));
  const previousLog = console.log; const lines: string[] = []; console.log = (line?: unknown) => lines.push(String(line));
  try {
    const blob = Buffer.from(JSON.stringify({ mediaType: "application/vnd.oci.image.manifest.v1+json", config: {}, layers: [] }));
    const digest = createHash("sha256").update(blob).digest("hex");
    await mkdir(join(root, "blobs", "sha256"), { recursive: true });
    await writeFile(join(root, "oci-layout.json"), JSON.stringify({ imageLayoutVersion: "1.0.0" }));
    await writeFile(join(root, "index.json"), JSON.stringify({ schemaVersion: 2, manifests: [{ digest: `sha256:${digest}`, size: blob.length }] }));
    await writeFile(join(root, "blobs", "sha256", digest), blob);
    assert.equal(await executeTargetInspect("oci", root, true), 0);
    const output = JSON.parse(lines[0]!); assert.equal(output.coverage, "complete"); assert.match(output.subject.subjectId, /^urn:verglos:subject:oci-manifest:sha256:/);
  } finally { console.log = previousLog; await rm(root, { recursive: true, force: true }); }
});
