import chalk from "chalk";
import { resolveEntitlement, warnIfStale } from "./entitlement.js";

export interface HuntOptions {
  severity?: string;
  sandbox?: string;
  dryRun?: boolean;
  finding?: string;
  asPlan?: string;
}

const PAID_PLANS = new Set(["pro", "studio", "compliance", "founder"]);

export async function executeHunt(opts: HuntOptions = {}): Promise<number> {
  const entitlement = await resolveEntitlement({ asPlan: opts.asPlan });
  warnIfStale({ stale: entitlement.stale, plan: entitlement.plan });

  if (!PAID_PLANS.has(entitlement.plan)) {
    console.error("");
    console.error(chalk.bold("hunt is a Pro capability."));
    console.error("");
    console.error(`  Upgrade at  ->  ${chalk.cyan("https://verglos.com/checkout")}`);
    console.error(`  Or activate ->  ${chalk.cyan("verglos login")}`);
    console.error("");
    return 3;
  }

  console.log(chalk.bold("verglos hunt") + chalk.gray(" — the evidence agent for AI-generated code"));
  console.log(chalk.gray("Shipping in v2.0.0-beta. Track: verglos.com/hunt"));
  console.log("");
  console.log(chalk.gray("Parsed options"));
  console.log(`  ${chalk.gray("Severity ")} ${opts.severity ?? "critical,high"}`);
  console.log(`  ${chalk.gray("Sandbox  ")} ${opts.sandbox ?? "auto"}`);
  console.log(`  ${chalk.gray("Dry run  ")} ${opts.dryRun ? "yes" : "no"}`);
  console.log(`  ${chalk.gray("Finding  ")} ${opts.finding ?? "all eligible findings"}`);
  return 78;
}
