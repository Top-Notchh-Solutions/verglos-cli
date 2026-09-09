import { createReleaseRecordManifest, type ReleaseRecordManifestDocument } from "./record-manifest.js";

export function assembleReleaseRecord(input: Omit<ReleaseRecordManifestDocument, "members" | "extensions"> & { readonly members: ReleaseRecordManifestDocument["members"]; readonly extensions?: ReleaseRecordManifestDocument["extensions"] }): ReleaseRecordManifestDocument {
  if (input.members.filter((member) => member.kind === "release-decision").length !== 1) throw new Error("Release Record assembly requires exactly one release-decision member");
  return createReleaseRecordManifest(input);
}
