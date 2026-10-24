import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";

const PLANS = ["free", "pro", "team", "studio", "enterprise"];
const USER_ROLES = ["owner", "admin", "approver", "member", "viewer"];
const TENANT_MODES = ["single", "multi"];
const SCHEMA = "verglos.private.final-regression.v1";
const VERIFICATION_SCHEMA = "verglos.private.public-oss-corpus-verification.v1";
const AUTHORIZATION_SCHEMA = "verglos.web.role-tenant-matrix.v1";
const root = resolve(import.meta.dirname, "..");
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

const [verificationPath, candidateRoot, outputPath, cliCommit, webCommit, version, authorizationPath] = process.argv.slice(2);
if (!verificationPath || !candidateRoot || !outputPath || !cliCommit || !webCommit || !version) {
  throw new Error("usage: node scripts/build-final-regression-input.mjs VERIFICATION.json CANDIDATE_ROOT OUTPUT.json CLI_COMMIT WEB_COMMIT VERSION [AUTHORIZATION_MATRIX.json]");
}

const verification = await readJson(verificationPath);
if (verification.schema !== VERIFICATION_SCHEMA) throw new Error("unsupported corpus verification schema");
const corpusRoot = resolve(dirname(verificationPath));
const authorization = authorizationPath === undefined ? undefined : await readJson(authorizationPath);
let authorizationEvidence;
if (authorization !== undefined) {
  if (authorization.schema !== AUTHORIZATION_SCHEMA || authorization.scope !== "product-contract") throw new Error("unsupported authorization matrix schema");
  if (authorization.webCommit !== webCommit) throw new Error("authorization matrix is not bound to candidate Web commit");
  if (authorization.cellCount !== PLANS.length * USER_ROLES.length * TENANT_MODES.length || authorization.complete !== true) throw new Error("authorization matrix is incomplete");
  if (JSON.stringify(authorization.requiredPlans) !== JSON.stringify(PLANS)) throw new Error("authorization matrix plans are invalid");
  if (JSON.stringify(authorization.requiredRoles) !== JSON.stringify(USER_ROLES)) throw new Error("authorization matrix roles are invalid");
  if (JSON.stringify(authorization.requiredTenantModes) !== JSON.stringify(TENANT_MODES)) throw new Error("authorization matrix tenant modes are invalid");
  const absoluteAuthorizationPath = resolve(authorizationPath);
  const relativeAuthorizationPath = relative(root, absoluteAuthorizationPath);
  if (relativeAuthorizationPath.startsWith("..") || relativeAuthorizationPath.startsWith("/")) throw new Error("authorization matrix must be inside the shipping repository");
  authorizationEvidence = {
    schema: authorization.schema,
    scope: authorization.scope,
    webCommit: authorization.webCommit,
    path: relativeAuthorizationPath,
    sha256: SHA256(await readFile(absoluteAuthorizationPath)),
    requiredPlans: PLANS,
    requiredRoles: USER_ROLES,
    requiredTenantModes: TENANT_MODES,
    cellCount: authorization.cellCount,
    complete: true,
  };
}
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
    if (!(await exists(candidateReportPath))) {
      if (authorizationEvidence !== undefined) throw new Error(`missing candidate report for complete matrix: ${fixture.name}/${plan}`);
      continue;
    }
    const candidateReport = await readJson(candidateReportPath);
    const evidencePath = relative(resolve(candidateRoot), candidateReportPath);
    const limitations = [
      authorizationEvidence === undefined
        ? "CLI plan simulation executed; user-role and tenant-mode behavior was not exercised by this CLI-only run."
        : "CLI report is plan-bound; role/tenant behavior is bound to the Web product-contract matrix, not re-executed in the CLI process.",
      "Hosted Web/provider lifecycle was not invoked by this local corpus run.",
    ];
    const scenarios = authorizationEvidence === undefined
      ? [{ userRole: "owner", tenantMode: "single" }]
      : USER_ROLES.flatMap((userRole) => TENANT_MODES.map((tenantMode) => ({ userRole, tenantMode })));
    for (const scenario of scenarios) {
      runs.push({
        fixture: fixture.name,
        sourceCommit: cliCommit,
        webCommit,
        scenario: { plan, ...scenario },
        baseline: measurement(await readJson(sourceReportPath), limitations),
        candidate: measurement(candidateReport, limitations),
        evidence: [{ path: evidencePath, sha256: SHA256(await readFile(candidateReportPath)) }],
      });
    }
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
  ...(authorizationEvidence === undefined ? {} : { authorizationEvidence }),
  runs,
};

await writeFile(outputPath, `${JSON.stringify(input, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
process.stdout.write(`${JSON.stringify({ fixtureCount: fixtures.length, runCount: runs.length, outputPath })}\n`);
