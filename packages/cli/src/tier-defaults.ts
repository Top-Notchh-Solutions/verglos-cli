/**
 * Baked-in fallback capability map, per tier.
 *
 * When the CLI is offline AND the JWT license verify says the user is
 * on a paid tier AND there is no cached REST response, we fall back to
 * this map so paid users are not silently downgraded to Free. Online
 * callers always use the REST response — that is still the source of
 * truth and lets us change the fence server-side without a CLI
 * release.
 *
 * MIRROR of verglos-web/src/lib/entitlement/capabilities.ts. When you
 * change a tier's caps in either repo, mirror the change here in the
 * same commit or the offline-Pro path drifts from the online one.
 */

export type Tier = "free" | "pro" | "studio" | "enterprise" | "founder";

const FREE_CAPS = [
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
] as const;

const PRO_ADDS = [
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
] as const;

const STUDIO_ADDS = [
  "hunt.medium",
  "attest.sign",
  "attest.verify_url",
  "attest.white_label",
  "sandbox.firecracker",
  "dashboard.agency",
  "mcp.attest",
] as const;

const ENTERPRISE_ADDS = [
  "sso",
  "verify.self_hosted",
  "audit_log",
  "custom_detectors",
] as const;

const LEGACY_CLI_ALIASES = [
  "scan",
  "scan_ai_provenance",
  "scan_slopsquat",
  "scan_secrets_local",
  "scan_deps",
  "scan_git_history",
  "mcp_server",
  "pre_commit_hook",
  "html_json_report",
  "fix",
  "ci_threshold",
  "monitor_register",
  "audit_trail",
] as const;

export const TIER_CAPABILITIES: Record<Tier, readonly string[]> = {
  free: [...FREE_CAPS, ...LEGACY_CLI_ALIASES.slice(0, 9)],
  pro: [...FREE_CAPS, ...PRO_ADDS, ...LEGACY_CLI_ALIASES],
  studio: [...FREE_CAPS, ...PRO_ADDS, ...STUDIO_ADDS, ...LEGACY_CLI_ALIASES],
  enterprise: [
    ...FREE_CAPS,
    ...PRO_ADDS,
    ...STUDIO_ADDS,
    ...ENTERPRISE_ADDS,
    ...LEGACY_CLI_ALIASES,
  ],
  founder: [
    ...FREE_CAPS,
    ...PRO_ADDS,
    ...STUDIO_ADDS,
    ...ENTERPRISE_ADDS,
    ...LEGACY_CLI_ALIASES,
  ],
};

export function defaultCapabilitiesFor(tier: Tier): string[] {
  return [...TIER_CAPABILITIES[tier]];
}

const KNOWN_TIERS: ReadonlySet<Tier> = new Set([
  "free",
  "pro",
  "studio",
  "enterprise",
  "founder",
]);

export function normalizeTier(input: string | null | undefined): Tier {
  const s = (input ?? "free").toLowerCase();
  if (s === "compliance") return "enterprise";
  return KNOWN_TIERS.has(s as Tier) ? (s as Tier) : "free";
}
