// Public deterministic reference fixture. It inspects an unsafe object-spread
// update string only; it does not access a user store or cross a tenant.
const fixtureCase = process.argv[2] ?? "positive";
const fixture = fixtureCase === "negative" ? "updateUser({ displayName: requestBody.displayName });" : "updateUser({ ...requestBody });";
const reproduced = /updateUser\s*\(\s*\{\s*\.\.\.requestBody\s*\}\s*\)/u.test(fixture);
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic authorization and mass-assignment fixture" })}\n`);
