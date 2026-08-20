import type { ScanResult } from "@verglos/shared";
import type { HuntOptions, HuntResult } from "./types.js";

export * from "./types.js";

export class NotImplementedError extends Error {
  constructor(message = "verglos hunt ships in v2.0.0-beta: https://verglos.com/hunt") {
    super(message);
    this.name = "NotImplementedError";
  }
}

export async function runHunt(
  _report: ScanResult,
  _opts: HuntOptions = {},
): Promise<HuntResult> {
  throw new NotImplementedError();
}
