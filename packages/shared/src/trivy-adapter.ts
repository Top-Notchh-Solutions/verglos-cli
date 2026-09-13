import { randomUUID, createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { lstat, mkdtemp, readFile, realpath, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { parseEngineHealth, parseToolRun, type EngineHealthDocument, type EngineHealthSnapshot, type ToolRunDocument } from "./engine.js";
import { type EngineAdapter, type EngineExecutionRequest, type EngineExecutionResult, type EngineRawOutput, assertEngineRequestBound } from "./engine-adapter.js";
import { parseObservation, type ObservationDocument } from "./observation.js";
import { parseTrivyFindings } from "./trivy-parser.js";

export const TRIVY_IMAGE = "ghcr.io/aquasecurity/trivy@sha256:62b1e65e8869bc4b4c6aa4fa2b21595256c7c2f6018a9d9ad61caf87187c1969";
export const TRIVY_CAPABILITIES = Object.freeze(["trivy.misconfiguration", "trivy.secrets"] as const);
const TRIVY_IMAGE_DIGEST = TRIVY_IMAGE.split("@sha256:")[1]!;
const MAX_OUTPUT_BYTES = 16 * 1024 * 1024;
const MAX_FINDINGS = 20_000;
const execFileAsync = promisify(execFile);

export interface TrivyDockerProcessResult { readonly stdout: string | Uint8Array; readonly stderr?: string | Uint8Array; }
export interface TrivyDockerProcessOptions { readonly timeout: number; readonly maxBuffer: number; readonly signal?: AbortSignal; }
export interface TrivyDockerAdapterOptions {
  readonly executable?: string;
  readonly run?: (executable: string, args: readonly string[], options: TrivyDockerProcessOptions) => Promise<TrivyDockerProcessResult>;
  readonly now?: () => Date;
}

function digestBytes(value: Uint8Array): `sha256:${string}` {
  return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}

function bytes(value: string | Uint8Array): Uint8Array {
  return typeof value === "string" ? Buffer.from(value, "utf8") : Uint8Array.from(value);
}

function safeText(value: string, limit: number): string {
  return value.replace(/[\u0000-\u001f\u007f]/gu, " ").slice(0, limit).trim() || "unknown";
}

function dockerIsolationArgs(): string[] {
  return [
    "run", "--rm", "--pull=never", "--network", "none", "--read-only",
    "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
    "--pids-limit", "128", "--memory", "1g", "--cpus", "2",
    "--user", "65532:65532", "--tmpfs", "/tmp:rw,noexec,nosuid,size=64m",
  ];
}

export function trivyDockerArguments(targetPath: string, cidFile: string): readonly string[] {
  if (!targetPath || !targetPath.startsWith("/") && !/^[A-Za-z]:[\\/]/u.test(targetPath) || /[\u0000-\u001f\u007f,]/u.test(targetPath)) {
    throw new Error("Trivy target must be an absolute directory path without control characters or commas.");
  }
  return Object.freeze([
    ...dockerIsolationArgs(),
    "--cidfile", cidFile,
    "--mount", `type=bind,source=${targetPath},target=/workspace,readonly`,
    TRIVY_IMAGE,
    "fs", "--format", "json", "--scanners", "misconfig,secret",
    "--skip-db-update", "--skip-check-update", "--skip-version-check",
    "--cache-dir", "/tmp/cache", "/workspace",
  ]);
}

function healthUnavailable(now: string, message: string): EngineHealthDocument {
  return parseEngineHealth({
    schemaId: "urn:verglos:schema:engine-health",
    schemaVersion: "1.0.0",
    producer: { id: "trivy", kind: "external", name: "Trivy in pinned Docker image", version: "unavailable" },
    observedAt: now,
    state: "unavailable",
    components: [],
    capabilities: TRIVY_CAPABILITIES.map((id) => ({ id, subjectKinds: ["filesystem", "repository-tree"], status: "unsupported" })),
    freshness: [],
    incompleteReasons: [{ code: "engine-missing", scope: "trivy.image", message, action: "Install the exact pinned Trivy image locally; Verglos never pulls images during inspection." }],
  });
}

function toObservation(finding: ReturnType<typeof parseTrivyFindings>["findings"][number], input: { subjectId: string; runId: `urn:uuid:${string}` }): ObservationDocument {
  const category = finding.kind === "misconfiguration" ? "configuration.misconfiguration" : finding.kind === "secret" ? "security.secret" : "security.vulnerability";
  const location = finding.kind === "vulnerability"
    ? { kind: "package" as const, ecosystem: "unknown", name: finding.packageName ?? "unknown", version: finding.installedVersion ?? "unknown" }
    : { kind: "source" as const, path: finding.target!, startLine: finding.startLine! };
  return parseObservation({
    schemaId: "urn:verglos:schema:observation",
    schemaVersion: "1.0.0",
    observationId: `urn:uuid:${randomUUID()}`,
    subjectId: input.subjectId,
    origin: {
      kind: "adapter",
      producerId: "trivy",
      runId: input.runId,
      ruleId: `trivy.${finding.kind}.${finding.ruleId}`,
      rawEvidenceDigest: { algorithm: "sha256", value: finding.rawEvidenceDigest.slice(7) },
    },
    coverageClass: "external",
    category,
    title: safeText(finding.title, 512),
    description: finding.kind === "secret"
      ? "Trivy reported a secret-pattern match; matched values and source excerpts are intentionally omitted."
      : finding.kind === "misconfiguration"
        ? "Trivy reported a configuration finding; source excerpts are intentionally omitted."
        : "Trivy reported a vulnerability; raw tool output is intentionally not retained in the snapshot.",
    locations: [location],
    severity: { original: { system: "trivy", value: finding.severity }, normalized: finding.severity, mapping: { id: "verglos.severity.v1", version: "1.0.0" } },
    confidence: { level: "unknown", method: "trivy.adapter.v1", mappingVersion: "1.0.0" },
    evidence: [],
    references: [],
    extensions: {},
  });
}

export class DockerTrivyAdapter implements EngineAdapter {
  readonly id = "trivy";
  readonly version = "1";
  readonly capabilities = Object.freeze([
    { id: "trivy.misconfiguration", description: "Offline Trivy infrastructure misconfiguration scan", requiresNetwork: false },
    { id: "trivy.secrets", description: "Offline Trivy secret-pattern scan; matched values are omitted", requiresNetwork: false },
  ] as const);
  readonly requirements = Object.freeze({ runtime: "docker-container", executable: "docker" });
  private lastHealth?: EngineHealthDocument;
  private readonly executable: string;
  private readonly now: () => Date;
  private readonly run: (executable: string, args: readonly string[], options: TrivyDockerProcessOptions) => Promise<TrivyDockerProcessResult>;

  constructor(options: TrivyDockerAdapterOptions = {}) {
    this.executable = options.executable ?? "docker";
    this.now = options.now ?? (() => new Date());
    this.run = options.run ?? (async (executable, args, processOptions) => {
      const result = await execFileAsync(executable, [...args], {
        encoding: "buffer",
        timeout: processOptions.timeout,
        maxBuffer: processOptions.maxBuffer,
        ...(processOptions.signal ? { signal: processOptions.signal } : {}),
      });
      return { stdout: result.stdout, stderr: result.stderr };
    });
  }

  async health(): Promise<EngineHealthDocument> {
    const now = this.now().toISOString();
    try {
      const inspected = await this.run(this.executable, ["image", "inspect", "--format", "{{json .RepoDigests}}", TRIVY_IMAGE], { timeout: 5_000, maxBuffer: 4_096 });
      const inspectedBytes = bytes(inspected.stdout);
      if (inspectedBytes.byteLength > 4_096) throw new Error("image inspection exceeded its bound");
      const repositoryDigests: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(inspectedBytes));
      if (!Array.isArray(repositoryDigests) || !repositoryDigests.includes(TRIVY_IMAGE)) throw new Error("pinned image digest is absent");
      const versionResult = await this.run(this.executable, [...dockerIsolationArgs(), TRIVY_IMAGE, "--version"], { timeout: 5_000, maxBuffer: 4_096 });
      const versionBytes = bytes(versionResult.stdout);
      if (versionBytes.byteLength > 4_096) throw new Error("version probe exceeded its bound");
      const versionOutput = new TextDecoder("utf-8", { fatal: true }).decode(versionBytes);
      const version = /\b(\d+\.\d+\.\d+(?:[-+][A-Za-z0-9.-]+)?)\b/u.exec(versionOutput)?.[1];
      if (!version) throw new Error("version probe did not identify Trivy");
      this.lastHealth = parseEngineHealth({
        schemaId: "urn:verglos:schema:engine-health",
        schemaVersion: "1.0.0",
        producer: { id: "trivy", kind: "external", name: "Trivy in pinned Docker image", version },
        observedAt: now,
        state: "healthy",
        components: [{ id: "trivy.image", kind: "binary", name: "Trivy OCI image", version, digest: { algorithm: "sha256", value: TRIVY_IMAGE_DIGEST }, source: "remote", trust: "computed-only" }],
        capabilities: TRIVY_CAPABILITIES.map((id) => ({ id, subjectKinds: ["filesystem", "repository-tree"], status: "supported" })),
        freshness: [{ componentId: "trivy.image", status: "current", checkedAt: now }],
        incompleteReasons: [],
      });
      return this.lastHealth;
    } catch {
      this.lastHealth = healthUnavailable(now, "The exact pinned Trivy image or Docker runtime is unavailable.");
      return this.lastHealth;
    }
  }

  async execute(request: EngineExecutionRequest): Promise<EngineExecutionResult> {
    assertEngineRequestBound(request);
    if (request.network !== "denied" || request.allowlist?.length) throw new Error("Trivy container execution requires denied network access.");
    if (request.timeoutMs > 30_000) throw new Error("Trivy container execution exceeds the 30-second inspection limit.");
    if (!request.targetPath || !request.targetPath.startsWith("/") && !/^[A-Za-z]:[\\/]/u.test(request.targetPath)) throw new Error("Trivy requires an absolute filesystem target path.");
    if (request.capabilities.length !== TRIVY_CAPABILITIES.length || TRIVY_CAPABILITIES.some((capability) => !request.capabilities.includes(capability))) throw new Error("Trivy request must select the supported misconfiguration and secret capabilities.");
    const health = this.lastHealth ?? await this.health();
    if (health.state !== "healthy") throw new Error("Pinned Trivy runtime is unavailable.");
    const original = await lstat(request.targetPath);
    if (!original.isDirectory() || original.isSymbolicLink()) throw new Error("Trivy target must be a regular directory, not a symlink.");
    const targetPath = await realpath(request.targetPath);
    if (/[\u0000-\u001f\u007f,]/u.test(targetPath)) throw new Error("Trivy target path contains unsupported characters.");
    if (request.signal?.aborted) throw new Error("inspection cancelled");

    const runId = `urn:uuid:${randomUUID()}` as const;
    const startedAt = this.now();
    const temp = await mkdtemp(join(tmpdir(), "verglos-trivy-"));
    const cidFile = join(temp, "container-id");
    let rawBytes: Uint8Array;
    let diagnosticBytes: Uint8Array;
    try {
      const result = await this.run(this.executable, trivyDockerArguments(targetPath, cidFile), { timeout: request.timeoutMs, maxBuffer: MAX_OUTPUT_BYTES, signal: request.signal });
      rawBytes = bytes(result.stdout);
      diagnosticBytes = bytes(result.stderr ?? new Uint8Array());
      if (rawBytes.byteLength > MAX_OUTPUT_BYTES || diagnosticBytes.byteLength > MAX_OUTPUT_BYTES) throw new Error("Trivy output exceeds its configured byte limit.");
    } catch (error) {
      let containerId: string | undefined;
      try {
        containerId = (await readFile(cidFile, "utf8")).trim();
        if (!/^[a-f0-9]{64}$/u.test(containerId)) containerId = undefined;
      } catch { /* no container was created */ }
      if (containerId) await this.run(this.executable, ["rm", "--force", containerId], { timeout: 5_000, maxBuffer: 1_024 }).catch(() => undefined);
      if (request.signal?.aborted) throw new Error("inspection cancelled");
      throw error;
    } finally {
      await rm(temp, { recursive: true, force: true });
    }

    const completedAt = this.now();
    const parsed = parseTrivyFindings(rawBytes, { maxBytes: MAX_OUTPUT_BYTES, maxResults: MAX_FINDINGS });
    const observations = parsed.findings.map((finding) => toObservation(finding, { subjectId: request.targetSubjectId, runId }));
    const { schemaId: _schemaId, schemaVersion: _schemaVersion, ...engine } = health;
    const incompleteReasons: ToolRunDocument["incompleteReasons"] = [{
      code: "offline-data-missing",
      scope: "trivy.vulnerability",
      message: "This offline profile does not run vulnerability scanning without a qualified local vulnerability database; misconfiguration checks use image-embedded rules whose freshness is not verified.",
      action: "Treat Trivy coverage as incomplete; provide a separately qualified offline database and rule set before relying on vulnerability coverage.",
    }];
    if (diagnosticBytes.byteLength > 0) incompleteReasons.push({ code: "partial-output", scope: "trivy.diagnostics", message: "Trivy emitted diagnostic output; its content was omitted, so scan completeness cannot be independently established.", action: "Review Trivy diagnostics locally and verify the scanner had read access to the full target." });
    if (parsed.omittedCount > 0) incompleteReasons.push({ code: "partial-output", scope: "trivy.findings", message: `${parsed.omittedCount} Trivy finding(s) lacked a safe bounded identity or relative source location and were omitted.`, action: "Review the raw local Trivy output separately; omitted findings are not represented in this snapshot." });
    const run = parseToolRun({
      schemaId: "urn:verglos:schema:tool-run",
      schemaVersion: "1.0.0",
      runId,
      subjectId: request.targetSubjectId,
      engine,
      requestedCapabilities: [...TRIVY_CAPABILITIES],
      executedCapabilities: [...TRIVY_CAPABILITIES],
      executionClass: "container",
      networkAccess: "none",
      targetCodeExecuted: false,
      startedAt: startedAt.toISOString(),
      completedAt: completedAt.toISOString(),
      durationMs: Math.max(0, completedAt.getTime() - startedAt.getTime()),
      timeoutMs: request.timeoutMs,
      outcome: "succeeded",
      processResult: { kind: "exited", code: 0 },
      coverage: "incomplete",
      incompleteReasons,
    });
    const digest = digestBytes(rawBytes);
    const rawOutput: EngineRawOutput = { mediaType: "application/json", bytes: rawBytes, digest, redacted: false };
    return Object.freeze({ run, observations: Object.freeze(observations), rawOutput });
  }

  normalize(_raw: EngineRawOutput): readonly ObservationDocument[] { return []; }
  updateMetadata() { return { channel: "pinned" as const, source: "ghcr.io/aquasecurity/trivy", digest: `sha256:${TRIVY_IMAGE_DIGEST}` }; }
}

export const trivyAdapter = new DockerTrivyAdapter();
