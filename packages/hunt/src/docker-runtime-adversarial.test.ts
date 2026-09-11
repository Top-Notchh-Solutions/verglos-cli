import assert from "node:assert/strict";
import { mkdtemp, readlink, rm, writeFile } from "node:fs/promises";
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

function namespaceIntegrationTest(name: string, fn: () => Promise<void>): void {
  test(name, { skip: process.platform !== "linux" || !enabled || !image || !imageDigest ? "requires Linux host namespace identifiers and a pinned test image" : false }, fn);
}

async function runFixture(root: string, command: readonly string[], timeoutMs = 10_000) {
  const args = buildDockerInvocation({ projectRoot: root, image: image!, imageDigest: imageDigest!, command, timeoutMs, memoryMb: 256, maxProcesses: 16, cpus: 1, diskMb: 128 });
  return runDockerInvocation(args, { timeoutMs, maxOutputBytes: 4_096, sensitivePaths: [root] });
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

integrationTest("Docker runtime does not expose the host Docker socket", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "test ! -S /var/run/docker.sock"]);
    assert.equal(result.status, "completed");
    assert.equal(result.exitCode, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime does not expose kernel device nodes", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "test ! -e /dev/kmsg"]);
    assert.equal(result.status, "completed");
    assert.equal(result.exitCode, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime enables no-new-privileges", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "grep -Eq '^NoNewPrivs:[[:space:]]+1$' /proc/self/status"]);
    assert.equal(result.status, "completed");
    assert.equal(result.exitCode, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime keeps the root filesystem read-only", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "! touch /verglos-rootfs-write"]);
    assert.equal(result.status, "completed");
    assert.equal(result.exitCode, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime redacts secret-shaped output before evidence", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "printf 'API_TOKEN=runtime-secret-value\\n'"]);
    assert.equal(result.status, "completed");
    assert.equal(result.exitCode, 0);
    assert.doesNotMatch(result.stdout, /runtime-secret-value/);
    assert.doesNotMatch(result.stdout, /API_TOKEN=/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime bounds captured output", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "i=0; while [ $i -lt 10000 ]; do printf x; i=$((i+1)); done"]);
    assert.ok(result.status === "completed" || result.status === "failed");
    assert.ok(result.outputBytes <= 4_096);
    assert.ok(Buffer.byteLength(result.stdout, "utf8") + Buffer.byteLength(result.stderr, "utf8") <= 4_096);
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime turns an over-time probe into an explicit timeout", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "sleep 30"], 500);
    assert.equal(result.status, "timed-out");
    assert.ok(result.exitCode === undefined || (result.exitCode >= 0 && result.exitCode <= 255));
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime bounds CPU-burning probes", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "while :; do :; done"], 500);
    assert.equal(result.status, "timed-out");
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime bounds process-tree growth", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "i=0; while [ $i -lt 256 ]; do (sleep 30) & i=$((i+1)); done; wait"], 1_000);
    assert.ok(result.status === "completed" || result.status === "failed" || result.status === "timed-out");
    assert.ok(result.outputBytes <= 4_096);
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime bounds writable tmpfs capacity", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "! dd if=/dev/zero of=/tmp/fill bs=1M count=256 2>/dev/null"], 5_000);
    assert.equal(result.status, "completed");
    assert.equal(result.exitCode, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});

integrationTest("Docker runtime exposes the approved memory ceiling", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "test \"$(cat /sys/fs/cgroup/memory.max)\" -le 268435456"], 5_000);
    assert.equal(result.status, "completed");
    assert.equal(result.exitCode, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});

namespaceIntegrationTest("Docker runtime keeps PID and IPC namespaces private", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const hostPidNamespace = await readlink("/proc/self/ns/pid");
    const hostIpcNamespace = await readlink("/proc/self/ns/ipc");
    const script = `test "$(readlink /proc/self/ns/pid)" != "${hostPidNamespace}" && test "$(readlink /proc/self/ns/ipc)" != "${hostIpcNamespace}"`;
    const result = await runFixture(root, ["/bin/sh", "-c", script], 5_000);
    assert.equal(result.status, "completed");
    assert.equal(result.exitCode, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});


integrationTest("Docker runtime records signal termination as a failed attempt", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-adversarial-"));
  try {
    const result = await runFixture(root, ["/bin/sh", "-c", "kill -TERM $$"], 5_000);
    assert.equal(result.status, "failed");
  } finally { await rm(root, { recursive: true, force: true }); }
});
