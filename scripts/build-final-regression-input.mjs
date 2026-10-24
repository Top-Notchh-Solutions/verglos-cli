import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";

const PLANS = ["free", "pro", "team", "studio", "enterprise"];
const SCHEMA = "verglos.private.final-regression.v1";
const VERIFICATION_SCHEMA = "verglos.private.public-oss-corpus-verification.v1";
const SHA256 = (bytes) => `sha256:${createHash("sha256").update(bytes).digest("hex")}`;

function reportPathForFixture(root, fixture) {
  return resolve(fixture.reportJson.path);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

function measurement(report, limitations = []) {
  const coverage = report.coverage ?? {};
  return {
    status: "passed",
    exitCode: 0,
    coverage: coverage.status === "complete" ? "complete" : "partial",
    filesWalked: report.coverage?.filesWalked ?? 1,
    findingCount: Array.isArray(report.findings) ? report.findings.length : 0,
    durationMs: report.durationMs,
    limitations: [...(Array.isArray(coverage.limitations) ? coverage.limitations : []), ...limitations],
  };
}

const [verificationPath, candidateRoot, outputPath, cliCommit, webCommit, version] = process.argv.slice(2);
if (!verificationPath || !candidateRoot || !outputPath || !cliCommit || !webCommit || !version) {
  throw new Error("usage: node scripts/build-final-regression-input.mjs VERIFICATION.json CANDIDATE_ROOT OUTPUT.json CLI_COMMIT WEB_COMMIT VERSION");
}

const verification = await readJson(verificationPath);
if (verification.schema !== VERIFICATION_SCHEMA) throw new Error("unsupported corpus verification schema");
const corpusRoot = resolve(dirname(verificationPath));
const fixtures = [];
const runs = [];

for (const fixture of verification.fixtures) {
  const sourceReportPath = reportPathForFixture(corpusRoot, fixture);
  const sourceReportBytes = await readFile(sourceReportPath);
  const reportPath = relative(corpusRoot, sourceReportPath);
  fixtures.push({
    name: fixture.name,
    exactCommit: fixture.commit,
    reportSha256: SHA256(sourceReportBytes),
    reportPath,
    architectureShapes: fixture.architectureShapes,
  });

  for (const plan of PLANS) {
    const candidateReportPath = join(resolve(candidateRoot), fixture.name, plan, "verglos-report.json");
    if (!(await exists(candidateReportPath))) continue;
    const candidateReport = await readJson(candidateReportPath);
    const evidencePath = relative(resolve(candidateRoot), candidateReportPath);
    const limitations = [
      "CLI plan simulation executed; user-role and tenant-mode behavior was not exercised by this CLI-only run.",
      "Hosted Web/provider lifecycle was not invoked by this local corpus run.",
    ];
    runs.push({
      fixture: fixture.name,
      sourceCommit: cliCommit,
      webCommit,
      scenario: { plan, userRole: "owner", tenantMode: "single" },
      baseline: measurement(await readJson(sourceReportPath), limitations),
      candidate: measurement(candidateReport, limitations),
      evidence: [{ path: evidencePath, sha256: SHA256(await readFile(candidateReportPath)) }],
    });
  }
}

if (runs.length === 0) throw new Error("no candidate scenario reports found");

const input = {
  schema: SCHEMA,
  candidate: { cliCommit, webCommit, version },
  corpus: {
    verificationSchema: VERIFICATION_SCHEMA,
    manifestSha256: SHA256(await readFile(verificationPath)),
    fixtureCount: fixtures.length,
    fixtures,
  },
  thresholds: { maxDurationIncreasePercent: 25 },
  gates: {
    truthRegistry: "open",
    riskReview: "open",
    heldOutCorrection: "open",
    providerLifecycle: "open",
    finalRelease: "open",
  },
  decision: "no-go",
  runs,
};

await writeFile(outputPath, `${JSON.stringify(input, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
process.stdout.write(`${JSON.stringify({ fixtureCount: fixtures.length, runCount: runs.length, outputPath })}\n`);
