#!/usr/bin/env node
import { createRequire } from "node:module";
import { lstat, readFile, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Command } from "commander";
import chalk from "chalk";
import chokidar from "chokidar";
import { generateBadgeMarkdown } from "@verglos/reporter";
import { executeCi, executeScan, executeScore } from "./scan.js";
import { applyHeaderFixes, authorizeHeaderFix, planHeaderFixes } from "./fix.js";
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
  getVerifiedLicense,
  requireCapability,
} from "./entitlement.js";
import { startStdioServer } from "@verglos/mcp";
import { enforceLatestVersion, updateCli } from "./update.js";
import { executeTargetInspect } from "./target-inspect.js";
import { ApprovalReceiptSchema, authorizeAgentAction, listCachedEngines, type ApprovalReceipt } from "@verglos/shared";
import { homedir } from "node:os";
import { join } from "node:path";
import { executeEngineInstall } from "./engines-install.js";
import { formatEngineStatus } from "./engines-status.js";
import { executeDiff } from "./diff.js";
import { executePolicyCheck } from "./policy-check.js";
import { transferEvidence, inspectEvidence } from "./evidence-transfer.js";
import { executeRecordVerify } from "./record-verify.js";
import { executeRecordCreate } from "./record-create.js";
import { executeRecordProject } from "./record-project.js";
import { executeRecordSign } from "./record-sign.js";
import { executeConfigInspect } from "./config-inspect.js";
import { executeRecordHeader } from "./record-header.js";
const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };
const program = new Command();
const args = process.argv.slice(2);

async function readApprovalReceiptFile(path: string): Promise<ApprovalReceipt> {
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > 256 * 1024) throw new Error("approval receipt must be a bounded regular file");
  const bytes = await readFile(path);
  if (bytes.byteLength > 256 * 1024) throw new Error("approval receipt must be a bounded regular file");
  let value: unknown;
  try { value = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("approval receipt must be valid JSON"); }
  return ApprovalReceiptSchema.parse(value);
}

if (args.includes("--update")) {
  await updateCli(version);
  process.exit(0);
}

program
  .name("verglos")
  .description("The evidence agent for AI-generated code")
  .version(version, "-v, --version", "Print installed CLI version")
  .option("--update", "Update Verglos CLI to the latest npm version")
  .option(
    "--as-plan <plan>",
    "[founder only] Simulate a plan (free|pro|team|studio|enterprise) for this invocation",
  )
  .showHelpAfterError(chalk.gray("\nRun `verglos --help` for available commands."))
  .addHelpText(
    "afterAll",
    `
Command groups:
  Scan       scan, secrets, deps, score
  Hunt       hunt — verify findings in a local sandbox (shell — v2.0.0-beta)
  Attest     attest — sign an evidence bundle for client handoff (shell — v2.0.0-beta)
  Fix & CI   fix, ci, hook, precommit
  Session    login, whoami, activate
  Utilities  init, explain, badge, mcp, monitor, update
`,
  )
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

const config = program.command("config").description("Inspect local Verglos configuration");
config.command("inspect <path>")
  .description("Report version-migration warnings without applying configuration")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress output")
  .action(async (path: string, opts: { json?: boolean; quiet?: boolean }) => {
    process.exit(await executeConfigInspect(path, opts.json, opts.quiet));
  });

program
  .command("diff <base> <head>")
  .description("Compare two local Verglos release snapshots")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (base: string, head: string, opts: { json?: boolean; quiet?: boolean }) => {
    process.exit(await executeDiff(base, head, opts.json, opts.quiet));
  });

const policy = program.command("policy").description("Inspect local policy evaluation artifacts");
policy.command("check <evaluation>").description("Render a policy evaluation and return its contract exit code").option("--record-store <path>", "Verify a record manifest against its content-addressed member store").option("--json", "Emit machine-readable JSON").option("--quiet", "Suppress human output").action(async (evaluation: string, opts: { recordStore?: string; json?: boolean; quiet?: boolean }) => {
  process.exit(await executePolicyCheck(evaluation, opts.json, opts.quiet, { recordStore: opts.recordStore }));
});

