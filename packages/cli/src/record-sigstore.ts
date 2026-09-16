import { createHash } from "node:crypto";
import { constants } from "node:fs";
import { open, lstat, mkdir, mkdtemp, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve, sep } from "node:path";
import { attest } from "sigstore";
import { BUNDLE_V03_LEGACY_MEDIA_TYPE, BUNDLE_V03_MEDIA_TYPE, bundleFromJSON, isBundleWithDsseEnvelope } from "@sigstore/bundle";
import { TrustedRoot } from "@sigstore/protobuf-specs";
import { Verifier, toSignedEntity, toTrustMaterial } from "@sigstore/verify";
import {
  assertCompleteReleaseRecord,
  assertCompleteReleaseRecordPayloads,
  assertProviderProvenancePayloads,
  assertReleaseRecordRedactionPayloads,
  authorizeAgentAction,
  canonicalizeJson,
  createReleaseStatement,
  createSigstoreRecordBinding,
  parseReleaseDecisionJson,
  parseReleaseRecordManifestJson,
  parseSigstoreRecordBinding,
  putApprovalReceipt,
  readAndVerifyRecord,
  releaseRecordManifestDigest,
  type ApprovalReceipt,
  type ReleaseRecordManifestDocument,
} from "@verglos/shared";

export const SIGSTORE_NETWORK_ORIGINS = Object.freeze([
  "https://fulcio.sigstore.dev",
  "https://rekor.sigstore.dev",
  "https://tuf-repo-cdn.sigstore.dev",
]);
export const SIGSTORE_BUNDLE_NAME = ".vgl-sigstore.json";
export const SIGSTORE_BINDING_NAME = ".vgl-sigstore-binding.json";
export const SIGSTORE_STATUS_NAME = ".vgl-sigstore-status.json";
export const MAX_SIGSTORE_BUNDLE_BYTES = 8 * 1024 * 1024;
export const MAX_TRUST_ROOT_BYTES = 4 * 1024 * 1024;
const MAX_BINDING_BYTES = 16 * 1024;
const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;
const IN_TOTO_PAYLOAD_TYPE = "application/vnd.in-toto+json";

export interface SigstoreIdentityPolicy {
  readonly issuer: string;
  readonly identity: string;
}

export interface VerifiedSigstoreBundle {
  readonly bundleDigest: string;
  readonly identity: string;
  readonly issuer: string;
}

export function releaseStatementBytes(manifest: ReleaseRecordManifestDocument, subjects: readonly string[]): Buffer {
  return Buffer.from(`${canonicalizeJson(createReleaseStatement(manifest, subjects))}\n`, "utf8");
}

