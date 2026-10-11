import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { canonicalizeJson, parseHuntRecipe, type HuntRecipe } from "@verglos/shared";
import { createTestHuntTrustStore, TEST_HUNT_TRUST_KEY_ID } from "../../shared/src/hunt-trust-test-support.js";
import { executeHuntRecipeVerification } from "./hunt-recipe-verify.js";
import { runCliFixture } from "./cli-fixture.js";

function recipe(): HuntRecipe {
  return parseHuntRecipe({
    schemaId: "urn:verglos:schema:hunt-recipe",
    schemaVersion: "1.0.0",
    recipeId: "hunt-cli-fixture",
    ruleId: "fixture.rule",
    targetSubjectId: `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`,
    imageDigest: { algorithm: "sha256", value: "b".repeat(64) },
    command: ["fixture-probe"],
    assertions: ["exit code is 0"],
    isolation: "container",
    limits: { timeoutMs: 1000, cpuMs: 900, memoryMb: 256, diskMb: 128, outputBytes: 10000, processes: 32, maxNetworkRequests: 0 },
    cleanup: "always",
    network: { mode: "denied", destinations: [], reason: "test fixture" },
    redaction: "required",
    signature: { status: "verified", signer: TEST_HUNT_TRUST_KEY_ID },
  });
}

async function makeInputs(root: string, value = recipe()): Promise<{ recipePath: string; trustPath: string }> {
  const recipePath = join(root, "recipe.json");
  const trustPath = join(root, "trust-store.json");
  await writeFile(recipePath, `${canonicalizeJson(value)}\n`);
  await writeFile(trustPath, `${canonicalizeJson(createTestHuntTrustStore(recipe(), { at: new Date().toISOString() }))}\n`);
  return { recipePath, trustPath };
}

test("local recipe verification reports exact trust provenance without license text or execution authority", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-trust-"));
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (line?: unknown) => logs.push(String(line));
  try {
    const { recipePath, trustPath } = await makeInputs(root);
    assert.equal(await executeHuntRecipeVerification(recipePath, trustPath, { json: true }), 0);
    assert.equal(logs.length, 1);
    const output = JSON.parse(logs[0]!) as Record<string, unknown>;
    assert.equal(output.recipeTrustedByProvidedStore, true);
    assert.equal(output.legalClearance, false);
    assert.equal(output.executionAuthorized, false);
    assert.match(String(output.trustStoreDigest), /^sha256:[a-f0-9]{64}$/);
    assert.equal(JSON.stringify(output).includes("Fixture license text"), false);
    assert.match(String(output.trustLimitation), /out of band/);
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});

test("local recipe verification rejects recipe tampering and reports an invalid trust result", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-trust-tamper-"));
  const logs: string[] = [];
  const originalLog = console.log;
  console.log = (line?: unknown) => logs.push(String(line));
  try {
    const altered = recipe();
    const { recipePath, trustPath } = await makeInputs(root, parseHuntRecipe({ ...altered, assertions: ["changed after signing"] }));
    assert.equal(await executeHuntRecipeVerification(recipePath, trustPath, { json: true }), 2);
    const output = JSON.parse(logs[0]!) as Record<string, unknown>;
    assert.equal(output.recipeTrustedByProvidedStore, false);
    assert.equal(output.reason, "recipe-digest-mismatch");
    assert.equal(output.executionAuthorized, false);
  } finally {
    console.log = originalLog;
    await rm(root, { recursive: true, force: true });
  }
});

test("local recipe verification rejects symlinked trust-store inputs", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-trust-link-"));
  try {
    const { recipePath, trustPath } = await makeInputs(root);
    const linkPath = join(root, "trust-link.json");
    await symlink(trustPath, linkPath);
    assert.equal(await executeHuntRecipeVerification(recipePath, linkPath, { quiet: true }), 78);
    assert.equal((await readFile(recipePath, "utf8")).length > 0, true);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("hunt verify-recipe CLI emits one bounded machine result and does not execute the recipe", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-hunt-trust-process-"));
  try {
    const { recipePath, trustPath } = await makeInputs(root);
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "hunt", "verify-recipe", recipePath, "--trust-store", trustPath, "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0, `${result.stdout}\n${result.stderr}`);
    assert.equal(result.stderr, "");
    const output = JSON.parse(result.stdout) as Record<string, unknown>;
    assert.equal(output.recipeTrustedByProvidedStore, true);
    assert.equal(output.executionAuthorized, false);
    assert.deepEqual(result.files, []);
  } finally { await rm(root, { recursive: true, force: true }); }
});
