import type { listCachedEngines } from "@verglos/shared";

type EngineEntries = Awaited<ReturnType<typeof listCachedEngines>>;

export function formatEngineStatus(cacheRoot: string, engines: EngineEntries, json = false): string {
  if (json) return JSON.stringify({ cacheRoot, engines });
  if (engines.length === 0) return "No cached engines found.";
  return engines.map((engine) => engine.engineId + "@" + engine.version + " " + engine.digest).join("\n");
}
