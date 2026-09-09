import { createHash } from "node:crypto";
import { canonicalizeJson } from "./schema.js";
export interface FingerprintInput { readonly subjectId: string; readonly location?: string; readonly package?: string; readonly advisory?: string; readonly rule?: string; readonly evidenceClass: "native" | "imported" | "adapter"; }
export function fingerprintV1(input: FingerprintInput): string { const projection = { version: "v1", subjectId: input.subjectId, location: input.location ?? null, package: input.package ?? null, advisory: input.advisory ?? null, rule: input.rule ?? null, evidenceClass: input.evidenceClass }; return `sha256:${createHash("sha256").update(canonicalizeJson(projection), "utf8").digest("hex")}`; }
