import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";

const workflow = await readFile(join(process.cwd(), ".github", "workflows", "platform-matrix.yml"), "utf8");
const verifier = await readFile(join(process.cwd(), "scripts", "verify-in-toto-release.py"), "utf8");

test("platform matrix binds the actual public archives with the official in-toto verifier", () => {
  assert.match(workflow, /in-toto-release-binding:/u);
  assert.match(workflow, /in-toto==3\.0\.0/u);
  assert.match(workflow, /pack-public-packages\.mjs \.artifacts\/public-packages/u);
  assert.match(workflow, /verify-in-toto-release\.py \.artifacts\/public-packages/u);
  assert.match(workflow, /upload-artifact@v4/u);
  assert.match(verifier, /EXPECTED_PREFIXES/u);
  assert.match(verifier, /sha256/u);
  assert.match(verifier, /in-toto-verify/u);
  assert.match(verifier, /create_signature/u);
});
