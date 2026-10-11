import { z } from "zod";
import { TARGET_KINDS, type TargetKind } from "./target-resolver.js";
import { ToolRunDocumentSchema } from "./engine.js";

export type InspectProducer = "native" | "trivy" | "sarif" | "cyclonedx" | "spdx" | "provenance";
export type InspectPlanStep = Readonly<{ producer: InspectProducer; coverageClass: "native" | "external" | "imported"; executesTargetCode: false; network: "none"; timeoutMs: number }>;
export type InspectPlan = Readonly<{ targetKind: TargetKind; steps: readonly InspectPlanStep[] }>;

const DIGEST = /^sha256:[a-f0-9]{64}$/;
const InspectProducerCoverageBaseSchema = z.object({
  producer: z.enum(["native", "trivy", "sarif", "cyclonedx", "spdx", "provenance"]),
  state: z.enum(["complete", "incomplete", "not-provided", "failed"]),
  observationCount: z.number().int().min(0).max(20_000),
  runIds: z.array(z.string().min(1).max(128)).max(32),
  sourceDigests: z.array(z.string().regex(DIGEST)).max(32),
  limitations: z.array(z.string().min(1).max(512)).max(16),
}).strict();
const InspectProducerCoverageV11Schema = InspectProducerCoverageBaseSchema.extend({ toolRuns: z.array(ToolRunDocumentSchema).max(32) }).strict();
export const InspectProducerCoverageSchema = z.union([InspectProducerCoverageBaseSchema, InspectProducerCoverageV11Schema]);
const InspectCoverageCommonSchema = z.object({
  status: z.enum(["complete", "incomplete"]),
  target: z.object({ state: z.enum(["complete", "incomplete"]), limitations: z.array(z.string().min(1).max(512)).max(16) }).strict(),
});
export const InspectCoverageManifestSchema = z.discriminatedUnion("schemaVersion", [
  InspectCoverageCommonSchema.extend({ schemaVersion: z.literal("1.0.0"), producers: z.array(InspectProducerCoverageBaseSchema).min(1).max(8) }).strict(),
  InspectCoverageCommonSchema.extend({ schemaVersion: z.literal("1.1.0"), producers: z.array(InspectProducerCoverageV11Schema).min(1).max(8) }).strict(),
]).superRefine((manifest, context) => {
  const producerIds = manifest.producers.map((producer) => producer.producer);
  if (new Set(producerIds).size !== producerIds.length) context.addIssue({ code: z.ZodIssueCode.custom, path: ["producers"], message: "coverage producer IDs must be unique" });
  if (manifest.target.state === "incomplete" && manifest.target.limitations.length === 0) context.addIssue({ code: z.ZodIssueCode.custom, path: ["target", "limitations"], message: "incomplete target coverage requires a limitation" });
  manifest.producers.forEach((producer, index) => {
    if (producer.state !== "complete" && producer.limitations.length === 0) context.addIssue({ code: z.ZodIssueCode.custom, path: ["producers", index, "limitations"], message: "incomplete producer coverage requires a limitation" });
  });
  const complete = manifest.target.state === "complete" && manifest.target.limitations.length === 0 && manifest.producers.every((producer) => producer.state === "complete" && producer.limitations.length === 0);
  if ((manifest.status === "complete") !== complete) context.addIssue({ code: z.ZodIssueCode.custom, path: ["status"], message: "overall coverage state must match target and producer evidence" });
});
export type InspectProducerCoverage = z.infer<typeof InspectProducerCoverageSchema>;
export type InspectCoverageManifest = z.infer<typeof InspectCoverageManifestSchema>;

const ORDER: readonly InspectProducer[] = ["native", "trivy", "sarif", "cyclonedx", "spdx", "provenance"];
const CLASSES: Record<InspectProducer, InspectPlanStep["coverageClass"]> = { native: "native", trivy: "external", sarif: "imported", cyclonedx: "imported", spdx: "imported", provenance: "imported" };

export function planInspect(input: { targetKind: string; producers: readonly string[]; maxSteps?: number }): InspectPlan {
  if (!TARGET_KINDS.includes(input.targetKind as TargetKind)) throw new Error("unsupported inspect target kind");
  const maxSteps = input.maxSteps ?? 8;
  if (!Number.isInteger(maxSteps) || maxSteps < 1 || maxSteps > 8) throw new Error("inspect plan step bound is invalid");
  const producers = input.producers.map((producer) => {
    if (!ORDER.includes(producer as InspectProducer)) throw new Error(`unsupported inspect producer: ${producer}`);
    return producer as InspectProducer;
  });
  if (new Set(producers).size !== producers.length) throw new Error("inspect plan cannot repeat producers");
  if (producers.length > maxSteps) throw new Error("inspect plan exceeds the step bound");
  const steps = ORDER.filter((producer) => producers.includes(producer)).map((producer) => ({ producer, coverageClass: CLASSES[producer], executesTargetCode: false as const, network: "none" as const, timeoutMs: 30_000 }));
  return Object.freeze({ targetKind: input.targetKind as TargetKind, steps: Object.freeze(steps) });
}
