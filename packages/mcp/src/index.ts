/**
 * @verglos/mcp — Model Context Protocol server for Verglos.
 *
 * Exposes the scanner and approval-bound Hunt surface to AI agents
 * (Claude Code, Cursor, Cline, Windsurf, …) as MCP tools:
 *
 *   verglos_check_before_write   the killer, <300ms, runs in the
 *                                agent's write loop
 *   verglos_check_package        slopsquat / typosquat / CVE check
 *                                before an install
 *   verglos_scan                 full project scan
 *   verglos_explain_finding      why + fix, framework-aware
 *   verglos_hunt_finding/report  Pro bounded execution with exact bindings
 *   verglos_hunt_before_write    Pro preflight without arbitrary execution
 *   verglos_hunt_explain_verdict Pro bounded verdict interpretation
 *
 * Package and full scan tools make outbound npm/OSV lookups only after exact
 * network approval. Hunt tools preserve the CLI execution binding, return
 * explicit not-attemptable states when a bounded runtime is unavailable, and
 * emit source-free verification-attempt projections; no Verglos-hosted
 * entitlement lookup occurs in the MCP call path.
 */
export { createVerglosMcpServer, startStdioServer } from "./server.js";
export type { CheckBeforeWriteInput, CheckBeforeWriteResult, HuntExecutionBinding, VerglosMcpHuntExecutor, VerglosMcpServerOptions } from "./server.js";
