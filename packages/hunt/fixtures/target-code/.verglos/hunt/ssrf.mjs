// Public deterministic reference harness. It builds URLs in memory only; it
// never makes a request or resolves a host.
import { safeRequestUrl, vulnerableRequestUrl } from "../../src/ssrf.mjs";

const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }
const input = "http://169.254.169.254/latest";
const result = fixtureCase === "negative" ? safeRequestUrl(input) : vulnerableRequestUrl(input);
const reproduced = result === input;
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic SSRF fixture" })}\n`);
