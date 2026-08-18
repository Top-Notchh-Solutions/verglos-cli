import chalk from "chalk";
import { runScan } from "@verglos/scanner";
import { computeProjectFingerprint } from "@verglos/shared";
import {
  authorizedFetch,
  type AuthorizedFetchResult,
} from "./authorized-fetch.js";
import { projectNameFromDetails } from "./telemetry.js";

/**
 * `verglos attest` — Studio+ only.
 *
 * Runs a full local scan, then POSTs the *summary* (score + finding
 * counts + optional project name) to /api/v1/attest. The server mints
 * a short URL-safe hash and returns the public verify URL — that
 * URL is the whole point: the Studio customer pastes it into a
 * client handoff, a PR review, or a due-diligence questionnaire, and
 * any third party can open it without an account to see the
 * summary.
 *
 * We intentionally do NOT send the full findings JSON — findings can
 * leak file paths and internal detail. The public attestation is a
 * *summary* the customer explicitly consented to publish by running
 * this command.
 *
 * Exit codes:
 *   0 — attestation minted; verify URL printed to stdout
 *   1 — bearer/tier/network failure; explanation printed to stderr
 */

export interface AttestOptions {
  cwd?: string;
  cliVersion?: string;
  /** Override the human-readable name that lands on the verify page. */
  label?: string;
  /** Print the URL only (no chrome) — useful for shell pipelines. */
  quiet?: boolean;
}

interface AttestResponse {
  ok: boolean;
  hash?: string;
  url?: string;
  reason?: string;
  upgradeUrl?: string;
}

export async function executeAttest(opts: AttestOptions): Promise<number> {
  const projectRoot = opts.cwd ?? process.cwd();
  const cliVersion = opts.cliVersion ?? "unknown";

  if (!opts.quiet) {
    console.log(chalk.gray("Scanning project for attestation…"));
  }

  const scan = await runScan({ projectRoot, unlocked: true });

  let fingerprint: string | undefined;
  let derivedName: string | undefined;
  try {
    const fp = await computeProjectFingerprint(projectRoot);
    fingerprint = fp.fingerprint ?? undefined;
    derivedName = projectNameFromDetails(fp.details);
  } catch {
    // Fingerprint failure means we can't publish a stable attestation
    // — bail so the customer isn't handed a URL keyed on nothing.
  }

  if (!fingerprint) {
    console.error(
      chalk.red("attest: could not compute a project fingerprint."),
    );
    console.error(
      chalk.gray(
        "  Run from a project directory with a package.json or a git remote.",
      ),
    );
    return 1;
  }

  const payload = {
    projectFingerprint: fingerprint,
    projectName: opts.label ?? derivedName,
    score: scan.score.value,
    findingCritical: scan.score.counts.critical,
    findingHigh: scan.score.counts.high,
    findingMedium: scan.score.counts.medium,
    findingLow: scan.score.counts.low,
    cliVersion,
  };

  const result = await authorizedFetch("/api/v1/attest", {
    method: "POST",
    body: payload,
  });

  if (!result.ok) {
    explainAttestFailure(result);
    return 1;
  }

  const body = result.json as AttestResponse;
  if (!body?.url) {
    console.error(chalk.red("attest: server returned no verify URL."));
    return 1;
  }

  if (opts.quiet) {
    console.log(body.url);
    return 0;
  }

  const displayName = opts.label ?? derivedName ?? "this project";
  const scoreColor =
    scan.score.value >= 80 ? chalk.green : scan.score.value >= 60 ? chalk.yellow : chalk.red;

  console.log();
  console.log(chalk.bold("Attestation minted."));
  console.log(
    `  ${chalk.gray("Project    ")} ${displayName}`,
  );
  console.log(
    `  ${chalk.gray("Score      ")} ${scoreColor(String(scan.score.value))}/100`,
  );
  console.log(
    `  ${chalk.gray("Findings   ")} ${scan.score.counts.critical} critical · ${scan.score.counts.high} high · ${scan.score.counts.medium} medium · ${scan.score.counts.low} low`,
  );
  console.log();
  console.log(chalk.bold("Verify URL"));
  console.log(`  ${chalk.cyan(body.url)}`);
  console.log();
  console.log(
    chalk.gray(
      "  Paste this URL into a client handoff, PR review, or due-diligence reply.",
    ),
  );
  console.log(
    chalk.gray(
      "  Anyone can open it without an account to see the summary above.",
    ),
  );
  return 0;
}

function explainAttestFailure(result: AuthorizedFetchResult): void {
  switch (result.reason) {
    case "no_license":
      console.error(chalk.red("attest: no license key."));
      console.error(
        chalk.gray("  Run `verglos login` or `verglos activate <key>` first."),
      );
      break;
    case "unauthorized": {
      const body = result.json as { reason?: string; upgradeUrl?: string } | null;
      console.error(
        chalk.red(
          `attest: license required (HTTP ${result.status}).`,
        ),
      );
      if (body?.reason) console.error(chalk.gray(`  ${body.reason}`));
      if (body?.upgradeUrl) console.error(chalk.gray(`  ${body.upgradeUrl}`));
      break;
    }
    case "not_implemented":
      console.error(
        chalk.yellow(
          "attest: the server has not shipped this endpoint yet.",
        ),
      );
      break;
    case "not_found":
      console.error(chalk.red("attest: endpoint not found (HTTP 404)."));
      break;
    case "network":
      console.error(
        chalk.red("attest: could not reach the server. Check your connection."),
      );
      break;
    default:
      console.error(
        chalk.red(`attest: request failed (HTTP ${result.status}).`),
      );
  }
}
