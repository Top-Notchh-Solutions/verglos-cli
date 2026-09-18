#!/usr/bin/env node
import { createRequire } from "node:module";
import { ScanConfigurationError } from "@verglos/scanner";
import { lstat, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Command, CommanderError } from "commander";
import chalk from "chalk";
import chokidar from "chokidar";
import { generateBadgeMarkdown } from "@verglos/reporter";
import { executeCi, executeScan, executeScore } from "./scan.js";
import { applyHeaderFixes, authorizeHeaderFix, authorizeHeaderFixTests, captureHeaderFixSnapshots, HeaderFixRollbackError, HeaderFixTestsError, planHeaderFixes, planHeaderFixTests, runApprovedHeaderFixTests, verifyOrRollbackHeaderFix, type HeaderFixTestPlan, type HeaderFixTestResult } from "./fix.js";
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
import { executeRecordExport } from "./record-export.js";
import { executeRecordAttest, SIGSTORE_NETWORK_ORIGINS } from "./record-sigstore.js";
import { executeHunt } from "./hunt.js";
import { executeHuntRecipeVerification } from "./hunt-recipe-verify.js";
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
import { ApprovalReceiptSchema, authorizeAgentAction, listCachedEngines, putApprovalReceipt, type ApprovalReceipt } from "@verglos/shared";

function reportPreflightError(json: boolean | undefined, quiet: boolean | undefined, code: string, humanMessage: string, machineMessage: string): void {
  if (json) console.log(JSON.stringify({ status: "error", code, message: machineMessage }));
  else if (!quiet) console.error(humanMessage);
}

function collectRepeated(value: string, previous: string[] = []): string[] { return [...previous, value]; }

async function runScanWithErrorBoundary(
  options: NonNullable<Parameters<typeof executeScan>[0]>,
  output: { readonly json?: boolean; readonly quiet?: boolean },
): Promise<number> {
  try {
    const exitCode = await executeScan(options);
    return options.snapshotPath ? exitCode : 0;
  } catch (error) {
    const configurationError = error instanceof ScanConfigurationError;
    reportPreflightError(
      output.json,
      output.quiet,
      configurationError ? "SCAN_CONFIG" : "SCAN_FAILURE",
      error instanceof Error ? error.message : "scan failed",
      configurationError ? "scan configuration is invalid or unavailable" : "scan could not complete",
    );
    return configurationError ? 2 : 4;
  }
}

import { homedir } from "node:os";
import { join } from "node:path";
import { executeEngineInstall } from "./engines-install.js";
import { executeEngineInspection } from "./engines-inspect.js";
import { formatEngineStatus } from "./engines-status.js";
import { executeDiff } from "./diff.js";
import { executePolicyCheck } from "./policy-check.js";
import { executePolicyExceptionShow } from "./policy-exception.js";
import { transferEvidence, inspectEvidence } from "./evidence-transfer.js";
import { executeRecordVerify } from "./record-verify.js";
import { executeRecordCreate } from "./record-create.js";
import { executeRecordProject } from "./record-project.js";
import { executeRecordSign } from "./record-sign.js";
import { executeConfigInspect } from "./config-inspect.js";
import { executeRecordHeader } from "./record-header.js";
import { executeRecordProvenanceImport } from "./record-provenance-import.js";
import { executeRecordPackage } from "./record-package.js";
import { printTelemetryConsentPreview, readTelemetryConsent, writeTelemetryConsent } from "./telemetry.js";
const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };
const program = new Command();
const args = process.argv.slice(2);
const jsonRequested = args.includes("--json");
const quietRequested = args.includes("--quiet") || args.includes("-q");

program
  .command("privacy")
  .description("Inspect and control local privacy settings")
  .command("telemetry <action>")
  .description("Preview, inspect, enable, or revoke optional scan analytics consent")
  .option("--yes", "Affirmatively consent to the displayed analytics fields")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress non-error output")
  .action(async (action: string, opts: { yes?: boolean; json?: boolean; quiet?: boolean }) => {
    const fields = ["CLI major.minor", "Node major", "OS family", "score band", "finding-count bands", "duration band", "coarse result band"];
    const excluded = ["project/repository identity", "license/account credentials", "source", "paths", "finding text", "detector names", "matched secret values"];
    if (action === "preview") {
      if (opts.json) console.log(JSON.stringify({ purpose: "aggregate CLI reliability metadata", fields, excluded, consentRequired: true, transmission: "disabled-pending-hosted-retention-controls" }));
      else if (!opts.quiet) printTelemetryConsentPreview();
      return;
    }
    if (action === "status") {
      const consent = await readTelemetryConsent();
      const result = { enabled: false, transmission: "disabled-pending-hosted-retention-controls", storedConsent: consent?.enabled ?? null, consentPolicyVersion: consent?.policyVersion ?? null, consentUpdatedAt: consent?.updatedAt ?? null, fields, excluded };
      if (opts.json) console.log(JSON.stringify(result));
      else if (!opts.quiet) console.log(`Scan analytics transmission: disabled pending hosted retention/deletion controls${consent ? ` (saved ${consent.enabled ? "opt-in" : "opt-out"} ${consent.updatedAt})` : " (no saved opt-in)"}`);
      return;
    }
    if (action === "disable") {
      const consent = await writeTelemetryConsent(false);
      const result = { enabled: false, consentPolicyVersion: consent.policyVersion, consentUpdatedAt: consent.updatedAt };
      if (opts.json) console.log(JSON.stringify(result));
      else if (!opts.quiet) console.log("Scan analytics disabled; this local preference can be changed with `verglos privacy telemetry enable --yes`.");
      return;
    }
    if (action === "enable") {
      if (!opts.yes) {
        if (opts.json) console.log(JSON.stringify({ status: "consent-required", purpose: "aggregate CLI reliability metadata", fields, excluded, next: "review this preview, then run verglos privacy telemetry enable --yes" }));
        else if (!opts.quiet) { printTelemetryConsentPreview(); console.log("No consent recorded. Review the fields, then rerun with --yes to save consent."); }
        process.exitCode = 2;
        return;
      }
      if (!opts.json && !opts.quiet) printTelemetryConsentPreview();
      const consent = await writeTelemetryConsent(true);
      const result = { enabled: false, consentSaved: true, transmission: "disabled-pending-hosted-retention-controls", consentPolicyVersion: consent.policyVersion, consentUpdatedAt: consent.updatedAt, fields, excluded };
      if (opts.json) console.log(JSON.stringify(result));
      else if (!opts.quiet) console.log("Consent saved. Analytics transmission remains disabled pending hosted retention/deletion controls; revoke the saved consent with `verglos privacy telemetry disable`.");
      return;
    }
    reportPreflightError(opts.json, opts.quiet, "PRIVACY_ACTION", "Use preview, status, enable, or disable.", "privacy telemetry action is invalid");
    process.exitCode = 78;
  });

