import type { Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";

/**
 * Runtime knobs passed to every detector's run(). Additive — new
 * fields append here so detectors that don't care just ignore.
 */
export interface DetectorContext {
  /** True when `verglos scan --verify-secrets` is set. */
  verifySecrets?: boolean;
}

export interface Detector {
  id: Finding["detector"];
  run(
    files: ScannedFile[],
    projectRoot: string,
    context?: DetectorContext,
  ): Promise<Finding[]>;
}
