import assert from "node:assert/strict";
import { test } from "node:test";
import { parseTrivyJson, TrivyParseError } from "./trivy-parser.js";

test("Trivy parser normalizes vulnerability output and preserves raw digest", () => {
  const findings = parseTrivyJson(new TextEncoder().encode(JSON.stringify({ Results: [{ Target: "image", Vulnerabilities: [{ VulnerabilityID: "CVE-1", Severity: "HIGH", PkgName: "openssl", InstalledVersion: "1", FixedVersion: "2" }] }] })));
  assert.equal(findings.length, 1); assert.equal(findings[0]?.severity, "high"); assert.match(findings[0]?.rawEvidenceDigest ?? "", /^sha256:[a-f0-9]{64}$/);
});
test("Trivy parser rejects malformed, unsupported, and oversized output", () => {
  assert.throws(() => parseTrivyJson(new TextEncoder().encode("nope")), (e: unknown) => e instanceof TrivyParseError && e.code === "MALFORMED");
  assert.throws(() => parseTrivyJson(new TextEncoder().encode("{}")), (e: unknown) => e instanceof TrivyParseError && e.code === "UNSUPPORTED");
  assert.throws(() => parseTrivyJson(new Uint8Array(10), { maxBytes: 1 }), /exceeds/);
});
