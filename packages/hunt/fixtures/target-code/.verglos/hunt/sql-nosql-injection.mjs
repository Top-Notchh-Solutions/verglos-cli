// Public deterministic reference fixture for the A2 target-harness protocol.
// Customer harnesses must exercise their own approved local test fixture in
// this same bounded shape; this file does not access a network or database.
const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }
const fixture = fixtureCase === "negative"
  ? "await db.query('SELECT * FROM users WHERE id = $1', [userInput]);"
  : "await db.query(`SELECT * FROM users WHERE id = ${userInput}`);";
const reproduced = /query\s*\(\s*`[^`]*\$\{/u.test(fixture);
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic SQL injection fixture" })}\n`);
