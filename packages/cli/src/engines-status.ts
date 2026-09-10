import type { listCachedEngines } from "@verglos/shared";

type EngineEntries = Awaited<ReturnType<typeof listCachedEngines>>;

export function formatEngineStatus(cacheRoot: string, engines: EngineEntries, json = false, quiet = false): string {
  if (quiet) return "";
  if (json) return JSON.stringify({ cacheRoot, engines: engines.map((engine) => ({ ...engine, trust: "computed-only" })) });
  if (engines.length === 0) return "No cached engines found.";
  return engines.map((engine) => engine.engineId + "@" + engine.version + " " + engine.digest + " (computed-only)").join("\n");
}
