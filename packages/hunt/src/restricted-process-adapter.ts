import { Worker } from "node:worker_threads";
import {
  classifyHuntOutcome,
  huntEvidenceDigest,
  huntRecipeDigest,
  parseHuntRecipe,
  type Finding,
  type HuntExecutionBinding,
  type HuntRecipe,
} from "@verglos/shared";
import type { HuntFindingOutcome, SandboxAdapter } from "./types.js";

const BUILT_IN_COMMAND_PREFIX = "verglos-probe";
const BUILT_IN_ASSERTION = "probe result is true";
const A1_LIMITATION = "A1 runs a trusted built-in pure fixture probe in a bounded worker harness; it does not execute target code and is not a security or OS isolation boundary";

interface WorkerResult { readonly matched: boolean }
type BuiltInProbe = "utf8-contains" | "path-traversal" | "command-injection" | "ssrf-target" | "tenant-boundary" | "sql-injection" | "xss-safe" | "agent-boundary";

/**
 * A1 adapter for trusted, built-in pure probes only.
 *
 * Recipe command text selects a fixed catalog entry; it is never invoked,
 * evaluated, imported, or passed to a shell. The worker has no target/source
 * access and its implementation imports no filesystem, network, process, VM,
 * or dynamic module-loading APIs.
 */
export class RestrictedProcessAdapter implements SandboxAdapter {
  readonly id = "restricted-process" as const;
  private readonly recipe: HuntRecipe;
  private readonly inputs: Readonly<Record<string, string>>;

  constructor(recipe: HuntRecipe, options: { readonly inputs?: Readonly<Record<string, string>> } = {}) {
    this.recipe = parseHuntRecipe(recipe);
    validateRestrictedRecipe(this.recipe);
    this.inputs = options.inputs ?? this.recipe.inputs ?? {};
    validateRestrictedInputs(this.recipe.command[1] as BuiltInProbe, this.inputs);
  }

  async prepare(): Promise<void> {}

  async execute(input: { readonly finding: Finding; readonly projectRoot: string; readonly timeoutMs: number; readonly binding: HuntExecutionBinding }): Promise<HuntFindingOutcome> {
    validateBinding(this.recipe, input.binding);
    const timeoutMs = Math.min(input.timeoutMs, input.binding.limits.timeoutMs, input.binding.limits.cpuMs);
    const probe = this.recipe.command[1] as BuiltInProbe;
    const result = await runBuiltInProbe({ probe, ...this.inputs }, timeoutMs, input.binding.limits.memoryMb);
    const timedOut = result === "timed-out";
    const matched = timedOut ? undefined : result.matched;
    const canonicalVerdict = classifyHuntOutcome({
      policyAllowed: true,
      supported: true,
      ...(matched === undefined ? {} : { assertionMatched: matched }),
      timedOut,
    });
    const evidence = timedOut ? "timed-out" : matched ? "matched" : "not-matched";
    return {
      findingId: input.finding.id,
      verdict: timedOut ? "not_attemptable" : matched ? "true" : "false",
      canonicalVerdict,
      reason: timedOut
        ? "A1 built-in fixture probe exceeded its declared CPU/time bound"
        : matched
          ? "A1 built-in fixture probe satisfied its fixed assertion"
          : "A1 built-in fixture probe did not satisfy its fixed assertion",
      durationMs: result === "timed-out" ? timeoutMs : result.durationMs,
      evidenceDigest: huntEvidenceDigest({ stdout: evidence, stderr: "", truncated: false }),
      outputBytes: Buffer.byteLength(evidence, "utf8"),
      truncated: false,
      redacted: true,
      executionStatus: timedOut ? "timed-out" : "completed",
      assurance: Object.freeze({
        class: "A1",
        isolation: "restricted-process",
        securityBoundary: false,
        sourceAccess: "none",
        network: "denied",
        processLimit: 1,
        limitation: A1_LIMITATION,
      }),
    };
  }

  async cleanup(): Promise<void> {}
}

