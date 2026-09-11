import chalk from "chalk";
import { resolveEntitlement, warnIfStale } from "./entitlement.js";

export interface HuntOptions {
  severity?: string;
  sandbox?: string;
  dryRun?: boolean;
  finding?: string;
  asPlan?: string;
  json?: boolean;
  quiet?: boolean;
}

const PAID_PLANS = new Set(["pro", "studio", "compliance", "founder"]);

export async function executeHunt(opts: HuntOptions = {}): Promise<number> {
  const entitlement = await resolveEntitlement({ asPlan: opts.asPlan });
  warnIfStale({ stale: entitlement.stale, plan: entitlement.plan });

  if (!PAID_PLANS.has(entitlement.plan)) {
    if (opts.json) console.log(JSON.stringify({ status: "denied", reason: "plan_required", requiredPlan: "pro" }));
    else if (!opts.quiet) {
      console.error("");
      console.error(chalk.bold("hunt is a Pro capability."));
      console.error("");
      console.error(`  Upgrade at  ->  ${chalk.cyan("https://verglos.com/checkout")}`);
      console.error(`  Or activate ->  ${chalk.cyan("verglos login")}`);
      console.error("");
    }
    return 3;
  }

  const parsed = {
    status: "unavailable",
    reason: "beta_shell",
    severity: opts.severity ?? "critical,high",
    sandbox: opts.sandbox ?? "auto",
    dryRun: Boolean(opts.dryRun),
    finding: opts.finding ?? "all eligible findings",
  } as const;
  if (opts.json) console.log(JSON.stringify(parsed));
  else if (!opts.quiet) {
    console.log(chalk.bold("verglos hunt") + chalk.gray(" — the evidence agent for AI-generated code"));
    console.log(chalk.gray("Shipping in v2.0.0-beta. Track: verglos.com/hunt"));
    console.log("");
    console.log(chalk.gray("Parsed options"));
    console.log(`  ${chalk.gray("Severity ")} ${parsed.severity}`);
    console.log(`  ${chalk.gray("Sandbox  ")} ${parsed.sandbox}`);
    console.log(`  ${chalk.gray("Dry run  ")} ${parsed.dryRun ? "yes" : "no"}`);
    console.log(`  ${chalk.gray("Finding  ")} ${parsed.finding}`);
  }
  return 78;
}
