import assert from "node:assert/strict";
import { test } from "node:test";
import { canonicalEngineManifest, parseEngineManifest } from "./engine-manifest.js";

const manifest = { schemaId: "urn:verglos:schema:engine-manifest", schemaVersion: "1.0.0", engineId: "trivy", version: "0.60.0", artifacts: [{ platform: "darwin/arm64", digest: `sha256:${"a".repeat(64)}`, size: 10, source: "https://example.com/trivy", license: "Apache-2.0" }], compatibleCli: ">=2.0.0", signature: { algorithm: "ed25519", keyId: "release-1", value: "signed" } } as const;
test("engine manifests validate artifacts and canonicalize deterministically", () => { const parsed = parseEngineManifest(manifest); assert.equal(canonicalEngineManifest(parsed), canonicalEngineManifest({ ...manifest, artifacts: [...manifest.artifacts] })); });
test("engine manifests reject mutable or unsafe artifact metadata", () => { assert.throws(() => parseEngineManifest({ ...manifest, artifacts: [{ ...manifest.artifacts[0], digest: "latest" }] })); });
