#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const workspace = resolve(process.env.TOP_NOTCHH_WORKSPACE ?? "/Users/anuragyadav/Developer/TopNotchh-Workspace");
const fixtureRoot = resolve(process.env.VERGLOS_ACCEPTANCE_FIXTURES ?? join(workspace, "acceptance-fixtures"));
const evidenceRoot = resolve(process.env.VERGLOS_ACCEPTANCE_EVIDENCE ?? join(workspace, ".local-evidence"));
const cliCommit = process.env.VERGLOS_CLI_COMMIT ?? "955412516b96cc09393e78c43bf7d02b9abd05d9";

const fixtures = [
  { name: "juice-shop", upstream: "https://github.com/juice-shop/juice-shop", commit: "1618a611b173b4bf114028e6e02549950606e29d", license: "MIT" },
  { name: "nodegoat", upstream: "https://github.com/OWASP/NodeGoat", commit: "c5cb68a7084e4ae7dcc60e6a98768720a81841e8", license: "Apache-2.0" },
  { name: "dvna", upstream: "https://github.com/appsecco/dvna", commit: "9ba473add536f66ac9007966acb2a775dd31277a", license: "MIT" },
  { name: "nodejs-goof", upstream: "https://github.com/snyk-labs/nodejs-goof", commit: "add14ba59e98240d9e00a235dd7d42cd61ae9912", license: "Apache-2.0" },
  { name: "damm-vulnerable-node", upstream: "https://github.com/rdurlo/Damm-Vulnerable-Node-Application", commit: "1946570b36bf8e6dcac48142f072f40ee9cee160", license: "MIT" },
  { name: "buggy-node", upstream: "https://github.com/UtkarshGupta-CS/buggy-node", commit: "b1b9cbc8b86f81a1ecb0b142190d4fa4698518da", license: "ISC" },
];

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function git(fixture, args) {
  return execFileSync("git", ["-C", join(fixtureRoot, fixture.name), ...args], { encoding: "utf8" }).trim();
}

function verifyFixture(fixture) {
  const root = join(fixtureRoot, fixture.name);
  if (!existsSync(join(root, ".git"))) throw new Error(`${fixture.name}: missing .git directory`);
  if (git(fixture, ["rev-parse", "--is-shallow-repository"]) !== "false") throw new Error(`${fixture.name}: checkout is shallow`);
  if (git(fixture, ["rev-parse", "HEAD"]) !== fixture.commit) throw new Error(`${fixture.name}: HEAD does not match frozen commit`);
  const authorization = readFileSync(join(root, "AUTHORIZATION.md"), "utf8");
  for (const required of [/public technical fixture/i, /not an authorized customer/i, /permitted (test )?scope/i, /findings may be stored/i, /expiry/i]) {
    if (!required.test(authorization)) throw new Error(`${fixture.name}: authorization notice missing ${required}`);
  }
  const baseReportDir = join(evidenceRoot, `${fixture.name}-cli-9554125`);
  const provenanceReportDir = join(evidenceRoot, `${fixture.name}-cli-9554125-provenance`);
  const reportDir = existsSync(join(provenanceReportDir, "verglos-report.json"))
    ? provenanceReportDir
    : baseReportDir;
  const jsonPath = join(reportDir, "verglos-report.json");
  const htmlPath = join(reportDir, "verglos-report.html");
  const report = JSON.parse(readFileSync(jsonPath, "utf8"));
  if (report.coverage?.status !== "complete" || (report.coverage?.limitations ?? []).length !== 0) throw new Error(`${fixture.name}: report coverage is incomplete`);
  if (!Number.isInteger(report.coverage?.filesWalked) || report.coverage.filesWalked <= 0) throw new Error(`${fixture.name}: invalid filesWalked`);
  if (!Array.isArray(report.findings) || !report.score || typeof report.score.value !== "number") throw new Error(`${fixture.name}: malformed report summary`);
  return {
    ...fixture,
    shallow: false,
    cliCommit,
    scannedAt: report.scannedAt,
    projectType: report.projectType,
    filesWalked: report.coverage.filesWalked,
    findings: report.findings.length,
    score: report.score,
    provenance: report.provenance ?? null,
    coverage: report.coverage,
    reportJson: { path: jsonPath, sha256: sha256(jsonPath), bytes: readFileSync(jsonPath).byteLength },
    reportHtml: { path: htmlPath, sha256: sha256(htmlPath), bytes: readFileSync(htmlPath).byteLength },
  };
}

const verified = fixtures.map(verifyFixture);
const result = {
  schema: "verglos.private.acceptance-corpus-verification.v1",
  verifiedAt: new Date().toISOString(),
  cliCommit,
  fixtureCount: verified.length,
  allFullClones: verified.every((fixture) => fixture.shallow === false),
  allCompleteCoverage: verified.every((fixture) => fixture.coverage.status === "complete" && fixture.coverage.limitations.length === 0),
  fixtures: verified,
};
const outputPath = process.env.VERGLOS_ACCEPTANCE_VERIFICATION_OUTPUT;
if (outputPath) writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify(result, null, 2));