const evidence = program.command("evidence").description("Import and export standards evidence");
evidence.command("export <input> <output>")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .description("Validate bounded evidence JSON and export a supported standards document")
  .action(async (input: string, output: string, opts: { json?: boolean; quiet?: boolean }) => {
    try {
      const result = await transferEvidence(input, output);
      if (opts.json) console.log(JSON.stringify(result));
      else if (!opts.quiet) console.log("Exported " + result.format + " evidence (" + result.bytes + " bytes).");
    } catch (error) {
      if (!opts.quiet) console.error(error instanceof Error ? error.message : "Evidence export failed.");
      process.exit(78);
    }
});

const record = program.command("record").description("Verify local content-addressed Verglos records");
record.command("create <membersRoot> <manifestPath> <outputRoot>")
  .description("Materialize a validated manifest and its payloads into a local record store")
  .option("--complete", "Require subject, policy-evaluation, and release-decision graph members")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (membersRoot: string, manifestPath: string, outputRoot: string, opts: { json?: boolean; quiet?: boolean; complete?: boolean }) => {
    process.exit(await executeRecordCreate(membersRoot, manifestPath, outputRoot, opts.json, opts.quiet, opts.complete));
  });
record.command("verify <storeRoot> <manifestPath>")
  .description("Verify every stored record member against its manifest")
  .option("--json", "Emit machine-readable JSON")
  .option("--signature <path>", "Verify an offline record signature envelope")
  .option("--public-key <path>", "Verify with a user-supplied Ed25519 public key")
  .option("--trusted-issuer <issuer>", "Require this exact signature issuer")
  .option("--trusted-signer <id>", "Require this exact signature identity")
  .option("--complete", "Require the complete Release Record graph")
  .option("--quiet", "Suppress human output")
  .action(async (storeRoot: string, manifestPath: string, opts: { json?: boolean; quiet?: boolean; signature?: string; publicKey?: string; trustedIssuer?: string; trustedSigner?: string; complete?: boolean }) => {
    process.exit(await executeRecordVerify(storeRoot, manifestPath, opts.json, opts.quiet, opts.signature, opts.publicKey, opts.trustedIssuer, opts.trustedSigner, opts.complete));
  });
record.command("sign <manifestPath> <signaturePath>")
  .description("Sign a validated record manifest with a user-supplied offline key")
  .requiredOption("--key <path>", "Private Ed25519 key path")
  .requiredOption("--signer <id>", "Signer identity label")
  .requiredOption("--issuer <issuer>", "Signer issuer label")
  .option("--approve", "Approve the signing identity operation")
  .option("--approval-receipt <path>", "Path to an exact, time-bounded signing approval receipt")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (manifestPath: string, signaturePath: string, opts: { key: string; signer: string; issuer: string; approve?: boolean; approvalReceipt?: string; json?: boolean; quiet?: boolean }) => {
    let approvalReceipt: ApprovalReceipt | undefined;
    if (opts.approve && !opts.approvalReceipt) {
      if (!opts.quiet) console.error("record signing requires an approval receipt (--approval-receipt) before reading the key");
      process.exit(78);
    }
    if (opts.approve && opts.approvalReceipt) {
      try {
        approvalReceipt = await readApprovalReceiptFile(opts.approvalReceipt);
        const authorization = authorizeAgentAction("sign", approvalReceipt, new Date().toISOString());
        if (!authorization.allowed || approvalReceipt.target !== `manifest:${manifestPath}` || !approvalReceipt.files.includes(manifestPath) || approvalReceipt.network.length > 0) throw new Error(authorization.allowed ? "approval receipt scope does not match the signing manifest" : authorization.reason);
      } catch (error) {
        if (!opts.quiet) console.error(error instanceof Error ? error.message : "approval receipt is invalid");
        process.exit(78);
      }
    }
    process.exit(await executeRecordSign(manifestPath, signaturePath, opts.key, opts.signer, opts.issuer, opts.approve, opts.json, opts.quiet, approvalReceipt, new Date().toISOString(), process.env.VERGLOS_APPROVAL_STORE));
  });
