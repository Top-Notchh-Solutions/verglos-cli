import { normalize, posix } from "node:path";

export interface ArchiveMember { readonly path: string; readonly kind: "file" | "directory" | "symlink" | "hardlink"; readonly size: number; readonly linkTarget?: string; }
export class ArchiveSafetyError extends Error { override readonly name = "ArchiveSafetyError"; constructor(readonly code: "TRAVERSAL" | "LINK_ESCAPE" | "DUPLICATE" | "LIMIT", message: string) { super(message); } }

export function validateArchiveMembers(members: readonly ArchiveMember[], limits: { maxMembers?: number; maxBytes?: number } = {}): readonly ArchiveMember[] {
  const maxMembers = limits.maxMembers ?? 100_000; const maxBytes = limits.maxBytes ?? 1_073_741_824;
  if (members.length > maxMembers) throw new ArchiveSafetyError("LIMIT", "Archive exceeds the member limit.");
  const seen = new Set<string>(); let total = 0;
  for (const member of members) {
    const path = member.path.replaceAll("\\", "/");
    if (!path || path.startsWith("/") || /^[A-Za-z]:\//.test(path) || normalize(path) !== path || path.split("/").includes("..")) throw new ArchiveSafetyError("TRAVERSAL", "Archive member path escapes the extraction root.");
    if (seen.has(path)) throw new ArchiveSafetyError("DUPLICATE", "Archive contains duplicate member paths."); seen.add(path);
    if (!Number.isSafeInteger(member.size) || member.size < 0) throw new ArchiveSafetyError("LIMIT", "Archive member size is invalid."); total += member.size;
    if (total > maxBytes) throw new ArchiveSafetyError("LIMIT", "Archive exceeds the aggregate size limit.");
    if ((member.kind === "symlink" || member.kind === "hardlink") && member.linkTarget) {
      const target = member.linkTarget.replaceAll("\\", "/"); const resolved = posix.normalize(posix.join(posix.dirname(path), target));
      if (resolved.startsWith("../") || resolved === ".." || resolved.startsWith("/")) throw new ArchiveSafetyError("LINK_ESCAPE", "Archive link target escapes the extraction root.");
    }
  }
  return Object.freeze([...members]);
}
