import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { huntEvidenceDigest, redactHuntOutput } from "@verglos/shared";

const execFileAsync = promisify(execFile);

export interface DockerRunOptions {
  readonly timeoutMs: number;
  readonly maxOutputBytes: number;
  readonly sensitivePaths?: readonly string[];
  readonly run?: (args: readonly string[], options: { readonly timeout: number; readonly maxBuffer: number }) => Promise<{ readonly stdout: Buffer | string; readonly stderr: Buffer | string }>;
}

export interface DockerRunResult {
  readonly status: "completed" | "timed-out" | "failed";
  readonly stdout: string;
  readonly stderr: string;
  readonly outputBytes: number;
  readonly truncated: boolean;
  readonly evidenceDigest: string;
  readonly redacted: true;
  readonly durationMs: number;
}

/** Execute a previously validated Docker argv with bounded host supervision. */
export async function runDockerInvocation(args: readonly string[], options: DockerRunOptions): Promise<DockerRunResult> {
  if (!Array.isArray(args) || args.length === 0) throw new Error("Docker Hunt invocation must not be empty");
  if (!Number.isInteger(options.timeoutMs) || options.timeoutMs <= 0 || options.timeoutMs > 600_000) throw new Error("Docker Hunt timeout is out of bounds");
  if (!Number.isInteger(options.maxOutputBytes) || options.maxOutputBytes <= 0 || options.maxOutputBytes > 10_000_000) throw new Error("Docker Hunt output limit is out of bounds");
  const run = options.run ?? (async (argv, runOptions) => {
    const result = await execFileAsync("docker", [...argv], { encoding: "buffer", timeout: runOptions.timeout, maxBuffer: runOptions.maxBuffer });
    return { stdout: result.stdout, stderr: result.stderr };
  });
  const started = Date.now();
  try {
    const result = await run(args, { timeout: options.timeoutMs, maxBuffer: options.maxOutputBytes });
    return finish("completed", result.stdout, result.stderr, started, options.maxOutputBytes, options.sensitivePaths);
  } catch (error) {
    const failure = error as NodeJS.ErrnoException & { readonly killed?: boolean; readonly signal?: string; readonly stdout?: Buffer | string; readonly stderr?: Buffer | string };
    const timedOut = failure.killed === true || failure.code === "ETIMEDOUT" || failure.signal === "SIGTERM";
    return finish(timedOut ? "timed-out" : "failed", failure.stdout ?? "", failure.stderr ?? "", started, options.maxOutputBytes, options.sensitivePaths);
  }
}

function finish(status: DockerRunResult["status"], stdout: Buffer | string, stderr: Buffer | string, started: number, maxOutputBytes: number, sensitivePaths: readonly string[] = []): DockerRunResult {
  const rawStdoutBytes = byteLength(stdout);
  const rawStderrBytes = byteLength(stderr);
  const redacted = redactHuntOutput(toText(stdout), toText(stderr), maxOutputBytes, sensitivePaths);
  const stdoutText = toBoundedText(redacted.stdout, maxOutputBytes);
  const remaining = Math.max(0, maxOutputBytes - stdoutText.bytes);
  const stderrText = toBoundedText(redacted.stderr, remaining);
  const evidence = { stdout: stdoutText.text, stderr: stderrText.text, truncated: redacted.truncated || stdoutText.truncated || stderrText.truncated };
  return {
    status,
    stdout: stdoutText.text,
    stderr: stderrText.text,
    outputBytes: stdoutText.bytes + stderrText.bytes,
    truncated: evidence.truncated || rawStdoutBytes + rawStderrBytes > maxOutputBytes,
    evidenceDigest: huntEvidenceDigest(evidence),
    redacted: true,
    durationMs: Math.max(0, Date.now() - started),
  };
}

function toText(value: Buffer | string): string { return Buffer.isBuffer(value) ? value.toString("utf8") : value; }

function toBoundedText(value: Buffer | string, maxBytes: number): { readonly text: string; readonly bytes: number; readonly truncated: boolean } {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value, "utf8");
  if (bytes.byteLength <= maxBytes) return { text: bytes.toString("utf8"), bytes: bytes.byteLength, truncated: false };
  let end = maxBytes;
  let text = bytes.subarray(0, end).toString("utf8");
  // A byte cut can create U+FFFD, which re-encodes to three bytes. Trim until
  // the returned UTF-8 text itself satisfies the advertised byte bound.
  while (end > 0 && Buffer.byteLength(text, "utf8") > maxBytes) {
    end -= 1;
    text = bytes.subarray(0, end).toString("utf8");
  }
  return { text, bytes: Buffer.byteLength(text, "utf8"), truncated: true };
}

function byteLength(value: Buffer | string): number { return Buffer.isBuffer(value) ? value.byteLength : Buffer.byteLength(value, "utf8"); }
