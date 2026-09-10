import { canonicalizeJson } from "./schema.js";
import { importCycloneDx } from "./cyclonedx-importer.js";
import { importCycloneDxVex } from "./cyclonedx-vex-importer.js";
import { importSpdx } from "./spdx-importer.js";

export function exportCycloneDx(document: Uint8Array | Record<string, unknown>): string { const bytes = document instanceof Uint8Array ? document : new TextEncoder().encode(canonicalizeJson(document)); const imported = importCycloneDx(bytes); return canonicalizeJson(imported.document); }
export function exportCycloneDxVex(document: Uint8Array | Record<string, unknown>): string { const bytes = document instanceof Uint8Array ? document : new TextEncoder().encode(canonicalizeJson(document)); importCycloneDxVex(bytes); return canonicalizeJson(JSON.parse(new TextDecoder().decode(bytes))); }
export function exportSpdx(document: Uint8Array | Record<string, unknown>): string { const bytes = document instanceof Uint8Array ? document : new TextEncoder().encode(canonicalizeJson(document)); const imported = importSpdx(bytes); return canonicalizeJson(imported.document); }
