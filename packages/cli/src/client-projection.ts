import { lstat, readFile } from "node:fs/promises";
import { admitClientProjectionUpload, type ClientUploadApproval } from "@verglos/shared";

const MAX_BYTES = 256 * 1024;

async function readJson(path: string): Promise<unknown> {
  const entry = await lstat(path);
  if (!entry.isFile() || entry.size > MAX_BYTES) throw new Error("client projection input must be a bounded regular file");
  const bytes = await readFile(path);
  if (bytes.byteLength > MAX_BYTES) throw new Error("client projection input exceeds the 256 KiB limit");
  try { return JSON.parse(bytes.toString("utf8")); } catch { throw new Error("client projection input must be valid JSON"); }
}

export async function executeClientProjection(
  projectionPath: string,
  approvalPath: string,
  actorOrganizationId: string,
  json = false,
  quiet = false,
): Promise<number> {
  try {
    const projection = await readJson(projectionPath);
    const approval = await readJson(approvalPath) as ClientUploadApproval;
    const result = admitClientProjectionUpload({ actorOrganizationId, projection, approval, now: new Date().toISOString() });
    if (!result.ok) {
      if (json) console.log(JSON.stringify({ status: "denied", reason: result.reason }));
      else if (!quiet) console.error(`[STUDIO_CLIENT_PROJECTION_DENIED] ${result.reason}`);
      return 78;
    }
    if (json) console.log(JSON.stringify({ status: "ready", projectionDigest: result.projectionDigest, projection: result.projection }));
    else if (!quiet) console.log(`Client projection ready: ${result.projectionDigest}`);
    return 0;
  } catch (error) {
    if (json) console.log(JSON.stringify({ status: "error", code: "STUDIO_CLIENT_PROJECTION_INPUT", message: "client projection validation failed" }));
    else if (!quiet) console.error(error instanceof Error ? error.message : "Client projection validation failed.");
    return 78;
  }
}
