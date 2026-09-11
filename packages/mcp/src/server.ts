import { createRequire } from "node:module";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { mcpToolAuthority, reconcileMcpCapabilities, type Finding } from "@verglos/shared";
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
 *   - Free-tier only: no license check, no network on the hot path
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
      "Before `npm install`. Checks whether a package exists on npm (AI-005 slopsquat), whether it looks like a typo of a top-N package (AI-006), and whether it has known CVEs.",
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
      },
      required: ["packageName"],
    },
  },
  {
    name: "verglos_scan",
    description:
      "Full project scan. Returns findings, score, and AI-provenance summary. Slower than check_before_write — use for pre-PR review, not per-line checks.",
    inputSchema: {
      type: "object",
      properties: {
        projectRoot: {
          type: "string",
          description: "Absolute path to the project root. Defaults to cwd.",
        },
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
      },
      required: ["reportPath"],
    },
  },
] as const;

// ─── Handler dispatch ─────────────────────────────────────────────────────

async function stubResponse(name: string): Promise<{ content: { type: "text"; text: string }[] }> {
  return {
    content: [
      {
        type: "text",
        text: `verglos:mcp: ${name} is registered but the handler ships in a later commit. Try again after the next release.`,
      },
    ],
  };
}

function jsonResponse(payload: unknown): {
  content: { type: "text"; text: string }[];
} {
  return {
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
  };
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

export async function dispatchTool(
  name: string,
  args: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> {
  if (args !== undefined && (!args || typeof args !== "object" || Array.isArray(args))) {
    return { content: [{ type: "text", text: JSON.stringify({ ok: false, error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments must be an object" }) }] };
  }
  if (args !== undefined && Buffer.byteLength(JSON.stringify(args), "utf8") > MAX_TOOL_ARGUMENT_BYTES) {
    return { content: [{ type: "text", text: JSON.stringify({ ok: false, error: "usage", code: "MCP_ARGUMENTS_INPUT", message: "tool arguments exceed the 256 KiB limit" }) }] };
  }
  const input = args ?? {};
  const invalid = (code: string, message: string) => ({ content: [{ type: "text" as const, text: JSON.stringify({ ok: false, error: "usage", code, message }) }] });
  switch (name) {
    case "verglos_check_before_write": {
      let parsed: CheckBeforeWriteInput; try { parsed = parseCheckBeforeWriteArgs(input); } catch (error) { return invalid("MCP_CHECK_BEFORE_WRITE_INPUT", error instanceof Error ? error.message : "invalid input"); }
      try { return jsonResponse(await checkBeforeWrite(parsed)); } catch (error) { return invalid("MCP_CHECK_BEFORE_WRITE_FAILED", error instanceof Error ? error.message : "tool failed"); }
    }
    case "verglos_check_package": {
      let parsed; try { parsed = parseCheckPackageArgs(input); } catch (error) { return invalid("MCP_CHECK_PACKAGE_INPUT", error instanceof Error ? error.message : "invalid input"); }
      try { return jsonResponse(await checkPackage(parsed)); } catch (error) { return invalid("MCP_CHECK_PACKAGE_FAILED", error instanceof Error ? error.message : "tool failed"); }
    }
    case "verglos_scan": {
      let parsed; try { parsed = parseScanArgs(input); } catch (error) { return invalid("MCP_SCAN_INPUT", error instanceof Error ? error.message : "invalid input"); }
      try { return jsonResponse(await scanProject(parsed)); } catch (error) { return invalid("MCP_SCAN_FAILED", error instanceof Error ? error.message : "tool failed"); }
    }
    case "verglos_explain_finding": {
      let parsed; try { parsed = parseExplainFindingArgs(input); } catch (error) { return invalid("MCP_EXPLAIN_FINDING_INPUT", error instanceof Error ? error.message : "invalid input"); }
      let result: ReturnType<typeof explainFinding>;
      try { result = explainFinding(parsed); } catch (error) { return invalid("MCP_EXPLAIN_FINDING_FAILED", error instanceof Error ? error.message : "tool failed"); }
      return jsonResponse(result);
    }
    case "verglos_hunt_finding":
      try { parseHuntFindingArgs(input); } catch (error) { return invalid("MCP_HUNT_FINDING_INPUT", error instanceof Error ? error.message : "invalid input"); }
      return jsonResponse(alphaStub(name, "pro"));
    case "verglos_hunt_report":
      try { parseHuntReportArgs(input); } catch (error) { return invalid("MCP_HUNT_REPORT_INPUT", error instanceof Error ? error.message : "invalid input"); }
      return jsonResponse(alphaStub(name, "pro"));
    case "verglos_hunt_before_write":
      try { parseHuntBeforeWriteArgs(input); } catch (error) { return invalid("MCP_HUNT_BEFORE_WRITE_INPUT", error instanceof Error ? error.message : "invalid input"); }
      return jsonResponse(alphaStub(name, "pro"));
    case "verglos_hunt_explain_verdict":
      try { parseHuntExplainVerdictArgs(input); } catch (error) { return invalid("MCP_HUNT_EXPLAIN_VERDICT_INPUT", error instanceof Error ? error.message : "invalid input"); }
      return jsonResponse(alphaStub(name, "pro"));
    case "verglos_attest":
      try { parseAttestArgs(input); } catch (error) { return invalid("MCP_ATTEST_INPUT", error instanceof Error ? error.message : "invalid input"); }
      return jsonResponse(alphaStub(name, "studio"));
    default:
      return stubResponse(name);
  }
}

// ─── Server factory ───────────────────────────────────────────────────────

export function createVerglosMcpServer(): Server {
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

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    // Fail closed if the hand-authored MCP tool list drifts from shared capability truth.
    tools: reconcileMcpCapabilities(TOOLS.map((tool) => tool.name)) && TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
      annotations: (() => {
        const authority = mcpToolAuthority(t.name);
        return authority ? {
          readOnlyHint: !authority.approvalRequired,
          destructiveHint: authority.sideEffect === "filesystem" || authority.sideEffect === "identity",
          openWorldHint: authority.sideEffect === "network" || authority.sideEffect === "hosted",
        } : undefined;
      })(),
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name;
    const args = request.params.arguments as
      | Record<string, unknown>
      | undefined;
    return dispatchTool(name, args);
  });

  return server;
}

/**
 * Start an MCP server over stdio. Prints a startup banner to stderr
 * so stdout stays clean for the MCP transport.
 */
export async function startStdioServer(): Promise<void> {
  const server = createVerglosMcpServer();
  const transport = new StdioServerTransport();
  process.stderr.write("verglos:mcp: server started on stdio\n");
  await server.connect(transport);
}
