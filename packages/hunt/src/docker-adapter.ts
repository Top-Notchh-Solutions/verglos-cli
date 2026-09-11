import { isAbsolute } from "node:path";
import { lstat } from "node:fs/promises";

export interface DockerInvocationInput {
  readonly projectRoot: string;
  readonly image: string;
  readonly imageDigest: string;
  readonly command: readonly string[];
  readonly timeoutMs: number;
  readonly memoryMb: number;
  readonly maxProcesses: number;
}

/** Reject symlinked or non-directory roots before a source bind mount. */
export async function validateDockerProjectRoot(projectRoot: string): Promise<void> {
  if (!isAbsolute(projectRoot) || /[\u0000-\u001f\u007f,]/.test(projectRoot) || projectRoot.length > 4096) {
    throw new Error("Docker Hunt project root must be an absolute bounded path");
  }
  const entry = await lstat(projectRoot);
  if (entry.isSymbolicLink()) throw new Error("Docker Hunt project root must not be a symlink");
  if (!entry.isDirectory()) throw new Error("Docker Hunt project root must be a regular directory");
}

/**
 * Build the deny-by-default Docker boundary. This function only constructs an
 * argv vector; it never invokes Docker. Execution remains gated by the Hunt
 * approval/trust pipeline and a runtime adapter.
 */
export function buildDockerInvocation(input: DockerInvocationInput): readonly string[] {
  if (!isAbsolute(input.projectRoot) || /[\u0000-\u001f\u007f,]/.test(input.projectRoot) || input.projectRoot.length > 4096) {
    throw new Error("Docker Hunt project root must be an absolute bounded path");
  }
  if (!/^sha256:[a-f0-9]{64}$/.test(input.imageDigest)) throw new Error("Docker Hunt image must use a pinned sha256 digest");
  if (!/^[A-Za-z0-9][A-Za-z0-9./:_-]*$/.test(input.image)) throw new Error("Docker Hunt image must be a safe reference");
  if (!Number.isInteger(input.timeoutMs) || input.timeoutMs <= 0 || input.timeoutMs > 600_000) throw new Error("Docker Hunt timeout is out of bounds");
  if (!Number.isInteger(input.memoryMb) || input.memoryMb <= 0 || input.memoryMb > 16_384) throw new Error("Docker Hunt memory is out of bounds");
  if (!Number.isInteger(input.maxProcesses) || input.maxProcesses <= 0 || input.maxProcesses > 4096) throw new Error("Docker Hunt process limit is out of bounds");
  if (input.command.length === 0 || input.command.length > 32 || input.command.some((part) => !part || part.length > 4096 || /[\u0000-\u001f\u007f]/.test(part))) throw new Error("Docker Hunt command is invalid");
  return Object.freeze([
    "run", "--rm", "--init", "--stop-timeout", "1", "--network", "none", "--read-only",
    "--tmpfs", "/tmp:rw,noexec,nosuid,nodev",
    "--cap-drop", "ALL", "--security-opt", "no-new-privileges",
    "--user", "65532:65532", "--workdir", "/workspace",
    "--pids-limit", String(input.maxProcesses), "--memory", `${input.memoryMb}m`,
    "--mount", `type=bind,src=${input.projectRoot},dst=/workspace,readonly`,
    `${input.image}@${input.imageDigest}`,
    ...input.command,
  ]);
}
