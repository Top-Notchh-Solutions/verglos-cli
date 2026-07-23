import chalk from "chalk";
import { EXPLAIN_BANK, listRules, lookupRule } from "@verglos/shared";

/**
 * `verglos explain <rule>` — print the full explain-bank entry for a
 * rule id. Consumes the same static bank the MCP `explain_finding`
 * tool reads (follow-up).
 */

const SEVERITY_COLOR = {
  critical: chalk.red.bold,
  high: chalk.yellow.bold,
  medium: chalk.blue.bold,
  low: chalk.gray.bold,
  info: chalk.gray,
} as const;

function printEntry(rule: string): number {
  const entry = lookupRule(rule);
  if (!entry) {
    console.error(chalk.red(`Unknown rule: ${rule}`));
    console.error(
      chalk.gray(
        `Run \`verglos explain --list\` to see every rule Verglos knows about.`,
      ),
    );
    return 1;
  }

  const sevColor =
    SEVERITY_COLOR[entry.severity as keyof typeof SEVERITY_COLOR] ??
    chalk.white;

  console.log("");
  console.log(chalk.bold(entry.rule) + chalk.gray("  ·  ") + entry.title);
  console.log(
    chalk.gray(`domain ${entry.domain}  ·  `) +
      sevColor(entry.severity) +
      chalk.gray(`  ·  confidence ${entry.confidence}`),
  );
  console.log("");
  console.log(chalk.bold("Why it matters"));
  console.log("  " + entry.why);
  console.log("");
  console.log(chalk.bold("How to fix"));
  console.log("  " + entry.fix);

  if (entry.example) {
    console.log("");
    console.log(chalk.bold("Example"));
    console.log(chalk.red("  ✗ ") + entry.example.bad);
    console.log(chalk.green("  ✓ ") + entry.example.good);
  }

  if (entry.refs.length > 0) {
    console.log("");
    console.log(chalk.bold("References"));
    for (const ref of entry.refs) console.log("  " + chalk.gray(ref));
  }
  console.log("");
  return 0;
}

function printList(): number {
  const rules = listRules();
  console.log("");
  console.log(chalk.bold(`${rules.length} rules`));
  console.log("");
  for (const id of rules) {
    const entry = EXPLAIN_BANK[id]!;
    const sevColor =
      SEVERITY_COLOR[entry.severity as keyof typeof SEVERITY_COLOR] ??
      chalk.white;
    console.log(
      "  " +
        chalk.bold(id.padEnd(9)) +
        chalk.gray(entry.domain.padEnd(4)) +
        sevColor(entry.severity.padEnd(9)) +
        entry.title,
    );
  }
  console.log("");
  console.log(chalk.gray("Run `verglos explain <rule>` for details."));
  console.log("");
  return 0;
}

export interface ExplainOptions {
  rule?: string;
  list?: boolean;
}

export function executeExplain(options: ExplainOptions): number {
  if (options.list || !options.rule) return printList();
  return printEntry(options.rule);
}
