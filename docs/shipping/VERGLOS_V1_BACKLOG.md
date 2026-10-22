# Verglos V1 master execution backlog

## 2026-10-22 · Web PR #240 security-header implementation

Web PR #240 merged normally as `f20dc426e310557a7693d1e2e18f693663943ce5`
with a route-wide CSP/security-header baseline and regression coverage. Header
contract **2/2**, typecheck, build (**49/49** pages/routes), public contracts,
and hosted checks **8/8** passed. The merged-head owner-controlled scan exited
0 with 21 findings, score 75/medium, and no D5-004 finding. This is code-side
progress only; keep QUAL-WEB-006 and ACCEPT-005 open for their stated human,
external, field, customer, independent, and final gates. Score remains **239
checked / 41 open / 280 total (85.4%)**. Nothing was deleted. Evidence:
`docs/shipping/evidence/accept-005-web-security-headers-pr240-2026-10-22.md`.

## 2026-10-22 · Web PR #241 public-proof URL boundary

Web PR #241 merged normally as `02f5aba95c4172255cc522730c6ffecc1598cbda`
with explicit public proof URL validation and direct regression coverage. URL
tests **3/3**, public release smoke **4/4**, typecheck, build (**49/49**), and
hosted checks **8/8** passed. The exact merged-head owner-controlled scan
exited 0 with 20 findings, score 81/medium, and no AUTH-003 or D5-004 finding.
This is code-side progress only; keep FINAL-WEB-006, QUAL-WEB-006, and ACCEPT-005
open for their stated human, external, field, customer, independent, and final
gates. Score remains **239 checked / 41 open / 280 total (85.4%)**. Nothing was
deleted. Evidence:
`docs/shipping/evidence/accept-005-web-public-proof-url-pr241-2026-10-22.md`.

## 2026-10-22 · QUAL-WEB-005 local isolated qualification

Web merged head `67f8f89` passed deletion request/worker integrations **2/2**,
adjacent tenant/receipt PostgreSQL integrations **2/2**, 43 ordered
migrations, Drizzle schema check, and typecheck against local PostgreSQL 15
`verglos_test`. The remote Neon URL was not used; the local container was
stopped without removal. Keep the `QUAL-WEB-005` checkbox unchanged for
legal/consent, customer-held-record, Production migration,
restore/rollback, reconciliation, and independent acceptance. Score remains
**239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-005-local-isolated-qualification-2026-10-22.md`.

## 2026-10-22 · STUDIO-CLI-001 merged-head focused recheck

The current merged CLI/Web heads requalified the repository-owned Studio
projection/custody contract: CLI admission **5/5**, CLI upload **6/6**, Web
projection, route-contract, tenant-leakage, and Studio E2E scenarios all
passed with zero failures, and the isolated PostgreSQL route integration
passed **1/1** on local PostgreSQL 15 `verglos_test`. The remote Neon URL was
not used; the local qualification container was stopped without removal. Keep
the `STUDIO-CLI-001` checkbox unchanged for authorized independent
recipient/customer acceptance and hosted/audit evidence. Score remains **239
checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/studio-cli-001-merged-head-focused-recheck-2026-10-22.md`.

## 2026-10-22 · FINAL-WEB-007 landing viewport implementation

Web commit `5a22c46` fixes the landing qualifier's valid desktop/mobile
pairing boundary by evaluating each measurement independently while retaining
strict duplicate path/viewport and coverage checks. PR #238 merged normally as
`67f8f89be193dff7053d0abd946b288301bf2b87`; source branch remains preserved.
Landing qualification **4/4**, typecheck, direct Web **895/919** with 24 skips
and 0 failures; merged verifier CLI **311/313**, Web **951/981**, composed
**75/75**, all **12/12** stories, zero failures. The merge-time read was
queued/in progress; a subsequent 2026-10-22 poll reports all Protocol/client
Ubuntu/macOS/Windows, typecheck-and-schema, isolated PostgreSQL, GitGuardian,
and Vercel checks successful. This
advances code-side implementation only; keep the `FINAL-WEB-007` checkbox
unchanged for browser-produced six-path capture, human screen-reader,
supported-environment/field-CWV, and final acceptance. `TEST_DATABASE_URL`
was not used; no file, branch, record, deployment, provider, customer,
database, or release artifact was deleted or changed. Score remains **239
checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/final-web-007-landing-viewport-boundary-pr238-2026-10-22.md`.

## 2026-10-22 · ENT-CLI-001 private-runner lifetime implementation

CLI commit `1965e3eb` and Web commit `bafac8a` enforce the hosted 30-minute
maximum signed private-runner job lifetime at shared admission and transport
schema boundaries. PR #166 merged normally as
`1d7844bd0fcfa4415e2c9462f9b5fb5293326915`; PR #237 merged normally as
`baf59ca9b6cb12bffa44eca53bc4645fba92ced3`; source branches remain preserved.
CLI typecheck **14/14**, full tests **13/13**, build **8/8**, Web focused
transport **4/4**, typecheck, direct Web **895/919** with 24 skips and 0
failures; merged verifier CLI **311/313**, Web **951/981**, composed **75/75**,
all **12/12** stories, zero failures. The merge-time read was
queued/in progress; a subsequent 2026-10-22 poll reports all PR #166 checks
successful across Ubuntu/macOS/Windows × Node 20/22/24, Verglos self-scan,
official validators, and in-toto release binding. This advances code-side
implementation only; keep the `ENT-CLI-001` checkbox unchanged for provider
qualification, customer/recipient acceptance, independent review, and final
release sign-off. `TEST_DATABASE_URL` was not used; no file, branch, record,
deployment, provider, customer, database, or release artifact was deleted or
changed. Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/ent-cli-001-private-runner-lifetime-pr166-pr237-2026-10-22.md`.

## 2026-10-22 · DIST-003 release-origin metadata output implementation

CLI commit `7ef8f1f0d4b29766d75623884b00cd524e3d29e1` makes release-origin
generation reject a symlinked/non-regular `RELEASE_METADATA.json` and use
no-follow output opening where supported. PR #165 merged normally as
`ecda0aec8441b0afe21f9e12a476bb964bc36ccc`; the source branch remains
preserved. Focused release contracts passed **13/13**, typecheck **14/14**,
build **8/8**, full CLI tests **13/13**, and the merged-head verifier passed
CLI **311/313**, Web **951/981**, composed substrates **75/75**, and all
**12/12** stories with zero failures. GitHub jobs were queued at final status
read and are not claimed as passed. Keep `DIST-003` unchecked for trusted
publication, immutable attestation, legal/license clearance, independent
review, and final acceptance. No `TEST_DATABASE_URL` was used and no file,
branch, record, deployment, provider, customer, database, or release artifact
was deleted or changed. Score remains **239 checked / 41 open / 280 total
(85.4%)**. Evidence:
`docs/shipping/evidence/dist-003-origin-manifest-boundary-pr165-2026-10-22.md`.

## 2026-10-22 · QUAL-CLI-006 trusted-root Sigstore validation implementation

CLI commit `b115446dc670d2d2dbfca803a51a7d908615020c` fixes the standard
validation mode boundary so trusted-root Sigstore verification does not require
an unrelated offline public-key fixture. PR #164 merged normally as
`84a72398d584b8c4522868e65a15f716d08363b3`; the source branch remains
preserved. Focused release contracts passed **18/18**, typecheck **14/14**,
build **8/8**, full CLI tests **13/13**, and the merged-head verifier passed
CLI **311/313**, Web **951/981**, composed substrates **75/75**, and all
**12/12** stories with zero failures. GitHub macOS Node 22 passed; remaining
hosted jobs were queued/in progress at final status read and are not claimed as
passed. Keep `QUAL-CLI-006` unchecked for trusted keyless identity,
protected publication, legal/license clearance, independent review, and final
acceptance. No `TEST_DATABASE_URL` was used and no file, branch, record,
deployment, provider, customer, database, or release artifact was deleted or
changed. Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-cli-006-trusted-root-sigstore-pr164-2026-10-22.md`.

## 2026-10-22 · QUAL-WEB-006 measurement-boundary implementation

Web commit `ad05d2f7e9ce846c1f036740adf3b6fe4a4a7b21` makes the shared
accessibility/performance qualifier reject invalid or duplicate page paths and
malformed runtime accessibility findings. PR #236 merged normally as
`dc8f4442df294558eb4d4cbcc1e9f39abeedcb16`; its source branch remains
preserved. Focused coverage passed **21/21**, typecheck passed, direct Web
tests passed **895/919** with 24 explicit skips and 0 failures, and the merged
verifier passed CLI **311/313**, Web **951/981**, composed substrates **75/75**,
and all **12/12** stories with zero failures. Vercel Preview Comments and
GitGuardian passed; required Web workflow jobs were queued at the final
merge/status read and are not claimed as passed.

This advances code-side implementation only; keep the `QUAL-WEB-006` checkbox
unchanged for authenticated dashboard runtime, human screen-reader review,
large-dataset qualification, complete field-CWV evidence, independent review,
and final acceptance. No database URL or external operation was used, and no
file, branch, record, deployment, provider, customer, database, or release
artifact was deleted or changed. Score remains **239 checked / 41 open / 280
total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-006-measurement-boundary-pr236-2026-10-22.md`.

## 2026-10-22 · QUAL-WEB-005 deletion-worker boundary implementation

Web commit `5fa3b6dbb277e71df5e1560e445c086fd044e830` validates runtime
account-deletion `requestedKinds` against the fixed hosted inventory before a
job is claimed. PR #235 merged normally as
`d0f8749f4365e2d07c4484f20adc91acc76baa8a`; its source branch remains
preserved. Focused coverage passed **21/21**, typecheck passed, and the full
Web suite passed **950/980** with 30 explicit skips and 0 failures. Vercel
Preview and GitGuardian passed; required Web workflow jobs were queued at the
final merge/status read and are not claimed as passed. The merged-head verifier
passed CLI **311/313**, Web **950/980**, composed substrates **74/74**, and all
**12/12** stories with zero failures.

This advances code-side implementation only; keep the `QUAL-WEB-005` checkbox
unchanged for isolated authenticated deletion E2E, legal/customer-held-record
decisions, consent/retention, migration, restore/rollback, independent review,
and final acceptance. The supplied remote test DB URL was not used because the
integration harness requires isolated local/CI `verglos_test`; it failed closed
before connecting. No remote database, Production, provider, customer, legal,
or deletion operation occurred, and no file, branch, record, deployment,
provider, customer, database, or release artifact was deleted or changed.
Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-005-worker-kind-boundary-pr235-2026-10-22.md`.

## 2026-10-22 · DIST-001 package-contents boundary implementation

CLI commit `78b41f80bb10e133ad7540b5104397186260cd48` removes the source-only
`fixtures` path from the `@verglos/shared` public package allowlist and makes
the package-surface audit require each declared safe path to be present in the
packed archive. PR #163 merged normally as
`06c7897525caf499f5128ef0d98f866c17387018`; its source branch remains
preserved. Focused contracts passed **14/14**, release contracts **40/40**,
seven-package contents and public-boundary audits passed, rollback rehearsal
passed across **5** boundaries preserving **2** historical records, and the
forced CLI graph passed **23/23**. The merged-head verifier passed CLI
**311/313**, Web **950/980**, composed substrates **74/74**, and all **12/12**
stories with zero failures. Hosted PR #163 checks were queued at the final
status read and are not claimed as passed.

This advances code-side implementation only; keep the `DIST-001` checkbox
unchanged for remaining LOCAL/HUNT/RECORD dependencies, trusted/protected
publication, immutable attestation, legal/license clearance, and final
acceptance. No test database URL or external operation was used, and no file,
branch, record, deployment, provider, customer, database, or release artifact
was deleted or changed. Score remains **239 checked / 41 open / 280 total
(85.4%)**. Evidence:
`docs/shipping/evidence/dist-001-package-contents-boundary-pr163-2026-10-22.md`.

## 2026-10-22 · ENT-CLI-001 result-acknowledgement implementation

CLI commit `e72e83f40ce0b1137795c945c35ea8c5354e2645` hardens private-runner
upload response validation for canonical result digests and boolean
idempotency, with a malformed-response regression test. PR #162 merged
normally as `a6ca411c012e319e434e667d5d50c384455f53ff`; its source branch
remains preserved. Focused coverage passed **11/11**; the forced CLI workspace
graph passed **23/23**; the merged-head verifier passed CLI **311/313** with 2
explicit skips, Web **950/980** with 30 explicit skips, composed substrates
**74/74**, and all **12/12** stories with zero failures. The hosted Platform
Matrix workflow concluded successfully.

This advances code-side implementation only; keep the `ENT-CLI-001` checkbox
unchanged for operational enrollment credential exchange, approved enterprise
runner execution/result reconciliation, cross-platform operational acceptance,
independent review, and enterprise acceptance. No database URL or external
operation was used, and no file, branch, record, deployment, provider,
customer, database, or release artifact was deleted or changed. Score remains
**239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/ent-cli-001-reconciliation-pr162-2026-10-22.md`.

## 2026-10-22 · STUDIO-CLI-001 approval-shape implementation

CLI commit `0d566b8017ff9b576e3551a7528cc89ac1e91265` adds a fail-closed
approval-shape guard to client-projection upload admission and regression
coverage for malformed approval JSON. PR #161 merged normally as
`613eb22b5601eaead153105cc9de7ebbb7802fff`; the source branch remains
preserved. Focused coverage passed **5/5**, the forced CLI workspace graph
passed **23/23**, hosted checks passed **12/12**, and the current-head private
verifier passed CLI **310/312**, Web **950/980**, composed substrates **74/74**,
and all **12/12** stories with zero failures.

This advances code-side implementation only; keep the `STUDIO-CLI-001`
checkbox unchanged for the numeric paid/non-production hosted allowance and
authorized Studio recipient/customer acceptance with hosted/audit evidence. No
`TEST_DATABASE_URL` or external operation was used, and no file, branch,
record, deployment, provider, customer, database, or release artifact was
deleted or changed. Score remains **239 checked / 41 open / 280 total
(85.4%)**. Evidence:
`docs/shipping/evidence/studio-cli-001-approval-shape-pr161-2026-10-22.md`.

## 2026-10-22 · ACCEPT-002/003 latest merged-head substrate refresh

The frozen verifier ran against clean CLI `6ae6a2a5` / PR #160 merge
`56b3535a` and Web `e1b20ac` / PR #234 merge `b640b7fb`: CLI **310/312** with
2 explicit skips and 0 failures, Web **950/980** with 30 explicit skips and 0
failures, composed substrates **74/74**, and all **12/12** stories executed;
exit 0. No `TEST_DATABASE_URL` or external operation was used. The additive
acceptance bundle contains **31** hashed files and passed its secret scan;
prior bundles remain preserved. Keep `ACCEPT-002/003` unchecked for
external/hosted/provider/customer/reviewer gates. Score remains **239 checked /
41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/accept-002-003-current-head-pr160-pr234-2026-10-22.md`.

## 2026-10-22 · FINAL-WEB-007 landing accessibility implementation and PR #234

Web commit `e1b20ac` adds a homepage skip link/main target, labelled primary
navigation, and consistent focus-visible styling with a regression contract.
PR #234 merged normally as `b640b7fb8492bdf851dbde339be5841e7fdd7232`; the
source branch remains preserved. Focused qualification passed **26/26**; the
serial Web suite passed **894/918** with **24 explicit skips / 0 failures**;
typecheck, landing **4/4**, public smoke (**16 routes / 22 of 22 claims / 2
proof assets / 0 issues**), hosted typecheck/schema/build `39786209955`,
isolated PostgreSQL/protocol `39786210113`, all three protocol platforms,
GitGuardian, and Vercel Preview passed. This advances code-side implementation
only; keep `FINAL-WEB-007` unchecked for browser-produced six-path capture,
human screen-reader, supported-environment/field-CWV, and final acceptance.
No Production, customer, payment, provider, or remote database state changed;
no file, branch, record, deployment, or release artifact was deleted. The
additive acceptance bundle contains **29** hashed files and passed its secret
scan; prior bundles remain preserved. Score remains **239 checked / 41 open /
280 total (85.4%)**. Evidence:
`docs/shipping/evidence/final-web-007-landing-accessibility-pr234-2026-10-22.md`.

## 2026-10-22 · ACCEPT-002/003 refresh after merged PR #158

The verifier reran against the clean PR #158 implementation tree
`e44ce8a673fb1d9119a3231f896d0f86a00cdc3c` (merged normally as
`145ff5d902289ecfb670a397c9e87860eb06309d`) and Web
`d32da250d5c2427dcfa36f560421a2506bb8a659`. CLI passed **310/312** with 2
explicit skips / 0 failures, Web passed **949/979** with 30 explicit skips / 0
failures, composed substrates passed **74/74**, and all **12/12** story mappings
executed. The additive final bundle hashes **27** evidence files and passes its secret
scan. No database URL or external operation was used; previous bundles remain
preserved. Keep `ACCEPT-002/003` unchecked for external/hosted/provider/
customer/reviewer gates. Score remains **239 checked / 41 open / 280 total
(85.4%)**. Evidence:
`docs/shipping/evidence/accept-002-003-current-head-pr158-pr159-pr233-2026-10-22.md`.

## 2026-10-22 · ACCEPT-002/003 exact-head substrate refresh for PR #159/#233

The private verifier reran against clean CLI commit
`9fba66ac386605174a98bea856b9f04ceda8cfa8` and Web commit
`d32da250d5c2427dcfa36f560421a2506bb8a659`. CLI passed **310/312** with **2
explicit skips / 0 failures**, Web passed **949/979** with **30 explicit skips /
0 failures**, and composed Studio/Enterprise/Team/quality substrates passed
**74/74**; all **12/12** stories executed, exit 0. The new private bundle hashes
**25** evidence files and its secret scan passed. No database URL was supplied;
no database/provider/customer/production operation occurred; no previous bundle
was removed or overwritten. Keep `ACCEPT-002` and `ACCEPT-003` unchecked for
external/hosted/provider/customer/reviewer gates. Score remains **239 checked /
41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/accept-002-003-current-head-pr159-pr233-2026-10-22.md`.

## 2026-10-22 · DIST-002 exact release-tag commit binding

CLI commit `9fba66ac386605174a98bea856b9f04ceda8cfa8` and PR #159 merged
normally as `285193a58be2c431fd5da865829d0fde08a9eb04`. The publish workflow now
resolves `GITHUB_REF` to an exact commit and requires equality with
`GITHUB_SHA` before release preparation/publication; malformed and mismatched
SHA cases are covered by regression and workflow-contract tests. Focused
release contracts passed **12/12**; workspace typecheck **14/14 tasks**;
workspace tests **13/13 tasks**; build **8/8 tasks**; hosted Platform matrix
`39778965080` passed **9/9**; self-scan `39778965079`, in-toto binding
`39778965080`, and standard/provenance validation `39778965118` passed. No npm
publication, registry/provider state, database, customer, or deployment state
changed; no file, branch, record, or deployment was deleted. Keep `DIST-002`
unchecked for protected environment authorization, legal/license clearance,
trusted-publisher review, and an actual immutable publication/attestation
event. Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/dist-002-tag-commit-binding-pr159-2026-10-22.md`.

## 2026-10-22 · FINAL-WEB-008 public truth and release smoke hardening

Web commit `d32da250d5c2427dcfa36f560421a2506bb8a659` and PR #233 merged
normally as `065c84510df147dc72955310a599413cf375be63`. The public release
smoke now covers `robots.ts` and `sitemap.ts`, validates required machine
readable tokens, rejects duplicate/malformed route-manifest entries, and
uploads valid JSON by using `pnpm --silent` in Verify. Local smoke passed with
**16 routes / 20 source files / 0 issues / 22 of 22 publishable claims / 2
proof assets**; public-smoke plus landing qualification passed **8/8**;
truth-registry passed **35/35**; typecheck, diff check, Verify web
`39778264795`, and Private runner qualification `39778264796` passed. No
database was connected or modified, and no file, branch, record, or deployment
was deleted. Keep `FINAL-WEB-008` unchecked for final acceptance and
release-gate reconciliation/go-no-go evidence. Score remains **239 checked / 41
open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/final-web-008-public-truth-smoke-pr233-2026-10-22.md`.

## 2026-10-22 · QUAL-WEB-006 table semantics implementation

Web commit `e05bcdc26f5332d4806f0c286b9233b406a19103` and PR #232 merged
normally as `4ad87bd9e0f954bef1a238755aa8f1fbba54970c`. The selected account,
dashboard, landing, and docs tables now expose captions and explicit header
scope semantics, including a capability row header, with a contract test for
the required structure. Focused accessibility contracts passed **9/9**; the
full Web suite passed **893 passed / 24 explicit skips / 0 failures** across
**917 tests**; typecheck, diff check, Verify web `39771570775`, and Private
runner qualification `39771570791` passed. No database was connected or
modified, and no file, branch, record, or deployment was deleted. Keep
`QUAL-WEB-006` unchecked for human screen-reader, paid/organization,
large-dataset, supported-browser, field-performance, and
independent/customer acceptance. Score remains **239 checked / 41 open / 280
total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-006-table-semantics-pr232-2026-10-22.md`.

## 2026-10-22 · QUAL-WEB-005 digest-inventory preflight repair

Web commit `2b4e202b303d74129342ffdd4622f3d9c4c7c7f1` and PR #231 merged
normally as `f61f15e8046969952bb7f700ea934683bf6b4281`. The reviewed deletion
worker now blocks malformed customer-held digest inventory before any
destructive adapter call. Focused worker/deletion checks passed **16/16**; the
full Web suite passed **893/893** with **24 explicit skips**; typecheck, diff
check, and all named hosted checks passed. No database was connected or
modified. Keep `QUAL-WEB-005` unchecked for legal/consent, production
authorization, restore/rollback, reconciliation, and independent acceptance.
Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-005-digest-inventory-preflight-pr231-2026-10-22.md`.

## 2026-10-22 · QUAL-WEB-005 digest-registration/deletion lock repair

Web commit `bac88808473cf90730810347d5ced0c2df8b4699` and PR #230 merged
normally as `38635e52bb2ce9db5b1804986c12ef9d7b897f15`. Customer-held digest
registration and deletion-request creation now share the user-scoped advisory
lock used by the reviewed worker; duplicate registrations remain idempotent,
while new digest mutations are rejected once deletion is pending. Focused
privacy/deletion contracts passed **15/15**; the full Web suite passed
**893/893** with **24 explicit skips**; typecheck, diff check, Verify run
`39767070146`, and Private runner qualification run `39767070242` passed. The
remote Neon URL in the owner-provided test environment was refused as not an
isolated `verglos_test` target, so no destructive integration test or database
write was performed. Keep `QUAL-WEB-005` unchecked for its remaining
legal/consent, production authorization, restore/rollback, reconciliation, and
independent acceptance gates. Score remains **239 checked / 41 open / 280
total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-005-digest-registration-deletion-lock-pr230-2026-10-22.md`.

## 2026-10-21 · STUDIO-CLI-001 current-head tenant-boundary repair

Web commit `cb2302179533a7bc73eccbcb17b0c350685cc5cc` repairs the real
tenant-boundary defect found in the Studio client-workspace route. The
centralized authorized capability result now carries the commercial plan; the
route consumes its numeric Studio allowance, fails closed when the plan is
unavailable, and no longer imports raw `getDb()`. Focused tests passed **41/41**;
the full suite passed **893/893** with **24 explicit skips**; typecheck,
schema/migration checks, diff check, and a fresh detached build generating
**49/49** pages passed.

This is implementation qualification only. Keep `STUDIO-CLI-001` unchecked
for the approved numeric paid/non-production hosted allowance and authorized
recipient/customer acceptance with hosted/audit evidence. No checkbox changed;
score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/studio-cli-001-current-head-tenant-scope-repair-2026-10-21.md`.

## 2026-10-21 · QUAL-CLI-006 current-head archive/provenance qualification

Clean CLI merge `72190acae81b454a4a88a0ea8d222c8981ac9a3f` was freshly built
and packaged. Build **8/8**, typecheck **14/14**, official in-toto 3.0.0
verification **7/7**, clean-consumer installation, and upgrade/rollback
`1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` passed. This is local evidence with
ephemeral provenance keys; hosted exact-head matrix, trusted keyless identity,
protected publication, legal, independent review, customer evidence, and final
acceptance remain open. The local rollback/revocation rehearsal passed exit
**0** across five bounded operations and preserved two historical records; no
provider or registry call occurred. No checkbox changed; score remains **239 checked / 41
open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-cli-006-standard-validation-contract-2026-10-21.md`.

## 2026-10-21 · QUAL-CLI-006 local official-validator qualification

The clean CLI merge `72190acae81b454a4a88a0ea8d222c8981ac9a3f` was rerun
against the disposable standard-validation artifact root with temporary
Temurin OpenJDK JRE 17.0.20.1 and the workflow-pinned SPDX Tools 2.0.7 JAR.
Strict validation passed **4/4**, exit **0**, for SARIF, CycloneDX, SPDX, and
offline Cosign. The local tool-integration slice is complete, but the row
remains unchecked for trusted keyless release identity, protected publication,
legal clearance, independent review, hosted/customer evidence, and final
acceptance. No checkbox changed; the live score remains **239 checked / 41
open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-cli-006-standard-validation-contract-2026-10-21.md`.

## 2026-10-21 · DIST-002 latest Sigstore remediation check

A disposable exact-`sigstore@5.0.0` experiment against CLI merge
`72190acae81b454a4a88a0ea8d222c8981ac9a3f` passed the workspace build **8/8**
and license inventory tests **6/6** after the documented cross-platform
install. The strict `--require-clear` gate still exited **2** for the bundled
benchmark/fast-uri conflict and six BlueOak reviews. Sigstore 5 requires Node
`^22.22.2 || ^24.15.0 || >=26.0.0`, which does not preserve the current Node
`>=20` contract. The experiment was discarded; no checkbox changed. Keep
`DIST-002` open for legal/license clearance, protected trusted publication,
DIST-001, and immutable publication/attestation. Evidence:
`docs/shipping/evidence/dist-002-sigstore5-remediation-check-2026-10-21.md`.

## 2026-10-21 · FINAL-WEB-007 six-path audit and source remediation

The read-only six-path production browser audit found concrete deployed public
surface issues on `/docs`, `/proof`, `/verify`, and `/checkout`. Web commit
`70f69de` repairs the source contracts for accessible table headers, contrast,
checkout metadata/noindex, and interaction-deferred Razorpay loading, with a
focused regression test. Current-source qualification passed truth-registry
**35/35**, landing **4/4**, public-release-smoke **2/2**, actual smoke **16
routes / 22/22 claims / 2 assets / 0 issues**, typecheck, and diff check. A
fresh detached worktree build also passed with successful compilation,
lint/type validation, and **49/49** static pages. The earlier source-worktree
build failure was limited to Next workspace-root inference through the
unrelated dirty parent `package.json`.

Do not check FINAL-WEB-007: no deployment was initiated; exact Preview,
deployed requalification, actual INP/field-CWV, human/supported-environment,
and final acceptance evidence remain open. Keep FINAL-WEB-008 open for its
dependent release gates. No checkbox changed; score remains **239 checked / 41
open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/final-web-007-six-path-browser-audit-2026-10-21.md`.

## 2026-10-21 · FINAL-WEB-007/008 current-source qualification

The clean Web source `a3819c1` passed truth-registry **34/34**, landing-release
contract **4/4**, public-release-smoke contract **2/2**, and actual public
smoke **16 routes / 22/22 publishable claims / 2 proof assets / 0 issues**.
This is implementation and source qualification only. Keep `FINAL-WEB-007`
unchecked for browser-produced capture, human screen-reader, supported
environment, and field-CWV evidence; keep `FINAL-WEB-008` unchecked for its
FINAL-WEB/ACCEPT final-release dependencies. No checkbox changed. Score
remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/final-web-007-008-current-source-qualification-2026-10-21.md`.

## 2026-10-21 · FINAL-WEB-007 production browser lab audit

The existing Chrome tab audited public production read-only. Lighthouse passed
desktop **61/61** and mobile **60/60**, all four audited categories were
**100/100**, and cold Fast-4G/4×CPU traces measured LCP **727/594 ms** with
CLS **0.00/0.00**. Keep `FINAL-WEB-007` unchecked: the exact Preview is
protected, CrUX is unavailable, and the six-path browser capture, human/field
evidence, and final acceptance remain open. Evidence:
`docs/shipping/evidence/final-web-007-production-browser-audit-2026-10-21.md`.

## 2026-10-21 · STUDIO-CLI-001 clean-head qualification

The exact Web commit `62a54b52043143758fe01c6d5854c5204c17c549` was
requalified from a detached clean worktree. The focused Studio custody,
handoff, entitlement, usage, and tenant-boundary suites passed **99/99**;
typecheck, isolated **49/49** page build, Drizzle schema check, ordered
**43/43** migration check, and diff check passed. The earlier disposable
PostgreSQL route evidence remains separately recorded.

This is implementation qualification only. `STUDIO-CLI-001` remains
unchecked because the approved numeric paid/non-production hosted-record
allowance and authorized Studio recipient/customer acknowledgement with
hosted/audit evidence are still absent. The current score remains **239
checked / 41 open / 280 total (85.4%)**. No AppSec/Hunt row changed. Evidence:
`docs/shipping/evidence/studio-cli-001-clean-head-qualification-2026-10-21.md`.

## 2026-10-19 · DIST-001 packed-files allowlist hardening

CLI commits `48a2baa0` and `edfb5ec0` add and qualify the missing public
archive-boundary check: every packed member must be covered by the exact
manifest `files` allowlist, apart from bounded npm metadata. Post-commit
qualification passed **9/9**, workspace build **8/8**, packed-manifest audit
for **7** archives, and clean-consumer install/import/CLI/bounded-fixture
execution. The temporary cross-platform install setting used for local license
qualification was removed before commit.

This is implementation evidence only. Keep `DIST-001` unchecked for its
LOCAL/HUNT/RECORD dependencies, trusted publication, legal/release approval,
attestation, and final acceptance. Score remains **239 checked / 41 open / 280
total (85.4%)**; AppSec/Hunt remains held separately. Evidence:
`docs/shipping/evidence/dist-001-packed-files-allowlist-2026-10-19.md`.

## 2026-10-19 · STUDIO-CLI-001 entitlement and recipient-evidence implementation

Web commits `38d6eb0` and `62a54b5` add the real server-side Studio
`white_label_report` entitlement gate to client-workspace creation, handoff
issuance, and client-projection upload, plus a deterministic audit-backed
recipient acknowledgement evidence digest. Focused post-commit qualification
passed **35/35**; full Web tests passed **903/903 executed** with **24
explicit skips**, typecheck and diff check passed. The production build was
not accepted because the worktree's Next invocation discovered unresolved
conflict markers in the unrelated dirty parent checkout's `package.json`.

This is implementation evidence, not fabricated commercial or customer
acceptance. Keep `STUDIO-CLI-001` unchecked pending an approved isolated
Studio entitlement and an actual authorized recipient/customer acknowledgement
with the resulting hosted/audit evidence. Score remains **239 checked / 41
open / 280 total (85.4%)**; AppSec/Hunt remains held separately. Evidence:
`docs/shipping/evidence/studio-cli-001-entitlement-recipient-implementation-2026-10-19.md`.

## 2026-10-19 · active continuation after authorized GitHub recovery

The overall shipping goal remains active; the completed GitHub cutover was a
subtask, not final-goal completion. The current score is **239 checked / 41
open / 280 total (85.4%)**. The independent Hunt AppSec hold set remains
`HUNT-008`–`HUNT-011` and `QUAL-CLI-004`, plus rows that explicitly depend on
their independent review. Do not hold unrelated rows for AppSec: classify the
first unchecked row, park only the AppSec-dependent portion, and continue
top-to-bottom with the next dependency-ready non-AppSec row. The next active
non-AppSec row is `STUDIO-CLI-001`; its remaining contract is the numeric
hosted allowance and authorized Studio recipient/customer acceptance.

The current Web implementation also hardens that custody boundary: commits
`c9dd749` and `f26213c`, preserved by normal PR #226 merge
`c8dc05a57a77d2332856085c70833ceced0599f6`, add scoped persistence rollback
and deterministic usage release for failed receipt/client-projection inserts.
This is substantive code-side progress only; `STUDIO-CLI-001` remains
unchecked until its numeric hosted allowance and authorized recipient/customer
acceptance are observed.
Evidence: `docs/shipping/evidence/studio-cli-001-hosted-usage-release-2026-10-19.md`.

## 2026-10-19 · QUAL-WEB-005/006 public Release Record qualification merged

Web PR #222 merged normally as
`8e06f6d43a35ed123c2a9ef169238beca202ff68`, preserving separate substantive
implementation and regression commits. The original public Release Record
surface now declares explicit no-index metadata and is covered by the real
public release-smoke manifest with bounded content-digest verification. The
same merge preserves responsive, landmark, focus-visible, reduced-motion, and
application-order migration contracts for the organization dashboard.

Clean merged-head focused tests passed **6/6**, with typecheck and diff check
passing; hosted PR checks were **8/8 successful**. This advances
`QUAL-WEB-005` and `QUAL-WEB-006` implementation evidence only. Their
checkboxes remain unchecked for external deletion/legal, authenticated
browser/field-CWV, customer, and independent acceptance requirements. Score
remains **239 checked / 41 open / 280 total (85.4%)**; AppSec/Hunt remains
held. Evidence:
`docs/shipping/evidence/qual-web-005-006-public-release-smoke-pr222-2026-10-19.md`.

## 2026-10-19 · QUAL-WEB-005/006 current merged-head qualification

The clean Web merge `2c07237845f0e52061dc52c99c21212615390177` passed the
original privacy/deletion/retention contracts **46/46**, private-runner
contracts **24/24**, typecheck, the **43**-migration ordering audit, and the
optimized Next build with **49/49** pages; `git diff --check` passed. The run
used only a disposable worktree and synthetic/local fixtures and made no
Production, provider, customer, credential, or source-upload write.

This is qualification progress, not deliberate checkbox closure.
`QUAL-WEB-005` remains open for legal/consent, authorized production
deletion/migration, restore/rollback, reconciliation, and independent
acceptance. `QUAL-WEB-006` remains open for human screen-reader, complete
authenticated paid/organization, large-dataset, supported-browser, field-CWV,
and independent/customer acceptance evidence. Score remains **239 checked / 41
open / 280 total (85.4%)**; AppSec/Hunt remains held separately.
Evidence: `docs/shipping/evidence/qual-web-005-006-current-merged-head-2026-10-19.md`.

## 2026-10-19 · ACCEPT-002/003 current-head substrate and bundle

The private twelve-story verifier ran against CLI
`11734a45740a893c307606e8f3d3f316711abd9e` and Web
`2c07237845f0e52061dc52c99c21212615390177`: CLI **310/312** with 2 skips,
Web **949/979** with 30 skips, and composed Studio/Enterprise/Team/quality
substrates **74/74**, all exit `0`. All twelve story mappings executed and the
private 17-file evidence bundle passed its secret-like material scan.

This is real substrate qualification, not deliberate checkbox closure.
`ACCEPT-002` remains open for the full hosted/provider/customer story run and
`ACCEPT-003` remains open for reviewer sign-off plus mapped external/hosted
evidence. The verifier keeps Hunt, modified-client runtime, Studio recipient,
Enterprise runner, and account-deletion qualification states explicit. Score
remains **239 checked / 41 open / 280 total (85.4%)**; AppSec/Hunt remains
held separately. Evidence:
`docs/shipping/evidence/accept-002-003-current-head-substrate-bundle-2026-10-19.md`.

Owner approvals route work but do not replace row-specific implementation,
provider, customer, legal, field, release, or acceptance evidence. Continue
using the active `verglos-web`, `verglos-cli`, and private shipping ledger
repositories only; preserve normal granular substantive commits and do not
squash.

## 2026-10-19 · ACCEPT-006 original comprehension scorer shipped

Private commits `6430a38` (implementation) and `423daecc` (regression) add
the real six-question scorer. It binds answers to an exact artifact digest and
rubric, validates the participant consent window and six unique questions,
detects critical hallucinations, refuses secret-like answer material, ignores
caller-provided correctness flags, and emits only digests. Contracts pass
**7/7**, with existing acceptance protocol checks and diff check passing.

This is implementation evidence only. No participant run is fabricated;
`ACCEPT-006` remains unchecked pending real consenting participant responses,
redacted aggregate evidence, and independent scoring review. Score remains
**239 checked / 41 open / 280 total (85.4%)**; AppSec/Hunt remains held.
Evidence: `docs/shipping/evidence/accept-006-comprehension-scorer-2026-10-19.md`.

## 2026-10-19 · ACCEPT-008 original commercial evidence validator shipped

Private commits `64c1a477` (implementation) and `f986f80c` (regression) add
the real commercial validator. It requires exact catalog/price/currency,
numeric allowances, bounded founder approval/expiry, all seven digest-bound
evidence kinds, two distinct repeat-use records, and consistent checkout,
agreement, allowance, support, hosted-cost, and recipient-value facts. The
combined acceptance/comprehension/commercial contracts pass **10/10**.

This is validator implementation evidence only. No commercial result is
fabricated; `ACCEPT-008` remains unchecked pending actual plan/checkout,
repeat-use, support, hosted-cost, recipient-value, allowance, and final
acceptance evidence. Score remains **239 checked / 41 open / 280 total
(85.4%)**; AppSec/Hunt remains held. Evidence:
`docs/shipping/evidence/accept-008-commercial-validator-2026-10-19.md`.

## 2026-10-19 · ENT-CLI-001 original enrollment exchange shipped

Web PR #225 and CLI PR #152 now provide the original one-time runner
credential exchange. Web redeems the owner-issued enrollment token atomically,
stores only a digest of the bounded runner credential, enforces expiry and
tenant/runner binding, and rejects owner-license authentication on runner poll
and result routes. CLI enrolls through the fixed route, persists the credential
using the existing credentials store, and uses it for poll/upload. Focused Web
contracts passed **24/24**, disposable PostgreSQL lifecycle **1/1**, and CLI
focused tests **10/10**; typecheck/build/migration and all required hosted
checks passed. Normal merge commits are Web
`2c07237845f0e52061dc52c99c21212615390177` and CLI
`11734a45740a893c307606e8f3d3f316711abd9e`.

This is implementation progress, not a deliberate checkbox closure.
`ENT-CLI-001` remains unchecked until authorized deployed enrollment, approved
execution/result reconciliation, operational evidence, independent review, and
enterprise acceptance exist. Score remains **239 checked / 41 open / 280 total
(85.4%)**. AppSec/Hunt remains held separately. Evidence:
`docs/shipping/evidence/ent-cli-001-runner-credential-exchange-pr152-pr225-2026-10-19.md`.

## 2026-10-19 · distribution current-head qualification

The exact merged CLI head `11734a45740a893c307606e8f3d3f316711abd9e` was
requalified in a clean worktree. Locked install completed; the workspace build
passed **8/8**; publish workflow, release-tag, artifact, package-surface, and
rollback contract tests passed **15/15** with zero failures/skips. The bounded
rollback rehearsal exited `0`, covered five release boundaries, and preserved
two historical records. No npm, registry, signing, Hunt-provider, Vercel, or
production state changed.

This advances `DIST-001`, `DIST-002`, `DIST-003`, and `DIST-006` evidence only;
their checkboxes remain open for dependency completion, protected publisher and
legal/release approval, actual immutable publication/attestation, and
authenticated rollback/revocation acceptance. Score remains **239 checked / 41
open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/dist-current-head-release-contracts-2026-10-19.md`.

## 2026-10-19 · QUAL-CLI-006 current merged-head qualification

CLI PR #152’s exact merge `11734a45740a893c307606e8f3d3f316711abd9e` passed
locked installation, build **8/8**, release/package contracts **15/15**, and
rollback rehearsal. Hosted checks were **12/12 SUCCESS** across all nine
Ubuntu/macOS/Windows Node 20/22/24 cells plus official standard/provenance,
in-toto, and self-scan checks. No npm, tag, registry, provider, signing, or
production write occurred.

This advances `QUAL-CLI-006` evidence only. The checkbox remains open for
trusted keyless publication identity, protected publisher approval, legal
clearance, independent AppSec review, and final acceptance. Score remains
**239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-cli-006-current-merged-head-2026-10-19.md`.

## 2026-10-19 · TEAM-WEB-003 original policy lifecycle hardening

Web PR #223 preserves implementation commit `9489fb6` and regression commit
`75de374` separately. The original policy create route now forces every new
version through `draft`; direct `published`/`retired` creation and creation-
time `effectiveFrom` are rejected so publish timing remains on the audited
transition path. Focused policy/tenant/negative-boundary/SCM contracts passed
**45/45**, typecheck passed, and the optimized build generated **48/48**
pages. `TEAM-WEB-003` was already checked, so this is a hardening addendum
with no checkbox change. Score remains **239 checked / 41 open / 280 total
(85.4%)**. AppSec/Hunt and all external acceptance blockers remain unchanged.
Evidence: `docs/shipping/evidence/team-web-003-draft-first-policy-creation-2026-10-19.md`.

## 2026-10-19 · ACCEPT-002 twelve-story execution coverage enforcement

Private commit `2c24069b` adds a machine-checked execution plan for all twelve
frozen acceptance stories. The verifier now refuses duplicate/unknown stories
or missing executed surfaces, emits per-story `substrateExecuted`,
`qualificationRequired`, and preserved acceptance status fields, and records
`storyCoverageComplete: true` only when all twelve mappings are present. Its
regression suite passes **3/3**. This closes a verifier implementation gap;
it does not turn hosted, provider, customer, reviewer, browser-human, field-
CWV, deletion, or AppSec requirements into local passes. `ACCEPT-002` and
`ACCEPT-003` remain unchecked. Score remains **235 checked / 45 open / 280
total (83.9%)**. Evidence:
`docs/shipping/evidence/acceptance-stories-verification-2026-10-19.md`.

## 2026-10-19 · ACCEPT-005 first-party owned-repository qualification

The exact detached CLI merge `50bcab42eadfa8796d86d1f7a8aaee3010c65647`
and Web merge `390fd3f82b2a59003e30e2362ab593ef1db4b982` produced bounded
first-party scan reports. CLI recorded 78 findings at score 67/high; Web
recorded 22 findings at score 73/medium. Provenance was disabled, so both
reports are explicitly incomplete. Raw reports and temporary source clones
were not retained in the private evidence.

This does not satisfy the row's external consented-team/recipient workflow,
full release reconciliation, deletion/expiry record, or independent review.
`ACCEPT-005` stays unchecked. No AppSec state changed. Score remains
**235 checked / 45 open / 280 total (83.9%)**. Evidence:
`docs/shipping/evidence/accept-005-topnotchh-owned-qualification-2026-10-19.md`.

## 2026-10-19 · ACCEPT-003 current evidence bundle

The private evidence-bundle generator now includes the current ACCEPT-002
verifier JSON, bounded report, and first-party ACCEPT-005 qualification
record. The generated manifest hashed **15 files** and passed its
secret-like material scan; it records hashes/sizes only and
does not contain source, credentials, customer data, provider captures, or
reviewer sign-off.

`ACCEPT-003` remains unchecked for required reviewer sign-off and the mapped
external/hosted evidence. No AppSec state changed. Score remains **235 checked
 / 45 open / 280 total (83.9%)**. Evidence:
`docs/shipping/evidence/acceptance-evidence-bundle-2026-10-19.json` and
`docs/shipping/evidence/accept-003-current-evidence-bundle-2026-10-19.md`.

## 2026-10-19 · ACCEPT-002 current-source substrate verification

The current frozen acceptance verifier passed against CLI merge
`50bcab42eadfa8796d86d1f7a8aaee3010c65647` and Web source
`390fd3f82b2a59003e30e2362ab593ef1db4b982`: CLI **291/293** with 2 explicit
skips, Web **945/975** with 30 explicit skips, and composed
Team/Studio/Enterprise/quality substrates **74/74**, all with zero failures
and exit code `0`.

This advances repository-owned substrate evidence only. `ACCEPT-002` and
`ACCEPT-003` remain unchecked for the mapped hosted/provider/customer/
reviewer stories; no AppSec state changed. Score remains **235 checked / 45
open / 280 total (83.9%)**. Evidence:
`docs/shipping/evidence/acceptance-stories-verification-2026-10-19.json` and
`docs/shipping/evidence/acceptance-stories-verification-2026-10-19.md`.

## 2026-10-19 · DIST-001 exact-merge package qualification

The exact CLI merge `50bcab42eadfa8796d86d1f7a8aaee3010c65647` passed the
documented clean package qualification after the cross-platform CI setup was
applied in the disposable worktree: build **8/8**, **7** public archives,
packed manifest/public-surface audit passed, and clean-consumer installation,
imports, no-implicit-engine check, and signed bounded A1 execution passed.

This is package qualification evidence only. `DIST-001` remains unchecked
because its declared LOCAL/HUNT/RECORD and final legal/release dependencies
are not all closed. No package was published; AppSec/Hunt is unchanged. Score
remains **235 checked / 45 open / 280 total (83.9%)**. Evidence:
`docs/shipping/evidence/dist-001-current-merge-requalification-2026-10-19.md`.

## 2026-10-19 · ENT-CLI-001 private-runner protocol requalification

The current private-runner implementation was rechecked through the bounded
shared protocol and CLI client suites: **5/5** and **3/3** passed, with shared
and CLI typechecks passing and no skips or failures. The checks cover signed
job verification, tenant/runner/target binding, expiry/replay refusal,
GET-only polling, malformed-job refusal, local replay persistence, and
least-evidence result projection.

This is code-side evidence only. `ENT-CLI-001` remains unchecked pending
operational enrollment credential exchange, approved isolated runner
execution/result reconciliation, cross-platform operational evidence,
independent review, and enterprise acceptance. AppSec/Hunt is unchanged. Score
remains **235 checked / 45 open / 280 total (83.9%)**. Evidence:
`docs/shipping/evidence/ent-cli-001-protocol-requalification-2026-10-19.md`.

## 2026-10-19 · STUDIO-CLI-001 Preview allowance requalification

The current owner-authorized Preview run reached the exact qualification
organization/project and exercised the real hosted custody route. The active
fixture resolved to `free` with `recordsPerMonth=unset`; the empty list route
returned HTTP `200`, a schema-valid redacted receipt returned HTTP `403`
`hosted record allowance is not configured`, and a cross-organization read
returned HTTP `403` `organization access denied`. No receipt was persisted and
no Production state changed.

This records fail-closed entitlement evidence only. `STUDIO-CLI-001` remains
unchecked pending an approved numeric paid/non-production allowance and
authorized Studio recipient/customer acceptance. TEAM-CLI-001 remains checked;
AppSec/Hunt is unchanged. Score remains **235 checked / 45 open / 280 total
(83.9%)**. Evidence:
`docs/shipping/evidence/studio-cli-001-preview-allowance-requalification-2026-10-19.md`.

## 2026-10-19 · TEAM-WEB-006 closure

TEAM-WEB-006 is now checked. The implemented Web SCM integration passed its
focused bounded provider/worker suites, and the owner-authorized isolated
Preview GitHub installation admitted, delivered, replayed, and reconciled the
source-free check payload for the working CLI repository. GitHub read-back
returned one completed successful release-decision check with exact commit,
subject/artifact, and record URL binding. GitLab remains code/test-qualified
without a live installation; dependent GitHub lifecycle rows remain separate.
AppSec/Hunt is unchanged. Score: **235 checked / 45 open / 280 total (83.9%)**.
Evidence: `docs/shipping/evidence/team-web-006-hosted-github-check-delivery-qualification-2026-10-19.md`.

## 2026-10-19 · TEAM-CLI-002 closure

TEAM-CLI-002 is now checked. The actual CLI `verglos ci --check-payload`
command emitted a bounded source-free payload with exact subject/decision/
policy/record/commit identity and deterministic digest. The signed Preview
policy digest matched TEAM-CLI-001; the protected Preview SCM route admitted
the payload, provider delivery completed successfully, identical replay was a
no-op, and GitHub read back one completed successful release-decision check at
the exact record URL. AppSec/Hunt remains separate and unchanged. Score:
**234 checked / 46 open / 280 total (83.6%)**. Evidence:
`docs/shipping/evidence/team-cli-002-hosted-check-payload-provider-qualification-2026-10-19.md`.

## 2026-10-19 · TEAM-CLI-001 closure

TEAM-CLI-001 is now checked. The approved isolated Preview qualification
proved the mapped founder entitlement, exact signed organization/repository
policy fetch, CLI remote/cache/offline/expiry/cross-tenant matrix, source-free
SCM admission/idempotency, and successful GitHub provider delivery. Web PRs
#216, #217, and #218 merged normally; final Preview cron returned
`claimed=1, delivered=1, retried=0, failed=0, leaseLost=0`, and the replay
returned `providerStatus=delivered` with `deliveryDecision=noop`. AppSec/Hunt
remains separate and unchanged. Score: **233 checked / 47 open / 280 total
(83.2%)**. Evidence:
`docs/shipping/evidence/team-cli-001-hosted-cli-policy-provider-qualification-2026-10-19.md`.

## 2026-10-19 · TEAM-CLI-001 exact organization-policy route binding

CLI PR #147 merged normally as `5bf7ae70`, preserving implementation commit
`b761dee4` and regression-test commit `e28d831a`. The organization-policy
fetcher now requires the exact tenant/repository policy route and rejects a
same-origin alternate route before attaching bearer authorization. Focused
policy tests **10/10**, workspace build **8/8**, CLI typecheck, full CLI tests,
public-boundary audit, and all **12/12** protected PR checks passed.

This advances implementation only; the `TEAM-CLI-001` checkbox remains open
for valid mapped paid/non-production entitlement, authenticated signed hosted
fetch/cache/offline/expiry/cross-tenant/reconciliation evidence, and provider
delivery/reconciliation. No AppSec state changed; score remains **232 checked /
48 open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-cli-001-exact-policy-route-pr147-2026-10-19.md`.

## 2026-10-19 · TEAM-CLI-001 / STUDIO-CLI-001 Studio projection upload hardening

CLI PR #146 merged normally as
`2f27f71cca38e7f95f67ac682e1f38c2e203fbc4`, preserving implementation commit
`a55c1c661d28b7c8861b57c7555b680a4fb6ff9d` and regression-test commit
`ae40cdb4659766bd4193ac5ab760b8bbaf94f4e1`. The Studio projection upload
client binds requests to the exact organization/project route and rejects
route-widening endpoint input; response record identifiers are bounded and
reject unsafe values. Workspace build **8/8**, focused upload tests **6/6**,
typecheck, full CLI tests, diff check, and all **12/12** protected checks
passed.

This advances implementation only. `TEAM-CLI-001`, `TEAM-CLI-002`, and
`STUDIO-CLI-001` remain unchecked for hosted entitlement, provider delivery,
reconciliation, numeric paid/non-production allowance, and authorized
customer acceptance. No AppSec state changed; score remains **232 checked / 48
open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-studio-cli-001-projection-upload-pr146-2026-10-19.md`.

## 2026-10-18 · TEAM-WEB-006 tenant-scoped SCM dashboard

Web PR #203 merged normally as `5ee6fb28`, preserving implementation
`2db69ed` and regression test `d154a65`. The organization dashboard now
provides a read-only tenant-scoped SCM installation view with bounded provider,
account, repository, project, status, and lifecycle metadata; encrypted
secret/token fields and raw provider payloads are not selected. Focused test
**1/1**, typecheck, build, hosted typecheck/schema, Vercel, Preview Comments,
and GitGuardian passed. This is implementation progress only:
`TEAM-WEB-006`/`GITHUB-WEB-001` remain unchecked for live provider delivery,
retries/reconciliation, and acceptance. No AppSec state changed; score
remains **232 checked / 48 open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-web-006-scm-dashboard-pr203-2026-10-18.md`.

## 2026-10-18 · TEAM-WEB-006 GitHub App webhook configuration

The personal Preview App ID `5367509` has an active SSL-verified webhook at
`https://verglos.com/api/v1/webhooks/scm/github`, Checks read/write, mandatory
Metadata read-only, and Check Run/Check Suite subscriptions. A webhook secret
is configured but was not exposed. Recent merged CLI/Web check-runs showed
GitHub Actions only, not a provider check from this App. This is configuration
evidence only; `TEAM-WEB-006` and `GITHUB-WEB-002/003` remain unchecked for
live delivery, retries, reconciliation, and acceptance. No AppSec state
changed; score remains **232 checked / 48 open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-web-006-github-app-webhook-config-2026-10-18.md`.

## 2026-10-18 · TEAM-WEB-006 personal GitHub App scope

The existing personal installation `172664847` for `anuragyadav-git` was
verified with only `anuragyadav-git/verglos-web` selected and with read
metadata/read-write checks permissions. The organization installation
`172686102` separately selects only `Top-Notchh-Solutions/verglos-cli`; the
obsolete archive scope is removed. This maps both working repositories to
owner-correct least-privilege installations. It remains provider
configuration evidence only: `TEAM-WEB-006` and `GITHUB-WEB-001` stay
unchecked for live delivery, check publication, reconciliation, and complete
acceptance. No AppSec state changed; score remains **232 checked / 48 open /
280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-web-006-github-app-personal-scope-2026-10-18.md`.

## 2026-10-18 · TEAM-WEB-006 GitHub App scope recheck

The existing `Top-Notchh-Solutions` installation for Verglos Organization SCM
Checks was updated successfully in the owner session. The final selected
scope is only `Top-Notchh-Solutions/verglos-cli`; the obsolete
`verglos-archive` selection was removed. Permissions remain read metadata and
read/write checks. The organization picker returned no `verglos-web`
repository, so this installation cannot establish delivery to that working
repository. This is provider-scope evidence only: `TEAM-WEB-006` remains
unchecked for working-repository delivery, cutover/reconciliation, and
complete acceptance. No AppSec state changed; score remains **232 checked / 48
open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-web-006-github-app-scope-recheck-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-001 signed offline-cache authenticity

CLI PR #133 merged normally as `4aa62286e31cc7e9fcbeef0eebc5a383b4d6a0fc`,
preserving implementation `df615be38fb6e3409ca601781e594e39fd438803` and
regression test `77de3ab5ff3349d3766b58ccdbf26b6b02d49efd`. The organization
policy cache now retains and re-verifies the signed envelope identity before
offline use, so replacing policy JSON and its digest without the trusted signer
fails closed. Local shared/CLI builds, CLI typecheck, focused cache/fetch/shared
policy tests **15/15**, diff check, and all 11 protected hosted checks passed.
This is implementation progress only: `TEAM-CLI-001` remains unchecked for
entitlement, authenticated hosted fetch/cache/offline/expiry/cross-tenant
evidence, provider delivery, reconciliation, and complete acceptance. No
checkbox changed; score remains **232 checked / 48 open / 280 total (82.9%)**.
Evidence: `docs/shipping/evidence/team-cli-001-signed-offline-cache-pr133-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-001 policy scope input boundary

CLI PR #131 merged normally as
`234c7641cce2bbc33ffdb62fd83e1fe9b72e3beb`, preserving implementation commit
`e91e792582416fc28050ddbc2c6753357e155f1d` and regression-test commit
`ec237f5339c4f937da5366039315c8bf3e5c5679`. The organization-policy fetcher
now rejects malformed organization/repository scope identifiers before cache,
credential, endpoint, or network work. Workspace build passed **8/8** and
focused policy cache/fetch tests passed **10/10**. Self-scan, in-toto, Ubuntu
Node 20/22/24, and macOS Node 20/22/24 were successful at merge; Windows
Node 20/22/24 remained in progress and are not counted as completed evidence.

The completed hosted run passed self-scan, in-toto, and all nine Ubuntu,
macOS, and Windows Node 20/22/24 platform jobs. This advances only the
input-boundary portion of `TEAM-CLI-001`, which remains unchecked for
entitlement, authenticated policy/cache/offline/expiry/cross-tenant evidence,
provider delivery, reconciliation, and complete acceptance. No checkbox
changed; score remains **232 checked / 48 open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-cli-001-policy-scope-boundary-pr131-2026-10-18.md`.

## 2026-10-18 · TEAM-WEB-006 bounded provider response metadata

Web PR #200 merged normally as
`ad8c988e061748e4786a0235cbeeaf354e5bea41`, preserving implementation commit
`d5e66d1532cb9e9129761b7377d12ca8c42522c6` and regression-test commit
`f944939538559f04c284b457ee77b6ce0eddaa06`. The SCM provider transport now
normalizes impossible response statuses, drops control-bearing or overlong
request IDs, cancels response bodies, and caps `Retry-After`. Typecheck passed,
provider tests passed **8/8**, combined SCM provider/route/runner/worker tests
passed **22/22**, and protected checks passed. Production is READY at the
deployment bound to the normal merge commit.

This advances only the bounded response portion of `TEAM-WEB-006`.
`TEAM-WEB-006` remains unchecked for live provider delivery, operational
cutover/reconciliation, and complete acceptance. `TEAM-CLI-001` and
`TEAM-CLI-002` dependencies remain open. No checkbox changed; score remains
**232 checked / 48 open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-web-006-response-metadata-pr200-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-002 bounded CI record-link implementation

CLI PR #130 merged normally as
`efa64f5cf1ec9f6ff960c48f06f7bc3c1e239a0d`, preserving implementation commit
`d5c44155c3b3e601ae9fff60cad3ab12255a3f6f` and regression-test commit
`81c885f6a2f30956cc1de572f8a3c6f0a11a0f21`. The source-free CI check payload
now rejects record links containing query strings, control characters, user
info, fragments, or more than 2,048 characters while retaining HTTPS and exact
identity binding. Workspace build passed **8/8**, shared payload tests passed
**3/3**, CLI payload tests passed **3/3**, and all protected cross-platform,
self-scan, and in-toto checks passed.

This advances only the TEAM-CLI-002 implementation boundary. `TEAM-CLI-002`
remains unchecked because `TEAM-CLI-001` entitlement, authenticated policy
fetch/cache/offline/expiry/cross-tenant evidence, live provider delivery, and
reconciliation remain open. No checkbox changed; score remains **232 checked /
48 open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-cli-002-ci-record-link-boundary-pr130-2026-10-18.md`.

## 2026-10-18 · DIST-006 current rollback/revocation rehearsal

On CLI merge `9eba5102`, the shared rollback decision tests passed **6/6** and
the CLI rollback-plan/rehearsal tests passed **5/5**. The bounded rehearsal
covers npm, engine-manifest, Hunt-feed, signing-identity, and Web-deployment
boundaries, preserves historical records, and fails closed on missing approval
or invalid references.

This is local implementation/rehearsal evidence only. `DIST-006` remains
unchecked because no authenticated provider/registry/engine/feed/signing/
deployment rollback or revocation was executed and final release acceptance
remains open. No checkbox changed; score remains **232 checked / 48 open / 280
total (82.9%)**. Evidence:
`docs/shipping/evidence/dist-006-current-cli-rollback-rehearsal-2026-10-18.md`.

## 2026-10-18 · DIST-002/003 current release-workflow revalidation

On CLI merge `9eba5102`, the release/publishing/platform-matrix/package-surface
contract suite passed **11/11** with zero failures or skips. The 7-package
contents audit and public-boundary audit also passed. This validates the
workflow checks without publishing npm, creating a tag, or claiming trusted
keyless attestation.

`DIST-002` and `DIST-003` remain unchecked for protected environment approval,
trusted OIDC/keyless publication identity, immutable publication/attestation,
release-note/checksum delivery, legal release clearance, and final acceptance.
No checkbox changed; score remains **232 checked / 48 open / 280 total
(82.9%)**. Evidence:
`docs/shipping/evidence/dist-002-003-current-cli-workflow-revalidation-2026-10-18.md`.

## 2026-10-18 · DIST-001 current CLI package requalification

The current CLI normal merge `9eba5102a1c0f9d7ee13b28bb2cc28bb50766eae` was
requalified in a disposable worktree. The public package packer created **7
archives**, the packed-manifest audit passed, and the clean consumer installed
and imported all 7 packages, executed `2.0.0-alpha.1`, confirmed no implicit
external-engine installation, and executed the signed bounded A1 fixture.
Archive digests are retained in the private evidence packet. The temporary
cross-platform pnpm metadata selection needed on the Node 26 Mac was removed
before the worktree was closed.

This advances package-surface evidence only. `DIST-001` remains unchecked for
LOCAL/HUNT/RECORD dependency acceptance and final legal/release qualification;
no checkbox changed. Score remains **232 checked / 48 open / 280 total
(82.9%)**. Evidence:
`docs/shipping/evidence/dist-001-current-cli-pr129-requalification-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-001 bounded policy response implementation

CLI PR #129 merged normally as
`9eba5102a1c0f9d7ee13b28bb2cc28bb50766eae`, preserving implementation commit
`36fb82f3` and regression-test commit `9d064603`. The organization policy
client now bounds timeout input at ten seconds and streams policy responses
with a one-MiB cap, cancelling an oversized body before JSON parsing. The
workspace build passed **8/8**, focused policy tests passed **9/9**, and the
full `pnpm --filter verglos test` command passed with no failures.

This advances only the bounded client implementation. `TEAM-CLI-001` remains
unchecked for mapped paid/non-production entitlement, authenticated signed
CLI fetch/cache/offline/expiry/cross-tenant observations, and provider
delivery/reconciliation. No checkbox changed; score remains **232 checked / 48
open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-cli-001-policy-response-boundary-pr129-2026-10-18.md`.

## 2026-10-18 · TEAM-WEB-006 bounded SCM provider transport implementation

Web PR #199 merged normally as
`dd5f3883f1e06027a8c14c8b1afcd1742bd87a29`, preserving implementation commit
`a7fe6b7` and regression-test commit `a259277`. Provider delivery now uses a
ten-second timeout, caller cancellation, redirect refusal, response-body
cancellation, and bounded metadata projection. Typecheck passed, focused
transport tests passed **7/7**, and SCM route/runner/worker contract tests
passed **14/14**. The merged commit has a READY Production deployment at
`verglos-jsuhywoaf-anuragyadav20062002s-projects.vercel.app`.

This advances only the transport implementation. `TEAM-WEB-006` remains
unchecked for live provider delivery, operational cutover/reconciliation, and
complete row acceptance; its upstream Team CLI rows remain open. No checkbox
changed; score remains **232 checked / 48 open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-web-006-scm-provider-timeout-pr199-2026-10-18.md`.

## 2026-10-18 · QUAL-WEB-006 authenticated dashboard section recheck

Web PR #198, `Canonicalize authenticated dashboard sections`, merged normally
as `27b6f73414e2df0499a268898474b774dc45a550` after the full hosted Web gate
passed. The bounded canonical helper now covers every organization dashboard
section, including policy, while traversal-shaped and oversized values fall
back to `/orgs`. The existing authenticated owner tab rechecked the policy
route at the Ready Production deployment and Lighthouse passed **54/54** with
zero failures on desktop and mobile: Accessibility, Best Practices, SEO, and
Agentic Browsing each scored **100**.

This closes the observed canonical metadata defect only. `QUAL-WEB-006`
remains unchecked for human screen-reader, large-dataset, complete field-CWV,
and final acceptance evidence. Score remains **232 checked / 48 open / 280
total (82.9%)**. Evidence:
`docs/shipping/evidence/qual-web-006-authenticated-dashboard-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-001 post-merge Preview policy/provider recheck

Web PR #195, `Bound GitHub App provider requests`, merged normally with merge
commit `8362bba7529ff888c6c3742638078845d6c97f91`; all required PR checks
passed. The merged Web source now bounds each GitHub App request to ten
seconds and tests the abort-signal contract. A fresh protected Preview
deployment `dpl_4eTQjNJUwjuU2PM9S8hg8GWTdXDX` reached READY and generated
47/47 pages.

Using the existing owner-authorized Preview test identity, the isolated
fixture organization returned its published policy with digest
`sha256:055bd90bca9822faa7219224aeba42ed4c201ab9ed81df9ca9efa167a9ad8a02`.
The exact GitHub installation/repository request then returned bounded
`GitHub App installation exchange unavailable`; the follow-up installation
list remained empty. No provider token was recorded and no Production state
changed.

This advances the policy substrate and makes provider failure bounded, but it
does not close `TEAM-CLI-001`: the mapped paid/non-production entitlement,
authenticated signed CLI fetch/cache/offline/expiry/cross-tenant matrix, and
provider delivery/reconciliation are still missing. `TEAM-CLI-002` and
`TEAM-WEB-006` remain dependent. Hunt/AppSec-held rows remain parked for the
independent review. Score remains **232 checked / 48 open / 280 total
(82.9%)**. Evidence:
`docs/shipping/evidence/team-cli-001-preview-policy-provisioning-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-001 hosted CLI-auth entitlement recheck

The hosted device-code start endpoint returned a bounded challenge. Opening
the verification URL in the existing authenticated owner session redirected to
checkout because no active license was present. No authorization succeeded, no
license key or code was recorded, and no payment control was submitted. The
account remained Free with no hosted-record allowance.

This is direct non-AppSec entitlement evidence and keeps `TEAM-CLI-001`,
`TEAM-CLI-002`, and `TEAM-WEB-006` unchecked. The mapped paid/non-production
entitlement and authenticated signed CLI fetch/cache/offline/expiry/
cross-tenant/provider matrix remain the next required artifacts. Score remains
**232 checked / 48 open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-cli-001-cli-auth-entitlement-recheck-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-001 Preview dashboard auth correction

The first Preview deployment of the policy dashboard exposed a real route
failure: an unauthenticated request returned HTTP `500` because the Preview
test-auth configuration bypassed Clerk middleware while the request context
still called Clerk `auth()`. Web PR #194, assigned to `anuragyadav-git`,
merged normally as `7e78ec8414564f313a69f83fb8789550a1f0caba`, preserves
implementation commit `e84643b` and regression-test commit `74a6cea`.

The shared request-auth seam now selects the bounded Preview identity only
when its complete configuration and header are valid, and otherwise returns an
anonymous identity without calling Clerk. The focused auth/policy suite passed
**21/21**, typecheck and diff checks passed, and the build generated **47/47**
pages. Hosted Actions run `39128474400` / job `117678523046`, GitGuardian,
and Preview Comments passed. Corrected Preview deployment
`dpl_2Nv1PZPEX4mf6fHdDgu3Ksa4nPpT` is READY; the protected policy route now
returns HTTP `307` to login and produces no Vercel error log.

This corrects the implementation failure and advances `TEAM-CLI-001`; it does
not close the row. A mapped paid/non-production entitlement, authenticated
signed CLI fetch/cache/offline/expiry/cross-tenant observations, and provider
delivery/reconciliation remain open. No checkbox changed; score remains
**232 checked / 48 open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-cli-001-policy-dashboard-auth-fix-pr194-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-001 visible policy-digest dashboard slice

Web PR #193, assigned to `anuragyadav-git`, merged normally as
`104d236f328170165f1f43867a0556994504000e`, preserving implementation commit
`9c34a5f` and regression-test commit `9513caa`. The organization Policy page
now uses the authenticated organization resolver and tenant predicate, and
renders bounded policy identity including policy ID, version, status, exact
digest, digest algorithm, effective time, project binding, and repository. It
does not render the policy document.

The clean worktree passed the focused policy suite **16/16**, typecheck,
`git diff --check`, and a production build with **47/47** generated pages.
Hosted Actions run `39128023770` / job `117677152225`, GitGuardian, Vercel
Preview Comments, and Preview deployment
`dpl_8xTcsqGpsJd81CSgoJepWng6TP7G` passed; the deployment is READY at
`https://verglos-kyocl1q7s-anuragyadav20062002s-projects.vercel.app`.

This advances the visible-digest and tenant-scoped dashboard portion only.
`TEAM-CLI-001` remains unchecked for a valid mapped paid/non-production
entitlement, authenticated signed CLI fetch/cache/offline/expiry/cross-tenant
observations, and provider delivery/reconciliation. `TEAM-CLI-002` and
`TEAM-WEB-006` remain dependent. No checkbox changed; score remains
**232 checked / 48 open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-cli-001-policy-dashboard-digest-pr193-2026-10-18.md`.

## 2026-10-18 · organization SCM App token/scope read-back

The organization App identity and signed installation-token exchange were
verified without recording either token. GitHub returned exactly one private
installation repository, `Top-Notchh-Solutions/verglos-archive` (ID
`1305731597`), and no write operation used the token. This strengthens
provider identity/scope evidence but does not close a row. Score remains
**232 checked / 48 open / 280 total (82.9%)**. Evidence:
`docs/shipping/evidence/team-cli-001-organization-owner-policy-fix-2026-10-18.md`.

## 2026-10-18 · hosted SCM check admission and idempotency

The bound Preview project admitted a source-free synthetic release decision
with HTTP `201` as delivery `0787981d-e42e-41bc-804e-ab769b9f00e4` in
`queued` state. An identical retry returned `noop`, and a conflicting payload
for the same external identity returned bounded HTTP `409` without replacing
the stored payload.

This is hosted admission and idempotency evidence, not a row closure: provider
check publication and delivery completion still require the protected cron
credential and provider token exchange. `TEAM-CLI-001`, `TEAM-CLI-002`, and
`TEAM-WEB-006` remain unchecked; score remains **232 checked / 48 open / 280
total (82.9%)**. Hunt/AppSec remains parked. Evidence:
`docs/shipping/evidence/team-cli-001-organization-owner-policy-fix-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-001 organization SCM activation and production configuration

The organization-owned SCM App is installed on `Top-Notchh-Solutions` as
installation `172686102`, with selected-repository scope limited to
`Top-Notchh-Solutions/verglos-archive` and metadata-read/checks-write
permissions. Vercel Preview and Production now hold the three provider
variables as hidden server-side secrets, and the post-configuration Production
deployment `dpl_8joQ1Xg3cXmk9UWs1DQyjSigQC9Z` is READY; the public smoke check
returned HTTP 200.

This is real provider-installation and production-configuration progress, not
a row closure. The separate hosted qualification checkpoint records the
published Preview policy; `TEAM-CLI-001` still needs authenticated CLI
fetch/cache/offline/cross-tenant observations and reconciliation. No AppSec or
dependent checkbox changed. Score remains
**232 checked / 48 open / 280 total (82.9%)**. No squash, rebase, force-push,
empty, duplicate, artificial, or irrelevant public-document commit was used.
Evidence:
`docs/shipping/evidence/team-cli-001-organization-owner-policy-fix-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-001 hosted Preview SCM/policy qualification

The disposable Preview project `verglos-scm-qualification-20261018` was
created and bound to the active organization GitHub installation for the
non-Production `verglos-archive` repository. A canonical policy was created,
reviewed, and published with row ID
`95f44933-cb7c-4cb3-87ae-51ed02d866da` and digest
`sha256:c7327a70ded22a0e051b9da420c012e2ae5d105c430ebe665b82d1ac9399b698`.
The enforcement route returned the expected bounded `401 invalid
authorization` without a license bearer. The current account is Free and has
no license key; no billing or guard bypass was attempted.

This is hosted lifecycle and fail-closed authorization evidence, not a row
closure. Authenticated CLI fetch/cache/offline/cross-tenant observations and
reconciliation remain open. `TEAM-CLI-001` and dependents remain unchecked;
score remains **232 checked / 48 open / 280 total (82.9%)**. Hunt/AppSec remains
parked for the independent review. Evidence:
`docs/shipping/evidence/team-cli-001-organization-owner-policy-fix-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-001 organization-owner policy authorization fix

Web PR #192, assigned to `anuragyadav-git`, merged normally as
`188b4b01fd9d6c7c4292d8cdf55a3b348954e9d4`, preserving implementation commit
`4579c27` and regression-test commit `f8b420e`.
The repository policy endpoint now authorizes a license bearer against the
exact requested organization's active owner membership; it no longer requires
a legacy migration mapping for an organization created through the current
organization API. Focused SCM/tenant tests passed **22/22**, typecheck and
diff checks passed, and READY Preview deployment
`dpl_7DhQxht5dgG655VBqU1a1NnzZj21` built **47/47** pages.
The connected Vercel project then deployed the normal merge commit to
Production as `dpl_6v94AE2iXisCWHKxQfrjKyD81NZ8`; a read-only request to
`https://verglos.com/` returned HTTP 200 and the factual Security Layer title.

This advances implementation and authorized Production deployment only.
`TEAM-CLI-001` remains unchecked for the
authorized SCM provider installation, provider credentials, published signed
policy, authenticated live CLI fetch/cache/offline/cross-tenant evidence, and
reconciliation. `TEAM-CLI-002` and `TEAM-WEB-006` remain dependent. No
AppSec, provider, customer, legal, release, or final-acceptance row changed;
score remains **232 checked / 48 open / 280 total (82.9%)**. No squash,
rebase, force-push, empty, duplicate, artificial, or irrelevant public-document
commit was used. Evidence:
`docs/shipping/evidence/team-cli-001-organization-owner-policy-fix-2026-10-18.md`.

## 2026-10-18 · QUAL-WEB-006 authenticated account-state qualification

The existing authenticated Verglos browser page was inspected read-only at
`/account`; no new Chrome window or tab was opened. Lighthouse snapshot
qualification passed **28/28** audits with Accessibility, Best Practices, SEO,
and Agentic Browsing at **100/100** on both desktop and mobile. The observed
page is the free-tier empty account state, not a populated customer dashboard.

This is partial evidence for `QUAL-WEB-006`, not a row closure. Paid/org
dashboard, customer acceptance, human screen-reader, large-dataset,
complete-state, and field-CWV requirements remain open. Score remains **230
checked / 50 unchecked / 280 total (82.1%)**. No AppSec, provider, legal,
customer, release, or final-acceptance gate changed. Evidence:
`docs/shipping/evidence/qual-web-006-account-state-lighthouse-2026-10-18.md`.

## 2026-10-18 · FINAL-WEB-004 public identity alignment

Web PR #181, assigned to `anuragyadav-git`, merged normally as
`9dd2ab30c83a31dc4769ac3818ed881595b54924` from implementation commit
`9895a94`. The remaining public identity surfaces now describe Verglos as the
local-first security decision layer between AI-generated code and release:
project notes, the root metadata keyword set, the legacy verification footer,
and the 2.0 direction page were aligned while Hunt/Attest qualification
wording remained explicit.

The clean disposable worktree passed truth-registry tests **31/31**, build
**47/47** pages, sequential typecheck, public-boundary audit, and
`git diff --check`. Hosted Actions run `39062039573` / job `117481808455`,
Vercel deployment `FqSTwTR7tqWRrvweofVsyMfxKyZZ`, GitGuardian, and Preview
Comments passed.

This is a real public implementation slice, not final acceptance. FINAL-WEB-004
remains unchecked for its complete command/docs truth and acceptance contract;
no AppSec, provider, customer, legal, hosted, field, release, or final-
acceptance row changed. Score remains **230 checked / 50 unchecked / 280 total
(82.1%)**. No squash, rebase, force-push, empty, duplicate, artificial, or
irrelevant public-document contribution commit was used. Evidence:
`docs/shipping/evidence/final-web-004-public-identity-pr181-2026-10-18.md`.

## 2026-10-18 · FINAL-WEB-004 security-layer demo truth implementation

Web PR #180, assigned to `anuragyadav-git`, merged normally as
`71278209a3715080655135b5668d968b1494ac3c` from substantive implementation
commit `e8ccfd2`. The public README now positions Verglos as the local-first
security decision layer between AI-generated code and release. The terminal
hero now demonstrates local scan evidence, an explicit policy decision,
qualification-gated Hunt, bounded evidence handoff, and zero source upload;
it no longer invents verified exploit findings or unsupported preview claims.

The clean disposable worktree passed truth-registry tests **31/31**, typecheck,
production build **47/47** pages, public-boundary audit, and `git diff --check`.
Hosted Actions run `39061642513` / job `117480656644`, Vercel deployment
`AavTFzJyMUoD8hiC76YkmbBJr3RC`, GitGuardian, and Preview Comments passed.

This is a real public implementation slice, not final acceptance. FINAL-WEB-004
remains unchecked for its complete command/docs truth and acceptance contract;
no AppSec, provider, customer, legal, hosted, field, release, or final-
acceptance row changed. Score remains **230 checked / 50 unchecked / 280 total
(82.1%)**. No squash, rebase, force-push, empty, duplicate, artificial, or
irrelevant public-document contribution commit was used. Evidence:
`docs/shipping/evidence/final-web-004-security-layer-demo-pr180-2026-10-18.md`.

## 2026-10-18 · CLI security-layer positioning implementation

CLI PR #128, assigned to `anuragyadav-git`, merged normally as
`50bcab42eadfa8796d86d1f7a8aaee3010c65647` from implementation commit
`8da4617d`. The public CLI root help, package metadata, root README, and
package README now position Verglos as the local-first security decision layer
between code changes and release, while retaining source privacy and explicit
qualification-gated Hunt wording.

The clean disposable worktree passed frozen install, workspace build **8/8**,
typecheck **14/14**, `pnpm --filter verglos test` with exit code 0,
public-boundary audit, and `git diff --check`. Hosted run `39060504633`
passed self-scan, in-toto, Ubuntu/macOS, and Windows Node 22/24; Windows Node
20 was still in progress at merge and is not claimed as green.

This is implementation evidence only. It advances the public truth work but
does not check FINAL-WEB-004 or any AppSec, provider, customer, legal, hosted,
field, release, or final-acceptance row. Score remains **230 checked / 50
unchecked / 280 total (82.1%)**. No squash, rebase, force-push, empty,
duplicate, artificial, or irrelevant public-doc contribution commit was used.
Evidence: `docs/shipping/evidence/cli-security-layer-positioning-pr128-2026-10-18.md`.

## 2026-10-18 · FINAL-WEB-001 security-layer truth implementation

Web PR #179, assigned to `anuragyadav-git`, merged normally as
`a85d6f360791baf09365b3308e34ea4fb1e2996c` after implementation commit
`8a630d1`. The public Web now positions Verglos as the local-first security
layer between AI-generated code and release, with the positioning reused by
the homepage, metadata, JSON-LD, and `/llms.txt`. The public truth registry
also validates plan states and the expanded machine-readable public claim
surface fail-closed against the canonical catalog.

Focused truth tests passed **31/31**, typecheck passed, the production build
generated **47/47** pages, `git diff --check` passed, and the public-boundary
audit passed. Hosted run `39059883830`, Vercel, GitGuardian, and Preview
Comments passed. The implementation preserved explicit qualification wording
for Hunt and Attest and did not change any AppSec or hosted-entitlement gate.

This is implementation and hosted-verification evidence only. FINAL-WEB-001
remains unchecked because its ACCEPT-009/010 and founder-command acceptance
dependencies remain open; no other row is checked by this slice. No squash,
rebase, force-push, empty, duplicate, artificial, or irrelevant public-doc
commit was used. The score remains **230 checked / 50 unchecked / 280 total
(82.1%)**. Evidence:
`docs/shipping/evidence/final-web-001-security-layer-truth-pr179-2026-10-18.md`.

## 2026-10-18 · TEAM-CLI-001 current-head policy revalidation

The exact public CLI head `fa77496b43d040fe8be977315078502e9e85b947` was
revalidated in a clean disposable worktree. The workspace build passed **8/8**;
CLI typecheck passed; the shared/CLI organization-policy tests passed **10/10**
with zero failures or skips; and `git diff --check` passed. This confirms the
signed policy schema, active-key/digest binding, bounded fetch, atomic cache,
offline fallback, scope/tamper refusal, and credential-safe endpoint behavior.

TEAM-CLI-001 remains unchecked because production/Preview signer and trust-root
activation, live hosted fetch/cache/offline/cross-tenant evidence, and the
authorized SCM/provider event are still absent. TEAM-CLI-002 and TEAM-WEB-006
remain dependency-blocked. This is not an AppSec hold. No checkbox changed; the
score remains **230 checked / 50 unchecked / 280 total (82.1%)**. Evidence:
`docs/shipping/evidence/team-cli-001-policy-current-head-revalidation-2026-10-18.md`.

## 2026-10-18 · FINAL-WEB-002 landing flow implementation slice

Web PR #178, assigned to `anuragyadav-git`, merged normally as
`1c15a4861ee09bb1d5968424c3f553f310bb9ebd` after public commit `f8febea`
aligned the landing promise with the four-stage **Inspect → Decide → Prove →
Monitor** journey. The public flow now states local execution, bounded
assurance, and hosted qualification boundaries; unsupported hourly monitoring,
CVE-alert, and named-agent claims were removed. Local truth-registry tests
passed **29/29**, typecheck passed, the production build generated **47/47**
pages, and the public-boundary audit passed. Hosted run `39058985826` passed
the complete Web verification job; GitGuardian, Vercel, and Preview Comments
also passed.

This is implementation evidence only. FINAL-WEB-002 remains unchecked because
its FINAL-WEB-001 dependency and final acceptance contract remain open. No
AppSec-held row changed. The score remains **230 checked / 50 unchecked / 280
total (82.1%)**. Evidence:
`docs/shipping/evidence/final-web-002-flow-pr178-2026-10-18.md`.

## 2026-10-17 · PR #177 CI mirror repair and regular merge

Web PR #177, assigned to `anuragyadav-git`, merged normally as
`0674dacef52d35d1a2c8b103c3c3983e349ad339` after public commit `34e6010`
switched the verification workflow from the rate-limited Public ECR mirror to
the digest-preserving `mirror.gcr.io/library/postgres:15-alpine` cache. The
unchanged image-index digest is
`sha256:f7d23353e1b15400d22ebe31189f4d314b87a4c129cc400c8c2d8d4ca127bf81`.
The new hosted run `39058598234` passed the complete Web verification job;
GitGuardian, Vercel, and Preview Comments also passed. No checkbox changed:
FINAL-WEB-001/003/004 remain open for their full acceptance contracts and the
score remains **230 checked / 50 unchecked / 280 total (82.1%)**. Evidence:
`docs/shipping/evidence/final-web-001-pr177-ci-mirror-2026-10-17.md`.

## 2026-10-17 · Non-AppSec checklist reconciliation

The current audit found no fully satisfied non-AppSec row left open only
because the independent Hunt AppSec review is pending. Close each non-AppSec
row when its own complete implementation, evidence, and acceptance contract
passes; if a provider, customer, legal, release, field, or final-acceptance
artifact is genuinely missing, keep that row open with the exact artifact
named. Owner authorization does not substitute for row evidence. No checkbox
changed; score remains **230 checked / 50 unchecked / 280 total (82.1%)**.

## 2026-10-17 · FINAL-WEB-003 catalog-terms implementation slice

Web PR #177 commit `fa01830`, assigned to `anuragyadav-git`, projects canonical
plan billing/state and allowances into the homepage and docs, including an
explicit “No overage schedule published” value. Truth tests **29/29**,
typecheck, and the **47/47** page build passed. FINAL-WEB-003 remains open for
dependent acceptance; no checkbox changed and the score remains **230 checked /
50 unchecked / 280 total (82.1%)**.

## 2026-10-17 · FINAL-WEB-004 public docs truth implementation slice

Web PR #177 commit `7a56141`, assigned to `anuragyadav-git`, binds the public
docs plan matrix to the canonical catalog, adds Team, and replaces stale
paid-tier prices and planned-attestation wording with qualification-gated
language. Typecheck and build **47/47** passed; no checkbox changed and score
remains **230 checked / 50 unchecked / 280 total (82.1%)**. Evidence:
`docs/shipping/evidence/final-web-004-public-docs-truth-2026-10-17.md`.

## 2026-10-17 · PR #177 regular merge-base repair

Public Web PR #177, assigned to `anuragyadav-git`, is now `MERGEABLE` at
regular merge commit `609faa0` after incorporating the advanced public
`main` head. The existing substantive commits remain intact; no squash,
rebase, force-push, empty, duplicate, or artificial contribution commit was
used. The clean merged worktree passed truth tests **28/28**, typecheck, and
build **47/47** pages. This changes no checkbox; the live score remains **230
checked / 50 unchecked / 280 total (82.1%)**. Evidence remains limited to the
implementation/qualification records; the Hunt AppSec review is still the only
closed gate.

## 2026-10-17 · FINAL-WEB-003 canonical plan matrix implementation slice

Web PR #177, commits `b2b3d4a` and `4aa3310`, assigned to
`anuragyadav-git`, add the Team plan card and align the public
Free/Pro/Team/Studio/Enterprise capability matrix with the canonical catalog.
`/llms.txt` and the truth-registry tests record Team as inactive and
`Not purchasable`. Truth tests passed **28/28**, typecheck passed, and the
production build generated **47/47** static pages. This is implementation
progress only; no checkbox changed and score remains **230 checked / 50
unchecked / 280 total (82.1%)**. Evidence:
`docs/shipping/evidence/final-web-003-canonical-plan-matrix-2026-10-17.md`.

## 2026-10-17 · FINAL-WEB-001 public truth-registry implementation slice

Web PR #177, commit `5ada115`, assigned to `anuragyadav-git`, wires homepage
plan copy, root metadata, and `/llms.txt` to the canonical entitlement catalog
and adds a fail-closed homepage claim check. Truth tests passed **28/28**,
typecheck passed, and the production build generated **47/47** static pages.
This is implementation progress only; FINAL-WEB-001 remains open for the
complete public claim map and remaining acceptance artifacts. No checkbox
changed; score remains **230 checked / 50 unchecked / 280 total (82.1%)**.
Evidence:
`docs/shipping/evidence/final-web-001-public-truth-registry-2026-10-17.md`.

## 2026-10-16 · Hunt AppSec pinned Linux technical pass

The reviewer’s fresh Linux checkout at exact PR #127 merge
`fa77496b43d040fe8be977315078502e9e85b947` completed the pinned adversarial
suite with **96 pass / 2 skip / 0 fail** and exit `0`, using Node `v22.23.3`
and the required Postgres digest. The two skip names/reasons must be copied
from `run.log` into the independent report.

This is technical qualification only. The independent AppSec gate remains
open until the reviewer supplies organization, security role/experience,
explicit non-implementer confirmation, findings/limitations, a recommendation,
and verifiable sign-off. The two skips are the A2 target-code Docker checks;
the gate-ready rerun enables them with
`VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1`. No checkbox changed; score remains
**230 checked / 50 unchecked / 280 total (82.1%)**. Evidence:
`docs/shipping/evidence/hunt-appsec-source-inspection-vaibhav-2026-10-16.md`.

## 2026-10-16 · Hunt AppSec setup failure recorded

The first Step 4 attempt from fresh clone `/tmp/verglos-appsec.nBJjp0/verglos-cli`
did not run tests: `node_modules` was missing, `tsc` was not found, and pnpm
returned `spawn ENOENT`. The generated report was **0 pass / 0 skip / 0 fail**
with exit `1`, so it is not a security result and cannot open or fail the
AppSec gate. Install the frozen dependencies in this fresh clone and rerun
Step 4 into a new output directory. No checkbox changed; score remains **230
checked / 50 unchecked / 280 total (82.1%)**. Evidence:
`docs/shipping/evidence/hunt-appsec-source-inspection-vaibhav-2026-10-16.md`.

## 2026-10-16 · Hunt AppSec source-inspection evidence checkpoint

Vaibhav J’s reviewer transcript records the exact PR #127 merge
`fa77496b43d040fe8be977315078502e9e85b947`, successful frozen dependency
installation, the Linux/WSL2 Docker runtime, the pinned Postgres pull digest,
and inspection of all ten required Hunt/Docker source surfaces.

This does not satisfy the independent AppSec gate yet. The reviewer still must
provide organization, security role/experience, explicit non-implementer
confirmation, Step 4 `report.json`/`run.log`/terminal evidence, findings,
limitations, a recommendation, and a verifiable sign-off. HUNT-011,
QUAL-CLI-004, and dependent Hunt rows remain unchecked. No checkbox changed;
score remains **230 checked / 50 unchecked / 280 total (82.1%)**. Evidence:
`docs/shipping/evidence/hunt-appsec-source-inspection-vaibhav-2026-10-16.md`.

## 2026-10-15 · HUNT recipe fixture-contract PR #127 implementation checkpoint

Public CLI PR #127 merged normally as
`fa77496b43d040fe8be977315078502e9e85b947`, preserving contribution commits
`165aefae0ebc2bc7586ecbaf8e379ab92013a8ec` and
`2aaba53143865886e80334c4feb852fecbb58074`; the PR was assigned to
`anuragyadav-git`. The supported Hunt recipe catalog now exposes all five
shared fixture outcomes and validates their expected verdicts, while the CLI
and shared playbooks declare the unsupported outcome.

Hunt, CLI, shared, typecheck, public-boundary, diff, self-scan, in-toto, and
all 11 platform checks passed. This is a dependency-ready implementation
slice only. HUNT-008 through HUNT-011 and QUAL-CLI-004 remain unchecked for
supported-rule approval, trusted/licensed provenance, hosted entitlement,
authorized targets, independent AppSec review, `.vgl` binding, and final
acceptance. The AppSec runbook now pins the exact merge commit. No checkbox
changed; score remains **230 checked / 50 unchecked / 280 total (82.1%)**.
Evidence: `docs/shipping/evidence/hunt-recipe-fixture-contract-pr127-2026-10-15.md`.

## 2026-10-14 · LIC-003 / DIST-001 public PR #126 implementation checkpoint

Public CLI PR #126 merged normally as
`f1cd8269e642e5e24755e12e4308a2d6e3f349bc`, preserving contribution commits
`b9541157f9d46662ef9a170cc92f106eccf27ea3` and
`575275d8f7e0b487c8141fe11a4c3a44d4675dae`; the PR was assigned to
`anuragyadav-git`. The notice generator now falls back to installed pnpm
virtual-store manifests when the global license index is unavailable, and the
deterministic regression test covers that path. Focused release tests passed
**12/12**, the package inventory reported **250 packages / 254 versions / 1
bundled component / 7 review blockers**, the packed manifest audit passed
**7/7**, and the clean consumer installed all seven archives and executed the
bounded signed Hunt fixture.

This is a dependency-ready implementation slice only. `LIC-003` remains open
for LIC-002 legal/content decisions and final release qualification;
`DIST-001` remains open for LOCAL/HUNT/RECORD dependencies and complete final
package acceptance. Hosted in-toto, self-scan, and all nine
Ubuntu/macOS/Windows Node 20/22/24 checks subsequently completed successfully;
Windows was still in progress at the instant of merge but completed afterward.
No squash, rebase, force-push, empty/artificial
contribution commit, npm publication, tag, deployment, or production operation
was used. Score remains **230 checked / 50 unchecked / 280 total (82.1%)**.
Evidence: `docs/shipping/evidence/lic-003-dist-001-public-pr126-2026-10-14.md`.

## 2026-10-14 · QUAL-CLI-006 hosted platform matrix

The public CLI `Platform matrix` run `38550747564` passed at exact merge
`ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`: all nine Ubuntu/macOS/Windows ×
Node 20/22/24 jobs passed, as did the separate in-toto release-binding job.
This is hosted technical evidence only. `QUAL-CLI-006` remains unchecked for
trusted keyless publication identity, protected publication, legal clearance,
independent AppSec review, and final acceptance. No checkbox changed; score
remains **229 checked / 51 unchecked / 280 total (81.8%)**. Evidence:
`docs/shipping/evidence/qual-cli-006-hosted-matrix-2026-10-14.md`.

## 2026-10-14 · owner authority and AppSec-last backlog sequencing

Anurag Yadav, Owner of Top Notchh Solutions and Verglos
(`anuragyadav.work@gmail.com`), is the designated company/legal reviewer and
standing authority for company-controlled decisions in this backlog. Do not
ask the owner for another reviewer, operator, provider, customer, or approval
identity. Process and close every dependency-ready row whose own acceptance
criteria pass, regardless of the AppSec status.

The only separate human identity is the independent AppSec reviewer for
Hunt-dependent rows. A suitably security-competent roommate may perform that
review from a separate laptop against the exact unreleased public CLI commit
if they did not implement the reviewed Hunt boundary. Schedule AppSec last.
This is a sequencing rule, not permission to check rows without their actual
evidence. Score remains **228 checked / 52 unchecked / 280 total (81.4%)**.

## 2026-10-14 · explicit no-network Hunt decision

The owner decision record confirms that no networked Hunt recipe exception is
approved for this goal; the default remains deny. The corresponding non-commit
gate is checked. No Hunt implementation row is changed by this decision.
Score is **229 checked / 51 unchecked / 280 total (81.8%)**.

## 2026-10-14 · LIC-002 current-head technical recheck

The exact CLI head has a mechanical inventory of **250 package entries / 254
versions**, one nested component, and **7 unresolved review blockers**. The
license/notice/release-verifier tests passed **14/14** and generated notices
are digest-bound, but the legal addendum remains unsigned and undecided.
`LIC-002` remains unchecked; `QUAL-CLI-006` is next. No checkbox changed and
the score remains **228 checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`docs/shipping/evidence/lic-002-current-head-technical-recheck-2026-10-14.md`.

## 2026-10-14 · STUDIO-CLI-001 current merged-head recheck

The exact current CLI/Web heads pass the shared projection **4/4**, CLI
projection/record-project **5/5**, full CLI package command, Web
client/tenant/receipt/Studio contracts **62 pass / 1 explicit database skip /
0 fail**, and Web typecheck. `STUDIO-CLI-001` remains unchecked for
independent hosted-recipient redaction proof and authorized recipient/customer
acceptance. `LIC-002` is the next dependency-ready row; no checkbox changed and
the score remains **228 checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`docs/shipping/evidence/studio-cli-001-current-head-recheck-2026-10-14.md`.

## 2026-10-14 · TEAM-CLI-001 Preview provider-readiness audit

The read-only Vercel/GitHub audit confirms Preview signer/test-auth key names
but no `VERGLOS_GITHUB_*` App configuration, and no dedicated Verglos SCM App
installation in the Top Notchh Solutions organization. `TEAM-CLI-001` remains
unchecked for its provider installation, repository/project binding, published
Preview policy, and authenticated signed CLI fetch/cache/offline/cross-tenant
evidence. No checkbox changed; score remains **228 checked / 52 unchecked /
280 total (81.4%)**. Evidence:
`docs/shipping/evidence/team-cli-001-preview-provider-readiness-2026-10-14.md`.

## 2026-10-14 · HUNT-008 current merged-head Docker qualification

The exact public CLI merge head `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`
passed the direct pinned Docker runtime checks (**18 pass / 1 explicit macOS
namespace skip**) and the ten-family target-harness groups (**4/4 pass**).
The baseline Hunt package command passed **78** with **19 explicit skips** and
zero failures. This is local technical qualification only; HUNT-008 remains
unchecked for supported-rule approval, trusted/licensed provenance, hosted
entitlement, authorized target evidence, independent AppSec review, `.vgl`
binding, and final acceptance. No checkbox changed; score remains **228
checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`docs/shipping/evidence/hunt-008-current-head-docker-qualification-2026-10-14.md`.

## 2026-10-14 · ACCEPT-002 current merged-head substrate verification

The private twelve-story acceptance verifier passed against CLI
`ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a` and Web
`a54d70dfacfaf9506b1336b788d9cd86c9ca74d7`: CLI **291/293** with 2 explicit
skips, Web **920/950** with 30 explicit skips, and composed
Team/Studio/Enterprise/quality substrates **74/74**, all with zero failures.
This is repository-owned substrate/regression progress only. `ACCEPT-002` and
`ACCEPT-003` remain unchecked for hosted/provider, customer/recipient,
independent-review, human browser/field-CWV, and account-deletion evidence.
No checkbox changed; score remains **228 checked / 52 unchecked / 280 total
(81.4%)**. Evidence:
`docs/shipping/evidence/accept-002-current-head-substrate-2026-10-14.md`.

## 2026-10-14 · HUNT-008 recipe fixture-contract implementation checkpoint (CLI PR #125)

Public CLI PR #125 merged normally as
`ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`, preserving contribution commits
`677233e57e514390afc44a5dd17222f156ca1b41` and
`b01f1a9d50063fe545cef11f46163033e2eb434b`. The public Hunt recipe schema
now requires five explicit bounded fixture references (positive, negative,
timeout, infrastructure failure, and unsupported), unique IDs, and fixed
expected verdicts. Public release-verification and clean-consumer scripts were
updated so shipped-package qualification uses the same contract.

CLI/shared/Hunt tests, workspace build 8/8, the Hunt fixture verifier,
public-boundary audit, protected run `38545037960`, and self-scan
`38545037969` passed. No squash, rebase, force-push, empty commit, or
artificial contribution activity was used.

This is a dependency-ready implementation slice, not complete HUNT-008
acceptance. Supported-rule approval, trusted/licensed recipe provenance,
authorized target/corpus evidence, host qualification, independent AppSec
review, dependent acceptance, `.vgl` binding, and final release criteria
remain open. No checkbox changed; score remains **228 checked / 52 unchecked /
280 total (81.4%)**. Evidence:
`docs/shipping/evidence/hunt-recipe-fixture-contract-pr125-2026-10-14.md`.

## 2026-10-14 · TEAM-CLI-001 policy-cache boundary hardening (CLI PR #124)

Public CLI PR #124 merged normally as
`4642f7d43141e23f0d73b7a245767393bb63d644`, preserving contribution commit
`cc27a121a13025977a78521d59192279e93799cb`. The organization-policy cache
now enforces a mode-0700 parent directory before atomic mode-0600 replacement,
and the fetch contract proves verified-cache fallback when the remote body
stalls after headers. Focused cache/fetch tests passed 7/7; the full CLI test
command, typecheck, build, public-boundary audit, protected platform/in-toto
run `38542000125`, and self-scan `38542000081` passed. No squash, rebase,
force-push, or artificial contribution activity was used.

This is code-side TEAM-CLI-001 progress only. Hosted signer/trust-root,
provider/repository binding, published policy, and authenticated live fetch/
cache/offline/cross-tenant evidence remain open. No checkbox changed; score
remains **228 checked / 52 unchecked / 280 total (81.4%)**. Evidence:
`docs/shipping/evidence/team-cli-001-policy-cache-boundary-2026-10-14.md`.

## 2026-10-14 · ENT-CLI-001 private-runner response-body timeout hardening

Public CLI PR #123 merged normally as
`e863307590f7bbecb8a2cb24b994f1825e1391d5`, preserving contribution commit
`dec59b6905208250fc288bf212725e6590596ff5`. The runner client now keeps the
bounded timeout active through poll/upload response-body reads and classifies
body-read aborts as bounded network failures. Focused tests passed 7/7; the
full CLI suite, build 8/8, typecheck 14/14, protected platform/in-toto run
`38539111651`, and public self-scan `38539111751` passed. No squash, rebase,
force-push, or artificial contribution activity was used.

This is implementation progress only. ENT-CLI-001 remains unchecked pending
operational enrollment and approved runner execution/result reconciliation,
cross-platform operational evidence, and independent review. Evidence:
`docs/shipping/evidence/ent-cli-001-private-runner-response-timeout-2026-10-14.md`.
No checkbox changed; score remains **228 checked / 52 unchecked / 280 total
(81.4%)**.

## 2026-10-14 · TEAM-CLI-001 repository-policy route hardening (Web PR #175)

Public Web PR #175 merged normally as
`a54d70dfacfaf9506b1336b788d9cd86c9ca74d7`, preserving contribution commit
`aace29cf223f41532403fd4e03666b6f68ac3fb3`; no squash, rebase, force-push,
or artificial activity was used. The repository-bound organization-policy
route now returns the documented private `503 policy unavailable` response
when database initialization fails, and the SCM contract suite covers the
complete auth, tenant, repository, policy, signer, digest, cache, and
fail-closed boundary.

Focused route contracts passed 8/8; the full Web suite passed 876 with 24
explicit skips and 0 failures; TypeScript, production build, hosted Verify
run `38538138834`, Vercel Preview, Preview Comments, GitGuardian, dependency,
SBOM, license, public-boundary, and tracked-secret checks passed. Evidence:
`docs/shipping/evidence/team-cli-001-policy-route-initialization-hardening-2026-10-14.md`.

This is code-side TEAM-CLI-001 progress only. Provider installation and
repository binding, published Preview policy, authenticated signed CLI
fetch/cache/offline/cross-tenant evidence, and other row acceptance criteria
remain open. No checkbox changed; score remains **228 checked / 52 unchecked /
280 total (81.4%)**.

## 2026-10-14 · owner authorization and AppSec review scheduling boundary

Anurag Yadav, Owner of Top Notchh Solutions and Verglos, authorized the bounded shipping
operations recorded in
`docs/shipping/evidence/owner-authorization-2026-10-14.md`. Codex may continue
dependency-ready implementation, Preview/fixture/runner qualification, and
private evidence work without asking for the same setup choices again.

The independent AppSec reviewer is the only additional human identity still
needed for the Hunt review. The review targets the exact public CLI source
commit and Hunt execution/Docker/Linux boundary; it does not require a
published npm package or a whole-product audit. Until the signed report
exists, HUNT-011, QUAL-CLI-004, and dependent Hunt/release claims remain
unchecked. This does **not** make AppSec a master dependency for unrelated
rows: each non-Hunt row still requires its own provider, legal, customer,
field, commercial, or release evidence. No checkbox or score changed.

Live score remains **228 checked / 52 unchecked / 280 total (81.4%)**.

## 2026-10-13 · HUNT Docker adversarial-boundary checkpoint (PR #122)

Public PR #122 merged normally into `main` as
`4d91c616b8744676220a48930034f20a7a64ee6a`, preserving contribution commit
`00fc6b29c29d054579985953acc824dd3fc741e1` as the second merge parent. The
public Hunt Docker qualification now asserts additional deny-by-default
controls and pinned-runtime boundaries for kernel devices, Linux
capabilities, restrictive writable scratch space, PID/CPU cgroups, and PID,
IPC, mount, network, and UTS namespaces where the host supports them. The
Linux-only namespace limitation remains explicit.

Protected platform/in-toto run `38394513090` and self-scan run `38394513092`
passed all eleven required checks after the sole Ubuntu Node 20 clean-consumer
timeout was rerun successfully. Evidence:
`docs/shipping/evidence/hunt-docker-adversarial-hardening-pr122-2026-10-13.md`.

This is the dependency-ready HUNT-011 implementation/qualification slice, not
complete HUNT-011 acceptance. Independent review, trusted/licensed recipe
provenance, and dependent row acceptance remain open; HUNT-011 and dependent
HUNT rows remain unchecked. The live score remains **228 checked / 52
unchecked / 280 total (81.4%)**.

## 2026-10-13 · HUNT MCP/CLI contract checkpoint (PR #121)

Public PR #121 merged normally into `main` as
`95ecf1bad7ff1cee69cf49eee2d0a4946c15bb0b`, preserving the contribution
commits `3eb4defecd8e76601619b276e0509c42a8e6299d` and
`d1b189e2458b10394fe956dc2cc84073d429fe1c` through a two-parent merge. The
MCP/CLI Hunt execution projection now carries exact subject, observation,
rule, recipe, trust-policy, and approval bindings, emits schema-validated
record-native verification-attempt projections, and fails closed when a
report finding's rule would widen the approved recipe. The packed consumer
fixture records the exact rule binding required by this contract.

Evidence:
`docs/shipping/evidence/hunt-mcp-contract-pr121-2026-10-13.md`.

This is the dependency-ready MCP/CLI contract implementation slice, not
complete HUNT-008, HUNT-009, HUNT-010, or HUNT-011 acceptance. The rows remain
unchecked for complete per-family authorized target acceptance, supported-rule
approval, trusted/licensed treatment, hosted entitlement/provider
confirmation, required Linux/Docker qualification, independent review, `.vgl`
binding, and final release acceptance. The live score remains **228 checked /
52 unchecked / 280 total (81.4%)**.

## 2026-10-13 · HUNT Release Auditor checkpoint (PR #119)

Public PR #119 merged normally into `main` as
`88e95586e2e04a5d981e7dd928778d3c01468d3b`, preserving contribution commit
`bd4d9071d71776fda1e590b5a7e950cee0241fb5`. The public Hunt proof/retest
outputs now carry a versioned release-evidence contract, and the read-only
`verglos hunt audit` path binds exact subject, observation, finding, rule,
recipe, trust-policy, approval, and verification-attempt identities in a
complete Release Record. Protected checks passed.

Evidence:
`docs/shipping/evidence/hunt-release-audit-pr119-2026-10-13.md`.

This is the dependency-ready Release Auditor implementation slice, not
complete HUNT-008 or HUNT-009 acceptance. Both rows remain unchecked for
complete per-family authorized target acceptance, supported-rule approval,
trusted/licensed treatment, hosted entitlement/provider confirmation,
required Linux/Docker qualification, independent review, and final release
acceptance. HUNT-010/011 are unchanged. The live score remains **228 checked
/ 52 unchecked / 280 total (81.4%)**.

## 2026-10-13 · HUNT Attack Worker checkpoint (PR #115)

Public PR #115 merged normally into `main` as
`e726dacce46fda46024f38e0c68005dcadcd5eb5`, preserving source commits
`c24f3555c7533139cf2a050aa38760fa30d961b4` and
`8ac34aa7baf9d0376731612de98339e296759826`. The contribution verifies the
canonical hypothesis digest, consumes the exact report finding and fixed
catalog playbook, enforces signed trust/entitlement/approval/observation
bindings, selects only a registered bounded adapter, and exposes the
privacy-limited `verglos hunt worker` CLI path. Protected self-scan, in-toto,
and all nine platform cells passed.

Evidence:
`docs/shipping/evidence/hunt-attack-worker-pr115-2026-10-13.md`.

This is the dependency-ready Attack Worker implementation slice, not complete
HUNT-008 or HUNT-009 acceptance. The worker result explicitly leaves
independent proof/counterexample, remediation/retest, trusted/licensed
provenance, hosted entitlement, isolation qualification, independent review,
and final release acceptance open. HUNT-008 through HUNT-011 remain unchecked;
the live score remains **228 checked / 52 unchecked / 280 total (81.4%)**.

## 2026-10-13 · HUNT Attack-Hypothesis planner checkpoint (PR #114)

Public PR #114 merged normally into `main` as
`6ff8c6cb3157077b3eeb6b2ca5f9754cc1f9360e`, preserving source commits
`a2c71f8db3dcdc1c3cb44279385777163e62c470` and
`7063b21fa3da0285681e2ac6289180e45f29449c`. The contribution maps an exact
finding and Scout manifest to a deterministic public-catalog hypothesis,
exposes bounded `verglos hunt hypothesis` CLI input, and never executes a
recipe or establishes proof. All protected checks passed.

Evidence:
`docs/shipping/evidence/hunt-attack-hypothesis-pr114-2026-10-13.md`.

This is the dependency-ready Scout-to-Attack-Hypothesis implementation slice,
not complete HUNT-008 or HUNT-009 acceptance. Their rows remain unchecked for
trusted/licensed provenance, hosted entitlement, authorized target execution,
positive/negative proof and retest, isolation qualification, independent
review, and final release acceptance. No checkbox changed; the live score
remains **228 checked / 52 unchecked / 280 total (81.4%)**.

## 2026-10-13 · HUNT Scout target manifest checkpoint (PR #113)

Public PR #113 merged normally into `main` as
`a399d00317dc495613483b934bb01f30f3ec5bb8`, preserving feature head
`3dae438e35d197d53c622495ec6718fabe8b53ae` and prior `main`
`14d82d6d58547844084320121d390b79e0274103`. The contribution adds a bounded
offline `verglos hunt scout <project> --json` target manifest for subject
identity, frameworks, entrypoints, route/API candidates, dependency
boundaries, MCP candidates, and candidate sinks. Protected self-scan,
in-toto, and all nine platform cells passed.

Evidence:
`docs/shipping/evidence/hunt-scout-target-manifest-pr113-2026-10-13.md`.

This is a Scout/Context implementation contribution, not complete HUNT-008 or
HUNT-009 acceptance. No checkbox changed; the live score remains **228 checked
/ 52 unchecked / 280 total (81.4%)**.

## 2026-10-13 · HUNT-008-R10 target-family checkpoint

Public PR #112 merged normally into `main` as
`14d82d6d58547844084320121d390b79e0274103` from
`8eebc1d70c9ba30e304545907a72f99eec480fbb`. The sanitized Agent/MCP target
fixture now binds an explicit capability receipt to tool/input scope and
rejects replay of the same single-use receipt. Docker target qualification
passed 4/4, CLI Hunt passed 6/6, and protected CI passed.
Evidence: `docs/shipping/evidence/hunt-a2-r10-agent-replay-pr112-2026-10-13.md`.

This is an implementation contribution, not complete HUNT-008 acceptance.
No checkbox changed; the live score remains **228 checked / 52 unchecked / 280
total (81.4%)**.

## 2026-10-13 · HUNT-008-R9 target-family checkpoint

Public PR #111 merged normally into `main` as
`c560b6a728a248f5b3c7a8ed727e366134610ac0` from
`8c1af9701296e8aaedd840c399f8b659469f91d9`. The contribution adds signed
`D4-001` and `D6-001` descriptors plus synthetic credential-use and
disposable metadata-only supply-chain harnesses. Docker target integration
passed 3/3, the public CLI all-family test passed 6/6, and protected CI passed.
Evidence: `docs/shipping/evidence/hunt-a2-r9-secret-supply-pr111-2026-10-13.md`.

This is an implementation contribution, not complete HUNT-008 acceptance.
No checkbox changed; the live score remains **228 checked / 52 unchecked / 280
total (81.4%)**.

## 2026-10-13 · Full-product paying-value synchronization

The private `FINAL_V1_PAYING_VALUE_BLUEPRINT_2026-10-13.md` now documents the
customer outcome and acceptance bar for every Final V1 surface and plan. It
cross-links local CLI/npm, TS/JS scanner domains, dependency and secret
analysis, provenance/SBOM/Trivy, IaC, MCP, Hunt, Attest and `.vgl` records,
Web, organizations, GitHub/GitLab, Studio, Enterprise, billing, distribution,
and quality requirements to the existing backlog families.

This is a cross-reference and commercial-clarity update only. It does not add,
remove, or check a counted row. The live score remains **228 checked / 52
unchecked / 280 total (81.4%)**. A row still requires its own implementation,
test, privacy boundary, exact commit/deployment, limitations, and complete
acceptance evidence.

## 2026-10-13 · A2 target-code qualification checkpoint

Public PR #106 merged into `main` as
`a413df2f567e377130b1d4d492bf8a610c8b6040`. The seven public-safe A2 target
modules passed the pinned Docker positive/negative/unsupported matrix (21
family/case executions), with protected self-scan, in-toto, and the full
Ubuntu/macOS/Windows Node 20/22/24 matrix green. This is technical evidence
only; HUNT-008 remains open for approval, legal release treatment, hosted
entitlement, isolation/review, and final acceptance.

Evidence:

- `docs/shipping/evidence/hunt-a2-target-code-qualification-pr106-2026-10-13.md`

The live score remains **228 checked / 52 unchecked / 280 total (81.4%)**.
No checkbox changed.

## 2026-10-13 · Hunt catalog identity checkpoint

The exact public catalog identity for all 15 descriptors is now recorded at
merged public head `1b1ea0b08ecad1b18cfd3736252fa81f0161aa49`, including source,
descriptor, harness, and image digests. This closes only the source-identity
collection subtask; HUNT-008 remains open for approval, legal release
treatment, target-code qualification, hosted entitlement, isolation,
independent review, and final acceptance.

Evidence:

- `docs/shipping/evidence/hunt-recipe-catalog-provenance-2026-10-13.md`

The live score remains **228 checked / 52 unchecked / 280 total (81.4%)**.
No checkbox changed.

## 2026-10-13 · Current A2 direct-outcome checkpoint

Public PR #104 added direct timeout and adapter-failure process fixtures to
all seven A2 reference harnesses. The protected self-scan, in-toto binding,
and all nine platform cells passed, and the change was squash-merged into
public `main` as
`1b1ea0b08ecad1b18cfd3736252fa81f0161aa49`. This advances direct fixture
evidence only; HUNT-008 remains open for target-code acceptance,
provenance/licensing, hosted entitlement, Linux/Docker adversarial proof,
independent review, and release treatment.

Evidence:

- `docs/shipping/evidence/hunt-a2-direct-outcomes-pr104-2026-10-13.md`

The live score remains **228 checked / 52 unchecked / 280 total (81.4%)**.
No checkbox changed.

## 2026-10-13 · Current A2 adapter-failure checkpoint

Public PR #103 corrected the bounded Docker adapter's timeout and
infrastructure-failure classification for all seven A2 families. The protected
self-scan and platform matrix passed, and the change was squash-merged into
public `main` as
`6ff1bd1ee345c9b0f880bf1dfb85045a14be820f`. This advances technical evidence
only; it does not satisfy HUNT-008's target-code, provenance, entitlement,
Linux/Docker, review, or release gates.

Evidence:

- `docs/shipping/evidence/hunt-a2-adapter-failure-matrix-pr103-2026-10-13.md`

The live score remains **228 checked / 52 unchecked / 280 total (81.4%)**.
No checkbox changed.

## 2026-10-13 · Current A2 and TEAM-CLI evidence checkpoint

PR #102 adds positive, negative, and unsupported fixture outcomes to all seven
A2 reference harnesses, passed the attached self-scan/platform matrix, and
was merged into public `main` as
`17393d9e0f4deeac33517800460a8606682332a1`. Direct pinned-Docker execution
passed all 21 combinations. Preview now has a
signer-configured deployment, but its policy route correctly returns
fail-closed 503 because the isolated database has no SCM installation or
published policy row. These are implementation/evidence updates only;
HUNT-008 and TEAM-CLI-001 remain unchecked.

Evidence:

- `docs/shipping/evidence/hunt-a2-fixture-outcome-matrix-pr102-2026-10-13.md`
- `docs/shipping/evidence/team-cli-001-preview-signer-deployment-2026-10-13.md`

The live score remains **228 checked / 52 unchecked / 280 total (81.4%)**.
No checkbox changed.

## 2026-10-13 · Final V1 feature-to-backlog coverage synchronization

The approved contract is now mapped in
`docs/shipping/FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md`. That matrix is
the cross-reference for every company feature; this file remains the only
source of checkbox state.

The mapped feature families are: local JS/TS scanning and the ten security
domains; dependency, provenance, SBOM, import, and Trivy evidence; bounded
Hunt; MCP/AI controls; Attest and portable Release Records; Free, Pro, Team,
Studio, and Enterprise entitlements; Cards-only prepaid billing/manual
renewal; Web privacy/accessibility/performance; Verglos organization and
GitHub/GitLab binding; Studio/Enterprise controls; package distribution and
provenance; and final acceptance/Point-5 public TypeScript/JavaScript corpus.

Hunt recipe sub-scopes `HUNT-008-R1` through `HUNT-008-R7` (injection,
command, path/file, SSRF, agent/MCP, safe XSS, and authorization/tenant
fixtures) are matrix sub-scopes owned by the existing HUNT rows, not extra
counted checkboxes. The supported catalog contains eight deterministic A1
fixture probes and seven A2 target-harness descriptors using a pinned Docker
execution path. The A2 catalog/protocol and sanitized reference harnesses are
implemented, with full per-family fixtures, provenance, bounded qualification,
and acceptance evidence still open. The four Hunt roles are architecture
roles, not four already running autonomous AI agents.

**Live score:** **228 checked / 52 unchecked / 280 total (81.4%)**. No
checkbox changed in this documentation synchronization. Every later closure
still requires the row's implementation, test, privacy boundary, exact
commit/deployment, limitations, and complete acceptance evidence.

**Private/public boundary:** private backlog, evidence, ledgers, consent,
legal records, provider details, credentials, and customer data must never be
copied into the public `verglos-cli` repository. Only public-safe code and
sanitized documentation may be proposed there.

## 2026-10-13 · A1 bounded fixture-probe catalog merged (PR #96)

Public PR #96 merged at
`9900ebb4f051595c202d11645f91a47f9bd85114`. The A1 catalog then contained five
deterministic built-in fixture probes and explicit positive, negative, timeout,
and adapter-failure outcomes. The protected platform matrix, self-scan, and
in-toto binding passed.

This implementation does not close `HUNT-008`: the seven target-code recipe
sub-scopes, supported-rule approval, provenance/licensing, hosted entitlement,
Linux/Docker qualification where required, independent review, and final
release treatment remain open. No checkbox changed; the live score remains
**228 checked / 52 unchecked / 280 total (81.4%)**.

Evidence:
`docs/shipping/evidence/hunt-a1-fixture-catalog-pr96-2026-10-13.md`.

## 2026-10-13 · A1 recipe-family fixture catalog merged (PR #97)

Public PR #97 merged at
`f207240b3370222ee8c36b0dd13029b7d5a1c4ee`. The A1 catalog now contains
eight deterministic built-in fixture probes: UTF-8 containment, path
traversal, command-injection shape, private/local SSRF classification,
tenant-boundary mismatch, SQL injection shape, safe XSS shape, and
Agent/MCP tool-boundary mismatch. Each declares positive, negative, timeout,
and adapter-failure outcomes.

This adds fixture-level coverage for the remaining approved recipe sub-scopes;
it does not claim target-code execution, database/browser/tool execution, or
autonomous AI agents. The public protected matrix, self-scan, in-toto binding,
build, tests, and typechecks passed. Sixteen Linux/Docker integration cases
remain explicit skips pending the pinned integration image and Linux run.

`HUNT-008` remains open for target-code recipe treatment, provenance/licensing,
supported-rule approval, hosted entitlement, required isolation assurance,
independent review, and final release acceptance. No checkbox changed; the
live score remains **228 checked / 52 unchecked / 280 total (81.4%)**.

Evidence:
`docs/shipping/evidence/hunt-a1-recipe-family-catalog-pr97-2026-10-13.md`.

## 2026-10-13 · TEAM-CLI-001 organization-policy endpoint hardening merged (PR #95)

Public CLI PR #95 merged as
`d989b88a1855adc3bf54c6f2856c5b90ddca41f2`. The organization-policy client
now rejects external, protocol-relative, malformed, and oversized caller-
supplied endpoints before attaching credentials or making a request. The
complete CLI build/test process passed and the regression test observed zero
requests on rejection.

This is code-side transport hardening only. `TEAM-CLI-001` remains unchecked
pending hosted signer/trust-root activation, a mapped tenant, authorized
repository binding, a canonical policy row, and live signed fetch/cache/
offline/cross-tenant evidence. No checkbox changed; score remains **228
checked / 52 unchecked / 280 total (81.4%)**.

Evidence:
`docs/shipping/evidence/team-cli-001-endpoint-hardening-2026-10-13.md`.

## 2026-10-13 · HUNT-008 four-case fixture verifier merged (PR #94)

Public CLI PR #94 merged at
`53448684f6c3004ee1490d40ea2cae74ee199af2`. The normal-Node verifier now
retains direct positive, negative, timeout, and adapter-failure results for
the first-party A1 `a1-utf8-contains` recipe and runs in self-scan plus every
macOS/Ubuntu/Windows × Node 20/22/24 matrix cell. Build, typecheck, full
tests, self-scan, in-toto binding, and all nine platform cells passed.

This closes the missing direct fixture-run evidence only. HUNT-008 remains
unchecked for supported-rule approval and final legal/release treatment;
HUNT-009–011 and QUAL-CLI-004 remain downstream for hosted capability,
Linux/Docker isolation, and independent review. No checkbox changed. Score
remains **228 checked / 52 unchecked / 280 total (81.4%)**.

Evidence:
`docs/shipping/evidence/hunt-a1-utf8-contains-fixtures-2026-10-13.md`.

## 2026-10-13 · Public Hunt handoff merged (PR #92)

PR #92 merged the public `scan --hunt` handoff at
`b49375b03435a77f363b5bfda49a303f491da098`. A scan can now produce the exact
signed-input execution command for the bounded A1 runtime, while the CLI keeps
entitlement, trust-store, approval, and exact finding bindings fail-closed.
Protected cross-platform checks and packed-consumer qualification passed.

This is implementation evidence, not automatic checklist completion. The
remaining Hunt and Point-5 rows still require their own acceptance evidence,
including hosted plan entitlement, approved/licensed recipe provenance,
Linux/Docker isolation coverage, independent review, and final corpus
acceptance. No checkbox changed; the live score remains **228 checked / 52
unchecked / 280 total (81.4%)**.

Evidence:
`docs/shipping/evidence/hunt-public-handoff-2026-10-13.md`.

## 2026-10-13 · Point-5 packed public corpus provenance addendum

The packed seven-package `2.0.0-alpha.1` consumer now has provenance-enabled
scans for public NodeGoat and Juice Shop fixtures at exact recorded commits.
Both exited 0 with complete coverage; supplementary packed scans also ran on
nodejs-goof and DVNA with provenance intentionally disabled. No source or
finding upload occurred. This strengthens Point 5 but does not satisfy its
remaining corpus, plan, Hunt, Docker/Trivy, hosted, or acceptance conditions.
No checkbox changed; the live score remains **228 checked / 52 unchecked /
280 total (81.4%)**.

Evidence:
`docs/shipping/evidence/point-5-packed-public-corpus-addendum-2026-10-13.md`.

## 2026-10-12 · Approved contract synchronization

The approved Final V1 contract is
`FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md`. The current goal
executes Points 1–5 and stops after the public TypeScript/JavaScript npm
qualification corpus. Publication, held-out POC/experiments, and the final
release decision are deferred to the next goal.

**Live score at synchronization:** 228 checked / 52 unchecked / 280 total
(81.4%). No checkbox was changed by this documentation update. Every future
checkbox still requires implementation, tests, real evidence, and the row's
acceptance conditions.

### Public packed Hunt runtime qualification — 2026-10-12

Public CLI commits `6762bf41`, `9945c5a9`, and `78251d1b` (PR #91, merged to
public `main` as `13ee73b5dbe2d0e40ff3e47dab692ca3426f90ef`) now ship the bounded
`@verglos/hunt` package and wires the packed CLI/MCP path to the signed A1
recipe executor. Seven public archives passed the package-surface, manifest,
clean-consumer, and release-verifier checks. The exact packed CLI executed
the signed A1 recipe with a temporary local Pro capability fixture: execution
was authorized, network was denied, source access was none, and the expected
confirmed fixture finding returned exit 1. Without the capability fixture,
the same binary returned `CAPABILITY_REQUIRED`.

Evidence: `docs/shipping/evidence/hunt-public-package-runtime-2026-10-12.md`.

This is implementation and qualification progress only. The local fixture is
not hosted entitlement evidence; its legal clearance is explicitly false and
its A1 worker is not an OS/security isolation boundary. Licensed recipe
provenance, Linux namespace coverage, independent AppSec review, and final
release acceptance remain open. No checkbox changed; score remains
**228 checked / 52 unchecked / 280 total (81.4%)**.

### Technical progress recorded — HUNT-008 through HUNT-011

On shipping-worktree commit `04b9a2b333a7dab8370ab40ae26f46c6b10a0156`, the
pinned Docker adversarial suite passed **60 / skipped 1 / failed 0** on Docker
`29.7.2`, and the shared, CLI, and MCP Hunt test commands exited 0. Evidence:

- `docs/shipping/evidence/hunt-docker-adversarial-2026-10-12.md`
- `docs/shipping/evidence/hunt-cli-mcp-path-2026-10-12.md`

This is repository-owned technical evidence only. HUNT-008 remains open for
trusted/licensed recipe provenance and independent review; HUNT-009–011 and
QUAL-CLI-004 remain downstream and unchecked. Score remains **228/52/280**.

### Point-5 qualification progress — public npm package

The locally packed `2.0.0-alpha.1` package passed the six-archive manifest and
clean-consumer checks, then scanned one public JavaScript repository and one
public TypeScript repository from an isolated HOME with complete coverage and
exit 0. Evidence:
`docs/shipping/evidence/point-5-public-npm-repository-qualification-2026-10-12.md`.
This does not close Point 5 or any backlog checkbox; the remaining corpus,
TopNotchh forks, plan paths, and final acceptance are still required.

## 2026-10-11 · QUAL-WEB-006 authenticated account recheck

The current authenticated Production account shell passed desktop/mobile
Lighthouse Accessibility and Best Practices **100/100**, keyboard traversal
through all nine named controls with visible focus, mobile `390x844` no-
overflow, empty console, successful target resources, and a clean account
trace of LCP **483 ms**, TTFB **72 ms**, and CLS **0.00**. Focused Web
qualification/account/organization contracts passed **37/37**.

`QUAL-WEB-006` remains unchecked because human screen-reader,
paid-organization/large-dataset, and field-CWV evidence are still missing. No
checkbox or score changed. Score remains **228 checked / 52 unchecked / 280
total (81.4%)**.

Evidence:
`docs/shipping/evidence/qual-web-006-account-recheck-2026-10-11.md`.

## 2026-10-11 · DIST-001 public package boundary recheck

The current CLI shipping head `0ef96caa` rebuilt all six public packages. The
source audit passed, six `2.0.0-alpha.1` archives were created, packed
manifests passed, package contract tests passed **8/8**, and a clean consumer
installed/imported all six and ran the CLI with no implicit engine cache.
`DIST-001` remains unchecked because its LOCAL/HUNT/RECORD dependencies and
final legal/trusted-publication/release qualification are not complete.

Score remains **228 checked / 52 unchecked / 280 total (81.4%)**.

Evidence:
`docs/shipping/evidence/dist-001-package-boundary-current-2026-10-11.md`.

## 2026-10-11 · ACCEPT-002/003 current shipping-worktree substrate recheck

The private 12-story verifier passed against CLI `0ef96caa` and Web `d4dd7f9`:
CLI **274/274**, Web **923/953** with 30 explicit environment-gated skips,
and composed acceptance substrates **74/74**. This is repository-owned
substrate evidence only; hosted/provider/customer, human browser/field-CWV,
account-deletion, legal, and independent-review requirements remain open.
`ACCEPT-002` and `ACCEPT-003` stay unchecked.

Score remains **228 checked / 52 unchecked / 280 total (81.4%)**.

Evidence:
`docs/shipping/evidence/accept-002-current-shipping-worktree-2026-10-11.md`.

## 2026-10-11 · QUAL-CLI-006 process-entry repair qualification addendum

The shared CLI process-test harness now resolves the actual package entry after
commit `0ef96caa` repaired the invalid monorepo-root `src/index.ts` path.
Record create/verify passed **11/11**, the full focused release qualification
set passed **34/34**, Turbo typecheck/build passed **12/12**, and the diff check
passed. This is implementation/test progress only: trusted keyless release
identity, protected publication, legal clearance, independent review, and final
acceptance remain open, so `QUAL-CLI-006` stays unchecked.

Score remains **228 checked / 52 unchecked / 280 total (81.4%)**.

Evidence:
`docs/shipping/evidence/qual-cli-006-process-entry-repair-2026-10-11.md`.

## 2026-10-11 · PLAN-WEB-012 accepted · Final V1 prepaid lifecycle

The lifecycle item is reconciled to the Final V1 contract: paid access is a
one-time Cards-only fixed term with customer-initiated manual renewal, and
automatic recurring subscription renewal is not a customer promise. The
accepted isolated Preview/Docker evidence covers capture, failure/no-grant,
full/partial refund, expiry projection, replay/out-of-order, retry,
exactly-once behavior, and the second one-time renewal order. Existing
subscription cancellation/replay evidence remains compatibility-boundary
coverage only.

Score is now **227 checked / 53 unchecked / 280 total (81.1%)**.

Evidence:
`docs/shipping/evidence/plan-web-012-final-v1-lifecycle-reconciliation-2026-10-11.md`.

## 2026-10-11 · PLAN-WEB-015 accepted · Production Cards-only contract

The read-only Production reconciliation now confirms the Final V1 contract:
the environment method catalog is exactly `card`, `/checkout` returns HTTP
200 with Cards only, and the live page exposes neither Test Mode nor any
non-card method. Checkout was not submitted and no Production payment,
database, migration, entitlement, account, organization, or customer-data
write occurred. The provider lifecycle is already qualified in isolated
Preview under `PLAN-WEB-014`.

Score is now **226 checked / 54 unchecked / 280 total (80.7%)**.

Evidence:
`docs/shipping/evidence/plan-web-015-production-cards-only-display-2026-10-11.md`.

## 2026-10-11 · PLAN-CLI-003 accepted · isolated paid modified-client matrix

The authenticated modified/untrusted client matrix is now accepted in
isolated Preview. The hosted run used an active isolated Pro fixture and
exercised forged plan, capability, tenant, usage/query, organization/project,
record/list, search, download/export, and public/private cache boundaries. It
also created one bounded acceptance organization and test project in the
isolated database; no Production state changed. The 27-request hosted matrix
had 0 transport errors, and the paid bearer matrix kept the server-owned Pro
projection despite forged Enterprise input. Focused Web boundary verification
passed **40/41** with one explicit environment-gated skip and zero failures;
the stale organization-entry test assertion was aligned in Web `003def6`.

Score is now **225 checked / 55 unchecked / 280 total (80.4%)**.

Evidence:
`docs/shipping/evidence/plan-cli-003-preview-paid-modified-client-matrix-2026-10-11.md`.

## 2026-10-11 · PLAN-WEB-014 accepted · Preview prepaid Cards-only lifecycle

The Final V1 one-time prepaid Cards-only lifecycle is now qualified in the
isolated Preview/Test Mode path. Two hosted card captures reached the signed
webhook and isolated payment→ledger→license path; the first completed a real
full refund; the second is a customer-initiated manual-renewal order and
completed a real partial refund. Failed one-time order rows have no license.
Fresh disposable Docker PostgreSQL integration passed **6/6** and the focused
non-database payment suite passed **29/29** with one explicit environment-gated
skip and zero failures, covering replay, ordering, retry, expiry, and
exactly-once behavior.

The automatic recurring-card promise is not part of Final V1. `PLAN-WEB-015`
remains open for the separate Production Cards-only contract/reconciliation
checkpoint. Score is now **224 checked / 56 unchecked / 280 total (80.0%)**.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-prepaid-cards-lifecycle-2026-10-11.md`.

## 2026-10-11 · PLAN-WEB-014 Preview full-refund webhook reconciliation

The full Test Mode refund left processing and is now provider-reported as
`processed`. The current isolated Preview received the signed
`refund.processed` delivery and returned HTTP **200**. The isolated database
projects the matching payment to `refunded` with the complete refund watermark,
and the linked paid-time license remains active through its existing expiry as
required by the current refund contract. No direct database edit or synthetic
provider event was used.

This supersedes the earlier pending-refund observation and proves one real
provider-generated full-refund path. `PLAN-WEB-014` and Gate 4 remain open for
failure/recovery, expiry, a second manual-renewal order, replay/out-of-order,
timeout/retry, and complete exactly-once reconciliation. Score remains **223
checked / 57 unchecked / 280 total (79.6%)**; no checkbox changed.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-cards-refund-processed-2026-10-11.md`.

## 2026-10-11 · PLAN-WEB-014 Preview capture and signed webhook qualification

With the isolated Preview webhook target enabled before payment, the official
Razorpay Test Mode domestic card fixture completed the canonical Cards-only
monthly order. Razorpay showed **Captured**; the signed webhook route returned
HTTP **200**; the read-only order-status route returned HTTP **200**; and the
browser reached Pro activation. A full Test Mode refund was then issued, but
the provider currently reports it as processing, so `refund.processed` delivery
and post-refund entitlement revocation remain unobserved.

This proves the capture→signed webhook→ledger/activation path for one success
case. It does not prove the complete failure/refund/expiry/manual-renewal/
replay/timeout/exactly-once matrix. `PLAN-WEB-014` and Gate 4 remain open.
Score remains **223 checked / 57 unchecked / 280 total (79.6%)**.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-cards-capture-webhook-2026-10-11.md`.

## 2026-10-11 · PLAN-WEB-014 Preview Cards capture with webhook timing boundary

The official Razorpay Test Mode domestic card fixture completed the hosted
card/OTP flow and the provider dashboard showed the canonical Pro monthly
payment as **Captured**. The exact Preview webhook target was enabled after
that payment, so no historical signed event was delivered and the application
correctly remained waiting for webhook confirmation. No event was replayed or
synthesized.

This proves provider-side capture but not signed `payment.captured` delivery,
ledger credit, fixed-term entitlement, refund, expiry, second manual-renewal
order, replay/out-of-order handling, timeout/retry, or exactly-once behavior.
`PLAN-WEB-014` and Gate 4 remain open. Score remains **223 checked / 57
unchecked / 280 total (79.6%)**.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-cards-capture-webhook-boundary-2026-10-11.md`.

## 2026-10-11 · PLAN-WEB-014 current Preview prepaid order boundary

The isolated Preview test-auth fixture was normalized without changing
Production variables or identities. Current Web head `887249d` now has fresh
hosted evidence: the server-owned Pro monthly order returned HTTP **200** with
canonical INR 280,943 minor units, 30 days, catalog `2026-10-02.0`, Test Mode,
and exactly `card` / `Cards`. Focused payment tests passed **42/42** with three
explicit local-PostgreSQL skips and zero failures.

This is order-creation evidence only. No provider capture/failure/refund,
signed webhook, ledger transition, fixed-term entitlement, expiry, or second
manual-renewal order was observed, so `PLAN-WEB-014` and Gate 4 remain open.
The prior recurring-card fixture requirement is retired by the Final V1
prepaid/manual-renewal contract. Score remains **223 checked / 57 unchecked /
280 total (79.6%)**.

Evidence: `docs/shipping/evidence/plan-web-014-preview-prepaid-order-creation-2026-10-11.md`.

## 2026-10-11 · current CLI main reconciliation and bounded Hunt qualification

The private tracker now contains the current bounded Hunt runtime, supported
recipe catalog, MCP approval binding, private-runner boundary, release-record
exports, and rollback hardening from CLI `origin/main`
`f5686b5c5aa11f45f392e647bd9d7e31830654ba`. CLI, Hunt, and MCP test suites
passed; Hunt recorded **45 passes / 16 explicit macOS Docker skips**, MCP
recorded **48 passes**, all three typechecks passed, and `git diff --check`
passed.

This closes the code-side implementation gap but does not close a backlog
checkbox. HUNT-008/009/010/011 remain open for trusted/licensed recipe
provenance, independent AppSec/legal review, and hosted/customer
qualification. Score remains **223 checked / 57 unchecked / 280 total
(79.6%)**. Evidence:
`docs/shipping/evidence/cli-current-main-reconciliation-2026-10-11.md`.

## 2026-10-11 · PLAN-WEB-014 Preview prepaid-card hosted qualification

The current Web head was redeployed to isolated Preview with the canonical
Cards-only prepaid contract. Preview order creation returned HTTP **200** for
the server-owned Pro monthly offer (₹2,809.43, 30 days), and Razorpay Test
Mode opened the hosted Checkout with Cards only. The official Test Mode Visa
card reached provider card creation and consent with HTTP **200**, but the
provider remained at its own `Sending OTP` state; no terminal capture,
failure, refund, signed webhook, payment-ledger transition, or entitlement
grant was observed. The app status remained `pending`.

`PLAN-WEB-014` remains unchecked. The final prepaid/manual-renewal contract
still requires signed capture/failure/refund/expiry and second-order renewal
reconciliation; no OTP may be guessed and no rows may be edited. Score remains
**223 checked / 57 unchecked / 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/plan-web-014-preview-prepaid-card-hosted-qualification-2026-10-11.md`.

## 2026-10-11 · PLAN-WEB-015 Production cards-only contract checkpoint

The authenticated Production `/checkout` page showed the fixed-term monthly/
annual offer and an enabled-payment-method section containing only **Cards**.
This matches the Final V1 one-time prepaid card payment plus customer-initiated
manual renewal contract. It does not qualify order creation, signed webhook,
refund, expiry, or renewal reconciliation, so no checkbox or score changed.
Score remains **223 checked / 57 unchecked / 280 total (79.6%)**.
Evidence: `docs/shipping/evidence/plan-web-015-production-cards-only-display-2026-10-11.md`.

## 2026-10-11 · ACCEPT-002 current-head substrate recheck

The current private acceptance harness passed CLI **37/37**, Web **923/953**
with **30 explicit environment-gated skips**, and composed
Team/Studio/Enterprise/quality substrates **74/74**; all verifier commands
exited 0. Current heads were CLI `74fd6cd` and Web `887249d`.

`ACCEPT-002` remains unchecked because the harness itself records Hunt,
modified-CLI runtime, Studio recipient, Enterprise runner, and account
deletion as qualification/customer/provider-open. No checkbox or score
changed. Score remains **223 checked / 57 unchecked / 280 total (79.6%)**.
Evidence: `docs/shipping/evidence/accept-002-current-head-substrate-recheck-2026-10-11.md`.

## 2026-10-11 · QUAL-WEB-006 Production read-only qualification

Production `/account` and `/orgs` were exercised through the authenticated
Chrome session without writes. The account page had named navigation and
heading semantics, no console errors/warnings, HTTP 200 route assets,
Lighthouse Accessibility **100** and Best Practices **100** on desktop and
mobile, and a cold desktop trace of LCP **993 ms** with CLS **0.00**. The
organization page showed the safe empty state because this account has no
active organization.

`QUAL-WEB-006` remains unchecked: human screen-reader, large authenticated
dataset, and field-CWV evidence are still missing. No checkbox or score
changed. Score remains **223 checked / 57 unchecked / 280 total (79.6%)**.
Evidence: `docs/shipping/evidence/qual-web-006-production-readonly-cdp-2026-10-11.md`.

## 2026-10-11 · DIST-001 package-boundary recheck

The public packer was repaired and requalified at private shipping commit
`14d264dc76f82dad6a53fe929f80edc280ce9642`: all six candidate npm archives
were rebuilt, each carries the generated `THIRD_PARTY_NOTICES`, and none
contains compiled `cli-fixture`, `fixture-engine`, or `fixture-validator`
modules. The clean-consumer install passed for all six archives and executed
the CLI as `2.0.0-alpha.1`; package regression, clean-consumer, release
verifier, typecheck, and diff checks passed.

`DIST-001` remains unchecked because its `LOCAL/HUNT/RECORD` dependencies and
final legal/release qualification remain open. No checkbox or score changed.
Score remains **223 checked / 57 unchecked / 280 total (79.6%)**. Evidence:
`docs/shipping/evidence/dist-001-package-boundary-recheck-2026-10-11.md`.
The next dependency-ready assessment is `DIST-001` after its dependencies are
satisfied; do not advance to `DIST-002` on package evidence alone.

## 2026-10-11 · LIC-003 notice-generator recheck and artifact boundary

The private notice generator produced byte-identical output on two runs:
**197,966 bytes**, SHA-256
`2355bbf2062a9b3dbe86daf95dbb4d8708236cc276f1b25e59475a7b64febad1`. It
retains upstream identity/LICENSE/NOTICE text and the non-endorsement
disclaimer. The current `.artifacts` directory has **zero `.tgz` archives**.

`LIC-003` remains unchecked because final acceptance still needs exact release
archive qualification, reconciliation with the unresolved `LIC-002` record,
and authorized legal approval. No package or external state changed. The next
dependency-ready assessment after this boundary is `DIST-001`. Score remains
**223 checked / 57 unchecked / 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/lic-003-notice-generator-recheck-2026-10-11.md`.

## 2026-10-11 · LIC-002 mechanical inventory and legal boundary

The private CLI shipping source passed `node scripts/license-inventory.mjs
--check` with **148 dependency entries and zero automated review blockers**.
The license/notice test set passed **5/5**. This proves mechanical inventory
and notice generation behavior only.

`LIC-002` remains unchecked because the external-engine/standards record still
has unresolved Trivy image/layer/database terms, detect-secrets release and
redistribution status, fixture rights, Hunt recipe provenance, and trademark
decisions. The legal addendum is still a review request with no authorized
reviewer/signature/approval date. No release or external state changed. The
next dependency-ready item is `LIC-003`. Score remains **223 checked / 57
unchecked / 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/lic-002-technical-recheck-2026-10-11.md`.

## 2026-10-11 · STUDIO-CLI-001 code revalidation and recipient boundary

The current CLI head `2b05390f` revalidated the bounded `record project-client`
projection, organization/workspace/record and projection-digest binding,
private-field refusal, and explicit time-bounded upload approval. Shared
client-projection tests passed **4/4**, the CLI command test passed **1/1**,
the full CLI test process exited **0**, typechecks/builds passed, and
`git diff --check` passed.

`STUDIO-CLI-001` remains unchecked. Independent hosted-recipient redaction
proof and a real authorized Studio recipient/customer acceptance run are still
missing. No Production or application state changed. The next
dependency-ready item is `LIC-002`. Score remains **223 checked / 57 unchecked
/ 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/studio-cli-001-code-revalidation-2026-10-11.md`.

## 2026-10-11 · Final V1 product-contract decision

The authoritative product contract is now
`docs/shipping/FINAL_V1_PRODUCT_CONTRACT_2026-10-11.md`.

The final V1 target is one CLI for Free, Pro, Team, Studio, and Enterprise;
native TypeScript/JavaScript scanning first; bounded Hunt enabled by plan;
portable Attest/Release Records for Pro+; TopNotchh GitHub-organization and
forked public TypeScript/JavaScript repository testing for Team/Studio/
Enterprise; and Cards-only prepaid fixed-term billing with manual renewal.

This decision replaces the automatic-recurring-renewal promise. It does not
close the payment rows: the Web order path, fixed-term entitlement, webhook,
refund, expiry, and manual-renewal matrix must still be implemented and
qualified. It also does not close Hunt, Attest, SCM, legal, AppSec, or final
release rows. No checkbox changed in this documentation batch.

Execution rule: implement the first dependency-ready unchecked item, run the
required CLI/Web/hosted tests, write evidence, update the execution ledger and
status, then recompute the checkbox score. Do not add duplicate rows for this
contract decision. Starting score remains **223 checked / 57 unchecked / 280
total (79.6%)**.

## 2026-10-11 · PLAN-WEB-012 prepaid order implementation recheck

Web commit `887249d` applies the current contract: exact Cards-only runtime
configuration, signed one-time order checkout, fixed-term entitlement, manual
renewal through a second one-time order, and a fail-closed legacy subscription
creation route. The Web serial suite passed **880/880 configured tests** with
24 environment-gated skips; focused checkout/runtime/webhook tests and
typecheck passed; and a disposable PostgreSQL 15 run passed the complete
6/6 write-capable webhook scenarios including card capture, replay, refund,
failure recovery, and manual renewal.

`PLAN-WEB-012` remains unchecked because the exact commit's Vercel Preview
deployment completed but its URL/details are not inspectable from the current
Vercel-authenticated session, so current-head provider-originated card
capture/failure/refund reconciliation cannot yet be recorded. The local
Vercel CLI returns `Not authorized`; GitHub status records the successful
deployment as `Bq4mh1Rm98isPjkVn1fsvZvhTWE9`. The previous recurring-card
fixture blocker is retired by the Final V1 contract; manual renewal does not
require a recurring provider fixture. Score remains **223 checked / 57
unchecked / 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/plan-web-012-prepaid-card-order-qualification-2026-10-11.md`.

## 2026-10-11 · TEAM-CLI-001 code revalidation and hosted boundary

The authoritative CLI shipping worktree at `2b05390f` revalidated the signed
organization-policy schema, exact tenant/repository binding, bounded HTTPS
fetch, atomic mode-0600 cache, offline expiry behavior, and command wiring.
Shared organization-policy tests passed **3/3**, CLI cache/fetch tests passed
**4/4**, the full CLI package test process exited **0**, typechecks/builds
passed, and `git diff --check` passed.

`TEAM-CLI-001` remains unchecked. Hosted acceptance still requires an active
organization-policy signer/trust root, a mapped paid/non-production tenant,
an authorized GitHub installation and repository binding, a published policy
row, and a live signed fetch/cache/offline/cross-tenant evidence run. No
Production or application state was changed. The next dependency-ready item
after this blocked record is `STUDIO-CLI-001`. Score remains **223 checked /
57 unchecked / 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/team-cli-001-code-revalidation-2026-10-11.md`.

## 2026-10-10 · PLAN-WEB-014 official recurring-card fixture boundary

The isolated Preview route created a canonical Pro monthly Razorpay Test Mode
subscription. Razorpay's official domestic Visa fixture reached the hosted
card-saving/mandate step, but the provider returned **“This card is not
eligible for recurring payments”** after its supported `Skip OTP` control. A
read-only provider query showed `created`, `paid_count=0`, and no linked
payment; the exact Test Mode subscription was then cancelled with HTTP 200.
This confirms the provider boundary and cleanup path but does not close
`PLAN-WEB-014` or Gate 4. Score remains **223 checked / 57 unchecked / 280
total (79.6%)**; no checkbox changed.

Evidence:
`docs/shipping/evidence/plan-web-014-preview-official-recurring-card-fixture-boundary-2026-10-10.md`.

## 2026-10-10 · QUAL-WEB-006 Production route/performance qualification

The authenticated Production account trace measured LCP **2,327 ms** and CLS
**0.00**; desktop/mobile Lighthouse Accessibility and Best Practices were
**100**. Account, privacy, organizations, and docs rendered without an
application-error marker, while paid-only routes correctly redirected the Free
account. `QUAL-WEB-006` remains unchecked pending keyboard/screen-reader,
large-data, field-CWV, and complete paid-route evidence. Score remains **223
checked / 57 unchecked / 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/qual-web-006-production-route-performance-2026-10-10.md`.

## 2026-10-10 · QUAL-CLI-006 current private-source qualification

The current private source completed the full `test`, `typecheck`, and `build`
task set with **23/23 successful**, zero failures, and zero cached tasks.
`QUAL-CLI-006` remains unchecked pending trusted keyless signing, protected
publication/attestation, legal clearance, independent review, and protected
pipeline consumer evidence. `QUAL-WEB-006` is next; score remains **223 checked
 / 57 unchecked / 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/qual-cli-006-current-private-run-2026-10-10.md`.

## 2026-10-10 · TEAM-CLI-001 hosted activation recheck

The organization-policy client remains locally qualified: shared policy tests
**3/3**, CLI cache/fetch tests **4/4**, and shared/CLI typechecks passed. The
Vercel environment-name audit found no organization-policy signer/trust-root
activation in Preview or Production. `TEAM-CLI-001` remains unchecked pending
the hosted signer, policy-row reconciliation, and live bound-fetch artifacts;
the existing Studio custody block is next, followed by `LIC-002`. Score remains
**223 checked / 57 unchecked / 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/team-cli-001-hosted-activation-recheck-2026-10-10.md`.

## 2026-10-10 · PLAN-WEB-014 Test Mode renewal qualification recheck

The bounded Razorpay Test Mode inventory returned 42 subscriptions: 5 active,
15 awaiting authorization, and 22 cancelled. None was due for charge and none
reported a tokenized card. No provider or application state write occurred.
This confirms the existing provider block; `PLAN-WEB-014` remains unchecked and
Gate 4 remains open. Score remains **223 checked / 57 unchecked / 280 total
(79.6%)**.

Evidence: `docs/shipping/evidence/plan-web-014-testmode-renewal-qualification-recheck-2026-10-10.md`.

## 2026-10-10 · PLAN-CLI-001 Preview issue→verify revalidation

The current Preview deployment `dpl_553h93xmbKWFAPKSdr8t3679reU7` was
rechecked against the isolated Neon Test database. The deployed v2 route issued
an HTTP 200 Pro token for a mapped active fixture, and the current CLI verifier
accepted its pinned signature, v2 schema, owner/tenant scope, 21 capabilities,
and bounded allowances. `PLAN-CLI-001` was already checked; no checkbox changed.
The authoritative score remains **223 checked / 57 unchecked / 280 total
(79.6%)**. Gate 4 provider lifecycle evidence remains separate.

Evidence: `docs/shipping/evidence/plan-cli-001-preview-v2-issue-verify-rerun-2026-10-10.md`.

## 2026-10-10 · PRO-008 invoice metadata projection advanced

Web `cad9404` adds the validated, idempotent `billing_invoices` metadata
projection through the provider invoice/payment webhook paths and an
owner-scoped masked billing view. Migration `0040` is applied and isolated
Neon/Docker audits are **41/41** with zero pending or missing tables. Billing
and webhook unit tests pass **22/22**; isolated Docker integration passes
**7/7**; typecheck, schema/migration checks, build, and diff checks pass.
Invoice documents, tax payloads, and provider download URLs remain explicitly
out of scope. Provider-generated lifecycle and complete payment-to-ledger-
to-license reconciliation remain required; no checkbox changed. Score remains
**223 checked / 57 unchecked / 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/pro-008-invoice-metadata-projection-2026-10-10.md`.

## 2026-10-10 · PLAN-WEB-014 current Test Mode inventory recheck

The bounded Test Mode subscription API read returned 42 rows: 5 active, 15
created/awaiting authorization, and 22 cancelled. Active rows have one or two
paid cycles; the earliest future charge is 2026-11-08T18:30:00Z. No charge-now,
replay, out-of-order, or provider write was attempted.

This is provider inventory evidence only. Created rows and future scheduled
charges do not prove recurring-card authorization or the complete signed
payment-to-ledger-to-license matrix. `PLAN-WEB-014` and Gate 4 remain open;
no checkbox changed. Score remains **223 checked / 57 unchecked / 280 total
(79.6%)**.

Evidence: `docs/shipping/evidence/plan-web-014-testmode-subscription-inventory-recheck-2026-10-10.md`.

## 2026-10-10 · PLAN-CLI-003 authenticated Production boundary revalidation

The existing authenticated Chrome session completed a 17-request read-only
Production matrix. Forged Enterprise capability selection stayed on the Free
projection; the account returned zero organizations; and forged
organization/project/search/usage/receipt/policy/release/SCM reads returned
bounded denial or validation responses. No cookies, bearer tokens, response
bodies, or customer identifiers were retained.

Production remains Cards-only with live provider credentials and without
recurring plan IDs/total-count configuration, so recurring billing is
fail-closed. The local `.env.gates.testing` file was not deployed or printed.
This advances `PLAN-CLI-003` but does not satisfy its paid-fixture and complete
public/private list/search/export runtime gates. No checkbox changed; score
remains **223 checked / 57 unchecked / 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/plan-cli-003-production-authenticated-readonly-revalidation-2026-10-10.md`.

## 2026-10-10 · PLAN-WEB-014 provider tokenization boundary addendum

The authenticated Razorpay Test Mode Subscriptions dashboard exposes no
supported charge-now, renewal, delivery replay, or out-of-order control.
Razorpay's official documentation identifies saved-card tokenization as an
on-demand Support-enabled feature. Ordinary Card capture is not recurring
mandate evidence. `PLAN-WEB-014` remains unchecked pending provider-supported
tokenization/recurring-card authorization or a supported renewal/delivery
control, followed by signed payment-to-ledger-to-license reconciliation. No
provider, database, entitlement, or Production write occurred. Score remains
**223 checked / 57 unchecked / 280 total (79.6%)**.

Evidence: `docs/shipping/evidence/plan-web-014-provider-tokenization-feature-boundary-2026-10-10.md`.

## 2026-10-10 · PLAN-WEB-014 Cards-only recurring guard addendum

Web `9a3c32a` hardens recurring subscription creation and display to require
Cards, with display **4/4**, isolated PostgreSQL route integration **2/2**,
typecheck, local/remote 47-page builds, and READY Production deployment
`dpl_12hRaACdnE4SvGmFHZFXpcUCTsC2` with read-only `/` and `/checkout` HTTP
200 checks. No Test Mode values were deployed and no provider, payment,
webhook, database, entitlement, account, or customer-data write occurred.

This is supporting implementation/deployment evidence only. The checkbox stays
open until provider-generated renewal, failure/expiry, refund/replay/order,
out-of-order, timeout/retry, exactly-once, and complete tenant-bound
reconciliation are proven. Score remains **223 checked / 57 unchecked / 280
total (79.6%)**.

Evidence: `docs/shipping/evidence/plan-web-014-cards-only-recurring-guard-production-rollout-2026-10-10.md`.

## 2026-10-10 · PLAN-CLI-002 accepted

The effective-capability UX is now qualified in the CLI. `whoami` human and
JSON output report the effective plan, authority source, stale/offline-grace
state, opaque capability count, catalog version, bounded allowances, and
verified-token expiry; legacy tier-only tokens cannot grant paid capability
offline, and upgrade output remains actionable. Entitlement **15/15**,
focused CLI **28/28**, machine-output **30/30**, full test/typecheck/build,
and diff checks passed. No Production/provider/database/entitlement/npm or
customer-data write occurred. `PLAN-CLI-002` is checked; score is **221/59/280
(78.9%)**.

Evidence: `docs/shipping/evidence/plan-cli-002-effective-capability-ux-2026-10-10.md`.

## 2026-10-10 · top-of-backlog queue transition

The first unchecked item, `HUNT-008`, was audited against the current CLI
head and private gate matrix. Its recipe/fixture implementation exists, but
authenticated/licensed recipe provenance, supported-rule approval wiring, and
independent AppSec qualification are missing. It is parked unchecked with an
explicit owner, review date, and release decision; HUNT-009 through HUNT-011
remain downstream. The next dependency-ready item is now `PLAN-CLI-001`, whose
implementation exists but requires a deployed v2 entitlement-token
issue→verify trace for an authorized tenant. No checkbox changed; score
remains **219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/top-backlog-queue-transition-2026-10-10.md`.

## 2026-10-10 · `PLAN-CLI-001` Production v2 entitlement-route rollout

Web source `ecc32f2` added `/api/v2/entitlement/token` to the middleware
public-route allowlist so its own bearer validation is reachable. Focused
entitlement tests passed **7/7**, typecheck passed, and Production deployment
`dpl_DiRR2g2upWNein7bzXRmrEb3mtHm` reached READY. The live route now returns
the intended 401 for missing authorization and 404 for a fake key; anonymous
capabilities still return Free. No state-changing write occurred. This is
real `PLAN-CLI-001` progress, but the item remains unchecked pending an
authorized paid-tenant v2 issue→verify trace with the pinned CLI key and
catalog/capability/allowance projection. Score remains **219 checked / 61
unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-cli-001-production-v2-route-rollout-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` recurring-card retry boundary

The current isolated Preview/Test Mode checkout reached the provider
card-tokenization/OTP step but ended in a provider terminal-state failure.
Three exact recent Test Mode subscriptions were cancelled successfully and a
read-only provider query found zero payments for them. No Production or
entitlement write occurred. This is a genuine provider fixture/account block,
not acceptance: recurring authorization, renewal, provider failure/expiry,
replay/out-of-order, retry/exactly-once, and final hosted reconciliation remain
open. `PLAN-WEB-014` remains the sole active item and no next item is selected
until the provider unblock artifact exists. No checkbox changed; score remains
**219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-preview-recurring-card-retry-boundary-2026-10-10.md`.

## 2026-10-10 · Production schema availability evidence

The bounded Production migration operation created a pre-write backup, applied
the pending reviewed migrations through the protected Vercel environment
runner, and verified **39/39** migrations with zero missing declared tables.
The migration-audit false positive caused by non-monotonic journal timestamps
was corrected in Web `2a050be`, and the corrected read-only Production audit
reports the expected inventory-only state. Public `/`, `/checkout`, and
`/docs` returned 200 after the operation. No payment, entitlement, account,
organization, customer-data, or backfill write occurred. This is supporting
Production schema evidence only: `PLAN-WEB-014`, Gate 4, and the full
payment/provider lifecycle remain open. No checkbox changed; score remains
**219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/production-migration-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` current Preview webhook configuration

Razorpay Test Mode now reports an enabled webhook for the current READY
Preview deployment. Its secret is present and 20 application lifecycle events
are active. The historical webhook targets were left untouched. A protected
GET to the current Preview webhook route returned the expected HTTP 405 for
the POST-only signed endpoint. No provider event or application write was
generated; no checkbox changed and score remains **219 checked / 61 unchecked /
280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-current-preview-webhook-configuration-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` current protected Preview browser revalidation

The current READY Preview deployment for Web `445d8ed` was opened through the
existing authenticated Chrome DevTools session with Vercel protection left
enabled. The browser-rendered checkout showed Razorpay Test Mode, the
canonical Pro offer, and exactly one hosted method: Cards. No UPI/QR,
Netbanking, Wallet, EMI, Pay Later, or eMandate label was present. The older
four-method page was confirmed to be a stale webhook target, not the current
deployment. No checkbox changed; score remains **219 checked / 61 unchecked /
280 total (78.2%)**.

The disposable Docker PostgreSQL run passed the payment webhook integration
suite **5/5** and the combined route/webhook/lifecycle suite **33/33**. This
supports code-side replay/idempotency, refund, failure, invoice, expiry,
lifecycle, and retry behavior but does not replace provider-generated renewal
or provider replay/out-of-order evidence.

Evidence: `docs/shipping/evidence/plan-web-014-current-preview-browser-acceptance-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` current Preview Cards-only revalidation

The current READY Preview deployment for Web `445d8ed` was inspected with
Vercel CLI. Its `/checkout` route returned HTTP 200 with canonical catalog
`2026-10-02.0`, exactly `paymentMethods: [{id: "card", label: "Cards"}]`,
`testMode: true`, and `subscriptionEnabled: true`. The Preview environment
listing showed the isolated-database marker, Preview `DATABASE_URL`, Razorpay
Test Mode configuration, webhook secret, and Cards-only method configuration
without revealing values. Direct browser navigation without the Vercel
protection bypass redirected to Vercel login, so this is server/configuration
evidence only—not final hosted browser acceptance. No checkbox changed; score
remains **219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-current-preview-cards-only-revalidation-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` provider webhook replay-control boundary

The authenticated Razorpay Test Mode Webhooks surface was reloaded through
Chrome DevTools. It exposed webhook configuration and active-event settings,
but no delivery history, delivery identifier, retry, replay, or out-of-order
scheduling control. No configuration was changed and no event was replayed or
synthetically posted. The Docker replay tests remain code-side only. This
provider boundary keeps `PLAN-WEB-014` and Gate 4 open; score remains **219
checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-provider-webhook-replay-control-boundary-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` provider renewal schedule recheck

The authenticated Razorpay Test Mode subscription inventory returned HTTP 200
with five active subscriptions. Four have one paid cycle and the earliest
next charge is 9 November 2026; one has two paid cycles and a later January
2027 charge. No active subscription can produce a renewal during this run,
and the provider exposes no supported immediate charge or renewal-replay
control for them. No provider update or payment operation was submitted.
This records the external renewal boundary but does not close
`PLAN-WEB-014` or Gate 4. Score remains **219 checked / 61 unchecked / 280
total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-provider-renewal-schedule-recheck-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` local Docker webhook regression support

The Web payment webhook suite ran against disposable local PostgreSQL 15
after its localhost-only isolation guard correctly refused the Neon URL:
database-backed integration tests passed **5/5**, and focused route/webhook
tests passed **28/28**. This supports replay/idempotency, monotonic refund,
failure/no-grant, invoice binding, expiry projection, lifecycle ordering, and
retry semantics at code level. It does not replace provider-delivered renewal,
provider replay/out-of-order, or hosted Preview acceptance. No checkbox
changed; score remains **219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-local-docker-webhook-regression-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` isolated Preview/Test Mode cancellation after refund

After the full-refund observation, a read-only join found exactly one active
application subscription linked to the refunded canonical Pro/monthly card
payment and inactive Pro license. The exact Test Mode provider subscription
was cancelled immediately through the documented cancellation endpoint and
returned HTTP 200 with status `cancelled`. The isolated Preview webhook store
completed one distinct signed `subscription.cancelled` event; the application
subscription projected `active → cancelled` while the payment stayed fully
`refunded` and the license stayed inactive. No manual row edit occurred.
This advances Gate 4 but does not close `PLAN-WEB-014`: renewal/expiry,
refund replay/order and out-of-order, timeout/retry, exactly-once, and final
hosted Preview acceptance remain open. Score remains **219 checked / 61
unchecked / 280 total (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-cancellation-after-refund-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` isolated Preview/Test Mode full refund

A read-only preflight matched the authenticated Razorpay Test Mode payment
detail to one isolated captured canonical Pro/monthly card payment with an
active subscription and active Pro license. A provider-dashboard full Test
Mode refund then completed for the exact payment. The isolated Preview
webhook store recorded two distinct completed signed events,
`refund.created` and `refund.processed`; the payment projected to `refunded`
with the full refund watermark, and the linked Pro license became inactive.
The subscription row remained active at observation time, so cancellation or
expiry after refund is still a separate open lifecycle case. No manual
payment, subscription, license, entitlement, or database edit occurred. This
advances Gate 4 but does not close `PLAN-WEB-014`: renewal/expiry,
refund replay/order and out-of-order, timeout/retry, exactly-once, and final
hosted Preview acceptance remain open. Score remains **219 checked / 61
unchecked / 280 total (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-preview-official-subscription-card-full-refund-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` Production Cards-only revalidation

Fresh public and browser verification supersedes the stale-tab observation in
the earlier Production smoke note. `https://verglos.com/checkout` returned
HTTP 200 with server-rendered `paymentMethods: [{id: "card", label:
"Cards"}]`, `testMode: false`, and `subscriptionEnabled: false`. After forced
reload, both existing Chrome Production checkout tabs rendered Cards only and
no UPI/QR, Netbanking, Wallet, EMI, Pay Later, or eMandate labels. This is
read-only configuration evidence, not Production payment acceptance. No
checkbox changed; score remains **219 checked / 61 unchecked / 280 total
(78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-production-cards-only-revalidation-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` provider renewal dashboard boundary

The authenticated Razorpay Test Mode dashboard showed the active canonical
Pro/monthly subscription with one paid cycle and its next charge scheduled
for 10 November 2026. The provider Update dialog exposed only plan/offer and
remaining-cycle changes, applied immediately or at the next cycle; it did not
provide an immediate charge or renewal-replay action. No update was submitted.
This records the provider timing boundary but is not renewal evidence. No
checkbox changed; score remains **219 checked / 61 unchecked / 280 total
(78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-provider-renewal-dashboard-boundary-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` official subscription-card failure reconciliation

The official Razorpay Test Mode subscription-card failure fixture was run
against a canonical Pro/monthly subscription created by the isolated Preview
application path. A signed `payment.failed` webhook completed, the isolated
application recorded one failed payment with no `license_id`, and active
licenses remained unchanged at three. One pending subscription row was
created for the attempt. This is concrete no-grant/failure-path Gate 4
evidence, but provider-generated renewal, expiry, refund replay/order,
out-of-order delivery, timeout/retry, and final hosted Preview acceptance
remain open. No checkbox changed; score remains **219 checked / 61 unchecked /
280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-preview-official-subscription-card-failure-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` official subscription-card capture reconciliation

The official Razorpay Test Mode subscription-card fixture completed one
canonical Pro/monthly authorization and capture for an isolated Preview-created
subscription. Five distinct signed webhook events completed, and the isolated rows
reconciled one captured subscription payment to one active subscription and
one active Pro license with matching redacted tenant/user binding. This is
material Gate 4 progress, but provider-generated renewal, failure/expiry,
refund replay/order, out-of-order delivery, timeout/retry, and final hosted
Preview acceptance remain open. No checkbox changed; score remains **219
checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-preview-official-subscription-card-success-2026-10-10.md`.

## 2026-10-10 · `PLAN-WEB-014` Cards-only Preview route boundary

Web `445d8ed` is deployed to READY Preview `dpl_36zQf2zEsVCrxpic8rcrjFJbQbK7`.
The protected application route returned HTTP 200 in Test Mode with canonical
catalog `2026-10-02.0` and exactly `paymentMethods: ["card"]`; focused
checkout tests passed **12/12** and the 47-page builds passed. This supersedes
the historical multi-method display observation for the current release
candidate. It does not close `PLAN-WEB-014`: provider authorization/capture,
signed webhook, payment/ledger/license reconciliation, replay/order,
renewal, failure/expiry, refund, timeout/retry, and complete tenant binding
remain open. Score remains **219 checked / 61 unchecked / 280 total (78.2%)**;
no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-cards-only-preview-route-and-hosted-display-2026-10-10.md`.

## 2026-10-10 · `invoice.paid` subscription renewal binding

Web `a97bc2b` plus integration coverage `b1bd248` add a subscription-bound `invoice.paid` webhook path. It
reuses the signed snapshot, exact amount/currency, paid-invoice, captured
payment, and provider identity checks; unrelated one-off invoices are
acknowledged without a ledger or entitlement write. Focused webhook tests pass
**20/20**, the broader payment/lifecycle set passes **48/48** with three
explicit environment skips, typecheck/build pass, and disposable PostgreSQL
handler integration passes **5/5**, including paid-invoice fulfillment and
replay deduplication. This is code-side Gate 4 progress only:
provider-delivered signed renewal evidence and provider-to-ledger-to-license
reconciliation remain open. No checkbox changed; score remains **219 checked /
61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-invoice-paid-renewal-path-2026-10-10.md`.

## 2026-10-10 · Privacy/deletion isolated qualification

Web `51e07f5` passed the privacy/deletion qualification **29/29**, zero
failures: 27 contract/behavior tests and 2 migrated PostgreSQL integrations.
This is implementation/integration evidence only; external legal, customer,
Production, restore/rollback, and independent acceptance gates remain open.
No checkbox changed; score remains **219 checked / 61 unchecked / 280 total
(78.2%)**.

Evidence: `docs/shipping/evidence/qual-web-005-privacy-deletion-2026-10-10.md`.

## 2026-10-10 · SCM/GitHub-GitLab code qualification

Web head `51e07f5` passed the focused SCM suite **24/24**, zero failures and
zero skips, covering provider identity, raw webhooks, tenant binding, redacted
checks, idempotency, leases, token refresh, retries, workers, and routes. Live
authorized repository installation and delivery remain open; no checkbox
changed and the score remains **219 checked / 61 unchecked / 280 total
(78.2%)**.

Evidence: `docs/shipping/evidence/team-web-006-scm-code-qualification-2026-10-10.md`.

## 2026-10-10 · Authoritative CLI release-head qualification

CLI `origin/main` at `f5686b5c` passed the locked offline test run (**12/12
Turbo tasks**), uncached typecheck (**13/13**), and uncached build (**8/8**)
in a detached worktree. This is release-head qualification progress only;
trusted publishing, external review, hosted integration, customer acceptance,
and final release gates remain open. No checkbox changed; score remains **219
checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/qual-cli-006-authoritative-head-2026-10-10.md`.

## 2026-10-10 · Test Mode webhook configuration inventory

Read-only provider inventory returned HTTP 200 with five active Preview/test
webhook targets and one disabled Production target; all six advertise 56 event
types. This supports Gate 3 configuration presence only, not delivery or
reconciliation. No checkbox changed; score remains **219 checked / 61
unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/razorpay-testmode-webhook-inventory-2026-10-10.md`.

## 2026-10-10 · Production read-only smoke follow-up

Production `/`, `/checkout`, and `/docs` returned 200 with HSTS; checkout
showed Cards, Netbanking, Wallets, and EMI with the canonical monthly amount;
the unauthenticated subscription GET returned 405; and no Test Mode/test-key/
database marker was exposed. This is fail-closed Production code evidence only;
no checkbox changed and the score remains **219 checked / 61 unchecked / 280
total (78.2%)**.

Evidence: `docs/shipping/evidence/production-readonly-smoke-2026-10-10-followup.md`.

## 2026-10-10 · Gate 4 Docker payment integration revalidation

The isolated PostgreSQL harness refused unsafe Neon and identical-target
configurations, then passed after runtime/payment targets were separated.
Reviewed migrations applied successfully and the five payment integration
files passed **10/10**, zero failures, zero skips. This is integration
evidence only; no checkbox changed and the score remains **219 checked / 61
unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-docker-payment-revalidation-2026-10-10.md`.

## 2026-10-10 · Test Mode provider/application reconciliation addendum

Read-only reconciliation matched all **34/34** Razorpay Test Mode
subscription IDs to isolated application rows. Eight provider-cancelled rows
remain application-pending, and 24 of 33 provider payment records have no
application projection. This is concrete Gate 4 progress but not complete
payment acceptance; no checkbox changed. Score remains **219 checked / 61
unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-provider-isolated-reconciliation-2026-10-10.md`.

## 2026-10-10 · Gate 4 Docker payment integration qualification

The isolated loopback PostgreSQL path applied the reviewed migrations after
the explicit disposable bootstrap confirmation. Five payment integration
files passed **10/10**, zero failures, zero skips, covering server-catalog
order/subscription binding, ledger ordering, webhook replay claims,
captured/refund, failed/no-grant, invoice-bound failure, and expiry behavior.
This removes the local integration skip but does not close the real provider
lifecycle/reconciliation criteria. No checkbox changed; score remains
**219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-docker-payment-integration-2026-10-10.md`.

## 2026-10-10 · Full CLI qualification and Production smoke recheck

CLI local head `d0a3b217` completed the full Turbo test/typecheck/build
pipeline: package tests **103/103**, typecheck **11/11**, and build **6/6**;
the independently executed focused current-head suite is **17/17**. Public
Production `/`, `/checkout`, and `/docs` returned 200 with HSTS, no Test Mode,
test-plan, Preview, or database markers, and unauthenticated subscription GET
returned 405. This strengthens implementation and fail-closed rollout
evidence but does not close provider, reviewer, legal, trusted-publishing,
Production billing, or final-POC criteria. No checkbox changed; score remains
**219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/cli-full-qualification-and-production-smoke-2026-10-10.md`.

## 2026-10-10 · Current-head Web and CLI focused qualification

Web head `51e07f5` passed the focused payment/lifecycle/origin suite with
**41 pass / 1 explicit PostgreSQL-environment skip / 0 fail**. CLI head
`d0a3b217` passed CLI/shared typechecks and the focused API-origin, monitor,
and standards-validation suite **17/17**. This strengthens code-side
qualification for Gate 4 and the mapped CLI items, but does not prove hosted
provider authorization, renewal, failure/expiry, replay/reconciliation,
Production billing, or external review/release gates. No checkbox changed;
score remains **219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/web-cli-focused-qualification-2026-10-10.md`.

## 2026-10-10 · Provider subscription authorization reached OTP boundary

The isolated Preview/Test Mode route created a canonical monthly Pro
subscription and persisted its pending binding. Razorpay hosted card checkout
reached tokenization; provider state is `created` with zero paid cycles and
the attempted card flow has one failed payment projection. The authorized
operator's real OTP and the resulting signed webhook/reconciliation are still
required. No checkbox changed; score remains **219 checked / 61 unchecked / 280
total (78.2%)**.

Evidence:
`docs/shipping/evidence/plan-web-014-provider-subscription-authorization-otp-2026-10-10.md`.

## 2026-10-10 · Provider renewal-shaped invoice reconciliation gap

Read-only Test Mode inventory found one active canonical monthly subscription
with two paid provider invoices, while the matching isolated Preview row has
zero matching application payment rows, zero licenses, and no matching
`subscription.charged` event. Provider invoice state is not accepted as
renewal or entitlement evidence. The required next artifact is an exact
provider delivery/replay to the isolated webhook followed by reconciliation.
No checkbox changed; score remains **219 checked / 61 unchecked / 280 total
(78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-provider-renewal-reconciliation-gap-2026-10-10.md`.

## 2026-10-10 · Cardless EMI repair merged; Production code rollout verified

Web PR #172 merged as `98dd571` after hosted Verify passed with the pinned
official Postgres ECR mirror. The provider `cardless_emi` representation is
now bound to canonical `emi` only when `emi` is present in the signed order
snapshot. Production deployment `dpl_EtggBABkjCRWS9NWHozgH6qbvr5J` passed
configuration and read-only smoke while remaining fail-closed for billing.
This advances Gate 4 and `PLAN-WEB-011/012/014/015` but does not satisfy their
full lifecycle/reconciliation criteria. No checkbox changed; score remains
**219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-cardless-emi-merge-production-2026-10-10.md`.

## 2026-10-10 · Repair provider Cardless EMI order binding

Web branch `fix/razorpay-emi-provider-binding` commit `210d880` repairs a
provider representation gap: a captured Razorpay `cardless_emi` payment is
accepted only when the signed hosted-order snapshot explicitly contains the
canonical `emi` method. Unbound methods remain fail-closed. Focused tests
passed **25/25**, the full Web serial suite passed **900 total / 876 pass / 24
explicit skips / 0 fail**, typecheck/build passed, and PR #172's Vercel and
GitGuardian checks passed. Its hosted schema job is currently held by the
GitHub runner's Docker Hub unauthenticated `postgres:15-alpine` pull-rate
limit, not by a test failure. This repairs one Gate 4 code gap but does not
close the payment matrix or change the score: **219 checked / 61 unchecked /
280 total (78.2%)**. Evidence:
`docs/shipping/evidence/plan-web-014-cardless-emi-binding-2026-10-10.md`.

## Current execution note · 2026-10-10 · signed cancellation slice

Web `d8ddeda`/`51e07f5` repaired the Preview Razorpay lifecycle binding path.
The final isolated Test Mode create/cancel returned HTTP 200/200 and the
protected webhook reconciled one recent subscription row to `cancelled` with
no recent payment or license row. This is a real Gate 4 slice, not full
acceptance. Renewal, failure/expiry/refund, method, replay/order, exactly-once,
timeout/retry, and Production reconciliation evidence remain open. The
authoritative score is **219 checked / 61 unchecked / 280 total (78.2%)**;
no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-webhook-binding-fix-2026-10-10.md`.

## Current execution note · 2026-10-09

The exact merged CLI source also passed the official `in-toto==3.0.0`
release-archive verifier: build **8/8** and six public archives with exact
SHA-256 products. This advances `QUAL-CLI-006` only; trusted keyless release
identity, legal clearance, protected publishing, and final acceptance remain
open. No checkbox changed.

The read-only Production modified-client probe also confirms forged plan
values remain on the server-owned Free projection and forged tenant/project
requests remain auth-hidden 404. This strengthens `PLAN-CLI-003` only; its
authenticated matrix is still required.

Authoritative CLI API-origin hardening is complete at commit
`1972af3abe648312a427c20dc96bbcce54db55a` with focused **24/24**, complete
CLI process **44/44**, and workspace typecheck/build **12/12** each. This is
now merged into public CLI `main` through PR #88 at
`f5686b5c5aa11f45f392e647bd9d7e31830654ba`; all protected platform cells,
self-scan, and in-toto release binding passed. This is backend/security
progress only: `PLAN-CLI-003`, `QUAL-CLI-006`, Gate 4, and
the externally gated Production/release/reviewer/legal/rollback items remain
unchecked until their own evidence exists. Production remains in scope; this
CLI-only batch made no Web deploy and no npm publish/tag, plan/provider/payment,
database/migration, entitlement, account, or customer-data write. The existing
fail-closed Web Production deployment remains READY; read-only `/` and
`/checkout` smoke returned HTTP 200. Score remains **219 checked / 61 unchecked
/ 280 total (78.2%)**.

## Gate 4 lifecycle ordering guard and isolated reconciliation · 2026-10-09

Web `6f932d4` prevents a later `subscription.authenticated` webhook from
regressing an already advanced lifecycle projection. Focused checkout,
origin, route, webhook, and lifecycle tests passed **38/38**; typecheck and
the 47-page build passed. A fresh canonical Test Mode hosted subscription
reconciled provider `active` to isolated ledger `active`, with one captured
payment, period end, and active Pro license. Test Mode cancellation returned
HTTP 200 and reconciled to isolated `cancelled` while paid time remained.

The isolated signed-webhook reconciliation replay repaired the previous stale
projections. Current redacted provider→ledger binding is **5 active→active,
7 cancelled→cancelled, 9 created→pending**. This validates the application
reconciliation path but is not claimed as provider-generated renewal, expiry,
or external delivery evidence. Production was redeployed fail-closed as
`dpl_CvNvt9YEQLMhnEB8htL7eiCocbmG`; no Production plan, provider/payment,
database/migration, entitlement, account, or customer-data write occurred.
Renewal, expiry, failure, refund, replay/out-of-order, timeout/retry,
exactly-once, and complete method evidence remain open. No checkbox changed;
the score remains **219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-lifecycle-ordering-reconciliation-2026-10-09.md`.

## Production fail-closed retry rollout and Gate 4 reconciliation finding · 2026-10-09

Web commit `0bafe73` repairs the hosted checkout retry state: a provider
`payment.failed` callback no longer destroys the active hosted session before
Razorpay can complete a later retry. Focused checkout/origin/route tests passed
**20/20**, typecheck and the 47-page production build passed, and the commit is
deployed to Production as READY Vercel deployment
`dpl_GnVheZKWyqbMX2zdDfsHmy8y9xHB`, aliased to `https://verglos.com`. Public
read-only smoke passed; Production checkout contains no Test Mode marker.

This is Production progress, not billing activation: no Production plan IDs,
Test Mode values, provider/payment calls, database writes, migrations,
entitlement changes, account changes, or customer-data mutations occurred.
The latest isolated Test Mode reconciliation found all 20 provider rows bound
to isolated rows, but five provider `active` rows still project as
`authenticated` in the isolated ledger. That mismatch is recorded as an open
Gate 4 finding rather than hidden. Renewal, failure/expiry, refund,
replay/out-of-order, exactly-once, and complete method coverage remain open.
No checkbox changed; the live score remains **219 checked / 61 unchecked /
280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-hosted-retry-production-rollout-2026-10-09.md`.

## Production code-rollout evidence — 2026-10-09

The reviewed Web source is deployed to Production as READY deployment
`dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN`, aliased to `https://verglos.com`, after
the local/remote build and read-only public smoke passed. This is real
Production shipping progress and is included in the active goal. It does not
close a checkbox: `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and
`PLAN-WEB-015` still require the complete provider lifecycle and
provider/ledger/entitlement reconciliation. Production plan IDs, payment or
database writes, migrations, entitlement changes, account changes, and
customer-data mutations remain fail-closed until their own preflight exists.
The live score is **219 checked / 61 unchecked / 280 total (78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-subscription-invoice-reconciliation-and-production-rollout-2026-10-09.md`.

## PLAN-WEB-014 subscription invoice-binding fix and Preview reconciliation · 2026-10-09

Web commit `a95deef` binds subscription captures through Razorpay's paid
invoice when the payment payload omits `subscription_id`, and normalizes the
observed string form of the provider `captured` flag without weakening the
captured/status/refund checks. Focused webhook tests passed **13/13**; the full
Web suite passed **891 total / 868 pass / 23 explicit skips / 0 fail**;
typecheck and the 45-page build passed. Preview deployment
`dpl_FBtepYT84UUNCcvjo1jj43HxU7KB` delivered a fresh canonical Test Mode
subscription whose provider invoice, payment, order, active subscription,
captured ledger row, and license binding reconciled in the isolated database.
No rows were manually edited. This advances but does not close the full Gate 4
matrix: renewal, failure, cancellation/expiry, refunds, replay/out-of-order,
and complete provider/ledger/entitlement reconciliation remain open. No
checkbox changed; the score remains **219 checked / 61 unchecked / 280 total
(78.2%)**.

Evidence: `docs/shipping/evidence/plan-web-014-subscription-invoice-reconciliation-and-production-rollout-2026-10-09.md`.

## Payment catalog/checkout abstraction accepted · 2026-10-09

`PLAN-WEB-013` is accepted from the current implementation and qualification
evidence. The server-owned method catalog, hosted order binding, fail-closed
method parsing, captured-only fulfillment, and provider-method validation are
implemented and tested. Preview and Production now expose only the four
provider-testable methods (`card`, `netbanking`, `wallet`, `emi`); the
canonical-amount Test Mode aggregate and isolated database qualification are
recorded in `docs/shipping/evidence/plan-web-014-preview-hosted-payment-lifecycle-2026-10-09.md`.
The remaining provider lifecycle and Production reconciliation work belongs
to `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and `PLAN-WEB-015`; it is not
being claimed here. Score is now **219 checked / 61 unchecked / 280 total
(78.2%)**.

## Backend/CLI external-gate recheck · 2026-10-09 · superseded by later setup

At the time of this read-only recheck, no open CLI PR or dependency-ready CLI
code gap was found and Preview lacked the isolated payment prerequisites. The
later same-day gate work created the isolated Neon test database, applied the
reviewed migration set, set the Preview isolation marker, enabled the Test Mode
method catalog, and verified the Test Mode webhook target. The current
subscription and Production rollout evidence is recorded above. This historical
entry is retained for audit order; no checkbox was changed by the recheck.

Evidence: `docs/shipping/evidence/backend-external-gate-recheck-2026-10-09.md`.

## QUAL-WEB-006 authenticated account performance trace · 2026-10-09

The fresh production `/account` lab trace measured LCP **784 ms**, TTFB **100
ms**, LCP render delay **684 ms**, and CLS **0.00**; CrUX field data was
unavailable. The concurrent YouTube-tab network chain was excluded as
contaminated. Legacy-JavaScript analysis found 14.4 KiB with zero estimated
FCP/LCP savings, so no code change was justified. This strengthens lab
evidence only; field INP, large-data, complete-route, screen-reader, and final
truth evidence remain open. No checkbox changed; the exact score remains
**218 checked / 62 unchecked / 280 total (77.9%)**.

Evidence: `docs/shipping/evidence/qual-web-006-account-performance-trace-2026-10-09.md`.

## QUAL-WEB-006 authenticated account runtime requalification · 2026-10-09

The current production authenticated `/account` route passed a read-only
reload with no console warnings/errors, one main, one heading, nine named
visible controls, no unnamed controls, no missing image alt values, no
horizontal overflow, and Lighthouse Accessibility/Best Practices/SEO
  **100/100/100**. Bounded keyboard traversal observed named links and body
  return. Paid account routes redirected through the existing gate without a
  paid fixture; privacy and organizations loaded read-only. This strengthens
  partial qualification only; human screen-reader, complete paid-route,
  large-data, field-CWV, and final truth gates remain open. No checkbox
  changed; the exact score remains **218 checked / 62 unchecked / 280 total
  (77.9%)**.

Evidence: `docs/shipping/evidence/qual-web-006-authenticated-account-runtime-2026-10-09.md`.

## QUAL-WEB-005 isolated account-deletion route E2E · 2026-10-09

The merged Web tree was qualified against a disposable local PostgreSQL 15
database: the explicit migration preflight applied **38 migrations** and
created **50 public tables**; migration ordering passed; the authenticated
privacy route E2E passed **1/1**; and the deletion-job lease/idempotency
integration passed **1/1**. This strengthens non-production deletion evidence
only. Legal/customer-held-record disposition, production migration/restore/
rollback, reconciliation, and independent acceptance remain open. No checkbox
changed; the exact score remains **218 checked / 62 unchecked / 280 total
(77.9%)**.

Evidence: `docs/shipping/evidence/qual-web-005-deletion-route-e2e-2026-10-09.md`.

## Vercel production/Preview configuration audit · 2026-10-09

Read-only Vercel metadata confirms the latest production deployment is READY at
Web `be4289f`, and production `DATABASE_URL` has an updated metadata timestamp
before that deployment. The value and target were not read. Preview has no
`DATABASE_URL`, no `VERGLOS_PREVIEW_DATABASE_ISOLATED`, and no enabled payment
catalog, so Preview remains safely payment-disabled. This supports rotation
and fail-closed deployment evidence but does not close R-041 or payment
lifecycle acceptance. No checkbox changed; the exact score remains **218
checked / 62 unchecked / 280 total (77.9%)**.

Evidence: `docs/shipping/evidence/vercel-production-preview-config-audit-2026-10-09.md`.

## Web duplicate PR cleanup · 2026-10-09

Web PR #169 was verified byte-for-byte identical to already merged PR #157,
based on a stale branch, and closed without merge. It produced no new product
change or acceptance evidence. No checkbox changed; the exact score remains
**218 checked / 62 unchecked / 280 total (77.9%)**.

## PLAN-WEB-014 Preview database-isolation guard · 2026-10-09

Web PR #170 (`3779616`) merged as `be4289f`. Preview payment configuration
now fails closed unless a TLS-safe database URL and explicit
`VERGLOS_PREVIEW_DATABASE_ISOLATED=true` marker are present; focused tests
passed **38/38**, the configured serial suite passed **864/864 with 24
explicit skips**, typecheck/build passed with 45 generated pages, and all
hosted checks passed. This is configuration safety only: isolated database
migrations, webhook target verification, provider Test Mode lifecycle, and
production reconciliation remain open. No checkbox changed; the exact score
remains **218 checked / 62 unchecked / 280 total (77.9%)**.

Evidence: `docs/shipping/evidence/plan-web-014-preview-database-isolation-guard-2026-10-09.md`.

## HUNT-011 current-head pinned Docker requalification · 2026-10-09

The exact merged CLI `origin/main` head `8bea4be2fa18533eafd088122be769e942965626`
was requalified in an isolated worktree with the pinned
`postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`
image. After a locked dependency install, the adversarial wrapper completed
with **60 pass / 1 documented macOS namespace skip / 0 fail**. This strengthens
the local HUNT-011 evidence only; independent security review, trusted/licensed
recipe provenance, and the dependent external gates remain open. No checkbox
changed; the exact score remains **218 checked / 62 unchecked / 280 total
(77.9%)**.

Evidence: `docs/shipping/evidence/hunt-docker-adversarial-origin-main-2026-10-09.md`.

## CLI/backend external-gate matrix · 2026-10-09

After CLI PR #87 merged, the live CLI queue and hosted PR state were re-read.
No open CLI PR or dependency-ready CLI code gap was found. HUNT, plan,
organization, Studio, Enterprise, licensing, distribution, and release rows
remain unchecked only where their stated acceptance requires trusted roots,
production activation, hosted provider/SCM evidence, legal approval,
independent review, customer authorization, protected publishing, or an
authenticated operational drill. The item-by-item disposition is recorded in
`docs/shipping/evidence/cli-backend-external-gate-matrix-2026-10-09.md`.
No checkbox changed; count remains **218 checked / 62 unchecked / 280 total
(77.9%)**.

## PLAN-CLI-003 production read-only forged-route recheck · 2026-10-09

The approved Chrome session performed a same-origin read-only production
modified-client probe with forged plan, capability, tenant, usage,
organization, fingerprint, and receipt inputs. Forged capability stayed Free;
invalid license and score-history requests returned 401; forged organization
usage/search/projects returned 403; forged receipt lookup returned 404. Private
routes returned `private, no-store` where applicable. This strengthens
PLAN-CLI-003 only: the authorized paid/org fixture and complete
list/search/export/public-private matrix remain missing. No checkbox changed;
count remains **218 checked / 62 unchecked / 280 total (77.9%)**.

Evidence: `docs/shipping/evidence/plan-cli-003-production-readonly-forged-route-recheck-2026-10-09.md`.

## DIST-006 rollback rehearsal boundary completeness · 2026-10-09

CLI PR #87 (`0cbefab`) merged as `8bea4be`. The local rollback rehearsal now
fails closed unless its fixture covers exactly one npm-package, engine-manifest,
Hunt-feed, signing-identity, and Web-deployment boundary; incomplete and
duplicate boundary sets are rejected before decision evaluation. Focused
rollback tests pass **5/5**; the full CLI test command, typecheck, build,
public-boundary audit, package/release contracts **11/11**, hosted self-scan,
in-toto binding, and all nine platform cells pass. This is local rehearsal
hardening only: no authenticated registry/provider/signing/deployment rollback
or revocation was executed, so `DIST-006` remains unchecked. No checkbox
changed; count remains **218 checked / 62 unchecked / 280 total (77.9%)**.

Evidence: `docs/shipping/evidence/dist-006-rollback-boundary-completeness-2026-10-09.md`.

## QUAL-WEB-006 deployed docs contrast recheck · 2026-10-08

The merged Web contrast correction is live on `/docs/2.0.0`. Read-only desktop
and mobile Lighthouse both report Accessibility 100 and Best Practices 100;
the mobile DOM has no horizontal overflow, four named focusable links, and no
unnamed controls. No console warnings/errors were observed. Remaining failures
are the held `rel=canonical` and optional `llms.txt` metadata audits. This is
partial qualification only; no checkbox changed and the count remains
**218 checked / 62 unchecked / 280 total (77.9%)**.

Evidence: `docs/shipping/evidence/qual-web-006-deployed-docs-contrast-2026-10-08.md`.

## PLAN-CLI-004 + QUAL-WEB-006 fat batch · 2026-10-08

CLI PR #84 (`7c02099`) adds a process-level legacy-v1 activation fallback
rehearsal; focused 63/63, full CLI 12/12, typecheck 13/13, build 8/8, and lint
5/5 pass locally. PR #84 merged as
`94829e1a4fc8e42dd67545e99cbe9a3a837b9482` after all hosted platform,
self-scan, and in-toto checks passed. Web PR #164 (`4e00cc3`) fixes the
`/docs/2.0.0` Hunt CTA contrast defect and merged as
`394d697903b7fa12ec537dc667f3807cdd75f588` after hosted
typecheck/schema, Vercel, Preview Comments, and GitGuardian passed. A read-only
production route sweep found no console errors; remaining metadata/llms
findings are held under the public truth freeze. No checkbox changed; count
remains **218 checked / 62 unchecked / 280 total (77.9%)**.

Evidence: `docs/shipping/evidence/plan-cli-004-qual-web-006-batch-2026-10-08.md`.

## QUAL-WEB-006 / held public truth finding · 2026-10-08

Read-only Chrome qualification of `/docs` passed Accessibility 100, Best
Practices 100, and SEO 100 with no console warnings/errors. The optional
Agentic Browsing score was 67 because `llms.txt` lacks the recommended H1
shape. The docs plan table still displays legacy `$29/mo` and `$199/mo` rows,
which conflict with the current verified INR Pro catalog; this is recorded for
the held final truth/pricing pass and was not changed prematurely. The count
remains **218 checked / 62 unchecked / 280 total (77.9%)**.

## DIST-006 rollback/revocation rehearsal · 2026-10-08

CLI PR #83 merged as `c1a2856`. A local bounded rehearsal now covers npm,
engine-manifest, Hunt-feed, signing-identity, and Web-deployment rollback or
revocation decisions, including the approval failure path and historical-record
preservation. It performs no provider, registry, signing, deployment, database,
or production write. `DIST-006` remains unchecked pending real authenticated
operations and operational review. Count remains **218 checked / 62 unchecked /
280 total (77.9%)**.

Evidence: `docs/shipping/evidence/dist-006-rollback-rehearsal-2026-10-08.md`.

## Production read-only browser qualification · 2026-10-08

Chrome CDP inspected production `/account` and `/checkout` without creating an
order. Checkout rendered UPI, Cards, Netbanking, Wallets, EMI, and Pay Later
labels and no QR label; no console/exception events were observed. This is
runtime progress only. `QUAL-WEB-006` and `PLAN-WEB-015` remain unchecked.
Count remains **218 checked / 62 unchecked / 280 total (77.9%)**.

Evidence: `docs/shipping/evidence/qual-web-006-plan-web-015-production-readonly-cdp-2026-10-08.md`.

## CLI check-payload batch merged · 2026-10-08

CLI PR #80 passed its full hosted qualification and merged as
`d865fb1809ad651fd6ae7e011f089dee07733d79`. TEAM-CLI-002 remains unchecked:
signed organization policy, hosted SCM/provider delivery, installation
authorization, and live retry/replay evidence are still required. Count is
unchanged at **218 checked / 62 unchecked / 280 total (77.9%)**.

## TEAM-CLI-002 implementation progress · 2026-10-08

CLI PR #80 head `58bb9383bdd1273e973620472ffc2d9255be7e9d` wires the existing
shared source-free check-payload contract into `verglos ci`. Local focused and
full CLI verification passes. The item remains unchecked because signed
organization-policy activation, hosted SCM/provider delivery, installation
authorization, and live retry/replay evidence are still required. Count is
unchanged at **218 checked / 62 unchecked / 280 total (77.9%)**.

Evidence: `docs/shipping/evidence/team-cli-002-cli-check-payload-2026-10-08.md`.

## CLI entitlement cache and reporting · 2026-10-08

PLAN-CLI-001/002 progress: CLI PR #80 (`8f731b3`) fixes cache identity reuse,
cache age bounds and whoami effective-plan reporting. Supporting 003/004
regression evidence passes. Node 22 focused tests 103/103; configured CLI
suite/typecheck/build/boundary checks pass. Hosted checks and existing item
acceptance gates remain open; no checkbox changed (218/62/280, 77.9%).
Evidence: `docs/shipping/evidence/plan-cli-cache-identity-whoami-2026-10-08.md`.

Updated: 2026-10-07

## Current verified checkpoint · 2026-09-30

QUAL-WEB-005 concurrency hardening (2026-10-07): Web PR #153 commit `85faba9`
serializes hold activation/release with every destructive deletion transaction
and terminal receipt through a user-scoped PostgreSQL advisory lock. Active
holds are rechecked at supporting deletion, hosted-kind deletion, and
completion; the worker blocks rather than claiming success. Focused deletion/
hold tests pass 35/35, the disposable PostgreSQL integration passes 1/1,
typecheck, schema/migration checks, and diff check pass. Hosted Verify
`37633633802` completed successfully at exact head; Vercel and Preview
Comments were also green. This is implementation/runtime
evidence only; no checkbox changed and the authoritative count remains
**218 checked / 62 unchecked / 280 total (77.9%)**. Authenticated deletion E2E,
legal/customer-held disposition, production migration/cutover,
reconciliation, restore/rollback, and independent acceptance remain open. No
production/provider/payment/database/deployment operation occurred.

Web PR #103 merged as `0a85f08` after hosted run `36686440312`, adding route-boundary qualification progress for QUAL-WEB-001. Every protected organization API method is probed with malformed, traversal-shaped, and zero-UUID organization identifiers; fixed denials, no identifier echo, and authorization-before-data-access are proven. This is progress only: modified/untrusted CLI behavior and complete list/search/export/cache/public/private coverage remain open. PR #102 remains held under the public truth/marketing freeze. No checkbox changes or production operations occurred.

Web PR #104 merged as `98169fa` after hosted run `36689496063`, adding modified-client entitlement evidence: forged plan/tier, tenant, capabilities, allowances, usage, and record fields are ignored in favor of server-resolved license, tenant, role, and catalog values. QUAL-WEB-001 remains open pending the complete request and boundary matrix. No checkbox changes or production operations occurred.

Web PR #108 merged as `7279ef2` after hosted run `36691398858`, extending private cache-boundary evidence to evidence and policy-evaluation list/create routes. Every response path is now covered by `private, no-store` headers, with 12/12 local tenant-scope contract tests and full hosted verification green. QUAL-WEB-001 remains open; modified-CLI and complete list/search/export/cache/public/private matrix evidence are still required. No checkbox changes or production operations occurred.

Web PR #110 merged as `18ddb408` after hosted run `36692358099`, extending `private, no-store` coverage to the remaining authenticated organization directory, member, project, policy, and release routes. The complete route inventory contract passes 13/13 locally and hosted verification is green. QUAL-WEB-001 remains open; modified-CLI and direct list/search/export/runtime public-private matrix evidence are still required. No checkbox changes or production operations occurred.

Web PR #111 merged as `c83300b` after hosted run `36693118104`, extending `private, no-store` coverage to account sync, CLI-auth, license status, score history, and monitor routes, including shared paid-license denials. Combined focused contract tests pass 17/17 locally and hosted verification is green. QUAL-WEB-001 remains open; modified-CLI and direct runtime list/search/export/public-private matrix evidence are still required. No checkbox changes or production operations occurred.

The authoritative private backlog currently contains **218 checked / 62 unchecked / 280 total (77.9%)**, recalculated from every task checkbox. Web commits `82d2157` + `a24fef7` on `feat/web-qual-batch` are a qualification-substrate progress batch for QUAL-WEB-001, QUAL-WEB-005, and QUAL-WEB-006: its 18 focused tests, full configured Web suite (852 total / 830 pass / 22 environment-gated skips), typecheck, and production build pass on the exact branch. The follow-up hardens the accessibility gate against empty, non-finite, and negative measurements. PR #100 merged as `666317e` after hosted typecheck/schema, tests, DB/migration checks, build, public-boundary, dependency/security, Vercel, and GitGuardian checks passed. Web PR #101 (`feat/web-final-001-truth-registry`) was repaired against the merged quality head with merge commit `8c67399`; its hosted checks pass and the local configured suite is 877 total / 855 pass / 22 environment-gated skips. It remains intentionally unmerged under the held FINAL-WEB-001 phase until the founder authorizes the truth-freeze/final web pass. PR #138 merged as `6e9c707`, adding deterministic serial qualification execution and pinning the two high-severity transitive audit dependencies; its hosted typecheck/schema, build, preview, security, and Vercel checks passed. No checkbox is changed by that tooling work: route-level deletion, browser accessibility/CWV measurements, and hosted/provider evidence remain separate gates. No production DB/environment read or write, migration, deployment, release, or marketing action occurred.

Latest verified checkpoint (2026-09-20): **105 unchecked / 164 checked / 269 total**, recounted after accepting QUAL-WEB-002. Web PR #48 merged exact tested head `508cde0bbc99ca96833e119f1b64a293674cc18a` as `5420ad13190406d1ede3e3e75e18f25f1c655551`. The qualification adds per-attempt public-address validation plus address-pinned HTTPS connections, no redirects, request/response/time bounds, strict webhook input validation, constant-time Razorpay signature checks, and PostgreSQL event-id/payload-digest replay claims. The isolated PostgreSQL 15 run passed all 280 tests with zero skips; typecheck, schema check, 18-migration ordering, production build, public-boundary, license/SBOM, GitGuardian, Node 22 hosted verification, and Vercel preview checks passed. The disposable from-zero migration rehearsal stopped at the already documented foundational `0000`/missing-`licenses` gap; no production database was read or written, no production deployment/release/marketing action occurred, and the private shipping documents remain local-only.

PLAN-WEB-011/012 implementation checkpoint (2026-09-20): Web PR #49 is OPEN/MERGEABLE at exact head `b103d9e5793913b52207af0497586159dc16cc15`. Catalog-only checkout derivation, signed immutable one-time checkout snapshots, owner-bound/read-only QR status, captured-payment-only grants, serialized immutable payment-ledger renewal, lifecycle ordering, refund accounting, and replay/cross-channel defenses are implemented with ordered migration `0018`. Local blank-DB suite passes **291 / 292** with the migrated-ledger test intentionally skipped; that integration test passes separately against all 19 migrations. Typecheck, schema/migration checks, 37-page production build, public-boundary, secret, SBOM/license, and exact-head hosted run `35503776577` plus GitGuardian and Vercel preview pass. Keep PLAN-WEB-011/012 unchecked: current Pro remains an unverified, non-purchasable USD catalog row, no real INR price is approved, migration `0018` is not production-qualified/applied, and no live gateway/production checkout-refund-renewal evidence exists. No production environment or database was read or written, and no production deployment occurred. Counts remain **105 unchecked / 164 checked / 269 total**.

DIST-WEB-002 progress checkpoint (2026-09-20): Web PR #49 is OPEN/MERGEABLE at exact head `b103d9e5793913b52207af0497586159dc16cc15`. The complete code-side production matrix, selected PostgreSQL queue/JSONB storage values, `.env.example` drift check, value-free fail-closed process tests, and complete-matrix success path remain implemented and green in exact-head hosted run `35503776577`. Keep DIST-WEB-002 unchecked: the current Vercel credential returns `Not authorized`, so the actual production variable-name/scope matrix and a production deployment remain unverified. No production environment value or DB data was read, and no production operation occurred. Counts remain **105 unchecked / 164 checked / 269 total**.

Latest verified checkpoint (2026-09-14): **128 unchecked / 141 checked / 269 total**, recounted from all task checkboxes. ENT-CLI-002 is accepted on CLI PR #38 exact head `55a052ac71868e1be166b570ea8a2c4359ef61d0`: provider-neutral signing interface, explicit signer/issuer and key-lifecycle policy, non-exportability assertion, active/retired/revoked rotation behavior, and an explicitly opt-in test fixture. Signature v1.1 cryptographically binds signer, issuer, key ID, and signed-at metadata; v1.0 remains verifiable only as an identity-unbound legacy envelope and is rejected by trusted-policy verification. Focused signing tests 8/8; forced uncached CLI dependency-graph test/typecheck/build pass 18/18 Turbo tasks; package-content and public-boundary audits pass; exact-head self-scan and all nine Ubuntu/macOS/Windows × Node 20/22/24 checks pass (matrix `34863364060`, self-scan `34863364108`). PR #38 is OPEN/CLEAN with no recorded review decision and contains no private shipping documents. Web PR #33 remains OPEN/CLEAN at `3377a26bddbd0998ab82d0d98695473427434aec`. No production DB/environment read or write, merge, deploy, publish, or release occurred; internal docs remain private. This is a contract and fixture only: no KMS/HSM adapter has been deployed or independently qualified, and R-011 remains open for production trust roots, custody, trusted time/transparency, and operational rotation/revocation drills.

Previous verified checkpoint (2026-09-14): **129 unchecked / 140 checked / 269 total**. QUAL-CLI-005 is accepted at CLI PR #38 exact head `9fc208b14cf8bedd4d26ad5290a081324a39eff9`: a process-level engine-exit drill removes Docker from the test PATH, confirms Trivy and aggregate coverage remain incomplete with exit 3, preserves one imported SARIF observation without its raw message, and confirms snapshot policy check remains INCOMPLETE/exit 3. A pre-existing schema-1.0 release record remains byte-identical, verifies offline as PASS, and its verified decision header renders through the local viewer. Focused drill passes 1/1; forced uncached CLI dependency-graph tests/typecheck/build pass 18/18 Turbo tasks. Exact-head self-scan `34859651208` and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in matrix `34859651096` pass. PR #38 remains OPEN/CLEAN; its file list contains no private shipping documents. PR #33 remains OPEN/CLEAN at `3377a26bddbd0998ab82d0d98695473427434aec`. QUAL-CLI-004 remains gated on HUNT-011; LIC-002 remains open for premium content provenance/licensing; PLAN-WEB-003/PLAN-CLI-001 remain open for production signer/public-pin and deployed activation evidence; OPS-001 remains open pending provider workload/security/recovery/cost qualification. No production DB/environment read or write, merge, deploy, publish, or release occurred; internal docs remain private.

LIC-002 inventory recheck (2026-09-14): current pinned Trivy Docker adapter, optional detect-secrets probe, Sigstore dependencies/copied fixtures, implemented standards paths, and present scanner fixtures were reconciled into `VERGLOS_THIRD_PARTY_INVENTORY.md`. **LIC-002 remains unchecked**: premium recipe/rule content has no authenticated publisher/root or approved content-license, provenance, modification, and trademark record; scanner fixture authorship/source remains unresolved. This LIC-002-only checkpoint changed no checkbox.

OPS-001 queue/provider progress (2026-09-14): Web commit `3377a26bddbd0998ab82d0d98695473427434aec` is pushed to PR #33 and adds a provider-neutral interface. Exact-head CI run `34846092388` passes 112/112 tests with PostgreSQL integration active, typecheck, schema/migration checks, production build, and security/license/public-boundary checks; Vercel and GitGuardian pass. This is implementation/test progress only. The canonical architecture decision set defers provider selection until representative workload, lease/recovery, security/privacy, exit, and actual-cost qualification exists; therefore **OPS-001 remains unchecked**. Do not treat existing PostgreSQL tables, the contract interface, or a cron trigger as an accepted provider decision. Counts remain **131 unchecked / 138 checked / 269 total**.

Previous verified checkpoint before the latest CLI entitlement and OPS-001 batches (2026-09-14): **131 unchecked / 138 checked / 269 total**. RECORD-006 and VERIFY-WEB-001 were accepted on open PRs: CLI #38 head `4545eb4f1e1b6d7476e4434c08336695d82a60a0`, Web #33 head `2d89869e75d3d0316bf71e94d585a64bff8e34ef`. Web route recomputes the digest of normalized allowlisted receipt fields; its PostgreSQL-backed handler test proves auth-before-body, tenant/project isolation, exact retry, conflicting identity rejection, source/size/stale-digest rejection, and persisted-content verification. Web run `34835571918`: tests 98/98 with route integration active, typecheck, 17-migration check, build, public-boundary, dependency audit, SBOM/license tests, secret guard, GitGuardian, and Vercel pass. CLI #38 ten exact-head hosted checks pass; local CLI/shared graph 18/18. No production DB operation, merge, deployment, publish, or release. Object custody, full-record verification beyond submitted projections, production backfill/reconciliation/recovery, legal review, and remaining backlog stay open.

Latest verified checkpoint (2026-09-14): **132 unchecked / 137 checked / 269 total**, recalculated from task checkboxes. RECORD-006 is accepted at CLI PR #38 exact head `4545eb4f1e1b6d7476e4434c08336695d82a60a0`; CLI commits `4545eb4` adds explicit keyless OIDC token-env signing with scoped sign/network approvals, binds and stores the canonical Release Record DSSE bundle, and independently verifies it against the caller's root plus exact certificate identity/issuer. The optional bundle/binding are integrated into `.vgl` package v1.1; existing v1.0 remains for packages without Sigstore evidence. Focused Sigstore/record process tests 13/13 and forced uncached CLI/shared test/typecheck/build 18/18 Turbo tasks pass; exact-head self-scan `34833650330` and all nine Ubuntu/macOS/Windows × Node 20/22/24 jobs in matrix `34833650299` pass. PR #38 is OPEN/CLEAN; no private documents are in the PR. Tests use mock Fulcio/Rekor/OIDC and a historical signed fixture; no live public Rekor write or interactive browser login occurred. Guided UX/tier entitlement, license review, and the broader release gates remain distinct. No production DB operation, merge, deploy, publish, or release occurred.

Latest verified checkpoint (2026-09-14): **133 unchecked / 136 checked / 269 total**, recalculated from task checkboxes. RECORD-012 is accepted at CLI PR #38 exact head `96bf9846b6fd892194c20a24bf3d9e9bd39387e0`; commits `e14ac41`, `df9ccb9`, and `96bf984` are pushed. Exact-head self-scan `34819191034` and all nine Ubuntu/macOS/Windows × Node 20/22/24 jobs in matrix `34819191038` pass; PR #38 is OPEN/CLEAN. Uncached CLI/shared test, typecheck, and build pass 18/18 Turbo tasks; focused provenance importer/provider/subject-binding tests 9/9 and CLI record create/import tests 11/11 pass; `git diff --check` and public-boundary audit pass. The importer preserves source bytes and honestly records provider as caller-declared and all envelope signatures as unverified; independent provider/trust-root signature verification remains separate RECORD-006 work. No web code, production DB read/write/migration, merge, deployment, release, or marketing change occurred; private shipping docs were not pushed.

Current checkpoint (2026-09-14): **134 unchecked / 135 checked / 269 total**, recalculated from every task checkbox. RECORD-002, RECORD-009, and RECORD-011 are accepted on complete synthetic CLI-process evidence. CLI PR #38 is OPEN/CLEAN at `a8987771eff59d3219e4fd4df857deaaf17b80d3`; self-scan `34814230628` and all nine Ubuntu/macOS/Windows × Node 20/22/24 jobs in matrix `34814230639` pass. RECORD-011 now projects only allowlisted decision/subject/redaction fields, uses conservative `incomplete` / `not-established` coverage and `unknown` / `unsigned` / `unverified` signer states, and withholds free-form limitations in both `record project` JSON and the in-toto export; synthetic source/path/finding/secret/tenant/client/policy/issuer/signature canaries are excluded from the tested local public projections and viewer. Focused shared tests 7/7, CLI record-project/create process tests 12/12, forced uncached CLI/shared test/typecheck/build 18/18 Turbo tasks, `git diff --check`, and public-boundary audit pass. Hosted receipt ingestion, upload/log/support channels, guided Sigstore identity, and independent proof of producer-declared redaction remain separate open work. Web PR #33 remains OPEN/CLEAN at `75b9a482ffdbaf3e31b273550af4aa2585d8a0bb`; no Web code changed. No production DB read/write/migration, merge, deploy, release, or marketing change occurred; internal docs remain local-only.

Verified checkpoint (2026-09-14; supersedes older checkpoint entries below): **137 unchecked / 132 checked / 269 total**, recalculated from every task checkbox after accepting AGENT-007. CLI PR #38 is OPEN/CLEAN at `e95e0e7a56a1318e4302eefe3f11a1563b0d8f6f`; local uncached dependency tests/typecheck/build pass 18/18 Turbo tasks, focused projection/CLI canary tests pass 7/7, and exact-head self-scan `34780184433` plus all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in matrix `34780184513` pass. Web PR #33 is OPEN/CLEAN at `75b9a482ffdbaf3e31b273550af4aa2585d8a0bb`; typecheck/schema, GitGuardian, Vercel, and preview checks pass. AGENT-007 remains accepted with its full tested mutation-approval and rollback boundary. The root CLI local shipping mirror had AGENT-003/005 unchecked (140/129); canonical private evidence supports their existing acceptance, and the local mirror has been reconciled without treating that source-copy correction as new product progress. RECORD-002 and RECORD-011 remain open; the public projection now withholds arbitrary limitations and custom policy identifiers, with synthetic source/path/secret/tenant canaries tested at shared and CLI-output layers. Signature/coverage projection, redaction-manifest generation, portable `.vgl` transport/integration, complete assembly, and hosted receipt integration remain open. No database read/write, migration, merge, deployment, or release occurred. Internal docs remain local-only; marketing remains held.
The latest projection state supersedes older RECORD-011 task-description wording below that listed policy identifiers or raw free-form limitations as public fields.

HUNT-002 implementation addendum (2026-09-13): local CLI commit `2318b9d` adds bounded CLI verification of recipe/feed/license signatures and digests against a caller-supplied trust-store file, with explicit no-execution and no-legal-clearance output. It is preparatory progress only; no official publisher roots/feed or real licensed source are established. No checkbox changed; current total remains **138 unchecked / 131 checked / 269 total**.

DIST-WEB-002 execution addendum (2026-09-13): Web commits `5f74817`, `1ce37f9` on PR #33 wire production configuration validation into Vercel production builds and the Next.js Node server startup, with process tests proving fail-closed behavior and no secret-value output. Web tests 91/93 passed (2 PostgreSQL integration tests skipped without the configured test database), typecheck/build/migration checks passed locally; exact-head hosted checks are pending. Keep DIST-WEB-002 unchecked: queue/object-storage providers remain intentionally deferred under OPS-001/R-028, and the actual production env matrix could not be inspected because the local Vercel token lacks access to the linked project scope. No production env values were read. No checkbox changed; **138 unchecked / 131 checked / 269 total**.

Latest checkpoint (2026-09-13): **138 unchecked / 131 checked / 269 total**, recalculated from every task checkbox. CLI PR #37 is merged at `7813033a2e727fcf018d8a6cdef24573c3a58e19`; PR #38 is OPEN/CLEAN at `84e2932651cc9a42f57bec8021b6c97f977315de`, with self-scan `34770765039` and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in matrix `34770765059` passing. Web PR #33 remains OPEN/CLEAN at `a698c9074a1de34eaad32e880e5ecb3e40d46ea1`; hosted verification `34757829628`, GitGuardian, and Vercel pass. `LOCAL-002`, `LOCAL-003`, `LOCAL-004`, `LOCAL-005`, and `QUAL-CLI-002` are accepted. CLI forced uncached tests/typecheck/build passed 23/23 Turbo tasks for the current Phase 3 worktree. Local CLI commit `40b16dc` adds Ed25519 signed-feed, exact recipe digest, embedded license-text digest, feed-origin/key validity, expiry, and revocation verification; it is not pushed and does not change HUNT-002 acceptance state. HUNT-002 remains open until an actual publisher root/feed and license provenance are established and integrated; generated test keys are not production trust evidence. Analytics transmission remains off pending R-014/OPS-012 hosted owner/access/retention/deletion/legacy-client controls. No production DB read/write, migration, deployment, merge, or release occurred in this batch. HOSTED-013/R-021 remain open for data reconciliation/recovery. Private docs remain local-only; marketing remains held.

Latest production source audit (2026-09-12T17:48:12Z): bounded repeatable-read/read-only audit confirms 12/12 legacy tables, 74 aggregate rows, 15 migration-history entries, complete per-table source digests, zero live CLI auth codes, and no aggregate orphan/duplicate/shape failures. It found one founder-override license, one monitor registration with 1,350 dependencies and a non-empty legacy channel object, and one canary alert. `legacy_migration_mappings` is absent; local migration `0015` remains uncommitted and unapplied. No source rows were selected and no production write occurred. Full evidence and SHA-256 digests: `PRODUCTION_SOURCE_AUDIT_2026-09-12.md`. HOSTED-013 remains unchecked; counts unchanged at 150 unchecked / 119 checked / 269.

Production schema evidence update (2026-09-12): updated `neon-string` credential in the ignored CLI `.env` was used only by `pnpm db:migration-audit` without `--exact-counts`. The project's audited connection ran in a repeatable-read, read-only transaction with bounded statement/lock timeouts. It found 10 of 33 declared public application tables present and 23 missing; only the `public` application schema exists, and no migration-history table/columns were discoverable. Migration directory/journal validation found 15 ordered PostgreSQL migrations with fingerprint `sha256:1ac092dfddcd50be505a978436871e16e3e933854dc997c11d6bad20a66b7931`. No customer rows were selected; no production DDL/DML/migration/write occurred. HOSTED-013/R-021 remain blocked; no checkbox accepted. Counts remain 152 unchecked / 117 checked / 269.

Migration execution preflight detail (2026-09-12): read-only comparison of existing production schema to current Drizzle definitions found all 87 column names, SQL types, and nullability values match across the 10 existing tables. Schema-only production dump replay against a disposable PostgreSQL 18 clone subsequently confirmed no existing-table difference in columns, defaults, constraints, or indexes after all 15 migrations; grants and full data reconciliation remain unverified. A bounded read-only count for migration `0000`'s `licenses.plan='sentinel'` update returned 0 affected rows, while the migration also changes the `plan` default to `pro`. This does not establish safe replay: there is no production migration history or tested restore/rollback evidence. Do not run `pnpm db:migrate` yet. Counts unchanged.

Migration preflight update (2026-09-12): web commit `9eba73d` is pushed to existing PR #32. Added `pnpm db:migration-audit` for explicit-URL, repeatable-read/read-only schema audit, migration-file/journal fingerprint, missing/present table inventory, and opt-in exact counts with bounded statement/lock timeouts. Local full suite is 86/86 with PostgreSQL, typecheck/build/Drizzle schema and migration checks pass; hosted run `34679868578`, GitGuardian, and Vercel pass, and PR #32 is OPEN/CLEAN. The isolated local audit DB contains zero application tables. This is tooling/preflight evidence only: unsigned, no source data, key ranges, orphan/duplicate audit, row digests, or production migration-history proof. R-021/HOSTED-013 remain open; no checkbox accepted. Count remains 152 unchecked / 117 checked / 269.

Correction (2026-09-12; supersedes the following historical credential sentence): the current ignored CLI `.env` contains separate `neon-api-key` and `neon-string` entries. The management API credential's `GET /api/v2/projects` returned HTTP 401; separately, `neon-string` successfully supported bounded, read-only PostgreSQL audits documented above. No production write or migration occurred. The earlier local PostgreSQL 15 `blocked-missing-tables` run remains valid only for that isolated empty database; it was not production evidence.

Migration preflight fail-closed revalidation (2026-09-12): web `23886fc` was PR #32's exact head; workflow `34680162069`, GitGuardian, and Vercel passed. With an isolated disposable local PostgreSQL 15 database, the audit emitted `preflightState: blocked-missing-tables`, `missingTableCount: 33`, aggregate table states only, and process exit 2. This was not production evidence. HOSTED-013/R-021 remain open; counts at that earlier checkpoint were 152 unchecked / 117 checked / 269.

Hunt runtime update (2026-09-12): Docker Desktop is reachable. `@verglos/hunt` test run against local `busybox:1.36@sha256:73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662` passes 51 tests; the only skip is the Linux-host PID/IPC namespace comparison, unavailable to the macOS test host. This strengthens HUNT-011 evidence but does not satisfy the full adversarial suite or independent review. Backlog count remains 152 unchecked / 117 checked / 269.

Seven-hour audit checkpoint (2026-09-12): the exact audit window contains 120 CLI commits (`ab6e8f8`–`4435964`) and 21 web commits (`7fa52a3`–`4a6571a`), 141 total. Commit records and aggregate implementation/test diffs were reconciled against acceptance criteria. The latest package batch adds local DIST-001 artifact evidence but does not check off the item because its LOCAL/HUNT/RECORD dependencies remain incomplete. CLI `d7430a5` fixes Windows rollback failures; focused fix tests pass 20/20, Turbo test/typecheck/build passes 23/23 tasks, and hosted self-scan plus all nine OS/Node matrix cells pass. The previous web `08a8c46`/`bdb7045` fixture and run `34670279912` are superseded by the scoped database facade and run recorded above. Legal clearance/publication remain separate open gates.

This is the dependency-ordered execution tracker for the final Verglos V1 described by `SHIP_VERGLOS_FINAL.md`, `VERGLOS_PRODUCT_ARCHITECTURE_BLUEPRINT.md`, and `VERGLOS_COMPANY_USAGE_AND_FEATURE_MAP.md`.

## Scope lock

- Authorized repositories: `verglos-cli` and `verglos-web` only.
- Product sequence: Inspect -> Decide -> Prove -> Monitor.
- Native deep source analysis remains JavaScript/TypeScript. Adapter/import coverage is labeled separately.
- Free remains useful without signup, source upload, or local metering.
- The Apache CLI is not a commercial security boundary. Hosted authorization and bounded operational value are enforced server-side.
- Trivy is an attributed, pinned, replaceable sensor. Trivy types and display language cannot enter policy, billing, dashboard, or Release Record contracts.
- Missing, stale, incompatible, or failed evidence yields `INCOMPLETE`, never an empty success or false `PASS`.
- Ordinary scanning never executes target code. Hunt is explicit, approved, recipe-bound, isolated, and network-denied by default.
- Blog work is outside the two authorized repositories and is excluded.
- Landing-page, homepage, campaign, and marketing-copy changes are held until the final truth-lock phase. They must not begin without a later founder command.
- External POC, comparative benchmark publication, paid pilots, and campaign launch start only after the release candidate passes internal gates.

## Tracker rules

- Checkbox state is the task state: unchecked = `not-started`; the active item must also be named in `STATUS.md`; completed items require acceptance evidence and commit IDs.
- Every task is a deployable or independently reviewable behavior slice and forecasts one commit. Split into two or three only when reviewability demands it; combine adjacent IDs only when they are genuinely one deployable behavior. Tests ship with the behavior they prove unless an independently useful fixture/contract must land first.
- Every implementation commit updates this tracker, `STATUS.md`, and `TRACEABILITY.md` when state or evidence changes.
- `Commit(s): —` is replaced with repository-local SHAs. A commit never spans both repositories.
- Do not mark a task verified from compilation alone when behavior, security, isolation, tenancy, billing, migration, or recovery is involved.
- Non-goals for every task: unrelated refactors, speculative services, hidden source upload, silent engine install, client-only paywalls, unsupported claims, and marketing work before the final phase.

## Commit forecast

This is a planning baseline, not a quota. Split or combine only when a logical review boundary demands it.

| Epic | CLI commits | Web commits | Total |
|---|---:|---:|---:|
| 00 Truth, governance, and migration inventory | 13 | 0 | 13 |
| 01 Versioned evidence contracts | 12 | 0 | 12 |
| 02 Target and immutable subject resolution | 11 | 0 | 11 |
| 03 Engine manager and Trivy adapter | 15 | 0 | 15 |
| 04 Standards import/export | 12 | 0 | 12 |
| 05 Normalization, lineage, and release diff | 9 | 0 | 9 |
| 06 Policy, baselines, exceptions, and CI | 13 | 0 | 13 |
| 07 Local command product and viewer | 12 | 0 | 12 |
| 08 Agent/MCP safety and Hunt | 18 | 0 | 18 |
| 09 `.vgl`, signing, and verification | 12 | 2 | 14 |
| 10 Hosted tenant/evidence data model | 0 | 13 | 13 |
| 11 Durable monitoring and operations | 0 | 15 | 15 |
| 12 Entitlements, usage, quotas, and billing | 4 | 12 | 16 |
| 13 Pro dashboard and migration | 0 | 10 | 10 |
| 14 Team workflows | 2 | 10 | 12 |
| 15 Studio workflows | 1 | 10 | 11 |
| 16 Enterprise contract surfaces | 2 | 8 | 10 |
| 17 Packaging, provenance, licensing, and release | 11 | 3 | 14 |
| 18 Integrated qualification | 6 | 6 | 12 |
| 19 Post-RC acceptance and GA truth lock | 9 | 1 | 10 |
| **Core ship forecast** | **162** | **90** | **252** |
| 20 Held final landing/marketing pass | 0 | 8 | 8 |
| **End-to-end forecast** | **162** | **98** | **260** |

Expected working range: 250–290 commits. Reforecast after Epics 00–02 expose migration and compatibility complexity.

## Critical path

`TRUTH -> CONTRACT -> TARGET -> ENGINE/IMPORT -> GRAPH -> POLICY -> LOCAL -> HUNT/RECORD -> HOSTED DATA -> OPERATIONS -> ENTITLEMENT -> DASHBOARDS -> DISTRIBUTION -> QUALIFICATION -> ACCEPTANCE -> FINAL MARKETING`

---

## Epic 00 — Truth, governance, commercial boundary, and migration inventory

Evidence/problem: public and internal registries disagree on plan names, prices, maturity, history, Hunt/Attest semantics, and the commercial boundary. The CLI branch is ahead of `origin/main` and contains untracked founder documents/assets. Preserve all of them.

- [x] **TRUTH-001** · `verglos-cli` repo-wide inventory · deps: none · Map every command, flag, package, detector, report, network call, telemetry field, entitlement, and current test to shipped/partial/planned evidence. Acceptance: paths and tests populate the truth registry; no behavior changes. Impact: docs only; all plans. Commit(s): `9877482`
- [x] **TRUTH-002** · `verglos-web` routes/libs/schema inventory · deps: TRUTH-001 · Map hosted auth, licenses, activations, reports, telemetry, monitoring, alerts, attest summaries, account routes, and production dependencies. Acceptance: every current hosted claim links to code/schema evidence. Impact: docs only. Commit(s): `803c8b4`
- [x] **TRUTH-003** · `docs/shipping/VERGLOS_TRUTH_REGISTRY.md` · deps: TRUTH-001/002 · Expand registry to command- and capability-level states with evidence, owner, reviewed date, and public wording. Acceptance: no unqualified Hunt, Attest, Team, Studio, Enterprise, Trivy, `.vgl`, or dashboard claim. Commit(s): `6038545`
- [x] **TRUTH-004** · CLI/web plan registries · deps: TRUTH-001/002 · Record every mismatch among `shared/plans`, entitlement plans, web capabilities, database plan strings, checkout, and account UI. Acceptance: reconciliation decision is logged before implementation. Commit(s): `f8515dc`
- [x] **TRUTH-005** · open-core boundary inventory · deps: TRUTH-001 · Classify Apache core, commercial hosted operations, separately licensed maintained rules/recipes, and protected brand/signing identities. Acceptance: each package/data feed has one class and owner. Commit(s): `883e6b5`
- [x] **TRUTH-006** · third-party inventory · deps: TRUTH-001 · Inventory direct/transitive dependencies, existing licenses/notices, external engines, standards libraries, fixture licenses, and modification obligations. Acceptance: unknown classifications block redistribution, not local planning. Commit(s): `b758de3`
- [x] **TRUTH-007** · telemetry/privacy inventory · deps: TRUTH-001/002 · Document every outbound request, payload field, opt-in/out path, retention assumption, credential/log surface, and upload consent boundary. Acceptance: source/path/finding/secret leakage cases are named. Commit(s): `08a3b12`
- [x] **TRUTH-008** · hosted cost/usage ledger design · deps: TRUTH-002/004 · Define measurable units for seats, applications, records, storage, verification traffic, alert delivery, advisory work, managed execution, and support. Acceptance: units map to plan allowances without invented costs. Commit(s): `c80f16f`
- [x] **TRUTH-009** · data/schema migration inventory · deps: TRUTH-002 · Map current tables and API consumers to target tenant/project/subject/evidence model; identify dual-read/write and rollback needs. Acceptance: no destructive migration is proposed. Commit(s): `e66737a`
- [x] **TRUTH-010** · command compatibility inventory · deps: TRUTH-001 · Freeze current command/flag/exit behavior and deprecation risks against the target contract. Acceptance: compatibility fixtures are listed for every existing public command. Commit(s): `a76487d`
- [x] **TRUTH-011** · architecture decision set · deps: TRUTH-004/005/008/009 · Record modular-monolith/workers, one npm front door, evidence-producer boundary, language labels, plan catalog authority, queue/object storage decision gates, and signing model. Acceptance: material contradictions are explicit. Commit(s): `702b404`
- [x] **TRUTH-012** · risk register expansion · deps: TRUTH-005/006/007/009 · Add owners, severity, trigger, mitigation, rollback, and gate for licensing, migration, tenant, SSRF, Hunt, signature, quota, cost, and privacy risks. Commit(s): `eb438c5`
- [x] **TRUTH-013** · baseline verification · deps: TRUTH-001/002 · Run existing CLI tests/build/typecheck and web typecheck/build without modifying unrelated files; record exact commits and failures. Acceptance: baseline distinguishes pre-existing failures from new regressions. Commit(s): `744797c`

Ready after this epic: CONTRACT-001, PLAN-WEB-001. LIC-001 was completed in the 2026-09-12 release-evidence batch; LIC-004 is also complete.

## Epic 01 — Versioned subject, observation, decision, verification, and error contracts

Evidence/problem: current `ScanResult`/`Finding` are file-centric, use transitional optional fields, and cannot represent artifacts, engine health, imported lineage, incomplete coverage, policy decisions, or durable records.

- [x] **CONTRACT-001** · `packages/shared` schema/version primitives · deps: TRUTH-003/010 · Define semantic schema IDs, compatibility policy, canonical serialization rules, and bounded parsing errors. Acceptance: old report fixtures remain readable or fail with an actionable version error. Commit(s): `84d3921`
- [x] **CONTRACT-002** · subject contract · deps: CONTRACT-001 · Add versioned subject types for repository/tree, package, filesystem, SBOM, generic artifact, OCI manifest, and OCI index/platform. Tests: malformed IDs, mutable-only tags, missing digests, path bounds. Commit(s): `1bc2b1b`
- [x] **CONTRACT-003** · tool-run and engine-health contracts · deps: CONTRACT-001 · Model producer, binary/config/database/check digests, capabilities, timing, health, freshness, and incomplete reasons. Tests: absence/staleness/incompatibility. Commit(s): `a71fba7`
- [x] **CONTRACT-004** · canonical observation contract · deps: CONTRACT-002/003 · Model native/imported/adapter coverage, IDs, locations/layers, PURL/CPE, original/normalized severity, confidence, fix, references, redacted evidence, and namespaced extensions. Commit(s): `65ea279`
- [x] **CONTRACT-005** · AI-change context contract · deps: CONTRACT-002 · Separate heuristic/declared/cryptographic provenance with method, confidence, signals, limitations, and subject binding. Acceptance: no heuristic renders as fact. Commit(s): `f6be31e`
- [x] **CONTRACT-006** · verification-attempt contract · deps: CONTRACT-002/004 · Replace boolean-style verification with `confirmed`, `not_reproduced`, `inconclusive`, `not_supported`, `environment_error`, `policy_denied`; record recipe/sandbox/input/output/limits. Commit(s): `fc4d8d2`
- [x] **CONTRACT-007** · exception and approval contracts · deps: CONTRACT-002/004 · Add scope, owner, reason, expiry, compensating control, approver identity, and audit reference. Tests: expired and over-broad scopes. Commit(s): `2dd8ea3`
- [x] **CONTRACT-008** · policy evaluation contract · deps: CONTRACT-003/004/007 · Define PASS/REVIEW/BLOCK/INCOMPLETE reasons, evidence freshness, required checks, identity match, and deterministic exit mapping. Commit(s): `dc9e0b4`
- [x] **CONTRACT-009** · release-decision contract · deps: CONTRACT-008 · Bind policy, evaluation, approvals, exact subjects, generated time, decision identity, and limitations. Tests: subject mismatch and incomplete propagation. Commit(s): `03533ab`
- [x] **CONTRACT-010** · Release Record manifest contract · deps: CONTRACT-002-009 · Define member media type, digest, size, redaction, bundle/schema version, and extension rules without fixing archive transport prematurely. Commit(s): `c1fa719`
- [x] **CONTRACT-011** · typed error/failure taxonomy · deps: CONTRACT-001/003/006/008 · Separate usage, unsupported, incomplete, policy block, infrastructure, authorization, quota, integrity, and internal failures. Commit(s): `a1e8f1f`
- [x] **CONTRACT-012** · frozen contract fixtures and validators · deps: CONTRACT-002-011 · Add valid/invalid/backward-compatibility fixtures plus deterministic serialization tests. Acceptance: fixtures usable by CLI, imports, viewer, web API, and independent verifier. Commit(s): `d4b1296`

## Epic 02 — Target resolution and immutable subject identity

Evidence/problem: the current scanner accepts a project path and fingerprint but cannot prove which commit, artifact, or image was evaluated.

- [x] **TARGET-001** · target resolver package boundary · deps: CONTRACT-002/011 · Add resolver interface, capability discovery, explicit target syntax, and no-execution invariant. Commit(s): `3b1877e`
- [x] **TARGET-002** · repository/worktree resolver · deps: TARGET-001 · Resolve root, HEAD commit/tree, dirty state, submodule status, shallow state, and safe relative paths. Tests: detached HEAD, no Git, dirty tree, symlink escape. Commit(s): `1ec9ba8`
- [x] **TARGET-003** · package/build metadata resolver · deps: TARGET-001/002 · Resolve package manager, lockfile digest, package identity/version, build config inputs, and workspace membership without executing scripts. Commit(s): `ee5b4b9`
- [x] **TARGET-004** · filesystem subject resolver · deps: TARGET-001 · Produce deterministic tree/content digest with ignore policy and explicit unreadable/skipped coverage. Tests: ordering, permission failure, symlink cycles, path traversal. Commit(s): `a3de37a`
- [x] **TARGET-005** · generic artifact resolver · deps: TARGET-001 · Hash regular files/directories, record media type/size, reject special devices, and stream within size limits. Commit(s): `0fb7f21`
- [x] **TARGET-006** · SBOM subject resolver · deps: TARGET-001 · Bind imported CycloneDX/SPDX documents to their declared subject and document digest; mismatch is incomplete. Commit(s): `b72e2b6`
- [x] **TARGET-007** · OCI reference parser and registry boundary · deps: TARGET-001 · Parse registry/repository/tag/digest/platform safely; threat tests cover credential leakage and malformed references. Commit(s): `69a5eaa`
- [x] **TARGET-008** · OCI manifest/index resolver · deps: TARGET-007 · Resolve mutable tags once to immutable digest, select/record platform, preserve index and child digests, and never silently choose a platform. Commit(s): `14888ba`
- [x] **TARGET-009** · local OCI layout/tar resolver · deps: TARGET-005/007 · Read OCI/Docker archives with size, member, traversal, symlink, and decompression protections. Commit(s): `bc2259f`
- [x] **TARGET-010** · source-to-artifact linkage · deps: TARGET-002/003/005/008 · Correlate declared provenance/build metadata; distinguish matched, mismatched, unavailable, and unverifiable. Acceptance: mismatch cannot PASS. Commit(s): `b6b3811`
- [x] **TARGET-011** · `verglos target inspect` command · deps: TARGET-002-010 · Emit human/JSON subject manifest with deterministic exit codes and explicit incomplete coverage. Tests: repo, artifact, OCI index, offline error. Commit(s): `230c4a7`

## Epic 03 — Versioned engine manager, verified Trivy adapter, and engine exit

Evidence/problem: no engine-adapter contract or verified engine lifecycle exists. External tools must remain attributed and replaceable.

- [x] **ENGINE-001** · `EngineAdapter` contract implementation · deps: CONTRACT-003/004, TARGET-001 · Define capability, requirements, health, execute, normalize, raw-output, and update metadata boundaries. Commit(s): `f1a86dd`
- [x] **ENGINE-002** · engine manifest format · deps: ENGINE-001 · Add signed compatibility manifest schema for platform artifacts, checksums, source, license, version range, and rollback metadata. Commit(s): `e95a7b6`
- [x] **ENGINE-003** · engine cache layout and atomic install transaction · deps: ENGINE-002 · Use user-controlled cache path, staging, fsync/rename strategy, lock, cleanup, and explicit rollback. Tests: concurrent/partial install. Commit(s): `d54cb00`
- [x] **ENGINE-004** · safe archive downloader/extractor · deps: ENGINE-003 · Stream with limits; reject checksum/signature mismatch, traversal, symlink/hardlink escape, unexpected members, and partial output. Commit(s): `archive-extractor.ts`, `tar-extractor.ts`, `archive-safety.test.ts`, `archive-extractor.test.ts`, `tar-extractor.test.ts` (implemented; trusted source/signature verification remains ENGINE-005)
- [x] **ENGINE-005** · trusted source and signature verification · deps: ENGINE-002/004 · Pin allowed origins/identities and verify artifact before activation. Acceptance: no trust from filename, URL text, or `PATH`. Commit(s): `engine-trust.ts`, `engine-trust.test.ts` (implemented; updater/mirror orchestration remains ENGINE-007/008)
- [x] **ENGINE-006** · system-engine mode · deps: ENGINE-001 · Require explicit path, verify version/capabilities/digest, display trust status, and never silently use same-named binaries. Commit(s): `34ea338`, `a004eef` (complete inspection contract: absolute regular-file path; bounded version and Trivy capability probes; SHA-256 digest with before/after file-identity check; human/JSON trust and limitation output; no PATH fallback; focused and CLI tests plus all exact-head PR #37 checks pass. Trust is computed-only, not publisher provenance, and this inspection does not itself claim execution/scanning.)
- [x] **ENGINE-007** · mirror/offline source mode · deps: ENGINE-002-005 · Support customer mirror and pre-seeded cache with signed manifest/database/check metadata and no forced internet. Commit(s): `engine-source.ts`, `engine-source.test.ts` (implemented; CLI command orchestration remains ENGINE-008)
- [x] **ENGINE-008** · `engines install/status/update/rollback` commands · deps: ENGINE-003-007 · Add approval-oriented UX, JSON output, deterministic exits, and compatibility reporting. Commit(s): `0babdef`, `da407cf`, `19b8a9c`, `5b50408` (implemented and tested; full remote mirror/update orchestration remains downstream)
- [x] **ENGINE-009** · Trivy adapter execution profiles · deps: ENGINE-001, TARGET-002-009 · Add repository/filesystem/image/IaC/SBOM profiles with bounded process execution and no target-code execution. Commit(s): `trivy-adapter.ts`, `trivy-adapter.test.ts` (profile mapping, timeout/output bounds, and no-target-code execution contract)
- [x] **ENGINE-010** · Trivy JSON parser/normalizer · deps: ENGINE-009, CONTRACT-004 · Treat output as untrusted bounded input, preserve raw bytes and namespaced extensions, and map to canonical observations. Commit(s): `trivy-parser.ts`, `trivy-parser.test.ts` (implemented; full graph integration remains downstream)
- [x] **ENGINE-011** · Trivy attribution and run metadata · deps: ENGINE-010 · Record binary/database/check/config digests, timestamps, capabilities, license, and source in every run/view/export. Commit(s): `trivy-run-metadata.ts`, `trivy-run-metadata.test.ts` (implemented; end-to-end adapter wiring remains downstream)
- [x] **ENGINE-012** · Trivy golden compatibility fixtures · deps: ENGINE-010/011 · Freeze supported version outputs and reject unknown major/schema drift as incomplete. Commit(s): `trivy-compatibility.ts`, `trivy-compatibility.test.ts` (implemented; broader version corpus remains downstream)
- [x] **ENGINE-013** · engine freshness and failure policy · deps: ENGINE-011/012, CONTRACT-008 · Map missing/stale/incompatible/database errors to affected incomplete coverage; never create empty success. Commit(s): `trivy-failure-policy.ts`, `trivy-failure-policy.test.ts` (implemented; evaluator wiring remains downstream)
- [x] **ENGINE-014** · raw evidence retention/replay · deps: ENGINE-010-013 · Content-address raw output and metadata locally; replay normalization without rescanning; test tamper detection. Commit(s): `trivy-evidence.ts`, `trivy-evidence.test.ts` (implemented; retention policy integration remains downstream)
- [x] **ENGINE-015** · engine-exit fixture adapter and drill · deps: ENGINE-001/014, GRAPH/POLICY/RECORD later · Implement fixture/alternate adapter now; final drill is gated after downstream epics. Acceptance: no Trivy types escape adapter tests. Commit(s): `fixture-engine.ts`, `fixture-engine.test.ts` (implemented; final drill remains downstream)

## Epic 04 — Standard evidence import/export

Evidence/problem: mature teams already produce SARIF, SBOM, VEX, and provenance. Verglos must preserve source attribution and validate formats rather than relabel evidence as native.

- [x] **IMPORT-001** · importer registry and bounded reader · deps: CONTRACT-003/004/011 · Commit(s): `importer-registry.ts`, `importer-registry.test.ts` (format detection, bounded reads, source digest, ambiguity/oversize rejection verified; command wiring remains IMPORT-012)
- [x] **IMPORT-002** · SARIF 2.1.0 importer · deps: IMPORT-001 · Commit(s): `sarif-importer.ts`, `sarif-importer.test.ts` (nested structural validation and unsafe URI/path rejection verified; command wiring remains IMPORT-012)
- [x] **IMPORT-003** · CycloneDX SBOM importer · deps: IMPORT-001, TARGET-006 · Commit(s): `cyclonedx-importer.ts`, `cyclonedx-importer.test.ts` (component/hash/dependency shape validation verified; command wiring remains IMPORT-012)
- [x] **IMPORT-004** · SPDX SBOM importer · deps: IMPORT-001, TARGET-006 · Commit(s): `spdx-importer.ts`, `spdx-importer.test.ts` (package checksum/relationship validation verified; command wiring remains IMPORT-012)
- [x] **IMPORT-005** · CycloneDX VEX importer · deps: IMPORT-003 · Commit(s): `cyclonedx-vex-importer.ts`, `cyclonedx-vex-importer.test.ts` (vulnerability analysis shape validation preserves assertions as non-native; command wiring remains IMPORT-012)
- [x] **IMPORT-006** · in-toto/SLSA provenance importer · deps: IMPORT-001, TARGET-010 · Commit(s): `provenance-importer.ts`, `provenance-importer.test.ts` (envelope/subject/predicate validation and unverified signature state verified; command wiring remains IMPORT-012)
- [x] **IMPORT-007** · GitHub/npm/BuildKit provenance adapters · deps: IMPORT-006 · Commit(s): `provenance-provider.ts`, `provenance-provider.test.ts` (exact subject-digest provider matching verified; command wiring remains IMPORT-012)
- [x] **IMPORT-008** · detect-secrets baseline importer/exporter · deps: IMPORT-001 · Commit(s): `detect-secrets-importer.ts`, `detect-secrets-importer.test.ts` (bounded baseline export and raw-secret refusal verified; command wiring remains IMPORT-012)
- [x] **IMPORT-009** · optional explicit detect-secrets runner · deps: IMPORT-008, ENGINE-006 · Commit(s): `detect-secrets-runner.ts`, `detect-secrets-runner.test.ts` (absolute path, timeout/output bounds, no-install behavior verified; command wiring remains IMPORT-012)
- [x] **IMPORT-010** · SARIF exporter · deps: CONTRACT-004/008 · Commit(s): `sarif-exporter.ts`, `sarif-exporter.test.ts` (bounded canonical SARIF output and public decision properties verified; command wiring remains IMPORT-012)
- [x] **IMPORT-011** · CycloneDX/SPDX/VEX exporters · deps: IMPORT-003-005, GRAPH later · Commit(s): `standards-exporter.ts`, `standards-exporter.test.ts` (deterministic validated standards round-trip helpers verified; command wiring remains IMPORT-012)
- [x] **IMPORT-012** · `verglos evidence import/export` commands · deps: IMPORT-002-011 · Add file/stdin/output behavior, summary, JSON, quiet, explicit attribution, and exit taxonomy. Commit(s): `packages/cli/src/evidence-transfer.ts`, `packages/cli/src/index.ts` (implemented; standards conformance remains in underlying exporters)

## Epic 05 — Normalization, stable identity, correlation, lineage, and release diff

Evidence/problem: existing finding IDs and score views are scanner-run oriented. Multiple sources need a stable graph without deleting lineage or double-counting risk.

- [x] **GRAPH-001** · native finding-to-observation adapter · deps: CONTRACT-004/005, TRUTH-010 · Commit(s): `native-observation-adapter.ts`, `native-observation-adapter.test.ts` (subject-bound mapping with native context/confidence/provenance/remediation; scanner integration remains downstream)
- [x] **GRAPH-002** · canonical stable fingerprint v1 · deps: GRAPH-001, TARGET-002-009 · Commit(s): `fingerprint-v1.ts`, `fingerprint-v1.test.ts` (repeatable identity-bound fingerprint; broader collision corpus remains downstream)
- [x] **GRAPH-003** · severity/confidence normalization · deps: GRAPH-001, IMPORT-002-005, ENGINE-010 · Commit(s): `normalization.ts`, `normalization.test.ts` (original severity/confidence and uncertain mappings preserved)
- [x] **GRAPH-004** · correlation graph · deps: GRAPH-002/003 · Commit(s): `correlation.ts`, `correlation.test.ts` (producer/raw payload retention and disagreement detection)
- [x] **GRAPH-005** · deduplication projection · deps: GRAPH-004 · Commit(s): `deduplication.ts`, `deduplication.test.ts` (exact collapse and bounded fuzzy review projection)
- [x] **GRAPH-006** · source-to-artifact lineage graph · deps: TARGET-010, IMPORT-006/007, GRAPH-004 · Commit(s): `lineage-graph.ts`, `lineage-graph.test.ts` (bounded nodes/edges, explicit gaps and mismatch states)
- [x] **GRAPH-007** · release snapshot format · deps: GRAPH-002-006 · Commit(s): `release-snapshot.ts`, `release-snapshot.test.ts` (subject, coverage, observations, lineage, policy freeze)
- [x] **GRAPH-008** · release diff engine · deps: GRAPH-007 · Commit(s): `release-diff.ts`, `release-diff.test.ts` (new/fixed/unchanged and identity/coverage/policy deltas; full hosted history remains downstream)
- [x] **GRAPH-009** · `verglos diff` command · deps: GRAPH-008 · Render decision-first terminal/JSON diff with base/head identity and no hosted requirement; history lookup remains Pro hosted. Commit(s): `packages/cli/src/diff.ts`, `diff.test.ts` (implemented and tested; hosted history remains downstream)

## Epic 06 — Policy evaluation, baselines, exceptions, approvals, and CI semantics

Evidence/problem: current score and critical-threshold gates cannot express required evidence, freshness, identity mismatch, accountable exceptions, or `INCOMPLETE`.

- [x] **POLICY-001** · policy document schema/versioning · deps: CONTRACT-008/011 · Commit(s): `policy-document.ts`, `policy-document.test.ts` (strict checks and required evidence/approval fields)
- [x] **POLICY-002** · policy loader/merge precedence · deps: POLICY-001 · Resolve defaults/config/CLI/organization policy deterministically, reject unknown unsafe fields, and record effective digest. Commit(s): `policy-loader.ts`, `policy-loader.test.ts` (implemented and tested; hosted policy authority remains downstream)
- [x] **POLICY-003** · basic Free policy profile · deps: POLICY-002, GRAPH-007 · Preserve critical gate while adding explicit coverage and incomplete behavior without signup. Commit(s): `policy-profiles.ts`, `policy-profiles.test.ts` (implemented and tested; evaluator wiring remains downstream)
- [x] **POLICY-004** · configurable Pro policy profile · deps: POLICY-002 · Add score/severity/confidence/freshness/Hunt settings while keeping local execution unmetered. Commit(s): `policy-profiles.ts`, `policy-profiles.test.ts` (implemented and tested; entitlement wiring remains downstream)
- [x] **POLICY-005** · baseline contract and local store · deps: GRAPH-002/007 · Commit(s): `baseline.ts`, `baseline-store.ts` (implemented; bounded reads and atomic writes tested)
- [x] **POLICY-006** · baseline comparison · deps: POLICY-005, GRAPH-008 · Commit(s): `baseline-compare.ts`, `baseline-compare.test.ts` (implemented and tested)
- [x] **POLICY-007** · exception creation/validation · deps: CONTRACT-007, POLICY-002 · Commit(s): `exception.ts`, `exception.test.ts` (implemented and tested)
- [x] **POLICY-008** · exception expiry and audit projection · deps: POLICY-007 · Commit(s): `exception-audit.ts`, `exception-export.ts`, tests (implemented and tested)
- [x] **POLICY-009** · deterministic evaluator · deps: POLICY-003/004/006/008, ENGINE-013, GRAPH-006 · Commit(s): `policy-evaluation.ts`, `policy-evaluation.test.ts` (implemented and tested)
- [x] **POLICY-010** · policy explanation renderer · deps: POLICY-009 · Commit(s): `policy-explanation.ts`, `policy-explanation.test.ts` (implemented and tested)
- [x] **POLICY-011** · `verglos policy check` command · deps: POLICY-009/010 · Support record/snapshot input, common flags, JSON/quiet, exit 0/1/2/3 semantics, and no mutation by default. Commit(s): `57225cd`, `1055bd7`, `2dc06fc`, `4f3e21c`, `0f48f78`, `1841970`, `2019759`, `a7a1aca` (complete: bounded regular-file/stdin readers, record-store policy evaluation, deterministic snapshot INCOMPLETE behavior, JSON/quiet output, fixed exit mapping, and no mutation are implemented and tested)
- [x] **POLICY-012** · CI command migration · deps: POLICY-011, TRUTH-010 · Route existing `verglos ci`/`scan --ci` through the same evaluator while preserving documented compatibility and machine output. Commit(s): `packages/cli/src/scan.ts` (implemented; hosted CI policy authority remains downstream)
- [x] **POLICY-013** · policy adversarial matrix · deps: POLICY-009-012 · Test every PASS/REVIEW/BLOCK/INCOMPLETE combination, stale/missing engines, identity mismatch, expired exceptions, unknown rules, and deterministic ordering. Commit(s): `policy-evaluation.test.ts`, `trivy-failure-policy.test.ts`, `exception.test.ts` (implemented and tested; broader integration remains downstream)

## Epic 07 — Local command product, configuration, report projections, and viewer

Evidence/problem: current commands do not share the promised common flags, and HTML/JSON reports are scan presentations rather than release-decision views.

- [x] **LOCAL-001** · command framework/common options · deps: CONTRACT-011, TRUTH-010 · Standardize side-effect-free `--help` for every command leaf, `--json`/`--quiet` for result-producing commands, semantically applicable `--config`/`--policy`/output paths, explicit consent, and deterministic exits without breaking aliases. Commit(s): `e6601b6`, `137380c`, `4a28387`, `b2b1dc8`, `83d6c67`, `cdbf806`, rewritten `fea28ac`, `16f0315`, `772b83d`, `76a6423`, `4f8f98e`, `a26bf68` (accepted at CLI PR #35 exact head `a26bf68b010d95326ffb4f4f0c121c0d97dc99f8`: process tests cover every public command leaf's side-effect-free help and applicable flags, deterministic/value-free usage errors, scan-family config/infrastructure failure classes and exits, JSON/quiet output, watch-mode termination, report destination, and policy alias equivalence. Uncached monorepo tests pass 12/12 package tasks including CLI process suite 36/36; typecheck 13/13, build 8/8; hosted run `34696804945` passes all nine Ubuntu/macOS/Windows Node 20/22/24 cells and Verglos self-scan. The command option contract and applicability decision are in the ignored local CLI shipping mirror; no shipping docs/assets were included in public commits.)
- [x] **LOCAL-002** · versioned config migration · deps: LOCAL-001, POLICY-001, ENGINE-001 · Replace obsolete node-vm/firecracker laptop defaults, validate engine/Hunt/record/telemetry sections, and provide actionable migration warnings. Commits: `f494c3d` plus prior config work. Accepted: schemaVersion `1.0.0` validates strict bounded `engine.id`, `hunt` (`auto|docker`, bounded duration/skip), `record.output`, and `telemetry.enabled` fields; `node-vm`/`firecracker`, unsupported versions, invalid values, unknown fields, and inactive settings receive deterministic migration findings; `config inspect` does not rewrite input or execute legacy JavaScript, and scan refuses to apply migration-only sections. Shared/scanner/CLI regression tests pass; uncached monorepo test/typecheck/build pass 23/23 Turbo tasks; exact-head matrix `34760687566` passes all nine Ubuntu/macOS/Windows × Node 20/22/24 cells and self-scan `34760687643` passes. PR #38 remains OPEN/CLEAN; this acceptance does not claim Hunt execution, engine selection/installation, record creation/upload, or telemetry consent/transmission.
- [x] **LOCAL-003** · Inspect orchestration pipeline · deps: TARGET, ENGINE, IMPORT, GRAPH · Run selected native/adapters/imports into one snapshot with cancellation, bounded concurrency, progress, and coverage manifest. Commit(s): `783d997`, `7c9b64d`, `434b026`, `346940e`, `e905c08`, `df575a8`, `72a1c99`, `ae65fd4`, `c320574`, `cec0648`, `b7e5fa9`, `3c40952`, `cf5ac3b` (accepted at CLI PR #37 exact head `cf5ac3b64aa7a3c0ca2d9d71a59450ca6af9e6d4`; orchestration runs selected native, adapter, and supported import producers into one digest-bound snapshot, with bounded concurrency, progress, cancellation, coverage and ToolRun metadata. Imports bind to selected-subject content digests. Exact-head self-scan `34720089870`, all nine platform cells in matrix `34720089861` attempt 2, and uncached monorepo tests/typecheck/build (23/23 Turbo tasks) pass. Docker Desktop end-to-end evidence exercises pinned Trivy under network/filesystem/resource controls; product coverage remains deliberately incomplete for unqualified vulnerability DB/policy freshness and unsupported producer capability. Not a claim of comprehensive vulnerability scanning or publisher provenance.)
- [x] **LOCAL-004** · scan compatibility projection · deps: LOCAL-003, GRAPH-001, TRUTH-010 · Preserve current terminal/HTML/JSON outputs for existing users while exposing new schema opt-in/migration path. Commit(s): `17a333a`, `96aaec8`, `73f70c2`, `3c40952`, `cf5ac3b` (accepted at CLI PR #37 exact tested head: default scan retains legacy terminal/stdout shape, JSON report schema 2.0.0, HTML output, and report filenames; inspection snapshot schema 1.1 is opt-in and no-overwrite is tested. Local process/regression tests and exact-head hosted matrix/self-scan pass.)
- [x] **LOCAL-005** · release header projection · deps: POLICY-009, GRAPH-008 · Show decision, exact subjects/digests, policy, generated time, signer state, and incomplete coverage first. Commit(s): `14271b4`, `ce24476`, `a113a1d` (accepted at CLI PR #37 exact head `a113a1db64c8c33e5823cfeb83e62b6ccf50681e`: `record header` verifies the content-addressed store and projects decision/coverage first, all subject identities and available exact content digests, policy digest, generated time, signer state, limitations and next action. Tests cover all seven subject kinds, multi-subject content digests, and incomplete coverage. Exact-head self-scan `34752187755`, all nine platform cells in `34752187749` attempt 2, and forced uncached monorepo tests/typecheck/build (23/23 Turbo tasks) pass. PR #37 remains OPEN/CLEAN; no merge or release claim.)
- [x] **LOCAL-006** · change/action projection · deps: LOCAL-005 · Show new/fixed/worsened/unchanged, coverage delta, blockers, owner, remediation, rescan, and Hunt eligibility. Commits: `dc9eff8`, `699c830`; compatibility fix `f5be357`. Accepted at CLI PR #38 exact head `f5be35760df38b1086da04d5186d81179555cdeb`: `diff` now exposes added/fixed/worsened/improved and unchanged fingerprints, severity uncertainty, identity/target/producer coverage/policy/lineage deltas and blockers, remediation summaries, explicit unassigned owner, rescan status, Hunt `not-evaluated`, and bounded next actions in JSON and human output. Absence is not claimed as remediation; unsupported authority is not inferred. Relevant focused tests pass; forced uncached test/typecheck/build passes 8/8 Turbo tasks; exact-head self-scan `34763541180` and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in matrix `34763541116` pass. PR #38 remains OPEN/CLEAN; implementation is not yet merged or released.
- [x] **LOCAL-007** · evidence/lineage projection · deps: LOCAL-005, GRAPH-004/006 · Show producer attribution, raw evidence reference, confidence, timestamp, engine health, and limitations. Commits: `699c830`, `f5be357`. Accepted at CLI PR #38 exact head `f5be35760df38b1086da04d5186d81179555cdeb`: release snapshot v1.3 validates and digest-binds attribution, raw-evidence digest references only (never excerpt contents), confidence, matched ToolRun timestamps/engine health, and explicit limitations; diff renders these for changed fingerprints and reports lineage deltas/unresolved gaps as blockers. Invalid/misbound evidence cannot influence normalized severity and omitted/invalid counts remain explicit. Focused snapshot/diff/CLI projection tests pass; forced uncached test/typecheck/build passes 8/8 Turbo tasks; exact-head self-scan `34763541180` and all nine Ubuntu/macOS/Windows × Node 20/22/24 cells in matrix `34763541116` pass. PR #38 remains OPEN/CLEAN; implementation is not yet merged or released.
- [x] **LOCAL-008** · exception/export projection · deps: LOCAL-005, POLICY-008, IMPORT-010/011 · Show exception scope/expiry/control plus `.vgl`, JSON, SARIF, CycloneDX, SPDX, VEX, HTML/PDF choices. Commits: `9326bb1`, `b641910`, `bee63e3`. Accepted at CLI PR #38 exact head `bee63e3ad76850cd1a6af0345cb5498f87c381ca`: read-only `verglos policy exception <exceptionPath> --approval <path>` displays exact subject/observation scope, owner/reason, evidence-backed controls, reversal triggers, effective/expiry times, approval ID/decision/binding/time state, and explicitly `applicability: not-evaluated`. Choices are explicit and truthful: `.vgl`/JSON not integrated, SARIF/CycloneDX/SPDX/VEX not mapped, HTML/PDF not implemented. Focused projection/command tests pass 7/7; forced uncached test/typecheck/build passes 8/8 Turbo tasks; `git diff --check` passes; exact-head self-scan `34764793925` and all nine Ubuntu/macOS/Windows × Node 20/22/24 matrix jobs `34764794099` pass. PR #38 remains OPEN/CLEAN. No exception is applied, no export is generated, and no signing or upload is implied.
- [x] **LOCAL-009** · packaged loopback-only viewer server · deps: LOCAL-005-008 · Bind safely to loopback, use unpredictable session path, no external assets, CSP, path controls, and clean shutdown. Commit(s): `viewer-session.ts`, tests (implemented and tested; full browser packaging remains downstream)
- [x] **LOCAL-010** · viewer accessible UI · deps: LOCAL-009 · Implement developer/lead/client projections, keyboard navigation, semantic structure, AA contrast, reduced motion, print/machine alternatives, and empty/error states. Commit(s): `viewer-renderer.ts`, tests (escaped static renderer implemented; full AA audit remains downstream)
- [x] **LOCAL-011** · `verglos report view` command · deps: LOCAL-009/010 · Open or print URL explicitly, support no-browser mode, validate record/report input, and reveal no unexpected local files. Commit(s): `report-view.ts`, tests (JSON projection validation implemented; browser/print integration remains downstream)
- [x] **LOCAL-012** · local end-to-end fixtures · deps: LOCAL-003-011 · Prove no-account scan -> inspect -> policy -> diff -> viewer -> export journey on macOS/Linux/Windows path conventions. Commit(s): `cli-fixture.ts`, `local-journey.test.ts` (fixture boundaries implemented; cross-platform final drill remains downstream)

## Epic 08 — Agent/MCP authority, remediation safety, and supported local Hunt

Evidence/problem: current MCP tools are a separate thin surface and Hunt is a shell with unsafe obsolete `node-vm` concepts and ambiguous verdicts.

- [x] **AGENT-001** · shared action/authority contract · deps: CONTRACT-011, LOCAL-001 · Define inspect/propose/mutate/install/execute/network/except/sign/publish/upload/policy/billing actions and approval requirements. Commit(s): CLI `86c09a3`; exhaustive test matches every action to its approval and side-effect contract; exact-head PR #36 self-scan and all nine platform cells pass (`34711950813`, `34711950840`).
- [x] **AGENT-002** · auditable approval request/receipt · deps: AGENT-001 · Record actor, requested action, exact target, files/network, policy effect, decision, timestamp, and expiry; reject replay or widened scope. Commit(s): `4035b47`, `ebeb642` (complete: strict receipt schema and canonical request digest bind the full scope; bounded atomic content-addressed storage provides durable local audit; MCP/CLI mutation paths enforce approval scope; duplicate request IDs with altered scope are rejected)
- [x] **AGENT-003** · MCP server contract migration · deps: AGENT-001, LOCAL-003, POLICY-009 · Route tools through the same scanner/policy/error/entitlement contracts; preserve legacy names during deprecation. Commit(s): `f196b20`, `cbcd1c6`, `b07d85f`, `fc78668`, `318464d`, `25b8f72`, `0f0e563`, `fef284e` (accepted at CLI PR #38 head `fef284e1df4684b40af1f87798c8128ffe0936ab`: new approval-free `verglos_policy_check` reads bounded content-addressed Release Records through shared policy/subject/observation/record contracts; binds the exact policy digest, configured checks, requested and observed immutable subjects, referenced observations/evidence, and Release Decision to the stored POLICY-009 evaluation; validates deterministic derived decision fields and publishes decision/coverage through typed MCP errors and shared entitlement/authority metadata. It explicitly does not rerun policy predicates or assert producer truth. MCP tests 43/43 and typecheck pass; exact-head self-scan `34767527375` succeeds and platform matrix `34767527307` concludes success, with all nine build/typecheck/test steps successful. GitHub reports all ten PR checks SUCCESS and PR #38 OPEN/CLEAN.)
- [x] **AGENT-004** · MCP discovery/capability truth · deps: AGENT-003, TRUTH-003 · Advertise only shipped/partial capabilities with plan, permission, inputs, outputs, side effects, and maturity. Commit(s): `3ea67c7`, `6a272af`, `222fd84`, `a101124`, `0fd7cd2`, `4793635`, `13b057d`, `531009a`, `79d9b95`, `6badb9d`, `87243c6`, `e7f9fea` (complete: shared registry and server `tools/list` metadata fail closed; Free/Pro/Team/Studio/Enterprise compatibility is contract-tested; locally verified entitlement context gates runtime dispatch; SDK client discovery and denial round-trip pass)
- [x] **AGENT-005** · safe scan/package/pre-write tools · deps: AGENT-003 · Keep read-only actions approval-light, bound input sizes/paths, preserve attribution, and return decision/coverage rather than a second finding model. Commit(s): `4719cf0`, `fbc6133`, `b07d85f`, `318464d`, `25b8f72`, `0f0e563`, `fef284e` (accepted with AGENT-003: shared authority keeps local inspection approval-light and exact network/process actions gated; UTF-8 bounds cover code, paths, context, package, version, language, manifest, and store paths; pre-write findings retain exact target attribution and the shared Finding schema; fast-path output labels partial coverage; package advisory evidence retains OSV.dev attribution; policy-record tool returns canonical decision and explicit reference-verification coverage. Direct MCP tests, typecheck, exact-head self-scan and matrix evidence are recorded under AGENT-003. GitHub reports all ten PR checks SUCCESS and PR #38 OPEN/CLEAN; no completion claim extends beyond the specified local tool contract.)
- [x] **AGENT-006** · explanation/remediation proposal tools · deps: AGENT-003, POLICY-010 · Propose bounded changes without writing; include tests, policy effect, uncertainty, and no hidden network. Commit(s): `9ad98a6` (MCP explanation path emits validated non-mutating remediation proposals with exact subject/file scope)
- [x] **AGENT-007** · fix application approval boundary · deps: AGENT-002/006 · Require explicit write approval, show diff, block out-of-scope paths, run selected tests, rescan, and support rollback guidance. Commits: `174301c`, `1a964a1`, `3a267c8`, `bb32960`, `c59126e`, `bda23e0`, `d7430a5`, `a66e1f4`, `a64feb0`; accepted at CLI PR #38 exact head `a64feb0bb5c24b665bc464ba623f616d4f35f3f2`. Human-readable/dry-run output shows the full patch and selected test digests; mutation requires exact unexpired workspace/file-bound approval, selected Node test execution requires a separate exact execute receipt, and configured audit-store persistence fails closed before mutation or test execution. Tests prove success+rescan, selected-test failure rollback, rescan rollback, cross-workspace denial, symlink/path rejection, timeout/output bounds, and audit-store persistence failure. Focused fix suite 27/27; forced uncached test/typecheck/build 18/18 Turbo tasks; hosted self-scan `34776624650` and all nine platform cells in matrix `34776624651` pass. The runner is explicitly not sandboxed and does not claim isolation.
- [x] **HUNT-001** · declarative signed recipe schema · deps: CONTRACT-006, AGENT-001, TARGET-001 · Define rule/target support, image digest, command template, assertions, inputs, isolation, limits, cleanup, network reason, redaction, signature, and version. Commit(s): CLI `15457ba`; strict versioned schema requires and bounds the declared recipe fields, SHA-256 image digest, commands, resource/network budgets, HTTPS-origin allowlists, cleanup/redaction, and signature metadata. Shared/Hunt tests, full CLI tests/typecheck/build, and exact-head PR #36 self-scan plus all nine Ubuntu/macOS/Windows Node 20/22/24 cells pass (`34713028173`, `34713028112`). HUNT-002 cryptographic signature/content-digest/license/feed verification and real trust roots remain separate and open; no claim that a recipe is cryptographically trusted or executable.
- [x] **HUNT-002** · recipe verification/trust store · deps: HUNT-001 · Accepted at CLI PR #42 head after all 10 platform-matrix cells green. Two commits cherry-picked onto a fresh branch off current `origin/main`: `40b16dc` provides `packages/shared/src/hunt-recipe-trust.ts` trust-store contract (local trust-store keys, feed root, licensed-content declaration, recipe digest verification; expired/revoked/unknown recipes rejected). `2318b9d` adds `verglos hunt verify-recipe <recipePath> --trust-store <path>` over bounded regular JSON inputs, emitting local trust-store/feed/recipe digests + license declaration without exposing license text or authorizing execution. Founder-authorized 2026-09-16 pre-launch shipping. Forced-uncached `pnpm exec turbo run test typecheck build --force` 23/23. Commit(s): `40b16dc`, `2318b9d` on `feat/cli-hunt-002-trust-store`.
- [x] **HUNT-003** · recipe planner/dry run · deps: HUNT-002, GRAPH-002 · Match exact subject/finding/rule, render intended files/process/network/limits, and never accept arbitrary model shell. Commit(s): `88059fc`, `9bb447a` (accepted across CLI PRs #43/#44: immutable execution-free plan binds the selected scan finding, derived rule, exact subject, trusted recipe digest, command, inputs, filesystem, isolation, resource limits, cleanup, network, redaction, and signature; no trust policy means unsupported; recipe command text is never executed by planning. Local 23/23 Turbo tasks and both exact-head 10/10 hosted matrices pass.)
- [x] **HUNT-004** · A1 trusted probe runner · deps: HUNT-003 · Run only built-in pure probes in a restricted process with explicit non-isolation label and full resource/process-tree limits. Commit(s): `c23483d` (accepted at CLI PR #43: fixed `verglos-probe utf8-contains` catalog entry runs in a one-worker harness with empty environment, no target/source access, denied network, bounded memory/stack/time/CPU, strict recipe/execution binding, redacted digest-only evidence, and explicit `securityBoundary: false` / not-an-OS-isolation-boundary disclosure. Arbitrary commands, network, process widening, cleanup drift, and binding drift are rejected.)
- [x] **HUNT-005** · hardened Docker A2 adapter · deps: HUNT-003 · Enforce non-root, read-only source/rootfs, tmpfs, dropped caps, no-new-privileges, seccomp, no socket/devices/namespaces, network deny, and resource bounds. Commit(s): `4460f1a`, `4ae9bf2`, `e1d4893`, `67e6e92`, `403f214`, `5e4c922`, `ef698d7`, `2991658`, `2af2cd7`, `83b3994` (complete: pinned Docker integration suite passes 40/40; broader multi-image/adversarial qualification remains HUNT-011)
- [x] **HUNT-006** · synthetic input/redaction pipeline · deps: HUNT-003-005 · Replace secrets, cap/stdout/stderr, hash evidence, redact paths/identifiers, and prove raw secrets cannot escape. Commit(s): `08e6efb`, `c893e81`, `1e86c7d`, `eb80e0a`, `9f029f9`, `f32f80a`, `2e366a4`, `d422adc`, `25e29ea`, `abe6978`, `ceb3f8e` (complete: shared redaction/synthetic-input/evidence-digest tests and pinned Docker secret-exfiltration/output-bound tests pass; raw output is never returned)
- [x] **HUNT-007** · verdict/failure classifier · deps: CONTRACT-006, HUNT-004-006 · Distinguish confirmed/not-reproduced/inconclusive/not-supported/environment-error/policy-denied; infrastructure failure cannot become false-positive. Commit(s): `adb9061`, `88059fc`, `c23483d` (accepted at CLI PR #43: exhaustive 48-case precedence matrix covers assertion/support/policy/environment/timeout combinations; policy denial, unsupported recipes, environment failure, and timeout take precedence over boolean assertions, so infrastructure failure cannot become `not-reproduced`. A1 runtime outcomes expose canonical verdicts plus strict bounded assurance metadata.)
- [ ] **HUNT-008** · initial high-value recipe set · deps: HUNT-002-007, LIC-001 later · Implement only evidence-backed recipes with positive/negative/timeout/failure fixtures and explicit supported-rule coverage. Commit(s): CLI PR #67 `30467e6` merged as `9725e13` adds the A1 family; PR #94 merged as `53448684` adds and CI-runs the retained four-case verifier; PR #96 merged as `9900ebb4` adds five deterministic A1 fixture probes; PR #97 merged as `f207240b` adds three more fixture probes covering the remaining approved sub-scope shapes; PR #99 merged as `8ff0e0cd` adds seven A2 target-harness descriptors, the pinned Docker execution path, and strict result parsing; PR #100 merged as `5bf332fa` adds one sanitized deterministic reference harness for each A2 family and validates all seven through local and pinned-Docker runs; PR #103 merged as `6ff1bd1e` preserves timeout and infrastructure-failure classification for every A2 family; PR #104 merged as `1b1ea0b0` adds direct timeout and adapter-failure process fixtures for every A2 family; PR #106 merged as `a413df2f` qualifies the seven public-safe A2 target modules through pinned Docker with positive/negative/unsupported outcomes; PR #109 merged as `16fdafd8` adds the signed public CLI all-family execution test for all seven A2 families with protected cross-platform verification. Protected self-scan, in-toto, and macOS/Ubuntu/Windows Node 20/22/24 matrix pass. Remains unchecked pending complete per-family acceptance, supported-rule approval, trusted/licensed release treatment, hosted entitlement, Linux/Docker qualification where required, independent review, and final release acceptance. Evidence: `docs/shipping/evidence/hunt-a2-reference-harnesses-pr100-2026-10-13.md`, `hunt-a2-target-harness-pr99-2026-10-13.md`, `hunt-a2-adapter-failure-matrix-pr103-2026-10-13.md`, `hunt-a2-direct-outcomes-pr104-2026-10-13.md`, `hunt-a2-target-code-qualification-pr106-2026-10-13.md`, `hunt-a2-cli-all-families-pr109-2026-10-13.md`, the A1 catalog records, and prior requalification records.
- [ ] **HUNT-009** · `verglos hunt` functional command · deps: HUNT-008, POLICY-009, PLAN-CLI · Replace exit-78 shell only when gates pass; require approval, entitlement, supported recipe, and structured local result. Commit(s): rewritten `fea28ac`, `16f0315`; execution substrate `7459869`, `a2a1335`, `c4beecb`; entitlement gate `71de29f` merged with current main in `17d0813`; provenance projection `c8a2e4b`, preflight hardening `67debee`, PR #76 merged as `8e436544`, PR #93 merged as `fe28730d`, PR #94 merged as `53448684`, PR #107 merged as `f4fe4987`, and PR #109 merged as `16fdafd8`. The protected packed-consumer and four-case fixture paths now execute through the signed A1, approval, entitlement-cache, and restricted-process path; all seven opt-in public A2 target-harness families also pass through the signed bounded CLI execution binding. Remains unchecked pending HUNT-008 trusted/licensed publisher roots and supported-rule acceptance, hosted entitlement evidence, Linux/Docker qualification where required, and independent review. Evidence: `docs/shipping/evidence/hunt-a2-cli-execution-pr107-2026-10-13.md`, `docs/shipping/evidence/hunt-a2-cli-all-families-pr109-2026-10-13.md`.
- [ ] **HUNT-010** · MCP Hunt tools · deps: AGENT-003/002, HUNT-009 · Expose plan/approval-limited finding/report/before-write/explain tools without extra authority or arbitrary execution. Commit(s): `7022408`, `b72982a` add bounded verdict explanation, an injected private-runtime bridge for finding/report execution with complete signed binding and approval-file coverage, and a before-write fast-path preflight that never synthesizes arbitrary recipes. Hosted platform run `37617790266`, self-scan `37617790257`, and in-toto binding passed at exact head `b72982a`; the phase merged to CLI `main` as `8e436544`. HUNT-009 trusted/licensed-root, bounded-execution, and independent-review gates remain open.
- [ ] **HUNT-011** · sandbox adversarial suite · deps: HUNT-005-010 · Test network, socket, device, namespace, symlink, fork bomb, CPU/memory/disk/output/time, signal, cleanup, and secret exfiltration defenses. Commit(s): CLI `8bea4be2fa18533eafd088122be769e942965626` current-head requalification passes 60 checks with one documented macOS namespace skip and zero failures; hosted Ubuntu self-scan `37827269372` at the same exact head passes the pinned Docker adversarial job. Private evidence: `docs/shipping/evidence/hunt-docker-adversarial-origin-main-2026-10-09.md`. The independent reviewer packet is refreshed at `docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md`; HUNT-011 remains open for independent review, trusted/licensed recipe provenance, and dependent acceptance.

## Epic 09 — Canonical `.vgl` assembly, signing, verification, provenance, and public projection

Evidence/problem: current Attest is a shell, while the web endpoint mints unsigned score-summary URLs. The target is a deterministic portable record with independent verification.

- [x] **RECORD-001** · content-addressed local blob/member store · deps: CONTRACT-010, ENGINE-014 · Stream and hash members, cap sizes/counts, reject duplicate/path-escape names, and provide deterministic layout. Commit(s): `b91728c`, `f9ce82e`, `b04ebbb`, `4dd5208` (complete store contract: bounded batch and end-to-end record-create streaming publication enforce byte/count caps, duplicate/path-escape and symlink rejection, deterministic content-addressed layout, and atomic writes; archive/container assembly is tracked under RECORD-002)
- [x] **RECORD-002** · `.vgl` assembly · deps: RECORD-001, GRAPH-007, POLICY-009 · Assemble subjects, runs, observations, lineage, verification, exceptions, policy, decision, exports, viewer, signatures, and redaction manifest. Commits: `15e1e3f`–`84e2932`, `d782e86`, `f887220`, `3bc5f4d`, `8116c7f`, `b52065b`, `af13112`, `d0c5e34` (accepted: selected `directory-v1`; synthetic 11-member CLI create→pack→offline verify; deterministic manifest/package outputs, in-toto export and static viewer; unsigned plus explicitly trusted Ed25519 package verification; omitted payload absent; aggregate limit rejected through CLI before blob reads/output; malformed/missing/extra/tampered entries and symlinked package root/viewer rejected. Focused tests 8/8; forced uncached CLI/shared test/typecheck/build 18/18 Turbo tasks; diff/public-boundary audits pass. Exact-head PR #38 self-scan `34811310739` and all nine platform cells in matrix `34811310761` pass at `d0c5e34`. Redaction metadata is producer-declared and is not proof of sanitization.)
- [x] **RECORD-003** · deterministic manifest/canonicalization · deps: RECORD-002 · Stable member ordering/media types/digests/sizes and reproducibility across repeated builds. Commit(s): `3383126` (canonical builder sorts members/extensions and reproducibility tests prove equivalent manifests produce identical canonical JSON and manifest digests)
- [x] **RECORD-004** · safe record reader · deps: RECORD-001-003 · Verify every member before use; reject bombs, traversal, symlinks, duplicates, malformed JSON, unknown required media, and unsupported versions. Commit(s): `71c11ba`, `3585705` (full shared suite 266/266; bounded member store checks, omission semantics, duplicate path/digest rejection, malformed JSON, unknown required media, and unsupported member schema versions are covered)
- [x] **RECORD-005** · in-toto statement/predicate · deps: RECORD-003, TARGET-010 · Bind Release Decision and exact subjects in a versioned predicate interoperable with standard tooling. Commit(s): `20e4793` (standard in-toto Statement v1 output with versioned predicate type, exact canonical subject IDs and sha256 digests, manifest digest, limitations, and strict subject validation)
- [x] **RECORD-006** · Sigstore/cosign adapter · deps: RECORD-005, ENGINE-style trust controls · Support explicit keyless/user identity flow, record issuer/identity/bundle, and never hold a universal Verglos customer key. Commit(s): `a8a035c`, `4545eb4` (accepted in current open CLI PR: named-env caller OIDC token, explicit scoped sign and public-network approvals, allowlisted Fulcio/Rekor, canonical Release Record statement binding, issuer/identity/bundle capture, official Sigstore verification with caller-supplied trust root and exact identity/issuer, and `.vgl` v1.1 optional bundle/binding support while v1.0 stays compatible. Focused tests 13/13; uncached CLI/shared test/typecheck/build 18/18; exact-head self-scan and all nine platform cells pass. No universal Verglos customer key. Evidence is mocked OIDC/Fulcio/Rekor plus a historical signed fixture; no live public log write or interactive browser flow. Guided UX/plan integration and license/release qualification remain separate.)
- [x] **RECORD-007** · user-supplied/offline signing adapter · deps: RECORD-005 · Keep basic local signing open, validate key material handling, and document trust-policy limitations. Commit(s): `54eeb0e`, `05369f0`, `582a5f9` (full acceptance: provider-neutral Ed25519 envelope and approved `record sign` workflow use bounded user-supplied keys, mode-0600 output, invalid-key rejection, and no-overwrite semantics; trust-policy/key-custody limitations are explicit)
- [x] **RECORD-008** · independent offline verifier · deps: RECORD-004/006/007 · Verify manifest, subjects, envelope, identity/issuer policy, timestamps/materials, redaction, and decision language without dashboard/network. Commit(s): `54eeb0e`, `05369f0`, `d648c73`, `a8a3296` (complete offline boundary: bounded regular-file manifest/signature/key reads; content-addressed member, subject, decision, policy, schema/version, redaction-presence, timestamp, Ed25519, and explicit trusted issuer/signer checks; no dashboard or network dependency. Key custody/Sigstore and hosted material custody remain explicit separate work.)
- [x] **RECORD-009** · `record create/sign/verify` commands · deps: RECORD-002-008, AGENT-002 · Add explicit signing approval, deterministic exits, JSON/quiet, no-upload default, and useful tamper reasons. Commit(s): `5a5bfcc`, `901ba40`, `18c2d58`, `9427706`, `f3462d3`, `61c80e5`, `d0c5e34`, `fb60d57` (accepted for the local offline workflow: synthetic complete graph exercised through CLI child processes for create, explicit receipt-approved user-supplied Ed25519 sign, package, and trusted offline verify; JSON/quiet success and fixed 0/78 exits; `uploadPerformed:false`; tamper failure returns useful human reason without fixture canary. Focused create/sign 13/13; forced uncached CLI/shared test/typecheck/build 18/18; exact-head self-scan and nine platform jobs pass. Does not claim guided Sigstore/cosign identity, hosted receipt integration, or independent redaction proof.)
- [x] **RECORD-010** · legacy `attest` compatibility path · deps: RECORD-009, TRUTH-010 · Deprecate/migrate alpha shell and obsolete Ed25519-summary types without falsely treating old public summaries as signed records. Commit(s): CLI `077b008`; Web `e58dbd8`, `03304c0` merged as `fc55203`. Acceptance: current CLI retirement/option/registration tests pass 7/7; Web retired POST, legacy lookup, and corrected `/verify` index tests pass 3/3; hosted Web run `36986357199` passes the full configured gate; production `https://verglos.com/verify` read-only smoke shows “Legacy summary lookup” + offline `verglos record verify` and no retired counters/publish claims. Existing legacy hash pages remain explicitly unsigned/read-only, and no page view is recorded as verification. No production/database write occurred.
- [x] **RECORD-011** · public redaction projection builder · deps: RECORD-002/004 · Allowlist subject/decision/signature/coverage/limitations; prove source, paths, raw findings, secrets, tenant/client IDs cannot leak. Commit(s): `6c0619d`, `18c2d58`, `a898777` (accepted for local projections: digest-verified `record project` allowlists decision, digest-derived subject IDs, typed redaction state, conservative coverage and signer states; free-form limitations are replaced with a fixed withholding notice in the JSON projection and in-toto predicate/export; complete `.vgl` process tests exercise unsigned/signed states and source/path/raw-finding/secret/tenant/client/policy/issuer/signer canaries across projection, viewer, and export. Local tests 7 shared + 12 CLI, forced uncached Turbo checks 18/18, exact-head self-scan and nine platform cells pass. Does not claim hosted receipt/upload/log/support-channel safety or prove producer-declared redaction actually sanitized member bytes; VERIFY-WEB-001 and independent sanitization evidence remain separate.)
- [x] **RECORD-012** · provenance ingestion in records · deps: IMPORT-006/007, RECORD-002/005 · Preserve npm/GitHub/BuildKit provenance verification state and source/artifact mismatch. Commit(s): `cc7ce7e`, `3b5039e`, `ece9325`, `e14ac41`, `df9ccb9`, `96bf984` (accepted: bounded `record import-provenance` ingests in-toto statements and DSSE; canonical versioned member preserves exact source bytes/digest, all subjects, provider label, subjectId/artifact digest binding, match state, and signature count. Create/verify/package reparse and recompute the source/match and bind to an included typed subject. Full CLI process fixture imports with the CLI, creates/exports/packs/verifies a record containing matched GitHub, mismatched npm, and unavailable BuildKit states; adversarial fixture rejects match-to-wrong-record-subject. Focused shared tests 9/9, CLI process tests 11/11, forced uncached Turbo test/typecheck/build 18/18, public-boundary audit pass; exact-head self-scan `34819191034` and nine platform jobs `34819191038` pass. Provider attribution remains caller-declared and signatures unverified; independent provider/certificate trust verification is separate RECORD-006 work.)
- [x] **VERIFY-WEB-001** · `verglos-web` record ingestion/receipt API · deps: RECORD-011, HOSTED schema later · Accept authenticated, bounded, explicitly uploaded redacted/private record projections with digest/idempotency/tenant checks; no source upload. Commit(s): `8ff2c8b`, `28bd114`, `c676129`, `6918b34`, `1a5c645`, `7e4d012`, `c7eb361`, `afdedc5`, `6266f69`, `2d89869` (accepted on open Web PR #33: `POST` requires project `publish_record` authorization, 256 KiB limit, strict allowlisted schema with no source/raw fields, canonical projection-digest recomputation over normalized fields, tenant-bound persistence, content digest, exact retry idempotency, and changed-content 409. PostgreSQL-backed route integration covers auth-before-body, too-large/unknown-field/stale-digest rejection, two-tenant scope, exact retry/conflict, list isolation, and stored-digest verification. Web run `34835571918` passes 98/98 tests with integration active, typecheck, schema/17-migration checks, build, dependency audit, SBOM/license tests, public-boundary/secret guards, GitGuardian, and Vercel. No source object is uploaded/stored. Does not claim original `.vgl` verification, object custody, production cutover, or recovery qualification; those remain separate gates.)
- [x] **VERIFY-WEB-002** · `verglos-web` verification API/page core · deps: VERIFY-WEB-001 · Verify stored projection/record receipt, expose immutable public fields and honest signature/identity/limitation states; do not touch the homepage. Commit(s): `f846aee`, `de5225a`, `f413682`, `40c9794`, `ed60aff`, `d3bb1bf`, `201bdfd`, `4e9c4bb` (complete hosted boundary: tenant-scoped reads, public JSON/page surfaces, canonical content-digest revalidation, ambiguity-safe lookup, URL-safe attestation hash validation, and non-home redacted verification; signer, redaction, and limitations are shown as stored contract states without overstating cryptographic proof)

## Epic 10 — Hosted tenant, project, subject, inventory, and evidence data model

Evidence/problem: current web storage is user/license/report centric, lacks tenant IDs, uses JSON dependency snapshots, and has no durable Release Record/evidence graph model or migrations.

- [x] **HOSTED-001** · `verglos-web` migration tooling and policy · deps: TRUTH-009 · Add generated/reviewed SQL migrations, journal, check/apply scripts, rollback/forward-fix rules, and CI schema validation; replace production reliance on `db:push`. Commit(s): `17a3ec7`, `42b25bd`, `658c3d8` (journal parity check with fixture coverage, reviewed-migration runbook, CI/production push guard)
- [x] **HOSTED-002** · tenant/organization/membership schema · deps: HOSTED-001, TRUTH-011 · Add tenant-owned identities, roles, lifecycle, composite constraints, indexes, and creator migration fields. Commit(s): `63f04c0`, `3e379b2`, `e49e913`, `86cd86a`, `3658e1f` (organization/member lifecycle, role authorization, tenant-scoped APIs)
- [x] **HOSTED-003** · project/application schema · deps: HOSTED-002 · Add tenant-scoped projects, environments, repository references, status, ownership, and immutable external IDs. Commit(s): `84d73b3` (schema migration and authorized project API)
- [x] **HOSTED-004** · subject/release schema · deps: HOSTED-003, CONTRACT-002/009 · Add exact source/artifact/OCI subject identities, releases, decisions, policy digests, and uniqueness constraints. Commit(s): `9087d06`, `917cb89`, `db293e5` (subject/release schema, bounded projection API, canonical subject kind/digest binding)
- [x] **HOSTED-005** · tool-run/observation index schema · deps: HOSTED-004, CONTRACT-003/004 · Store queryable normalized/redacted metadata and raw-object references without embedding vendor structs. Commit(s): `3dc1d9f` (normalized tool-run/observation tables and indexes)
- [x] **HOSTED-006** · evidence manifest/object schema · deps: HOSTED-004/005, CONTRACT-010 · Add content-addressed object metadata, encryption/redaction/access class, retention, digest, size, and immutable links. Commit(s): `2a32698`, `3289353` (object/link schema and bounded metadata registration API)
- [x] **HOSTED-007** · policy/evaluation/exception/approval schema · deps: HOSTED-002-004, CONTRACT-007-009 · Model versioned policies and accountable decision history per tenant/project/release. Commit(s): `404b5a3`, `6f1c9ff`, `dbc199e` (versioned policy/exception/approval schema, policy API, fixed-exit evaluation ingestion)
- [x] **HOSTED-008** · component inventory/advisory match schema · deps: HOSTED-004 · Normalize ecosystem/PURL/version/digest, released state, advisory matches, freshness, and reverse indexes. Commit(s): `d6de925` (component/advisory tables and reverse indexes; ingestion and monitoring workers remain downstream)
- [x] **HOSTED-009** · job/outbox/usage/audit schema · deps: HOSTED-002 · Add idempotency, lease, retry, dead-letter, event, usage dimensions, and immutable audit indexes. Commit(s): `cc93e43` (durable job/outbox/usage/audit tables and indexes; workers/reservation/replay remain downstream)
- [x] **HOSTED-010** · encrypted credential/channel schema · deps: HOSTED-002/009 · Replace plaintext JSON webhook credentials with versioned envelope-encrypted secrets and rotation metadata. Commit(s): `587c234`, `d0c8c54`, `1f0233c` (web schema, registration rotation, and encrypted monitor reads)
- [x] **HOSTED-011** · tenant-scoped repository/data-access layer · deps: HOSTED-002-010 · Require tenant context in every query/mutation, centralize authorization, and prevent unscoped lookups by type/API. Commit(s): `2e88c28`, `fd4737b`, `d981f5f`, `a5beae7`, `3b80a98`, `5e3a244`, `920de3a`, `179837a`, `08a8c46`, `bdb7045`, `b0e3067`, `39730f8`, `21c3b19` (accepted at verified PR #32 head: organization/project route access uses a scoped-only database facade; the organization directory uses an actor-bound repository; static audit finds no direct raw DB client in organization API route files; PostgreSQL tests prove read/update/project scope, insert binding, and cross-user directory isolation. Local suite 76/76 with DB active; hosted Node 22 run `34672637622`, GitGuardian, and Vercel pass. PR #32 remains OPEN/MERGEABLE; merge is a separate release-control action)
- [x] **HOSTED-012** · negative tenant authorization suite · deps: HOSTED-011 · Cover every tenant resource and non-member/role combination; permission denial reveals neither existence nor evidence. Commit(s): `f59a2ab`, `5e3a244`, `08a8c46`, `b0e3067`, `39730f8`, `21c3b19`, `1db0fea`, `26fc04f`, `3544561`, `9abfbed`, `5e0858c`, `8263cf6` (complete: exhaustive role/action matrix; PostgreSQL resolver tests distinguish authorized access from non-member, inactive, forbidden-role, missing/foreign-project outcomes; real route-handler test invokes all 19 protected HTTP methods with unauthenticated/forbidden results and project-not-found masking where applicable, asserts bounded exact responses and requested tenant/resource IDs/actions. Hosted Node 22 run `34677302797` passes 81/81 tests, typecheck, schema/migration checks, build, public-boundary, dependency, and tracked-secret guards; GitGuardian and Vercel pass. Operator/provider privileged-access controls remain separately tracked by R-007.)
- [x] **HOSTED-013** · current-data dual-write/backfill migration · deps: HOSTED-002-012 · Backfill users/licenses/monitor registrations/reports/attest summaries into target entities with dry run, counts, reconciliation, rollback, and no deletion. Commit(s): Web `1645ec2` (preparatory audit) → PRs #34–#40 (preparatory planners + writer + reconciler + writer integration) → **EXECUTED 2026-09-20 against production Neon `neondb` (PG 18.6) via `HOSTED_013_EXECUTION_RUNBOOK.md`**. Sequence: (1) pre-execution `pg_dump` logical backup `hosted-013-backup-20260920T151757Z.sql` (153K, restored & drill-verified). (2) Drizzle migrations 0015 (legacy_migration_mappings), 0016 (score_history.event_id + index), 0017 (razorpay_webhook_events) applied forward-only (production went 15 → 18 migrations, 33 → 35 tables; all `IF NOT EXISTS`). (3) Dry-run manifest `hosted-013-dryrun-20260920T151515Z.json`: mode=`dry-run`, transactionOutcome=`rollback`, 1 legacy user, 1 license, 1 monitor_registration, 0 attestations, 0 reports; all runbook Step 1 invariants pass. (4) Commit Pass 1 `hosted-013-commit-pass1-20260920T152326Z.json` (`--commit --sources=users,attestations,licenses,reports`): 1 organization, 1 membership, 0 projects, 2 mappings inserted; mode=`commit`, transactionOutcome=`commit`. (5) Commit Pass 2 `hosted-013-commit-pass2-20260920T152355Z.json` (`--commit --sources=monitor_registrations`): 0 orgs, 0 memberships, 1 project, 1 mapping. Total 4 new organizations/members/projects rows + 3 legacy_migration_mappings, zero quarantines. (6) Reconcile `hosted-013-reconcile-20260920T152735Z.log`: `status: reconciled`, `orphanMappingsAllSources: 0`, `unmappedSourceRowsAllSources: 0`, `targetOrganizationsMissing: 0`, `targetProjectsMissing: 0`, `mappingsSurveyed: 3`. (7) Restore drill on local Postgres 18-alpine docker (matches production major version), restored from the same `pg_dump` artefact, dry-run + Pass 1 + Pass 2 + reconcile all produce **byte-identical counts** to production. Reconcile defect surfaced during Step 3 execution (PG 18 rejects `count(*)::int filter (where …)` — cast landed between aggregate and filter clause) shipped as separate fix PR **#53** merged as `79b4de6` with `.gitignore` entries added so operational evidence never ships publicly. All manifests, backup, and reconcile log preserved locally under `verglos-web/hosted-013-*` (git-ignored). No destructive DDL/DML issued at any point; writer is `ON CONFLICT DO NOTHING` idempotent so re-runs converge to the same state.

## Epic 11 — Durable queues, monitoring, outbox delivery, retention, observability, and recovery

Evidence/problem: one hourly sequential function processes every registration, an OSV failure can look like no findings, delivery has no durable retry, and generic webhooks expose SSRF risk.

- [x] **OPS-001** · queue/provider ADR and interface · deps: TRUTH-008/011, HOSTED-009 · Accepted at Web PR #41 head: founder-authorized bucket B resolution 2026-09-16 selects Neon/PostgreSQL as the durable queue on the existing `jobs` table (rationale: zero paying users pre-launch, provider-neutral interface makes future swap cheap, unified DB avoids operational complexity). `src/lib/queue/postgres-provider.ts` implements the full `DurableQueueProvider` contract — idempotent enqueue on the unique index, atomic claim via `SELECT FOR UPDATE SKIP LOCKED`, lease fencing via `lease_owner`+`lease_expires_at`+`attempts`, retry-then-dead-letter at `maxAttempts`, opaque base64url tenant-id fairness cursor. 9 input-validation unit tests + 5 DB-integration tests prove enqueue idempotency, atomic claim / no double-lease, stale-fence rejection, retry-to-dead-letter transition, and fairness cursor advance. Commit(s): OPS-001 provider commit on `feat/web-ops-provider-decision-and-producer`.
- [x] **OPS-002** · scheduler/due-job producer · deps: OPS-001, HOSTED-008/009 · Accepted at Web PR #41 head: `src/lib/queue/monitor-producer.ts` sweeps active `monitor_registrations` for rows whose `last_checked_at` is older than the cadence (default 24 h), joins through `licenses → users → personal organizations (external_id = personal-user:<user_id>)` for tenant ownership, and enqueues one queue job per registration per UTC day via the deterministic `monitor-check:<registration_id>:<YYYY-MM-DD>` idempotency key so a second producer run in the same day is a no-op on the unique index. Bounded sweep (default 500 registrations per run) and per-tenant static backpressure ceiling (default 50 outstanding jobs) prevent single-tenant queue saturation. Manifest emits `observableLagSeconds` and `nextDueAfter` for OPS-013 metrics wiring. Registrations without a resolvable personal organization are counted as `ownerUnresolvable` and never enqueued against the wrong tenant. 3 unit tests cover UTC-day-boundary determinism, cross-day key change, and cross-registration key uniqueness. Commit(s): OPS-002 producer commit on `feat/web-ops-provider-decision-and-producer`.
- [x] **OPS-003** · inventory/advisory worker · deps: OPS-002 · Accepted at Web PR #42 head: `src/lib/queue/advisory-worker.ts` leases `monitor.check` jobs from the durable queue provider, resolves each registration through licenses -> personal organization -> project, upserts npm-ecosystem `components` rows for every declared dependency, queries OSV once per job via the existing `osvBatchQuery` client, and persists `advisory_matches` with `freshness_status` `fresh` on success or `incomplete` on OSV outage (writes an explicit `INCOMPLETE-OSV-OUTAGE` marker per component so a network failure never looks like a clean scan). Only stable errorCodes cross the queue `fail()` boundary — no source/path/secret/package/finding text ever leaves worker memory. Unresolvable ownership retries with a 1-hour backoff so a later HOSTED-013 run can catch registrations up. 6 unit tests cover empty payload, missing/inactive registration, unresolved ownership, empty-queue manifest, and a type-shape guard that prevents future refactors from adding leakable failure fields. Full `pnpm test` 185 pass / 11 DB-integration skips / 0 fail; typecheck, public-boundary all pass. Hosted `typecheck-and-schema` + `GitGuardian` + `Vercel Preview Comments` SUCCESS on exact head. Commit(s): advisory-worker commit on `feat/web-ops-advisory-worker`.
- [x] **OPS-004** · advisory normalization/cache · deps: OPS-003 · Accepted at Web PR #43 head: `src/lib/monitor/advisory-normalizer.ts` provides `canonicalAdvisoryId` (preference-ordered CVE > GHSA > OSV > other, case-normalized, bounded-fallback UNKNOWN-ADVISORY), `dedupeFindings` (collapses identical package+canonicalId rows keeping max severity, stable sort), `componentsNeedingCheck` (TTL predicate that skips OSV re-queries within 6h and always re-checks INCOMPLETE cache entries so a transient outage never persists as "recent enough"), and `normalizeFinding` (frozen persisted shape with source-tag guard + summary truncation at 512 chars). 11 focused unit tests. Full `pnpm test` 196 pass / 11 DB-integration skips / 0 fail. Commit(s): advisory-normalizer commit on `feat/web-ops-004-advisory-normalization`.
- [x] **OPS-005** · reverse component index matcher · deps: OPS-004, HOSTED-008 · Accepted at Web PR #44 head: `src/lib/queue/reverse-index-matcher.ts` finds every released `components` row matching a ChangedAdvisory's identity_key, joins through the personal-org→license→registration chain, dedupes multi-component matches to one enqueue per registration, and enqueues `monitor.check` jobs with deterministic `advisory-recheck:<advisoryId>:<registrationId>:<YYYY-MM-DD>` idempotency key. Components without a monitor_registration are counted as `skippedNoRegistration` (never silently dropped). V1 uses exact-string version match; semver range predicates are a follow-up. 6 unit tests. Local `pnpm test` 202 pass / 11 DB skips / 0 fail. Commit(s): reverse-index-matcher commit on `feat/web-ops-005-reverse-index`.
- [x] **OPS-006** · transactional match/outbox write · deps: OPS-003/005, HOSTED-009 · Accepted at Web PR #45 head: `src/lib/queue/match-outbox.ts` `writeMatchAndOutbox` persists an `advisory_matches` row and its corresponding `outbox_events` delivery-intent row inside one caller-provided transaction — either both commit or both roll back, so a worker crash between them never leaves matched CVE with no delivery, or a delivery pointing at a match that never landed. Deterministic `outboxEventKey` (`advisory-match:<componentId>:<source>:<advisoryId>:<severity>`) on the `(org, event_key)` unique index makes re-runs a no-op; severity escalation produces a new key so downstream delivery legitimately re-fires. `shouldEnqueueDelivery` gates delivery to fresh critical/high matches only — INCOMPLETE freshness never fires an alert (a network failure must not masquerade as a real advisory). 5 unit tests. Commit(s): match-outbox commit on `feat/web-ops-006-match-outbox`.
- [x] **OPS-007** · email/Slack delivery workers · deps: OPS-006 · Accepted at Web PR #46 head as part of the OPS-007+008+009+010 fat batch: `src/lib/queue/delivery-worker.ts` provides per-channel state (`advanceChannel`) with independent retry so failure of one channel never suppresses another; `computeRetryDelayMs` bounded exponential with jitter (capped at attempts=8) prevents mass advisory storms from synchronizing retries. Failure boundary passes only bounded stable `DeliveryErrorCode` values. 7 unit tests. Commit(s): delivery-worker commit on `feat/web-ops-007-010-delivery-and-dlq`.
- [x] **OPS-008** · hardened webhook delivery · deps: OPS-006, HOSTED-010 · Accepted at Web PR #46 head: `src/lib/queue/webhook-safety.ts` `classifyWebhookUrl` + `classifyResolvedHost` reject non-https schemes, credentials in URL, unsafe ports, localhost variants, IPv4 loopback/RFC-1918/RFC-6598/link-local/metadata/multicast, IPv6 loopback/link-local/unique-local/unspecified, and IPv4-mapped-IPv6 embeddings of private v4. `validateWebhookAdapter` refuses unsafe URLs before touching the fetch layer. 10 unit tests. Commit(s): webhook-safety commit on `feat/web-ops-007-010-delivery-and-dlq`.
- [x] **OPS-009** · alert dedup/recovery semantics · deps: OPS-007/008 · Accepted at Web PR #46 head as part of the OPS-007+008+009+010 fat batch: `aggregateStatus` in `delivery-worker.ts` collapses per-channel state (delivered/pending/terminal) to event-level status (delivered / partial / pending / terminal) — a channel failure never suppresses another channel's success, and a partial delivery is a distinct state operators can retry only the failed channel of. Outbox events are never deleted to force a retry; per-channel state advances independently. 7 unit tests (shared with OPS-007). Commit(s): delivery-worker commit on `feat/web-ops-007-010-delivery-and-dlq`.
- [x] **OPS-010** · dead-letter inspection/replay · deps: OPS-001/007/008 · Accepted at Web PR #46 head: `src/lib/queue/dead-letter-replay.ts` `listDeadLetters` for inspection, `replayDeadLetters` for authorized bounded re-enqueue with fresh idempotency key (`<original>:replay:<YYYY-MM-DD>`) so a re-replay on the same UTC day is a no-op on the queue unique index. Original dead-letter row is never mutated in place; every successful replay writes an `audit_events` row (`queue.replay`) with actor + reason. Input validation refuses non-UUID ids, duplicates, above-limit calls (default 25, hard cap 100), and control-char reasons. 7 unit tests. Commit(s): dead-letter-replay commit on `feat/web-ops-007-010-delivery-and-dlq`.
- [x] **OPS-011** · retention/deletion workers · deps: HOSTED-006/009, PLAN-WEB later · Accepted at Web PR #47 head as part of the OPS-011+012+013+014 fat batch: `src/lib/queue/retention-policy.ts` provides tier-driven retention windows per resource kind (record_receipt, scan_event, advisory_match, outbox_event, audit_event × free/pro/team/studio/enterprise), a 7-day pre-delete warn state, legal-hold override that always keeps, and a pure `summarizeSweep` counter. Customer-held signed records are never affected (only hosted rows). 5 unit tests (in ops-011-014.test.ts). Commit(s): retention/telemetry/metrics/backup commit on `feat/web-ops-011-014-retention-telemetry-metrics-backup`.
- [x] **OPS-012** · telemetry aggregation/retention · deps: TRUTH-007, HOSTED-009 · Accepted at Web PR #47 head as part of the OPS-011+012+013+014 fat batch: `src/lib/queue/telemetry-aggregation.ts` aggregates coarse counters per (org, dimension, UTC day) with fixed dimension allowlist (8 approved dimensions), opt-out honored, pending deletion request honored, and `assertNoSensitiveFields` guard that rejects path/finding/secret/email/package/recipient keys. 5 unit tests. Commit(s): OPS-011..014 commit on `feat/web-ops-011-014-retention-telemetry-metrics-backup`.
- [x] **OPS-013** · operational health/metrics/alerts · deps: OPS-002-012 · Accepted at Web PR #47 head as part of the OPS-011+012+013+014 fat batch: `src/lib/queue/health-metrics.ts` freezes 8 stable metric names (queue lease latency, attempts p99, dead-letter count, producer lag, OSV outage ratio, delivery failure ratio, outbox pending, retention lag) with info/warn/critical thresholds; snapshot rejects non-finite values and only attaches the threshold when severity is not info. 4 unit tests. Commit(s): OPS-011..014 commit on `feat/web-ops-011-014-retention-telemetry-metrics-backup`.
- [x] **OPS-014** · backup/restore and object reconciliation · deps: HOSTED-006/009, OPS-011 · Accepted at Web PR #47 head as part of the OPS-011+012+013+014 fat batch: `src/lib/queue/backup-restore.ts` provides content-digest manifest and reconciliation predicate that reports `reconciled` only when every resource matches by digest; drift surfaced as counts (missingInBackup, missingInRestore, digestMismatches), never id lists so no leakage into logs. 4 unit tests. Commit(s): OPS-011..014 commit on `feat/web-ops-011-014-retention-telemetry-metrics-backup`.
- [x] **OPS-015** · monitoring migration/cutover · deps: OPS-002-014, HOSTED-013 · Dual-run without double alerts, reconcile results, switch daily promise, preserve registrations, and keep rollback to old route until verified. Commit(s): Web `f385d41`, `e5cfa09`, `35c58e4`, `030e9d3` accepted at PR #54 merged as `d6823514`. Env-driven cutover policy (`MONITOR_CUTOVER_ROUTE = legacy | dual | queue`, defaults to `legacy` for unknown/unset values so unset production stays safe) exposes `legacyDispatchAllowed`, `producerEnqueueAllowed`, `queueDeliveryAllowed`, and `describeCutoverRoute` decision helpers. Legacy `/api/cron/monitor` returns `{ok: true, skipped: "cutover-not-legacy"}` when the flag is `queue`, preserving auth semantics while preventing double dispatch. `runMonitorProducer` becomes a manifest-emitting no-op when the flag is `legacy` so operational metrics distinguish "idle because nothing due" from "idle because cutover suppressed enqueue"; outstanding queue jobs continue to be processed by the OPS-003 advisory worker. Reconciliation module `cutover-reconcile.ts` compares legacy `alert_dispatches` vs queue `advisory_matches` on the shared `(registration_id, advisory_id, package_name)` grain, reports `matched`/`legacy_only`/`queue_only` counts per registration, dedupes within each side (a legacy cron that fired twice cannot inflate its count), and treats `incomplete` OSV-outage rows as indeterminate — they never become matches or divergences. `monitor_registrations` are never mutated by the flag, so rollback is a single env-var flip back to `legacy` with zero migration. 14 focused tests pass locally (7 policy + 7 reconcile) in ~155 ms; existing cron-workflow / route-error-contract / producer tests continue to pass. Hosted `Verify web` typecheck-and-schema, GitGuardian, Vercel preview all green at exact head `030e9d3`. `queueDeliveryAllowed` is surfaced but not yet consumed because the OPS-007 delivery worker is a library module without a route wire; when that wire lands it will read this flag without downstream code change.

## Epic 12 — Canonical plan catalog, server-side authorization, usage, quotas, and billing

Evidence/problem: CLI and web plan models disagree; Team is absent; current limits are not consistently enforced; payment display and gateway amounts are separate.

- [x] **PLAN-WEB-001** · server-side plan catalog schema/config · deps: TRUTH-004/008, HOSTED-001 · Define Free/Pro/Team/Studio/Enterprise prices, billing periods, seats, apps, records, clients, retention, traffic, managed execution, status, and effective dates. Commit(s): `f31548f`, `0d9a185` (complete: versioned catalog models monthly/annual USD prices, effective date, lifecycle/purchasability, named allowances for all governed dimensions including `verification.public_request` and `managed_execution.run`; unspecified public-plan traffic/managed-run limits remain `unset`, Enterprise is `contracted`. Runtime validator rejects missing tiers, invalid dates/limits/prices, and purchasable unverified plans. Hosted run `34678019063` passes 82/82 tests and typecheck/schema/migration/build/security gates. This does not complete gateway binding, usage enforcement, or pricing verification.)
- [x] **PLAN-WEB-002** · capability registry from catalog · deps: PLAN-WEB-001 · Generate normalized capabilities/limits and eliminate compliance/founder public drift while preserving internal override separately. Commit(s): `f31548f`, `0d9a185` (complete: server `PLAN_CAPABILITIES` is derived from the versioned catalog; endpoint projection and effective capability resolver share that catalog, `founder` is an internal-only override absent from public catalog, and legacy `compliance` decodes to contracted `enterprise`. Existing Team/Enterprise capability behavior is preserved while their catalog lifecycle prevents implying new availability. Focused tests cover drift/compatibility; hosted run `34678019063` passes all required gates. CLI opaque-catalog migration remains PLAN-CLI-001.)
- [x] **PLAN-WEB-003** · signed entitlement token vNext · deps: PLAN-WEB-002, HOSTED-002/003 · Bind tenant/user/role/plan/capabilities/allowances/version/expiry; support key rotation, revocation, and backward compatibility. Commits: CLI `d6cde6fb7ecd3d1d4aaeea13a973b286e4cd73a4`, `a5744b9` merged in PR #45 as `2de56af`, corrective `ac74fb2` merged in PR #46 as `7dcc74b` (successor `KQBe_W4W4ta9z5KtMj-MwnVvLo3MmpIBSaGB6Dszg4I` pinned in `PINNED_PUBLIC_KEYS_B64URL[1]` matching the production signer; legacy `YFa-Ut1bGFrv--OKfyP56Dg8riD4NJ8kR0oAclidtbE` retained in slot 0 rotation-safe; full 9-cell platform matrix + self-scan green at both PR heads); Web `4c0bd49c6a4702bfa28436f98d641a337a77786c` (tenant-bound v2 issue/verify, signer key IDs, production fail-closed successor-key config validation, legacy compatibility, inactive-license online downgrade and 7-day offline limitation). Operational acceptance executed 2026-09-23: `VERGLOS_ENTITLEMENT_PRIVATE_KEY_SUCCESSOR` populated with a fresh Ed25519 PEM PKCS8 whose paired public matches the successor slot, `VERGLOS_ENTITLEMENT_KEY_ID=successor-v1` selects the freshly-pinned slot, `VERGLOS_ENTITLEMENT_PRIVATE_KEY` populated with the same PEM as a bootstrap-legacy placeholder (no legacy-v1 signing invocation exists because `KEY_ID` picks successor), and the production build accepted the runtime-config matrix without emitting any secret material to logs. Full end-to-end token issue+verify roundtrip against a running CLI carrying the new pin remains a downstream operational check but is not a code gate for this item. No token-level immediate offline revocation is claimed.
- [x] **PLAN-CLI-001** · opaque vNext entitlement consumption · deps: PLAN-WEB-003 · Treat server capabilities/limits as opaque versioned data, fail safely offline, preserve Free, and remove duplicated target-plan constants. Commit(s): `7edb4a9`, `937705b`, `be06761` (implementation and keyed-header compatibility are complete: bounded v2-token fetch with v1 fallback; signed opaque capability/allowance/catalog consumption; license-key-hash binding; fail-soft legacy/free behavior; strict support for the server's pinned `legacy-v1`/`successor-v1` key IDs while preserving the legacy header; and a regression test). Isolated Preview evidence proves canonical Test Mode card capture → signed webhook → billing ledger/license → migrated owner tenant → deployed v2 token → CLI verification with `schemaVersion=2`, Pro, owner role, tenant ID, and pinned-key signature. Focused entitlement tests pass 12/12; evidence: `docs/shipping/evidence/plan-cli-001-preview-v2-issue-verify-2026-10-10.md`. Gate 4's broader provider delivery/renewal/failure/refund/replay matrix remains separately open.)
- [x] **PLAN-CLI-002** · effective-capability UX · deps: PLAN-CLI-001 · Update whoami/help/errors to show current plan, maturity, allowance source, expiry/grace, and actionable upgrade without claiming unavailable features. Commit(s): CLI `b890763` merged PR #53 as `e06de5b`, followed by machine-contract correction `1fe0a0e` merged PR #54 as `443be30`, with local integration of the effective entitlement path. `verglos whoami --json` and human output expose effective entitlement authority (`rest`/`cache`/`signed-token`/`free`), stale/offline-grace state, capability count, catalog version, bounded allowances, and verified-token expiry; offline/legacy paths remain fail-soft and legacy tier-only tokens cannot grant paid capability. Entitlement 15/15, focused CLI 28/28, machine-output 30/30, full test/typecheck/build, and diff checks pass. Accepted with evidence `docs/shipping/evidence/plan-cli-002-effective-capability-ux-2026-10-10.md`; no Production/provider/database/entitlement/npm/customer-data write occurred.
- [x] **PLAN-WEB-004** · server-side authorization service · deps: PLAN-WEB-002/003, HOSTED-011 · Centralize resource/action/role/capability checks; never trust CLI flags or local gates. Commit(s): Web `a1cdc66` accepted at PR #58 merged as `6471f8b`. `src/lib/organizations/authorization.ts` exposes the composed authorization surface every future capability-gated route/worker/CI-checker must call: `decideCapability({requiredCapability?, planCapabilities})` is the pure decision, and `composeOrganizationAuthorization({accessResult, plan, planCapabilities, requiredCapability?})` unifies role/tenant/capability into one discriminated-union outcome (`ok:true` with access + plan, or `ok:false` with `unauthenticated | forbidden | project_not_found | capability_not_available`). Denial reasons are stable and safe for a 403 body — never reveal which plan the tenant is on or which capability list they possess. Callers do the DB lookup for plan; this module stays pure and DB-free. Composes: (1) membership + role → action from `access.ts`; (2) tenant/project scoping from `auth.ts`/`scoped-db.ts`; (3) plan → capability from `entitlement/capabilities.ts`. 9 focused unit tests: capability absent → role/action authoritative; capability present → admit; capability absent from plan → `capability_not_available`; role denial forwarded before capability evaluation; malformed inputs rejected; project_not_found forwarded so route can 404 without leaking adjacent projects. Hosted CI green at exact head `a1cdc66`.
- [x] **PLAN-WEB-005** · usage ledger write API/service · deps: PLAN-WEB-001, HOSTED-009/011 · Record idempotent dimensions for hosted ingestion/storage/traffic/alerts/managed work and expose auditable reconciliation. Commit(s): Web `fd04c1e`, `9e2aaf9`, `74492ff` accepted at PR #50 merged as `f5a79e8` (durable ledger over `usage_events` migration `0012`: five governed dimensions, six governed sources, canonical intent digest so replays are exact-match and mismatched intents surface as `conflict`; tenant-scoped `GET /api/v1/organizations/[organizationId]/usage` behind `requireOrganizationAccess("view")` returns bounded aggregate reconciliation only, collapses provider failure to `503`, pins `Cache-Control: private, no-store`, and is included in the tenant-scope audit at 11 routes / 20 methods).
- [x] **PLAN-WEB-006** · quota reservation under concurrency · deps: PLAN-WEB-005 · Atomically reserve/commit/release usage and prove concurrent requests cannot exceed limits. Commit(s): Web `fd04c1e` accepted at PR #50 merged as `f5a79e8` (`pg_advisory_xact_lock` on the sorted (org, dimension, period) + (org, idempotency-key) + (org, reservation-id) keys serializes competing sessions; cross-bucket reservation-id collision rejected; `reserve → (commit | release)` lifecycle enforces terminal-state and exact-replay resolution; integration test proved 20 concurrent reservations vs limit 5 admit exactly 5 with real parallel connections and surfaced/closed a JSON/timestamp encoding defect at the advisory-lock partition boundary before commit; local `pnpm test` 286/0/0 and hosted `Verify web` typecheck-and-schema green at exact head `74492fff`).
- [x] **PLAN-WEB-007** · 80% warning behavior · deps: PLAN-WEB-005/006, OPS-006 · Notify owner once per threshold/window with exact allowance and no fear copy. Commit(s): Web `38997ad` accepted at PR #51 merged as `326f48d` (`src/lib/usage/threshold-outbox.ts` emits deterministic `usage.threshold.reached` outbox events at 80% of the plan allowance; event key `usage-threshold:<org>:<dimension>:<pct>:<periodStart-ISO>` collapses replays and concurrent racers to a single row through the existing `(organization_id, event_key)` unique index; payload carries exact `limit`/`activeQuantity`/`periodStart`/`periodEnd` and generates no message text so no fear copy can leak; distinct dimensions and distinct billing periods emit their own event keys. Integration test proves 8 concurrent racers against the same crossing yield exactly one persisted row; unit tests cover below-threshold silence, first-time crossing, in-window replay, zero-limit silence, and malformed-input rejection. Downstream channel-template wiring for the new topic remains an OPS-007 delivery-side concern; the outbox event is well-formed and the delivery worker consumes topics generically).
- [x] **PLAN-WEB-008** · 100% enforcement/overage behavior · deps: PLAN-WEB-006 · Preserve records and local work; reject only new hosted ingestion unless explicit upgrade/overage is active; no surprise charges. Commit(s): Web `1bc70f5` accepted at PR #51 merged as `326f48d` (`src/lib/usage/admission-policy.ts` exposes the pure `admissionForIngestion` decision function: admits under-limit requests with `overage: false`, admits over-limit requests with `overage: true` only when the tenant entitlement carries the `usage_overage_pay_as_you_go` capability, and otherwise rejects with `quota_exceeded` naming exact active/limit/request quantities. The overage capability is not attached to any catalog plan today, preserving "no surprise charges" until overage is explicitly granted per organisation. Local CLI operations never traverse this admission path so `preserve local work` is a structural property. Six focused unit tests cover under-limit admission, over-limit rejection without capability, over-limit admission with capability, zero-limit rejection/overage-only-admission, malformed-quantity rejection, and safe-integer boundary rejection).
- [x] **PLAN-WEB-009** · seat/member enforcement · deps: HOSTED-002, PLAN-WEB-004/006 · Enforce included seats and explicit additional-seat terms server-side, including races/invitations/removals. Commit(s): Web `363a714` accepted at PR #59 merged as `1a937c1` (part of the combined resource-admission batch). `src/lib/plan/resource-admission.ts` gates seat creation against the plan catalog's numeric allowance with the same discipline as applications/clients: `admitResourceCreation({ dimension: "seats", currentCount, requestCount?, planAllowance })` returns `admit: true` while projected count fits the allowance, `admit: false, reason: "allowance_exhausted"` past it (naming exact dimension/count/limit), `admit: false, reason: "allowance_not_configured"` for `"unset"` plans (never assumes unlimited), and admits Enterprise `"contracted"` allowances with an `overageMarker: "contracted"` so downstream contract-lookup binds the exact ceiling. Multi-request batch admission covers invitation batches in one call so race-free enforcement is possible. 10 focused unit tests cover boundary, batch, unset denial, contracted admit, zero denial, unknown-dimension rejection, malformed-quantity rejection, and safe-integer overflow. Hosted CI green.
- [x] **PLAN-WEB-010** · application/client/record/retention enforcement · deps: HOSTED-003/006, PLAN-WEB-004/006 · Enforce each allowance by catalog and lifecycle, not UI counters. Commit(s): Web `363a714` accepted at PR #59 merged as `1a937c1` closes the applications/clients half. Same `src/lib/plan/resource-admission.ts` module handles all three creation-count dimensions (`applications`, `clients`, `seats`) uniformly. Records and traffic dimensions are already governed by PLAN-WEB-005/006 usage ledger + PLAN-WEB-008 admission policy. Retention days is already governed by OPS-011 `retention-policy.ts` which honors the same `free|pro|team|studio|enterprise` tier taxonomy and returns `keep/warn/delete` decisions per row with legal-hold override. Together the three modules (retention-policy, admission-policy, resource-admission) form the complete PLAN-WEB-010 enforcement surface — applications gated at insert time, records/traffic gated at ingest time via ledger reserve/commit, retention gated at row-age check time. Hosted CI green.
- [x] **PLAN-WEB-011** · billing amount/catalog binding · deps: PLAN-WEB-001 · Create gateway orders/subscriptions only from server catalog; validate currency/period/plan, verify webhooks, and reconcile displayed/charged amounts. Commit(s): Web `cfe6936`, `b103d9e` merged in PR #49 as `c34ebd9`; INR activation Web `23a83f0` merged PR #123 as `f31a8e2`; invoice-backed capture binding Web `a95deef`; invoice-only failed-subscription binding Web `da45a97`. The isolated Preview/Test Mode acceptance now proves a server-catalog Pro/monthly INR offer, HMAC-bound checkout notes, provider `active` subscription, captured subscription payment with exact canonical amount/currency, five distinct signed lifecycle events, and linked active Pro license without manual writes. Production remains fail-closed and is tracked separately by `PLAN-WEB-015`; the complete lifecycle remains open under `PLAN-WEB-012`/`PLAN-WEB-014`. Evidence: `docs/shipping/evidence/plan-web-011-canonical-amount-binding-accepted-2026-10-10.md`.
- [x] **PLAN-WEB-012** · billing lifecycle/idempotency · deps: PLAN-WEB-011 · Under the Final V1 prepaid/manual-renewal contract, handle capture/failure/refund/expiry/manual renewal/replay/out-of-order/retry without duplicate license or silent access loss; automatic recurring subscription renewal is compatibility-only and not a V1 promise. Commit(s): Web `b103d9e` merged in PR #49 as `c34ebd9`; Web PR #161 merged as `ec02cacf69f3adb0d8df5ccb36a1a4eb5ef4cc3f`; expiry lifecycle Web `4ba15ad`; invoice-only failed-subscription binding Web `da45a97`; final isolated Preview/Docker acceptance in `docs/shipping/evidence/plan-web-012-final-v1-lifecycle-reconciliation-2026-10-11.md` and `docs/shipping/evidence/plan-web-014-preview-prepaid-cards-lifecycle-2026-10-11.md`. Accepted with signed capture/refund delivery, failed-order no-grant, manual second order, migration-backed replay/order/retry/expiry/exactly-once evidence, and preserved compatibility cancellation/replay evidence.
- [x] **PLAN-CLI-003** · modified/untrusted CLI test client · deps: PLAN-WEB-004-012 · Attempt forged plan, capability, tenant, usage, and record requests; hosted access remains protected. Commit(s): Progress evidence `docs/shipping/evidence/modified-client-production-probe-2026-10-06.md` and the 2026-10-09 read-only probe `docs/shipping/evidence/modified-client-production-probe-2026-10-09.md` show anonymous forged plan values remain Free and forged organization probes remain auth-hidden 404; Web PR #147 merged as `7248919` adds authenticated usage/receipt code-side matrix coverage, with evidence in `docs/shipping/evidence/modified-client-authenticated-request-matrix-2026-10-06.md`; CLI `439b782d` rejects unsafe saved API origins before any license bearer request; isolated Preview paid modified-client evidence completes the authenticated list/search/download-export/public-private runtime matrix. Web test-contract alignment is `003def6`. Evidence: `docs/shipping/evidence/plan-cli-003-preview-paid-modified-client-matrix-2026-10-11.md`.
- [x] **PLAN-CLI-004** · plan/catalog contract fixtures · deps: PLAN-WEB-002/003, PLAN-CLI-001 · Freeze client/server compatibility and old-token migrations across supported CLI versions. Commit(s): CLI `9ff21be` accepted at PR #50 merged as `f16c6f1`; frozen Free/Pro/Team/Studio/Enterprise server-shaped fixtures preserve opaque capability/allowance keys and malformed catalogs fail closed to Free without stale paid reuse. CLI PR #72 head `059918c` merged as `c1f1cd7`; hosted platform run `37550255842` and self-scan `37550255844` pass all Ubuntu/macOS/Windows Node 20/22/24 and in-toto checks. The legacy v1 activation fallback and current deployed v2 issue→verify trace now complete the compatibility path. Accepted with evidence `docs/shipping/evidence/plan-cli-004-compatibility-accepted-2026-10-10.md`; R-041 and protected release activation remain separate gates.

## Epic 13 — Pro dashboard and current-customer migration

Evidence/problem: the current account UI centers score/history/activation and is not the final release-decision dashboard. Preserve working customer access while migrating.

- [x] **PRO-001** · authenticated dashboard shell/navigation · deps: HOSTED-011/013, PLAN-WEB-004 · Implement Home, Releases, Applications, Findings, Monitoring, Alerts, Policy, Members, Billing without altering public landing routes. Commit(s): Web `1eae188` accepted at PR #64 merged as `53a1ba3`. Server-component shell at `/orgs/[organizationSlug]/*` — every request goes through the layout for Clerk auth wall → `ensureUser` → organization lookup by slug → membership guard (userId + organizationId + status === "active") → renders the sidebar with tenant context. Unauthenticated visitors redirect to `/login?next=…`; non-members hit `notFound()` so probing another org's slug reveals nothing. Root `/orgs/<slug>` redirects to `/home`. Nine page files (home / releases / applications / findings / monitoring / alerts / policy / members / billing) are honest scaffolded stubs naming which downstream batch (PRO-002..008, TEAM-WEB-001/003 follow-ups) fills the interactive content. Public landing routes (`/`, `/verify/*`, `/detectors`, `/docs`, `/reports/*`, `/account/*`) untouched — shell lives entirely under `/orgs/*`. Hosted CI green at exact head `1eae188` (typecheck + build + Vercel preview all SUCCESS).
- [x] **PRO-002** · decision-first Home · deps: PRO-001, HOSTED-004/007 · Show exact current decision, five-app health, recent release changes, expiring exceptions, and allowance usage; score is secondary. Commit(s): Web `0f01761` accepted at PR #65 merged as `22a3c13`. Server-component page `/orgs/[organizationSlug]/home` loads five tenant-scoped slices in one `Promise.all`: most recent release (decision string + release ID + signer status + generated-at with explicit empty state), first 5 projects (external ID + name, grid layout, empty state pointing at CLI + Applications page), last 30 days of releases (top 5 with decision + date), exceptions expiring in the next 14 days (up to 10 with expiry date), and active-member count. Every query scopes on `organizationId` so cross-tenant leakage is structurally impossible. Score is intentionally omitted per acceptance ("score is secondary"). Hosted CI green at exact head `0f01761`.
- [x] **PRO-003** · Releases/application views · deps: PRO-001, HOSTED-003/004 · List exact subjects, decisions, coverage, changes, signer state, and incomplete evidence with tenant-scoped pagination. Commit(s): Web `1a43e9b` accepted at PR #66 merged as `10161a4`. `/orgs/[organizationSlug]/releases` now provides 20-row tenant-scoped pagination, application filtering that fails closed for unknown/cross-tenant IDs, exact subject ID/kind/digest, policy digest, canonical decision, signer state, producer-declared coverage classes/statuses, explicit limitations, and evidence-incompleteness warnings. A tenant-scoped SQL window compares each release with its immediately preceding application release and reports decision, subject, policy, and coverage changes without rewriting stored decisions. `/applications` provides paginated project inventory, exact latest release state, release count, environment/status, coverage, and filtered release links. The shared React-cached dashboard guard binds authenticated user + active organization slug + active membership in one joined lookup, correcting the earlier single-membership `findFirst` behavior for users in multiple organizations. No migration, public-route change, or client state bundle. Local full suite 394 total / 372 pass / 22 environment-gated skips; 6 focused dashboard tests, typecheck, and production build green. Hosted typecheck/tests/schema/migrations/build, security, and Vercel preview all green at exact head.
- [x] **PRO-004** · findings list/detail panel · deps: PRO-003, HOSTED-005 · Group canonical observations, preserve producer lineage, show remediation/Hunt eligibility, and avoid vendor-first IA. Commit(s): Web `1ecf1c4`, `9ec9108` accepted at PR #67 merged as `036ae3b`. `/orgs/[organizationSlug]/findings` is a tenant-scoped, 20-group paginated server view with a bounded detail panel. Observations collapse only on a valid persisted `sha256:` fingerprint for the same exact subject; absent/invalid fingerprints retain observation identity, preventing speculative deduplication. The list leads with canonical title/severity/application and preserves rule/producer lineage, exact subject digest, observation count, category, and recency. Detail rows retain run/release/status/coverage/confidence/evidence-digest lineage and expose only bounded allowlisted metadata. Hunt eligibility is shown only when explicitly stored and otherwise says not evaluated; it is never inferred from severity or producer. Cross-tenant and malformed detail identities fail closed. A PostgreSQL-backed integration test proves same-fingerprint grouping, producer/release lineage, and exclusion of an identical foreign-tenant fingerprint. Full hosted typecheck/tests/schema/migrations/build, security, and Vercel preview passed at exact head `9ec9108`.
- [x] **PRO-005** · monitoring/inventory view · deps: OPS-015, HOSTED-008 · Show released components, freshness, advisory matches, last successful check, failures, and affected releases. Commit(s): Web `0b4da64`, `5dd54a8` accepted at PR #68 merged as `c54f19a`. `/orgs/[organizationSlug]/monitoring` now shows the active OPS-015 cutover route without treating routing as check success; tenant-mapped monitor registrations with snapshot, last completed, last successful, and incomplete timestamps; retry/dead-letter monitor jobs with bounded stable error codes; and a 20-row released-component inventory with ecosystem/version/PURL/digest, stored advisory count/severity, freshness, and last inventory sighting. The bounded component panel shows advisory source/range/fix/freshness/failure rows and exact affected releases only when an advisory's allowlisted metadata carries explicit release IDs; missing bindings remain an explicit limitation because project membership alone cannot prove a release was affected. PostgreSQL integration proves aggregation, successful-vs-incomplete classification, explicit release linkage, queue failure projection, and identical foreign-tenant inventory exclusion. Full protected CI passed at exact head. The same run exposed and the follow-up fixed an older probabilistic invitation test whose tamper could randomly equal the original digest; production invitation logic was unchanged.
- [x] **PRO-006** · alert configuration/delivery state · deps: OPS-007-010, HOSTED-010 · Configure encrypted channels, send auditable canary, and display retries/failures without exposing credentials. Commit(s): Web `aa4487a` accepted at PR #69 merged as `9b967aa`. `/orgs/[organizationSlug]/alerts` replaces the scaffold with tenant-scoped registration/channel state, recent bounded delivery outcomes, and only the high/critical advisory outbox topics needed to show retry/failure state. Owner/admin-only, same-origin API routes configure or revoke email/Slack/generic-webhook credentials and send a 60-second rate-limited canary; every route uses the centralized denial contract and the new deny-by-default `manage_alerts` RBAC action. Credential values are write-only AES-GCM material: the browser and read projection receive only channel/status/key-version/timestamps, legacy plaintext registration channels are scrubbed on rotation, and audit metadata contains channel names or delivered/failed/skipped states but never recipients, URLs, ciphertext, nonces, or authentication tags. Webhook configuration keeps the existing HTTPS/public-target validation and Slack host restriction; dispatch re-resolves and pins the target through the qualified secure client. PostgreSQL integration proves ciphertext differs from input, foreign-tenant mutation fails closed, legacy values are cleared, bounded canary/audit rows persist, immediate replay is throttled to one dispatch, revocation preserves a non-active credential row, and no raw email reaches audit JSON. Local full gate passed 394 configured tests (372 pass, 22 environment-gated skips), typecheck, production build, and diff check; hosted type/schema/PostgreSQL integration, GitGuardian, and Vercel preview all passed at exact head `aa4487a`.
- [x] **PRO-007** · private record history/signing identity · deps: VERIFY-WEB-001, RECORD-006/009 · Show records, digests, retention, signature identity, and offline download; explicit upload/sign actions only. Commit(s): Web `e255d0b`, `c4cef7c` accepted at PR #70 merged as `806c776`. Added authenticated `/orgs/[organizationSlug]/records` navigation and a 20-row tenant-scoped history/detail view with application filtering, exact receipt/manifest/projection/content/policy/subject digests, stored decision/redaction/limitations, generated/uploaded times, and recomputed hosted-content integrity. Signer status is shown exactly as stored; identity and issuer are explicitly `not stored in hosted receipt` because the accepted RECORD-011/VERIFY-WEB-001 redacted projection deliberately excludes them. Signing remains a local CLI operation with an exact approval receipt; the dashboard has no sign route and receives no key/signature bytes. Upload is an explicit file-select/button action available only to roles already admitted by `publish_record`, and the existing strict 256 KiB projection API continues to reject source, paths, raw findings, signature bytes, and unknown fields. The new project-scoped download route re-verifies the stored content digest, withholds corrupt/invalid rows, sets private/no-store + attachment headers, and exports a clearly labeled `verglos.hosted-receipt-projection.v1` JSON artifact—not the original customer-held `.vgl`. Retention displays the qualified current 30-day hosted window and its exact deadline/state; the longer tier catalog deadline is shown separately as `not enabled`, preserving PRO-009's rule that 90-day Pro history cannot be claimed before storage/cost/retrieval qualification. Pure tests cover verified/corrupt/invalid projections and 30-vs-90-day truth; PostgreSQL tests prove tenant/application/detail isolation, active creator-license tier projection, exact retention dates, and authenticated download without signer identity. Local full gate passed 394 configured tests (372 pass, 22 environment-gated skips), typecheck, production build, and diff check; hosted type/schema/PostgreSQL integrations, GitGuardian, and Vercel passed at exact head `c4cef7c`. The second commit fixes the remaining probabilistic invitation-token tamper test only; production invitation logic is unchanged.
- [x] **PRO-008** · Pro member and billing/usage view · deps: PLAN-WEB-007-012 · Support two seats, invitations, allowance bars, threshold warnings, payment/provider metadata, manual renewal, and no client-side-only enforcement under the Final V1 Cards-only prepaid contract. Commit(s): Web `0e48510` merged at PR #71 as `982b57d`; billing contract alignment `d4dd7f9`. `/members` provides server-side canonical seat admission, pending-invitation accounting, active member roles, owner-preserving role changes/removal, and read-only fallback for non-managers. `/billing` projects server-resolved plan/license/catalog state, numeric allowance bars plus explicit `unset`/`contracted` states, server-reconciled usage, persisted 80% threshold events, owner-only payment/refund/provider metadata, and a manual-renewal link to the server-owned Cards-only checkout. Legacy subscription rows are reconciliation-only; invoice metadata is not a tax-invoice/document product, and no provider URL or secret is stored. Focused commercial/payment suites pass 39/40 and 29/30 respectively with only explicit environment-gated skips; existing isolated Docker commercial-state/billing integration passed 7/7; typecheck/build/diff pass. Evidence: `docs/shipping/evidence/pro-008-final-v1-billing-view-2026-10-11.md`. Acceptance does not pass Gate 5, Hunt/AppSec, legal, protected release/rollback, or final acceptance.
- [x] **PRO-009** · 30-to-90-day history migration · deps: HOSTED-013, PLAN-WEB-001, OPS-011 · Enable 90 days only after storage migration/cost/retrieval gates; public truth stays 30 days until verified. Commit(s): Web `d4264bf`, `9e8c459`, `9f2900e`, `ee8b95c`, `6bb061d`, `f2ca7df` accepted at PR #72 merged as `50461d2`. Pure retention policy module `src/lib/history/pro-history.ts` — only Pro moves from the qualified 30-day hosted-record window to 90 days; other plans stay on 30 days; payload ceiling is finite and catalog-sized (300 records / 75 MiB logical payload for the 90-day window). Additive-only migration `0020_pro_history_retrieval.sql` adds time-ordered retrieval indexes on `score_history (license_id, scanned_at DESC)` and `record_receipts (organization_id, generated_at DESC, id DESC)` — rollback drops these indexes and restores 30-day application policy. Dashboard + account read paths respect the Pro 90-day window. PLAN-WEB-010 records-per-month enforcement gap closed at same time: `src/lib/organizations/record-receipt-usage.ts` provides atomic monthly receipt admission via reserve/commit/release against the PLAN-WEB-005/006 usage ledger (deterministic monthly identity `receipt-upload:<org>:<YYYY-MM>`; catalog-sized allowance; quota exhaustion + unset allowances fail closed without commit; ambiguous ledger states remain reserved instead of inventing success). Wired into `/api/v1/organizations/[organizationId]/projects/[projectId]/receipts` POST. **Production audit findings applied**: 9 of 10 existing customer score history rows already sit in the 31–90 day range so this activation preserves-in-place with no backfill; production is behind two migrations (0018 billing, 0019 invitations) — private tracker's earlier "0018 applied" claim was wrong; migrations 0018, 0019, 0020 must be applied in order before the 90-day window is customer-visible, and catalog activation guards prevent premature claim. 11 focused tests pass in ~630ms; typecheck clean; `pnpm db:check` and `pnpm db:migrations:check` verify 21 ordered migrations; hosted CI green at exact head `f2ca7df`.
- [x] **PRO-010** · current-customer regression/migration suite · deps: PRO-001-009 · Prove existing auth/license/activation/monitor/history users retain access and data through dual-read/cutover/rollback. Commit(s): Web `ad503a9` accepted at PR #73 merged as `3692d53`. `src/lib/history/customer-regression.ts` codifies the five-dimension acceptance surface (`auth_identity`, `active_license`, `monitor_registration`, `score_history`, `hosted_records`) as a pure discriminated-union decision on before/after snapshots. Identity drift on userId/clerkId/licenseId/non-cased email is fatal regardless of `requiredDimensions` carve — the caller cannot opt out of tenant safety. Widened retention window that surfaces previously-invisible score rows counts as `improved` (a feature of PRO-009, not a regression). No hosted records at either boundary → `not_applicable`. 17 focused tests exercise every outcome (unchanged / improved / regressed / not_applicable / identity_drift) across all five dimensions; hosted CI green at exact head `ad503a9`. The regression harness that reads live before/after snapshots and calls this module is a separate operational tool for the migration playbook.

## Epic 14 — Team organizations, shared policy, approvals, RBAC, CI, and work tracking

Evidence/problem: Team is a target plan with no current implementation. It must add organizational workflow rather than only higher quotas.

- [x] **TEAM-CLI-001** · organization policy fetch/cache · deps: PLAN-CLI-001, HOSTED policy APIs · Fetch signed versioned shared policy with tenant/repo binding, offline behavior, and visible digest. The implementation and hosted contract are complete: CLI PR #147 merged normally as `5bf7ae70`; Web SCM delivery fixes merged normally as PRs #216 (`e2fc3f9`), #217 (`358dc3c0`), and #218 (`390fd3f8`), preserving separate implementation and regression commits. The approved isolated Preview qualification proved mapped founder entitlement, signed exact-scope policy fetch, CLI remote/cache/offline/expiry/cross-tenant behavior, source-free provider admission/idempotency, and successful GitHub check delivery/reconciliation. Evidence: `docs/shipping/evidence/team-cli-001-hosted-cli-policy-provider-qualification-2026-10-19.md`, plus the preceding policy hardening and Preview provisioning packets above.
- [x] **TEAM-CLI-002** · CI approval/check payload · deps: TEAM-CLI-001, POLICY-009, RECORD-009 · Emit exact subject/decision/policy/record link for SCM check integration without uploading source. Commit(s): CLI `49f2116` accepted at PR #56 merged as `c17b335`; exact public merge `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a` wires `verglos ci --check-payload` and its required source-free inputs through the CLI. `@verglos/shared` validates a Release Decision and emits a deterministic source-free payload containing exact primary subject digest, decision, policy identity/digest, record-manifest digest, HTTPS record URL, and commit; malformed identities/unsafe URLs fail closed and identical payloads are no-op deliveries. The actual CLI command was rebuilt and executed successfully with the exact signed Preview policy digest; protected Preview SCM admission, delivery, idempotent replay, and GitHub read-back all passed. Evidence: `docs/shipping/evidence/team-cli-002-hosted-check-payload-provider-qualification-2026-10-19.md`, plus the preceding command-wiring evidence.
- [x] **TEAM-WEB-001** · organization creation/member lifecycle · deps: HOSTED-002, PLAN-WEB-009 · Invite/accept/remove/deactivate members with five-seat default, audited role changes, and secure token expiry. Commit(s): Web `07f86dd` on PR #60 merged as `b0e9f4a` (invitation-lifecycle pure substrate), plus Web `b7acc58`, `356822e`, `a81e6a0` on PR #61 merged as `b3c89d9` (migration + HTTP routes + tenant-scope audit). Migration `0019_organization_invitations.sql` adds the invitations table with FK to organizations/users, HMAC digest storage (never raw tokens), status/terminal check constraints, unique `(org, email)` where status=pending, unique `token_digest`. `POST /api/v1/organizations/[organizationId]/invitations` creates a pending invite gated on `manage_members` role and PLAN-WEB-009 `admitResourceCreation` seat admission; writes an `audit_events` row on success; returns 409 on duplicate pending email. `GET` lists pending invitations, tenant-scoped. `POST /api/v1/invitations/[token]/accept` is a public authenticated route that verifies the raw token against the HMAC digest lookup, requires the Clerk-authenticated user's email to match the invited email, transitions the invite → accepted, inserts an `organization_members` row with `onConflictDoNothing`, and writes an `audit_events` row. Idempotent replay returns the original outcome. Runtime env `VERGLOS_INVITATION_HMAC_KEY` (≥32 chars) fails-closed with 503 when missing. The existing `/members` route already handled remove/deactivate/role-change from HOSTED-002; the full invite/accept/remove/deactivate lifecycle is now on main with audit rows for `invitation.create` and `invitation.accept`. Tenant-scope audit updated to 12 protected routes / 22 methods. Hosted CI green at exact head `a81e6a0`.
- [x] **TEAM-WEB-002** · RBAC matrix/enforcement · deps: TEAM-WEB-001, PLAN-WEB-004 · Implement owner/admin/approver/member/viewer actions and complete negative tests. Commit(s): Web `9ff7e32` accepted at PR #62 merged as `d6b4ff8`. `src/lib/organizations/rbac-matrix.test.ts` closes the composed **role × action × plan × capability** matrix on top of the pre-existing `access.ts` role/action matrix (5 roles × 7 actions = 35 exhaustive cells in `access.test.ts`), HOSTED-012 negative-authorization suite (every protected HTTP method × non-member/role combination), and PLAN-WEB-004 composed authorization. Nine invariants proved: role denial short-circuits before capability evaluation so reason codes never leak plan detail; capability denial applies only after role admits; each plan exposes exactly its declared capability slice (no cross-plan leakage); free plan strictly denies studio-tier capabilities (`attest`, `verify_url`, `white_label_report`) even for owner role; enterprise+founder inherit the studio capability set; `project_not_found` forwards through composed authorization; suspended/inactive organizations deny every action for every role; every matrix cell is exercised with zero unreachable cells. Hosted CI green at exact head `9ff7e32`.
- [x] **TEAM-WEB-003** · shared policy versioning UI/API · deps: HOSTED-007, TEAM-WEB-002 · Draft/review/publish/rollback policies with immutable versions, diff, effective date, and audit. Commit(s): Web `ac59a1c` on PR #63 merged as `1cf8421` (pure decision substrate: POLICY_STATUSES, transitionPolicy, diffPolicy, digestPolicyDocument, verifyPolicyDigest, isValidPolicyVersion, planRollback; 11 focused tests); Web `8046057`, `dc887fa`, `0cc7eb1` accepted at PR #74 merged as `db17350`. Enhanced `POST /policies` verifies semver version, recomputes and verifies document digest, writes audit_events row `policy.create` with metadata; adds `review` status to the accepted enum. New `POST /policies/[policyId]/transitions` provides discriminated-union body: `{kind: "transition", next, effectiveFrom?}` moves through the state machine returning stable 409 reasons (`invalid_transition`, `invalid_effective_from`, `immutable_terminal`); `{kind: "rollback", targetPolicyId}` atomically reinstates a retired version as `published` and marks the currently-published one `retired` returning stable 409 reasons (`target_not_previously_published`, `target_is_current`, `policy_id_mismatch`). Every transition writes `policy.transition` or `policy.rollback` audit_events with metadata naming the from/to status. Same-origin CSRF check on POST. Tenant-scope audit updated to 16 protected routes / 26 methods. Hosted CI green at exact head `0cc7eb1`.
- [x] **TEAM-WEB-004** · shared baseline/exception register · deps: TEAM-WEB-003, POLICY-005-008 · Manage scoped baselines/exceptions with owner/expiry/control and no silent approval. Commit(s): Web `d5d15d4` accepted at PR #75 merged as `8393e5a`. `src/lib/organizations/exception-register.ts` ships two pure decision surfaces: `admitException` and `decideBaselineAcceptance`. Admission enforces bounded audit hygiene (owner ≤256, reason ≤4 KiB, per-control ≤512, ≤10 controls + ≤10 triggers), refuses empty controls/triggers ("an exception without a reversal condition is amnesty"), enforces well-formed time window (effectiveFrom < expiresAt, expiresAt > now, lifetime ≤ 365 days), enforces scope-kind XOR `subject`/`finding` never both never wildcard, and refuses `duplicate_active_scope` when an active same-scope exception overlaps the requested time so approvers cannot silently double-grant relief. Returns a stable canonical `sha256:` digest with sorted controls/triggers so re-submission is idempotent. Baseline decision enforces the "baselines never absolve newly-introduced risk" invariant: retired baselines never match, findings first observed after capture never inherit acceptance (`post_baseline_finding`), age-past-refresh-window flags `requiresRefresh` without blocking the match. 18 focused tests exercise every failure reason plus both scope kinds plus digest determinism plus all four baseline outcomes. HTTP route wiring lands with TEAM-WEB-005 approval queue. Hosted CI green at exact head `d5d15d4`.
- [x] **TEAM-WEB-005** · approval queue/release decision · deps: TEAM-WEB-002-004, HOSTED-004/007 · Authorized approvers review exact subject/policy/evidence and record immutable decision. Commit(s): Web `c90642e`, `31a0182`, `315ac16` accepted at PR #76 merged as `7ec5144`. `POST /api/v1/organizations/[organizationId]/projects/[projectId]/exceptions` guarded by `manage_policy` — fetches existing tenant-scoped exception rows, classifies active/expired by expiry timestamp, feeds into `admitException`, returns stable 409 for every register refusal reason, persists canonical `request_digest` for idempotent replay, writes `exception.draft` audit_events. `GET /exceptions` returns last 100 rows tenant-scoped. `POST /exceptions/[exceptionId]/decisions` guarded by `approve_release` (distinct from `manage_policy`) — refuses `self_approval_forbidden` when `requestedBy.userId === actor.userId` so a proposer cannot self-approve; approve sets `validUntil = expiresAt`, revoke sets `validUntil = now`; writes `exception.approve` or `exception.revoke` audit_events. Same-origin CSRF check on both POST routes; 32 KiB body cap on drafts, 8 KiB on decisions; zod discriminated-union scope (subject|finding). Tenant-scope audit updated to 18 protected routes / 29 methods with all 10 audit tests green. Hosted CI green at exact head `315ac16`.
- [x] **TEAM-WEB-006** · GitHub/GitLab check integration core · deps: TEAM-CLI-002, TEAM-WEB-005 · Verify webhooks/installations, post idempotent checks, handle retries, and bind commit/artifact identity. Commit(s): Web `b12c5c4` accepted at PR #129 merged as `b2352c6`; Web `27cd6c7` accepted at PR #130; Web `eadc5ac` accepted at PR #131; Web `049f8ba` accepted at PR #132; Web `06d90af` accepted at PR #133 merged as `510f66c`; Web `031200f` accepted at PR #134 merged as `5b52943`; Web `e65c61d` accepted at PR #135 merged as `80545aa`; Web `d1b57b8` accepted at PR #136 merged as `6714dd8`; Web `55ee4a8` + `6c163d9` accepted at PR #137 merged as `763aab0`; Preview delivery fixes merged normally through PRs #216–#218. Pure substrate validates bounded GitHub/GitLab installations, raw-body webhook authentication, tenant-bound commit/subject/artifact identity, redacted HTTPS check payloads, and digest-based idempotent update decisions; provider transport builds bounded GitHub Checks and GitLab commit-status requests, maps decisions to provider states, rejects malformed token/repository/commit inputs, and classifies retryable responses without exposing bodies. Additive migrations `0021`–`0023` persist encrypted installation/provider-token metadata, idempotent redacted deliveries, and fenced lease metadata; provider-token envelopes are nullable for existing installations and never projected. PR #133 adds provider-specific raw-body webhook intake (256 KiB cap, signature verification, strict minimal GitHub/GitLab payload, repository binding, idempotent redacted outbox trigger) plus a source-free delivery-worker transition contract with bounded exponential retry/max-attempt failure. PR #134 adds `FOR UPDATE SKIP LOCKED` due/reclaimable delivery claims and lease-fenced finish updates; stale workers cannot mutate reclaimed rows. PR #135 corrects explicit organization predicates on installation list/check lookups, closing a cross-tenant resolution boundary. PR #136 adds the provider delivery runner: composes only the redacted check request, delegates bounded transport, maps all exceptions to retryable status without persisting body/error text, and finishes only through the lease fence; lease loss is reported as non-success. PR #137 adds encrypted provider-token admission and an authenticated `/api/cron/scm` scheduler that decrypts only in memory, performs bounded fetches, honors Retry-After, and returns aggregate counts without credentials. Production migrations `0021`–`0023` applied successfully on 2026-10-06 after snapshot/restore rehearsal; post-apply migration count is 26. Focused SCM/provider/runner tests remain green, and the isolated Preview delivery/read-back completed successfully. GitLab was not live-qualified because no authorized installation is in scope; its adapter is code/test-qualified. Evidence: `docs/shipping/evidence/team-web-006-hosted-github-check-delivery-qualification-2026-10-19.md`.
- [x] **TEAM-WEB-007** · Jira/Linear work-item integration · deps: TEAM-WEB-002, HOSTED-005/009 · Explicitly connect, create/update owned tasks idempotently, redact evidence, and audit external links. Commit(s): Web `74de52c` accepted at PR #88 merged as `b55f434` (superseded PR #87 which was blocked by a GitGuardian false positive on a test fixture). `src/lib/organizations/work-item-integration.ts` codifies the provider-neutral tracker contract. `admitWorkItemConnection` supports jira (`*.atlassian.net`), linear (`linear.app`/`api.linear.app`), gitlab (`gitlab.com`/`*.gitlab.com`/`*.gitlab.*`) with strict host regex — refuses `base_url_wrong_provider_host` when a misconfigured tenant points a "Jira" connection at an attacker host. Refuses `token_hint_contains_full_token` (>12 chars) as defense in depth — a caller submitting the whole token as the "hint" is refused before it reaches storage. `emitWorkItemTask` refuses `connection_not_active` and `cross_tenant_finding`; deterministic external key `sha256(findingFingerprint).slice(0,16)` so repeat emissions produce the SAME key (caller upserts, never duplicates); redaction allowlist strips non-whitelisted fields from body and labels; always emits the finding fingerprint so trackers back-link but never raw source/secrets/paths; returns `bodyDigest` (sha256) for update deduplication. `decideWorkItemUpdate` returns `noop` when digest matches the stored one (no notification storm on rescan) and `update` when it differs. 15 focused tests exercise all three providers plus wrong-host refusal plus scheme refusal plus full-token detection plus deterministic external key plus redaction allowlist plus fingerprint back-link plus noop-on-match plus frozen surfaces. Persistence + provider client adapters (Jira REST, Linear GraphQL, GitLab REST) + bearer secret rotation land with follow-up PR. Hosted CI green at exact head `74de52c`.
- [x] **TEAM-WEB-008** · Team portfolio/history views · deps: TEAM-WEB-001-007 · Group releases by application/owner/decision, show 12-month history and policy adoption, with accessible filters. Commit(s): Web `dad1531` accepted at PR #98 merged as `4e7fb63`. `src/lib/organizations/team-portfolio.ts` composes the Team-tier portfolio projection: applications grouped by owner/decision with row states (ok / attention / blocked) and attention reasons (latest_release_blocked, latest_release_pending_review, latest_release_incomplete, N_exceptions_expiring, policy_outdated, policy_unpublished, owner_unassigned); aggregates include totalApplications, applicationsRequiringAttention, applicationsBlocked, release-weighted portfolioPassRate, policiesOutdated + policiesUnadopted (distinct counts). `composeHistoryWindow` filters to the 365-day sliding window with monthly buckets and per-decision counts; cross-tenant entries THROW rather than silent drop; future timestamps silently excluded. `classifyExceptionDeadline` returns active / approaching (≤14 days) / expired. Frozen `APPLICATION_ROW_STATES`, `RELEASE_DECISIONS`, `TEAM_HISTORY_WINDOW = 365`, `TEAM_APPROACHING_DEADLINE = 14`. Hosted CI green at exact head `dad1531`.
- [x] **TEAM-WEB-009** · organization signing workflow · deps: RECORD-006, TEAM-WEB-005 · Require organization identity/issuer policy and approved exact decision; keep producer and approver identities separate. Commit(s): Web `20bf3ec` accepted at PR #77 merged as `48f5dd3`. `src/lib/organizations/signing-workflow.ts` codifies the 3-role separation invariant from R-011: `decideOrganizationSigning` refuses `cross_tenant_decision`, `decision_not_approvable` (only PASS/REVIEW/BLOCK/INCOMPLETE are signable), `approver_missing` (signing an unapproved decision collapses roles), `producer_and_signer_conflict` (a producer cannot sign their own decision), `approver_and_signer_conflict` (an approver cannot sign the decision they approved), `no_active_identity` / `identity_wrong_tenant` / `identity_retired` / `identity_revoked`, and `identity_metadata_invalid`. On admission returns the binding metadata (subject digest, policy digest, decidedAt, three role IDs) the record carries when actual Sigstore signing runs. `pickActiveOrganizationIdentity` returns the sole active identity for a tenant or null on 0 or >1 matches — silence beats a wrong-identity signature. 15 focused tests exercise every refusal reason plus REVIEW/BLOCK/INCOMPLETE signability plus the identity picker's null-return contract. HTTP route wiring to `POST /records/[recordId]/signatures` deferred until CLI-side keyless flow is confirmed on live Fulcio/Rekor. Hosted CI green at exact head `20bf3ec`.
- [x] **TEAM-WEB-010** · Team end-to-end/authorization suite · deps: TEAM-WEB-001-009 · Prove invite -> shared policy -> CI -> exception -> approval -> organization record across roles and cross-tenant denial. Commit(s): Web `dad1531` accepted at PR #98 merged as `4e7fb63`. `src/lib/organizations/team-e2e.test.ts` composes every Team substrate: role×action matrix admits/denies via `canOrganizationAction`; inactive membership cannot exercise any action; policy publish→retire→rollback flow works and digest key-ordering is stable; exception admission + duplicate refusal + post-baseline finding refusal + deadline classifier; signing refuses `producer_and_signer_conflict` (producer cannot sign own decision) and `pickActiveOrganizationIdentity` returns null on 0/>1 matches; work-item connection admits Jira, emits deterministic external key across two emissions (idempotent upsert), refuses `cross_tenant_finding`; portfolio composes correctly across ok/attention/blocked rows with policy adoption drift; history window filters to 365d and throws on cross-tenant entries. Every Team substrate exercised at least once; green run proves the decision layers compose. Team epic (001, 002, 003, 004, 005, 007, 008, 009, 010) is complete on the substrate side; only TEAM-WEB-006 (GitHub/GitLab check integration) remains blocked on TEAM-CLI-002. Hosted CI green at exact head `dad1531`.

## Epic 15 — Studio client workspaces, branding, public verification, receipts, and portfolio

Evidence/problem: current Studio is a hypothesis and current attest summaries are not portable signed evidence. Studio earns its price through safe client separation and handoff workflow.

- [ ] **STUDIO-CLI-001** · client projection/upload workflow · deps: RECORD-011, PLAN-CLI-001 · Create explicit redacted/private projections, preview exactly what leaves, require upload approval, and bind client/workspace/record digests. Commit(s): CLI main `1fa878d` adds `record project-client`; PR #77 exact head `fdaec85` merged as `de92976` hardens it with an explicit safe-field allowlist, fixed limitation redaction, unknown/nested/private-field refusal, and approval binding to the exact canonical preview digest; Web PR #188 adds the current tenant/project-scoped hosted custody route and `0039_client_projection_custody` persistence, merged normally as `a94ff8e` with implementation `112d7a9` and access-audit test `877665e` preserved separately. Web commits `938dd7e` and `a3819c1` add the owner-authorized Preview-only numeric Studio fixture, exact-identity guard, workspace allowance path, hosted usage commit, and final clean Preview deployment `dpl_FZpAVi1Hbj8iQhpuyyvb9gUSucoe`; focused regression **27/27**, typecheck, diff check, and **49/49** static-page build passed. The Preview run created a workspace, uploaded/read back a safe projection, rejected `source: private` with `400`, rejected a cross-tenant read with `403`, and recorded an acknowledged synthetic handoff. The numeric non-production fixture is now evidenced, but the row remains unchecked pending independent customer/recipient acceptance and its hosted/audit artifact; no customer source, provider payment, Production entitlement, or AppSec result is fabricated. Evidence: `docs/shipping/evidence/studio-cli-001-hosted-custody-implementation-pr-2026-10-18.md`, `docs/shipping/evidence/studio-cli-001-hosted-recipient-qualification-2026-10-18.md`, `docs/shipping/evidence/studio-cli-001-preview-studio-fixture-2026-10-21.md`.
**STUDIO-CLI-001 current merged-head requalification addendum (2026-10-22; not a checkbox):** CLI `db3510356ecd6c6e430d7dcb3b9354e514d777ee` projection/approval/upload tests passed **15/15**; Web `02f5aba95c4172255cc522730c6ffecc1598cbda` projection, tenant, handoff, allowance, Preview, and Studio E2E contracts passed **107/107**. Keep the row open for approved numeric non-production allowance and independent authorized recipient/customer acceptance with hosted/audit evidence. Evidence: `docs/shipping/evidence/studio-cli-001-current-head-requalification-pr167-pr241-2026-10-22.md`.
- [x] **STUDIO-WEB-001** · client workspace model/API · deps: HOSTED-002-007, PLAN-WEB-010 · Create up to catalog limits with strict tenant/client isolation, roles, lifecycle, and audit. Commit(s): Web `483f1ae` accepted at PR #78 merged as `ab45740`. `src/lib/organizations/client-workspace.ts` codifies the Studio client workspace decision substrate. `admitClientWorkspace` rejects malformed name/slug, enforces slug uniqueness within the organization (never globally — two agencies may both have an "acme" workspace), refuses `allowance_unavailable` when the plan lookup returned null (never treat unknown as unlimited), and counts only active+suspended workspaces toward the ceiling; archived workspaces free their slug. `transitionClientWorkspace` enforces the lifecycle: active↔suspended, active/suspended→archived; archived is terminal. `checkClientBoundary` enforces the isolation invariant: refuses `cross_tenant` *before* checking client roles (enumeration defense), refuses `resource_not_in_client_scope` for agency-only rows, refuses `no_client_role` vs `role_missing_action` as independent conditions. Three client roles: `client_owner` ⊃ `client_editor` ⊃ `client_viewer` with actions view_client / publish_client_evidence / manage_client / manage_client_members. 18 focused tests exercise every failure reason plus role hierarchy plus cross-org uniqueness plus archived-frees-slug plus allowance boundary. HTTP route + migration wiring lands with STUDIO-WEB-002. Hosted CI green at exact head `483f1ae`.
- [x] **STUDIO-WEB-002** · client authorization/leakage suite · deps: STUDIO-WEB-001 · Test cross-client IDs, listings, search, exports, signed URLs, caches, errors, and public routes. Commit(s): Web `eb85dfb` accepted at PR #92 merged as `50d2043`. `src/lib/organizations/client-leakage.test.ts` provides 17 adversarial tests over the STUDIO-WEB-001/003/006 substrates covering: cross-tenant probes (must return `cross_tenant`, not `no_client_role`, to avoid leaking client-ID existence), cross-client probes within same tenant (must return `no_client_role`, not `role_missing_action`), `resource_not_in_client_scope` for agency-only rows, undocumented action strings refused via `role_missing_action`, role hierarchy strict superset invariant with evidence owner has actions editor doesn't, viewer cannot publish/manage, editor cannot manage members, slug enumeration side-channel (same-slug across agencies allowed, archived-in-same-org frees slug), archived-is-terminal (no active/suspended resurrection), branding refuses all 11 protected canonical field shadows, branding refuses `cross_client_boundary` BEFORE `protected_field_shadow` so cross-client actor cannot enumerate protected field set from error codes, handoff artifact digest hardened against URL smuggling, handoff lifetime capped at 90 days, full 3×4 role × action matrix exhausted. Substrate held up — no leaks found. HTTP-route adversarial suite (when routes land) is a separate acceptance gate. Hosted CI green at exact head `eb85dfb`.
- [x] **STUDIO-WEB-003** · canonical branding projection · deps: STUDIO-WEB-001, RECORD-011 · Apply agency/client logo/colors/domain only to presentation; canonical evidence, signer, policy, and limitations remain immutable. Commit(s): Web `8407b91` accepted at PR #79 merged as `a0a9b1f`. `src/lib/organizations/branding-projection.ts` codifies presentation-only branding. `composeBrandingProjection` refuses `cross_client_boundary` first (enumeration defense), then `protected_field_shadow` for any of the 11 protected canonical field names (subjectDigest, policyDigest, decision, signerIdentity, signerIssuer, coverage, limitations, signedAt, recordId, producerId, approverId), then bounded display name (≤128) and footer note (≤256, empty→null), then HTTPS-only URLs with `javascript:`/`data:`/`blob:`/`file:`/`vbscript:`/`http:` refused, loopback+RFC1918+link-local+IPv6 private ranges + bare IPv4/IPv6 literals refused, 2 KiB URL cap; strict `#rgb`/`#rrggbb` hex color only. Returns a stable canonical `sha256:` digest with lowercase hex color normalization for idempotent replay. `detectCanonicalShadow` is a runtime tripwire when composing branded + canonical views. 16 focused tests exercise every refusal reason plus all 11 protected canonical fields plus all 5 forbidden URL schemes plus IPv6 private range + bare-literal refusal plus digest determinism across color case. Persistence + `POST /client-workspaces/[id]/branding` route lands with STUDIO-WEB-004. Hosted CI green at exact head `8407b91`.
- [x] **STUDIO-WEB-004** · public verification publication controls · deps: VERIFY-WEB-002, STUDIO-WEB-002/003 · Explicit publish/unpublish, redaction preview, stable digest, rate limits, abuse controls, cache policy, and audit. Commit(s): Web `e49b5f8` accepted at PR #94 merged as `ca34ba0`. `src/lib/organizations/public-verify-controls.ts` codifies four decision surfaces. `composeRedactionPreview` returns a stable canonical digest over 11 allow-listed fields (subjectDigest/policyDigest/decision/signerIdentity/signerIssuer/signedAt/coverage/limitations/agencyLabel/clientLabel/brandingDigest); refuses `field_not_in_allowlist` (no raw source smuggling), `no_fields_declared`, `duplicate_field_declaration`. `admitPublish` requires owner initiation + preview_digest match; refuses `preview_digest_mismatch` (silent projection change between preview and publish caught), `already_published` (idempotent republish requires explicit unpublish first), admits both draft→published and unpublished→published (operator can restore after takedown). `admitUnpublish` owner-only from published state with bounded reason. `resolveCachePolicy` returns `public, max-age=300, s-maxage=300, stale-while-revalidate=60` for published records and `private, no-store` for draft AND unpublished — an unpublished record can NEVER linger in CDN cache after operator revocation. `admitRateLimit` at 60 req / 60 s per caller with automatic window rollover so a stale counter cannot lock out forever; returns retryAfterSeconds when exceeded. 18 focused tests exercise digest determinism ignoring non-declared fields, every refusal reason on all four surfaces, unpublished-blocks-cache invariant, rate window rollover, frozen surfaces + rate constants. Routes (POST /publish, POST /unpublish, GET /verify/[hash]) land with follow-up PR. Hosted CI green at exact head `e49b5f8`.
- [x] **STUDIO-WEB-005** · custom-domain verification · deps: STUDIO-WEB-004 · Verify domain ownership, TLS/routing state, safe host handling, canonical record identity, revocation, and fallback URL. Commit(s): Web `196be36` accepted at PR #95 merged as `e8a2e67`. `src/lib/organizations/custom-domain.ts` codifies five decision surfaces. Canonical record identity NEVER depends on the custom domain — same signed record verifies on verglos.com regardless of which host served the projection. `admitDomainRegistration` refuses `domain_reserved_platform` for verglos.com/*.verglos.com/vercel.app/pages.dev/github.io/amazonaws.com/etc, `domain_owned_by_other_tenant` (squatter preemption), `domain_already_registered_here`, `domain_invalid`; mints base64url challenge token + `sha256:` expected TXT digest. `admitDomainVerification` requires `pending` state; refuses `challenge_expired` past 30d TTL, `no_txt_records`, `txt_record_mismatch`. `admitDomainActivation` requires owner + verified + TLS.issued; distinguishes `tls_failed` from `tls_not_issued`/`provisioning`/`renewing`. `admitDomainRevocation` owner-only from any non-revoked state. `canonicalVerifyUrl` throws on invalid publicHash shape (no path-traversal). `resolveVerifyUrl` returns custom URL ONLY when domain.active AND (TLS.issued OR TLS.renewing) — renewing safe because cert still valid until swap; all other combos fall back to `verify.verglos.com` so a broken custom domain NEVER leaves a verify link broken. 25 focused tests exercise every refusal reason plus TXT record digest verification plus TLS × domain state matrix for URL resolution plus renewing-treated-safe plus path-traversal refusal plus frozen state surfaces. Persistence + `/orgs/[id]/domains/*` routes + Vercel/Let's Encrypt TLS integration land with follow-up PR. Hosted CI green at exact head `196be36`.
- [x] **STUDIO-WEB-006** · handoff receipt model/workflow · deps: STUDIO-WEB-001/004 · Record exact delivered artifact, recipient acknowledgement, timestamp, privacy-safe identity, status, and immutable audit without implying acceptance of security perfection. Commit(s): Web `48e04d5` accepted at PR #89 merged as `01b85d1`. `src/lib/organizations/handoff-receipt.ts` codifies three decision surfaces. `admitHandoffIssuance` enforces bounded audit hygiene (agency ≤128, client ≤128, email ≤254, artifact label ≤256, message ≤2 KiB), `artifact_digest_invalid` for anything other than `sha256:hex`, `expiry_in_past` when expiresAt ≤ issuedAt, `lifetime_exceeds_ceiling` past 90 days (receipts do not stay 'issued' forever); returns stable canonical `issuanceDigest` for duplicate detection. `admitHandoffAcknowledge` refuses `handoff_already_acknowledged` (replay cannot re-ack), `handoff_revoked`, `handoff_expired`, `ack_token_mismatch` on tampered/out-of-window tokens, `recipient_mismatch` (case-insensitive email comparison). `admitHandoffRevoke` only the issuing agency may revoke — refuses `cross_tenant_revoke`, `actor_not_authorized`, and critically `already_terminal` (revocation cannot erase a client's earlier receipt). `validateAckTokenShape` for base64url 32–64 char window; `HANDOFF_TOKEN_BYTE_LENGTH = 32` constant. 21 focused tests exercise every refusal reason for all three surfaces plus digest determinism plus token shape boundaries plus frozen state surface. Persistence + `POST /orgs/[id]/clients/[cid]/handoffs` + public `POST /handoffs/[token]/acknowledge` routes land with STUDIO-WEB-004. Hosted CI green at exact head `48e04d5`.
- [x] **STUDIO-WEB-007** · client portfolio dashboard · deps: STUDIO-WEB-001-006 · Show decisions, coverage gaps, expiring exceptions, handoffs, allowance, and owners across clients with safe aggregation. Commit(s): Web `5c9c4d9` accepted at PR #93 merged as `1757f30`. `src/lib/organizations/client-portfolio.ts` codifies the pure portfolio projection. `composeClientPortfolio` throws when any input row's organizationId differs from actor (never silent drop — that would mask an isolation bug) and silently omits clients the actor has no role on (never leaks a peer client's aggregates via totals). Row classification: blocked (severity 2) for suspended workspace OR BLOCK release; attention (severity 1) for REVIEW/INCOMPLETE release, expiring exceptions, handoff backlog (≥5 pending), monitored apps at ≥80% ceiling; ok otherwise. Returns per-row attention reasons + aggregate totals: active/suspended/archived client counts, pending handoffs, expiring exceptions, monitored apps used/ceiling, clients requiring attention, clients blocked. Frozen `PORTFOLIO_ROW_STATES`. 13 focused tests exercise cross-tenant throw, cross-client silent omit, all classification triggers, blocked-over-attention priority, aggregate accuracy across mixed status/severity fixture, frozen row-state surface. `/orgs/[slug]/portfolio` page + `GET /orgs/[id]/portfolio` route + PostgreSQL aggregation query land with follow-up PR. Hosted CI green at exact head `5c9c4d9`.
- [x] **STUDIO-WEB-008** · three-year retention/export · deps: OPS-011/014, PLAN-WEB-010 · Enforce retention, legal/contract holds, bulk export, deletion, and customer-held independent verification. Commit(s): Web `d7fed1d` accepted at PR #90 merged as `bb600cf`. `src/lib/organizations/studio-retention-export.ts` codifies Studio-tier retention + hold + bulk export decisions. `decideStudioRetention` clamps contracted retention at the 3-year (1095-day) ceiling (mis-configured catalog cannot extend past tier), keeps rows under any active hold (legal/contract/customer_deletion_request), warns 14 days before effective expiry (wider than Pro's 7-day window). `admitHold` refuses `customer_deletion_requires_finite_expiry` — deletion requests must resolve since silence is indistinguishable from ignoring; legal + contract holds may be indefinite. `admitBulkExport` refuses `not_owner_initiated`, `legal_hold_blocks_export` (bulk export cannot circumvent an active legal hold), `cross_tenant_cursor`, `cross_scope_cursor` (drift on clientWorkspaceId OR resourceKind mid-session), `page_size_out_of_range` outside [1, 500]. **Contract holds do NOT block export** — they govern retention only. `admitExportCursorEnvelope` validates base64url.base64url shape. Frozen `HOLD_KINDS`, `STUDIO_RESOURCE_KINDS`, and `STUDIO_RETENTION_CEILING = 1095`. 22 focused tests exercise every refusal reason plus all 3 hold kinds plus indefinite legal hold plus ceiling clamp plus 14-day warn boundary plus contract-hold export bypass plus cross-scope cursor drift on both dimensions. Persistence + `POST /orgs/[id]/holds` + `GET /orgs/[id]/exports` routes land with follow-up when Studio-tier is provisioned. Hosted CI green at exact head `d7fed1d`.
- [x] **STUDIO-WEB-009** · Studio billing/allowance flows · deps: PLAN-WEB-006-012, STUDIO-WEB-001 · Enforce 10 seats/20 clients/100 apps/2,000 records/3 years from catalog with explicit overage/upgrade. Commit(s): Web `ec18d17` accepted at PR #91 merged as `f6c3cea`. `src/lib/organizations/studio-allowance.ts` codifies three decision surfaces. `admitStudioAllowance` refuses `allowance_unavailable` (null catalog — never treat unknown as unlimited), `contract_override_below_default` (caller cannot silently ratchet the Studio contract BELOW tier defaults), `override_negative_or_infinite`, `invalid_usage_negative`, `allowance_exhausted`; reports `remaining` count + `warnThresholdCrossed` at ≥80% of effective ceiling. `admitStudioOverage` — Studio records overage requires explicit owner consent + explicit cap ≥ ceiling; refuses `no_owner_consent`, `overage_cap_below_ceiling`, `usage_below_ceiling`, `usage_exceeds_cap`; returns `allowedOverage` + `billableUnits`. `admitDowngrade` — refuses `target_plan_missing_client_workspaces` when target doesn't offer clients but tenant has any; refuses `over_target_ceiling` with `overCeilings` list naming every over dimension (downgrade must be preceded by explicit customer cleanup, substrate refuses rather than silently deleting data). Frozen `STUDIO_DEFAULTS = {seats: 10, clientWorkspaces: 20, monitoredApplications: 100, recordsPerMonth: 2000, retentionDays: 1095}`. 18 focused tests exercise every refusal reason plus warn boundary at 80% plus overage billable-units math plus multi-dimensional downgrade reporting plus frozen surface values. `/orgs/[id]/plan/change` route + Razorpay lifecycle wiring depend on PLAN-WEB-011/012 (open behind INR pricing + live gateway evidence). Hosted CI green at exact head `ec18d17`.
- [x] **STUDIO-WEB-010** · Studio end-to-end acceptance suite · deps: STUDIO-WEB-001-009 · Prove two isolated clients, branded redacted public verification, private evidence denial, handoff receipt, account deletion, and offline record validity. Commit(s): Web `308460c` accepted at PR #96 merged as `384b195`. `src/lib/organizations/studio-e2e.test.ts` composes every Studio substrate (001–009) in a 20-scenario end-to-end run: two isolated clients under 20-workspace ceiling; client boundary (editor on Acme cannot view Zenith); cross-tenant probe refused with `cross_tenant` not `no_client_role` (enumeration hardening); branding cannot smuggle `signerIdentity` (protected_field_shadow); valid branding composes stable digest; publish→unpublish→republish flow with preview digest binding; cache policy immediately private on unpublish; custom domain full lifecycle (registration → TXT match → TLS → activation → URL resolution → TLS-fail fallback); handoff issue → acknowledge → revoke-of-acknowledged refused (already_terminal); allowance exhausted at 100%; warn banner at 80%; overage requires owner consent with billable-units math; downgrade to Pro refused (missing client workspaces); legal hold blocks bulk export but contract hold allows it; customer deletion hold requires finite expiry; retention clamps at 3-year ceiling regardless of over-configured contract; portfolio composition throws on cross-tenant row (never silent drop); offline record verification independent of hosted state; role hierarchy owner ⊃ editor; 11 protected canonical fields locked (regression guard). Every substrate exercised at least once; green run proves the decision layers compose correctly. Full Studio-tier acceptance still requires HTTP-route wiring + PLAN-WEB-011/012 live pricing/gateway + a real customer scenario through the composed HTTP surface. Hosted CI green at exact head `308460c`.

## Epic 16 — Enterprise contract surfaces

Evidence/problem: Enterprise features are hypotheses and must remain contract-led. Build reusable safe contract surfaces; do not invent customer-specific integrations or deploy private infrastructure without authorization.

- [ ] **ENT-CLI-001** · private runner protocol/client · deps: ENGINE/HUNT/RECORD, PLAN-CLI-001 · Outbound poll only, signed short-lived jobs, target allowlist, replay protection, least-evidence result projection, and no general remote shell. Commit(s): CLI `723f655` + `68772d7` on PR #78, merged to `main` as `dc4c1db`, add canonical Ed25519 job verification, GET-only polling, tenant/runner/target binding, bounded mode-0600 job/nonce replay state, fail-closed malformed-job handling, and source-free admission output; Web PR #158 merged as `d5c91df` adds tenant-scoped enrollment, signed short-lived job issuance/polling, source-free result reconciliation, and additive migration `0037`; CLI PR #81 merged as `111d3aa` adds bounded `runner upload-result`; Web PR #159 merged as `2b3f379` fixes first-poll runner activation and completed-result replay idempotency, and adds a real route/database lifecycle qualification (1/1) on fresh PostgreSQL plus hosted Verify coverage; Web PR #160 merged as `4cc1f5d` adds organization/job uniqueness fencing and concurrent replay reconciliation, with fresh PostgreSQL E2E 1/1. Current CLI merge `50bcab42` requalification passes shared **457/457**, CLI **291/293** with **2 explicit skips / 0 failures**, focused runner protocol **5/5 + 7/7**, workspace build **8/8**, typecheck **14/14**, and diff check. Remains unchecked pending operational enrollment credential exchange, approved runner execution/result reconciliation, cross-platform operational evidence, independent review, and enterprise acceptance. Evidence: `docs/shipping/evidence/ent-cli-001-current-merge-requalification-2026-10-18.md` plus prior private-runner packets.
- **ENT-CLI-001 route-binding hardening addendum (2026-10-19):** Implementation `0d8f2c94` and regression `1ce91a1a` in PR #153 preserve separate granular commits. The original client now reconstructs the exact tenant/runner poll route and fixed result-upload route; same-origin route overrides fail before credentials or network use. Focused private-runner tests pass **9/9**, forced workspace build passes **8/8**, and the existing CLI baseline remains **291/293 with 2 explicit Hunt A2 skips and 0 failures**. This advances the implementation boundary only; the row remains unchecked for operational enrollment/execution/reconciliation, cross-platform evidence, independent review, and enterprise acceptance. Evidence: `docs/shipping/evidence/ent-cli-001-private-runner-route-binding-2026-10-19.md`.
**ENT-CLI-001 operational evidence addendum (2026-10-18; not a checkbox):** The exact Web source commit `25adc4abb5a7d989c8349eb7a288f7011143f5b7` was deployed to an isolated READY Preview. A fresh synthetic license validated; organization creation, one-time runner enrollment, outbound activation poll, bounded signed-job issue/claim, local Ed25519 verification, source-free result upload, exact replay idempotency, and final empty poll passed. Unallowlisted enrollment, out-of-runner-scope job, and malformed result requests failed closed. This is operational evidence only; cross-platform operational evidence, independent review, and authorized enterprise acceptance remain open. Evidence: `docs/shipping/evidence/ent-cli-001-hosted-runner-qualification-2026-10-18.md`.

**ENT-CLI-001 current Preview runner qualification addendum (2026-10-21; not a checkbox):** Clean Web source `a3819c1` reached Ready as Preview deployment `dpl_ETFtQmHWA9m5EL77n4rDBX254icz` with **49/49** static pages. An owner-controlled synthetic runner completed enrollment, one-time credential redemption, activation poll, bounded tenant/runner/target-bound job delivery, source-free result upload, exact replay idempotency, malformed-result refusal, cross-tenant refusal, and final empty poll. The result digest was `sha256:0e101c9809e69c6bba0a501ec41a3131016206a443a4ce7fb0ab4fee34cc8eab`; raw credentials and source/customer data were not recorded. This advances deployed operational evidence only. Keep `ENT-CLI-001` unchecked pending authorized enterprise acceptance, complete cross-platform operational acceptance, and independent runner/Hunt isolation review. Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence: `docs/shipping/evidence/ent-cli-001-hosted-runner-qualification-2026-10-21.md`.

- [x] **ENT-CLI-002** · KMS/HSM signing adapter contract · deps: RECORD-006-009 · Provider-neutral interface, explicit key/issuer policy, non-exportable key assumptions, rotation/revocation, and fixture adapter. Accepted at CLI PR #38 head `55a052ac71868e1be166b570ea8a2c4359ef61d0` (`ed0a872`, `55a052a`): policy-bound Ed25519 provider contract and fixture adapter; active-only signing, retired-key verification within policy validity, revocation rejection, signer/issuer/key-id/signed-at cryptographic binding, exportable production key rejection, and provider-error redaction. Focused signing tests 8/8, uncached CLI/shared graph 18/18 Turbo tasks, package/public-boundary checks pass; exact-head self-scan and all nine platform/runtime CI cells pass. Contract only; no production KMS/HSM adapter or custody/rotation drill is claimed. R-011 remains open.
- [x] **ENT-WEB-001** · SSO organization contract · deps: TEAM-WEB-001/002 · Add provider-neutral domain/connection/session policy model behind contract status; actual provider activation requires buyer/credentials. Commit(s): Web `77887f6` accepted at PR #80 merged as `79929f3`. `src/lib/organizations/sso-contract.ts` provides the provider-neutral substrate. `admitSsoConnection` for OIDC (issuer+jwksUrl+audience) and SAML (issuer+acsUrl+certDigest) with URL hardening (HTTPS only, no `javascript:/data:/blob:/file:/vbscript:/http:`, no loopback/RFC1918/link-local/IPv6-private/bare-IP hosts, 2 KiB cap) and cert digest regex `(sha256|sha384|sha512:)?[hex]{40,128}` normalized to lowercase. `admitSsoDomains` for 1–8 FQDNs deduped + normalized + refused when squatted by another tenant (`domain_owned_by_other_tenant`). `admitSsoSession` per-request admission refuses `contract_pending`/`contract_suspended`/`no_connection`/`issuer_mismatch`/`audience_mismatch` (OIDC only)/`email_invalid`/`email_domain_not_covered`. `transitionSsoContract` enforces the legal lifecycle (pending→active, active↔suspended) and refuses `activate_requires_connection` / `activate_requires_domain` so an empty contract cannot flip active. 24 focused tests exercise every refusal reason plus OIDC+SAML branches plus IPv6/IP-literal hardening plus domain normalization plus lifecycle activation invariants plus frozen surfaces. Persistence + `POST /organizations/[id]/sso/*` routes + provider adapters (Clerk, WorkOS, Okta) come with follow-up PRs. Hosted CI green at exact head `77887f6`.
- [x] **ENT-WEB-002** · SCIM lifecycle contract/API · deps: ENT-WEB-001 · Idempotent provision/update/deactivate, bearer-secret rotation, group/role mapping, audit, and negative tests. Commit(s): Web `e361e68` accepted at PR #81 merged as `6c11f6a`. `src/lib/organizations/scim-lifecycle.ts` provides three admission surfaces. `admitScimUserProvision` — bounded externalId/email/display/attributes, refuses `email_domain_not_covered` when outside SSO contract's admitted list (SCIM cannot provision users under a domain the tenant hasn't proven ownership of), reports `isUpdate: true` when externalId exists so callers do idempotent upserts. `admitScimUserDeactivation` — refuses `cannot_deactivate_sole_owner` so an IdP group change cannot silently orphan the organization; a founder-level rescue path is required first. `admitScimGroupSync` — refuses `group_not_mapped` (silence beats a wrong role assignment; unmapped IdP groups never grant access) and `cannot_assign_owner_via_scim` (owner stays a founder-appointed action outside SCIM); partitions member externalIds into known + unknown so the caller re-provisions new-to-tenant users through `admitScimUserProvision`. `SCIM_TARGET_ROLES` = `viewer/member/approver/admin` — `owner` deliberately excluded. 16 focused tests exercise every refusal reason plus isUpdate detection plus sole-owner refusal plus known/unknown member partitioning plus frozen-role-surface owner exclusion. Persistence + `/scim/v2/Users` and `/scim/v2/Groups` routes + bearer secret rotation land with a follow-up adapter PR. Hosted CI green at exact head `e361e68`.
- [x] **ENT-WEB-003** · private runner enrollment/job API · deps: ENT-CLI-001, HOSTED-009/010 · One-time enrollment, local keys, signed leases, outbound polling, expiry/cancel, scoped result upload, and audit. Commit(s): Web `574c56d` accepted at PR #85 merged as `9b3274a`. `src/lib/organizations/private-runner.ts` codifies four decision surfaces for outbound-only private runners. `admitRunnerEnrollment` refuses `runner_name_duplicate` per tenant, `target_not_in_allowlist` for any target outside the tenant's approved patterns, `no_targets_requested` (a runner with an empty scope has no purpose). `admitLeaseGrant` refuses `runner_not_active`/`quarantined`/`revoked` (suspended runners never receive new work), `too_many_active_leases` past 8-lease per-runner ceiling, `target_not_in_runner_scope` (lease cannot exceed enrolled scope), `duration_out_of_range` outside 30s–1800s hard bounds, `too_many_targets` past 32. `admitResultUpload` refuses `lease_expired`/`lease_cross_runner`/`lease_cross_tenant` (a runner cannot smuggle results through another runner's or tenant's lease), `lease_not_in_progress`, `results_outside_lease_scope` (submission targets confined to granted lease). `decideRunnerHeartbeat` three-tier health (active <5min / warn 5–15min / offline ≥15min); clock-drift future timestamps clamp to 0s. 19 focused tests exercise every refusal reason plus concurrency ceiling plus duration boundary plus cross-runner + cross-tenant smuggling refusal plus heartbeat clock-drift plus frozen state surfaces. Persistence + enrollment-token HMAC issuance + outbound-poll HTTP endpoints land with follow-up PR once ENT-CLI-001 protocol client is available. Hosted CI green at exact head `574c56d`.
- [x] **ENT-WEB-004** · enterprise trust/KMS policy · deps: ENT-CLI-002, TEAM-WEB-009 · Store only references/policy, validate signer roots/issuers, rotate/revoke, and separate producer/approver/witness identities. Commit(s): Web `1ea6fbe` accepted at PR #82 merged as `5cf4e94`. `src/lib/organizations/kms-trust-policy.ts` codifies four decision surfaces. `admitIssuerRoot` pins enterprise Fulcio/Rekor URLs + sha256 root cert digest (normalized to `sha256:<lowercase>`), refuses non-HTTPS/private-host URLs, refuses non-hex or wrong-length digests. `admitKmsKey` enforces provider↔keyRef prefix contract (aws_kms → `arn:aws:kms:*`, gcp_kms → `projects/*`, azure_kv → strict `*.vault.azure.net/keys/*` regex, yubihsm → `yubihsm://*`) plus algorithm compatibility (YubiHSM refuses RSA-PSS-2048). `decideEnterpriseRoles` extends TEAM-WEB-009's producer/approver/signer with an additional witness role; any two-role collapse is fatal (`producer_and_approver_conflict`, `producer_and_witness_conflict`, `approver_and_witness_conflict`). `transitionKey` refuses `retire_requires_replacement` if no other active key exists so an org is never left signerless; revocation always admitted (breach is time-critical); `revoked` is terminal. 18 focused tests exercise every refusal reason plus all four KMS providers plus 3-role separation plus retire-requires-replacement invariant plus frozen surfaces. Persistence + provider adapters (AWS SDK, GCP client, Azure Identity, YubiHSM connector) land with a follow-up PR. Hosted CI green at exact head `1ea6fbe`.
- [x] **ENT-WEB-005** · private verifier deployment contract · deps: VERIFY-WEB-002 · Package/configure verifier for customer boundary with offline trust materials and no dependency on public verification. Commit(s): Web `bac3b27` accepted at PR #86 merged as `8b8fdaf`. `src/lib/organizations/private-verifier.ts` codifies the private verifier trust-bundle contract. `composePrivateVerifierBundle` supports three deployment modes (airgapped / networked_offline / networked_online) with mode-specific revocation-endpoint invariants: airgapped forbids URL (`revocation_endpoint_forbidden_for_airgapped`), networked_online requires it (`revocation_endpoint_required_for_networked_online`), and refuses `revocation_endpoint_public` for `rekor.sigstore.dev`/`fulcio.sigstore.dev` (defeats 'private'). Also refuses `no_trust_roots`, `duplicate_trust_root` (issuer collision), `version_invalid` (non-semver), `validity_out_of_range` (below 30d or above 365d). Returns stable `sha256:` bundle digest. `decideLocalVerification` is the per-record decision the deployed verifier runs: refuses `bundle_expired`, `bundle_tenant_mismatch`, `record_tenant_mismatch` (private verifier NEVER accepts foreign-tenant records — defeats the trust bundle), `record_issuer_not_in_bundle`, `record_signed_before_bundle` (bundle can't have observed a signing chain from before its issuance). 17 focused tests cover digest determinism, all refusal reasons for both surfaces, all three deployment mode invariants, public-Rekor rejection, frozen deployment mode surface. Signed verifier binary release stays under `verglos-cli` release engineering. Hosted CI green at exact head `bac3b27`.
- [x] **ENT-WEB-006** · complete audit export · deps: HOSTED-009, TEAM/Studio events · Stream signed/hashed tenant events with cursor, retention, redaction, SIEM-friendly format, and authorization tests. Commit(s): Web `b0ad451` accepted at PR #84 merged as `c928388`. `src/lib/organizations/audit-export.ts` codifies cursor-paginated, chained-hash SIEM streaming. `emitAuditExportPage` returns pages carrying `previousPageDigest = sha256(prev canonical body)` with `sha256:0…0` sentinel on page 0; refuses `cross_tenant_cursor` on cursor replay OR event tenant mismatch, `event_expired` when an event is older than the retention ceiling (export cannot resurrect deleted data), `page_size_out_of_range` outside 1–500, `too_many_redacted_paths` past 64 entries. Redaction runs BEFORE the pageDigest covers the payload so a smuggled secret cannot be resigned back in. Canonical stringify sorts keys so digest is stable across metadata key ordering. Auto-terminates with `nextCursor: null` when the page isn't full. `admitCursorEnvelope` validates the bounded `base64url(json).base64url(hmac256)` opaque envelope shape. 13 focused tests cover sentinel + two-page chain + cross-tenant refusal (2 paths) + expiry + redaction affecting digest + key-ordering stability + envelope validation. Persistence + `GET /organizations/[id]/audit/export?cursor=...` route + HMAC cursor signing land with follow-up PR. Hosted CI green at exact head `b0ad451`.
- [x] **ENT-WEB-007** · residency/retention/egress controls · deps: HOSTED-006/010, OPS-011 · Enforce configured data region/projection/retention at ingestion and runner return; do not claim unsupported regions. Commit(s): Web `03accd5` accepted at PR #83 merged as `130603a`. `src/lib/organizations/residency-egress.ts` provides four decision surfaces. `admitIngestionResidency` refuses `region_mismatch` when the ingestor's actual region differs from the tenant's configured region; never silently places a row in the wrong region. `decideRetention` three-outcome discriminated union (keep/warn/delete): legal hold overrides everything, rows younger than floor always kept, effective retention = `contractedOverrideDays ?? ceiling` clamped to ceiling, warn 7 days before expiry with `daysRemaining`. `admitRetentionOverride` refuses `below_floor` (customer cannot ratchet below tier floor), `below_absolute_minimum` (hard 30d), `exceeds_absolute_ceiling` (hard 10yr), `not_positive`. `admitEgress` four purposes with distinct requirements (siem_export → signed_cursor, private_verifier → mtls_pin, customer_download → owner_context, runner_return → enrollment); cross-region egress refused except for owner-initiated `customer_download` (intended export path). 23 focused tests exercise every refusal reason plus legal-hold override plus warn-boundary plus ceiling clamp plus owner-download exception plus frozen surfaces. Wiring into ingestion path + retention worker + egress adapters lands with follow-up PRs when multi-region infrastructure is provisioned. Hosted CI green at exact head `03accd5`.
- [x] **ENT-WEB-008** · enterprise readiness suite · deps: ENT-WEB-001-007 · Test lifecycle, runner replay/isolation, key revocation, offboarding, audit completeness, export, disaster recovery hooks, and contract feature flags. Commit(s): Web `2b0a3d8` accepted at PR #97 merged as `6ce2a2d`. `src/lib/organizations/enterprise-e2e.test.ts` composes every ENT-WEB substrate (001-007) in a 21-scenario end-to-end run: SSO onboarding + session admission + domain refusal; SCIM user provision + sole-owner deactivation refusal + owner-via-SCIM escalation refusal; runner enrollment + lease grant + out-of-scope result upload refusal + heartbeat classification; KMS issuer root pinning + provider-specific key admission + 3-role separation + retire-without-replacement refusal; region_mismatch refusal + retention override clamps + legal-hold-overrides-retention + warn window + SIEM/runner_return/customer_download egress rules; audit export sentinel + cross-tenant cursor refusal; private verifier airgapped bundle compose + cross-tenant record refusal. Cross-substrate binding: SSO domain admission → SCIM user provision compose; sha256 canonical form used across KMS + audit body. Full enterprise-tier acceptance still requires HTTP-route wiring + per-customer provider adapter integration (Okta/Azure AD/AWS KMS/GCP KMS/Vercel TLS/etc.) + live deployment run + independent audit review. Hosted CI green at exact head `2b0a3d8`.

## Epic 17 — Cross-platform packaging, trusted publishing, provenance, licenses, notices, and release automation

Evidence/problem: security tooling must ship through a trustworthy, reproducible, legally compliant path. Existing repo has Apache license but no complete SBOM/notices/release qualification system.

- [x] **LIC-001** · dependency license classifier · deps: TRUTH-006 · Generate direct/transitive package inventory with declared/detected license, source, redistribution class, notice obligation, and review blockers. Commit(s): `338ed67`, `9aa583d`, `4e828b9`, `6bd558b`, `4435964` (complete: all 180 lockfile package versions plus the discovered nested `benchmark@1.0.0` component are represented with source/license/classification/notice fields; missing lock metadata fails closed; one ISC/BSD-3-Clause conflict is explicitly surfaced as a review blocker, not resolved or waived; inventory and platform CI passed)
- [x] **LIC-002** · external engine/content license records · deps: TRUTH-005/006, ENGINE-002 · Record Trivy/detect-secrets/fixtures/standards tooling and separately delivered premium rule/recipe licenses, provenance, modification, and trademark language. Commit(s): Private record `docs/shipping/legal/external-engines-and-standards-2026-10-03.md` records the pinned Trivy image/release and Apache license/NOTICE sources, detect-secrets as an unbundled operator executable, Sigstore package/fixture provenance and digests, in-toto software/docs/spec license split, standards non-vendoring rule, and unresolved redistribution/trademark/reviewer restrictions; the current exact-source provenance rechecks map all seven automated blockers to tagged upstream URLs and verify the previously unverified `minipass-flush` license source; the authorized owner/company disposition `docs/shipping/legal/legal-company-decision-2026-10-18.md` records per-area conditions, scope, exclusions, attribution, trademark treatment, and re-review triggers. The exact non-published package/source boundary is approved with conditions. LIC-003, distribution, trusted publication, premium recipe distribution, independent AppSec review, provider, customer, and final acceptance remain separate open rows. Evidence: `docs/shipping/evidence/lic-002-upstream-source-provenance-2026-10-14.md`, `docs/shipping/evidence/lic-002-upstream-exact-source-recheck-2026-10-18.md`, `docs/shipping/legal/legal-company-decision-2026-10-18.md`.
- [x] **LIC-003** · generated `THIRD_PARTY_NOTICES` · deps: LIC-001/002 · Produce deterministic human-readable notices retaining applicable LICENSE/NOTICE text and upstream identity without implying endorsement. Commit(s): `9a1dad4`, `4435964`, public PR #126 merged as `f1cd8269` with implementation `b9541157` and regression test `575275d8`; the generator now falls back to installed virtual-store manifests when the pnpm global license index is unavailable. The exact current package surface passes the combined notice/inventory/package/release contract suite 18/18, produces a deterministic 393,143-byte notice, and preserves all seven review blockers without suppression. LIC-002 company conditions are recorded; this row closes its notice contract only and does not authorize publication. Evidence: `docs/shipping/evidence/lic-003-dist-001-public-pr126-2026-10-14.md`, `docs/shipping/evidence/lic-003-notice-qualification-2026-10-18.md`.
- [x] **LIC-004** · dependency SBOM · deps: LIC-001 · Generate CycloneDX/SPDX SBOMs for released npm package/workspace with reproducible metadata and CI drift check. Commit(s): `d48b5b5`, `b95f840`, `9aa583d`, `6bd558b`, `4435964` (complete: deterministic CycloneDX 1.5 and SPDX 2.3 outputs cover all 180 lock versions plus the bundled component; fixed metadata makes outputs reproducible; generator tests and CI drift checks pass; SPDX conclusions remain `NOASSERTION`, not legal opinions)
- [x] **LIC-005** · contributor ownership policy · deps: TRUTH-005 · Accepted at CLI PR #41 head: `CONTRIBUTING.md` at CLI repo root adopts the standard Developer Certificate of Origin 1.1 as the operative contributor agreement, with a documented CLA fallback for future material employer-owned contributions. Contributions inherit the file's license (Apache-2.0 for public packages, per-package license for private beta). Copyright stays with the contributor; perpetual worldwide non-exclusive royalty-free license granted to Top Notchh Solutions and downstream users. DCO sign-off required on every commit. AI-attribution rule reaffirmed (no AI co-author lines). Trademarks reserved. Security disclosure email declared. Full CLI monorepo `pnpm exec turbo run test typecheck build --force` 23/23 tasks pass. All 10 platform-matrix cells green on exact head. Commit(s): CONTRIBUTING commit on `feat/cli-lic-005-contributor-dco`.
- **ENT-CLI-001 current-head requalification addendum (2026-10-22):** Exact merged CLI `db351035` and Web `02f5aba` private-runner surfaces passed shared **460/460**, CLI **311/313** with 2 documented skips and 0 failures, Web focused private-runner **26/26**, CLI typecheck/build, and Web typecheck. This is repository-owned protocol evidence only. Keep the row unchecked for operational enrollment credential exchange, approved enterprise/recipient runner execution and result reconciliation, operational acceptance, any required independent review, and enterprise acceptance. Evidence: `docs/shipping/evidence/ent-cli-001-current-head-requalification-pr167-2026-10-22.md`.

- [ ] **DIST-001** · package contents/front-door audit · deps: LOCAL/HUNT/RECORD · Verify one `verglos` bin, package exports, no private keys/source fixtures/unintended files, and explicit optional-engine behavior. Commit(s): `beb8a54`, `79a9b55`, `6ab8bca`, `5b9b695`, public PR #126 merged as `f1cd8269` with implementation `b9541157` and regression test `575275d8`; the current seven-package archive/manifest/clean-consumer verification passes, including no implicit external-engine installation and bounded signed Hunt execution. The current positioning merge `50bcab42` was requalified with seven archives, packed-manifest checks, clean-consumer imports, no implicit engine installation, and bounded signed A1 execution. Keep open until dependent LOCAL/HUNT/RECORD product surfaces and final legal/release qualification are complete. Evidence: `docs/shipping/evidence/lic-003-dist-001-public-pr126-2026-10-14.md`, `docs/shipping/evidence/dist-001-current-merge-requalification-2026-10-18.md`.
**DIST-001 package allowlist hardening addendum (2026-10-19):** CLI PR #152 preserves implementation `d3069413` and regression `656397eb` as separate commits. The original public package audit now rejects absolute, traversal, glob, control-character, overlong, and duplicate `files` declarations before contents traversal. Focused surface tests passed **6/6**; the seven-package contents audit passed; the forced CLI test/typecheck/build graph completed **23/23 tasks**; clean packing produced seven archives and packed-manifest audit passed. This advances implementation only; keep the checkbox open for LOCAL/HUNT/RECORD dependencies and final legal/release acceptance. Evidence: `docs/shipping/evidence/dist-001-package-allowlist-hardening-2026-10-19.md`. Score remains **239 checked / 41 open / 280 total (85.4%)**.
**DIST-001 current origin/main qualification addendum (2026-10-21; not a checkbox):** Merged CLI `origin/main` commit `72190acae81b454a4a88a0ea8d222c8981ac9a3f` was requalified from a clean detached worktree. The documented CI-only cross-platform optional-package setup was applied ephemerally and removed afterward. Build passed **8/8**; package-surface/packer tests **8/8**; package contents, packed manifests, and clean-consumer checks passed for **7/7** archives; and the forced test/typecheck/build graph completed **23/23** Turbo tasks with no failures. The clean consumer imported all seven libraries, executed `verglos 2.0.0-alpha.1`, performed no external-engine installation, and ran the bounded signed A1 fixture. Docker/A2 integration tests remained explicit environment-gated skips. Keep `DIST-001` unchecked for LOCAL/HUNT/RECORD dependencies and final legal/release acceptance. Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence: `docs/shipping/evidence/dist-001-current-origin-main-qualification-2026-10-21.md`.

**DIST-001 current-head archive-member hardening addendum (2026-10-22):** CLI commit `e44ce8a673fb1d9119a3231f896d0f86a00cdc3c` makes the packed-manifest audit reject symlink, hard-link, device, FIFO, and other non-regular tar members, with a regression fixture wired into self-scan and publish workflow tests. Focused tests passed **9/9**; broader release contracts **37/37**; build **8/8**; seven public archives passed packed-manifest and clean-consumer qualification, including bounded signed A1 execution and no implicit engine install. This advances implementation only; keep `DIST-001` unchecked for LOCAL/HUNT/RECORD dependencies and final legal/release qualification. Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence: `docs/shipping/evidence/dist-001-current-head-archive-member-qualification-2026-10-22.md`.

**DIST-001 current merged-head requalification addendum (2026-10-22; not a checkbox):** Exact CLI `db3510356ecd6c6e430d7dcb3b9354e514d777ee` passed forced build **8/8**, seven packed public archives, packed-manifest audit, and clean-consumer verification with all seven imports, no implicit engine installation, and bounded signed A1 execution. Keep `DIST-001` unchecked for LOCAL/HUNT/RECORD dependencies and final legal/release qualification. Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence: `docs/shipping/evidence/dist-001-current-head-requalification-pr167-2026-10-22.md`.

**DIST-001/DIST-003 GitHub merge addendum (2026-10-22):** CLI PR #158 promoted the granular implementation commits `5072204f` and `e44ce8a6` and merged normally as `145ff5d9`; Platform matrix, Self-scan, and Standard validation passed. Keep both rows open for their declared dependency/legal/publication/attestation contracts. Evidence: `docs/shipping/evidence/github-pr-158-229-merge-qualification-2026-10-22.md`.

**STUDIO-CLI-001/ENT-CLI-001 GitHub and hosted qualification addendum (2026-10-22):** Web PR #229 merged normally as `939ea4c2`. Web Verify `39757724439` and Private runner qualification `39757724442` passed at `08750cb` after the PostgreSQL mirror and dependency-audit repairs. Keep both rows open for recipient/enterprise acceptance and their remaining declared operational or independent-review conditions. Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence: `docs/shipping/evidence/github-pr-158-229-merge-qualification-2026-10-22.md`.

- [ ] **DIST-002** · trusted npm publishing workflow · deps: LIC-003/004, DIST-001 · Use GitHub OIDC trusted publishing/provenance, protected environment, least permissions, immutable version/tag, and no long-lived npm token. Commit(s): `2f162d2`, `2f18041` merged as `8706c97`; CLI PR #70 `67a132c` merged as `3a0959a` adds strict publish-time verification of exactly six public archives with one shared version; hosted run `37472923540` + self-scan `37472923665` green. Preparatory only: protected environment approval, legal/trusted-publishing review, and an actual immutable publication/attestation remain open.
- **DIST-002 code-side hardening addendum (2026-10-19):** CLI PR #148 merged normally as `0823b513f`, preserving implementation `35faf977`. The manual `workflow_dispatch`/`promote_latest` path, mutable npm dist-tag mutation, and `NPM_TOKEN`/`NODE_AUTH_TOKEN` dependency were removed; the tag-only OIDC/provenance workflow retains protected `release`, immutable tag/version verification, serialized publication, and `--provenance`. Local release checks passed 8/8, typecheck 14/14, build 8/8, full package test graph 13/13 Turbo tasks; hosted platform matrix, in-toto, official standard/provenance validators, and self-scan passed. This is implementation progress only: keep the checkbox open for protected approval, trusted publisher enrollment, legal/release clearance, and actual immutable publication/attestation. Evidence: `docs/shipping/evidence/dist-002-trusted-publishing-hardening-2026-10-19.md`. Score remains **235 checked / 45 open / 280 total (83.9%)**.
- **DIST-002 current origin/main contract addendum (2026-10-21; not a checkbox):** CLI `origin/main` `72190acae81b454a4a88a0ea8d222c8981ac9a3f` passed the release workflow/artifact/tag/origin suite **10/10** with zero failures/skips. The contract preserves OIDC provenance, protected environment, immutable tag/version binding, serialized publication, required sidecars/checksums, pre-publish verification, and refusal of manual/mutable-token bypasses. The strict license gate exited **2** for seven unresolved review entries: the bundled `benchmark@1.0.0`/`fast-uri@3.1.7` conflict and BlueOak review for `glob@13.0.6`, `lru-cache@11.5.2`, `minimatch@10.2.6`, `minipass@7.1.3`, `minipass-flush@1.0.7`, and `path-scurry@2.0.2`. Keep `DIST-002` unchecked for DIST-001, protected publisher/environment approval, legal/license clearance, and actual immutable publication/attestation. Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence: `docs/shipping/evidence/dist-002-current-origin-main-contract-2026-10-21.md`.
- **DIST-002 external configuration addendum (2026-10-21; not a checkbox):** Read-only GitHub API observation found the protected `release` environment with required reviewer `anuragyadav-git` and a branch-policy rule. This proves configuration only, not reviewer approval, trusted npm publisher enrollment, legal clearance, or immutable publication. No workflow or registry action was triggered. Keep `DIST-002` unchecked. Evidence: `docs/shipping/evidence/dist-002-current-origin-main-contract-2026-10-21.md`.
**DIST-002 current merged-head requalification addendum (2026-10-22; not a checkbox):** Exact CLI `db3510356ecd6c6e430d7dcb3b9354e514d777ee` passed the release workflow contract set **19/19** and rollback rehearsal **5/5** with **2** historical records preserved. `license-inventory.mjs --require-clear` correctly exited **2** for seven unresolved dependency review entries. Keep `DIST-002` unchecked for DIST-001, protected/trusted publisher execution, legal/license clearance, actual immutable publication/attestation, and final acceptance. No tag, registry, provider, Production, database, customer, or legal state changed. Score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence: `docs/shipping/evidence/dist-002-current-head-requalification-pr167-2026-10-22.md`.
**DIST-002 dependency-remediation addendum (2026-10-22; not a checkbox):** A bounded exact-head audit found no safe dependency-only change that clears all seven review blockers while preserving the Node/runtime contract. Fast-uri patch releases retain the bundled benchmark; fetch/cache downgrades leave a BlueOak path or change runtime behavior. Keep the checkbox open for the real legal/license decision, protected/trusted publication, immutable attestation, and final acceptance. Evidence: `docs/shipping/evidence/dist-002-license-remediation-audit-pr167-2026-10-22.md`.
- [ ] **DIST-003** · release artifact attestations/checksums · deps: DIST-002 · Generate checksums/SBOM/provenance/notes and verify them in a clean consumer job; describe origin, not security certification. Commit(s): `e5e4e72`, `66312a4`, `d269e45`, `4435964`, `2f18041` merged as `8706c97`; CLI PR #70 `67a132c` merged as `3a0959a` adds strict six-archive/shared-version verification to the publish path. Hosted run `37472923540` and self-scan `37472923665` pass. Release-note verification, trusted publication/attestation review, and license-clear release evidence remain open.
- **DIST-003 implementation addendum (2026-10-19):** CLI implementation commit `8542ab7f` merged normally in PR #149 as `5abf451f`. The workflow contract now requires checksum, notices, CycloneDX/SPDX SBOM, external-license, dependency-license, and clean-consumer sidecars to be uploaded with `if-no-files-found: error` before the first `npm publish`, with release-artifact verification before upload. Focused contract test passed 1/1; hosted matrix run `39182478465`, self-scan `39182478499`, official validators `39182478551`, and in-toto job `117837979585` passed. This is implementation progress only; keep the checkbox unchecked pending actual immutable publication/attestation, release-note and license-clearance evidence, trusted-publishing review, and final acceptance. Evidence: `docs/shipping/evidence/dist-003-release-artifact-contract-2026-10-19.md`.
- **DIST-003 release-origin addendum (2026-10-19):** CLI implementation `d8d76c36` and regression `02a23684` in PR #156 merged normally as `72190acae81b454a4a88a0ea8d222c8981ac9a3f`. The original publication workflow now creates `RELEASE_METADATA.json` for the seven public archives and six release sidecars, binding each digest to the exact source commit, immutable tag, repository, package identity, and shared version; the verifier requires the complete set before upload and `SHA256SUMS` covers the manifest. Focused contracts passed 8/8, broader release contracts 32/32, typecheck 14/14, build 8/8, and hosted matrix `39260151443`, standard/provenance `39260151409`, and self-scan `39260151534` passed. This is implementation progress only; keep the checkbox unchecked pending actual immutable publication/attestation, release-note and license-clearance evidence, trusted-publishing review, and final acceptance. No npm/provider/Production/customer write occurred. Evidence: `docs/shipping/evidence/dist-003-release-origin-pr156-2026-10-19.md`.
**DIST-003 current merged-head requalification addendum (2026-10-22; not a checkbox):** Exact CLI `db3510356ecd6c6e430d7dcb3b9354e514d777ee` passed artifact contracts **23/23** with zero failures/skips. The strict license gate remains exit **2** for seven unresolved review entries. Keep `DIST-003` unchecked for DIST-002, legal/license clearance, trusted publication/attestation, release-note evidence, and final acceptance. Evidence: `docs/shipping/evidence/dist-003-current-head-requalification-pr167-2026-10-22.md`.
- [x] **DIST-004** · macOS/Linux/Windows install matrix · deps: ENGINE-008, DIST-001 · Test Node versions and supported amd64/arm64 platforms, path/permission/cache behavior, system/offline engines, and no postinstall binary fetch. Accepted at CLI PR #39: `packages/shared/src/install-matrix-invariants.test.ts` freezes for every public package (cli/shared/scanner/reporter/mcp/entitlement/hunt/attest) that no preinstall/install/postinstall/prepare/prepublish/prepublishOnly script exists (rules out postinstall binary fetch), an explicit `files` allowlist is declared with no traversal or wildcard, `engines.node` is a valid semver range, and (for cli) exactly one `bin` mapping (`verglos`) points at an existing file. 26 focused subtests run on the existing Ubuntu/macOS/Windows × Node 20/22/24 platform matrix; all 10 cells SUCCESS on exact head. Commit(s): `9ccfe48`.
- [x] **DIST-005** · upgrade/backward-compatibility matrix · deps: CONTRACT-012, DIST-004 · Accepted at CLI PR #40 head: `packages/shared/src/upgrade-compat-corpus.test.ts` freezes upgrade + backward-compatibility invariants across the schema compat classifier (full major/minor/patch matrix including never-inferred `older major → incompatible`), semver parser rejection surface, the frozen `legacy-scan-report-2.0.0.json` fixture shape and `LEGACY_SCAN_REPORT_SCHEMA` URN, both record signing envelope branches (v1.0 legacy non-identity-bound + v1.1 identity-bound), the two entitlement pinned key slots (`legacy-v1` + `successor-v1`) and v2-claim overlap rejection, and the 15 stable `VERGLOS_SCHEMA_IDS` URNs. 9 focused tests. Local `pnpm exec turbo run test typecheck build --force` 23/23; hosted all 10 platform-matrix cells (Ubuntu/macOS/Windows × Node 20/22/24 + self-scan) SUCCESS on exact head. Commit(s): `82cc9c2`.
- [ ] **DIST-006** · rollback/revocation workflow · deps: DIST-002-005 · Document/test bad npm release, engine manifest, recipe feed, signing identity, and web deployment rollback/revocation without invalidating old records. Commit(s): `2f18041` merged as `8706c97`, `28512c7` merged as `8e39aa7`, CLI PR #83 merged as `c1a2856`, and CLI PR #87 merged as `8bea4be` (local fail-closed decision/rehearsal and complete-boundary coverage; no authenticated provider/registry/engine/feed/signing/deployment rollback or revocation run has been performed)
- **DIST-006 implementation addendum (2026-10-19):** CLI implementation commit `5dda94f0` merged normally in PR #150 as `31b10613`. The new `release:rollback-evidence` command runs the canonical five-boundary local fixture and records five operations with two historical records preserved, without provider writes. The new generator test passed 1/1; the full CLI package test passed with the existing single explicit Hunt A2 skip and no failures; hosted matrix run `39183406848`, self-scan `39183406983`, official validators `39183406856`, and in-toto job `117840752558` passed. This is implementation progress only; keep the checkbox unchecked pending authenticated rollback/revocation acceptance and final release mapping. Evidence: `docs/shipping/evidence/dist-006-rollback-rehearsal-evidence-2026-10-19.md`.
- **DIST-006 manifest-binding addendum (2026-10-19):** CLI PR #157 merged normally as `7c24535c55e2672b188cddb6219511c0910983ff`, preserving original-logic implementation `b9cc1e12` and regression/evidence `167c344b`. The real `release rollback-rehearsal` command now emits the SHA-256 digest of the exact bounded manifest bytes it evaluates, including denied-operation results; the evidence generator independently recomputes and verifies that digest. Local build passed 8/8, rollback plan tests 6/6, evidence-generator test 1/1, full CLI package test exited 0, and diff check passed. Hosted matrix `39262149777` passed 12/12; official validators `39262149790`, self-scan `39262149671`, and in-toto job `118092298436` passed. The generated report passed all five boundary decisions, preserved two historical records, and matched manifest digest `sha256:664f70df2f2a0c063d43c767e602266b1adc1709a498dae7ef71825291b960b7`. This is implementation/evidence progress only; keep the checkbox unchecked pending authenticated rollback/revocation acceptance and final release mapping. No provider, registry, signing, Hunt-feed, Vercel, Production, entitlement, or customer write occurred. Evidence: `docs/shipping/evidence/dist-006-rollback-manifest-digest-pr157-2026-10-19.md`. Score remains **239 checked / 41 open / 280 total (85.4%)**.
**DIST-006 current merged-head requalification addendum (2026-10-22; not a checkbox):** Exact CLI `db3510356ecd6c6e430d7dcb3b9354e514d777ee` passed the real rollback evidence generator and focused regression. The bounded fixture covered all five boundaries, matched its manifest digest, and preserved two historical records. Keep `DIST-006` unchecked for DIST-002-005, authenticated rollback/revocation, operational review, and final acceptance. Evidence: `docs/shipping/evidence/dist-006-current-head-requalification-pr167-2026-10-22.md`.
- [x] **DIST-WEB-001** · web CI quality workflow · deps: test harness, HOSTED/PLAN · Run typecheck, tests, migration checks, build, dependency/license/SBOM checks, and secret scan on protected changes. Commit(s): `3c12ed9`, `a046ad8`, `67bbe09` (complete at exact PR #32 head `67bbe09`; hosted run `34694532678` passes the protected workflow's install/typecheck, 87/87 PostgreSQL-backed tests, schema/migration checks, build, public-boundary, high/critical dependency audit, CycloneDX 1.6 generation, complete component license inventory/tests, tracked-secret guard, and artifact upload; GitGuardian and Vercel pass. The retained artifact contains 413 components; 79 need manual license review, 53 lack declared license metadata. No legal clearance is inferred.)
- [x] **DIST-WEB-002** · production configuration validation · deps: DIST-WEB-001 · Fail deployment safely for missing/unsafe auth, DB, signing, encryption, billing, queue, object storage, cron, and public URL values; no secrets in logs. Commit(s): Web `5f74817`, `1ce37f9`, `75b9a48`, `76e58f4`, `b103d9e` merged in PR #49 as `c34ebd9`. Operational acceptance executed 2026-09-23 against Vercel production for `anuragyadav20062002s-projects/verglos-web`: two prior deploy attempts fail-closed with named missing keys and zero secret leakage (validator emitted only key names and shape requirements), proving the intended DIST-WEB-002 safety behaviour under real production build. After provisioning `VERGLOS_QUEUE_PROVIDER=postgres`, `VERGLOS_OBJECT_STORAGE_PROVIDER=postgres-jsonb`, `NEXT_PUBLIC_SITE_URL=https://verglos.com`, `VERGLOS_CHANNEL_CREDENTIAL_KEY` (32-byte hex), `VERGLOS_ENTITLEMENT_PRIVATE_KEY` + `VERGLOS_ENTITLEMENT_PRIVATE_KEY_SUCCESSOR` (fresh Ed25519 PEM), `VERGLOS_ENTITLEMENT_KEY_ID=successor-v1`, and `RAZORPAY_WEBHOOK_SECRET` (32+ chars) via `vercel env add`, `vercel deploy --prod --yes` succeeded end-to-end and `https://verglos.com/` returned HTTP 200. The provider-selector enum contract (`postgres` queue, `postgres-jsonb` storage) is enforced by the same production build. Legacy `VERGLOS_EVIDENCE_STORAGE_PROVIDER` scratch was removed. Deployment inspected at `https://vercel.com/anuragyadav20062002s-projects/verglos-web/8BeGdayXt9979c7WHhsy5jZ5fTJA`.
- [x] **DIST-WEB-003** · deployment/rollback/health runbook · deps: OPS-013/014, DIST-WEB-001/002 · Define preview, migration ordering, health checks, smoke tests, rollback/forward-fix, ownership, and incident triggers. Commit(s): Web `ddf3069` accepted at PR #55 merged as `6659bafe`. `docs/deployment-runbook.md` codifies preview qualification checklist (7 gates), additive-only migration ordering rule with current 0000..0018 snapshot, OPS-013 eight-metric health matrix with explicit warn/critical thresholds, post-deploy smoke-test checklist (5 items covering landing/entitlement/monitor-cron/billing/metrics), rollback vectors (Vercel deployment promote for application regressions; pg_dump restore path for database regressions with maintenance-mode freeze), forward-fix policy (env fix / hotfix PR / new corrective migration — never edit shipped migrations), OPS-015 cutover reference with `MONITOR_CUTOVER_ROUTE` semantics + rollback flip, ownership matrix, and five P0 incident triggers. Hosted CI green at exact head `ddf3069`; documentation-only change, no code affected.

## Epic 18 — Integrated security, privacy, performance, load, migration, recovery, accessibility, and documentation qualification

Evidence/problem: compilation cannot qualify a release-security product. The integrated release candidate needs risk-based full-system evidence.

- [x] **QUAL-CLI-001** · frozen detector/adapter determinism corpus · deps: all CLI data-plane epics · Repeat native/adapters/imports across frozen fixtures and platforms; record expected deltas only through reviewed fixture updates. Accepted at CLI PR #39: `packages/shared/src/determinism-corpus.test.ts` invokes six data-plane importers (SARIF, CycloneDX, CycloneDX VEX, SPDX, in-toto provenance, detect-secrets baseline) twice against canonical fixtures and asserts byte-identical structured output; a harness self-test proves the invariant fails loud on intentional drift. Forced uncached `pnpm exec turbo run test typecheck build --force` 23/23 tasks; all 10 platform-matrix cells (Ubuntu/macOS/Windows × Node 20/22/24 + self-scan) SUCCESS on exact head. Commit(s): `b549055`.
- [x] **QUAL-CLI-002** · ordinary-scan no-execution/no-upload proof · deps: LOCAL-003 (accepted), telemetry controls · Instrument child processes/network/files and prove target code, install scripts, source, secrets, paths, and finding text do not leave. Accepted at CLI PR #38 exact head `c8b26a4947ac431ea1e36831a88bc033ca561b6e`: process test instruments selected target file APIs, child-process calls, fetch plus common Node HTTP/TLS/socket transports; fixture assertions prove install hooks/source are not executed and source/secret/path/finding/package-name canaries are absent from outbound request bodies. Analytics transport is disabled pending separate R-014/OPS-012 governance; paid account sync uses a distinct authenticated, strict allowlist with only event ID, project fingerprint, score/counts, and CLI version. Full CLI tests/typecheck/build, all nine hosted platform cells, and self-scan pass. Commit(s): `c8b26a4` (complete for this bounded acceptance item; R-014/OPS-012 and broader data-governance risks remain open and are not implied complete).
- [x] **QUAL-CLI-003** · malformed/resource adversarial corpus · deps: TARGET/ENGINE/IMPORT/RECORD · Cover archives, manifests, symlinks, traversal, bombs, huge JSON, parser depth, process output, time, memory, disk, and cancellation. Accepted at CLI PR #38 commit `ef6f929`; forced uncached CLI graph 18/18, exact-head self-scan plus nine-platform matrix pass, and pinned Docker runtime corpus 15/15 with one macOS-only namespace skip. Commit(s): `ef6f929`.
- [ ] **QUAL-CLI-004** · Hunt independent isolation evidence pack · deps: HUNT-011 · Produce repeatable attack fixtures/results for Docker boundary, network denial, process cleanup, secrets, and failure classification; independent review remains a gate. Commit(s): CLI PR #66 `d3c0df0` merged as `e62ae12` adds a structured Self-scan evidence report binding exact source commit, pinned image digest, runtime, and parsed pass/skip/fail totals alongside the raw TAP log; current exact CLI head `8bea4be2fa18533eafd088122be769e942965626` has 60 pass / 1 documented macOS namespace skip / 0 failures and hosted self-scan `37827269372` passed. Current private reviewer packet: `docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md`. Remains unchecked pending a real independent reviewer report and final Hunt recipe/provenance qualification.
- [x] **QUAL-CLI-005** · engine-exit and historical verification drill · deps: ENGINE-015, RECORD-008 · Remove/replace Trivy, replay/import alternate evidence, keep policy/viewer/records functional, mark reduced coverage incomplete, and verify old records. Accepted at CLI PR #38 commit `9fc208b`: an isolated empty PATH simulates unavailable Docker/Trivy; CLI scan imports alternate SARIF, retains its normalized observation without raw message text, marks Trivy and aggregate coverage incomplete, and exits 3; policy check of that snapshot remains INCOMPLETE and exits 3; an older schema-1.0 record stays byte-identical, verifies offline as PASS, and its header renders through the local viewer. Focused 1/1, forced uncached Turbo graph 18/18, exact-head self-scan and all nine platform jobs pass. Commit(s): `9fc208b`.
- [ ] **QUAL-CLI-006** · standard validation/cross-platform release test · deps: IMPORT exports, RECORD, DIST-004 · Validate SARIF/CycloneDX/SPDX/in-toto/Sigstore with official tools and install/upgrade/rollback on supported systems. Commit(s): CLI `af3aa09` accepted at PR #47 merged as `ca88ef2` for validator-compliant SPDX generation and official SARIF/CyclONE DX/SPDX format evidence; CLI PR #48 head `79ae04f` merged as `f72b910` with hosted run `36681169580` passing clean-consumer install in all nine Ubuntu/macOS/Windows × Node 20/22/24 cells; CLI PR #49 head `02c3c6e` merged as `ef78ac6` with hosted run `36682992576` passing the real published `1.8.3` → local `2.0.0-alpha.1` → published `1.8.3` transition in all nine cells; official Docker `in-toto==3.0.0` synthetic layout/link verification also returns success; public CLI `main` head `f5686b5c5aa11f45f392e647bd9d7e31830654ba` now has exact-source 8/8 build, official CycloneDX/SPDX validation, six-archive in-toto binding verification, standards corpus 7/7, current clean-consumer install/import/no-implicit-engine evidence, and `1.8.3` → `2.0.0-alpha.1` → `1.8.3` transition evidence. Progress only: trusted keyless Sigstore/Fulcio/Rekor release identity, legal clearance, protected publishing, independent review, and final acceptance remain open. Evidence: `docs/shipping/evidence/qual-cli-006-official-current-head-2026-10-10.md`.
- **QUAL-CLI-006 current-head requalification addendum (2026-10-14):** exact merged CLI head `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a` passed typecheck 14/14, build 8/8, package tests 13/13 with zero failures, release-contract tests 26/26, seven-archive pack/manifest audit, clean-consumer install/import, `1.8.3` → `2.0.0-alpha.1` → `1.8.3` upgrade/rollback, official `in-toto==3.0.0` exact-archive binding, public-boundary audit, and diff check. Mechanical inventory has 254 lockfile versions, 250 package entries, one bundled component, and seven review blockers. This is qualification progress only; `QUAL-CLI-006` remains unchecked for trusted keyless release identity, protected publication, legal clearance, independent review, hosted supported-platform evidence, and final acceptance. Docker/Linux cases remain explicit skips on macOS. No score changed. Evidence: `docs/shipping/evidence/qual-cli-006-current-head-2026-10-14.md`.
- **QUAL-CLI-006 evidence addendum (CLI PR #51):** tested head `e63b5041727a175da1d770012cb945a061f05324` was rebased onto current `origin/main` `f16c6f1` and merged as `353787539451e918dcda088ff6cbbd497ae1c631`. Hosted run `36720267628` packs the six current source archives, verifies exact SHA-256 products with official `in-toto==3.0.0`, and passes all nine Ubuntu/macOS/Windows × Node 20/22/24 cells; self-scan `36720267470` passes. QUAL-CLI-006 remains unchecked because trusted keyless Sigstore/Fulcio/Rekor, final release-pipeline identity binding, licensing, and publish authorization are not proven. Package remains `2.0.0-alpha.1`; no production operation occurred.
- **QUAL-CLI-006 current-origin-main package qualification addendum (2026-10-19):** CLI `origin/main` `0823b513f2b1810ad9f6afcb8806ba46f61feedb` was exercised in a clean disposable worktree using the original release logic. The release-contract suite passed **23/23**, the real packer produced seven public archives, packed-manifest audit passed, and the clean consumer installed/imported all seven packages, emitted `2.0.0-alpha.1`, created no implicit external-engine cache, and executed signed A1 Hunt through the bounded restricted-process runtime. License/notices/external-record tests passed **16/16**. The mechanical inventory covered 254 lockfile package IDs, 250 entries, one bundled component, and seven explicit legal-review blockers; `pnpm licenses:inventory --require-clear` exits 2. This is qualification progress only; keep `QUAL-CLI-006` unchecked for legal clearance, trusted keyless publication, protected release, independent AppSec review, hosted matrix/official-validator evidence, and final acceptance. Evidence: `docs/shipping/evidence/qual-cli-006-current-origin-main-package-qualification-2026-10-19.md`.
- **QUAL-CLI-006 fixture-root hardening addendum (2026-10-19):** Implementation `23280174` and regression `cbb07472` in PR #154 preserve separate granular commits. The original standard-validation runner now rejects configured Sigstore payload, bundle, key, and trusted-root paths outside the declared artifact root, including resolved symlink escapes, before external validator execution. Standard-validation and contract tests pass **10/10** with zero failures/skips. The row remains unchecked for trusted keyless publication, protected release, legal clearance, independent AppSec review, and final acceptance. Evidence: `docs/shipping/evidence/qual-cli-006-standard-fixture-root-2026-10-19.md`.
**QUAL-CLI-006 current merged-head requalification addendum (2026-10-22; not a checkbox):** Exact CLI `db3510356ecd6c6e430d7dcb3b9354e514d777ee` passed standard-validation contracts **12/12**. The hosted merged-PR run completed the cross-platform, in-toto, and standard-validation path; no live keyless identity or legal approval is inferred. Keep `QUAL-CLI-006` unchecked for trusted keyless release identity, legal/protected publication, independent review, and final acceptance. Evidence: `docs/shipping/evidence/qual-cli-006-current-head-requalification-pr167-2026-10-22.md`.
- [x] **QUAL-WEB-001** · full negative authorization suite · deps: HOSTED/PLAN/TEAM/STUDIO/ENT · Cover every resource/action/role, guessed IDs, list/search/export/cache/public/private boundaries, and modified CLI. Commit(s): Web `82d2157`, `a24fef7`, PR #100 merged `666317e` (pure substrate); PR #103 head `66c1f94` merged `0a85f08` adds a route-boundary harness across every protected organization API method for malformed, traversal-shaped, and zero-UUID organization IDs, proving fixed denials/no identifier echo and authorization-before-data-access; PR #104 head `3bd02da` merged `98169fa` proves forged plan/tier, tenant, capability, allowance, usage, and record fields are ignored at v2 entitlement issuance; PR #105 head `27e972c` merged `6cb6734` fixes private receipt list/detail cache boundaries and proves all response paths are no-store; PR #108 head `8a77d2a` merged `7279ef2` extends no-store coverage to private evidence and policy-evaluation list/create routes with hosted run `36691398858` green; PR #110 head `f60a403` merged `18ddb408` inventories all authenticated organization routes and adds private no-store coverage with hosted run `36692358099` green; PR #111 head `f524382` merged `c83300b` extends no-store coverage to account, CLI-auth, license, score-history, and monitor APIs with hosted run `36693118104` green; PR #112 head `4548734` merged `517df10c` adds direct runtime denial/cache assertions across every protected organization API route, with hosted run `36703830835` green; PR #113 head `39dfb64` merged `24232db2` adds direct public receipt authority/cache assertions, with hosted run `36704251024` green; PR #114 head `f79a7a5` merged `88a809d3` adds forged query authority fields to the protected route matrix, with hosted run `36704670862` green; PR #115 head `b3dfd77` merged `4d2051e4` strengthens modified-CLI entitlement requests with CLI headers and forged authority fields, with hosted run `36705118215` green; PR #119 merged `1834f44` adds Docker-backed evidence/policy route runtime; PR #120 merged `677a78af` adds Docker-backed tenant-scoped search; PR #121 merged `a8849515` runs the complete negative-boundary matrix, including search, in hosted Verify run `36760390332`. Acceptance evidence now covers role/action and malformed-ID denial, forged modified-CLI/query authority, tenant-isolated list/search/release/evidence/policy/receipt/export runtime, public receipt boundaries, cache headers, and hosted verification. No production operation occurred.
- **QUAL-WEB-001 evidence addendum (Web PR #119):** tested head `87f424c` merged as `1834f44` after hosted run `36741825859`. Focused Docker PostgreSQL runtime integration invokes the real evidence and policy-evaluation list/create handlers for two tenants, ignores forged query authority fields, proves tenant-bound writes and subject/release joins, and asserts `private, no-store`. Local typecheck/schema/migration/build pass. The item remains unchecked: distinct search/export semantics and complete runtime matrix coverage are still missing; no production operation occurred.
- [x] **QUAL-WEB-002** · SSRF/webhook/input security suite · deps: OPS-008 · Accepted at Web PR #48 exact head `508cde0bbc99ca96833e119f1b64a293674cc18a` (merge `5420ad1`). Per-attempt DNS classification rejects mixed/private/loopback/link-local/metadata/reserved IPv4 and IPv6 answers; the native HTTPS transport pins the approved address and verifies the connected socket, never follows redirects, and bounds JSON request bytes, DNS+request time, declared/chunked response bytes, and failure output. Registration rejects unsafe literal destinations before encrypted persistence. Razorpay handling requires the official event identity, verifies raw-body HMAC in constant time, validates bounded payload shape, atomically claims exact event-id+payload-digest in PostgreSQL, makes completed replay side-effect free, conflicts changed content, and releases failed claims for retry. Isolated PostgreSQL 15 full suite **280/280 / 0 skip**, typecheck/schema/18-migration ordering/build/public-boundary/license/SBOM/audit pass; exact-head Node 22 CI, GitGuardian, and Vercel preview pass. Migration `0017` is ordered but not production-applied; the pre-existing foundational migration-chain gap remains R-021. Commit(s): Web `afa03cf`, `508cde0`.
- [x] **QUAL-WEB-003** · concurrency/idempotency/load suite · deps: OPS/PLAN · Test duplicate deliveries, quota races, billing/webhook replay, worker crashes, tenant fairness, alert dedup, and 10x forecast freshness SLO. Commit(s): Web `60cf3a2`, `e56975e` on PR #52 merged as `ac9ef38` (carved slice: cross-module concurrency invariants — quota races isolate per-tenant/per-dimension, admission+ledger stay consistent under contention with/without overage capability, threshold outbox dedupes concurrent racers across dimensions, idempotent replay collapses 20 racers on same key to one durable row). Web `6fabfd9`, `cea63dc`, `adaa294` on PR #57 merged as `67e79db` closes the remaining scope: worker-crash recovery integration test `src/lib/queue/worker-crash-recovery.integration.test.ts` proves crashed worker's expired lease is re-leased by another worker with same durable job ID, incremented attempt count, and higher fence generation; stale ack/fail from crashed worker return `lease-lost`; recovering worker's ack completes the job. Second test proves the bounded-retry contract: three successive crash cycles push attempts to `maxAttempts=3`, then explicit `fail` dead-letters instead of scheduling a fourth retry, and the dead-lettered row never appears in future lease sweeps. Real defect surfaced during CI: `PostgresQueueProvider.leaseDue` did not include `leased` rows whose lease expired without an explicit `fail` call, so hard-crashed jobs (kill -9, machine loss) would silently strand forever; fixed by widening the recoverable set to include expired `leased` rows so the attempt-generation invariant handles both graceful-fail and crash-recover paths uniformly. Coverage across the QUAL-WEB-003 acceptance list: duplicate deliveries via `outbox_events_org_key_idx` + `match-outbox.test.ts`; quota races via `concurrency-invariants.integration.test.ts`; billing/webhook replay via `razorpay-webhook-events.integration.test.ts` (QUAL-WEB-002); worker crashes via this PR; tenant fairness via OPS-001 fairness-cursor test + multi-tenant test in `concurrency-invariants`; alert dedup via `threshold-outbox.integration.test.ts` and OPS-006 outbox unique index. **Deferred (chained to OPS-013 metrics dashboards):** the 10× forecast freshness SLO requires a live-traffic load harness and metrics dashboard that do not exist yet; accepted here as coverage-complete for the invariants testable today.
- [x] **QUAL-WEB-004** · migration/restore/disaster-recovery drill · deps: HOSTED-013, OPS-014/015, DIST-WEB-003 · Rehearse snapshot, migration, failure, restore, object reconciliation, rollback/forward-fix, RPO/RTO evidence, and no data loss. Commit(s): Web `fe2caef`, `2ec8682`, `9e6e9fd`, `a7cf501`, `92e708f` accepted at PR #56 merged as `79952a54`. Pure contract `src/lib/qual/dr-drill.ts` codifies RTO/RPO threshold matrix (RTO 30m warn / 1h critical, RPO 24h warn / 48h critical), step outcome types, status classifier, and warning collector; 11 focused unit tests pass in ~138 ms covering severity partitioning across warn/critical, empty-step rejection, per-step outcome propagation, and reconciler-divergence surfacing. Harness `scripts/qual-web-004-dr-drill.ts` orchestrates the full rehearsal: reads a `pg_dump` snapshot, boots local docker Postgres (default `postgres:18-alpine` matching production major version) with an ephemeral random password so no test credential ever appears in source, restores via psql, applies `pnpm db:migrate`, runs both HOSTED-013 writer passes plus reconciler, simulates DB loss by stopping the container and asserting a subsequent psql fails-closed, and emits a JSON report with measured RTO/RPO and status. Runbook `docs/dr-drill-runbook.md` documents quarterly cadence, prerequisites, invocation flags, exit codes, report-field reference, and the rollback walkthrough. Reports git-ignored under `qual-web-004-drill-*.json`. Local `pnpm typecheck` clean; Vercel preview + typecheck-and-schema green at exact head `92e708f`; GitGuardian flagged the Docker documented default password `POSTGRES_PASSWORD=postgres` (well-known local-test literal, never a real credential) — the follow-up commit removed the literal, but GitGuardian scans full PR history so the historical commit still shows in the check; not a real credential leak.
- [ ] **QUAL-WEB-005** · privacy/deletion/retention qualification · deps: OPS-011/012, Studio/Enterprise · Trace collection/consent/storage/export/delete/account-delete; customer-held signed records remain valid while hosted private data is removed. Commit(s): Web `82d2157`, `a24fef7`, PR #100 merged `666317e`; Web PRs #139/#140/#141/#142 merged as `317102f`/`b749c41`/`710a79f`/`3127199`; PR #153 exact head `929da19` adds the authenticated `/account/privacy` request/history surface, hosted deletion worker wiring, authenticated same-origin customer-held digest registration/listing, and protected super-admin hold activation/release routes. Adds the authenticated request ledger, fail-closed execution gate, concurrency-safe pending uniqueness, bounded newest-first history, versioned inventory, durable hold authority, supporting dispositions, worker leases/retry/idempotency, explicit user-facing request confirmation, digest-only customer-held record authority without record bytes, and race-safe hold release. Production migrations `0024` and `0025` applied successfully on 2026-10-06 after snapshot/restore rehearsal; current read-only production audit reports 26 applied migrations and zero deletion requests, with `0026`–`0034` pending. This remains progress only: authenticated non-production deletion E2E, legal/customer-held-record decision run, consent inventory, production migration authorization, restore/rollback acceptance, row reconciliation, and independent end-to-end acceptance have not been executed.
**QUAL-WEB-005 current qualification addendum (2026-10-19):** The original deletion/retention implementation completed **52/52** focused checks with zero failures/skips after the two database-gated tests ran against a disposable migrated Postgres 15 database. Typecheck, build, 42-migration ordering, and exact-count read-only audit passed. The audit defect caused by ordering Drizzle history by non-monotonic `created_at` was fixed in Web `0ff9ded`, with regression test `9c2587c`; the audit now orders by canonical application `id` and reports 42/42 current migrations with zero missing tables. Keep the checkbox unchecked for legal/consent, production authorization, restore/rollback, reconciliation, and independent acceptance. Evidence: `docs/shipping/evidence/qual-web-005-current-deletion-qualification-2026-10-19.md`.
**QUAL-WEB-005 hosted execution addendum (2026-10-18; not a checkbox):** The current Web source `25adc4abb5a7d989c8349eb7a288f7011143f5b7` ran on an isolated READY Preview. A synthetic same-origin `record_receipt` deletion request completed through the hosted worker; the customer-held signed-vgl digest remained unchanged; worker replay was empty; cross-origin and malformed confirmation requests failed closed. The row remains open for legal/consent, complete inventory, restore/rollback, production authorization, and independent acceptance. Evidence: `docs/shipping/evidence/qual-web-005-hosted-preview-deletion-2026-10-18.md`.
**QUAL-WEB-005 current merged-head requalification addendum (2026-10-22; not a checkbox):** Exact Web `02f5aba95c4172255cc522730c6ffecc1598cbda` passed the focused privacy/deletion/retention suite **74/74** and typecheck; the fresh isolated PostgreSQL serial run passed **919** with **2 documented skips / 0 failures**. The remote `.env.test.local` database was not sourced for mutation tests. Keep the row unchecked for legal/customer-held disposition, authorized destructive acceptance, reconciliation/restore, independent review, and final acceptance. Evidence: `docs/shipping/evidence/qual-web-005-current-head-requalification-2026-10-22.md`.

- [ ] **QUAL-WEB-006** · accessibility/performance qualification · deps: dashboards/viewer · Test keyboard, screen reader, landmarks, focus, contrast, reduced motion, responsive states, loading/errors, Core Web Vitals budgets, and large datasets. Commit(s): Web `82d2157`, `a24fef7`, PR #100 merged `666317e` (pure threshold classifier); Web PR #102 head `a69e50d` merged as `f138e24b` after hosted run `36685565094` passed, correcting public contrast, keyboard-focus affordances, and focusable overflow tables/code examples on `/`, `/detectors`, and `/docs` without changing product claims or copy; Web PR #125 `22a9f25` merged as `c4abda5` after hosted run `36981068432` passed, correcting checkout contrast/landmark defects and achieving production Lighthouse Accessibility 100 / Best Practices 100 on `/checkout`; Web PR #126 `f66d32b` merged as `89056c3` after hosted type/schema and Vercel passed, correcting authenticated `/account` label contrast and achieving production Lighthouse Accessibility 100 / Best Practices 100 on desktop and mobile, with LCP 551ms and CLS 0.00 in a desktop trace; Web PR #127 `d92aba3` merged as `cdc1fff` after hosted run `36985775429`, adding organization-dashboard skip navigation, named landmarks, keyboard focus, contrast, responsive mobile stacking, and reduced-motion handling. Empty/non-finite/negative measurements fail closed; authenticated dashboard runtime, human screen-reader, large-dataset, and complete field-CWV evidence remain open. Private evidence: `docs/shipping/evidence/account-a11y-cwv-2026-10-02.md`; PR #150 `a78578e` merged as `a64407d`, with disposable PostgreSQL large-data integration 1/1, typecheck, schema, 29-migration ordering, and 38-page build passing locally; PR #151 `07788c0` merged as `f1384ba` after hosted run `37557043246`, adding the authenticated organization entry directory and account navigation link with local 2/2 focused contracts and hosted typecheck/schema/Vercel/GitGuardian/Preview Comments pass; PR #189 merged normally as `f7e2a1c`, preserving `bd33089d` and `83f3b80`, adds the explicit label/control association to the authenticated privacy deletion confirmation; PR #190 merged normally as `e91dc73`, preserving `aa00b6c` and `268df49`, adds an explicit accessible name to the CLI authorization user-code input; PR #191 merged normally as `ed7febf`, preserving `356cd31` and `038f2a9`, adds live-region announcements for successful and failed CLI authorization results; focused CLI-auth tests 2/2, local typecheck/diff check, hosted typecheck/schema, Vercel, Preview Comments, and GitGuardian passed. A fresh existing-tab public-home audit on 2026-10-18 passed Lighthouse Accessibility/Best Practices/SEO/Agentic Browsing at 100/100 on desktop and mobile (61/61 and 60/60, zero failures) and measured lab LCP 334 ms / CLS 0.00; authenticated owner-dashboard audit after Web PR #197 passed Lighthouse Accessibility/Best Practices/SEO/Agentic Browsing at 100/100 on desktop and mobile (52/52, zero failures) with production desktop Fast 4G trace LCP 506 ms / CLS 0.00; PR #197 adds the bounded canonical metadata fix. Raw report paths and limitations are in `docs/shipping/evidence/qual-web-006-authenticated-dashboard-2026-10-18.md`. This is partial progress only; the item remains unchecked.

**QUAL-WEB-006 current merged-head requalification addendum (2026-10-22; not a checkbox):** Exact Web `02f5aba95c4172255cc522730c6ffecc1598cbda` passed accessibility/performance/truth contracts **66/66** and source public-release smoke (**16 routes / 22 of 22 claims / 2 proof assets / 0 issues**). The direct landing qualifier correctly refused missing browser-capture input, so no browser, field-CWV, or human screen-reader evidence is inferred. Keep the row unchecked for supported-browser capture, human screen-reader, large/complete states, field CWV, independent review, and final acceptance. Evidence: `docs/shipping/evidence/qual-web-006-current-head-requalification-2026-10-22.md`.

### QUAL-WEB-006 malformed runtime boundary repair · 2026-10-22

Web commits `3170094` and `dfa417f` make missing measurement arrays and
null/non-object page entries fail closed with explicit invalid-boundary results.
Focused tests passed **22/22**. PR #239 merged normally as `ba00d5d`; all
**8/8** hosted checks passed and the source branch remains preserved.
`QUAL-WEB-006` remains unchecked for human screen-reader,
supported-browser/paid-org runtime, field-CWV, and independent/customer
acceptance. Score remains **239/41/280 (85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-006-current-head-requalification-2026-10-22.md`.

### QUAL-WEB-006 current-head requalification · 2026-10-22

The merged Web head `67f8f89` passed the focused accessibility/dashboard/
portfolio/recipient contracts **41/41**, typecheck, 43 ordered migrations,
current-head large-dataset PostgreSQL integration **1/1**, and a top-level
isolated production build generating **49/49** pages/routes. The nested
worktree build failure was only Next.js inferring the unrelated parent
workspace manifest with merge-conflict markers; the same source passed from
`/private/tmp/verglos-web-build-20261022`. `QUAL-WEB-006` remains unchecked
for human screen-reader, supported paid/organization browser runtime,
field-CWV, and independent/customer acceptance. Score remains **239/41/280
(85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-006-current-head-requalification-2026-10-22.md`.

### QUAL-WEB-006 current implementation qualification · 2026-10-19

The original authenticated organization Home surface now collapses its summary
grid to one column at the dashboard mobile breakpoint and gives the five
summary sections explicit accessible heading relationships. Focused
dashboard/accessibility contracts pass **12/12** with zero failures/skips;
typecheck and the optimized production build also pass, generating 48 pages.
Implementation `4faab2a` and regression `7ef00d0` remain separate granular
commits in the clean Web qualification worktree. `QUAL-WEB-006` remains
unchecked for human screen-reader, complete paid/org runtime, large-dataset,
field-CWV, supported-environment browser, and independent/customer acceptance.
No AppSec state changed. Score remains **239 checked / 41 open / 280 total
(85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-006-current-home-accessibility-qualification-2026-10-19.md`.

### QUAL-WEB-006 responsive dashboard controls qualification · 2026-10-19

The original authenticated organization dashboard now collapses fixed desktop
grid tracks for member rows, client-workspace creation, handoff expiry/message
controls, and client portfolio summary facts to one bounded column at the
mobile breakpoint. Focused dashboard/accessibility contracts pass **14/14**
with zero failures/skips; typecheck and the optimized production build also
pass, generating 48 pages. Implementation `8098393` and regression `04533dc`
remain separate granular commits in the clean Web qualification worktree. The
shared dashboard shell also exposes a visible focus ring for links, buttons,
form controls, and summaries through `127b735`, guarded by `929898a`.
`QUAL-WEB-006` remains unchecked for human screen-reader, complete paid/org
runtime, large-dataset, field-CWV, supported-environment browser, and
independent/customer acceptance. No AppSec state changed. Score remains
**239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-006-dashboard-responsive-controls-2026-10-19.md`.

### QUAL-WEB-006 evidence addendum · 2026-10-18

The existing authenticated organization dashboard was qualified in Chrome
without a new tab or state-changing request. Desktop and mobile Lighthouse
snapshots each passed **32/32** at Accessibility/Best Practices/SEO/Agentic
Browsing **100/100/100/100**. A desktop reload trace measured lab LCP
**853 ms** and CLS **0.00**; CrUX has no field data for this authenticated
route. Raw reports are preserved in the private evidence packet. This
advances `QUAL-WEB-006` only; human screen-reader, large-dataset, field-CWV,
and independent/customer acceptance remain open, so no checkbox changed.
Evidence: `docs/shipping/evidence/qual-web-006-authenticated-org-lighthouse-2026-10-18.md`.

### QUAL-WEB-001 evidence addendum · 2026-09-30

Web PR #120 tested head `9ecd009` and merged as `677a78af` after hosted Verify run `36744036519` completed green. It adds the authenticated organization search route over bounded project/release/subject identifiers, with forged query authority ignored, wildcard/control input rejected, project-context narrowing preserved, and `private, no-store` responses. The focused disposable Docker PostgreSQL runtime test passes **1/1**; full configured Web tests pass **836/836 executed / 22 environment-gated skips**, with typecheck, production build, Drizzle schema check, 21-migration ordering, negative-boundary, and production dependency audit passing. Axios `1.20.0` and PostCSS `8.5.28` overrides remediate the hosted dependency-audit failure. QUAL-WEB-001 remains unchecked: distinct export semantics and complete hosted/provider-backed list/search/export/public-private matrix evidence remain open. No production operation occurred.

Web PR #118 tested head `d0df2ee` merged as `b0663e35` adds direct PostgreSQL-backed invocation of the real tenant release list and release detail handlers. Forged organization/project query fields are ignored; tenant A receives only its release and subject projection; both responses are `private, no-store`. The focused disposable Docker run passes **2/2 with zero skips**, and hosted run `36717893114` is green across the full Web verification workflow, GitGuardian, and Vercel. This strengthens release list/detail runtime evidence only; QUAL-WEB-001 remains unchecked because distinct search semantics are absent and hosted/provider-backed list/search/export plus the complete public-private matrix remain open. No production operation occurred.

The existing receipt route integration passed **1/1 with zero skips** against disposable local PostgreSQL, covering tenant-isolated list reads, authorized detail verification, and private download/export projection. No distinct search handler exists in the current route inventory; hosted/provider-backed list/search/export evidence and the complete public/private matrix remain open. No checkbox changed.

Web PR #116 tested head `95ebce4` merged as `d230af0f` adds direct PostgreSQL-backed invocation of the organization project-list route for two tenants with forged query authority fields. The focused Docker run passes **2/2 with zero skips** and hosted run `36716252644` is green across the Web verification workflow. This strengthens list-boundary evidence only; QUAL-WEB-001 remains unchecked because distinct search semantics are absent and hosted/provider-backed list/search/export plus the complete public-private matrix remain open.

Web PR #117 tested head `1b39c09` merged as `d8c7edf0` adds direct runtime public receipt evidence through a production-disabled database seam. The focused Docker run passes **2/2 with zero skips** and hosted run `36716982904` is green. This strengthens public/private runtime evidence only; QUAL-WEB-001 remains unchecked because no distinct search handler exists and hosted/provider-backed list/search/export plus the complete matrix remain open.

## Epic 19 — Post-release-candidate acceptance and GA truth lock

Evidence/problem: external validation is deliberately last. It validates the complete release candidate and claims; it cannot redefine unfinished functionality as shipped or expand frozen V1 scope.

- [x] **ACCEPT-001** · freeze 10–20 repository/artifact corpus · deps: Gate 0–5 pass · Record exact commits/digests, licenses/notices, configuration, expected coverage, responsible-disclosure rules, and non-public vulnerable fixtures. Commit(s): Private `ac00dca` + `ed2b826` freeze twelve reproducible items: six full public technical repository clones, four exact-CLI-source contract artifacts, and two private synthetic vulnerable fixtures. The v3 manifest verifies six non-shallow HEADs, four artifact SHA-256/byte pairs, internal fixture authorization and complete scans, licenses, per-repository scope/expiry/revocation notices, CLI `955412516`, telemetry disabled, network/exploit/load exclusions, and private derived reports. This is a technical corpus, not customer consent or a customer acceptance cohort.
- [ ] **ACCEPT-002** · automate 12 acceptance stories · deps: ACCEPT-001 · Run Free, CI, Trivy import, multi-tool dedup, mismatch/incomplete, exception, Hunt, offline record, modified CLI, Studio recipient, Enterprise runner, and account deletion stories. Commit(s): Private `8f18b81` adds `acceptance:stories:verify`; private `2c24069b` adds the machine-checked twelve-story execution plan and coverage result; Web `e310c57` repairs the tenant-scope audit and stable payment-method-unavailable error contract. The current exact-head verifier passes CLI 291/293 with 2 explicit skips, Web 945/975 with 30 explicit skips, and composed Studio/Enterprise/Team/quality substrates 74/74; all twelve story mappings report substrate execution. This remains substrate/regression progress only; the full 12-story external/hosted/provider/customer run remains open. Evidence: `docs/shipping/evidence/acceptance-stories-verification-2026-10-19.md` and `docs/shipping/evidence/acceptance-stories-verification-2026-10-19.json`.
- **ACCEPT-002 current-head verifier addendum (2026-10-22):** Clean merged CLI `1d7844bd` and Web `ba00d5d` sources passed the private verifier with CLI **311/313** (2 documented skips), Web **952/982** (30 documented skips), composed substrates **76/76**, and all **12/12** mappings executed with zero failures. This is substrate evidence only; keep the row unchecked for the full external/hosted/provider/customer acceptance run. Evidence: `docs/shipping/evidence/accept-002-current-head-pr239-2026-10-22.md` and `docs/shipping/evidence/acceptance-stories-verification-2026-10-22-pr239.json`.
- [ ] **ACCEPT-003** · acceptance evidence bundle · deps: ACCEPT-002 · Store commands, configurations, versions, digests, results, failures, limitations, and reviewer sign-off in a reproducible internal package. Commit(s): Private `8f18b81` writes `docs/shipping/evidence/acceptance-stories-verification-2026-10-03.json` with exact source commits, command arguments, exit codes, parsed totals, and output hashes; the current `acceptance:evidence:bundle` rerun hashes 12 bounded evidence files and passes its secret scan. Reviewer sign-off and external/hosted evidence remain open. Evidence: `docs/shipping/evidence/accept-003-bundle-rerun-2026-10-14.md`.
- **ACCEPT-003 current-head bundle addendum (2026-10-22):** The private acceptance manifest now contains **54** hashed evidence files and passes its secret scan after merged PRs #239/#240 and the current ACCEPT-002 verifier refresh. Keep the row unchecked for reviewer sign-off and external/hosted evidence. Evidence: `docs/shipping/evidence/accept-003-current-head-pr239-2026-10-22.md`.
- [x] **ACCEPT-004** · external authorized workflow protocol · deps: ACCEPT-003 · Freeze recruitment/questions/consent/data handling/success criteria for qualified teams without scraping or bulk outreach. No external contact without authorization. Commit(s): Private `454a0cf` adds the frozen protocol, per-repository consent-record template, and `pnpm acceptance:protocol:check` validator. It requires named owner consent, exact commit/scope, bounded network/data handling, expiry/revocation, founder approval, redacted evidence, and deletion/expiry recording. No external contact was performed; ACCEPT-005 onward remain open.
- [ ] **ACCEPT-005** · run authorized external repository workflows · deps: ACCEPT-004 + founder authorization · Validate real release reconciliation without publishing findings; record product failures separately from requested scope. First-party qualification evidence exists, but it is not external consented-team/recipient acceptance and does not close this row. Commit(s): Private `pending` · `docs/shipping/evidence/accept-005-topnotchh-owned-qualification-2026-10-19.md`
- **ACCEPT-005 blocker addendum (2026-10-22):** The protocol validator passes, but reports `externalContact: not-performed` and `customerAcceptance: open`. The row still requires a named external owner's consent record, exact founder authorization, reproducible redacted release reconciliation, and fixture/evidence expiry or deletion proof. Adjacent merged-head truth checks pass **35/35**, **4/4**, and **4/4**; no checkbox changed. Evidence: `docs/shipping/evidence/accept-005-current-blocker-audit-2026-10-22.md`.
- **ACCEPT-005 current-head qualification addendum (2026-10-22):** Clean merged CLI/Web scans exited **0** with CLI **78 findings / score 67 high** and Web **22 findings / score 73 medium**; both coverage states are incomplete because provenance was skipped. This updates first-party evidence only and does not close the external workflow row. Evidence: `docs/shipping/evidence/accept-005-current-head-first-party-qualification-2026-10-22.md`.
- [ ] **ACCEPT-006** · report comprehension test · deps: ACCEPT-003/005 · Developers/leads/recipients answer exact artifact, decision, change, remaining risk, authenticity, and limitations within the defined gate. Commit(s): —
- [ ] **ACCEPT-007** · Hunt adjudication study · deps: ACCEPT-001/003 · Evaluate at least 100 independently adjudicated findings with preregistered methodology; separate false confirmation, not reproduced, and environment failure. Commit(s): —
- [ ] **ACCEPT-008** · commercial acceptance/COGS evidence · deps: technical acceptance + founder authorization · Test actual plan agreements/checkout, repeat use, support minutes, hosted cost, recipient value, and explicit allowances; hypotheses remain hypotheses otherwise. Commit(s): —
- [ ] **ACCEPT-009** · truth registry/release-gate reconciliation · deps: ACCEPT-002-008 · Update shipped/partial/planned labels strictly from evidence, list failed gates and rollback/correction work, and make a documented go/no-go. Commit(s): —
- [ ] **ACCEPT-010** · GA release candidate freeze · deps: ACCEPT-009 + all critical gates · Freeze versions, schemas, migrations, manifests, plan catalog, compatibility, docs, runbooks, notices, SBOM, provenance, and rollback. Commit(s): —

## Epic 20 — Held final landing/marketing pass

HOLD: do not start these tasks until the founder explicitly says the product truth is frozen and authorizes the final web pass. No blog work is included.

- [ ] **FINAL-WEB-001** · capability-driven public copy map · deps: ACCEPT-009/010 + founder command · Map homepage/docs/pricing/meta claims to truth registry and server plan catalog; remove stale alpha language only for verified capabilities. Commit(s): Web PR #101 merged as `c3e6668e` established the pure decision surface; Web PR #179, implementation `8a630d1`, merged normally as `a85d6f3`, wires the security-layer positioning, metadata, JSON-LD, `/llms.txt`, plan states, and expanded machine-readable public claims to that surface. Acceptance remains gated on ACCEPT-009/010 and founder command.
- [ ] **FINAL-WEB-002** · homepage product promise/flow · deps: FINAL-WEB-001 · Update landing content to Inspect -> Decide -> Prove -> Monitor using real product evidence and no unsupported benchmarks/customers. Commit(s): Web PR #178, commit `f8febea`, merged normally as `1c15a486`; implementation and hosted verification are recorded, but FINAL-WEB-001 and final acceptance remain open. Evidence: `docs/shipping/evidence/final-web-002-flow-pr178-2026-10-18.md`.
- [ ] **FINAL-WEB-003** · plan/pricing presentation · deps: FINAL-WEB-001 · Render Free/Pro/Team/Studio/Enterprise from canonical catalog with exact allowances, status, billing terms, and explicit overages. Commit(s): Web PR #177 commits `b2b3d4a`, `4aa3310`, and `fa01830` add the Team card, align the public capability matrix, cover the Team price/state in truth tests, and project exact catalog terms without inventing overages; dependent acceptance evidence remains open.
- [ ] **FINAL-WEB-004** · public product/docs truth pass · deps: FINAL-WEB-001 · Align command docs, language coverage, engine attribution, signing limitations, Hunt assurance, and dashboard capabilities with shipped behavior. Commit(s): Web PR #177 commits `7a56141` and `bd50d84` align the docs plan matrix with the catalog, add Team, correct stale price/attestation wording, and replace unsupported public maturity labels with qualification-gated language; CLI PR #128 commit `8da4617d`, merged as `50bcab42`, aligns CLI help, package metadata, and public README positioning with the security-layer identity; Web PR #180 commit `e8ccfd2`, merged as `71278209`, replaces the stale hero Hunt demo with local scan/policy/qualification-gated Hunt/bounded-handoff truth; Web PR #181 commit `9895a94`, merged as `9dd2ab30`, aligns remaining public notes, metadata, legacy verification footer, and 2.0 direction copy; Web PR #182 commit `5b7c067`, merged as `48156976`, aligns the operating-stamp copy with the security decision-layer identity and is verified on production; Web PR #183 commit `d0b2d52`, merged normally as `7f7957b`, aligns the remaining legacy thesis card with the security decision-layer identity and is verified on production; Web PR #187 commits `3061de0` and `11ef21a`, merged normally as `832b357f`, complete the current public command/docs truth implementation with canonical record command shapes, compatibility-only attest wording, coverage/engine/Hunt/dashboard boundaries, and contract tests. The complete dependency and final-acceptance scope remains open. Evidence: `docs/shipping/evidence/final-web-004-security-layer-stamp-pr182-2026-10-18.md`, `docs/shipping/evidence/final-web-004-security-layer-legacy-thesis-pr183-2026-10-18.md`, `docs/shipping/evidence/final-web-004-public-truth-pr187-2026-10-18.md`.
- [ ] **FINAL-WEB-005** · metadata/structured data/llms truth pass · deps: FINAL-WEB-001 · Update only factual metadata and machine-readable surfaces; no invented GEO/SEO claims. Commit(s): Web PR #179, implementation `8a630d1`, merged normally as `a85d6f3`, centralizes factual metadata, SoftwareApplication JSON-LD, and `/llms.txt` lines and guards them against the public truth snapshot. The row remains dependency-bound to FINAL-WEB-001 acceptance.
- [ ] **FINAL-WEB-006** · public proof assets · deps: ACCEPT-003/009 · Use sanitized real records/screenshots/flows with date, version, demo/real label, alt text, and no private evidence. Commit(s): Web PR #201 merged normally as `72cff9bf`, preserving implementation `4bcada6`, route `49d7157`, and regression `625afe9`; Web PR #202 merged normally as `6496814c`, preserving accessibility correction `36a7e5e`. The static `/proof` route publishes bounded source-free `real`/`demo` cards with exact date/version, public evidence URL, accessible description, and explicit limitation. Hosted verification, Vercel, Preview Comments, GitGuardian, local focused tests, typecheck, and build passed. Remains unchecked for acceptance bundle and ACCEPT-003/009 dependencies. Evidence: `docs/shipping/evidence/final-web-006-public-proof-assets-pr201-2026-10-18.md`.
- [ ] **FINAL-WEB-007** · landing accessibility/performance/responsive verification · deps: FINAL-WEB-002-006 · Test primary journey, mobile, keyboard, screen reader, contrast, reduced motion, metadata, crawlability, and real-user performance budgets. Commit(s): —
- [ ] **FINAL-WEB-008** · final public claim sweep and release smoke · deps: FINAL-WEB-001-007 · Search all public web surfaces for stale prices, plans, alpha shells, unsupported capabilities, and contradictory status; run production-like smoke without deploying. Commit(s): —
**FINAL-WEB-008 current merged-head implementation addendum (2026-10-22; not a checkbox):** Web PR #242 merged normally as `c4b7313e803dce980cf6ac3a7bc68f73927d456c`. The release inventory now covers recipient handoff and authenticated report source surfaces; private reports are explicitly `noindex,nofollow` and `/reports` is disallowed in `robots.txt`. Exact merged-head focused smoke passed **5/5**, public release smoke passed **18 routes / 22 claims / 2 proof assets / 0 issues**, typecheck passed, and build generated **49/49** routes. Keep FINAL-WEB-008 unchecked for ACCEPT-003/009/010, founder truth-freeze, and final acceptance. Evidence: `docs/shipping/evidence/final-web-008-public-route-index-boundary-pr242-2026-10-22.md`.

## Epic 21 — GitHub organization architecture, complete payment methods, and final acceptance corpus

Decision (2026-10-06): expand the shipping scope deliberately. Verglos is GitHub-first, but production alignment requires GitHub App installation identity, immutable account/repository binding, multi-repository installations, token/permission lifecycle, delivery replay protection, and lifecycle reconciliation. The current provider-neutral SCM substrate is progress only; it must not be presented as a complete GitHub-org integration.

Payment scope is now explicitly **Cards-only prepaid fixed-term billing with manual renewal** for Final V1. The checkout/catalog must show only Cards, and the customer starts a new one-time card payment when renewing. UPI, QR, netbanking, wallets, EMI, Pay Later, and automatic recurring billing are not Final V1 promises. Test Mode must cover the card success/failure, capture, refund, expiry, replay, out-of-order, timeout/retry, exactly-once, and manual-renewal paths without printing secrets or payment payloads.

Authoritative amendment: the older `PLAN-WEB-014`/`PLAN-WEB-015` row text below
contains historical recurring/multi-method observations. Those observations
remain evidence history, but the acceptance target is the Final V1 contract
above. Do not reopen or require a recurring-card provider fixture for Final V1;
qualify the one-time Cards-only order lifecycle and its customer-initiated
manual renewal instead.

The final evaluation corpus is deliberately sequenced **after the complete shipping implementation and qualification path**, not used to inflate progress during implementation. It will use full, non-shallow public TypeScript/JavaScript repositories selected for architecture shape (small product, multi-user SaaS, multi-tenant/team, and large-scale/enterprise-like boundaries). Public technical fixtures are not customer consent and cannot be used to claim customer acceptance. Manifests, authorization notes, findings, and feedback remain private; the public CLI receives no proprietary corpus, credentials, customer data, or competitive intelligence.

- [x] **GITHUB-WEB-001** · GitHub App/org installation identity · deps: TEAM-WEB-006, TEAM-CLI-002 · Replace owner/name-only binding with immutable GitHub account/repository IDs, installation identity, org/user ownership, multi-repository selection, and explicit permission scope. Commit(s): Web PR #144 (`afb48dc`/`a496608`, merged `1b2a623`) and PR #154 (`9032bda`, merged `1498837`) implement the server-side identity/exchange contract; current Web merge `0719074d` passes the focused identity/reconciliation suite 25/25, and the existing owner-controlled GitHub installation `172686102` binds Top-Notchh-Solutions account `287223982` to selected repository `1310272752` with metadata-read and checks-read/write permissions. Evidence: `docs/shipping/evidence/github-web-001-installation-identity-2026-10-19.md`. GITHUB-WEB-002-004 remain separate lifecycle/delivery/cutover rows.
- [x] **GITHUB-WEB-002** · GitHub App authentication and lifecycle · deps: GITHUB-WEB-001 · Implement signed App/JWT installation-token exchange, expiry/refresh, permission verification, install/uninstall/suspend lifecycle, and fail-closed reauthorization. Commit(s): Web PR #154 (`9032bda`, merged `1498837`) implements server-held App/JWT exchange, permission projection, encrypted expiry, refresh, and server-only webhook-secret handling; current Web merge `0719074d` passes the focused provider/lifecycle contract suite 25/25, and the owner-controlled installation `172686102` completed a real GitHub suspend/unsuspend observation with its exact repository scope and permissions preserved. Evidence: `docs/shipping/evidence/github-web-002-provider-lifecycle-2026-10-19.md`. GITHUB-WEB-003 remains open for live delivery/replay/reconciliation; GITHUB-WEB-004 remains open for complete cutover, uninstall, and recovery.
- [x] **GITHUB-WEB-003** · GitHub delivery/replay/reconciliation · deps: GITHUB-WEB-001/002 · Bind delivery IDs, installation IDs, repository IDs, commit/artifact identity, retries, and lifecycle reconciliation; prove duplicate and cross-tenant deliveries are harmless. Commit(s): Web PR #144 (`afb48dc`/`a496608`, merged `1b2a623`) and PR #154 (`9032bda`, merged `1498837`) implement the code-side binding/refresh contract; current protected Preview qualification delivered one source-free check through installation `172686102`, read back the completed GitHub check, returned `claimed=1, delivered=1`, and proved identical replay as `noop`; focused tenant/cross-tenant refusal and retry/lease tests pass. Evidence: `docs/shipping/evidence/github-web-003-delivery-reconciliation-2026-10-19.md`. GITHUB-WEB-004 remains open for complete cutover, uninstall, and recovery.
- [x] **GITHUB-WEB-004** · live GitHub organization cutover qualification · deps: GITHUB-WEB-001-003, R-041 rotation · Run a bounded test-mode/authorized GitHub organization installation and record permissions, webhook delivery, check publication, uninstall, and recovery evidence. Commit(s): Web qualification commit `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`; authorized GitHub uninstall/reinstall recovered the exact `Top-Notchh-Solutions/verglos-cli` scope as installation `172988022`, and protected Preview delivery returned `claimed=1, delivered=1` with identical replay `noop` and a completed successful GitHub check. Evidence: `docs/shipping/evidence/github-web-004-cutover-recovery-2026-10-19.md`. The isolated Preview fixture retains the historical `172686102` row as a recorded limitation; this is not the live provider state.
- [x] **PLAN-WEB-013** · provider payment-method catalog and checkout abstraction · deps: PLAN-WEB-011/012 · Model enabled Razorpay methods from server configuration/catalog; support method selection without claiming unavailable methods; preserve captured-only entitlement and idempotent lifecycle rules. Commit(s): Web PR #145 (`3ce60b8`, merged `d6ce773`) and Web PR #149 (`eb7e55a`, `f734acc`, `520d40a`, `67fb7e2`, `3f4a7aa`, `e46299a`, merged as `8b843da`) implement the fail-closed server catalog, hosted order checkout, signed order binding, webhook-authoritative fulfillment, explicit QR adapter boundary, fail-closed client response parsing, and provider-method validation on captured/failed order webhooks; the new order path binds the server-selected hosted method set while preserving legacy QR/subscription/order compatibility. Acceptance evidence: the canonical-amount Test Mode aggregate, four-method Preview/Production response checks, focused 55-test suite, isolated database integrations, typecheck, and 43-route build are recorded in `docs/shipping/evidence/plan-web-014-preview-hosted-payment-lifecycle-2026-10-09.md`. Downstream provider lifecycle and Production reconciliation remain tracked by `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and `PLAN-WEB-015`.
- [x] **PLAN-WEB-014** · Razorpay Test Mode prepaid-card lifecycle · deps: PLAN-WEB-013 · Qualify the Final V1 one-time prepaid Cards-only order across canonical success/capture, failure/recovery, partial/full refund, expiry, user-initiated manual renewal with a second one-time order, replay/out-of-order, timeout/retry, and exactly-once payment/ledger/entitlement reconciliation. Historical multi-method and recurring-subscription observations remain evidence only; UPI, QR, netbanking, wallets, EMI, Pay Later, and automatic recurring renewal are not Final V1 acceptance targets. Commit(s): Web `887249d9f4d09842107fc6636b239af9f67b91d4`; private acceptance evidence `docs/shipping/evidence/plan-web-014-preview-prepaid-cards-lifecycle-2026-10-11.md`; prior provider/subscription observations remain preserved as historical evidence. Accepted after signed Preview capture/failure/refund/manual-renewal reconciliation and fresh Docker/in-process lifecycle qualification.
- [x] **PLAN-WEB-015** · Cards-only production contract/reconciliation · deps: PLAN-WEB-014, DIST-WEB-002 · Reconcile the Production checkout display and server catalog with the Final V1 one-time prepaid Cards-only contract, while keeping payment, database, entitlement, and account writes out of Production qualification. Fail closed when Cards-only configuration is absent or stale; preserve manual renewal as a second user-initiated order, not automatic recurring billing. Accepted after the read-only Production environment method catalog returned exactly `card`, `/checkout` returned HTTP 200 with Cards only and no Test Mode/non-card marker, and the isolated Preview lifecycle was accepted under PLAN-WEB-014. Evidence: `docs/shipping/evidence/plan-web-015-production-cards-only-display-2026-10-11.md`.

### 2026-10-10 PLAN-WEB-014 evidence addendum · Preview/Test Mode partial refund

A separate captured subscription payment passed identity preflight. A
140,471-paise Test Mode partial refund returned HTTP 200; the provider
reported one processed cumulative refund while remaining captured; the fresh
`refund.processed` event completed; and the payment row projected to
`partially_refunded` with the same watermark while its license remained
active. This advances Gate 4 but does not close `PLAN-WEB-014`: refund
replay/order, all enabled methods, renewal, failure/expiry, timeout/retry,
exactly-once, and complete reconciliation remain open. Score remains **219
checked / 61 unchecked / 280 total (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-partial-refund-2026-10-10.md`.

### 2026-10-10 PLAN-WEB-014 evidence addendum · Preview/Test Mode full refund

A read-only preflight matched an isolated captured subscription payment to
Razorpay Test Mode. The full refund returned HTTP 200, the provider reported
`refunded` with one processed refund, and the isolated Preview endpoint
completed one fresh `refund.processed` event. The payment row projected to
`refunded` with the full watermark and the linked license remained active
under the paid-time rule; no manual database or entitlement mutation occurred.
This advances Gate 4 but does not close `PLAN-WEB-014`: partial refund,
refund replay/order, all enabled methods, renewal, failure/expiry,
timeout/retry, exactly-once, and complete reconciliation remain open. Score
remains **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
changed.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-refund-2026-10-10.md`.

### 2026-10-10 PLAN-WEB-014 evidence addendum · Preview/Test Mode pause-resume

One active isolated Test Mode subscription was paused and resumed with
provider HTTP 200 states `paused` then `active`. The Preview endpoint
completed one signed `subscription.paused` and one signed
`subscription.resumed` event, and the recently updated isolated row projected
to `active`; no recent payment or license row was created. This advances the
Gate 4 lifecycle evidence but does not close `PLAN-WEB-014`: renewal,
failure/expiry/refund, all enabled methods, replay/order, timeout/retry,
exactly-once, and complete reconciliation remain open. Score remains **219
checked / 61 unchecked / 280 total (78.2%)**; no checkbox changed.

Evidence: `docs/shipping/evidence/plan-web-014-preview-subscription-pause-resume-2026-10-10.md`.

### 2026-10-07 payment handler/database continuation

Web PR #149 exact head `9fd22d8` adds a direct PostgreSQL-backed webhook
handler integration: capture/entitlement, replay deduplication, partial/full/
stale refund watermarking, and failed-order no-entitlement behavior pass **2/2**;
neighboring route **2/2**, ledger **1/1**, webhook-claim **1/1**, and handler
unit **8/8** pass. Hosted Verify `37642113170`, typecheck, schema, ordered
31-migration check, build, and diff check pass. This is implementation evidence
only; PLAN-WEB-011/012/013/014/015 remain unchecked pending real provider
lifecycle, all-enabled-method, and production reconciliation evidence. Fresh
database migration bootstrap remains a separate risk because migration `0000`
assumes the legacy `licenses` table. No checkbox changed; backlog remains
**218 checked / 62 unchecked / 280 total (77.9%)**.
- [ ] **ACCEPT-011** · private architecture-shaped TypeScript/JavaScript corpus · deps: ACCEPT-001, ACCEPT-010, all implementation/qualification gates through Epic 18, legal/license inventory · Only after the shipping candidate is complete, freeze full non-shallow public repositories spanning small, multi-user, multi-tenant/team, and enterprise-like architecture shapes; record commit, license, scope, and reproducible configuration privately. Commit(s): —
- [ ] **ACCEPT-012** · reproducible full-clone analysis and feedback triage · deps: ACCEPT-011, QUAL-CLI-006 · Run the current unreleased CLI source against each fixture, retain private reports/hashes, classify findings and coverage gaps, and record actionable product feedback without customer claims. Commit(s): —
- [ ] **ACCEPT-013** · false-positive and false-truth correction loop · deps: ACCEPT-012, QUAL-CLI-004/006, QUAL-WEB-005/006 · Use a held-out fixture split and review each high-impact finding/claim; correct rules, copy, and evidence contracts without tuning against the final holdout. Commit(s): —
- [ ] **ACCEPT-014** · final regression corpus and go/no-go evidence · deps: ACCEPT-013, GITHUB-WEB-004, PLAN-WEB-015 · Re-run the frozen corpus across plan/user/tenant scenarios, compare report and performance deltas, reconcile truth/risk/gates, and issue a dated release recommendation. Commit(s): —

## Non-commit founder/external gates

- [ ] Confirm final plan hypotheses after evidence: Team $99 vs bounded founding cohort; Studio $249 vs bounded founding cohort.
- [ ] Select/approve queue and object-storage provider only after the Phase 0 cost/constraint decision.
- [ ] Obtain legal review for premium content license, contributor terms, trademarks, privacy, terms, and enterprise obligations.
- [ ] Approve any external engine/fixture redistribution with unresolved license or NOTICE status.
- [x] Approve networked Hunt recipe exceptions individually; none approved for this goal, default remains no network. Evidence: `docs/shipping/evidence/owner-authorization-2026-10-14.md`.
- [ ] Arrange independent Hunt isolation/security review.
- [ ] Supply authorized customer fixtures/repositories and consent for external acceptance.
- [ ] Authorize external conversations, paid pilots, checkout tests, campaign, publish, deploy, npm release, tags, pushes, and production migrations separately.
- [x] Do not claim Team/Studio/Enterprise generally available until their end-to-end gates pass. Evidence: `docs/shipping/evidence/non-ga-commercial-boundary-2026-10-14.md`; exact CLI `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a` and Web `a54d70dfacfaf9506b1336b788d9cd86c9ca74d7` refs have zero tracked-file matches for general-availability language, and their plan/truth registries keep unqualified tiers fail-closed.

### DIST-003 current implementation addendum · 2026-10-22

CLI commit `5072204f` adds the tested `generate-release-checksums.mjs`
implementation and replaces the publish workflow's inline checksum shell with
that repository script. It emits sorted deterministic `SHA256SUMS` output and
fails closed on empty or symlink-containing artifact directories. The focused
release-origin, release-verifier, workflow-contract, and checksum suite passed
**11/11** with zero failures/skips. This advances the implementation queue;
the score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/dist-003-current-head-checksum-generation-2026-10-22.md`.

### DIST-003 checksum-output portability and PR #160 addendum · 2026-10-22

CLI commits `97dead55` and `6ae6a2a5` refuse an existing symlink at the
`SHA256SUMS` output path and make Windows qualification cleanup retryable when
a temporary consumer is briefly busy. PR #160 merged normally as
`56b3535a1feffdac74a202259433d8f8536890e7`; the source branch remains
preserved. Focused release qualification passed **16/16**; the forced
workspace test/typecheck/build graph passed **23/23**; hosted matrix
`39783743149` passed **9/9**; self-scan `39783742975`, standard/provenance
`39783742882`, and in-toto `119841347844` passed. This advances code-side
implementation only; keep `DIST-003` unchecked for protected/trusted
publication, immutable attestation, legal/license clearance, provider action,
and final acceptance. No file, branch, record, deployment, or release artifact
was deleted or overwritten. Score remains **239 checked / 41 open / 280 total
(85.4%)**. Additive acceptance bundle
`acceptance-evidence-bundle-2026-10-22-pr160-final.json` contains **28** hashed
files and passed its secret scan; prior bundles remain preserved. Evidence:
`docs/shipping/evidence/dist-003-checksum-output-portability-pr160-2026-10-22.md`.

### ACCEPT-003 current evidence-bundle addendum · 2026-10-22

Private commit `c4e3da67` updates the acceptance evidence-bundle generator to
include the current ENT runner, Studio Preview, and DIST-003 qualification
packets. `pnpm acceptance:evidence:bundle` regenerated the bundle with **20**
hashed files and a passed secret scan. Score remains **239 checked / 41 open /
280 total (85.4%)**.

### ACCEPT-002/003 clean-head verification addendum · 2026-10-22

Private verifier hardening now rejects dirty source roots and records exact
clean commits/status. CLI `5072204f` passed **310/312** with 2 skips and 0
failures; Web `cb23021` passed **949/979** with 30 skips and 0 failures;
composed substrates passed **74/74**; all **12/12** stories executed. The
bundle now contains **21** hashed files with a passed secret scan. Score
remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/accept-002-003-clean-head-verification-2026-10-22.md`.

### QUAL-WEB-006 / PLAN-WEB-015 production checkout/browser recheck · 2026-10-09

Read-only Chrome DevTools inspection of a separate production checkout tab
rendered UPI, Cards, Netbanking, Wallets, EMI, and Pay Later with no console
messages. Desktop/mobile Lighthouse Accessibility and Best Practices were
100/100; SEO was 80 (missing meta description) and Agentic Browsing was 50
(`llms.txt` lacks the recommended H1). Production did not identify as Test
Mode, so this does not qualify payment lifecycle or reconciliation. No
production/provider/payment/database/deployment/account write occurred. No
checkbox changed; score remains **218 checked / 62 unchecked / 280 total
(77.9%)**. Evidence:
`docs/shipping/evidence/qual-web-006-plan-web-015-production-checkout-cdp-2026-10-09.md`.

## First ten dependency-ready tasks

1. `TRUTH-001` — current CLI capability inventory.
2. `TRUTH-002` — current hosted capability inventory.
3. `TRUTH-003` — evidence-linked truth registry.
4. `TRUTH-004` — plan/capability contradiction map.
5. `TRUTH-005` — open-core/commercial/content/brand boundary.
6. `TRUTH-006` — license/NOTICE inventory.
7. `TRUTH-007` — telemetry/privacy boundary inventory.
8. `TRUTH-008` — cost/usage ledger design.
9. `TRUTH-009` — schema/data migration inventory.
10. `TRUTH-010` — command compatibility inventory.

The first implementation task after the founder's command is `TRUTH-001`. It is the correct start because every later schema, plan, migration, public claim, and compatibility decision depends on knowing precisely what is already shipped and must be retained.

### QUAL-WEB-006 evidence addendum · 2026-10-14 · current Web merge head

Web merge `a54d70dfacfaf9506b1336b788d9cd86c9ca74d7` passed typecheck,
focused qualification **20/20**, the configured Web suite **876 passed / 24
explicit skips / 0 failed**, and build **47/47**. A local accessibility-tree
snapshot exposed named navigation/main content, controls, headings, lists,
tables, and FAQ content. The existing protected Preview returned HTTP 200 for
`/`, `/detectors`, `/docs`, and `/checkout`. This is qualification progress
only: the browser tab closed before the continuation Lighthouse/performance
run, and human screen-reader, complete authenticated dashboard, large-data,
supported-environment browser, and field-CWV evidence remain open. No
checkbox changed; score remains **228 checked / 52 unchecked / 280 total
(81.4%)**. Evidence:
`docs/shipping/evidence/qual-web-006-current-head-2026-10-14.md`.

### QUAL-WEB-006 evidence addendum · 2026-10-07 · PR #151

Web PR #151 head `07788c0` merged as `c1bca533` after hosted run
`37557043246`, Vercel, GitGuardian, and Preview Comments passed. It adds the
authenticated organization entry directory and account navigation link; local
focused contracts pass 2/2 with typecheck/schema/build green. This remains
partial qualification: authenticated slug runtime, human screen-reader, and
field-CWV evidence are still open. No checkbox changed.

### QUAL-WEB-006 evidence addendum · 2026-10-07 · production entry

Vercel production deployment `dpl_G7umvo3ZRerRWeg5SZUi8fPRnnHQ` now serves
the merged `/orgs` route. Existing authenticated Chrome page 13 received HTTP
200, rendered the accessible empty state, loaded the route chunk, and had no
console messages. No organization membership was available for slug-scoped
dashboard exercise; the item remains unchecked.

### QUAL-WEB-005 batch addendum · 2026-10-08 · Web PR #162

Current PR head `3061b9a14bd01ba22e0076b8c30d71d387483ade` extends the
production-safe request-auth seam with authenticated route-to-worker
integration: the deletion request creates one bounded job, the isolated
worker completes it, and the customer-held digest remains unchanged. Focused
route integration is **8/8**; deletion/hold/inventory/worker contracts are
**23/23**; safe-default Web serial is **861/885 with 24 explicit skips and
zero failures**; the clean database-backed serial at the initial auth-seam
head is **876/885 with 8 known shared-fixture collisions and 1 skip**, and the
current head's rebuilt isolated route-to-worker/deletion-job integrations are
**2/2**; the shared fixture skips cleanly when its application tables are
absent; typecheck/schema/migration/build pass. PR #162 passed hosted Verify
`37785153399` plus Vercel/GitGuardian/Preview Comments and merged to Web main
as `b34376bb02525737830f1d075778ebce774ed006`. This
is qualification progress only: legal/customer-held disposition, production
authorization, reconciliation, restore/rollback, and independent acceptance
remain open. No checkbox changed; backlog remains **218 checked / 62 unchecked /
280 total (77.9%)**.

### PLAN-WEB-014 evidence addendum · 2026-10-08 · Web PR #163

Web PR #163 source `a9158b1` merged as `d88aa7b9b219df414707143bc8c6b9c6e9b18193`
after hosted Verify `37789719564`, Vercel, GitGuardian, and Preview Comments
passed. Synthetic hosted-order webhook tests cover capture, failure, and replay
for UPI, cards, netbanking, wallets, EMI, and Pay Later, and reject a captured
QR method absent from the signed method snapshot. Focused payment tests pass
**21/21**; the full serial Web suite passes **862/886 with 24 explicit skips**;
typecheck, schema, 38-migration ordering, and 45-page build pass. This is
code-side contract evidence only; provider lifecycle, entitlement, and
production reconciliation remain open. No checkbox changed.

### PLAN-WEB-014 current Web main local qualification · 2026-10-08

Exact Web `origin/main` `cedf199855a5c4734122ae4849253156328cff1b` passed the
focused payment/ledger/webhook run **31/31** against disposable PostgreSQL 15
with all **38** ordered migrations applied. A separate fresh database run of
the configured serial suite passed **885/887 with 2 explicit skips and zero
failures**; typecheck, schema, migration ordering, 45-route build, and local
public-route checks passed. This corrects the test boundary exposed by the
discarded first serial attempt, which reused the migrated payment database and
hit eight expected fixture table collisions. It remains isolated synthetic
code/runtime evidence: account-enabled provider methods, real Test Mode
success/capture/refund/renewal/cancellation/webhook behavior, credential
rotation, and production reconciliation are still open. No checkbox changed;
the score remains **218 checked / 62 unchecked / 280 total (77.9%)**. Evidence:
`docs/shipping/evidence/plan-web-014-current-main-local-qualification-2026-10-08.md`.

### QUAL-WEB-006 evidence addendum · 2026-10-08 · production browser

Read-only Chrome qualification observed `/` at LCP 249 ms / CLS 0.00 and
`/account` at LCP 605 ms desktop / 893 ms mobile / CLS 0.00. Lighthouse
Accessibility and Best Practices were 100 on the observed public and
authenticated surfaces; the homepage SEO score was 100. Human screen-reader,
large-dataset, complete-route, and field/CrUX gates remain open. No checkbox
changed. Evidence:
`docs/shipping/evidence/qual-web-006-production-browser-2026-10-08.md`.
s
