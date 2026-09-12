import { mcpToolAuthority } from "./mcp-authority.js";

export interface McpCapability { readonly tool: string; readonly action: NonNullable<ReturnType<typeof mcpToolAuthority>>["action"]; readonly plan: "free" | "pro" | "team" | "studio" | "enterprise"; readonly maturity: "shipped" | "partial"; readonly approvalRequired: boolean; readonly sideEffect: NonNullable<ReturnType<typeof mcpToolAuthority>>["sideEffect"]; readonly networkTargets: readonly string[]; readonly inputFields: readonly string[]; readonly outputFields: readonly string[]; }
const CAPABILITIES: readonly Omit<McpCapability, "action" | "approvalRequired" | "sideEffect" | "networkTargets">[] = [
  { tool: "verglos_check_before_write", plan: "free", maturity: "shipped", inputFields: ["code", "targetPath", "language", "context"], outputFields: ["verdict", "findings", "correctedCode", "reasoning", "failure"] },
  { tool: "verglos_check_package", plan: "free", maturity: "shipped", inputFields: ["packageName", "version", "approvalReceipt"], outputFields: ["verdict", "packageName", "version", "exists", "typosquat", "cves", "coverage", "limitations", "reasoning", "failure"] },
  { tool: "verglos_scan", plan: "free", maturity: "shipped", inputFields: ["projectRoot", "limit", "noProvenance", "approvalReceipt"], outputFields: ["projectRoot", "scannedAt", "durationMs", "score", "provenance", "findingCount", "findings", "truncated", "headline", "failure"] },
  { tool: "verglos_explain_finding", plan: "free", maturity: "shipped", inputFields: ["rule", "targetSubjectId", "files"], outputFields: ["found", "rule", "entry", "proposal", "message", "failure"] },
  { tool: "verglos_hunt_finding", plan: "pro", maturity: "partial", inputFields: ["reportPath", "findingId", "approvalReceipt"], outputFields: ["ok", "error", "tool", "tier", "message", "docsUrl", "failure"] },
  { tool: "verglos_hunt_report", plan: "pro", maturity: "partial", inputFields: ["reportPath", "approvalReceipt"], outputFields: ["ok", "error", "tool", "tier", "message", "docsUrl", "failure"] },
  { tool: "verglos_hunt_before_write", plan: "pro", maturity: "partial", inputFields: ["code", "filePath", "language", "approvalReceipt"], outputFields: ["ok", "error", "tool", "tier", "message", "docsUrl", "failure"] },
  { tool: "verglos_hunt_explain_verdict", plan: "pro", maturity: "partial", inputFields: ["findingId", "verdict", "approvalReceipt"], outputFields: ["ok", "error", "tool", "tier", "message", "docsUrl", "failure"] },
  { tool: "verglos_attest", plan: "studio", maturity: "partial", inputFields: ["reportPath", "signingConfig", "approvalReceipt"], outputFields: ["ok", "error", "tool", "tier", "message", "docsUrl", "failure"] },
];
export function listMcpCapabilities(): readonly McpCapability[] {
  return Object.freeze(CAPABILITIES.map((capability) => Object.freeze({
    ...capability,
    action: mcpToolAuthority(capability.tool)?.action ?? "inspect",
    approvalRequired: mcpToolAuthority(capability.tool)?.approvalRequired ?? true,
    sideEffect: mcpToolAuthority(capability.tool)?.sideEffect ?? "hosted",
    networkTargets: Object.freeze([...(mcpToolAuthority(capability.tool)?.networkTargets ?? [])]),
    inputFields: Object.freeze([...capability.inputFields]),
    outputFields: Object.freeze([...capability.outputFields]),
  })));
}

export function reconcileMcpCapabilities(registeredTools: readonly string[]): readonly McpCapability[] {
  if (!registeredTools.every((tool) => typeof tool === "string" && tool.length > 0)) throw new Error("MCP tool and capability registries are out of sync");
  const capabilities = listMcpCapabilities(); const expected = new Set(capabilities.map((item) => item.tool)); const actual = new Set(registeredTools);
  if (actual.size !== registeredTools.length || actual.size !== expected.size || [...expected].some((tool) => !actual.has(tool))) throw new Error("MCP tool and capability registries are out of sync");
  return capabilities;
}