async function readApprovalReceiptFile(path: string): Promise<ApprovalReceipt> {
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > 256 * 1024) throw new Error("approval receipt must be a bounded regular file");
  const bytes = await readFile(path);
  if (bytes.byteLength > 256 * 1024) throw new Error("approval receipt must be a bounded regular file");
  let value: unknown;
  try { value = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("approval receipt must be valid JSON"); }
  return ApprovalReceiptSchema.parse(value);
}

// Preserve the historic early `--update` alias while routing it through the
// same command boundary so JSON output can flush before process exit.
if (args.includes("--update")) {
  const outputFlags = args.filter((arg) => arg === "--json" || arg === "--quiet");
  process.argv = [...process.argv.slice(0, 2), "update", ...outputFlags];
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
  // Commander errors can echo invalid option text, including values that a
  // user accidentally supplied as an option. Emit a stable, value-free error
  // below instead; help/version output remains on stdout.
  .configureOutput({ writeErr: () => {} })
  .exitOverride()
  .addHelpText(
    "afterAll",
    `
Command groups:
  Scan       scan, secrets, deps, score
  Hunt       hunt — verify findings in a local sandbox (shell — v2.0.0-beta)
  Attest     attest — retired compatibility shell; use record create/sign/verify
  Fix & CI   fix, ci, hook, precommit
  Session    login, whoami, activate
  Utilities  init, explain, badge, mcp, monitor, update
`,
  )
  .hook("preAction", async (thisCommand, actionCommand) => {
    if (actionCommand.name() === "update" || (actionCommand.name() === "inspect" && actionCommand.parent?.name() === "engines")) return;
    // Program-level --as-plan propagates via env so every downstream
    // entitlement fetch picks it up without option-threading.
    const asPlan = thisCommand.opts().asPlan as string | undefined;
    if (asPlan) process.env.VERGLOS_AS_PLAN = asPlan;
    await enforceLatestVersion(version);
  });
program
  .command("update")
  .description("Update Verglos CLI to the latest npm version")
  .option("--json", "Emit one machine-readable update result")
  .option("--quiet", "Suppress update output")
  .action(async (opts: { json?: boolean; quiet?: boolean }) => {
    const result = await updateCli(version, undefined, {
      quiet: opts.json || opts.quiet,
      onInstallStart: opts.json || opts.quiet ? undefined : (latestVersion) => console.log(chalk.gray(`Updating Verglos CLI to ${latestVersion}...`)),
    });
    if (opts.json) console.log(JSON.stringify(result));
    else if (!opts.quiet) {
      if (result.status === "error") console.error(chalk.red(result.message));
      else if (!result.updated) console.log(chalk.green(`Verglos CLI is already up to date (${result.currentVersion}).`));
    }
    if (result.status === "error") process.exitCode = 1;
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
policy.command("exception <exceptionPath>")
  .description("Show exact exception scope, approval state, expiry, controls, and export-format support")
  .requiredOption("--approval <path>", "Path to the separate exception approval JSON")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (exceptionPath: string, opts: { approval: string; json?: boolean; quiet?: boolean }) => {
    process.exit(await executePolicyExceptionShow(exceptionPath, opts.approval, opts.json, opts.quiet));
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
      if (opts.json) console.log(JSON.stringify({ status: "error", code: "EVIDENCE_EXPORT_INPUT", message: "evidence export failed" }));
      else if (!opts.quiet) console.error(error instanceof Error ? error.message : "Evidence export failed.");
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
record.command("import-provenance <sourcePath> <outputMemberPath>")
  .description("Import bounded in-toto/DSSE provenance into a private Release Record member; signatures remain unverified")
  .requiredOption("--provider <name>", "Caller-declared provider: github, npm, buildkit, or unknown")
  .requiredOption("--subject-id <id>", "Canonical subjectId of the artifact in the Release Record")
  .requiredOption("--expected-digest <sha256>", "Expected artifact digest in sha256:<64 lowercase hex> form")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (sourcePath: string, outputMemberPath: string, opts: { provider: "github" | "npm" | "buildkit" | "unknown"; subjectId: string; expectedDigest: string; json?: boolean; quiet?: boolean }) => {
    process.exit(await executeRecordProvenanceImport(sourcePath, outputMemberPath, opts.provider, opts.subjectId, opts.expectedDigest, opts.json, opts.quiet));
  });
record.command("pack <storeRoot> <manifestPath> <output.vgl>")
  .description("Package a complete record as a local private .vgl directory")
  .option("--signature <path>", "Include a detached signature after local trust verification")
  .option("--public-key <path>", "Verify the signature with this user-supplied Ed25519 public key")
  .option("--trusted-issuer <issuer>", "Require this exact signature issuer")
  .option("--trusted-signer <id>", "Optionally require this exact signature identity")
  .option("--sigstore-bundle <path>", "Include a verified Sigstore v0.3 DSSE bundle")
  .option("--sigstore-binding <path>", "Include its digest-bound Release Record binding")
  .option("--trusted-root <path>", "Verify with this out-of-band Sigstore trusted root")
  .option("--certificate-issuer <issuer>", "Require this exact Sigstore certificate issuer")
  .option("--certificate-identity <identity>", "Require this exact Sigstore certificate identity")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (storeRoot: string, manifestPath: string, outputPath: string, opts: { json?: boolean; quiet?: boolean; signature?: string; publicKey?: string; trustedIssuer?: string; trustedSigner?: string; sigstoreBundle?: string; sigstoreBinding?: string; trustedRoot?: string; certificateIssuer?: string; certificateIdentity?: string }) => {
    process.exit(await executeRecordPackage(storeRoot, manifestPath, outputPath, opts.json, opts.quiet, opts.signature, opts.publicKey, opts.trustedIssuer, opts.trustedSigner, { bundlePath: opts.sigstoreBundle, bindingPath: opts.sigstoreBinding, trustedRootPath: opts.trustedRoot, issuer: opts.certificateIssuer, identity: opts.certificateIdentity }));
  });
record.command("verify <storeRoot> [manifestPath]")
  .description("Verify a local record store or complete .vgl package; signatures require explicit trusted verification material")
  .option("--json", "Emit machine-readable JSON")
  .option("--signature <path>", "Verify an offline record signature envelope")
  .option("--public-key <path>", "Verify with a user-supplied Ed25519 public key")
  .option("--trusted-issuer <issuer>", "Require this exact signature issuer")
  .option("--trusted-signer <id>", "Require this exact signature identity")
  .option("--sigstore-bundle <path>", "Verify an attached Sigstore v0.3 DSSE bundle")
  .option("--sigstore-binding <path>", "Verify the digest-bound Sigstore record binding")
  .option("--trusted-root <path>", "Use an out-of-band Sigstore trusted-root JSON file")
  .option("--certificate-issuer <issuer>", "Require this exact Sigstore certificate issuer")
  .option("--certificate-identity <identity>", "Require this exact Sigstore certificate identity")
  .option("--complete", "Require the complete Release Record graph")
  .option("--quiet", "Suppress human output")
  .action(async (storeRoot: string, manifestPath: string | undefined, opts: { json?: boolean; quiet?: boolean; signature?: string; publicKey?: string; trustedIssuer?: string; trustedSigner?: string; complete?: boolean; sigstoreBundle?: string; sigstoreBinding?: string; trustedRoot?: string; certificateIssuer?: string; certificateIdentity?: string }) => {
    process.exit(await executeRecordVerify(storeRoot, manifestPath, opts.json, opts.quiet, opts.signature, opts.publicKey, opts.trustedIssuer, opts.trustedSigner, opts.complete, { bundlePath: opts.sigstoreBundle, bindingPath: opts.sigstoreBinding, trustedRootPath: opts.trustedRoot, issuer: opts.certificateIssuer, identity: opts.certificateIdentity }));
  });
record.command("export <storeRoot> <manifestPath> <outputPath>")
  .description("Export an in-toto statement locally from a verified complete record; review limitation text before sharing")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (storeRoot: string, manifestPath: string, outputPath: string, opts: { json?: boolean; quiet?: boolean }) => {
    process.exit(await executeRecordExport(storeRoot, manifestPath, outputPath, opts.json, opts.quiet));
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
      reportPreflightError(opts.json, opts.quiet, "RECORD_SIGN_INPUT", "record signing requires an approval receipt (--approval-receipt) before reading the key", "record signing failed");
      process.exit(78);
    }
    if (opts.approve && opts.approvalReceipt) {
      try {
        approvalReceipt = await readApprovalReceiptFile(opts.approvalReceipt);
        const authorization = authorizeAgentAction("sign", approvalReceipt, new Date().toISOString());
        if (!authorization.allowed || approvalReceipt.target !== `manifest:${manifestPath}` || !approvalReceipt.files.includes(manifestPath) || approvalReceipt.network.length > 0) throw new Error(authorization.allowed ? "approval receipt scope does not match the signing manifest" : authorization.reason);
      } catch (error) {
        reportPreflightError(opts.json, opts.quiet, "RECORD_SIGN_INPUT", error instanceof Error ? error.message : "approval receipt is invalid", "record signing failed");
        process.exit(78);
      }
    }
    process.exit(await executeRecordSign(manifestPath, signaturePath, opts.key, opts.signer, opts.issuer, opts.approve, opts.json, opts.quiet, approvalReceipt, new Date().toISOString(), process.env.VERGLOS_APPROVAL_STORE));
  });
