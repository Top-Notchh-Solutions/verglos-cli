import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

test("read-only commands expose their implemented output flags", async () => {
  const source = await readFile(fileURLToPath(new URL("./index.ts", import.meta.url)), "utf8");
  for (const command of ["diff", "policy", "target", "engines"]) assert.ok(source.includes('.option("--json", "Emit machine-readable JSON")'), `${command} must retain JSON output support`);
  assert.ok(source.includes('.command("fix")') && source.includes('.option("--approve", "Approve the filesystem mutation")'));
  assert.ok(source.includes('.option("--rescan", "Run a local scan after applying the approved change")'));
  assert.match(source, /policy\.command\("check <evaluation>"\)[\s\S]*?\.option\("--quiet", "Suppress human output"\)/);
  assert.match(source, /\.command\("secrets"\)[\s\S]*?\.option\("-q, --quiet", "Suppress terminal output"\)/);
  assert.match(source, /\.command\("deps"\)[\s\S]*?\.option\("-q, --quiet", "Suppress terminal output"\)/);
  assert.match(source, /\.command\("score"\)[\s\S]*?\.option\("-q, --quiet", "Suppress terminal output"\)/);
  assert.equal(source.includes('.option("--config"'), false);
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
