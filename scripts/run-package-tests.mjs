import { execFile } from "node:child_process";
import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const directory = resolve(process.cwd(), process.argv[2] ?? "src");

async function collect(path) {
  const entries = await readdir(path, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) files.push(...await collect(child));
    else if (entry.isFile() && (entry.name.endsWith(".test.ts") || entry.name.endsWith(".test.js"))) files.push(child);
  }
  return files;
}

const files = await collect(directory);
if (files.length === 0) throw new Error(`no test files found under ${directory}`);
const usesTypeScript = files.some((file) => file.endsWith(".ts"));
await run(process.execPath, [...(usesTypeScript ? ["--import", "tsx"] : []), "--test", ...files], { cwd: process.cwd(), stdio: "inherit" });
