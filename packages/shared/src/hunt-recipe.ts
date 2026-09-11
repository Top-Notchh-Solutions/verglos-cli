import { z } from "zod";
import { ContentDigestSchema, SubjectIdSchema } from "./subject.js";
import { StableContractIdSchema } from "./engine.js";

export const HuntRecipeSchema = z.object({
  schemaId: z.literal("urn:verglos:schema:hunt-recipe"),
  schemaVersion: z.literal("1.0.0"),
  recipeId: StableContractIdSchema,
  ruleId: StableContractIdSchema,
  targetSubjectId: SubjectIdSchema,
  imageDigest: ContentDigestSchema,
  command: z.array(z.string().min(1).max(4096)).min(1).max(32),
  assertions: z.array(z.string().min(1).max(4096)).min(1).max(64),
  inputs: z.record(z.string().min(1).max(128), z.string().max(4096)).optional(),
  isolation: z.enum(["none", "restricted-process", "container", "gvisor", "microvm"]),
  limits: z.object({ timeoutMs: z.number().int().positive().max(600_000), memoryMb: z.number().int().positive().max(16_384), outputBytes: z.number().int().positive().max(10_000_000) }).strict(),
  cleanup: z.enum(["always", "on-success", "none"]),
  network: z.object({ mode: z.enum(["denied", "allowlist"]), destinations: z.array(z.string().url().max(2048)).max(32), reason: z.string().min(1).max(1024) }).strict(),
  redaction: z.enum(["required", "best-effort"]),
  signature: z.object({ status: z.enum(["verified", "unverified", "invalid"]), signer: z.string().min(1).max(512).optional() }).strict(),
}).strict().superRefine((value, ctx) => {
  if (value.imageDigest.algorithm !== "sha256") ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["imageDigest", "algorithm"], message: "Hunt image digests must use sha256" });
  if (value.network.mode === "denied" && value.network.destinations.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["network", "destinations"], message: "denied network cannot list destinations" });
  if (value.network.mode === "allowlist" && value.isolation === "none") ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["isolation"], message: "allowlisted network requires an isolated execution adapter" });
  if (value.signature.status === "verified" && !value.signature.signer) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["signature", "signer"], message: "verified recipe requires signer" });
});
export type HuntRecipe = z.infer<typeof HuntRecipeSchema>;
export function parseHuntRecipe(value: unknown): HuntRecipe { const parsed = HuntRecipeSchema.safeParse(value); if (!parsed.success) throw new Error(`Invalid Hunt recipe: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`); return parsed.data; }
