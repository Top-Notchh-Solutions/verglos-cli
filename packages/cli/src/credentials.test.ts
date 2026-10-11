import { test } from "node:test";
import assert from "node:assert/strict";
import { getTrustedApiOrigin } from "./credentials.js";

test("getTrustedApiOrigin accepts and canonicalizes a bare HTTPS origin", () => {
  assert.equal(getTrustedApiOrigin(" https://api.example.test/ "), "https://api.example.test");
  assert.equal(getTrustedApiOrigin("https://api.example.test:8443"), "https://api.example.test:8443");
});

test("getTrustedApiOrigin rejects non-origin or non-HTTPS values", () => {
  for (const value of [
    "http://api.example.test",
    "https://api.example.test/api",
    "https://api.example.test/?next=/evil",
    "https://user:password@api.example.test",
    "not a url",
    "",
    null,
    42,
  ]) {
    assert.equal(getTrustedApiOrigin(value), null, String(value));
  }
});
