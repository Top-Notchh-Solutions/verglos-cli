import { createHash } from "node:crypto";
const SECRET_PATTERNS = [
  /(?:sk|pk)_(?:live|test)_[A-Za-z0-9]{12,}/g,
  /(?:token|secret|password|api[_-]?key)\s*[:=]\s*[^\s,;]+/gi,
  /(?:export\s+)?[A-Z][A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|KEY)\s*=\s*[^\s]+/g,
  /Bearer\s+[A-Za-z0-9._-]{16,}/gi,
  /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,
  /-----BEGIN(?: [A-Z0-9]+)* PRIVATE KEY-----[\s\S]*?-----END(?: [A-Z0-9]+)* PRIVATE KEY-----/g,
];
export interface RedactedHuntOutput { readonly stdout: string; readonly stderr: string; readonly truncated: boolean; }
export class HuntOutputLimitError extends Error { override readonly name = "HuntOutputLimitError"; }
export function synthesizeHuntInput(value: string): string {
  return value.replace(/(?:secret|token|password|api[_-]?key)\s*[:=]\s*[^\s,;]+/gi, (match) => `${match.split(/[:=]/, 1)[0]}=[synthetic-secret]`);
}
export function huntEvidenceDigest(output: RedactedHuntOutput): string { return `sha256:${createHash("sha256").update(`${output.stdout}\n${output.stderr}`, "utf8").digest("hex")}`; }
export function redactHuntOutput(stdout: string, stderr: string, maxBytes = 1_000_000): RedactedHuntOutput {
  if (!Number.isInteger(maxBytes) || maxBytes < 1 || maxBytes > 10_000_000) throw new HuntOutputLimitError("Hunt output limit must be an integer between 1 and 10000000 bytes");
  const redact = (value: string) => SECRET_PATTERNS.reduce((result, pattern) => result.replace(pattern, "[REDACTED]"), value);
  const truncate = (value: string) => {
    const bytes = Buffer.from(value, "utf8");
    if (bytes.byteLength <= maxBytes) return { value, truncated: false };
    let clipped = bytes.subarray(0, maxBytes).toString("utf8");
    while (Buffer.byteLength(clipped, "utf8") > maxBytes) clipped = clipped.slice(0, -1);
    return { value: clipped, truncated: true };
  };
  const clippedOut = truncate(redact(stdout));
  const clippedErr = truncate(redact(stderr));
  const out = clippedOut.value; const err = clippedErr.value;
  const truncated = clippedOut.truncated || clippedErr.truncated;
  return { stdout: out, stderr: err, truncated };
}
