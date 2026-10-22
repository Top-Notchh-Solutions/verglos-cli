import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { auditPackageSurface, auditPublicPackageSet, isForbiddenPublicPackagePath, isSafePackageFileDeclaration } from "./package-surface-audit.mjs";

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

test("public package set requires exactly the seven reviewed package identities", () => {
  assert.deepEqual(auditPublicPackageSet([
    { name: "verglos" },
    { name: "@verglos/shared" },
    { name: "@verglos/scanner" },
    { name: "@verglos/reporter" },
    { name: "@verglos/mcp" },
    { name: "@verglos/entitlement" },
    { name: "@verglos/hunt" },
  ]), []);
  assert.ok(auditPublicPackageSet([{ name: "verglos" }]).some((failure) => failure.includes("exactly one @verglos/shared")));
});

test("package file allowlists reject traversal, glob, control-character, and duplicate declarations", () => {
  for (const value of ["dist/../private", "dist/*.js", "dist//index.js", "./dist", "dist/\u0000.js"]) {
    assert.equal(isSafePackageFileDeclaration(value), false, value);
  }
  assert.equal(isSafePackageFileDeclaration("dist"), true);
  assert.ok(auditPackageSurface({ ...base, files: ["dist", "dist/../private"] }, files).some((failure) => failure.includes("bounded exact relative path")));
  assert.ok(auditPackageSurface({ ...base, files: ["dist", "dist"] }, files).some((failure) => failure.includes("declared more than once")));
});

test("package file allowlists reject a declared path absent from the packed archive", () => {
  const failures = auditPackageSurface({ ...base, files: ["dist", "fixtures"] }, files);
  assert.ok(failures.some((failure) => failure.includes("missing from the packed archive: fixtures")));
});

test("source package contents audit binds private-key inspection to bounded regular-file reads", async () => {
  const source = await readFile(new URL("./check-package-contents.mjs", import.meta.url), "utf8");
  assert.match(source, /readBoundedRegularFile/u);
  assert.match(source, /MAX_AUDIT_FILE_BYTES/u);
  assert.doesNotMatch(source, /readFile\(file, "utf8"\)/u);
  assert.doesNotMatch(source, /readFile\(includedPath, "utf8"\)/u);
});
