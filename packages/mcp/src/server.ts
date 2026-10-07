import { createRequire } from "node:module";
import { isAbsolute } from "node:path";
import { randomUUID } from "node:crypto";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { authorizeAgentAction, createFailure, mcpToolAuthority, putApprovalReceipt, reconcileMcpCapabilities, type ApprovalReceipt, type FailureCategory, type Finding } from "@verglos/shared";
import { checkBeforeWrite } from "./tools/check-before-write.js";
import type {
  CheckBeforeWriteInput as ToolInput,
  CheckBeforeWriteResult as ToolResult,
} from "./tools/check-before-write.js";
import { checkPackage } from "./tools/check-package.js";
import { scanProject } from "./tools/scan.js";
import { explainFinding } from "./tools/explain-finding.js";
import { explainHuntVerdict } from "./tools/explain-hunt-verdict.js";
import { huntBeforeWritePreflight } from "./tools/hunt-before-write.js";
import { checkPolicyRecord } from "./tools/check-policy.js";
import { parseAttestArgs, parseCheckBeforeWriteArgs, parseCheckPackageArgs, parseExplainFindingArgs, parseHuntBeforeWriteArgs, parseHuntExplainVerdictArgs, parseHuntFindingArgs, parseHuntReportArgs, parsePolicyCheckArgs, parseScanArgs } from "./input-validation.js";

const require = createRequire(import.meta.url);
const { version: MCP_VERSION } = require("../package.json") as {
  version: string;
};

const MAX_TOOL_ARGUMENT_BYTES = 256 * 1024;
const MAX_TOOL_RESPONSE_BYTES = 512 * 1024;

function failureCategoryFor(code: string): FailureCategory {
  if (code === "MCP_UNKNOWN_TOOL") return "unsupported";
  if (code === "MCP_ENTITLEMENT_INVALID") return "usage";
  if (code === "MCP_APPROVAL_AUDIT") return "infrastructure";
  if (code === "MCP_AUTHORITY_MISSING") return "integrity";
  if (code.startsWith("MCP_APPROVAL_") || code.startsWith("MCP_ENTITLEMENT_")) return "authorization";
  if (code.startsWith("MCP_OUTPUT_") || code.endsWith("_FAILED")) return "infrastructure";
  return "usage";
}

function mcpError(code: string, message: string, legacyError: "usage" | "output" = "usage") {
  const category = failureCategoryFor(code);
  const categoryCode = category === "authorization"
    ? "verglos.failure.authorization.denied"
    : category === "unsupported"
      ? "verglos.failure.unsupported.tool-unavailable"
      : category === "infrastructure"
        ? "verglos.failure.infrastructure.operation-failed"
        : category === "integrity"
          ? "verglos.failure.integrity.contract-invalid"
        : "verglos.failure.usage.request-invalid";
  const failure = createFailure({
    failureId: `urn:uuid:${randomUUID()}`,
    category,
    code: categoryCode,
    retry: category === "authorization" || category === "infrastructure" ? "after-action" : "never",
    operation: "MCP tool dispatch",
    message: category === "authorization" ? "The MCP request was not authorized." : category === "unsupported" ? "The requested MCP tool is not available." : category === "infrastructure" ? "The MCP operation could not produce a complete result." : category === "integrity" ? "The MCP authority contract could not be verified." : "The MCP request is invalid.",
    limitation: "No successful MCP tool result was produced.",
    action: category === "authorization" ? "Provide the required verified entitlement or exact approval." : category === "unsupported" ? "Use a tool advertised by this server." : category === "infrastructure" ? "Review runtime availability and retry only after the underlying failure is addressed." : category === "integrity" ? "Use a server build with matching tool authority and capability metadata." : "Correct the request and retry.",
    occurredAt: new Date().toISOString(),
  });
  return { content: [{ type: "text" as const, text: JSON.stringify({ ok: false, error: legacyError, code, message, failure }) }] };
}

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
 * Shipped pre-write, package, scan, and explanation tools route through shared
 * scanner, input-boundary, authority, entitlement, and failure contracts.
 * Hunt finding/report calls use an optional host-provided private runtime;
 * before-write is a bounded preflight and never synthesizes arbitrary recipes.
 * Attest remains an explicit compatibility shell. Verdict explanation is
 * bounded and non-executing.
 *
 * Design constraints from design §7:
 *   - Speaks JSON-RPC over stdio
 *   - Startup banner goes to stderr; stdout is reserved for MCP transport
 *   - Zero extra install (bundled in the CLI)
 *   - A host may supply verified entitlement; omission defaults to Free and never triggers network lookup
 */

