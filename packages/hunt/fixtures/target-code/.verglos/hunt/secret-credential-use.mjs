// Public deterministic reference harness. It uses only a synthetic credential
// and a local in-memory transport; it never validates or sends a real secret.
import { safeCredentialUse, vulnerableCredentialUse } from "../../src/secret-credential-use.mjs";

const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }

const localTransport = (request) => ({ status: "sent-to-local-fixture", authorization: request.authorization });
const result = fixtureCase === "negative"
  ? safeCredentialUse(localTransport)
  : vulnerableCredentialUse(localTransport);
const reproduced = result.status === "sent-to-local-fixture" && result.authorization === "Bearer fixture-credential-canary";
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic synthetic credential-use fixture" })}\n`);