record.command("project <storeRoot> <manifestPath>")
  .description("Project a verified record into safe public fields without uploading")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (storeRoot: string, manifestPath: string, opts: { json?: boolean; quiet?: boolean }) => {
    process.exit(await executeRecordProject(storeRoot, manifestPath, opts.json, opts.quiet));
  });
record.command("header <storeRoot> <manifestPath>")
  .description("Show the verified decision-first Release Record header")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress output")
  .action(async (storeRoot: string, manifestPath: string, opts: { json?: boolean; quiet?: boolean }) => {
    process.exit(await executeRecordHeader(storeRoot, manifestPath, opts.json, opts.quiet));
  });

evidence.command("import <input>")
  .description("Validate bounded evidence JSON and report its detected format")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress output")
  .action(async (input: string, opts: { json?: boolean; quiet?: boolean }) => {
    try {
      const result = await inspectEvidence(input);
      if (opts.json) console.log(JSON.stringify(result));
      else if (!opts.quiet) console.log(result.format + " " + result.version + " (" + result.bytes + " bytes)");
    } catch (error) {
      if (!opts.quiet) console.error(error instanceof Error ? error.message : "Evidence import failed.");
      process.exit(78);
    }
  });

const engines = program.command("engines").description("Inspect managed engine state");
engines.command("status")
  .description("List cached engine versions without changing state")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress output")
  .action(async (opts: { json?: boolean; quiet?: boolean }) => {
    const cacheRoot = process.env.VERGLOS_ENGINE_CACHE ?? join(homedir(), ".cache", "verglos", "engines");
    const engines = await listCachedEngines(cacheRoot);
    const output = formatEngineStatus(cacheRoot, engines, opts.json, opts.quiet);
    if (output) console.log(output);
  });

engines.command("install <engineId> <version> <artifactPath>")
  .description("Install a local digest-pinned engine artifact")
  .requiredOption("--digest <sha256>", "Expected sha256:<hex> digest")
  .option("--manifest <path>", "Validate a bounded engine compatibility manifest")
.option("--manifest-key <path>", "Verify the manifest with an Ed25519 public key")
.option("--approve", "Approve the local engine mutation")
.option("--approval-receipt <path>", "Path to an exact, time-bounded engine approval receipt")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress output")
  .action(async (engineId: string, version: string, artifactPath: string, opts: { digest: string; manifest?: string; manifestKey?: string; approve?: boolean; approvalReceipt?: string; json?: boolean; quiet?: boolean }) => { let approvalReceipt: ApprovalReceipt | undefined; if (opts.approve && opts.approvalReceipt) { try { approvalReceipt = await readApprovalReceiptFile(opts.approvalReceipt); } catch (error) { if (!opts.quiet) console.error(error instanceof Error ? error.message : "approval receipt is invalid"); process.exit(78); } } process.exit(await executeEngineInstall(engineId, version, artifactPath, opts.digest, { ...opts, approvalReceipt, approvalStoreRoot: process.env.VERGLOS_APPROVAL_STORE, manifestPath: opts.manifest, manifestPublicKeyPath: opts.manifestKey })); });

