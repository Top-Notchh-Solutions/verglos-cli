import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { mkdtemp, rm, writeFile, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { OBSERVATION_SCHEMA, assembleReleaseRecord, canonicalizeJson, createApprovalReceipt, createFreePolicyProfile, createPolicyEvaluation, createReleaseDecision, createSubject, describeRecordMember, parseFailure, policyDocumentDigest, putRecordMember, readApprovalReceipt } from "@verglos/shared";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createVerglosMcpServer } from "./server.js";
import { dispatchTool, jsonResponse, listAdvertisedTools } from "./server.js";

function responseText(result: Awaited<ReturnType<typeof dispatchTool>>): Record<string, unknown> {
  return JSON.parse(result.content[0]!.text) as Record<string, unknown>;
}

function assertMcpError(result: Awaited<ReturnType<typeof dispatchTool>>, expected: { error: string; code: string; message: string; category: string }): void {
  const payload = responseText(result);
  const { error, code, message, category } = expected;
  assert.deepEqual({ ok: payload.ok, error: payload.error, code: payload.code, message: payload.message }, { ok: false, error, code, message });
  assert.deepEqual(Object.keys(payload).sort(), ["code", "error", "failure", "message", "ok"]);
  assert.equal(parseFailure(payload.failure).category, category);
}

async function createPolicyRecord(root: string, references: { observationId?: string; evidenceDigest?: string } = {}) {
  const recordStore = join(root, "record-store");
  const policy = createFreePolicyProfile();
  const policyBytes = Buffer.from(canonicalizeJson(policy));
  const subject = createSubject({ kind: "filesystem", treeDigest: { algorithm: "sha256", value: "a".repeat(64) }, ignorePolicyDigest: { algorithm: "sha256", value: "b".repeat(64) }, entryCount: 1 });
  const evidenceBytes = Buffer.from('{"producer":"fixture","coverage":"native"}');
  const evidenceDigest = createHash("sha256").update(evidenceBytes).digest("hex");
  const observation = {
    schemaId: OBSERVATION_SCHEMA.id,
    schemaVersion: "1.0.0",
    observationId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    subjectId: subject.subjectId,
    origin: { kind: "native", producerId: "verglos.native-scanner", runId: "urn:uuid:22345678-1234-4123-8123-123456789abc", ruleId: "D4-005" },
    coverageClass: "native",
    category: "secrets",
    title: "Fixture observation",
    description: "Fixture evidence for the MCP policy contract test.",
    locations: [{ kind: "source", path: "src/example.ts", startLine: 1 }],
    severity: { original: { system: "fixture", value: "low" }, normalized: "low", mapping: { id: "verglos.severity-map", version: "1.0.0" } },
    confidence: { level: "high", method: "fixture", mappingVersion: "1.0.0" },
    remediation: { summary: "No action required." },
    evidence: [],
    references: [],
    extensions: {},
  };
  const subjectBytes = Buffer.from(canonicalizeJson(subject));
  const observationBytes = Buffer.from(canonicalizeJson(observation));
  const evaluation = createPolicyEvaluation({
    schemaId: "urn:verglos:schema:policy-evaluation",
    schemaVersion: "1.0.0",
    evaluationId: "urn:uuid:32345678-1234-4123-8123-123456789abc",
    policy: { id: policy.policyId, version: policy.policyVersion, digest: { algorithm: "sha256", value: policyDocumentDigest(policy).slice(7) } },
    subjectId: subject.subjectId,
    subjectMatch: { status: "matched", observedSubjectId: subject.subjectId },
    evaluatedAt: "2026-09-13T00:00:00Z",
    checks: [{ id: policy.checks[0]!.id, requirement: policy.checks[0]!.requirement, onFailure: policy.checks[0]!.onFailure, status: "satisfied", evidenceDigests: [{ algorithm: "sha256", value: references.evidenceDigest ?? evidenceDigest }], observationIds: [references.observationId ?? observation.observationId], freshness: { status: "current", checkedAt: "2026-09-12T23:00:00Z", validUntil: "2026-09-14T00:00:00Z" }, owner: "security", reason: "Fixture check is current.", nextAction: "Preserve the record." }],
    limitations: ["Fixture only; no producer truth is implied."],
  });
  const releaseDecision = createReleaseDecision({ decisionId: "urn:uuid:52345678-1234-4123-8123-123456789abc", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], issuedBy: { kind: "person", id: "fixture-owner", authority: "fixture only" }, generatedAt: "2026-09-13T00:00:00Z", limitations: ["Fixture only; no producer truth is implied."] });
  const payloads = [
    { path: "policy.json", kind: "policy" as const, bytes: policyBytes },
    { path: "subject.json", kind: "subject" as const, bytes: subjectBytes },
    { path: "observation.json", kind: "observation" as const, bytes: observationBytes },
    { path: "evidence.json", kind: "export" as const, bytes: evidenceBytes },
    { path: "policy-evaluation.json", kind: "policy-evaluation" as const, bytes: Buffer.from(canonicalizeJson(evaluation)) },
    { path: "release-decision.json", kind: "release-decision" as const, bytes: Buffer.from(canonicalizeJson(releaseDecision)), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } },
  ];
  const entries = [];
  for (const payload of payloads) {
    const stored = await putRecordMember(recordStore, payload.path, payload.bytes);
    entries.push({ ...describeRecordMember({ path: payload.path, kind: payload.kind, mediaType: "application/json", bytes: payload.bytes, required: true }), digest: { algorithm: "sha256" as const, value: stored.digest.slice(7) }, ...(payload.schema ? { schema: payload.schema } : {}) });
  }
  const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:42345678-1234-4123-8123-123456789abc", generatedAt: "2026-09-13T00:00:00Z", generator: { id: "verglos.mcp.test", version: "1.0.0" }, members: entries, redaction: { status: "not-required" }, limitations: ["Fixture record."] });
  const manifestPath = join(root, "record.json");
  await writeFile(manifestPath, canonicalizeJson(manifest));
  return { manifestPath, recordStore, manifest };
}

