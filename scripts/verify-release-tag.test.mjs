import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { parseReleaseTag, verifyReleaseTag } from "./verify-release-tag.mjs";

const packageDirs = ["shared", "scanner", "reporter", "mcp", "entitlement", "cli"];

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
    assert.equal(result.packages.length, 6);
    await writeFile(join(root, "packages", "cli", "package.json"), JSON.stringify({ name: "verglos", version: "2.0.0-alpha.2" }), "utf8");
    await assert.rejects(() => verifyReleaseTag(root, "v2.0.0-alpha.1"), /packages\/cli=2\.0\.0-alpha\.2/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
