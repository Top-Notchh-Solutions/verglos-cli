// Public deterministic reference harness. It inspects a local update object
// only; it does not access a user store or cross a tenant.
import { safeUpdate, vulnerableUpdate } from "../../src/authorization.mjs";

const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }
const requestBody = { displayName: "Anurag", isAdmin: true };
const result = fixtureCase === "negative" ? safeUpdate(requestBody) : vulnerableUpdate(requestBody);
const reproduced = Object.hasOwn(result, "isAdmin");
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic authorization and mass-assignment fixture" })}\n`);
