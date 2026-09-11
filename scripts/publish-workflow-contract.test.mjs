import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";

const workflow = await readFile(join(process.cwd(), ".github", "workflows", "publish.yml"), "utf8");

test("publish workflow verifies the same public artifact boundaries as release checks", () => {
  for (const packageName of ["shared", "scanner", "reporter", "mcp", "entitlement", "cli"]) {
    assert.match(workflow, new RegExp(`packages/${packageName}`), packageName);
  }
  assert.match(workflow, /check-package-contents\.mjs/u);
  assert.match(workflow, /check-packed-manifests\.mjs/u);
  assert.match(workflow, /verify-release-artifacts\.mjs/u);
  assert.match(workflow, /sha256sum \.\/\*\.tgz > SHA256SUMS/u);
  assert.match(workflow, /generate-third-party-notices\.mjs/u);
  assert.match(workflow, /generate-sbom\.mjs/u);
  assert.match(workflow, /generate-spdx\.mjs/u);
  assert.match(workflow, /docs\/shipping|\.env|id_rsa|id_ed25519/u);
  assert.match(workflow, /npm publish .*--provenance/u);
});
