import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { canonicalizeJson } from "./schema.js";
import { huntRecipeDigest, type HuntRecipeTrustStore } from "./hunt-recipe-trust.js";
import type { HuntRecipe } from "./hunt-recipe.js";

export const TEST_HUNT_TRUST_KEY_ID = "verglos-test-release";
const TEST_FEED_ID = "verglos-hunt-feed-test-fixture";
const TEST_ORIGIN = "https://recipes.example.test";
const TEST_LICENSE = "SPDX-License-Identifier: MIT\nFixture license text.";
const { privateKey, publicKey } = generateKeyPairSync("ed25519");

export function createTestHuntTrustStore(recipe: HuntRecipe, options: { readonly revoked?: boolean } = {}): HuntRecipeTrustStore {
  const unsignedFeed = {
    schemaId: "urn:verglos:schema:hunt-recipe-feed" as const,
    schemaVersion: "1.0.0" as const,
    feedId: TEST_FEED_ID,
    origin: TEST_ORIGIN,
    issuedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2026-02-01T00:00:00Z",
    entries: [{
      recipe,
      recipeDigest: huntRecipeDigest(recipe),
      license: {
        licenseId: "MIT",
        source: "https://licenses.example.test/MIT.txt",
        textDigest: { algorithm: "sha256" as const, value: createHash("sha256").update(TEST_LICENSE, "utf8").digest("hex") },
        licenseText: TEST_LICENSE,
      },
    }],
    revokedRecipeIds: options.revoked ? [recipe.recipeId] : [],
  };
  const value = sign(null, Buffer.from(canonicalizeJson(unsignedFeed), "utf8"), privateKey).toString("base64");
  return {
    schemaId: "urn:verglos:schema:hunt-recipe-trust-store",
    schemaVersion: "1.0.0",
    feeds: [{
      feedId: TEST_FEED_ID,
      origin: TEST_ORIGIN,
      keys: [{ keyId: TEST_HUNT_TRUST_KEY_ID, publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString() }],
    }],
    signedFeeds: [{ ...unsignedFeed, signature: { algorithm: "ed25519", keyId: TEST_HUNT_TRUST_KEY_ID, value } }],
  };
}
