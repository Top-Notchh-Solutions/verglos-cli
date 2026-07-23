import { lookupRule, type ExplainEntry } from "@verglos/shared";

/**
 * verglos_explain_finding MCP tool — same explain-bank the CLI
 * (verglos explain <rule>) consumes. Returns the full rule entry
 * as structured JSON so the agent can format it however it wants
 * or hand the human a link to a docs URL.
 */

export interface ExplainFindingInput {
  rule: string;
}

export interface ExplainFindingResult {
  found: boolean;
  rule: string;
  entry?: ExplainEntry;
  message?: string;
}

export function explainFinding(input: ExplainFindingInput): ExplainFindingResult {
  const entry = lookupRule(input.rule);
  if (!entry) {
    return {
      found: false,
      rule: input.rule,
      message: `Unknown rule id \`${input.rule}\`. Run \`verglos explain --list\` for every rule Verglos knows about.`,
    };
  }
  return {
    found: true,
    rule: entry.rule,
    entry,
  };
}
