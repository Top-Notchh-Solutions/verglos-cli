import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "node:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { readPackageLicenseTexts } from "./package-license-text.mjs";

const run = promisify(execFile);

test("third-party notices are deterministic and contain provenance disclaimers", async () => {
  const first = (await run("node", ["scripts/generate-third-party-notices.mjs"], { maxBuffer: 16 * 1024 * 1024 })).stdout;
  const second = (await run("node", ["scripts/generate-third-party-notices.mjs"], { maxBuffer: 16 * 1024 * 1024 })).stdout;
  assert.equal(first, second);
  assert.match(first, /^THIRD-PARTY NOTICES\n/);
  assert.match(first, /preserves upstream identity/);
  assert.match(first, /License:/);
  assert.match(first, /Bundled by: fast-uri@3\.1\.7/u);
  assert.match(first, /Review blocker: nested-license-conflicts-with-container/u);
  assert.match(first, /License text was not present in the installed package; consult the upstream source before redistribution\./u);
  assert.match(first, /EXTERNAL ENGINE AND CONTENT RECORDS/u);
  assert.match(first, /engine\.trivy — Trivy/u);
  assert.match(first, /format\.sarif — Static Analysis Results Interchange Format/u);
  assert.match(first, /recipe\.signed-content — Signed Hunt recipe and license evidence/u);
  assert.match(first, /Legal clearance: not-asserted/u);
  assert.match(first, /External engines bundled: no/u);
  assert.match(first, /Runtime downloads: no/u);
  assert.match(first, /Recipe content bundled in npm: no/u);
  assert.match(first, /Immutable reference: sha256:62b1e65e8869bc4b4c6aa4fa2b21595256c7c2f6018a9d9ad61caf87187c1969/u);
  assert.doesNotMatch(first, /raw external license text/u);
  assert.doesNotMatch(first, /node_modules[\\/]/);
});

test("third-party notices remain deterministic when pnpm license indexes are unavailable", async () => {
  const env = { ...process.env, VERGLOS_NOTICE_FORCE_LOCAL_SCAN: "1" };
  const first = (await run("node", ["scripts/generate-third-party-notices.mjs"], { env, maxBuffer: 16 * 1024 * 1024 })).stdout;
  const second = (await run("node", ["scripts/generate-third-party-notices.mjs"], { env, maxBuffer: 16 * 1024 * 1024 })).stdout;
  assert.equal(first, second);
  assert.match(first, /^THIRD-PARTY NOTICES\n/);
  assert.match(first, /benchmark \(1\.0\.0\)[\s\S]*?Bundled by: fast-uri@3\.1\.7/u);
  assert.match(first, /Review blocker: nested-license-conflicts-with-container/u);
  assert.match(first, /EXTERNAL ENGINE AND CONTENT RECORDS/u);
  assert.match(first, /tool\.in-toto-verifier — in-toto release verifier/u);
});

test("third-party notices fail closed when external license records are invalid", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-external-license-records-"));
  const records = join(root, "external-content-records.json");
  const original = await readFile("licenses/external-content-records.json", "utf8");
  try {
    await writeFile(records, original.replace('"legalClearance": "not-asserted"', '"legalClearance": "cleared"'), "utf8");
    await assert.rejects(
      () => run("node", ["scripts/generate-third-party-notices.mjs"], { env: { ...process.env, VERGLOS_EXTERNAL_LICENSE_RECORDS_PATH: records }, maxBuffer: 16 * 1024 * 1024 }),
      /must not assert legal clearance/u,
    );
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("license text collection retains separate LICENSE and NOTICE files", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-package-license-"));
  try {
    await writeFile(join(root, "LICENSE"), "permission text\n");
    await writeFile(join(root, "NOTICE"), "attribution text\n");
    assert.deepEqual(await readPackageLicenseTexts(root), [
      { kind: "License", file: "LICENSE", text: "permission text" },
      { kind: "Notice", file: "NOTICE", text: "attribution text" },
    ]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("license text collection retains notices across installed versions and deduplicates identical license text", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-package-license-versions-"));
  const first = join(root, "first");
  const second = join(root, "second");
  try {
    await mkdir(first);
    await mkdir(second);
    await writeFile(join(first, "LICENSE"), "shared permission text\n");
    await writeFile(join(second, "LICENSE"), "shared permission text\n");
    await writeFile(join(first, "NOTICE"), "first attribution\n");
    await writeFile(join(second, "NOTICE"), "second attribution\n");
    assert.deepEqual(await readPackageLicenseTexts([second, first]), [
      { kind: "License", file: "LICENSE", text: "shared permission text" },
      { kind: "Notice", file: "NOTICE", text: "first attribution" },
      { kind: "Notice", file: "NOTICE", text: "second attribution" },
    ]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("license text collection refuses non-files and files above the size bound", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-package-license-bounds-"));
  const nonFile = join(root, "non-file");
  const oversized = join(root, "oversized");
  try {
    await mkdir(nonFile);
    await mkdir(oversized);
    await mkdir(join(nonFile, "LICENSE"));
    await writeFile(join(oversized, "LICENSE"), Buffer.alloc(512 * 1024 + 1));
    assert.deepEqual(await readPackageLicenseTexts([nonFile, oversized]), [
      { kind: "License", file: "LICENSE", text: "[not included: License source exceeds 512 KiB; review required]" },
      { kind: "License", file: "LICENSE", text: "[not included: License source is not a regular file; review required]" },
    ]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("license text collection binds validated reads to bounded regular-file handles", async () => {
  const source = await readFile("scripts/package-license-text.mjs", "utf8");
  assert.match(source, /readBoundedRegularFile\(/u);
  assert.doesNotMatch(source, /readFile\(path\)/u);
});
