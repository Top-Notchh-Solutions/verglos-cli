import { randomUUID } from "node:crypto";
import { lookupRule, type ExplainEntry } from "@verglos/shared";
import { parseRemediationProposal, type RemediationProposal } from "@verglos/shared";

/**
 * verglos_explain_finding MCP tool — same explain-bank the CLI
 * (verglos explain <rule>) consumes. Returns the full rule entry
 * as structured JSON so the agent can format it however it wants
 * or hand the human a link to a docs URL.
 */

export interface ExplainFindingInput {
  rule: string;
  targetSubjectId?: string;
  files?: string[];
}

export interface ExplainFindingResult {
  found: boolean;
  rule: string;
  entry?: ExplainEntry;
  proposal?: RemediationProposal;
  message?: string;
}

export function explainFinding(input: ExplainFindingInput): ExplainFindingResult {
  if (!input || typeof input !== "object" || typeof input.rule !== "string") {
    throw new Error("explain_finding requires a string rule");
  }
  if (input.rule.length === 0 || input.rule.length > 256) {
    throw new Error("explain_finding rule exceeds bounds");
  }
  const entry = lookupRule(input.rule);
  if (!entry) {
    return {
      found: false,
      rule: input.rule,
      message: `Unknown rule id \`${input.rule}\`. Run \`verglos explain --list\` for every rule Verglos knows about.`,
    };
  }
  if ((input.targetSubjectId === undefined) !== (input.files === undefined)) {
    throw new Error("explain_finding remediation proposal requires targetSubjectId and files together");
  }
  if (input.targetSubjectId !== undefined && input.files !== undefined) {
    if (!input.targetSubjectId || input.targetSubjectId.length > 180) throw new Error("explain_finding targetSubjectId exceeds bounds");
    if (input.files.length === 0 || input.files.length > 64) throw new Error("explain_finding files must contain 1 to 64 paths");
    for (const file of input.files) {
      if (!file || file.length > 4096 || file.startsWith("/") || file.includes("\\") || file.split("/").some((part) => part === ".." || part === "")) throw new Error("explain_finding files must be bounded relative paths");
    }
  }
  const proposal = input.targetSubjectId && input.files
    ? parseRemediationProposal({
        proposalId: randomUUID(),
        findingId: entry.rule.toLowerCase(),
        targetSubjectId: input.targetSubjectId,
        files: [...new Set(input.files)],
        summary: entry.fix,
        tests: ["Run the project's existing security and regression tests.", "Re-run the Verglos scan and confirm the finding is resolved."],
        policyEffect: `${entry.severity} finding ${entry.rule} may be cleared only after the proposed change and rescan are reviewed.`,
        uncertainty: "This is guidance, not an applied or verified patch; inspect the diff and test results before approval.",
        networkRequired: false,
        applied: false,
      })
    : undefined;
  return {
    found: true,
    rule: entry.rule,
    entry,
    ...(proposal ? { proposal } : {}),
  };
}
