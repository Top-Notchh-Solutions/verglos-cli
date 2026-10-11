import { classifyHuntOutcome, type Finding, type HuntExecutionBinding } from "@verglos/shared";
import { buildDockerInvocation, validateDockerProjectRoot, type DockerInvocationInput } from "./docker-adapter.js";
import { runDockerInvocation, type DockerRunOptions } from "./docker-runner.js";
import type { HuntFindingOutcome, SandboxAdapter } from "./types.js";

export interface DockerSandboxAdapterOptions {
  readonly image: string;
  readonly imageDigest: string;
  readonly memoryMb?: number;
  readonly maxProcesses?: number;
  readonly diskMb?: number;
  readonly maxOutputBytes?: number;
  readonly run?: DockerRunOptions["run"];
}

/** Policy-bound Docker adapter; assertion evaluation remains explicit until supported recipes exist. */
export class DockerSandboxAdapter implements SandboxAdapter {
  readonly id = "docker" as const;
  private readonly options: DockerSandboxAdapterOptions;

  constructor(options: DockerSandboxAdapterOptions) { this.options = { ...options }; }

  async prepare(): Promise<void> {}

  async execute(input: { readonly finding: Finding; readonly projectRoot: string; readonly timeoutMs: number; readonly binding: HuntExecutionBinding }): Promise<HuntFindingOutcome> {
    await validateDockerProjectRoot(input.projectRoot);
    const boundImageDigest = `${input.binding.imageDigest.algorithm}:${input.binding.imageDigest.value}`;
    if (boundImageDigest !== this.options.imageDigest) throw new Error("Docker adapter image digest does not match execution binding");
    if (input.binding.isolation !== "container") throw new Error("Docker adapter requires a recipe declaring container isolation");
    if (input.binding.network.mode !== "denied") throw new Error("Docker adapter does not support allowlisted network execution");
    if (input.binding.limits.maxNetworkRequests !== 0) throw new Error("Docker adapter requires a zero network-request budget");
    const executionTimeoutMs = Math.min(input.timeoutMs, input.binding.limits.timeoutMs, input.binding.limits.cpuMs);
    const invocation = buildDockerInvocation({
      projectRoot: input.projectRoot,
      image: this.options.image,
      imageDigest: this.options.imageDigest,
      command: input.binding.command,
      // The runner pins this container to one CPU; applying the recipe CPU-ms
      // budget as an equal-or-smaller wall timeout therefore cannot exceed it.
      timeoutMs: executionTimeoutMs,
      memoryMb: Math.min(this.options.memoryMb ?? input.binding.limits.memoryMb, input.binding.limits.memoryMb),
      maxProcesses: Math.min(this.options.maxProcesses ?? input.binding.limits.processes, input.binding.limits.processes),
      cpus: 1,
      diskMb: Math.min(this.options.diskMb ?? input.binding.limits.diskMb, input.binding.limits.diskMb),
    } satisfies DockerInvocationInput);
    const result = await runDockerInvocation(invocation, {
      timeoutMs: executionTimeoutMs,
      maxOutputBytes: Math.min(this.options.maxOutputBytes ?? input.binding.limits.outputBytes, input.binding.limits.outputBytes),
      sensitivePaths: [input.projectRoot],
      run: this.options.run,
    });
    const reason = result.status === "completed"
      ? "Docker probe completed, but recipe assertions are unsupported"
      : result.status === "timed-out"
        ? "Docker probe timed out before a supported verdict could be evaluated"
        : "Docker probe failed before a supported verdict could be evaluated";
    const assertionVerdict = result.status === "completed" ? evaluateExitCodeAssertions(input.binding.assertions, result.exitCode) : undefined;
    const assertionsSupported = input.binding.assertions.length > 0 && input.binding.assertions.every((assertion) => /^exit code is (-?\d+)$/.test(assertion.trim()));
    const canonicalVerdict = classifyHuntOutcome({
      policyAllowed: true,
      supported: assertionsSupported,
      assertionMatched: assertionVerdict?.verdict === "true" ? true : assertionVerdict?.verdict === "false" ? false : undefined,
      environmentError: result.status === "failed",
      timedOut: result.status === "timed-out",
    });
    return { findingId: input.finding.id, verdict: assertionVerdict?.verdict ?? "not_attemptable", canonicalVerdict, reason: assertionVerdict?.reason ?? reason, durationMs: result.durationMs, evidenceDigest: result.evidenceDigest, outputBytes: result.outputBytes, truncated: result.truncated, redacted: true, executionStatus: result.status };
  }

  async cleanup(): Promise<void> {}
}

function evaluateExitCodeAssertions(assertions: readonly string[], exitCode: number | undefined): { readonly verdict: "true" | "false"; readonly reason: string } | undefined {
  if (exitCode === undefined || assertions.length === 0) return undefined;
  const expected = assertions.map((assertion) => /^exit code is (-?\d+)$/.exec(assertion.trim()));
  if (expected.some((match) => !match)) return undefined;
  const codes = expected.map((match) => Number(match![1]));
  if (codes.some((code) => !Number.isSafeInteger(code))) return undefined;
  const passed = codes.every((code) => code === exitCode);
  return { verdict: passed ? "true" : "false", reason: passed ? "Docker probe satisfied all supported exit-code assertions" : `Docker probe exit code ${exitCode} did not satisfy the recipe assertion` };
}
