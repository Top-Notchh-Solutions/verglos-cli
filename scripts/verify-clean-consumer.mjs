import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdtemp, readdir, rm, writeFile, lstat, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import { cleanConsumerInstallTimeoutMs } from "./clean-consumer-runtime.mjs";
// The fixture builder uses the repository's built shared contract helpers;
// execution below is performed only by the packed consumer installation.
import { canonicalizeJson, createApprovalReceipt, huntRecipeDigest, parseHuntRecipe } from "../packages/shared/dist/index.js";

const run = promisify(execFile);
const archiveRoot = resolve(process.argv[2] ?? "");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npmOptions = { shell: process.platform === "win32" };
if (!process.argv[2]) throw new Error("release archive directory is required");
const rootStat = await lstat(archiveRoot);
if (!rootStat.isDirectory()) throw new Error("release archive path must be a directory");

const expectedPackages = [
  { name: "verglos", matches: (archive) => /^verglos-\d+\.\d+\.\d+[^/]*\.tgz$/.test(archive) },
  ...["shared", "scanner", "reporter", "mcp", "entitlement"].map((name) => ({ name: `@verglos/${name}`, matches: (archive) => archive.startsWith(`verglos-${name}-`) })),
  { name: "@verglos/hunt", matches: (archive) => archive.startsWith("verglos-hunt-") },
];
const archives = (await readdir(archiveRoot)).filter((name) => name.endsWith(".tgz")).sort();
if (archives.length !== expectedPackages.length) throw new Error(`expected ${expectedPackages.length} package archives, received ${archives.length}`);
for (const packageInfo of expectedPackages) {
  if (archives.filter(packageInfo.matches).length !== 1) throw new Error(`release must contain exactly one ${packageInfo.name} archive`);
}
for (const name of archives) {
  if (!(await lstat(join(archiveRoot, name))).isFile()) throw new Error(`package archive must be a regular file: ${name}`);
}

function signedA1Fixture(at) {
  const subjectId = `urn:verglos:subject:repository-tree:sha256:${"a".repeat(64)}`;
  const recipe = parseHuntRecipe({
    schemaId: "urn:verglos:schema:hunt-recipe",
    schemaVersion: "1.0.0",
    recipeId: "a1-utf8-contains",
    ruleId: "hunt.a1.utf8-contains",
    targetSubjectId: subjectId,
    imageDigest: { algorithm: "sha256", value: "b".repeat(64) },
    command: ["verglos-probe", "utf8-contains"],
    assertions: ["probe result is true"],
    fixtures: {
      positive: { fixtureId: "positive", expectedVerdict: "confirmed" },
      negative: { fixtureId: "negative", expectedVerdict: "not-reproduced" },
      timeout: { fixtureId: "timeout", expectedVerdict: "inconclusive" },
      infrastructureFailure: { fixtureId: "adapter-failure", expectedVerdict: "environment-error" },
      unsupported: { fixtureId: "unsupported", expectedVerdict: "not-supported" },
    },
    inputs: { needle: "packed-consumer-canary", value: "fixture contains packed-consumer-canary" },
    isolation: "restricted-process",
    limits: { timeoutMs: 2_000, cpuMs: 1_500, memoryMb: 64, diskMb: 16, outputBytes: 1_024, processes: 1, maxNetworkRequests: 0 },
    cleanup: "always",
    network: { mode: "denied", destinations: [], reason: "A1 pure probe" },
    redaction: "required",
    signature: { status: "verified", signer: "verglos-packed-consumer-test" },
  });
  const licenseText = "SPDX-License-Identifier: MIT\nFixture license text.";
  const unsignedFeed = {
    schemaId: "urn:verglos:schema:hunt-recipe-feed",
    schemaVersion: "1.0.0",
    feedId: "verglos-hunt-feed-packed-consumer",
    origin: "https://recipes.example.test",
    issuedAt: new Date(Date.parse(at) - 60_000).toISOString(),
    expiresAt: new Date(Date.parse(at) + 86_400_000).toISOString(),
    entries: [{
      recipe,
      recipeDigest: huntRecipeDigest(recipe),
      license: {
        licenseId: "MIT",
        source: "https://licenses.example.test/MIT.txt",
        textDigest: { algorithm: "sha256", value: createHash("sha256").update(licenseText, "utf8").digest("hex") },
        licenseText,
      },
    }],
    revokedRecipeIds: [],
  };
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const signature = sign(null, Buffer.from(canonicalizeJson(unsignedFeed), "utf8"), privateKey).toString("base64");
  const trustStore = {
    schemaId: "urn:verglos:schema:hunt-recipe-trust-store",
    schemaVersion: "1.0.0",
    feeds: [{
      feedId: unsignedFeed.feedId,
      origin: unsignedFeed.origin,
      keys: [{ keyId: "verglos-packed-consumer-test", publicKeyPem: publicKey.export({ type: "spki", format: "pem" }).toString() }],
    }],
    signedFeeds: [{ ...unsignedFeed, signature: { algorithm: "ed25519", keyId: "verglos-packed-consumer-test", value: signature } }],
  };
  const report = {
    projectRoot: "fixture-project",
    projectType: "node",
    scannedAt: at,
    durationMs: 1,
    findings: [{ id: "critical-1", detector: "hunt", rule: "hunt.a1.utf8-contains", severity: "critical", title: "packed consumer fixture", description: "bounded synthetic fixture" }],
  };
  const approval = createApprovalReceipt({
    requestId: "523e4567-e89b-12d3-a456-426614174000",
    action: "execute",
    actor: "human",
    target: subjectId,
    files: [],
    network: [],
    policyEffect: "hunt",
    requestedAt: "2026-01-01T00:00:00Z",
    expiresAt: "2099-01-01T00:00:00Z",
  }, { decision: "approved", decidedBy: "human", decidedAt: "2026-01-01T00:01:00Z" });
  return { subjectId, report, recipe, trustStore, approval };
}

