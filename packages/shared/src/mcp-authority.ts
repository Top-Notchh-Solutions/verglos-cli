import { actionAuthority, type ActionAuthority, type AgentAction } from "./action-authority.js";

const PACKAGE_LOOKUP_NETWORK = Object.freeze([
  "https://api.osv.dev",
  "https://registry.npmjs.org",
]);

const TOOL_ACTIONS: Record<string, { readonly action: AgentAction; readonly networkTargets?: readonly string[] }> = {
  verglos_check_before_write: { action: "inspect" },
  verglos_check_package: { action: "network", networkTargets: PACKAGE_LOOKUP_NETWORK },
  verglos_scan: { action: "network", networkTargets: PACKAGE_LOOKUP_NETWORK },
  verglos_explain_finding: { action: "propose" },
  verglos_hunt_finding: { action: "execute" },
  verglos_hunt_report: { action: "execute" },
  verglos_hunt_before_write: { action: "execute" },
  verglos_hunt_explain_verdict: { action: "propose" },
  verglos_attest: { action: "sign" },
};

export interface McpToolAuthority extends ActionAuthority {
  readonly networkTargets: readonly string[];
}

export function mcpToolAuthority(toolName: string): McpToolAuthority | undefined {
  const metadata = TOOL_ACTIONS[toolName];
  if (!metadata) return undefined;
  const authority = actionAuthority(metadata.action);
  return Object.freeze({
    ...authority,
    networkTargets: metadata.networkTargets ?? Object.freeze([]),
  });
}

export function listMcpToolAuthority(): readonly { readonly tool: string; readonly action: AgentAction; readonly approvalRequired: boolean; readonly sideEffect: ActionAuthority["sideEffect"]; readonly networkTargets: readonly string[] }[] {
  return Object.freeze(Object.keys(TOOL_ACTIONS).sort((a, b) => a.localeCompare(b)).map((tool) => {
    const authority = mcpToolAuthority(tool)!;
    return Object.freeze({ tool, action: authority.action, approvalRequired: authority.approvalRequired, sideEffect: authority.sideEffect, networkTargets: authority.networkTargets });
  }));
}
