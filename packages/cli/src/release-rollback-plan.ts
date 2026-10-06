import { lstat, readFile } from "node:fs/promises";
import { decideReleaseRollback, type ReleaseReference } from "@verglos/shared";

const MAX_BYTES = 64 * 1024;
async function readReference(path: string): Promise<ReleaseReference> {
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > MAX_BYTES) throw new Error("release reference must be a bounded regular file");
  const value: unknown = JSON.parse(await readFile(path, "utf8"));
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("release reference must be a JSON object");
  return value as ReleaseReference;
}

export async function executeReleaseRollbackPlan(input: Readonly<{
  currentPath: string;
  targetPath: string;
  replacementPath?: string;
  reason: string;
  approved: boolean;
  json?: boolean;
  quiet?: boolean;
}>): Promise<number> {
  try {
    const current = await readReference(input.currentPath);
    const target = await readReference(input.targetPath);
    const replacement = input.replacementPath ? await readReference(input.replacementPath) : undefined;
    const decision = decideReleaseRollback({ current, target, replacementIdentity: replacement, approved: input.approved, reason: input.reason, preserveHistoricalRecords: true });
    if (input.json) console.log(JSON.stringify(decision));
    else if (!input.quiet) console.log(decision.allowed ? `Rollback plan admitted: ${decision.action} ${decision.kind} → ${decision.target.immutableRef}. Historical records preserved.` : `Rollback plan denied: ${decision.reason}.`);
    return decision.allowed ? 0 : 78;
  } catch {
    if (input.json) console.log(JSON.stringify({ allowed: false, reason: "invalid-input" }));
    else if (!input.quiet) console.error("Rollback plan input is invalid.");
    return 78;
  }
}
