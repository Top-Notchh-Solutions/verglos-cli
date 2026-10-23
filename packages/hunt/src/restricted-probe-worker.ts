import { parentPort, workerData } from "node:worker_threads";

type ProbeInput =
  | { readonly probe: "utf8-contains"; readonly value: string; readonly needle: string }
  | { readonly probe: "path-traversal"; readonly path: string }
  | { readonly probe: "command-injection"; readonly input: string }
  | { readonly probe: "ssrf-target"; readonly url: string }
  | { readonly probe: "tenant-boundary"; readonly authorizedTenant: string; readonly requestedTenant: string }
  | { readonly probe: "sql-injection"; readonly input: string }
  | { readonly probe: "xss-safe"; readonly html: string }
  | { readonly probe: "agent-boundary"; readonly allowlist: string; readonly tool: string };

function parseInput(value: unknown): ProbeInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid built-in probe input");
  const input = value as Record<string, unknown>;
  const probe = input.probe;
  if (probe === "utf8-contains") {
    if (typeof input.value !== "string" || typeof input.needle !== "string" || input.needle.length === 0) throw new Error("invalid built-in probe values");
    bound(input.value, input.needle);
    return { probe, value: input.value, needle: input.needle };
  }
  if (probe === "path-traversal" && typeof input.path === "string") { bound(input.path); return { probe, path: input.path }; }
  if (probe === "command-injection" && typeof input.input === "string") { bound(input.input); return { probe, input: input.input }; }
  if (probe === "ssrf-target" && typeof input.url === "string") { bound(input.url); return { probe, url: input.url }; }
  if (probe === "sql-injection" && typeof input.input === "string") { bound(input.input); return { probe, input: input.input }; }
  if (probe === "xss-safe" && typeof input.html === "string") { bound(input.html); return { probe, html: input.html }; }
  if (probe === "agent-boundary" && typeof input.allowlist === "string" && typeof input.tool === "string") {
    bound(input.allowlist, input.tool);
    return { probe, allowlist: input.allowlist, tool: input.tool };
  }
  if (probe === "tenant-boundary" && typeof input.authorizedTenant === "string" && typeof input.requestedTenant === "string") {
    bound(input.authorizedTenant, input.requestedTenant);
    return { probe, authorizedTenant: input.authorizedTenant, requestedTenant: input.requestedTenant };
  }
  throw new Error("invalid built-in probe values");
}

function bound(...values: readonly string[]): void {
  if (values.some((value) => value.length === 0 || Buffer.byteLength(value, "utf8") > 4096)) throw new Error("built-in probe input exceeds its bound");
}

function isPrivateOrLocalTarget(value: string): boolean {
  let parsed: URL;
  try { parsed = new URL(value); } catch { return false; }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
  const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host === "localhost.localdomain" || host === "::1" || host === "0.0.0.0" || host === "169.254.169.254") return true;
  const octets = host.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) return false;
  const [first, second] = octets;
  return first === 10 || (first === 172 && second !== undefined && second >= 16 && second <= 31) || (first === 192 && second === 168) || first === 127;
}

function runProbe(input: ProbeInput): boolean {
  switch (input.probe) {
    case "utf8-contains": return input.value.includes(input.needle);
    case "path-traversal": return input.path.split(/[\\/]+/u).some((segment) => segment === "..");
    case "command-injection": return /[;&|`$()<>\n\r]/u.test(input.input);
    case "ssrf-target": return isPrivateOrLocalTarget(input.url);
    case "tenant-boundary": return input.authorizedTenant !== input.requestedTenant;
    case "sql-injection": return /(?:['"`]\s*(?:OR|AND)\s+['"`]?\w+['"`]?\s*=|--|\/\*)/iu.test(input.input);
    case "xss-safe": return /<script\b|\bon[a-z]+\s*=|javascript\s*:/iu.test(input.html);
    case "agent-boundary": return !input.allowlist.split(",").map((tool) => tool.trim()).filter(Boolean).includes(input.tool);
  }
}

// This worker contains the entire A1 probe catalog. It imports no filesystem,
// network, process-execution, VM, or module-loading API and never evaluates
// recipe text as code or as a command line.
const input = parseInput(workerData);
const matched = runProbe(input);
const usage = process.resourceUsage();
parentPort?.postMessage({
  matched,
  cpuMs: Math.max(0, Math.ceil((usage.userCPUTime + usage.systemCPUTime) / 1_000)),
  peakMemoryBytes: Math.max(0, process.memoryUsage().rss),
});
