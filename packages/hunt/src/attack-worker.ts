import {
  ApprovalReceiptSchema,
  bindHuntExecution,
  canonicalizeJson,
  parseHuntAttackHypothesis,
  parseHuntRecipe,
  parseHuntRecipeTrustPolicy,
  type HuntAttackHypothesis,
  type HuntExecutionBinding,
  type HuntRecipe,
  type HuntRecipeTrustPolicy,
  type ScanResult,
} from "@verglos/shared";
import { DockerSandboxAdapter } from "./docker-sandbox-adapter.js";
import { HUNT_TARGET_HARNESS_IMAGE, HUNT_TARGET_HARNESS_IMAGE_DIGEST } from "./target-harness.js";
import { RestrictedProcessAdapter } from "./restricted-process-adapter.js";
import { SUPPORTED_HUNT_RECIPE_CATALOG, validateSupportedHuntRecipe } from "./supported-recipe-catalog.js";
import type { HuntFindingOutcome } from "./types.js";
import { runHunt } from "./index.js";

const WORKER_PROOF_LIMITATION = "Worker output is a candidate Hunt result; independent proof/counterexample and approved remediation retest were not run by this worker.";

export interface HuntAttackWorkerInput {
  readonly hypothesis: unknown;
  readonly report: ScanResult;
  readonly recipe: unknown;
  readonly trust: unknown;
  readonly approval: unknown;
  readonly entitlement: "hunt.critical";
  readonly observationId: string;
  readonly at?: string;
}

export type HuntAttackWorkerOutcome = Readonly<Pick<HuntFindingOutcome, "findingId" | "verdict" | "canonicalVerdict" | "reason" | "durationMs" | "evidenceDigest" | "executionStatus" | "assurance">>;

export type HuntAttackWorkerResult = Readonly<{
  readonly status: "completed";
  readonly executes: true;
  readonly hypothesisDigest: HuntAttackHypothesis["hypothesisDigest"];
  readonly targetSubjectId: string;
  readonly findingId: string;
  readonly ruleId: string;
  readonly observationId: string;
  readonly execution: Readonly<Pick<HuntExecutionBinding, "recipeDigest" | "trustPolicyDigest" | "approvalRequestDigest">>;
  readonly sandbox: string;
  readonly outcome: HuntAttackWorkerOutcome;
  readonly proof: Readonly<{
    readonly status: "not-run";
    readonly negativeControl: "not-run";
    readonly limitation: string;
  }>;
}>;

/**
 * Execute one supported Attack-Hypothesis through the existing bounded Hunt
 * runtime. The hypothesis is only a declarative selector: execution still
 * requires the exact catalog recipe, signed trust store, usable approval, and
 * observation binding. No caller-provided command or payload is accepted.
 */
