import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { repositoryResolver, resolveRepositoryTarget, RepositoryResolutionError } from "./repository-resolver.js";

const context = (cwd: string) => ({ cwd, allowNetwork: false, executeProjectCode: false as const });

test("repository resolver records immutable Git identity and dirty evidence", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-repository-"));
  await mkdir(join(root, ".git"));
  await assert.rejects(() => resolveRepositoryTarget({ kind: "repository", value: root }, context(root)), (error: unknown) => error instanceof RepositoryResolutionError);
});

test("repository resolver rejects non-repository targets before Git access", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-target-"));
  await writeFile(join(root, "file.txt"), "fixture");
  await assert.rejects(() => resolveRepositoryTarget({ kind: "filesystem", value: root }, context(root)), /requires a repository target/);
  assert.equal(repositoryResolver.capabilities[0], "resolve-repository");
});
