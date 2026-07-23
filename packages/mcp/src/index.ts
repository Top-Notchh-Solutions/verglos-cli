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
 * All tools are free forever. No network
 * calls on the free path except registry lookups (which run against
 * the public npm registry, not Verglos infra).
 */
export { createVerglosMcpServer, startStdioServer } from "./server.js";
export type { CheckBeforeWriteInput, CheckBeforeWriteResult } from "./server.js";
