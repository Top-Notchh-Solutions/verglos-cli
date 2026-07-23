import { resolve } from "node:path";
import chalk from "chalk";
import { runScan } from "@verglos/scanner";
import type { ConfidenceLevel, Finding } from "@verglos/shared";

/**
 * Fast pre-commit path: secrets + high-confidence AI-* rules only.
 * Keep this fast enough to run in pre-commit.
 *
 * The full scan (deps CVE, code-shape provenance, etc.) is far too
 * slow to run on every commit — a pre-commit hook that takes 15s
 * gets bypassed with `--no-verify` on day two, and then it's dead.
 * This path skips everything network-bound and everything that
 * depends on git-log walks.
 */

const CRITICAL_CONFIDENCE: readonly ConfidenceLevel[] = ["certain", "high"];

export interface PrecommitOptions {
  cwd?: string;
  timeoutMs?: number;
}

function shouldBlock(f: Finding): boolean {
  if (f.context === "placeholder" || f.context === "enum") return false;
  if (f.context === "test") return false;
  if (f.severity !== "critical" && f.severity !== "high") return false;
  const level: ConfidenceLevel =
    typeof f.confidence === "string"
      ? f.confidence
      : f.confidence >= 0.9
        ? "certain"
        : f.confidence >= 0.7
          ? "high"
          : f.confidence >= 0.5
            ? "medium"
            : "low";
  return CRITICAL_CONFIDENCE.includes(level);
}

export async function executePrecommit(
  options: PrecommitOptions = {},
): Promise<number> {
  const projectRoot = resolve(options.cwd ?? process.cwd());
  const timeoutMs = options.timeoutMs ?? 2000;
  const start = Date.now();

  const scanPromise = runScan({
    projectRoot,
    // Fast subset: no OSV network calls, no git-history sweep, no
    // provenance engine. Secret patterns + AI-* rules + high-conf
    // injection patterns cover the "committing a leaked key / OTP
    // hack / spread mass-assign" cases the hook needs to catch.
    detectors: ["secrets", "injection", "ai-patterns"],
    unlocked: true,
    includeGitHistory: false,
    noProvenance: true,
  });

  const timeoutPromise = new Promise<{ timedOut: true }>((resolveTimeout) => {
    setTimeout(() => resolveTimeout({ timedOut: true }), timeoutMs);
  });

  const raced = await Promise.race([
    scanPromise.then((r) => ({ timedOut: false as const, result: r })),
    timeoutPromise,
  ]);

  if (raced.timedOut) {
    console.error(
      chalk.yellow(
        `verglos: pre-commit budget of ${timeoutMs}ms exceeded — skipping check.`,
      ),
    );
    console.error(
      chalk.gray("  Run `verglos scan` manually before pushing."),
    );
    return 0; // don't block on slow scans — the full scan runs in CI
  }

  const blocking = raced.result.findings.filter(shouldBlock);
  const elapsed = Date.now() - start;

  if (blocking.length === 0) {
    console.log(
      chalk.green(`verglos: pre-commit passed`) +
        chalk.gray(` · ${elapsed}ms`),
    );
    return 0;
  }

  console.error("");
  console.error(
    chalk.red.bold(
      `verglos: commit blocked — ${blocking.length} critical / high finding${blocking.length === 1 ? "" : "s"}`,
    ),
  );
  console.error(chalk.gray(`  Scanned in ${elapsed}ms.`));
  console.error("");

  for (const f of blocking.slice(0, 10)) {
    const sev =
      f.severity === "critical" ? chalk.red("CRITICAL") : chalk.yellow("HIGH");
    const rule = f.rule ? chalk.gray(`[${f.rule}]`) : "";
    const loc = f.file
      ? chalk.gray(`${f.file}${f.line ? `:${f.line}` : ""}`)
      : "";
    console.error(`  ${sev}  ${f.title}  ${rule}`);
    if (loc) console.error(`         ${loc}`);
  }
  if (blocking.length > 10) {
    console.error(
      chalk.gray(`  … and ${blocking.length - 10} more. Run \`verglos scan\`.`),
    );
  }

  console.error("");
  console.error(
    chalk.gray("  Bypass with ") +
      chalk.bold("git commit --no-verify") +
      chalk.gray(" (fighting the user loses)."),
  );
  console.error("");
  return 1;
}
