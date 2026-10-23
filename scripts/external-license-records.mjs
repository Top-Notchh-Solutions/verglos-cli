import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const EXTERNAL_LICENSE_RECORDS_SCHEMA = Object.freeze({
  id: "urn:verglos:artifact:external-license-records",
  version: "1.0.0",
});

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const RECORD_PATH = join(ROOT, "licenses", "external-content-records.json");
const REQUIRED_IDS = Object.freeze([
  "engine.trivy",
  "engine.detect-secrets-format",
  "fixture.hunt-reference",
  "recipe.signed-content",
  "format.sarif",
  "format.cyclonedx",
  "format.spdx",
  "tool.in-toto-verifier",
]);
const KINDS = new Set(["engine", "engine-format", "fixture", "recipe-content", "standard", "tooling"]);
const LICENSE_IDS = new Set(["Apache-2.0", "CC0-1.0", "MIT", "NOASSERTION"]);
const DISTRIBUTION = new Set(["first-party", "format-only", "not-redistributed"]);
const MODIFICATIONS = new Set(["not-modified-by-verglos", "format-parser-only", "first-party-sanitized", "runtime-declared-per-recipe", "parser-compatibility-only", "generator-compatibility-only", "ci-only-use"]);

export async function readExternalLicenseRecords(path = RECORD_PATH) {
  return JSON.parse(await readFile(path, "utf8"));
}

export function validateExternalLicenseRecords(document) {
  const failures = [];
  if (!isRecord(document)) return ["external license records must be an object"];
  if (document.schemaId !== EXTERNAL_LICENSE_RECORDS_SCHEMA.id) failures.push("external license records have an unsupported schema id");
  if (document.schemaVersion !== EXTERNAL_LICENSE_RECORDS_SCHEMA.version) failures.push("external license records have an unsupported schema version");
  if (document.generatedBy !== "verglos-cli") failures.push("external license records must identify verglos-cli as the generator");
  if (document.legalClearance !== "not-asserted") failures.push("external license records must not assert legal clearance");
  const policy = document.distributionPolicy;
  if (!isRecord(policy) || policy.externalEnginesBundled !== false || policy.runtimeDownloads !== false || policy.recipeContentBundledInNpm !== false || policy.rawExternalLicenseTextBundled !== false) {
    failures.push("external license distribution policy must be deny-by-default");
  }
  if (!Array.isArray(document.records)) return [...failures, "external license records must contain an array"];
  const ids = document.records.map((record) => record?.id);
  if (JSON.stringify(ids) !== JSON.stringify([...ids].sort())) failures.push("external license records must be sorted by id");
  if (new Set(ids).size !== ids.length) failures.push("external license records contain duplicate ids");
  for (const required of REQUIRED_IDS) if (!ids.includes(required)) failures.push(`external license records are missing ${required}`);
  for (const id of ids) if (!REQUIRED_IDS.includes(id)) failures.push(`external license records contain unexpected id ${String(id)}`);

  for (const record of document.records) {
    const label = `external license record ${String(record?.id)}`;
    if (!isRecord(record)) {
      failures.push(`${label} must be an object`);
      continue;
    }
    for (const field of ["id", "identity", "versionPolicy", "trademarkNotice", "legalReview"]) {
      if (!boundedText(record[field])) failures.push(`${label} has an invalid ${field}`);
    }
    if (!KINDS.has(record.kind)) failures.push(`${label} has an unsupported kind`);
    if (!isHttpsUrl(record.sourceUrl)) failures.push(`${label} must use an HTTPS sourceUrl`);
    if (record.sourcePath !== undefined && !boundedRelativePath(record.sourcePath)) failures.push(`${label} has an invalid sourcePath`);
    if (!isRecord(record.license) || !LICENSE_IDS.has(record.license.spdxId) || !isHttpsUrl(record.license.licenseUrl)) failures.push(`${label} has incomplete license evidence`);
    if (!MODIFICATIONS.has(record.modification)) failures.push(`${label} has an unsupported modification classification`);
    if (!DISTRIBUTION.has(record.publicDistribution)) failures.push(`${label} has an unsupported public distribution classification`);
    if (record.legalReview !== "recorded-for-review") failures.push(`${label} must remain explicitly review-only`);
    if (record.kind === "engine" && (record.publicDistribution !== "not-redistributed" || record.immutableReference === undefined || !/^sha256:[a-f0-9]{64}$/u.test(record.immutableReference))) failures.push(`${label} must be immutable and not redistributed`);
    if (record.kind === "engine-format" && record.publicDistribution !== "not-redistributed") failures.push(`${label} must not redistribute the external engine`);
    if (containsSensitivePattern(record)) failures.push(`${label} contains a credential-shaped value`);
  }
  return Object.freeze(failures);
}

export async function validateExternalLicenseRecordsFile(path = RECORD_PATH) {
  const document = await readExternalLicenseRecords(path);
  const failures = validateExternalLicenseRecords(document);
  if (failures.length > 0) throw new Error(failures.join("; "));
  return document;
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function boundedText(value) {
  return typeof value === "string" && value.length > 0 && value.length <= 1024 && !/[\u0000-\u001f\u007f]/u.test(value);
}

function isHttpsUrl(value) {
  if (!boundedText(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && !url.hash;
  } catch {
    return false;
  }
}

function boundedRelativePath(value) {
  return boundedText(value) && !value.startsWith("/") && !value.split("/").includes("..") && !value.split("/").includes(".");
}

function containsSensitivePattern(value) {
  return /(?:BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|gh[pousr]_[A-Za-z0-9_]+|sk-[A-Za-z0-9_-]{16,}|AKIA[0-9A-Z]{16})/u.test(JSON.stringify(value));
}
