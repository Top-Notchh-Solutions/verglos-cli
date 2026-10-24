import assert from "node:assert/strict";
import test from "node:test";
import { auditShippingBacklog, parseShippingBacklog } from "./audit-shipping-backlog.mjs";

test("backlog parser preserves checked/open state and non-commit gate keys", () => {
  const rows = parseShippingBacklog("- [x] **A-001** · done\n- [ ] Arrange independent Hunt isolation/security review.\n");
  assert.deepEqual(rows.map(({ checked, key }) => ({ checked, key })), [
    { checked: true, key: "A-001" },
    { checked: false, key: "Arrange independent Hunt isolation/security review" },
  ]);
});

test("partition audit reports the documented 13/21 open split", () => {
  const text = [
    ...["HUNT-008", "HUNT-009", "HUNT-010", "HUNT-011", "QUAL-CLI-004", "QUAL-CLI-006", "ENT-CLI-001", "DIST-001", "ACCEPT-002", "ACCEPT-007", "ACCEPT-013", "FINAL-WEB-004"].map((id) => `- [ ] **${id}** · open`),
    ...["STUDIO-CLI-001", "DIST-002", "DIST-003", "DIST-006", "QUAL-WEB-005", "QUAL-WEB-006", "ACCEPT-003", "ACCEPT-006", "ACCEPT-008", "ACCEPT-009", "ACCEPT-010", "ACCEPT-011", "ACCEPT-012", "ACCEPT-014", "FINAL-WEB-001", "FINAL-WEB-002", "FINAL-WEB-003", "FINAL-WEB-005", "FINAL-WEB-006", "FINAL-WEB-007", "FINAL-WEB-008"].map((id) => `- [ ] **${id}** · open`),
    "- [x] **ACCEPT-005** · closed",
    "- [ ] Arrange independent Hunt isolation/security review.",
    "- [x] Supply authorized customer fixtures/repositories and consent for external acceptance.",
    ...Array.from({ length: 244 }, (_, index) => `- [x] **DONE-${index}** · done`),
  ].join("\n");
  const report = auditShippingBacklog(text);
  assert.equal(report.status, "passed");
  assert.deepEqual(report.partition.unmapped, []);
  assert.equal(report.partition.appSecDependentCount, 13);
  assert.equal(report.partition.nonAppSecCount, 21);
  assert.equal(report.checked, 246);
  assert.equal(report.open, 34);
});

test("partition audit fails when an open row is unmapped", () => {
  const report = auditShippingBacklog("- [ ] **UNKNOWN-001** · open\n");
  assert.equal(report.status, "failed");
  assert.deepEqual(report.partition.unmapped, ["UNKNOWN-001"]);
});