// ─── Tool schemas ─────────────────────────────────────────────────────────

export type CheckBeforeWriteInput = ToolInput;
export type CheckBeforeWriteResult = ToolResult;

/**
 * Optional host-provided bridge to the private Hunt runtime. The public MCP
 * package only owns the authority/input boundary; it never imports private
 * recipe or sandbox code. A missing bridge is an explicit not-attemptable
 * result, never an implicit fallback to arbitrary process execution.
 */
export interface HuntExecutionBinding {
  readonly recipePath?: string;
  readonly trustStorePath?: string;
  readonly ruleId?: string;
  readonly subjectId?: string;
  readonly observationId?: string;
}

export interface VerglosMcpHuntExecutor {
  executeFinding(input: {
    readonly reportPath: string;
    readonly findingId: string;
    readonly approvalReceipt: ApprovalReceipt;
    readonly binding: HuntExecutionBinding;
  }): Promise<unknown>;
  executeReport(input: {
    readonly reportPath: string;
    readonly approvalReceipt: ApprovalReceipt;
    readonly binding: HuntExecutionBinding;
  }): Promise<unknown>;
}

// ─── Tool registration ────────────────────────────────────────────────────

const TOOLS = [
  {
    name: "verglos_check_before_write",
    description:
      "Agent submits code it's about to write; Verglos returns an allow/warn/block decision, shared Finding records attributed to the requested target path, explicit partial fast-path coverage, and (when possible) a corrected version. Runs only AI-* rules + secret patterns + high-confidence injection checks. No network.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", maxLength: 1000000, description: "The code the agent is about to write; bounded to 1,000,000 UTF-8 bytes at runtime." },
        targetPath: {
          type: "string",
          maxLength: 4096,
          description:
            "Target file path (relative or absolute). Verglos uses the basename extension for language inference and preserves this exact path as finding attribution.",
        },
        language: {
          type: "string",
          maxLength: 128,
          description: "Optional language hint (e.g. 'ts', 'tsx').",
        },
        context: {
          type: "string",
          maxLength: 4096,
          description: "Optional freeform description of what the code is for.",
        },
      },
      required: ["code", "targetPath"],
      additionalProperties: false,
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
          maxLength: 512,
          description: "The npm package name (e.g. 'reqeusts' or '@stripee/js').",
        },
        version: {
          type: "string",
          maxLength: 512,
          description: "Optional version to check for CVEs. Defaults to 'latest'.",
        },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
      required: ["packageName"],
      additionalProperties: false,
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
        limit: { type: "integer", minimum: 0, maximum: 1000, description: "Maximum findings returned; 0 returns all findings." },
        noProvenance: { type: "boolean", description: "Opt out of local provenance collection." },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
      additionalProperties: false,
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
      additionalProperties: false,
    },
  },
  {
    name: "verglos_policy_check",
    description:
      "Validate and explain the canonical policy evaluation in a content-addressed Release Record. Verifies the policy digest, exact subject, referenced observations and evidence member digests, plus the deterministic decision fields. Read-only; does not rerun evidence producers or claim producer facts are true.",
    inputSchema: {
      type: "object",
      properties: {
        manifestPath: { type: "string", maxLength: 4096, description: "Absolute path to Release Record manifest JSON (max 8 MiB); symlinks are rejected." },
        recordStore: { type: "string", maxLength: 4096, description: "Absolute path to the content-addressed store (max 256 members / 32 MiB total); root and members must be regular files/directories, not symlinks." },
      },
      required: ["manifestPath", "recordStore"],
      additionalProperties: false,
    },
  },
  {
    name: "verglos_hunt_finding",
    description:
      "Pro. Verify one finding from a Verglos report through the host-provided bounded Hunt runtime. Requires an exact approval and, for execution, a signed recipe/trust/subject binding; never synthesizes or runs arbitrary commands.",
    inputSchema: {
      type: "object",
      properties: {
        reportPath: { type: "string", description: "Path to verglos-report.json." },
        findingId: { type: "string", description: "Finding id to verify." },
        recipePath: { type: "string", description: "Absolute path to the signed recipe used for this bounded execution." },
        trustStorePath: { type: "string", description: "Absolute path to the caller-supplied recipe trust store." },
        ruleId: { type: "string", description: "Exact rule id bound to the signed recipe." },
        subjectId: { type: "string", description: "Exact immutable subject id bound to the signed recipe." },
        observationId: { type: "string", description: "Exact observation id bound to the execution." },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
      required: ["reportPath", "findingId"],
      additionalProperties: false,
    },
  },
  {
    name: "verglos_hunt_report",
    description:
      "Pro. Verify eligible Critical and High findings from a Verglos report through the host-provided bounded Hunt runtime. Requires an exact approval and, for execution, a signed recipe/trust/subject binding; never runs arbitrary commands.",
    inputSchema: {
      type: "object",
      properties: {
        reportPath: { type: "string", description: "Path to verglos-report.json." },
        recipePath: { type: "string", description: "Absolute path to the signed recipe used for this bounded execution." },
        trustStorePath: { type: "string", description: "Absolute path to the caller-supplied recipe trust store." },
        ruleId: { type: "string", description: "Exact rule id bound to the signed recipe." },
        subjectId: { type: "string", description: "Exact immutable subject id bound to the signed recipe." },
        observationId: { type: "string", description: "Exact observation id bound to the execution." },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
      required: ["reportPath"],
      additionalProperties: false,
    },
  },
  {
    name: "verglos_hunt_before_write",
    description:
      "Pro. In-loop Hunt preflight for coding agents. Runs the bounded fast-path detectors and reports explicit partial coverage; it never turns arbitrary agent code into an executable recipe or claims a sandbox verdict.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "Code block the agent is about to write." },
        filePath: { type: "string", description: "Target file path." },
        language: { type: "string", description: "Language hint such as ts, tsx, js, jsx." },
        ...APPROVAL_RECEIPT_PROPERTY,
      },
      required: ["code", "filePath", "language"],
      additionalProperties: false,
    },
  },
  {
    name: "verglos_hunt_explain_verdict",
    description:
      "Pro. Explain a recorded Hunt verdict for a finding without rerunning Hunt or authorizing execution. This is bounded interpretation, not a production exploitability or security-certification claim.",
    inputSchema: {
      type: "object",
      properties: {
        findingId: { type: "string", description: "Finding id." },
        verdict: {
          type: "string",
          enum: ["true", "false", "not_attemptable"],
          description: "Hunt verdict to explain.",
        },
      },
      required: ["findingId", "verdict"],
      additionalProperties: false,
    },
  },
  {
    name: "verglos_attest",
    description:
      "Deprecated Studio compatibility shell. It does not read, sign, or publish a report or summary. Use the CLI's local `record create/sign/verify` workflow; hosted receipt/public verification is not available through this tool.",
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
      additionalProperties: false,
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
    return mcpError("MCP_OUTPUT_INVALID", "tool response is not serializable JSON", "output");
  }
  if (Buffer.byteLength(text, "utf8") > MAX_TOOL_RESPONSE_BYTES) {
    return mcpError("MCP_OUTPUT_LIMIT", "tool response exceeds the 512 KiB limit", "output");
  }
  return { content: [{ type: "text", text }] };
}

