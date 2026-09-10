import { lstat, readFile } from "node:fs/promises";
import { parseReleaseDecisionJson, parseReleaseRecordManifestJson, readAndVerifyRecord, releaseRecordManifestDigest, verifyReleaseRecordSignature } from "@verglos/shared";

const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;

export async function executeRecordVerify(root: string, manifestPath: string, json = false, quiet = false, signaturePath?: string, publicKeyPath?: string): Promise<number> {
  try {
    const entry = await lstat(manifestPath);
    if (!entry.isFile()) throw new Error("record manifest must be a regular file");
    if (entry.size > MAX_MANIFEST_BYTES) throw new Error("record manifest exceeds the 8 MiB limit");
    const bytes = await readFile(manifestPath);
    if (bytes.byteLength > MAX_MANIFEST_BYTES) throw new Error("record manifest exceeds the 8 MiB limit");
    const manifest = parseReleaseRecordManifestJson(bytes);
    const members = await readAndVerifyRecord(root, manifest);
    const decisionMember = manifest.members.find((member) => member.kind === "release-decision");
    if (!decisionMember) throw new Error("record manifest is missing its release-decision member");
    const decisionBytes = members.get(decisionMember.path);
    if (!decisionBytes) throw new Error("record release-decision member is omitted or missing");
    const decision = parseReleaseDecisionJson(decisionBytes);
    let signature: { readonly verified: boolean; readonly reason?: string; readonly signer?: { readonly id: string; readonly issuer: string } } | undefined;
    if (signaturePath || publicKeyPath) {
      if (!signaturePath || !publicKeyPath) throw new Error("record signature verification requires --signature and --public-key");
      const signatureEntry = await lstat(signaturePath); if (!signatureEntry.isFile() || signatureEntry.size > 16 * 1024) throw new Error("record signature must be a bounded regular file");
      const keyEntry = await lstat(publicKeyPath); if (!keyEntry.isFile() || keyEntry.size > 16 * 1024) throw new Error("record public key must be a bounded regular file");
      const envelope = JSON.parse((await readFile(signaturePath, "utf8"))) as unknown;
      const key = await readFile(publicKeyPath, "utf8");
      signature = verifyReleaseRecordSignature(manifest, envelope, key);
      if (!signature.verified) throw new Error(`record signature verification failed: ${signature.reason}`);
    }
    const result = { verified: true, manifestDigest: releaseRecordManifestDigest(manifest), members: members.size, paths: [...members.keys()].sort(), decision: decision.decision, policyDigest: `${decision.policy.digest.algorithm}:${decision.policy.digest.value}`, ...(signature ? { signature } : {}) };
    if (json) console.log(JSON.stringify(result));
    else if (!quiet) console.log(`Verified record ${result.manifestDigest} (${result.members} members).`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify record.";
    if (json) console.log(JSON.stringify({ status: "error", code: "RECORD_VERIFY_INPUT", message })); else console.error(`[RECORD_VERIFY_INPUT] ${message}`);
    return 78;
  }
}
