import type { ScanResult } from "@verglos/shared";
import type { AttestationBundle, SigningKey } from "./types.js";

export * from "./types.js";

export class NotImplementedError extends Error {
  constructor(message = "verglos attest ships in v2.0.0-beta: https://verglos.com/attest") {
    super(message);
    this.name = "NotImplementedError";
  }
}

export async function signBundle(
  _report: ScanResult,
  _signingKey: SigningKey,
): Promise<AttestationBundle> {
  throw new NotImplementedError();
}
