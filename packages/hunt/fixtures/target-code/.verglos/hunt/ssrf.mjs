// Public deterministic reference fixture. It inspects a URL sink string only;
// it does not make a request or resolve a host.
const vulnerableFixture = "fetch(userSuppliedUrl);";
const reproduced = /fetch\s*\(\s*userSuppliedUrl\s*\)/u.test(vulnerableFixture);
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict: reproduced ? "confirmed" : "not-reproduced", summary: "deterministic SSRF fixture" })}\n`);