for (const action of ["update", "rollback"] as const) {
  engines.command(`${action} <engineId> <version> <artifactPath>`)
    .description(`${action === "update" ? "Update" : "Rollback"} a managed engine from a local digest-pinned artifact`)
    .requiredOption("--digest <sha256>", "Expected sha256:<hex> digest")
    .option("--manifest <path>", "Validate a bounded engine compatibility manifest")
    .option("--manifest-key <path>", "Verify the manifest with an Ed25519 public key")
    .option("--approve", "Approve the local engine mutation")
    .option("--approval-receipt <path>", "Path to an exact, time-bounded engine approval receipt")
    .option("--json", "Emit machine-readable JSON")
    .option("--quiet", "Suppress output")
    .action(async (engineId: string, version: string, artifactPath: string, opts: { digest: string; manifest?: string; manifestKey?: string; approve?: boolean; approvalReceipt?: string; json?: boolean; quiet?: boolean }) => {
      let approvalReceipt: ApprovalReceipt | undefined; if (opts.approve && opts.approvalReceipt) { try { approvalReceipt = await readApprovalReceiptFile(opts.approvalReceipt); } catch (error) { if (!opts.quiet) console.error(error instanceof Error ? error.message : "approval receipt is invalid"); process.exit(78); } }
      process.exit(await executeEngineInstall(engineId, version, artifactPath, opts.digest, { ...opts, approvalReceipt, approvalStoreRoot: process.env.VERGLOS_APPROVAL_STORE, manifestPath: opts.manifest, manifestPublicKeyPath: opts.manifestKey, action }));
    });
}

program
  .command("target")
  .description("Inspect an immutable target subject")
  .command("inspect <kind> <value>")
  .description("Resolve target metadata without executing project code")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (kind: string, value: string, opts: { json?: boolean; quiet?: boolean }) => {
    if (!["repository", "package", "filesystem", "artifact", "sbom", "oci"].includes(kind)) process.exit(78);
    process.exit(await executeTargetInspect(kind as "repository" | "package" | "filesystem" | "artifact" | "sbom" | "oci", value, opts.json, opts.quiet));
  });

