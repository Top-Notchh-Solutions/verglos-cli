import assert from "node:assert/strict";
import { test } from "node:test";
import { createProviderProvenanceRecordMember, matchProviderProvenance } from "./provenance-provider.js";

test("provider provenance matching preserves exact subject state", () => {
  const matched = matchProviderProvenance({ provider: "github", subjects: [{ name: "artifact", digest: { sha256: "abc" } }], expectedDigest: "abc" });
  assert.equal(matched.state, "matched"); assert.equal(matched.signatureStatus, "unverified");
  assert.equal(matchProviderProvenance({ provider: "npm", subjects: [{ digest: { sha256: "other" } }], expectedDigest: "abc" }).state, "mismatched");
  assert.equal(matchProviderProvenance({ provider: "buildkit", expectedDigest: "abc" }).state, "unavailable");
});

test("provider provenance matching considers every declared subject digest", () => {
  const result = matchProviderProvenance({ provider: "github", subjects: [{ digest: { sha256: "wrong" } }, { digest: { sha256: "expected" } }], expectedDigest: "expected" });
  assert.equal(result.state, "matched");
  assert.equal(result.subjectDigest, "expected");
});

test("provider provenance mismatch exposes a deterministic observed digest", () => {
  const result = matchProviderProvenance({ provider: "npm", subjects: [{ digest: { sha256: "z" } }, { digest: { sha256: "a" } }], expectedDigest: "missing" });
  assert.equal(result.state, "mismatched");
  assert.equal(result.subjectDigest, "a");
});

test("provider provenance record member is canonical and keeps mismatch limitations", () => {
  const member = createProviderProvenanceRecordMember({ path: "provenance.json", provider: "npm", subjects: [{ digest: { sha256: "wrong" } }], expectedDigest: "expected" });
  assert.equal(member.kind, "provenance");
  assert.match(new TextDecoder().decode(member.bytes), /source-to-artifact identity/);
  assert.equal(new TextDecoder().decode(member.bytes), new TextDecoder().decode(createProviderProvenanceRecordMember({ path: "provenance.json", provider: "npm", subjects: [{ digest: { sha256: "wrong" } }], expectedDigest: "expected" }).bytes));
});
