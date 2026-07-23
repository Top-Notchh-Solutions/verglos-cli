/**
 * Plan definitions for Verglos billing tiers. Single source of truth —
 * the CLI, the entitlement server, and the pricing UI should all read
 * from here (or a translation of it). Do not duplicate limits inline.
 *
 * `null` on projects/seats means unlimited.
 */

export type PlanId = "free" | "pro" | "studio" | "compliance" | "founder";

export interface PlanLimits {
  id: PlanId;
  label: string;
  monthlyPriceUsd: number | null;
  annualPriceUsd: number | null;
  projects: number | null;
  seats: number | null;
  extraSeatUsd: number | null;
  scoreHistoryDays: number | null;
  status: "live" | "roadmap" | "internal";
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: {
    id: "free",
    label: "Free",
    monthlyPriceUsd: 0,
    annualPriceUsd: 0,
    projects: 1,
    seats: 1,
    extraSeatUsd: null,
    scoreHistoryDays: null,
    status: "live",
  },
  pro: {
    id: "pro",
    label: "Pro",
    monthlyPriceUsd: 29,
    annualPriceUsd: 290,
    projects: 5,
    seats: 2,
    extraSeatUsd: null,
    scoreHistoryDays: 30,
    status: "live",
  },
  studio: {
    id: "studio",
    label: "Studio",
    monthlyPriceUsd: 199,
    annualPriceUsd: 1990,
    projects: null,
    seats: 10,
    extraSeatUsd: 15,
    scoreHistoryDays: 365,
    status: "roadmap",
  },
  compliance: {
    id: "compliance",
    label: "Compliance",
    monthlyPriceUsd: 499,
    annualPriceUsd: 4990,
    projects: null,
    seats: 25,
    extraSeatUsd: 15,
    scoreHistoryDays: 1095,
    status: "roadmap",
  },
  founder: {
    // Internal — auto-issued to super-admin identities. Unlimited
    // everything, no billing. See lib/license.ts on the server side.
    id: "founder",
    label: "Founder",
    monthlyPriceUsd: null,
    annualPriceUsd: null,
    projects: null,
    seats: null,
    extraSeatUsd: null,
    scoreHistoryDays: null,
    status: "internal",
  },
};

export function getPlanLimits(id: string | undefined | null): PlanLimits {
  if (id && (id in PLAN_LIMITS)) return PLAN_LIMITS[id as PlanId];
  return PLAN_LIMITS.free;
}
