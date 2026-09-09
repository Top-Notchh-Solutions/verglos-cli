import { readFile } from "node:fs/promises";
import { diffReleaseSnapshots, type ReleaseSnapshot } from "@verglos/shared";

function parseSnapshot(value: string): ReleaseSnapshot {
  if (Buffer.byteLength(value, "utf8") > 32 * 1024 * 1024) throw new Error("snapshot exceeds the 32 MiB limit");
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || (parsed as { schemaVersion?: unknown }).schemaVersion !== "1.0.0") {
    throw new Error("snapshot must be a Verglos release snapshot with schemaVersion 1.0.0");
  }
  const snapshot = parsed as Record<string, unknown>;
  if (typeof snapshot.primarySubjectId !== "string" || !Array.isArray(snapshot.subjectIds) || !Array.isArray(snapshot.observations) || !snapshot.lineage || typeof snapshot.lineage !== "object" || typeof snapshot.policyInputDigest !== "string" || !/^sha256:[a-f0-9]{64}$/.test(snapshot.policyInputDigest)) throw new Error("snapshot structure is invalid");
  if (snapshot.observations.some((entry) => !entry || typeof entry !== "object" || !/^sha256:[a-f0-9]{64}$/.test(String((entry as Record<string, unknown>).fingerprint)))) throw new Error("snapshot observations are invalid");
  const lineage = snapshot.lineage as Record<string, unknown>; if (!Array.isArray(lineage.edges) || !Array.isArray(lineage.gaps)) throw new Error("snapshot lineage is invalid");
  return snapshot as unknown as ReleaseSnapshot;
}

export async function executeDiff(basePath: string, headPath: string, json = false): Promise<number> {
  try {
    const [baseRaw, headRaw] = await Promise.all([readFile(basePath, "utf8"), readFile(headPath, "utf8")]);
    const result = diffReleaseSnapshots(parseSnapshot(baseRaw), parseSnapshot(headRaw));
    if (json) console.log(JSON.stringify(result));
    else {
      console.log(`Added: ${result.added.length}`);
      console.log(`Fixed: ${result.fixed.length}`);
      console.log(`Unchanged: ${result.unchanged.length}`);
      if (result.identityChanged) console.log("Identity: changed");
      if (result.coverageChanged) console.log("Coverage: changed");
      if (result.policyChanged) console.log("Policy inputs: changed");
    }
    return result.identityChanged || result.coverageChanged ? 3 : result.added.length || result.fixed.length ? 1 : 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to diff release snapshots.";
    if (json) console.log(JSON.stringify({ status: "error", message })); else console.error(message);
    return 2;
  }
}
