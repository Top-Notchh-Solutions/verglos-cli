export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type DetectorId =
  | "secrets"
  | "dependencies"
  | "misconfig"
  | "injection"
  | "git-history"
  | "ai-patterns"
  | "slopsquat"
  | "vendored-cves"
  | "agent-surface";

/**
 * The ten security domains, plus D11 (agent surface).
 * Every finding maps to exactly one.
 */
export type Domain =
  | "D1" // Input validation & injection
  | "D2" // Authentication & session
  | "D3" // Authorization & access control
  | "D4" // Cryptography (secrets, hashing, RNG)
  | "D5" // Security misconfiguration
  | "D6" // Dependency & supply chain
  | "D7" // API security
  | "D8" // Data exposure & privacy
  | "D9" // Infrastructure & runtime
  | "D10" // Monitoring & incident response
  | "D11"; // Agent surface (Pro+)

/**
 * Enum confidence.
 * Only `certain` and `high` findings affect the score.
 *
 * During the schema migration (follow-up) detectors still emit numeric
 * confidence; use {@link toConfidenceLevel} to coerce.
 */
export type ConfidenceLevel = "certain" | "high" | "medium" | "low";

export type ProvenanceBucket =
  | "ai-likely"
  | "mixed"
  | "human-likely"
  | "unknown";

export type ProvenanceConfidence = "high" | "medium" | "low";

/**
 * Per-finding provenance signal from the AI-authorship engine.
 * Optional today; populated once the provenance engine (follow-up) ships.
 */
export interface FindingProvenance {
  aiLikelihood: number; // 0..1
  bucket: ProvenanceBucket;
  signals: string[]; // human-readable, always shown
}

/**
 * Repo-level AI-authorship summary, including the density ratio and
 * AI-authored percentage.
 *
 * Guardrails on when the ratio may be printed live in the engine
 * (see packages/scanner/src/provenance): both buckets need ≥200
 * LOC and repo confidence ≥ medium, otherwise the reporter shows
 * the percentage alone. Never print a ratio from a 12-line sample.
 */
export interface RepoProvenance {
  aiAuthoredPercent: number; // by LOC, weighted by likelihood
  findingDensityAI: number; // findings per 1k LOC in ai-likely files
  findingDensityHuman: number;
  densityRatio: number | null; // null when guardrails aren't met
  criticalsInAIFiles: number;
  criticalsTotal: number;
  confidence: ProvenanceConfidence;
  method: string; // which signals fired — always disclosed
}

/**
 * Context tags produced by the post-detection tagging pass. When set,
 * the finding's `severity` has been downgraded (usually to `info`) and
 * `originalSeverity` holds what the detector originally said. The tag
 * itself tells the operator *why* — a Private-Key-PEM in `docs/` is
 * a doc example, not a leaked secret.
 *
 * Derived from Phase-0 corpus analysis of 87 open-source repos.
 */
export type ContextTag =
  | "docs"              // .md/.rst/CONTRIBUTING/README — example creds and code samples
  | "dev-fixture"       // .env.example, docker-compose.yml, docker/ — local dev creds
  | "ci-workflow"       // .github/workflows/, .depot/, .buildkite/ — service-container creds
  | "test-fixture"      // test/, __tests__/, cypress/, playwright/, *.test.*
  | "vendored-bundle"   // public/libraries/, vendor/, *.min.js, .yarn/releases/
  | "build-config"      // webpack.config.*, rspack.config.*, vite.config.* — dev-server CORS etc.
  | "generated"         // generated/, __generated__/, .generated.*, internal/types/generated/
  | "workspace-package" // slopsquat firing on a monorepo-internal @scope/pkg
  | "api-spec-example"; // openapi.yml / swagger.yml example bodies

export type ProjectType =
  | "nextjs"
  | "express"
  | "fastify"
  | "react"
  | "node"
  | "unknown";

export interface Finding {
  id: string;
  detector: DetectorId;
  /**
   * Stable rule ID like "D4-005" or "AI-002". Optional during the follow-up → follow-up
   * migration; will become required once every detector emits it.
   */
  rule?: string;
  /** Domain this finding belongs to. Optional during migration; required. */
  domain?: Domain;
  severity: Severity;
  context?: "production" | "test" | "placeholder" | "enum";
  title: string;
  description: string;
  /**
   * Plain-English "what an attacker does with this". Populated per rule from
   * the explain-bank (follow-up). Optional during migration.
   */
  why?: string;
  file?: string;
  line?: number;
  endLine?: number;
  column?: number;
  snippet?: string;
  fix?: string;
  cve?: string;
  package?: string;
  refs?: string[]; // CVE, CWE, OWASP, docs
  /**
   * During follow-up migration `confidence` accepts both the legacy 0..1 numeric
   * form and the target enum. Detectors are migrated one by one;
   * this union is removed then.
   */
  confidence: number | ConfidenceLevel;
  category: string;
  /** Populated by the provenance engine (follow-up). Optional forever — user may opt out. */
  provenance?: FindingProvenance;
  /**
   * Set when the post-detection context-tag pass downgraded this
   * finding. The report shows the tag so operators know *why*.
   */
  contextTag?: ContextTag;
  /**
   * Preserved raw severity from the detector, before the context-tag
   * pass downgraded it. Only set when contextTag is set.
   */
  originalSeverity?: Severity;
}

