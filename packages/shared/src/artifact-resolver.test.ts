import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { resolveArtifactTarget, ArtifactResolutionError } from "./artifact-resolver.js";

const context = (cwd: string) => ({ cwd, allowNetwork: false, executeProjectCode: false as const });

test("artifact resolver hashes files and directories deterministically", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-artifact-"));
  await mkdir(join(root, "bundle")); await writeFile(join(root, "bundle", "a.json"), "{}\n");
  const first = await resolveArtifactTarget({ kind: "artifact", value: join(root, "bundle") }, context(root));
  const second = await resolveArtifactTarget({ kind: "artifact", value: join(root, "bundle") }, context(root));
  assert.deepEqual(first.subject, second.subject);
  assert.equal((first.subject as { mediaType: string }).mediaType, "application/x-directory");
});

test("artifact resolver rejects missing and special targets", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-artifact-"));
  await assert.rejects(() => resolveArtifactTarget({ kind: "artifact", value: join(root, "missing") }, context(root)), (error: unknown) => error instanceof ArtifactResolutionError && error.code === "MISSING_PATH");
});
