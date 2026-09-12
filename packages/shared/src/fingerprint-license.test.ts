import assert from "node:assert/strict";
import { test } from "node:test";
import { generateLicenseKey, verifyLicenseKeyChecksum } from "./fingerprint.js";

test("license keys use cryptographic randomness and a verifiable checksum", () => {
  const first = generateLicenseKey("test-secret");
  const second = generateLicenseKey("test-secret");
  assert.match(first, /^vg_[a-f0-9]{8}_[a-f0-9]{8}_[a-f0-9]{8}$/);
  assert.notEqual(first, second);
  assert.equal(verifyLicenseKeyChecksum(first, "test-secret"), true);
  assert.equal(verifyLicenseKeyChecksum(first, "wrong-secret"), false);
});

test("license key generation does not depend on Math.random", () => {
  const original = Math.random;
  Math.random = () => 0;
  try {
    const first = generateLicenseKey("test-secret");
    const second = generateLicenseKey("test-secret");
    assert.notEqual(first, second);
  } finally {
    Math.random = original;
  }
});
