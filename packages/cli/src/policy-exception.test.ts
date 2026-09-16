import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { digestPolicyException, parsePolicyException } from "@verglos/shared";
import { executePolicyExceptionShow } from "./policy-exception.js";

function exceptionFixture() {
  return parsePolicyException({
    schemaId: "urn:verglos:schema:policy-exception", schemaVersion: "1.0.0",
    exceptionId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    scope: { subjectId: `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`, observationIds: ["urn:uuid:22345678-1234-4123-8123-123456789abc"] },
    owner: { kind: "person", id: "owner" }, requestedBy: { kind: "person", id: "requester" }, reason: "temporary acceptance",
    compensatingControls: [{ description: "monitor", owner: { kind: "person", id: "owner" }, evidence: { system: "local", recordId: "audit-1", digest: { algorithm: "sha256", value: "b".repeat(64) } } }],
    reversalTriggers: ["fix shipped"], requestedAt: "2026-09-01T00:00:00.000Z", effectiveFrom: "2026-09-01T00:00:00.000Z", expiresAt: "2026-09-30T00:00:00.000Z", limitations: ["test fixture"],
  });
}

function approvalFixture() {
  const exception = exceptionFixture();
  return {
    schemaId: "urn:verglos:schema:exception-approval", schemaVersion: "1.0.0",
    approvalId: "urn:uuid:32345678-1234-4123-8123-123456789abc",
    target: { exceptionId: exception.exceptionId, requestDigest: digestPolicyException(exception) },
    decision: "approved", approver: { kind: "person", id: "approver", authority: "release" }, rationale: "bounded test approval",
    decidedAt: "2026-09-02T00:00:00.000Z", validUntil: "2026-09-20T00:00:00.000Z",
    auditReference: { system: "local", recordId: "approval-1", digest: { algorithm: "sha256", value: "c".repeat(64) } },
  };
}

async function writeFixture(root: string): Promise<{ exception: string; approval: string }> {
  const exception = join(root, "exception.json"); const approval = join(root, "approval.json");
  await writeFile(exception, JSON.stringify(exceptionFixture()));
  await writeFile(approval, JSON.stringify(approvalFixture()));
  return { exception, approval };
}

test("policy exception command emits the complete bounded JSON projection", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-exception-json-"));
  const output: string[] = []; const original = console.log;
  console.log = (line?: unknown) => output.push(String(line));
  try {
    const files = await writeFixture(root);
    assert.equal(await executePolicyExceptionShow(files.exception, files.approval, true), 0);
    assert.equal(output.length, 1);
    const projection = JSON.parse(output[0]!);
    assert.equal(projection.scope.observationIds.length, 1);
    assert.equal(projection.controls[0].description, "monitor");
    assert.equal(projection.approval.binding, "matched");
    assert.equal(projection.approval.applicability.status, "not-evaluated");
    assert.deepEqual(projection.exportChoices.map((choice: { format: string }) => choice.format), [".vgl", "JSON", "SARIF", "CycloneDX", "SPDX", "VEX", "HTML", "PDF"]);
  } finally { console.log = original; await rm(root, { recursive: true, force: true }); }
});

test("policy exception command presents control, approval, expiry, and unavailable format reasons", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-exception-human-"));
  const output: string[] = []; const original = console.log;
  console.log = (line?: unknown) => output.push(String(line));
  try {
    const files = await writeFixture(root);
    assert.equal(await executePolicyExceptionShow(files.exception, files.approval), 0);
    assert.ok(output.some((line) => line.includes("Controls: 1")));
    assert.ok(output.some((line) => line.includes("Approval: approved; binding matched; time within-time-window; applicability not-evaluated")));
    assert.ok(output.some((line) => line.includes("PDF: not-implemented")));
  } finally { console.log = original; await rm(root, { recursive: true, force: true }); }
});

test("policy exception command rejects symlink and oversized documents", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-exception-bounds-"));
  try {
    const files = await writeFixture(root); const link = join(root, "exception-link.json");
    await symlink(files.exception, link);
    assert.equal(await executePolicyExceptionShow(link, files.approval, true, true), 2);
    const oversized = join(root, "oversized.json");
    await writeFile(oversized, Buffer.alloc(256 * 1024 + 1));
    assert.equal(await executePolicyExceptionShow(oversized, files.approval, true, true), 2);
  } finally { await rm(root, { recursive: true, force: true }); }
});
