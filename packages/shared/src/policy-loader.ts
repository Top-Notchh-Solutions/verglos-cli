import { z } from "zod";
import { policyDocumentDigest, parsePolicyDocument, type PolicyDocument } from "./policy-document.js";

const LayerSchema = z.object({
  policyId: z.string().min(1).max(128).optional(),
  policyVersion: z.string().min(1).max(64).optional(),
  checks: z.array(z.unknown()).max(256).optional(),
  exceptions: z.object({ enabled: z.boolean(), requireApproval: z.boolean() }).strict().optional(),
  approvals: z.object({ required: z.boolean(), authorities: z.array(z.string().min(1).max(512)).max(32) }).strict().optional(),
}).strict();

export type PolicyLayer = z.infer<typeof LayerSchema>;
export interface EffectivePolicy { readonly policy: PolicyDocument; readonly sourceOrder: readonly string[]; readonly digest: string; }

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
    const parsed = LayerSchema.parse(layer);
    const checkMap = new Map(policy.checks.map((check) => [check.id, check]));
    for (const check of parsed.checks ?? []) {
      if (!check || typeof check !== "object" || !("id" in check)) throw new Error(`${name} policy layer contains an invalid check`);
      checkMap.set(String(check.id), check as PolicyDocument["checks"][number]);
    }
    policy = parsePolicyDocument({ ...policy, ...parsed, checks: [...checkMap.values()].sort((a, b) => a.id.localeCompare(b.id)) });
    sourceOrder.push(name);
  }
  return { policy, sourceOrder: Object.freeze(sourceOrder), digest: policyDocumentDigest(policy) };
}
