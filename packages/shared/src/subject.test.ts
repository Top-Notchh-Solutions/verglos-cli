import assert from "node:assert/strict";
import { test } from "node:test";
import {
  JsonDocumentError,
  SUBJECT_SCHEMA,
  SubjectValidationError,
  createSubject,
  parseSubject,
  parseSubjectJson,
  type ContentDigest,
  type SubjectPayload,
} from "./index.js";

const sha256 = (character: string): ContentDigest => ({
  algorithm: "sha256",
  value: character.repeat(64),
});

const gitSha1 = (character: string) => ({
  algorithm: "sha1" as const,
  value: character.repeat(40),
});

const linuxAmd64 = { os: "linux", architecture: "amd64" } as const;

const validPayloads: readonly SubjectPayload[] = [
  {
    kind: "repository-tree",
    vcs: "git",
    commit: gitSha1("a"),
    tree: gitSha1("b"),
    dirty: false,
    submoduleState: "none",
    shallow: false,
  },
  {
    kind: "package",
    ecosystem: "npm",
    name: "@verglos/shared",
    version: "2.0.0-alpha.1",
    digest: sha256("c"),
    purl: "pkg:npm/%40verglos/shared@2.0.0-alpha.1",
  },
  {
    kind: "filesystem",
    treeDigest: sha256("d"),
    ignorePolicyDigest: sha256("e"),
    entryCount: 12,
    scopePath: "packages/shared",
  },
  {
    kind: "sbom",
    format: "cyclonedx-json",
    documentDigest: sha256("f"),
    serialNumber: "urn:uuid:12345678-1234-1234-1234-123456789abc",
  },
  {
    kind: "artifact",
    digest: sha256("1"),
    size: 42,
    mediaType: "application/gzip",
    path: "dist/verglos.tgz",
  },
  {
    kind: "oci-manifest",
    registry: "registry.example.com",
    repository: "team/verglos",
    tag: "v1",
    digest: sha256("2"),
    size: 1024,
    platform: linuxAmd64,
  },
  {
    kind: "oci-index",
    registry: "registry.example.com",
    repository: "team/verglos",
    tag: "stable",
    digest: sha256("3"),
    manifests: [
      { digest: sha256("4"), platform: linuxAmd64 },
      {
        digest: sha256("5"),
        platform: { os: "linux", architecture: "arm64", variant: "v8" },
      },
    ],
  },
];

test("all V1 subject kinds create deterministic, self-validating documents", () => {
  for (const payload of validPayloads) {
    const first = createSubject(payload);
    const second = createSubject(payload);

    assert.equal(first.schemaId, SUBJECT_SCHEMA.id);
    assert.equal(first.schemaVersion, SUBJECT_SCHEMA.version);
    assert.match(
      first.subjectId,
      new RegExp(`^urn:verglos:subject:${payload.kind}:sha256:[a-f0-9]{64}$`),
    );
    assert.equal(first.subjectId, second.subjectId);
    assert.deepEqual(parseSubject(first), first);
    assert.deepEqual(parseSubjectJson(JSON.stringify(first)), first);
  }
});

test("subject IDs are verified against immutable identity fields", () => {
  const subject = createSubject(validPayloads[4]!);
  const replacement = subject.subjectId.endsWith("a") ? "b" : "a";
  assertSubjectError(
    () =>
      parseSubject({
        ...subject,
        subjectId: subject.subjectId.replace(/[a-f0-9]$/, replacement),
      }),
    "subjectId",
  );
  assertSubjectError(
    () => parseSubject({ ...subject, subjectId: "artifact:latest" }),
    "subjectId",
  );
});

test("repository tree identity changes for a dirty worktree digest", () => {
  const base = validPayloads[0]!;
  assert.equal(base.kind, "repository-tree");
  const first = createSubject({ ...base, dirty: true, worktreeDigest: sha256("6") });
  const second = createSubject({ ...base, dirty: true, worktreeDigest: sha256("7") });
  assert.notEqual(first.subjectId, second.subjectId);
});

test("dirty repository trees cannot omit their worktree digest", () => {
  const base = validPayloads[0]!;
  assert.equal(base.kind, "repository-tree");
  assertSubjectError(
    () => createSubject({ ...base, dirty: true }),
    "worktreeDigest",
  );
  assertSubjectError(
    () => createSubject({ ...base, dirty: false, worktreeDigest: sha256("6") }),
    "worktreeDigest",
  );
});

