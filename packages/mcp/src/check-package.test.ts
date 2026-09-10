import assert from "node:assert/strict";
import test from "node:test";
import { checkPackage } from "./tools/check-package.js";

const ok = { packageExists: async () => true, resolveLatest: async () => "1.2.3" };

test("check_package reports complete clean coverage", async () => {
  const result = await checkPackage({ packageName: "safe-package" }, {
    ...ok,
    queryOsv: async () => ({ vulns: [], available: true }),
  });
  assert.equal(result.verdict, "safe");
  assert.equal(result.coverage, "complete");
  assert.deepEqual(result.limitations, []);
});

test("check_package never calls unavailable OSV a clean result", async () => {
  const result = await checkPackage({ packageName: "safe-package" }, {
    ...ok,
    queryOsv: async () => ({ vulns: [], available: false }),
  });
  assert.equal(result.verdict, "warn");
  assert.equal(result.coverage, "incomplete");
  assert.deepEqual(result.limitations, ["osv-unavailable"]);
  assert.match(result.reasoning, /incomplete/);
});

test("check_package preserves blocking CVEs", async () => {
  const result = await checkPackage({ packageName: "safe-package", version: "1.2.3" }, {
    packageExists: async () => true,
    queryOsv: async () => ({ available: true, vulns: [{ id: "CVE-1", database_specific: { severity: "HIGH" } }] }),
  });
  assert.equal(result.verdict, "block");
  assert.equal(result.coverage, "complete");
});

test("check_package reports registry and latest-version gaps", async () => {
  const unavailable = await checkPackage({ packageName: "safe-package" }, { packageExists: async () => null });
  assert.equal(unavailable.coverage, "incomplete");
  assert.deepEqual(unavailable.limitations, ["npm-registry-unavailable"]);

  const latest = await checkPackage({ packageName: "safe-package" }, {
    packageExists: async () => true,
    resolveLatest: async () => null,
    queryOsv: async () => ({ available: true, vulns: [] }),
  });
  assert.equal(latest.version, "latest");
  assert.deepEqual(latest.limitations, ["latest-version-unavailable"]);
});

test("check_package rejects malformed direct calls", async () => {
  await assert.rejects(() => checkPackage({} as any), /packageName/);
  await assert.rejects(() => checkPackage({ packageName: "x", version: 1 } as any), /version/);
});