program
  .command("scan")
  .description("Run a full security scan")
  .option("-w, --watch", "Re-scan on file changes")
  .option("-q, --quiet", "Suppress terminal output")
  .option("--json", "Emit machine-readable JSON")
  .option("--all", "Include low-confidence findings (default hides <0.7)")
  .option("--strict", "Include test file findings in score")
  .option("--config <path>", "Use a bounded JSON Verglos config file")
  .option("--output <dir>", "Write HTML/JSON reports to a bounded output directory")
  .option("--policy <path>", "Use a local policy-evaluation artifact for the CI decision")
  .option("--policy-evaluation <path>", "Use a local policy-evaluation artifact for the CI decision")
  .option(
    "--no-provenance",
    "Skip the AI-authorship analysis (no headline provenance line)",
  )
  .option(
    "--verify-secrets",
    "Hit GitHub / Stripe APIs to prove matched keys are live (opt-in — makes network calls)",
  )
  .option("--hunt", "After scanning, hand eligible findings to hunt (shell — v2.0.0-beta)")
  .option(
    "--no-telemetry",
    "Do not send the anonymous scan event (also toggled by VERGLOS_TELEMETRY=0)",
  )
  .action(
    async (opts: {
      watch?: boolean;
      quiet?: boolean;
      json?: boolean;
      all?: boolean;
      strict?: boolean;
      config?: string;
      output?: string;
      policy?: string;
      policyEvaluation?: string;
      provenance?: boolean;
      verifySecrets?: boolean;
      hunt?: boolean;
      telemetry?: boolean;
    }) => {
      // Commander sets opts.provenance = false when --no-provenance is passed.
      const noProvenance = opts.provenance === false;
      const noTelemetry = opts.telemetry === false;
      const scanOptions = {
        quiet: opts.quiet,
        json: opts.json,
        all: opts.all,
        strict: opts.strict,
        configPath: opts.config,
        outputDir: opts.output,
        noProvenance,
        verifySecrets: opts.verifySecrets,
        hunt: opts.hunt,
      noTelemetry,
      };
      const policyPath = opts.policyEvaluation ?? opts.policy;
      if (policyPath) {
        process.exit(await executePolicyCheck(policyPath, opts.json, opts.quiet));
      }
      if (opts.watch) {
        if (!opts.quiet && !opts.json) console.log(chalk.gray("Watching for changes... (Ctrl+C to stop)"));
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
          if (!opts.quiet && !opts.json) console.log(chalk.gray("\nFile changed, re-scanning..."));
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
  .option("-q, --quiet", "Suppress terminal output")
  .option("--json", "Emit machine-readable JSON")
  .option("--config <path>", "Use a bounded JSON Verglos config file")
  .action(async (opts: { strict?: boolean; quiet?: boolean; json?: boolean; config?: string }) => {
    await executeScore(undefined, opts.strict, opts.quiet, opts.config, opts.json);
  });

program
  .command("secrets")
  .description("Scan for secrets only")
  .option("-q, --quiet", "Suppress terminal output")
  .option("--json", "Emit machine-readable JSON")
  .option("--config <path>", "Use a bounded JSON Verglos config file")
  .option("--output <dir>", "Write HTML/JSON reports to a bounded output directory")
  .action(async (opts: { quiet?: boolean; json?: boolean; config?: string; output?: string }) => {
    await executeScan({ detectors: ["secrets"], focused: true, quiet: opts.quiet, json: opts.json, configPath: opts.config, outputDir: opts.output });
  });

program
  .command("deps")
  .description("Dependency vulnerability audit only")
  .option("-q, --quiet", "Suppress terminal output")
  .option("--json", "Emit machine-readable JSON")
  .option("--config <path>", "Use a bounded JSON Verglos config file")
  .option("--output <dir>", "Write HTML/JSON reports to a bounded output directory")
  .action(async (opts: { quiet?: boolean; json?: boolean; config?: string; output?: string }) => {
    await executeScan({
      detectors: ["dependencies"],
      focused: true,
      includeGitHistory: false,
      quiet: opts.quiet,
      json: opts.json,
      configPath: opts.config,
      outputDir: opts.output,
    });
  });

program
  .command("ci")
  .description("CI mode — exit non-zero on critical issues")
  .option("-t, --threshold <score>", "Minimum score threshold", "60")
  .option("-q, --quiet", "Suppress output")
  .option("--json", "Emit machine-readable JSON")
  .option("--strict", "Include test file findings in score")
  .option("--config <path>", "Use a bounded JSON Verglos config file")
  .option("--policy <path>", "Use a local policy-evaluation artifact for the CI decision")
  .option("--policy-evaluation <path>", "Use a local policy-evaluation artifact for the CI decision")
  .option("--hunt", "Gate on verified criticals only (shell — v2.0.0-beta)")
  .option(
    "--no-telemetry",
    "Do not send the anonymous scan event (also toggled by VERGLOS_TELEMETRY=0)",
  )
  .action(async (opts: { threshold: string; quiet?: boolean; json?: boolean; strict?: boolean; hunt?: boolean; telemetry?: boolean; policy?: string; policyEvaluation?: string; config?: string }) => {
    const policyPath = opts.policyEvaluation ?? opts.policy;
    if (policyPath) {
      process.exit(await executePolicyCheck(policyPath, opts.json, opts.quiet));
    }
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const plan = await currentPlan({ asPlan });
    const hasThreshold = plan.plan !== "free";
    if (opts.hunt) {
      const ok = await requireCapability("ci.hunt_gate", "`verglos ci --hunt`", {
        asPlan,
        extraLine:
          "Verified-only CI gating ships in v2.0.0-beta. This alpha can still run standard CI.",
      });
      if (!ok) process.exit(1);
    }
    const code = await executeCi({
      threshold: hasThreshold ? parseInt(opts.threshold, 10) : undefined,
      quiet: opts.quiet,
      json: opts.json,
      strict: opts.strict,
      configPath: opts.config,
      hunt: opts.hunt,
      noTelemetry: opts.telemetry === false,
    });
    if (!hasThreshold && !opts.quiet && !opts.json) {
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
  .option("--approve", "Approve the filesystem mutation")
  .option("--approval-receipt <path>", "Path to an exact, time-bounded mutate approval receipt")
  .option("--dry-run", "Show the planned file changes without mutating")
  .option("--rescan", "Run a local scan after applying the approved change")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (opts: { approve?: boolean; approvalReceipt?: string; dryRun?: boolean; rescan?: boolean; json?: boolean; quiet?: boolean }) => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const ok = await requireCapability("fix", "`verglos fix`", {
      asPlan,
      extraLine:
        "Your findings are still in verglos-report.html — auto-fix just needs Pro.",
    });
    if (!ok) process.exit(1);

    const plan = await planHeaderFixes(process.cwd());
    if (opts.dryRun || !opts.approve) {
      if (opts.json) console.log(JSON.stringify({ planned: plan }));
      else if (!opts.quiet) {
        if (plan.length === 0) console.log("No supported header change is planned.");
        else for (const item of plan) {
          console.log(`${item.action}: ${item.file}`);
          for (const line of item.preview ?? []) console.log(line);
        }
      }
    }
    if (opts.dryRun) return;
    if (!opts.approve) {
      console.error("verglos fix requires explicit approval (--approve) before changing files.");
      process.exit(78);
    }
    if (!opts.approvalReceipt) {
      console.error("verglos fix requires an approval receipt (--approval-receipt) before changing files.");
      process.exit(78);
    }
    let receipt: ApprovalReceipt;
    try { receipt = await readApprovalReceiptFile(opts.approvalReceipt); }
    catch (error) { console.error(error instanceof Error ? error.message : "approval receipt is invalid"); process.exit(78); }
    const plannedFiles = plan.filter((item) => item.action !== "skip").map((item) => item.file);
    const authorization = authorizeHeaderFix(receipt!, plannedFiles, new Date().toISOString());
    if (!authorization.allowed) {
      console.error(`verglos fix approval denied: ${authorization.reason}`);
      process.exit(78);
    }

    const snapshots = opts.rescan ? await Promise.all(plan.filter((item) => item.action !== "skip").map(async (item) => {
      const path = resolve(process.cwd(), item.file);
      try {
        const entry = await lstat(path);
        if (!entry.isFile() || entry.size > 1 * 1024 * 1024) throw new Error("fix rollback snapshot target is not a bounded regular file");
        const bytes = await readFile(path);
        if (bytes.byteLength > 1 * 1024 * 1024) throw new Error("fix rollback snapshot target is not a bounded regular file");
        return { path, existed: true, bytes };
      } catch (error) {
        if (error instanceof Error && error.message.includes("rollback snapshot target")) throw error;
        return { path, existed: false, bytes: undefined };
      }
    })) : [];

    if (!opts.quiet && !opts.json) {
      console.log(chalk.bold("verglos fix") + chalk.gray(" · framework-aware header injection"));
      console.log("");
    }
    const fixed = await applyHeaderFixes(process.cwd(), { approvalReceipt: receipt, now: new Date().toISOString(), approvalStoreRoot: process.env.VERGLOS_APPROVAL_STORE, quiet: opts.quiet || opts.json });
    if (!opts.quiet && !opts.json) console.log("");
    if (opts.json) console.log(JSON.stringify({ planned: plan, fixed, rescanned: Boolean(opts.rescan) }));
    if (fixed > 0) {
      if (!opts.quiet && !opts.json) console.log(chalk.gray("Re-run `verglos scan` to see the updated score."));
      if (opts.rescan) {
        if (!opts.quiet && !opts.json) console.log(chalk.gray("Running the requested post-fix rescan (telemetry disabled)..."));
        try {
          await executeScan({ noTelemetry: true });
        } catch (error) {
          for (const snapshot of snapshots) {
            if (snapshot.existed && snapshot.bytes) await writeFile(snapshot.path, snapshot.bytes, { mode: 0o600 });
            else await unlink(snapshot.path).catch(() => undefined);
          }
          console.error("Post-fix rescan failed; the approved mutation was rolled back.");
          throw error;
        }
      }
    }
  });

program
  .command("hunt")
  .description("Verify findings in a local sandbox [Pro] (shell — v2.0.0-beta)")
  .option("--severity <level>", "Severity filter to hunt (default: critical,high)")
  .option("--sandbox <adapter>", "Sandbox adapter: auto, node-vm, docker, firecracker")
  .option("--dry-run", "Parse options without running sandbox verification")
  .option("--finding <id>", "Verify one finding ID from a Verglos report")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(
    async (opts: {
      severity?: string;
      sandbox?: string;
      dryRun?: boolean;
      finding?: string;
      json?: boolean;
      quiet?: boolean;
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
      console.log("");
      console.log(chalk.bold("Verglos MCP tools"));
      console.log(chalk.gray("  verglos_scan                    Free — full local scan"));
      console.log(chalk.gray("  verglos_check_before_write      Free — legacy pre-write check"));
      console.log(chalk.gray("  verglos_check_package           Free — slopsquat / typo / CVE check"));
      console.log(chalk.gray("  verglos_explain_finding         Free — rule explanation"));
      console.log(chalk.gray("  verglos_hunt_finding            Pro — shell, v2.0.0-beta"));
      console.log(chalk.gray("  verglos_hunt_report             Pro — shell, v2.0.0-beta"));
      console.log(chalk.gray("  verglos_hunt_before_write       Pro — shell, v2.0.0-beta"));
      console.log(chalk.gray("  verglos_hunt_explain_verdict    Pro — shell, v2.0.0-beta"));
      console.log(chalk.gray("  verglos_attest                  Studio — shell, v2.0.0-beta"));
      return;
    }
    // The MCP host receives only locally verified entitlement context. This
    // avoids a network call on the stdio hot path while enforcing plan gates.
    const verifiedLicense = await getVerifiedLicense();
    const mcpPlan = verifiedLicense?.tier === "founder"
      ? "enterprise"
      : verifiedLicense?.tier;
    await startStdioServer({ plan: mcpPlan });
  });

program
  .command("precommit")
  .description("Fast secrets + criticals scan for the pre-commit hook (<2s budget)")
  .option("--timeout <ms>", "Timeout budget in ms", "2000")
  .option("--config <path>", "Use a bounded JSON Verglos config file")
  .option("--json", "Emit machine-readable JSON")
  .option("-q, --quiet", "Suppress terminal output")
  .action(async (opts: { timeout: string; config?: string; json?: boolean; quiet?: boolean }) => {
    const code = await executePrecommit({
      timeoutMs: parseInt(opts.timeout, 10),
      configPath: opts.config,
      json: opts.json,
      quiet: opts.quiet,
    });
    process.exit(code);
  });

program
  .command("attest")
  .description("Sign an evidence bundle for client handoff [Studio] (shell — v2.0.0-beta)")
  .option("--report <path>", "Path to the Verglos JSON report to attest")
  .option("--sign", "Request Ed25519 bundle signing")
  .option("--verify-url <url>", "Verify URL base to embed in the bundle")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (opts: { report?: string; sign?: boolean; verifyUrl?: string; json?: boolean; quiet?: boolean }) => {
    const code = await executeAttest({
      ...opts,
      asPlan: process.env.VERGLOS_AS_PLAN,
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
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action((rule: string | undefined, opts: { list?: boolean; json?: boolean; quiet?: boolean }) => {
    const code = executeExplain({ rule, list: opts.list, json: opts.json, quiet: opts.quiet });
    if (code !== 0) process.exit(code);
  });

program.parse();
