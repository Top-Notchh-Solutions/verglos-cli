import { createHash } from "node:crypto";
import { z } from "zod";
import { StableContractIdSchema } from "./engine.js";
import { canonicalizeJson } from "./schema.js";
import { SubjectIdSchema } from "./subject.js";

const Fingerprint = z.string().regex(/^sha256:[a-f0-9]{64}$/);
const Timestamp = z.string().datetime({ offset: true });
export const BaselineDocumentSchema = z.object({
  schemaId: z.literal("urn:verglos:schema:baseline"),
  schemaVersion: z.literal("1.0.0"),
  subjectId: SubjectIdSchema,
  policyId: StableContractIdSchema,
  policyVersion: z.string().min(1).max(64),
  policyDigest: Fingerprint,
  acceptedFingerprints: z.array(Fingerprint).max(10000),
  createdAt: Timestamp,
  expiresAt: Timestamp.optional(),
}).strict().superRefine((value, ctx) => {
  if (new Set(value.acceptedFingerprints).size !== value.acceptedFingerprints.length) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["acceptedFingerprints"], message: "baseline fingerprints must be unique" });
  if (value.expiresAt && value.expiresAt <= value.createdAt) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["expiresAt"], message: "baseline expiry must follow creation" });
});
export type BaselineDocument = z.infer<typeof BaselineDocumentSchema>;
export function parseBaseline(value: unknown): BaselineDocument {
  const parsed = BaselineDocumentSchema.safeParse(value);
  if (!parsed.success) throw new Error(`Invalid baseline: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`);
  return parsed.data;
}
export function baselineDigest(baseline: BaselineDocument): string {
  return `sha256:${createHash("sha256").update(canonicalizeJson(parseBaseline(baseline)), "utf8").digest("hex")}`;
}

export function classifyBaseline(baseline: BaselineDocument, subjectId: string, policyDigest: string, at: string): "matched" | "mismatched" | "stale" {
  const parsed = parseBaseline(baseline);
  if (parsed.subjectId !== SubjectIdSchema.parse(subjectId) || parsed.policyDigest !== Fingerprint.parse(policyDigest)) return "mismatched";
  return parsed.expiresAt && at >= parsed.expiresAt ? "stale" : "matched";
}