function validateRestrictedRecipe(recipe: HuntRecipe): void {
  if (recipe.isolation !== "restricted-process") throw new Error("A1 adapter requires restricted-process isolation");
  if (recipe.command.length !== 2 || recipe.command[0] !== BUILT_IN_COMMAND_PREFIX || !isBuiltInProbe(recipe.command[1])) throw new Error("A1 adapter accepts only a supported built-in fixture probe identifier");
  if (recipe.assertions.length !== 1 || recipe.assertions[0] !== BUILT_IN_ASSERTION) throw new Error("A1 adapter requires its fixed built-in assertion");
  if (recipe.network.mode !== "denied" || recipe.network.destinations.length !== 0 || recipe.limits.maxNetworkRequests !== 0) throw new Error("A1 adapter requires denied network");
  if (recipe.limits.processes !== 1) throw new Error("A1 adapter requires a one-worker process limit");
  if (recipe.limits.memoryMb < 16) throw new Error("A1 adapter requires at least 16 MB for the bounded worker runtime");
  if (recipe.cleanup !== "always") throw new Error("A1 adapter requires unconditional cleanup");
  if (recipe.redaction !== "required") throw new Error("A1 adapter requires output redaction");
  if (!recipe.inputs) throw new Error("A1 built-in fixture probe requires its exact bounded inputs");
  validateRestrictedInputs(recipe.command[1] as BuiltInProbe, recipe.inputs);
}

function validateRestrictedInputs(probe: BuiltInProbe, inputs: Readonly<Record<string, string>>): void {
  const requiredInputs = requiredInputNames(probe);
  if (Object.keys(inputs).sort().join(",") !== [...requiredInputs].sort().join(",") || Object.values(inputs).some((value) => value.length === 0 || value.length > 4096 || /[\u0000-\u001f\u007f]/u.test(value))) {
    throw new Error("A1 built-in fixture probe requires its exact bounded inputs");
  }
}

function validateBinding(recipe: HuntRecipe, binding: HuntExecutionBinding): void {
  if (binding.recipeDigest !== huntRecipeDigest(recipe)) throw new Error("A1 adapter recipe digest does not match the execution binding");
  if (binding.isolation !== "restricted-process") throw new Error("A1 adapter binding must declare restricted-process isolation");
  if (binding.command.length !== 2 || binding.command[0] !== BUILT_IN_COMMAND_PREFIX || !isBuiltInProbe(binding.command[1])) throw new Error("A1 adapter binding does not select a supported built-in fixture probe");
  if (binding.assertions.length !== 1 || binding.assertions[0] !== BUILT_IN_ASSERTION) throw new Error("A1 adapter binding does not select the fixed assertion");
  if (binding.network.mode !== "denied" || binding.network.destinations.length !== 0 || binding.limits.maxNetworkRequests !== 0) throw new Error("A1 adapter binding must deny network");
  if (binding.limits.processes !== 1) throw new Error("A1 adapter binding exceeds its process limit");
}

function isBuiltInProbe(value: string | undefined): value is BuiltInProbe {
  return value === "utf8-contains" || value === "path-traversal" || value === "command-injection" || value === "ssrf-target" || value === "tenant-boundary" || value === "sql-injection" || value === "xss-safe" || value === "agent-boundary";
}

function requiredInputNames(probe: BuiltInProbe): readonly string[] {
  switch (probe) {
    case "utf8-contains": return ["needle", "value"];
    case "path-traversal": return ["path"];
    case "command-injection": return ["input"];
    case "ssrf-target": return ["url"];
    case "tenant-boundary": return ["authorizedTenant", "requestedTenant"];
    case "sql-injection": return ["input"];
    case "xss-safe": return ["html"];
    case "agent-boundary": return ["allowlist", "tool"];
  }
}

async function runBuiltInProbe(workerData: { readonly probe: BuiltInProbe; readonly [key: string]: string }, timeoutMs: number, memoryMb: number): Promise<WorkerResult & { readonly durationMs: number } | "timed-out"> {
  const started = Date.now();
  const worker = new Worker(new URL("./restricted-probe-worker.js", import.meta.url), {
    workerData,
    env: {},
    resourceLimits: { maxOldGenerationSizeMb: Math.max(16, memoryMb), stackSizeMb: 4 },
    stdout: true,
    stderr: true,
  });
  return await new Promise((resolve, reject) => {
    let settled = false;
    const finish = (callback: () => void): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      callback();
    };
    const timer = setTimeout(() => {
      finish(() => {
        void worker.terminate().finally(() => resolve("timed-out"));
      });
    }, timeoutMs);
    timer.unref();
    worker.once("message", (value: unknown) => {
      finish(() => {
        void worker.terminate();
        if (!value || typeof value !== "object" || Array.isArray(value) || typeof (value as Record<string, unknown>).matched !== "boolean") {
          reject(new Error("A1 built-in probe returned an invalid result"));
          return;
        }
        resolve({ matched: (value as WorkerResult).matched, durationMs: Math.max(0, Date.now() - started) });
      });
    });
    worker.once("error", () => finish(() => reject(new Error("A1 built-in probe failed"))));
    worker.once("exit", (code) => {
      if (!settled && code !== 0) finish(() => reject(new Error("A1 built-in probe exited unexpectedly")));
    });
  });
}
