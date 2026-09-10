import assert from "node:assert/strict";
import { test } from "node:test";
import { OciResolutionError, resolveOciDocument } from "./oci-resolver.js";

const digest = "a".repeat(64);
test("OCI resolver preserves index child identity and platforms", () => {
  const result = resolveOciDocument(`registry.example/app@sha256:${digest}`, new TextEncoder().encode(JSON.stringify({ mediaType: "application/vnd.oci.image.index.v1+json", manifests: [{ digest: `sha256:${digest}`, size: 12, platform: { os: "linux", architecture: "amd64" } }] })));
  assert.equal(result.kind, "oci-index");
  assert.equal((result as { manifests: unknown[] }).manifests.length, 1);
});

test("OCI resolver refuses mutable tags and invalid documents", () => {
  assert.throws(() => resolveOciDocument("registry.example/app:latest", new TextEncoder().encode("{}")), (error: unknown) => error instanceof OciResolutionError && error.code === "TAG_NOT_IMMUTABLE");
  assert.throws(() => resolveOciDocument(`registry.example/app@sha256:${digest}`, new TextEncoder().encode("{}")), (error: unknown) => error instanceof OciResolutionError);
});
