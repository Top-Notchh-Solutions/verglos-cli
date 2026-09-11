import { lstat, readFile, writeFile } from "node:fs/promises";
import { authorizeAgentAction, canonicalizeJson, parseReleaseRecordManifestJson, signReleaseRecordManifest, type ApprovalReceipt } from "@verglos/shared";

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_KEY_BYTES = 16 * 1024;

async function boundedFile(path: string, max: number, label: string): Promise<Buffer> {
  const entry = await lstat(path); if (!entry.isFile()) throw new Error(`${label} must be a regular file`); if (entry.size > max) throw new Error(`${label} exceeds its size limit`);
  const bytes = await readFile(path); if (bytes.byteLength > max) throw new Error(`${label} exceeds its size limit`); return bytes;
}

export async function executeRecordSign(
  manifestPath: string,
  signaturePath: string,
  keyPath: string,
  signerId: string,
  issuer: string,
  approve = false,
  json = false,
  quiet = false,
  approvalReceipt?: ApprovalReceipt,
  now = new Date().toISOString(),
): Promise<number> {
  try {
    if (!approve) throw new Error("record signing requires explicit approval (--approve)");
    if (!approvalReceipt) throw new Error("record signing requires an approval receipt (--approval-receipt)");
    const authorization = authorizeAgentAction("sign", approvalReceipt, now);
    if (!authorization.allowed) throw new Error(`record signing approval denied: ${authorization.reason}`);
    if (approvalReceipt.target !== `manifest:${manifestPath}`) throw new Error("approval receipt scope does not match the signing manifest");
    if (!approvalReceipt.files.includes(manifestPath)) throw new Error("approval receipt does not cover the signing manifest");
    if (approvalReceipt.network.length > 0) throw new Error("record signing approval must not declare network scope");
    const manifest = parseReleaseRecordManifestJson(await boundedFile(manifestPath, MAX_BYTES, "record manifest"));
    const privateKey = (await boundedFile(keyPath, MAX_KEY_BYTES, "record signing key")).toString("utf8");
    const envelope = signReleaseRecordManifest(manifest, privateKey, { id: signerId, issuer }, new Date().toISOString());
    await writeFile(signaturePath, `${canonicalizeJson(envelope)}\n`, { flag: "wx", mode: 0o600 });
    const result = { signaturePath, manifestDigest: envelope.manifestDigest, signer: envelope.signer, algorithm: envelope.algorithm };
    if (json) console.log(JSON.stringify(result)); else if (!quiet) console.log(`Signed record manifest ${result.manifestDigest}.`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign record.";
    if (json) console.log(JSON.stringify({ status: "error", code: "RECORD_SIGN_INPUT", message })); else if (!quiet) console.error(`[RECORD_SIGN_INPUT] ${message}`);
    return 78;
  }
}