function alphaStub(name: string, tier: "pro" | "studio"): {
  ok: false;
  error: "not_implemented_in_alpha" | "studio_only" | "legacy_retired";
  tool: string;
  tier: "pro" | "studio";
  message: string;
  docsUrl: string;
} {
  return {
    ok: false,
    error: name === "verglos_attest" ? "legacy_retired" : tier === "studio" ? "studio_only" : "not_implemented_in_alpha",
    tool: name,
    tier,
    message:
      name === "verglos_attest"
        ? "verglos_attest is a deprecated compatibility shell and performs no signing or publication. Use the local CLI record workflow; this MCP tool does not accept canonical records."
        : tier === "studio"
          ? `${name} is a Studio capability and ships functionally in v2.0.0-beta.`
          : `${name} is registered in v2.0.0-alpha and ships functionally in v2.0.0-beta.`,
    docsUrl: tier === "studio" ? "https://verglos.com/attest" : "https://verglos.com/hunt",
  };
}

function huntExecutionUnavailable(name: "verglos_hunt_finding" | "verglos_hunt_report") {
  return {
    ok: true as const,
    tool: name,
    status: "not_attemptable" as const,
    execution: {
      attempted: false,
      reason: "No host-provided private Hunt runtime and complete signed execution binding were supplied.",
    },
    limitations: [
      "No process or sandbox was started.",
      "Arbitrary commands are never synthesized or executed.",
      "Supply a signed supported recipe, trust store, exact rule/subject/observation binding, and a host runtime.",
    ] as const,
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

function approvalFiles(name: string, input: Record<string, unknown>): readonly string[] {
  const files: string[] = [];
  if (name === "verglos_hunt_report" || name === "verglos_hunt_finding" || name === "verglos_attest") {
    if (typeof input.reportPath === "string") files.push(input.reportPath);
    if (name === "verglos_hunt_report" || name === "verglos_hunt_finding") {
      if (typeof input.recipePath === "string") files.push(input.recipePath);
      if (typeof input.trustStorePath === "string") files.push(input.trustStorePath);
    }
  }
  if (name === "verglos_hunt_before_write" && typeof input.filePath === "string") files.push(input.filePath);
  return files;
}

export async function dispatchTool(
  name: string,
  args: Record<string, unknown> | undefined,
  options: { readonly approvalStoreRoot?: string; readonly now?: string; readonly plan?: "free" | "pro" | "team" | "studio" | "enterprise"; readonly huntExecutor?: VerglosMcpHuntExecutor } = {},
): Promise<{ content: { type: "text"; text: string }[] }> {
  if (args !== undefined && (!args || typeof args !== "object" || Array.isArray(args))) {
    return mcpError("MCP_ARGUMENTS_INPUT", "tool arguments must be an object");
  }
  if (args !== undefined) {
    let encodedArgs: string;
    try {
      const encoded = JSON.stringify(args);
      if (typeof encoded !== "string") throw new Error("arguments are not serializable");
      encodedArgs = encoded;
    } catch {
      return mcpError("MCP_ARGUMENTS_INPUT", "tool arguments must be serializable JSON");
    }
    if (Buffer.byteLength(encodedArgs, "utf8") > MAX_TOOL_ARGUMENT_BYTES) {
      return mcpError("MCP_ARGUMENTS_INPUT", "tool arguments exceed the 256 KiB limit");
    }
  }
  const input = args ?? {};
  const invalid = (code: string, message: string) => mcpError(code, message);
  const authority = mcpToolAuthority(name);
  const registered = TOOLS.some((tool) => tool.name === name);
  if (!registered) return invalid("MCP_UNKNOWN_TOOL", "unknown MCP tool");
  if (!authority) return invalid("MCP_AUTHORITY_MISSING", "registered MCP tool has no shared authority metadata");
  // A missing host-verified entitlement is not an upgrade grant. Preserve
  // legacy tool names and Free access, but treat an absent plan as Free so a
  // paid tool cannot be called merely because the host omitted entitlement.
  {
    const capability = listAdvertisedTools().find((tool) => tool.name === name)?._meta?.["verglos/capability"] as { plan?: "free" | "pro" | "team" | "studio" | "enterprise" } | undefined;
    const required = capability?.plan;
    const rank = { free: 0, pro: 1, team: 2, studio: 3, enterprise: 4 } as const;
    const plan: unknown = options.plan ?? "free";
    if (typeof plan !== "string" || !Object.hasOwn(rank, plan)) return invalid("MCP_ENTITLEMENT_INVALID", "invalid entitlement plan");
    if (required && rank[plan as keyof typeof rank] < rank[required]) return invalid("MCP_ENTITLEMENT_REQUIRED", `MCP tool requires the ${required} plan`);
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
    const files = approvalFiles(name, input);
    if (files.some((file) => !Array.isArray(receipt?.files) || !receipt.files.includes(file))) return invalid("MCP_APPROVAL_SCOPE", "approval receipt does not cover the requested file scope");
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
    case "verglos_policy_check": {
      let parsed; try { parsed = parsePolicyCheckArgs(toolInput); } catch (error) { return invalid("MCP_POLICY_CHECK_INPUT", error instanceof Error ? error.message : "invalid input"); }
      try { return jsonResponse(await checkPolicyRecord(parsed)); } catch { return invalid("MCP_POLICY_CHECK_FAILED", "policy record could not be verified"); }
    }
    case "verglos_hunt_finding": {
      let parsed; try { parsed = parseHuntFindingArgs(toolInput); } catch (error) { return invalid("MCP_HUNT_FINDING_INPUT", error instanceof Error ? error.message : "invalid input"); }
      if (!options.huntExecutor || !parsed.recipePath || !parsed.trustStorePath || !parsed.ruleId || !parsed.subjectId || !parsed.observationId) return jsonResponse(huntExecutionUnavailable(name));
      try {
        return jsonResponse(await options.huntExecutor.executeFinding({
          reportPath: parsed.reportPath,
          findingId: parsed.findingId,
          approvalReceipt: input.approvalReceipt as ApprovalReceipt,
          binding: parsed,
        }));
      } catch { return invalid("MCP_HUNT_EXECUTION_FAILED", "hunt finding execution failed"); }
    }
    case "verglos_hunt_report": {
      let parsed; try { parsed = parseHuntReportArgs(toolInput); } catch (error) { return invalid("MCP_HUNT_REPORT_INPUT", error instanceof Error ? error.message : "invalid input"); }
      if (!options.huntExecutor || !parsed.recipePath || !parsed.trustStorePath || !parsed.ruleId || !parsed.subjectId || !parsed.observationId) return jsonResponse(huntExecutionUnavailable(name));
      try {
        return jsonResponse(await options.huntExecutor.executeReport({
          reportPath: parsed.reportPath,
          approvalReceipt: input.approvalReceipt as ApprovalReceipt,
          binding: parsed,
        }));
      } catch { return invalid("MCP_HUNT_EXECUTION_FAILED", "hunt report execution failed"); }
    }
    case "verglos_hunt_before_write": {
      let parsed; try { parsed = parseHuntBeforeWriteArgs(toolInput); } catch (error) { return invalid("MCP_HUNT_BEFORE_WRITE_INPUT", error instanceof Error ? error.message : "invalid input"); }
      try { return jsonResponse(await huntBeforeWritePreflight({ code: parsed.code, targetPath: parsed.filePath, language: parsed.language })); } catch { return invalid("MCP_HUNT_BEFORE_WRITE_FAILED", "hunt before-write preflight failed"); }
    }
    case "verglos_hunt_explain_verdict":
      let parsedVerdict;
      try { parsedVerdict = parseHuntExplainVerdictArgs(toolInput); } catch (error) { return invalid("MCP_HUNT_EXPLAIN_VERDICT_INPUT", error instanceof Error ? error.message : "invalid input"); }
      try { return jsonResponse(explainHuntVerdict(parsedVerdict)); } catch { return invalid("MCP_HUNT_EXPLAIN_VERDICT_FAILED", "hunt verdict explanation failed"); }
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
    const schemaFields = Object.keys(t.inputSchema.properties).sort();
    if (schemaFields.join("\n") !== [...capability.inputFields].sort().join("\n")) throw new Error(`MCP input schema is out of sync for ${t.name}`);
    if (t.inputSchema.additionalProperties !== false) throw new Error(`MCP input schema must reject unknown fields for ${t.name}`);
    if (authority.action !== capability.action || authority.approvalRequired !== capability.approvalRequired || authority.sideEffect !== capability.sideEffect) throw new Error(`MCP authority and capability metadata are out of sync for ${t.name}`);
    if (capability.inputFields.includes("approvalReceipt") !== authority.approvalRequired) throw new Error(`MCP approval receipt schema is out of sync for ${t.name}`);
    return {
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
      _meta: { "verglos/capability": capability },
      annotations: {
        readOnlyHint: !authority.approvalRequired,
        destructiveHint: authority.sideEffect === "filesystem" || authority.sideEffect === "identity",
        openWorldHint: authority.sideEffect === "network" || authority.sideEffect === "hosted",
      },
    };
  });
}

export interface VerglosMcpServerOptions {
  /** Verified entitlement supplied by the host; omitted grants Free capabilities only. */
  readonly plan?: "free" | "pro" | "team" | "studio" | "enterprise";
  /** Optional private-runtime bridge. The public MCP package never imports the private Hunt package. */
  readonly huntExecutor?: VerglosMcpHuntExecutor;
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
    return dispatchTool(name, args, { approvalStoreRoot: process.env.VERGLOS_APPROVAL_STORE, plan: options.plan, huntExecutor: options.huntExecutor });
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
