import assert from "node:assert/strict";
import { mkdtemp, mkdir, symlink } from "node:fs/promises";
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
} as const;

test("Docker invocation is pinned and deny-by-default", () => {
  const args = buildDockerInvocation(input);
  assert.deepEqual(args.slice(0, 14), ["run", "--rm", "--init", "--stop-timeout", "1", "--network", "none", "--read-only", "--tmpfs", "/tmp:rw,noexec,nosuid,nodev", "--cap-drop", "ALL", "--security-opt", "no-new-privileges"]);
  assert.ok(args.includes("--pids-limit"));
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
});
