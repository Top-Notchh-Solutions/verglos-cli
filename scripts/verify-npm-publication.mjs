import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";

const OUTPUT_SCHEMA = "verglos.private.npm-publication-observation.v1";
const SLSA_PREDICATE = "https://slsa.dev/provenance/v1";
const WORKFLOW_BUILD_TYPE = "https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1";
const REPOSITORY = "https://github.com/Top-Notchh-Solutions/verglos-cli";
const WORKFLOW_PATH = ".github/workflows/publish.yml";
const COMMIT = /^[a-f0-9]{40}$/u;
const VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
const DEFAULT_PACKAGES = Object.freeze([
  "verglos",
  "@verglos/shared",
  "@verglos/scanner",
  "@verglos/reporter",
  "@verglos/mcp",
  "@verglos/entitlement",
  "@verglos/hunt",
]);

function sha256(value) {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

function packagePath(name) {
  return encodeURIComponent(name).replaceAll("%2F", "%2f");
}

function packagePurl(name, version) {
  return `pkg:npm/${name.startsWith("@") ? `%40${name.slice(1).replace("/", "/")}` : name}@${version}`;
}

function failure(code, detail) {
  return Object.freeze({ code, detail });
}

async function fetchJson(fetchImpl, url) {
  const response = await fetchImpl(url, { headers: { accept: "application/json" } });
  const body = await response.text();
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    throw new Error(`registry response is not JSON: ${url}`);
  }
  return { response, body, json };
}

function subjectDigestFromIntegrity(integrity) {
  if (typeof integrity !== "string" || !integrity.startsWith("sha512-")) return null;
  try {
    return Buffer.from(integrity.slice("sha512-".length), "base64").toString("hex");
  } catch {
    return null;
  }
}

function provenanceSummary(attestation) {
  const payload = attestation?.bundle?.dsseEnvelope?.payload;
  if (typeof payload !== "string") throw new Error("SLSA attestation has no DSSE payload");
  let statement;
  try {
    statement = JSON.parse(Buffer.from(payload, "base64").toString("utf8"));
  } catch {
    throw new Error("SLSA attestation payload is not valid JSON");
  }
  const buildDefinition = statement.predicate?.buildDefinition;
  const workflow = buildDefinition?.externalParameters?.workflow;
  const dependency = buildDefinition?.resolvedDependencies?.find((entry) => entry?.digest?.gitCommit);
  const subject = statement.subject?.[0];
  return {
    subjectName: subject?.name ?? null,
    subjectSha512: subject?.digest?.sha512 ?? null,
    buildType: buildDefinition?.buildType ?? null,
    workflowRepository: workflow?.repository ?? null,
    workflowPath: workflow?.path ?? null,
    workflowRef: workflow?.ref ?? null,
    sourceCommit: dependency?.digest?.gitCommit ?? null,
    invocationId: statement.predicate?.runDetails?.metadata?.invocationId ?? null,
    builderId: statement.predicate?.runDetails?.builder?.id ?? null,
  };
}

function validatePackage(name, version, candidateCommit, metadata, metadataBody, attestationsBody) {
  const failures = [];
  if (!metadata || metadata.name !== name || metadata.version !== version) failures.push(failure("package-identity-mismatch", "registry package identity does not match the requested name/version"));
  const dist = metadata?.dist;
  const expectedSubjectDigest = subjectDigestFromIntegrity(dist?.integrity);
  if (!expectedSubjectDigest) failures.push(failure("missing-tarball-integrity", "registry metadata has no usable sha512 integrity"));
  if (!attestationsBody || !Array.isArray(attestationsBody.attestations)) {
    failures.push(failure("missing-attestation-response", "npm did not return an attestation collection"));
  }
  const slsa = attestationsBody?.attestations?.find((entry) => entry?.predicateType === SLSA_PREDICATE);
  let provenance = null;
  if (!slsa) failures.push(failure("missing-slsa-provenance", "no SLSA provenance attestation was returned"));
  else {
    try { provenance = provenanceSummary(slsa); } catch (error) { failures.push(failure("invalid-slsa-provenance", error.message)); }
  }
  if (provenance) {
    if (provenance.subjectName !== packagePurl(name, version)) failures.push(failure("attestation-subject-mismatch", `expected ${packagePurl(name, version)}, got ${String(provenance.subjectName)}`));
    if (!expectedSubjectDigest || provenance.subjectSha512 !== expectedSubjectDigest) failures.push(failure("attestation-tarball-mismatch", "SLSA subject digest does not match npm tarball integrity"));
    if (provenance.buildType !== WORKFLOW_BUILD_TYPE) failures.push(failure("attestation-build-type-mismatch", "SLSA build type is not the GitHub Actions workflow type"));
    if (provenance.workflowRepository !== REPOSITORY) failures.push(failure("attestation-repository-mismatch", "SLSA workflow repository is not the Verglos CLI repository"));
    if (provenance.workflowPath !== WORKFLOW_PATH) failures.push(failure("attestation-workflow-mismatch", "SLSA workflow path is not publish.yml"));
    if (provenance.sourceCommit !== candidateCommit) failures.push(failure("attestation-source-mismatch", `expected ${candidateCommit}, got ${String(provenance.sourceCommit)}`));
    if (typeof provenance.invocationId !== "string" || !/^https:\/\/github\.com\/[^/]+\/[^/]+\/actions\/runs\/\d+(?:\/attempts\/\d+)?$/u.test(provenance.invocationId)) failures.push(failure("attestation-invocation-mismatch", "SLSA invocation is not a GitHub Actions run URL"));
  }
  return Object.freeze({
    package: name,
    version,
    packageMetadataSha256: sha256(metadataBody),
    attestationSha256: attestationsBody ? sha256(attestationsBody.rawBody) : null,
    tarball: {
      url: typeof dist?.tarball === "string" ? dist.tarball : null,
      integrity: typeof dist?.integrity === "string" ? dist.integrity : null,
      shasum: typeof dist?.shasum === "string" ? dist.shasum : null,
    },
    provenance,
    status: failures.length === 0 ? "accepted" : "rejected",
    failures,
  });
}

