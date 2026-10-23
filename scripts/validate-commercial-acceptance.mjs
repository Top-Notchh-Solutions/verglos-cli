import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { readBoundedJsonFile } from "./read-bounded-json.mjs";

export const COMMERCIAL_EVIDENCE_KINDS = Object.freeze([
  "plan-agreement",
  "checkout",
  "repeat-use",
  "support-minutes",
  "hosted-cost",
  "recipient-value",
  "allowance",
]);

export const COMMERCIAL_EVIDENCE_CLASSES = Object.freeze([
  "observed-commercial-evidence",
  "owner-controlled-synthetic",
  "consenting-recipient",
]);

const CURRENCIES = new Set(["USD", "INR"]);
const PLAN_IDS = new Set(["free", "pro", "team", "studio", "enterprise"]);
const SHA256 = /^sha256:[a-f0-9]{64}$/u;
const MAX_EVENTS = 256;
const MAX_DIGESTS = 256;
const SECRET_LIKE = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/u,
  /(?:DATABASE_URL|CLERK_SECRET_KEY|RAZORPAY_KEY_SECRET|NPM_TOKEN|NODE_AUTH_TOKEN)\s*=/iu,
  /\b(?:rzp|sk|whsec|ghp|github_pat)_(?:live|test)?_[A-Za-z0-9_-]{8,}\b/u,
];

/**
 * Validate commercial acceptance evidence without accepting free-form claims
 * as proof. The emitted report contains only bounded facts and digests; it
 * never stores agreements, support notes, customer identity, or payment data.
 */
export function validateCommercialAcceptance(input, { now = new Date() } = {}) {
  rejectSecretLike(input);
  const run = validateRun(input);
  const completedAt = parseDate(run.completedAt, "completedAt");
  const currentTime = now instanceof Date ? now : parseDate(now, "now");
  if (completedAt > currentTime) throw new Error("completedAt is in the future");
  const catalog = validateCatalog(run.catalog);
  const approval = validateApproval(run.founderApproval, completedAt);
  const events = run.events.map((event) => validateEvent(event, catalog, completedAt));
  const byKind = new Map(COMMERCIAL_EVIDENCE_KINDS.map((kind) => [kind, events.filter((event) => event.kind === kind)]));
  const evidenceClasses = [...new Set(events.map((event) => event.evidenceClass))];
  const evidenceClass = evidenceClasses.length === 1 ? evidenceClasses[0] : "mixed-commercial-sources";

  for (const kind of COMMERCIAL_EVIDENCE_KINDS) {
    if ((byKind.get(kind)?.length ?? 0) === 0) throw new Error(`commercial evidence is missing ${kind}`);
  }
  const repeatUse = byKind.get("repeat-use");
  if (!repeatUse || repeatUse.length < 2) throw new Error("commercial evidence requires at least two distinct repeat-use observations");
  const repeatDigests = new Set(repeatUse.map((event) => event.evidenceDigest));
  if (repeatDigests.size !== repeatUse.length) throw new Error("repeat-use observations must have distinct evidence digests");

  const uniqueEvidence = new Set(events.map((event) => event.evidenceDigest));
  if (uniqueEvidence.size !== events.length) throw new Error("commercial evidence records must have distinct evidence digests");
  if (uniqueEvidence.size > MAX_DIGESTS) throw new Error("commercial evidence contains too many distinct records");
  const recipient = byKind.get("recipient-value")?.[0];
  const cost = byKind.get("hosted-cost")?.[0];
  const support = byKind.get("support-minutes")?.[0];
  return Object.freeze({
    schema: "verglos.private.commercial-acceptance-report.v1",
    completedAt: completedAt.toISOString(),
    catalog: Object.freeze({
      version: catalog.version,
      planId: catalog.planId,
      currency: catalog.currency,
      monthlyPriceMinor: catalog.monthlyPriceMinor,
      allowances: Object.freeze({ ...catalog.allowances }),
    }),
    evidence: Object.freeze({
      evidenceClass,
      evidenceClasses: Object.freeze([...evidenceClasses]),
      kinds: Object.freeze(COMMERCIAL_EVIDENCE_KINDS.map((kind) => Object.freeze({ kind, count: byKind.get(kind)?.length ?? 0 }))),
      distinctEvidenceDigests: uniqueEvidence.size,
      repeatUseCount: repeatUse.length,
      supportMinutes: support?.facts.minutes ?? 0,
      hostedCostMinor: cost?.facts.amountMinor ?? 0,
      hostedCostCurrency: cost?.facts.currency ?? catalog.currency,
      recipientOutcome: recipient?.facts.outcome ?? "unavailable",
    }),
    approval: Object.freeze({
      approvalDigest: approval.approvalDigest,
      scopeDigest: approval.scopeDigest,
      expiresAt: approval.expiresAt.toISOString(),
    }),
    gate: Object.freeze({
      evidenceStatus: "complete",
      evidenceClass,
      acceptanceStatus: "open",
      independentReview: "required",
    }),
  });
}

