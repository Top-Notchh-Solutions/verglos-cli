import { mkdir, writeFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const outputDirectory = process.argv[2] ?? ".artifacts/hunt-adversarial";

function countTap(output, label) {
  const matches = [...output.matchAll(new RegExp(`(?:#|ℹ) ${label} (\\d+)`, "gu"))];
  return matches.reduce((total, match) => total + Number(match[1]), 0);
}

async function command(file, args, options = {}) {
  return execFileAsync(file, args, { encoding: "utf8", maxBuffer: 16 * 1024 * 1024, ...options });
}

const env = {
  ...process.env,
  VERGLOS_HUNT_DOCKER_INTEGRATION: "1",
};
const image = env.VERGLOS_HUNT_TEST_IMAGE;
const imageDigest = env.VERGLOS_HUNT_TEST_DIGEST;
if (!image || !imageDigest || !/^sha256:[0-9a-f]{64}$/u.test(imageDigest)) {
  throw new Error("Hunt evidence requires VERGLOS_HUNT_TEST_IMAGE and a pinned sha256 VERGLOS_HUNT_TEST_DIGEST");
}

const startedAt = new Date().toISOString();
let run;
try {
  run = await command("pnpm", ["--filter", "@verglos/hunt", "test"], { env });
} catch (error) {
  run = error;
}
const stdout = run.stdout ?? "";
const stderr = run.stderr ?? "";
const tap = `${stdout}\n${stderr}`;
const report = {
  schema: "urn:verglos:evidence:hunt-adversarial:v1",
  startedAt,
  completedAt: new Date().toISOString(),
  sourceCommit: (await command("git", ["rev-parse", "HEAD"])).stdout.trim(),
  command: "pnpm --filter @verglos/hunt test",
  platform: process.platform,
  arch: process.arch,
  node: process.version,
  image,
  imageDigest,
  pass: countTap(tap, "pass"),
  skipped: countTap(tap, "skipped"),
  failed: countTap(tap, "fail"),
  exitCode: typeof run.code === "number" ? run.code : 0,
  limitations: [
    "This report proves the pinned local/CI adversarial suite only; it is not an independent security review.",
    "Namespace assertions require a Linux host; macOS and Windows runs may report an explicit skip.",
    "The pinned test image is a harness fixture, not a customer repository or production workload.",
  ],
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(`${outputDirectory}/report.json`, `${JSON.stringify(report, null, 2)}\n`, "utf8");
await writeFile(`${outputDirectory}/run.log`, tap, "utf8");
if (report.exitCode !== 0 || report.failed > 0) {
  process.stderr.write(`Hunt adversarial suite failed; see ${outputDirectory}/run.log\n`);
  process.exit(report.exitCode || 1);
}
process.stdout.write(`${JSON.stringify(report)}\n`);
