import { lstat, readFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";
import { assertCompleteReleaseRecord, assertCompleteReleaseRecordPayloads, assertProviderProvenancePayloads, assertReleaseRecordRedactionPayloads, parseReleaseDecisionJson, parseReleaseRecordManifestJson, readAndVerifyRecord, releaseRecordManifestDigest, verifyReleaseRecordSignature } from "@verglos/shared";
import { verifyRecordPackageArtifacts } from "./record-package.js";
import { readBoundedRegularFile, verifyRecordSigstoreEvidence } from "./record-sigstore.js";

const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;

export interface RecordSigstoreVerifyOptions {
  readonly bundlePath?: string;
  readonly bindingPath?: string;
  readonly trustedRootPath?: string;
  readonly issuer?: string;
  readonly identity?: string;
}

export async function executeRecordVerify(root: string, manifestPath: string | undefined, json = false, quiet = false, signaturePath?: string, publicKeyPath?: string, trustedIssuer?: string, trustedSigner?: string, complete = false, sigstoreOptions: RecordSigstoreVerifyOptions = {}): Promise<number> {
  try {
    const sigstorePaths = [sigstoreOptions.bundlePath, sigstoreOptions.bindingPath, sigstoreOptions.trustedRootPath, sigstoreOptions.issuer, sigstoreOptions.identity];
    const sigstoreRequested = sigstorePaths.some(Boolean);
    const explicitSigstoreFiles = Boolean(sigstoreOptions.bundlePath || sigstoreOptions.bindingPath);
    const completeSigstorePolicy = Boolean(sigstoreOptions.trustedRootPath && sigstoreOptions.issuer && sigstoreOptions.identity);
    if (Boolean(sigstoreOptions.bundlePath) !== Boolean(sigstoreOptions.bindingPath)) throw new Error("Sigstore verification requires both --sigstore-bundle and --sigstore-binding");
    if (sigstoreRequested && !completeSigstorePolicy) throw new Error("Sigstore verification requires --trusted-root, --certificate-issuer, and --certificate-identity");
    if (explicitSigstoreFiles && (!sigstoreOptions.bundlePath || !sigstoreOptions.bindingPath)) throw new Error("Sigstore verification requires both --sigstore-bundle and --sigstore-binding");
    if (sigstoreRequested && !explicitSigstoreFiles && !basename(resolve(root)).toLowerCase().endsWith(".vgl")) throw new Error("Sigstore verification of a record store requires --sigstore-bundle and --sigstore-binding");
    const resolvedManifestPath = manifestPath ?? join(root, "manifest.json");
    const bytes = await readBoundedRegularFile(resolvedManifestPath, MAX_MANIFEST_BYTES, "record manifest");
    const parsedManifest = parseReleaseRecordManifestJson(bytes);
    const manifest = complete || sigstoreRequested ? assertCompleteReleaseRecord(parsedManifest) : parsedManifest;
    const members = await readAndVerifyRecord(root, manifest);
    assertReleaseRecordRedactionPayloads(manifest, members);
    assertProviderProvenancePayloads(manifest, members);
    if (complete || sigstoreRequested) assertCompleteReleaseRecordPayloads(manifest, members);
    const packageArtifacts = await verifyRecordPackageArtifacts({ root, manifest, members });
    if (packageArtifacts.packaged) {
      assertCompleteReleaseRecord(manifest);
      assertCompleteReleaseRecordPayloads(manifest, members);
      if (signaturePath && packageArtifacts.signaturePath && signaturePath !== packageArtifacts.signaturePath) {
        throw new Error("a .vgl package's embedded signature cannot be replaced with a different signature path");
      }
      signaturePath ??= packageArtifacts.signaturePath;
    }
    if (packageArtifacts.sigstoreIncluded && !sigstoreRequested) throw new Error(".vgl package contains Sigstore evidence; provide its exact trusted root, certificate issuer, and certificate identity");
    const embeddedSigstoreMismatch = packageArtifacts.sigstoreIncluded && explicitSigstoreFiles && (
      sigstoreOptions.bundlePath !== packageArtifacts.sigstoreBundlePath || sigstoreOptions.bindingPath !== packageArtifacts.sigstoreBindingPath
    );
    if (embeddedSigstoreMismatch) throw new Error("a .vgl package's embedded Sigstore evidence cannot be replaced with different bundle or binding files");
    const bundlePath = sigstoreOptions.bundlePath ?? packageArtifacts.sigstoreBundlePath;
    const bindingPath = sigstoreOptions.bindingPath ?? packageArtifacts.sigstoreBindingPath;
    if (sigstoreRequested && (!bundlePath || !bindingPath)) throw new Error("Sigstore verification requires bundle and binding files, either embedded in the .vgl package or supplied explicitly");
    const sigstore = sigstoreRequested ? await verifyRecordSigstoreEvidence({
      bundlePath: bundlePath!,
      bindingPath: bindingPath!,
      trustedRootPath: sigstoreOptions.trustedRootPath!,
      manifest,
      members,
      identity: sigstoreOptions.identity!,
      issuer: sigstoreOptions.issuer!,
    }) : undefined;
    const decisionMember = manifest.members.find((member) => member.kind === "release-decision");
    if (!decisionMember) throw new Error("record manifest is missing its release-decision member");
    const decisionBytes = members.get(decisionMember.path);
    if (!decisionBytes) throw new Error("record release-decision member is omitted or missing");
    const decision = parseReleaseDecisionJson(decisionBytes);
    if (Date.parse(decision.generatedAt) > Date.parse(manifest.generatedAt)) throw new Error("release decision timestamp is after manifest generation");
    if (["complete", "partial"].includes(manifest.redaction.status)) {
      const redactionMember = manifest.members.find((member) => member.kind === "redaction-manifest");
      if (!redactionMember || redactionMember.redaction === "omitted" || !members.has(redactionMember.path)) throw new Error("redaction manifest is required and must be present");
    }
    let signature: { readonly verified: boolean; readonly reason?: string; readonly signer?: { readonly id: string; readonly issuer: string } } | undefined;
    if (signaturePath || publicKeyPath) {
      if (!signaturePath || !publicKeyPath) throw new Error("record signature verification requires --signature and --public-key");
      if (!trustedIssuer) throw new Error("record signature verification requires --trusted-issuer");
      const signatureEntry = await lstat(signaturePath); if (!signatureEntry.isFile() || signatureEntry.size > 16 * 1024) throw new Error("record signature must be a bounded regular file");
      const keyEntry = await lstat(publicKeyPath); if (!keyEntry.isFile() || keyEntry.size > 16 * 1024) throw new Error("record public key must be a bounded regular file");
      const envelope = JSON.parse((await readFile(signaturePath, "utf8"))) as unknown;
      const key = await readFile(publicKeyPath, "utf8");
      signature = verifyReleaseRecordSignature(manifest, envelope, key);
      if (!signature.verified) throw new Error(`record signature verification failed: ${signature.reason}`);
      if (signature.signer?.issuer !== trustedIssuer) throw new Error("record signature issuer is not trusted");
      if (trustedSigner && signature.signer?.id !== trustedSigner) throw new Error("record signature signer is not trusted");
      const signedAt = typeof envelope === "object" && envelope !== null && "signedAt" in envelope ? Date.parse(String((envelope as { signedAt: unknown }).signedAt)) : NaN;
      if (!Number.isFinite(signedAt) || signedAt < Date.parse(manifest.generatedAt)) throw new Error("record signature timestamp predates manifest generation");
    }
    const result = { verified: true, manifestDigest: releaseRecordManifestDigest(manifest), members: members.size, paths: [...members.keys()].sort(), decision: decision.decision, policyDigest: `${decision.policy.digest.algorithm}:${decision.policy.digest.value}`, ...(packageArtifacts.packaged ? { package: { transport: "directory-v1", viewer: "verified", export: "verified", sigstoreIncluded: packageArtifacts.sigstoreIncluded ?? false } } : {}), ...(signature ? { signature } : {}), ...(sigstore ? { sigstore: { verified: true, ...sigstore } } : {}) };
    if (json) console.log(JSON.stringify(result));
    else if (!quiet) console.log(`Verified record ${result.manifestDigest} (${result.members} members).`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify record.";
    if (json) console.log(JSON.stringify({ status: "error", code: "RECORD_VERIFY_INPUT", message: "record verification failed" })); else console.error(`[RECORD_VERIFY_INPUT] ${message}`);
    return 78;
  }
}
