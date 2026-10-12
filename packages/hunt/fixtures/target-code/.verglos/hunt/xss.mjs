// Public deterministic reference fixture. It inspects an HTML sink string
// only; it does not render a browser or execute markup.
const vulnerableFixture = "element.innerHTML = userInput;";
const reproduced = /\.innerHTML\s*=\s*userInput/u.test(vulnerableFixture);
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict: reproduced ? "confirmed" : "not-reproduced", summary: "deterministic safe-XSS fixture" })}\n`);
