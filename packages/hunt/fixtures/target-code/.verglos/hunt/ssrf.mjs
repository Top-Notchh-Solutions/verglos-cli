// Public deterministic reference fixture. It inspects a URL sink string only;
// it does not make a request or resolve a host.
const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }
const fixture = fixtureCase === "negative" ? "fetch(new URL(userSuppliedUrl, \"https://api.example.test\"));" : "fetch(userSuppliedUrl);";
const reproduced = /fetch\s*\(\s*userSuppliedUrl\s*\)/u.test(fixture);
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic SSRF fixture" })}\n`);