/**
 * Observe npm's public registry without credentials or registry writes. A
 * report is accepted only when the complete package set is bound to one exact
 * candidate commit through the expected trusted-publishing workflow.
 */
export async function verifyNpmPublication({
  version,
  sourceCommit,
  packages = DEFAULT_PACKAGES,
  fetchImpl = globalThis.fetch,
  registry = "https://registry.npmjs.org",
} = {}) {
  if (!VERSION.test(version ?? "")) throw new Error("publication version is invalid");
  if (!COMMIT.test(sourceCommit ?? "")) throw new Error("publication source commit must be a 40-character SHA");
  if (!Array.isArray(packages) || packages.length === 0 || new Set(packages).size !== packages.length) throw new Error("publication package set is invalid");
  if (typeof fetchImpl !== "function") throw new Error("a fetch implementation is required");
  const results = [];
  for (const name of packages) {
    if (typeof name !== "string" || name.length === 0) throw new Error("publication package name is invalid");
    const encoded = packagePath(name);
    const metadataUrl = `${registry}/${encoded}/${version}`;
    const attestationUrl = `${registry}/-/npm/v1/attestations/${encoded}@${version}`;
    let metadataResponse;
    let metadataBody = "";
    let metadata = null;
    let attestationResponse;
    let attestationsBody = null;
    const failures = [];
    try {
      metadataResponse = await fetchJson(fetchImpl, metadataUrl);
      metadataBody = metadataResponse.body;
      if (!metadataResponse.response.ok) failures.push(failure("package-not-found", `registry HTTP ${metadataResponse.response.status}`));
      else metadata = metadataResponse.json;
    } catch (error) { failures.push(failure("package-fetch-failed", error.message)); }
    try {
      attestationResponse = await fetchJson(fetchImpl, attestationUrl);
      if (!attestationResponse.response.ok) failures.push(failure("attestation-not-found", `registry HTTP ${attestationResponse.response.status}`));
      else attestationsBody = { ...attestationResponse.json, rawBody: attestationResponse.body };
    } catch (error) { failures.push(failure("attestation-fetch-failed", error.message)); }
    const result = validatePackage(name, version, sourceCommit, metadata, metadataBody, attestationsBody);
    results.push(Object.freeze({ ...result, failures: Object.freeze([...failures, ...result.failures]) }));
  }
  const failures = results.flatMap((result) => result.failures.map((item) => ({ package: result.package, ...item })));
  return Object.freeze({
    schema: OUTPUT_SCHEMA,
    generatedAt: new Date().toISOString(),
    registry,
    repository: REPOSITORY,
    workflow: WORKFLOW_PATH,
    requestedVersion: version,
    requestedSourceCommit: sourceCommit,
    requestedPackages: [...packages],
    packages: Object.freeze(results),
    summary: Object.freeze({
      packageCount: packages.length,
      acceptedPackageCount: results.filter((result) => result.status === "accepted").length,
      failureCount: failures.length,
      accepted: failures.length === 0,
      providerWritePerformed: false,
      customerAcceptance: "not-claimed",
      independentReview: "required",
    }),
    failures: Object.freeze(failures),
  });
}

export async function verifyNpmPublicationFile(version, sourceCommit, outputPath, options = {}) {
  const report = await verifyNpmPublication({ version, sourceCommit, ...options });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [, , version, sourceCommit, outputPath] = process.argv;
  if (!version || !sourceCommit || !outputPath) throw new Error("usage: node scripts/verify-npm-publication.mjs VERSION SOURCE_COMMIT OUTPUT.json");
  const report = await verifyNpmPublicationFile(version, sourceCommit, outputPath);
  process.stdout.write(`${JSON.stringify({ schema: report.schema, accepted: report.summary.accepted, acceptedPackageCount: report.summary.acceptedPackageCount, packageCount: report.summary.packageCount, failureCount: report.summary.failureCount, output: outputPath })}\n`);
  if (!report.summary.accepted) process.exitCode = 2;
}