record.command("attest <storeRoot> <manifestPath> <outputDirectory>")
  .description("Create keyless Sigstore DSSE evidence; uploads the in-toto statement to public Rekor")
  .requiredOption("--trusted-root <path>", "Out-of-band Sigstore trusted-root JSON file")
  .requiredOption("--identity <identity>", "Exact expected certificate identity (SAN)")
  .requiredOption("--issuer <issuer>", "Exact expected certificate issuer")
  .requiredOption("--identity-token-env <name>", "Environment variable containing the caller's OIDC identity token; its value is never printed or saved")
  .option("--publish-to-rekor", "Explicitly authorize public transparency-log upload (required)")
  .option("--approve", "Confirm keyless signing and public transparency-log submission")
  .option("--sign-approval-receipt <path>", "Exact, time-bounded sign approval receipt")
  .option("--network-approval-receipt <path>", `Exact, time-bounded network approval receipt for ${SIGSTORE_NETWORK_ORIGINS.join(", ")}`)
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (storeRoot: string, manifestPath: string, outputDirectory: string, opts: { trustedRoot: string; identity: string; issuer: string; identityTokenEnv: string; publishToRekor?: boolean; approve?: boolean; signApprovalReceipt?: string; networkApprovalReceipt?: string; json?: boolean; quiet?: boolean }) => {
    try {
      if (!opts.approve || !opts.publishToRekor) throw new Error("record attest requires --approve and --publish-to-rekor before reading credentials");
      if (!opts.signApprovalReceipt || !opts.networkApprovalReceipt) throw new Error("record attest requires both sign and network approval receipts before reading credentials");
      const signingApproval = await readApprovalReceiptFile(opts.signApprovalReceipt);
      const networkApproval = await readApprovalReceiptFile(opts.networkApprovalReceipt);
      process.exit(await executeRecordAttest({
        storeRoot, manifestPath, outputDirectory, trustedRootPath: opts.trustedRoot, identity: opts.identity, issuer: opts.issuer,
        identityTokenEnv: opts.identityTokenEnv, publishToRekor: opts.publishToRekor, approve: opts.approve,
        signingApproval, networkApproval, approvalStoreRoot: process.env.VERGLOS_APPROVAL_STORE,
        now: new Date().toISOString(), json: opts.json, quiet: opts.quiet,
      }));
    } catch (error) {
      reportPreflightError(opts.json, opts.quiet, "RECORD_SIGSTORE_INPUT", error instanceof Error ? error.message : "approval receipt is invalid", "Sigstore attestation failed");
      process.exit(78);
    }
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
      if (opts.json) console.log(JSON.stringify({ status: "error", code: "EVIDENCE_IMPORT_INPUT", message: "evidence import failed" }));
      else if (!opts.quiet) console.error(error instanceof Error ? error.message : "Evidence import failed.");
      process.exit(78);
    }
  });

