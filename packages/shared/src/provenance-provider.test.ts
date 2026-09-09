import assert from "node:assert/strict";
import { test } from "node:test";
import { matchProviderProvenance } from "./provenance-provider.js";

test("provider provenance matching preserves exact subject state", () => {
  const matched = matchProviderProvenance({ provider: "github", subjects: [{ name: "artifact", digest: { sha256: "abc" } }], expectedDigest: "abc" });
  assert.equal(matched.state, "matched"); assert.equal(matched.signatureStatus, "unverified");
  assert.equal(matchProviderProvenance({ provider: "npm", subjects: [{ digest: { sha256: "other" } }], expectedDigest: "abc" }).state, "mismatched");
  assert.equal(matchProviderProvenance({ provider: "buildkit", expectedDigest: "abc" }).state, "unavailable");
});
