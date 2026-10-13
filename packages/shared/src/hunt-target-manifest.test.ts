import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { validateContractFixture } from "./fixture-validator.js";
import { buildHuntTargetManifest, parseHuntTargetManifest } from "./hunt-target-manifest.js";

const subjectId = `urn:verglos:subject:filesystem:sha256:${"a".repeat(64)}`;

test("Hunt Scout builds a source-free static manifest without executing package scripts", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-scout-"));
  const marker = join(root, "executed.txt");
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({
      name: "scout-fixture",
      version: "1.0.0",
      dependencies: { express: "^5.0.0", "@modelcontextprotocol/sdk": "^1.0.0" },
      scripts: { prepare: `node -e \"require('node:fs').writeFileSync(${JSON.stringify(marker)}, 'executed')\"` },
    }));
    await writeFile(join(root, "server.ts"), [
      `import express from "express";`,
      `import { exec } from "node:child_process";`,
      `const app = express();`,
      `app.get("/users", () => fetch("https://example.test/users"));`,
      `server.tool("get_user", {});`,
      `exec("echo candidate");`,
      `element.innerHTML = value;`,
    ].join("\n"));
    const manifest = await buildHuntTargetManifest({ root, targetSubjectId: subjectId });
    assert.deepEqual(parseHuntTargetManifest(manifest), manifest);
    assert.equal(validateContractFixture(manifest).valid, true);
    assert.equal(manifest.targetSubjectId, subjectId);
    assert.deepEqual(manifest.frameworks, ["express"]);
    assert.ok(manifest.entrypoints.some((entrypoint) => entrypoint.path === "package.json" && entrypoint.kind === "script" && entrypoint.name === "prepare"));
    assert.deepEqual(manifest.routes, [{ method: "GET", path: "/users", file: "server.ts" }]);
    assert.deepEqual(manifest.apis, manifest.routes);
    assert.deepEqual(manifest.agentMcpTools, ["get_user"]);
    assert.ok(manifest.dependencyBoundaries.includes("@modelcontextprotocol/sdk"));
    assert.ok(manifest.candidateSinks.some((sink) => sink.kind === "command-execution" && sink.path === "server.ts"));
    assert.ok(manifest.candidateSinks.some((sink) => sink.kind === "network-request" && sink.path === "server.ts"));
    const serialized = JSON.stringify(manifest);
    assert.equal(serialized.includes(root), false);
    assert.equal(serialized.includes("writeFileSync"), false);
    await assert.rejects(readFile(marker));
    assert.match(manifest.coverage.limitations.join("; "), /not reachability or vulnerability proof/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("Hunt Scout output is deterministic for the same bounded tree", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-scout-deterministic-"));
  try {
    await writeFile(join(root, "package.json"), JSON.stringify({ name: "deterministic", version: "1.0.0", scripts: { test: "echo test" } }));
    await writeFile(join(root, "index.js"), `const app = { get() {} }; app.get("/health", () => undefined);`);
    const first = await buildHuntTargetManifest({ root, targetSubjectId: subjectId });
    const second = await buildHuntTargetManifest({ root, targetSubjectId: subjectId });
    assert.deepEqual(second, first);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
