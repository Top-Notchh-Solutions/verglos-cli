import { lstat, readFile } from "node:fs/promises";
import { diffReleaseSnapshots, InspectCoverageManifestSchema, projectChangeActions, type AnyReleaseSnapshot } from "@verglos/shared";

function parseSnapshot(value: string): AnyReleaseSnapshot {
  if (Buffer.byteLength(value, "utf8") > 32 * 1024 * 1024) throw new Error("snapshot exceeds the 32 MiB limit");
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || !["1.0.0", "1.1.0"].includes(String((parsed as { schemaVersion?: unknown }).schemaVersion))) {
    throw new Error("snapshot must be a supported Verglos release snapshot");
  }
  const snapshot = parsed as Record<string, unknown>;
  if (!Array.isArray(snapshot.subjectIds) || !Array.isArray(snapshot.observations)) throw new Error("snapshot structure is invalid");
  if (snapshot.subjectIds.length > 1_000 || snapshot.observations.length > 20_000) throw new Error("snapshot exceeds subject or observation limits");
  if (typeof snapshot.primarySubjectId !== "string" || !snapshot.lineage || typeof snapshot.lineage !== "object" || typeof snapshot.policyInputDigest !== "string" || !/^sha256:[a-f0-9]{64}$/.test(snapshot.policyInputDigest)) throw new Error("snapshot structure is invalid");
  if (snapshot.observations.some((entry) => !entry || typeof entry !== "object" || !/^sha256:[a-f0-9]{64}$/.test(String((entry as Record<string, unknown>).fingerprint)))) throw new Error("snapshot observations are invalid");
  const lineage = snapshot.lineage as Record<string, unknown>; if (!Array.isArray(lineage.edges) || !Array.isArray(lineage.gaps)) throw new Error("snapshot lineage is invalid");
  if (snapshot.schemaVersion === "1.1.0") InspectCoverageManifestSchema.parse(snapshot.coverage);
  else if (snapshot.coverage !== undefined) throw new Error("legacy snapshot cannot contain a coverage manifest");
  return snapshot as unknown as AnyReleaseSnapshot;
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
    const result = diffReleaseSnapshots(parseSnapshot(baseRaw), parseSnapshot(headRaw));
    const actions = projectChangeActions(result);
    if (json) console.log(JSON.stringify({ ...result, actions }));
    else if (!quiet) {
      console.log(`Added: ${result.added.length}`);
      console.log(`Fixed: ${result.fixed.length}`);
      console.log(`Unchanged: ${result.unchanged.length}`);
      if (result.identityChanged) console.log("Identity: changed");
      if (result.coverageChanged) console.log("Coverage: changed");
      if (result.policyChanged) console.log("Policy inputs: changed");
      for (const nextAction of actions.nextActions) console.log(`Next: ${nextAction}`);
    }
    return result.identityChanged || result.coverageChanged ? 3 : result.added.length || result.fixed.length ? 1 : 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to diff release snapshots.";
    if (json) console.log(JSON.stringify({ status: "error", message: "snapshot diff failed" })); else if (!quiet) console.error(message);
    return 2;
  }
}
