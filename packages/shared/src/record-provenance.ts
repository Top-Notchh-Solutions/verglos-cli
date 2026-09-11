import { releaseRecordManifestDigest } from "./record-digest.js";
import { parseReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";

const PREDICATE_TYPE = "https://verglos.dev/attestations/release/v1" as const;
const SUBJECT_ID = /^urn:verglos:subject:([a-z-]+):sha256:([a-f0-9]{64})$/u;

export interface ReleasePredicate {
  readonly predicateType: typeof PREDICATE_TYPE;
  readonly manifestDigest: string;
  readonly subjectIds: readonly string[];
  readonly limitations: readonly string[];
}

export interface ReleaseStatement extends ReleasePredicate {
  readonly _type: "https://in-toto.io/Statement/v1";
  readonly subject: readonly { readonly name: string; readonly digest: { readonly sha256: string } }[];
  readonly predicate: { readonly manifestDigest: string; readonly subjectIds: readonly string[]; readonly limitations: readonly string[] };
}

function normalizeSubjects(subjectIds: readonly string[]) {
  const unique = [...new Set(subjectIds)].sort();
  if (!unique.length) throw new Error("release predicate requires at least one subject");
  return unique.map((subjectId) => {
    const match = SUBJECT_ID.exec(subjectId);
    if (!match) throw new Error("release predicate subject IDs must be canonical sha256 Verglos subjects");
    return { subjectId, name: subjectId, digest: { sha256: match[2]! } };
  });
}

export function createReleasePredicate(manifest: ReleaseRecordManifestDocument, subjectIds: readonly string[]): ReleasePredicate {
  const parsed = parseReleaseRecordManifest(manifest);
  const subjects = normalizeSubjects(subjectIds);
  const manifestDigest = releaseRecordManifestDigest(parsed);
  return { predicateType: PREDICATE_TYPE, manifestDigest, subjectIds: Object.freeze(subjects.map((entry) => entry.subjectId)), limitations: Object.freeze([...parsed.limitations]) };
}

/** Build a standard in-toto Statement binding the exact Release Record and subjects. */
export function createReleaseStatement(manifest: ReleaseRecordManifestDocument, subjectIds: readonly string[]): ReleaseStatement {
  const predicate = createReleasePredicate(manifest, subjectIds);
  const subjects = normalizeSubjects(predicate.subjectIds);
  return {
    ...predicate,
    _type: "https://in-toto.io/Statement/v1",
    subject: Object.freeze(subjects.map(({ name, digest }) => ({ name, digest }))),
    predicate: Object.freeze({ manifestDigest: predicate.manifestDigest, subjectIds: predicate.subjectIds, limitations: predicate.limitations }),
  };
}
