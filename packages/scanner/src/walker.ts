import fg from "fast-glob";
import type { VerglosConfig } from "@verglos/shared";

const DEFAULT_EXTENSIONS = [
  "js",
  "jsx",
  "ts",
  "tsx",
  "mjs",
  "cjs",
  "json",
  "env",
  "yaml",
  "yml",
  "md",
];

const ALWAYS_SCAN_FILES = [
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  "package.json",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
];

const ALWAYS_IGNORE = [
  "**/verglos-report*.html",
  "**/verglos-report*.json",
  "**/*.tgz",
];

export interface ScannedFile {
  path: string;
  relativePath: string;
}

export async function walkProject(
  projectRoot: string,
  config: VerglosConfig,
): Promise<ScannedFile[]> {
  const patterns = DEFAULT_EXTENSIONS.map((ext) => `**/*.${ext}`);
  const files = await fg(patterns, {
    cwd: projectRoot,
    absolute: true,
    dot: true,
    ignore: [...config.ignorePaths, ...ALWAYS_IGNORE],
    suppressErrors: true,
  });

  const alwaysScan = await fg(ALWAYS_SCAN_FILES, {
    cwd: projectRoot,
    absolute: true,
    dot: true,
    onlyFiles: true,
    suppressErrors: true,
  });

  const unique = new Map<string, ScannedFile>();
  for (const path of [...files, ...alwaysScan]) {
    unique.set(path, {
      path,
      relativePath: path.replace(projectRoot, "").replace(/^\//, ""),
    });
  }

  return [...unique.values()];
}
