import { mcpToolAuthority } from "./mcp-authority.js";

export interface McpCapability { readonly tool: string; readonly plan: "free" | "pro" | "studio"; readonly maturity: "shipped" | "partial"; readonly approvalRequired: boolean; }
const CAPABILITIES: readonly Omit<McpCapability, "approvalRequired">[] = [
  { tool: "verglos_check_before_write", plan: "free", maturity: "shipped" },
  { tool: "verglos_check_package", plan: "free", maturity: "shipped" },
  { tool: "verglos_scan", plan: "free", maturity: "shipped" },
  { tool: "verglos_explain_finding", plan: "free", maturity: "shipped" },
  { tool: "verglos_hunt_finding", plan: "pro", maturity: "partial" },
  { tool: "verglos_hunt_report", plan: "pro", maturity: "partial" },
  { tool: "verglos_hunt_before_write", plan: "pro", maturity: "partial" },
  { tool: "verglos_hunt_explain_verdict", plan: "pro", maturity: "partial" },
  { tool: "verglos_attest", plan: "studio", maturity: "partial" },
];
export function listMcpCapabilities(): readonly McpCapability[] {
  return Object.freeze(CAPABILITIES.map((capability) => Object.freeze({
    ...capability,
    approvalRequired: mcpToolAuthority(capability.tool)?.approvalRequired ?? true,
  })));
}

export function reconcileMcpCapabilities(registeredTools: readonly string[]): readonly McpCapability[] {
  if (!registeredTools.every((tool) => typeof tool === "string" && tool.length > 0)) throw new Error("MCP tool and capability registries are out of sync");
  const capabilities = listMcpCapabilities(); const expected = new Set(capabilities.map((item) => item.tool)); const actual = new Set(registeredTools);
  if (actual.size !== registeredTools.length || actual.size !== expected.size || [...expected].some((tool) => !actual.has(tool))) throw new Error("MCP tool and capability registries are out of sync");
  return capabilities;
}
