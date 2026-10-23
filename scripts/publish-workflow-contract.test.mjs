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
  assert.match(workflow, /if:\s*startsWith\(github\.ref, 'refs\/tags\/v'\) && !contains\(github\.ref_name, '-'\)/u, "publication must reject prerelease tags");
  assert.match(workflow, /verify-release-tag\.mjs "[$]GITHUB_REF_NAME"/u);
  assert.match(workflow, /TAG_COMMIT="\$\(git rev-list -n 1 "\$GITHUB_REF"\)"/u, "publication must resolve the exact tag commit");
  assert.match(workflow, /verify-release-tag\.mjs "[$]GITHUB_REF_NAME" "[$]GITHUB_SHA" "[$]TAG_COMMIT"/u, "publication must bind the event SHA to the resolved tag SHA");
  assert.ok(workflow.indexOf("verify-release-tag.mjs") < workflow.indexOf("publish-public-package.mjs"), "tag/version integrity must pass before publication");
  assert.doesNotMatch(workflow, /workflow_dispatch/u, "publication must not expose a manual bypass path");
  assert.doesNotMatch(workflow, /promote_latest|dist-tag\s+add|NPM_TOKEN|NODE_AUTH_TOKEN/u, "publication must not depend on a long-lived npm token or mutable dist-tag promotion");
});

test("publish workflow makes its GitHub token permissions explicit", () => {
  const permissions = workflow.match(/^permissions:\n(?<block>(?:  [^\n]+\n)+)/mu)?.groups?.block ?? "";
  assert.notEqual(permissions, "", "publish workflow must declare a top-level permission block");
  assert.match(permissions, /^  actions: read$/mu);
  assert.match(permissions, /^  contents: read$/mu);
  assert.match(permissions, /^  id-token: write(?:\s+#.*)?$/mu);
  for (const permission of ["attestations", "checks", "deployments", "discussions", "issues", "packages", "pages", "pull-requests", "security-events", "statuses"]) {
    assert.match(permissions, new RegExp(`^  ${permission}: none$`, "mu"), `${permission} must remain disabled`);
  }
  assert.doesNotMatch(permissions, /(?:contents|actions): write/u, "no permission other than OIDC may write");
});
