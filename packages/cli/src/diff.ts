import { readFile } from "node:fs/promises";
import { diffReleaseSnapshots, type ReleaseSnapshot } from "@verglos/shared";

function parseSnapshot(value: string): ReleaseSnapshot {
  const parsed: unknown = JSON.parse(value);
  if (!parsed || typeof parsed !== "object" || (parsed as { schemaVersion?: unknown }).schemaVersion !== "1.0.0") {
    throw new Error("snapshot must be a Verglos release snapshot with schemaVersion 1.0.0");
  }
  return parsed as ReleaseSnapshot;
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
    return 78;
  }
}
