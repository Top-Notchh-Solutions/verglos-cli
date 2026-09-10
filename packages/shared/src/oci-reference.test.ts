import assert from "node:assert/strict";
import { test } from "node:test";
import { OciReferenceError, parseOciReference } from "./oci-reference.js";

test("OCI references parse immutable digests, tags, and platforms", () => {
  assert.deepEqual(parseOciReference("registry.example/team/app@sha256:" + "a".repeat(64), "linux/arm64"), {
    registry: "registry.example", repository: "team/app", digest: "sha256:" + "a".repeat(64), platform: { os: "linux", architecture: "arm64" },
  });
  assert.deepEqual(parseOciReference("nginx:1.27"), { registry: "docker.io", repository: "nginx", tag: "1.27" });
});

test("OCI references reject unsafe or ambiguous forms", () => {
  for (const value of ["https://registry.example/app:latest", "user:pass@registry.example/app:latest", "registry.example/app", "registry.example/../app:latest"]) {
    assert.throws(() => parseOciReference(value), (error: unknown) => error instanceof OciReferenceError);
  }
  assert.throws(() => parseOciReference("registry.example/app:latest", "linux"), (error: unknown) => error instanceof OciReferenceError && error.code === "INVALID_PLATFORM");
});
