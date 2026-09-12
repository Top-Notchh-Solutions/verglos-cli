import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import { test } from "node:test";
import { createLicenseInventory, parsePnpmLockPackageIds } from "./license-inventory-core.mjs";

const run = promisify(execFile);

test("dependency license inventory is deterministic and review-safe", async () => {
  const first = JSON.parse((await run("node", ["scripts/license-inventory.mjs"], { maxBuffer: 16 * 1024 * 1024 })).stdout);
  const second = JSON.parse((await run("node", ["scripts/license-inventory.mjs"], { maxBuffer: 16 * 1024 * 1024 })).stdout);
  assert.equal(first.schemaId, "urn:verglos:artifact:dependency-license-inventory");
  assert.deepEqual(first, second);
  assert.ok(first.packages.length > 0);
  assert.equal(first.schemaVersion, "1.2.0");
  assert.equal(first.lockfilePackageCount, parsePnpmLockPackageIds(await readFile("pnpm-lock.yaml", "utf8")).length);
  assert.equal(first.packages.reduce((count, entry) => count + entry.versions.length, 0), first.lockfilePackageCount);
  assert.ok(first.packages.some((entry) => entry.name === "@esbuild/aix-ppc64"), "non-host OS/CPU packages must remain visible");
  assert.ok(first.packages.some((entry) => entry.name === "@turbo/windows-64"), "Windows runtime packages must remain visible");
  assert.ok(first.bundledComponents.some((entry) => entry.name === "benchmark" && entry.version === "1.0.0" && entry.bundledBy === "fast-uri@3.1.4"), "nested bundled package manifests must remain visible with parent attribution");
  assert.ok(first.packages.every((entry) => ["direct", "transitive"].includes(entry.scope)));
  assert.ok(first.packages.every((entry) => typeof entry.declaredLicense === "string" && typeof entry.detectedLicense === "string" && typeof entry.detectionMethod === "string" && typeof entry.source === "string" && typeof entry.reviewBlocker === "boolean"));
  assert.deepEqual(first.reviewBlockers, [{
    name: "benchmark",
    version: "1.0.0",
    bundledBy: "fast-uri@3.1.4",
    license: "ISC",
    reason: "nested-license-conflicts-with-container",
  }]);
  assert.equal(first.bundledComponents.find((entry) => entry.name === "benchmark")?.parentDeclaredLicense, "BSD-3-Clause");
  assert.equal((await run("node", ["scripts/license-inventory.mjs", "--check"], { maxBuffer: 16 * 1024 * 1024 })).stdout.length > 0, true, "complete evidence remains usable while an explicit review blocker is recorded");
  await assert.rejects(run("node", ["scripts/license-inventory.mjs", "--require-clear"], { maxBuffer: 16 * 1024 * 1024 }), /Command failed/u);
});

test("pnpm v9 package IDs parse scoped, quoted, and unquoted names without reading snapshots", () => {
  const lock = `lockfileVersion: '9.0'\npackages:\n  '@scope/a@1.2.3':\n    resolution: {integrity: sha512-abc}\n  plain-package@4.5.6:\n    resolution: {integrity: sha512-def}\nsnapshots:\n  '@scope/a@1.2.3(peer@2.0.0)': {}\n`;
  assert.deepEqual(parsePnpmLockPackageIds(lock), [
    { id: "@scope/a@1.2.3", name: "@scope/a", version: "1.2.3" },
    { id: "plain-package@4.5.6", name: "plain-package", version: "4.5.6" },
  ]);
  assert.throws(() => parsePnpmLockPackageIds(lock.replace("9.0", "8.0")), /Unsupported pnpm lockfile version/);
});

test("license inventory fails closed on missing lock metadata and surfaces unknown/source blockers", () => {
  const lockedPackages = [{ name: "known", version: "1.0.0" }, { name: "unknown", version: "2.0.0" }];
  const directDependencies = new Set(["known"]);
  assert.throws(() => createLicenseInventory({ lockedPackages, manifests: [{ name: "known", version: "1.0.0", license: "MIT", homepage: "https://example.com" }], directDependencies }), /missing lockfile package metadata: unknown@2\.0\.0/);
  const inventory = createLicenseInventory({
    lockedPackages,
    manifests: [
      { name: "known", version: "1.0.0", license: "MIT", homepage: "https://example.com" },
      { name: "unknown", version: "2.0.0", license: "LicenseRef-Unknown" },
    ],
    directDependencies,
  });
  assert.deepEqual(inventory.reviewBlockers, [{ name: "unknown", version: "2.0.0", license: "LicenseRef-Unknown", reason: "license-review-required" }]);
});

test("nested components inherit only the containing repository source and remain separate from lock nodes", () => {
  const inventory = createLicenseInventory({
    lockedPackages: [{ name: "parent", version: "1.0.0" }],
    manifests: [{ name: "parent", version: "1.0.0", license: "MIT", repository: { url: "https://example.com/parent.git" } }],
    bundledManifests: [{ manifest: { name: "embedded", version: "2.0.0", license: "ISC" }, bundledBy: "parent@1.0.0" }],
    directDependencies: new Set(["parent"]),
  });
  assert.equal(inventory.packages.reduce((count, entry) => count + entry.versions.length, 0), 1);
  assert.deepEqual(inventory.bundledComponents, [{
    name: "embedded", version: "2.0.0", bundledBy: "parent@1.0.0", privatePackage: false, declaredLicense: "ISC", parentDeclaredLicense: "MIT", detectedLicense: "ISC",
    detectionMethod: "nested-package-manifest-license-field", source: "https://example.com/parent.git", sourceBasis: "containing-package-repository",
    redistributionClass: "permissive", noticeObligation: "review-required", reviewBlocker: true, reviewReason: "nested-license-conflicts-with-container",
  }]);
  assert.deepEqual(inventory.reviewBlockers, [{ name: "embedded", version: "2.0.0", bundledBy: "parent@1.0.0", license: "ISC", reason: "nested-license-conflicts-with-container" }]);
});

test("CycloneDX and SPDX generators preserve every lockfile license component", async () => {
  const inventory = JSON.parse((await run("node", ["scripts/license-inventory.mjs"], { maxBuffer: 16 * 1024 * 1024 })).stdout);
  const [cycloneDx, spdx] = await Promise.all([
    run("node", ["scripts/generate-sbom.mjs"], { maxBuffer: 16 * 1024 * 1024 }).then((result) => JSON.parse(result.stdout)),
    run("node", ["scripts/generate-spdx.mjs"], { maxBuffer: 16 * 1024 * 1024 }).then((result) => JSON.parse(result.stdout)),
  ]);
  const expectedCount = inventory.packages.reduce((count, entry) => count + entry.versions.length, 0) + inventory.bundledComponents.length;
  assert.equal(cycloneDx.components.length, expectedCount);
  assert.equal(spdx.packages.length, expectedCount);
  assert.ok(cycloneDx.components.some((component) => component.name === "@turbo/windows-64"));
  assert.ok(spdx.packages.some((component) => component.name === "@esbuild/aix-ppc64"));
  assert.ok(cycloneDx.components.some((component) => component.name === "benchmark" && component.properties.some((property) => property.name === "verglos:bundled-by" && property.value === "fast-uri@3.1.4")));
  const benchmarkId = spdx.packages.find((component) => component.name === "benchmark" && component.versionInfo === "1.0.0")?.SPDXID;
  assert.ok(spdx.relationships.some((relationship) => relationship.relationshipType === "CONTAINS" && relationship.relatedSpdxElement === benchmarkId));
  assert.ok(spdx.packages.every((component) => component.licenseConcluded === "NOASSERTION"));
});
