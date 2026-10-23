import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { EXTERNAL_LICENSE_RECORDS_SCHEMA, validateExternalLicenseRecords } from "./external-license-records.mjs";

const document = JSON.parse(await readFile(new URL("../licenses/external-content-records.json", import.meta.url), "utf8"));

test("external license records are complete, deterministic, and review-only", () => {
  assert.deepEqual(validateExternalLicenseRecords(document), []);
  assert.equal(document.schemaId, EXTERNAL_LICENSE_RECORDS_SCHEMA.id);
  assert.equal(document.records.length, 8);
  assert.equal(document.distributionPolicy.externalEnginesBundled, false);
  assert.equal(document.legalClearance, "not-asserted");
});

test("external license records fail closed when provenance or redistribution changes", () => {
  const broken = structuredClone(document);
  const trivy = broken.records.find((record) => record.id === "engine.trivy");
  trivy.sourceUrl = "http://example.invalid/trivy";
  trivy.publicDistribution = "first-party";
  const failures = validateExternalLicenseRecords(broken);
  assert.ok(failures.some((failure) => /HTTPS sourceUrl/u.test(failure)));
  assert.ok(failures.some((failure) => /immutable and not redistributed/u.test(failure)));
});

test("external license records reject credential-shaped content", () => {
  const broken = structuredClone(document);
  broken.records[0].trademarkNotice = "ghp_not-a-real-token-but-never-allow-this-shape";
  assert.ok(validateExternalLicenseRecords(broken).some((failure) => /credential-shaped/u.test(failure)));
});

test("external license records stay free of raw license text and customer material", () => {
  const serialized = JSON.stringify(document);
  assert.doesNotMatch(serialized, /permission to use|warranty|indemnity|customer source|password=|secret=/iu);
});
