import { createRequire } from "node:module";
import { isAbsolute } from "node:path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { authorizeAgentAction, mcpToolAuthority, putApprovalReceipt, reconcileMcpCapabilities, type ApprovalReceipt, type Finding } from "@verglos/shared";
import { checkBeforeWrite } from "./tools/check-before-write.js";
import type {
  CheckBeforeWriteInput as ToolInput,
  CheckBeforeWriteResult as ToolResult,
} from "./tools/check-before-write.js";
import { checkPackage } from "./tools/check-package.js";
import { scanProject } from "./tools/scan.js";
import { explainFinding } from "./tools/explain-finding.js";
import { parseAttestArgs, parseCheckBeforeWriteArgs, parseCheckPackageArgs, parseExplainFindingArgs, parseHuntBeforeWriteArgs, parseHuntExplainVerdictArgs, parseHuntFindingArgs, parseHuntReportArgs, parseScanArgs } from "./input-validation.js";

const require = createRequire(import.meta.url);
const { version: MCP_VERSION } = require("../package.json") as {
  version: string;
};

const MAX_TOOL_ARGUMENT_BYTES = 256 * 1024;
const MAX_TOOL_RESPONSE_BYTES = 512 * 1024;
const APPROVAL_RECEIPT_PROPERTY = {
  approvalReceipt: {
    type: "object",
    description: "Exact, time-bounded approval receipt for this side-effect-capable action.",
    properties: {
      requestId: { type: "string", format: "uuid" },
      action: { type: "string" },
      actor: { type: "string" },
      target: { type: "string" },
      files: { type: "array", items: { type: "string" }, maxItems: 256 },
      network: { type: "array", items: { type: "string", format: "uri" }, maxItems: 64 },
      policyEffect: { type: "string" },
      requestedAt: { type: "string", format: "date-time" },
      expiresAt: { type: "string", format: "date-time" },
      decision: { type: "string", enum: ["approved", "denied"] },
      decidedBy: { type: "string" },
      decidedAt: { type: "string", format: "date-time" },
      requestDigest: { type: "string", pattern: "^sha256:[a-f0-9]{64}$" },
    },
    required: ["requestId", "action", "actor", "target", "files", "network", "policyEffect", "requestedAt", "expiresAt", "decision", "decidedBy", "decidedAt", "requestDigest"],
    additionalProperties: false,
  },
} as const;

/**
 * MCP server for Verglos.
 *
 * All tool handlers are stubs — they respond with a shape
 * that describes the tool but doesn't execute yet. Real handlers
 * land (check_before_write), follow-up (check_package),
 * follow-up (scan), follow-up (explain_finding).
 *
 * Design constraints from design §7:
 *   - Speaks JSON-RPC over stdio
 *   - Startup banner goes to stderr; stdout is reserved for MCP transport
 *   - Zero extra install (bundled in the CLI)
 *   - Host-supplied entitlement is optional; no network lookup occurs on the hot path
 */

// ─── Tool schemas ─────────────────────────────────────────────────────────

export type CheckBeforeWriteInput = ToolInput;
export type CheckBeforeWriteResult = ToolResult;

