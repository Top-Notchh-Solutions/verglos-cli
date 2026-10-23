#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const backlogPath = process.env.VERGLOS_BACKLOG_PATH ?? resolve(root, "docs/shipping/VERGLOS_V1_BACKLOG.md");

export const APPSEC_HOLD_IDS = Object.freeze([
  "HUNT-008",
  "HUNT-009",
  "HUNT-010",
  "HUNT-011",
  "QUAL-CLI-004",
  "QUAL-CLI-006",
  "ENT-CLI-001",
  "DIST-001",
  "ACCEPT-002",
  "ACCEPT-007",
  "ACCEPT-013",
  "FINAL-WEB-004",
]);

export const NON_APPSEC_IMPLEMENTATION_IDS = Object.freeze([
  "STUDIO-CLI-001",
  "DIST-002",
  "DIST-003",
  "DIST-006",
  "QUAL-WEB-005",
  "QUAL-WEB-006",
  "ACCEPT-003",
  "ACCEPT-005",
  "ACCEPT-006",
  "ACCEPT-008",
  "ACCEPT-009",
  "ACCEPT-010",
  "ACCEPT-011",
  "ACCEPT-012",
  "ACCEPT-014",
  "FINAL-WEB-001",
  "FINAL-WEB-002",
  "FINAL-WEB-003",
  "FINAL-WEB-005",
  "FINAL-WEB-006",
  "FINAL-WEB-007",
  "FINAL-WEB-008",
]);

const APPSEC_GATE = "Arrange independent Hunt isolation/security review";
const CUSTOMER_GATE = "Supply authorized customer fixtures/repositories and consent for external acceptance";

function keyFor(rest) {
  const named = rest.match(/^\*\*([^*]+)\*\*/u);
  return named ? named[1].trim() : rest.replace(/\s+Evidence:.*$/u, "").replace(/[.]$/u, "").trim();
}

export function parseShippingBacklog(text) {
  const rows = [];
  for (const [index, line] of text.split(/\r?\n/u).entries()) {
    const match = line.match(/^- \[([ xX])\] (.+)$/u);
    if (!match) continue;
    rows.push({ line: index + 1, checked: match[1].toLowerCase() === "x", key: keyFor(match[2]), text: match[2] });
  }
  return rows;
}

function classify(row) {
  if (APPSEC_HOLD_IDS.includes(row.key) || row.key === APPSEC_GATE) return "appsec-dependent";
  if (NON_APPSEC_IMPLEMENTATION_IDS.includes(row.key) || row.key === CUSTOMER_GATE) return "non-AppSec";
  return "unmapped";
}

export function auditShippingBacklog(text) {
  const rows = parseShippingBacklog(text).map((row) => ({ ...row, classification: classify(row) }));
  const openRows = rows.filter((row) => !row.checked);
  const checked = rows.filter((row) => row.checked).length;
  const appSecOpen = openRows.filter((row) => row.classification === "appsec-dependent");
  const nonAppSecOpen = openRows.filter((row) => row.classification === "non-AppSec");
  const unmappedOpen = openRows.filter((row) => row.classification === "unmapped");
  const report = {
    schema: "verglos.private.shipping-backlog-audit.v1",
    source: "docs/shipping/VERGLOS_V1_BACKLOG.md",
    checked,
    open: openRows.length,
    total: rows.length,
    percent: Number((checked / rows.length * 100).toFixed(1)),
    openRows,
    partition: {
      appSecDependent: appSecOpen.map((row) => row.key),
      nonAppSec: nonAppSecOpen.map((row) => row.key),
      unmapped: unmappedOpen.map((row) => row.key),
      appSecDependentCount: appSecOpen.length,
      nonAppSecCount: nonAppSecOpen.length,
      unmappedCount: unmappedOpen.length,
      expectedAppSecDependentCount: 13,
      expectedNonAppSecCount: 22,
    },
    status: rows.length === 280 && checked === 245 && openRows.length === 35 && appSecOpen.length === 13 && nonAppSecOpen.length === 22 && unmappedOpen.length === 0 ? "passed" : "failed",
  };
  return report;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = auditShippingBacklog(readFileSync(backlogPath, "utf8"));
  process.stdout.write(`${JSON.stringify(report)}\n`);
  if (report.status !== "passed") process.exitCode = 1;
}
