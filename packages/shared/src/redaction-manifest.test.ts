import assert from "node:assert/strict";
import { test } from "node:test";
import { createRedactionManifest, parseRedactionManifest, REDACTION_MANIFEST_SCHEMA } from "./redaction-manifest.js";

const digest = (char: string) => ({ algorithm: "sha256" as const, value: char.repeat(64) });

test("redaction manifest is deterministic, path-free, and explicitly declarative", () => {
  const manifest = createRedactionManifest({
    status: "partial",
    members: [
      { memberDigest: digest("b"), disposition: "applied", categories: ["paths", "source-content"] },
      { memberDigest: digest("a"), disposition: "none", categories: [] },
    ],
  });
  assert.equal(manifest.schemaId, REDACTION_MANIFEST_SCHEMA.id);
  assert.equal(manifest.assurance, "producer-declared-only");
  assert.deepEqual(manifest.members.map(({ memberDigest }) => memberDigest.value[0]), ["a", "b"]);
  assert.deepEqual(manifest.members[1]?.categories, ["paths", "source-content"]);
  const json = JSON.stringify(manifest);
  assert.equal("path" in manifest.members[0]!, false);
  assert.equal(json.includes("source-content"), true);
  assert.deepEqual(parseRedactionManifest(manifest), manifest);
});

test("redaction manifest rejects free-form categories, contradictory states, and duplicate member digests", () => {
  const base = createRedactionManifest({ status: "complete", members: [{ memberDigest: digest("a"), disposition: "none", categories: [] }] });
  assert.throws(() => parseRedactionManifest({ ...base, assurance: "verified" }));
  assert.throws(() => parseRedactionManifest({ ...base, members: [{ ...base.members[0]!, disposition: "applied" }] }));
  assert.throws(() => parseRedactionManifest({ ...base, members: [{ ...base.members[0]!, categories: ["paths", "paths"] }] }));
  assert.throws(() => parseRedactionManifest({ ...base, members: [{ ...base.members[0]!, categories: ["customer-specific-secret-value"] }] }));
  assert.throws(() => parseRedactionManifest({ ...base, members: [base.members[0]!, base.members[0]!] }));
});

test("redaction manifest rejects unsupported future schema versions", () => {
  const base = createRedactionManifest({ status: "partial", members: [{ memberDigest: digest("a"), disposition: "none", categories: [] }] });
  assert.throws(() => parseRedactionManifest({ ...base, schemaVersion: "2.0.0" }), /requires an explicit reader upgrade or migration/);
});
