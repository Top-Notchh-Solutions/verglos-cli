import { lstat, readFile } from "node:fs/promises";
import { inspectConfigMigration } from "@verglos/shared";

const MAX_CONFIG_BYTES = 1024 * 1024;

export async function executeConfigInspect(path: string, json = false, quiet = false): Promise<number> {
  try {
    const entry = await lstat(path);
    if (!entry.isFile() || entry.size > MAX_CONFIG_BYTES) throw new Error("Verglos config must be a bounded regular file");
    const bytes = await readFile(path);
    if (bytes.byteLength > MAX_CONFIG_BYTES) throw new Error("Verglos config must be a bounded regular file");
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
    if (!quiet) {
      const message = error instanceof Error ? error.message : "Unable to inspect Verglos config";
      if (json) console.log(JSON.stringify({ status: "invalid", warnings: [{ id: "invalid-config", message }] }));
      else console.error(`[CONFIG_INSPECT_INPUT] ${message}`);
    }
    return 78;
  }
}
