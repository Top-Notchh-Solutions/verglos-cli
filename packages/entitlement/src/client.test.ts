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
