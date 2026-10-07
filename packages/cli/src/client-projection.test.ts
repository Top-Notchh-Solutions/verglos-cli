import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executeClientProjection } from "./client-projection.js";
import { clientProjectionDigest } from "@verglos/shared";

test("client projection command admits an exact approval-bound projection", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-client-projection-command-"));
  const projection = { organizationId: "org_acme", clientWorkspaceId: "client_zenith", recordDigest: `sha256:${"a".repeat(64)}`, decision: "PASS" as const };
  const approvedProjection = { ...projection, schemaId: "urn:verglos:schema:client-projection", schemaVersion: "1.0.0" } as const;
  const approval = { action: "client-projection-upload" as const, approvalId: "approval_1", organizationId: "org_acme", clientWorkspaceId: "client_zenith", recordDigest: projection.recordDigest, projectionDigest: clientProjectionDigest(approvedProjection), approvedBy: "owner_1", issuedAt: "2026-10-06T00:00:00.000Z", expiresAt: "2099-10-07T00:00:00.000Z" };
  await writeFile(join(root, "projection.json"), JSON.stringify(projection));
  await writeFile(join(root, "approval.json"), JSON.stringify(approval));
  const output: string[] = []; const original = console.log; console.log = (value?: unknown) => output.push(String(value));
  try { assert.equal(await executeClientProjection(join(root, "projection.json"), join(root, "approval.json"), "org_acme", true), 0); }
  finally { console.log = original; }
  assert.equal(JSON.parse(output[0]!).status, "ready");
});
