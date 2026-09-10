import { createHash } from "node:crypto";
const SECRET_PATTERNS = [/(?:sk|pk)_(?:live|test)_[A-Za-z0-9]{12,}/g, /(?:token|secret|password|api[_-]?key)\s*[:=]\s*[^\s,;]+/gi, /(?:export\s+)?[A-Z][A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|KEY)\s*=\s*[^\s]+/g, /Bearer\s+[A-Za-z0-9._-]{16,}/gi];
export interface RedactedHuntOutput { readonly stdout: string; readonly stderr: string; readonly truncated: boolean; }
export function synthesizeHuntInput(value: string): string {
  return value.replace(/(?:secret|token|password|api[_-]?key)\s*[:=]\s*[^\s,;]+/gi, (match) => `${match.split(/[:=]/, 1)[0]}=[synthetic-secret]`);
}
export function huntEvidenceDigest(output: RedactedHuntOutput): string { return `sha256:${createHash("sha256").update(`${output.stdout}\n${output.stderr}`, "utf8").digest("hex")}`; }
export function redactHuntOutput(stdout: string, stderr: string, maxBytes = 1_000_000): RedactedHuntOutput {
  const redact = (value: string) => SECRET_PATTERNS.reduce((result, pattern) => result.replace(pattern, "[REDACTED]"), value);
  let out = redact(stdout); let err = redact(stderr); let truncated = false;
  if (Buffer.byteLength(out, "utf8") > maxBytes) { out = Buffer.from(out, "utf8").subarray(0, maxBytes).toString("utf8"); truncated = true; }
  if (Buffer.byteLength(err, "utf8") > maxBytes) { err = Buffer.from(err, "utf8").subarray(0, maxBytes).toString("utf8"); truncated = true; }
  return { stdout: out, stderr: err, truncated };
}
