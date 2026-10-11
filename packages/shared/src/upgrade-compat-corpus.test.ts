// DIST-005 · Upgrade / backward-compatibility corpus.
//
// Freezes the invariants a user relies on after upgrading the CLI or the
// hosted control plane: their existing scan reports, entitlement tokens,
// record signature envelopes, and pinned key slots keep working. Every
// invariant here is exercised against real code paths on the current
// release; deprecation shifts must land as a reviewed fixture update or as
// an explicit compatibility break with a matching migration.

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  LEGACY_SCAN_REPORT_SCHEMA,
  VERGLOS_SCHEMA_IDS,
  classifySchemaCompatibility,
  parseSchemaVersion,
} from "./schema.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const SHARED_ROOT = resolve(HERE, "..");
const ENTITLEMENT_CLIENT = resolve(HERE, "..", "..", "entitlement", "src", "client.ts");

test("schema compatibility classifier reports exact/backward/upgrade-required across the compatibility matrix", () => {
  // Same version → exact.
  assert.equal(classifySchemaCompatibility("2.0.0", "2.0.0"), "exact");
  // Older minor same major → backward-compatible.
  assert.equal(classifySchemaCompatibility("2.0.0", "2.1.0"), "backward-compatible");
  assert.equal(classifySchemaCompatibility("2.0.5", "2.1.0"), "backward-compatible");
  // Newer minor same major → upgrade-required.
  assert.equal(classifySchemaCompatibility("2.2.0", "2.1.0"), "upgrade-required");
  // Newer major → upgrade-required.
  assert.equal(classifySchemaCompatibility("3.0.0", "2.1.0"), "upgrade-required");
  // Older major → incompatible (never inferred).
  assert.equal(classifySchemaCompatibility("1.9.0", "2.0.0"), "incompatible");
  // Patch bumps within the same minor stay exact-in-shape.
  assert.equal(classifySchemaCompatibility("2.0.1", "2.0.0"), "backward-compatible");
});

test("schema version parser rejects invalid inputs and accepts triplet integers", () => {
  assert.equal(parseSchemaVersion("2.0.0")?.major, 2);
  assert.equal(parseSchemaVersion("2.0.0")?.minor, 0);
  assert.equal(parseSchemaVersion("2.0.0")?.patch, 0);
  assert.equal(parseSchemaVersion("v2.0.0"), null);
  assert.equal(parseSchemaVersion("2.0"), null);
  assert.equal(parseSchemaVersion("2.0.0-alpha"), null);
  assert.equal(parseSchemaVersion("02.0.0"), null);
  assert.equal(parseSchemaVersion(""), null);
});

test("legacy 2.0.0 scan report fixture is still parseable as a stable JSON envelope", async () => {
  const path = join(SHARED_ROOT, "fixtures", "legacy-scan-report-2.0.0.json");
  const raw = await readFile(path, "utf8");
  const document = JSON.parse(raw) as Record<string, unknown>;
  assert.equal(document.schemaVersion, "2.0.0", "legacy scan-report fixture must remain at 2.0.0");
  assert.ok(typeof document.projectRoot === "string" && document.projectRoot.length > 0);
  assert.ok(Array.isArray(document.findings), "legacy scan-report fixture must expose a findings array");
  assert.ok(document.score && typeof document.score === "object", "legacy scan-report fixture must expose a score object");
  // The current LEGACY_SCAN_REPORT_SCHEMA identifier must still be reachable.
  assert.equal(LEGACY_SCAN_REPORT_SCHEMA.id, VERGLOS_SCHEMA_IDS.scanReport);
  assert.equal(LEGACY_SCAN_REPORT_SCHEMA.version, "2.0.0");
});

test("record signing envelope v1.0 remains a documented, non-identity-bound shape", async () => {
  const source = await readFile(resolve(SHARED_ROOT, "src", "record-signing.ts"), "utf8");
  assert.match(source, /schemaVersion: z\.literal\("1\.0\.0"\)/u, "legacy record signing envelope literal must still be 1.0.0");
  assert.match(source, /schemaVersion: z\.literal\("1\.1\.0"\)/u, "current record signing envelope literal must be 1.1.0");
  assert.match(source, /schemaVersion === "1\.0\.0"/u, "verify path must still handle legacy 1.0.0 envelopes");
  assert.match(source, /identityBound: false/u, "legacy 1.0.0 envelopes must explicitly report identityBound: false");
});