const engines = program.command("engines").description("Inspect managed engine state");
engines.command("inspect <engineId>")
  .description("Inspect an explicitly selected system engine without PATH fallback")
  .requiredOption("--path <absolute>", "Absolute executable path to inspect")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress output")
  .action(async (engineId: string, opts: { path: string; json?: boolean; quiet?: boolean }) => {
    process.exit(await executeEngineInspection(engineId, opts.path, opts));
  });

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
  .action(async (engineId: string, version: string, artifactPath: string, opts: { digest: string; manifest?: string; manifestKey?: string; approve?: boolean; approvalReceipt?: string; json?: boolean; quiet?: boolean }) => { let approvalReceipt: ApprovalReceipt | undefined; if (opts.approve && opts.approvalReceipt) { try { approvalReceipt = await readApprovalReceiptFile(opts.approvalReceipt); } catch (error) { reportPreflightError(opts.json, opts.quiet, "ENGINE_INSTALL_INPUT", error instanceof Error ? error.message : "approval receipt is invalid", "engine installation failed"); process.exit(78); } } process.exit(await executeEngineInstall(engineId, version, artifactPath, opts.digest, { ...opts, approvalReceipt, approvalStoreRoot: process.env.VERGLOS_APPROVAL_STORE, manifestPath: opts.manifest, manifestPublicKeyPath: opts.manifestKey })); });

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
      let approvalReceipt: ApprovalReceipt | undefined; if (opts.approve && opts.approvalReceipt) { try { approvalReceipt = await readApprovalReceiptFile(opts.approvalReceipt); } catch (error) { reportPreflightError(opts.json, opts.quiet, "ENGINE_INSTALL_INPUT", error instanceof Error ? error.message : "approval receipt is invalid", "engine installation failed"); process.exit(78); } }
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
    if (!["repository", "package", "filesystem", "artifact", "sbom", "oci"].includes(kind)) {
      reportPreflightError(opts.json, opts.quiet, "TARGET_INSPECT_INPUT", `unsupported target kind: ${kind}`, "target inspection failed");
      process.exit(78);
    }
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
  .option("--snapshot <path>", "Write an opt-in canonical inspection snapshot without replacing existing files")
  .option("--producer <id>", "Select an inspection producer (repeatable: native, trivy, sarif, cyclonedx, spdx, provenance)", collectRepeated, [])
  .option("--import <path>", "Import bounded evidence into the inspection snapshot (repeatable; use - for stdin)", collectRepeated, [])
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
    "Do not send scan metadata (also toggled by VERGLOS_TELEMETRY=0)",
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
      snapshot?: string;
      producer: string[];
      import: string[];
      provenance?: boolean;
      verifySecrets?: boolean;
      hunt?: boolean;
      telemetry?: boolean;
    }) => {
      // Commander sets opts.provenance = false when --no-provenance is passed.
      const noProvenance = opts.provenance === false;
      const noTelemetry = opts.telemetry === false;
      const inspectionRequested = Boolean(opts.snapshot || opts.producer.length || opts.import.length);
      if (inspectionRequested && !opts.snapshot) {
        reportPreflightError(opts.json, opts.quiet, "SCAN_SNAPSHOT_INPUT", "--producer and --import require --snapshot", "inspection snapshot path is required");
        process.exit(78);
      }
      if (opts.watch && inspectionRequested) {
        reportPreflightError(opts.json, opts.quiet, "SCAN_SNAPSHOT_INPUT", "Snapshot inspection cannot be combined with watch mode.", "inspection snapshot options are incompatible with watch mode");
        process.exit(78);
      }
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
        snapshotPath: opts.snapshot,
        inspectionProducers: opts.producer,
        importPaths: opts.import,
      };
      const policyPath = opts.policyEvaluation ?? opts.policy;
      if (policyPath) {
        process.exit(await executePolicyCheck(policyPath, opts.json, opts.quiet));
      }
      if (opts.watch) {
        if (!opts.quiet && !opts.json) console.log(chalk.gray("Watching for changes... (Ctrl+C to stop)"));
        const initialExitCode = await runScanWithErrorBoundary(scanOptions, opts);
        if (initialExitCode !== 0) {
          process.exitCode = initialExitCode;
          return;
        }
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
          const exitCode = await runScanWithErrorBoundary(scanOptions, opts);
          if (exitCode !== 0) process.exitCode = exitCode;
        });
        return;
      }
      const exitCode = await runScanWithErrorBoundary(scanOptions, opts);
      if (exitCode !== 0) process.exitCode = exitCode;
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
    try {
      await executeScore(undefined, opts.strict, opts.quiet, opts.config, opts.json);
    } catch (error) {
      reportPreflightError(opts.json, opts.quiet, "SCORE_INPUT", error instanceof Error ? error.message : "score generation failed", "score generation failed");
      process.exit(2);
    }
  });

