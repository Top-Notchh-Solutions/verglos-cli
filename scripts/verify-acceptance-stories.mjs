#!/usr/bin/env node

/**
 * Private ACCEPT-002/003 harness.
 *
 * Runs only repository-owned test commands against the explicitly selected
 * current source trees, captures stdout/stderr privately, and emits a small
 * machine-readable result. It deliberately does not create hosted sessions,
 * call payment providers, mutate databases, or claim customer acceptance.
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildAcceptanceStoryCoverage } from "./acceptance-story-plan.mjs";

const privateRoot = resolve(import.meta.dirname, "..");
const workspaceRoot = process.env.VERGLOS_WORKSPACE_ROOT ?? resolve(privateRoot, "..");
// Prefer an explicit source tree, then the shared workspace checkout. The
// temporary worktree used for earlier runs is only a last-resort fallback;
// otherwise a deleted /tmp path makes this evidence harness appear broken.
const workspaceCliRoot = join(workspaceRoot, "verglos-cli");
const pinnedCliRoot = join(workspaceRoot, ".local", "verglos-cli-current");
const cliRoot = process.env.VERGLOS_CLI_ROOT
  ?? (existsSync(pinnedCliRoot) ? pinnedCliRoot : existsSync(workspaceCliRoot) ? workspaceCliRoot : "/tmp/verglos-cli-current.MphZDs");
const webRoot = process.env.VERGLOS_WEB_ROOT ?? join(workspaceRoot, "verglos-web");
const outputPath = process.env.VERGLOS_ACCEPTANCE_STORIES_OUTPUT
  ?? join(privateRoot, "docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json");
const storyMapPath = join(privateRoot, "docs/shipping/evidence/acceptance-story-map-2026-10-03.json");
const storyMap = JSON.parse(readFileSync(storyMapPath, "utf8"));
if (storyMap.schema !== "verglos.private.acceptance-story-map.v1" || !Array.isArray(storyMap.stories) || storyMap.stories.length !== 12) {
  throw new Error("acceptance story map must contain the twelve frozen V1 story surfaces");
}
const storyIds = new Set(storyMap.stories.map((story) => story.id));
if (storyIds.size !== storyMap.stories.length || storyMap.stories.some((story) => typeof story.status !== "string" || !Array.isArray(story.evidence))) {
  throw new Error("acceptance story map contains duplicate or malformed story entries");
}

function run(label, cwd, args) {
  const startedAt = new Date().toISOString();
  let stdout = "";
  let stderr = "";
  let exitCode = 0;
  try {
    stdout = execFileSync("pnpm", args, { cwd, encoding: "utf8", env: { ...process.env, VERGLOS_TELEMETRY: "0" }, maxBuffer: 64 * 1024 * 1024 });
  } catch (error) {
    exitCode = typeof error?.status === "number" ? error.status : 1;
    stdout = typeof error?.stdout === "string" ? error.stdout : "";
    stderr = typeof error?.stderr === "string" ? error.stderr : String(error);
  }
  const text = `${stdout}${stderr}`;
  const numbers = [...text.matchAll(/(?:^|\n)ℹ tests (\d+)\s*\nℹ suites (\d+)\s*\nℹ pass (\d+)\s*\nℹ fail (\d+)\s*\nℹ cancelled (\d+)\s*\nℹ skipped (\d+)/g)];
  const totals = numbers.reduce((sum, match) => ({
    tests: sum.tests + Number(match[1]),
    pass: sum.pass + Number(match[3]),
    fail: sum.fail + Number(match[4]),
    cancelled: sum.cancelled + Number(match[5]),
    skipped: sum.skipped + Number(match[6]),
  }), { tests: 0, pass: 0, fail: 0, cancelled: 0, skipped: 0 });
  return { label, cwd, args, startedAt, finishedAt: new Date().toISOString(), exitCode, summary: totals, outputSha256: createHash("sha256").update(text).digest("hex") };
}

function sourceStatus(root, label) {
  if (!existsSync(root)) throw new Error(`${label} source root does not exist: ${root}`);
  const commit = execFileSync("git", ["-C", root, "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
  const status = execFileSync("git", ["-C", root, "status", "--porcelain=v1"], { encoding: "utf8" });
  if (status.trim() !== "") throw new Error(`${label} source root must be clean; set an explicit clean ${label} worktree`);
  return { commit, status: "clean" };
}

const cliSource = sourceStatus(cliRoot, "CLI");
const webSource = sourceStatus(webRoot, "Web");

const results = [
  run("cli-package-suite", cliRoot, ["--filter", "verglos", "test"]),
  run("web-full-suite", webRoot, ["test"]),
  run("web-composed-acceptance-substrates", webRoot, ["exec", "node", "--import", "tsx", "--test", "--test-concurrency=1", "src/lib/organizations/studio-e2e.test.ts", "src/lib/organizations/enterprise-e2e.test.ts", "src/lib/organizations/team-e2e.test.ts", "src/lib/qual/qual-web-suites.test.ts"]),
];

const storyCoverage = buildAcceptanceStoryCoverage(
  storyMap.stories,
  new Set(results.map((entry) => entry.label)),
);

const result = {
  schema: "verglos.private.acceptance-stories-verification.v1",
  verifiedAt: new Date().toISOString(),
  cliRoot,
  webRoot,
  cliCommit: cliSource.commit,
  webCommit: webSource.commit,
  sourceStatus: { cli: cliSource.status, web: webSource.status },
  stories: storyMap.stories,
  storyCoverage,
  results,
  storyCoverageComplete: storyCoverage.length === storyMap.stories.length,
  allCommandsPassed: results.every((entry) => entry.exitCode === 0),
  note: "Substrate/regression evidence only. No hosted HTTP, provider, customer, reviewer, browser-human, field-CWV, migration, or production acceptance is claimed.",
};

mkdirSync(resolve(outputPath, ".."), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
process.stdout.write(`${JSON.stringify(result)}\n`);
if (!result.allCommandsPassed) process.exitCode = 1;
