import {
  resolveArtifactTarget, resolveFilesystemTarget, resolvePackageTarget, resolveRepositoryTarget, resolveSbomTarget,
  resolveOciLayout,
  type TargetKind,
} from "@verglos/shared";

export async function executeTargetInspect(kind: TargetKind, value: string, json = false, quiet = false): Promise<number> {
  const target = { kind, value } as const;
  const context = { cwd: process.cwd(), allowNetwork: false, executeProjectCode: false as const };
  try {
    if (kind === "oci") {
      const subject = await resolveOciLayout(value);
      const output = { target, subject, coverage: "complete" as const, limitations: [] as readonly string[] };
      if (json) console.log(JSON.stringify(output));
      else if (!quiet) { console.log(`Target: ${kind} ${value}`); console.log(`Coverage: ${output.coverage}`); console.log(`Subject: ${subject.subjectId}`); }
      return 0;
    }
    const result = kind === "repository" ? await resolveRepositoryTarget(target, context)
      : kind === "package" ? await resolvePackageTarget(target, context)
      : kind === "filesystem" ? await resolveFilesystemTarget(target, context)
      : kind === "artifact" ? await resolveArtifactTarget(target, context)
      : kind === "sbom" ? await resolveSbomTarget(target, context)
      : null;
    if (!result) { if (json) console.log(JSON.stringify({ kind, value, status: "unsupported" })); else console.log("Target kind is unsupported by this resolver."); return 78; }
    const output = { target: result.target, subject: result.subject, coverage: result.coverage, limitations: result.limitations };
    if (json) console.log(JSON.stringify(output));
    else if (!quiet) { console.log(`Target: ${kind} ${value}`); console.log(`Coverage: ${result.coverage}`); console.log(`Subject: ${(result.subject as { subjectId?: string }).subjectId ?? "unavailable"}`); if (result.limitations.length) console.log(`Limitations: ${result.limitations.join("; ")}`); }
    return result.coverage === "complete" ? 0 : 3;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Target inspection failed.";
    if (json) console.log(JSON.stringify({ target, status: "error", message: "target inspection failed" })); else if (!quiet) console.error(message);
    return 78;
  }
}
