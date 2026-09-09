import { TARGET_KINDS, type TargetKind } from "./target-resolver.js";

export type InspectProducer = "native" | "trivy" | "sarif" | "cyclonedx" | "spdx" | "provenance";
export type InspectPlanStep = Readonly<{ producer: InspectProducer; coverageClass: "native" | "external" | "imported"; executesTargetCode: false; network: "none"; timeoutMs: number }>;
export type InspectPlan = Readonly<{ targetKind: TargetKind; steps: readonly InspectPlanStep[] }>;

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
