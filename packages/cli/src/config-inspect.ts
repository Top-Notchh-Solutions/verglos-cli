import { lstat, readFile } from "node:fs/promises";
import { extname } from "node:path";
import { inspectConfigMigration } from "@verglos/shared";

const MAX_CONFIG_BYTES = 1024 * 1024;

export async function executeConfigInspect(path: string, json = false, quiet = false): Promise<number> {
  try {
    const entry = await lstat(path);
    if (!entry.isFile() || entry.size > MAX_CONFIG_BYTES) throw new Error("Verglos config must be a bounded regular file");
    const bytes = await readFile(path);
    if (bytes.byteLength > MAX_CONFIG_BYTES) throw new Error("Verglos config must be a bounded regular file");
    if (extname(path).toLowerCase() === ".js") {
      const result = { status: "legacy", warnings: [{ id: "legacy-javascript-config", message: "JavaScript config is not evaluated. Migrate its settings manually to bounded JSON with schemaVersion '1.0.0', inspect that JSON file, then remove the legacy config." }] };
      if (json) console.log(JSON.stringify(result));
      else if (!quiet) { console.log(`Config status: ${result.status}`); for (const warning of result.warnings) console.log(`- ${warning.id}: ${warning.message}`); }
      return 0;
    }
    let value: unknown;
    try { value = JSON.parse(bytes.toString("utf8")); } catch { throw new Error("Verglos config must be valid JSON"); }
    const inspection = inspectConfigMigration(value);
    if (json) console.log(JSON.stringify(inspection));
    else if (!quiet) {
      console.log(`Config status: ${inspection.status}`);
      for (const warning of inspection.warnings) console.log(`- ${warning.id}: ${warning.message}`);
    }
    return inspection.status === "invalid" ? 78 : 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to inspect Verglos config";
    if (json) console.log(JSON.stringify({ status: "invalid", warnings: [{ id: "invalid-config", message: "config inspection failed" }] }));
    else if (!quiet) console.error(`[CONFIG_INSPECT_INPUT] ${message}`);
    return 78;
  }
}