test("MCP tools/list publishes shared capability metadata for every tool", () => {
  const tools = listAdvertisedTools();
  assert.equal(tools.length, 10);
  assert.equal(new Set(tools.map((tool) => tool.name)).size, tools.length);
  assert.deepEqual(tools.map((tool) => tool.name), [
    "verglos_check_before_write", "verglos_check_package", "verglos_scan", "verglos_explain_finding", "verglos_policy_check",
    "verglos_hunt_finding", "verglos_hunt_report", "verglos_hunt_before_write", "verglos_hunt_explain_verdict", "verglos_attest",
  ]);
  for (const tool of tools) {
    const capability = tool._meta?.["verglos/capability"] as unknown as Record<string, unknown> | undefined;
    assert.ok(capability, `${tool.name} must publish capability metadata`);
    assert.equal(typeof capability.action, "string");
    assert.equal(typeof capability.plan, "string");
    assert.equal(typeof capability.maturity, "string");
    assert.equal(typeof capability.approvalRequired, "boolean");
    assert.ok(Array.isArray(capability.inputFields));
    assert.ok(Array.isArray(capability.outputFields));
  }
  const scan = tools.find((tool) => tool.name === "verglos_scan");
  assert.deepEqual(scan?._meta, { "verglos/capability": { tool: "verglos_scan", action: "network", plan: "free", maturity: "shipped", approvalRequired: true, sideEffect: "network", networkTargets: ["https://api.osv.dev", "https://registry.npmjs.org"], inputFields: ["projectRoot", "limit", "noProvenance", "approvalReceipt"], outputFields: ["projectRoot", "scannedAt", "durationMs", "score", "coverage", "provenance", "findingCount", "findings", "truncated", "headline", "failure"] } });
  const hunt = tools.find((tool) => tool.name === "verglos_hunt_report");
  assert.equal((hunt?._meta["verglos/capability"] as { sideEffect: string }).sideEffect, "process");
});

