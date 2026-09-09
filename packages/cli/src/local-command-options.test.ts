import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

test("read-only commands expose their implemented output flags", async () => {
  const source = await readFile(fileURLToPath(new URL("./index.ts", import.meta.url)), "utf8");
  for (const command of ["diff", "policy", "target", "engines"]) assert.ok(source.includes('.option("--json", "Emit machine-readable JSON")'), `${command} must retain JSON output support`);
  assert.match(source, /policy\.command\("check <evaluation>"\)[\s\S]*?\.option\("--quiet", "Suppress human output"\)/);
  assert.equal(source.includes('.option("--config"'), false);
  assert.equal(source.includes('.option("--policy"'), false);
});
