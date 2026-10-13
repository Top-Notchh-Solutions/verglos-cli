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
import type { HuntExecutionContext, HuntFindingOutcome } from "./types.js";
import { runHunt } from "./index.js";

const WORKER_PROOF_LIMITATION = "Worker output is a candidate Hunt result; independent proof/counterexample and approved remediation retest were not run by this worker.";
const A1_PROOF_LIMITATION = "Proof is bounded to a first-party A1 synthetic replay and deterministic negative control; it is not independent human review, target-code execution, or an approved remediation retest.";
const CONTAINER_PROOF_LIMITATION = "Container-backed proof/counterexample was not attempted: this bounded slice requires the pinned target runtime and independent fixture review before it can claim proof.";

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

export type HuntAttackProofResult = Readonly<{
  readonly status: "completed" | "not-attemptable";
  readonly executes: boolean;
  readonly hypothesisDigest: HuntAttackHypothesis["hypothesisDigest"];
  readonly targetSubjectId: string;
  readonly findingId: string;
  readonly ruleId: string;
  readonly observationId: string;
  readonly execution: Readonly<Pick<HuntExecutionBinding, "recipeDigest" | "trustPolicyDigest" | "approvalRequestDigest">>;
  readonly sandbox: string;
  readonly outcome?: HuntAttackWorkerOutcome;
  readonly counterexample?: HuntAttackWorkerOutcome;
  readonly proof: Readonly<{
    readonly status: "confirmed" | "not-reproduced" | "inconclusive" | "not-attemptable";
    readonly negativeControl: "passed" | "failed" | "not-run";
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
  const prepared = prepareSupportedHuntAttack(input);
  const result = await executePreparedAttack(prepared);
  const outcome = result.outcomes[0];
  if (!outcome) throw new Error("Hunt worker returned no outcome for the bound finding");
  return Object.freeze({
    status: "completed" as const,
    executes: true as const,
    hypothesisDigest: Object.freeze({ ...prepared.hypothesis.hypothesisDigest }),
    targetSubjectId: prepared.hypothesis.targetSubjectId,
    findingId: prepared.finding.id,
    ruleId: prepared.hypothesis.finding.ruleId,
    observationId: prepared.input.observationId,
    execution: projectExecution(prepared.binding),
    sandbox: result.sandbox,
    outcome: projectOutcome(outcome),
    proof: Object.freeze({ status: "not-run" as const, negativeControl: "not-run" as const, limitation: WORKER_PROOF_LIMITATION }),
  });
}

/**
 * Replay one supported A1 fixture and a fixed safe control through the same
 * signed execution binding. Container recipes intentionally remain explicit
 * not-attemptable until their target runtime and review evidence are ready.
 */
export async function runSupportedHuntProof(input: HuntAttackWorkerInput): Promise<HuntAttackProofResult> {
  const prepared = prepareSupportedHuntAttack(input);
  const base = {
    hypothesisDigest: Object.freeze({ ...prepared.hypothesis.hypothesisDigest }),
    targetSubjectId: prepared.hypothesis.targetSubjectId,
    findingId: prepared.finding.id,
    ruleId: prepared.hypothesis.finding.ruleId,
    observationId: prepared.input.observationId,
    execution: projectExecution(prepared.binding),
  } as const;
  if (prepared.supported.descriptor.adapter !== "restricted-process") {
    return Object.freeze({
      status: "not-attemptable" as const,
      executes: false,
      ...base,
      sandbox: "not-attemptable",
      proof: Object.freeze({ status: "not-attemptable" as const, negativeControl: "not-run" as const, limitation: CONTAINER_PROOF_LIMITATION }),
    });
  }

  const primaryResult = await executePreparedAttack(prepared);
  const primary = primaryResult.outcomes[0];
  if (!primary) throw new Error("Hunt proof returned no primary outcome for the bound finding");
  const counterexampleResult = await executePreparedAttack(prepared, deriveNegativeControlInputs(prepared.recipe));
  const counterexample = counterexampleResult.outcomes[0];
  if (!counterexample) throw new Error("Hunt proof returned no counterexample outcome for the bound finding");
  const projectedPrimary = projectOutcome(primary);
  const projectedCounterexample = projectOutcome(counterexample);
  const negativeControl = projectedCounterexample.canonicalVerdict === "not-reproduced" ? "passed" : "failed";
  const proofStatus = negativeControl !== "passed"
    ? "inconclusive"
    : projectedPrimary.canonicalVerdict === "confirmed"
      ? "confirmed"
      : projectedPrimary.canonicalVerdict === "not-reproduced"
        ? "not-reproduced"
        : "inconclusive";
  return Object.freeze({
    status: "completed" as const,
    executes: true as const,
    ...base,
    sandbox: primaryResult.sandbox,
    outcome: projectedPrimary,
    counterexample: projectedCounterexample,
    proof: Object.freeze({ status: proofStatus as "confirmed" | "not-reproduced" | "inconclusive", negativeControl, limitation: A1_PROOF_LIMITATION }),
  });
}

type PreparedHuntAttack = Readonly<{
  input: HuntAttackWorkerInput;
  hypothesis: HuntAttackHypothesis;
  recipe: HuntRecipe;
  trust: HuntRecipeTrustPolicy;
  approval: ReturnType<typeof ApprovalReceiptSchema.parse>;
  supported: Extract<ReturnType<typeof validateSupportedHuntRecipe>, { readonly supported: true }>;
  finding: ScanResult["findings"][number];
  binding: HuntExecutionBinding;
  execution: HuntExecutionContext;
}>;

function prepareSupportedHuntAttack(input: HuntAttackWorkerInput): PreparedHuntAttack {
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
  const execution: HuntExecutionContext = { recipe, trust, approval, ruleId: hypothesis.finding.ruleId, subjectId: hypothesis.targetSubjectId, observationId: input.observationId, at };
  return Object.freeze({ input, hypothesis, recipe, trust, approval, supported, finding, binding: bindHuntExecution(execution), execution });
}

async function executePreparedAttack(prepared: PreparedHuntAttack, inputs?: Readonly<Record<string, string>>): Promise<Awaited<ReturnType<typeof runHunt>>> {
  const adapter = prepared.supported.descriptor.adapter === "restricted-process"
    ? new RestrictedProcessAdapter(prepared.recipe, inputs === undefined ? {} : { inputs })
    : prepared.supported.descriptor.adapter === "container"
      ? new DockerSandboxAdapter({ image: HUNT_TARGET_HARNESS_IMAGE, imageDigest: HUNT_TARGET_HARNESS_IMAGE_DIGEST })
      : undefined;
  if (!adapter) throw new Error("supported Hunt adapter is unavailable");
  return runHunt(prepared.input.report, {
    adapter,
    sandbox: adapter.id,
    findingId: prepared.finding.id,
    severity: [prepared.finding.severity],
    projectRoot: prepared.input.report.projectRoot,
    maxDurationMs: Math.min(prepared.recipe.limits.timeoutMs, prepared.recipe.limits.cpuMs),
    execution: prepared.execution,
  });
}

function deriveNegativeControlInputs(recipe: HuntRecipe): Readonly<Record<string, string>> {
  const probe = recipe.command[1];
  switch (probe) {
    case "utf8-contains": {
      const needle = recipe.inputs?.needle ?? "";
      const value = [..."0123456789"].find((candidate) => !candidate.includes(needle));
      if (!value) throw new Error("A1 utf8 negative control could not be bounded");
      return Object.freeze({ needle, value });
    }
    case "path-traversal": return Object.freeze({ path: "safe/file.txt" });
    case "command-injection": return Object.freeze({ input: "safe-input" });
    case "ssrf-target": return Object.freeze({ url: "https://example.invalid/" });
    case "tenant-boundary": return Object.freeze({ authorizedTenant: "tenant-a", requestedTenant: "tenant-a" });
    case "sql-injection": return Object.freeze({ input: "SELECT id FROM records WHERE id = $1" });
    case "xss-safe": return Object.freeze({ html: "<p>safe text</p>" });
    case "agent-boundary": return Object.freeze({ allowlist: "read", tool: "read" });
    default: throw new Error("A1 negative control is unavailable for this probe");
  }
}

function projectExecution(binding: HuntExecutionBinding): Readonly<Pick<HuntExecutionBinding, "recipeDigest" | "trustPolicyDigest" | "approvalRequestDigest">> {
  return Object.freeze({ recipeDigest: binding.recipeDigest, trustPolicyDigest: binding.trustPolicyDigest, approvalRequestDigest: binding.approvalRequestDigest });
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
