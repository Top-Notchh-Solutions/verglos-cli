import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import type { Detector } from "./types.js";

interface LockPackage {
  name: string;
  version: string;
}

interface OsvVuln {
  id: string;
  summary?: string;
  severity?: { score?: string }[];
  database_specific?: { severity?: string };
}

interface OsvResponse {
  vulns?: OsvVuln[];
}

const OSV_URL = "https://api.osv.dev/v1/query";

async function queryOsv(
  name: string,
  version: string,
): Promise<OsvVuln[]> {
  try {
    const res = await fetch(OSV_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ package: { name, ecosystem: "npm" }, version }),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as OsvResponse;
    return data.vulns ?? [];
  } catch {
    return [];
  }
}

function parsePackageLock(content: string): LockPackage[] {
  const packages: LockPackage[] = [];
  try {
    const lock = JSON.parse(content) as {
      packages?: Record<string, { version?: string }>;
      dependencies?: Record<string, { version?: string }>;
    };

    if (lock.packages) {
      for (const [path, info] of Object.entries(lock.packages)) {
        if (!info.version) continue;
        const name = path.replace("node_modules/", "").split("node_modules/").pop();
        if (!name || name === "") continue;
        packages.push({ name, version: info.version });
      }
    } else if (lock.dependencies) {
      for (const [name, info] of Object.entries(lock.dependencies)) {
        if (info.version) packages.push({ name, version: info.version });
      }
    }
  } catch {
    // ignore parse errors
  }
  return packages;
}

function mapOsvSeverity(vuln: OsvVuln): Finding["severity"] {
  const score = vuln.database_specific?.severity?.toUpperCase();
  if (score === "CRITICAL") return "critical";
  if (score === "HIGH") return "high";
  if (score === "MODERATE" || score === "MEDIUM") return "medium";
  if (score === "LOW") return "low";
  return "high";
}

export const dependenciesDetector: Detector = {
  id: "dependencies",
  async run(_files: ScannedFile[], projectRoot: string): Promise<Finding[]> {
    const findings: Finding[] = [];
    const lockPath = join(projectRoot, "package-lock.json");

    let lockContent: string;
    try {
      lockContent = await readFile(lockPath, "utf8");
    } catch {
      return findings;
    }

    const packages = parsePackageLock(lockContent);
    const unique = new Map<string, LockPackage>();
    for (const pkg of packages) {
      unique.set(`${pkg.name}@${pkg.version}`, pkg);
    }

    const batch = [...unique.values()].slice(0, 50);
    const results = await Promise.all(
      batch.map(async (pkg) => {
        const vulns = await queryOsv(pkg.name, pkg.version);
        return { pkg, vulns };
      }),
    );

    for (const { pkg, vulns } of results) {
      for (const vuln of vulns) {
        findings.push({
          id: randomUUID(),
          detector: "dependencies",
          rule: "D6-001",
          domain: "D6",
          severity: mapOsvSeverity(vuln),
          title: `Vulnerable dependency: ${pkg.name}@${pkg.version}`,
          description:
            vuln.summary ??
            `Known vulnerability ${vuln.id} affects ${pkg.name}@${pkg.version}.`,
          why: "A known-vulnerable dependency is a public roadmap for an attacker — the CVE describes the payload. Upgrades usually take minutes; breaches take weeks to notice.",
          package: pkg.name,
          cve: vuln.id,
          refs: [vuln.id],
          fix: `npm install ${pkg.name}@latest`,
          confidence: "certain",
          category: "Dependency & Supply Chain",
        });
      }
    }

    return findings;
  },
};
