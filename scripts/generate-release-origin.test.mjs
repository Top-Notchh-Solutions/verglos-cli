import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const run = promisify(execFile);
const script = fileURLToPath(new URL("./generate-release-origin.mjs", import.meta.url));
const packages = [
  ["verglos", "verglos.tgz"],
  ["@verglos/shared", "verglos-shared.tgz"],
  ["@verglos/scanner", "verglos-scanner.tgz"],
  ["@verglos/reporter", "verglos-reporter.tgz"],
  ["@verglos/mcp", "verglos-mcp.tgz"],
  ["@verglos/entitlement", "verglos-entitlement.tgz"],
  ["@verglos/hunt", "verglos-hunt.tgz"],
];
const sidecars = ["THIRD_PARTY_NOTICES", "SBOM.cdx.json", "SBOM.spdx.json", "dependency-license-inventory.json", "external-license-records.json", "clean-consumer-verification.txt", "RELEASE_NOTES.md"];

async function fixture() {
  const root = await mkdtemp(join(tmpdir(), "verglos-release-origin-"));
  await writeFile(join(root, "THIRD_PARTY_NOTICES"), "THIRD-PARTY NOTICES\n");
  await writeFile(join(root, "RELEASE_NOTES.md"), "# Verglos v2.0.0-alpha.1\n\nRelease version: 2.0.0-alpha.1\nRelease tag: v2.0.0-alpha.1\nSource commit: " + "b".repeat(40) + "\n\n## Package set\n");
  for (const [name, archive] of packages) {
    await mkdir(join(root, "package"));
    await writeFile(join(root, "package", "package.json"), JSON.stringify({ name, version: "2.0.0-alpha.1" }));
    await writeFile(join(root, "package", "THIRD_PARTY_NOTICES"), "THIRD-PARTY NOTICES\n");
    await run("tar", ["-czf", archive, "package"], { cwd: root });
    await rm(join(root, "package"), { recursive: true });
  }
  for (const sidecar of sidecars) await writeFile(join(root, sidecar), sidecar);
  return root;
}

test("release origin binds the exact source and every archive/sidecar digest", async () => {
  const root = await fixture();
  try {
    await run(process.execPath, [script, root, "--source-commit", "b".repeat(40), "--release-tag", "v2.0.0-alpha.1"]);
    const metadata = JSON.parse(await readFile(join(root, "RELEASE_METADATA.json"), "utf8"));
    assert.equal(metadata.schemaId, "urn:verglos:artifact:release-origin");
    assert.deepEqual(metadata.source, { commit: "b".repeat(40), tag: "v2.0.0-alpha.1" });
    assert.equal(metadata.artifacts.length, 14);
    assert.deepEqual(new Set(metadata.artifacts.map((artifact) => artifact.name)), new Set((await readdir(root)).filter((name) => name !== "RELEASE_METADATA.json")));
    assert.ok(metadata.artifacts.every((artifact) => /^[a-f0-9]{64}$/u.test(artifact.sha256)));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("release origin refuses an invalid source binding and mismatched package tag", async () => {
  const root = await fixture();
  try {
    await assert.rejects(run(process.execPath, [script, root, "--source-commit", "not-a-commit", "--release-tag", "v2.0.0-alpha.1"]), /40-character hexadecimal SHA/u);
    await assert.rejects(run(process.execPath, [script, root, "--source-commit", "c".repeat(40), "--release-tag", "v2.0.0"]), /version does not match/u);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("release origin refuses a symlinked metadata output without changing its target", async () => {
  const root = await fixture();
  try {
    const sentinel = join(root, "metadata-target.txt");
    await writeFile(sentinel, "do not overwrite\n");
    await symlink("metadata-target.txt", join(root, "RELEASE_METADATA.json"));
    await assert.rejects(
      run(process.execPath, [script, root, "--source-commit", "d".repeat(40), "--release-tag", "v2.0.0-alpha.1"]),
      /release origin manifest output must be a regular file/u,
    );
    assert.equal(await readFile(sentinel, "utf8"), "do not overwrite\n");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("release origin refuses a symlinked archive before reading it", async () => {
  const root = await fixture();
  try {
    await rm(join(root, "verglos.tgz"));
    await symlink("verglos-shared.tgz", join(root, "verglos.tgz"));
    await assert.rejects(
      run(process.execPath, [script, root, "--source-commit", "e".repeat(40), "--release-tag", "v2.0.0-alpha.1"]),
      /release artifact is not a regular file: verglos\.tgz/u,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
