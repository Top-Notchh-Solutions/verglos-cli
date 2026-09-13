import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { runScan } from "./index.js";

test("network-denied scans skip registry and advisory requests and report incomplete coverage", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-network-policy-"));
  const packageName = `verglos-offline-${randomUUID().slice(0, 12)}`;
  await mkdir(join(root, "public", "vendor"), { recursive: true });
  await writeFile(join(root, "package.json"), JSON.stringify({ name: "network-policy-fixture", dependencies: { [packageName]: "1.0.0" } }));
  await writeFile(join(root, "package-lock.json"), JSON.stringify({ name: "network-policy-fixture", lockfileVersion: 3, packages: { "": { name: "network-policy-fixture", dependencies: { [packageName]: "1.0.0" } }, [`node_modules/${packageName}`]: { version: "1.0.0" } } }));
  await writeFile(join(root, "public", "vendor", "offline-lib@1.2.3.js"), "globalThis.fixture = true;\n");
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = (async () => { fetchCalls++; throw new Error("network must not be used"); }) as typeof fetch;
  try {
    const result = await runScan({ projectRoot: root, detectors: ["dependencies", "slopsquat", "vendored-cves"], allowNetwork: false, noProvenance: true });
    assert.equal(fetchCalls, 0);
    assert.equal(result.coverage?.status, "incomplete");
    assert.match(result.coverage?.limitations.join(" ") ?? "", /OSV dependency advisory lookup skipped/);
    assert.match(result.coverage?.limitations.join(" ") ?? "", /npm package-existence lookup skipped/);
    assert.match(result.coverage?.limitations.join(" ") ?? "", /OSV vendored-library lookup skipped/);
    assert.equal(result.findings.some((finding) => finding.package === packageName), false);
  } finally {
    globalThis.fetch = originalFetch;
    await rm(root, { recursive: true, force: true });
  }
});
