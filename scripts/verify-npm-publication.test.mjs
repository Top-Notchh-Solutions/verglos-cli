import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { verifyNpmPublication } from "./verify-npm-publication.mjs";

const VERSION = "2.0.0-alpha.2";
const COMMIT = "a".repeat(40);
const REPOSITORY = "https://github.com/Top-Notchh-Solutions/verglos-cli";
const WORKFLOW = ".github/workflows/publish.yml";
const PACKAGES = ["verglos", "@verglos/shared", "@verglos/scanner", "@verglos/reporter", "@verglos/mcp", "@verglos/entitlement", "@verglos/hunt"];

function packagePurl(name) {
  return `pkg:npm/${name.startsWith("@") ? `%40${name.slice(1)}` : name}@${VERSION}`;
}

function fixtureFetch({ missing = new Set(), sourceCommit = COMMIT, invalidSource = false } = {}) {
  const archive = Buffer.from("fixture archive");
  const integrity = `sha512-${createHash("sha512").update(archive).digest("base64")}`;
  const responses = new Map();
  for (const name of PACKAGES) {
    const encoded = encodeURIComponent(name).replaceAll("%2F", "%2f");
    const metadataUrl = `https://registry.example/${encoded}/${VERSION}`;
    const attestationUrl = `https://registry.example/-/npm/v1/attestations/${encoded}@${VERSION}`;
    if (missing.has(name)) {
      responses.set(metadataUrl, new Response(JSON.stringify({ error: "not_found" }), { status: 404 }));
      responses.set(attestationUrl, new Response(JSON.stringify({ error: "not_found" }), { status: 404 }));
      continue;
    }
    const statement = {
      subject: [{ name: packagePurl(name), digest: { sha512: Buffer.from(integrity.slice(7), "base64").toString("hex") } }],
      predicate: {
        buildDefinition: {
          buildType: "https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1",
          externalParameters: { workflow: { repository: REPOSITORY, path: WORKFLOW, ref: "refs/tags/v2.0.0-alpha.2" } },
          resolvedDependencies: [{ uri: `git+${REPOSITORY}@refs/tags/v2.0.0-alpha.2`, digest: { gitCommit: invalidSource ? "b".repeat(40) : sourceCommit } }],
        },
        runDetails: { builder: { id: "https://github.com/actions/runner/github-hosted" }, metadata: { invocationId: "https://github.com/Top-Notchh-Solutions/verglos-cli/actions/runs/123456789/attempts/1" } },
      },
    };
    const attestation = { attestations: [
      { predicateType: "https://slsa.dev/provenance/v1", bundle: { dsseEnvelope: { payload: Buffer.from(JSON.stringify(statement)).toString("base64") } } },
    ] };
    responses.set(metadataUrl, new Response(JSON.stringify({ name, version: VERSION, dist: { tarball: `https://registry.example/${encoded}.tgz`, integrity, shasum: "0".repeat(40) } }), { status: 200 }));
    responses.set(attestationUrl, new Response(JSON.stringify(attestation), { status: 200 }));
  }
  return async (url) => responses.get(url) ?? new Response(JSON.stringify({ error: "unexpected_url" }), { status: 500 });
}

test("accepts a complete seven-package provenance-bound publication", async () => {
  const report = await verifyNpmPublication({ version: VERSION, sourceCommit: COMMIT, packages: PACKAGES, registry: "https://registry.example", fetchImpl: fixtureFetch() });
  assert.equal(report.summary.accepted, true);
  assert.equal(report.summary.acceptedPackageCount, 7);
  assert.equal(report.failures.length, 0);
  assert.equal(report.packages[0].provenance.sourceCommit, COMMIT);
  assert.equal(report.summary.providerWritePerformed, false);
});

test("fails closed when a package is missing", async () => {
  const report = await verifyNpmPublication({ version: VERSION, sourceCommit: COMMIT, packages: PACKAGES, registry: "https://registry.example", fetchImpl: fixtureFetch({ missing: new Set(["@verglos/hunt"]) }) });
  assert.equal(report.summary.accepted, false);
  assert.ok(report.failures.some((failure) => failure.package === "@verglos/hunt" && failure.code === "package-not-found"));
  assert.equal(report.summary.customerAcceptance, "not-claimed");
});

test("fails closed when provenance is bound to another commit", async () => {
  const report = await verifyNpmPublication({ version: VERSION, sourceCommit: COMMIT, packages: PACKAGES, registry: "https://registry.example", fetchImpl: fixtureFetch({ invalidSource: true }) });
  assert.equal(report.summary.accepted, false);
  assert.equal(report.summary.acceptedPackageCount, 0);
  assert.ok(report.failures.every((failure) => failure.code === "attestation-source-mismatch"));
});

test("rejects invalid input before contacting the registry", async () => {
  await assert.rejects(verifyNpmPublication({ version: "2.0", sourceCommit: COMMIT, fetchImpl: fixtureFetch() }), /version is invalid/u);
  await assert.rejects(verifyNpmPublication({ version: VERSION, sourceCommit: "a", fetchImpl: fixtureFetch() }), /40-character SHA/u);
});
