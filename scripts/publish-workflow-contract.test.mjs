import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";

const workflow = await readFile(join(process.cwd(), ".github", "workflows", "publish.yml"), "utf8");

test("publish workflow verifies the same public artifact boundaries as release checks", async () => {
  for (const packageName of ["shared", "scanner", "reporter", "mcp", "entitlement", "hunt", "cli"]) {
    assert.match(workflow, new RegExp(`packages/${packageName}`), packageName);
  }
  assert.match(workflow, /check-package-contents\.mjs/u);
  assert.match(workflow, /check-packed-manifests\.mjs/u);
  assert.match(workflow, /verify-release-artifacts\.mjs/u);
  assert.match(workflow, /generate-release-origin\.mjs/u);
  assert.match(workflow, /generate-release-checksums\.mjs/u);
  assert.match(workflow, /publish-public-package\.mjs/u);
  assert.match(workflow, /package-surface-audit\.test\.mjs/u);
  assert.match(workflow, /verify-clean-consumer\.mjs/u);
  assert.ok(workflow.indexOf("verify-clean-consumer.mjs") < workflow.indexOf("publish-public-package.mjs"), "clean consumer install must pass before any package publish");
  assert.match(workflow, /--require-clear/u);
  assert.doesNotMatch(workflow, /sha256sum \.\/\*\.tgz/u, "checksum generation must use the tested repository script");
  for (const artifact of [
    "SHA256SUMS",
    "THIRD_PARTY_NOTICES",
    "SBOM.cdx.json",
    "SBOM.spdx.json",
    "external-license-records.json",
    "clean-consumer-verification.txt",
    "dependency-license-inventory.json",
    "RELEASE_METADATA.json",
  ]) {
    assert.match(workflow, new RegExp(`RELEASE_DIR\\s*\\}\\}/${artifact.replaceAll(".", "[.]")}`, "u"), artifact);
  }
  assert.match(workflow, /if-no-files-found: error/u, "release evidence upload must fail closed when a sidecar is absent");
  assert.ok(workflow.indexOf("verify-release-artifacts.mjs \"$RELEASE_DIR\"") < workflow.indexOf("Upload release artifacts"), "release artifacts must be verified before upload");
  assert.ok(workflow.indexOf("Upload release artifacts") < workflow.indexOf("publish-public-package.mjs"), "release evidence must be uploaded before publication");
  assert.match(workflow, /generate-third-party-notices\.mjs/u);
  assert.match(workflow, /generate-sbom\.mjs/u);
  assert.match(workflow, /generate-spdx\.mjs/u);
  assert.match(workflow, /docs\/shipping|\.env|id_rsa|id_ed25519/u);
  const publisher = await readFile(join(process.cwd(), "scripts", "publish-public-package.mjs"), "utf8");
  assert.match(publisher, /npm", \["publish"[\s\S]*"--provenance"/u);
  assert.match(workflow, /id-token:\s*write/u, "publication must use GitHub OIDC for npm provenance");
  assert.match(workflow, /environment:\s*\n\s+name: release/u, "publication must be protected by the release environment");
  assert.match(workflow, /concurrency:\s*\n\s+group: verglos-release-publication/u, "publication must serialize registry mutations");
  assert.match(workflow, /verify-release-tag\.mjs "[$]GITHUB_REF_NAME"/u);
  assert.ok(workflow.indexOf("verify-release-tag.mjs") < workflow.indexOf("publish-public-package.mjs"), "tag/version integrity must pass before publication");
  assert.doesNotMatch(workflow, /workflow_dispatch/u, "publication must not expose a manual bypass path");
  assert.doesNotMatch(workflow, /promote_latest|dist-tag\s+add|NPM_TOKEN|NODE_AUTH_TOKEN/u, "publication must not depend on a long-lived npm token or mutable dist-tag promotion");
});
