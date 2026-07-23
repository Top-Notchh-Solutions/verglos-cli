import { runScan } from "@verglos/scanner";
import type { Finding, RepoProvenance, ScanScore } from "@verglos/shared";

/**
 * verglos_scan MCP tool — full project scan wrapped for agent use.
 *
 * Runs the same scan as `verglos scan` (all detectors, provenance,
 * OSV, git history). Slower than check_before_write — use for
 * pre-PR review or on-demand agent queries, not per-line checks.
 *
 * Returns a summarized shape (score + counts + provenance headline
 * + top findings). The full findings list would blow up an MCP
 * response for large repos; the agent can call this tool with
 * `limit` set higher when it actually wants the full list.
 */

export interface ScanInput {
  projectRoot?: string;
  /** Cap on findings returned. Default 20; 0 = no cap. */
  limit?: number;
  /** Opt out of the provenance engine — same as `verglos scan --no-provenance`. */
  noProvenance?: boolean;
}

export interface ScanResultSummary {
  projectRoot: string;
  scannedAt: string;
  durationMs: number;
  score: ScanScore;
  provenance?: RepoProvenance;
  findingCount: number;
  findings: Finding[];
  truncated: boolean;
  headline: string;
}

function severityRank(sev: Finding["severity"]): number {
  switch (sev) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      return 0;
  }
}

function buildHeadline(
  score: ScanScore,
  provenance: RepoProvenance | undefined,
): string {
  const parts = [
    `Score ${score.value}/100 — ${score.counts.critical} critical, ${score.counts.high} high, ${score.counts.medium} medium.`,
  ];
  if (provenance && provenance.aiAuthoredPercent > 0) {
    if (provenance.densityRatio !== null) {
      parts.push(
        `${provenance.aiAuthoredPercent}% AI-authored; AI files carry ${provenance.densityRatio}× the finding density of human files.`,
      );
    } else {
      parts.push(
        `${provenance.aiAuthoredPercent}% AI-authored (density ratio hidden — not enough LOC per bucket).`,
      );
    }
    if (provenance.criticalsTotal > 0) {
      parts.push(
        `${provenance.criticalsInAIFiles} of ${provenance.criticalsTotal} criticals live in AI-authored files.`,
      );
    }
  }
  return parts.join(" ");
}

export async function scanProject(
  input: ScanInput,
): Promise<ScanResultSummary> {
  const projectRoot = input.projectRoot ?? process.cwd();
  const limit = input.limit ?? 20;
  const result = await runScan({
    projectRoot,
    unlocked: true,
    includeGitHistory: true,
    noProvenance: input.noProvenance,
  });

  const sorted = [...result.findings].sort(
    (a, b) => severityRank(b.severity) - severityRank(a.severity),
  );
  const capped = limit === 0 ? sorted : sorted.slice(0, limit);

  return {
    projectRoot: result.projectRoot,
    scannedAt: result.scannedAt,
    durationMs: result.durationMs,
    score: result.score,
    provenance: result.provenance,
    findingCount: result.findings.length,
    findings: capped,
    truncated: capped.length < result.findings.length,
    headline: buildHeadline(result.score, result.provenance),
  };
}
