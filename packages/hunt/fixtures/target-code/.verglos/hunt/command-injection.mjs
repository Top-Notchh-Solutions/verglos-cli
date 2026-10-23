// Public deterministic reference harness. It inspects local argv construction;
// it never invokes a shell, spawns a process, or reads customer source.
import { safeCommand, vulnerableCommand } from "../../src/command-injection.mjs";

const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }
const input = "echo pwned";
const result = fixtureCase === "negative" ? safeCommand(input) : vulnerableCommand(input);
const reproduced = result[0] === "sh" && result[1] === "-c" && result[2] === input;
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic command-injection fixture" })}\n`);
