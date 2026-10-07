import { constants } from "node:fs";
import { lstat, open } from "node:fs/promises";
import { ApprovalReceiptSchema, huntRecipeTrustPolicyDigest, parseHuntRecipe, parseHuntRecipeTrustPolicy, verifyHuntRecipe, type ApprovalReceipt, type ScanResult } from "@verglos/shared";
import { loadHuntRuntime, type HuntRuntimeLoader } from "./hunt-runtime.js";

const MAX_INPUT_BYTES = 8 * 1024 * 1024;
const MAX_FINDINGS = 10_000;
const MAX_FINDING_TEXT = 16 * 1024;

async function readJson(path: string, label: string): Promise<unknown> {
  if (!path || path.length > 4096 || /[\u0000-\u001f\u007f]/u.test(path)) throw new Error(`${label} path is invalid`);
  const before = await lstat(path);
  if (!before.isFile() || before.size > MAX_INPUT_BYTES) throw new Error(`${label} must be a bounded regular file`);
  const handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > MAX_INPUT_BYTES) throw new Error(`${label} must be a bounded regular file`);
    const bytes = await handle.readFile();
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)) as unknown;
  } catch {
    throw new Error(`${label} must contain valid bounded UTF-8 JSON`);
  } finally {
    await handle.close();
  }
}

function parseReport(value: unknown): ScanResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Hunt report is invalid");
  const report = value as Record<string, unknown>;
  if (typeof report.projectRoot !== "string" || report.projectRoot.length === 0 || report.projectRoot.length > 4096 || /[\u0000-\u001f\u007f]/u.test(report.projectRoot) || !Array.isArray(report.findings) || report.findings.length > MAX_FINDINGS) throw new Error("Hunt report is invalid");
  for (const finding of report.findings) {
    if (!finding || typeof finding !== "object" || Array.isArray(finding)) throw new Error("Hunt report contains an invalid finding");
    const item = finding as Record<string, unknown>;
    if (typeof item.id !== "string" || item.id.length === 0 || item.id.length > MAX_FINDING_TEXT || typeof item.severity !== "string" || item.severity.length > 64 || typeof item.title !== "string" || item.title.length > MAX_FINDING_TEXT || typeof item.description !== "string" || item.description.length > MAX_FINDING_TEXT) {
      throw new Error("Hunt report contains an invalid finding");
    }
  }
  return report as unknown as ScanResult;
}

export interface HuntRecipeExecutionInput {
  readonly reportPath: string;
  readonly recipePath: string;
  readonly trustStorePath: string;
  readonly approvalPath?: string;
  readonly approval?: ApprovalReceipt;
  readonly ruleId: string;
  readonly subjectId: string;
  readonly observationId: string;
  readonly findingId?: string;
  readonly runtimeLoader?: HuntRuntimeLoader;
}

export interface HuntRecipeExecutionResult {
  readonly code: number;
  readonly projection: Record<string, unknown>;
}

export async function runHuntRecipe(input: HuntRecipeExecutionInput): Promise<HuntRecipeExecutionResult> {
  try {
    const [reportValue, recipeValue, trustValue] = await Promise.all([
      readJson(input.reportPath, "Hunt report"),
      readJson(input.recipePath, "Hunt recipe"),
      readJson(input.trustStorePath, "Hunt trust store"),
    ]);
    const approvalValue = input.approval ?? (input.approvalPath ? await readJson(input.approvalPath, "Hunt approval") : undefined);
    if (!approvalValue) throw new Error("Hunt approval is missing");
    const report = parseReport(reportValue);
    const recipe = parseHuntRecipe(recipeValue);
    const trust = parseHuntRecipeTrustPolicy(trustValue);
    const approval = ApprovalReceiptSchema.parse(approvalValue);
    const executionAt = new Date().toISOString();
    const trustVerification = verifyHuntRecipe(recipe, trust, executionAt);
    if (!trustVerification.trusted) throw new Error(`recipe trust verification failed: ${trustVerification.reason}`);
    if (recipe.targetSubjectId !== input.subjectId || recipe.ruleId !== input.ruleId) throw new Error("recipe subject/rule does not match the requested execution binding");
    const runtime = await loadHuntRuntime(input.runtimeLoader);
    const supported = runtime.validateSupportedHuntRecipe(recipe);
    if (!supported.supported) throw new Error(`recipe is not in the supported A1 catalog (${supported.reason})`);
    const execution = { recipe, trust, approval, ruleId: input.ruleId, subjectId: input.subjectId, observationId: input.observationId, at: executionAt };
    const result = await runtime.runHunt(report, {
      adapter: new runtime.RestrictedProcessAdapter(recipe),
      sandbox: "restricted-process",
      findingId: input.findingId,
      execution,
      projectRoot: report.projectRoot,
    });
    const projection = {
      status: "completed",
      executionAuthorized: true,
      recipeId: recipe.recipeId,
      recipeDigest: supported.recipeDigest,
      trustPolicyDigest: huntRecipeTrustPolicyDigest(trust),
      recipeTrust: {
        verified: true,
        feedId: trustVerification.feedId,
        feedOrigin: trustVerification.origin,
        feedDigest: trustVerification.feedDigest,
        recipeDigest: trustVerification.recipeDigest,
        license: { id: trustVerification.license.licenseId, source: trustVerification.license.source, textDigest: trustVerification.license.textDigest },
        legalClearance: false,
        limitation: trustVerification.limitation,
      },
      sandbox: result.sandbox,
      outcomes: result.outcomes.map((outcome) => ({ findingId: outcome.findingId, verdict: outcome.verdict, canonicalVerdict: outcome.canonicalVerdict, reason: outcome.reason, durationMs: outcome.durationMs, evidenceDigest: outcome.evidenceDigest, executionStatus: outcome.executionStatus, assurance: outcome.assurance })),
    };
    return {
      code: projection.outcomes.some((outcome) => outcome.canonicalVerdict === "confirmed") ? 1 : 0,
      projection,
    };
  } catch {
    return { code: 78, projection: { status: "denied", reason: "hunt execution input or authorization is invalid" } };
  }
}

export async function executeHuntRecipe(
  input: HuntRecipeExecutionInput & { readonly json?: boolean; readonly quiet?: boolean },
): Promise<number> {
  const result = await runHuntRecipe(input);
  if (input.json) console.log(JSON.stringify(result.projection));
  else if (!input.quiet) {
    if (result.code === 0) console.log(`Hunt executed ${Array.isArray(result.projection.outcomes) ? result.projection.outcomes.length : 0} finding(s) with the fixed A1 recipe.`);
    else console.error("Hunt execution was not authorized or its bounded input was invalid.");
  }
  return result.code;
}