test("MCP advertised schemas, capability inputs, and approval requirements agree for every tool", () => {
  for (const tool of listAdvertisedTools()) {
    const capability = tool._meta?.["verglos/capability"] as { inputFields: readonly string[]; approvalRequired: boolean; action: string; sideEffect: string };
    const schema = tool.inputSchema as { properties: Record<string, unknown>; additionalProperties?: boolean };
    assert.deepEqual(Object.keys(schema.properties).sort(), [...capability.inputFields].sort(), tool.name);
    assert.equal(schema.additionalProperties, false, `${tool.name} must reject undeclared arguments`);
    assert.equal(Object.hasOwn(schema.properties, "approvalReceipt"), capability.approvalRequired, `${tool.name} receipt field must match authority`);
    assert.equal(typeof capability.action, "string");
    assert.equal(typeof capability.sideEffect, "string");
  }
  const scan = listAdvertisedTools().find((tool) => tool.name === "verglos_scan")!;
  const scanProperties = scan.inputSchema.properties as Record<string, { type?: string; minimum?: number; maximum?: number }>;
  assert.deepEqual(scanProperties.limit, { type: "integer", minimum: 0, maximum: 1000, description: "Maximum findings returned; 0 returns all findings." });
  assert.equal(scanProperties.noProvenance?.type, "boolean");
  const policy = listAdvertisedTools().find((tool) => tool.name === "verglos_policy_check")!;
  const policyProperties = policy.inputSchema.properties as Record<string, { type?: string; maxLength?: number }>;
  assert.deepEqual(policyProperties.manifestPath, { type: "string", maxLength: 4096, description: "Absolute path to Release Record manifest JSON (max 8 MiB); symlinks are rejected." });
  assert.deepEqual(policyProperties.recordStore, { type: "string", maxLength: 4096, description: "Absolute path to the content-addressed store (max 256 members / 32 MiB total); root and members must be regular files/directories, not symlinks." });
});

test("every authority-gated MCP tool denies before its handler when no approval is supplied", async () => {
  for (const tool of listAdvertisedTools()) {
    const capability = tool._meta?.["verglos/capability"] as { plan: "free" | "pro" | "team" | "studio" | "enterprise"; approvalRequired: boolean };
    if (!capability.approvalRequired) continue;
    const result = responseText(await dispatchTool(tool.name, {}, { plan: capability.plan }));
    assert.equal(result.code, "MCP_APPROVAL_REQUIRED", tool.name);
  }
});

