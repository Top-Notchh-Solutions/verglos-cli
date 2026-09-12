import { randomUUID, createHash } from "node:crypto";
import {
  InspectCoverageManifestSchema,
  buildLineageGraph,
  canonicalizeJson,
  correlateObservations,
  createReleaseSnapshot,
  nativeFindingToObservation,
  parseEngineHealth,
  parseObservation,
  parseSubject,
  parseToolRun,
  importSarif,
  importCycloneDx,
  importCycloneDxVex,
  importSpdx,
  importInTotoProvenance,
  normalizeSeverity,
  RelativeSubjectPathSchema,
  planInspect,
  projectNativeFinding,
  type EngineAdapter,
  type EngineExecutionRequest,
  type InspectCoverageManifest,
  type InspectProducer,
  type ObservationDocument,
  type ScanOptions,
  type ScanProgressEvent,
  type Subject,
  type TargetResolution,
  type TargetSpec,
} from "@verglos/shared";
import { runScan } from "./index.js";

const MAX_ADAPTERS = 4;
const MAX_IMPORTS = 32;
const MAX_IMPORT_BYTES = 8 * 1024 * 1024;
const MAX_OBSERVATIONS = 20_000;
const MAX_RAW_OUTPUT_BYTES = 16 * 1024 * 1024;

export interface InspectionProgressEvent {
  readonly phase: "target" | "producer" | "snapshot";
  readonly producer?: InspectProducer;
  readonly status: "started" | "completed" | "incomplete";
}

export interface ImportedEvidenceBatch {
  readonly producer: Exclude<InspectProducer, "native" | "trivy">;
  readonly bytes: Uint8Array;
}

export interface InspectionEngine {
  readonly producer: "trivy";
  readonly adapter: EngineAdapter;
  readonly request: Omit<EngineExecutionRequest, "signal" | "targetSubjectId">;
}

export interface InspectionPipelineOptions {
  readonly target: TargetSpec;
  readonly cwd: string;
  readonly resolveTarget: (target: TargetSpec, context: { readonly cwd: string; readonly allowNetwork: false; readonly executeProjectCode: false }) => Promise<TargetResolution>;
  readonly producers: readonly InspectProducer[];
  readonly native?: { readonly projectRoot: string; readonly options?: Omit<ScanOptions, "projectRoot" | "signal" | "onProgress"> };
  readonly engines?: readonly InspectionEngine[];
  readonly imports?: readonly ImportedEvidenceBatch[];
  readonly relatedSubjects?: readonly Subject[];
  readonly policyInputs: unknown;
  readonly concurrency?: number;
  readonly signal?: AbortSignal;
  readonly onProgress?: (event: InspectionProgressEvent | ScanProgressEvent) => void;
}

export interface InspectionPipelineResult {
  readonly snapshot: ReturnType<typeof createReleaseSnapshot>;
  readonly coverage: InspectCoverageManifest;
  readonly observations: readonly ObservationDocument[];
  readonly nativeScan?: Awaited<ReturnType<typeof runScan>>;
}

type ProducerOutput = {
  readonly observations: readonly ObservationDocument[];
  readonly runIds: readonly string[];
  readonly sourceDigests: readonly `sha256:${string}`[];
  readonly limitations: readonly string[];
  readonly state: "complete" | "incomplete" | "not-provided" | "failed";
  readonly nativeScan?: Awaited<ReturnType<typeof runScan>>;
};

function aborted(signal?: AbortSignal): void {
  if (signal?.aborted) throw new Error("inspection cancelled");
}

function targetMatches(a: TargetSpec, b: TargetSpec): boolean {
  return a.kind === b.kind && a.value === b.value && a.platform === b.platform;
}

