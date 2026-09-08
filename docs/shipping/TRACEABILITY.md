# Verglos V1 traceability

| Capability | Contract | Backlog IDs | Tests required | Public state |
|---|---|---|---|---|
| Command/capability truth | truth registry | TRUTH-001/002/003 | inventories reconcile with code; every public phrase remains bounded | enforced in `VERGLOS_TRUTH_REGISTRY.md` at `6038545` |
| Native JS/TS scan | command + observation | TRUTH-001, CONTRACT-001 | Current: 58 scanner tests in `packages/scanner/src/**/*.test.ts`; required: frozen detector fixtures and determinism | shipped; evidence: `VERGLOS_CLI_CAPABILITY_INVENTORY.md` |
| External evidence import | observation + adapter | IMPORT-001/002, ENGINES | SARIF/SBOM/VEX malformed and attribution fixtures | planned |
| Source-to-artifact identity | subject + lineage | TARGET-001, GRAPH-001 | digest mismatch/incomplete tests | planned |
| Release decision | policy decision | CONTRACT-002, POLICY | PASS/REVIEW/BLOCK/INCOMPLETE matrix | planned |
| Local viewer | command/UI contract | LOCAL epic | accessibility and export tests | planned |
| Hunt | agent safety + verification | AGENT/HUNT epic | Current: none; required: isolation, network, resource, verdict tests | partial shell; evidence: `packages/cli/src/hunt.ts`, `packages/hunt/src/index.ts` |
| Signed `.vgl` record | prove contract | PROVE epic | Current: none; hosted random-hash summary is not evidence; required: offline verification, tamper, redaction | planned; evidence: `VERGLOS_WEB_CAPABILITY_INVENTORY.md` |
| Monitoring | hosted data/ops | HOSTED/OPERATIONS | Current: 7 CLI management tests, 0 hosted tests; required: registration, idempotency, retry, advisory update, delivery | partial integration; evidence: both capability inventories |
| Plan enforcement | commercial contract | TRUTH-004, COMM/BILLING | Current: 25 CLI entitlement/JWT tests, 0 hosted tests; required: catalog, migration, concurrency, modified CLI, overage | partial; authority/migration: `VERGLOS_PLAN_AND_CAPABILITY_RECONCILIATION.md` |
| Open-core boundary | ownership + license class | TRUTH-005, LIC | Package/feed inventory, modified-CLI server enforcement, license/notice classifier, signing-identity rotation | decided; inventory: `VERGLOS_OPEN_CORE_AND_COMMERCIAL_BOUNDARY.md` |
| Third-party compliance | dependency/asset inventory | TRUTH-006, LIC/DIST | Clean-store classifier, artifact notices/SBOM, copied-file provenance, external engine/schema/fixture records | partial; baseline: `VERGLOS_THIRD_PARTY_INVENTORY.md`; redistribution blockers open |
| Telemetry and privacy | consent + data-field registry | TRUTH-007, OPS-012, hosted/agent/record/security epics | Outbound-request inventory; canary leakage tests; consent/revoke; retention/deletion; SSRF/egress; credential/log redaction | partial; baseline: `VERGLOS_TELEMETRY_AND_PRIVACY_INVENTORY.md`; runtime gates open |
| Hosted usage and cost | immutable usage/reservation/cost ledger | TRUTH-008, HOSTED-009, PLAN-WEB-001/005-010, OPS-013 | Replay/reconciliation; concurrency/idempotency; 80/100 thresholds; overage consent; provider-invoice and privacy tests | planned; design: `VERGLOS_HOSTED_COST_AND_USAGE_LEDGER.md`; current COGS unknown |
| Pro/Team/Studio/Enterprise UI | dashboard contract | dashboard epics | authorization and role journeys | planned |
| Final acceptance | acceptance contract | POST-RC | frozen corpus and authorized POC | not-started |

Update this table with file paths, test names, and commit IDs as tasks ship.
