// Public deterministic reference fixture. It inspects a string only; it does
// not invoke a shell, spawn a process, or read customer source.
const vulnerableFixture = "execFile(\"sh\", userInput);";
const reproduced = /execFile\s*\(\s*["']sh["']\s*,\s*userInput\s*\)/u.test(vulnerableFixture);
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict: reproduced ? "confirmed" : "not-reproduced", summary: "deterministic command-injection fixture" })}\n`);
