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

export type Tier = "free" | "pro" | "studio" | "compliance" | "founder";

const FREE_CAPS = [
  "scan",
  "scan_ai_provenance",
  "scan_slopsquat",
  "scan_secrets_local",
  "scan_deps",
  "scan_git_history",
  "mcp_server",
  "pre_commit_hook",
  "html_json_report",
] as const;

const PRO_ADDS = [
  "fix",
  "ci_threshold",
  "monitor_register",
  "monitor_daily",
  "channel_email",
  "channel_slack",
  "channel_webhook",
  "rule_pack_agent_surface",
  "rule_pack_api_hardening",
  "rule_pack_deep_auth",
  "score_history_30d",
] as const;

const STUDIO_ADDS = [
  "attest",
  "verify_url",
  "white_label_report",
  "sbom_export",
  "license_risk",
  "rotate",
  "score_history_365d",
] as const;

const COMPLIANCE_ADDS = [
  "soc2_report",
  "gdpr_map",
  "posture_pdf",
  "evidence_archive",
  "audit_trail",
  "ai_triage_credits",
  "threat_intel",
  "score_history_1095d",
] as const;

export const TIER_CAPABILITIES: Record<Tier, readonly string[]> = {
  free: FREE_CAPS,
  pro: [...FREE_CAPS, ...PRO_ADDS],
  studio: [...FREE_CAPS, ...PRO_ADDS, ...STUDIO_ADDS],
  compliance: [...FREE_CAPS, ...PRO_ADDS, ...STUDIO_ADDS, ...COMPLIANCE_ADDS],
  founder: [
    ...FREE_CAPS,
    ...PRO_ADDS,
    ...STUDIO_ADDS,
    ...COMPLIANCE_ADDS,
  ],
};

export function defaultCapabilitiesFor(tier: Tier): string[] {
  return [...TIER_CAPABILITIES[tier]];
}

const KNOWN_TIERS: ReadonlySet<Tier> = new Set([
  "free",
  "pro",
  "studio",
  "compliance",
  "founder",
]);

export function normalizeTier(input: string | null | undefined): Tier {
  const s = (input ?? "free").toLowerCase();
  return KNOWN_TIERS.has(s as Tier) ? (s as Tier) : "free";
}
