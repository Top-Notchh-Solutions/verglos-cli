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
 *   1. Write versioned `.verglos.config.json` at the project root
 *      (asks before overwriting an existing config). A legacy JS file
 *      is preserved and never evaluated by the migration inspector.
 *   2. Ask whether to install the pre-commit hook. Never installs
 *      without a confirmed y.
 */

const CONFIG_FILENAME = ".verglos.config.json";
const LEGACY_CONFIG_FILENAME = ".verglos.config.js";

const CONFIG_TEMPLATE = `${JSON.stringify({
  schemaVersion: "1.0.0",
  failOnCritical: true,
  failThreshold: 60,
  ignorePaths: ["**/node_modules/**", "**/dist/**", "**/.next/**", "**/build/**", "**/coverage/**"],
  secretScanDepth: 100,
  reportFormat: "both",
  preCommitHook: true,
}, null, 2)}\n`;

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
  json?: boolean;
  quiet?: boolean;
}

export async function executeInit(options: InitOptions = {}): Promise<number> {
  const projectRoot = options.cwd ?? process.cwd();
  const configPath = join(projectRoot, CONFIG_FILENAME);

  // Quiet mode must be deterministic and must never open an interactive prompt.
  if (options.quiet && !options.yes) return 2;

  // Machine output must never be interleaved with an interactive prompt.
  // Require --yes so JSON mode is deterministic and never installs a hook.
  if (options.json) {
    if (!options.yes) {
      console.log(JSON.stringify({ status: "error", code: "INIT_REQUIRES_YES", message: "init --json requires --yes to avoid interactive prompts" }));
      return 2;
    }
    try {
      const configExists = await fileExists(configPath);
      const legacyConfigExists = await fileExists(join(projectRoot, LEGACY_CONFIG_FILENAME));
      if (legacyConfigExists) {
        console.log(JSON.stringify({ status: "legacy-config-preserved", configPath, legacyConfigPath: join(projectRoot, LEGACY_CONFIG_FILENAME), configWritten: false, hookInstalled: false, next: "run verglos config inspect with the legacy file; migrate settings to schemaVersion 1.0.0 JSON, then remove the legacy file" }));
        return 0;
      }
      if (!configExists) await writeFile(configPath, CONFIG_TEMPLATE, "utf8");
      console.log(JSON.stringify({ status: "ok", configPath, configWritten: !configExists, hookInstalled: false }));
      return 0;
    } catch (error) {
      console.log(JSON.stringify({ status: "error", message: "init failed" }));
      return 1;
    }
  }
  if (!options.quiet) {
    console.log(
      chalk.bold("verglos init") +
        chalk.gray(` · project: ${projectRoot}`),
    );
    console.log("");
  }

  const configExists = await fileExists(configPath);
  const legacyConfigExists = await fileExists(join(projectRoot, LEGACY_CONFIG_FILENAME));

  let writeConfig = true;
  if (legacyConfigExists) {
    writeConfig = false;
    if (!options.quiet) console.log(chalk.yellow(`  Preserved legacy ${LEGACY_CONFIG_FILENAME}; review it with 'verglos config inspect', migrate to schemaVersion 1.0.0 JSON, then remove the old file.`));
  } else if (configExists) {
    if (options.yes) {
      writeConfig = false;
      if (!options.quiet) console.log(
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
    if (!options.quiet) console.log(
        chalk.green(`  ✓ Wrote ${CONFIG_FILENAME}`),
      );
  }

  const gitHooksExists = await fileExists(join(projectRoot, ".git", "hooks"));
  if (!gitHooksExists) {
    if (!options.quiet) console.log(
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
      if (!options.quiet) {
        console.log(chalk.green("  ✓ Installed .git/hooks/pre-commit"));
        console.log(
          chalk.gray(
            "    Bypass with `git commit --no-verify` (fighting the user loses).",
          ),
        );
      }
    } else if (!options.yes && !options.quiet) {
      console.log(
        chalk.gray(
          "  Skipped pre-commit hook. Run `verglos hook` later if you change your mind.",
        ),
      );
    }
  }

  if (!options.quiet) {
    console.log("");
    console.log(chalk.bold("Next:"));
    console.log(chalk.gray("  $ ") + "verglos scan");
    console.log(
      chalk.gray("  $ ") + "verglos scan --no-provenance   " + chalk.gray("# skip AI-authorship inference"),
    );
    console.log("");
  }
  return 0;
}
