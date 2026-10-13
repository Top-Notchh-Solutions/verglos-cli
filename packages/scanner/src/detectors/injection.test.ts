import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { injectionDetector } from "./injection.js";
import type { ScannedFile } from "../walker.js";

const root = mkdtempSync(join(tmpdir(), "verglos-injection-"));
after(() => rmSync(root, { recursive: true, force: true }));

let sequence = 0;
function fixture(source: string): ScannedFile[] {
  const relativePath = `fixture-${sequence++}.js`;
  const path = join(root, relativePath);
  writeFileSync(path, source, "utf8");
  return [{ path, relativePath }];
}

test("D1-008 detects an unfiltered request-body merge", async () => {
  const findings = await injectionDetector.run(fixture("export function update(req) { return Object.assign({}, req.body); }"), root);
  const finding = findings.find((candidate) => candidate.rule === "D1-008");
  assert.ok(finding);
  assert.equal(finding.severity, "high");
  assert.equal(finding.confidence, "high");
  assert.ok(finding.fix);
  assert.match(finding.fix, /__proto__/u);
});

test("D1-008 does not treat an explicit safe merge as a prototype-pollution finding", async () => {
  const findings = await injectionDetector.run(fixture("export function update(req) { return Object.fromEntries(Object.entries(req.body).filter(([key]) => key !== '__proto__')); }"), root);
  assert.equal(findings.some((candidate) => candidate.rule === "D1-008"), false);
});
