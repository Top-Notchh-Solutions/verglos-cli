import chalk from "chalk";
import {
  riskLevelLabel,
  type Finding,
  type RepoProvenance,
  type ScanResult,
  type Severity,
} from "@verglos/shared";

function scoreColor(score: number): (text: string) => string {
  if (score < 50) return chalk.red.bold;
  if (score < 70) return chalk.yellow.bold;
  if (score < 90) return chalk.hex("#F59E0B").bold;
  return chalk.green.bold;
}

function severityColor(severity: Severity): (text: string) => string {
  switch (severity) {
    case "critical":
      return chalk.red.bold;
    case "high":
      return chalk.yellow.bold;
    case "medium":
      return chalk.blue;
    case "low":
      return chalk.gray;
    default:
      return chalk.gray;
  }
}

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
  info: 0,
};

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/** Renders the AI-provenance block. Silent when there's nothing to say. */
function printProvenance(p: RepoProvenance | undefined): void {
  if (!p) return;
  const noEvidence =
    p.confidence === "low" &&
    p.aiAuthoredPercent === 0 &&
    (p.method === "no signals fired" ||
      p.method === "no JS/TS files to analyze");
  if (noEvidence) return;

  console.log(
    "  " +
      chalk.hex("#E85D4C")("▸ ") +
      chalk.bold(`${p.aiAuthoredPercent}% of this codebase is AI-authored`),
  );
  if (p.densityRatio !== null) {
    console.log(
      "    " +
        chalk.gray(
          `AI files carry ${chalk.hex("#E85D4C").bold(`${p.densityRatio}×`)} the finding density`,
        ),
    );
  }
  if (p.criticalsTotal > 0) {
    console.log(
      "    " +
        chalk.gray(
          `${p.criticalsInAIFiles} of ${p.criticalsTotal} criticals are in AI-generated code`,
        ),
    );
  }
  console.log(
    "    " +
      chalk.gray.italic(`(${p.confidence} confidence — ${p.method})`),
  );
  console.log("");
}

/** Top 3 highest-severity findings, aligned. */
function printTop3(findings: Finding[]): void {
  const scoreable = findings.filter(
    (f) => f.context !== "test" && f.context !== "placeholder" && f.context !== "enum",
  );
  if (scoreable.length === 0) return;
  const sorted = [...scoreable].sort(
    (a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity],
  );
  const top = sorted.slice(0, 3);
  console.log("  " + chalk.hex("#E85D4C")("▸ ") + chalk.bold("Top 3"));
  top.forEach((f, i) => {
    const idx = chalk.gray(`${i + 1}`);
    const title = f.title.length > 34 ? f.title.slice(0, 33) + "…" : f.title;
    const location = f.file
      ? chalk.gray(`${f.file}${f.line ? `:${f.line}` : ""}`)
      : "";
    const sev = severityColor(f.severity)(f.severity.toUpperCase());
    console.log(`    ${idx}  ${title.padEnd(35)} ${location.padEnd(38)} ${sev}`);
  });
  console.log("");
}

export function printTerminalSummary(result: ScanResult): void {
  const { score, findings, provenance, durationMs } = result;
  const c = scoreColor(score.value);
  const duration = formatDuration(durationMs);

  console.log("");
  const header =
    chalk.bold("VERGLOS") + chalk.gray("  ·  scan complete");
  const padding = Math.max(0, 60 - header.length + duration.length);
  console.log(
    "  " + header + " ".repeat(padding) + chalk.gray(duration),
  );
  console.log("");

  console.log(
    `  Score   ${c(`${score.value} / 100`)}    ` +
      chalk.gray(riskLevelLabel(score.riskLevel)),
  );
  console.log(
    "  " + chalk.gray("─".repeat(48)),
  );

  console.log(
    `  ${chalk.red(`Critical  ${score.counts.critical}`)}    ` +
      `${chalk.yellow(`High  ${score.counts.high}`)}    ` +
      `${chalk.blue(`Medium  ${score.counts.medium}`)}    ` +
      `${chalk.gray(`Low  ${score.counts.low}`)}`,
  );
  console.log("");

  printProvenance(provenance);
  printTop3(findings);

  if (score.testFileFindings.total > 0) {
    console.log(
      chalk.gray(
        `  Test file findings (review only): ${score.testFileFindings.total} excluded from the score.`,
      ),
    );
    console.log("");
  }

  console.log(chalk.gray("  Report  → verglos-report.html"));
  if (findings.some((f) => f.fix)) {
    console.log(chalk.gray("  Fix     → verglos fix"));
  }
  console.log("");
}

export function printScoreOnly(result: ScanResult): void {
  const c = scoreColor(result.score.value);
  console.log(c(`${result.score.value}`));
}

export function printMomentum(
  previous: number | undefined,
  current: number,
  criticalsLeft: number,
): void {
  if (previous !== undefined && previous !== current) {
    const arrow = current > previous ? "↑" : "↓";
    console.log(
      chalk.gray(
        `Score ${previous} → ${current} ${arrow}. ${criticalsLeft} criticals left.`,
      ),
    );
  }
}
