// Public deterministic reference harness. It checks a local object merge only;
// it never mutates global prototypes, accesses a store, or invokes a process.
import { safeMerge, vulnerableMerge } from "../../src/prototype-pollution.mjs";

const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }

const request = { body: JSON.parse('{"__proto__":{"polluted":"yes"},"displayName":"Anurag"}') };
const result = fixtureCase === "negative" ? safeMerge(request) : vulnerableMerge(request);
const prototype = Object.getPrototypeOf(result);
const reproduced = prototype?.polluted === "yes" && !Object.hasOwn(result, "polluted");
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic prototype-pollution fixture" })}\n`);
