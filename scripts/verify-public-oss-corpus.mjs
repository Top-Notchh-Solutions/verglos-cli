#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const workspace = resolve(process.env.TOP_NOTCHH_WORKSPACE ?? "/Users/anuragyadav/Developer/TopNotchh-Workspace");
const fixtureRoot = resolve(process.env.VERGLOS_PUBLIC_OSS_FIXTURE_ROOT ?? join(workspace, "acceptance-fixtures"));
const evidenceRoot = resolve(process.env.VERGLOS_PUBLIC_OSS_EVIDENCE_ROOT ?? join(workspace, ".local-evidence", "public-oss-corpus-2026-10-23"));
const cliRoot = resolve(process.env.VERGLOS_PUBLIC_OSS_CLI_ROOT ?? join(workspace, "verglos-cli-shipping-worktree"));

const fixtures = [
  { name: "buggy-node", upstream: "https://github.com/UtkarshGupta-CS/buggy-node", commit: "b1b9cbc8b86f81a1ecb0b142190d4fa4698518da", license: "ISC", architectureShapes: ["small"], architectureEvidence: ["README.md"] },
  { name: "juice-shop", upstream: "https://github.com/juice-shop/juice-shop", commit: "1618a611b173b4bf114028e6e02549950606e29d", license: "MIT", architectureShapes: ["multi-user"], architectureEvidence: ["README.md"] },
  { name: "nodegoat", upstream: "https://github.com/OWASP/NodeGoat", commit: "c5cb68a7084e4ae7dcc60e6a98768720a81841e8", license: "Apache-2.0", architectureShapes: ["multi-user"], architectureEvidence: ["README.md"] },
  { name: "dvna", upstream: "https://github.com/appsecco/dvna", commit: "9ba473add536f66ac9007966acb2a775dd31277a", license: "MIT", architectureShapes: ["small"], architectureEvidence: ["README.md"] },
  { name: "nodejs-goof", upstream: "https://github.com/snyk-labs/nodejs-goof", commit: "add14ba59e98240d9e00a235dd7d42cd61ae9912", license: "Apache-2.0", architectureShapes: ["multi-user"], architectureEvidence: ["README.md"] },
  { name: "damm-vulnerable-node", upstream: "https://github.com/rdurlo/Damm-Vulnerable-Node-Application", commit: "1946570b36bf8e6dcac48142f072f40ee9cee160", license: "MIT", architectureShapes: ["small"], architectureEvidence: ["README.md"] },
  { name: "payload", upstream: "https://github.com/payloadcms/payload", commit: "57f39097aa17d0ee4db728e393a47409ee24e586", license: "MIT", architectureShapes: ["multi-tenant-team"], architectureEvidence: ["README.md", "docs/plugins/multi-tenant.mdx"], evidenceDir: "payload-corrected" },
  { name: "vendure", upstream: "https://github.com/vendure-ecommerce/vendure", commit: "b6653518cd342f803469a394eff6beb0f7a13a12", license: "GPL-3.0-only", architectureShapes: ["multi-tenant-team", "enterprise-like"], architectureEvidence: ["README.md", "docs/docs/guides/core-concepts/channels/index.mdx"], evidenceDir: "vendure-corrected" },
];

const requiredArchitectureShapes = ["small", "multi-user", "multi-tenant-team", "enterprise-like"];

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function git(root, args) {
  return execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
}

function regularFile(path, label) {
  if (!existsSync(path) || !lstatSync(path).isFile()) throw new Error(`${label} must be a regular file`);
}

