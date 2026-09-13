/**
 * @verglos/mcp — Model Context Protocol server for Verglos.
 *
 * Exposes the free-tier scanner surface to AI agents (Claude Code,
 * Cursor, Cline, Windsurf, …) as MCP tools:
 *
 *   verglos_check_before_write   the killer, <300ms, runs in the
 *                                agent's write loop
 *   verglos_check_package        slopsquat / typosquat / CVE check
 *                                before an install
 *   verglos_scan                 full project scan
 *   verglos_explain_finding      why + fix, framework-aware
 *
 * The current local scanner tools are Free capabilities. Package and full
 * scan tools make outbound npm/OSV lookups only after exact network approval;
 * no Verglos-hosted entitlement lookup occurs in the MCP call path.
 */
export { createVerglosMcpServer, startStdioServer } from "./server.js";
export type { CheckBeforeWriteInput, CheckBeforeWriteResult, VerglosMcpServerOptions } from "./server.js";
