import assert from "node:assert/strict";
import { test } from "node:test";
import { canonicalizeJson } from "./schema.js";
import { createProviderProvenanceRecordMember, matchProviderProvenance, parseProviderProvenanceDocument, type ProvenanceProvider } from "./provenance-provider.js";

const artifact = "a".repeat(64);
const expected = `sha256:${artifact}`;
const subjectId = `urn:verglos:subject:artifact:sha256:${artifact}`;
const sourceFor = (digest: string) => new TextEncoder().encode(JSON.stringify({
  _type: "https://in-toto.io/Statement/v1",
  subject: [{ name: "release.tgz", digest: { sha256: digest } }],
  predicateType: "https://slsa.dev/provenance/v1",
  predicate: { buildDefinition: { buildType: "fixture" }, runDetails: { builder: { id: "fixture-builder" }, metadata: { invocationId: "fixture-run" } } },
}));

test("provider match requires canonical SHA-256 and considers every in-toto subject", () => {
  for (const provider of ["github", "npm", "buildkit"] as const) {
    const result = matchProviderProvenance({ provider, subjects: [{ digest: { sha256: "b".repeat(64) } }, { digest: { sha256: artifact } }], expectedDigest: expected });
    assert.equal(result.provider, provider);
    assert.equal(result.providerIdentityStatus, "caller-declared");
    assert.equal(result.subjectDigest, expected);
    assert.equal(result.state, "matched");
    assert.equal(result.signatureStatus, "unverified");
  }
  assert.throws(() => matchProviderProvenance({ provider: "npm", subjects: [], expectedDigest: "abc" }), /sha256/);
  assert.throws(() => matchProviderProvenance({ provider: "fake" as unknown as ProvenanceProvider, subjects: [], expectedDigest: expected }), /provider must be/);
});

test("provider mismatch and unavailable states are explicit and deterministic", () => {
  const mismatch = matchProviderProvenance({ provider: "npm", subjects: [{ digest: { sha512: artifact, sha256: "f".repeat(64) } }, { digest: { sha256: "b".repeat(64) } }], expectedDigest: expected });
  assert.equal(mismatch.state, "mismatched");
  assert.equal(mismatch.subjectDigest, `sha256:${"b".repeat(64)}`);
  const unavailable = matchProviderProvenance({ provider: "buildkit", subjects: [{ digest: { sha512: artifact } }], expectedDigest: expected });
  assert.equal(unavailable.state, "unavailable");
  assert.equal(unavailable.subjectDigest, "");
});

test("provenance member preserves exact source and validates all three trust states", () => {
  const cases = [
    { provider: "github" as const, digest: artifact, state: "matched" },
    { provider: "npm" as const, digest: "b".repeat(64), state: "mismatched" },
    { provider: "buildkit" as const, digest: "", state: "unavailable" },
  ];
  for (const item of cases) {
    const input = item.digest ? sourceFor(item.digest) : new TextEncoder().encode(JSON.stringify({ _type: "https://in-toto.io/Statement/v1", subject: [{ name: "release.tgz", digest: { sha512: "not-usable-for-sha256-match" } }], predicate: {} }));
    const member = createProviderProvenanceRecordMember({ path: "provenance.json", provider: item.provider, subjectId, sourceBytes: input, expectedDigest: expected });
    assert.equal(member.kind, "provenance");
    const document = JSON.parse(new TextDecoder().decode(member.bytes)) as Record<string, unknown>;
    const parsed = parseProviderProvenanceDocument(document);
    assert.equal(parsed.match.state, item.state);
    assert.equal(parsed.provider, item.provider);
    assert.equal(parsed.signature.status, "unverified");
    assert.equal(Buffer.from(parsed.source.bytesBase64, "base64").equals(Buffer.from(input)), true);
    assert.equal(new TextDecoder().decode(member.bytes), `${canonicalizeJson(document)}\n`);
    const tampered = structuredClone(document) as { match: { state: string } };
    tampered.match.state = item.state === "matched" ? "mismatched" : "matched";
    assert.throws(() => parseProviderProvenanceDocument(tampered), /match state/);
  }
});
