import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeRecordAttest, MAX_SIGSTORE_BUNDLE_BYTES, readBoundedRegularFile, verifySigstoreBundleBytes } from "./record-sigstore.js";

const bundleUrl = new URL("./fixtures/sigstore/bundle-v03-dsse.json", import.meta.url);
const trustedRootUrl = new URL("./fixtures/sigstore/trusted-root.json", import.meta.url);
const identityPolicy = { identity: "brian@dehamer.com", issuer: "https://github.com/login/oauth" };

async function fixture(): Promise<{ bundle: Buffer; root: Buffer; statement: Buffer }> {
  const bundle = await readFile(bundleUrl);
  const root = await readFile(trustedRootUrl);
  const parsed = JSON.parse(bundle.toString("utf8")) as { dsseEnvelope: { payload: string } };
  return { bundle, root, statement: Buffer.from(parsed.dsseEnvelope.payload, "base64") };
}

test("Sigstore offline verifier checks a real v0.3 DSSE bundle and exact signer policy", async () => {
  const { bundle, root, statement } = await fixture();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (() => { throw new Error("offline verifier attempted network access"); }) as typeof fetch;
  try {
    const verified = verifySigstoreBundleBytes(bundle, statement, root, identityPolicy);
    assert.equal(verified.identity, identityPolicy.identity);
    assert.equal(verified.issuer, identityPolicy.issuer);
    assert.equal(verified.bundleDigest, `sha256:${createHash("sha256").update(bundle).digest("hex")}`);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("Sigstore verifier rejects payload substitution, identity/issuer mismatch, and legacy bundles", async () => {
  const { bundle, root, statement } = await fixture();
  const modifiedStatement = Buffer.from(statement);
  const statementByteIndex = modifiedStatement.length - 1;
  modifiedStatement[statementByteIndex] = (modifiedStatement[statementByteIndex] ?? 0) ^ 1;
  assert.throws(() => verifySigstoreBundleBytes(bundle, modifiedStatement, root, identityPolicy), /payload does not exactly match/u);
  assert.throws(() => verifySigstoreBundleBytes(bundle, statement, root, { ...identityPolicy, identity: "brian@dehamer.com.attacker" }), /identity does not match/u);
  assert.throws(() => verifySigstoreBundleBytes(bundle, statement, root, { ...identityPolicy, issuer: "https://attacker.invalid" }), /issuer does not match/u);
  const legacyBundle = Buffer.from(JSON.stringify({ ...JSON.parse(bundle.toString("utf8")), mediaType: "application/vnd.dev.sigstore.bundle+json;version=0.2" }));
  assert.throws(() => verifySigstoreBundleBytes(legacyBundle, statement, root, identityPolicy), /version 0.3/u);
});

test("Sigstore verifier rejects tampered signature and trusted root bytes", async () => {
  const { bundle, root, statement } = await fixture();
  const tamperedValue = JSON.parse(bundle.toString("utf8")) as { dsseEnvelope: { signatures: { sig: string }[] } };
  const signature = tamperedValue.dsseEnvelope.signatures[0];
  assert.ok(signature);
  signature.sig = Buffer.from("not-a-signature").toString("base64");
  assert.throws(() => verifySigstoreBundleBytes(Buffer.from(JSON.stringify(tamperedValue)), statement, root, identityPolicy));
  const tamperedRoot = Buffer.from(root);
  const rootByteIndex = tamperedRoot.length - 3;
  tamperedRoot[rootByteIndex] = (tamperedRoot[rootByteIndex] ?? 0) ^ 1;
  assert.throws(() => verifySigstoreBundleBytes(bundle, statement, tamperedRoot, identityPolicy));
});

test("bounded Sigstore input reader rejects symlinks and enforces the byte cap", async () => {
  const directory = await mkdtemp(join(tmpdir(), "verglos-sigstore-input-"));
  try {
    const targetPath = join(directory, "target.json");
    const linkPath = join(directory, "linked.json");
    await writeFile(targetPath, "{}");
    await symlink(targetPath, linkPath);
    await assert.rejects(readBoundedRegularFile(linkPath, 1024, "fixture"));
    await assert.rejects(readBoundedRegularFile(targetPath, 1, "fixture"), /bounded regular file/u);
    assert.equal((await readBoundedRegularFile(targetPath, 2, "fixture")).toString("utf8"), "{}");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("keyless attestation requires explicit sign/network approval before reading paths or token", async () => {
  const original = process.env.VERGLOS_SIGSTORE_TEST_TOKEN;
  const originalLog = console.log;
  let output = "";
  process.env.VERGLOS_SIGSTORE_TEST_TOKEN = "SECRET_TOKEN_MUST_NOT_APPEAR";
  console.log = (...args: unknown[]) => { output = args.map(String).join(" "); };
  try {
    const exitCode = await executeRecordAttest({
      storeRoot: "/missing/store",
      manifestPath: "/missing/manifest.json",
      outputDirectory: "/missing/output.vgl-sigstore",
      trustedRootPath: "/missing/trusted-root.json",
      identity: identityPolicy.identity,
      issuer: identityPolicy.issuer,
      identityTokenEnv: "VERGLOS_SIGSTORE_TEST_TOKEN",
      publishToRekor: true,
      approve: true,
      now: "2026-09-14T00:00:00.000Z",
      json: true,
      quiet: true,
    });
    assert.equal(exitCode, 78);
  } finally {
    console.log = originalLog;
    if (original === undefined) delete process.env.VERGLOS_SIGSTORE_TEST_TOKEN;
    else process.env.VERGLOS_SIGSTORE_TEST_TOKEN = original;
  }
  assert.equal(JSON.parse(output).transparencyLogOutcome, "not-attempted");
  assert.equal(output.includes("SECRET_TOKEN_MUST_NOT_APPEAR"), false);
  assert.ok(MAX_SIGSTORE_BUNDLE_BYTES <= 8 * 1024 * 1024);
});
