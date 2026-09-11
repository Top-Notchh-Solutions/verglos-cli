import assert from "node:assert/strict";
import { mkdtemp, truncate, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { resolvePackageTarget, PackageResolutionError } from "./package-resolver.js";

const context = (cwd: string) => ({ cwd, allowNetwork: false, executeProjectCode: false as const });

test("package resolver reads metadata without executing package code", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-package-"));
  await writeFile(join(root, "package.json"), JSON.stringify({ name: "fixture-package", version: "1.2.3", scripts: { prepare: "echo must-not-run" } }));
  const result = await resolvePackageTarget({ kind: "package", value: root }, context(root));
  assert.equal((result.subject as { kind: string }).kind, "package");
  assert.equal(result.coverage, "incomplete");
  assert.match(result.limitations[0] ?? "", /lockfile/);
});

test("package resolver reports missing or malformed metadata", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-package-"));
  await assert.rejects(() => resolvePackageTarget({ kind: "package", value: root }, context(root)), (error: unknown) => error instanceof PackageResolutionError && error.code === "MISSING_METADATA");
  await writeFile(join(root, "package.json"), "not-json");
  await assert.rejects(() => resolvePackageTarget({ kind: "package", value: root }, context(root)), (error: unknown) => error instanceof PackageResolutionError && error.code === "INVALID_METADATA");
});

test("package resolver rejects oversized package metadata before parsing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-package-large-"));
  await writeFile(join(root, "package.json"), "{}");
  await truncate(join(root, "package.json"), 1 * 1024 * 1024 + 1);
  await assert.rejects(() => resolvePackageTarget({ kind: "package", value: root }, context(root)), (error: unknown) => error instanceof PackageResolutionError && error.code === "INVALID_METADATA");
});
