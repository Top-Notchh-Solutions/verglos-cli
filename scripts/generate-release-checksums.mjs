#!/usr/bin/env node

import { createHash } from "node:crypto";
import { lstat, readFile, readdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("release artifact directory is required");

const rootStat = await lstat(root);
if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) {
  throw new Error("release artifact directory must be a regular directory");
}

const outputPath = join(root, "SHA256SUMS");
try {
  const outputStat = await lstat(outputPath);
  if (!outputStat.isFile() || outputStat.isSymbolicLink()) {
    throw new Error("release checksum output must be a regular file");
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const names = (await readdir(root)).filter((name) => name !== "SHA256SUMS").sort();
if (names.length === 0) throw new Error("release artifact directory is empty");

const lines = [];
for (const name of names) {
  const path = join(root, name);
  const stat = await lstat(path);
  if (!stat.isFile() || stat.isSymbolicLink()) {
    throw new Error(`release artifact is not a regular file: ${name}`);
  }
  const digest = createHash("sha256").update(await readFile(path)).digest("hex");
  lines.push(`${digest}  ${name}`);
}

const output = `${lines.join("\n")}\n`;
await writeFile(outputPath, output, { encoding: "utf8", mode: 0o644 });
process.stdout.write(`wrote SHA256SUMS for ${names.length} release artifacts\n`);
