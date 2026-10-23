import { constants } from "node:fs";
import { randomUUID } from "node:crypto";
import { lstat, open } from "node:fs/promises";
import { ApprovalReceiptSchema, bindHuntExecution, createHuntVerificationAttempt, huntRecipeTrustPolicyDigest, parseBoundedJson, parseHuntRecipe, parseHuntRecipeTrustPolicy, verifyHuntRecipe, type ApprovalReceipt, type ScanResult, type VerificationAttemptDocument } from "@verglos/shared";
import { loadHuntRuntime, type HuntRuntimeLoader, type HuntRuntimeOutcome } from "./hunt-runtime.js";

const MAX_INPUT_BYTES = 8 * 1024 * 1024;
const MAX_FINDINGS = 10_000;
const MAX_FINDING_TEXT = 16 * 1024;

export async function readHuntJson(path: string, label: string): Promise<unknown> {
  if (!path || path.length > 4096 || /[\u0000-\u001f\u007f]/u.test(path)) throw new Error(`${label} path is invalid`);
  const before = await lstat(path);
  if (!before.isFile() || before.size > MAX_INPUT_BYTES) throw new Error(`${label} must be a bounded regular file`);
  const handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > MAX_INPUT_BYTES) throw new Error(`${label} must be a bounded regular file`);
    const bytes = await handle.readFile();
    return parseBoundedJson(bytes, { limits: { maxBytes: MAX_INPUT_BYTES, maxDepth: 32, maxNodes: 100_000, maxObjectProperties: 100_000, maxArrayItems: 100_000 } });
  } catch {
    throw new Error(`${label} must contain valid bounded UTF-8 JSON`);
  } finally {
    await handle.close();
  }
}

export function parseHuntReport(value: unknown): ScanResult {
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
      readHuntJson(input.reportPath, "Hunt report"),
      readHuntJson(input.recipePath, "Hunt recipe"),
      readHuntJson(input.trustStorePath, "Hunt trust store"),
    ]);
    const approvalValue = input.approval ?? (input.approvalPath ? await readHuntJson(input.approvalPath, "Hunt approval") : undefined);
    if (!approvalValue) throw new Error("Hunt approval is missing");
    const report = parseHuntReport(reportValue);
    const recipe = parseHuntRecipe(recipeValue);
    const trust = parseHuntRecipeTrustPolicy(trustValue);
    const approval = ApprovalReceiptSchema.parse(approvalValue);
    const executionAt = new Date().toISOString();
    const trustVerification = verifyHuntRecipe(recipe, trust, executionAt);
    if (!trustVerification.trusted) throw new Error(`recipe trust verification failed: ${trustVerification.reason}`);
    if (recipe.targetSubjectId !== input.subjectId || recipe.ruleId !== input.ruleId) throw new Error("recipe subject/rule does not match the requested execution binding");
    const selectedFindings = report.findings.filter((finding) =>
      (finding.severity === "critical" || finding.severity === "high") && (!input.findingId || finding.id === input.findingId),
    );
    if (selectedFindings.length === 0) throw new Error("requested Hunt finding is absent or not eligible for execution");
    if (selectedFindings.some((finding) => finding.rule !== input.ruleId)) throw new Error("report finding rule does not match the requested execution binding");
    const runtime = await loadHuntRuntime(input.runtimeLoader);
    const supported = runtime.validateSupportedHuntRecipe(recipe);
    if (!supported.supported) throw new Error(`recipe is not in the supported bounded catalog (${supported.reason})`);
    const execution = { recipe, trust, approval, ruleId: input.ruleId, subjectId: input.subjectId, observationId: input.observationId, at: executionAt };
    const binding = bindHuntExecution(execution);
    const isContainerRecipe = recipe.isolation === "container";
    if (isContainerRecipe && `${recipe.imageDigest.algorithm}:${recipe.imageDigest.value}` !== runtime.HUNT_TARGET_HARNESS_IMAGE_DIGEST) throw new Error("target harness image digest is not the pinned public runtime image");
    const result = await runtime.runHunt(report, {
      adapter: isContainerRecipe
        ? new runtime.DockerSandboxAdapter({ image: runtime.HUNT_TARGET_HARNESS_IMAGE, imageDigest: runtime.HUNT_TARGET_HARNESS_IMAGE_DIGEST })
        : new runtime.RestrictedProcessAdapter(recipe),
      sandbox: isContainerRecipe ? "docker" : "restricted-process",
      findingId: input.findingId,
      execution,
      projectRoot: report.projectRoot,
    });
    const verificationAttempts = result.outcomes.map((outcome) => createExecutionAttempt({
      outcome,
      recipe,
      approval,
      trustPolicyDigest: binding.trustPolicyDigest,
      subjectId: input.subjectId,
      observationId: input.observationId,
      ruleId: input.ruleId,
      startedAt: result.startedAt,
      completedAt: result.completedAt,
      sandbox: result.sandbox,
    }));
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
      execution: {
        subjectId: input.subjectId,
        observationId: input.observationId,
        ruleId: input.ruleId,
        recipeDigest: binding.recipeDigest,
        trustPolicyDigest: binding.trustPolicyDigest,
        approvalRequestDigest: binding.approvalRequestDigest,
      },
      outcomes: result.outcomes.map((outcome, index) => ({ findingId: outcome.findingId, verdict: outcome.verdict, canonicalVerdict: outcome.canonicalVerdict, reason: outcome.reason, durationMs: outcome.durationMs, evidenceDigest: outcome.evidenceDigest, executionStatus: outcome.executionStatus, assurance: outcome.assurance, verificationAttemptId: verificationAttempts[index]?.attemptId })),
      verificationAttempts,
    };
    return {
      code: projection.outcomes.some((outcome) => outcome.canonicalVerdict === "confirmed") ? 1 : 0,
      projection,
    };
  } catch {
    return { code: 78, projection: { status: "denied", reason: "hunt execution input or authorization is invalid" } };
  }
}

