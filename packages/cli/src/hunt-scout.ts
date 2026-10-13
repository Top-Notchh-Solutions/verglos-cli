import {
  buildHuntTargetManifest,
  resolveFilesystemTarget,
  resolvePackageTarget,
  resolveRepositoryTarget,
  type TargetResolution,
} from "@verglos/shared";
import { resolve } from "node:path";

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;

function validProjectPath(value: string): boolean {
  return value.length > 0 && value.length <= 4096 && !CONTROL_CHARACTERS.test(value);
}

async function resolveLocalTarget(root: string): Promise<{ readonly kind: "repository" | "package" | "filesystem"; readonly result: TargetResolution }> {
  const context = { cwd: root, allowNetwork: false, executeProjectCode: false as const };
  try {
    return { kind: "repository", result: await resolveRepositoryTarget({ kind: "repository", value: root }, context) };
  } catch {
    // A local source tree does not need to be a Git checkout for Scout.
  }
  try {
    return { kind: "package", result: await resolvePackageTarget({ kind: "package", value: root }, context) };
  } catch {
    return { kind: "filesystem", result: await resolveFilesystemTarget({ kind: "filesystem", value: root }, context) };
  }
}

export async function executeHuntScout(projectPath = ".", json = false, quiet = false): Promise<number> {
  if (!validProjectPath(projectPath)) {
    if (json) console.log(JSON.stringify({ status: "error", code: "HUNT_SCOUT_INPUT", message: "hunt scout target is invalid" }));
    else if (!quiet) console.error("hunt scout target is invalid");
    return 2;
  }
  try {
    const root = resolve(projectPath);
    const target = await resolveLocalTarget(root);
    const subjectId = (target.result.subject as { subjectId?: unknown }).subjectId;
    if (typeof subjectId !== "string") throw new Error("target subject identity is unavailable");
    const manifest = await buildHuntTargetManifest({ root, targetSubjectId: subjectId });
    const output = {
      status: manifest.coverage.status === "complete" && target.result.coverage === "complete" ? "ok" as const : "incomplete" as const,
      targetKind: target.kind,
      subjectId,
      targetCoverage: target.result.coverage,
      targetLimitations: target.result.limitations,
      manifest,
    };
    if (json) console.log(JSON.stringify(output));
    else if (!quiet) {
      console.log(`Hunt Scout: ${output.status}`);
      console.log(`Target: ${output.targetKind}`);
      console.log(`Subject: ${output.subjectId}`);
      console.log(`Files inspected: ${manifest.coverage.filesInspected}`);
      if (manifest.coverage.limitations.length || target.result.limitations.length) console.log(`Limitations: ${[...target.result.limitations, ...manifest.coverage.limitations].join("; ")}`);
    }
    return output.status === "ok" ? 0 : 3;
  } catch {
    if (json) console.log(JSON.stringify({ status: "error", code: "HUNT_SCOUT_INPUT", message: "hunt scout failed" }));
    else if (!quiet) console.error("hunt scout failed");
    return 78;
  }
}
