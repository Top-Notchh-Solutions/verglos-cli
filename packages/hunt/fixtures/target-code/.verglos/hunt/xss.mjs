// Public deterministic reference harness. It inspects a local sink descriptor
// only; it does not render a browser or execute markup.
import { safeSink, vulnerableSink } from "../../src/xss.mjs";

const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }
const input = "<img src=x onerror=alert(1)>";
const result = fixtureCase === "negative" ? safeSink(input) : vulnerableSink(input);
const reproduced = result.property === "innerHTML" && result.value === input;
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic safe-XSS fixture" })}\n`);
