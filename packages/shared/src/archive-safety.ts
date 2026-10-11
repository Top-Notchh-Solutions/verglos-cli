import { posix } from "node:path";

export interface ArchiveMember { readonly path: string; readonly kind: "file" | "directory" | "symlink" | "hardlink"; readonly size: number; readonly linkTarget?: string; }
export class ArchiveSafetyError extends Error { override readonly name = "ArchiveSafetyError"; constructor(readonly code: "TRAVERSAL" | "LINK_ESCAPE" | "DUPLICATE" | "LIMIT", message: string) { super(message); } }

export function validateArchiveMembers(members: readonly ArchiveMember[], limits: { maxMembers?: number; maxBytes?: number } = {}): readonly ArchiveMember[] {
  const maxMembers = limits.maxMembers ?? 100_000; const maxBytes = limits.maxBytes ?? 1_073_741_824;
  if (!Number.isSafeInteger(maxMembers) || maxMembers <= 0 || !Number.isSafeInteger(maxBytes) || maxBytes <= 0) throw new ArchiveSafetyError("LIMIT", "Archive resource limits must be positive safe integers.");
  if (members.length > maxMembers) throw new ArchiveSafetyError("LIMIT", "Archive exceeds the member limit.");
  const seen = new Set<string>(); let total = 0;
  for (const member of members) {
    if (!member || typeof member.path !== "string" || !["file", "directory", "symlink", "hardlink"].includes(member.kind)) throw new ArchiveSafetyError("LIMIT", "Archive member metadata is invalid.");
    const path = member.path.replaceAll("\\", "/");
    if (!path || path === "." || path.includes("\0") || path.startsWith("/") || /^[A-Za-z]:\//.test(path) || posix.normalize(path) !== path || path.split("/").includes("..")) throw new ArchiveSafetyError("TRAVERSAL", "Archive member path escapes the extraction root.");
    if (seen.has(path)) throw new ArchiveSafetyError("DUPLICATE", "Archive contains duplicate member paths."); seen.add(path);
    if (!Number.isSafeInteger(member.size) || member.size < 0) throw new ArchiveSafetyError("LIMIT", "Archive member size is invalid.");
    if (member.size > maxBytes - total) throw new ArchiveSafetyError("LIMIT", "Archive exceeds the aggregate size limit.");
    total += member.size;
    if (member.kind === "symlink" || member.kind === "hardlink") {
      if (typeof member.linkTarget !== "string" || !member.linkTarget || member.linkTarget.includes("\0")) throw new ArchiveSafetyError("LINK_ESCAPE", "Archive link target is invalid.");
      const target = member.linkTarget.replaceAll("\\", "/"); const resolved = posix.normalize(posix.join(posix.dirname(path), target));
      if (target.startsWith("/") || /^[A-Za-z]:\//.test(target) || resolved.startsWith("../") || resolved === ".." || resolved.startsWith("/")) throw new ArchiveSafetyError("LINK_ESCAPE", "Archive link target escapes the extraction root.");
    }
  }
  return Object.freeze([...members]);
}
