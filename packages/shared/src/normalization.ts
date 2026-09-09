import { toConfidenceLevel, type ConfidenceLevel, type Severity } from "./types.js";
export interface NormalizedSeverity { readonly original: string; readonly normalized: Severity | "unknown"; readonly mappingVersion: "v1"; readonly uncertain: boolean; }
const MAP: Record<string, Severity> = { critical: "critical", severe: "critical", high: "high", medium: "medium", moderate: "medium", low: "low", info: "info", informational: "info" };
export function normalizeSeverity(value: string): NormalizedSeverity { const key = value.trim().toLowerCase(); const normalized = MAP[key] ?? "unknown"; return { original: value, normalized, mappingVersion: "v1", uncertain: normalized === "unknown" }; }
export function normalizeConfidence(value: number | ConfidenceLevel): { readonly original: number | ConfidenceLevel; readonly normalized: ConfidenceLevel; readonly mappingVersion: "v1" } { return { original: value, normalized: toConfidenceLevel(value), mappingVersion: "v1" }; }
