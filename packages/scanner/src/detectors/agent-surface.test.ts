import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, before, after } from "node:test";
import assert from "node:assert/strict";

// Isolate HOME so we do not read the developer's real MCP configs.
const tempHome = mkdtempSync(join(tmpdir(), "verglos-agent-surface-test-"));
process.env.HOME = tempHome;

const { agentSurfaceDetector } = await import("./agent-surface.js");

after(() => {
  rmSync(tempHome, { recursive: true, force: true });
});

function writeCursorConfig(mcpServers: Record<string, unknown>) {
  const dir = join(tempHome, ".cursor");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "mcp.json"), JSON.stringify({ mcpServers }));
}

const noFiles: never[] = [];
const projectRoot = tempHome; // arbitrary — detector only cares about home + this arg.

test("agent-surface: emits no findings when there is no MCP config", async () => {
  rmSync(join(tempHome, ".cursor"), { recursive: true, force: true });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  assert.equal(findings.length, 0);
});

test("agent-surface: AGENT-001 fires on wildcard allowedTools", async () => {
  writeCursorConfig({
    everything: {
      command: "npx",
      args: ["-y", "@vendor/everything-mcp@1.0.0"],
      allowedTools: ["*"],
    },
  });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  const agent001 = findings.filter((f) => f.rule === "AGENT-001");
  assert.equal(agent001.length, 1);
  assert.equal(agent001[0]?.severity, "high");
  assert.match(agent001[0]?.description ?? "", /allowedTools: \["\*"\]/);
});

test("agent-surface: AGENT-001 fires with medium severity when allowedTools is missing", async () => {
  writeCursorConfig({
    "unrestricted-server": {
      command: "npx",
      args: ["-y", "@vendor/foo-mcp@1.0.0"],
    },
  });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  const agent001 = findings.filter((f) => f.rule === "AGENT-001");
  assert.equal(agent001.length, 1);
  assert.equal(agent001[0]?.severity, "medium");
});

test("agent-surface: AGENT-002 fires on a real-shaped Anthropic key in env", async () => {
  writeCursorConfig({
    "claude-search": {
      command: "npx",
      args: ["-y", "@vendor/mcp@1.0.0"],
      allowedTools: ["search"],
      env: {
        // Fake but shape-matching Anthropic key.
        ANTHROPIC_API_KEY: "sk-ant-abcdefghijklmnopqrstuvwxyz1234567890",
      },
    },
  });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  const agent002 = findings.filter((f) => f.rule === "AGENT-002");
  assert.equal(agent002.length, 1);
  assert.equal(agent002[0]?.severity, "critical");
  assert.match(agent002[0]?.title ?? "", /Anthropic/);
});

test("agent-surface: AGENT-002 does NOT fire on a $VAR reference", async () => {
  writeCursorConfig({
    "claude-search": {
      command: "npx",
      args: ["-y", "@vendor/mcp@1.0.0"],
      allowedTools: ["search"],
      env: {
        ANTHROPIC_API_KEY: "${ANTHROPIC_API_KEY}",
      },
    },
  });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  const agent002 = findings.filter((f) => f.rule === "AGENT-002");
  assert.equal(agent002.length, 0);
});

test("agent-surface: AGENT-003 fires on an unpinned npx package", async () => {
  writeCursorConfig({
    fetcher: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-fetch"],
      allowedTools: ["fetch"],
    },
  });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  const agent003 = findings.filter((f) => f.rule === "AGENT-003");
  assert.equal(agent003.length, 1);
  assert.match(agent003[0]?.description ?? "", /unpinned|no @version|latest/);
});

test("agent-surface: AGENT-003 does NOT fire on a pinned npx package", async () => {
  writeCursorConfig({
    fetcher: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-fetch@2025.4.29"],
      allowedTools: ["fetch"],
    },
  });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  const agent003 = findings.filter((f) => f.rule === "AGENT-003");
  assert.equal(agent003.length, 0);
});

test("agent-surface: AGENT-004 fires on filesystem MCP rooted at $HOME", async () => {
  writeCursorConfig({
    fs: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-filesystem@1.0.0", tempHome],
      allowedTools: ["read_file", "write_file"],
    },
  });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  const agent004 = findings.filter((f) => f.rule === "AGENT-004");
  assert.equal(agent004.length, 1);
  assert.equal(agent004[0]?.severity, "high");
});

test("agent-surface: AGENT-004 does NOT fire on a scoped filesystem root", async () => {
  writeCursorConfig({
    fs: {
      command: "npx",
      args: [
        "-y",
        "@modelcontextprotocol/server-filesystem@1.0.0",
        join(projectRoot, "workspace"),
      ],
      allowedTools: ["read_file", "write_file"],
    },
  });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  const agent004 = findings.filter((f) => f.rule === "AGENT-004");
  assert.equal(agent004.length, 0);
});

test("agent-surface: AGENT-005 fires on plaintext HTTP MCP URL", async () => {
  writeCursorConfig({
    remote: {
      url: "http://mcp.example.com/",
      allowedTools: ["ping"],
    },
  });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  const agent005 = findings.filter((f) => f.rule === "AGENT-005");
  assert.equal(agent005.length, 1);
  assert.equal(agent005[0]?.severity, "high");
});

test("agent-surface: AGENT-005 does NOT fire on localhost HTTP", async () => {
  writeCursorConfig({
    remote: {
      url: "http://localhost:8080/",
      allowedTools: ["ping"],
    },
  });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  const agent005 = findings.filter((f) => f.rule === "AGENT-005");
  assert.equal(agent005.length, 0);
});

test("agent-surface: all findings carry domain D11 and detector 'agent-surface'", async () => {
  writeCursorConfig({
    broken: {
      command: "npx",
      args: ["-y", "@vendor/mcp"],
      env: { SECRET_TOKEN: "sk-ant-abcdefghijklmnopqrstuvwxyz1234567890" },
      allowedTools: ["*"],
    },
  });
  const findings = await agentSurfaceDetector.run(noFiles, projectRoot);
  assert.ok(findings.length >= 3);
  for (const f of findings) {
    assert.equal(f.detector, "agent-surface");
    assert.equal(f.domain, "D11");
    assert.equal(f.category, "Agent Surface");
  }
});
