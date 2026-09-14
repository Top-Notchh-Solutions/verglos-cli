import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyEntitlement } from "./client.js";
import { generateEntitlementKeyPair, privateKeyFromPem } from "./keys.js";
import { signEntitlement } from "./server.js";
import type { EntitlementClaims } from "./types.js";

const now = () => Math.floor(Date.now() / 1000);

function makeClaims(overrides: Partial<EntitlementClaims> = {}): Omit<
  EntitlementClaims,
  "iat" | "exp"
> {
  return {
    keyHash: "test-key-hash",
    tier: "pro",
    projects: [],
    seats: 1,
    features: ["fix", "ci", "monitor"],
    ...overrides,
  };
}

test("verifyEntitlement: rejects a token that does not have three segments", async () => {
  const result = await verifyEntitlement("nope");
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /malformed/);
});

test("verifyEntitlement: rejects a token with an unexpected JWT header", async () => {
  const wrongHeader = Buffer.from('{"alg":"HS256","typ":"JWT"}', "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  const token = `${wrongHeader}.eyJ9.sig`;
  const result = await verifyEntitlement(token);
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /header/);
});

test("verifyEntitlement: rejects when claims are not valid JSON", async () => {
  const goodHeader = Buffer.from('{"alg":"EdDSA","typ":"JWT"}', "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  const badClaims = Buffer.from("not-json", "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  const token = `${goodHeader}.${badClaims}.sig`;
  const result = await verifyEntitlement(token);
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /claims/);
});

test("verifyEntitlement: sign→verify roundtrip with a matching keypair (current slot)", async () => {
  const kp = generateEntitlementKeyPair();
  const token = signEntitlement({
    claims: makeClaims(),
    privateKey: privateKeyFromPem(kp.privateKeyPem),
  });
  // Inject the freshly generated pubkey in the CURRENT slot only —
  // the successor slot is a placeholder that must not be reachable
  // for a valid signature.
  const result = await verifyEntitlement(token, Date.now(), {
    pinnedKeys: [kp.publicKeyBase64Url, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"],
  });
  assert.equal(result.valid, true);
  assert.equal(result.claims?.tier, "pro");
});

test("verifyEntitlement: successor slot also verifies (rotation path)", async () => {
  const kp = generateEntitlementKeyPair();
  const token = signEntitlement({
    claims: makeClaims({ tier: "studio" }),
    privateKey: privateKeyFromPem(kp.privateKeyPem),
  });
  const result = await verifyEntitlement(token, Date.now(), {
    pinnedKeys: ["AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", kp.publicKeyBase64Url],
  });
  assert.equal(result.valid, true);
  assert.equal(result.claims?.tier, "studio");
});

test("verifyEntitlement: v2 kid selects only its pinned key and preserves v1 compatibility", async () => {
  const legacy = generateEntitlementKeyPair();
  const successor = generateEntitlementKeyPair();
  const nowSec = now();
  const v2Claims: Partial<EntitlementClaims> = {
    schemaVersion: 2,
    userId: "user-123",
    tenantId: "tenant-456",
    role: "owner",
    plan: "pro",
    capabilities: ["scan", "fix"],
    allowances: { seats: 2, recordsPerMonth: 100 },
    catalogVersion: "2026-09-12.1",
    tokenId: "123e4567-e89b-42d3-a456-426614174000",
  };
  const token = signEntitlement({
    claims: { ...makeClaims({ ...v2Claims, keyHash: "a".repeat(64) }), iat: nowSec, exp: nowSec + 3600 },
    privateKey: privateKeyFromPem(successor.privateKeyPem),
    keyId: "successor-v1",
  });
  const rotated = await verifyEntitlement(token, Date.now(), {
    pinnedKeysById: { "legacy-v1": legacy.publicKeyBase64Url, "successor-v1": successor.publicKeyBase64Url },
  });
  assert.equal(rotated.valid, true, rotated.reason);
  assert.equal(rotated.claims?.tenantId, "tenant-456");

  const wrongKey = await verifyEntitlement(token, Date.now(), {
    pinnedKeys: [successor.publicKeyBase64Url],
    pinnedKeysById: { "legacy-v1": legacy.publicKeyBase64Url, "successor-v1": legacy.publicKeyBase64Url },
  });
  assert.equal(wrongKey.valid, false, "kid verification must not fall back to an unrelated legacy pin");
});

test("verifyEntitlement: rejects malformed v2 identifiers and unbounded capability lists", async () => {
  const kp = generateEntitlementKeyPair();
  const nowSec = now();
  const baseV2: Partial<EntitlementClaims> = {
    schemaVersion: 2, userId: "user-123", tenantId: "tenant-456", role: "owner", plan: "pro",
    capabilities: ["scan"], allowances: { seats: 2 }, catalogVersion: "2026-09-12.1",
    tokenId: "123e4567-e89b-42d3-a456-426614174000",
  };
  for (const patch of [{ tokenId: "not-a-uuid" }, { capabilities: Array.from({ length: 257 }, (_, i) => `cap.${i}`) }]) {
    const token = signEntitlement({
      claims: { ...makeClaims({ ...baseV2, ...patch, keyHash: "a".repeat(64) }), iat: nowSec, exp: nowSec + 3600 },
      privateKey: privateKeyFromPem(kp.privateKeyPem), keyId: "successor-v1",
    });
    const result = await verifyEntitlement(token, Date.now(), { pinnedKeysById: { "successor-v1": kp.publicKeyBase64Url } });
    assert.equal(result.valid, false);
  }
});

test("verifyEntitlement: rejects v2 claims that omit the schema version", async () => {
  const kp = generateEntitlementKeyPair();
  const nowSec = now();
  const token = signEntitlement({
    claims: { ...makeClaims({ keyHash: "a".repeat(64), tenantId: "tenant-1" }), iat: nowSec, exp: nowSec + 3600 },
    privateKey: privateKeyFromPem(kp.privateKeyPem),
  });
  const result = await verifyEntitlement(token, Date.now(), { pinnedKeys: [kp.publicKeyBase64Url] });
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /schema version/u);
});

