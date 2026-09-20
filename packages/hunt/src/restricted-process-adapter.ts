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

const BUILT_IN_COMMAND = ["verglos-probe", "utf8-contains"] as const;
const BUILT_IN_ASSERTION = "probe result is true";
const A1_LIMITATION = "A1 runs a trusted built-in pure probe in a bounded worker harness; it is not a security or OS isolation boundary";

interface WorkerResult { readonly matched: boolean }

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

  constructor(recipe: HuntRecipe) {
    this.recipe = parseHuntRecipe(recipe);
    validateRestrictedRecipe(this.recipe);
  }

  async prepare(): Promise<void> {}

  async execute(input: { readonly finding: Finding; readonly projectRoot: string; readonly timeoutMs: number; readonly binding: HuntExecutionBinding }): Promise<HuntFindingOutcome> {
    validateBinding(this.recipe, input.binding);
    const timeoutMs = Math.min(input.timeoutMs, input.binding.limits.timeoutMs, input.binding.limits.cpuMs);
    const result = await runBuiltInProbe({
      probe: "utf8-contains",
      value: this.recipe.inputs?.value ?? "",
      needle: this.recipe.inputs?.needle ?? "",
    }, timeoutMs, input.binding.limits.memoryMb);
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
        ? "A1 built-in pure probe exceeded its declared CPU/time bound"
        : matched
          ? "A1 built-in pure probe satisfied its fixed assertion"
          : "A1 built-in pure probe did not satisfy its fixed assertion",
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
  if (recipe.command.length !== BUILT_IN_COMMAND.length || recipe.command.some((part, index) => part !== BUILT_IN_COMMAND[index])) {
    throw new Error("A1 adapter accepts only a built-in pure probe identifier");
  }
  if (recipe.assertions.length !== 1 || recipe.assertions[0] !== BUILT_IN_ASSERTION) throw new Error("A1 adapter requires its fixed built-in assertion");
  if (recipe.network.mode !== "denied" || recipe.network.destinations.length !== 0 || recipe.limits.maxNetworkRequests !== 0) throw new Error("A1 adapter requires denied network");
  if (recipe.limits.processes !== 1) throw new Error("A1 adapter requires a one-worker process limit");
  if (recipe.limits.memoryMb < 16) throw new Error("A1 adapter requires at least 16 MB for the bounded worker runtime");
  if (recipe.cleanup !== "always") throw new Error("A1 adapter requires unconditional cleanup");
  if (recipe.redaction !== "required") throw new Error("A1 adapter requires output redaction");
  if (!recipe.inputs || Object.keys(recipe.inputs).sort().join(",") !== "needle,value" || !recipe.inputs.needle) throw new Error("A1 built-in probe requires only bounded value and needle inputs");
}

function validateBinding(recipe: HuntRecipe, binding: HuntExecutionBinding): void {
  if (binding.recipeDigest !== huntRecipeDigest(recipe)) throw new Error("A1 adapter recipe digest does not match the execution binding");
  if (binding.isolation !== "restricted-process") throw new Error("A1 adapter binding must declare restricted-process isolation");
  if (binding.command.length !== BUILT_IN_COMMAND.length || binding.command.some((part, index) => part !== BUILT_IN_COMMAND[index])) throw new Error("A1 adapter binding does not select the built-in probe");
  if (binding.assertions.length !== 1 || binding.assertions[0] !== BUILT_IN_ASSERTION) throw new Error("A1 adapter binding does not select the fixed assertion");
  if (binding.network.mode !== "denied" || binding.network.destinations.length !== 0 || binding.limits.maxNetworkRequests !== 0) throw new Error("A1 adapter binding must deny network");
  if (binding.limits.processes !== 1) throw new Error("A1 adapter binding exceeds its process limit");
}

async function runBuiltInProbe(workerData: { readonly probe: "utf8-contains"; readonly value: string; readonly needle: string }, timeoutMs: number, memoryMb: number): Promise<WorkerResult & { readonly durationMs: number } | "timed-out"> {
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
