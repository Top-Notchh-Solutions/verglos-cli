#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const workspace = resolve(process.env.TOP_NOTCHH_WORKSPACE ?? "/Users/anuragyadav/Developer/TopNotchh-Workspace");
const fixtureRoot = resolve(process.env.VERGLOS_ACCEPTANCE_FIXTURES ?? join(workspace, "acceptance-fixtures"));
const evidenceRoot = resolve(process.env.VERGLOS_ACCEPTANCE_EVIDENCE ?? join(workspace, ".local-evidence"));
const cliCommit = process.env.VERGLOS_CLI_COMMIT ?? "955412516b96cc09393e78c43bf7d02b9abd05d9";
const cliRoot = resolve(process.env.VERGLOS_CLI_ROOT ?? "/tmp/verglos-cli-current.MphZDs");

const fixtures = [
  { name: "juice-shop", upstream: "https://github.com/juice-shop/juice-shop", commit: "1618a611b173b4bf114028e6e02549950606e29d", license: "MIT" },
  { name: "nodegoat", upstream: "https://github.com/OWASP/NodeGoat", commit: "c5cb68a7084e4ae7dcc60e6a98768720a81841e8", license: "Apache-2.0" },
  { name: "dvna", upstream: "https://github.com/appsecco/dvna", commit: "9ba473add536f66ac9007966acb2a775dd31277a", license: "MIT" },
  { name: "nodejs-goof", upstream: "https://github.com/snyk-labs/nodejs-goof", commit: "add14ba59e98240d9e00a235dd7d42cd61ae9912", license: "Apache-2.0" },
  { name: "damm-vulnerable-node", upstream: "https://github.com/rdurlo/Damm-Vulnerable-Node-Application", commit: "1946570b36bf8e6dcac48142f072f40ee9cee160", license: "MIT" },
  { name: "buggy-node", upstream: "https://github.com/UtkarshGupta-CS/buggy-node", commit: "b1b9cbc8b86f81a1ecb0b142190d4fa4698518da", license: "ISC" },
];

// Four versioned contract artifacts from the exact CLI source under test.
// They extend the six repository fixtures to a ten-item corpus without
// inventing a customer or duplicating source into the private ledger.
const artifacts = [
  { name: "contract-fixture-catalog", path: "packages/shared/fixtures/contracts/fixture-catalog.json", sha256: "1f9410dec73eeb4e85a2109dea6af2d00c0202997f68dba970d7a2ceceaa7897", bytes: 473, license: "Apache-2.0", expectedCoverage: "fixture-catalog-validation" },
  { name: "contract-failure-valid", path: "packages/shared/fixtures/contracts/failure-valid.json", sha256: "3118bb3d9afd2e4946652202df6dd033961e599b1a90b4718439ca7bd05c1c7d", bytes: 492, license: "Apache-2.0", expectedCoverage: "valid-contract" },
  { name: "contract-failure-invalid-exit", path: "packages/shared/fixtures/contracts/failure-invalid-exit.json", sha256: "ca2f8670e99172216bae120a4199d897af578a56ec02143add878851898d324f", bytes: 492, license: "Apache-2.0", expectedCoverage: "invalid-exit-contract" },
  { name: "contract-failure-backward-compatible", path: "packages/shared/fixtures/contracts/failure-backward-compatible.json", sha256: "7db493a7ddc2c3265dee479d1cc43a5a6c8a7bb4238978b53883eb29f1bc30a5", bytes: 421, license: "Apache-2.0", expectedCoverage: "backward-compatible-contract" },
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

function verifyArtifact(artifact) {
  const path = join(cliRoot, artifact.path);
  if (!existsSync(path)) throw new Error(`${artifact.name}: artifact is missing`);
  const bytes = readFileSync(path);
  if (bytes.byteLength !== artifact.bytes) throw new Error(`${artifact.name}: byte count changed`);
  if (sha256(path) !== artifact.sha256) throw new Error(`${artifact.name}: SHA-256 changed`);
  return { ...artifact, sourceCommit: cliCommit, sourcePath: path, integrity: "verified" };
}

const verified = fixtures.map(verifyFixture);
const verifiedArtifacts = artifacts.map(verifyArtifact);
const result = {
  schema: "verglos.private.acceptance-corpus-verification.v1",
  verifiedAt: new Date().toISOString(),
  cliCommit,
  fixtureCount: verified.length + verifiedArtifacts.length,
  repositoryFixtureCount: verified.length,
  artifactCount: verifiedArtifacts.length,
  allFullClones: verified.every((fixture) => fixture.shallow === false),
  allCompleteCoverage: verified.every((fixture) => fixture.coverage.status === "complete" && fixture.coverage.limitations.length === 0),
  allArtifactsIntact: verifiedArtifacts.every((artifact) => artifact.integrity === "verified"),
  fixtures: verified,
  artifacts: verifiedArtifacts,
};
const outputPath = process.env.VERGLOS_ACCEPTANCE_VERIFICATION_OUTPUT;
if (outputPath) writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify(result, null, 2));
