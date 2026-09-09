import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { resolveOciLayout, OciLayoutResolutionError } from "./oci-layout-resolver.js";

test("local OCI layout verifies content-addressed manifest blobs", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-oci-")); const blob = Buffer.from(JSON.stringify({ mediaType: "application/vnd.oci.image.manifest.v1+json", config: {}, layers: [] })); const digest = createHash("sha256").update(blob).digest("hex");
  await mkdir(join(root, "blobs", "sha256"), { recursive: true }); await writeFile(join(root, "oci-layout.json"), JSON.stringify({ imageLayoutVersion: "1.0.0" })); await writeFile(join(root, "blobs", "sha256", digest), blob); await writeFile(join(root, "index.json"), JSON.stringify({ schemaVersion: 2, manifests: [{ mediaType: "application/vnd.oci.image.manifest.v1+json", digest: `sha256:${digest}`, size: blob.length }] }));
  const result = await resolveOciLayout(root); assert.equal(result.kind, "oci-manifest");
});

test("local OCI layout rejects missing blobs", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-oci-")); await mkdir(join(root, "blobs", "sha256"), { recursive: true }); await writeFile(join(root, "oci-layout.json"), "{}"); await writeFile(join(root, "index.json"), JSON.stringify({ manifests: [{ digest: `sha256:${"a".repeat(64)}` }] }));
  await assert.rejects(() => resolveOciLayout(root), (error: unknown) => error instanceof OciLayoutResolutionError && error.code === "MISSING_BLOB");
});