test("packages require an immutable content digest", () => {
  const { digest: _digest, ...mutableOnly } = validPayloads[1] as Extract<
    SubjectPayload,
    { kind: "package" }
  >;
  assertSubjectError(
    () => createSubject(mutableOnly as SubjectPayload),
    "digest",
  );
});

test("OCI tags are labels and cannot identify a manifest without a digest", () => {
  const { digest: _digest, ...mutableOnly } = validPayloads[5] as Extract<
    SubjectPayload,
    { kind: "oci-manifest" }
  >;
  assertSubjectError(
    () => createSubject(mutableOnly as SubjectPayload),
    "digest",
  );
});

test("OCI identity follows manifest bytes, not registry or mutable tag labels", () => {
  const first = validPayloads[5]!;
  assert.equal(first.kind, "oci-manifest");
  const mirror = {
    ...first,
    registry: "mirror.example.com",
    repository: "archive/verglos",
    tag: "latest",
  };
  assert.equal(createSubject(first).subjectId, createSubject(mirror).subjectId);
});

test("OCI registries reject schemes, credentials, paths, and invalid ports", () => {
  const base = validPayloads[5]!;
  assert.equal(base.kind, "oci-manifest");
  for (const registry of [
    "https:",
    "user@registry.example.com",
    "registry.example.com/path",
    "registry.example.com:65536",
    "Upper.example.com",
  ]) {
    assertSubjectError(() => createSubject({ ...base, registry }), "registry");
  }
});

test("OCI index platform entries must be explicit and unique", () => {
  const base = validPayloads[6]!;
  assert.equal(base.kind, "oci-index");
  assertSubjectError(
    () =>
      createSubject({
        ...base,
        manifests: [
          { digest: sha256("8"), platform: linuxAmd64 },
          { digest: sha256("9"), platform: linuxAmd64 },
        ],
      }),
    "manifests.1.platform",
  );
});

test("subject paths reject absolute, traversal, drive, empty, and overlong segments", () => {
  const base = validPayloads[4]!;
  assert.equal(base.kind, "artifact");
  for (const path of [
    "/etc/passwd",
    "dist/../secret",
    "C:/temp/file",
    "dist//file",
    `dist/${"a".repeat(256)}`,
  ]) {
    assertSubjectError(() => createSubject({ ...base, path }), "path");
  }
});

test("digests and Git object IDs reject wrong length, case, and algorithms", () => {
  const artifact = validPayloads[4]!;
  assert.equal(artifact.kind, "artifact");
  for (const digest of [
    { algorithm: "sha256", value: "a".repeat(63) },
    { algorithm: "sha256", value: "A".repeat(64) },
    { algorithm: "md5", value: "a".repeat(32) },
  ]) {
    assertSubjectError(
      () => createSubject({ ...artifact, digest } as SubjectPayload),
      "digest",
    );
  }

  const repository = validPayloads[0]!;
  assert.equal(repository.kind, "repository-tree");
  assertSubjectError(
    () =>
      createSubject({
        ...repository,
        commit: { algorithm: "sha1", value: "a".repeat(39) },
      } as SubjectPayload),
    "commit",
  );
});

test("future subject schema versions produce an actionable reader error", () => {
  const subject = createSubject(validPayloads[2]!);
  assert.throws(
    () => parseSubjectJson(JSON.stringify({ ...subject, schemaVersion: "2.0.0" })),
    (error: unknown) => {
      assert.ok(error instanceof JsonDocumentError);
      assert.equal(error.code, "SCHEMA_UPGRADE_REQUIRED");
      assert.match(error.action, /Upgrade/);
      return true;
    },
  );
});

test("unknown subject fields are rejected instead of changing identity silently", () => {
  const subject = createSubject(validPayloads[3]!);
  assertSubjectError(
    () => parseSubject({ ...subject, untrackedMeaning: true }),
    "",
  );
});

function assertSubjectError(operation: () => unknown, path: string): void {
  assert.throws(operation, (error: unknown) => {
    assert.ok(error instanceof SubjectValidationError);
    assert.ok(
      error.issues.some(
        (issue) => issue.path === path || issue.path.startsWith(`${path}.`),
      ),
      `expected an issue under ${path || "the document root"}`,
    );
    return true;
  });
}
