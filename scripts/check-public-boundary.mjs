import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const forbidden = [
  /^docs\/shipping(?:\/|$)/,
  /^docs\/VERGLOS_(?:COMPANY_USAGE_AND_FEATURE_MAP|FINAL_DATA_FLOW_MAP|FINAL_VISUAL_SYSTEM|PRODUCT_ARCHITECTURE_BLUEPRINT)\.(?:md|html|pdf)$/,
  /^docs\/verglos-(?:hero-explainer|scan-loop)\.gif$/,
];
const { stdout } = await run("git", ["ls-files", "-z"]);
const tracked = stdout.split("\0").filter(Boolean);
const violations = tracked.filter((path) => forbidden.some((pattern) => pattern.test(path)));
if (violations.length) {
  for (const path of violations) console.error(`::error::private/internal path is tracked: ${path}`);
  process.exit(1);
}
console.log("Public boundary audit passed: no internal shipping documents or founder assets are tracked.");
