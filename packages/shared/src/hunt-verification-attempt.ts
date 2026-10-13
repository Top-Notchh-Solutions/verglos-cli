import { createHash } from "node:crypto";
import { canonicalizeJson } from "./schema.js";
import { ApprovalReceiptSchema, type ApprovalReceipt } from "./approval-receipt.js";
import { HuntRecipeSchema, type HuntRecipe } from "./hunt-recipe.js";
import { ContentDigestSchema, type ContentDigest, SubjectIdSchema } from "./subject.js";
import { parseVerificationAttempt, type VerificationAttemptDocument } from "./verification.js";

export type HuntVerificationCanonicalVerdict =
  | "confirmed"
  | "not-reproduced"
  | "inconclusive"
  | "not-supported"
  | "environment-error"
  | "policy-denied";

export interface HuntVerificationOutcome {
  readonly canonicalVerdict?: HuntVerificationCanonicalVerdict;
  readonly reason: string;
  readonly durationMs: number;
  readonly evidenceDigest?: string;
  readonly outputBytes?: number;
}

export interface HuntVerificationUsage {
  readonly cpuMs: number;
  readonly peakMemoryBytes: number;
  readonly diskBytes: number;
  readonly processes: number;
  readonly networkRequests: number;
}

export interface HuntVerificationRuntime {
  readonly isolation: "restricted-process" | "container" | "gvisor" | "microvm";
  readonly runtime: string;
  readonly runtimeDigest?: ContentDigest;
  readonly filesystem: "read-only" | "ephemeral-write";
  readonly nonRoot: boolean;
  readonly cleanup: "not-started" | "succeeded" | "failed";
}

/**
 * Build the record-native verification attempt from the same bound inputs
 * used by Hunt execution. The result is parsed through the canonical record
 * schema before it can be emitted, so incomplete bindings fail closed while
 * unavailable runtime counters remain explicit limitations.
 */
export function createHuntVerificationAttempt(input: {
  readonly attemptId: string;
  readonly subjectId: string;
  readonly observationId: string;
  readonly findingId: string;
  readonly ruleId: string;
  readonly recipe: HuntRecipe;
  readonly trustPolicyDigest: string;
  readonly approval: ApprovalReceipt;
  readonly runtime: HuntVerificationRuntime;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly usage: HuntVerificationUsage;
  readonly executed: boolean;
  readonly outcome: HuntVerificationOutcome;
  readonly limitations: readonly string[];
}): VerificationAttemptDocument {
  const recipe = HuntRecipeSchema.parse(input.recipe);
  const approval = ApprovalReceiptSchema.parse(input.approval);
  SubjectIdSchema.parse(input.subjectId);
  const trustPolicyDigest = parseDigestString(input.trustPolicyDigest);
  const outcome = input.outcome;
  const verdict = mapVerdict(outcome.canonicalVerdict);
  const evidenceDigest = outcome.evidenceDigest === undefined ? undefined : parseDigestString(outcome.evidenceDigest);
  const attempt = {
    schemaId: "urn:verglos:schema:verification-attempt" as const,
    schemaVersion: "1.0.0" as const,
    attemptId: input.attemptId,
    subjectId: input.subjectId,
    observationId: input.observationId,
    findingId: input.findingId,
    ruleId: input.ruleId,
    recipe: {
      id: recipe.recipeId,
      version: recipe.schemaVersion,
      digest: parseDigestString(hashCanonical(recipe)),
      signatureStatus: recipe.signature.status,
      ...(recipe.signature.signer === undefined ? {} : { signer: recipe.signature.signer }),
      trustPolicyDigest,
    },
    approval: {
      required: true,
      status: approval.decision === "approved" ? "approved" as const : "denied" as const,
      requestDigest: parseDigestString(approval.requestDigest),
      actor: approval.decidedBy,
      approvedAt: approval.decision === "approved" ? approval.decidedAt : undefined,
    },
    sandbox: {
      isolation: input.runtime.isolation,
      runtime: input.runtime.runtime,
      ...(input.runtime.runtimeDigest === undefined ? {} : { runtimeDigest: input.runtime.runtimeDigest }),
      filesystem: input.runtime.filesystem,
      network: { mode: recipe.network.mode, destinations: [...recipe.network.destinations] },
      nonRoot: input.runtime.nonRoot,
      cleanup: input.runtime.cleanup,
    },
    inputDigest: huntVerificationInputDigest(recipe),
    parameterDigest: huntVerificationParameterDigest(recipe),
    secretInputs: "none" as const,
    limits: {
      timeoutMs: recipe.limits.timeoutMs,
      cpuMs: recipe.limits.cpuMs,
      memoryBytes: recipe.limits.memoryMb * 1024 * 1024,
      diskBytes: recipe.limits.diskMb * 1024 * 1024,
      maxProcesses: recipe.limits.processes,
      maxOutputBytes: recipe.limits.outputBytes,
      maxNetworkRequests: recipe.limits.maxNetworkRequests,
    },
    executed: input.executed,
    ...(input.executed ? { startedAt: input.startedAt } : {}),
    completedAt: input.completedAt,
    usage: {
      durationMs: input.executed ? outcome.durationMs : 0,
      cpuMs: input.executed ? input.usage.cpuMs : 0,
      peakMemoryBytes: input.executed ? input.usage.peakMemoryBytes : 0,
      diskBytes: input.executed ? input.usage.diskBytes : 0,
      processes: input.executed ? input.usage.processes : 0,
      outputBytes: input.executed ? outcome.outputBytes ?? 0 : 0,
      networkRequests: input.executed ? input.usage.networkRequests : 0,
    },
    output: {
      ...(evidenceDigest === undefined ? {} : { evidenceDigest }),
      artifacts: [],
    },
    verdict,
    reason: outcome.reason,
    limitations: [...new Set(input.limitations)].slice(0, 32),
  };
  return parseVerificationAttempt(attempt);
}

export function huntVerificationInputDigest(recipe: HuntRecipe): ContentDigest {
  const parsed = HuntRecipeSchema.parse(recipe);
  return digest({ recipeId: parsed.recipeId, inputs: parsed.inputs ?? {} });
}

export function huntVerificationParameterDigest(recipe: HuntRecipe): ContentDigest {
  const parsed = HuntRecipeSchema.parse(recipe);
  return digest({
    recipeId: parsed.recipeId,
    command: parsed.command,
    assertions: parsed.assertions,
    isolation: parsed.isolation,
    limits: parsed.limits,
    network: parsed.network,
  });
}

function mapVerdict(value: HuntVerificationCanonicalVerdict | undefined): VerificationAttemptDocument["verdict"] {
  switch (value) {
    case "confirmed": return "confirmed";
    case "not-reproduced": return "not_reproduced";
    case "not-supported": return "not_supported";
    case "environment-error": return "environment_error";
    case "policy-denied": return "policy_denied";
    case "inconclusive":
    case undefined: return "inconclusive";
  }
}

function hashCanonical(value: unknown): string {
  return `sha256:${createHash("sha256").update(canonicalizeJson(value), "utf8").digest("hex")}`;
}

function digest(value: unknown): ContentDigest {
  return parseDigestString(hashCanonical(value));
}

function parseDigestString(value: string): ContentDigest {
  const separator = value.indexOf(":");
  if (separator <= 0) throw new Error("Hunt verification digest is invalid");
  return ContentDigestSchema.parse({ algorithm: value.slice(0, separator), value: value.slice(separator + 1) });
}