function observationFingerprintInput(observation: ObservationDocument) {
  const location = observation.locations[0];
  const locationIdentity = !location ? undefined
    : location.kind === "source" ? `${location.path}:${location.startLine}`
      : location.kind === "package" ? location.purl ?? `${location.ecosystem}:${location.name}@${location.version ?? ""}`
        : location.kind === "oci-layer" ? `${location.layerDigest.algorithm}:${location.layerDigest.value}:${location.layerIndex ?? ""}:${location.path ?? ""}`
          : `${location.path ?? ""}:${location.offset ?? ""}`;
  const packageLocation = observation.locations.find((item) => item.kind === "package");
  const packageIdentity = packageLocation?.kind === "package" ? packageLocation.purl ?? `${packageLocation.ecosystem}:${packageLocation.name}@${packageLocation.version ?? ""}` : undefined;
  const evidenceClass = observation.coverageClass === "native" ? "native" : observation.coverageClass === "external" ? "adapter" : "imported";
  return {
    subjectId: observation.subjectId,
    ...(locationIdentity ? { location: locationIdentity } : {}),
    ...(packageIdentity ? { package: packageIdentity } : {}),
    ...(observation.references.find((reference) => reference.id)?.id ? { advisory: observation.references.find((reference) => reference.id)!.id } : {}),
    rule: observation.origin.ruleId,
    evidenceClass,
    producerId: observation.origin.producerId,
    payload: observation,
  } as const;
}

function validateProducerObservations(
  values: readonly unknown[],
  expected: { readonly subjectId: string; readonly origin: "native" | "adapter" | "imported"; readonly producerId?: string; readonly runId?: string; readonly sourceDigest?: `sha256:${string}` },
): ObservationDocument[] {
  if (values.length > MAX_OBSERVATIONS) throw new Error("producer observation limit exceeded");
  const seen = new Set<string>();
  return values.map((value) => {
    const observation = parseObservation(value);
    if (observation.subjectId !== expected.subjectId || observation.origin.kind !== expected.origin || (expected.producerId !== undefined && observation.origin.producerId !== expected.producerId)) throw new Error("producer observation identity does not match the selected inspection");
    if (expected.runId && observation.origin.runId !== expected.runId) throw new Error("producer observation run identity does not match the tool run");
    if (expected.sourceDigest && (observation.origin.rawEvidenceDigest?.algorithm !== "sha256" || `sha256:${observation.origin.rawEvidenceDigest.value}` !== expected.sourceDigest)) throw new Error("imported observation is not bound to its source digest");
    if (seen.has(observation.observationId)) throw new Error("producer observation IDs must be unique within a result");
    seen.add(observation.observationId);
    return observation;
  });
}

function importRunId(): `urn:uuid:${string}` {
  return `urn:uuid:${randomUUID()}`;
}

