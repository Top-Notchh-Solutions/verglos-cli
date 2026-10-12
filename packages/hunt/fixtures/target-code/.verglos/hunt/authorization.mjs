// Public deterministic reference fixture. It inspects an unsafe object-spread
// update string only; it does not access a user store or cross a tenant.
const vulnerableFixture = "updateUser({ ...requestBody });";
const reproduced = /updateUser\s*\(\s*\{\s*\.\.\.requestBody\s*\}\s*\)/u.test(vulnerableFixture);
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict: reproduced ? "confirmed" : "not-reproduced", summary: "deterministic authorization and mass-assignment fixture" })}\n`);