function verifyFixture(fixture) {
  const root = join(fixtureRoot, fixture.name);
  const reportRoot = join(evidenceRoot, fixture.evidenceDir ?? fixture.name);
  if (!existsSync(join(root, ".git"))) throw new Error(`${fixture.name}: missing full-clone git metadata`);
  if (git(root, ["rev-parse", "--is-shallow-repository"]) !== "false") throw new Error(`${fixture.name}: shallow clone`);
  if (git(root, ["rev-parse", "HEAD"]) !== fixture.commit) throw new Error(`${fixture.name}: exact commit mismatch`);

  const authorizationPath = join(root, "AUTHORIZATION.md");
  regularFile(authorizationPath, `${fixture.name} authorization`);
  const authorization = readFileSync(authorizationPath, "utf8");
  for (const required of [/public technical fixture/i, /not an authorized customer/i, /permitted (test )?scope/i, /findings may be stored/i, /expiry/i]) {
    if (!required.test(authorization)) throw new Error(`${fixture.name}: authorization notice is incomplete`);
  }
  for (const evidencePath of fixture.architectureEvidence) regularFile(join(root, evidencePath), `${fixture.name} architecture evidence`);

  const reportJsonPath = join(reportRoot, "verglos-report.json");
  const reportHtmlPath = join(reportRoot, "verglos-report.html");
  regularFile(reportJsonPath, `${fixture.name} JSON report`);
  regularFile(reportHtmlPath, `${fixture.name} HTML report`);
  const report = JSON.parse(readFileSync(reportJsonPath, "utf8"));
  if (report.coverage?.status !== "complete") throw new Error(`${fixture.name}: coverage is not complete`);
  if (!Array.isArray(report.coverage?.limitations) || report.coverage.limitations.length !== 0) throw new Error(`${fixture.name}: report has coverage limitations`);
  if (!Number.isInteger(report.coverage?.filesWalked) || report.coverage.filesWalked <= 0) throw new Error(`${fixture.name}: invalid filesWalked`);
  if (!Array.isArray(report.findings) || typeof report.score?.value !== "number") throw new Error(`${fixture.name}: malformed report summary`);

  const trackedFiles = git(root, ["ls-files"]).split("\n").filter(Boolean);
  const jsTsFileCount = trackedFiles.filter((path) => /\.(?:js|mjs|cjs|ts|tsx|jsx)$/u.test(path)).length;
  const otherCodeFileCount = trackedFiles.filter((path) => /\.(?:py|rb|go|java|rs|php|cs|kt|swift|ex|exs|clj|scala|sql)$/u.test(path)).length;
  const codeFileCount = jsTsFileCount + otherCodeFileCount;
  const jsTsShare = codeFileCount === 0 ? 0 : jsTsFileCount / codeFileCount;
  if (jsTsShare < 0.9) throw new Error(`${fixture.name}: JS/TS code share is below 90%`);

  return {
    name: fixture.name,
    upstream: fixture.upstream,
    commit: fixture.commit,
    license: fixture.license,
    architectureShapes: fixture.architectureShapes,
    architectureEvidence: fixture.architectureEvidence,
    shallow: false,
    languageProfile: { jsTsFileCount, otherCodeFileCount, jsTsShare },
    filesWalked: report.coverage.filesWalked,
    findings: report.findings.length,
    score: report.score,
    coverage: report.coverage,
    reportJson: { path: reportJsonPath, bytes: readFileSync(reportJsonPath).byteLength, sha256: sha256(reportJsonPath) },
    reportHtml: { path: reportHtmlPath, bytes: readFileSync(reportHtmlPath).byteLength, sha256: sha256(reportHtmlPath) },
  };
}

const result = {
  schema: "verglos.private.public-oss-corpus-verification.v1",
  verifiedAt: new Date().toISOString(),
  cliRoot,
  cliCommit: process.env.VERGLOS_PUBLIC_OSS_CLI_COMMIT ?? git(cliRoot, ["rev-parse", "HEAD"]),
  node: process.version,
  execution: {
    telemetry: "disabled",
    liveSecretVerification: "not-requested",
    sourceUpload: "none",
    reportRetention: "private-local-derived-artifacts-only",
  },
  fixtureCount: fixtures.length,
  requiredArchitectureShapes,
  fixtures: fixtures.map(verifyFixture),
};
result.architectureShapes = [...new Set(result.fixtures.flatMap((fixture) => fixture.architectureShapes))].sort();
result.missingArchitectureShapes = requiredArchitectureShapes.filter((shape) => !result.architectureShapes.includes(shape));
result.architectureCoverageComplete = result.missingArchitectureShapes.length === 0;

const outputPath = process.env.VERGLOS_PUBLIC_OSS_VERIFICATION_OUTPUT;
if (outputPath) writeFileSync(resolve(outputPath), `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify(result, null, 2));
