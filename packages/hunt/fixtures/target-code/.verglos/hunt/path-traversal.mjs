// Public deterministic reference harness. It resolves paths in memory only;
// it never accesses the filesystem or reads customer source.
import { safePath, vulnerablePath } from "../../src/path-traversal.mjs";

const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }
const input = "../../etc/passwd";
const result = fixtureCase === "negative" ? safePath(input) : vulnerablePath(input);
const reproduced = result === "/etc/passwd";
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic path-traversal fixture" })}\n`);
