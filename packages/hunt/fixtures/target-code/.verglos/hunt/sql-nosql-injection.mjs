// Public deterministic reference harness. It invokes only the local fixture
// functions; it never connects to a database or reads customer source.
import { safeQuery, vulnerableQuery } from "../../src/sql-nosql.mjs";

const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }
const input = "' OR 1=1 --";
const result = fixtureCase === "negative" ? safeQuery(input) : vulnerableQuery(input);
const reproduced = typeof result === "string" && result.includes(input);
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic SQL injection fixture" })}\n`);
