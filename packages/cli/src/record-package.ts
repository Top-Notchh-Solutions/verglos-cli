import { createHash } from "node:crypto";
import { lstat, mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from "node:path";
import {
  assertCompleteReleaseRecord,
  assertCompleteReleaseRecordPayloads,
  assertProviderProvenancePayloads,
  assertReleaseRecordRedactionPayloads,
  canonicalizeJson,
  createReleaseRecordPackageDescriptor,
  createReleaseStatement,
  parseReleaseDecisionJson,
  parseReleaseRecordPackageDescriptor,
  parseReleaseRecordManifestJson,
  readAndVerifyRecord,
  releaseRecordManifestDigest,
  renderReleaseRecordViewer,
  verifyReleaseRecordSignature,
} from "@verglos/shared";
import { SIGSTORE_BINDING_NAME, SIGSTORE_BUNDLE_NAME, MAX_SIGSTORE_BUNDLE_BYTES, MAX_TRUST_ROOT_BYTES, readBoundedRegularFile, verifyRecordSigstoreEvidenceBytes } from "./record-sigstore.js";

const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;
const MAX_SIGNATURE_BYTES = 16 * 1024;
const MAX_EXPORT_BYTES = 1024 * 1024;
const MAX_SIGSTORE_BINDING_BYTES = 16 * 1024;

export interface RecordPackageSigstoreOptions {
  readonly bundlePath?: string;
  readonly bindingPath?: string;
  readonly trustedRootPath?: string;
  readonly issuer?: string;
  readonly identity?: string;
}

async function readRegularFile(path: string, limit: number, label: string): Promise<Buffer> {
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > limit) throw new Error(`${label} must be a bounded regular file`);
  const bytes = await readFile(path);
  if (bytes.byteLength > limit) throw new Error(`${label} must be a bounded regular file`);
  return bytes;
}

