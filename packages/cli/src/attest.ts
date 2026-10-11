import chalk from "chalk";
import { resolveEntitlement, warnIfStale, type ResolvedEntitlement } from "./entitlement.js";

export interface AttestOptions {
  report?: string;
  sign?: boolean;
  verifyUrl?: string;
  asPlan?: string;
  json?: boolean;
  quiet?: boolean;
}

export interface AttestRuntime {
  resolveEntitlement: (options: { asPlan?: string }) => Promise<Pick<ResolvedEntitlement, "plan" | "stale">>;
  warnIfStale: (entitlement: { stale?: boolean; plan?: string }) => void;
}

const STUDIO_PLANS = new Set(["studio", "compliance", "founder"]);

function validateAttestOptions(opts: AttestOptions): void {
  const report = opts.report ?? "verglos-report.json";
  if (report.length === 0 || report.length > 4096 || /[\u0000-\u001f\u007f]/u.test(report)) throw new Error("attest report path is invalid");
  const verifyUrl = opts.verifyUrl ?? "https://verglos.com/verify";
  let parsed: URL;
  try { parsed = new URL(verifyUrl); } catch { throw new Error("attest verify URL is invalid"); }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.hash || parsed.pathname.length > 512 || parsed.toString().length > 2048) throw new Error("attest verify URL must be a bounded HTTPS URL");
}

export async function executeAttest(
  opts: AttestOptions = {},
  runtime: AttestRuntime = { resolveEntitlement, warnIfStale },
): Promise<number> {
  try { validateAttestOptions(opts); }
  catch (error) {
    if (opts.json) console.log(JSON.stringify({ status: "error", code: "ATTEST_INPUT", message: "attest options are invalid" }));
    else if (!opts.quiet) console.error(error instanceof Error ? error.message : "attest options are invalid");
    return 2;
  }
  if (!opts.json && !opts.quiet) console.error(chalk.yellow("Deprecated: attest is a legacy compatibility shell. It does not create, sign, or publish a record or summary."));
  const entitlement = await runtime.resolveEntitlement({ asPlan: opts.asPlan });
  runtime.warnIfStale({ stale: entitlement.stale, plan: entitlement.plan });

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

  const result = {
    status: "unavailable",
    code: "LEGACY_ATTEST_RETIRED",
    reason: "legacy_shell",
    canonicalWorkflow: "record create/sign/verify",
    signingPerformed: false,
    publicationPerformed: false,
  } as const;
  if (opts.json) console.log(JSON.stringify(result));
  else if (!opts.quiet) {
    console.log(chalk.bold("verglos attest") + chalk.gray(" — retired legacy command"));
    console.log(chalk.gray("No report was read; no signature or public summary was created."));
    console.log(chalk.gray("For the canonical offline workflow, use `verglos record create`, `record sign`, and `record verify`."));
  }
  return 78;
}