// ─── Tool registration ────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "verglos_check_before_write",
    description:
      "The killer tool. Agent submits code it's about to write; Verglos returns allow/warn/block and (when possible) a corrected version. Runs only AI-* rules + secret patterns + high-confidence injection checks. <300ms, no network, free forever.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "The code the agent is about to write." },
        targetPath: {
          type: "string",
          description:
            "Target file path (relative or absolute). Verglos uses the extension for language inference.",
        },
        language: {
          type: "string",
          description: "Optional language hint (e.g. 'ts', 'tsx').",
        },
        context: {
          type: "string",
          description: "Optional freeform description of what the code is for.",
        },
      },
      required: ["code", "targetPath"],
    },
  },
  {
    name: "verglos_check_package",
    description:
      "Network lookup: sends the package name/version to npm Registry and OSV. Requires an exact approval receipt for the package target and both network origins. Checks existence, likely typosquats, and known CVEs.",
    inputSchema: {
      type: "object",
      properties: {
        packageName: {
          type: "string",
          description: "The npm package name (e.g. 'reqeusts' or '@stripee/js').",
        },
        version: {
          type: "string",
          description: "Optional version to check for CVEs. Defaults to 'latest'.",
        },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
      required: ["packageName"],
    },
  },
  {
    name: "verglos_scan",
    description:
      "Full project scan. Sends dependency names/versions to npm Registry and OSV for package existence/advisory checks; requires an exact approval receipt bound to this project and both network origins. Returns findings, score, and local provenance summary. Slower than check_before_write — use for pre-PR review, not per-line checks.",
    inputSchema: {
      type: "object",
      properties: {
        projectRoot: {
          type: "string",
          description: "Absolute path to the project root. Defaults to cwd.",
        },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
    },
  },
  {
    name: "verglos_explain_finding",
    description:
      "Explain a Verglos rule id (e.g. 'AI-002') — why it matters, how to fix, and an example when available. Same explain-bank the CLI uses.",
    inputSchema: {
      type: "object",
      properties: {
        rule: {
          type: "string",
          description: "Rule id: 'AI-002', 'D4-001', etc.",
        },
        targetSubjectId: { type: "string", description: "Optional exact immutable subject identity for a non-mutating remediation proposal." },
        files: { type: "array", items: { type: "string" }, description: "Optional bounded relative file scope for the proposal; no files are written." },
      },
      required: ["rule"],
    },
  },
  {
    name: "verglos_hunt_finding",
    description:
      "Pro. Verify one finding from a Verglos report by firing a synthesized proof in a local sandbox. Stub in v2.0.0-alpha; functional in v2.0.0-beta.",
    inputSchema: {
      type: "object",
      properties: {
        reportPath: { type: "string", description: "Path to verglos-report.json." },
        findingId: { type: "string", description: "Finding id to verify." },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
      required: ["reportPath", "findingId"],
    },
  },
  {
    name: "verglos_hunt_report",
    description:
      "Pro. Verify eligible Critical and High findings from a Verglos report in a local sandbox. Stub in v2.0.0-alpha; functional in v2.0.0-beta.",
    inputSchema: {
      type: "object",
      properties: {
        reportPath: { type: "string", description: "Path to verglos-report.json." },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
      required: ["reportPath"],
    },
  },
  {
    name: "verglos_hunt_before_write",
    description:
      "Pro. In-loop verifier for coding agents: submit a code block before write, then receive a sandbox-backed verdict. Stub in v2.0.0-alpha; functional in v2.0.0-beta.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "Code block the agent is about to write." },
        filePath: { type: "string", description: "Target file path." },
        language: { type: "string", description: "Language hint such as ts, tsx, js, jsx." },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
      required: ["code", "filePath", "language"],
    },
  },
  {
    name: "verglos_hunt_explain_verdict",
    description:
      "Pro. Explain a hunt verdict for a finding: verified exploitable, false positive, or not attemptable. Stub in v2.0.0-alpha; functional in v2.0.0-beta.",
    inputSchema: {
      type: "object",
      properties: {
        findingId: { type: "string", description: "Finding id." },
        verdict: {
          type: "string",
          enum: ["true", "false", "not_attemptable"],
          description: "Hunt verdict to explain.",
        },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
      required: ["findingId", "verdict"],
    },
  },
  {
    name: "verglos_attest",
    description:
      "Studio. Sign a verified report into a portable evidence bundle with a public verify URL. Stub in v2.0.0-alpha; functional in v2.0.0-beta.",
    inputSchema: {
      type: "object",
      properties: {
        reportPath: { type: "string", description: "Path to verglos-report.json." },
        signingConfig: {
          type: "object",
          description: "Signing key and verify URL configuration.",
        },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
      required: ["reportPath"],
    },
  },
] as const;

// ─── Handler dispatch ─────────────────────────────────────────────────────

export function jsonResponse(payload: unknown): {
  content: { type: "text"; text: string }[];
} {
  let text: string;
  try {
    const encoded = JSON.stringify(payload, null, 2);
    if (typeof encoded !== "string") throw new Error("response is not serializable");
    text = encoded;
  } catch {
    return { content: [{ type: "text", text: JSON.stringify({ ok: false, error: "output", code: "MCP_OUTPUT_INVALID", message: "tool response is not serializable JSON" }) }] };
  }
  if (Buffer.byteLength(text, "utf8") > MAX_TOOL_RESPONSE_BYTES) {
    return { content: [{ type: "text", text: JSON.stringify({ ok: false, error: "output", code: "MCP_OUTPUT_LIMIT", message: "tool response exceeds the 512 KiB limit" }) }] };
  }
  return { content: [{ type: "text", text }] };
}

function alphaStub(name: string, tier: "pro" | "studio"): {
  ok: false;
  error: "not_implemented_in_alpha" | "studio_only";
  tool: string;
  tier: "pro" | "studio";
  message: string;
  docsUrl: string;
} {
  return {
    ok: false,
    error: tier === "studio" ? "studio_only" : "not_implemented_in_alpha",
    tool: name,
    tier,
    message:
      tier === "studio"
        ? "verglos_attest is a Studio capability and ships functionally in v2.0.0-beta."
        : `${name} is registered in v2.0.0-alpha and ships functionally in v2.0.0-beta.`,
    docsUrl: tier === "studio" ? "https://verglos.com/attest" : "https://verglos.com/hunt",
  };
}

function approvalTarget(name: string, input: Record<string, unknown>): string | undefined {
  if (name === "verglos_scan") {
    const root = input.projectRoot === undefined ? process.cwd() : input.projectRoot;
    return typeof root === "string" && isAbsolute(root) ? `project:${root}` : undefined;
  }
  if (name === "verglos_check_package") {
    return typeof input.packageName === "string"
      ? `npm:${input.packageName.trim()}@${typeof input.version === "string" && input.version.trim() ? input.version.trim() : "latest"}`
      : undefined;
  }
  if (name === "verglos_hunt_report" || name === "verglos_attest") return typeof input.reportPath === "string" ? `report:${input.reportPath}` : undefined;
  if (name === "verglos_hunt_finding") {
    return typeof input.reportPath === "string" && typeof input.findingId === "string" ? `report:${input.reportPath}#finding:${input.findingId}` : undefined;
  }
  if (name === "verglos_hunt_before_write") return typeof input.filePath === "string" ? `file:${input.filePath}` : undefined;
  if (name === "verglos_hunt_explain_verdict") return typeof input.findingId === "string" ? `finding:${input.findingId}` : undefined;
  return undefined;
}

function approvalFile(name: string, input: Record<string, unknown>): string | undefined {
  if (name === "verglos_hunt_report" || name === "verglos_hunt_finding" || name === "verglos_attest") return typeof input.reportPath === "string" ? input.reportPath : undefined;
  if (name === "verglos_hunt_before_write") return typeof input.filePath === "string" ? input.filePath : undefined;
  return undefined;
}

export async function dispatchTool(
  name: string,
  args: Record<string, unknown> | undefined,
  options: { readonly approvalStoreRoot?: string; readonly now?: string; readonly plan?: "free" | "pro" | "team" | "studio" | "enterprise" } = {},
): Promise<{ content: { type: "text"; text: string }[] }> {
  if (args !== undefined && (!args || typeof args !== "object" || Array.isArray(args))) {
    return { content: [{ type: "text", text: JSON.stringify({ ok: false, error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments must be an object" }) }] };
  }
  if (args !== undefined) {
    let encodedArgs: string;
    try {
      const encoded = JSON.stringify(args);
      if (typeof encoded !== "string") throw new Error("arguments are not serializable");
      encodedArgs = encoded;
    } catch {
      return { content: [{ type: "text", text: JSON.stringify({ ok: false, error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments must be serializable JSON" }) }] };
    }
    if (Buffer.byteLength(encodedArgs, "utf8") > MAX_TOOL_ARGUMENT_BYTES) {
      return { content: [{ type: "text", text: JSON.stringify({ ok: false, error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments exceed the 256 KiB limit" }) }] };
    }
  }
  const input = args ?? {};
  const invalid = (code: string, message: string) => ({ content: [{ type: "text" as const, text: JSON.stringify({ ok: false, error: "usage", code, message }) }] });
  const authority = mcpToolAuthority(name);
  const registered = TOOLS.some((tool) => tool.name === name);
  if (!registered) return invalid("MCP_UNKNOWN_TOOL", "unknown MCP tool");
  if (!authority) return invalid("MCP_AUTHORITY_MISSING", "registered MCP tool has no shared authority metadata");
  if (options.plan !== undefined) {
    const capability = listAdvertisedTools().find((tool) => tool.name === name)?._meta?.["verglos/capability"] as { plan?: "free" | "pro" | "team" | "studio" | "enterprise" } | undefined;
    const required = capability?.plan;
    const rank = { free: 0, pro: 1, team: 2, studio: 3, enterprise: 4 } as const;
    if (typeof options.plan !== "string" || !(options.plan in rank)) return invalid("MCP_ENTITLEMENT_INVALID", "invalid entitlement plan");
    if (required && rank[options.plan] < rank[required]) return invalid("MCP_ENTITLEMENT_REQUIRED", `MCP tool requires the ${required} plan`);
  }
  if (authority?.approvalRequired) {
    const approvalReceipt = input.approvalReceipt as ApprovalReceipt | undefined;
    const approval = authorizeAgentAction(authority.action, approvalReceipt, options.now ?? new Date().toISOString());
    if (!approval.allowed) return invalid("MCP_APPROVAL_REQUIRED", `MCP tool authority denied: ${approval.reason}`);
    const target = approvalTarget(name, input);
    if (authority.action === "network" && authority.networkTargets.length === 0) return invalid("MCP_AUTHORITY_MISSING", "network authority has no declared recipient scope");
    if (authority.action === "network" && !target) return invalid("MCP_APPROVAL_SCOPE", "network approval must bind a valid exact target");
    if (target && (input.approvalReceipt as { target?: unknown } | undefined)?.target !== target) return invalid("MCP_APPROVAL_SCOPE", "approval receipt target does not match the requested tool target");
    const receipt = input.approvalReceipt as { files?: unknown; network?: unknown } | undefined;
    const file = approvalFile(name, input);
    if (file && (!Array.isArray(receipt?.files) || !receipt.files.includes(file))) return invalid("MCP_APPROVAL_SCOPE", "approval receipt does not cover the requested file scope");
    const approvedNetwork = Array.isArray(receipt?.network) && receipt.network.every((value) => typeof value === "string") ? [...receipt.network] as string[] : [];
    const requiredNetwork = [...authority.networkTargets];
    if (approvedNetwork.sort().join("\n") !== requiredNetwork.sort().join("\n")) return invalid("MCP_APPROVAL_SCOPE", "approval receipt network scope does not exactly match the requested tool");
    if (options.approvalStoreRoot) {
      try { await putApprovalReceipt(options.approvalStoreRoot, approvalReceipt!); }
      catch { return invalid("MCP_APPROVAL_AUDIT", "approval receipt could not be persisted"); }
    }
  }
  const toolInput = authority?.approvalRequired ? { ...input } : input;
  if (authority?.approvalRequired) delete toolInput.approvalReceipt;
  switch (name) {
    case "verglos_check_before_write": {
      let parsed: CheckBeforeWriteInput; try { parsed = parseCheckBeforeWriteArgs(toolInput); } catch (error) { return invalid("MCP_CHECK_BEFORE_WRITE_INPUT", error instanceof Error ? error.message : "invalid input"); }
      try { return jsonResponse(await checkBeforeWrite(parsed)); } catch { return invalid("MCP_CHECK_BEFORE_WRITE_FAILED", "check_before_write failed"); }
    }
    case "verglos_check_package": {
      let parsed; try { parsed = parseCheckPackageArgs(toolInput); } catch (error) { return invalid("MCP_CHECK_PACKAGE_INPUT", error instanceof Error ? error.message : "invalid input"); }
      try { return jsonResponse(await checkPackage(parsed)); } catch { return invalid("MCP_CHECK_PACKAGE_FAILED", "check_package failed"); }
    }
    case "verglos_scan": {
      let parsed; try { parsed = parseScanArgs(toolInput); } catch (error) { return invalid("MCP_SCAN_INPUT", error instanceof Error ? error.message : "invalid input"); }
      try { return jsonResponse(await scanProject(parsed)); } catch { return invalid("MCP_SCAN_FAILED", "scan failed"); }
    }
    case "verglos_explain_finding": {
      let parsed; try { parsed = parseExplainFindingArgs(toolInput); } catch (error) { return invalid("MCP_EXPLAIN_FINDING_INPUT", error instanceof Error ? error.message : "invalid input"); }
      let result: ReturnType<typeof explainFinding>;
      try { result = explainFinding(parsed); } catch { return invalid("MCP_EXPLAIN_FINDING_FAILED", "explain_finding failed"); }
      return jsonResponse(result);
    }
    case "verglos_hunt_finding":
      try { parseHuntFindingArgs(toolInput); } catch (error) { return invalid("MCP_HUNT_FINDING_INPUT", error instanceof Error ? error.message : "invalid input"); }
      return jsonResponse(alphaStub(name, "pro"));
    case "verglos_hunt_report":
      try { parseHuntReportArgs(toolInput); } catch (error) { return invalid("MCP_HUNT_REPORT_INPUT", error instanceof Error ? error.message : "invalid input"); }
      return jsonResponse(alphaStub(name, "pro"));
    case "verglos_hunt_before_write":
      try { parseHuntBeforeWriteArgs(toolInput); } catch (error) { return invalid("MCP_HUNT_BEFORE_WRITE_INPUT", error instanceof Error ? error.message : "invalid input"); }
      return jsonResponse(alphaStub(name, "pro"));
    case "verglos_hunt_explain_verdict":
      try { parseHuntExplainVerdictArgs(toolInput); } catch (error) { return invalid("MCP_HUNT_EXPLAIN_VERDICT_INPUT", error instanceof Error ? error.message : "invalid input"); }
      return jsonResponse(alphaStub(name, "pro"));
    case "verglos_attest":
      try { parseAttestArgs(toolInput); } catch (error) { return invalid("MCP_ATTEST_INPUT", error instanceof Error ? error.message : "invalid input"); }
      return jsonResponse(alphaStub(name, "studio"));
    default:
      return invalid("MCP_UNKNOWN_TOOL", "unknown MCP tool");
  }
}

// ─── Server factory ───────────────────────────────────────────────────────

/** Build the deterministic tools/list payload from shared capability truth. */
export function listAdvertisedTools() {
  const capabilities = reconcileMcpCapabilities(TOOLS.map((tool) => tool.name));
  return TOOLS.map((t) => {
    const capability = capabilities.find((item) => item.tool === t.name);
    if (!capability) throw new Error("MCP capability metadata is missing");
    const authority = mcpToolAuthority(t.name);
    if (!authority) throw new Error("MCP authority metadata is missing");
    return {
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
      _meta: { "verglos/capability": capability },
      annotations: authority ? {
        readOnlyHint: !authority.approvalRequired,
        destructiveHint: authority.sideEffect === "filesystem" || authority.sideEffect === "identity",
        openWorldHint: authority.sideEffect === "network" || authority.sideEffect === "hosted",
      } : undefined,
    };
  });
}

export interface VerglosMcpServerOptions {
  /** Verified entitlement supplied by the host; omitted preserves alpha compatibility. */
  readonly plan?: "free" | "pro" | "team" | "studio" | "enterprise";
}

export function createVerglosMcpServer(options: VerglosMcpServerOptions = {}): Server {
  const server = new Server(
    {
      name: "verglos",
      version: MCP_VERSION,
    },
    {
      capabilities: {
        tools: {},
      },
    },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: listAdvertisedTools() };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name;
    const args = request.params.arguments as
      | Record<string, unknown>
      | undefined;
    return dispatchTool(name, args, { approvalStoreRoot: process.env.VERGLOS_APPROVAL_STORE, plan: options.plan });
  });

  return server;
}

/**
 * Start an MCP server over stdio. Prints a startup banner to stderr
 * so stdout stays clean for the MCP transport.
 */
export async function startStdioServer(options: VerglosMcpServerOptions = {}): Promise<void> {
  const server = createVerglosMcpServer(options);
  const transport = new StdioServerTransport();
  process.stderr.write("verglos:mcp: server started on stdio\n");
  await server.connect(transport);
}
