# Hunt/A2 contract-alignment audit — 2026-10-13

## Authority

This audit uses the approved active goal
`docs/shipping/VERGLOS_V1_ACTIVE_GOAL_REVISED-2026-10-07.md` and the private
feature matrix
`docs/shipping/FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md`.

The feature matrix is a cross-reference. The private backlog remains the only
source of checkbox state.

## Verified implementation truth

- Public CLI `main` is at `16fdafd814e0ee2d161243cf53d86a425075800e` after
  regular merge of PR #109.
- The public Hunt catalog contains 15 descriptors: eight A1 deterministic
  restricted-process probes and seven A2 pinned-Docker target-harness
  descriptors.
- The seven A2 families are SQL/NoSQL injection, command injection, path
  traversal, SSRF, Agent/MCP boundary, safe XSS, and authorization/tenant
  boundary.
- The A2 path has public sanitized reference harnesses, strict one-line
  verdict parsing, positive/negative/unsupported outcomes, direct timeout and
  adapter-failure outcomes, and an opt-in signed CLI execution path.
- The four Hunt architecture roles are controlled responsibilities in one
  bounded flow: Planner/Scout, Attack Worker, Proof Adjudicator, and Release
  Auditor. They are not four autonomous AI services.

Supporting evidence:

- `hunt-a2-target-code-qualification-pr106-2026-10-13.md`
- `hunt-a2-direct-outcomes-pr104-2026-10-13.md`
- `hunt-a2-cli-execution-pr107-2026-10-13.md`
- `hunt-recipe-catalog-provenance-2026-10-13.md`

## Documentation alignment

The public CLI and Web agent instructions contained stale alpha wording that
described Hunt only as an unimplemented shell and described `packages/hunt` as
a private scaffold. That wording contradicted the approved matrix and the
merged public A2 implementation. Public documentation alignment is being
handled in separate public-safe PRs. CLI PR #108 is merged as
`ae720bdf8b4d83cd34b0cb537c44a3dbcf3011e`, CLI PR #109 is merged as
`16fdafd814e0ee2d161243cf53d86a425075800e`, and Web PR #174 is merged as
`63de97be6b180c560ef06d9cbccb62eea20beb4a`. No private tracker, evidence,
secrets, deployment data, or customer data is copied into those repositories.

The corrected wording distinguishes:

1. implemented bounded A1/A2 technical paths;
2. remaining HUNT-008 through HUNT-011 acceptance gates; and
3. unsupported claims that must not be made, including autonomous AI attack
   services, general remote DAST, complete customer-code coverage, or a host
   isolation guarantee.

## Acceptance disposition

This audit changes no backlog checkbox. `HUNT-008` remains open for supported-
rule approval, provenance/licensing and release treatment, complete target-code
acceptance, hosted entitlement evidence, Linux/Docker adversarial qualification,
independent review, and final acceptance. `HUNT-009` through `HUNT-011` remain
dependent or separately gated as recorded in the backlog and blocker register.

The private tracker remains **228 checked / 52 unchecked / 280 total
(81.4%)**. No Production, provider, database, entitlement, npm, or customer
write occurred during this alignment audit.
