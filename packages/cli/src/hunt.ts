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

const PAID_PLANS = new Set(["pro", "team", "studio", "enterprise", "compliance", "founder"]);
const SEVERITIES = new Set(["critical", "high", "medium", "low"]);
const SANDBOXES = new Set(["auto", "docker"]);

function validateOption(value: string | undefined, max: number, label: string): string | undefined {
  if (value === undefined) return undefined;
  if (value.length === 0 || value.length > max || /[\u0000-\u001f\u007f]/u.test(value)) throw new Error(`hunt ${label} is invalid`);
  return value;
}

export async function executeHunt(opts: HuntOptions = {}): Promise<number> {
  let severity: string | undefined;
  let sandbox: string | undefined;
  let finding: string | undefined;
  try {
    severity = validateOption(opts.severity, 128, "severity");
    sandbox = validateOption(opts.sandbox, 32, "sandbox");
    finding = validateOption(opts.finding, 512, "finding");
    if (severity && severity.split(",").some((item) => !SEVERITIES.has(item.trim()))) throw new Error("hunt severity is invalid");
    if (sandbox && !SANDBOXES.has(sandbox)) throw new Error("hunt sandbox is invalid");
  } catch (error) {
    if (opts.json) console.log(JSON.stringify({ status: "error", code: "HUNT_INPUT", message: "hunt options are invalid" }));
    else if (!opts.quiet) console.error(error instanceof Error ? error.message : "hunt options are invalid");
    return 2;
  }
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
    severity: severity ?? "critical,high",
    sandbox: sandbox ?? "auto",
    dryRun: Boolean(opts.dryRun),
    finding: finding ?? "all eligible findings",
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
