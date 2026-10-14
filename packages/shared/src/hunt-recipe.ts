import { z } from "zod";
import { ContentDigestSchema, SubjectIdSchema } from "./subject.js";
import { StableContractIdSchema } from "./engine.js";

const noControls = (value: string) => !/[\u0000-\u001f\u007f]/.test(value);
export const HuntRuleIdSchema = z.string().min(1).max(128).regex(/^[A-Za-z][A-Za-z0-9]*(?:[._:-][A-Za-z0-9]+)*$/u);

function parseNetworkOrigin(value: string): URL | undefined {
  try { return new URL(value); } catch { return undefined; }
}

export const HuntResourceLimitsSchema = z.object({
  timeoutMs: z.number().int().positive().max(600_000),
  cpuMs: z.number().int().positive().max(600_000),
  memoryMb: z.number().int().positive().max(16_384),
  diskMb: z.number().int().positive().max(16_384),
  outputBytes: z.number().int().positive().max(10_000_000),
  processes: z.number().int().positive().max(4_096),
  maxNetworkRequests: z.number().int().nonnegative().safe(),
}).strict().superRefine((value, ctx) => {
  if (value.cpuMs > value.timeoutMs) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["cpuMs"], message: "CPU-time limit cannot exceed the wall-clock timeout" });
});

const HuntFixtureRefSchema = z.object({
  fixtureId: StableContractIdSchema,
  expectedVerdict: z.enum(["confirmed", "not-reproduced", "inconclusive", "environment-error", "not-supported"]),
}).strict();

/**
 * Every executable recipe must name the bounded controls that qualify it.
 * These are references to fixture implementations, never raw target input or
 * source content. The expected verdict mapping keeps infrastructure failure
 * and unsupported coverage from being reported as a security result.
 */
export const HuntFixtureContractSchema = z.object({
  positive: HuntFixtureRefSchema,
  negative: HuntFixtureRefSchema,
  timeout: HuntFixtureRefSchema,
  infrastructureFailure: HuntFixtureRefSchema,
  unsupported: HuntFixtureRefSchema,
}).strict().superRefine((value, ctx) => {
  const expected = {
    positive: "confirmed",
    negative: "not-reproduced",
    timeout: "environment-error",
    infrastructureFailure: "environment-error",
    unsupported: "not-supported",
  } as const;
  const ids = Object.values(value).map((fixture) => fixture.fixtureId);
  if (new Set(ids).size !== ids.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [], message: "Hunt fixture IDs must be unique" });
  for (const [kind, fixture] of Object.entries(value) as Array<[keyof typeof expected, (typeof value)[keyof typeof value]]>) {
    if (fixture.expectedVerdict !== expected[kind]) ctx.addIssue({ code: z.ZodIssueCode.custom, path: [kind, "expectedVerdict"], message: `${kind} fixture has an invalid expected verdict` });
  }
});

export const HuntRecipeSchema = z.object({
  schemaId: z.literal("urn:verglos:schema:hunt-recipe"),
  schemaVersion: z.literal("1.0.0"),
  recipeId: StableContractIdSchema,
  // Scanner rule IDs are stable public identifiers but retain their
  // human-readable uppercase form (for example D1-001 and AGENT-001).
  ruleId: HuntRuleIdSchema,
  targetSubjectId: SubjectIdSchema,
  imageDigest: ContentDigestSchema,
  command: z.array(z.string().min(1).max(4096).refine(noControls, "command contains control characters")).min(1).max(32),
  assertions: z.array(z.string().min(1).max(4096).refine(noControls, "assertion contains control characters")).min(1).max(64),
  fixtures: HuntFixtureContractSchema,
  inputs: z.record(z.string().min(1).max(128).refine(noControls, "input name contains control characters"), z.string().max(4096).refine(noControls, "input contains control characters")).optional(),
  isolation: z.enum(["none", "restricted-process", "container", "gvisor", "microvm"]),
  limits: HuntResourceLimitsSchema,
  cleanup: z.enum(["always", "on-success", "none"]),
  network: z.object({ mode: z.enum(["denied", "allowlist"]), destinations: z.array(z.string().url().max(2048)).max(32), reason: z.string().min(1).max(1024).refine(noControls, "network reason contains control characters") }).strict(),
  redaction: z.enum(["required", "best-effort"]),
  signature: z.object({ status: z.enum(["verified", "unverified", "invalid"]), signer: z.string().min(1).max(512).optional(), expiresAt: z.string().datetime({ offset: true }).optional() }).strict(),
}).strict().superRefine((value, ctx) => {
  if (new Set(value.network.destinations).size !== value.network.destinations.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["network", "destinations"], message: "network destinations must not contain duplicates" });
  }
  if (value.network.mode === "denied" && value.limits.maxNetworkRequests !== 0) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["limits", "maxNetworkRequests"], message: "denied network requires a zero request limit" });
  if (value.network.mode === "allowlist" && value.limits.maxNetworkRequests === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["limits", "maxNetworkRequests"], message: "allowlisted network requires an explicit positive request limit" });
  if (value.network.mode === "allowlist" && value.network.destinations.length === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["network", "destinations"], message: "allowlisted network requires at least one destination" });
  if (value.imageDigest.algorithm !== "sha256") ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["imageDigest", "algorithm"], message: "Hunt image digests must use sha256" });
  if (value.network.mode === "denied" && value.network.destinations.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["network", "destinations"], message: "denied network cannot list destinations" });
  if (value.network.mode === "allowlist" && value.isolation === "none") ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["isolation"], message: "allowlisted network requires an isolated execution adapter" });
  if (value.network.mode === "allowlist" && value.network.destinations.some((destination) => !destination.startsWith("https://"))) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["network", "destinations"], message: "allowlisted network destinations must use HTTPS" });
  if (value.network.destinations.some((destination) => { const url = parseNetworkOrigin(destination); return url !== undefined && (url.username.length > 0 || url.password.length > 0); })) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["network", "destinations"], message: "network destinations must not embed credentials" });
  if (value.network.destinations.some((destination) => { const url = parseNetworkOrigin(destination); return url !== undefined && (url.pathname !== "/" || url.search.length > 0 || url.hash.length > 0); })) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["network", "destinations"], message: "network destinations must be HTTPS origins without path, query, or fragment" });
  if (value.signature.status === "verified" && !value.signature.signer) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["signature", "signer"], message: "verified recipe requires signer" });
});
export type HuntRecipe = z.infer<typeof HuntRecipeSchema>;
export function parseHuntRecipe(value: unknown): HuntRecipe { const parsed = HuntRecipeSchema.safeParse(value); if (!parsed.success) throw new Error(`Invalid Hunt recipe: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`); return parsed.data; }
