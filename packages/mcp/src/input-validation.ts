import { validateAgentInputBounds } from "@verglos/shared";
import { isAbsolute } from "node:path";
import type { CheckBeforeWriteInput } from "./tools/check-before-write.js";

export function parseCheckBeforeWriteArgs(value: unknown): CheckBeforeWriteInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("check_before_write arguments must be an object");
  const input = value as Record<string, unknown>;
  if (typeof input.code !== "string" || typeof input.targetPath !== "string" || (input.language !== undefined && typeof input.language !== "string") || (input.context !== undefined && typeof input.context !== "string")) throw new Error("check_before_write requires string code and targetPath");
  const parsed = { code: input.code, targetPath: input.targetPath, language: input.language as string | undefined, context: input.context as string | undefined };
  validateAgentInputBounds(parsed); return parsed;
}

export function parseExplainFindingArgs(value: unknown): { rule: string; targetSubjectId?: string; files?: string[] } {
  if (!value || typeof value !== "object" || Array.isArray(value) || typeof (value as Record<string, unknown>).rule !== "string") throw new Error("explain_finding requires a string rule");
  const input = value as Record<string, unknown>;
  const rule = input.rule as string;
  if (rule.length === 0 || rule.length > 256) throw new Error("explain_finding rule exceeds bounds");
  if (input.targetSubjectId !== undefined && typeof input.targetSubjectId !== "string") throw new Error("explain_finding targetSubjectId must be a string");
  if (input.files !== undefined && (!Array.isArray(input.files) || input.files.some((file) => typeof file !== "string"))) throw new Error("explain_finding files must be strings");
  for (const key of Object.keys(input)) if (!["rule", "targetSubjectId", "files"].includes(key)) throw new Error(`unknown explain_finding argument: ${key}`);
  return { rule, targetSubjectId: input.targetSubjectId as string | undefined, files: input.files as string[] | undefined };
}

export function parseCheckPackageArgs(value: unknown): { packageName: string; version?: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("check_package arguments must be an object");
  const input = value as Record<string, unknown>;
  if (typeof input.packageName !== "string" || (input.version !== undefined && typeof input.version !== "string")) throw new Error("check_package requires a string packageName");
  const parsed = { packageName: input.packageName, version: input.version as string | undefined };
  validateAgentInputBounds(parsed); return parsed;
}

export function parseScanArgs(value: unknown): { projectRoot?: string; limit?: number; noProvenance?: boolean } {
  if (value === undefined) return {};
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("scan arguments must be an object");
  const input = value as Record<string, unknown>;
  for (const key of Object.keys(input)) if (!["projectRoot", "limit", "noProvenance"].includes(key)) throw new Error(`unknown scan argument: ${key}`);
  if (input.projectRoot !== undefined && (typeof input.projectRoot !== "string" || !isAbsolute(input.projectRoot))) throw new Error("scan projectRoot must be an absolute path");
  if (input.projectRoot !== undefined) validateAgentInputBounds({ targetPath: input.projectRoot });
  if (input.limit !== undefined && (typeof input.limit !== "number" || !Number.isInteger(input.limit) || !Number.isFinite(input.limit) || input.limit < 0 || input.limit > 1000)) throw new Error("scan limit must be an integer from 0 to 1000");
  if (input.noProvenance !== undefined && typeof input.noProvenance !== "boolean") throw new Error("scan noProvenance must be boolean");
  return {
    ...(input.projectRoot !== undefined ? { projectRoot: input.projectRoot as string } : {}),
    ...(input.limit !== undefined ? { limit: input.limit as number } : {}),
    ...(input.noProvenance !== undefined ? { noProvenance: input.noProvenance as boolean } : {}),
  };
}
