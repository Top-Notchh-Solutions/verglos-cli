import assert from "node:assert/strict";
import { mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { executePolicyCheck } from "./policy-check.js";
import { createPolicyEvaluation, createSubject, POLICY_EVALUATION_SCHEMA } from "@verglos/shared";

function validEvaluation(status: "satisfied" | "failed" | "stale" = "satisfied") {
  const digest = (value: string) => ({ algorithm: "sha256" as const, value: value.repeat(64) });
  const subject = createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 1 });
  return createPolicyEvaluation({
    schemaId: POLICY_EVALUATION_SCHEMA.id, schemaVersion: POLICY_EVALUATION_SCHEMA.version,
    evaluationId: "urn:uuid:72345678-1234-4123-8123-123456789abc",
    policy: { id: "verglos.policy.local-default", version: "1.0.0", digest: digest("c") },
    subjectId: subject.subjectId, subjectMatch: { status: "matched", observedSubjectId: subject.subjectId },
    evaluatedAt: "2026-09-09T02:00:00.000Z",
    checks: [{ id: "verglos.check.native-sast", requirement: "required", onFailure: "BLOCK", status, evidenceDigests: [digest("d")], observationIds: [], freshness: { status: status === "stale" ? "stale" : "current", checkedAt: "2026-09-09T01:00:00.000Z", validUntil: status === "stale" ? "2026-09-09T02:00:00.000Z" : "2026-09-10T02:00:00.000Z" }, owner: "security", reason: "Evidence is current.", nextAction: "Preserve the evidence." }],
    limitations: ["Preparatory fixture."],
  });
}

test("policy check returns usage exit for invalid input without mutation", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  try {
    const path = join(root, "evaluation.json");
    await writeFile(path, "{}", "utf8");
    assert.equal(await executePolicyCheck(path, true, true), 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check rejects record and snapshot inputs with a stable JSON error", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  const original = console.log;
  const lines: string[] = [];
  console.log = (line?: unknown) => lines.push(String(line));
  try {
    const path = join(root, "release.vgl");
    await writeFile(path, "not-a-record", "utf8");
    assert.equal(await executePolicyCheck(path, true, true), 2);
    assert.deepEqual(JSON.parse(lines[0]!), {
      status: "error",
      code: "POLICY_CHECK_INPUT",
      message: "record and snapshot inputs are not supported by policy check",
    });
  } finally {
    console.log = original;
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check rejects oversized inputs before parsing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  try {
    const path = join(root, "evaluation.json");
    await writeFile(path, Buffer.alloc(8 * 1024 * 1024 + 1));
    assert.equal(await executePolicyCheck(path, true, true), 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check accepts an evaluator named with snapshot text", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  try {
    const path = join(root, "snapshot-evaluation.json");
    await writeFile(path, JSON.stringify(validEvaluation()), "utf8");
    assert.equal(await executePolicyCheck(path, true, true), 0);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check quiet mode emits no human output on success", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-"));
  const original = console.log;
  const lines: string[] = [];
  console.log = (line?: unknown) => lines.push(String(line));
  try {
    await writeFile(join(root, "evaluation.json"), JSON.stringify(validEvaluation()), "utf8");
    assert.equal(await executePolicyCheck(join(root, "evaluation.json"), false, true), 0);
    assert.deepEqual(lines, []);
  } finally {
    console.log = original;
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check preserves BLOCK and INCOMPLETE exit codes", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-exits-"));
  try {
    const blocked = join(root, "blocked.json");
    const incomplete = join(root, "incomplete.json");
    await writeFile(blocked, JSON.stringify(validEvaluation("failed")), "utf8");
    await writeFile(incomplete, JSON.stringify(validEvaluation("stale")), "utf8");
    assert.equal(await executePolicyCheck(blocked, true, true), 1);
    assert.equal(await executePolicyCheck(incomplete, true, true), 3);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("policy check rejects directory inputs before parsing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-dir-"));
  try {
    assert.equal(await executePolicyCheck(root, true, true), 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("policy check rejects symlink inputs before parsing", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-policy-link-"));
  try {
    const target = join(root, "evaluation.json");
    const link = join(root, "evaluation-link.json");
    await writeFile(target, JSON.stringify(validEvaluation()), "utf8");
    await symlink(target, link);
    assert.equal(await executePolicyCheck(link, true, true), 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
