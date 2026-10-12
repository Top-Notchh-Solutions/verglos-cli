// Public deterministic reference fixture. It inspects a string only; it does
// not invoke a shell, spawn a process, or read customer source.
const fixtureCase = process.argv[2] ?? "positive";
const fixture = fixtureCase === "negative" ? "execFile(\"sh\", [\"-c\", \"echo safe\"]);" : "execFile(\"sh\", userInput);";
const reproduced = /execFile\s*\(\s*["']sh["']\s*,\s*userInput\s*\)/u.test(fixture);
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic command-injection fixture" })}\n`);