test("record signing verify contract exposes both v1.0 legacy and v1.1 identity-bound branches", async () => {
  const source = await readFile(resolve(SHARED_ROOT, "src", "record-signing.ts"), "utf8");
  // The verify contract must return both cases; missing either would silently regress backward-compat.
  assert.match(source, /candidate\.data\.schemaVersion === "1\.0\.0"/u, "legacy verify branch must remain present");
  assert.match(source, /schemaVersion: "1\.1\.0"/u, "signing default must be the current 1.1.0 envelope");
});

test("entitlement client keeps both legacy-v1 and successor-v1 pinned key slots", async () => {
  const source = await readFile(ENTITLEMENT_CLIENT, "utf8");
  assert.match(source, /PINNED_PUBLIC_KEYS_B64URL: readonly \[string, string\]/u, "pinned key array must remain a two-slot tuple");
  assert.match(source, /"legacy-v1": PINNED_PUBLIC_KEYS_B64URL\[0\]/u, "legacy-v1 must alias slot 0 (current)");
  assert.match(source, /"successor-v1": PINNED_PUBLIC_KEYS_B64URL\[1\]/u, "successor-v1 must alias slot 1 (reserved for rotation)");
});

test("entitlement client documents v1 and v2 token claim shapes without silent overlap", async () => {
  const source = await readFile(ENTITLEMENT_CLIENT, "utf8");
  assert.match(source, /V2_CLAIM_KEYS = \[/u, "v2 claim key allowlist must remain declared");
  assert.match(
    source,
    /claims\.schemaVersion === undefined && V2_CLAIM_KEYS\.some/u,
    "client must detect v2-shaped claims that are missing an explicit schemaVersion and reject them",
  );
});

test("schema id registry keeps every documented schema identifier stable", () => {
  // These identifiers are wire contracts. Renaming any one is a compatibility break that must be reflected in a migration.
  const expected: Record<string, string> = {
    scanReport: "urn:verglos:schema:scan-report",
    subject: "urn:verglos:schema:subject",
    engineHealth: "urn:verglos:schema:engine-health",
    toolRun: "urn:verglos:schema:tool-run",
    observation: "urn:verglos:schema:observation",
    aiChangeContext: "urn:verglos:schema:ai-change-context",
    verificationAttempt: "urn:verglos:schema:verification-attempt",
    policyException: "urn:verglos:schema:policy-exception",
    exceptionApproval: "urn:verglos:schema:exception-approval",
    policyEvaluation: "urn:verglos:schema:policy-evaluation",
    releaseDecision: "urn:verglos:schema:release-decision",
    lineageGraph: "urn:verglos:schema:lineage-graph",
    releaseRecordManifest: "urn:verglos:schema:release-record-manifest",
    redactionManifest: "urn:verglos:schema:redaction-manifest",
    failure: "urn:verglos:schema:failure",
  };
  for (const [key, urn] of Object.entries(expected)) {
    assert.equal((VERGLOS_SCHEMA_IDS as Record<string, string>)[key], urn, `wire-stable schema id '${key}' must remain '${urn}'`);
  }
  // Any new key added to VERGLOS_SCHEMA_IDS is fine; renaming or dropping one is a compatibility break.
  for (const key of Object.keys(expected)) {
    assert.ok(key in VERGLOS_SCHEMA_IDS, `documented schema id '${key}' must remain present`);
  }
});

test("record-manifest reader labels newer schema envelopes as upgrade-required, not exact", () => {
  // A future release that emits a newer manifest schema must be surfaced to older readers as upgrade-required.
  assert.equal(classifySchemaCompatibility("2.1.0", "2.0.0"), "upgrade-required");
  assert.equal(classifySchemaCompatibility("3.0.0", "2.0.0"), "upgrade-required");
});
