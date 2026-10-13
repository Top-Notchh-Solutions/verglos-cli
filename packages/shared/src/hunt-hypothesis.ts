import { createHash } from "node:crypto";
import { z } from "zod";
import { canonicalizeJson, classifySchemaCompatibility, VERGLOS_SCHEMA_IDS, type SchemaDescriptor } from "./schema.js";
import { StableContractIdSchema } from "./engine.js";
import { HuntRuleIdSchema } from "./hunt-recipe.js";
import type { HuntCandidateSink, HuntTargetManifest, HuntTargetRoute } from "./hunt-target-manifest.js";
import { RelativeSubjectPathSchema, SubjectIdSchema } from "./subject.js";

export const HUNT_ATTACK_HYPOTHESIS_SCHEMA = {
  id: VERGLOS_SCHEMA_IDS.huntAttackHypothesis,
  version: "1.0.0",
} as const satisfies SchemaDescriptor;

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;
const SafeTextSchema = z.string().min(1).max(512).refine((value) => !CONTROL_CHARACTERS.test(value), "text contains control characters");
const DigestSchema = z.object({ algorithm: z.literal("sha256"), value: z.string().regex(/^[a-f0-9]{64}$/u) }).strict();

export const HuntPlaybookDescriptorSchema = z.object({
  recipeId: StableContractIdSchema,
  ruleId: HuntRuleIdSchema,
  adapter: z.enum(["restricted-process", "container", "gvisor", "microvm"]),
  command: z.array(z.string().min(1).max(4096).refine((value) => !CONTROL_CHARACTERS.test(value), "command contains control characters")).min(1).max(32).readonly(),
  assertions: z.array(SafeTextSchema).min(1).max(64).readonly(),
  requiredInputs: z.array(SafeTextSchema).max(32).readonly(),
  fixtures: z.array(z.object({ name: SafeTextSchema, expected: SafeTextSchema }).strict()).min(1).max(16).readonly(),
  imageDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/u).optional(),
}).strict();
export type HuntPlaybookDescriptor = z.infer<typeof HuntPlaybookDescriptorSchema>;

const FindingContextSchema = z.object({
  id: SafeTextSchema,
  ruleId: HuntRuleIdSchema,
  severity: z.enum(["critical", "high", "medium", "low", "info"]).optional(),
  location: RelativeSubjectPathSchema.optional(),
  line: z.number().int().positive().safe().optional(),
}).strict();

const TargetReferenceSchema = z.object({
  kind: z.enum(["framework", "entrypoint", "route", "api", "sink", "agent-tool", "dependency"]),
  value: SafeTextSchema,
  path: RelativeSubjectPathSchema.optional(),
  line: z.number().int().positive().safe().optional(),
}).strict();

const PlaybookProjectionSchema = z.object({
  registry: z.literal("public-bounded-catalog"),
  recipeId: StableContractIdSchema,
  ruleId: HuntRuleIdSchema,
  adapter: z.enum(["restricted-process", "container", "gvisor", "microvm"]),
  command: z.array(SafeTextSchema).min(1).max(32),
  assertions: z.array(SafeTextSchema).min(1).max(64),
  requiredInputs: z.array(SafeTextSchema).max(32),
  fixtures: z.array(z.object({ name: SafeTextSchema, expected: SafeTextSchema }).strict()).min(1).max(16),
  imageDigest: z.string().regex(/^sha256:[a-f0-9]{64}$/u).optional(),
  trustStatus: z.literal("signed-recipe-required"),
}).strict();

const ProposedInputSchema = z.object({
  name: SafeTextSchema,
  binding: z.enum(["target-context", "recipe-fixture"]),
  reference: SafeTextSchema,
}).strict();

const SequenceStepSchema = z.object({
  step: z.enum(["bind-finding", "select-playbook", "bind-target", "request-approval", "execute-worker"]),
  status: z.literal("not-run"),
  detail: SafeTextSchema,
}).strict();

export const HuntAttackHypothesisSchema = z.object({
  schemaId: z.literal(HUNT_ATTACK_HYPOTHESIS_SCHEMA.id),
  schemaVersion: z.literal(HUNT_ATTACK_HYPOTHESIS_SCHEMA.version),
  hypothesisDigest: DigestSchema,
  status: z.enum(["supported", "unsupported", "not_attemptable"]),
  reason: SafeTextSchema,
  targetSubjectId: SubjectIdSchema,
  finding: FindingContextSchema,
  playbook: PlaybookProjectionSchema.optional(),
  targetContext: z.object({
    coverage: z.enum(["complete", "incomplete"]),
    references: z.array(TargetReferenceSchema).max(64),
  }).strict(),
  proposedInputs: z.array(ProposedInputSchema).max(32),
  sequence: z.array(SequenceStepSchema).max(16),
  authority: z.object({
    requiredPlan: z.literal("pro"),
    recipeTrust: z.literal("required"),
    entitlement: z.literal("not-evaluated"),
    approval: z.literal("required"),
    execution: z.literal("not-run"),
  }).strict(),
  limitations: z.array(SafeTextSchema).max(32),
  executes: z.literal(false),
}).strict();

