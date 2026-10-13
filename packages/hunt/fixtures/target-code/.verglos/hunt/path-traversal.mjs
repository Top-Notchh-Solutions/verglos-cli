// Public deterministic reference fixture. It inspects a path-building string
// only; it does not access the filesystem or traverse a real path.
const fixtureCase = process.argv[2] ?? "positive";
const fixture = fixtureCase === "negative" ? "readFile(join(\"/srv/data\", normalizeSafePath(userPath)));" : "readFile(join(\"/srv/data\", userPath));";
const reproduced = /readFile\s*\(\s*join\s*\(\s*["']\/srv\/data["']\s*,\s*userPath\s*\)/u.test(fixture);
const verdict = fixtureCase === "unsupported" ? "unsupported" : reproduced ? "confirmed" : "not-reproduced";
process.stdout.write(`${JSON.stringify({ verglos: "hunt-result", verdict, summary: "deterministic path-traversal fixture" })}\n`);
