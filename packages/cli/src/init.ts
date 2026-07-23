import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { access, writeFile } from "node:fs/promises";
import { join } from "node:path";
import chalk from "chalk";
import { installPreCommitHook } from "./config.js";

/**
 * Interactive `verglos init` wizard.
 *
 * Two concerns, both explicit — no silent side effects (design §1:
 * "Free tier requires no account and no key" + "Never a hard-lock").
 *
 *   1. Write `verglos.config.js` at the project root (asks before
 *      overwriting an existing config).
 *   2. Ask whether to install the pre-commit hook. Never installs
 *      without a confirmed y.
 */

const CONFIG_FILENAME = "verglos.config.js";

const CONFIG_TEMPLATE = `/**
 * Verglos scanner configuration.
 * @see https://verglos.com/docs/config
 * @type {import('@verglos/shared').VerglosConfig}
 */
module.exports = {
  // "free" | "pro" | "studio" | "compliance"
  plan: "free",

  // Exit CI when a critical is found.
  failOnCritical: true,

  // Score threshold for \`verglos scan --ci\`. Fail below this.
  failThreshold: 60,

  // Glob patterns to skip. Node_modules, dist, build outputs, and
  // agent-config folders are already ignored by default.
  ignorePaths: [
    "**/node_modules/**",
    "**/dist/**",
    "**/.next/**",
    "**/build/**",
    "**/coverage/**",
  ],

  // How far back to walk git history for secret leaks. 0 disables.
  secretScanDepth: 100,

  // "html" | "json" | "both"
  reportFormat: "both",

  // If true, \`verglos init\` will offer to install a pre-commit hook.
  preCommitHook: true,
};
`;

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function confirm(
  question: string,
  defaultYes: boolean,
): Promise<boolean> {
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    const suffix = defaultYes ? "[Y/n]" : "[y/N]";
    const answer = (await rl.question(`${question} ${suffix} `))
      .trim()
      .toLowerCase();
    if (answer === "") return defaultYes;
    return answer === "y" || answer === "yes";
  } finally {
    rl.close();
  }
}

export interface InitOptions {
  cwd?: string;
  yes?: boolean; // non-interactive: accept defaults, still no hook install
}

export async function executeInit(options: InitOptions = {}): Promise<number> {
  const projectRoot = options.cwd ?? process.cwd();
  const configPath = join(projectRoot, CONFIG_FILENAME);

  console.log(
    chalk.bold("verglos init") +
      chalk.gray(` · project: ${projectRoot}`),
  );
  console.log("");

  const configExists = await fileExists(configPath);

  let writeConfig = true;
  if (configExists) {
    if (options.yes) {
      writeConfig = false;
      console.log(
        chalk.gray(`  ${CONFIG_FILENAME} already exists — leaving untouched.`),
      );
    } else {
      writeConfig = await confirm(
        `${CONFIG_FILENAME} already exists. Overwrite with a fresh default?`,
        false,
      );
    }
  }

  if (writeConfig) {
    await writeFile(configPath, CONFIG_TEMPLATE, "utf8");
    console.log(
      chalk.green(`  ✓ Wrote ${CONFIG_FILENAME}`),
    );
  }

  const gitHooksExists = await fileExists(join(projectRoot, ".git", "hooks"));
  if (!gitHooksExists) {
    console.log(
      chalk.gray(
        "  Skipping pre-commit hook — no .git/hooks directory (not a git repo?).",
      ),
    );
  } else {
    const installHook = options.yes
      ? false // never install silently, even under --yes
      : await confirm(
          "Install pre-commit hook to block secrets + criticals before commit?",
          true,
        );

    if (installHook) {
      await installPreCommitHook(projectRoot);
      console.log(chalk.green("  ✓ Installed .git/hooks/pre-commit"));
      console.log(
        chalk.gray(
          "    Bypass with `git commit --no-verify` (fighting the user loses).",
        ),
      );
    } else if (!options.yes) {
      console.log(
        chalk.gray(
          "  Skipped pre-commit hook. Run `verglos hook` later if you change your mind.",
        ),
      );
    }
  }

  console.log("");
  console.log(chalk.bold("Next:"));
  console.log(chalk.gray("  $ ") + "verglos scan");
  console.log(
    chalk.gray("  $ ") + "verglos scan --no-provenance   " + chalk.gray("# skip AI-authorship inference"),
  );
  console.log("");
  return 0;
}
