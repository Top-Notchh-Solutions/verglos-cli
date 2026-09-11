import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { runCliFixture } from "./cli-fixture.js";

test("login JSON network failure is one bounded machine-safe error", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-login-process-"));
  const home = await mkdtemp(join(tmpdir(), "verglos-login-home-"));
  try {
    const result = await runCliFixture(
      process.execPath,
      ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "login", "--json"],
      root,
      {
        timeoutMs: 3000,
        env: {
          HOME: home,
          VERGLOS_API_URL: "http://127.0.0.1:1",
          VERGLOS_DEV_SKIP_UPDATE_CHECK: "1",
        },
      },
    );
    assert.equal(result.exitCode, 1);
    assert.equal(result.stderr, "");
    assert.deepEqual(result.files, []);
    const lines = result.stdout.trim().split("\n");
    assert.equal(lines.length, 1);
    const payload = JSON.parse(lines[0]!);
    assert.equal(payload.status, "error");
    assert.equal(payload.code, "LOGIN_START");
    assert.equal(typeof payload.message, "string");
    assert.equal(payload.message.includes("device_code"), false);
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  }
});
