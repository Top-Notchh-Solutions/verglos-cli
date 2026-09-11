import chalk from "chalk";
import { resolveEntitlement, warnIfStale } from "./entitlement.js";

export interface AttestOptions {
  report?: string;
  sign?: boolean;
  verifyUrl?: string;
  asPlan?: string;
  json?: boolean;
  quiet?: boolean;
}

const STUDIO_PLANS = new Set(["studio", "compliance", "founder"]);

function validateAttestOptions(opts: AttestOptions): { report: string; verifyUrl: string } {
  const report = opts.report ?? "verglos-report.json";
  if (report.length === 0 || report.length > 4096 || /[\u0000-\u001f\u007f]/u.test(report)) throw new Error("attest report path is invalid");
  const verifyUrl = opts.verifyUrl ?? "https://verglos.com/verify";
  let parsed: URL;
  try { parsed = new URL(verifyUrl); } catch { throw new Error("attest verify URL is invalid"); }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.hash || parsed.pathname.length > 512 || parsed.toString().length > 2048) throw new Error("attest verify URL must be a bounded HTTPS URL");
  return { report, verifyUrl: parsed.toString() };
}

export async function executeAttest(opts: AttestOptions = {}): Promise<number> {
  let input: { report: string; verifyUrl: string };
  try { input = validateAttestOptions(opts); }
  catch (error) {
    if (opts.json) console.log(JSON.stringify({ status: "error", code: "ATTEST_INPUT", message: "attest options are invalid" }));
    else if (!opts.quiet) console.error(error instanceof Error ? error.message : "attest options are invalid");
    return 2;
  }
  if (!opts.json && !opts.quiet) console.error(chalk.yellow("attest is a legacy compatibility shell; it does not create or sign a Verglos Release Record."));
  const entitlement = await resolveEntitlement({ asPlan: opts.asPlan });
  warnIfStale({ stale: entitlement.stale, plan: entitlement.plan });

  if (!STUDIO_PLANS.has(entitlement.plan)) {
    if (opts.json) console.log(JSON.stringify({ status: "denied", reason: "plan_required", requiredPlan: "studio" }));
    else if (!opts.quiet) {
      console.error("");
      console.error(chalk.bold("attest is a Studio capability."));
      console.error("");
      console.error(`  Upgrade at  ->  ${chalk.cyan("mailto:topnotchh.solutions@gmail.com?subject=Verglos%20Studio")}`);
      console.error(`  Or activate ->  ${chalk.cyan("verglos login")}`);
      console.error("");
    }
    return 3;
  }

  const parsed = {
    status: "unavailable",
    reason: "legacy_shell",
    report: input.report,
    sign: Boolean(opts.sign),
    verifyUrl: input.verifyUrl,
  } as const;
  if (opts.json) console.log(JSON.stringify(parsed));
  else if (!opts.quiet) {
    console.log(chalk.bold("verglos attest") + chalk.gray(" — legacy compatibility shell"));
    console.log(chalk.gray("Use `verglos record create`, `record sign`, and `record verify` for the canonical offline workflow."));
    console.log(chalk.gray("Studio tier. Shipping in v2.0.0-beta. Track: verglos.com/attest"));
    console.log("");
    console.log(chalk.gray("Parsed options"));
    console.log(`  ${chalk.gray("Report     ")} ${parsed.report}`);
    console.log(`  ${chalk.gray("Sign       ")} ${parsed.sign ? "yes" : "no"}`);
    console.log(`  ${chalk.gray("Verify URL ")} ${parsed.verifyUrl}`);
  }
  return 78;
}
