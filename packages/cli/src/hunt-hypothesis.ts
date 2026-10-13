import { constants } from "node:fs";
import { lstat, open } from "node:fs/promises";
import {
  HuntRuleIdSchema,
  RelativeSubjectPathSchema,
  parseBoundedJson,
  parseHuntTargetManifest,
  type HuntAttackFindingContext,
} from "@verglos/shared";
import { loadHuntRuntime, type HuntRuntimeLoader } from "./hunt-runtime.js";

const MAX_INPUT_BYTES = 4 * 1024 * 1024;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;
const SEVERITIES = new Set(["critical", "high", "medium", "low", "info"]);

export interface HuntHypothesisInput {
  readonly manifestPath: string;
  readonly findingId: string;
  readonly ruleId: string;
  readonly subjectId: string;
  readonly location?: string;
  readonly line?: string;
  readonly severity?: string;
  readonly json?: boolean;
  readonly quiet?: boolean;
  readonly runtimeLoader?: HuntRuntimeLoader;
}

async function readManifest(path: string): Promise<unknown> {
  if (!path || path.length > 4096 || CONTROL_CHARACTERS.test(path)) throw new Error("manifest path is invalid");
  const before = await lstat(path);
  if (!before.isFile() || before.size > MAX_INPUT_BYTES) throw new Error("manifest must be a bounded regular file");
  const handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const stat = await handle.stat();
    if (!stat.isFile() || stat.size > MAX_INPUT_BYTES) throw new Error("manifest must be a bounded regular file");
    const bytes = await handle.readFile();
    return parseBoundedJson(bytes, { limits: { maxBytes: MAX_INPUT_BYTES, maxDepth: 32, maxNodes: 100_000, maxObjectProperties: 100_000, maxArrayItems: 100_000 } });
  } finally {
    await handle.close();
  }
}

function manifestDocument(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const envelope = value as Record<string, unknown>;
  return "manifest" in envelope ? envelope.manifest : value;
}

function validText(value: string, max: number): boolean {
  return value.length > 0 && value.length <= max && !CONTROL_CHARACTERS.test(value);
}

function parseFinding(input: HuntHypothesisInput): HuntAttackFindingContext {
  if (!validText(input.findingId, 512)) throw new Error("finding id is invalid");
  const ruleId = HuntRuleIdSchema.parse(input.ruleId);
  const subjectId = input.subjectId;
  if (!validText(subjectId, 180)) throw new Error("subject id is invalid");
  const finding: HuntAttackFindingContext = { id: input.findingId, ruleId };
  if (input.location !== undefined) {
    const location = RelativeSubjectPathSchema.parse(input.location);
    (finding as { location?: string }).location = location;
  }
  if (input.line !== undefined) {
    if (!/^\d{1,9}$/u.test(input.line)) throw new Error("finding line is invalid");
    const line = Number(input.line);
    if (!Number.isSafeInteger(line) || line <= 0) throw new Error("finding line is invalid");
    (finding as { line?: number }).line = line;
  }
  if (input.severity !== undefined) {
    if (!SEVERITIES.has(input.severity)) throw new Error("finding severity is invalid");
    (finding as { severity?: "critical" | "high" | "medium" | "low" | "info" }).severity = input.severity as "critical" | "high" | "medium" | "low" | "info";
  }
  return finding;
}

export async function executeHuntHypothesis(input: HuntHypothesisInput): Promise<number> {
  try {
    const value = await readManifest(input.manifestPath);
    const manifest = parseHuntTargetManifest(manifestDocument(value));
    if (manifest.targetSubjectId !== input.subjectId) throw new Error("subject id does not match the Scout manifest");
    const finding = parseFinding(input);
    const runtime = await loadHuntRuntime(input.runtimeLoader);
    const hypothesis = runtime.planSupportedHuntAttack({ manifest, finding });
    if (input.json) console.log(JSON.stringify(hypothesis));
    else if (!input.quiet) {
      console.log(`Hunt hypothesis: ${hypothesis.status}`);
      console.log(`Finding: ${hypothesis.finding.id}`);
      console.log(`Rule: ${hypothesis.finding.ruleId}`);
      console.log(`Subject: ${hypothesis.targetSubjectId}`);
      if (hypothesis.playbook) console.log(`Playbook: ${hypothesis.playbook.recipeId}`);
      console.log(`Execution: ${hypothesis.executes ? "started" : "not run"}`);
      console.log(`Reason: ${hypothesis.reason}`);
    }
    return hypothesis.status === "supported" ? 0 : 3;
  } catch (error) {
    const message = error instanceof Error ? error.message : "hunt hypothesis failed";
    if (input.json) console.log(JSON.stringify({ status: "error", code: "HUNT_HYPOTHESIS_INPUT", message: "hunt hypothesis input is invalid" }));
    else if (!input.quiet) console.error(message);
    return 2;
  }
}
