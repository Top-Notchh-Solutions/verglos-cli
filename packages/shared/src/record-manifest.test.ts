import assert from "node:assert/strict";
import { test } from "node:test";
import {
  RELEASE_RECORD_MANIFEST_SCHEMA,
  ReleaseRecordManifestValidationError,
  createReleaseRecordManifest,
  parseReleaseRecordManifest,
  parseReleaseRecordManifestJson,
  type ReleaseRecordManifestDocument,
} from "./index.js";

const digest = (char: string) => ({ algorithm: "sha256" as const, value: char.repeat(64) });

function manifest(): ReleaseRecordManifestDocument {
  return {
    schemaId: RELEASE_RECORD_MANIFEST_SCHEMA.id,
    schemaVersion: "1.0.0",
    bundleVersion: "1.0.0",
    manifestId: "urn:uuid:d2345678-1234-4123-8123-123456789abc",
    generatedAt: "2026-09-09T04:00:00.000Z",
    generator: { id: "verglos.record-builder", version: "1.0.0" },
    members: [
      {
        path: "decision.json",
        kind: "release-decision",
        mediaType: "application/json",
        digest: digest("a"),
        size: 128,
        required: true,
        redaction: "none",
        schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" },
      },
    ],
    extensions: [],
    redaction: { status: "not-required" },
    limitations: ["Member payloads are verified by the record reader before use."],
  };
}

test("record manifests round-trip and builder sorts members/extensions deterministically", () => {
  const base = manifest();
  const built = createReleaseRecordManifest({
    ...base,
    members: [
      { ...base.members[0]!, path: "z.json", kind: "metadata" },
      base.members[0]!,
    ],
    extensions: [
      { id: "urn:verglos:extension:z:test", version: "1.0.0", mediaType: "application/json", digest: digest("b"), size: 1, redaction: "none" },
      { id: "urn:verglos:extension:a:test", version: "1.0.0", mediaType: "application/json", digest: digest("c"), size: 1, redaction: "none" },
    ],
  });
  assert.deepEqual(built.members.map((member) => member.path), ["decision.json", "z.json"]);
  assert.deepEqual(built.extensions.map((extension) => extension.id), ["urn:verglos:extension:a:test", "urn:verglos:extension:z:test"]);
  assert.deepEqual(parseReleaseRecordManifest(built), built);
  assert.deepEqual(parseReleaseRecordManifestJson(JSON.stringify(built)), built);
});

test("manifest requires exactly one required release-decision member", () => {
  const base = manifest();
  assertManifestError(() => parseReleaseRecordManifest({ ...base, members: [] }), "members");
  assertManifestError(
    () => parseReleaseRecordManifest({ ...base, members: [{ ...base.members[0]!, required: false }] }),
    "members.0",
  );
  assertManifestError(
    () => parseReleaseRecordManifest({ ...base, members: [base.members[0]!, base.members[0]!] }),
    "members",
  );
});

test("manifest rejects duplicate or unsorted paths and extensions", () => {
  const base = manifest();
  assertManifestError(
    () => parseReleaseRecordManifest({ ...base, members: [{ ...base.members[0]!, path: "z.json" }, { ...base.members[0]!, path: "a.json", kind: "metadata" }] }),
    "members",
  );
  assertManifestError(
    () => parseReleaseRecordManifest({ ...base, extensions: [{ id: "urn:verglos:extension:z:test", version: "1.0.0", mediaType: "application/json", digest: digest("b"), size: 1, redaction: "none" }, { id: "urn:verglos:extension:a:test", version: "1.0.0", mediaType: "application/json", digest: digest("c"), size: 1, redaction: "none" }] }),
    "extensions",
  );
});

test("redaction state and omitted payload sizes remain explicit", () => {
  const base = manifest();
  assertManifestError(
    () => parseReleaseRecordManifest({ ...base, redaction: { status: "complete" } }),
    "redaction.manifestDigest",
  );
  assertManifestError(
    () => parseReleaseRecordManifest({ ...base, members: [{ ...base.members[0]!, redaction: "omitted", size: 1 }] }),
    "members.0.size",
  );
  assertManifestError(
    () => parseReleaseRecordManifest({ ...base, redaction: { status: "complete", manifestDigest: digest("d") } }),
    "redaction",
  );
});

test("manifest extensions are namespaced and release schemas are explicit", () => {
  const base = manifest();
  assertManifestError(
    () => parseReleaseRecordManifest({ ...base, extensions: [{ id: "urn:verglos:extension:bad", version: "1.0.0", mediaType: "application/json", digest: digest("e"), size: 1, redaction: "none" }] }),
    "extensions.0.id",
  );
  assertManifestError(
    () => parseReleaseRecordManifest({ ...base, members: [{ ...base.members[0]!, schema: undefined }] }),
    "members.0.schema",
  );
});

test("future manifest versions fail with an actionable reader error", () => {
  assertManifestError(() => parseReleaseRecordManifest({ ...manifest(), schemaVersion: "2.0.0" }), "schemaVersion");
});

function assertManifestError(operation: () => unknown, path: string): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof ReleaseRecordManifestValidationError);
    assert.ok(error.issues.some((entry) => entry.path === path || entry.path.startsWith(`${path}.`)));
    return true;
  });
}
