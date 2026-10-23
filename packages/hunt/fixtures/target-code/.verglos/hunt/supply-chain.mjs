// Public deterministic reference harness. It inspects disposable package
// metadata only; it never installs, imports, executes, or downloads a package.
import { safePackageAdmission, vulnerablePackageAdmission } from "../../src/supply-chain.mjs";

const fixtureCase = process.argv[2] ?? "positive";
if (fixtureCase === "timeout") setInterval(() => {}, 1000);
if (fixtureCase === "adapter-failure") { process.stderr.write("intentional adapter failure fixture\n"); process.exit(17); }

const result = fixtureCase === "negative"
  ? safePackageAdmission()
  : vulnerablePackageAdmission();
const reproduced = fixtureCase !== "negative" && result.accepted === true && result.lifecycleHook === "node install-hook.mjs" && result.integrity === null;
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic disposable supply-chain fixture" })}\n`);
