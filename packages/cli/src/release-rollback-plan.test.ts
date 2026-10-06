import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeReleaseRollbackPlan } from "./release-rollback-plan.js";

test("rollback-plan emits an admitted immutable transition only with approval", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-rollback-plan-"));
  await writeFile(join(root, "current.json"), JSON.stringify({ kind: "npm-package", identity: "verglos", immutableRef: "v2.0.0-alpha.1" }));
  await writeFile(join(root, "target.json"), JSON.stringify({ kind: "npm-package", identity: "verglos", immutableRef: `sha256:${"a".repeat(64)}` }));
  const lines: string[] = []; const original = console.log; console.log = (value?: unknown) => lines.push(String(value));
  try { assert.equal(await executeReleaseRollbackPlan({ currentPath: join(root, "current.json"), targetPath: join(root, "target.json"), reason: "revert compromised publication", approved: true, json: true }), 0); }
  finally { console.log = original; }
  assert.equal(JSON.parse(lines[0]!).allowed, true);
});

test("rollback-plan fails closed without approval", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-rollback-denied-"));
  const ref = JSON.stringify({ kind: "web-deployment", identity: "verglos.com", immutableRef: "https://vercel.com/deployments/abc" });
  await writeFile(join(root, "current.json"), ref); await writeFile(join(root, "target.json"), JSON.stringify({ kind: "web-deployment", identity: "verglos.com", immutableRef: "https://vercel.com/deployments/def" }));
  assert.equal(await executeReleaseRollbackPlan({ currentPath: join(root, "current.json"), targetPath: join(root, "target.json"), reason: "operator review", approved: false, json: true, quiet: true }), 78);
});
