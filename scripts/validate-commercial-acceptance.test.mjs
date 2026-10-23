import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { test } from "node:test";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { COMMERCIAL_EVIDENCE_CLASSES, COMMERCIAL_EVIDENCE_KINDS, digestCommercialSubject, validateCommercialAcceptance, validateCommercialAcceptanceFile } from "./validate-commercial-acceptance.mjs";

const digest = (value) => `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
const catalog = {
  version: "catalog-2026-10-19",
  planId: "pro",
  currency: "INR",
  monthlyPriceMinor: 280943,
  allowances: { seats: 2, applications: 5, recordsPerMonth: 100, clients: 0, retentionDays: 90 },
};

function event(kind, index, facts, evidenceClass = "owner-controlled-synthetic") {
  const source = {
    kind,
    evidenceClass,
    subjectDigest: digestCommercialSubject(`subject-${index}`),
    observedAt: "2026-10-19T10:00:00.000Z",
    facts,
  };
  return { ...source, evidenceDigest: digest(JSON.stringify(source)) };
}

function run({ evidenceClass = "owner-controlled-synthetic", ...overrides } = {}) {
  return {
    schema: "verglos.private.commercial-acceptance.v1",
    completedAt: "2026-10-19T12:00:00.000Z",
    catalog,
    founderApproval: {
      approvalDigest: digest("x"),
      scopeDigest: digest("y"),
      approvedAt: "2026-10-19T09:00:00.000Z",
      expiresAt: "2026-10-20T09:00:00.000Z",
    },
    events: [
      event("plan-agreement", 0, { planId: "pro", catalogVersion: catalog.version, currency: "INR", amountMinor: catalog.monthlyPriceMinor }, evidenceClass),
      event("checkout", 1, { planId: "pro", catalogVersion: catalog.version, currency: "INR", amountMinor: catalog.monthlyPriceMinor }, evidenceClass),
      event("repeat-use", 2, { useCount: 1 }, evidenceClass),
      event("repeat-use", 3, { useCount: 1 }, evidenceClass),
      event("support-minutes", 4, { minutes: 30 }, evidenceClass),
      event("hosted-cost", 5, { currency: "INR", amountMinor: 1200 }, evidenceClass),
      event("recipient-value", 6, { outcome: "valuable", valueDigest: digest("z") }, evidenceClass),
      event("allowance", 7, { ...catalog.allowances }, evidenceClass),
    ],
    ...overrides,
  };
}

test("validates all commercial evidence kinds and keeps acceptance open", () => {
  const report = validateCommercialAcceptance(run());
  assert.deepEqual(report.evidence.kinds.map((entry) => entry.kind), COMMERCIAL_EVIDENCE_KINDS);
  assert.equal(report.evidence.repeatUseCount, 2);
  assert.equal(report.evidence.recipientOutcome, "valuable");
  assert.equal(report.evidence.evidenceClass, "owner-controlled-synthetic");
  assert.deepEqual(report.evidence.evidenceClasses, ["owner-controlled-synthetic"]);
  assert.equal(report.gate.evidenceStatus, "complete");
  assert.equal(report.gate.evidenceClass, "owner-controlled-synthetic");
  assert.equal(report.gate.acceptanceStatus, "open");
  assert.equal(report.approval.approvalDigest, digest("x"));
});

test("preserves observed and consenting provenance without upgrading acceptance", () => {
  for (const evidenceClass of COMMERCIAL_EVIDENCE_CLASSES.filter((entry) => entry !== "owner-controlled-synthetic")) {
    const report = validateCommercialAcceptance(run({ evidenceClass }));
    assert.equal(report.evidence.evidenceClass, evidenceClass);
    assert.equal(report.gate.evidenceClass, evidenceClass);
    assert.equal(report.gate.acceptanceStatus, "open");
  }
});

test("fails closed on missing evidence, checkout drift, and duplicate repeat-use evidence", () => {
  const missing = run({ events: run().events.filter((entry) => entry.kind !== "support-minutes") });
  assert.throws(() => validateCommercialAcceptance(missing), /missing support-minutes/u);

  const drift = run();
  drift.events[1].facts.amountMinor += 1;
  assert.throws(() => validateCommercialAcceptance(drift), /does not match the catalog/u);

  const duplicate = run();
  duplicate.events[3] = { ...duplicate.events[2] };
  assert.throws(() => validateCommercialAcceptance(duplicate), /distinct evidence digests/u);
});

test("requires explicit numeric allowances and a bounded approval window", () => {
  const unbounded = run({ catalog: { ...catalog, allowances: { ...catalog.allowances, recordsPerMonth: "contracted" } } });
  assert.throws(() => validateCommercialAcceptance(unbounded), /not explicit: recordsPerMonth/u);

  const expired = run();
  expired.founderApproval.expiresAt = "2026-10-19T11:59:59.000Z";
  assert.throws(() => validateCommercialAcceptance(expired), /does not cover/u);
});

test("commercial acceptance file refuses to overwrite an existing report", async () => {
  const directory = await mkdtemp(join(tmpdir(), "verglos-commercial-output-"));
  const inputPath = join(directory, "input.json");
  const outputPath = join(directory, "commercial.json");
  await writeFile(inputPath, `${JSON.stringify(run())}\n`, "utf8");
  await writeFile(outputPath, "existing-commercial\n", "utf8");
  try {
    await assert.rejects(validateCommercialAcceptanceFile(inputPath, outputPath), (error) => error?.code === "EEXIST");
    assert.equal(await readFile(outputPath, "utf8"), "existing-commercial\n");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejects future completion timestamps", () => {
  assert.throws(() => validateCommercialAcceptance(run({ completedAt: "2026-10-20T12:00:00.000Z" }), { now: "2026-10-19T12:01:00.000Z" }), /completedAt is in the future/u);
});

test("rejects commercial event fact tampering without a matching evidence digest", () => {
  const source = run();
  source.events[4].facts.minutes = 31;
  assert.throws(() => validateCommercialAcceptance(source), /evidence digest does not match event payload/u);
});

test("rejects missing or unknown commercial provenance and provenance tampering", () => {
  const missing = run();
  delete missing.events[0].evidenceClass;
  assert.throws(() => validateCommercialAcceptance(missing), /evidence class is invalid/u);

  const unknown = run();
  unknown.events[0].evidenceClass = "synthetic-customer";
  assert.throws(() => validateCommercialAcceptance(unknown), /evidence class is invalid/u);

  const tampered = run();
  tampered.events[0].evidenceClass = "observed-commercial-evidence";
  assert.throws(() => validateCommercialAcceptance(tampered), /evidence digest does not match event payload/u);
});

test("rejects secret-like commercial input before producing a report", () => {
  assert.throws(() => validateCommercialAcceptance(run({ catalog: { ...catalog, version: "DATABASE_URL=must-not-be-recorded" } })), /secret-like material/u);
});