test("MCP dispatch rejects non-object tool arguments", async () => {
  const result = await dispatchTool("verglos_scan", [] as unknown as Record<string, unknown>);
  assertMcpError(result, { error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments must be an object", category: "usage" });
});

test("MCP dispatch rejects oversized tool arguments before handlers", async () => {
  const result = await dispatchTool("verglos_check_package", { packageName: "x".repeat(256 * 1024) });
  assertMcpError(result, { error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments exceed the 256 KiB limit", category: "usage" });
});

test("MCP policy check verifies the canonical policy record and immutable evidence references", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-mcp-policy-"));
  try {
    const fixture = await createPolicyRecord(root);
    const payload = responseText(await dispatchTool("verglos_policy_check", { manifestPath: fixture.manifestPath, recordStore: fixture.recordStore }, { plan: "free" }));
    assert.equal(payload.decision, "PASS");
    assert.equal(typeof payload.subjectId, "string");
    assert.equal(typeof payload.recordDigest, "string");
    assert.equal((payload.coverage as Record<string, unknown>).policyPredicatesReevaluated, false);
    assert.equal((payload.coverage as Record<string, unknown>).observationReferencesVerified, 1);
    assert.equal((payload.verification as Record<string, unknown>).policy, "canonical-digest-verified");
    assert.equal((payload.verification as Record<string, unknown>).observations, "referenced-observations-verified");
    assert.match(String((payload.verification as Record<string, unknown>).limitation), /policy predicates are not rerun/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("MCP policy check rejects manifest symlinks and unknown input fields", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-mcp-policy-link-"));
  try {
    const fixture = await createPolicyRecord(root);
    const linkPath = join(root, "record-link.json");
    await symlink(fixture.manifestPath, linkPath);
    const linked = responseText(await dispatchTool("verglos_policy_check", { manifestPath: linkPath, recordStore: fixture.recordStore }));
    assert.equal(linked.code, "MCP_POLICY_CHECK_FAILED");
    const extra = responseText(await dispatchTool("verglos_policy_check", { manifestPath: fixture.manifestPath, recordStore: fixture.recordStore, unexpected: true }));
    assert.equal(extra.code, "MCP_POLICY_CHECK_INPUT");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("MCP policy check fails closed when a content-addressed record member is changed", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-mcp-policy-corrupt-"));
  try {
    const fixture = await createPolicyRecord(root);
    const evidence = fixture.manifest.members.find((member) => member.path === "evidence.json")!;
    await writeFile(join(fixture.recordStore, `${evidence.digest.algorithm}-${evidence.digest.value}`), "changed");
    const payload = responseText(await dispatchTool("verglos_policy_check", { manifestPath: fixture.manifestPath, recordStore: fixture.recordStore }, { plan: "free" }));
    assert.equal(payload.code, "MCP_POLICY_CHECK_FAILED");
    assert.equal(payload.ok, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("MCP policy check rejects observation and evidence references absent from the verified record", async () => {
  for (const [name, references] of [
    ["observation", { observationId: "urn:uuid:62345678-1234-4123-8123-123456789abc" }],
    ["evidence", { evidenceDigest: "e".repeat(64) }],
  ] as const) {
    const root = await mkdtemp(join(tmpdir(), `verglos-mcp-policy-${name}-`));
    try {
      const fixture = await createPolicyRecord(root, references);
      const payload = responseText(await dispatchTool("verglos_policy_check", { manifestPath: fixture.manifestPath, recordStore: fixture.recordStore }, { plan: "free" }));
      assert.equal(payload.code, "MCP_POLICY_CHECK_FAILED", name);
      assert.equal(payload.ok, false, name);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }
});

test("MCP response encoder fails closed on oversized payloads", () => {
  const result = jsonResponse({ evidence: "x".repeat(512 * 1024) });
  assertMcpError(result, { error: "output", code: "MCP_OUTPUT_LIMIT", message: "tool response exceeds the 512 KiB limit", category: "infrastructure" });
});

test("MCP dispatch rejects unknown tools with a stable structured error", async () => {
  assertMcpError(await dispatchTool("verglos_unknown", {}), { error: "usage", code: "MCP_UNKNOWN_TOOL", message: "unknown MCP tool", category: "unsupported" });
});

test("MCP dispatch denies approval-required tools before their handler or stub", async () => {
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/report.json" }, { plan: "pro" }));
  assert.equal(result.code, "MCP_APPROVAL_REQUIRED");
  assert.equal(result.error, "usage");
});

test("network MCP tools require exact target and recipient approval before lookup", async () => {
  const priorFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = async (input, init) => {
    fetchCalls++;
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    assert.equal(init?.redirect, "error", "approved network scopes must not be widened by redirects");
    if (url.startsWith("https://registry.npmjs.org/")) return new Response(null, { status: 200 });
    if (url === "https://api.osv.dev/v1/query") return new Response(JSON.stringify({ vulns: [] }), { status: 200 });
    throw new Error("unexpected network recipient");
  };
  try {
    const scanWithoutApproval = responseText(await dispatchTool("verglos_scan", { projectRoot: "/does-not-need-to-exist-for-denial" }));
    assert.equal(scanWithoutApproval.code, "MCP_APPROVAL_REQUIRED");
    assert.equal(fetchCalls, 0);

    const noReceipt = responseText(await dispatchTool("verglos_check_package", { packageName: "safe-package", version: "1.0.0" }));
    assert.equal(noReceipt.code, "MCP_APPROVAL_REQUIRED");
    assert.equal(fetchCalls, 0);

    const receipt = createApprovalReceipt({
      requestId: "623e4567-e89b-12d3-a456-426614174000",
      action: "network",
      actor: "agent",
      target: "npm:safe-package@1.0.0",
      files: [],
      network: ["https://api.osv.dev", "https://registry.npmjs.org"],
      policyEffect: "verify one npm package against npm and OSV",
      requestedAt: "2026-01-01T00:00:00Z",
      expiresAt: "2099-01-01T00:00:00Z",
    }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });

    const wrongTarget = createApprovalReceipt({
      requestId: "723e4567-e89b-12d3-a456-426614174000",
      action: "network",
      actor: "agent",
      target: "npm:other-package@1.0.0",
      files: [],
      network: ["https://api.osv.dev", "https://registry.npmjs.org"],
      policyEffect: "verify one npm package against npm and OSV",
      requestedAt: "2026-01-01T00:00:00Z",
      expiresAt: "2099-01-01T00:00:00Z",
    }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const mismatched = responseText(await dispatchTool("verglos_check_package", { packageName: "safe-package", version: "1.0.0", approvalReceipt: wrongTarget }, { now: "2026-01-02T00:00:00Z" }));
    assert.equal(mismatched.code, "MCP_APPROVAL_SCOPE");
    assert.equal(fetchCalls, 0);

    const missingOrigin = createApprovalReceipt({
      requestId: "823e4567-e89b-12d3-a456-426614174000",
      action: "network",
      actor: "agent",
      target: "npm:safe-package@1.0.0",
      files: [],
      network: ["https://registry.npmjs.org"],
      policyEffect: "verify one npm package against npm and OSV",
      requestedAt: "2026-01-01T00:00:00Z",
      expiresAt: "2099-01-01T00:00:00Z",
    }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const insufficient = responseText(await dispatchTool("verglos_check_package", { packageName: "safe-package", version: "1.0.0", approvalReceipt: missingOrigin }, { now: "2026-01-02T00:00:00Z" }));
    assert.equal(insufficient.code, "MCP_APPROVAL_SCOPE");
    assert.equal(fetchCalls, 0);

    const exact = responseText(await dispatchTool("verglos_check_package", { packageName: "safe-package", version: "1.0.0", approvalReceipt: receipt }, { now: "2026-01-02T00:00:00Z" }));
    assert.equal(exact.verdict, "safe");
    assert.equal(exact.coverage, "complete");
    assert.equal(fetchCalls, 2);
  } finally {
    globalThis.fetch = priorFetch;
  }
});

test("approved MCP scan routes through the shared scanner and returns its coverage evidence", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-mcp-approved-scan-"));
  const fixturePackage = `fixture-safe-package-${randomUUID()}`;
  const priorFetch = globalThis.fetch;
  const recipients: string[] = [];
  globalThis.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    recipients.push(url);
    assert.equal(init?.redirect, "error");
    if (url === `https://registry.npmjs.org/${encodeURIComponent(fixturePackage)}`) return new Response(null, { status: 200 });
    if (url === "https://api.osv.dev/v1/query") return new Response(JSON.stringify({ vulns: [] }), { status: 200 });
    throw new Error("unexpected network recipient");
  };
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "fixture-project", dependencies: { [fixturePackage]: "1.0.0" } }));
    await writeFile(join(root, "package-lock.json"), JSON.stringify({ lockfileVersion: 3, packages: { "": { name: "fixture-project", version: "1.0.0", dependencies: { [fixturePackage]: "1.0.0" } }, [`node_modules/${fixturePackage}`]: { version: "1.0.0" } } }));
    const approvalReceipt = createApprovalReceipt({
      requestId: "923e4567-e89b-12d3-a456-426614174000",
      action: "network",
      actor: "agent",
      target: `project:${root}`,
      files: [],
      network: ["https://api.osv.dev", "https://registry.npmjs.org"],
      policyEffect: "scan this exact local project and query npm/OSV for declared package metadata",
      requestedAt: "2026-01-01T00:00:00Z",
      expiresAt: "2099-01-01T00:00:00Z",
    }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const result = responseText(await dispatchTool("verglos_scan", { projectRoot: root, noProvenance: true, approvalReceipt }, { now: "2026-01-02T00:00:00Z" }));
    const coverage = result.coverage as { status?: unknown; executedDetectors?: unknown; limitations?: unknown };
    assert.equal(result.projectRoot, root);
    assert.equal(coverage.status, "incomplete");
    assert.ok(Array.isArray(coverage.executedDetectors));
    assert.ok((coverage.limitations as string[]).includes("provenance was explicitly skipped"));
    assert.deepEqual(new Set(recipients.map((url) => new URL(url).origin)), new Set(["https://api.osv.dev", "https://registry.npmjs.org"]));
    assert.equal(recipients.length, 2);
  } finally {
    globalThis.fetch = priorFetch;
    await rm(root, { recursive: true, force: true });
  }
});

test("MCP dispatch enforces the explicitly supplied entitlement plan", async () => {
  const denied = await dispatchTool("verglos_hunt_report", {}, { plan: "free" });
  assertMcpError(denied, { error: "usage", code: "MCP_ENTITLEMENT_REQUIRED", message: "MCP tool requires the pro plan", category: "authorization" });
  const allowed = responseText(await dispatchTool("verglos_hunt_report", {}, { plan: "pro" }));
  assert.equal(allowed.code, "MCP_APPROVAL_REQUIRED");
  const team = responseText(await dispatchTool("verglos_hunt_report", {}, { plan: "team" }));
  assert.equal(team.code, "MCP_APPROVAL_REQUIRED");
  const enterprise = responseText(await dispatchTool("verglos_attest", {}, { plan: "enterprise" }));
  assert.equal(enterprise.code, "MCP_APPROVAL_REQUIRED");
});

test("MCP dispatch treats missing host entitlement as Free, never as an upgrade grant", async () => {
  const denied = await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/report.json" });
  assertMcpError(denied, { error: "usage", code: "MCP_ENTITLEMENT_REQUIRED", message: "MCP tool requires the pro plan", category: "authorization" });
  const freeTool = responseText(await dispatchTool("verglos_check_before_write", { code: "const x = 1", targetPath: "x.ts" }));
  assert.equal(freeTool.verdict, "allow");
  assert.equal((freeTool.coverage as { state?: string }).state, "partial");
  assert.deepEqual((freeTool.coverage as { omittedDetectors?: string[] }).omittedDetectors, ["dependencies", "misconfig", "git-history", "slopsquat", "provenance"]);
});

test("MCP dispatch rejects unknown runtime entitlement plans", async () => {
  for (const plan of ["gold", "", "toString", "constructor", "__proto__", 1]) assertMcpError(await dispatchTool("verglos_scan", {}, { plan: plan as never }), { error: "usage", code: "MCP_ENTITLEMENT_INVALID", message: "invalid entitlement plan", category: "usage" });
});

test("MCP dispatch fails closed for non-serializable arguments", async () => {
  const cyclic: Record<string, unknown> = {};
  cyclic.self = cyclic;
  assertMcpError(await dispatchTool("verglos_scan", cyclic), { error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments must be serializable JSON", category: "usage" });
  const undefinedJson = { toJSON: () => undefined } as unknown as Record<string, unknown>;
  assertMcpError(await dispatchTool("verglos_scan", undefinedJson), { error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments must be serializable JSON", category: "usage" });
});

test("MCP response encoder fails closed for non-serializable payloads", () => {
  const cyclic: Record<string, unknown> = {};
  cyclic.self = cyclic;
  assertMcpError(jsonResponse(cyclic), { error: "output", code: "MCP_OUTPUT_INVALID", message: "tool response is not serializable JSON", category: "infrastructure" });
});

test("MCP SDK interoperability preserves discovery and entitlement errors", async () => {
  const server = createVerglosMcpServer({ plan: "free" });
  const client = new Client({ name: "verglos-test-client", version: "1.0.0" }, { capabilities: {} });
  const [clientTransport, serverTransport] = await InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  try {
    const discovered = await client.listTools();
    assert.equal(discovered.tools.length, 10);
    assert.ok(discovered.tools.every((tool) => tool.name.startsWith("verglos_")));
    const denied = await client.callTool({ name: "verglos_hunt_report", arguments: {} }) as { content?: Array<{ type?: string; text?: string }> };
    const payload = JSON.parse(String(denied.content?.[0]?.type === "text" ? denied.content[0].text : "{}")) as { code?: string };
    assert.equal(payload.code, "MCP_ENTITLEMENT_REQUIRED");
  } finally {
    await client.close();
    await server.close();
  }
});

test("approval-free MCP tools keep strict unknown-field validation", async () => {
  const result = responseText(await dispatchTool("verglos_check_before_write", { code: "const value = 1", unknown: true }));
  assert.equal(result.code, "MCP_CHECK_BEFORE_WRITE_INPUT");
  assert.equal(result.error, "usage");
});

test("MCP dispatch accepts an exact approved receipt and preserves the alpha stub state", async () => {
  const request = {
    requestId: "123e4567-e89b-12d3-a456-426614174000",
    action: "execute" as const,
    actor: "agent",
    target: "report:/tmp/report.json",
    files: ["/tmp/report.json"],
    network: [],
    policyEffect: "hunt finding",
    requestedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2099-01-01T00:00:00Z",
  };
  const approvalReceipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/report.json", approvalReceipt }, { plan: "pro" }));
  assert.equal(result.error, "not_implemented_in_alpha");
  assert.equal(result.tool, "verglos_hunt_report");
});

test("MCP dispatch rejects a valid receipt widened to another target", async () => {
  const request = {
    requestId: "223e4567-e89b-12d3-a456-426614174000",
    action: "execute" as const,
    actor: "agent",
    target: "report:/tmp/approved.json",
    files: ["/tmp/approved.json"],
    network: [],
    policyEffect: "hunt report",
    requestedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2099-01-01T00:00:00Z",
  };
  const approvalReceipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/other.json", approvalReceipt }, { plan: "pro" }));
  assert.equal(result.code, "MCP_APPROVAL_SCOPE");
  assert.equal(result.error, "usage");
});

test("MCP dispatch rejects an approval receipt that omits the requested file scope", async () => {
  const request = {
    requestId: "323e4567-e89b-12d3-a456-426614174000",
    action: "execute" as const,
    actor: "agent",
    target: "report:/tmp/report.json",
    files: ["/tmp/other.json"],
    network: [],
    policyEffect: "hunt report",
    requestedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2099-01-01T00:00:00Z",
  };
  const approvalReceipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/report.json", approvalReceipt }, { plan: "pro" }));
  assert.equal(result.code, "MCP_APPROVAL_SCOPE");
});

test("MCP dispatch persists an approved receipt when an audit store is configured", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-mcp-audit-"));
  try {
    const request = { requestId: "423e4567-e89b-12d3-a456-426614174000", action: "execute" as const, actor: "agent", target: "report:/tmp/audit.json", files: ["/tmp/audit.json"], network: [], policyEffect: "hunt report", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" };
    const approvalReceipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/audit.json", approvalReceipt }, { approvalStoreRoot: root, plan: "pro" }));
    assert.equal(result.error, "not_implemented_in_alpha");
    assert.equal((await readApprovalReceipt(root, approvalReceipt.requestDigest)).requestId, request.requestId);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("MCP approval audit failures are bounded", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-mcp-audit-failure-"));
  const auditPath = `${root}/not-a-directory`;
  await writeFile(auditPath, "fixture");
  try {
    const request = { requestId: "523e4567-e89b-12d3-a456-426614174000", action: "execute" as const, actor: "agent", target: "report:/tmp/audit.json", files: ["/tmp/audit.json"], network: [], policyEffect: "hunt report", requestedAt: "2026-01-01T00:00:00Z", expiresAt: "2099-01-01T00:00:00Z" };
    const approvalReceipt = createApprovalReceipt(request, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
    const result = responseText(await dispatchTool("verglos_hunt_report", { reportPath: "/tmp/audit.json", approvalReceipt }, { approvalStoreRoot: auditPath, plan: "pro" }));
    assertMcpError({ content: [{ type: "text", text: JSON.stringify(result) }] }, { error: "usage", code: "MCP_APPROVAL_AUDIT", message: "approval receipt could not be persisted", category: "infrastructure" });
  } finally { await rm(root, { recursive: true, force: true }); }
});