/**
 * Coerce legacy numeric confidence (0..1) to the target enum.
 * Bands chosen so existing detector output preserves its intent:
 *  ≥ 0.90 → certain, ≥ 0.70 → high, ≥ 0.50 → medium, else low.
 */
export function toConfidenceLevel(
  c: number | ConfidenceLevel,
): ConfidenceLevel {
  if (typeof c === "string") return c;
  if (c >= 0.9) return "certain";
  if (c >= 0.7) return "high";
  if (c >= 0.5) return "medium";
  return "low";
}

/**
 * Reverse of {@link toConfidenceLevel} for callers that still filter numerically
 * (currently only the scanner's minConfidence pass; follow-up removes it).
 */
export function toConfidenceNumeric(c: number | ConfidenceLevel): number {
  if (typeof c === "number") return c;
  switch (c) {
    case "certain":
      return 0.95;
    case "high":
      return 0.8;
    case "medium":
      return 0.6;
    case "low":
      return 0.3;
  }
}

export interface SeverityCounts {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
}

export interface ScanScore {
  value: number;
  riskLevel: "critical" | "high" | "medium" | "low" | "unsupported";
  counts: SeverityCounts;
  testFileFindings: {
    total: number;
    /**
     * True when --strict was on for this run and these findings did
     * contribute to the score. Consumers should render the message
     * accordingly ("included" vs "excluded"). Defaults to false.
     */
    included: boolean;
    note: string;
  };
  /**
   * Set when the scanner detected an unsupported-language repo
   * (few or no JS/TS files walked, no findings emitted). Consumers
   * should render "N/A — unsupported language" instead of a numeric
   * score to avoid falsely reporting `100/100` for Python/Ruby/Go
   * repos we don't have detectors for.
   */
  unsupportedLanguage?: {
    reason: string;
    jsTsFileCount: number;
  };
}

export interface ScanResult {
  projectRoot: string;
  projectType: ProjectType;
  scannedAt: string;
  durationMs: number;
  findings: Finding[];
  score: ScanScore;
  unlocked: boolean;
  /**
   * Repo-level AI-authorship summary from the provenance engine.
   * Optional so opting out via `--no-provenance` (follow-up) returns
   * undefined here without breaking downstream consumers.
   */
  provenance?: RepoProvenance;
}

export interface ScanOptions {
  projectRoot: string;
  detectors?: DetectorId[];
  unlocked?: boolean;
  includeGitHistory?: boolean;
  minConfidence?: number;
  strict?: boolean;
  /** Skip the AI-provenance engine (verglos scan --no-provenance). */
  noProvenance?: boolean;
  /**
   * Live-key verification (verglos scan --verify-secrets). When on,
   * matched AWS/GitHub/Stripe keys are actually hit against the
   * provider's API to prove they're live. Verified-live keys become
   * `certain` confidence + `critical` severity. Off by default —
   * scanning must never touch the network on the free path.
   */
  verifySecrets?: boolean;
}

export const DEFAULT_MIN_CONFIDENCE = 0.7;

/**
 * Per-severity penalty applied to the score per finding.
 * Matches design §5. Lowered from the old
 * {crit:20, high:10, med:5, low:2} to make the score less
 * cliff-y — combined with per-domain caps below, this prevents
 * pile-on findings from zeroing out.
 */
export const SEVERITY_WEIGHTS: Record<Severity, number> = {
  critical: 15,
  high: 6,
  medium: 2,
  low: 0.5,
  info: 0,
};

/**
 * Per-severity, per-domain cap on total penalty from that domain.
 * Thirty medium findings in the same domain shouldn't zero the
 * score — this is the fix for the v0.1.6 0/100 disaster where
 * repeated low-confidence findings in one domain crashed the score.
 */
export const DOMAIN_CAPS: Record<Exclude<Severity, "info">, number> = {
  critical: 40,
  high: 25,
  medium: 15,
  low: 5,
};

/**
 * Confidence bands that count toward the score.
 * Only `certain` and `high` findings affect the score.
 * Medium / low sit in a separate "worth a look" list and are
 * never counted — a tool that cries wolf is uninstalled in 90s.
 */
const SCORE_COUNTING_CONFIDENCE: readonly ConfidenceLevel[] = [
  "certain",
  "high",
];

