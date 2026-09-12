import { inspectSystemEngine, type SystemEngineInspection } from "@verglos/shared";

export interface EngineInspectionOptions {
  readonly json?: boolean;
  readonly quiet?: boolean;
  readonly inspect?: (path: string) => Promise<SystemEngineInspection>;
}

export function formatEngineInspection(engineId: string, inspection: SystemEngineInspection): string {
  return JSON.stringify({
    status: inspection.state,
    engineId,
    path: inspection.path,
    version: inspection.version,
    digest: `sha256:${inspection.digest.value}`,
    trust: inspection.trust,
    capabilities: inspection.capabilities,
    unsupportedCapabilities: inspection.unsupportedCapabilities,
    limitations: inspection.limitations,
  });
}

export async function executeEngineInspection(
  engineId: string,
  path: string,
  options: EngineInspectionOptions = {},
): Promise<number> {
  if (engineId !== "trivy") {
    if (options.json) process.stdout.write(`${JSON.stringify({ status: "error", code: "ENGINE_INSPECT_UNSUPPORTED", message: "engine inspection is not supported for this engine" })}\n`);
    else if (!options.quiet) process.stderr.write("Engine inspection is not supported for this engine.\n");
    return 78;
  }
  try {
    const inspection = await (options.inspect ?? inspectSystemEngine)(path);
    if (options.json) process.stdout.write(`${formatEngineInspection(engineId, inspection)}\n`);
    else if (!options.quiet) {
      process.stdout.write(`Trivy system engine: ${inspection.state}\n`);
      process.stdout.write(`Path: ${inspection.path}\nVersion: ${inspection.version}\nDigest: sha256:${inspection.digest.value}\nTrust: ${inspection.trust}\n`);
      process.stdout.write(`Capabilities: ${inspection.capabilities.length ? inspection.capabilities.join(", ") : "none confirmed"}\n`);
      if (inspection.unsupportedCapabilities.length) process.stdout.write(`Unsupported: ${inspection.unsupportedCapabilities.join(", ")}\n`);
      for (const limitation of inspection.limitations) process.stdout.write(`Limitation: ${limitation}\n`);
    }
    return inspection.state === "capabilities-confirmed" ? 0 : 3;
  } catch {
    if (options.json) process.stdout.write(`${JSON.stringify({ status: "error", code: "ENGINE_INSPECT_FAILED", message: "explicit engine inspection failed" })}\n`);
    else if (!options.quiet) process.stderr.write("Explicit engine inspection failed. Check the path and executable permissions.\n");
    return 78;
  }
}
