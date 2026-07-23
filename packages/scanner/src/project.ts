import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ProjectType } from "@verglos/shared";

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export async function detectProjectType(
  projectRoot: string,
): Promise<{ type: ProjectType; packageName: string }> {
  let packageName = "unknown";
  let deps: Record<string, string> = {};

  try {
    const raw = await readFile(join(projectRoot, "package.json"), "utf8");
    const pkg = JSON.parse(raw) as PackageJson;
    packageName = pkg.name ?? "unknown";
    deps = { ...pkg.dependencies, ...pkg.devDependencies };
  } catch {
    return { type: "unknown", packageName };
  }

  if (deps.next) return { type: "nextjs", packageName };
  if (deps.express) return { type: "express", packageName };
  if (deps.fastify) return { type: "fastify", packageName };
  if (deps.react) return { type: "react", packageName };
  if (Object.keys(deps).length > 0) return { type: "node", packageName };
  return { type: "unknown", packageName };
}

export async function getGitRemote(projectRoot: string): Promise<string | undefined> {
  try {
    const { execSync } = await import("node:child_process");
    const remote = execSync("git remote get-url origin", {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
    return remote || undefined;
  } catch {
    return undefined;
  }
}
