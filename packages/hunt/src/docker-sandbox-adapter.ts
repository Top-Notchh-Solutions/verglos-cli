import type { Finding, HuntExecutionBinding } from "@verglos/shared";
import { buildDockerInvocation, validateDockerProjectRoot, type DockerInvocationInput } from "./docker-adapter.js";
import { runDockerInvocation, type DockerRunOptions } from "./docker-runner.js";
import type { HuntFindingOutcome, SandboxAdapter } from "./types.js";

export interface DockerSandboxAdapterOptions {
  readonly image: string;
  readonly imageDigest: string;
  readonly memoryMb?: number;
  readonly maxProcesses?: number;
  readonly cpus?: number;
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
    if (input.binding.network.mode !== "denied") throw new Error("Docker adapter does not support allowlisted network execution");
    const invocation = buildDockerInvocation({
      projectRoot: input.projectRoot,
      image: this.options.image,
      imageDigest: this.options.imageDigest,
      command: input.binding.command,
      timeoutMs: Math.min(input.timeoutMs, input.binding.limits.timeoutMs),
      memoryMb: Math.min(this.options.memoryMb ?? input.binding.limits.memoryMb, input.binding.limits.memoryMb),
      maxProcesses: this.options.maxProcesses ?? 64,
      cpus: this.options.cpus,
      diskMb: this.options.diskMb,
    } satisfies DockerInvocationInput);
    const result = await runDockerInvocation(invocation, {
      timeoutMs: input.timeoutMs,
      maxOutputBytes: Math.min(this.options.maxOutputBytes ?? input.binding.limits.outputBytes, input.binding.limits.outputBytes),
      sensitivePaths: [input.projectRoot],
      run: this.options.run,
    });
    const reason = result.status === "completed"
      ? "Docker probe completed, but recipe assertion evaluation is not implemented"
      : result.status === "timed-out"
        ? "Docker probe timed out before a supported verdict could be evaluated"
        : "Docker probe failed before a supported verdict could be evaluated";
    return { findingId: input.finding.id, verdict: "not_attemptable", reason, durationMs: result.durationMs };
  }

  async cleanup(): Promise<void> {}
}
