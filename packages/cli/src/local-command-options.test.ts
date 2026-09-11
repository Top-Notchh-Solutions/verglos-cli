import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

test("read-only commands expose their implemented output flags", async () => {
  const source = await readFile(fileURLToPath(new URL("./index.ts", import.meta.url)), "utf8");
  for (const command of ["diff", "policy", "target", "engines"]) assert.ok(source.includes('.option("--json", "Emit machine-readable JSON")'), `${command} must retain JSON output support`);
  assert.ok(source.includes('.command("fix")') && source.includes('.option("--approve", "Approve the filesystem mutation")'));
  assert.match(source, /command\("fix"\)[\s\S]*?\.option\("--approval-receipt <path>"/);
  assert.match(source, /command\("sign <manifestPath> <signaturePath>"\)[\s\S]*?\.option\("--approval-receipt <path>"/);
  assert.ok(source.includes('.option("--rescan", "Run a local scan after applying the approved change")'));
  assert.match(source, /command\("fix"\)[\s\S]*?\.option\("--json", "Emit machine-readable JSON"\)/);
  assert.match(source, /command\("fix"\)[\s\S]*?\.option\("--quiet", "Suppress human output"\)/);
  assert.match(source, /policy\.command\("check <evaluation>"\)[\s\S]*?\.option\("--quiet", "Suppress human output"\)/);
  assert.match(source, /\.command\("secrets"\)[\s\S]*?\.option\("-q, --quiet", "Suppress terminal output"\)/);
  assert.match(source, /\.command\("deps"\)[\s\S]*?\.option\("-q, --quiet", "Suppress terminal output"\)/);
  assert.match(source, /\.command\("score"\)[\s\S]*?\.option\("-q, --quiet", "Suppress terminal output"\)/);
  assert.match(source, /evidence\.command\("export <input> <output>"\)[\s\S]*?if \(!opts\.quiet\) console\.error/);
  assert.match(source, /evidence\.command\("import <input>"\)[\s\S]*?if \(!opts\.quiet\) console\.error/);
  assert.match(source, /\.command\("diff <base> <head>"\)[\s\S]*?\.option\("--quiet", "Suppress human output"\)/);
  for (const command of ["scan", "score", "secrets", "deps", "ci", "precommit"]) assert.match(source, new RegExp(`command\\("${command}"\\)[\\s\\S]*?--config <path>`));
  for (const command of ["scan", "score", "secrets", "deps", "ci", "precommit"]) assert.match(source, new RegExp(`command\\("${command}"\\)[\\s\\S]*?--json`));
  for (const command of ["scan", "secrets", "deps"]) assert.match(source, new RegExp(`command\\("${command}"\\)[\\s\\S]*?--output <dir>`));
  for (const command of ["scan", "ci"]) assert.match(source, new RegExp(`command\\("${command}"\\)[\\s\\S]*?--policy <path>`));
  assert.match(source, /executePolicyCheck\(policyPath, opts\.json, opts\.quiet\)/g);
  assert.match(source, /if \(!opts\.quiet && !opts\.json\) console\.log\(chalk\.gray\("Watching for changes/);
  assert.match(source, /command\("precommit"\)[\s\S]*?\.option\("-q, --quiet", "Suppress terminal output"\)/);
  assert.match(source, /command\("hunt"\)[\s\S]*?\.option\("--json", "Emit machine-readable JSON"\)/);
  assert.match(source, /command\("hunt"\)[\s\S]*?\.option\("--quiet", "Suppress human output"\)/);
  assert.match(source, /command\("attest"\)[\s\S]*?\.option\("--json", "Emit machine-readable JSON"\)/);
  assert.match(source, /command\("attest"\)[\s\S]*?\.option\("--quiet", "Suppress human output"\)/);
  assert.match(source, /command\("explain \[rule\]"\)[\s\S]*?\.option\("--json", "Emit machine-readable JSON"\)/);
  assert.match(source, /command\("explain \[rule\]"\)[\s\S]*?\.option\("--quiet", "Suppress human output"\)/);
  assert.equal(source.includes('.option("--policy"'), false);
});

test("nested command groups are fully registered before Commander parses", async () => {
  const source = await readFile(fileURLToPath(new URL("./index.ts", import.meta.url)), "utf8");
  const parseAt = source.lastIndexOf("program.parse();");
  assert.ok(parseAt > source.indexOf('evidence.command("import <input>")'));
  assert.ok(parseAt > source.indexOf('engines.command("install <engineId> <version> <artifactPath>")'));
  assert.equal((source.match(/program\.command\("engines"\)/g) ?? []).length, 1);
  assert.equal((source.match(/program\.command\("evidence"\)/g) ?? []).length, 1);
});

test("scan routes progress only to the interactive spinner", async () => {
  const source = await readFile(fileURLToPath(new URL("./scan.ts", import.meta.url)), "utf8");
  assert.match(source, /onProgress:\s*\(event\)/);
  assert.match(source, /if \(!spinner\) return/);
});

test("scan telemetry receives the resolved detector set", async () => {
  const source = await readFile(fileURLToPath(new URL("./scan.ts", import.meta.url)), "utf8");
  assert.match(source, /detectorsRun: detectors,/);
});