program
  .command("secrets")
  .description("Scan for secrets only")
  .option("-q, --quiet", "Suppress terminal output")
  .option("--json", "Emit machine-readable JSON")
  .option("--config <path>", "Use a bounded JSON Verglos config file")
  .option("--output <dir>", "Write HTML/JSON reports to a bounded output directory")
  .action(async (opts: { quiet?: boolean; json?: boolean; config?: string; output?: string }) => {
    const exitCode = await runScanWithErrorBoundary({ detectors: ["secrets"], focused: true, quiet: opts.quiet, json: opts.json, configPath: opts.config, outputDir: opts.output }, opts);
    if (exitCode !== 0) process.exitCode = exitCode;
  });

program
  .command("deps")
  .description("Dependency vulnerability audit only")
  .option("-q, --quiet", "Suppress terminal output")
  .option("--json", "Emit machine-readable JSON")
  .option("--config <path>", "Use a bounded JSON Verglos config file")
  .option("--output <dir>", "Write HTML/JSON reports to a bounded output directory")
  .action(async (opts: { quiet?: boolean; json?: boolean; config?: string; output?: string }) => {
    const exitCode = await runScanWithErrorBoundary({
      detectors: ["dependencies"],
      focused: true,
      includeGitHistory: false,
      quiet: opts.quiet,
      json: opts.json,
      configPath: opts.config,
      outputDir: opts.output,
    }, opts);
    if (exitCode !== 0) process.exitCode = exitCode;
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
    "Do not send scan metadata (also toggled by VERGLOS_TELEMETRY=0)",
  )
  .action(async (opts: { threshold: string; quiet?: boolean; json?: boolean; strict?: boolean; hunt?: boolean; telemetry?: boolean; policy?: string; policyEvaluation?: string; config?: string }) => {
    const policyPath = opts.policyEvaluation ?? opts.policy;
    if (policyPath) {
      process.exit(await executePolicyCheck(policyPath, opts.json, opts.quiet));
    }
    let code: number;
    let hasThreshold: boolean;
    try {
      const asPlan = process.env.VERGLOS_AS_PLAN;
      const plan = await currentPlan({ asPlan });
      hasThreshold = plan.plan !== "free";
      if (opts.hunt) {
        const ok = await requireCapability("ci.hunt_gate", "`verglos ci --hunt`", {
          asPlan,
          extraLine:
            "Verified-only CI gating ships in v2.0.0-beta. This alpha can still run standard CI.",
        });
        if (!ok) process.exit(1);
      }
      code = await executeCi({
        threshold: hasThreshold ? parseInt(opts.threshold, 10) : undefined,
        quiet: opts.quiet,
        json: opts.json,
        strict: opts.strict,
        configPath: opts.config,
        hunt: opts.hunt,
        noTelemetry: opts.telemetry === false,
      });
    } catch (error) {
      reportPreflightError(opts.json, opts.quiet, "CI_INPUT", error instanceof Error ? error.message : "CI scan failed", "CI scan failed");
      process.exit(2);
    }
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
  .option("--test-file <path>", "Select a .js/.cjs/.mjs test entrypoint; explicit execute approval required; runs with normal OS permissions (repeatable)", (value: string, previous: string[] = []) => [...previous, value], [])
  .option("--test-approval-receipt <path>", "Path to a separate execute receipt binding the exact workspace, test files, and content digests")
  .option("--rescan", "Run a local scan after applying the approved change")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (opts: { approve?: boolean; approvalReceipt?: string; dryRun?: boolean; testFile?: string[]; testApprovalReceipt?: string; rescan?: boolean; json?: boolean; quiet?: boolean }) => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const ok = await requireCapability("fix", "`verglos fix`", {
      asPlan,
      extraLine:
        "Your findings are still in verglos-report.html — auto-fix just needs Pro.",
    });
    if (!ok) process.exit(1);

    const plan = await planHeaderFixes(process.cwd());
    let testPlan: HeaderFixTestPlan | undefined;
    try {
      if (opts.testFile?.length) testPlan = await planHeaderFixTests(process.cwd(), opts.testFile);
      if (opts.testApprovalReceipt && !testPlan) throw new Error("a test approval receipt requires at least one selected test file");
    } catch (error) {
      reportPreflightError(opts.json, opts.quiet, "FIX_TEST_SELECTION_INVALID", error instanceof Error ? error.message : "selected test plan is invalid", "selected test plan is invalid");
      process.exit(78);
    }
    // A machine-readable non-approved invocation must emit only the stable
    // approval error below. The plan is emitted only for an explicit dry run
    // (or human-readable preflight), never as a second JSON document.
    if (opts.dryRun || (!opts.approve && !opts.json)) {
      if (opts.json) console.log(JSON.stringify({ planned: plan, ...(testPlan ? { testExecution: { action: "execute", target: testPlan.target, files: testPlan.files.map(({ path, sha256, size }) => ({ path, sha256, size })), policyEffect: testPlan.policyEffect, warning: "Selected test entrypoints and imported project code run with normal OS filesystem/process/network permissions; Node heap is capped per process, but execution is not sandboxed." } } : {}) }));
      else if (!opts.quiet) {
        if (plan.length === 0) console.log("No supported header change is planned.");
        else for (const item of plan) {
          console.log(`${item.action}: ${item.file}`);
          if (item.diff) console.log(item.diff);
          else for (const line of item.preview ?? []) console.log(line);
        }
        if (testPlan) {
          console.log("Selected post-fix test entrypoints (Node --test):");
          for (const file of testPlan.files) console.log(`  ${file.path}  sha256:${file.sha256}`);
          console.log(`  Execute approval policyEffect: ${testPlan.policyEffect}`);
          console.log("  Warning: selected tests and imported project code run with normal OS filesystem/process/network permissions; Node heap is capped per process, but execution is not sandboxed.");
        }
      }
    }
    if (opts.dryRun) return;
    if (!opts.approve) {
      reportPreflightError(opts.json, opts.quiet, "FIX_APPROVAL_REQUIRED", "verglos fix requires explicit approval (--approve) before changing files.", "fix requires explicit approval (--approve)");
      process.exit(78);
    }
    if (!opts.approvalReceipt) {
      reportPreflightError(opts.json, opts.quiet, "FIX_RECEIPT_REQUIRED", "verglos fix requires an approval receipt (--approval-receipt) before changing files.", "fix requires an approval receipt (--approval-receipt)");
      process.exit(78);
    }
    let testReceipt: ApprovalReceipt | undefined;
    if (testPlan) {
      if (!opts.testApprovalReceipt) {
        reportPreflightError(opts.json, opts.quiet, "FIX_TEST_APPROVAL_REQUIRED", "selected tests require a separate execute approval receipt (--test-approval-receipt)", "selected tests require a separate execute approval receipt");
        process.exit(78);
      }
      try {
        testReceipt = await readApprovalReceiptFile(opts.testApprovalReceipt);
        const testAuthorization = await authorizeHeaderFixTests(testReceipt, testPlan, new Date().toISOString(), process.cwd());
        if (!testAuthorization.allowed) throw new HeaderFixTestsError("approval-denied");
      } catch {
        reportPreflightError(opts.json, opts.quiet, "FIX_TEST_APPROVAL_DENIED", "selected test execution approval is invalid or does not match the exact workspace, file set, and content digests", "selected test execution approval denied");
        process.exit(78);
      }
      if (process.env.VERGLOS_APPROVAL_STORE) {
        try {
          await putApprovalReceipt(process.env.VERGLOS_APPROVAL_STORE, testReceipt);
        } catch {
          reportPreflightError(opts.json, opts.quiet, "FIX_TEST_APPROVAL_AUDIT_FAILED", "selected test approval could not be persisted to the configured audit store; no mutation or tests were run", "selected test approval audit persistence failed");
          process.exit(78);
        }
      }
    }
    let receipt: ApprovalReceipt;
    try { receipt = await readApprovalReceiptFile(opts.approvalReceipt); }
    catch (error) { reportPreflightError(opts.json, opts.quiet, "FIX_RECEIPT_INVALID", error instanceof Error ? error.message : "approval receipt is invalid", "approval receipt is invalid"); process.exit(78); }
    const plannedFiles = plan.filter((item) => item.action !== "skip").map((item) => item.file);
    const authorization = await authorizeHeaderFix(receipt!, plannedFiles, new Date().toISOString(), process.cwd());
    if (!authorization.allowed) {
      reportPreflightError(opts.json, opts.quiet, "FIX_APPROVAL_DENIED", `verglos fix approval denied: ${authorization.reason}`, "fix approval denied");
      process.exit(78);
    }

    const snapshots = opts.rescan || testPlan
      ? await captureHeaderFixSnapshots(process.cwd(), plan.filter((item) => item.action !== "skip").map((item) => item.file))
      : [];

    if (!opts.quiet && !opts.json) {
      console.log(chalk.bold("verglos fix") + chalk.gray(" · framework-aware header injection"));
      console.log("");
    }
    let fixed: number;
    try {
      fixed = await applyHeaderFixes(process.cwd(), { approvalReceipt: receipt, now: new Date().toISOString(), approvalStoreRoot: process.env.VERGLOS_APPROVAL_STORE, quiet: opts.quiet || opts.json });
    } catch (error) {
      reportPreflightError(opts.json, opts.quiet, "FIX_APPLY_FAILED", error instanceof Error ? error.message : "header fix failed", "header fix failed");
      if (opts.json || opts.quiet) process.exit(78);
      throw error;
    }
    if (!opts.quiet && !opts.json) console.log("");
    if (fixed > 0) {
      if (!opts.quiet && !opts.json) console.log(chalk.gray("Re-run `verglos scan` to see the updated score."));
      const checks: Array<{ phase: "tests" | "rescan"; run: () => Promise<unknown> }> = [];
      let testResult: HeaderFixTestResult | undefined;
      if (testPlan && testReceipt) {
        if (!opts.quiet && !opts.json) console.log(chalk.yellow("Running separately approved Node tests with normal OS filesystem/process/network permissions (not sandboxed; 120 second / 256 KiB output bounds; 256 MiB Node heap per process)..."));
        checks.push({ phase: "tests", run: async () => { testResult = await runApprovedHeaderFixTests(process.cwd(), testPlan!, testReceipt!); } });
      }
      if (opts.rescan) {
        if (!opts.quiet && !opts.json) console.log(chalk.gray("Running the requested post-fix rescan (telemetry disabled)..."));
        checks.push({ phase: "rescan", run: () => executeScan({ noTelemetry: true, quiet: true }) });
      }
      if (checks.length > 0) {
        try {
          // Machine-readable output remains one JSON document; verification is quiet.
          await verifyOrRollbackHeaderFix(snapshots, checks);
        } catch (error) {
          const rollbackSucceeded = error instanceof HeaderFixRollbackError && error.rollbackSucceeded;
          const phase = error instanceof HeaderFixRollbackError ? error.phase : error instanceof HeaderFixTestsError ? "tests" : "rescan";
          const code = !rollbackSucceeded ? "FIX_ROLLBACK_FAILED" : phase === "tests" ? "FIX_TESTS_FAILED" : "FIX_RESCAN_FAILED";
          const phaseName = phase === "tests" ? "selected tests" : "rescan";
          const humanMessage = rollbackSucceeded
            ? `Post-fix ${phaseName} failed; the approved mutation was rolled back.`
            : `Post-fix ${phaseName} failed and rollback could not be verified; inspect the affected files before proceeding.`;
          const machineMessage = rollbackSucceeded
            ? `post-fix ${phaseName} failed; mutation rolled back`
            : `post-fix ${phaseName} failed and rollback could not be verified`;
          reportPreflightError(opts.json, opts.quiet, code, humanMessage, machineMessage);
          if (opts.json || opts.quiet) process.exit(78);
          throw error;
        }
      }
      if (testResult && !opts.quiet && !opts.json) console.log(chalk.green(`Selected tests passed in ${testResult.durationMs} ms (${testResult.outputBytes} output bytes).`));
      if (opts.json) console.log(JSON.stringify({ planned: plan, fixed, tests: testResult ? { status: testResult.status, files: testPlan?.files.map((file) => file.path), durationMs: testResult.durationMs, outputBytes: testResult.outputBytes, outputTruncated: testResult.outputTruncated, executionNotice: "selected entrypoints and imported project code ran with normal OS filesystem/process/network permissions; per-process Node heap is capped, but no sandbox was applied" } : undefined, rescanned: Boolean(opts.rescan) }));
    } else if (opts.json) {
      console.log(JSON.stringify({ planned: plan, fixed, tests: undefined, rescanned: false }));
    }
  });

const huntCommand = program
  .command("hunt")
  .description("Verify findings in a local sandbox [Pro] (shell — v2.0.0-beta)")
  .option("--severity <level>", "Severity filter to hunt (default: critical,high)")
  .option("--sandbox <adapter>", "Sandbox adapter: auto, docker")
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

huntCommand
  .command("verify-recipe <recipePath>")
  .description("Verify a recipe against a caller-supplied local signed-feed trust store; does not execute it")
  .requiredOption("--trust-store <path>", "Local file containing trusted feed roots and signed feeds")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (recipePath: string, _opts: { trustStore: string; json?: boolean; quiet?: boolean }, command: Command) => {
    const opts = command.optsWithGlobals() as { trustStore: string; json?: boolean; quiet?: boolean };
    const code = await executeHuntRecipeVerification(recipePath, opts.trustStore, opts);
    process.exit(code);
  });