export function countBySeverity(findings: Finding[]): SeverityCounts {
  const counts: SeverityCounts = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };
  for (const f of findings) {
    counts[f.severity]++;
  }
  return counts;
}

/**
 * Findings that don't yet emit a Domain  are bucketed
 * together so they still count against the score without any one
 * detector dominating. After every detector emits a domain (follow-up),
 * this bucket is empty.
 */
const UNKNOWN_DOMAIN = "__unknown__" as const;

export function calculateScore(findings: Finding[], strict = false): ScanScore {
  const testFindings = findings.filter((f) => f.context === "test");
  const scoreableFindings = findings.filter((f) => {
    if (f.context === "placeholder" || f.context === "enum") return false;
    if (!strict && f.context === "test") return false;
    // v1.6: findings tagged by the post-detection context-tag pass
    // (vendored bundles, generated code, docs, CI configs, dev-server
    // build configs, api-spec examples) don't count toward the score
    // in non-strict mode. The Finding is still visible in the report —
    // just info-tier — so posture doesn't tank over code the developer
    // didn't author. Strict mode counts them (same policy as the
    // existing `context: "test"` behavior). See
    // docs/plan/v1.6-noise-reduction.md and the Phase-0 ContextTag
    // corpus analysis for the rule set.
    if (!strict && f.contextTag) return false;
    return true;
  });

  const scoreableCounts = countBySeverity(scoreableFindings);
  const allInfoCount = findings.filter((f) => f.severity === "info").length;
  const counts: SeverityCounts = {
    ...scoreableCounts,
    info: allInfoCount,
  };

  // Only certain + high confidence findings actually penalize the score.
  const highConfidence = scoreableFindings.filter((f) =>
    SCORE_COUNTING_CONFIDENCE.includes(toConfidenceLevel(f.confidence)),
  );

  // Group by domain (UNKNOWN_DOMAIN when Finding.domain isn't set yet),
  // then per (domain, severity) sum weight * count clamped by the cap.
  const penaltyByDomainSeverity = new Map<string, Map<Severity, number>>();
  for (const f of highConfidence) {
    if (f.severity === "info") continue;
    const domainKey = f.domain ?? UNKNOWN_DOMAIN;
    let severityMap = penaltyByDomainSeverity.get(domainKey);
    if (!severityMap) {
      severityMap = new Map();
      penaltyByDomainSeverity.set(domainKey, severityMap);
    }
    const current = severityMap.get(f.severity) ?? 0;
    severityMap.set(f.severity, current + SEVERITY_WEIGHTS[f.severity]);
  }

  let penalty = 0;
  for (const severityMap of penaltyByDomainSeverity.values()) {
    for (const [severity, rawPenalty] of severityMap.entries()) {
      if (severity === "info") continue;
      const cap = DOMAIN_CAPS[severity as Exclude<Severity, "info">];
      penalty += Math.min(rawPenalty, cap);
    }
  }

  // v1.6 score floor: reserve the 0 score for genuinely critical-heavy
  // codebases. If there are zero criticals in scope, cap total penalty
  // at 90 (score floor of 10). Motivated by the ICP top 300 measurement
  // where 24 of 293 repos scored 0, including cases like
  // Team-Commonly-commonly (1 crit + 86 high → 0) and
  // hoangsonww-Claude-Code-Agent-Monitor (0 crit + 59 high → 16). The
  // second case is calibrated too aggressively and reads as
  // "catastrophic" when it isn't. See docs/plan/v1.6-noise-reduction.md.
  const NO_CRIT_PENALTY_CAP = 90;
  if (scoreableCounts.critical === 0) {
    penalty = Math.min(penalty, NO_CRIT_PENALTY_CAP);
  }

  const value = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  // Bands:
  // 90+ Strong · 70-89 Moderate · 50-69 Weak · <50 Critical Risk
  let riskLevel: ScanScore["riskLevel"];
  if (value < 50) riskLevel = "critical";
  else if (value < 70) riskLevel = "high";
  else if (value < 90) riskLevel = "medium";
  else riskLevel = "low";

  return {
    value,
    riskLevel,
    counts,
    testFileFindings: {
      total: testFindings.length,
      included: strict,
      note: strict
        ? "These findings are in test files and were included in the score under --strict."
        : "These findings are in test files and excluded from the score. Review manually to confirm they are test fixtures.",
    },
  };
}

export function riskLevelLabel(level: ScanScore["riskLevel"]): string {
  const labels: Record<ScanScore["riskLevel"], string> = {
    critical: "CRITICAL RISK",
    high: "HIGH RISK",
    medium: "MEDIUM RISK",
    low: "LOW RISK",
    unsupported: "UNSUPPORTED LANGUAGE",
  };
  return labels[level];
}
