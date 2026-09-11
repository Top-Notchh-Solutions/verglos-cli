import type { ScanResult } from "@verglos/shared";
import { bindHuntExecution } from "@verglos/shared";
import type { HuntFindingOutcome, HuntOptions, HuntResult } from "./types.js";

export * from "./types.js";
export * from "./docker-adapter.js";
export * from "./docker-runner.js";

export async function runHunt(
  report: ScanResult,
  opts: HuntOptions = {},
): Promise<HuntResult> {
  const started = Date.now();
  const startedAt = new Date(started).toISOString();
  const projectRoot = opts.projectRoot ?? report.projectRoot;
  if (typeof projectRoot !== "string" || projectRoot.length === 0 || projectRoot.length > 4096) {
    throw new Error("Hunt project root must be a non-empty bounded path");
  }
  const maxDurationMs = opts.maxDurationMs ?? 30_000;
  if (!Number.isInteger(maxDurationMs) || maxDurationMs <= 0 || maxDurationMs > 600_000) {
    throw new Error("Hunt max duration must be between 1 and 600000 ms");
  }
  const severities = opts.severity ?? ["critical", "high"];
  const allowed = new Set(severities);
  const findings = report.findings.filter((finding) =>
    allowed.has(finding.severity) && (!opts.findingId || finding.id === opts.findingId),
  );
  if (opts.adapter && opts.dryRun) {
    throw new Error("Hunt dry run cannot execute a sandbox adapter");
  }
  if (opts.adapter && opts.sandbox && opts.sandbox !== "auto" && opts.sandbox !== opts.adapter.id) {
    throw new Error("Hunt sandbox selection does not match the configured adapter");
  }
  if (opts.adapter) {
    if (!opts.execution) throw new Error("Hunt adapter execution requires a recipe, trust policy, approval, and observation binding");
    const binding = bindHuntExecution(opts.execution);
    const outcomes: HuntFindingOutcome[] = [];
    let prepareAttempted = false;
    try {
      prepareAttempted = true;
      await opts.adapter.prepare();
      for (const finding of findings) {
        const elapsed = Date.now() - started;
        const remaining = maxDurationMs - elapsed;
        if (remaining <= 0) {
          outcomes.push({ findingId: finding.id, verdict: "not_attemptable", finding, reason: "Hunt total duration expired before adapter execution", durationMs: 0 });
          continue;
        }
        const before = Date.now();
        try {
          const outcome = await opts.adapter.execute({ finding, projectRoot, timeoutMs: remaining, binding });
          const validated = validateAdapterOutcome(outcome);
          if (!validated || validated.findingId !== finding.id) {
            outcomes.push({ findingId: finding.id, verdict: "not_attemptable", finding, reason: "Hunt adapter returned a mismatched finding identity", durationMs: Math.max(0, Date.now() - before) });
          } else {
            outcomes.push({ ...validated, finding, durationMs: Math.max(0, Date.now() - before) });
          }
        } catch (error) {
          outcomes.push({ findingId: finding.id, verdict: "not_attemptable", finding, reason: `Hunt adapter failed: ${error instanceof Error ? error.message : "unknown error"}`, durationMs: Math.max(0, Date.now() - before) });
        }
      }
    } finally {
      if (prepareAttempted) await opts.adapter.cleanup();
    }
    return { report, outcomes: freezeOutcomes(outcomes), startedAt, completedAt: new Date().toISOString(), sandbox: opts.adapter.id };
  }
  const reason = opts.dryRun
    ? "dry run: no probe or target code executed"
    : "no approved Hunt sandbox adapter is configured; execution was not attempted";
  const outcomes = findings.map((finding) => ({
    findingId: finding.id,
    verdict: "not_attemptable" as const,
    finding,
    reason,
    durationMs: 0,
  }));
  return {
    report,
    outcomes: freezeOutcomes(outcomes),
    startedAt,
    completedAt: new Date().toISOString(),
    sandbox: opts.sandbox ?? "none",
  };
}

function freezeOutcomes(outcomes: readonly HuntFindingOutcome[]): readonly HuntFindingOutcome[] {
  return Object.freeze(outcomes.map((outcome) => Object.freeze({ ...outcome })));
}

function validateAdapterOutcome(value: unknown): HuntFindingOutcome | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const outcome = value as Record<string, unknown>;
  if (typeof outcome.findingId !== "string" || outcome.findingId.length === 0 || outcome.findingId.length > 512 || /[\u0000-\u001f\u007f]/.test(outcome.findingId)) return undefined;
  if (outcome.verdict !== "true" && outcome.verdict !== "false" && outcome.verdict !== "not_attemptable") return undefined;
  if (typeof outcome.reason !== "string" || outcome.reason.length === 0 || outcome.reason.length > 4096 || /[\u0000-\u001f\u007f]/.test(outcome.reason)) return undefined;
  if (typeof outcome.durationMs !== "number" || !Number.isSafeInteger(outcome.durationMs) || outcome.durationMs < 0 || outcome.durationMs > 600_000) return undefined;
  if (outcome.evidencePath !== undefined && (typeof outcome.evidencePath !== "string" || outcome.evidencePath.length > 4096 || /[\u0000-\u001f\u007f]/.test(outcome.evidencePath))) return undefined;
  return {
    findingId: outcome.findingId,
    verdict: outcome.verdict,
    reason: outcome.reason,
    durationMs: outcome.durationMs,
    ...(outcome.evidencePath === undefined ? {} : { evidencePath: outcome.evidencePath }),
  } as HuntFindingOutcome;
}
