import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import type { Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import type { Detector } from "./types.js";

const GIT_SECRET_PATTERNS = [
  { name: "AWS Access Key", pattern: /AKIA[0-9A-Z]{16}/ },
  { name: "Stripe Secret Key", pattern: /sk_(?:live|test)_[0-9a-zA-Z]{24,}/ },
  { name: "GitHub Token", pattern: /ghp_[0-9a-zA-Z]{36,}/ },
  { name: "Private Key PEM", pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/ },
];

export const gitHistoryDetector: Detector = {
  id: "git-history",
  async run(_files: ScannedFile[], projectRoot: string): Promise<Finding[]> {
    const findings: Finding[] = [];

    let diff: string;
    try {
      diff = execSync("git log -p -n 50 --no-color", {
        cwd: projectRoot,
        encoding: "utf8",
        maxBuffer: 10 * 1024 * 1024,
        stdio: ["pipe", "pipe", "ignore"],
      });
    } catch {
      return findings;
    }

    const lines = diff.split("\n");
    let currentFile = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i] ?? "";

      if (line.startsWith("+++ b/")) {
        currentFile = line.replace("+++ b/", "");
        continue;
      }

      if (!line.startsWith("+") || line.startsWith("+++")) continue;

      for (const { name, pattern } of GIT_SECRET_PATTERNS) {
        if (pattern.test(line)) {
          findings.push({
            id: randomUUID(),
            detector: "git-history",
            rule: "D8-002",
            domain: "D8",
            severity: "critical",
            title: `Secret in git history: ${name}`,
            description: `A ${name} was found in git history. Even if deleted, it remains in past commits.`,
            why: "64% of credentials confirmed leaked in 2022 were still active in 2026. Deleting a file doesn't unleak the key — it lives in every clone of the repo forever. Rotation is the only fix.",
            file: currentFile || "git-history",
            line: i + 1,
            snippet: line.slice(0, 80).replace(/[A-Za-z0-9+/=_\-]{8,}/g, "****"),
            fix: "Rotate the credential immediately. Use git filter-repo or BFG to purge from history.",
            confidence: "certain",
            category: "Cryptography",
          });
        }
      }
    }

    return findings;
  },
};
