#!/usr/bin/env node
import { createRequire } from "node:module";
import { Command } from "commander";
import chalk from "chalk";
import chokidar from "chokidar";
import { generateBadgeMarkdown } from "@verglos/reporter";
import { executeCi, executeScan, executeScore } from "./scan.js";
import { applyHeaderFixes } from "./fix.js";
import { loadCredentials, saveCredentials } from "./credentials.js";
import { installPreCommitHook } from "./config.js";
import { executeInit } from "./init.js";
import { executeExplain } from "./explain.js";
import { executePrecommit } from "./precommit.js";
import {
  executeMonitorRegister,
  executeMonitorStatus,
  executeMonitorTestAlert,
  executeMonitorUnregister,
} from "./monitor.js";
import { executeAttest } from "./attest.js";
import { executeHunt } from "./hunt.js";
import { executeWhoami } from "./whoami.js";
import { executeLogin } from "./login.js";
import { validateLicense } from "./license-api.js";
import {
  currentPlan,
  requireCapability,
} from "./entitlement.js";
import { startStdioServer } from "@verglos/mcp";
import { enforceLatestVersion, updateCli } from "./update.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };
const program = new Command();
const args = process.argv.slice(2);

if (args.includes("--update")) {
  await updateCli(version);
  process.exit(0);
}

program
  .name("verglos")
  .description("Security scanner for every app you ship")
  .version(version, "-v, --version", "Print installed CLI version")
  .option("--update", "Update Verglos CLI to the latest npm version")
  .option(
    "--as-plan <plan>",
    "[founder only] Simulate a plan (free|pro|studio) for this invocation",
  )
  .showHelpAfterError(chalk.gray("\nRun `verglos --help` for available commands."))
  .hook("preAction", async (thisCommand, actionCommand) => {
    if (actionCommand.name() === "update") return;
    // Program-level --as-plan propagates via env so every downstream
    // entitlement fetch picks it up without option-threading.
    const asPlan = thisCommand.opts().asPlan as string | undefined;
    if (asPlan) process.env.VERGLOS_AS_PLAN = asPlan;
    await enforceLatestVersion(version);
  });

program
  .command("update")
  .description("Update Verglos CLI to the latest npm version")
  .action(async () => {
    await updateCli(version);
  });

program
  .command("scan")
  .description("Run a full security scan")
  .option("-w, --watch", "Re-scan on file changes")
  .option("-q, --quiet", "Suppress terminal output")
  .option("--all", "Include low-confidence findings (default hides <0.7)")
  .option("--strict", "Include test file findings in score")
  .option(
    "--no-provenance",
    "Skip the AI-authorship analysis (no headline provenance line)",
  )
  .option(
    "--verify-secrets",
    "Hit GitHub / Stripe APIs to prove matched keys are live (opt-in — makes network calls)",
  )
  .option(
    "--no-telemetry",
    "Do not send the anonymous scan event (also toggled by VERGLOS_TELEMETRY=0)",
  )
  .action(
    async (opts: {
      watch?: boolean;
      quiet?: boolean;
      all?: boolean;
      strict?: boolean;
      provenance?: boolean;
      verifySecrets?: boolean;
      telemetry?: boolean;
    }) => {
      // Commander sets opts.provenance = false when --no-provenance is passed.
      const noProvenance = opts.provenance === false;
      const noTelemetry = opts.telemetry === false;
      const scanOptions = {
        quiet: opts.quiet,
        all: opts.all,
        strict: opts.strict,
        noProvenance,
        verifySecrets: opts.verifySecrets,
        noTelemetry,
      };
      if (opts.watch) {
        console.log(chalk.gray("Watching for changes... (Ctrl+C to stop)"));
        await executeScan(scanOptions);
        const watcher = chokidar.watch(".", {
          ignored: [
            /node_modules/,
            /\.git/,
            /dist/,
            /\.next/,
            /verglos-report/,
          ],
          persistent: true,
          ignoreInitial: true,
        });
        watcher.on("change", async () => {
          console.log(chalk.gray("\nFile changed, re-scanning..."));
          await executeScan(scanOptions);
        });
        return;
      }
      await executeScan(scanOptions);
    },
  );

