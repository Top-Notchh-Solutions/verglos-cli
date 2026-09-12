import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const run = promisify(execFile);
const script = fileURLToPath(new URL("./verify-release-artifacts.mjs", import.meta.url));

async function withFixture(fn) {
  const root = await mkdtemp(join(tmpdir(), "verglos-release-check-"));
  try { await writeReleaseFixture(root); await fn(root); } finally { await rm(root, { recursive: true, force: true }); }
}

async function writeReleaseFixture(root) {
  await writeFile(join(root, "THIRD_PARTY_NOTICES"), "THIRD-PARTY NOTICES\n\nlicense");
  await mkdir(join(root, "package"));
  await writeFile(join(root, "package", "THIRD_PARTY_NOTICES"), await readFile(join(root, "THIRD_PARTY_NOTICES")));
  await writeFile(join(root, "package", "LICENSE"), "package license");
  await run("tar", ["-czf", "a.tgz", "package"], { cwd: root });
  await rm(join(root, "package"), { recursive: true });
  await writeFile(join(root, "SBOM.cdx.json"), JSON.stringify({ bomFormat: "CycloneDX", components: [{ name: "x" }] }));
  await writeFile(join(root, "SBOM.spdx.json"), JSON.stringify({ spdxVersion: "SPDX-2.3", packages: [{ name: "x" }] }));
  await writeFile(join(root, "dependency-license-inventory.json"), JSON.stringify({ schemaId: "urn:verglos:artifact:dependency-license-inventory", packages: [{ name: "x" }], bundledComponents: [], reviewBlockers: [] }));
  await writeFile(join(root, "clean-consumer-verification.txt"), "clean consumer installed 6 archives and executed Verglos 2.0.0-alpha.1\n");
  await writeChecksums(root);
}

async function writeChecksums(root) {
  const files = (await readdir(root)).filter((name) => name !== "SHA256SUMS").sort();
  const { stdout } = await run("sha256sum", files, { cwd: root });
  await writeFile(join(root, "SHA256SUMS"), stdout);
}

test("release verifier requires checksums for package archives and every release sidecar", async () => {
  await withFixture(async (root) => {
    const result = await run(process.execPath, [script, root]);
    assert.match(result.stdout, /verified 6 release artifacts \(1 npm archives, 5 sidecars, and notices in every archive\)/u);
    await writeFile(join(root, "THIRD_PARTY_NOTICES"), "changed after checksumming");
    await assert.rejects(run(process.execPath, [script, root]), /checksum mismatch: THIRD_PARTY_NOTICES/u);
  });
});

test("release checksum verifier rejects duplicate entries and symlinks", async () => {
  await withFixture(async (root) => {
    const stdout = await readFile(join(root, "SHA256SUMS"), "utf8");
    await writeFile(join(root, "SHA256SUMS"), `${stdout}${stdout}`);
    await assert.rejects(run(process.execPath, [script, root]), /duplicate checksum entry/);
    await writeFile(join(root, "SHA256SUMS"), stdout);
    await symlink("a.tgz", join(root, "b.tgz"));
    await assert.rejects(run(process.execPath, [script, root]), /not a regular file/);
    const { stdout: license } = await run("tar", ["-xOf", join(root, "a.tgz"), "package/LICENSE"]);
    assert.equal(license, "package license");
  });
});

test("release verifier validates SBOM shape and refuses unresolved license blockers", async () => {
  await withFixture(async (root) => {
    await writeFile(join(root, "SBOM.cdx.json"), "{}");
    await writeChecksums(root);
    await assert.rejects(run(process.execPath, [script, root]), /invalid CycloneDX shape/);
    await writeFile(join(root, "SBOM.cdx.json"), JSON.stringify({ bomFormat: "CycloneDX", components: [{ name: "x" }] }));
    await writeFile(join(root, "dependency-license-inventory.json"), JSON.stringify({ schemaId: "urn:verglos:artifact:dependency-license-inventory", packages: [{ name: "x" }], bundledComponents: [], reviewBlockers: [{ name: "x" }] }));
    await writeChecksums(root);
    await assert.rejects(run(process.execPath, [script, root]), /unresolved redistribution blockers/);
  });
});
