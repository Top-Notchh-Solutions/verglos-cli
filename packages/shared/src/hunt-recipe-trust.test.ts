import assert from "node:assert/strict";
import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { test } from "node:test";
import { canonicalizeJson } from "./schema.js";
import { isExecutableHuntRecipe, isTrustedHuntRecipe, huntRecipeDigest, huntRecipeTrustPolicyDigest, parseHuntRecipeTrustPolicy, verifyHuntRecipe, type HuntRecipeTrustStore } from "./hunt-recipe-trust.js";
import { parseHuntRecipe, type HuntRecipe } from "./hunt-recipe.js";

const at = "2026-01-02T00:00:00Z";
const feedId = "verglos-hunt-feed-fixture";
const origin = "https://recipes.example.test";
const keyId = "verglos-test-release";
const licenseText = "SPDX-License-Identifier: MIT\nFixture license text.";
const { privateKey, publicKey } = generateKeyPairSync("ed25519");

function makeRecipe(overrides: Partial<HuntRecipe> = {}): HuntRecipe {
  return parseHuntRecipe({
    schemaId: "urn:verglos:schema:hunt-recipe",
    schemaVersion: "1.0.0",
    recipeId: "hunt-sql",
    ruleId: "d1-1",
    targetSubjectId: "urn:verglos:subject:artifact:sha256:" + "a".repeat(64),
    imageDigest: { algorithm: "sha256", value: "b".repeat(64) },
    command: ["node", "check.js"],
    assertions: ["exit code is 0"],
    isolation: "container",
    limits: { timeoutMs: 1000, cpuMs: 900, memoryMb: 256, diskMb: 128, outputBytes: 10000, processes: 32, maxNetworkRequests: 0 },
    cleanup: "always",
    network: { mode: "denied", destinations: [], reason: "local reproduction" },
    redaction: "required",
    signature: { status: "verified", signer: keyId },
    ...overrides,
  });
}

function makeTrust(recipe: HuntRecipe, options: {
  feedId?: string;
  origin?: string;
  trustedOrigin?: string;
  issuedAt?: string;
  expiresAt?: string;
  revoked?: boolean;
  licenseText?: string;
  digestText?: string;
  keyId?: string;
  trustedKeyId?: string;
  includeRoot?: boolean;
  tamperSignature?: boolean;
} = {}): HuntRecipeTrustStore {
  const selectedKeyId = options.keyId ?? keyId;
  const text = options.licenseText ?? licenseText;
  const digestSource = options.digestText ?? text;
  const textDigest = createHash("sha256").update(digestSource, "utf8").digest("hex");
  const unsignedFeed = {
    schemaId: "urn:verglos:schema:hunt-recipe-feed" as const,
    schemaVersion: "1.0.0" as const,
    feedId: options.feedId ?? feedId,
    origin: options.origin ?? origin,
    issuedAt: options.issuedAt ?? "2026-01-01T00:00:00Z",
    expiresAt: options.expiresAt ?? "2026-02-01T00:00:00Z",
    entries: [{
      recipe,
      recipeDigest: huntRecipeDigest(recipe),
      license: {
        licenseId: "MIT",
        source: "https://licenses.example.test/MIT.txt",
        textDigest: { algorithm: "sha256" as const, value: textDigest },
        licenseText: text,
      },
    }],
    revokedRecipeIds: options.revoked ? [recipe.recipeId] : [],
  };
  const signature = sign(null, Buffer.from(canonicalizeJson(unsignedFeed), "utf8"), privateKey).toString("base64");
  const signedFeed = {
    ...unsignedFeed,
    signature: { algorithm: "ed25519" as const, keyId: selectedKeyId, value: options.tamperSignature ? `${signature.slice(0, -4)}AAAA` : signature },
  };
  return {
    schemaId: "urn:verglos:schema:hunt-recipe-trust-store",
    schemaVersion: "1.0.0",
    feeds: options.includeRoot === false ? [] : [{
      feedId: options.feedId ?? feedId,
      origin: options.trustedOrigin ?? options.origin ?? origin,
      keys: [{ keyId: options.trustedKeyId ?? keyId, publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString() }],
    }],
    signedFeeds: [signedFeed],
  };
}

const recipe = makeRecipe();

test("Hunt recipe trust verifies Ed25519 feed, exact recipe digest, and embedded license text", () => {
  const trust = makeTrust(recipe);
  const result = verifyHuntRecipe(recipe, trust, at);
  assert.equal(result.trusted, true);
  assert.equal(result.trusted && result.executable, true);
  assert.match(huntRecipeDigest(recipe), /^sha256:[a-f0-9]{64}$/);
  assert.equal(isTrustedHuntRecipe(recipe, trust, at), true);
  assert.equal(isExecutableHuntRecipe(recipe, trust, at), true);
  assert.equal(result.trusted && result.license.licenseId, "MIT");
  assert.equal(result.trusted && result.limitation, "signed publisher license declaration and embedded text digest verified; legal clearance is not implied");
});

