import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { test } from "node:test";

const workflow = await readFile(join(process.cwd(), ".github", "workflows", "standard-validation.yml"), "utf8");
const runner = await readFile(join(process.cwd(), "scripts", "verify-standard-validation.mjs"), "utf8");

test("standard-validation workflow installs pinned official validators", () => {
  assert.match(workflow, /@microsoft\/sarif-multitool@5\.8\.0/u);
  assert.match(workflow, /@cdxgen\/cdxgen@13\.4\.0/u);
  assert.match(workflow, /tools-java-2\.0\.7-jar-with-dependencies\.jar/u);
  assert.match(workflow, /bf99a8b2ffbea238c1451c6b4be568870f18b4aac93d0dbff755f2b0b7ce43f3/u);
  assert.match(workflow, /sigstore\/cosign-installer@v4\.1\.2/u);
  assert.match(workflow, /cosign-release: v2\.6\.0/u);
  assert.match(workflow, /in-toto==3\.0\.0/u);
});

test("standard-validation workflow qualifies all release evidence formats and uploads bounded evidence", () => {
  assert.match(workflow, /generate-sbom\.mjs/u);
  assert.match(workflow, /generate-spdx\.mjs/u);
  assert.match(workflow, /report\.sarif/u);
  assert.match(workflow, /verify-standard-validation\.mjs \.artifacts\/standard-validation --strict --json/u);
  assert.match(workflow, /verify-in-toto-release\.py \.artifacts\/public-packages/u);
  assert.match(workflow, /upload-artifact@v4/u);
  assert.match(workflow, /standard-validation\.json/u);
  assert.match(workflow, /sigstore\.bundle\.json/u);
});

test("standard-validation runner uses argv execution and redacts validator output", () => {
  assert.match(runner, /shell: false/u);
  assert.match(runner, /maxBuffer: MAX_TOOL_OUTPUT_BYTES/u);
  assert.match(runner, /official-tool-rejected-artifact/u);
  assert.doesNotMatch(runner, /stdout:\s*result|stderr:\s*result/u);
});
