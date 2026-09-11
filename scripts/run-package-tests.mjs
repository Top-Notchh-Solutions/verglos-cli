import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";
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
const child = spawn(process.execPath, [...(usesTypeScript ? ["--import", "tsx"] : []), "--test", "--test-concurrency=1", ...files], { cwd: process.cwd(), stdio: "inherit", windowsHide: false });
const result = await new Promise((resolveResult, reject) => {
  child.once("error", reject);
  child.once("close", (code, signal) => resolveResult({ code, signal }));
});
if (result.signal) throw new Error(`test runner terminated by ${result.signal}`);
if (result.code !== 0) process.exit(result.code ?? 1);
