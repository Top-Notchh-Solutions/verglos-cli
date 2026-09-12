import { lstat, readFile } from "node:fs/promises";
import { authorizeAgentAction, installEngineArtifact, parseEngineManifest, putApprovalReceipt, verifyEngineManifestSignature, type ApprovalReceipt, type EngineManifest } from "@verglos/shared";
import { homedir } from "node:os";
import { join } from "node:path";

const MAX_ENGINE_ARTIFACT_BYTES = 256 * 1024 * 1024;

const MAX_MANIFEST_BYTES = 1 * 1024 * 1024;

async function readCompatibilityManifest(path: string, engineId: string, version: string, digest: string, publicKeyPath?: string): Promise<{ manifest: EngineManifest; signature: "verified" | "not-verified" }> {
  const entry = await lstat(path);
  if (!entry.isFile()) throw new Error("Engine compatibility manifest must be a regular file.");
  if (entry.size > MAX_MANIFEST_BYTES) throw new Error("Engine compatibility manifest exceeds the 1 MiB limit.");
  let manifest: EngineManifest;
  const bytes = await readFile(path);
  if (bytes.byteLength > MAX_MANIFEST_BYTES) throw new Error("Engine compatibility manifest exceeds the 1 MiB limit.");
  try { manifest = parseEngineManifest(JSON.parse(bytes.toString("utf8"))); }
  catch { throw new Error("Engine compatibility manifest is invalid JSON or schema."); }
  if (manifest.engineId !== engineId || manifest.version !== version) throw new Error("Engine compatibility manifest does not match the requested engine and version.");
  if (!manifest.artifacts.some((artifact) => artifact.digest === digest)) throw new Error("Engine compatibility manifest does not contain the requested artifact digest.");
  if (!publicKeyPath) return { manifest, signature: "not-verified" };
  const keyEntry = await lstat(publicKeyPath);
  if (!keyEntry.isFile() || keyEntry.size > 16 * 1024) throw new Error("Engine manifest public key must be a bounded regular file.");
  const publicKey = await readFile(publicKeyPath, "utf8");
  if (Buffer.byteLength(publicKey, "utf8") > 16 * 1024) throw new Error("Engine manifest public key must be a bounded regular file.");
  const trust = verifyEngineManifestSignature(manifest, publicKey);
  if (!trust.trusted) throw new Error(`Engine compatibility manifest signature is invalid (${trust.reason}).`);
  return { manifest, signature: "verified" };
}

export async function executeEngineInstall(engineId: string, version: string, artifactPath: string, digest: string, options: { action?: "install" | "update" | "rollback"; approve?: boolean; approvalReceipt?: ApprovalReceipt; approvalStoreRoot?: string; now?: string; json?: boolean; quiet?: boolean; manifestPath?: string; manifestPublicKeyPath?: string } = {}): Promise<number> {
  try {
    if (typeof engineId !== "string" || !engineId || typeof version !== "string" || !version || typeof artifactPath !== "string" || !artifactPath || typeof digest !== "string") {
      throw new Error("Engine install requires engine id, version, artifact path, and digest.");
    }
    if (!options.approve) throw new Error("Engine installation requires explicit approval (--approve).");
    if (!options.approvalReceipt) throw new Error("Engine installation requires an approval receipt (--approval-receipt).");
    const authorization = authorizeAgentAction("install", options.approvalReceipt, options.now ?? new Date().toISOString());
    if (!authorization.allowed) throw new Error(`Engine installation approval denied: ${authorization.reason}`);
    const target = `engine:${engineId}@${version}`;
    if (options.approvalReceipt.target !== target) throw new Error("approval receipt scope does not match the requested engine");
    if (!options.approvalReceipt.files.includes(artifactPath)) throw new Error("approval receipt does not cover the engine artifact");
    if (options.manifestPath && !options.approvalReceipt.files.includes(options.manifestPath)) throw new Error("approval receipt does not cover the compatibility manifest");
    if (options.approvalReceipt.network.length > 0) throw new Error("engine installation approval must not declare network scope");
    if (options.approvalStoreRoot) await putApprovalReceipt(options.approvalStoreRoot, options.approvalReceipt);
    if (options.manifestPublicKeyPath && !options.manifestPath) throw new Error("Engine manifest public key requires --manifest.");
    const entry = await lstat(artifactPath);
    if (!entry.isFile()) throw new Error("Engine artifact must be a regular file.");
    if (entry.size > MAX_ENGINE_ARTIFACT_BYTES) throw new Error("Engine artifact exceeds the 256 MiB limit.");
    const bytes = await readFile(artifactPath);
    if (bytes.byteLength > MAX_ENGINE_ARTIFACT_BYTES) throw new Error("Engine artifact exceeds the 256 MiB limit.");
    const compatibility = options.manifestPath ? await readCompatibilityManifest(options.manifestPath, engineId, version, digest, options.manifestPublicKeyPath) : undefined;
    const manifest = compatibility?.manifest;
    const cacheRoot = process.env.VERGLOS_ENGINE_CACHE ?? join(homedir(), ".cache", "verglos", "engines");
    const installed = await installEngineArtifact(cacheRoot, engineId, version, bytes, digest);
    const action = options.action ?? "install";
    if (!options.quiet) {
      if (options.json) console.log(JSON.stringify({ ...(action === "install" ? {} : { action }), engineId, version, path: installed, digest, compatibility: manifest ? { status: "declared", compatibleCli: manifest.compatibleCli, signature: compatibility?.signature } : { status: "not-evaluated", reason: "signed engine manifest was not provided" } }));
      else {
        const verb = action === "rollback" ? "Rolled back" : action === "update" ? "Updated" : "Installed";
        console.log(`${verb} ${engineId}@${version} at ${installed}`);
        console.log(manifest ? `Compatibility: declared for ${manifest.compatibleCli}; signature ${compatibility?.signature}` : "Compatibility: not evaluated (signed engine manifest not provided)");
      }
    }
    return 0;
  } catch (error) {
    if (options.json) console.log(JSON.stringify({ status: "error", code: "ENGINE_INSTALL_INPUT", message: "engine installation failed" }));
    else if (!options.quiet) console.error(error instanceof Error ? error.message : "Engine installation failed.");
    return 78;
  }
}
