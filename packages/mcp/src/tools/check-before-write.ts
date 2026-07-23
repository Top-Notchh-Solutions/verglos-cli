import { basename, join } from "node:path";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import {
  aiPatternsDetector,
  injectionDetector,
  secretsDetector,
  type ScannedFile,
} from "@verglos/scanner";
import type { Finding } from "@verglos/shared";

/**
 * check_before_write — the killer MCP tool.
 *
 * Runs a narrow subset of Verglos detectors on a single piece of
 * code the agent is about to write:
 *
 *   secrets      Any pattern-matched credential in the snippet.
 *   injection    High-confidence SQL/command/XSS/NoSQL/path/SSRF.
 *   ai-patterns  AI-001..010 — the wedge. All the flagship rules.
 *
 * Skipped in this hot path:
 *   - dependencies (needs a lockfile, network to OSV)
 *   - misconfig    (needs project-wide context — .env, headers)
 *   - git-history  (needs a git repo)
 *   - slopsquat    (needs package.json + network)
 *   - provenance   (needs git log + repo scan)
 *
 * Target budget: <300ms. On a fresh temp
 * dir + one file the sync detectors run in ~15-40ms; total round-
 * trip is dominated by the mkdtemp/rm calls (~5ms each on tmpfs).
 */

export interface CheckBeforeWriteInput {
  code: string;
  targetPath: string;
  language?: string;
  context?: string;
}

export interface CheckBeforeWriteResult {
  verdict: "allow" | "warn" | "block";
  findings: Finding[];
  correctedCode?: string;
  reasoning: string;
}

/**
 * Try to auto-correct known AI-* patterns. Currently only handles
 * AI-002 (Math.random / Date.now → token/OTP). Other corrections can be added
 * over time; correctedCode is best-effort.
 */
function tryCorrectCode(
  original: string,
  findings: Finding[],
): string | undefined {
  const ai002 = findings.find((f) => f.rule === "AI-002");
  if (!ai002) return undefined;

  // Two common shapes we can rewrite deterministically:
  //   const otp = Math.floor(100000 + Math.random() * 900000);
  //   const token = Math.random().toString(36).slice(2);
  let corrected = original;

  // 6-digit OTP shape
  corrected = corrected.replace(
    /Math\.floor\s*\(\s*(\d+)\s*\+\s*Math\.random\s*\(\s*\)\s*\*\s*(\d+)\s*\)/g,
    (_, start: string, range: string) => {
      const s = Number(start);
      const r = Number(range);
      return `crypto.randomInt(${s}, ${s + r})`;
    },
  );

  // Direct token generation shape
  corrected = corrected.replace(
    /Math\.random\s*\(\s*\)\s*\.\s*toString\s*\(\s*36\s*\)\s*\.\s*(slice|substring|substr)\s*\(\s*2\s*\)/g,
    "crypto.randomBytes(32).toString('base64url')",
  );

  // Plain `Math.random()` in an obvious token/OTP context — inject a comment
  // pointing at the safer API rather than rewriting silently, since we
  // don't know the desired range.
  if (corrected === original) {
    corrected = original.replace(
      /Math\.random\s*\(\s*\)/g,
      "/* verglos AI-002: replace with crypto.randomInt / crypto.randomBytes */ Math.random()",
    );
  }

  // If the transform added a `crypto.` call and the source doesn't already
  // import node:crypto, prepend a hint import at the top.
  if (
    /\bcrypto\.(randomInt|randomBytes)\b/.test(corrected) &&
    !/import\s+\*?\s*(?:crypto|\{[^}]*crypto[^}]*\})\s*from\s*['"]node:crypto['"]/.test(
      corrected,
    ) &&
    !/require\s*\(\s*['"]node:crypto['"]\s*\)/.test(corrected)
  ) {
    corrected = `import * as crypto from "node:crypto";\n${corrected}`;
  }

  return corrected === original ? undefined : corrected;
}

function summarize(finding: Finding): string {
  const rule = finding.rule ? `[${finding.rule}] ` : "";
  return `${rule}${finding.title}`;
}

function buildReasoning(
  verdict: "allow" | "warn" | "block",
  findings: Finding[],
): string {
  if (verdict === "allow") {
    return "No fast-path detector flagged this snippet. Verglos has not run the slower full-project checks (deps, git-history, provenance) — those come from `verglos_scan`.";
  }
  const worst = findings
    .filter((f) => f.severity === "critical" || f.severity === "high")
    .slice(0, 5)
    .map((f) => `  - ${summarize(f)}`)
    .join("\n");
  const bypassHint =
    verdict === "block"
      ? "Do not write this code as-is. Suggest the corrected version if provided, or ask the human to override."
      : "This code will land but the flagged concern should be addressed before shipping.";
  return `Verdict: ${verdict.toUpperCase()}\n${bypassHint}\n\nFindings:\n${worst}`;
}

export async function checkBeforeWrite(
  input: CheckBeforeWriteInput,
): Promise<CheckBeforeWriteResult> {
  const tmpRoot = await mkdtemp(join(tmpdir(), "verglos-cbw-"));
  try {
    // Preserve extension so language-aware detectors (AI-* code-shape
    // checks, injection regex) pick the right rule set.
    const safeName = basename(input.targetPath) || "input.ts";
    const abs = join(tmpRoot, safeName);
    await writeFile(abs, input.code, "utf8");

    const scannedFile: ScannedFile = {
      path: abs,
      relativePath: safeName,
    };

    const detectorResults = await Promise.all([
      secretsDetector.run([scannedFile], tmpRoot),
      injectionDetector.run([scannedFile], tmpRoot),
      aiPatternsDetector.run([scannedFile], tmpRoot),
    ]);
    const findings = detectorResults.flat();

    // Only certain/high-confidence findings drive the verdict per
    // arch (medium/low sit in "worth a look").
    const scoreable = findings.filter((f) => {
      const conf =
        typeof f.confidence === "string"
          ? f.confidence
          : f.confidence >= 0.9
            ? "certain"
            : f.confidence >= 0.7
              ? "high"
              : "medium";
      return conf === "certain" || conf === "high";
    });

    let verdict: "allow" | "warn" | "block" = "allow";
    if (scoreable.some((f) => f.severity === "critical")) verdict = "block";
    else if (scoreable.some((f) => f.severity === "high")) verdict = "warn";

    const correctedCode = tryCorrectCode(input.code, findings);
    const reasoning = buildReasoning(verdict, findings);

    return { verdict, findings, correctedCode, reasoning };
  } finally {
    await rm(tmpRoot, { recursive: true, force: true });
  }
}
