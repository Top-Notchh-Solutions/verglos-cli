import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const MAX_GIT_OUTPUT_BYTES = 64 * 1024 * 1024;
const forbidden = [
  /^docs\/shipping(?:\/|$)/,
  /^docs\/VERGLOS_(?:COMPANY_USAGE_AND_FEATURE_MAP|FINAL_DATA_FLOW_MAP|FINAL_VISUAL_SYSTEM|PRODUCT_ARCHITECTURE_BLUEPRINT)\.(?:md|html|pdf)$/,
  /^docs\/verglos-(?:hero-explainer|scan-loop)\.gif$/,
];

export function auditPublicBoundary({ trackedOutput, historyOutput }) {
  const tracked = trackedOutput.split("\0").filter(Boolean);
  const historical = historyOutput.split("\n").filter(Boolean).map((entry) => entry.slice(entry.indexOf(" ") + 1));
  return [...new Set([...tracked, ...historical])].filter((path) => forbidden.some((pattern) => pattern.test(path)));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [{ stdout: trackedOutput }, { stdout: historyOutput }] = await Promise.all([
    run("git", ["ls-files", "-z"], { maxBuffer: MAX_GIT_OUTPUT_BYTES }),
    run("git", ["rev-list", "--objects", "HEAD"], { maxBuffer: MAX_GIT_OUTPUT_BYTES }),
  ]);
  const violations = auditPublicBoundary({ trackedOutput, historyOutput });
  if (violations.length) {
    for (const path of violations) console.error(`::error::private/internal path is tracked: ${path}`);
    process.exit(1);
  }
  console.log("Public boundary audit passed: no internal shipping documents or founder assets are tracked.");
}