program
  .command("score")
  .description("Print security score only")
  .option("--strict", "Include test file findings in score")
  .action(async (opts: { strict?: boolean }) => {
    await executeScore(undefined, opts.strict);
  });

program
  .command("secrets")
  .description("Scan for secrets only")
  .action(async () => {
    await executeScan({ detectors: ["secrets"], focused: true });
  });

program
  .command("deps")
  .description("Dependency vulnerability audit only")
  .action(async () => {
    await executeScan({
      detectors: ["dependencies"],
      focused: true,
      includeGitHistory: false,
    });
  });

program
  .command("ci")
  .description("CI mode — exit non-zero on critical issues")
  .option("-t, --threshold <score>", "Minimum score threshold", "60")
  .option("-q, --quiet", "Suppress output")
  .option("--strict", "Include test file findings in score")
  .option(
    "--no-telemetry",
    "Do not send the anonymous scan event (also toggled by VERGLOS_TELEMETRY=0)",
  )
  .action(async (opts: { threshold: string; quiet?: boolean; strict?: boolean; telemetry?: boolean }) => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const plan = await currentPlan({ asPlan });
    const hasThreshold = plan.plan !== "free";
    const code = await executeCi({
      threshold: hasThreshold ? parseInt(opts.threshold, 10) : undefined,
      quiet: opts.quiet,
      strict: opts.strict,
      noTelemetry: opts.telemetry === false,
    });
    if (!hasThreshold && !opts.quiet) {
      console.log("");
      console.log(
        chalk.gray(
          "  Free tier: threshold enforcement is Pro — this run only blocks on criticals.",
        ),
      );
      console.log(
        chalk.gray("  Upgrade at https://verglos.com/checkout"),
      );
    }
    process.exit(code);
  });

program
  .command("fix")
  .description("Auto-fix safe security issues [Pro] (currently: header injection)")
  .action(async () => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const ok = await requireCapability("fix", "`verglos fix`", {
      asPlan,
      extraLine:
        "Your findings are still in verglos-report.html — auto-fix just needs Pro.",
    });
    if (!ok) process.exit(1);

    console.log(chalk.bold("verglos fix") + chalk.gray(" · framework-aware header injection"));
    console.log("");
    const fixed = await applyHeaderFixes(process.cwd());
    console.log("");
    if (fixed > 0) {
      console.log(chalk.gray("Re-run `verglos scan` to see the updated score."));
    }
  });

program
  .command("hunt")
  .description("Verify findings in a local sandbox [Pro] (shell — v2.0.0-beta)")
  .option("--severity <level>", "Severity filter to hunt (default: critical,high)")
  .option("--sandbox <adapter>", "Sandbox adapter: auto, node-vm, docker, firecracker")
  .option("--dry-run", "Parse options without running sandbox verification")
  .option("--finding <id>", "Verify one finding ID from a Verglos report")
  .action(
    async (opts: {
      severity?: string;
      sandbox?: string;
      dryRun?: boolean;
      finding?: string;
    }) => {
      const code = await executeHunt({
        ...opts,
        asPlan: process.env.VERGLOS_AS_PLAN,
      });
      process.exit(code);
    },
  );

program
  .command("login")
  .description("Authenticate via a browser device-code flow")
  .action(async () => {
    const code = await executeLogin();
    if (code !== 0) process.exit(code);
  });

