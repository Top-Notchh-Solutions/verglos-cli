import assert from "node:assert/strict";
import { mkdtemp, mkdir, symlink, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { buildDockerInvocation, validateDockerProjectRoot } from "./docker-adapter.js";

const input = {
  projectRoot: "/tmp/project",
  image: "ghcr.io/verglos/probe",
  imageDigest: `sha256:${"a".repeat(64)}`,
  command: ["/probe", "--safe"],
  timeoutMs: 10_000,
  memoryMb: 256,
  maxProcesses: 32,
  cpus: 2,
  diskMb: 128,
} as const;

test("Docker invocation is pinned and deny-by-default", () => {
  const args = buildDockerInvocation(input);
  assert.deepEqual(args.slice(0, 8), ["run", "--rm", "--init", "--stop-timeout", "1", "--network", "none", "--ipc"]);
  assert.ok(args.includes("no-new-privileges"));
  assert.deepEqual(args.slice(args.indexOf("--ulimit"), args.indexOf("--ulimit") + 4), ["--ulimit", "nofile=1024:1024", "--ulimit", "core=0"]);
  assert.ok(args.includes("--pids-limit"));
  assert.deepEqual(args.slice(args.indexOf("--cpus"), args.indexOf("--cpus") + 2), ["--cpus", "2"]);
  assert.deepEqual(args.slice(args.indexOf("--user"), args.indexOf("--user") + 4), ["--user", "65532:65532", "--workdir", "/workspace"]);
  assert.ok(args.includes("--mount"));
  assert.ok(args.includes(`${input.image}@${input.imageDigest}`));
  assert.ok(Object.isFrozen(args));
});

test("Docker invocation rejects mutable images and unsafe command inputs", () => {
  assert.throws(() => buildDockerInvocation({ ...input, imageDigest: "latest" }), /pinned sha256/);
  assert.throws(() => buildDockerInvocation({ ...input, image: "ghcr.io/probe@latest" }), /safe reference/);
  assert.throws(() => buildDockerInvocation({ ...input, command: ["/probe", "x\u0000y"] }), /command/);
  assert.throws(() => buildDockerInvocation({ ...input, projectRoot: "relative" }), /absolute/);
  assert.throws(() => buildDockerInvocation({ ...input, cpus: 0 }), /CPU/);
  assert.throws(() => buildDockerInvocation({ ...input, diskMb: 0 }), /disk/);
});

test("Docker invocation fails closed for malformed runtime input shapes", () => {
  assert.throws(() => buildDockerInvocation({ ...input, image: undefined as never }), /safe reference/);
  assert.throws(() => buildDockerInvocation({ ...input, imageDigest: undefined as never }), /pinned sha256/);
  assert.throws(() => buildDockerInvocation({ ...input, command: undefined as never }), /command/);
});

test("Docker project-root validation rejects symlinks and non-directories", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-root-"));
  const target = join(root, "target");
  const link = join(root, "link");
  await mkdir(target);
  await symlink(target, link);
  await validateDockerProjectRoot(target);
  await assert.rejects(() => validateDockerProjectRoot(link), /symlink/);
  await assert.rejects(() => validateDockerProjectRoot(join(root, "missing")), /ENOENT/);
  await rm(root, { recursive: true, force: true });
});

test("Docker project-root validation rejects nested symlink escapes but permits in-root links", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-root-"));
  try {
    await writeFile(join(root, "target.txt"), "fixture");
    await symlink("target.txt", join(root, "safe-link"));
    await validateDockerProjectRoot(root);
    await rm(join(root, "safe-link"));
    await symlink("/etc/passwd", join(root, "escape-link"));
    await assert.rejects(() => validateDockerProjectRoot(root), /symlink escape/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