test("verifyEntitlement: legacy compliance tier is exposed canonically as enterprise", async () => {
  const kp = generateEntitlementKeyPair();
  const legacy = signEntitlement({
    claims: makeClaims({ tier: "compliance" as EntitlementClaims["tier"] }),
    privateKey: privateKeyFromPem(kp.privateKeyPem),
  });
  assert.equal((await verifyEntitlement(legacy, Date.now(), { pinnedKeys: [kp.publicKeyBase64Url] })).claims?.tier, "enterprise");
});

test("verifyEntitlement: rejects token signed by an unpinned key", async () => {
  const signer = generateEntitlementKeyPair();
  const unrelated = generateEntitlementKeyPair();
  const token = signEntitlement({
    claims: makeClaims(),
    privateKey: privateKeyFromPem(signer.privateKeyPem),
  });
  const result = await verifyEntitlement(token, Date.now(), {
    pinnedKeys: [unrelated.publicKeyBase64Url, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"],
  });
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /signature/);
});

test("verifyEntitlement: rejects a tampered payload (signature no longer matches)", async () => {
  const kp = generateEntitlementKeyPair();
  const token = signEntitlement({
    claims: makeClaims(),
    privateKey: privateKeyFromPem(kp.privateKeyPem),
  });
  // Flip the tier from "pro" to "studio" by rewriting the claims segment.
  const [header, claims, sig] = token.split(".");
  const tampered = JSON.stringify({
    ...JSON.parse(Buffer.from(claims!.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")),
    tier: "studio",
  });
  const tamperedClaims = Buffer.from(tampered, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
  const forged = `${header}.${tamperedClaims}.${sig}`;
  const result = await verifyEntitlement(forged, Date.now(), {
    pinnedKeys: [kp.publicKeyBase64Url, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"],
  });
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /signature/);
});

test("verifyEntitlement: expired token past 7-day grace fails", async () => {
  const kp = generateEntitlementKeyPair();
  // Sign with iat far in the past so exp is well past the 7-day grace.
  const nowSec = now();
  const wayBack = nowSec - 30 * 24 * 60 * 60;
  const token = signEntitlement({
    claims: { ...makeClaims(), iat: wayBack, exp: wayBack + 60 },
    privateKey: privateKeyFromPem(kp.privateKeyPem),
  });
  const result = await verifyEntitlement(token, Date.now(), {
    pinnedKeys: [kp.publicKeyBase64Url, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"],
  });
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /expired/);
});

test("verifyEntitlement: rejects structurally invalid claims after signature verification", async () => {
  const kp = generateEntitlementKeyPair();
  const token = signEntitlement({
    claims: { ...makeClaims(), seats: -1 },
    privateKey: privateKeyFromPem(kp.privateKeyPem),
  });
  const result = await verifyEntitlement(token, Date.now(), { pinnedKeys: [kp.publicKeyBase64Url] });
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /invalid seats/);
});

test("verifyEntitlement: rejects future-issued tokens outside clock skew", async () => {
  const kp = generateEntitlementKeyPair();
  const nowSec = now();
  const token = signEntitlement({
    claims: { ...makeClaims(), iat: nowSec + 10 * 60, exp: nowSec + 11 * 60 },
    privateKey: privateKeyFromPem(kp.privateKeyPem),
  });
  const result = await verifyEntitlement(token, Date.now(), { pinnedKeys: [kp.publicKeyBase64Url] });
  assert.equal(result.valid, false);
  assert.match(result.reason ?? "", /future/);
});
