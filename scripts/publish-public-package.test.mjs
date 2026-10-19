import assert from "node:assert/strict";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { packageVersionUrl, publicationDecision, publishPublicPackage } from "./publish-public-package.mjs";

test("npm publication preflight binds the exact package version URL", () => {
  assert.equal(packageVersionUrl("https://registry.npmjs.org", "@verglos/shared", "2.0.0-alpha.1"), "https://registry.npmjs.org/%40verglos%2Fshared/2.0.0-alpha.1");
  assert.throws(() => packageVersionUrl("http://registry.npmjs.org", "@verglos/shared", "2.0.0-alpha.1"), /https/u);
  assert.throws(() => packageVersionUrl("https://registry.npmjs.org", "@verglos/shared", "latest"), /identity/u);
});

test("npm publication preflight publishes only on an explicit registry 404", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-publish-preflight-"));
  try {
    const archive = join(root, "shared.tgz");
    await writeFile(archive, "fixture");
    const calls = [];
    const result = await publishPublicPackage({
      archivePath: archive,
      fetchImpl: async (url, init) => {
        calls.push({ type: "fetch", url, method: init.method, redirect: init.redirect });
        return new Response(null, { status: 404 });
      },
      run: async (file, args) => {
        calls.push({ type: file, args });
        if (file === "tar") return { stdout: JSON.stringify({ name: "@verglos/shared", version: "2.0.0-alpha.1" }) };
        return { stdout: "published" };
      },
    });
    assert.equal(result.status, "published");
    assert.equal(calls.filter((call) => call.type === "npm").length, 1);
    assert.deepEqual(calls.find((call) => call.type === "npm").args.slice(0, 2), ["publish", archive]);
    assert.equal(calls.find((call) => call.type === "fetch").method, "GET");
    assert.equal(calls.find((call) => call.type === "fetch").redirect, "error");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("npm publication preflight skips an existing version and fails closed on registry errors", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-publish-preflight-"));
  try {
    const archive = join(root, "shared.tgz");
    await writeFile(archive, "fixture");
    let publishCalls = 0;
    const run = async (file) => {
      if (file === "tar") return { stdout: JSON.stringify({ name: "@verglos/shared", version: "2.0.0-alpha.1" }) };
      publishCalls += 1;
      return { stdout: "published" };
    };
    const existing = await publishPublicPackage({ archivePath: archive, run, fetchImpl: async () => new Response(null, { status: 200 }) });
    assert.equal(existing.status, "already-published");
    assert.equal(publishCalls, 0);
    await assert.rejects(publishPublicPackage({ archivePath: archive, run, fetchImpl: async () => new Response(null, { status: 503 }) }), /unexpected HTTP status 503/u);
    assert.equal(publicationDecision(404), "publish");
    assert.equal(publicationDecision(200), "already-published");
  } finally { await rm(root, { recursive: true, force: true }); }
});
