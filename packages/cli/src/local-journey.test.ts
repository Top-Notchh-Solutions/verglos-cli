import assert from "node:assert/strict";
import { test } from "node:test";
import { createSubject, createReleaseSnapshot, diffReleaseSnapshots, projectReleaseHeader } from "@verglos/shared";
import { renderLocalViewer } from "./viewer-renderer.js";

test("local boundary journey composes diff, header, and viewer without hosted dependencies", () => {
  const digest = (value: string) => ({ algorithm: "sha256" as const, value: value.repeat(64) });
  const subject = createSubject({ kind: "filesystem", treeDigest: digest("a"), ignorePolicyDigest: digest("b"), entryCount: 1 });
  const base = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [], lineage: { edges: [], gaps: [] }, policyInputs: { mode: "free" } });
  const head = createReleaseSnapshot({ primarySubject: subject, subjects: [subject], observations: [{ fingerprint: `sha256:${"c".repeat(64)}`, producerIds: ["native"], payloads: [], disagreement: false }], lineage: { edges: [], gaps: [] }, policyInputs: { mode: "free" } });
  const diff = diffReleaseSnapshots(base, head); assert.deepEqual(diff.added, [`sha256:${"c".repeat(64)}`]);
  const header = projectReleaseHeader({ decision: "INCOMPLETE", subjects: [{ subjectId: subject.subjectId, role: "primary" }], policy: { id: "p", version: "1.0.0", digest: digest("d") }, generatedAt: "2026-09-09T00:00:00Z", limitations: ["preparatory"], signerStatus: "unknown" } as any);
  assert.match(renderLocalViewer(header), /Release decision/);
});
