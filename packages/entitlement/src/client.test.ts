import { test } from "node:test";
import assert from "node:assert/strict";
import { verifyEntitlement } from "./client.js";

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
