import { createRequire } from "node:module";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { Finding } from "@verglos/shared";
import { checkBeforeWrite } from "./tools/check-before-write.js";
import type {
  CheckBeforeWriteInput as ToolInput,
  CheckBeforeWriteResult as ToolResult,
} from "./tools/check-before-write.js";
import { checkPackage } from "./tools/check-package.js";
import { scanProject } from "./tools/scan.js";
import { explainFinding } from "./tools/explain-finding.js";

const require = createRequire(import.meta.url);
const { version: MCP_VERSION } = require("../package.json") as {
  version: string;
};

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

async function dispatchTool(
  name: string,
  args: Record<string, unknown> | undefined,
): Promise<{ content: { type: "text"; text: string }[] }> {
  const input = args ?? {};
  switch (name) {
    case "verglos_check_before_write": {
      const parsed: CheckBeforeWriteInput = {
        code: String(input.code ?? ""),
        targetPath: String(input.targetPath ?? "input.ts"),
        language:
          typeof input.language === "string" ? input.language : undefined,
        context:
          typeof input.context === "string" ? input.context : undefined,
      };
      const result = await checkBeforeWrite(parsed);
      return jsonResponse(result);
    }
    case "verglos_check_package": {
      const result = await checkPackage({
        packageName: String(input.packageName ?? ""),
        version:
          typeof input.version === "string" ? input.version : undefined,
      });
      return jsonResponse(result);
    }
    case "verglos_scan": {
      const result = await scanProject({
        projectRoot:
          typeof input.projectRoot === "string" ? input.projectRoot : undefined,
        limit: typeof input.limit === "number" ? input.limit : undefined,
        noProvenance:
          typeof input.noProvenance === "boolean"
            ? input.noProvenance
            : undefined,
      });
      return jsonResponse(result);
    }
    case "verglos_explain_finding": {
      const result = explainFinding({ rule: String(input.rule ?? "") });
      return jsonResponse(result);
    }
    case "verglos_hunt_finding":
    case "verglos_hunt_report":
    case "verglos_hunt_before_write":
    case "verglos_hunt_explain_verdict":
      return jsonResponse(alphaStub(name, "pro"));
    case "verglos_attest":
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
    tools: TOOLS.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
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
