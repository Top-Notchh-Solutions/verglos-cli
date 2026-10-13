// Public deterministic reference fixture. It inspects dynamic tool dispatch
// only; it does not contact an MCP server or invoke a tool.
const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }
const fixture = fixtureCase === "negative" ? "approvedTools.get(userSelectedTool)?.(userInput);" : "toolRegistry[userSelectedTool](userInput);";
const reproduced = /toolRegistry\s*\[\s*userSelectedTool\s*\]\s*\(/u.test(fixture);
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic Agent/MCP boundary fixture" })}\n`);