function createExecutionAttempt(input: {
  readonly outcome: HuntRuntimeOutcome;
  readonly recipe: Parameters<typeof createHuntVerificationAttempt>[0]["recipe"];
  readonly approval: ApprovalReceipt;
  readonly trustPolicyDigest: string;
  readonly subjectId: string;
  readonly observationId: string;
  readonly ruleId: string;
  readonly startedAt: string;
  readonly completedAt: string;
  readonly sandbox: string;
}): VerificationAttemptDocument {
  const executed = input.outcome.reason !== "Hunt total duration expired before adapter execution";
  const runtime = input.sandbox === "docker"
    ? {
        isolation: "container" as const,
        runtime: "docker-container",
        runtimeDigest: input.recipe.imageDigest,
        filesystem: "ephemeral-write" as const,
        nonRoot: true,
        cleanup: "succeeded" as const,
      }
    : {
        isolation: "restricted-process" as const,
        runtime: "node-worker-thread",
        filesystem: "ephemeral-write" as const,
        nonRoot: process.getuid?.() !== 0,
        cleanup: executed ? "succeeded" as const : "not-started" as const,
      };
  const usage = {
    cpuMs: Math.min(input.outcome.usage?.cpuMs ?? 0, input.recipe.limits.cpuMs),
    peakMemoryBytes: Math.min(input.outcome.usage?.peakMemoryBytes ?? 0, input.recipe.limits.memoryMb * 1024 * 1024),
    diskBytes: Math.min(input.outcome.usage?.diskBytes ?? 0, input.recipe.limits.diskMb * 1024 * 1024),
    processes: Math.min(input.outcome.usage?.processes ?? 0, input.recipe.limits.processes),
    networkRequests: Math.min(input.outcome.usage?.networkRequests ?? 0, input.recipe.limits.maxNetworkRequests),
  };
  const limitations = [
    "The MCP/CLI execution projection is not a complete signed Release Record; attach the attempt to a complete record before release use.",
    ...(input.outcome.usage === undefined
      ? ["The selected Hunt adapter did not report all resource counters; unavailable counters are recorded as zero and must not be read as measured consumption."]
      : ["Network requests remain bounded by the recipe policy; adapter-specific disk and container counters may be unavailable."]),
  ];
  return createHuntVerificationAttempt({
    attemptId: `urn:uuid:${randomUUID()}`,
    subjectId: input.subjectId,
    observationId: input.observationId,
    findingId: input.outcome.findingId,
    ruleId: input.ruleId,
    recipe: input.recipe,
    trustPolicyDigest: input.trustPolicyDigest,
    approval: input.approval,
    runtime,
    startedAt: input.startedAt,
    completedAt: input.completedAt,
    usage,
    executed,
    outcome: {
      canonicalVerdict: input.outcome.canonicalVerdict,
      reason: input.outcome.reason,
      durationMs: input.outcome.durationMs,
      ...(input.outcome.evidenceDigest === undefined ? {} : { evidenceDigest: input.outcome.evidenceDigest }),
      ...(input.outcome.outputBytes === undefined ? {} : { outputBytes: input.outcome.outputBytes }),
    },
    limitations,
  });
}

export async function executeHuntRecipe(
  input: HuntRecipeExecutionInput & { readonly json?: boolean; readonly quiet?: boolean },
): Promise<number> {
  const result = await runHuntRecipe(input);
  if (input.json) console.log(JSON.stringify(result.projection));
  else if (!input.quiet) {
    if (result.code === 0) console.log(`Hunt executed ${Array.isArray(result.projection.outcomes) ? result.projection.outcomes.length : 0} finding(s) with the supported bounded recipe.`);
    else console.error("Hunt execution was not authorized or its bounded input was invalid.");
  }
  return result.code;
}
