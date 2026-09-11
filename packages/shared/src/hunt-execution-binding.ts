import { z } from "zod";
import { approvalRequestDigest, ApprovalReceiptSchema, type ApprovalReceipt } from "./approval-receipt.js";
import { canExecuteHunt } from "./hunt-execution-gate.js";
import { huntRecipeDigest, huntRecipeTrustPolicyDigest, parseHuntRecipeTrustPolicy, type HuntRecipeTrustPolicy } from "./hunt-recipe-trust.js";
import { parseHuntRecipe, type HuntRecipe } from "./hunt-recipe.js";
import { ObservationIdSchema } from "./observation.js";
import { StableContractIdSchema } from "./engine.js";
import { ContentDigestSchema, SubjectIdSchema } from "./subject.js";

const ApprovalDigest = z.string().regex(/^sha256:[a-f0-9]{64}$/);
const DigestString = z.string().regex(/^sha(?:256|512):[a-f0-9]+$/);

export const HuntExecutionBindingSchema = z.object({
  schemaId: z.literal("urn:verglos:schema:hunt-execution-binding"),
  schemaVersion: z.literal("1.0.0"),
  recipeDigest: DigestString,
  trustPolicyDigest: DigestString,
  approvalRequestDigest: ApprovalDigest,
  ruleId: StableContractIdSchema,
  subjectId: SubjectIdSchema,
  observationId: ObservationIdSchema,
  imageDigest: ContentDigestSchema,
  command: z.array(z.string().min(1).max(4096)).min(1).max(32),
  assertions: z.array(z.string().min(1).max(4096)).min(1).max(64),
  isolation: z.enum(["none", "restricted-process", "container", "gvisor", "microvm"]),
  limits: z.object({ timeoutMs: z.number().int().positive().max(600_000), memoryMb: z.number().int().positive().max(16_384), outputBytes: z.number().int().positive().max(10_000_000), processes: z.number().int().positive().max(4_096) }).strict(),
  cleanup: z.enum(["always", "on-success", "none"]),
  redaction: z.enum(["required", "best-effort"]),
  network: z.object({ mode: z.enum(["denied", "allowlist"]), destinations: z.array(z.string().url().max(2048)).max(32) }).strict(),
}).strict();

export type HuntExecutionBinding = z.infer<typeof HuntExecutionBindingSchema>;

export function bindHuntExecution(input: {
  readonly recipe: HuntRecipe;
  readonly trust: HuntRecipeTrustPolicy;
  readonly approval: ApprovalReceipt;
  readonly ruleId: string;
  readonly subjectId: string;
  readonly observationId: string;
  readonly at: string;
}): HuntExecutionBinding {
  const recipe = parseHuntRecipe(input.recipe);
  const trust = parseHuntRecipeTrustPolicy(input.trust);
  const approval = ApprovalReceiptSchema.parse(input.approval);
  if (!canExecuteHunt(recipe, { ruleId: input.ruleId, subjectId: input.subjectId, at: input.at, approval }, trust)) {
    throw new Error("Hunt execution binding requires an exact trusted recipe and usable approval");
  }
  const { decision: _decision, decidedBy: _decidedBy, decidedAt: _decidedAt, requestDigest: _requestDigest, ...request } = approval;
  const binding = HuntExecutionBindingSchema.parse({
    schemaId: "urn:verglos:schema:hunt-execution-binding",
    schemaVersion: "1.0.0",
    recipeDigest: huntRecipeDigest(recipe),
    trustPolicyDigest: huntRecipeTrustPolicyDigest(trust),
    approvalRequestDigest: approvalRequestDigest(request),
    ruleId: input.ruleId,
    subjectId: input.subjectId,
    observationId: input.observationId,
    imageDigest: recipe.imageDigest,
    command: [...recipe.command],
    assertions: [...recipe.assertions],
    isolation: recipe.isolation,
    limits: { ...recipe.limits },
    cleanup: recipe.cleanup,
    redaction: recipe.redaction,
    network: { mode: recipe.network.mode, destinations: [...recipe.network.destinations] },
  });
  return Object.freeze({ ...binding, imageDigest: Object.freeze({ ...binding.imageDigest }), network: Object.freeze({ ...binding.network, destinations: Object.freeze([...binding.network.destinations]) }) }) as HuntExecutionBinding;
}
