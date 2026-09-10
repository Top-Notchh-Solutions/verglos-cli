import { createHash } from "node:crypto";
import { canonicalizeJson } from "./schema.js";
import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";

export function releaseRecordManifestDigest(manifest: ReleaseRecordManifestDocument): string {
  return `sha256:${createHash("sha256").update(canonicalizeJson(parseReleaseRecordManifest(manifest)), "utf8").digest("hex")}`;
}