program
  .command("activate <licenseKey>")
  .description("Activate with a license key (validates against the server first)")
  .option(
    "--ci",
    "CI-friendly output: skip prompts, exit non-zero on failure",
  )
  .action(async (licenseKey: string, opts: { ci?: boolean }) => {
    const creds = await loadCredentials();
    const result = await validateLicense(licenseKey, creds.apiUrl);

    if (!result.valid) {
      if (result.reason === "network") {
        console.error(
          chalk.red(
            "error: could not reach verglos.com to validate the key. Check your connection and try again.",
          ),
        );
      } else if (result.reason === "not_found" || result.reason === "bad_request") {
        console.error(
          chalk.red(
            "error: license key not recognised (contact support@verglos.com)",
          ),
        );
      } else if (result.reason === "expired") {
        const when = result.expiresAt
          ? new Date(result.expiresAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "recently";
        console.error(
          chalk.red(
            `error: this license expired on ${when}. Renew at verglos.com/account.`,
          ),
        );
      } else {
        console.error(chalk.red(`error: license inactive (${result.reason})`));
      }
      process.exit(opts.ci ? 2 : 1);
    }

    await saveCredentials({
      ...creds,
      licenseKey,
      plan: result.plan,
      planExpiresAt: result.expiresAt ?? undefined,
      // Persist the signed entitlement JWT when the server issues one.
      // Older server builds return undefined; we keep any prior token
      // rather than clobbering it, which preserves offline access
      // across an activation from a partial server response.
      entitlementToken: result.entitlementToken ?? creds.entitlementToken,
    });

    const renewal = result.expiresAt
      ? ` · renews ${new Date(result.expiresAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}`
      : result.plan === "founder"
        ? " · unlimited"
        : "";
    console.log(
      chalk.green(
        `✓ ${result.plan.toUpperCase()} activated${renewal}`,
      ),
    );
    if (!opts.ci) {
      console.log(chalk.gray("  Run `verglos whoami` to double-check."));
    }
  });

program
  .command("whoami")
  .description("Show current sign-in, plan, renewal, and machine")
  .action(async () => {
    const code = await executeWhoami();
    if (code !== 0) process.exit(code);
  });

program
  .command("badge")
  .description("Generate README badge markdown")
  .action(async () => {
    const projectRoot = process.cwd();
    const { runScan } = await import("@verglos/scanner");
    const result = await runScan({ projectRoot, unlocked: true });
    console.log(generateBadgeMarkdown(result.score.value));
  });

program
  .command("hook")
  .description("Install pre-commit git hook")
  .action(async () => {
    await installPreCommitHook(process.cwd());
    console.log(chalk.green("Pre-commit hook installed."));
    console.log(
      chalk.gray(
        "  Bypass with `git commit --no-verify` if you need to override.",
      ),
    );
  });

const monitor = program
  .command("monitor")
  .description("Continuous CVE monitoring for a project [Pro]");

monitor
  .command("register")
  .description("Register this project's dep tree for hourly OSV monitoring [Pro]")
  .option("--email <address>", "Email to send critical/high alerts to")
  .option("--slack <url>", "Slack incoming webhook (https://hooks.slack.com/services/...)")
  .option("--webhook <url>", "Generic webhook URL to POST alert JSON to")
  .option("--label <name>", "Human-friendly project label (defaults to git repo)")
  .action(async (opts: { email?: string; slack?: string; webhook?: string; label?: string }) => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const ok = await requireCapability(
      "monitor_register",
      "Continuous CVE monitoring",
      {
        asPlan,
        extraLine:
          "Nothing was registered. Pro alerts you on new CVEs affecting your deps.",
      },
    );
    if (!ok) process.exit(1);
    const code = await executeMonitorRegister(opts, version);
    if (code !== 0) process.exit(code);
  });

monitor
  .command("status")
  .description("List projects registered for continuous CVE monitoring [Pro]")
  .action(async () => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const ok = await requireCapability(
      "monitor_register",
      "Continuous CVE monitoring",
    );
    if (!ok) process.exit(1);
    const code = await executeMonitorStatus();
    if (code !== 0) process.exit(code);
  });

