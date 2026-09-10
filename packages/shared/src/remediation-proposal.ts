import { z } from "zod";
import { StableContractIdSchema } from "./engine.js";

const Text = z.string().min(1).max(4096);
export const RemediationProposalSchema = z.object({
  proposalId: z.string().uuid(),
  findingId: StableContractIdSchema,
  targetSubjectId: z.string().min(1).max(180),
  files: z.array(z.string().min(1).max(4096)).min(1).max(64),
  summary: Text,
  tests: z.array(Text).max(32),
  policyEffect: Text,
  uncertainty: Text,
  networkRequired: z.literal(false),
  applied: z.literal(false),
}).strict();
export type RemediationProposal = z.infer<typeof RemediationProposalSchema>;
export function parseRemediationProposal(value: unknown): RemediationProposal { const parsed = RemediationProposalSchema.safeParse(value); if (!parsed.success) throw new Error(`Invalid remediation proposal: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`); return parsed.data; }