async function writeJson(path, value) {
  await writeFile(path, `${canonicalizeJson(value)}\n`, "utf8");
}

async function runAllowingExpectedExit(file, args, options) {
  try {
    const result = await run(file, args, options);
    return { exitCode: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    const childError = error;
    return {
      exitCode: typeof childError.code === "number" ? childError.code : Number(childError.code ?? 1),
      stdout: String(childError.stdout ?? ""),
      stderr: String(childError.stderr ?? ""),
    };
  }
}

async function verifyPackedHuntConsumer(consumer, cli) {
  const fixture = await mkdtemp(join(consumer, "hunt-fixture-"));
  const home = join(consumer, "hunt-home");
  const apiUrl = "https://capability-fixture.invalid";
  const at = new Date().toISOString();
  const { subjectId, report, recipe, trustStore, approval } = signedA1Fixture(at);
  await mkdir(join(home, ".verglos"), { recursive: true });
  await Promise.all([
    writeJson(join(fixture, "report.json"), { ...report, projectRoot: fixture }),
    writeJson(join(fixture, "recipe.json"), recipe),
    writeJson(join(fixture, "trust-store.json"), trustStore),
    writeJson(join(fixture, "approval.json"), approval),
    writeJson(join(home, ".verglos", "capabilities.json"), {
      credentialScope: createHash("sha256").update(JSON.stringify([apiUrl, null])).digest("hex"),
      plan: "pro",
      capabilities: ["hunt.critical"],
      cache_ttl_seconds: 3_600,
      simulated: false,
      active: true,
      fetchedAt: new Date(Date.now() - 1_000).toISOString(),
      expiresAt: new Date(Date.now() + 3_600_000).toISOString(),
    }),
  ]);
  const env = { ...process.env, HOME: home, USERPROFILE: home, VERGLOS_API_URL: apiUrl, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", VERGLOS_TELEMETRY: "0" };
  const result = await runAllowingExpectedExit(process.execPath, [
    cli,
    "hunt",
    "--execute-report", join(fixture, "report.json"),
    "--execute-recipe", join(fixture, "recipe.json"),
    "--execute-trust-store", join(fixture, "trust-store.json"),
    "--execute-approval", join(fixture, "approval.json"),
    "--execute-rule-id", "hunt.a1.utf8-contains",
    "--execute-subject-id", subjectId,
    "--execute-observation-id", "urn:uuid:123e4567-e89b-12d3-a456-426614174000",
    "--json",
    "--quiet",
  ], { cwd: consumer, env, timeout: 30_000, maxBuffer: 2 * 1024 * 1024 });
  try {
    if (result.exitCode !== 1) throw new Error(`packed Hunt execution expected exit 1 for a confirmed fixture, received ${result.exitCode}: ${result.stderr}`);
    const projection = JSON.parse(result.stdout);
    if (projection.status !== "completed" || projection.executionAuthorized !== true || projection.recipeId !== "a1-utf8-contains" || projection.sandbox !== "restricted-process") throw new Error("packed Hunt execution did not complete through the authorized bounded runtime");
    if (projection.outcomes?.[0]?.canonicalVerdict !== "confirmed") throw new Error("packed Hunt execution did not produce the expected confirmed verdict");
    if (/packed-consumer-canary|Fixture license text/u.test(`${result.stdout}\n${result.stderr}`)) throw new Error("packed Hunt output leaked fixture input or license text");
    return projection;
  } finally {
    await rm(fixture, { recursive: true, force: true });
    await rm(home, { recursive: true, force: true });
  }
}

const consumer = await mkdtemp(join(tmpdir(), "verglos-clean-consumer-"));
try {
  await writeFile(join(consumer, "package.json"), JSON.stringify({ name: "verglos-release-consumer", private: true, version: "1.0.0" }));
  const paths = archives.map((name) => join(archiveRoot, name));
  await run(npmCommand, ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--no-package-lock", ...paths], { ...npmOptions, cwd: consumer, timeout: cleanConsumerInstallTimeoutMs(process.platform), maxBuffer: 8 * 1024 * 1024 });
  const cli = join(consumer, "node_modules", "verglos", "dist", "index.js");
  const result = await run(process.execPath, [cli, "--version"], { cwd: consumer, timeout: 15_000, maxBuffer: 1024 * 1024 });
  if (!/^\d+\.\d+\.\d+[^\r\n]*\r?\n?$/.test(result.stdout.trim())) throw new Error("clean consumer CLI did not emit a version");
  await run(process.execPath, ["--input-type=module", "-e", "await Promise.all(['@verglos/shared','@verglos/scanner','@verglos/reporter','@verglos/mcp','@verglos/entitlement','@verglos/hunt'].map((name) => import(name)))"], { cwd: consumer, timeout: 15_000, maxBuffer: 1024 * 1024 });
  const engineCache = join(consumer, "engine-cache");
  const home = join(consumer, "home");
  const isolatedEnv = { ...process.env, VERGLOS_ENGINE_CACHE: engineCache, VERGLOS_DEV_SKIP_UPDATE_CHECK: "1", HOME: home, USERPROFILE: home };
  const engineStatus = await run(process.execPath, [cli, "engines", "status", "--json"], { cwd: consumer, env: isolatedEnv, timeout: 15_000, maxBuffer: 1024 * 1024 });
  const status = JSON.parse(engineStatus.stdout);
  if (!Array.isArray(status.engines) || status.engines.length !== 0) throw new Error("clean consumer unexpectedly discovered an installed external engine");
  try {
    await lstat(engineCache);
    throw new Error("clean consumer created an external-engine cache without an explicit install request");
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
  }
  const huntProjection = await verifyPackedHuntConsumer(consumer, cli);
  console.log(`clean consumer installed ${archives.length} archives, imported all libraries, executed Verglos ${result.stdout.trim()}, confirmed no external engine installation, and executed signed ${huntProjection.recipeId} through the bounded ${huntProjection.sandbox} runtime with an isolated Pro capability fixture`);
} finally {
  // Windows can release npm/Node handles a moment after the child exits.
  // Bounded retries keep cleanup deterministic without hiding a persistent
  // failure or leaving the release check to fail on an otherwise valid run.
  await rm(consumer, { recursive: true, force: true, maxRetries: 10, retryDelay: 250 });
}
