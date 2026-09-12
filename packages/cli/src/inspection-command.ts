import { open, lstat, realpath, link, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { basename, dirname, join, resolve } from "node:path";
import { canonicalizeJson, importBoundedJson, resolveFilesystemTarget, type InspectProducer, type ScanOptions } from "@verglos/shared";
import { runInspectionPipeline, type ImportedEvidenceBatch } from "@verglos/scanner";
import ora from "ora";
import { readEvidenceBytes } from "./evidence-transfer.js";

const MAX_IMPORT_FILES = 32;
const MAX_SNAPSHOT_BYTES = 16 * 1024 * 1024;

export interface InspectionCommandOptions {
  readonly cwd: string;
  readonly snapshotPath: string;
  readonly producers?: readonly string[];
  readonly importPaths?: readonly string[];
  readonly configPath?: string;
  readonly detectors: ScanOptions["detectors"];
  readonly minConfidence?: number;
  readonly strict?: boolean;
  readonly noProvenance?: boolean;
  readonly json?: boolean;
  readonly quiet?: boolean;
}

function producerForFormat(format: string): Exclude<InspectProducer, "native" | "trivy"> {
  if (format === "sarif" || format === "cyclonedx" || format === "spdx") return format;
  if (format === "in-toto") return "provenance";
  throw new Error("selected evidence format is not supported by the inspection pipeline");
}

function producerForSelection(value: string): InspectProducer {
  if (value === "native" || value === "trivy") return value;
  return producerForFormat(value);
}

async function writeSnapshotNoReplace(path: string, snapshot: unknown): Promise<void> {
  const bytes = Buffer.from(`${canonicalizeJson(snapshot)}\n`, "utf8");
  if (bytes.byteLength > MAX_SNAPSHOT_BYTES) throw new Error("inspection snapshot exceeds the 16 MiB output limit");
  const requested = resolve(path);
  const name = basename(requested);
  if (!name || name === "." || name === "..") throw new Error("snapshot output path is invalid");
  const parent = await realpath(dirname(requested));
  const parentStat = await lstat(parent);
  if (!parentStat.isDirectory()) throw new Error("snapshot output parent must be a directory");
  const output = join(parent, name);
  const temporary = join(parent, `.${name}.${randomUUID()}.tmp`);
  const handle = await open(temporary, "wx", 0o600);
  try {
    await handle.writeFile(bytes);
    await handle.sync();
    await handle.close();
    await link(temporary, output);
  } catch (error) {
    await handle.close().catch(() => undefined);
    throw error;
  } finally {
    await unlink(temporary).catch(() => undefined);
  }
}

export async function executeInspectionSnapshot(options: InspectionCommandOptions): Promise<number> {
  if ((options.importPaths?.length ?? 0) > MAX_IMPORT_FILES) throw new Error("inspection import count exceeds the 32-file limit");
  if (options.importPaths?.filter((path) => path === "-").length && options.importPaths.filter((path) => path === "-").length !== 1) throw new Error("inspection accepts stdin only once");
  const seenPaths = new Set<string>();
  const imports: ImportedEvidenceBatch[] = [];
  for (const inputPath of options.importPaths ?? []) {
    const key = inputPath === "-" ? "<stdin>" : resolve(options.cwd, inputPath);
    if (seenPaths.has(key)) throw new Error("inspection import paths must be unique");
    seenPaths.add(key);
    const bytes = await readEvidenceBytes(inputPath === "-" ? inputPath : resolve(options.cwd, inputPath), 8 * 1024 * 1024);
    const detected = importBoundedJson(bytes, 8 * 1024 * 1024);
    imports.push({ producer: producerForFormat(detected.format), bytes });
  }
  const importedProducers = [...new Set(imports.map((batch) => batch.producer))];
  const selected = options.producers?.length ? options.producers.map(producerForSelection) : ["native" as const, ...importedProducers];
  if (new Set(selected).size !== selected.length) throw new Error("inspection producer selection contains duplicates");
  if (importedProducers.some((producer) => !selected.includes(producer))) throw new Error("every imported evidence format must be included with --producer");
  if (selected.length === 0) throw new Error("inspection must select at least one producer");

  const controller = new AbortController();
  const abort = () => controller.abort();
  process.once("SIGINT", abort);
  process.once("SIGTERM", abort);
  const spinner = options.quiet || options.json ? null : ora("Inspecting target...").start();
  try {
    const target = { kind: "filesystem" as const, value: options.cwd };
    const result = await runInspectionPipeline({
      target,
      cwd: options.cwd,
      resolveTarget: resolveFilesystemTarget,
      producers: selected,
      native: selected.includes("native") ? {
        projectRoot: options.cwd,
        options: {
          configPath: options.configPath,
          detectors: options.detectors,
          minConfidence: options.minConfidence,
          strict: options.strict,
          noProvenance: options.noProvenance,
          includeGitHistory: true,
          unlocked: true,
          allowNetwork: false,
        },
      } : undefined,
      imports,
      policyInputs: { profile: "free", mode: "inspect-snapshot" },
      signal: controller.signal,
      onProgress: (event) => {
        if (!spinner) return;
        const name = "producer" in event && event.producer ? event.producer : event.phase;
        spinner.text = `${event.status === "started" ? "Inspecting" : event.status === "completed" ? "Completed" : "Incomplete"} ${name}...`;
      },
    });
    spinner?.stop();
    await writeSnapshotNoReplace(resolve(options.cwd, options.snapshotPath), result.snapshot);
    if (options.json) process.stdout.write(`${JSON.stringify({ status: result.coverage.status, snapshotDigest: result.snapshot.snapshotDigest, coverage: result.coverage })}\n`);
    else if (!options.quiet) {
      process.stdout.write(`Snapshot: ${result.snapshot.snapshotDigest}\nCoverage: ${result.coverage.status}\n`);
      for (const producer of result.coverage.producers) process.stdout.write(`  ${producer.producer}: ${producer.state}${producer.limitations.length ? ` (${producer.limitations.join("; ")})` : ""}\n`);
    }
    return result.coverage.status === "complete" ? 0 : 3;
  } catch (error) {
    if (controller.signal.aborted) {
      spinner?.stop();
      if (!options.quiet) process.stderr.write("Inspection cancelled; no snapshot was written.\n");
      return 130;
    }
    spinner?.stop();
    throw error;
  } finally {
    process.removeListener("SIGINT", abort);
    process.removeListener("SIGTERM", abort);
  }
}
