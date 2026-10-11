import assert from "node:assert/strict";
import { test } from "node:test";
import { auditPackageSurface, auditPublicPackageSet, isForbiddenPublicPackagePath } from "./package-surface-audit.mjs";

const files = ["dist/index.js", "dist/index.d.ts", "dist/server.js", "dist/server.d.ts"];
const base = {
  name: "@verglos/mcp",
  files: ["dist"],
  main: "./dist/index.js",
  types: "./dist/index.d.ts",
  exports: {
    ".": { import: "./dist/index.js", types: "./dist/index.d.ts" },
    "./server": { import: "./dist/server.js", types: "./dist/server.d.ts" },
  },
};

test("package surface accepts every declared entrypoint present in the archive", () => {
  assert.deepEqual(auditPackageSurface(base, files), []);
});

test("package surface rejects missing, unsafe, and non-relative entrypoints", () => {
  assert.deepEqual(
    auditPackageSurface({ ...base, main: "../outside.js", exports: { ".": { import: "./dist/missing.js" } } }, files),
    [
      "@verglos/mcp.main must be a package-relative file path",
      "@verglos/mcp.exports...import points to a file missing from the packed archive: dist/missing.js",
    ],
  );
  assert.match(auditPackageSurface({ ...base, types: "/tmp/index.d.ts" }, files)[0], /package-relative/u);
});

test("public package surface rejects install hooks and implicit Trivy package dependencies", () => {
  const failures = auditPackageSurface({
    ...base,
    scripts: { postinstall: "download-trivy" },
    optionalDependencies: { trivy: "*" },
  }, files);
  assert.ok(failures.some((failure) => failure.includes("postinstall")));
  assert.ok(failures.some((failure) => failure.includes("external engine")));
});

test("packed public surface rejects the internal CLI process-fixture helper", () => {
  assert.equal(isForbiddenPublicPackagePath("dist/cli-fixture.js"), true);
});

test("public package set requires exactly the six reviewed package identities", () => {
  assert.deepEqual(auditPublicPackageSet([
    { name: "verglos" },
    { name: "@verglos/shared" },
    { name: "@verglos/scanner" },
    { name: "@verglos/reporter" },
    { name: "@verglos/mcp" },
    { name: "@verglos/entitlement" },
  ]), []);
  assert.ok(auditPublicPackageSet([{ name: "verglos" }]).some((failure) => failure.includes("exactly one @verglos/shared")));
});
