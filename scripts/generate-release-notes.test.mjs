import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const run = promisify(execFile);
const script = fileURLToPath(new URL("./generate-release-notes.mjs", import.meta.url));
const packages = [
  ["verglos", "verglos.tgz"],
  ["@verglos/shared", "verglos-shared.tgz"],
  ["@verglos/scanner", "verglos-scanner.tgz"],
  ["@verglos/reporter", "verglos-reporter.tgz"],
  ["@verglos/mcp", "verglos-mcp.tgz"],
  ["@verglos/entitlement", "verglos-entitlement.tgz"],
  ["@verglos/hunt", "verglos-hunt.tgz"],
];

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "verglos-release-notes-"));
  for (const [name, archive] of packages) {
    await mkdir(join(root, "package"));
    await writeFile(join(root, "package", "package.json"), JSON.stringify({ name, version: "2.0.0" }));
    await run("tar", ["-czf", archive, "package"], { cwd: root });
    await rm(join(root, "package"), { recursive: true });
  }
  return root;
}

test("release notes bind the exact tag, source, and seven-package set", async () => {
  const root = await fixture();
  try {
    await run(process.execPath, [script, root, "--source-commit", "a".repeat(40), "--release-tag", "v2.0.0"]);
    const notes = await readFile(join(root, "RELEASE_NOTES.md"), "utf8");
    assert.match(notes, /^# Verglos v2\.0\.0$/mu);
    assert.match(notes, /^Release tag: v2\.0\.0$/mu);
    assert.match(notes, new RegExp(`^Source commit: ${"a".repeat(40)}$`, "mu"));
    assert.equal((notes.match(/^- `[^`]+@2\.0\.0`$/gmu) ?? []).length, 7);
    assert.match(notes, /trusted publishing with GitHub OIDC provenance/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("release notes reject an incomplete or mismatched package set", async () => {
  const root = await fixture();
  try {
    await rm(join(root, "verglos-hunt.tgz"));
    await assert.rejects(
      run(process.execPath, [script, root, "--source-commit", "b".repeat(40), "--release-tag", "v2.0.0"]),
      /exactly 7 npm archives/u,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("release notes refuse a symlinked output without changing its target", async () => {
  const root = await fixture();
  try {
    const sentinel = join(root, "sentinel.txt");
    await writeFile(sentinel, "do not overwrite\n");
    await symlink("sentinel.txt", join(root, "RELEASE_NOTES.md"));
    await assert.rejects(
      run(process.execPath, [script, root, "--source-commit", "c".repeat(40), "--release-tag", "v2.0.0"]),
      /release notes output must be a regular file/u,
    );
    assert.equal(await readFile(sentinel, "utf8"), "do not overwrite\n");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