export async function validateCommercialAcceptanceFile(inputPath, outputPath, options = {}) {
  const input = await readBoundedJsonFile(inputPath, "commercial acceptance input");
  const report = validateCommercialAcceptance(input, options);
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
  return report;
}

function validateRun(input) {
  if (!input || typeof input !== "object") throw new Error("commercial acceptance input must be an object");
  if (input.schema !== "verglos.private.commercial-acceptance.v1") throw new Error("unsupported commercial acceptance schema");
  if (typeof input.completedAt !== "string") throw new Error("commercial acceptance completedAt is required");
  if (!Array.isArray(input.events) || input.events.length === 0 || input.events.length > MAX_EVENTS) throw new Error("commercial acceptance events are invalid");
  return input;
}

function validateCatalog(input) {
  if (!input || typeof input !== "object") throw new Error("commercial catalog is required");
  if (typeof input.version !== "string" || input.version.length === 0 || input.version.length > 64) throw new Error("commercial catalog version is invalid");
  if (typeof input.planId !== "string" || !PLAN_IDS.has(input.planId)) throw new Error("commercial catalog plan is invalid");
  if (typeof input.currency !== "string" || !CURRENCIES.has(input.currency)) throw new Error("commercial catalog currency is invalid");
  if (!Number.isSafeInteger(input.monthlyPriceMinor) || input.monthlyPriceMinor < 0) throw new Error("commercial catalog price is invalid");
  if (!input.allowances || typeof input.allowances !== "object") throw new Error("commercial catalog allowances are required");
  for (const key of ["seats", "applications", "recordsPerMonth", "clients", "retentionDays"]) {
    if (!Number.isSafeInteger(input.allowances[key]) || input.allowances[key] < 0) throw new Error(`commercial catalog allowance is not explicit: ${key}`);
  }
  return input;
}

function validateApproval(input, completedAt) {
  if (!input || typeof input !== "object") throw new Error("founder approval is required");
  if (!SHA256.test(input.approvalDigest) || !SHA256.test(input.scopeDigest)) throw new Error("founder approval digests are invalid");
  const approvedAt = parseDate(input.approvedAt, "founder approval approvedAt");
  const expiresAt = parseDate(input.expiresAt, "founder approval expiresAt");
  if (approvedAt > completedAt || expiresAt <= completedAt || expiresAt <= approvedAt) throw new Error("founder approval does not cover the completed run");
  return { approvalDigest: input.approvalDigest, scopeDigest: input.scopeDigest, expiresAt };
}