export async function runSupportedHuntAttack(input: HuntAttackWorkerInput): Promise<HuntAttackWorkerResult> {
  if (input.entitlement !== "hunt.critical") throw new Error("Hunt worker entitlement is unavailable");
  const hypothesis = parseHuntAttackHypothesis(input.hypothesis);
  if (hypothesis.status !== "supported" || hypothesis.playbook === undefined) throw new Error("Hunt hypothesis is not executable");
  const recipe = parseHuntRecipe(input.recipe);
  const trust = parseHuntRecipeTrustPolicy(input.trust);
  const approval = ApprovalReceiptSchema.parse(input.approval);
  const supported = validateSupportedHuntRecipe(recipe);
  if (!supported.supported) throw new Error(`recipe is not in the supported bounded catalog (${supported.reason})`);
  if (recipe.targetSubjectId !== hypothesis.targetSubjectId || recipe.ruleId !== hypothesis.finding.ruleId) throw new Error("recipe does not match the hypothesis subject and rule");
  if (!matchesPlaybookProjection(hypothesis.playbook, supported.descriptor)) throw new Error("recipe does not match the hypothesis playbook projection");

  const finding = input.report.findings.find((candidate) => candidate.id === hypothesis.finding.id);
  if (!finding) throw new Error("report does not contain the hypothesis finding");
  if ((finding.rule ?? finding.detector) !== hypothesis.finding.ruleId) throw new Error("report finding rule does not match the hypothesis");
  if (hypothesis.finding.location !== undefined && finding.file !== hypothesis.finding.location) throw new Error("report finding location does not match the hypothesis");
  if (hypothesis.finding.line !== undefined && finding.line !== hypothesis.finding.line) throw new Error("report finding line does not match the hypothesis");
  if (hypothesis.finding.severity !== undefined && finding.severity !== hypothesis.finding.severity) throw new Error("report finding severity does not match the hypothesis");

  const at = input.at ?? new Date().toISOString();
  const binding = bindHuntExecution({ recipe, trust, approval, ruleId: hypothesis.finding.ruleId, subjectId: hypothesis.targetSubjectId, observationId: input.observationId, at });
  const adapter = supported.descriptor.adapter === "restricted-process"
    ? new RestrictedProcessAdapter(recipe)
    : supported.descriptor.adapter === "container"
      ? new DockerSandboxAdapter({ image: HUNT_TARGET_HARNESS_IMAGE, imageDigest: HUNT_TARGET_HARNESS_IMAGE_DIGEST })
      : undefined;
  if (!adapter) throw new Error("supported Hunt adapter is unavailable");

  const result = await runHunt(input.report, {
    adapter,
    sandbox: adapter.id,
    findingId: finding.id,
    severity: [finding.severity],
    projectRoot: input.report.projectRoot,
    maxDurationMs: Math.min(recipe.limits.timeoutMs, recipe.limits.cpuMs),
    execution: { recipe, trust, approval, ruleId: hypothesis.finding.ruleId, subjectId: hypothesis.targetSubjectId, observationId: input.observationId, at },
  });
  const outcome = result.outcomes[0];
  if (!outcome) throw new Error("Hunt worker returned no outcome for the bound finding");
  return Object.freeze({
    status: "completed" as const,
    executes: true as const,
    hypothesisDigest: Object.freeze({ ...hypothesis.hypothesisDigest }),
    targetSubjectId: hypothesis.targetSubjectId,
    findingId: finding.id,
    ruleId: hypothesis.finding.ruleId,
    observationId: input.observationId,
    execution: Object.freeze({ recipeDigest: binding.recipeDigest, trustPolicyDigest: binding.trustPolicyDigest, approvalRequestDigest: binding.approvalRequestDigest }),
    sandbox: result.sandbox,
    outcome: projectOutcome(outcome),
    proof: Object.freeze({ status: "not-run" as const, negativeControl: "not-run" as const, limitation: WORKER_PROOF_LIMITATION }),
  });
}

function matchesPlaybookProjection(
  playbook: NonNullable<HuntAttackHypothesis["playbook"]>,
  descriptor: (typeof SUPPORTED_HUNT_RECIPE_CATALOG)[number],
): boolean {
  const projected = {
    registry: "public-bounded-catalog" as const,
    recipeId: descriptor.recipeId,
    ruleId: descriptor.ruleId,
    adapter: descriptor.adapter,
    command: [...descriptor.command],
    assertions: [...descriptor.assertions],
    requiredInputs: [...descriptor.requiredInputs],
    fixtures: descriptor.fixtures.map((fixture) => ({ ...fixture })),
    ...(!("imageDigest" in descriptor) || descriptor.imageDigest === undefined ? {} : { imageDigest: descriptor.imageDigest }),
    trustStatus: "signed-recipe-required" as const,
  };
  return canonicalizeJson(playbook) === canonicalizeJson(projected);
}

function projectOutcome(outcome: HuntFindingOutcome): HuntAttackWorkerOutcome {
  return Object.freeze({
    findingId: outcome.findingId,
    verdict: outcome.verdict,
    ...(outcome.canonicalVerdict === undefined ? {} : { canonicalVerdict: outcome.canonicalVerdict }),
    reason: outcome.reason,
    durationMs: outcome.durationMs,
    ...(outcome.evidenceDigest === undefined ? {} : { evidenceDigest: outcome.evidenceDigest }),
    ...(outcome.executionStatus === undefined ? {} : { executionStatus: outcome.executionStatus }),
    ...(outcome.assurance === undefined ? {} : { assurance: Object.freeze({ ...outcome.assurance }) }),
  });
}
