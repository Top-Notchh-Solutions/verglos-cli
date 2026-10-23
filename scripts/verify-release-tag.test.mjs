import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parseReleaseTag, verifyReleaseCommitBinding, verifyReleaseTag } from "./verify-release-tag.mjs";

const packageDirs = ["shared", "scanner", "reporter", "mcp", "entitlement", "hunt", "cli"];

async function fixture(version = "2.0.0-alpha.1") {
  const root = await mkdtemp(join(tmpdir(), "verglos-release-tag-"));
  for (const name of packageDirs) {
    const directory = join(root, "packages", name);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, "package.json"), JSON.stringify({ name: `@verglos/${name}`, version }), "utf8");
  }
  return root;
}

test("release tag parser accepts exact stable and prerelease tags", () => {
  assert.equal(parseReleaseTag("v2.0.0"), "2.0.0");
  assert.equal(parseReleaseTag("v2.0.0-alpha.1"), "2.0.0-alpha.1");
  for (const value of ["2.0.0", "release-v2.0.0", "v2", "v2.0.0+build"]) assert.throws(() => parseReleaseTag(value), /exact/u);
});

test("release verification requires every public package to match the immutable tag", async () => {
  const root = await fixture();
  try {
    const result = await verifyReleaseTag(root, "v2.0.0-alpha.1");
    assert.equal(result.packages.length, 7);
    await writeFile(join(root, "packages", "cli", "package.json"), JSON.stringify({ name: "verglos", version: "2.0.0-alpha.2" }), "utf8");
    await assert.rejects(() => verifyReleaseTag(root, "v2.0.0-alpha.1"), /packages\/cli=2\.0\.0-alpha\.2/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("release verification binds the dispatched commit to the resolved tag commit", () => {
  const sha = "a".repeat(40);
  assert.deepEqual(verifyReleaseCommitBinding(sha.toUpperCase(), sha), { sourceCommit: sha, resolvedTagCommit: sha });
  assert.throws(() => verifyReleaseCommitBinding(sha, "b".repeat(40)), /resolves to/u);
  assert.throws(() => verifyReleaseCommitBinding("not-a-sha", sha), /40-character hexadecimal/u);
});

test("release verification binds package manifests to bounded regular-file reads", async () => {
  const source = await readFile("scripts/verify-release-tag.mjs", "utf8");
  assert.match(source, /readBoundedRegularFile\(/u);
  assert.match(source, /MAX_RELEASE_ARTIFACT_BYTES/u);
  assert.doesNotMatch(source, /readFile\(join\(root/u);
});
