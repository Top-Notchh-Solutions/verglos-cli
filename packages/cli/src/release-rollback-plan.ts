import { lstat, readFile } from "node:fs/promises";
import { decideReleaseRollback, type ReleaseReference } from "@verglos/shared";

const MAX_BYTES = 64 * 1024;
const MAX_REHEARSAL_OPERATIONS = 5;
const MAX_HISTORICAL_RECORDS = 1024;
const SAFE_ID = /^[A-Za-z0-9_.:-]{1,128}$/u;
const DIGEST = /^sha256:[a-f0-9]{64}$/u;
const REQUIRED_REHEARSAL_KINDS = new Set([
  "npm-package",
  "engine-manifest",
  "hunt-feed",
  "signing-identity",
  "web-deployment",
] as const);

type RollbackRehearsalOperation = Readonly<{
  id: string;
  current: ReleaseReference;
  target: ReleaseReference;
  replacement?: ReleaseReference;
  reason: string;
  approved: boolean;
}>;

type RollbackRehearsalManifest = Readonly<{
  operations: readonly RollbackRehearsalOperation[];
  historicalRecords: readonly Readonly<{ id: string; digest: string }>[];
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseReference(value: unknown): ReleaseReference {
  if (!isRecord(value)) throw new Error("rollback reference must be an object");
  return value as unknown as ReleaseReference;
}

function parseRehearsalManifest(value: unknown): RollbackRehearsalManifest {
  if (!isRecord(value) || !Array.isArray(value.operations) || value.operations.length !== MAX_REHEARSAL_OPERATIONS) {
    throw new Error("rollback rehearsal requires exactly five operations");
  }
  if (!Array.isArray(value.historicalRecords) || value.historicalRecords.length === 0 || value.historicalRecords.length > MAX_HISTORICAL_RECORDS) {
    throw new Error("rollback rehearsal requires bounded historical records");
  }
  const operationIds = new Set<string>();
  const operationKinds = new Set<string>();
  const operations = value.operations.map((raw) => {
    if (!isRecord(raw) || typeof raw.id !== "string" || !SAFE_ID.test(raw.id) || operationIds.has(raw.id)
      || typeof raw.reason !== "string" || typeof raw.approved !== "boolean") {
      throw new Error("rollback rehearsal operation is invalid");
    }
    operationIds.add(raw.id);
    const current = parseReference(raw.current);
    const target = parseReference(raw.target);
    if (!REQUIRED_REHEARSAL_KINDS.has(current.kind) || current.kind !== target.kind || operationKinds.has(current.kind)) {
      throw new Error("rollback rehearsal must contain one operation for each required boundary");
    }
    operationKinds.add(current.kind);
    return {
      id: raw.id,
      current,
      target,
      ...(raw.replacement === undefined ? {} : { replacement: parseReference(raw.replacement) }),
      reason: raw.reason,
      approved: raw.approved,
    } satisfies RollbackRehearsalOperation;
  });
  if (operationKinds.size !== REQUIRED_REHEARSAL_KINDS.size) {
    throw new Error("rollback rehearsal is missing a required boundary");
  }
  const recordIds = new Set<string>();
  const historicalRecords = value.historicalRecords.map((raw) => {
    if (!isRecord(raw) || typeof raw.id !== "string" || !SAFE_ID.test(raw.id) || recordIds.has(raw.id)
      || typeof raw.digest !== "string" || !DIGEST.test(raw.digest)) {
      throw new Error("historical record reference is invalid");
    }
    recordIds.add(raw.id);
    return Object.freeze({ id: raw.id, digest: raw.digest });
  });
  return Object.freeze({ operations: Object.freeze(operations), historicalRecords: Object.freeze(historicalRecords) });
}

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

/**
 * Rehearse every provider boundary locally without executing provider writes.
 * The manifest is deliberately fixture-shaped: it exercises the shared
 * decision contract and proves historical record references remain unchanged.
 */
export async function executeReleaseRollbackRehearsal(input: Readonly<{
  manifestPath: string;
  json?: boolean;
  quiet?: boolean;
}>): Promise<number> {
  try {
    const entry = await lstat(input.manifestPath);
    if (!entry.isFile() || entry.size > MAX_BYTES) throw new Error("rollback rehearsal manifest must be a bounded regular file");
    const manifest = parseRehearsalManifest(JSON.parse(await readFile(input.manifestPath, "utf8")));
    const historicalBefore = manifest.historicalRecords.map((record) => `${record.id}:${record.digest}`);
    const operations: Array<Record<string, unknown>> = [];
    for (const operation of manifest.operations) {
      const decision = decideReleaseRollback({
        current: operation.current,
        target: operation.target,
        replacementIdentity: operation.replacement,
        approved: operation.approved,
        reason: operation.reason,
        preserveHistoricalRecords: true,
      });
      if (!decision.allowed) {
        const report = { status: "failed", failedOperation: operation.id, reason: decision.reason, operations, historicalRecordsPreserved: true };
        if (input.json) console.log(JSON.stringify(report));
        else if (!input.quiet) console.error(`Rollback rehearsal denied: ${decision.reason}.`);
        return 78;
      }
      operations.push({ id: operation.id, kind: decision.kind, action: decision.action, target: decision.target.immutableRef });
    }
    const historicalAfter = manifest.historicalRecords.map((record) => `${record.id}:${record.digest}`);
    const historicalRecordsPreserved = JSON.stringify(historicalBefore) === JSON.stringify(historicalAfter);
    const report = { status: historicalRecordsPreserved ? "passed" : "failed", operationCount: operations.length, operations, historicalRecordCount: manifest.historicalRecords.length, historicalRecordsPreserved };
    if (input.json) console.log(JSON.stringify(report));
    else if (!input.quiet) console.log(historicalRecordsPreserved ? `Rollback rehearsal passed for ${operations.length} operations. Historical records preserved.` : "Rollback rehearsal failed: historical records changed.");
    return historicalRecordsPreserved ? 0 : 78;
  } catch {
    if (input.json) console.log(JSON.stringify({ status: "invalid-input", historicalRecordsPreserved: false }));
    else if (!input.quiet) console.error("Rollback rehearsal manifest is invalid.");
    return 78;
  }
}
