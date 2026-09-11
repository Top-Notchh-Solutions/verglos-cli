import { createReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";
import { describeRecordMember } from "./record-store.js";

export function assembleReleaseRecord(input: Omit<ReleaseRecordManifestDocument, "members" | "extensions"> & { readonly members: ReleaseRecordManifestDocument["members"]; readonly extensions?: ReleaseRecordManifestDocument["extensions"] }): ReleaseRecordManifestDocument {
  if (input.members.filter((member) => member.kind === "release-decision").length !== 1) throw new Error("Release Record assembly requires exactly one release-decision member");
  return createReleaseRecordManifest(input);
}

export interface ReleaseRecordPayloadInput {
  readonly path: string;
  readonly kind: ReleaseRecordManifestDocument["members"][number]["kind"];
  readonly mediaType: string;
  readonly bytes: Uint8Array;
  readonly required: boolean;
  readonly redaction?: "none" | "applied" | "omitted";
  readonly schema?: ReleaseRecordManifestDocument["members"][number]["schema"];
}

/** Assemble a deterministic manifest and payload map from member bytes. */
export function assembleReleaseRecordBundle(input: Omit<ReleaseRecordManifestDocument, "members" | "extensions"> & { readonly payloads: readonly ReleaseRecordPayloadInput[]; readonly extensions?: ReleaseRecordManifestDocument["extensions"] }): { readonly manifest: ReleaseRecordManifestDocument; readonly payloads: ReadonlyMap<string, Uint8Array> } {
  const { payloads: payloadInputs, ...manifestInput } = input;
  if (payloadInputs.filter((payload) => payload.kind === "release-decision").length !== 1) throw new Error("Release Record assembly requires exactly one release-decision payload");
  const payloads = new Map<string, Uint8Array>();
  const members = payloadInputs.map((payload) => {
    if (payloads.has(payload.path)) throw new Error(`Release Record payload path is duplicated: ${payload.path}`);
    payloads.set(payload.path, payload.bytes);
    const member = describeRecordMember(payload);
    return payload.schema ? { ...member, schema: payload.schema } : member;
  });
  return { manifest: createReleaseRecordManifest({ ...manifestInput, members }), payloads };
}

/** Apply the minimum complete Release Record graph gate before publication. */
export function assertCompleteReleaseRecord(manifest: ReleaseRecordManifestDocument): ReleaseRecordManifestDocument {
  const parsed = createReleaseRecordManifest(manifest);
  const kinds = new Set(parsed.members.map((member) => member.kind));
  for (const required of ["subject", "policy-evaluation", "release-decision"] as const) {
    if (!kinds.has(required)) throw new Error(`complete Release Record requires a ${required} member`);
  }
  if (["complete", "partial"].includes(parsed.redaction.status) && !kinds.has("redaction-manifest")) throw new Error("complete Release Record requires a redaction-manifest member");
  return parsed;
}
