import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { canonicalizeJson, huntRecipeDigest, type HuntRecipe, type HuntRecipeTrustStore } from "@verglos/shared";

export const HUNT_TEST_TRUST_KEY_ID = "verglos-test-release";
const feedId = "verglos-hunt-feed-test-fixture";
const origin = "https://recipes.example.test";
const licenseText = "SPDX-License-Identifier: MIT\nFixture license text.";
const { privateKey, publicKey } = generateKeyPairSync("ed25519");

export function createHuntTestTrustStore(recipe: HuntRecipe): HuntRecipeTrustStore {
  const unsignedFeed = {
    schemaId: "urn:verglos:schema:hunt-recipe-feed" as const,
    schemaVersion: "1.0.0" as const,
    feedId,
    origin,
    issuedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2026-02-01T00:00:00Z",
    entries: [{
      recipe,
      recipeDigest: huntRecipeDigest(recipe),
      license: {
        licenseId: "MIT",
        source: "https://licenses.example.test/MIT.txt",
        textDigest: { algorithm: "sha256" as const, value: createHash("sha256").update(licenseText, "utf8").digest("hex") },
        licenseText,
      },
    }],
    revokedRecipeIds: [],
  };
  const value = sign(null, Buffer.from(canonicalizeJson(unsignedFeed), "utf8"), privateKey).toString("base64");
  return {
    schemaId: "urn:verglos:schema:hunt-recipe-trust-store",
    schemaVersion: "1.0.0",
    feeds: [{ feedId, origin, keys: [{ keyId: HUNT_TEST_TRUST_KEY_ID, publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString() }] }],
    signedFeeds: [{ ...unsignedFeed, signature: { algorithm: "ed25519", keyId: HUNT_TEST_TRUST_KEY_ID, value } }],
  };
}
