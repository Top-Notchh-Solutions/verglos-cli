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
const originScript = fileURLToPath(new URL("./generate-release-origin.mjs", import.meta.url));
const packageFixtures = [
  ["verglos", "verglos.tgz"],
  ["@verglos/shared", "verglos-shared.tgz"],
  ["@verglos/scanner", "verglos-scanner.tgz"],
  ["@verglos/reporter", "verglos-reporter.tgz"],
  ["@verglos/mcp", "verglos-mcp.tgz"],
  ["@verglos/entitlement", "verglos-entitlement.tgz"],
  ["@verglos/hunt", "verglos-hunt.tgz"],
];

async function withFixture(fn) {
  const root = await mkdtemp(join(tmpdir(), "verglos-release-check-"));
  try { await writeReleaseFixture(root); await fn(root); } finally { await rm(root, { recursive: true, force: true }); }
}

async function writeReleaseFixture(root) {
  await writeFile(join(root, "THIRD_PARTY_NOTICES"), "THIRD-PARTY NOTICES\n\nlicense");
  for (const [packageName, archive] of packageFixtures) {
    await mkdir(join(root, "package"));
    await writeFile(join(root, "package", "package.json"), JSON.stringify({ name: packageName, version: "2.0.0-alpha.1" }));
    await writeFile(join(root, "package", "THIRD_PARTY_NOTICES"), await readFile(join(root, "THIRD_PARTY_NOTICES")));
    await writeFile(join(root, "package", "LICENSE"), "package license");
    await run("tar", ["-czf", archive, "package"], { cwd: root });
    await rm(join(root, "package"), { recursive: true });
  }
  await writeFile(join(root, "SBOM.cdx.json"), JSON.stringify({ bomFormat: "CycloneDX", components: [{ name: "x" }] }));
  await writeFile(join(root, "SBOM.spdx.json"), JSON.stringify({ spdxVersion: "SPDX-2.3", packages: [{ name: "x" }] }));
  await writeFile(join(root, "dependency-license-inventory.json"), JSON.stringify({ schemaId: "urn:verglos:artifact:dependency-license-inventory", packages: [{ name: "x" }], bundledComponents: [], reviewBlockers: [] }));
  await writeFile(join(root, "external-license-records.json"), await readFile(join(process.cwd(), "licenses", "external-content-records.json")));
  await writeFile(join(root, "clean-consumer-verification.txt"), "clean consumer installed 7 archives, imported all libraries, executed Verglos 2.0.0-alpha.1, and confirmed no external engine installation\n");
  await run(process.execPath, [originScript, root, "--source-commit", "a".repeat(40), "--release-tag", "v2.0.0-alpha.1"]);
  await writeChecksums(root);
}

async function writeChecksums(root) {
  const files = (await readdir(root)).filter((name) => name !== "SHA256SUMS").sort();
  const { stdout } = await run("sha256sum", files, { cwd: root });
  await writeFile(join(root, "SHA256SUMS"), stdout);
}

async function refreshOrigin(root) {
  await run(process.execPath, [originScript, root, "--source-commit", "a".repeat(40), "--release-tag", "v2.0.0-alpha.1"]);
}

test("release verifier requires checksums for package archives and every release sidecar", async () => {
  await withFixture(async (root) => {
    const result = await run(process.execPath, [script, root]);
    assert.match(result.stdout, /verified 14 release artifacts \(7 npm archives, 7 sidecars, and notices in every archive\)/u);
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
    await symlink("verglos.tgz", join(root, "b.tgz"));
    await assert.rejects(run(process.execPath, [script, root]), /not a regular file/);
    const { stdout: license } = await run("tar", ["-xOf", join(root, "verglos.tgz"), "package/LICENSE"]);
    assert.equal(license, "package license");
  });
});

test("release verifier validates SBOM shape and refuses unresolved license blockers", async () => {
  await withFixture(async (root) => {
    await writeFile(join(root, "SBOM.cdx.json"), "{}");
    await refreshOrigin(root);
    await writeChecksums(root);
    await assert.rejects(run(process.execPath, [script, root]), /invalid CycloneDX shape/);
    await writeFile(join(root, "SBOM.cdx.json"), JSON.stringify({ bomFormat: "CycloneDX", components: [{ name: "x" }] }));
    await writeFile(join(root, "dependency-license-inventory.json"), JSON.stringify({ schemaId: "urn:verglos:artifact:dependency-license-inventory", packages: [{ name: "x" }], bundledComponents: [], reviewBlockers: [{ name: "x" }] }));
    await refreshOrigin(root);
    await writeChecksums(root);
    await assert.rejects(run(process.execPath, [script, root]), /unresolved redistribution blockers/);
  });
});

test("release verifier refuses incomplete external license records", async () => {
  await withFixture(async (root) => {
    await writeFile(join(root, "external-license-records.json"), JSON.stringify({ schemaId: "urn:verglos:artifact:external-license-records" }));
    await refreshOrigin(root);
    await writeChecksums(root);
    await assert.rejects(run(process.execPath, [script, root]), /external-license-records\.json is invalid/u);
  });
});

test("strict release mode refuses an incomplete public package set", async () => {
  await withFixture(async (root) => {
    await rm(join(root, "verglos-hunt.tgz"));
    const origin = JSON.parse(await readFile(join(root, "RELEASE_METADATA.json"), "utf8"));
    origin.artifacts = origin.artifacts.filter((artifact) => artifact.name !== "verglos-hunt.tgz");
    await writeFile(join(root, "RELEASE_METADATA.json"), `${JSON.stringify(origin, null, 2)}\n`);
    await writeChecksums(root);
    await assert.rejects(run(process.execPath, [script, root, "--require-seven"]), /strict release requires exactly 7 public npm archives/);
  });
});
