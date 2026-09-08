# Verglos V1 traceability

| Capability | Contract | Backlog IDs | Tests required | Public state |
|---|---|---|---|---|
| Native JS/TS scan | command + observation | TRUTH-001, CONTRACT-001 | Current: 58 scanner tests in `packages/scanner/src/**/*.test.ts`; required: frozen detector fixtures and determinism | shipped; evidence: `VERGLOS_CLI_CAPABILITY_INVENTORY.md` |
| External evidence import | observation + adapter | IMPORT-001/002, ENGINES | SARIF/SBOM/VEX malformed and attribution fixtures | planned |
| Source-to-artifact identity | subject + lineage | TARGET-001, GRAPH-001 | digest mismatch/incomplete tests | planned |
| Release decision | policy decision | CONTRACT-002, POLICY | PASS/REVIEW/BLOCK/INCOMPLETE matrix | planned |
| Local viewer | command/UI contract | LOCAL epic | accessibility and export tests | planned |
| Hunt | agent safety + verification | AGENT/HUNT epic | Current: none; required: isolation, network, resource, verdict tests | partial shell; evidence: `packages/cli/src/hunt.ts`, `packages/hunt/src/index.ts` |
| Signed `.vgl` record | prove contract | PROVE epic | Current: none; hosted random-hash summary is not evidence; required: offline verification, tamper, redaction | planned; evidence: `VERGLOS_WEB_CAPABILITY_INVENTORY.md` |
| Monitoring | hosted data/ops | HOSTED/OPERATIONS | Current: 7 CLI management tests, 0 hosted tests; required: registration, idempotency, retry, advisory update, delivery | partial integration; evidence: both capability inventories |
| Plan enforcement | commercial contract | COMM/BILLING | Current: 25 CLI entitlement/JWT tests, 0 hosted tests; required: concurrency, modified CLI, overage | partial; evidence: both capability inventories |
| Pro/Team/Studio/Enterprise UI | dashboard contract | dashboard epics | authorization and role journeys | planned |
| Final acceptance | acceptance contract | POST-RC | frozen corpus and authorized POC | not-started |

Update this table with file paths, test names, and commit IDs as tasks ship.
