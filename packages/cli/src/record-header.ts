import { lstat, readFile } from "node:fs/promises";
import { parseLineageGraphDocument, parseReleaseDecisionJson, parseReleaseRecordManifestJson, parseSubjectJson, projectReleaseHeader, readAndVerifyRecord, type Subject } from "@verglos/shared";

const MAX_MANIFEST_BYTES = 8 * 1024 * 1024;

function subjectContentDigests(subject: Subject): readonly { readonly purpose: string; readonly digest: string }[] {
  const format = (value: { readonly algorithm: string; readonly value: string }) => `${value.algorithm}:${value.value}`;
  switch (subject.kind) {
    case "repository-tree": return [
      { purpose: "git-commit", digest: format(subject.commit) },
      { purpose: "git-tree", digest: format(subject.tree) },
      ...(subject.worktreeDigest ? [{ purpose: "worktree", digest: format(subject.worktreeDigest) }] : []),
    ];
    case "package": return [{ purpose: "package", digest: format(subject.digest) }];
    case "filesystem": return [
      { purpose: "filesystem-tree", digest: format(subject.treeDigest) },
      { purpose: "ignore-policy", digest: format(subject.ignorePolicyDigest) },
    ];
    case "sbom": return [{ purpose: "sbom-document", digest: format(subject.documentDigest) }];
    case "artifact": return [{ purpose: "artifact", digest: format(subject.digest) }];
    case "oci-manifest": return [{ purpose: "oci-manifest", digest: format(subject.digest) }];
    case "oci-index": return [
      { purpose: "oci-index", digest: format(subject.digest) },
      ...subject.manifests.map((manifest, index) => ({ purpose: `oci-manifest-${index + 1}`, digest: format(manifest.digest) })),
    ];
  }
}

export async function executeRecordHeader(storeRoot: string, manifestPath: string, json = false, quiet = false): Promise<number> {
  try {
    const entry = await lstat(manifestPath);
    if (!entry.isFile() || entry.size > MAX_MANIFEST_BYTES) throw new Error("record manifest must be a bounded regular file");
    const manifest = parseReleaseRecordManifestJson(await readFile(manifestPath));
    const members = await readAndVerifyRecord(storeRoot, manifest);
    const decisionMember = manifest.members.find((member) => member.kind === "release-decision");
    if (!decisionMember) throw new Error("record header requires a release-decision member");
    const decisionBytes = members.get(decisionMember.path);
    if (!decisionBytes) throw new Error("record header is missing the verified release-decision member");
    const decision = parseReleaseDecisionJson(decisionBytes);
    const lineageMember = manifest.members.find((member) => member.kind === "lineage" && member.redaction !== "omitted");
    const lineageBytes = lineageMember ? members.get(lineageMember.path) : undefined;
    const lineage = lineageBytes ? parseLineageGraphDocument(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(lineageBytes))) : undefined;
    if (lineage && (lineage.subjectIds.length !== decision.subjects.length || decision.subjects.some((subject) => !lineage.subjectIds.includes(subject.subjectId)))) throw new Error("record lineage graph does not match the release-decision subject set");
    const lineageProjection = lineage ? {
      status: "recorded" as const,
      edgeCount: lineage.edges.length,
      matched: lineage.edges.filter((edge) => edge.status === "matched").length,
      mismatched: lineage.edges.filter((edge) => edge.status === "mismatched").length,
      unavailable: lineage.edges.filter((edge) => edge.status === "unavailable").length,
      unverifiable: lineage.edges.filter((edge) => edge.status === "unverifiable").length,
      gapCount: lineage.gaps.length,
    } : { status: "not-recorded" as const, edgeCount: 0, matched: 0, mismatched: 0, unavailable: 0, unverifiable: 0, gapCount: 0 };
    const subjectIds = new Set(decision.subjects.map((subject) => subject.subjectId));
    const subjectEvidence = manifest.members.flatMap((member) => {
      if (member.kind !== "subject" || member.redaction === "omitted") return [];
      const bytes = members.get(member.path);
      if (!bytes) return [];
      const subject = parseSubjectJson(bytes);
      if (!subjectIds.has(subject.subjectId)) return [];
      return [{
        subjectId: subject.subjectId,
        memberDigest: `${member.digest.algorithm}:${member.digest.value}`,
        contentDigests: subjectContentDigests(subject),
      }];
    });
    const signerStatus = manifest.members.some((member) => member.kind === "signature" && member.redaction !== "omitted") ? "unknown" : "unsigned";
    const header = projectReleaseHeader(decision, signerStatus, subjectEvidence, manifest.limitations, lineageProjection);
    const subjects = header.subjects ?? [];
    if (json) console.log(JSON.stringify(header));
    else if (!quiet) {
      console.log(`${header.decision} ${header.subjectId}`);
      console.log(`Coverage: ${header.coverageStatus}`);
      for (const subject of subjects) {
        console.log(`Subject (${subject.role}): ${subject.subjectId}`);
        console.log(`  Identity digest: ${subject.identityDigest}`);
        if (subject.memberDigest) console.log(`  Verified record member: ${subject.memberDigest}`);
        for (const content of subject.contentDigests) console.log(`  ${content.purpose}: ${content.digest}`);
      }
      console.log(`Policy: ${header.policy.id}@${header.policy.version} (${header.policy.digest})`);
      console.log(`Generated: ${header.generatedAt}`);
      console.log(`Signer: ${header.signerStatus}`);
      console.log(`Lineage: ${lineageProjection.status}; ${lineageProjection.edgeCount} edges; ${lineageProjection.gapCount} gaps`);
      console.log(`Next: ${header.nextAction}`);
      for (const limitation of header.limitations) console.log(`Limitation: ${limitation}`);
    }
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to project record header";
    if (json) console.log(JSON.stringify({ status: "error", code: "RECORD_HEADER_INPUT", message: "record header projection failed" }));
    else if (!quiet) console.error(`[RECORD_HEADER_INPUT] ${message}`);
    return 78;
  }
}
