import { access, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import type { Detector } from "./types.js";

/**
 * Agent-surface detector (D11 — Pro tier `rule_pack_agent_surface`).
 *
 * Coding-agent installations (Cursor, Claude Code, Windsurf, Cline)
 * declare MCP servers via a JSON config. Those configs are executed
 * every time the agent starts a session: arbitrary shell commands,
 * environment-passed credentials, and a tool interface into the
 * developer's machine. That is a real attack surface the file-based
 * scanners cannot see — the configs live in $HOME, not in the repo.
 *
 * This detector reads the well-known config locations and emits
 * findings for:
 *
 *   AGENT-001  Wildcard tool grant (`allowedTools: "*"` / missing)
 *   AGENT-002  Plaintext credential in an MCP server's env block
 *   AGENT-003  Unpinned MCP server (`npx -y <pkg>` with no version)
 *   AGENT-004  Filesystem MCP server rooted at "/" or "$HOME"
 *   AGENT-005  HTTP (not HTTPS) MCP server URL
 *
 * The detector never mutates the config, never uploads it. Reads only.
 * Rules keep low false-positive rate — anything ambiguous is skipped
 * rather than flagged.
 */

interface AgentConfigLocation {
  agent: string;
  path: string;
  /** How the MCP entries are shaped in this file. */
  reader: (raw: string) => Record<string, McpServerEntry> | null;
}

interface McpServerEntry {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  allowedTools?: string[] | string;
  disallowedTools?: string[] | string;
}

const CREDENTIAL_ENV_NAMES = [
  "API_KEY",
  "SECRET",
  "TOKEN",
  "PASSWORD",
  "AUTH",
  "PRIVATE_KEY",
];

/**
 * Real-key shapes we look for inside env values. Deliberately
 * conservative — we do not flag on "starts with sk_" alone.
 */
const CREDENTIAL_VALUE_PATTERNS: Array<{ label: string; rx: RegExp }> = [
  { label: "Anthropic", rx: /\bsk-ant-[a-z0-9-]{20,}\b/i },
  { label: "OpenAI", rx: /\bsk-[A-Za-z0-9]{40,}\b/ },
  { label: "AWS", rx: /\bAKIA[0-9A-Z]{16}\b/ },
  { label: "GitHub", rx: /\bghp_[A-Za-z0-9]{30,}\b/ },
  { label: "Stripe", rx: /\bsk_(live|test)_[A-Za-z0-9]{20,}\b/ },
  { label: "Supabase", rx: /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/ },
];

function readMcpServers(raw: string): Record<string, McpServerEntry> | null {
  try {
    const j = JSON.parse(raw) as { mcpServers?: Record<string, McpServerEntry> };
    return j.mcpServers ?? null;
  } catch {
    return null;
  }
}

function readVscodeMcpServers(
  raw: string,
): Record<string, McpServerEntry> | null {
  try {
    const j = JSON.parse(raw) as {
      "cline.mcpServers"?: Record<string, McpServerEntry>;
    };
    return j["cline.mcpServers"] ?? null;
  } catch {
    return null;
  }
}

function agentConfigLocations(projectRoot: string): AgentConfigLocation[] {
  const home = homedir();
  return [
    { agent: "Cursor", path: join(home, ".cursor", "mcp.json"), reader: readMcpServers },
    { agent: "Cursor (project)", path: join(projectRoot, ".cursor", "mcp.json"), reader: readMcpServers },
    { agent: "Claude Code", path: join(home, ".claude", "mcp.json"), reader: readMcpServers },
    { agent: "Claude Code (project)", path: join(projectRoot, ".claude", "mcp.json"), reader: readMcpServers },
    { agent: "Windsurf", path: join(home, ".codeium", "windsurf", "mcp_config.json"), reader: readMcpServers },
    { agent: "Cline", path: join(projectRoot, ".vscode", "settings.json"), reader: readVscodeMcpServers },
  ];
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function checkWildcardTools(
  serverName: string,
  entry: McpServerEntry,
): { severity: Finding["severity"]; description: string } | null {
  const allowed = entry.allowedTools;
  // `allowedTools: "*"`, `["*"]`, or missing (default = all).
  if (typeof allowed === "string" && allowed === "*") {
    return {
      severity: "high",
      description: `MCP server "${serverName}" grants all tools (allowedTools: "*").`,
    };
  }
  if (Array.isArray(allowed) && allowed.includes("*")) {
    return {
      severity: "high",
      description: `MCP server "${serverName}" grants all tools ({allowedTools: ["*"]}).`,
    };
  }
  if (allowed === undefined) {
    return {
      severity: "medium",
      description: `MCP server "${serverName}" has no allowedTools list — every tool the server exposes is callable by the agent.`,
    };
  }
  return null;
}

function checkPlaintextCreds(
  serverName: string,
  entry: McpServerEntry,
): Array<{ envName: string; label: string }> {
  const hits: Array<{ envName: string; label: string }> = [];
  if (!entry.env) return hits;
  for (const [name, value] of Object.entries(entry.env)) {
    if (typeof value !== "string" || value.length === 0) continue;
    // Env-var references (${FOO}, $FOO) are not plaintext creds.
    if (/^\$\{?[A-Z0-9_]+\}?$/.test(value.trim())) continue;
    for (const { label, rx } of CREDENTIAL_VALUE_PATTERNS) {
      if (rx.test(value)) {
        hits.push({ envName: name, label });
        break;
      }
    }
    if (hits.some((h) => h.envName === name)) continue;
    // Fallback: env name looks credential-shaped AND value is
    // long+entropy-ish (rough — >20 chars, mixed case+digits).
    const nameLooksCred = CREDENTIAL_ENV_NAMES.some((n) => name.toUpperCase().includes(n));
    if (
      nameLooksCred &&
      value.length >= 20 &&
      /[A-Za-z]/.test(value) &&
      /[0-9]/.test(value)
    ) {
      hits.push({ envName: name, label: "credential-shaped" });
    }
  }
  return hits;
}

function checkUnpinnedNpx(entry: McpServerEntry): boolean {
  if (entry.command !== "npx") return false;
  const args = entry.args ?? [];
  if (args.length === 0) return false;
  // `npx -y <pkg>` or `npx <pkg>` — if no @version suffix, unpinned.
  const pkg = args.find(
    (a) => !a.startsWith("-") && a !== "--yes" && a !== "-y",
  );
  if (!pkg) return false;
  // Scoped: @scope/pkg@version — has two @, second is the pin.
  if (pkg.startsWith("@")) {
    return pkg.split("@").length < 3;
  }
  return !pkg.includes("@");
}

function checkOverscopedFilesystem(entry: McpServerEntry): boolean {
  // The @modelcontextprotocol/server-filesystem MCP is a common
  // supply-chain foot-gun when rooted at "/" or the home dir.
  if (entry.command !== "npx") return false;
  const args = entry.args ?? [];
  const isFilesystemServer = args.some((a) =>
    /@?modelcontextprotocol\/server-filesystem/.test(a),
  );
  if (!isFilesystemServer) return false;
  // Root path is the last positional arg after the package name.
  const roots = args.filter(
    (a) => !a.startsWith("-") && !a.includes("modelcontextprotocol"),
  );
  const home = homedir();
  return roots.some((r) => r === "/" || r === home || r === "~" || r === "$HOME");
}

function checkPlaintextHttpUrl(entry: McpServerEntry): boolean {
  if (!entry.url) return false;
  return entry.url.startsWith("http://") && !entry.url.startsWith("http://localhost")
    && !entry.url.startsWith("http://127.0.0.1");
}

export const agentSurfaceDetector: Detector = {
  id: "agent-surface",
  async run(_files: ScannedFile[], projectRoot: string): Promise<Finding[]> {
    const findings: Finding[] = [];
    const seenPaths = new Set<string>();
    const locations = agentConfigLocations(projectRoot);

    for (const loc of locations) {
      // Dedupe by absolute path — the project-local and home-global
      // MCP config for the same agent can resolve to the same file
      // (e.g. when the project root is $HOME) and we should not
      // double-report the same finding.
      if (seenPaths.has(loc.path)) continue;
      seenPaths.add(loc.path);
      if (!(await fileExists(loc.path))) continue;
      let raw: string;
      try {
        raw = await readFile(loc.path, "utf8");
      } catch {
        continue;
      }
      const servers = loc.reader(raw);
      if (!servers) continue;

      for (const [serverName, entry] of Object.entries(servers)) {
        // AGENT-001 — wildcard / missing allowedTools
        const wildcard = checkWildcardTools(serverName, entry);
        if (wildcard) {
          findings.push({
            id: randomUUID(),
            detector: "agent-surface",
            rule: "AGENT-001",
            domain: "D11",
            severity: wildcard.severity,
            title: `${loc.agent}: MCP server "${serverName}" has wildcard or missing tool allowlist`,
            description: wildcard.description,
            why: "MCP servers execute inside the coding agent with the agent's permissions. Without an allowlist, a compromised or misbehaving server can call every tool the agent supports — including filesystem writes, shell exec, and network calls.",
            file: loc.path,
            fix: `Add an allowedTools array on "${serverName}" in ${loc.path} that names only the tools the agent actually uses from that server.`,
            confidence: "certain",
            category: "Agent Surface",
          });
        }

        // AGENT-002 — plaintext credentials in env
        for (const hit of checkPlaintextCreds(serverName, entry)) {
          findings.push({
            id: randomUUID(),
            detector: "agent-surface",
            rule: "AGENT-002",
            domain: "D11",
            severity: "critical",
            title: `${loc.agent}: MCP server "${serverName}" env contains a plaintext ${hit.label} credential (${hit.envName})`,
            description: `The env field ${hit.envName} on "${serverName}" is set to a real credential value rather than a shell reference like $${hit.envName}.`,
            why: "MCP config files are checked into dotfiles, backed up, and shared across machines. A committed API key in an MCP env block leaks the same way a committed .env does — and the value keeps working until it is rotated.",
            file: loc.path,
            fix: `Replace the value of "${hit.envName}" with a shell reference (e.g. \${${hit.envName}}) and export the credential from your shell environment or a secrets manager.`,
            confidence: "high",
            category: "Agent Surface",
          });
        }

        // AGENT-003 — unpinned npx MCP server
        if (checkUnpinnedNpx(entry)) {
          findings.push({
            id: randomUUID(),
            detector: "agent-surface",
            rule: "AGENT-003",
            domain: "D11",
            severity: "medium",
            title: `${loc.agent}: MCP server "${serverName}" runs an unpinned npx package`,
            description: `"${serverName}" launches via npx without a @version suffix, so every session pulls whatever is latest on npm.`,
            why: "An unpinned npx MCP means the agent silently upgrades to whatever the maintainer publishes next — an ideal supply-chain attack vector. A single malicious version reaches every Cursor session on your machine.",
            file: loc.path,
            fix: `Pin the package version, e.g. \`npx -y @vendor/pkg@1.2.3\`, and bump it deliberately.`,
            confidence: "high",
            category: "Agent Surface",
          });
        }

        // AGENT-004 — filesystem MCP over-scoped
        if (checkOverscopedFilesystem(entry)) {
          findings.push({
            id: randomUUID(),
            detector: "agent-surface",
            rule: "AGENT-004",
            domain: "D11",
            severity: "high",
            title: `${loc.agent}: MCP server "${serverName}" grants the filesystem server root or $HOME access`,
            description: `The @modelcontextprotocol/server-filesystem server on "${serverName}" is rooted at "/" or "$HOME".`,
            why: "The filesystem MCP lets the coding agent read and write anywhere under the root you give it. Rooting it at $HOME gives the agent access to every credential file, browser profile, and shell history on the machine.",
            file: loc.path,
            fix: `Scope the filesystem MCP to a specific project or workspace directory, e.g. "${projectRoot}".`,
            confidence: "certain",
            category: "Agent Surface",
          });
        }

        // AGENT-005 — HTTP MCP URL
        if (checkPlaintextHttpUrl(entry)) {
          findings.push({
            id: randomUUID(),
            detector: "agent-surface",
            rule: "AGENT-005",
            domain: "D11",
            severity: "high",
            title: `${loc.agent}: MCP server "${serverName}" uses a plaintext HTTP URL`,
            description: `The URL for "${serverName}" is ${entry.url} — plaintext HTTP.`,
            why: "The coding agent sends prompts, tool calls, and often authentication headers to the MCP server. Over plaintext HTTP, any network attacker between the machine and the server can read every request and inject tampered responses.",
            file: loc.path,
            fix: `Use https:// for the "${serverName}" URL, or run the server on localhost.`,
            confidence: "certain",
            category: "Agent Surface",
          });
        }
      }
    }

    return findings;
  },
};