export function verifySigstoreBundleBytes(
  bundleBytes: Uint8Array,
  expectedStatement: Uint8Array,
  trustedRootBytes: Uint8Array,
  policy: SigstoreIdentityPolicy,
): VerifiedSigstoreBundle {
  if (bundleBytes.byteLength === 0 || bundleBytes.byteLength > MAX_SIGSTORE_BUNDLE_BYTES) throw new Error("Sigstore bundle exceeds its size limit");
  if (trustedRootBytes.byteLength === 0 || trustedRootBytes.byteLength > MAX_TRUST_ROOT_BYTES) throw new Error("Sigstore trusted root exceeds its size limit");
  let rawBundle: unknown;
  let rawRoot: unknown;
  try { rawBundle = JSON.parse(Buffer.from(bundleBytes).toString("utf8")) as unknown; }
  catch { throw new Error("Sigstore bundle is invalid JSON"); }
  try { rawRoot = JSON.parse(Buffer.from(trustedRootBytes).toString("utf8")) as unknown; }
  catch { throw new Error("Sigstore trusted root is invalid JSON"); }

  const bundle = bundleFromJSON(rawBundle);
  if (bundle.mediaType !== BUNDLE_V03_MEDIA_TYPE && bundle.mediaType !== BUNDLE_V03_LEGACY_MEDIA_TYPE) throw new Error("Sigstore verification requires a version 0.3 bundle");
  if (!isBundleWithDsseEnvelope(bundle)) throw new Error("Sigstore bundle must contain a DSSE in-toto attestation");
  const envelope = bundle.content.dsseEnvelope;
  if (envelope.payloadType !== IN_TOTO_PAYLOAD_TYPE || !Buffer.from(envelope.payload).equals(Buffer.from(expectedStatement))) {
    throw new Error("Sigstore DSSE payload does not exactly match this Release Record statement");
  }
  if (envelope.signatures.length !== 1) throw new Error("Sigstore DSSE bundle must contain exactly one signer");

  const root = TrustedRoot.fromJSON(rawRoot);
  const verifier = new Verifier(toTrustMaterial(root), { tlogThreshold: 1, ctlogThreshold: 1, timestampThreshold: 1 });
  const signer = verifier.verify(toSignedEntity(bundle));
  const identity = signer.identity?.subjectAlternativeName;
  const issuer = signer.identity?.extensions?.issuer;
  if (!identity || !issuer) throw new Error("Sigstore certificate does not identify a signer and issuer");
  if (identity !== policy.identity) throw new Error("Sigstore certificate identity does not match the exact trusted identity");
  if (issuer !== policy.issuer) throw new Error("Sigstore certificate issuer does not match the exact trusted issuer");

  return {
    bundleDigest: `sha256:${createHash("sha256").update(bundleBytes).digest("hex")}`,
    identity,
    issuer,
  };
}

export async function readBoundedRegularFile(path: string, maxBytes: number, label: string): Promise<Buffer> {
  const before = await lstat(path);
  if (!before.isFile() || before.size > maxBytes) throw new Error(`${label} must be a bounded regular file`);
  const handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
  try {
    const opened = await handle.stat();
    if (!opened.isFile() || opened.size > maxBytes || opened.dev !== before.dev || opened.ino !== before.ino) throw new Error(`${label} must be a bounded regular file`);
    const chunks: Buffer[] = [];
    const buffer = Buffer.alloc(Math.min(64 * 1024, maxBytes + 1));
    let total = 0;
    while (total <= maxBytes) {
      const length = Math.min(buffer.byteLength, maxBytes + 1 - total);
      const { bytesRead } = await handle.read(buffer, 0, length, total);
      if (bytesRead === 0) break;
      total += bytesRead;
      if (total > maxBytes) throw new Error(`${label} must be a bounded regular file`);
      chunks.push(Buffer.from(buffer.subarray(0, bytesRead)));
    }
    if ((await handle.stat()).size !== total) throw new Error(`${label} changed while being read`);
    return Buffer.concat(chunks, total);
  } finally {
    await handle.close();
  }
}

function sigstoreApprovalTarget(manifestPath: string, outputPath: string, policy: SigstoreIdentityPolicy): string {
  return `sigstore:${manifestPath}:${outputPath}:${policy.issuer}:${policy.identity}`;
}

function assertApproval(receipt: ApprovalReceipt | undefined, action: "sign" | "network", target: string, files: readonly string[], at: string): asserts receipt is ApprovalReceipt {
  if (!receipt) throw new Error(`${action} approval is required for this Sigstore operation`);
  const authorization = authorizeAgentAction(action, receipt, at);
  if (!authorization.allowed) throw new Error(`${action} approval denied: ${authorization.reason}`);
  if (receipt.target !== target) throw new Error(`${action} approval does not match the requested Sigstore operation`);
  if (receipt.files.length !== files.length || files.some((file) => !receipt.files.includes(file))) throw new Error(`${action} approval does not cover the exact Sigstore file scope`);
  const expectedNetwork = action === "network" ? [...SIGSTORE_NETWORK_ORIGINS].sort() : [];
  if ([...receipt.network].sort().join("\n") !== expectedNetwork.join("\n")) throw new Error(`${action} approval has an incorrect Sigstore network scope`);
}

