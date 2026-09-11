import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "");
if (!process.argv[2]) throw new Error("release artifact directory is required");

const checksumsPath = join(root, "SHA256SUMS");
const checksums = await readFile(checksumsPath, "utf8");
const expected = new Map();
for (const line of checksums.split(/\r?\n/).filter(Boolean)) {
  const match = /^(?<digest>[a-f0-9]{64})  \*?(?:\.\/)?(?<name>[A-Za-z0-9._-]+)$/.exec(line);
  if (!match) throw new Error(`invalid checksum entry: ${line}`);
  expected.set(match.groups.name, match.groups.digest);
}
const archives = (await readdir(root)).filter((name) => name.endsWith(".tgz")).sort();
if (archives.length === 0) throw new Error("release artifact directory contains no npm archives");
if (expected.size !== archives.length || archives.some((name) => !expected.has(name))) {
  throw new Error("SHA256SUMS does not describe exactly the archived release artifacts");
}
for (const name of archives) {
  const digest = createHash("sha256").update(await readFile(join(root, name))).digest("hex");
  if (digest !== expected.get(name)) throw new Error(`checksum mismatch: ${basename(name)}`);
}
console.log(`verified ${archives.length} release artifact checksums`);
