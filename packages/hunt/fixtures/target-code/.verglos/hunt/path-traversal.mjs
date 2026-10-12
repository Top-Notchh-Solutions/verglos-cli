// Public deterministic reference fixture. It inspects a path-building string
// only; it does not access the filesystem or traverse a real path.
const vulnerableFixture = "readFile(join(\"/srv/data\", userPath));";
const reproduced = /readFile\s*\(\s*join\s*\(\s*["']\/srv\/data["']\s*,\s*userPath\s*\)/u.test(vulnerableFixture);
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict: reproduced ? "confirmed" : "not-reproduced", summary: "deterministic path-traversal fixture" })}\n`);
