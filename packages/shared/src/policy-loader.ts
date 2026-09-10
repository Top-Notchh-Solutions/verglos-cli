import { z } from "zod";
import { policyDocumentDigest, parsePolicyDocument, type PolicyDocument } from "./policy-document.js";
import { canonicalizeJson } from "./schema.js";

const LayerSchema = z.object({
  policyId: z.string().min(1).max(128).optional(),
  policyVersion: z.string().min(1).max(64).optional(),
  checks: z.array(z.unknown()).max(256).optional(),
  exceptions: z.object({ enabled: z.boolean(), requireApproval: z.boolean() }).strict().optional(),
  approvals: z.object({ required: z.boolean(), authorities: z.array(z.string().min(1).max(512)).max(32) }).strict().optional(),
}).strict();

export type PolicyLayer = z.infer<typeof LayerSchema>;
export interface EffectivePolicy { readonly policy: PolicyDocument; readonly sourceOrder: readonly string[]; readonly digest: string; }
export class PolicyLayerValidationError extends Error { override readonly name = "PolicyLayerValidationError"; constructor(readonly source: string, readonly issues: readonly { readonly path: string; readonly message: string }[]) { super(`Invalid ${source} policy layer.`); } }

export function resolveEffectivePolicy(input: {
  readonly defaults: PolicyDocument;
  readonly organization?: PolicyLayer;
  readonly config?: PolicyLayer;
  readonly cli?: PolicyLayer;
}): EffectivePolicy {
  let policy = parsePolicyDocument(input.defaults);
  const sourceOrder = ["defaults"];
  for (const [name, layer] of [["organization", input.organization], ["config", input.config], ["cli", input.cli]] as const) {
    if (!layer) continue;
    let parsed: PolicyLayer; try { if (Buffer.byteLength(canonicalizeJson(layer), "utf8") > 1_048_576) throw new Error("layer exceeds 1 MiB"); parsed = LayerSchema.parse(layer); } catch (error) { const issues = error instanceof z.ZodError ? error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })) : [{ path: "", message: error instanceof Error ? error.message : "invalid layer" }]; throw new PolicyLayerValidationError(name, issues); }
    const checkMap = new Map(policy.checks.map((check) => [check.id, check]));
    for (const check of parsed.checks ?? []) {
      if (!check || typeof check !== "object" || !("id" in check)) throw new Error(`${name} policy layer contains an invalid check`);
      try { const validated = parsePolicyDocument({ ...policy, checks: [check] }).checks[0]; if (!validated) throw new Error("missing check"); checkMap.set(validated.id, validated); } catch { throw new PolicyLayerValidationError(name, [{ path: "checks", message: "policy layer contains an invalid check" }]); }
    }
    policy = parsePolicyDocument({ ...policy, ...parsed, checks: [...checkMap.values()].sort((a, b) => a.id.localeCompare(b.id)) });
    sourceOrder.push(name);
  }
  return { policy, sourceOrder: Object.freeze(sourceOrder), digest: policyDocumentDigest(policy) };
}
