import { lstat, readFile } from "node:fs/promises";
import { diffReleaseSnapshots, parseReleaseSnapshot, projectChangeActions, type AnyReleaseSnapshot } from "@verglos/shared";

const MAX_DIFF_JSON_BYTES = 8 * 1024 * 1024;

function parseSnapshot(value: string): AnyReleaseSnapshot {
  if (Buffer.byteLength(value, "utf8") > 32 * 1024 * 1024) throw new Error("snapshot exceeds the 32 MiB limit");
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("snapshot structure is invalid");
  const candidate = parsed as Record<string, unknown>;
  if (Array.isArray(candidate.subjectIds) && candidate.subjectIds.length > 1_000) throw new Error("snapshot exceeds the subject limit");
  if (Array.isArray(candidate.observations) && candidate.observations.length > 20_000) throw new Error("snapshot exceeds the observation limit");
  return parseReleaseSnapshot(parsed) as AnyReleaseSnapshot;
}

async function readSnapshot(path: string): Promise<string> {
  const entry = await lstat(path);
  if (!entry.isFile()) throw new Error("snapshot input must be a regular file");
  if (entry.size > 32 * 1024 * 1024) throw new Error("snapshot exceeds the 32 MiB limit");
  const raw = await readFile(path, "utf8");
  if (Buffer.byteLength(raw, "utf8") > 32 * 1024 * 1024) throw new Error("snapshot exceeds the 32 MiB limit");
  return raw;
}

export async function executeDiff(basePath: string, headPath: string, json = false, quiet = false): Promise<number> {
  try {
    const [baseRaw, headRaw] = await Promise.all([readSnapshot(basePath), readSnapshot(headPath)]);
    const base = parseSnapshot(baseRaw);
    const head = parseSnapshot(headRaw);
    const result = diffReleaseSnapshots(base, head);
    const actions = projectChangeActions(result, base, head);
    if (json) {
      const output = JSON.stringify({ ...result, actions });
      if (Buffer.byteLength(output, "utf8") > MAX_DIFF_JSON_BYTES) throw new Error("snapshot diff output exceeds the 8 MiB limit");
      console.log(output);
    }
    else if (!quiet) {
      console.log(`Added: ${result.added.length}`);
      console.log(`Fixed: ${result.fixed.length}`);
      console.log(`Worsened: ${result.worsened.length}`);
      console.log(`Improved: ${result.improved.length}`);
      console.log(`Unchanged fingerprints: ${result.unchanged.length}`);
      console.log(`Severity unassessed: ${result.severityUnassessed.length}`);
      if (result.identityChanged) console.log("Identity: changed");
      if (result.coverageChanged) console.log(`Coverage: ${result.coverageDelta.before.status} → ${result.coverageDelta.after.status}`);
      if (result.policyChanged) console.log("Policy inputs: changed");
      if (result.lineageDelta.changed) console.log(`Lineage: +${result.lineageDelta.addedEdges.length} / -${result.lineageDelta.removedEdges.length} edges; ${result.lineageDelta.beforeGaps.length} → ${result.lineageDelta.afterGaps.length} gaps`);
      for (const blocker of result.comparisonBlockers) console.log(`Blocker: ${blocker.code} — ${blocker.reason}`);
      for (const change of actions.changes.filter((entry) => ["added", "fixed", "worsened", "improved"].includes(entry.status)).slice(0, 100)) {
        console.log(`Change ${change.status}: ${change.fingerprint}`);
        console.log(`  Severity: ${change.severity.assessment}${change.severity.before ? ` (${change.severity.before}` : ""}${change.severity.after ? `${change.severity.before ? " → " : " ("}${change.severity.after}` : ""}${change.severity.before || change.severity.after ? ")" : ""}`);
        console.log(`  Owner: ${change.owner.status}; ${change.owner.nextAction}`);
        if (change.remediation.length) console.log(`  Remediation: ${change.remediation.join("; ")}`);
        const evidence = change.evidence;
        if (evidence.status === "unavailable") console.log(`  Evidence: unavailable; ${evidence.reason}`);
        for (const item of evidence.observations.slice(0, 8)) {
          const rawReference = item.rawEvidenceDigest ? `${item.rawEvidenceDigest.algorithm}:${item.rawEvidenceDigest.value}` : "unavailable";
          const timestamp = item.timestamp.status === "available" ? `${item.timestamp.startedAt} → ${item.timestamp.completedAt}` : "unavailable";
          console.log(`  Evidence: ${item.attribution.producerId} ${item.attribution.ruleId}; raw reference ${rawReference}; confidence ${item.confidence.level}${item.confidence.score === undefined ? "" : ` (${item.confidence.score})`}/${item.confidence.method}; run ${timestamp}; engine ${item.engineHealth.state}`);
          if (item.limitations.length) console.log(`    Limitations: ${item.limitations.join(", ")}`);
        }
        const omitted = evidence.omittedObservationCount + Math.max(0, evidence.observations.length - 8);
        if (omitted || evidence.invalidObservationCount) console.log(`  Evidence bounds: ${omitted} omitted; ${evidence.invalidObservationCount} invalid observations`);
        console.log(`  Rescan: ${change.rescan.status}; ${change.rescan.reason}`);
        console.log(`  Hunt: ${change.huntEligibility.status}; ${change.huntEligibility.reason}`);
      }
      const rendered = actions.changes.filter((entry) => ["added", "fixed", "worsened"].includes(entry.status)).length;
      if (rendered > 100) console.log(`Additional change details omitted from terminal output: ${rendered - 100}; use --json for the full bounded projection.`);
      for (const nextAction of actions.nextActions) console.log(`Next: ${nextAction}`);
    }
    return result.identityChanged || result.coverageChanged || result.comparisonBlockers.length ? 3 : result.added.length || result.worsened.length ? 1 : 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to diff release snapshots.";
    if (json) console.log(JSON.stringify({ status: "error", message: "snapshot diff failed" })); else if (!quiet) console.error(message);
    return 2;
  }
}