monitor
  .command("unregister")
  .description("Stop monitoring a project — no more alerts [Pro]")
  .option(
    "--project-fingerprint <fp>",
    "Fingerprint from `verglos monitor status` (defaults to the current project)",
  )
  .action(async (opts: { projectFingerprint?: string }) => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const ok = await requireCapability(
      "monitor_register",
      "Continuous CVE monitoring",
    );
    if (!ok) process.exit(1);
    const code = await executeMonitorUnregister({
      projectFingerprint: opts.projectFingerprint,
    });
    if (code !== 0) process.exit(code);
  });

monitor
  .command("test-alert")
  .description("Fire a canary alert through the registered channels to verify wiring [Pro]")
  .option(
    "--project-fingerprint <fp>",
    "Fingerprint from `verglos monitor status` (defaults to the current project)",
  )
  .action(async (opts: { projectFingerprint?: string }) => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const ok = await requireCapability(
      "monitor_register",
      "Continuous CVE monitoring",
    );
    if (!ok) process.exit(1);
    const code = await executeMonitorTestAlert({
      projectFingerprint: opts.projectFingerprint,
    });
    if (code !== 0) process.exit(code);
  });

program
  .command("mcp")
  .description("Start the Verglos MCP server (stdio) for AI coding agents")
  .option(
    "--print-config",
    "Print the JSON snippet you paste into your agent's MCP config, then exit",
  )
  .action(async (opts: { printConfig?: boolean }) => {
    if (opts.printConfig) {
      console.log(
        JSON.stringify(
          {
            mcpServers: {
              verglos: {
                command: "npx",
                args: ["-y", "verglos", "mcp"],
              },
            },
          },
          null,
          2,
        ),
      );
      console.log("");
      console.log(chalk.gray("Paste this into:"));
      console.log(chalk.gray("  Cursor       → ~/.cursor/mcp.json"));
      console.log(chalk.gray("  Claude Code  → ~/.claude/mcp.json"));
      console.log(chalk.gray("  Windsurf     → ~/.codeium/windsurf/mcp_config.json"));
      console.log(chalk.gray("  Cline        → .vscode/settings.json (cline.mcpServers)"));
      return;
    }
    await startStdioServer();
  });

program
  .command("precommit")
  .description("Fast secrets + criticals scan for the pre-commit hook (<2s budget)")
  .option("--timeout <ms>", "Timeout budget in ms", "2000")
  .action(async (opts: { timeout: string }) => {
    const code = await executePrecommit({
      timeoutMs: parseInt(opts.timeout, 10),
    });
    process.exit(code);
  });

// `verglos attest` — Studio-tier. Runs a scan, POSTs the summary to
// /api/v1/attest, and prints a public verify URL the customer pastes
// into a client handoff, PR review, or due-diligence questionnaire.
// See packages/cli/src/attest.ts for the full contract.
program
  .command("attest")
  .description("Publish a public attestation for this project [Studio]")
  .option("--label <name>", "Override the project name shown on the verify page")
  .option("--quiet", "Print only the verify URL (no chrome) for shell pipelines")
  .action(async (opts: { label?: string; quiet?: boolean }) => {
    const code = await executeAttest({
      cwd: process.cwd(),
      cliVersion: version,
      label: opts.label,
      quiet: opts.quiet,
    });
    process.exit(code);
  });

program
  .command("init")
  .description("Configure Verglos in the current project (interactive)")
  .option("-y, --yes", "Non-interactive: keep existing config, skip hook install")
  .action(async (opts: { yes?: boolean }) => {
    const code = await executeInit({ yes: opts.yes });
    if (code !== 0) process.exit(code);
  });

program
  .command("explain [rule]")
  .description("Explain a Verglos rule (why it exists, how to fix)")
  .option("-l, --list", "List every rule Verglos knows about")
  .action((rule: string | undefined, opts: { list?: boolean }) => {
    const code = executeExplain({ rule, list: opts.list });
    if (code !== 0) process.exit(code);
  });

program.parse();
