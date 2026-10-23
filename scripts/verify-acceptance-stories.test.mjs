import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile } from "node:fs/promises";

test("acceptance story verifier binds the frozen story map to bounded reads", async () => {
  const source = await readFile(new URL("./verify-acceptance-stories.mjs", import.meta.url), "utf8");
  assert.match(source, /readBoundedJsonFile\(storyMapPath, "acceptance story map"\)/u);
  assert.doesNotMatch(source, /readFileSync\(storyMapPath/u);
});
