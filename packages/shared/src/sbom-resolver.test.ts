import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { resolveSbomTarget, SbomResolutionError } from "./sbom-resolver.js";

const context = (cwd: string) => ({ cwd, allowNetwork: false, executeProjectCode: false as const });

test("SBOM resolver identifies CycloneDX and binds exact bytes", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-sbom-"));
  await writeFile(join(root, "bom.json"), JSON.stringify({ bomFormat: "CycloneDX", specVersion: "1.5", serialNumber: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", components: [] }));
  const result = await resolveSbomTarget({ kind: "sbom", value: join(root, "bom.json") }, context(root));
  assert.equal((result.subject as { format: string }).format, "cyclonedx-json");
  assert.equal(result.coverage, "complete");
});

test("SBOM resolver rejects unknown formats", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-sbom-"));
  await writeFile(join(root, "bom.json"), JSON.stringify({ components: [] }));
  await assert.rejects(() => resolveSbomTarget({ kind: "sbom", value: join(root, "bom.json") }, context(root)), (error: unknown) => error instanceof SbomResolutionError && error.code === "UNSUPPORTED_FORMAT");
});
