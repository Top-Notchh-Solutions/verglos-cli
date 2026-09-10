import assert from "node:assert/strict";
import { test } from "node:test";
import { buildLineageGraph, LineageValidationError } from "./lineage-graph.js";
import { createSubject } from "./subject.js";

const source = createSubject({ kind: "artifact", digest: { algorithm: "sha256", value: "a".repeat(64) }, size: 1, mediaType: "application/octet-stream", path: "dist/app" });
const sbom = createSubject({ kind: "sbom", format: "cyclonedx-json", documentDigest: { algorithm: "sha256", value: "b".repeat(64) } });

test("lineage graph preserves deterministic nodes, edges, and gaps", () => {
  const graph = buildLineageGraph([sbom, source], [
    { fromSubjectId: sbom.subjectId, toSubjectId: source.subjectId, relation: "sbom-subject", evidenceRef: `sha256:${"d".repeat(64)}` },
    { fromSubjectId: source.subjectId, toSubjectId: "urn:verglos:subject:artifact:sha256:" + "c".repeat(64), relation: "artifact-output" },
  ]);
  assert.deepEqual(graph.nodes.map((node) => node.subjectId), [sbom.subjectId, source.subjectId].sort());
  assert.equal(graph.edges.find((edge) => edge.toSubjectId.endsWith("c".repeat(64)))?.status, "unavailable");
  assert.equal(graph.gaps.length, 1);
});

test("lineage validation bounds runtime declarations and deduplicates edges", () => {
  assert.throws(() => buildLineageGraph([source], [{ fromSubjectId: source.subjectId, toSubjectId: source.subjectId, relation: "unknown" as never }]), LineageValidationError);
  const graph = buildLineageGraph([source], [{ fromSubjectId: source.subjectId, toSubjectId: source.subjectId, relation: "build-output" }, { fromSubjectId: source.subjectId, toSubjectId: source.subjectId, relation: "build-output" }]);
  assert.equal(graph.edges.length, 1);
});

test("lineage mismatches remain explicit gaps", () => {
  const graph = buildLineageGraph([source], [{ fromSubjectId: source.subjectId, toSubjectId: source.subjectId, relation: "build-output", status: "mismatched" }]);
  assert.equal(graph.edges[0]?.status, "mismatched");
  assert.match(graph.gaps[0]!, /mismatches/);
});
