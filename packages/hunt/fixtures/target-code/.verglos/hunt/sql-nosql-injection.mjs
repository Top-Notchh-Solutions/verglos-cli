// Public deterministic reference fixture for the A2 target-harness protocol.
// Customer harnesses must exercise their own approved local test fixture in
// this same bounded shape; this file does not access a network or database.
const vulnerableFixture = "await db.query(`SELECT * FROM users WHERE id = ${userInput}`);";
const reproduced = /query\s*\(\s*`[^`]*\$\{/u.test(vulnerableFixture);
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict: reproduced ? "confirmed" : "not-reproduced", summary: "deterministic SQL injection fixture" })}\n`);
