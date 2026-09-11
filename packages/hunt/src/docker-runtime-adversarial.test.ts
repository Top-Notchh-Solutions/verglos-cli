import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildDockerInvocation } from "./docker-adapter.js";
import { runDockerInvocation } from "./docker-runner.js";

const enabled = process.env.VERGLOS_HUNT_DOCKER_INTEGRATION === "1";
const image = process.env.VERGLOS_HUNT_TEST_IMAGE;
const imageDigest = process.env.VERGLOS_HUNT_TEST_DIGEST;

function integrationTest(name: string, fn: () => Promise<void>): void {
  test(name, { skip: !enabled || !image || !imageDigest ? "set VERGLOS_HUNT_DOCKER_INTEGRATION=1 with a pinned test image and digest" : false }, fn);
}

async function runFixture(root: string, command: readonly string[]) {
  const args = buildDockerInvocation({ projectRoot: root, image: image!, imageDigest: imageDigest!, command, timeoutMs: 10_000, memoryMb: 256, maxProcesses: 16, cpus: 1, diskMb: 128 });
  return runDockerInvocation(args, { timeoutMs: 10_000, maxOutputBytes: 4_096, sensitivePaths: [root] });
}

integrationTest("Docker runtime keeps the probe non-root", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "test \"$(id -u)\" = 65532"]);
    assert.equal(result.status, "completed");
    assert.equal(result.exitCode, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime prevents writes to the source mount", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    await writeFile(join(root, "input.txt"), "fixture\n");
    const result = await runFixture(root, ["/bin/sh", "-c", "! touch /workspace/blocked"]);
    assert.equal(result.status, "completed");
    assert.equal(result.exitCode, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime denies network access", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "! timeout 2 getent hosts example.com"]);
    assert.equal(result.status, "completed");
    assert.equal(result.exitCode, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});
