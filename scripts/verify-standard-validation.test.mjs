import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { STANDARD_VALIDATION_LIMITS, validateStandardArtifacts } from "./verify-standard-validation.mjs";

const sarif = { version: "2.1.0", runs: [{ tool: { driver: { name: "fixture" } }, results: [] }] };
const cyclonedx = { bomFormat: "CycloneDX", specVersion: "1.5", version: 1, components: [{ name: "fixture", version: "1.0.0" }] };
const spdx = { SPDXID: "SPDXRef-DOCUMENT", spdxVersion: "SPDX-2.3", packages: [{ SPDXID: "SPDXRef-Package-fixture", name: "fixture" }] };

async function withArtifacts(callback) {
  const root = await mkdtemp(join(tmpdir(), "verglos-standard-validation-"));
  try {
    await writeFile(join(root, "report.sarif"), JSON.stringify(sarif));
    await writeFile(join(root, "SBOM.cdx.json"), JSON.stringify(cyclonedx));
    await writeFile(join(root, "SBOM.spdx.json"), JSON.stringify(spdx));
    await writeFile(join(root, "sigstore.payload"), "synthetic payload");
    await writeFile(join(root, "sigstore.bundle.json"), "{}");
    await writeFile(join(root, "sigstore.pub"), "synthetic public key");
    await writeFile(join(root, "spdx-tools.jar"), "synthetic SPDX tool");
    await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

function passingRunner(calls) {
  return async (file, args, options) => {
    calls.push({ file, args, options });
    return { stdout: "SECRET_VALIDATOR_OUTPUT", stderr: "SECRET_VALIDATOR_ERROR", exitCode: 0 };
  };
}

test("standard validation runs each official validator with bounded argv and redacts tool output", async () => {
  await withArtifacts(async (root) => {
    const calls = [];
    const result = await validateStandardArtifacts({
      artifactRoot: root,
      strict: true,
      tools: { sarif: "Sarif.Multitool", cyclonedx: "cyclonedx", spdxJavaJar: join(root, "spdx-tools.jar"), cosign: "cosign" },
      run: passingRunner(calls),
    });
    assert.equal(result.result, "passed");
    assert.deepEqual(result.checks.map((check) => check.status), ["passed", "passed", "passed", "passed"]);
    assert.equal(calls.length, 4);
    assert.deepEqual(calls[0].args, ["validate", join(root, "report.sarif")]);
    assert.deepEqual(calls[1].args, ["validate", "--input-file", join(root, "SBOM.cdx.json"), "--fail-on-errors"]);
    assert.deepEqual(calls[2].args, ["-jar", join(root, "spdx-tools.jar"), "Verify", join(root, "SBOM.spdx.json")]);
    assert.deepEqual(calls[3].args, ["verify-blob", "--bundle", join(root, "sigstore.bundle.json"), "--offline=true", "--insecure-ignore-tlog", "--key", join(root, "sigstore.pub"), join(root, "sigstore.payload")]);
    assert.equal(JSON.stringify(result).includes("SECRET_VALIDATOR"), false);
    assert.equal(JSON.stringify(result).includes(root), false);
  });
});

test("non-strict validation reports unavailable official tools without claiming a pass", async () => {
  await withArtifacts(async (root) => {
    const result = await validateStandardArtifacts({
      artifactRoot: root,
      run: async () => { const error = new Error("missing"); error.code = "ENOENT"; throw error; },
    });
    assert.equal(result.result, "inconclusive");
    assert.deepEqual(result.checks.map((check) => check.status), ["not-supported", "not-supported", "not-supported", "not-supported"]);
  });
});

test("CycloneDX cdx-validate uses its official input flag", async () => {
  await withArtifacts(async (root) => {
    const calls = [];
    const result = await validateStandardArtifacts({
      artifactRoot: root,
      tools: { cyclonedx: "cdx-validate", spdxJavaJar: join(root, "spdx-tools.jar") },
      run: passingRunner(calls),
    });
    assert.equal(result.result, "passed");
    assert.deepEqual(calls[1].args, ["-i", join(root, "SBOM.cdx.json")]);
  });
});

test("standard validation refuses Sigstore fixtures outside the artifact root", async () => {
  await withArtifacts(async (root) => {
    const outside = await mkdtemp(join(tmpdir(), "verglos-standard-outside-"));
    try {
      const calls = [];
      const result = await validateStandardArtifacts({
        artifactRoot: root,
        sigstore: {
          payloadPath: join(outside, "sigstore.payload"),
        },
        run: passingRunner(calls),
      });
      const sigstore = result.checks.find((check) => check.id === "sigstore");
      assert.equal(sigstore?.status, "failed");
      assert.equal(sigstore?.reason, "sigstore-fixture-outside-root");
      assert.equal(calls.length, 2);
    } finally {
      await rm(outside, { recursive: true, force: true });
    }
  });
});

test("strict validation fails when a validator is missing or rejects an artifact", async () => {
  await withArtifacts(async (root) => {
    let count = 0;
    const result = await validateStandardArtifacts({
      artifactRoot: root,
      strict: true,
      tools: { spdxJavaJar: join(root, "spdx-tools.jar") },
      run: async () => {
        count += 1;
        if (count === 1) return { stdout: "", stderr: "", exitCode: 0 };
        const error = new Error("validator rejected");
        error.code = "ERR_TOOL_REJECTED";
        throw error;
      },
    });
    assert.equal(result.result, "failed");
    assert.equal(result.failed, 3);
    assert.equal(result.unsupported, 0);
  });
});

test("standard validation fails closed for missing, malformed, symlinked, and oversized artifacts", async () => {
  await withArtifacts(async (root) => {
    await writeFile(join(root, "report.sarif"), "not-json");
    await symlink(join(root, "SBOM.cdx.json"), join(root, "SBOM.cdx-link.json"));
    await rm(join(root, "SBOM.cdx.json"));
    await symlink(join(root, "SBOM.spdx.json"), join(root, "SBOM.cdx.json"));
    await writeFile(join(root, "SBOM.spdx.json"), "x".repeat(STANDARD_VALIDATION_LIMITS.MAX_ARTIFACT_BYTES + 1));
    const result = await validateStandardArtifacts({ artifactRoot: root, run: passingRunner([]) });
    assert.equal(result.result, "failed");
    assert.equal(result.failed, 3);
    assert.deepEqual(result.checks.map((check) => check.reason), ["invalid-json", "invalid-artifact-file", "invalid-artifact-file", undefined]);
  });
});

test("standard validation rejects a symlinked artifact root", async () => {
  const parent = await mkdtemp(join(tmpdir(), "verglos-standard-root-"));
  const realRoot = join(parent, "real");
  const linkRoot = join(parent, "link");
  try {
    await writeFile(join(parent, "marker"), "marker");
    await import("node:fs/promises").then(({ mkdir }) => mkdir(realRoot));
    await symlink(realRoot, linkRoot);
    await assert.rejects(validateStandardArtifacts({ artifactRoot: linkRoot }), /regular directory/u);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});
