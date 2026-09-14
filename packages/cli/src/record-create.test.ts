import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { executeRecordCreate } from "./record-create.js";
import { runCliFixture } from "./cli-fixture.js";
import { assembleReleaseRecord, assembleReleaseRecordBundle, canonicalizeJson, createLineageGraphDocument, createPolicyEvaluation, createReleaseDecision, createSubject, describeRecordMember, digestPolicyException, EXCEPTION_APPROVAL_SCHEMA, LINEAGE_GRAPH_SCHEMA, OBSERVATION_SCHEMA, parseExceptionApproval, parsePolicyDocument, parsePolicyException, policyDocumentDigest, POLICY_DOCUMENT_SCHEMA, POLICY_EVALUATION_SCHEMA, POLICY_EXCEPTION_SCHEMA, RELEASE_DECISION_SCHEMA, releaseRecordManifestDigest, SUBJECT_SCHEMA, TOOL_RUN_SCHEMA, VERIFICATION_ATTEMPT_SCHEMA } from "@verglos/shared";
import { executeRecordVerify } from "./record-verify.js";
import { executeRecordExport } from "./record-export.js";
import { executeRecordPackage } from "./record-package.js";

test("record create materializes verified members and a canonical manifest", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-"));
  try {
    const source = join(root, "source");
    const output = join(root, "output");
    await mkdir(source);
    const bytes = new TextEncoder().encode("decision");
    await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json");
    await writeFile(manifestPath, JSON.stringify(manifest));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 0);
    assert.deepEqual(JSON.parse(await readFile(join(output, "manifest.json"), "utf8")).members[0].path, "decision.json");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create rejects a symlinked output root", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-link-"));
  try {
    const source = join(root, "source");
    const output = join(root, "output");
    const target = join(root, "target");
    await mkdir(source); await mkdir(target);
    const bytes = new TextEncoder().encode("decision");
    await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json");
    await writeFile(manifestPath, JSON.stringify(manifest));
    await symlink(target, output);
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 78);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create prevalidates all members before publishing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-preflight-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const bytes = new TextEncoder().encode("decision"); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify({ ...manifest, members: [{ ...member, size: member.size + 1 }] }));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 78);
    await assert.rejects(() => readdir(output));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create rejects an existing manifest before publishing new blobs", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-existing-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source); await mkdir(output);
    const bytes = new TextEncoder().encode("decision"); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(manifest));
    await writeFile(join(output, "manifest.json"), "existing\n");
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true), 78);
    assert.deepEqual(await readdir(output), ["manifest.json"]);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create complete mode enforces the graph gate", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-complete-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const bytes = new TextEncoder().encode("decision"); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(manifest));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true, true), 78);
    await assert.rejects(() => readdir(output));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("complete record create, verify, and export preserve canonical policy and subject bindings", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-complete-valid-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const digest = (char: string) => ({ algorithm: "sha256" as const, value: char.repeat(64) });
    const subject = createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 1 });
    const runId = "urn:uuid:12345678-1234-4123-8123-123456789abc";
    const observationId = "urn:uuid:22345678-1234-4123-8123-123456789abc";
    const observedAt = "2026-09-10T00:00:00.000Z";
    const run = {
      schemaId: TOOL_RUN_SCHEMA.id, schemaVersion: TOOL_RUN_SCHEMA.version, runId, subjectId: subject.subjectId,
      engine: {
        producer: { id: "verglos.native-scanner", kind: "fixture", name: "Synthetic test fixture", version: "1.0.0" },
        observedAt, state: "healthy",
        components: [{ id: "scanner.fixture", kind: "binary", name: "Synthetic fixture", version: "1.0.0", digest: digest("d"), source: "embedded", trust: "computed-only" }],
        capabilities: [{ id: "repository.scan", subjectKinds: ["filesystem"], status: "supported" }], freshness: [], incompleteReasons: [],
      },
      requestedCapabilities: ["repository.scan"], executedCapabilities: ["repository.scan"], executionClass: "in-process",
      networkAccess: "none", targetCodeExecuted: false, startedAt: observedAt, completedAt: "2026-09-10T00:00:01.000Z",
      durationMs: 1000, timeoutMs: 30000, outcome: "succeeded", processResult: { kind: "exited", code: 0 }, coverage: "complete", incompleteReasons: [],
    };
    const observation = {
      schemaId: OBSERVATION_SCHEMA.id, schemaVersion: OBSERVATION_SCHEMA.version, observationId, subjectId: subject.subjectId,
      origin: { kind: "native", producerId: "verglos.fixture", runId, ruleId: "FIXTURE-001" }, coverageClass: "native",
      category: "fixture.synthetic", title: "Synthetic fixture observation", description: "Generated solely for package tests; no target was scanned.",
      locations: [{ kind: "source", path: "fixture/source.ts", startLine: 1 }],
      severity: { original: { system: "verglos.severity", value: "low" }, normalized: "low", mapping: { id: "verglos.severity-map", version: "1.0.0" } },
      confidence: { level: "low", method: "fixture", mappingVersion: "1.0.0" }, evidence: [], references: [], extensions: {},
    };
    const policy = parsePolicyDocument({ schemaId: POLICY_DOCUMENT_SCHEMA.id, schemaVersion: "1.0.0", policyId: "verglos.policy.release", policyVersion: "1.0.0", checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", severities: ["critical"], minimumConfidence: 0, freshness: "current", coverage: "complete", artifactMatch: "not-required", hunt: "not-required" }], exceptions: { enabled: false, requireApproval: false }, approvals: { required: false, authorities: [] } });
    const policyDigest = policyDocumentDigest(policy).slice("sha256:".length);
    const evaluation = createPolicyEvaluation({ schemaId: POLICY_EVALUATION_SCHEMA.id, schemaVersion: "1.0.0", evaluationId: "urn:uuid:72345678-1234-4123-8123-123456789abc", policy: { id: policy.policyId, version: policy.policyVersion, digest: { algorithm: "sha256", value: policyDigest } }, subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId }, evaluatedAt: "2026-09-10T02:00:00.000Z", checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [digest("c")], observationIds: [observationId], freshness: { status: "current", checkedAt: "2026-09-10T01:00:00.000Z", sourceUpdatedAt: "2026-09-10T00:00:00.000Z", validUntil: "2026-09-11T02:00:00.000Z" }, owner: "appsec", reason: "Synthetic fixture evidence only.", nextAction: "No action; fixture only." }], limitations: ["Fixture only."] });
    const decision = createReleaseDecision({ decisionId: "urn:uuid:82345678-1234-4123-8123-123456789abc", evaluation, subjects: [{ subjectId: subject.subjectId, role: "primary" }], issuedBy: { kind: "person", id: "release-owner", authority: "release-decision" }, generatedAt: "2026-09-10T03:00:00.000Z", limitations: ["Fixture only."] });
    const exception = parsePolicyException({
      schemaId: POLICY_EXCEPTION_SCHEMA.id, schemaVersion: POLICY_EXCEPTION_SCHEMA.version,
      exceptionId: "urn:uuid:32345678-1234-4123-8123-123456789abc",
      scope: { subjectId: subject.subjectId, observationIds: [observationId] },
      owner: { kind: "team", id: "fixture-review-team" }, requestedBy: { kind: "agent", id: "fixture-agent" },
      reason: "Synthetic denied exception used only to validate package bindings.",
      compensatingControls: [{ description: "No actual control is asserted by this fixture.", owner: { kind: "person", id: "fixture-owner" }, evidence: { system: "fixture", recordId: "fixture-control", digest: digest("e") } }],
      reversalTriggers: ["Fixture data is discarded after the test."], requestedAt: "2026-09-09T00:00:00.000Z",
      effectiveFrom: "2026-09-09T01:00:00.000Z", expiresAt: "2026-09-16T01:00:00.000Z", limitations: ["Synthetic fixture; not an actual policy exception."],
    });
    const exceptionApproval = parseExceptionApproval({
      schemaId: EXCEPTION_APPROVAL_SCHEMA.id, schemaVersion: EXCEPTION_APPROVAL_SCHEMA.version,
      approvalId: "urn:uuid:52345678-1234-4123-8123-123456789abc",
      target: { exceptionId: exception.exceptionId, requestDigest: digestPolicyException(exception) },
      decision: "denied", approver: { kind: "person", id: "fixture-reviewer", authority: "fixture-only" },
      rationale: "Synthetic denied approval used only to validate digest binding.", decidedAt: "2026-09-09T00:30:00.000Z",
      auditReference: { system: "fixture", recordId: "fixture-approval", digest: digest("f") },
    });
    const verificationAttempt = {
      schemaId: VERIFICATION_ATTEMPT_SCHEMA.id, schemaVersion: VERIFICATION_ATTEMPT_SCHEMA.version,
      attemptId: "urn:uuid:62345678-1234-4123-8123-123456789abc", subjectId: subject.subjectId, observationId,
      recipe: { id: "verglos.fixture.recipe", version: "1.0.0", digest: digest("1"), signatureStatus: "unverified" },
      approval: { required: true, status: "not-requested" },
      sandbox: { isolation: "none", runtime: "not-started-fixture", filesystem: "read-only", network: { mode: "denied", destinations: [] }, nonRoot: true, cleanup: "not-started" },
      inputDigest: digest("2"), parameterDigest: digest("3"), secretInputs: "none",
      limits: { timeoutMs: 30000, cpuMs: 10000, memoryBytes: 268435456, diskBytes: 104857600, maxProcesses: 16, maxOutputBytes: 1048576, maxNetworkRequests: 0 },
      executed: false, completedAt: "2026-09-10T00:00:00.000Z",
      usage: { durationMs: 0, cpuMs: 0, peakMemoryBytes: 0, diskBytes: 0, processes: 0, outputBytes: 0, networkRequests: 0 },
      output: { artifacts: [] }, verdict: "not_supported", reason: "No recipe or target execution occurred in this synthetic fixture.", limitations: ["Test fixture only; no runtime evidence."],
    };
    const payloads = [
      { path: "subjects/0001.json", kind: "subject" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(subject)), required: true, schema: SUBJECT_SCHEMA },
      { path: "lineage.json", kind: "lineage" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(createLineageGraphDocument({ subjectIds: [subject.subjectId], edges: [], gaps: ["Source lineage was not included in this fixture."] }))), required: true, schema: LINEAGE_GRAPH_SCHEMA },
      { path: "policy.json", kind: "policy" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(policy)), required: true, schema: POLICY_DOCUMENT_SCHEMA },
      { path: "policy-evaluation.json", kind: "policy-evaluation" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(evaluation)), required: true, schema: POLICY_EVALUATION_SCHEMA },
      { path: "release-decision.json", kind: "release-decision" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(decision)), required: true, schema: RELEASE_DECISION_SCHEMA },
      { path: "runs/fixture.json", kind: "tool-run" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(run)), required: true, schema: TOOL_RUN_SCHEMA },
      { path: "observations/fixture.json", kind: "observation" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(observation)), required: true, schema: OBSERVATION_SCHEMA },
      { path: "verification/fixture.json", kind: "verification-attempt" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(verificationAttempt)), required: true, schema: VERIFICATION_ATTEMPT_SCHEMA },
      { path: "exceptions/fixture.json", kind: "policy-exception" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(exception)), required: true, schema: POLICY_EXCEPTION_SCHEMA },
      { path: "exceptions/approval.json", kind: "exception-approval" as const, mediaType: "application/json", bytes: new TextEncoder().encode(canonicalizeJson(exceptionApproval)), required: true, schema: EXCEPTION_APPROVAL_SCHEMA },
      { path: "omitted/fixture-source.ts", kind: "metadata" as const, mediaType: "text/plain", bytes: new Uint8Array(), required: false, redaction: "omitted" as const, redactionCategories: ["source-content", "paths"] as const },
    ];
    const bundle = assembleReleaseRecordBundle({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:92345678-1234-4123-8123-123456789abc", generatedAt: "2026-09-10T04:00:00.000Z", generator: { id: "verglos.record-builder", version: "1.0.0" }, redaction: { status: "complete" }, limitations: ["fixture-private-canary-source-path"], payloads });
    for (const [payloadPath, payloadBytes] of bundle.payloads) { const path = join(source, payloadPath); await mkdir(join(path, ".."), { recursive: true }); await writeFile(path, payloadBytes); }
    assert.equal(bundle.manifest.members.filter((member) => member.kind === "redaction-manifest").length, 1);
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(bundle.manifest));
    assert.equal(await executeRecordCreate(source, manifestPath, output, true, true, true), 0);
    assert.equal(await executeRecordVerify(output, join(output, "manifest.json"), true, true), 0);
    assert.equal(await executeRecordVerify(output, join(output, "manifest.json"), true, true, undefined, undefined, undefined, undefined, true), 0);
    const statementPath = join(root, "release.intoto.json");
    assert.equal(await executeRecordExport(output, join(output, "manifest.json"), statementPath, true, true), 0);
    const statement = JSON.parse(await readFile(statementPath, "utf8")) as { _type: string; predicateType: string; predicate: { manifestDigest: string }; subject: Array<{ name: string }> };
    assert.equal(statement._type, "https://in-toto.io/Statement/v1");
    assert.equal(statement.predicateType, "https://verglos.dev/attestations/release/v1");
    const storedManifest = JSON.parse(await readFile(join(output, "manifest.json"), "utf8")) as Parameters<typeof releaseRecordManifestDigest>[0];
    assert.equal(statement.predicate.manifestDigest, releaseRecordManifestDigest(storedManifest));
    assert.deepEqual(statement.subject.map(({ name }) => name), [subject.subjectId]);

    const packagePath = join(root, "release.vgl");
    const packageProcess = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "record", "pack", output, join(output, "manifest.json"), packagePath, "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(packageProcess.exitCode, 0, `${packageProcess.stdout}\n${packageProcess.stderr}`);
    assert.equal(packageProcess.stderr, "");
    const packageResult = JSON.parse(packageProcess.stdout) as { packaged: boolean; transport: string; outputPath: string; manifestDigest: string; members: number; bytes: number; signature: string; uploadPerformed: boolean; includesNonOmittedEvidence: boolean };
    assert.deepEqual(packageResult, { packaged: true, transport: "directory-v1", outputPath: packagePath, manifestDigest: releaseRecordManifestDigest(storedManifest), members: storedManifest.members.filter((member) => member.redaction !== "omitted").length, bytes: packageResult.bytes, signature: "not-included", uploadPerformed: false, includesNonOmittedEvidence: true });
    assert.equal(Number.isSafeInteger(packageResult.bytes) && packageResult.bytes > 0, true);
    const omittedMember = storedManifest.members.find((member) => member.path === "omitted/fixture-source.ts");
    assert.ok(omittedMember);
    assert.equal((await readdir(packagePath)).includes(`${omittedMember.digest.algorithm}-${omittedMember.digest.value}`), false);
    assert.equal(await executeRecordVerify(packagePath, undefined, true, true), 0);
    const verifyProcess = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "record", "verify", packagePath, "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(verifyProcess.exitCode, 0, `${verifyProcess.stdout}\n${verifyProcess.stderr}`);
    assert.equal(verifyProcess.stderr, "");
    assert.equal((JSON.parse(verifyProcess.stdout) as { package?: { transport: string } }).package?.transport, "directory-v1");
    const packagedViewer = await readFile(join(packagePath, ".vgl-viewer.html"), "utf8");
    assert.equal(packagedViewer.includes("fixture-private-canary-source-path"), false);
    assert.equal(packagedViewer.includes("<script"), false);
    assert.match(packagedViewer, /Content-Security-Policy/u);

    const deterministicPackagePath = join(root, "release-again.vgl");
    assert.equal(await executeRecordPackage(output, join(output, "manifest.json"), deterministicPackagePath, true, true), 0);
    const packageEntries = await readdir(packagePath);
    assert.deepEqual(await readdir(deterministicPackagePath), packageEntries);
    for (const name of packageEntries) assert.deepEqual(await readFile(join(deterministicPackagePath, name)), await readFile(join(packagePath, name)), `package entry ${name} must be deterministic`);
    assert.equal(await executeRecordPackage(output, join(output, "manifest.json"), packagePath, true, true), 78, "package creation must not overwrite an existing output");
    assert.equal(await executeRecordPackage(output, join(output, "manifest.json"), join(output, "nested.vgl"), true, true), 78, "package creation must stay outside the source store");

    const keyPair = generateKeyPairSync("ed25519");
    const publicKeyPath = join(root, "public.pem");
    const signaturePath = join(root, "signature.json");
    await writeFile(publicKeyPath, keyPair.publicKey.export({ format: "pem", type: "spki" }));
    const { signReleaseRecordManifest } = await import("@verglos/shared");
    const signature = signReleaseRecordManifest(storedManifest, keyPair.privateKey.export({ format: "pem", type: "pkcs8" }).toString(), { id: "fixture-signer", issuer: "fixture-issuer" }, "2026-09-10T05:00:00.000Z");
    await writeFile(signaturePath, `${canonicalizeJson(signature)}\n`);
    const signedPackagePath = join(root, "signed.vgl");
    assert.equal(await executeRecordPackage(output, join(output, "manifest.json"), signedPackagePath, true, true, signaturePath, publicKeyPath, "fixture-issuer", "fixture-signer"), 0);
    assert.equal(await executeRecordVerify(signedPackagePath, undefined, true, true, undefined, publicKeyPath, "fixture-issuer", "fixture-signer", true), 0);
    const wrongKeyPair = generateKeyPairSync("ed25519");
    const wrongPublicKeyPath = join(root, "wrong-public.pem");
    await writeFile(wrongPublicKeyPath, wrongKeyPair.publicKey.export({ format: "pem", type: "spki" }));
    assert.equal(await executeRecordVerify(signedPackagePath, undefined, true, true, undefined, wrongPublicKeyPath, "fixture-issuer", "fixture-signer", true), 78);
    const signedEnvelopePath = join(signedPackagePath, ".vgl-signature.json");
    const signedEnvelopeBytes = await readFile(signedEnvelopePath);
    const signedEnvelope = JSON.parse(signedEnvelopeBytes.toString("utf8")) as { signature: string };
    const changedSignature = `${signedEnvelope.signature.startsWith("A") ? "B" : "A"}${signedEnvelope.signature.slice(1)}`;
    await writeFile(signedEnvelopePath, `${canonicalizeJson({ ...signedEnvelope, signature: changedSignature })}\n`);
    assert.equal(await executeRecordVerify(signedPackagePath, undefined, true, true, undefined, publicKeyPath, "fixture-issuer", "fixture-signer", true), 78);
    await writeFile(signedEnvelopePath, signedEnvelopeBytes);
    const wrongIssuerPath = join(root, "untrusted.vgl");
    assert.equal(await executeRecordPackage(output, join(output, "manifest.json"), wrongIssuerPath, true, true, signaturePath, publicKeyPath, "other-issuer"), 78);
    await assert.rejects(() => readdir(wrongIssuerPath));

    const extraFilePath = join(packagePath, "unexpected.txt");
    await writeFile(extraFilePath, "unexpected");
    assert.equal(await executeRecordVerify(packagePath, undefined, true, true), 78);
    await rm(extraFilePath);
    const descriptorPath = join(packagePath, ".vgl-package.json");
    const descriptorBytes = await readFile(descriptorPath);
    await rm(descriptorPath);
    assert.equal(await executeRecordVerify(packagePath, undefined, true, true), 78);
    await writeFile(descriptorPath, descriptorBytes);
    await writeFile(descriptorPath, "{malformed-json");
    assert.equal(await executeRecordVerify(packagePath, undefined, true, true), 78);
    await writeFile(descriptorPath, descriptorBytes);
    const tamperedViewerPath = join(packagePath, ".vgl-viewer.html");
    const originalViewer = await readFile(tamperedViewerPath);
    await writeFile(tamperedViewerPath, Buffer.concat([originalViewer, Buffer.from("tamper")]));
    assert.equal(await executeRecordVerify(packagePath, undefined, true, true), 78);
    await writeFile(tamperedViewerPath, originalViewer);
    const memberToTamper = storedManifest.members.find((member) => member.kind === "release-decision");
    assert.ok(memberToTamper);
    const packageMemberPath = join(packagePath, `${memberToTamper.digest.algorithm}-${memberToTamper.digest.value}`);
    const originalMemberBytes = await readFile(packageMemberPath);
    await rm(packageMemberPath);
    assert.equal(await executeRecordVerify(packagePath, undefined, true, true), 78);
    await writeFile(packageMemberPath, originalMemberBytes);
    await writeFile(packageMemberPath, Buffer.concat([originalMemberBytes, Buffer.from("tamper")]));
    assert.equal(await executeRecordVerify(packagePath, undefined, true, true), 78);
    await writeFile(packageMemberPath, originalMemberBytes);
    const viewerTarget = join(root, "external-viewer.html");
    await writeFile(viewerTarget, "outside package");
    await rm(tamperedViewerPath);
    await symlink(viewerTarget, tamperedViewerPath);
    assert.equal(await executeRecordVerify(packagePath, undefined, true, true), 78);
    await rm(tamperedViewerPath);
    await writeFile(tamperedViewerPath, originalViewer);
    assert.equal(await executeRecordVerify(packagePath, undefined, true, true, undefined, undefined, undefined, undefined, true), 0);

    assert.equal(await executeRecordExport(output, join(output, "manifest.json"), statementPath, true, true), 78);
    assert.equal(JSON.parse(await readFile(statementPath, "utf8")).predicate.manifestDigest, statement.predicate.manifestDigest);
    const decisionMember = storedManifest.members.find((member) => member.kind === "release-decision");
    assert.ok(decisionMember);
    await writeFile(join(output, `${decisionMember.digest.algorithm}-${decisionMember.digest.value}`), "tampered decision");
    const rejectedExport = join(root, "tampered.intoto.json");
    assert.equal(await executeRecordExport(output, join(output, "manifest.json"), rejectedExport, true, true), 78);
    await assert.rejects(() => readFile(rejectedExport));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create JSON success is process-safe", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-process-"));
  try {
    const source = join(root, "source"); const output = join(root, "output"); await mkdir(source);
    const bytes = new TextEncoder().encode("decision"); await writeFile(join(source, "decision.json"), bytes);
    const member = { ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }), schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" } };
    const manifest = assembleReleaseRecord({ schemaId: "urn:verglos:schema:release-record-manifest", schemaVersion: "1.0.0", bundleVersion: "1.0.0", manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000", generatedAt: "2026-01-01T00:00:00Z", generator: { id: "verglos", version: "2.0.0" }, members: [member], redaction: { status: "not-required" }, limitations: ["fixture"] });
    const manifestPath = join(root, "manifest.json"); await writeFile(manifestPath, JSON.stringify(manifest));
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "record", "create", source, manifestPath, output, "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0, `${result.stdout}\n${result.stderr}`);
    assert.equal(result.stderr, "");
    const parsed = JSON.parse(result.stdout) as { members: number; manifestPath: string };
    assert.equal(parsed.members, 1);
    assert.equal(basename(parsed.manifestPath), "manifest.json");
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record create JSON failures are process-safe", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-create-json-error-"));
  const logs: string[] = [];
  const original = console.log;
  console.log = (line?: unknown) => logs.push(String(line));
  try {
    assert.equal(await executeRecordCreate(root, join(root, "missing.json"), join(root, "output"), true, true), 78);
    assert.deepEqual(JSON.parse(logs[0]!), { status: "error", code: "RECORD_CREATE_INPUT", message: "record creation failed" });
  } finally {
    console.log = original;
    await rm(root, { recursive: true, force: true });
  }
});
