// Public deterministic reference fixture. It inspects dynamic tool dispatch
// only; it does not contact an MCP server or invoke a tool.
const vulnerableFixture = "toolRegistry[userSelectedTool](userInput);";
const reproduced = /toolRegistry\s*\[\s*userSelectedTool\s*\]\s*\(/u.test(vulnerableFixture);
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict: reproduced ? "confirmed" : "not-reproduced", summary: "deterministic Agent/MCP boundary fixture" })}\n`);
