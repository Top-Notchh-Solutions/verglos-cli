import { createHash } from "node:crypto";
import { lstat, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createSubject, type SbomSubject } from "./subject.js";
import { assertNoExecutionContext, type TargetResolution, type TargetResolver, type TargetResolverContext, type TargetSpec } from "./target-resolver.js";

export class SbomResolutionError extends Error {
  override readonly name = "SbomResolutionError";
  constructor(readonly code: "INVALID_TARGET" | "MISSING_PATH" | "UNSUPPORTED_FORMAT" | "INVALID_DOCUMENT", message: string) { super(message); }
}

const MAX_SBOM_BYTES = 8 * 1024 * 1024;

export async function resolveSbomTarget(target: TargetSpec, context: TargetResolverContext): Promise<TargetResolution> {
  assertNoExecutionContext(context);
  if (target.kind !== "sbom") throw new SbomResolutionError("INVALID_TARGET", "SBOM resolver requires an SBOM target.");
  const path = resolve(context.cwd, target.value);
  let bytes: Buffer;
  try {
    const entry = await lstat(path);
    if (!entry.isFile()) throw new Error();
    if (entry.size > MAX_SBOM_BYTES) throw new SbomResolutionError("INVALID_DOCUMENT", "SBOM document exceeds the 8 MiB limit.");
    bytes = await readFile(path);
    if (bytes.byteLength > MAX_SBOM_BYTES) throw new SbomResolutionError("INVALID_DOCUMENT", "SBOM document exceeds the 8 MiB limit.");
  } catch (error) {
    if (error instanceof SbomResolutionError) throw error;
    throw new SbomResolutionError("MISSING_PATH", "SBOM target is not a readable file.");
  }
  let document: Record<string, unknown>;
  try { const parsed: unknown = JSON.parse(bytes.toString("utf8")); if (typeof parsed !== "object" || parsed === null) throw new Error(); document = parsed as Record<string, unknown>; } catch { throw new SbomResolutionError("INVALID_DOCUMENT", "SBOM document is not valid JSON."); }
  const format = document.bomFormat === "CycloneDX" ? "cyclonedx-json" : typeof document.spdxVersion === "string" ? "spdx-json" : undefined;
  if (!format) throw new SbomResolutionError("UNSUPPORTED_FORMAT", "SBOM must identify CycloneDX or SPDX JSON format.");
  const subject = createSubject({ kind: "sbom", format, documentDigest: { algorithm: "sha256", value: createHash("sha256").update(bytes).digest("hex") }, ...(typeof document.serialNumber === "string" ? { serialNumber: document.serialNumber } : {}) });
  const limitations = format === "spdx-json" && typeof document.documentNamespace !== "string" ? ["SPDX document has no documentNamespace"] : [];
  return { target, subject, coverage: limitations.length === 0 ? "complete" : "incomplete", limitations };
}

export const sbomResolver: TargetResolver = { id: "verglos.sbom-document", capabilities: ["resolve-sbom"], resolve: resolveSbomTarget };
export type ResolvedSbomSubject = SbomSubject;
