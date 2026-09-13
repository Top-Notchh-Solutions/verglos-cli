import assert from "node:assert/strict";
import { test } from "node:test";
import { parseTrivyFindings, parseTrivyJson, TrivyParseError } from "./trivy-parser.js";

test("Trivy parser normalizes vulnerability output and preserves raw digest", () => {
  const findings = parseTrivyJson(new TextEncoder().encode(JSON.stringify({ Results: [{ Target: "image", Vulnerabilities: [{ VulnerabilityID: "CVE-1", Severity: "HIGH", PkgName: "openssl", InstalledVersion: "1", FixedVersion: "2" }] }] })));
  assert.equal(findings.length, 1); assert.equal(findings[0]?.severity, "high"); assert.match(findings[0]?.rawEvidenceDigest ?? "", /^sha256:[a-f0-9]{64}$/);
});
test("Trivy parser rejects malformed, unsupported, and oversized output", () => {
  assert.throws(() => parseTrivyJson(new TextEncoder().encode("nope")), (e: unknown) => e instanceof TrivyParseError && e.code === "MALFORMED");
  assert.throws(() => parseTrivyJson(new TextEncoder().encode("{}")), (e: unknown) => e instanceof TrivyParseError && e.code === "UNSUPPORTED");
  assert.throws(() => parseTrivyJson(new Uint8Array(10), { maxBytes: 1 }), /exceeds/);
});

test("Trivy parser emits bounded misconfiguration and secret metadata without matched values or source snippets", () => {
  const raw = new TextEncoder().encode(JSON.stringify({ Results: [{ Target: "infra/main.tf", Misconfigurations: [{ ID: "AWS-0086", Title: "S3 public ACL", Severity: "HIGH", CauseMetadata: { StartLine: 3, Code: { Lines: [{ Content: "private fixture source" }] } } }], Secrets: [{ RuleID: "generic-api-key", Title: "Generic API Key", Severity: "HIGH", StartLine: 8, Match: "fixture-secret-value" }] }] }));
  const parsed = parseTrivyFindings(raw);
  assert.equal(parsed.findings.length, 2);
  assert.deepEqual(parsed.findings.map(({ kind, target, startLine }) => ({ kind, target, startLine })), [
    { kind: "misconfiguration", target: "infra/main.tf", startLine: 3 },
    { kind: "secret", target: "infra/main.tf", startLine: 8 },
  ]);
  assert.equal(JSON.stringify(parsed).includes("fixture-secret-value"), false);
  assert.equal(JSON.stringify(parsed).includes("private fixture source"), false);
});

test("Trivy parser counts unbound findings rather than treating them as clean coverage", () => {
  const parsed = parseTrivyFindings(new TextEncoder().encode(JSON.stringify({ Results: [{ Target: ".", Misconfigurations: [{ ID: "AWS-0001", Title: "No safe location", Severity: "LOW", CauseMetadata: { StartLine: 1 } }] }] })));
  assert.equal(parsed.findings.length, 0);
  assert.equal(parsed.omittedCount, 1);
});
