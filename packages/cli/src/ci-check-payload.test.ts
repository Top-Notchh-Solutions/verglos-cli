import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { createPolicyEvaluation } from "@verglos/shared";
import { createReleaseDecision } from "@verglos/shared";
import { executeCiCheckPayload } from "./ci-check-payload.js";
import { runCliFixture } from "./cli-fixture.js";

const subjectId = `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`;
const decision = createReleaseDecision({
  decisionId: "urn:uuid:22345678-1234-4123-8123-123456789abc",
  evaluation: createPolicyEvaluation({
    schemaId: "urn:verglos:schema:policy-evaluation",
    schemaVersion: "1.0.0",
    evaluationId: "urn:uuid:12345678-1234-4123-8123-123456789abc",
    subjectId,
    policy: { id: "verglos.policy.team", version: "1.0.0", digest: { algorithm: "sha256", value: "b".repeat(64) } },
    subjectMatch: { status: "matched", observedSubjectId: subjectId },
    evaluatedAt: "2026-01-01T00:00:00.000Z",
    checks: [{ id: "verglos.check.release", requirement: "required", onFailure: "BLOCK", status: "satisfied", evidenceDigests: [{ algorithm: "sha256", value: "e".repeat(64) }], observationIds: [], freshness: { status: "current", checkedAt: "2026-01-01T00:00:00.000Z", validUntil: "2026-01-02T00:00:00.000Z" }, owner: "team-policy", reason: "Synthetic fixture.", nextAction: "Preserve the record." }],
    limitations: ["Synthetic fixture."],
  }),
  subjects: [{ subjectId, role: "primary" }],
  issuedBy: { kind: "service", id: "ci", authority: "policy" },
  generatedAt: "2026-01-01T00:01:00.000Z",
  limitations: ["Synthetic fixture."],
});

test("CI check payload command emits only source-free release identity", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-ci-check-payload-"));
  const path = join(root, "decision.json");
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (value?: unknown) => logs.push(String(value));
  try {
    await writeFile(path, JSON.stringify(decision));
    const code = await executeCiCheckPayload({ decisionPath: path, recordManifestDigest: `sha256:${"c".repeat(64)}`, recordUrl: "https://verglos.com/verify/record-123", commit: "d".repeat(40), json: true });
    assert.equal(code, 0);
    const payload = JSON.parse(logs[0]!);
    assert.equal(payload.decision, "PASS");
    assert.equal(payload.record.url, "https://verglos.com/verify/record-123");
    assert.equal(payload.commit, "d".repeat(40));
    assert.match(payload.payloadDigest, /^sha256:[a-f0-9]{64}$/u);
    assert.doesNotMatch(JSON.stringify(payload), /source|finding|path|secret/i);
  } finally { console.log = originalLog; await rm(root, { recursive: true, force: true }); }
});

test("CI check payload command fails closed on missing fields, unsafe URL and symlink decision", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-ci-check-payload-invalid-"));
  const path = join(root, "decision.json");
  const link = join(root, "decision-link.json");
  const originalLog = console.log;
  const logs: string[] = [];
  console.log = (value?: unknown) => logs.push(String(value));
  try {
    await writeFile(path, JSON.stringify(decision));
    for (const input of [
      { decisionPath: path, recordManifestDigest: "bad", recordUrl: "https://verglos.com/r", commit: "d".repeat(40) },
      { decisionPath: path, recordManifestDigest: `sha256:${"c".repeat(64)}`, recordUrl: "http://evil.example", commit: "d".repeat(40) },
    ]) {
      logs.length = 0;
      assert.equal(await executeCiCheckPayload({ ...input, json: true }), 2);
      assert.deepEqual(JSON.parse(logs[0]!), { status: "error", code: "CI_CHECK_PAYLOAD_INPUT", message: "CI check payload projection failed" });
    }
    await symlink(path, link);
    logs.length = 0;
    assert.equal(await executeCiCheckPayload({ decisionPath: link, recordManifestDigest: `sha256:${"c".repeat(64)}`, recordUrl: "https://verglos.com/r", commit: "d".repeat(40), json: true }), 2);
  } finally { console.log = originalLog; await rm(root, { recursive: true, force: true }); }
});

test("verglos ci wires the projection into a bounded machine-readable process", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-ci-check-payload-process-"));
  try {
    const path = join(root, "decision.json");
    await writeFile(path, JSON.stringify(decision));
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "ci", "--check-payload", path, "--record-manifest-digest", `sha256:${"c".repeat(64)}`, "--record-url", "https://verglos.com/verify/record-123", "--commit", "d".repeat(40), "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0, `${result.stdout}\n${result.stderr}`);
    const payload = JSON.parse(result.stdout);
    assert.equal(payload.record.url, "https://verglos.com/verify/record-123");
    assert.equal(result.stderr, "");
    assert.deepEqual(result.files, []);
  } finally { await rm(root, { recursive: true, force: true }); }
});
