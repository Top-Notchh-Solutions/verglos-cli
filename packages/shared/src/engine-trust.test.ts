import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import { test } from "node:test";
import { parseEngineManifest } from "./engine-manifest.js";
import { canonicalizeJson } from "./schema.js";
import { verifyEngineManifestSignature } from "./engine-trust.js";
import { isTrustedEngineSource } from "./engine-trust.js";

test("engine manifest signatures verify canonical unsigned bytes", () => {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const base = parseEngineManifest({ schemaId: "urn:verglos:schema:engine-manifest", schemaVersion: "1.0.0", engineId: "trivy", version: "1", artifacts: [{ platform: "linux/amd64", digest: `sha256:${"a".repeat(64)}`, size: 1, source: "https://example.com/trivy", license: "Apache-2.0" }], compatibleCli: ">=2", signature: { algorithm: "ed25519", keyId: "k1", value: "placeholder" } });
  const { signature: _signature, ...unsigned } = base;
  const value = sign(null, Buffer.from(canonicalizeJson(unsigned), "utf8"), privateKey).toString("base64");
  assert.deepEqual(verifyEngineManifestSignature({ ...base, signature: { ...base.signature, value } }, publicKey.export({ type: "spki", format: "pem" }).toString()), { trusted: true, keyId: "k1" });
});
test("engine sources require exact pinned HTTPS origins", () => { assert.equal(isTrustedEngineSource("https://mirror.example/engines/trivy", ["https://mirror.example"]), true); assert.equal(isTrustedEngineSource("http://mirror.example/trivy", ["https://mirror.example"]), false); assert.equal(isTrustedEngineSource("https://mirror.example.evil/trivy", ["https://mirror.example"]), false); });
