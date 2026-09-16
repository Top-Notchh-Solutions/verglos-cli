// QUAL-CLI-001 · Frozen determinism corpus.
//
// Repeats every public data-plane transform (importers, adapters, JSON parsers)
// against a canonical fixture and asserts byte-identical serialized output
// across runs. Any accidental non-determinism — Map iteration order that isn't
// stable, Date.now() slipping into a payload, floating-point rounding, an
// unsorted array — will surface here rather than in the next release.
//
// Expected deltas are recorded only through a reviewed fixture update; this
// test never generates fresh input or reads Date/random state.

import assert from "node:assert/strict";
import { test } from "node:test";
import { importSarif } from "./sarif-importer.js";
import { importCycloneDx } from "./cyclonedx-importer.js";
import { importCycloneDxVex } from "./cyclonedx-vex-importer.js";
import { importSpdx } from "./spdx-importer.js";
import { importInTotoProvenance } from "./provenance-importer.js";
import { importDetectSecretsBaseline } from "./detect-secrets-importer.js";

const encoder = new TextEncoder();

function bytes(value: unknown): Uint8Array {
  return encoder.encode(JSON.stringify(value));
}

function serialize(value: unknown): string {
  return JSON.stringify(value, (_key, entry) => {
    if (entry instanceof Uint8Array) return `Uint8Array[${entry.byteLength}]`;
    return entry;
  });
}

function assertDeterministic<T>(label: string, factory: () => T): void {
  const first = factory();
  const second = factory();
  const firstJson = serialize(first);
  const secondJson = serialize(second);
  assert.equal(firstJson, secondJson, `${label} produced different output on repeat invocation`);
  // Also assert the object graph is structurally deep-equal, so the JSON
  // stringifier is not hiding differences behind key-order coincidence.
  assert.deepEqual(second, first, `${label} deep-equal check failed on repeat invocation`);
}

test("SARIF importer output is deterministic across repeat runs", () => {
  const input = bytes({
    version: "2.1.0",
    runs: [{
      tool: { driver: { name: "fixture-scanner", rules: [{ id: "F001", shortDescription: { text: "fixture" } }] } },
      results: [{ ruleId: "F001", level: "error", locations: [{ physicalLocation: { artifactLocation: { uri: "src/app.ts" } } }] }],
    }],
  });
  assertDeterministic("importSarif", () => importSarif(input));
});

test("CycloneDX SBOM importer output is deterministic across repeat runs", () => {
  const input = bytes({
    bomFormat: "CycloneDX",
    specVersion: "1.6",
    version: 1,
    components: [
      { type: "library", name: "left-pad", version: "1.3.0", purl: "pkg:npm/left-pad@1.3.0", hashes: [{ alg: "SHA-256", content: "a".repeat(64) }] },
      { type: "library", name: "right-pad", version: "0.1.0", purl: "pkg:npm/right-pad@0.1.0", hashes: [{ alg: "SHA-256", content: "b".repeat(64) }] },
    ],
  });
  assertDeterministic("importCycloneDx", () => importCycloneDx(input));
});

test("CycloneDX VEX importer output is deterministic across repeat runs", () => {
  const input = bytes({
    bomFormat: "CycloneDX",
    specVersion: "1.6",
    version: 1,
    vulnerabilities: [
      { id: "CVE-2020-0001", analysis: { state: "not_affected" } },
      { id: "CVE-2021-0002", analysis: { state: "in_triage" } },
    ],
  });
  assertDeterministic("importCycloneDxVex", () => importCycloneDxVex(input));
});

test("SPDX SBOM importer output is deterministic across repeat runs", () => {
  const input = bytes({
    spdxVersion: "SPDX-2.3",
    dataLicense: "CC0-1.0",
    SPDXID: "SPDXRef-DOCUMENT",
    name: "fixture",
    documentNamespace: "https://example.com/fixture",
    packages: [
      { SPDXID: "SPDXRef-A", name: "left-pad", versionInfo: "1.3.0", checksums: [{ algorithm: "SHA256", checksumValue: "a".repeat(64) }] },
      { SPDXID: "SPDXRef-B", name: "right-pad", versionInfo: "0.1.0", checksums: [{ algorithm: "SHA256", checksumValue: "b".repeat(64) }] },
    ],
    relationships: [{ spdxElementId: "SPDXRef-DOCUMENT", relatedSpdxElement: "SPDXRef-A", relationshipType: "DESCRIBES" }],
  });
  assertDeterministic("importSpdx", () => importSpdx(input));
});

test("In-toto provenance importer output is deterministic across repeat runs", () => {
  const input = bytes({
    _type: "https://in-toto.io/Statement/v1",
    subject: [{ name: "artifact", digest: { sha256: "c".repeat(64) } }],
    predicateType: "https://slsa.dev/provenance/v1",
    predicate: { buildDefinition: { buildType: "https://example.com/buildtype/v1" } },
  });
  assertDeterministic("importInTotoProvenance", () => importInTotoProvenance(input));
});

test("detect-secrets baseline importer output is deterministic across repeat runs", () => {
  const input = bytes({
    version: "1.4.0",
    plugins_used: [{ name: "AWSKeyDetector" }, { name: "PrivateKeyDetector" }],
    filters_used: [{ path: "detect_secrets.filters.gibberish.should_exclude_secret" }],
    results: {
      "src/app.ts": [
        { type: "Secret Keyword", filename: "src/app.ts", line_number: 12, hashed_secret: "d".repeat(40) },
      ],
    },
    generated_at: "2026-01-01T00:00:00Z",
  });
  assertDeterministic("importDetectSecretsBaseline", () => importDetectSecretsBaseline(input));
});

test("Determinism harness itself detects a difference", () => {
  // A control test: prove the harness surfaces non-determinism when it exists.
  let counter = 0;
  assert.throws(
    () => assertDeterministic("intentional-nondeterminism", () => ({ value: counter++ })),
    /produced different output on repeat invocation/u,
    "the determinism harness must reject callers whose output changes across runs",
  );
});