export type HuntAttackHypothesis = z.infer<typeof HuntAttackHypothesisSchema>;
export type HuntAttackFindingContext = z.infer<typeof FindingContextSchema>;

type ContextSignal = "any" | "route" | "api" | "sink:command-execution" | "sink:dynamic-code" | "sink:file-boundary" | "sink:network-request" | "sink:xss" | "agent-tool" | "dependency";

const RULE_CONTEXT_SIGNALS: Readonly<Record<string, readonly ContextSignal[]>> = {
  "hunt.a1.utf8-contains": ["any"],
  "hunt.a1.path-traversal": ["sink:file-boundary", "route"],
  "hunt.a1.command-injection": ["sink:command-execution", "route"],
  "hunt.a1.ssrf-target": ["sink:network-request", "route", "api"],
  "hunt.a1.tenant-boundary": ["route", "api"],
  "hunt.a1.sql-injection": ["route", "api"],
  "hunt.a1.xss-safe": ["sink:xss", "route"],
  "hunt.a1.agent-boundary": ["agent-tool"],
  "D1-001": ["route", "api", "sink:dynamic-code"],
  "D1-003": ["sink:command-execution", "route"],
  "D1-006": ["sink:file-boundary", "route"],
  "D9-002": ["sink:network-request", "route", "api"],
  "AGENT-001": ["agent-tool"],
  "D1-004": ["sink:xss", "route"],
  "D3-001": ["route", "api"],
  "D1-008": ["sink:dynamic-code", "dependency"],
  "D4-001": ["sink:network-request", "dependency"],
  "D6-001": ["dependency"],
};

export interface HuntAttackHypothesisInput {
  readonly manifest: HuntTargetManifest;
  readonly finding: HuntAttackFindingContext;
  readonly playbooks: readonly HuntPlaybookDescriptor[];
}

/**
 * Map an exact finding and static target context to a registered playbook.
 * This function only creates a declarative, execution-free hypothesis. It
 * never creates a recipe, trust decision, approval, shell command, or verdict.
 */
export function planHuntAttackHypothesis(input: HuntAttackHypothesisInput): HuntAttackHypothesis {
  const manifest = input.manifest;
  const finding = FindingContextSchema.parse(input.finding);
  const descriptors = input.playbooks.map((playbook) => HuntPlaybookDescriptorSchema.parse(playbook));
  const descriptor = descriptors.find((candidate) => candidate.ruleId === finding.ruleId);
  const references = collectTargetReferences(manifest);
  const requiredSignals = RULE_CONTEXT_SIGNALS[finding.ruleId] ?? [];
  const matchingReferences = references.filter((reference) => matchesSignal(reference, requiredSignals));
  const limitations = new Set<string>([
    "A registered catalog descriptor is not a signed recipe or execution approval.",
    "Static target candidates are not reachability or vulnerability proof.",
    "Entitlement, trust, approval, worker execution, proof, and counterexample were not evaluated or run.",
  ]);
  if (manifest.coverage.status === "incomplete") limitations.add("The target manifest is incomplete; refresh Scout coverage before execution.");

  let status: HuntAttackHypothesis["status"];
  let reason: string;
  if (!descriptor || requiredSignals.length === 0) {
    status = "unsupported";
    reason = "no registered playbook maps the exact finding rule";
  } else if (manifest.coverage.status !== "complete") {
    status = "not_attemptable";
    reason = "target manifest coverage is incomplete";
  } else if (matchingReferences.length === 0) {
    status = "not_attemptable";
    reason = "target manifest has no matching static capability for the registered playbook";
  } else {
    status = "supported";
    reason = "registered playbook and static target capability match the exact finding rule";
  }

  const playbook = descriptor ? projectPlaybook(descriptor) : undefined;
  const proposedInputs = descriptor
    ? descriptor.requiredInputs.map((name) => {
      const reference = matchingReferences[0];
      return {
        name,
        binding: reference ? "target-context" as const : "recipe-fixture" as const,
        reference: reference ? `${reference.kind}:${reference.value}` : "recipe-declared-fixture",
      };
    })
    : [];
  const unsigned = {
    schemaId: HUNT_ATTACK_HYPOTHESIS_SCHEMA.id,
    schemaVersion: HUNT_ATTACK_HYPOTHESIS_SCHEMA.version,
    status,
    reason,
    targetSubjectId: manifest.targetSubjectId,
    finding,
    ...(playbook === undefined ? {} : { playbook }),
    targetContext: { coverage: manifest.coverage.status, references: matchingReferences },
    proposedInputs,
    sequence: buildSequence(status, reason),
    authority: {
      requiredPlan: "pro" as const,
      recipeTrust: "required" as const,
      entitlement: "not-evaluated" as const,
      approval: "required" as const,
      execution: "not-run" as const,
    },
    limitations: [...limitations, ...manifest.coverage.limitations].sort(),
    executes: false as const,
  };
  const hypothesis = {
    ...unsigned,
    hypothesisDigest: { algorithm: "sha256" as const, value: createHash("sha256").update(canonicalizeJson(unsigned), "utf8").digest("hex") },
  };
  return freezeHypothesis(HuntAttackHypothesisSchema.parse(hypothesis));
}

