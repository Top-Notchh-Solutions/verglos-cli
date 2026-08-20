export type PlanId = "free" | "pro" | "studio" | "enterprise";

export interface PlanCapability {
  label: string;
  tiers: Record<PlanId, string | boolean>;
}

export interface PlanMatrixEntry {
  id: PlanId;
  label: string;
  price: "$0" | "$29/mo" | "$199/mo" | "contact sales";
  paymentUrl: string | null;
}

export const PLAN_MATRIX: Record<PlanId, PlanMatrixEntry> = {
  free: {
    id: "free",
    label: "Free",
    price: "$0",
    paymentUrl: null,
  },
  pro: {
    id: "pro",
    label: "Pro",
    price: "$29/mo",
    paymentUrl: "https://verglos.com/checkout",
  },
  studio: {
    id: "studio",
    label: "Studio",
    price: "$199/mo",
    paymentUrl: "mailto:topnotchh.solutions@gmail.com?subject=Verglos%20Studio",
  },
  enterprise: {
    id: "enterprise",
    label: "Enterprise",
    price: "contact sales",
    paymentUrl: "mailto:support@verglos.com?subject=Enterprise",
  },
};

export const PLAN_CAPABILITIES: PlanCapability[] = [
  row("verglos scan (all detectors)", true, true, true, true),
  row("Provenance layer + slopsquat + typosquat", true, true, true, true),
  row("Local HTML + JSON report", true, true, true, true),
  row("MCP verglos_scan tool", true, true, true, true),
  row("verglos ci (block on any critical)", true, true, true, true),
  row("Pre-commit hook", true, true, true, true),
  row("verglos secrets / deps / score", true, true, true, true),
  row("verglos hunt on Critical + High", false, true, true, true),
  row("verglos hunt on Medium", false, false, true, true),
  row("MCP hunt tools", false, true, true, true),
  row("verglos fix", false, true, true, true),
  row("verglos ci --hunt", false, true, true, true),
  row("CI score threshold", false, true, true, true),
  row("Continuous CVE monitoring", false, true, true, true),
  row("verglos attest", false, false, true, true),
  row("Public verify URL", false, false, true, true),
  row("White-label report", false, false, true, true),
  row("Firecracker sandbox adapter", false, false, true, true),
  row("Agency dashboard", false, false, true, true),
  row("MCP verglos_attest", false, false, true, true),
  row("SSO / SCIM", false, false, false, true),
  row("Self-hosted verify chain", false, false, false, true),
  row("Audit log", false, false, false, true),
  row("Custom detector packs", false, false, false, true),
];

export interface PlanLimits {
  id: PlanId;
  label: string;
  monthlyPriceUsd: number | null;
  annualPriceUsd: number | null;
  projects: number | null;
  seats: number | null;
  extraSeatUsd: number | null;
  scoreHistoryDays: number | null;
  status: "live" | "roadmap";
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: limits("free", "Free", 0, 0, 1, 1, null, null, "live"),
  pro: limits("pro", "Pro", 29, 290, 5, 2, null, 30, "live"),
  studio: limits("studio", "Studio", 199, 1990, null, 10, 15, 365, "roadmap"),
  enterprise: limits("enterprise", "Enterprise", null, null, null, null, null, null, "roadmap"),
};

export function getPlanLimits(id: string | undefined | null): PlanLimits {
  if (id === "compliance") return PLAN_LIMITS.enterprise;
  if (id && (id in PLAN_LIMITS)) return PLAN_LIMITS[id as PlanId];
  return PLAN_LIMITS.free;
}

function row(
  label: string,
  free: string | boolean,
  pro: string | boolean,
  studio: string | boolean,
  enterprise: string | boolean,
): PlanCapability {
  return {
    label,
    tiers: { free, pro, studio, enterprise },
  };
}

function limits(
  id: PlanId,
  label: string,
  monthlyPriceUsd: number | null,
  annualPriceUsd: number | null,
  projects: number | null,
  seats: number | null,
  extraSeatUsd: number | null,
  scoreHistoryDays: number | null,
  status: "live" | "roadmap",
): PlanLimits {
  return {
    id,
    label,
    monthlyPriceUsd,
    annualPriceUsd,
    projects,
    seats,
    extraSeatUsd,
    scoreHistoryDays,
    status,
  };
}
