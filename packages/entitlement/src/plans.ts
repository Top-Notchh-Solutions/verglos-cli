export type PlanId = "free" | "pro" | "studio" | "enterprise";

export type CapabilityKey =
  | "scan.core"
  | "scan.mcp"
  | "scan.provenance"
  | "scan.slopsquat"
  | "scan.secrets"
  | "scan.deps"
  | "scan.git_history"
  | "report.local"
  | "ci.critical"
  | "hook.pre_commit"
  | "hunt.critical"
  | "hunt.high"
  | "hunt.mcp_finding"
  | "hunt.mcp_report"
  | "hunt.mcp_before_write"
  | "hunt.mcp_explain"
  | "fix.auto"
  | "ci.threshold"
  | "ci.hunt_gate"
  | "monitor.cve"
  | "hunt.medium"
  | "attest.sign"
  | "attest.verify_url"
  | "attest.white_label"
  | "sandbox.firecracker"
  | "dashboard.agency"
  | "mcp.attest"
  | "sso"
  | "verify.self_hosted"
  | "audit_log"
  | "custom_detectors";

const FREE_CAPS: CapabilityKey[] = [
  "scan.core",
  "scan.mcp",
  "scan.provenance",
  "scan.slopsquat",
  "scan.secrets",
  "scan.deps",
  "scan.git_history",
  "report.local",
  "ci.critical",
  "hook.pre_commit",
];

const PRO_ADDS: CapabilityKey[] = [
  "hunt.critical",
  "hunt.high",
  "hunt.mcp_finding",
  "hunt.mcp_report",
  "hunt.mcp_before_write",
  "hunt.mcp_explain",
  "fix.auto",
  "ci.threshold",
  "ci.hunt_gate",
  "monitor.cve",
];

const STUDIO_ADDS: CapabilityKey[] = [
  "hunt.medium",
  "attest.sign",
  "attest.verify_url",
  "attest.white_label",
  "sandbox.firecracker",
  "dashboard.agency",
  "mcp.attest",
];

const ENTERPRISE_ADDS: CapabilityKey[] = [
  "sso",
  "verify.self_hosted",
  "audit_log",
  "custom_detectors",
];

export const PLAN_CAPABILITIES: Record<PlanId, readonly CapabilityKey[]> = {
  free: FREE_CAPS,
  pro: [...FREE_CAPS, ...PRO_ADDS],
  studio: [...FREE_CAPS, ...PRO_ADDS, ...STUDIO_ADDS],
  enterprise: [...FREE_CAPS, ...PRO_ADDS, ...STUDIO_ADDS, ...ENTERPRISE_ADDS],
};

export function capabilitiesForPlan(plan: PlanId): CapabilityKey[] {
  return [...PLAN_CAPABILITIES[plan]];
}
