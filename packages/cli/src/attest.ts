import chalk from "chalk";
import { resolveEntitlement, warnIfStale } from "./entitlement.js";

export interface AttestOptions {
  report?: string;
  sign?: boolean;
  verifyUrl?: string;
  asPlan?: string;
}

const STUDIO_PLANS = new Set(["studio", "compliance", "founder"]);

export async function executeAttest(opts: AttestOptions = {}): Promise<number> {
  const entitlement = await resolveEntitlement({ asPlan: opts.asPlan });
  warnIfStale({ stale: entitlement.stale, plan: entitlement.plan });

  if (!STUDIO_PLANS.has(entitlement.plan)) {
    console.error("");
    console.error(chalk.bold("attest is a Studio capability."));
    console.error("");
    console.error(`  Upgrade at  ->  ${chalk.cyan("mailto:topnotchh.solutions@gmail.com?subject=Verglos%20Studio")}`);
    console.error(`  Or activate ->  ${chalk.cyan("verglos login")}`);
    console.error("");
    return 3;
  }

  console.log(chalk.bold("verglos attest") + chalk.gray(" — signed evidence bundle for client handoff"));
  console.log(chalk.gray("Studio tier. Shipping in v2.0.0-beta. Track: verglos.com/attest"));
  console.log("");
  console.log(chalk.gray("Parsed options"));
  console.log(`  ${chalk.gray("Report     ")} ${opts.report ?? "verglos-report.json"}`);
  console.log(`  ${chalk.gray("Sign       ")} ${opts.sign ? "yes" : "no"}`);
  console.log(`  ${chalk.gray("Verify URL ")} ${opts.verifyUrl ?? "https://verglos.com/verify"}`);
  return 78;
}