export async function executeRecordAttest(input: {
  readonly storeRoot: string;
  readonly manifestPath: string;
  readonly outputDirectory: string;
  readonly trustedRootPath: string;
  readonly identity: string;
  readonly issuer: string;
  readonly identityTokenEnv: string;
  readonly publishToRekor: boolean;
  readonly approve: boolean;
  readonly signingApproval?: ApprovalReceipt;
  readonly networkApproval?: ApprovalReceipt;
  readonly now?: string;
  readonly approvalStoreRoot?: string;
  readonly json?: boolean;
  readonly quiet?: boolean;
}): Promise<number> {
  let destination = "";
  let staging: string | undefined;
  let destinationClaimed = false;
  let bundleBytes: Buffer | undefined;
  let networkAttempted = false;
  try {
    if (!input.approve) throw new Error("Sigstore attestation requires explicit approval (--approve)");
    if (!input.publishToRekor) throw new Error("Sigstore attestation requires explicit public Rekor upload consent (--publish-to-rekor)");
    const policy = { issuer: input.issuer, identity: input.identity };
    const target = sigstoreApprovalTarget(input.manifestPath, input.outputDirectory, policy);
    const files = [input.manifestPath, input.outputDirectory];
    const now = input.now ?? new Date().toISOString();
    assertApproval(input.signingApproval, "sign", target, files, now);
    assertApproval(input.networkApproval, "network", target, files, now);
    if (!/^[A-Z_][A-Z0-9_]{0,127}$/u.test(input.identityTokenEnv)) throw new Error("identity token environment variable name is invalid");

    const sourceRoot = resolve(input.storeRoot);
    destination = resolve(input.outputDirectory);
    const relativeToStore = relative(sourceRoot, destination);
    if (relativeToStore === "" || (!relativeToStore.startsWith(`..${sep}`) && relativeToStore !== ".." && !relativeToStore.startsWith(sep))) {
      throw new Error("Sigstore output directory must be outside the Release Record store");
    }
    if (!destination.endsWith(".vgl-sigstore")) throw new Error("Sigstore output directory must use the .vgl-sigstore suffix");
    try { await lstat(destination); throw new Error("Sigstore output directory already exists"); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }

    const manifest = assertCompleteReleaseRecord(parseReleaseRecordManifestJson(await readBoundedRegularFile(input.manifestPath, MAX_MANIFEST_BYTES, "record manifest")));
    const members = await readAndVerifyRecord(sourceRoot, manifest);
    assertReleaseRecordRedactionPayloads(manifest, members);
    assertProviderProvenancePayloads(manifest, members);
    assertCompleteReleaseRecordPayloads(manifest, members);
    const decisionMember = manifest.members.find((member) => member.kind === "release-decision");
    const decisionBytes = decisionMember ? members.get(decisionMember.path) : undefined;
    if (!decisionBytes) throw new Error("complete record release decision is missing");
    const decision = parseReleaseDecisionJson(decisionBytes);
    const statement = releaseStatementBytes(manifest, decision.subjects.map((subject) => subject.subjectId));
    const trustedRootBytes = await readBoundedRegularFile(input.trustedRootPath, MAX_TRUST_ROOT_BYTES, "Sigstore trusted root");
    const token = process.env[input.identityTokenEnv];
    if (!token || token.length > 32768) throw new Error("the named identity-token environment variable is missing or exceeds its size limit");

    if (input.approvalStoreRoot) {
      await putApprovalReceipt(input.approvalStoreRoot, input.signingApproval);
      await putApprovalReceipt(input.approvalStoreRoot, input.networkApproval);
    }
    await mkdir(dirname(destination), { recursive: true });
    await mkdir(destination, { mode: 0o700 });
    destinationClaimed = true;
    staging = await mkdtemp(join(destination, ".staging-"));
    await writeFile(join(destination, SIGSTORE_STATUS_NAME), `${canonicalizeJson({ status: "pending", transparencyLogOutcome: "not-attempted" })}\n`, { flag: "wx", mode: 0o600 });
    networkAttempted = true;
    const bundle = await attest(statement, IN_TOTO_PAYLOAD_TYPE, {
      fulcioURL: SIGSTORE_NETWORK_ORIGINS[0],
      rekorURL: SIGSTORE_NETWORK_ORIGINS[1],
      identityToken: token,
      tlogUpload: true,
      legacyCompatibility: false,
      retry: { retries: 0 },
      timeout: 15_000,
    });
    bundleBytes = Buffer.from(`${canonicalizeJson(bundle)}\n`, "utf8");
    if (bundleBytes.byteLength > MAX_SIGSTORE_BUNDLE_BYTES) throw new Error("Sigstore bundle exceeds its 8 MiB limit");
    await writeFile(join(staging, SIGSTORE_BUNDLE_NAME), bundleBytes, { flag: "wx", mode: 0o600 });

    const verification = verifySigstoreBundleBytes(bundleBytes, statement, trustedRootBytes, policy);
    const binding = createSigstoreRecordBinding(manifest, {
      bundleDigest: verification.bundleDigest,
      signer: { identity: verification.identity, issuer: verification.issuer },
      verification: "verified",
      limitations: ["Trust is scoped to the caller-supplied Sigstore trusted root and exact certificate issuer/identity policy."],
    });
    const bindingBytes = Buffer.from(`${canonicalizeJson(binding)}\n`, "utf8");
    await writeFile(join(staging, SIGSTORE_BINDING_NAME), bindingBytes, { flag: "wx", mode: 0o600 });
    await rename(join(staging, SIGSTORE_BUNDLE_NAME), join(destination, SIGSTORE_BUNDLE_NAME));
    await rename(join(staging, SIGSTORE_BINDING_NAME), join(destination, SIGSTORE_BINDING_NAME));
    await rm(staging, { recursive: true, force: true });
    staging = undefined;
    await writeFile(join(destination, SIGSTORE_STATUS_NAME), `${canonicalizeJson({ status: "verified", transparencyLogOutcome: "performed", manifestDigest: releaseRecordManifestDigest(manifest), bundleDigest: verification.bundleDigest, signer: verification.identity, issuer: verification.issuer })}\n`, { mode: 0o600 });
    const result = {
      status: "verified",
      manifestDigest: releaseRecordManifestDigest(manifest),
      bundleDigest: verification.bundleDigest,
      signer: verification.identity,
      issuer: verification.issuer,
      outputDirectory: destination,
      transparencyLogUpload: "performed",
      files: [SIGSTORE_BUNDLE_NAME, SIGSTORE_BINDING_NAME],
    };
    if (input.json) console.log(JSON.stringify(result));
    else if (!input.quiet) console.log(`Created verified Sigstore evidence in ${destination}; the attestation was uploaded to public Rekor.`);
    return 0;
  } catch (error) {
    const transparencyLogOutcome = bundleBytes ? "performed" : networkAttempted ? "unknown" : "not-attempted";
    if (destinationClaimed && networkAttempted) {
      if (bundleBytes) await writeFile(join(destination, SIGSTORE_BUNDLE_NAME), bundleBytes, { flag: "wx", mode: 0o600 }).catch(() => undefined);
      await writeFile(join(destination, SIGSTORE_STATUS_NAME), `${canonicalizeJson({ status: "incomplete", transparencyLogOutcome, bundleAvailable: Boolean(bundleBytes), ...(bundleBytes ? { bundleDigest: `sha256:${createHash("sha256").update(bundleBytes).digest("hex")}` } : {}) })}\n`, { mode: 0o600 }).catch(() => undefined);
    }
    if (staging) await rm(staging, { recursive: true, force: true }).catch(() => undefined);
    if (destinationClaimed && !networkAttempted) await rm(destination, { recursive: true, force: true }).catch(() => undefined);
    const message = networkAttempted
      ? "Sigstore operation did not complete locally; a public transparency-log submission may have occurred. Verify provider status before retrying."
      : error instanceof Error ? error.message : "Sigstore operation failed.";
    if (input.json) console.log(JSON.stringify({ status: "error", code: "RECORD_SIGSTORE_INPUT", message: "Sigstore attestation failed", transparencyLogOutcome }));
    else if (!input.quiet) console.error(`[RECORD_SIGSTORE_INPUT] ${message}`);
    return 78;
  }
}

