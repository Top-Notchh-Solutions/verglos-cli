# Verglos V1 traceability

| Capability | Contract | Backlog IDs | Tests required | Public state |
|---|---|---|---|---|
| Command/capability truth | truth registry | TRUTH-001/002/003 | inventories reconcile with code; every public phrase remains bounded | enforced in `VERGLOS_TRUTH_REGISTRY.md` at `6038545` |
| Schema/version foundation | `VERGLOS_SCHEMA_VERSION_AND_CANONICAL_JSON.md` | CONTRACT-001 | 9 shared tests: ID/version grammar, compatibility, deterministic canonicalization, non-JSON rejection, byte/structure limits, redacted parse errors, legacy mapping, actionable upgrade | implemented at `84d3921`; domain validators remain CONTRACT-002-012 |
| Immutable subject identity | `VERGLOS_SUBJECT_CONTRACT.md` | CONTRACT-002 | 13 subject tests: seven kinds, ID recomputation, dirty worktree, missing digest, mutable OCI tag, mirror equivalence, registry/platform/path/digest bounds, version/unknown-field rejection | implemented at `1bc2b1b`; resolvers and mismatch-to-INCOMPLETE remain TARGET-001-010/CONTRACT-008 |
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
| Hosted data migration | tenant/application/subject/evidence migration map | TRUTH-009, HOSTED-001-013 | Clean schema; idempotent backfill; shadow parity; tenant negatives; old-client matrix; restore/rollback | planned; baseline: `VERGLOS_DATA_AND_SCHEMA_MIGRATION_INVENTORY.md`; no destructive migration authorized |
| CLI compatibility | current command/process contract | TRUTH-010, CONTRACT/AGENT/HUNT/RECORD/PLAN-CLI/DIST | One isolated process fixture per current command plus root/watch/MCP; artifact/config readers; old CLI/server matrix | partial; baseline: `VERGLOS_COMMAND_COMPATIBILITY_INVENTORY.md`; direct process coverage absent |
| V1 architecture | modular monolith/workers + producer/data/signing boundaries | TRUTH-011, all implementation epics | Engine exit; tenant negatives; migration/restore; queue/object failure; usage concurrency; signing trust separation | decided; governing set: `VERGLOS_ARCHITECTURE_DECISION_SET.md`; provider selections deferred |
| Risk governance | owned trigger/mitigation/rollback/gate register | TRUTH-012, all implementation/release gates | Risk-specific executable evidence; blocker review; residual acceptance expiry/reversal | active; 39 risks in `RISKS.md`; seven immediate release blockers |
| Regression baseline | exact CLI/web commits and supported runtimes | TRUTH-013, every implementation task | Fresh CLI test/typecheck/build; Node-22 web typecheck/build; post-run drift | passed at `bd1d394`/`5044e77`; evidence: `VERGLOS_BASELINE_VERIFICATION.md`; coverage gaps remain |
| Pro/Team/Studio/Enterprise UI | dashboard contract | dashboard epics | authorization and role journeys | planned |
| Final acceptance | acceptance contract | POST-RC | frozen corpus and authorized POC | not-started |

Update this table with file paths, test names, and commit IDs as tasks ship.
