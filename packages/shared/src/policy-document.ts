import { createHash } from "node:crypto";
import { z } from "zod";
import { StableContractIdSchema } from "./engine.js";
import { canonicalizeJson } from "./schema.js";

export const POLICY_DOCUMENT_SCHEMA = { id: "urn:verglos:schema:policy-document", version: "1.0.0" } as const;
const SafeText = z.string().min(1).max(512).refine((value) => !/[\u0000-\u001f\u007f]/.test(value), "text contains unsafe control characters");
const CheckSchema = z.object({
  id: StableContractIdSchema,
  requirement: z.enum(["required", "advisory"]),
  onFailure: z.enum(["BLOCK", "REVIEW"]),
  severities: z.array(z.enum(["critical", "high", "medium", "low", "info"])).min(1).max(5),
  minimumConfidence: z.number().min(0).max(1),
  freshness: z.enum(["current", "allow-stale"]),
  coverage: z.enum(["complete", "allow-incomplete"]),
  artifactMatch: z.enum(["required", "advisory", "not-required"]),
  hunt: z.enum(["required", "advisory", "not-required"]),
}).strict().superRefine((value, ctx) => {
  if (value.requirement === "advisory" && value.onFailure !== "REVIEW") ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["onFailure"], message: "advisory checks cannot block" });
});

export const PolicyDocumentSchema = z.object({
  schemaId: z.literal(POLICY_DOCUMENT_SCHEMA.id),
  schemaVersion: z.literal(POLICY_DOCUMENT_SCHEMA.version),
  policyId: StableContractIdSchema,
  policyVersion: SafeText,
  checks: z.array(CheckSchema).min(1).max(256),
  exceptions: z.object({ enabled: z.boolean(), requireApproval: z.boolean() }).strict(),
  approvals: z.object({ required: z.boolean(), authorities: z.array(SafeText).max(32) }).strict(),
  extensions: z.record(z.string().regex(/^urn:verglos:extension:/), z.unknown()).superRefine((value, ctx) => { if (Object.keys(value).length > 64) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "policy extensions exceed 64 entries" }); try { if (Buffer.byteLength(canonicalizeJson(value), "utf8") > 65_536) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "policy extensions exceed 65536 canonical bytes" }); } catch { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "policy extensions must be canonical JSON data" }); } }).optional(),
}).strict().superRefine((value, ctx) => {
  if (new Set(value.checks.map((check) => check.id)).size !== value.checks.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["checks"], message: "policy check IDs must be unique" });
  if (value.approvals.required && value.approvals.authorities.length === 0) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["approvals", "authorities"], message: "required approvals need named authorities" });
});

export type PolicyDocument = z.infer<typeof PolicyDocumentSchema>;
export class PolicyDocumentValidationError extends Error { override readonly name = "PolicyDocumentValidationError"; constructor(readonly issues: readonly { readonly path: string; readonly code: string; readonly message: string }[]) { super("Policy document validation failed."); } }
export function parsePolicyDocument(value: unknown): PolicyDocument {
  const parsed = PolicyDocumentSchema.safeParse(value);
  if (!parsed.success) throw new PolicyDocumentValidationError(parsed.error.issues.map((issue) => ({ path: issue.path.join("."), code: issue.code, message: issue.message })));
  return parsed.data;
}
export function policyDocumentDigest(policy: PolicyDocument): string {
  return `sha256:${createHash("sha256").update(canonicalizeJson(parsePolicyDocument(policy)), "utf8").digest("hex")}`;
}