export async function verifyRecordSigstoreEvidence(input: {
  readonly bundlePath: string;
  readonly bindingPath: string;
  readonly trustedRootPath: string;
  readonly manifest: ReleaseRecordManifestDocument;
  readonly members: ReadonlyMap<string, Uint8Array>;
  readonly identity: string;
  readonly issuer: string;
}): Promise<{ readonly bundleDigest: string; readonly identity: string; readonly issuer: string }> {
  const [bundleBytes, bindingBytes, trustedRootBytes] = await Promise.all([
    readBoundedRegularFile(input.bundlePath, MAX_SIGSTORE_BUNDLE_BYTES, "Sigstore bundle"),
    readBoundedRegularFile(input.bindingPath, MAX_BINDING_BYTES, "Sigstore record binding"),
    readBoundedRegularFile(input.trustedRootPath, MAX_TRUST_ROOT_BYTES, "Sigstore trusted root"),
  ]);
  return verifyRecordSigstoreEvidenceBytes({ ...input, bundleBytes, bindingBytes, trustedRootBytes });
}

export function verifyRecordSigstoreEvidenceBytes(input: {
  readonly bundleBytes: Uint8Array;
  readonly bindingBytes: Uint8Array;
  readonly trustedRootBytes: Uint8Array;
  readonly manifest: ReleaseRecordManifestDocument;
  readonly members: ReadonlyMap<string, Uint8Array>;
  readonly identity: string;
  readonly issuer: string;
}): { readonly bundleDigest: string; readonly identity: string; readonly issuer: string } {
  const decisionMember = input.manifest.members.find((member) => member.kind === "release-decision");
  const decisionBytes = decisionMember ? input.members.get(decisionMember.path) : undefined;
  if (!decisionBytes) throw new Error("complete record release decision is missing");
  const decision = parseReleaseDecisionJson(Buffer.from(decisionBytes));
  const expectedStatement = releaseStatementBytes(input.manifest, decision.subjects.map((subject) => subject.subjectId));
  if (input.bundleBytes.byteLength === 0 || input.bundleBytes.byteLength > MAX_SIGSTORE_BUNDLE_BYTES) throw new Error("Sigstore bundle exceeds its size limit");
  if (input.bindingBytes.byteLength === 0 || input.bindingBytes.byteLength > MAX_BINDING_BYTES) throw new Error("Sigstore record binding exceeds its size limit");
  let parsedBinding: unknown;
  try { parsedBinding = JSON.parse(Buffer.from(input.bindingBytes).toString("utf8")) as unknown; }
  catch { throw new Error("Sigstore record binding is invalid JSON"); }
  const binding = parseSigstoreRecordBinding(parsedBinding);
  if (Buffer.from(input.bindingBytes).toString("utf8") !== `${canonicalizeJson(binding)}\n`) throw new Error("Sigstore record binding is not canonical");
  if (binding.manifestDigest !== releaseRecordManifestDigest(input.manifest)) throw new Error("Sigstore binding does not identify this Release Record manifest");
  const verification = verifySigstoreBundleBytes(input.bundleBytes, expectedStatement, input.trustedRootBytes, { identity: input.identity, issuer: input.issuer });
  if (binding.bundleDigest !== verification.bundleDigest || binding.signer.identity !== verification.identity || binding.signer.issuer !== verification.issuer || binding.verification !== "verified") {
    throw new Error("Sigstore record binding does not match the verified bundle signer or digest");
  }
  return verification;
}
