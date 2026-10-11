import { parentPort, workerData } from "node:worker_threads";

interface ProbeInput {
  readonly probe: "utf8-contains";
  readonly value: string;
  readonly needle: string;
}

function parseInput(value: unknown): ProbeInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid built-in probe input");
  const input = value as Record<string, unknown>;
  if (input.probe !== "utf8-contains") throw new Error("unknown built-in probe");
  if (typeof input.value !== "string" || typeof input.needle !== "string" || input.needle.length === 0) throw new Error("invalid built-in probe values");
  if (Buffer.byteLength(input.value, "utf8") > 4096 || Buffer.byteLength(input.needle, "utf8") > 4096) throw new Error("built-in probe input exceeds its bound");
  return { probe: input.probe, value: input.value, needle: input.needle };
}

// This worker contains the entire A1 probe catalog. It imports no filesystem,
// network, process-execution, VM, or module-loading API and never evaluates
// recipe text as code or as a command line.
const input = parseInput(workerData);
parentPort?.postMessage({ matched: input.value.includes(input.needle) });
