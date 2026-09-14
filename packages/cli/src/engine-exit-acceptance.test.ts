import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { assembleReleaseRecord, createPolicyEvaluation, createReleaseDecision, createSubject, describeRecordMember, putRecordMember } from "@verglos/shared";
import { prepareReportView } from "./report-view.js";
import { runCliFixture } from "./cli-fixture.js";

const cliEntry = join(process.cwd(), "src", "index.ts");
const tsx = fileURLToPath(import.meta.resolve("tsx"));

test("missing Trivy preserves imported evidence, honest policy state, and historical records", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-engine-exit-"));
  const store = join(root, "historical-store");
  const manifestPath = join(root, "historical-manifest.json");
  const oldManifestBytes = await createHistoricalRecord(store, manifestPath);
  const emptyPath = join(root, "empty-path");
  await mkdir(emptyPath);
  await writeFile(join(root, "alternate.sarif"), JSON.stringify({
    version: "2.1.0",
    runs: [{
      tool: { driver: { name: "alternate-fixture" } },
      results: [{
        ruleId: "fixture.rule",
        level: "error",
        message: { text: "RAW_ALTERNATE_FINDING_MUST_NOT_ESCAPE" },
        locations: [{ physicalLocation: { artifactLocation: { uri: "src/app.ts" }, region: { startLine: 7 } } }],
      }],
    }],
  }));

  const env = {
    HOME: root,
    USERPROFILE: root,
    PATH: emptyPath,
    VERGLOS_DEV_SKIP_UPDATE_CHECK: "1",
    VERGLOS_TELEMETRY: "0",
  };
  try {
    const scan = await runCliFixture(process.execPath, [
      "--import", tsx, cliEntry, "scan",
      "--snapshot", "replacement.snapshot.json",
      "--producer", "trivy", "--producer", "sarif", "--import", "alternate.sarif",
      "--json", "--quiet",
    ], root, { env });
    assert.equal(scan.exitCode, 3, scan.stderr);
    assert.equal(scan.stderr, "");
    const scanSummary = JSON.parse(scan.stdout) as { status: string; snapshotDigest: string; coverage: { status: string; producers: Array<{ producer: string; state: string; observationCount: number; limitations: string[] }> } };
    assert.equal(scanSummary.status, "incomplete");
    assert.equal(scanSummary.coverage.status, "incomplete");
    const trivy = scanSummary.coverage.producers.find((producer) => producer.producer === "trivy");
    assert.ok(trivy);
    assert.equal(trivy.state, "incomplete");
    assert.match(trivy.limitations.join(" "), /pinned Trivy image or Docker runtime is unavailable/u);
    const sarif = scanSummary.coverage.producers.find((producer) => producer.producer === "sarif");
    assert.ok(sarif);
    assert.equal(sarif.observationCount, 1);
    const snapshotText = await readFile(join(root, "replacement.snapshot.json"), "utf8");
    assert.equal(snapshotText.includes("RAW_ALTERNATE_FINDING_MUST_NOT_ESCAPE"), false);
    const snapshot = JSON.parse(snapshotText) as { observations: unknown[]; coverage: { status: string } };
    assert.equal(snapshot.observations.length, 1);
    assert.equal(snapshot.coverage.status, "incomplete");

    const policy = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "policy", "check", "replacement.snapshot.json", "--json", "--quiet"], root, { env });
    assert.equal(policy.exitCode, 3, policy.stderr);
    assert.equal(policy.stderr, "");
    assert.equal(JSON.parse(policy.stdout).decision, "INCOMPLETE");

    const verify = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "record", "verify", store, manifestPath, "--json", "--quiet"], root, { env });
    assert.equal(verify.exitCode, 0, verify.stderr);
    const verified = JSON.parse(verify.stdout) as { verified: boolean; decision: string; manifestDigest: string };
    assert.equal(verified.verified, true);
    assert.equal(verified.decision, "PASS");

    const header = await runCliFixture(process.execPath, ["--import", tsx, cliEntry, "record", "header", store, manifestPath, "--json", "--quiet"], root, { env });
    assert.equal(header.exitCode, 0, header.stderr);
    assert.equal(JSON.parse(header.stdout).decision, "PASS");
    const headerPath = join(root, "historical-header.json");
    await writeFile(headerPath, header.stdout);
    const html = await prepareReportView(headerPath);
    assert.match(html, /Release decision/u);
    assert.match(html, /PASS/u);
    assert.doesNotMatch(html, /<script\b/iu);
    assert.deepEqual(await readFile(manifestPath), oldManifestBytes, "a missing engine must not rewrite or invalidate historical record bytes");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

async function createHistoricalRecord(store: string, manifestPath: string): Promise<Buffer> {
  const subject = createSubject({
    kind: "filesystem",
    treeDigest: { algorithm: "sha256", value: "a".repeat(64) },
    ignorePolicyDigest: { algorithm: "sha256", value: "b".repeat(64) },
    entryCount: 1,
  });
  const evaluation = createPolicyEvaluation({
    schemaId: "urn:verglos:schema:policy-evaluation",
    schemaVersion: "1.0.0",
    evaluationId: "urn:uuid:22345678-1234-4123-8123-123456789abc",
    subjectId: subject.subjectId,
    subjectMatch: { status: "matched", observedSubjectId: subject.subjectId },
    policy: { id: "verglos.policy.local-default", version: "1.0.0", digest: { algorithm: "sha256", value: "c".repeat(64) } },
    checks: [{
      id: "verglos.check.record",
      requirement: "required",
      onFailure: "BLOCK",
      status: "satisfied",
      evidenceDigests: [{ algorithm: "sha256", value: "d".repeat(64) }],
      observationIds: [],
      freshness: { status: "current", checkedAt: "2024-01-01T00:00:00Z", validUntil: "2024-01-02T00:00:00Z" },
      owner: "release",
      reason: "Historical fixture evidence is valid.",
      nextAction: "Preserve the historical record.",
    }],
    limitations: ["Synthetic historical record fixture."],
    evaluatedAt: "2024-01-01T00:00:00Z",
  });
  const decision = createReleaseDecision({
    decisionId: "urn:uuid:32345678-1234-4123-8123-123456789abc",
    evaluation,
    subjects: [{ subjectId: subject.subjectId, role: "primary" }],
    issuedBy: { kind: "service", id: "fixture", authority: "release" },
    generatedAt: "2024-01-01T00:00:01Z",
    limitations: ["Synthetic historical record fixture."],
  });
  const bytes = Buffer.from(JSON.stringify(decision));
  const stored = await putRecordMember(store, "decision.json", bytes);
  const member = {
    ...describeRecordMember({ path: "decision.json", kind: "release-decision", mediaType: "application/json", bytes, required: true }),
    digest: { algorithm: "sha256" as const, value: stored.digest.slice("sha256:".length) },
    schema: { id: "urn:verglos:schema:release-decision", version: "1.0.0" },
  };
  const manifest = assembleReleaseRecord({
    schemaId: "urn:verglos:schema:release-record-manifest",
    schemaVersion: "1.0.0",
    bundleVersion: "1.0.0",
    manifestId: "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
    generatedAt: "2024-01-01T00:00:02Z",
    generator: { id: "verglos.record-builder", version: "1.0.0" },
    members: [member],
    redaction: { status: "not-required" },
    limitations: ["Synthetic historical record fixture."],
  });
  const manifestBytes = Buffer.from(JSON.stringify(manifest));
  await writeFile(manifestPath, manifestBytes);
  return manifestBytes;
}
