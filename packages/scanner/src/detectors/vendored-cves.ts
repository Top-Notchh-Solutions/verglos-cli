import { randomUUID } from "node:crypto";
import type { Finding } from "@verglos/shared";
import type { ScannedFile } from "../walker.js";
import type { Detector } from "./types.js";

/**
 * Vendored-library CVE detector — the differentiator.
 *
 * Every SAST-style scanner filters files under public/libraries/,
 * vendor/, and *.min.js out of its analysis entirely. That's the
 * industry convention, and it's the wrong call: these files are
 * served to every browser that loads the app. If echarts@5.4.3.js
 * (as bundled inside public/libraries/) has CVE-2024-XXXXX, the
 * attack is live in production even though the vulnerable code was
 * never in the lockfile the dependencies detector checks.
 *
 * This detector walks vendored file paths, parses <name>@<version>
 * or <name>-<version> from the filename, and cross-references against
 * OSV. A hit becomes a critical finding with the attack narrative
 * spelled out. A miss is left alone — the context-tag pass downgrades
 * the file's other findings to `vendored-bundle` info.
 */

const OSV_URL = "https://api.osv.dev/v1/query";
const OSV_TIMEOUT_MS = 5000;
const CONCURRENCY = 6;
const MAX_QUERIES_PER_SCAN = 200;

/**
 * Vendored-library file path patterns. Kept in sync with the
 * `vendored-bundle` context tag heuristic — anything the tag
 * downgrades is fair game for this detector to check for CVEs.
 */
const VENDORED_PATH_MATCHERS: RegExp[] = [
  /(^|\/)public\/(libraries|vendor|libs|lib|js\/vendor)\//i,
  /(^|\/)vendor\//i,
  /(^|\/)third[_-]?party\//i,
];

const VERSION_RE = String.raw`\d+(?:\.\d+){1,3}(?:[-.][a-z0-9]+)*`;

// filename patterns we recognise for `name@version`:
//   echarts@5.4.3.js
//   echarts@5.4.3.min.js
//   jquery-3.6.0.min.js
//   moment.2.29.4.js
//   react-16.14.0.min.js
//   axios-0.27.2.min.js
const FILENAME_PATTERNS: RegExp[] = [
  new RegExp(String.raw`^([a-z0-9][a-z0-9._-]*)@(${VERSION_RE})(?:\.min|\.bundle)?\.js$`, "i"),
  new RegExp(String.raw`^([a-z0-9][a-z0-9._-]*)-(${VERSION_RE})(?:\.min|\.bundle)?\.js$`, "i"),
  new RegExp(String.raw`^([a-z0-9][a-z0-9._-]*)\.(${VERSION_RE})(?:\.min|\.bundle)?\.js$`, "i"),
];

export interface VendoredParse {
  name: string;
  version: string;
}

/**
 * Extract `name@version` from a vendored-file basename. Returns
 * null when the filename doesn't look versioned. Deliberately strict
 * — we'd rather miss a CVE than emit a made-up package name.
 */
export function parseVendoredFilename(basename: string): VendoredParse | null {
  const cleaned = basename.trim();
  for (const re of FILENAME_PATTERNS) {
    const m = cleaned.match(re);
    if (!m) continue;
    return { name: m[1]!.toLowerCase(), version: m[2]! };
  }
  return null;
}

/**
 * Returns true when the file lives in a vendored path bucket the
 * scanner should probe for CVEs.
 */
export function isVendoredPath(relativePath: string): boolean {
  return VENDORED_PATH_MATCHERS.some((re) => re.test(relativePath));
}

interface OsvVuln {
  id: string;
  summary?: string;
  aliases?: string[];
  database_specific?: { severity?: string };
}

interface OsvResponse {
  vulns?: OsvVuln[];
}

function mapOsvSeverity(vuln: OsvVuln): Finding["severity"] {
  const score = vuln.database_specific?.severity?.toUpperCase();
  if (score === "CRITICAL") return "critical";
  if (score === "HIGH") return "high";
  if (score === "MODERATE" || score === "MEDIUM") return "medium";
  if (score === "LOW") return "low";
  return "high";
}

async function queryOsv(name: string, version: string): Promise<OsvVuln[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OSV_TIMEOUT_MS);
  try {
    const res = await fetch(OSV_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ package: { name, ecosystem: "npm" }, version }),
      signal: controller.signal,
    });
    if (!res.ok) return [];
    const data = (await res.json()) as OsvResponse;
    return data.vulns ?? [];
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function inParallel<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (true) {
      const idx = cursor++;
      if (idx >= items.length) return;
      results[idx] = await worker(items[idx]!);
    }
  });
  await Promise.all(runners);
  return results;
}

export const vendoredCvesDetector: Detector = {
  id: "vendored-cves",
  async run(files: ScannedFile[]): Promise<Finding[]> {
    // First pass: collect vendored files with parseable filenames.
    const candidates: Array<{ file: ScannedFile; parsed: VendoredParse }> = [];
    for (const file of files) {
      if (!isVendoredPath(file.relativePath)) continue;
      const basename = file.relativePath.split("/").pop() ?? "";
      const parsed = parseVendoredFilename(basename);
      if (!parsed) continue;
      candidates.push({ file, parsed });
    }

    // De-dupe by name+version so we don't hit OSV twice for the same
    // (repo may have both echarts@5.4.3.js and echarts@5.4.3.min.js).
    const seen = new Set<string>();
    const unique: typeof candidates = [];
    for (const c of candidates) {
      const key = `${c.parsed.name}@${c.parsed.version}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(c);
    }

    const capped = unique.slice(0, MAX_QUERIES_PER_SCAN);

    const results = await inParallel(
      capped,
      async ({ file, parsed }) => {
        const vulns = await queryOsv(parsed.name, parsed.version);
        return { file, parsed, vulns };
      },
      CONCURRENCY,
    );

    const findings: Finding[] = [];
    for (const { file, parsed, vulns } of results) {
      if (vulns.length === 0) continue;
      // Emit ONE finding per (vendored-file, vuln). Deduping by CVE id
      // when multiple aliases hit is a nice-to-have follow-up.
      for (const vuln of vulns) {
        findings.push({
          id: randomUUID(),
          detector: "vendored-cves",
          rule: "D6-002",
          domain: "D6",
          severity: mapOsvSeverity(vuln),
          title: `Vendored library with known CVE: ${parsed.name}@${parsed.version}`,
          description:
            vuln.summary ??
            `${parsed.name}@${parsed.version} — vendored under ${file.relativePath} — is affected by ${vuln.id}.`,
          why:
            "This library is checked into the repo (not managed by npm), so it never appears in your lockfile and `npm audit` won't see it. But the file IS served to every browser that loads your app. If the CVE is exploitable, every visitor is exposed. Rotate to a patched version or remove.",
          file: file.relativePath,
          package: parsed.name,
          cve: vuln.id,
          refs: [vuln.id, ...(vuln.aliases ?? [])],
          fix: `Update the vendored copy of \`${parsed.name}\` to the patched version, or delete the file and install via npm so \`npm audit\` catches future issues.`,
          confidence: "certain",
          category: "Dependency & Supply Chain",
          context: "production",
        });
      }
    }
    return findings;
  },
};
