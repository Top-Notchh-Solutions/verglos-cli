import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { runCliFixture } from "./cli-fixture.js";

test("record import-provenance writes a private canonical record member without overwriting", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-provenance-"));
  try {
    const source = join(root, "source.intoto.json");
    const output = join(root, "provenance-member.json");
    const artifactDigest = "a".repeat(64);
    const subjectId = `urn:verglos:subject:artifact:sha256:${artifactDigest}`;
    const statement = { _type: "https://in-toto.io/Statement/v1", subject: [{ name: "release.tgz", digest: { sha256: artifactDigest } }], predicateType: "https://slsa.dev/provenance/v1", predicate: { buildType: "fixture" } };
    await writeFile(source, JSON.stringify(statement), { mode: 0o600 });
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "record", "import-provenance", source, output, "--provider", "github", "--subject-id", subjectId, "--expected-digest", `sha256:${artifactDigest}`, "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 0, `${result.stdout}\n${result.stderr}`);
    assert.equal(result.stderr, "");
    const summary = JSON.parse(result.stdout) as { match: string; signatureStatus: string; providerIdentityStatus: string };
    assert.equal(summary.match, "matched");
    assert.equal(summary.signatureStatus, "unverified");
    assert.equal(summary.providerIdentityStatus, "caller-declared");
    const member = JSON.parse(await readFile(output, "utf8")) as { schemaId: string; source: { bytesBase64: string } };
    assert.equal(member.schemaId, "urn:verglos:schema:provider-provenance");
    assert.equal(Buffer.from(member.source.bytesBase64, "base64").toString("utf8"), JSON.stringify(statement));
    const second = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "record", "import-provenance", source, output, "--provider", "github", "--subject-id", subjectId, "--expected-digest", `sha256:${artifactDigest}`, "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(second.exitCode, 78);
    assert.deepEqual(JSON.parse(await readFile(output, "utf8")), member);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record import-provenance rejects a symlink input before writing output", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-provenance-link-"));
  try {
    const actual = join(root, "actual.json"); const linked = join(root, "linked.json"); const output = join(root, "out.json");
    await writeFile(actual, JSON.stringify({ _type: "https://in-toto.io/Statement/v1", subject: [{ name: "x", digest: { sha256: "a".repeat(64) } }] }));
    await symlink(actual, linked);
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "record", "import-provenance", linked, output, "--provider", "npm", "--subject-id", `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`, "--expected-digest", `sha256:${"a".repeat(64)}`, "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 78);
    await assert.rejects(() => readFile(output));
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("record import-provenance rejects malformed expected digest without creating a member", async () => {
  const root = await mkdtemp(join(tmpdir(), "verglos-record-provenance-digest-"));
  try {
    const source = join(root, "source.json"); const output = join(root, "out.json");
    await writeFile(source, JSON.stringify({ _type: "https://in-toto.io/Statement/v1", subject: [{ name: "x", digest: { sha256: "a".repeat(64) } }] }));
    const result = await runCliFixture(process.execPath, ["--import", fileURLToPath(import.meta.resolve("tsx")), join(process.cwd(), "src", "index.ts"), "record", "import-provenance", source, output, "--provider", "npm", "--subject-id", `urn:verglos:subject:artifact:sha256:${"a".repeat(64)}`, "--expected-digest", "not-a-digest", "--json", "--quiet"], root, { env: { VERGLOS_DEV_SKIP_UPDATE_CHECK: "1" } });
    assert.equal(result.exitCode, 78);
    await assert.rejects(() => readFile(output));
  } finally { await rm(root, { recursive: true, force: true }); }
});
