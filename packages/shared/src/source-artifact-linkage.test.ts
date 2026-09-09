import assert from "node:assert/strict";
import { test } from "node:test";
import { createSubject } from "./subject.js";
import { evaluateSourceArtifactLinkage } from "./source-artifact-linkage.js";

const source = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 1, mediaType: "text/plain" });
const artifact = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "b".repeat(64) }, size: 1, mediaType: "text/plain" });

test("linkage distinguishes matched and unavailable evidence", () => {
  assert.equal(evaluateSourceArtifactLinkage(source, artifact).status, "unavailable");
  assert.equal(evaluateSourceArtifactLinkage(source, artifact, { sourceSubjectId: source.subjectId, artifactSubjectId: artifact.subjectId, verifiable: true }).status, "matched");
});

test("linkage mismatch can never be treated as complete", () => {
  const result = evaluateSourceArtifactLinkage(source, artifact, { sourceSubjectId: artifact.subjectId, artifactSubjectId: artifact.subjectId, verifiable: true });
  assert.equal(result.status, "mismatched"); assert.notEqual(result.status, "matched");
});
