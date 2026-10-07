import { constants } from "node:fs";
import { lstat, open } from "node:fs/promises";
import { ApprovalReceiptSchema, parseHuntRecipe, parseHuntRecipeTrustPolicy, type ScanResult } from "@verglos/shared";
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

export async function executeHuntRecipe(
  input: { readonly reportPath: string; readonly recipePath: string; readonly trustStorePath: string; readonly approvalPath: string; readonly ruleId: string; readonly subjectId: string; readonly observationId: string; readonly findingId?: string; readonly json?: boolean; readonly quiet?: boolean; readonly runtimeLoader?: HuntRuntimeLoader },
): Promise<number> {
  try {
    const [reportValue, recipeValue, trustValue, approvalValue] = await Promise.all([
      readJson(input.reportPath, "Hunt report"),
      readJson(input.recipePath, "Hunt recipe"),
      readJson(input.trustStorePath, "Hunt trust store"),
      readJson(input.approvalPath, "Hunt approval"),
    ]);
    const report = parseReport(reportValue);
    const recipe = parseHuntRecipe(recipeValue);
    const runtime = await loadHuntRuntime(input.runtimeLoader);
    const supported = runtime.validateSupportedHuntRecipe(recipe);
    if (!supported.supported) throw new Error(`recipe is not in the supported A1 catalog (${supported.reason})`);
    const trust = parseHuntRecipeTrustPolicy(trustValue);
    const approval = ApprovalReceiptSchema.parse(approvalValue);
    const execution = { recipe, trust, approval, ruleId: input.ruleId, subjectId: input.subjectId, observationId: input.observationId, at: new Date().toISOString() };
    if (recipe.targetSubjectId !== input.subjectId || recipe.ruleId !== input.ruleId) throw new Error("recipe subject/rule does not match the requested execution binding");
    const result = await runtime.runHunt(report, {
      adapter: new runtime.RestrictedProcessAdapter(recipe),
      sandbox: "restricted-process",
      findingId: input.findingId,
      execution,
      projectRoot: report.projectRoot,
    });
    const projection = {
      status: "completed",
      recipeId: recipe.recipeId,
      recipeDigest: supported.recipeDigest,
      sandbox: result.sandbox,
      outcomes: result.outcomes.map((outcome) => ({ findingId: outcome.findingId, verdict: outcome.verdict, canonicalVerdict: outcome.canonicalVerdict, reason: outcome.reason, durationMs: outcome.durationMs, evidenceDigest: outcome.evidenceDigest, executionStatus: outcome.executionStatus, assurance: outcome.assurance })),
    };
    if (input.json) console.log(JSON.stringify(projection));
    else if (!input.quiet) console.log(`Hunt executed ${projection.outcomes.length} finding(s) with the fixed A1 ${recipe.recipeId} recipe.`);
    return projection.outcomes.some((outcome) => outcome.canonicalVerdict === "confirmed") ? 1 : 0;
  } catch {
    if (input.json) console.log(JSON.stringify({ status: "denied", reason: "hunt execution input or authorization is invalid" }));
    else if (!input.quiet) console.error("Hunt execution was not authorized or its bounded input was invalid.");
    return 78;
  }
}