function validateEvent(input, catalog, completedAt) {
  if (!input || typeof input !== "object" || typeof input.kind !== "string" || !COMMERCIAL_EVIDENCE_KINDS.includes(input.kind)) {
    throw new Error("commercial evidence event kind is invalid");
  }
  if (!SHA256.test(input.evidenceDigest) || !SHA256.test(input.subjectDigest)) throw new Error(`commercial ${input.kind} digests are invalid`);
  if (typeof input.evidenceClass !== "string" || !COMMERCIAL_EVIDENCE_CLASSES.includes(input.evidenceClass)) {
    throw new Error(`commercial ${input.kind} evidence class is invalid`);
  }
  const observedAt = parseDate(input.observedAt, `commercial ${input.kind} observedAt`);
  if (observedAt > completedAt) throw new Error(`commercial ${input.kind} occurs after completion`);
  if (!input.facts || typeof input.facts !== "object") throw new Error(`commercial ${input.kind} facts are required`);
  switch (input.kind) {
    case "plan-agreement":
      requirePlanFacts(input.facts, catalog, input.kind);
      break;
    case "checkout":
      requirePlanFacts(input.facts, catalog, input.kind);
      if (input.facts.amountMinor !== catalog.monthlyPriceMinor || input.facts.currency !== catalog.currency) throw new Error("checkout does not match the catalog amount/currency");
      break;
    case "repeat-use":
      if (!Number.isSafeInteger(input.facts.useCount) || input.facts.useCount !== 1) throw new Error("each repeat-use event must represent exactly one observed use");
      break;
    case "support-minutes":
      if (!Number.isSafeInteger(input.facts.minutes) || input.facts.minutes <= 0) throw new Error("support minutes must be positive");
      break;
    case "hosted-cost":
      if (!Number.isSafeInteger(input.facts.amountMinor) || input.facts.amountMinor < 0 || input.facts.currency !== catalog.currency) throw new Error("hosted cost is invalid or uses the wrong currency");
      break;
    case "recipient-value":
      if (!(new Set(["valuable", "not-valuable", "insufficient-evidence"])).has(input.facts.outcome)) throw new Error("recipient value outcome is invalid");
      if (!SHA256.test(input.facts.valueDigest)) throw new Error("recipient value must be digest-bound");
      break;
    case "allowance":
      for (const key of ["seats", "applications", "recordsPerMonth", "clients", "retentionDays"]) {
        if (input.facts[key] !== catalog.allowances[key]) throw new Error(`allowance evidence does not match catalog: ${key}`);
      }
      break;
  }
  if (input.evidenceDigest !== digestEventPayload(input)) throw new Error(`commercial ${input.kind} evidence digest does not match event payload`);
  return Object.freeze({
    kind: input.kind,
    evidenceClass: input.evidenceClass,
    evidenceDigest: input.evidenceDigest,
    subjectDigest: input.subjectDigest,
    facts: Object.freeze({ ...input.facts }),
  });
}

function requirePlanFacts(facts, catalog, kind) {
  if (facts.planId !== catalog.planId || facts.catalogVersion !== catalog.version) throw new Error(`${kind} does not bind to the catalog plan/version`);
  if (!CURRENCIES.has(facts.currency) || !Number.isSafeInteger(facts.amountMinor) || facts.amountMinor < 0) throw new Error(`${kind} facts are invalid`);
}

function parseDate(value, label) {
  if (typeof value !== "string") throw new Error(`${label} is invalid`);
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) throw new Error(`${label} is invalid`);
  return date;
}

function digestEventPayload(input) {
  return `sha256:${createHash("sha256").update(JSON.stringify({ kind: input.kind, evidenceClass: input.evidenceClass, subjectDigest: input.subjectDigest, observedAt: input.observedAt, facts: input.facts }), "utf8").digest("hex")}`;
}

function rejectSecretLike(input) {
  if (SECRET_LIKE.some((pattern) => pattern.test(JSON.stringify(input)))) throw new Error("commercial acceptance input contains secret-like material");
}

export function digestCommercialSubject(value) {
  if (typeof value !== "string" || value.length === 0) throw new Error("commercial subject is required");
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) throw new Error("usage: node scripts/validate-commercial-acceptance.mjs INPUT.json OUTPUT.json");
  const report = await validateCommercialAcceptanceFile(inputPath, outputPath);
  process.stdout.write(`${JSON.stringify({ schema: report.schema, evidenceStatus: report.gate.evidenceStatus, acceptanceStatus: report.gate.acceptanceStatus })}\n`);
}
