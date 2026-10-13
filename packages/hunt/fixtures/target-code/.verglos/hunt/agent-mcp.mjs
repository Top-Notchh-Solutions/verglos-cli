// Public deterministic reference harness. It inspects local tool dispatch
// only; it does not contact an MCP server or invoke a tool.
import { safeDispatch, vulnerableDispatch } from "../../src/agent-mcp.mjs";

const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }
const result = fixtureCase === "negative" ? safeDispatch("deleteAll", "user-input") : vulnerableDispatch("deleteAll", "user-input");
const reproduced = result === "unapproved:deleteAll:user-input";
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic Agent/MCP boundary fixture" })}\n`);