export function parseHuntAttackHypothesis(value: unknown): HuntAttackHypothesis {
  const parsed = HuntAttackHypothesisSchema.safeParse(value);
  if (!parsed.success) throw new Error(`Invalid Hunt attack hypothesis: ${parsed.error.issues.map((issue) => issue.message).join("; ")}`);
  const compatibility = classifySchemaCompatibility(parsed.data.schemaVersion, HUNT_ATTACK_HYPOTHESIS_SCHEMA.version);
  if (compatibility === "upgrade-required" || compatibility === "incompatible") throw new Error(`Hunt attack hypothesis schema ${parsed.data.schemaVersion} requires an explicit reader upgrade or migration.`);
  return parsed.data;
}

function projectPlaybook(descriptor: HuntPlaybookDescriptor): HuntAttackHypothesis["playbook"] {
  return {
    registry: "public-bounded-catalog",
    recipeId: descriptor.recipeId,
    ruleId: descriptor.ruleId,
    adapter: descriptor.adapter,
    command: [...descriptor.command],
    assertions: [...descriptor.assertions],
    requiredInputs: [...descriptor.requiredInputs],
    fixtures: descriptor.fixtures.map((fixture) => ({ ...fixture })),
    ...(descriptor.imageDigest === undefined ? {} : { imageDigest: descriptor.imageDigest }),
    trustStatus: "signed-recipe-required",
  };
}

function buildSequence(status: HuntAttackHypothesis["status"], reason: string): HuntAttackHypothesis["sequence"] {
  const detail = status === "supported" ? "recorded for a later approved bounded run" : reason;
  return [
    { step: "bind-finding", status: "not-run", detail: "exact finding rule and target subject are recorded" },
    { step: "select-playbook", status: "not-run", detail },
    { step: "bind-target", status: "not-run", detail: "static manifest references only" },
    { step: "request-approval", status: "not-run", detail: "explicit human approval is required before execution" },
    { step: "execute-worker", status: "not-run", detail: "execution is never started by hypothesis planning" },
  ];
}

function collectTargetReferences(manifest: HuntTargetManifest): HuntAttackHypothesis["targetContext"]["references"] {
  const references: HuntAttackHypothesis["targetContext"]["references"] = [];
  const add = (reference: HuntAttackHypothesis["targetContext"]["references"][number]): void => {
    if (references.some((candidate) => JSON.stringify(candidate) === JSON.stringify(reference))) return;
    if (references.length < 64) references.push(reference);
  };
  for (const framework of manifest.frameworks) add({ kind: "framework", value: framework });
  for (const entrypoint of manifest.entrypoints) add({ kind: "entrypoint", value: entrypoint.name ?? entrypoint.kind, path: entrypoint.path });
  for (const route of manifest.routes) add(routeReference("route", route));
  for (const api of manifest.apis) add(routeReference("api", api));
  for (const sink of manifest.candidateSinks) add(sinkReference(sink));
  for (const tool of manifest.agentMcpTools) add({ kind: "agent-tool", value: tool });
  for (const dependency of manifest.dependencyBoundaries) add({ kind: "dependency", value: dependency });
  return references;
}

function routeReference(kind: "route" | "api", route: HuntTargetRoute): HuntAttackHypothesis["targetContext"]["references"][number] {
  return { kind, value: `${route.method} ${route.path}`, path: route.file };
}

function sinkReference(sink: HuntCandidateSink): HuntAttackHypothesis["targetContext"]["references"][number] {
  return { kind: "sink", value: sink.kind, path: sink.path, line: sink.line };
}

function matchesSignal(reference: HuntAttackHypothesis["targetContext"]["references"][number], signals: readonly ContextSignal[]): boolean {
  if (signals.includes("any")) return reference.kind === "entrypoint" || reference.kind === "framework";
  return signals.some((signal) => signal === reference.kind || signal === `sink:${reference.value}`);
}

function freezeHypothesis(value: HuntAttackHypothesis): HuntAttackHypothesis {
  return Object.freeze({
    ...value,
    hypothesisDigest: Object.freeze({ ...value.hypothesisDigest }),
    finding: Object.freeze({ ...value.finding }),
    ...(value.playbook === undefined ? {} : Object.freeze({ playbook: Object.freeze({ ...value.playbook, command: Object.freeze([...value.playbook.command]), assertions: Object.freeze([...value.playbook.assertions]), requiredInputs: Object.freeze([...value.playbook.requiredInputs]), fixtures: Object.freeze(value.playbook.fixtures.map((fixture) => Object.freeze({ ...fixture }))) }) })),
    targetContext: Object.freeze({ ...value.targetContext, references: Object.freeze(value.targetContext.references.map((reference) => Object.freeze({ ...reference }))) }),
    proposedInputs: Object.freeze(value.proposedInputs.map((input) => Object.freeze({ ...input }))),
    sequence: Object.freeze(value.sequence.map((step) => Object.freeze({ ...step }))),
    authority: Object.freeze({ ...value.authority }),
    limitations: Object.freeze([...value.limitations]),
  }) as HuntAttackHypothesis;
}