program
  .command("login")
  .description("Authenticate via a browser device-code flow")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress output")
  .action(async (opts: { json?: boolean; quiet?: boolean }) => {
    const code = await executeLogin(opts);
    if (code !== 0) process.exit(code);
  });

program
  .command("activate <licenseKey>")
  .description("Activate with a license key (validates against the server first)")
  .option(
    "--ci",
    "CI-friendly output: skip prompts, exit non-zero on failure",
  )
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (licenseKey: string, opts: { ci?: boolean; json?: boolean; quiet?: boolean }) => {
    const creds = await loadCredentials();
    const result = await validateLicense(licenseKey, creds.apiUrl);

    if (!result.valid) {
      if (opts.json) {
        console.log(JSON.stringify({ status: "error", reason: result.reason, ...(result.httpStatus === undefined ? {} : { httpStatus: result.httpStatus }) }));
        process.exit(opts.ci ? 2 : 1);
      }
      if (opts.quiet) process.exit(opts.ci ? 2 : 1);
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
    if (opts.json) {
      console.log(JSON.stringify({ status: "ok", plan: result.plan, expiresAt: result.expiresAt, active: result.active }));
      return;
    }
    if (opts.quiet) return;
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
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (opts: { json?: boolean; quiet?: boolean }) => {
    const code = await executeWhoami(opts);
    if (code !== 0) process.exit(code);
  });

program
  .command("badge")
  .description("Generate README badge markdown")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress output")
  .action(async (opts: { json?: boolean; quiet?: boolean }) => {
    try {
      const projectRoot = process.cwd();
      const { runScan } = await import("@verglos/scanner");
      const result = await runScan({ projectRoot, unlocked: true });
      const markdown = generateBadgeMarkdown(result.score.value);
      if (opts.json) console.log(JSON.stringify({ status: "ok", score: result.score.value, markdown }));
      else if (!opts.quiet) console.log(markdown);
    } catch (error) {
      if (opts.json) console.log(JSON.stringify({ status: "error", code: "BADGE_INPUT", message: "badge generation failed" }));
      else if (!opts.quiet) console.error(error instanceof Error ? error.message : "badge generation failed");
      process.exit(2);
    }
  });

program
  .command("hook")
  .description("Install pre-commit git hook")
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (opts: { json?: boolean; quiet?: boolean }) => {
    try {
      const installed = await installPreCommitHook(process.cwd());
      if (opts.json) console.log(JSON.stringify(installed ? { status: "ok", installed: true } : { status: "skipped", installed: false, reason: "not_a_git_repository" }));
      else if (!opts.quiet) {
        if (installed) {
          console.log(chalk.green("Pre-commit hook installed."));
          console.log(chalk.gray("  Bypass with `git commit --no-verify` if you need to override."));
        } else {
          console.log(chalk.gray("No Git repository found; pre-commit hook was not installed."));
        }
      }
    } catch (error) {
      if (opts.json) console.log(JSON.stringify({ status: "error", reason: "hook installation failed" }));
      else if (!opts.quiet) console.error(error instanceof Error ? error.message : "Pre-commit hook installation failed.");
      process.exit(1);
    }
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
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (opts: { email?: string; slack?: string; webhook?: string; label?: string; json?: boolean; quiet?: boolean }) => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const ok = await requireCapability(
      "monitor_register",
      "Continuous CVE monitoring",
      {
        asPlan,
        output: opts.json ? "json" : opts.quiet ? "quiet" : undefined,
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
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (opts: { json?: boolean; quiet?: boolean }) => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const ok = await requireCapability(
      "monitor_register",
      "Continuous CVE monitoring",
      { output: opts.json ? "json" : opts.quiet ? "quiet" : undefined },
    );
    if (!ok) process.exit(1);
    const code = await executeMonitorStatus(opts);
    if (code !== 0) process.exit(code);
  });

monitor
  .command("unregister")
  .description("Stop monitoring a project — no more alerts [Pro]")
  .option(
    "--project-fingerprint <fp>",
    "Fingerprint from `verglos monitor status` (defaults to the current project)",
  )
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (opts: { projectFingerprint?: string; json?: boolean; quiet?: boolean }) => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const ok = await requireCapability(
      "monitor_register",
      "Continuous CVE monitoring",
      { output: opts.json ? "json" : opts.quiet ? "quiet" : undefined },
    );
    if (!ok) process.exit(1);
    const code = await executeMonitorUnregister({
      projectFingerprint: opts.projectFingerprint,
      json: opts.json,
      quiet: opts.quiet,
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
  .option("--json", "Emit machine-readable JSON")
  .option("--quiet", "Suppress human output")
  .action(async (opts: { projectFingerprint?: string; json?: boolean; quiet?: boolean }) => {
    const asPlan = process.env.VERGLOS_AS_PLAN;
    const ok = await requireCapability(
      "monitor_register",
      "Continuous CVE monitoring",
      { output: opts.json ? "json" : opts.quiet ? "quiet" : undefined },
    );
    if (!ok) process.exit(1);
    const code = await executeMonitorTestAlert({
      projectFingerprint: opts.projectFingerprint,
      json: opts.json,
      quiet: opts.quiet,
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
  .option("--json", "Emit only the machine-readable MCP config (with --print-config)")
  .option("--quiet", "Suppress setup guidance (with --print-config)")
  .action(async (opts: { printConfig?: boolean; json?: boolean; quiet?: boolean }) => {
    if (opts.printConfig) {
      const config = {
        mcpServers: {
          verglos: {
            command: "npx",
            args: ["-y", "verglos", "mcp"],
          },
        },
      };
      console.log(JSON.stringify(config, null, opts.json ? 0 : 2));
      if (opts.json || opts.quiet) return;
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
      console.log(chalk.gray("  verglos_attest                  Deprecated compatibility shell — no signing/publication"));
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
  .description("Deprecated legacy shell; does not sign or publish (use `record create/sign/verify`)")
  .option("--report <path>", "Deprecated compatibility option; the path is validated but never read")
  .option("--sign", "Deprecated compatibility option; no signature is produced")
  .option("--verify-url <url>", "Deprecated compatibility option; no URL or summary is published")
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
  .option("--json", "Emit machine-readable JSON (requires --yes)")
  .option("--quiet", "Suppress output (requires --yes)")
  .action(async (opts: { yes?: boolean; json?: boolean; quiet?: boolean }) => {
    const code = await executeInit({ yes: opts.yes, json: opts.json, quiet: opts.quiet });
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

try {
  program.parse();
} catch (error) {
  if (!(error instanceof CommanderError)) throw error;
  if (error.code === "commander.helpDisplayed" || error.code === "commander.version") {
    process.exitCode = error.exitCode;
  } else {
    if (jsonRequested) console.log(JSON.stringify({ status: "error", code: "CLI_USAGE", message: "command-line arguments are invalid" }));
    else if (!quietRequested) console.error("Invalid command-line arguments. Run `verglos --help` for available commands.");
    process.exitCode = 2;
  }
}
