#!/usr/bin/env node
import { createRequire } from "node:module";
import { Command } from "commander";
import chalk from "chalk";
import open from "open";
import chokidar from "chokidar";
import { generateBadgeMarkdown } from "@verglos/reporter";
import { executeCi, executeScan, executeScore } from "./scan.js";
import { applyHeaderFixes } from "./fix.js";
import {
  DEFAULT_API_URL,
  loadCredentials,
  saveCredentials,
} from "./credentials.js";
import { ensureConfig, installPreCommitHook } from "./config.js";
import { executeInit } from "./init.js";
import { executeExplain } from "./explain.js";
import { executePrecommit } from "./precommit.js";
import { executeMonitorRegister } from "./monitor.js";
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
  .showHelpAfterError(chalk.gray("\nRun `verglos --help` for available commands."))
  .hook("preAction", async (_thisCommand, actionCommand) => {
    if (actionCommand.name() === "update") return;
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
    await executeScan({ detectors: ["secrets"] });
  });

program
  .command("deps")
  .description("Dependency vulnerability audit only")
  .action(async () => {
    await executeScan({ detectors: ["dependencies"] });
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
    const code = await executeCi({
      threshold: parseInt(opts.threshold, 10),
      quiet: opts.quiet,
      strict: opts.strict,
      noTelemetry: opts.telemetry === false,
    });
    process.exit(code);
  });

program
  .command("fix")
  .description("Auto-fix safe security issues (currently: header injection)")
  .action(async () => {
    console.log(chalk.bold("verglos fix") + chalk.gray(" · framework-aware header injection"));
    console.log("");
    const fixed = await applyHeaderFixes(process.cwd());
    console.log("");
    if (fixed > 0) {
      console.log(chalk.gray("Re-run `verglos scan` to see the updated score."));
    }
  });

program
  .command("login")
  .description("Authenticate and activate license")
  .action(async () => {
    const creds = await loadCredentials();
    const url = `${creds.apiUrl}/login?cli=true`;
    console.log(chalk.gray("Opening browser for authentication..."));
    await open(url);
    console.log(
      chalk.gray(
        "After signing in, your CLI will be activated automatically.",
      ),
    );
    console.log(
      chalk.gray(
        "Or paste your license key: verglos activate <key>",
      ),
    );
  });

program
  .command("activate <licenseKey>")
  .description("Activate with a license key")
  .action(async (licenseKey: string) => {
    await saveCredentials({
      ...(await loadCredentials()),
      licenseKey,
    });
    console.log(chalk.green("License key saved. Pro features are active."));
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
  .description("Register this project's dep tree for hourly OSV monitoring")
  .option("--email <address>", "Email to send critical/high alerts to")
  .option("--slack <url>", "Slack incoming webhook (https://hooks.slack.com/services/...)")
  .option("--webhook <url>", "Generic webhook URL to POST alert JSON to")
  .option("--label <name>", "Human-friendly project label (defaults to git repo)")
  .action(async (opts: { email?: string; slack?: string; webhook?: string; label?: string }) => {
    const code = await executeMonitorRegister(opts, version);
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