/** Build a local, portable directory package. This command never publishes or uploads it. */
export async function executeRecordPackage(
  storeRoot: string,
  manifestPath: string,
  outputPath: string,
  json = false,
  quiet = false,
  signaturePath?: string,
  publicKeyPath?: string,
  trustedIssuer?: string,
  trustedSigner?: string,
  sigstoreOptions: RecordPackageSigstoreOptions = {},
): Promise<number> {
  let staging: string | undefined;
  try {
    const sourceRoot = resolve(storeRoot);
    const destination = resolve(outputPath);
    if (!destination.toLowerCase().endsWith(".vgl")) throw new Error("record package output must use the .vgl suffix");
    const relativeToSource = relative(sourceRoot, destination);
    if (relativeToSource === "" || (!isAbsolute(relativeToSource) && relativeToSource !== ".." && !relativeToSource.startsWith(`..${sep}`))) {
      throw new Error("record package output must be outside the source store");
    }
    try {
      await lstat(destination);
      throw new Error("record package output already exists");
    } catch (error) {
      if (!(error instanceof Error) || (error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }

    const manifest = assertCompleteReleaseRecord(parseReleaseRecordManifestJson(await readRegularFile(manifestPath, MAX_MANIFEST_BYTES, "record manifest")));
    const members = await readAndVerifyRecord(sourceRoot, manifest);
    assertReleaseRecordRedactionPayloads(manifest, members);
    assertProviderProvenancePayloads(manifest, members);
    assertCompleteReleaseRecordPayloads(manifest, members);

    if (Boolean(signaturePath) !== Boolean(publicKeyPath) || Boolean(signaturePath) !== Boolean(trustedIssuer)) {
      throw new Error("packaging a signature requires its public key and exact trusted issuer");
    }
    let signatureBytes: Buffer | undefined;
    if (signaturePath && publicKeyPath && trustedIssuer) {
      signatureBytes = await readRegularFile(signaturePath, MAX_SIGNATURE_BYTES, "record signature");
      const publicKey = (await readRegularFile(publicKeyPath, MAX_SIGNATURE_BYTES, "record public key")).toString("utf8");
      let envelope: unknown;
      try { envelope = JSON.parse(signatureBytes.toString("utf8")) as unknown; }
      catch { throw new Error("record signature envelope is invalid JSON"); }
      const verification = verifyReleaseRecordSignature(manifest, envelope, publicKey);
      if (!verification.verified) throw new Error(`record signature verification failed: ${verification.reason}`);
      if (!verification.identityBound) throw new Error("legacy record signature verifies manifest bytes only; its signer, issuer, and timestamp are not cryptographically bound");
      if (verification.signer.issuer !== trustedIssuer) throw new Error("record signature issuer is not trusted");
      if (trustedSigner && verification.signer.id !== trustedSigner) throw new Error("record signature signer is not trusted");
      const signedAt = typeof envelope === "object" && envelope !== null && "signedAt" in envelope ? Date.parse(String((envelope as { signedAt: unknown }).signedAt)) : NaN;
      if (!Number.isFinite(signedAt) || signedAt < Date.parse(manifest.generatedAt)) throw new Error("record signature timestamp predates manifest generation");
      signatureBytes = Buffer.from(`${canonicalizeJson(envelope)}\n`, "utf8");
    } else if (publicKeyPath || trustedIssuer || trustedSigner) {
      throw new Error("signature trust options require --signature");
    }

    const sigstorePaths = [sigstoreOptions.bundlePath, sigstoreOptions.bindingPath, sigstoreOptions.trustedRootPath, sigstoreOptions.issuer, sigstoreOptions.identity];
    const sigstoreIncluded = sigstorePaths.some(Boolean);
    if (sigstoreIncluded && sigstorePaths.some((path) => !path)) {
      throw new Error("Sigstore packaging requires --sigstore-bundle, --sigstore-binding, --trusted-root, --certificate-issuer, and --certificate-identity together");
    }
    const sigstoreBundleBytes = sigstoreOptions.bundlePath ? await readBoundedRegularFile(sigstoreOptions.bundlePath, MAX_SIGSTORE_BUNDLE_BYTES, "Sigstore bundle") : undefined;
    const sigstoreBindingBytes = sigstoreOptions.bindingPath ? await readBoundedRegularFile(sigstoreOptions.bindingPath, MAX_SIGSTORE_BINDING_BYTES, "Sigstore record binding") : undefined;
    if (sigstoreIncluded && sigstoreBundleBytes && sigstoreBindingBytes && sigstoreOptions.trustedRootPath && sigstoreOptions.issuer && sigstoreOptions.identity) {
      const trustedRootBytes = await readBoundedRegularFile(sigstoreOptions.trustedRootPath, MAX_TRUST_ROOT_BYTES, "Sigstore trusted root");
      verifyRecordSigstoreEvidenceBytes({
        bundleBytes: sigstoreBundleBytes,
        bindingBytes: sigstoreBindingBytes,
        trustedRootBytes,
        manifest,
        members,
        identity: sigstoreOptions.identity,
        issuer: sigstoreOptions.issuer,
      });
    }

    const decisionMember = manifest.members.find((member) => member.kind === "release-decision");
    if (!decisionMember) throw new Error("complete record has no release decision");
    const decisionBytes = members.get(decisionMember.path);
    if (!decisionBytes) throw new Error("complete record release decision is missing");
    const decision = parseReleaseDecisionJson(decisionBytes);
    const statement = createReleaseStatement(manifest, decision.subjects.map((subject) => subject.subjectId));
    const exportBytes = Buffer.from(`${canonicalizeJson(statement)}\n`, "utf8");
    if (exportBytes.byteLength > MAX_EXPORT_BYTES) throw new Error("record export exceeds the 1 MiB limit");
    const viewerBytes = Buffer.from(renderReleaseRecordViewer({ manifest, decision, signatureIncluded: Boolean(signatureBytes), sigstoreIncluded }), "utf8");
    const descriptor = createReleaseRecordPackageDescriptor(manifest, Boolean(signatureBytes), sigstoreIncluded);
    const descriptorBytes = Buffer.from(`${canonicalizeJson(descriptor)}\n`, "utf8");
    const manifestBytes = Buffer.from(`${canonicalizeJson(manifest)}\n`, "utf8");
    if (manifestBytes.byteLength > MAX_MANIFEST_BYTES) throw new Error("record manifest exceeds the 8 MiB limit");

    await mkdir(dirname(destination), { recursive: true });
    staging = await mkdtemp(`${destination}.staging-`);
    await writeFile(join(staging, "manifest.json"), manifestBytes, { flag: "wx", mode: 0o600 });
    for (const member of manifest.members) {
      if (member.redaction === "omitted") continue;
      const bytes = members.get(member.path);
      if (!bytes) throw new Error(`verified record member is missing: ${member.path}`);
      await writeFile(join(staging, `${member.digest.algorithm}-${member.digest.value}`), bytes, { flag: "wx", mode: 0o600 });
    }
    await writeFile(join(staging, ".vgl-package.json"), descriptorBytes, { flag: "wx", mode: 0o600 });
    await writeFile(join(staging, ".vgl-viewer.html"), viewerBytes, { flag: "wx", mode: 0o600 });
    await writeFile(join(staging, ".vgl-release.intoto.json"), exportBytes, { flag: "wx", mode: 0o600 });
    if (signatureBytes) await writeFile(join(staging, ".vgl-signature.json"), signatureBytes, { flag: "wx", mode: 0o600 });
    if (sigstoreBundleBytes && sigstoreBindingBytes) {
      await writeFile(join(staging, SIGSTORE_BUNDLE_NAME), sigstoreBundleBytes, { flag: "wx", mode: 0o600 });
      await writeFile(join(staging, SIGSTORE_BINDING_NAME), sigstoreBindingBytes, { flag: "wx", mode: 0o600 });
    }
    await rename(staging, destination);
    staging = undefined;

    const bytes = manifestBytes.byteLength + descriptorBytes.byteLength + viewerBytes.byteLength + exportBytes.byteLength + (signatureBytes?.byteLength ?? 0) + (sigstoreBundleBytes?.byteLength ?? 0) + (sigstoreBindingBytes?.byteLength ?? 0)
      + manifest.members.filter((member) => member.redaction !== "omitted").reduce((total, member) => total + (members.get(member.path)?.byteLength ?? 0), 0);
    const result = { packaged: true, transport: "directory-v1", outputPath: destination, manifestDigest: releaseRecordManifestDigest(manifest), members: members.size, bytes, signature: signatureBytes ? "verified-included" : "not-included", sigstore: sigstoreIncluded ? "verified-included" : "not-included", uploadPerformed: false, includesNonOmittedEvidence: true };
    if (json) console.log(JSON.stringify(result));
    else if (!quiet) console.log(`Created local .vgl directory package ${destination}. It includes all non-omitted evidence bytes; inspect it and keep it private before sharing. No upload was performed.`);
    return 0;
  } catch (error) {
    if (staging) await rm(staging, { recursive: true, force: true }).catch(() => undefined);
    if (json) console.log(JSON.stringify({ status: "error", code: "RECORD_PACKAGE_INPUT", message: "record package creation failed" }));
    else if (!quiet) console.error(error instanceof Error ? error.message : "record package creation failed");
    return 78;
  }
}

export async function verifyRecordPackageArtifacts(input: {
  readonly root: string;
  readonly manifest: Parameters<typeof createReleaseRecordPackageDescriptor>[0];
  readonly members: ReadonlyMap<string, Uint8Array>;
}): Promise<{ readonly packaged: boolean; readonly signaturePath?: string; readonly sigstoreBundlePath?: string; readonly sigstoreBindingPath?: string; readonly sigstoreIncluded?: boolean }> {
  const expectsPackage = basename(resolve(input.root)).toLowerCase().endsWith(".vgl");
  if (expectsPackage) {
    const rootEntry = await lstat(input.root);
    if (!rootEntry.isDirectory()) throw new Error(".vgl package root must be a regular directory");
  }
  const descriptorPath = join(input.root, ".vgl-package.json");
  let descriptorBytes: Buffer;
  try {
    const descriptor = await lstat(descriptorPath);
    if (!descriptor.isFile() || descriptor.size > 4096) throw new Error(".vgl package descriptor must be a bounded regular file");
    descriptorBytes = await readFile(descriptorPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      if (expectsPackage) throw new Error(".vgl package descriptor is missing");
      return { packaged: false };
    }
    throw error;
  }
  if (descriptorBytes.byteLength > 4096) throw new Error(".vgl package descriptor exceeds the 4 KiB limit");
  let parsed: unknown;
  try { parsed = JSON.parse(descriptorBytes.toString("utf8")) as unknown; }
  catch { throw new Error(".vgl package descriptor is invalid JSON"); }
  const descriptor = parseReleaseRecordPackageDescriptor(parsed);
  if (descriptorBytes.toString("utf8") !== `${canonicalizeJson(descriptor)}\n`) throw new Error(".vgl package descriptor is not in canonical form");
  const sigstoreIncluded = "sigstoreIncluded" in descriptor && descriptor.sigstoreIncluded;
  const expectedDescriptor = descriptor.schemaVersion === "1.0.0"
    ? { schemaId: "urn:verglos:schema:release-record-package", schemaVersion: "1.0.0", transport: "directory-v1", manifestDigest: releaseRecordManifestDigest(input.manifest), signatureIncluded: descriptor.signatureIncluded }
    : createReleaseRecordPackageDescriptor(input.manifest, descriptor.signatureIncluded, sigstoreIncluded);
  if (canonicalizeJson(descriptor) !== canonicalizeJson(expectedDescriptor)) throw new Error(".vgl package descriptor does not bind this Release Record manifest");

  const expectedExport = await createPackageExport(input.manifest, input.members);
  await assertExactRegularFile(join(input.root, ".vgl-release.intoto.json"), expectedExport, MAX_EXPORT_BYTES, "record package export");
  const expectedViewer = createPackageViewer(input.manifest, input.members, descriptor.signatureIncluded, sigstoreIncluded);
  await assertExactRegularFile(join(input.root, ".vgl-viewer.html"), expectedViewer, 256 * 1024, "record package viewer");

  const expectedNames = new Set([
    "manifest.json",
    ...input.manifest.members.filter((member) => member.redaction !== "omitted").map((member) => `${member.digest.algorithm}-${member.digest.value}`),
    ".vgl-package.json", ".vgl-viewer.html", ".vgl-release.intoto.json",
    ...(descriptor.signatureIncluded ? [".vgl-signature.json"] : []),
    ...(sigstoreIncluded ? [SIGSTORE_BUNDLE_NAME, SIGSTORE_BINDING_NAME] : []),
  ]);
  const actualNames = await readdir(input.root);
  if (actualNames.length !== expectedNames.size || actualNames.some((name) => !expectedNames.has(name))) throw new Error(".vgl package contains missing or unexpected entries");
  for (const name of actualNames) {
    const entry = await lstat(join(input.root, name));
    if (!entry.isFile()) throw new Error(".vgl package entries must be regular files");
  }
  const expectedManifest = Buffer.from(`${canonicalizeJson(input.manifest)}\n`, "utf8");
  await assertExactRegularFile(join(input.root, "manifest.json"), expectedManifest, MAX_MANIFEST_BYTES, "record package manifest");

  const signaturePath = join(input.root, ".vgl-signature.json");
  let signatureExists = false;
  try {
    const entry = await lstat(signaturePath);
    if (!entry.isFile() || entry.size > MAX_SIGNATURE_BYTES) throw new Error(".vgl package signature must be a bounded regular file");
    signatureExists = true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  if (signatureExists !== descriptor.signatureIncluded) throw new Error(".vgl package signature presence does not match its descriptor");
  const sigstoreBundlePath = join(input.root, SIGSTORE_BUNDLE_NAME);
  const sigstoreBindingPath = join(input.root, SIGSTORE_BINDING_NAME);
  const sigstoreBundleExists = await assertOptionalBoundedRegularFile(sigstoreBundlePath, MAX_SIGSTORE_BUNDLE_BYTES, "Sigstore bundle");
  const sigstoreBindingExists = await assertOptionalBoundedRegularFile(sigstoreBindingPath, MAX_SIGSTORE_BINDING_BYTES, "Sigstore record binding");
  if (sigstoreBundleExists !== sigstoreIncluded || sigstoreBindingExists !== sigstoreIncluded) throw new Error(".vgl package Sigstore evidence presence does not match its descriptor");
  return { packaged: true, ...(signatureExists ? { signaturePath } : {}), ...(sigstoreIncluded ? { sigstoreBundlePath, sigstoreBindingPath, sigstoreIncluded: true } : { sigstoreIncluded: false }) };
}

async function createPackageExport(manifest: Parameters<typeof createReleaseRecordPackageDescriptor>[0], members: ReadonlyMap<string, Uint8Array>): Promise<Buffer> {
  const decisionMember = manifest.members.find((member) => member.kind === "release-decision");
  if (!decisionMember) throw new Error("complete package has no release decision");
  const bytes = members.get(decisionMember.path);
  if (!bytes) throw new Error("complete package release decision is missing");
  const decision = parseReleaseDecisionJson(bytes);
  return Buffer.from(`${canonicalizeJson(createReleaseStatement(manifest, decision.subjects.map((subject) => subject.subjectId)))}\n`, "utf8");
}

function createPackageViewer(manifest: Parameters<typeof createReleaseRecordPackageDescriptor>[0], members: ReadonlyMap<string, Uint8Array>, signatureIncluded: boolean, sigstoreIncluded: boolean): Buffer {
  const decisionMember = manifest.members.find((member) => member.kind === "release-decision");
  if (!decisionMember) throw new Error("complete package has no release decision");
  const bytes = members.get(decisionMember.path);
  if (!bytes) throw new Error("complete package release decision is missing");
  return Buffer.from(renderReleaseRecordViewer({ manifest, decision: parseReleaseDecisionJson(bytes), signatureIncluded, sigstoreIncluded }), "utf8");
}

async function assertOptionalBoundedRegularFile(path: string, limit: number, label: string): Promise<boolean> {
  try {
    await readBoundedRegularFile(path, limit, label);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw error;
  }
}

async function assertExactRegularFile(path: string, expected: Uint8Array, limit: number, label: string): Promise<void> {
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > limit || entry.size !== expected.byteLength) throw new Error(`${label} is missing or has an invalid size`);
  const actual = await readFile(path);
  if (actual.byteLength !== expected.byteLength || !createHash("sha256").update(actual).digest().equals(createHash("sha256").update(expected).digest())) throw new Error(`${label} does not match the verified Release Record projection`);
}
