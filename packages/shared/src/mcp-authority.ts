import { actionAuthority, type ActionAuthority, type AgentAction } from "./action-authority.js";

const TOOL_ACTIONS: Record<string, AgentAction> = {
  verglos_check_before_write: "inspect",
  verglos_check_package: "inspect",
  verglos_scan: "inspect",
  verglos_explain_finding: "propose",
  verglos_hunt_finding: "execute",
  verglos_hunt_report: "execute",
  verglos_hunt_before_write: "execute",
  verglos_hunt_explain_verdict: "propose",
  verglos_attest: "sign",
};

export function mcpToolAuthority(toolName: string): ActionAuthority | undefined {
  const action = TOOL_ACTIONS[toolName];
  return action ? actionAuthority(action) : undefined;
}

export function listMcpToolAuthority(): readonly { readonly tool: string; readonly action: AgentAction; readonly approvalRequired: boolean }[] {
  return Object.freeze(Object.entries(TOOL_ACTIONS).sort(([a], [b]) => a.localeCompare(b)).map(([tool, action]) => Object.freeze({ tool, action, approvalRequired: actionAuthority(action).approvalRequired })));
}
