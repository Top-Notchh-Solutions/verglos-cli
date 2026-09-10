import { releaseRecordManifestDigest } from "./record-digest.js";
import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";

export interface ReleasePredicate { readonly predicateType: "https://verglos.dev/attestations/release/v1"; readonly manifestDigest: string; readonly subjectIds: readonly string[]; readonly limitations: readonly string[]; }
export function createReleasePredicate(manifest: ReleaseRecordManifestDocument, subjectIds: readonly string[]): ReleasePredicate { const parsed = parseReleaseRecordManifest(manifest); if (!subjectIds.length) throw new Error("release predicate requires at least one subject"); return { predicateType: "https://verglos.dev/attestations/release/v1", manifestDigest: releaseRecordManifestDigest(parsed), subjectIds: Object.freeze([...new Set(subjectIds)].sort()), limitations: Object.freeze([...parsed.limitations]) }; }
