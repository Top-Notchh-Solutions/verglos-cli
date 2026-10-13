// Public deterministic reference fixture. It inspects an HTML sink string
// only; it does not render a browser or execute markup.
const fixtureCase = process.argv[2] ?? "positive";
const fixture = fixtureCase === "negative" ? "element.textContent = userInput;" : "element.innerHTML = userInput;";
const reproduced = /\.innerHTML\s*=\s*userInput/u.test(fixture);
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic safe-XSS fixture" })}\n`);
