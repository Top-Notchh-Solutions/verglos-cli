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
export function listMcpCapabilities(): readonly McpCapability[] { return Object.freeze(CAPABILITIES.map((capability) => ({ ...capability, approvalRequired: mcpToolAuthority(capability.tool)?.approvalRequired ?? true }))); }
