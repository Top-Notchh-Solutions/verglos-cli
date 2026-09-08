import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  CanonicalJsonError,
  JsonDocumentError,
  LEGACY_SCAN_REPORT_SCHEMA,
  canonicalJsonBytes,
  canonicalizeJson,
  classifySchemaCompatibility,
  isSchemaId,
  parseBoundedJson,
  parseSchemaVersion,
  parseVersionedJson,
} from "./schema.js";

test("schema IDs and stable semantic versions are validated", () => {
  assert.equal(isSchemaId("urn:verglos:schema:scan-report"), true);
  assert.equal(isSchemaId("https://verglos.com/scan-report"), false);
  assert.deepEqual(parseSchemaVersion("2.10.3"), {
    major: 2,
    minor: 10,
    patch: 3,
  });
  assert.equal(parseSchemaVersion("2.0"), null);
  assert.equal(parseSchemaVersion("02.0.0"), null);
  assert.equal(parseSchemaVersion("2.0.0-alpha.1"), null);
  assert.equal(parseSchemaVersion(`2.${"0".repeat(65)}.0`), null);
});

test("compatibility accepts older minor/patch releases in the same major", () => {
  assert.equal(classifySchemaCompatibility("2.1.4", "2.1.4"), "exact");
  assert.equal(
    classifySchemaCompatibility("2.0.9", "2.1.0"),
    "backward-compatible",
  );
  assert.equal(
    classifySchemaCompatibility("2.2.0", "2.1.9"),
    "upgrade-required",
  );
  assert.equal(
    classifySchemaCompatibility("3.0.0", "2.9.9"),
    "upgrade-required",
  );
  assert.equal(
    classifySchemaCompatibility("1.9.9", "2.0.0"),
    "incompatible",
  );
});

test("canonical JSON is stable across insertion order and preserves arrays", () => {
  const left = { z: 1, nested: { b: true, a: null }, list: [3, 2, 1] };
  const right = { list: [3, 2, 1], nested: { a: null, b: true }, z: 1 };
  const expected = '{"list":[3,2,1],"nested":{"a":null,"b":true},"z":1}';

  assert.equal(canonicalizeJson(left), expected);
  assert.equal(canonicalizeJson(right), expected);
  assert.deepEqual(
    canonicalJsonBytes(left),
    Uint8Array.from(Buffer.from(expected, "utf8")),
  );
});

test("canonical JSON rejects coercion, sparse arrays, and cycles", () => {
  assert.throws(
    () => canonicalizeJson({ unsafe: undefined }),
    (error: unknown) =>
      error instanceof CanonicalJsonError && error.code === "NON_JSON_VALUE",
  );
  assert.throws(
    () => canonicalizeJson(new Date("2026-01-01T00:00:00.000Z")),
    (error: unknown) =>
      error instanceof CanonicalJsonError && error.code === "NON_PLAIN_OBJECT",
  );
  assert.throws(
    () => canonicalizeJson("\ud800"),
    (error: unknown) =>
      error instanceof CanonicalJsonError && error.code === "INVALID_UNICODE",
  );

  const sparse = new Array(1);
  assert.throws(
    () => canonicalizeJson(sparse),
    (error: unknown) =>
      error instanceof CanonicalJsonError && error.code === "SPARSE_ARRAY",
  );

  const cyclic: Record<string, unknown> = {};
  cyclic.self = cyclic;
  assert.throws(
    () => canonicalizeJson(cyclic),
    (error: unknown) =>
      error instanceof CanonicalJsonError && error.code === "CYCLIC_VALUE",
  );
});

test("bounded parsing rejects bytes, depth, nodes, properties, and array items", () => {
  assertJsonError(
    () => parseBoundedJson('{"value":"large"}', { limits: { maxBytes: 4 } }),
    "DOCUMENT_TOO_LARGE",
  );
  assertJsonError(
    () => parseBoundedJson('{"a":{"b":true}}', { limits: { maxDepth: 1 } }),
    "MAX_DEPTH_EXCEEDED",
  );
  assertJsonError(
    () => parseBoundedJson("[1,2]", { limits: { maxNodes: 2 } }),
    "MAX_NODES_EXCEEDED",
  );
  assertJsonError(
    () =>
      parseBoundedJson('{"a":1,"b":2}', {
        limits: { maxObjectProperties: 1 },
      }),
    "MAX_OBJECT_PROPERTIES_EXCEEDED",
  );
  assertJsonError(
    () => parseBoundedJson("[1,2]", { limits: { maxArrayItems: 1 } }),
    "MAX_ARRAY_ITEMS_EXCEEDED",
  );
});

test("parse errors are typed, actionable, and do not echo document contents", () => {
  const secret = "do-not-echo-this-secret";
  assert.throws(
    () => parseBoundedJson(`{${secret}}`),
    (error: unknown) => {
      assert.ok(error instanceof JsonDocumentError);
      assert.equal(error.code, "INVALID_JSON");
      assert.match(error.action, /Correct/);
      assert.doesNotMatch(error.message, new RegExp(secret));
      return true;
    },
  );

  assertJsonError(
    () => parseBoundedJson(Uint8Array.from([0xc3, 0x28])),
    "INVALID_UTF8",
  );
});

test("the frozen 2.0.0 scan report remains readable through explicit legacy mapping", async () => {
  const fixture = await readFile(
    new URL("../fixtures/legacy-scan-report-2.0.0.json", import.meta.url),
  );
  const parsed = parseVersionedJson(fixture, {
    expectedSchema: LEGACY_SCAN_REPORT_SCHEMA,
    legacySchemaId: LEGACY_SCAN_REPORT_SCHEMA.id,
  });

  assert.equal(parsed.schema.id, "urn:verglos:schema:scan-report");
  assert.equal(parsed.schema.version, "2.0.0");
  assert.equal(parsed.compatibility, "exact");
  assert.equal(parsed.usedLegacySchemaId, true);
  assert.equal(parsed.document.projectType, "nextjs");
});

test("legacy documents do not acquire an identity without an explicit mapping", async () => {
  const fixture = await readFile(
    new URL("../fixtures/legacy-scan-report-2.0.0.json", import.meta.url),
  );
  assertJsonError(
    () =>
      parseVersionedJson(fixture, {
        expectedSchema: LEGACY_SCAN_REPORT_SCHEMA,
      }),
    "MISSING_SCHEMA_ID",
  );
});

test("unsupported versions fail with an actionable upgrade error", () => {
  assert.throws(
    () =>
      parseVersionedJson(
        JSON.stringify({
          schemaId: LEGACY_SCAN_REPORT_SCHEMA.id,
          schemaVersion: "3.0.0",
        }),
        { expectedSchema: LEGACY_SCAN_REPORT_SCHEMA },
      ),
    (error: unknown) => {
      assert.ok(error instanceof JsonDocumentError);
      assert.equal(error.code, "SCHEMA_UPGRADE_REQUIRED");
      assert.match(error.action, /Upgrade/);
      assert.match(error.message, /3\.0\.0/);
      return true;
    },
  );
});

function assertJsonError(
  operation: () => unknown,
  code: JsonDocumentError["code"],
): void {
  assert.throws(
    operation,
    (error: unknown) => error instanceof JsonDocumentError && error.code === code,
  );
}