test("an unknown feed placed before a trusted feed cannot shadow its matching recipe", () => {
  const trust = makeTrust(recipe);
  trust.signedFeeds.unshift({ ...trust.signedFeeds[0]!, feedId: "untrusted-shadow-feed" });
  assert.equal(isTrustedHuntRecipe(recipe, trust, at), true);
});

test("a recipe self-assertion or signer allowlist without a signed feed never grants trust", () => {
  assert.equal(isTrustedHuntRecipe(recipe, { signers: [keyId] } as never, at), false);
  assert.equal(isExecutableHuntRecipe(recipe, { signers: [keyId], recipeDigests: [huntRecipeDigest(recipe)] } as never, at), false);
});

test("Hunt trust rejects unknown feed, unknown key, origin mismatch, and a bad feed signature", () => {
  assert.deepEqual(verifyHuntRecipe(recipe, makeTrust(recipe, { includeRoot: false }), at), { trusted: false, reason: "unknown-feed" });
  assert.deepEqual(verifyHuntRecipe(recipe, makeTrust(recipe, { trustedKeyId: "other-key" }), at), { trusted: false, reason: "unknown-key" });
  assert.deepEqual(verifyHuntRecipe(recipe, makeTrust(recipe, { trustedOrigin: "https://other.example.test" }), at), { trusted: false, reason: "feed-origin-mismatch" });
  assert.deepEqual(verifyHuntRecipe(recipe, makeTrust(recipe, { tamperSignature: true }), at), { trusted: false, reason: "invalid-signature" });
});

test("Hunt trust rejects stale/future feeds, keys outside validity, revoked recipes, and unknown recipes", () => {
  assert.deepEqual(verifyHuntRecipe(recipe, makeTrust(recipe, { expiresAt: "2026-01-01T12:00:00Z" }), at), { trusted: false, reason: "feed-not-current" });
  assert.deepEqual(verifyHuntRecipe(recipe, makeTrust(recipe, { issuedAt: "2026-01-03T00:00:00Z" }), at), { trusted: false, reason: "feed-not-current" });
  const expiredKey = makeTrust(recipe);
  expiredKey.feeds[0]!.keys[0]!.expiresAt = "2026-01-02T00:00:00Z";
  assert.deepEqual(verifyHuntRecipe(recipe, expiredKey, at), { trusted: false, reason: "key-not-valid" });
  assert.deepEqual(verifyHuntRecipe(recipe, makeTrust(recipe, { revoked: true }), at), { trusted: false, reason: "recipe-revoked" });
  assert.deepEqual(verifyHuntRecipe(makeRecipe({ recipeId: "other-recipe" }), makeTrust(recipe), at), { trusted: false, reason: "recipe-not-found" });
});

test("Hunt trust rejects recipe mutation, signer mismatch, false signature status, and altered license text", () => {
  const changed = makeRecipe({ command: ["node", "other.js"] });
  assert.deepEqual(verifyHuntRecipe(changed, makeTrust(recipe), at), { trusted: false, reason: "recipe-digest-mismatch" });
  assert.deepEqual(verifyHuntRecipe(makeRecipe({ signature: { status: "verified", signer: "other-key" } }), makeTrust(makeRecipe({ signature: { status: "verified", signer: "other-key" } })), at), { trusted: false, reason: "recipe-signer-mismatch" });
  const invalidStatusRecipe = makeRecipe({ signature: { status: "unverified", signer: keyId } });
  assert.deepEqual(verifyHuntRecipe(invalidStatusRecipe, makeTrust(invalidStatusRecipe), at), { trusted: false, reason: "recipe-signature-status-invalid" });
  const badLicense = makeTrust(recipe, { digestText: "some other license text" });
  assert.deepEqual(verifyHuntRecipe(recipe, badLicense, at), { trusted: false, reason: "license-digest-mismatch" });
});

test("trust-store parsing rejects malformed, duplicate, and unknown entries", () => {
  assert.throws(() => parseHuntRecipeTrustPolicy({ schemaId: "urn:verglos:schema:hunt-recipe-trust-store", schemaVersion: "1.0.0", feeds: [], signedFeeds: [], unknown: true }));
  const duplicateRoot = makeTrust(recipe);
  duplicateRoot.feeds.push(duplicateRoot.feeds[0]!);
  assert.throws(() => parseHuntRecipeTrustPolicy(duplicateRoot));
  const malformedRecipe = makeTrust(recipe) as unknown as { signedFeeds: Array<{ entries: Array<{ recipe: unknown }> }> };
  malformedRecipe.signedFeeds[0]!.entries[0]!.recipe = { recipeId: "missing schema" };
  assert.throws(() => parseHuntRecipeTrustPolicy(malformedRecipe));
});

test("trust-store digest is canonical and commits to the signed feed and roots", () => {
  const trust = makeTrust(recipe);
  assert.equal(huntRecipeTrustPolicyDigest(trust), huntRecipeTrustPolicyDigest(structuredClone(trust)));
  assert.match(huntRecipeTrustPolicyDigest(trust), /^sha256:[a-f0-9]{64}$/);
});