function importedObservationId(runId: string, index: number): `urn:uuid:${string}` {
  const bytes = createHash("sha256").update(`${runId}:${index}`, "utf8").digest().subarray(0, 16);
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `urn:uuid:${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function importedRelativePath(value: unknown): string | undefined {
  if (typeof value !== "string" || !value || value.length > 4096 || /[\u0000-\u001f\u007f]/u.test(value)) return undefined;
  let decoded: string;
  try { decoded = decodeURIComponent(value); } catch { return undefined; }
  if (/^[A-Za-z][A-Za-z0-9+.-]*:/u.test(decoded) || decoded.includes("\\")) return undefined;
  return RelativeSubjectPathSchema.safeParse(decoded).success ? decoded : undefined;
}

function normalizeSarif(document: ReturnType<typeof importSarif>, subjectId: string, runId: `urn:uuid:${string}`, sourceDigest: `sha256:${string}`): { observations: ObservationDocument[]; limitations: string[] } {
  const observations: ObservationDocument[] = [];
  const limitations: string[] = ["SARIF source does not independently bind its findings to the selected subject"];
  let examined = 0;
  let omitted = 0;
  for (const run of document.runs) {
    const results = Array.isArray(run.results) ? run.results : [];
    for (const resultValue of results) {
      if (++examined > MAX_OBSERVATIONS) {
        limitations.push("SARIF result limit reached; remaining results were not normalized");
        break;
      }
      if (!resultValue || typeof resultValue !== "object" || Array.isArray(resultValue)) { omitted++; continue; }
      const result = resultValue as Record<string, unknown>;
      const ruleId = typeof result.ruleId === "string" ? result.ruleId : "";
      if (!ruleId || ruleId.length > 256 || /[\u0000-\u001f\u007f]/u.test(ruleId)) { omitted++; continue; }
      let location: ObservationDocument["locations"][number] | undefined;
      for (const item of Array.isArray(result.locations) ? result.locations : []) {
        if (!item || typeof item !== "object" || Array.isArray(item)) continue;
        const physical = (item as Record<string, unknown>).physicalLocation;
        if (!physical || typeof physical !== "object" || Array.isArray(physical)) continue;
        const value = physical as Record<string, unknown>;
        const artifact = value.artifactLocation;
        if (!artifact || typeof artifact !== "object" || Array.isArray(artifact)) continue;
        const path = importedRelativePath((artifact as Record<string, unknown>).uri);
        if (!path) continue;
        const region = value.region;
        const line = region && typeof region === "object" && !Array.isArray(region) ? (region as Record<string, unknown>).startLine : undefined;
        location = Number.isSafeInteger(line) && Number(line) > 0 ? { kind: "source", path, startLine: Number(line) } : { kind: "artifact", path };
        break;
      }
      if (!location) { omitted++; continue; }
      const level = typeof result.level === "string" && result.level.length <= 512 && !/[\u0000-\u001f\u007f]/u.test(result.level) ? result.level : "unknown";
      const severity = normalizeSeverity(level);
      const safeRuleId = ruleId.replace(/[^A-Za-z0-9._:/-]/gu, "_").slice(0, 240) || "unknown";
      observations.push(parseObservation({
        schemaId: "urn:verglos:schema:observation",
        schemaVersion: "1.0.0",
        observationId: importedObservationId(runId, examined),
        subjectId,
        origin: { kind: "imported", producerId: "sarif.import", runId, ruleId: `sarif.${safeRuleId}`, rawEvidenceDigest: { algorithm: "sha256", value: sourceDigest.slice(7) } },
        coverageClass: "imported",
        category: "security.finding",
        title: "Imported SARIF finding",
        description: "A SARIF result was normalized without retaining raw result text; its source document is bound by digest.",
        locations: [location],
        severity: { original: { system: "sarif.level", value: level }, normalized: severity.normalized, mapping: { id: "verglos.severity.v1", version: "1.0.0" } },
        confidence: { level: "unknown", method: "verglos.import.sarif", mappingVersion: "1.0.0" },
        evidence: [],
        references: [],
        extensions: {},
      }));
    }
    if (examined > MAX_OBSERVATIONS) break;
  }
  if (omitted > 0) limitations.push(`${omitted} SARIF result(s) were omitted because rule identity or a safe relative location was unavailable`);
  return { observations, limitations };
}

function normalizeImportedBatch(batch: ImportedEvidenceBatch, subjectId: string): ProducerOutput {
  if (!(batch.bytes instanceof Uint8Array) || batch.bytes.byteLength === 0 || batch.bytes.byteLength > MAX_IMPORT_BYTES) throw new Error("imported evidence is empty or exceeds the 8 MiB limit");
  if (batch.producer === "sarif") {
    const imported = importSarif(batch.bytes);
    const sourceDigest = `sha256:${imported.sourceDigest.value}` as const;
    const runId = importRunId();
    const normalized = normalizeSarif(imported, subjectId, runId, sourceDigest);
    return { state: "incomplete", observations: normalized.observations, runIds: [runId], sourceDigests: [sourceDigest], limitations: normalized.limitations.slice(0, 16) };
  }
  if (batch.producer === "cyclonedx") {
    const sbom = importCycloneDx(batch.bytes);
    const sourceDigest = `sha256:${sbom.sourceDigest.value}` as const;
    const vulnerabilities = (sbom.document as Record<string, unknown>).vulnerabilities;
    if (vulnerabilities !== undefined) importCycloneDxVex(batch.bytes);
    const hasVulnerabilities = Array.isArray(vulnerabilities) && vulnerabilities.length > 0;
    return { state: "incomplete", observations: [], runIds: [], sourceDigests: [sourceDigest], limitations: [hasVulnerabilities ? "CycloneDX vulnerability assertions are digest-bound but are not converted into policy observations" : "CycloneDX inventory does not independently prove it describes the selected subject"] };
  }
  if (batch.producer === "spdx") {
    const spdx = importSpdx(batch.bytes);
    const sourceDigest = `sha256:${spdx.sourceDigest.value}` as const;
    return { state: "incomplete", observations: [], runIds: [], sourceDigests: [sourceDigest], limitations: ["SPDX inventory does not independently prove it describes the selected subject"] };
  }
  const provenance = importInTotoProvenance(batch.bytes);
  const sourceDigest = `sha256:${provenance.sourceDigest.value}` as const;
  const targetDigest = subjectId.split(":sha256:").at(-1);
  const bindsTarget = provenance.subjects.some((entry) => (entry.digest as Record<string, unknown>).sha256 === targetDigest);
  return { state: "incomplete", observations: [], runIds: [], sourceDigests: [sourceDigest], limitations: [bindsTarget ? "provenance digest matches the target, but signature and builder identity remain unverified" : "provenance does not prove the selected target identity"] };
}

async function runWithBoundedConcurrency<T>(items: readonly T[], limit: number, signal: AbortSignal | undefined, run: (item: T, index: number) => Promise<void>): Promise<void> {
  let next = 0;
  const worker = async () => {
    while (true) {
      aborted(signal);
      const index = next++;
      if (index >= items.length) return;
      await run(items[index]!, index);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
}

async function runNative(options: InspectionPipelineOptions, subject: Subject): Promise<ProducerOutput> {
  if (!options.native) return { state: "not-provided", observations: [], runIds: [], sourceDigests: [], limitations: ["native producer was selected without a project scan input"] };
  if (subject.kind !== "filesystem" && subject.kind !== "repository-tree") return { state: "incomplete", observations: [], runIds: [], sourceDigests: [], limitations: ["native source scanning does not support this subject kind"] };
  aborted(options.signal);
  const runId = `urn:uuid:${randomUUID()}`;
  const nativeScan = await runScan({
    ...options.native.options,
    projectRoot: options.native.projectRoot,
    allowNetwork: false,
    verifySecrets: false,
    signal: options.signal,
    onProgress: (event) => options.onProgress?.(event),
  });
  aborted(options.signal);
  const after = await options.resolveTarget(options.target, { cwd: options.cwd, allowNetwork: false, executeProjectCode: false });
  const afterSubject = parseSubject(after.subject);
  const targetChanged = !targetMatches(after.target, options.target) || afterSubject.subjectId !== subject.subjectId || after.coverage !== "complete";
  const observations = validateProducerObservations(nativeScan.findings.map((finding) => nativeFindingToObservation({
    finding: projectNativeFinding(finding),
    subjectId: subject.subjectId,
    producerId: "verglos.native",
    runId: runId as `urn:uuid:${string}`,
  })), { subjectId: subject.subjectId, origin: "native", producerId: "verglos.native", runId });
  const limitations = [...(nativeScan.coverage?.limitations ?? [])];
  if (nativeScan.coverage?.status === "incomplete" && limitations.length === 0) limitations.push("native scan reported incomplete coverage");
  if (targetChanged) limitations.push("target identity or completeness changed while native inspection ran");
  return {
    state: limitations.length === 0 ? "complete" : "incomplete",
    observations,
    runIds: [runId],
    sourceDigests: [],
    limitations: [...new Set(limitations)].slice(0, 16),
    nativeScan,
  };
}

async function runEngine(engine: InspectionEngine, subject: Subject, signal?: AbortSignal): Promise<ProducerOutput> {
  if (engine.adapter.id !== engine.producer) throw new Error("engine ID does not match the selected producer");
  if (engine.request.network !== "denied" || (engine.request.allowlist?.length ?? 0) > 0) throw new Error("inspection adapters require network-denied execution");
  if (engine.request.timeoutMs > 30_000) throw new Error("inspection engine timeout exceeds the plan bound");
  aborted(signal);
  const health = parseEngineHealth(await engine.adapter.health());
  if (health.producer.id !== engine.adapter.id) throw new Error("engine health identity does not match its adapter");
  const capabilityIds = new Set(health.capabilities.filter((capability) => capability.status === "supported" && capability.subjectKinds.includes(subject.kind)).map((capability) => capability.id));
  const requested = [...engine.request.capabilities];
  if (health.state !== "healthy" || requested.length === 0 || requested.some((capability) => !capabilityIds.has(capability))) {
    return { state: "incomplete", observations: [], runIds: [], sourceDigests: [], limitations: health.incompleteReasons.map((reason) => `${reason.code}: ${reason.message}`).slice(0, 16).concat(requested.some((capability) => !capabilityIds.has(capability)) ? ["selected engine capability is unavailable for this subject"] : []) };
  }
  aborted(signal);
  const result = await engine.adapter.execute({ ...engine.request, targetSubjectId: subject.subjectId, signal });
  aborted(signal);
  const run = parseToolRun(result.run);
  if (run.subjectId !== subject.subjectId || run.engine.producer.id !== engine.adapter.id) throw new Error("engine result identity does not match the selected adapter and target");
  const { schemaId: _schemaId, schemaVersion: _schemaVersion, ...healthSnapshot } = health;
  if (canonicalizeJson(run.engine) !== canonicalizeJson(healthSnapshot)) throw new Error("engine run is not bound to the inspected health snapshot");
  if (canonicalizeJson([...run.requestedCapabilities].sort()) !== canonicalizeJson([...engine.request.capabilities].sort())) throw new Error("engine run capability request differs from the inspection plan");
  if (run.coverage === "complete" && engine.request.capabilities.some((capability) => !run.executedCapabilities.includes(capability))) throw new Error("engine reported complete coverage without executing every requested capability");
  const observations = validateProducerObservations(result.observations, { subjectId: subject.subjectId, origin: "adapter", producerId: engine.adapter.id, runId: run.runId });
  const sourceDigests: `sha256:${string}`[] = [];
  if (result.rawOutput) {
    if (result.rawOutput.bytes.byteLength > MAX_RAW_OUTPUT_BYTES) throw new Error("engine raw output exceeds the inspection limit");
    const actual = `sha256:${createHash("sha256").update(result.rawOutput.bytes).digest("hex")}` as const;
    if (actual !== result.rawOutput.digest) throw new Error("engine raw output digest is invalid");
    sourceDigests.push(actual);
  }
  const limitations = run.coverage === "incomplete" || run.outcome !== "succeeded" ? run.incompleteReasons.map((reason) => `${reason.code}: ${reason.message}`) : [];
  if (run.coverage === "incomplete" && limitations.length === 0) limitations.push("engine reported incomplete coverage without a reason");
  return { state: limitations.length === 0 ? "complete" : "incomplete", observations, runIds: [run.runId], sourceDigests, limitations: limitations.slice(0, 16) };
}

export async function runInspectionPipeline(options: InspectionPipelineOptions): Promise<InspectionPipelineResult> {
  const plan = planInspect({ targetKind: options.target.kind, producers: options.producers });
  if (plan.steps.length === 0) throw new Error("inspection must select at least one producer");
  const concurrency = options.concurrency ?? 2;
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > MAX_ADAPTERS) throw new Error(`inspection concurrency must be between 1 and ${MAX_ADAPTERS}`);
  if ((options.engines?.length ?? 0) > MAX_ADAPTERS || (options.imports?.length ?? 0) > MAX_IMPORTS) throw new Error("inspection producer input exceeds its bound");
  if (options.native?.options?.allowNetwork === true || options.native?.options?.verifySecrets === true) throw new Error("inspection pipeline does not permit network-dependent native checks");
  if (new Set((options.engines ?? []).map((engine) => engine.producer)).size !== (options.engines ?? []).length) throw new Error("inspection engine producers cannot repeat");
  if ((options.imports ?? []).some((entry) => !plan.steps.some((step) => step.producer === entry.producer))) throw new Error("import batch producer was not selected");
  if ((options.imports ?? []).some((entry) => !(entry.bytes instanceof Uint8Array) || entry.bytes.byteLength === 0 || entry.bytes.byteLength > MAX_IMPORT_BYTES)) throw new Error("imported evidence is empty or exceeds the 8 MiB limit");
  aborted(options.signal);
  options.onProgress?.({ phase: "target", status: "started" });
  const context = { cwd: options.cwd, allowNetwork: false as const, executeProjectCode: false as const };
  const resolution = await options.resolveTarget(options.target, context);
  if (!targetMatches(resolution.target, options.target)) throw new Error("target resolver returned a different target");
  const subject = parseSubject(resolution.subject);
  const targetLimitations = [...new Set(resolution.limitations)].slice(0, 16).map((value) => value.slice(0, 512));
  if (resolution.coverage === "incomplete" && targetLimitations.length === 0) targetLimitations.push("target resolver reported incomplete coverage without a reason");
  const targetState = resolution.coverage === "complete" && targetLimitations.length === 0 ? "complete" : "incomplete";
  options.onProgress?.({ phase: "target", status: targetState === "complete" ? "completed" : "incomplete" });
  aborted(options.signal);

  const outputs: Array<ProducerOutput | undefined> = Array.from({ length: plan.steps.length });
  let nativeScan: Awaited<ReturnType<typeof runScan>> | undefined;
  await runWithBoundedConcurrency(plan.steps, concurrency, options.signal, async (step, index) => {
    options.onProgress?.({ phase: "producer", producer: step.producer, status: "started" });
    try {
      let output: ProducerOutput;
      if (step.producer === "native") output = await runNative(options, subject);
      else if (step.producer === "trivy") {
        const engine = (options.engines ?? []).find((candidate) => candidate.producer === step.producer);
        output = engine ? await runEngine(engine, subject, options.signal) : { state: "not-provided", observations: [], runIds: [], sourceDigests: [], limitations: ["Trivy execution is unavailable until the managed, trusted process boundary is qualified"] };
      } else {
        const batches = (options.imports ?? []).filter((entry) => entry.producer === step.producer);
        if (batches.length === 0) output = { state: "not-provided", observations: [], runIds: [], sourceDigests: [], limitations: [`${step.producer} import was selected but no validated import batch was provided`] };
        else {
          const results = batches.map((batch) => normalizeImportedBatch(batch, subject.subjectId));
          const observations = results.flatMap((result) => result.observations);
          if (observations.length > MAX_OBSERVATIONS) throw new Error("imported observation limit exceeded");
          const duplicateIds = new Set<string>();
          for (const observation of observations) { if (duplicateIds.has(observation.observationId)) throw new Error("imported observation IDs must be unique across selected batches"); duplicateIds.add(observation.observationId); }
          const limitations = [...new Set([...targetLimitations, ...results.flatMap((result) => result.limitations)])].slice(0, 16);
          output = { state: targetState === "complete" && results.every((result) => result.state === "complete") ? "complete" : "incomplete", observations, runIds: results.flatMap((result) => result.runIds), sourceDigests: results.flatMap((result) => result.sourceDigests), limitations };
        }
      }
      outputs[index] = output;
      if (output.nativeScan) nativeScan = output.nativeScan;
      options.onProgress?.({ phase: "producer", producer: step.producer, status: output.state === "complete" ? "completed" : "incomplete" });
    } catch (error) {
      aborted(options.signal);
      outputs[index] = { state: "failed", observations: [], runIds: [], sourceDigests: [], limitations: [error instanceof Error && error.message === "engine raw output digest is invalid" ? "producer output integrity validation failed" : "producer execution or normalization failed"] };
      options.onProgress?.({ phase: "producer", producer: step.producer, status: "incomplete" });
    }
  });
  aborted(options.signal);

  const entries = plan.steps.map((step, index) => {
    const output = outputs[index] ?? { state: "failed" as const, observations: [], runIds: [], sourceDigests: [], limitations: ["producer produced no result"] };
    return { producer: step.producer, state: output.state, observationCount: output.observations.length, runIds: [...output.runIds].sort(), sourceDigests: [...output.sourceDigests].sort(), limitations: [...output.limitations].slice(0, 16) };
  });
  const allLimitations = [...new Set([...resolution.limitations, ...entries.flatMap((entry) => entry.limitations)])];
  const coverage = InspectCoverageManifestSchema.parse({
    schemaVersion: "1.0.0",
    status: targetState === "complete" && entries.every((entry) => entry.state === "complete" && entry.limitations.length === 0) && allLimitations.length === 0 ? "complete" : "incomplete",
    target: { state: targetState, limitations: targetLimitations },
    producers: entries,
  });
  const observations = outputs.flatMap((output) => output?.observations ?? []);
  if (observations.length > MAX_OBSERVATIONS) throw new Error("inspection observation limit exceeded");
  const lineage = buildLineageGraph([subject, ...(options.relatedSubjects ?? [])], []);
  const correlations = correlateObservations(observations.map(observationFingerprintInput));
  options.onProgress?.({ phase: "snapshot", status: "started" });
  const snapshot = createReleaseSnapshot({
    primarySubject: subject,
    subjects: [subject, ...(options.relatedSubjects ?? [])],
    observations: correlations,
    lineage,
    policyInputs: options.policyInputs,
    coverage,
  });
  options.onProgress?.({ phase: "snapshot", status: coverage.status === "complete" ? "completed" : "incomplete" });
  return Object.freeze({ snapshot, coverage, observations: Object.freeze(observations), ...(nativeScan ? { nativeScan } : {}) });
}
