import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, writeFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";
import { packageVersionUrl, publicationDecision, publishPublicPackage } from "./publish-public-package.mjs";

const execFileAsync = promisify(execFile);

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
      tarRun: async (file, args) => {
        assert.equal(file, "tar");
        assert.deepEqual(args.slice(0, 3), ["-xOf", "-", "package/package.json"]);
        return { stdout: JSON.stringify({ name: "@verglos/shared", version: "2.0.0-alpha.1" }) };
      },
    });
    assert.equal(result.status, "published");
    assert.equal(calls.filter((call) => call.type === "npm").length, 1);
    const publishArgs = calls.find((call) => call.type === "npm").args;
    assert.equal(publishArgs[0], "publish");
    assert.equal(publishArgs[1].endsWith("shared.tgz.tgz"), true);
    assert.equal(calls.find((call) => call.type === "fetch").method, "GET");
    assert.equal(calls.find((call) => call.type === "fetch").redirect, "error");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("npm publication rejects symlinked archives before registry preflight", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-publish-preflight-"));
  try {
    const target = join(root, "real.tgz");
    const archive = join(root, "shared.tgz");
    await writeFile(target, "fixture");
    await symlink(target, archive);
    await assert.rejects(
      publishPublicPackage({ archivePath: archive, fetchImpl: async () => new Response(null, { status: 404 }) }),
      /bounded regular file/u,
    );
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
    const existing = await publishPublicPackage({ archivePath: archive, run, tarRun: run, fetchImpl: async () => new Response(null, { status: 200 }) });
    assert.equal(existing.status, "already-published");
    assert.equal(publishCalls, 0);
    await assert.rejects(publishPublicPackage({ archivePath: archive, run, tarRun: run, fetchImpl: async () => new Response(null, { status: 503 }) }), /unexpected HTTP status 503/u);
    assert.equal(publicationDecision(404), "publish");
    assert.equal(publicationDecision(200), "already-published");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("npm publication extracts a validated archive snapshot before publishing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-publish-archive-"));
  try {
    await mkdir(join(root, "package"));
    await writeFile(join(root, "package", "package.json"), JSON.stringify({ name: "@verglos/shared", version: "2.0.0-alpha.1" }));
    await execFileAsync("tar", ["-czf", "shared.tgz", "package"], { cwd: root });
    const result = await publishPublicPackage({
      archivePath: join(root, "shared.tgz"),
      fetchImpl: async () => new Response(null, { status: 404 }),
      run: async (file, args) => {
        assert.equal(file, process.platform === "win32" ? "npm.cmd" : "npm");
        assert.equal(args[0], "publish");
        assert.equal(args[1].endsWith("shared.tgz.tgz"), true);
        return { stdout: "published" };
      },
    });
    assert.equal(result.status, "published");
  } finally { await rm(root, { recursive: true, force: true }); }
});
