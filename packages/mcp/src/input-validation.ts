import { validateAgentInputBounds } from "@verglos/shared";
import type { CheckBeforeWriteInput } from "./tools/check-before-write.js";

export function parseCheckBeforeWriteArgs(value: unknown): CheckBeforeWriteInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("check_before_write arguments must be an object");
  const input = value as Record<string, unknown>;
  if (typeof input.code !== "string" || typeof input.targetPath !== "string" || (input.language !== undefined && typeof input.language !== "string") || (input.context !== undefined && typeof input.context !== "string")) throw new Error("check_before_write requires string code and targetPath");
  const parsed = { code: input.code, targetPath: input.targetPath, language: input.language as string | undefined, context: input.context as string | undefined };
  validateAgentInputBounds(parsed); return parsed;
}

export function parseExplainFindingArgs(value: unknown): { rule: string } {
  if (!value || typeof value !== "object" || Array.isArray(value) || typeof (value as Record<string, unknown>).rule !== "string") throw new Error("explain_finding requires a string rule");
  const rule = (value as Record<string, unknown>).rule as string;
  if (rule.length === 0 || rule.length > 256) throw new Error("explain_finding rule exceeds bounds");
  return { rule };
}

export function parseCheckPackageArgs(value: unknown): { packageName: string; version?: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("check_package arguments must be an object");
  const input = value as Record<string, unknown>;
  if (typeof input.packageName !== "string" || (input.version !== undefined && typeof input.version !== "string")) throw new Error("check_package requires a string packageName");
  const parsed = { packageName: input.packageName, version: input.version as string | undefined };
  validateAgentInputBounds(parsed); return parsed;
}
