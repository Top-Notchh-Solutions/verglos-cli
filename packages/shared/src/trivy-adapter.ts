import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { parseEngineHealth, type EngineHealthDocument } from "./engine.js";
import type { EngineAdapter, EngineExecutionRequest, EngineExecutionResult, EngineRawOutput } from "./engine-adapter.js";

const execFileAsync = promisify(execFile);
const digest = (value: string) => createHash("sha256").update(value, "utf8").digest("hex");

export class TrivyAdapter implements EngineAdapter {
  readonly id = "trivy"; readonly version = "1";
  readonly capabilities = [{ id: "trivy.scan", description: "Trivy vulnerability and misconfiguration scan", requiresNetwork: false }] as const;
  readonly requirements = { runtime: "native", executable: "trivy" } as const;
  async health(): Promise<EngineHealthDocument> {
    const observedAt = new Date().toISOString(); let version = "unavailable"; let state: "healthy" | "unavailable" = "unavailable";
    try { const result = await execFileAsync("trivy", ["--version"], { encoding: "utf8", timeout: 5_000 }); version = result.stdout.trim().slice(0, 128) || "unknown"; state = "healthy"; } catch { /* explicit unavailable state below */ }
    return parseEngineHealth({ schemaId: "urn:verglos:schema:engine-health", schemaVersion: "1.0.0", producer: { id: "trivy", kind: "external", name: "Trivy", version }, observedAt, state, components: [{ id: "trivy.binary", kind: "binary", name: "trivy", version, digest: { algorithm: "sha256", value: digest(version) }, source: "system", trust: "computed-only" }], capabilities: [{ id: "trivy.scan", subjectKinds: ["repository-tree", "filesystem", "artifact", "oci-manifest", "oci-index"], status: state === "healthy" ? "supported" : "unsupported" }], freshness: [{ componentId: "trivy.binary", status: "unknown", checkedAt: observedAt }], incompleteReasons: state === "healthy" ? [] : [{ code: "engine-missing", scope: "trivy.binary", message: "Trivy executable is unavailable.", action: "Install or configure a managed Trivy engine." }] });
  }
  async execute(_request: EngineExecutionRequest): Promise<EngineExecutionResult> { throw new Error("Trivy execution is not enabled until the managed process boundary is qualified."); }
  normalize(_raw: EngineRawOutput) { return []; }
  updateMetadata() { return { channel: "managed" as "stable", source: "system", digest: undefined }; }
}

export const trivyAdapter = new TrivyAdapter();
