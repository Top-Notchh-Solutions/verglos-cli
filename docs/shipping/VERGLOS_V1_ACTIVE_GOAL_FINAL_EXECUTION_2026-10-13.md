# Verglos V1 final shipping goal — non-AppSec completion

**Owner:** Anurag Yadav, owner of Top Notchh Solutions and Verglos
**Updated:** 2026-10-22
**Status:** active; this is the single authoritative continuation goal
**Continuation authorization:** On 2026-10-21 the owner authorized repository
implementation and bounded Preview qualification to resume. This authorizes
code, tests, configuration, and private evidence work within the stated scope;
it does not turn a synthetic result into customer, legal, provider,
field-performance, or independent-review evidence.
**Backlog authority:** `docs/shipping/VERGLOS_V1_BACKLOG.md`
**Evidence authority:** `docs/shipping/EXECUTION_LEDGER.md` and
`docs/shipping/evidence/`
**Implementation repositories:** `verglos-web` and `verglos-cli`
**Private tracker:** `verglos-cli-private-shipping`

## 1. Objective

Starting at the first unchecked backlog item, finish every item that does not
require the independent Hunt/AppSec review. “Finish” means implementing the
original production logic, adding the required regression coverage and
schemas/configuration/workflows, running the applicable qualification, saving
the real evidence, reconciling the private shipping records, and checking the
backlog item only when its complete contract is satisfied.

The goal is not to create progress notes or partial placeholders. It ends when
all eligible non-AppSec items are genuinely implemented, qualified, evidenced,
and checked. Hunt/AppSec-dependent items remain explicitly held until the
independent review is complete.

The current recorded baseline is **239 checked / 41 open / 280 total
(85.4%)**. Recompute this from the live checklist after every accepted batch;
never copy an old score forward.

**Current implementation batch (2026-10-22):** `DIST-003` received two
granular CLI portability fixes: commit `97dead55` refuses an existing symlink
at the `SHA256SUMS` output path without touching its target, and commit
`6ae6a2a5` retries bounded Windows temporary-consumer cleanup after transient
Node/npm file-handle contention. Focused release qualification passed **16/16**;
the forced workspace test/typecheck/build graph passed **23/23**; hosted matrix
`39783743149` passed **9/9**, self-scan `39783742975`, standard/provenance
`39783742882`, and in-toto job `119841347844` passed. PR #160 merged normally
as `56b3535a1feffdac74a202259433d8f8536890e7`; its source branch remains
preserved. No file, branch, record, deployment, provider, publication,
customer, or database state was deleted or changed. `DIST-003` remains
unchecked for trusted/protected publication, immutable attestation,
legal/license clearance, and final acceptance. Score remains **239 checked /
41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/dist-003-checksum-output-portability-pr160-2026-10-22.md`.
The additive acceptance bundle `acceptance-evidence-bundle-2026-10-22-pr160-final.json`
contains **28** hashed files and passed its secret scan; prior bundles remain
preserved.

**Current-head acceptance refresh after merged PR #158 (2026-10-22):** The
private verifier ran against clean CLI source
`e44ce8a673fb1d9119a3231f896d0f86a00cdc3c`, promoted by normal PR #158 merge
`145ff5d902289ecfb670a397c9e87860eb06309d`, and Web
`d32da250d5c2427dcfa36f560421a2506bb8a659`. CLI passed **310/312** with **2
explicit skips / 0 failures**, Web passed **949/979** with **30 explicit skips /
0 failures**, composed substrates passed **74/74**, and all **12/12** stories
executed. The additive final bundle contains **27** hashed files and passes its secret
scan. No `TEST_DATABASE_URL` was supplied, no database/provider/customer/
production operation occurred, and no previous bundle was removed or
overwritten. `ACCEPT-002/003` remain unchecked for external/hosted/provider/
customer/reviewer gates. Score remains **239 checked / 41 open / 280 total
(85.4%)**. Evidence:
`docs/shipping/evidence/accept-002-003-current-head-pr158-pr159-pr233-2026-10-22.md`.

**Current acceptance-substrate refresh (2026-10-22):** The private
`ACCEPT-002/003` verifier was rerun against clean exact heads CLI
`9fba66ac386605174a98bea856b9f04ceda8cfa8` and Web
`d32da250d5c2427dcfa36f560421a2506bb8a659`. CLI passed **310/312** with **2
explicit skips / 0 failures**, Web passed **949/979** with **30 explicit skips /
0 failures**, and composed Studio/Enterprise/Team/quality substrates passed
**74/74**; all **12/12** stories executed with exit 0. A new acceptance bundle
contains **25** hashed files and its secret scan passed. No `TEST_DATABASE_URL`
was supplied, no database/provider/customer/production operation occurred, and
no previous bundle was removed or overwritten. `ACCEPT-002/003` remain
unchecked for their external/hosted/provider/customer/reviewer gates. Score
remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/accept-002-003-current-head-pr159-pr233-2026-10-22.md`.

**Current implementation batch (2026-10-22):** `DIST-002` received an exact
release-event binding in CLI commit `9fba66ac386605174a98bea856b9f04ceda8cfa8`.
The publish workflow now resolves the pushed tag commit and requires it to
match `GITHUB_SHA` before preparing or publishing artifacts; malformed and
mismatched SHA cases are covered by tests. Focused release contracts passed
**12/12**; workspace typecheck **14/14 tasks**; workspace tests **13/13
tasks**; workspace build **8/8 tasks**; hosted Platform matrix
`39778965080` passed **9/9**; self-scan `39778965079`, in-toto binding
`39778965080`, and standard/provenance validation `39778965118` passed. PR
#159 merged normally as `285193a58be2c431fd5da865829d0fde08a9eb04`; the source
branch remains preserved. No npm publication, registry/provider state,
database, customer, or deployment was changed, and no file, branch, record, or
deployment was deleted. `DIST-002` remains unchecked for protected environment
authorization, legal/license clearance, trusted-publisher review, and an
actual immutable publication/attestation event. Score remains **239 checked /
41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/dist-002-tag-commit-binding-pr159-2026-10-22.md`.

**Current implementation batch (2026-10-22):** `FINAL-WEB-008` received a
production-path public-truth smoke hardening in Web commit
`d32da250d5c2427dcfa36f560421a2506bb8a659`. The audit now includes the public
`robots.ts` and `sitemap.ts` surfaces, checks their required tokens, rejects
ambiguous route manifests, and makes the hosted Verify artifact valid JSON by
running the smoke command with `pnpm --silent`. Local smoke passed with **16
routes / 20 source files / 0 issues / 22 of 22 publishable claims / 2 proof
assets**; public-smoke plus landing qualification passed **8/8**;
truth-registry passed **35/35**; typecheck and diff check passed. PR #233
merged normally as `065c84510df147dc72955310a599413cf375be63`; Verify web run
`39778264795` and Private runner qualification `39778264796` passed. The source
branch remains preserved. No database was connected or modified, and no file,
branch, record, or deployment was deleted. `FINAL-WEB-008` remains unchecked
for final acceptance and release-gate reconciliation/go-no-go evidence. Score
remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/final-web-008-public-truth-smoke-pr233-2026-10-22.md`.

**Current implementation batch (2026-10-22):** `QUAL-WEB-006` received a
substantive accessibility implementation in Web commit
`e05bcdc26f5332d4806f0c286b9233b406a19103`. The account, dashboard, landing,
and docs comparison tables now have explicit captions and header scope
semantics, including a capability row header, with a contract test covering
the selected surfaces. Focused accessibility contracts passed **9/9**; the
full Web suite passed **893 passed / 24 explicit skips / 0 failures** across
**917 tests**; typecheck and diff check passed. PR #232 merged normally as
`4ad87bd9e0f954bef1a238755aa8f1fbba54970c`; Verify web run `39771570775` and
Private runner qualification `39771570791` passed. The source branch remains
preserved. No database was connected or modified, and no file, branch, record,
or deployment was deleted. `QUAL-WEB-006` remains unchecked for human
screen-reader, paid/organization, large-dataset, supported-browser,
field-performance, and independent/customer acceptance gates. Score remains
**239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-006-table-semantics-pr232-2026-10-22.md`.

**Current continuation patch (2026-10-22):** Web commit
`2b4e202b303d74129342ffdd4622f3d9c4c7c7f1` adds a preflight validation to the
QUAL-WEB-005 reviewed deletion worker: malformed customer-held digest
inventory now blocks before any destructive adapter call. The focused worker
suite passed **16/16**; the full Web suite passed **893/893** with **24
explicit skips**; typecheck and diff check passed; all named hosted checks
passed. PR #231 merged normally as
`f61f15e8046969952bb7f700ea934683bf6b4281`, preserving the source branch. No
database was connected or modified. `QUAL-WEB-005` remains unchecked for
legal/consent, production authorization, restore/rollback, reconciliation, and
independent acceptance. Score remains **239 checked / 41 open / 280 total
(85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-005-digest-inventory-preflight-pr231-2026-10-22.md`.

**Current implementation batch (2026-10-22):** `QUAL-WEB-005` received a
substantive deletion-boundary repair in Web commit
`bac88808473cf90730810347d5ced0c2df8b4699`. Customer-held digest registration
and deletion-request creation now share the user-scoped advisory lock used by
the reviewed worker; duplicate registrations remain idempotent and new digest
mutations are rejected once deletion is pending. Focused privacy/deletion
contracts passed **15/15**; the full Web suite passed **893/893** with **24
explicit skips**; typecheck and diff check passed; hosted Verify
`39767070146` and Private runner qualification `39767070242` passed. PR #230
merged normally as `38635e52bb2ce9db5b1804986c12ef9d7b897f15`, with the source
branch preserved. The owner-provided test URL was remote Neon rather than an
isolated `verglos_test` database, so the destructive deletion integration test
was not run and no database was touched. `QUAL-WEB-005` remains unchecked for
legal/consent, production authorization, restore/rollback, reconciliation, and
independent acceptance. Score remains **239 checked / 41 open / 280 total
(85.4%)**. Evidence:
`docs/shipping/evidence/qual-web-005-digest-registration-deletion-lock-pr230-2026-10-22.md`.

**Current GitHub execution batch (2026-10-22):** The real CLI branch was
promoted as PR #158 and merged normally as `145ff5d9`; its Platform matrix,
Self-scan, and Standard validation workflows all passed. The real Web branch
was promoted as PR #229 and merged normally as `939ea4c2`. A concrete hosted
failure was repaired before merge: the private-runner PostgreSQL service now
uses the pinned Google mirror rather than the failing public-ECR path, and the
Web dependency audit is clear of high/critical findings after the locked
`follow-redirects` override. Verify web and Private runner qualification both
passed at `08750cb`. This makes the implementation visible on GitHub without
changing any backlog checkbox; the complete row contracts still determine the
score. Evidence:
`docs/shipping/evidence/github-pr-158-229-merge-qualification-2026-10-22.md`.

**Current implementation batch (2026-10-22):** `DIST-001` received a real
CLI archive-boundary hardening commit `e44ce8a673fb1d9119a3231f896d0f86a00cdc3c`.
The packed-manifest audit now rejects non-regular tar members such as symlinks
and hard links, and the regression is wired into both self-scan and publish
workflow test commands. The focused suite passed **9/9**; the broader release
contract suite passed **37/37**; build passed **8/8**; clean packing produced
**7/7** public archives; packed-manifest and clean-consumer qualification
passed, including signed bounded A1 execution and no implicit engine install.
This advances the code-side queue only, so `DIST-001` remains unchecked for
LOCAL/HUNT/RECORD dependencies and final legal/release qualification. Score
remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/dist-001-current-head-archive-member-qualification-2026-10-22.md`.

**Current continuation result (2026-10-22):** The next implementation row is
`ENT-CLI-001`, selected because its repository-side private-runner contract is
fully testable in a clean current-head CLI worktree. CLI `72190aca` passed
frozen-lockfile installation, workspace build **8/8**, workspace typecheck
**14/14**, package typecheck, package tests with exit **0**, and diff check.
The row is not checked because its complete contract still requires
operational enrollment credential exchange, an authorized enterprise runner
execution/result reconciliation, cross-platform operational evidence,
independent review, and enterprise acceptance. The exact Web Preview at
`cb2302179533a7bc73eccbcb17b0c350685cc5cc` also reached Ready with **49/49**
pages, but its public catalog has Studio inactive and the authenticated
client-workspace route correctly requires authentication. The implementation
queue continues across every eligible non-AppSec row; those acceptance
conditions stay recorded in the evidence ledger while code, tests, workflows,
and qualification artifacts are completed. Score remains **239 checked / 41
open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/ent-cli-001-current-head-qualification-2026-10-22.md`
and `docs/shipping/evidence/studio-cli-001-current-head-preview-2026-10-22.md`.

**Current implementation batch (2026-10-22):** `ACCEPT-002/003` now runs
only against explicitly selected clean source worktrees and records exact
source status. CLI `5072204f` passed **310/312** with 2 skips and 0 failures;
Web `cb23021` passed **949/979** with 30 skips and 0 failures; composed
Studio/Enterprise/Team/quality substrates passed **74/74**; all **12/12**
story mappings executed. The refreshed evidence bundle contains **21** hashed
files with a passed secret scan. Evidence:
`docs/shipping/evidence/accept-002-003-clean-head-verification-2026-10-22.md`.

**Current implementation batch (2026-10-22):** `DIST-003` received a
repository-side implementation commit `5072204f` (`feat(release): make
checksum generation reproducible`). The publish workflow now calls the tested
`generate-release-checksums.mjs` script; its focused release contract suite
passed **11/11** and `git diff --check` passed. This advances the eligible
implementation queue without changing registry, publication, provider,
Production, customer, legal, or AppSec state. Evidence:
`docs/shipping/evidence/dist-003-current-head-checksum-generation-2026-10-22.md`.

**Current implementation batch (2026-10-22):** `ACCEPT-003` evidence-bundle
generation now includes the current ENT runner, Studio Preview, and DIST-003
qualification packets. Commit `c4e3da67` updates the private bundle generator
and regenerated `acceptance-evidence-bundle-2026-10-03.json`; the command
reported **20** hashed evidence files and a passed secret scan. Evidence
coverage advances with the implementation queue; score remains **239 checked /
41 open / 280 total (85.4%)**.

**Latest continuation result (2026-10-21):** `STUDIO-CLI-001` received a
current-head Web tenant-boundary repair in commit
`cb2302179533a7bc73eccbcb17b0c350685cc5cc`. The client-workspace route no
longer imports raw `getDb()` for a separate commercial lookup; the centralized
authorized capability result carries the typed plan, and the route uses its
Studio allowance while failing closed with `503` when that plan is unavailable.
The focused Studio/auth/tenant suite passed **41/41**; the full Web suite
passed **893/893** with **24 explicit skips** and no failures; typecheck,
Drizzle schema check, **43** ordered migrations, diff check, and a fresh
detached Next build generating **49/49** pages all passed. The exact current
source had exposed the defect as one failed tenant-boundary contract before
the repair, so this is substantive implementation progress. The row remains
unchecked for the approved numeric paid/non-production hosted allowance and
authorized Studio recipient/customer acknowledgement with hosted/audit
evidence. No deployment, provider, payment, database, customer, legal,
registry, or AppSec state changed. Score remains **239 checked / 41 open / 280
total (85.4%)**. Evidence:
`docs/shipping/evidence/studio-cli-001-current-head-tenant-scope-repair-2026-10-21.md`.

**Latest continuation result (2026-10-21):** `QUAL-CLI-006` was requalified
from clean CLI merge `72190acae81b454a4a88a0ea8d222c8981ac9a3f` after a fresh
build and package. Build **8/8**, typecheck **14/14**, official in-toto 3.0.0
verification **7/7** exact archive products, clean-consumer installation, and
upgrade/rollback `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` all passed. The in-toto
keys were ephemeral and the run was local, so hosted exact-head matrix,
trusted keyless identity, protected publication, legal clearance, independent
review, customer evidence, and final acceptance remain open. No checkbox or
external state changed. The local rollback/revocation rehearsal also passed
exit **0** across five bounded operations with two historical records
preserved; no provider or registry call occurred. Score remains **239 checked / 41 open / 280 total
(85.4%)**. Evidence:
`docs/shipping/evidence/qual-cli-006-standard-validation-contract-2026-10-21.md`.

**Latest continuation result (2026-10-21):** `QUAL-CLI-006` completed the
local official-validator/tool-integration slice from clean CLI merge
`72190acae81b454a4a88a0ea8d222c8981ac9a3f`. A temporary Temurin OpenJDK JRE
17.0.20.1 and the workflow-pinned SPDX Tools 2.0.7 JAR enabled strict
artifact-root validation to pass **4/4**, exit **0**: SARIF, CycloneDX, SPDX,
and offline Cosign all passed. The artifact root and Cosign key were
disposable; this is not keyless Fulcio/Rekor release trust. The row remains
unchecked for trusted keyless identity, protected publication, legal
clearance, independent review, hosted/customer evidence, and final acceptance.
No checkbox or external state changed. The score remains **239 checked / 41
open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-cli-006-standard-validation-contract-2026-10-21.md`.

**Latest continuation result (2026-10-21):** `QUAL-CLI-006` was exercised
against a disposable generated artifact root from clean CLI merge
`72190acae81b454a4a88a0ea8d222c8981ac9a3f`. Official Microsoft SARIF Multitool
5.8.0, CycloneDX CLI 0.33.1, and Cosign 2.6.0 passed their checks: **3
passed / 1 unsupported / 0 failed**. SPDX was unsupported because the host
has no Java runtime; strict mode correctly exited **1**. The Cosign check used
an ephemeral offline key and is not keyless release trust. This advances real
artifact-root/tool integration evidence, but the row remains unchecked for
official SPDX validation, trusted keyless identity, protected publication,
legal clearance, independent review, hosted supported-platform evidence, and
final acceptance. No checkbox or external state changed. The score remains
**239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-cli-006-standard-validation-contract-2026-10-21.md`.

**Latest continuation result (2026-10-21):** `STUDIO-CLI-001` received
substantive Web implementation and bounded hosted Preview qualification. Web
commits `938dd7e` and `a3819c1` add and correct the fail-closed Preview Studio
numeric fixture, safe client-projection custody, usage admission, tenant
isolation, and handoff acknowledgement path. The final clean Preview deploy
`dpl_FZpAVi1Hbj8iQhpuyyvb9gUSucoe` reached Ready with **49/49** static pages;
focused tests passed **27/27** and typecheck/diff checks passed. A synthetic
Preview workspace, projection, privacy rejection, cross-tenant refusal, and
handoff acknowledgement were observed through real routes. The row remains
unchecked because the recipient is owner-controlled synthetic evidence rather
than independent customer/recipient acceptance. No Production or AppSec state
changed. The score remains **239 checked / 41 open / 280 total (85.4%)**.

**Next continuation result (2026-10-21):** `ENT-CLI-001` received a fresh
owner-authorized synthetic Preview lifecycle qualification from the clean Web
source `a3819c1`. Deployment `dpl_ETFtQmHWA9m5EL77n4rDBX254icz` reached Ready
with **49/49** static pages. The runner completed enrollment, one-time
redemption, activation, bounded tenant/runner/target-bound job delivery,
source-free result upload, exact replay idempotency, malformed-result refusal,
cross-tenant refusal, and final empty poll. This advances deployed operational
evidence only; the row remains unchecked for authorized enterprise acceptance,
complete cross-platform operational acceptance, and independent runner/Hunt
isolation review. No raw credentials, customer data, Production, provider,
legal, or AppSec state changed. The score remains **239 checked / 41 open /
280 total (85.4%)**. Evidence:
`docs/shipping/evidence/ent-cli-001-hosted-runner-qualification-2026-10-21.md`.

**Next continuation result (2026-10-21):** `DIST-001` was requalified from
the exact merged CLI source `origin/main`
`72190acae81b454a4a88a0ea8d222c8981ac9a3f` in a clean detached worktree.
With the documented ephemeral cross-platform optional-package setup, build
passed **8/8**, focused package tests **8/8**, package contents/packed
manifests and clean-consumer checks passed for **7/7** archives, and the forced
workspace graph completed **23/23** Turbo tasks with no failures. The row
remains unchecked because LOCAL/HUNT/RECORD dependencies and final
legal/release acceptance remain open; Docker/A2 integration tests are explicit
environment-gated skips. No registry, Production, provider, customer, legal,
or AppSec state changed. The score remains **239 checked / 41 open / 280
total (85.4%)**. Evidence:
`docs/shipping/evidence/dist-001-current-origin-main-qualification-2026-10-21.md`.

**Next continuation result (2026-10-21):** `DIST-002` current release
workflow contracts were requalified from CLI `origin/main`
`72190acae81b454a4a88a0ea8d222c8981ac9a3f`: workflow/artifact/tag/origin tests
passed **10/10** with zero failures/skips. The strict license gate correctly
exited **2** for seven unresolved review entries. The row remains unchecked
for DIST-001, protected publisher/environment approval, legal/license
clearance, and actual immutable publication/attestation. No npm, Production,
provider, customer, legal, or AppSec state changed. The score remains **239
checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/dist-002-current-origin-main-contract-2026-10-21.md`.

**Current external-state result (2026-10-21):** A read-only GitHub check
confirmed the protected `release` environment has a required reviewer rule for
`anuragyadav-git` and a branch-policy rule. This is configuration evidence
only; no reviewer approval, trusted npm publisher enrollment, immutable
publication, workflow run, or registry mutation was inferred or initiated.
`DIST-002` remains unchecked and the score remains **239 checked / 41 open /
280 total (85.4%)**. Evidence:
`docs/shipping/evidence/dist-002-current-origin-main-contract-2026-10-21.md`.

**Current continuation result (2026-10-21):** Current Web source `a3819c1`
passed truth-registry tests **34/34**, landing-release contract tests **4/4**,
public-release-smoke contract tests **2/2**, and the actual source smoke report
with **16 routes**, **22/22** publishable claims, **2** proof assets, and **0**
issues. This advances FINAL-WEB-007/008 code-side evidence only:
FINAL-WEB-007 still lacks a browser-produced capture, human screen-reader,
supported-environment, and field-CWV evidence, while FINAL-WEB-008 remains
dependent on the final acceptance/release gates. No checkbox changed; the
score remains **239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/final-web-007-008-current-source-qualification-2026-10-21.md`.

**Browser qualification result (2026-10-21):** The existing authenticated
Chrome tab performed a read-only audit of public `https://verglos.com/`.
Desktop Lighthouse passed **61/61** and mobile **60/60**; Accessibility, Best
Practices, SEO, and Agentic Browsing scored **100/100** in both modes. Cold
Fast-4G/4×CPU traces measured desktop LCP **727 ms**, mobile LCP **594 ms**,
and CLS **0.00** in both modes. The protected exact Preview redirected to
Vercel login and was not bypassed. This is production lab evidence only;
FINAL-WEB-007 remains open for the six-path capture, human/field evidence,
and final acceptance. Evidence:
`docs/shipping/evidence/final-web-007-production-browser-audit-2026-10-21.md`.

**DIST-002 dependency-remediation result (2026-10-21):** A disposable exact
`sigstore@5.0.0` CLI experiment against merged source
`72190acae81b454a4a88a0ea8d222c8981ac9a3f` passed workspace build **8/8** and
license inventory tests **6/6**, but the strict license gate still exited **2**
for seven blockers. Sigstore 5 requires Node `^22.22.2 || ^24.15.0 ||
>=26.0.0`, which narrows the current Node `>=20` contract; the experiment was
discarded. No source, lockfile, publication, legal, provider, customer,
Production, or AppSec state changed. `DIST-002` remains open. Evidence:
`docs/shipping/evidence/dist-002-sigstore5-remediation-check-2026-10-21.md`.

**Six-path audit and source remediation result (2026-10-21):** The same
read-only browser procedure covered `/`, `/docs`, `/detectors`, `/proof`,
`/verify`, and `/checkout` at desktop/mobile throttled conditions and found
concrete deployed audit failures: table headers, proof contrast, verify
metadata drift, and checkout metadata/provider-loading issues. Web commit
`70f69de` repairs the source contracts and adds regression coverage. Current
source qualification passed truth-registry **35/35**, landing **4/4**, public
smoke **2/2**, actual smoke **16 routes / 22/22 claims / 2 assets / 0 issues**,
typecheck, diff check, and a fresh detached **49/49** page build. The earlier
source-worktree build failure was limited to Next workspace-root inference
through the unrelated dirty parent `package.json`. No deployment or
Production mutation occurred; the exact Preview remains protected, INP/CrUX
and human/field evidence remain absent, and FINAL-WEB-007/008 stay open. No
checkbox changed; score remains **239 checked / 41 open / 280 total (85.4%)**.
Evidence:
`docs/shipping/evidence/final-web-007-six-path-browser-audit-2026-10-21.md`.

**QUAL-CLI-006 contract qualification result (2026-10-21):** Clean CLI
`origin/main` `72190acae81b454a4a88a0ea8d222c8981ac9a3f` passed the focused
standard-validation suite **7/7** and `pnpm typecheck` **14/14**. The suite
covers bounded official-tool invocation, redaction, unavailable-tool handling,
artifact-root confinement, and fail-closed malformed/symlinked/oversized
artifacts. The direct qualification command correctly rejected a missing
artifact-root argument; no official-validator or release acceptance pass was
claimed. `QUAL-CLI-006` remains open for the approved artifact bundle, trusted
keyless publication, legal/protected release, independent review, hosted
platform evidence, and final acceptance. No checkbox changed; score remains
**239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/qual-cli-006-standard-validation-contract-2026-10-21.md`.

**Current-source browser qualification result (2026-10-21):** The clean Web
commit `70f69de` was served locally and rechecked in the existing Chrome page
across the same six routes at desktop `1440x900` and mobile `390x844`, Fast 4G,
and 4× CPU. Chrome performance traces recorded **CLS 0.00** on every route;
desktop LCP was **428–657 ms** and mobile LCP was **623–1002 ms**. Direct DOM
checks confirmed titles/descriptions/canonicals, the scoped `/docs` table
headers, the strengthened `/proof` Boundary class, and `/checkout`'s
intentional `noindex, nofollow` plus zero pre-interaction Razorpay scripts.
All six paths had no console errors or warnings. This advances current-source
browser evidence only: no deployment or Production mutation occurred, and the
Lighthouse wrapper's contradictory local metadata warning is retained for
recheck rather than treated as a defect. No checkbox changed; score remains
**239 checked / 41 open / 280 total (85.4%)**. Evidence:
`docs/shipping/evidence/final-web-007-local-source-browser-qualification-2026-10-21.md`.

## 2. Authority and scope

Owner-provided company authorization and previously recorded evidence are
available for routing and must not be repeatedly requested. They do not permit
inventing a provider event, customer consent, legal opinion, field metric,
independent review, or production mutation. Reuse an existing evidence packet
when it actually satisfies the row; otherwise name the exact missing artifact.

The active product position is Verglos as a security layer for AI-generated
code: inspect, decide, prove, and monitor. Every public claim, plan, command,
dashboard, report, release artifact, and integration must remain bounded by
implemented behavior and its recorded evidence.

The private shipping repository is the ledger, not the implementation target.
All product logic belongs in the actual `verglos-web` or `verglos-cli` source
repository. Use a clean worktree of the corresponding real repository when a
dirty parent checkout would contaminate qualification. Do not work in the old
archive repository.

## 3. AppSec hold rule

The explicit hold roots are:

- `HUNT-008`, `HUNT-009`, `HUNT-010`, and `HUNT-011`;
- `QUAL-CLI-004`; and
- every later row whose own acceptance contract directly requires the
  independent Hunt isolation review or its result.

Classify dependencies row by row. Do not hold unrelated Studio, Enterprise,
distribution, Web, acceptance, final-copy, or provider work merely because
the Hunt review is pending. Do not check an AppSec-held row, replace its
review with an owner assertion, or claim that a green local test is an
independent security review.

If an AppSec-held row has an independent non-AppSec implementation defect, do
not split the row into a checkbox claim. Record the defect for the later
AppSec batch and move to the next dependency-ready non-AppSec row.

## 4. Top-to-bottom execution protocol

For each unchecked item in file order:

1. Read the complete row, its dependencies, acceptance conditions, and every
   referenced evidence packet.
2. Classify it as AppSec-held, dependency-blocked, externally evidenced, or
   dependency-ready and implementable.
3. If it is AppSec-held, record the exact review dependency and continue.
4. If it is dependency-ready, implement the whole row’s product contract in
   the actual Web/CLI repository. Do not stop at a UI shell, validator stub,
   fixture-only substitute, or documentation claim.
5. Add focused tests for success, refusal, authorization, tenant binding,
   replay/idempotency, malformed input, failure/rollback, and privacy paths
   required by that row. Add migration, schema, workflow, artifact, or
   configuration changes when the contract requires them.
6. Run focused tests followed by relevant package tests, typecheck, build,
   migration/order checks, public-boundary checks, artifact/package checks,
   hosted/provider/browser checks, or Docker checks required by the row.
7. Preserve exact source commit, command, exit status, deployment or artifact
   identity, digest, counts, limitations, and privacy boundary in a private
   evidence packet.
8. Check the backlog row only if every acceptance condition and every
   non-held dependency is satisfied. Otherwise leave it unchecked with the
   exact missing artifact, owner, next action, and release impact.
9. Recompute the score and reconcile the private tracker before moving to the
   next row.

Complete one row’s implementation and qualification before starting an
unrelated row. Multiple substantive commits may be used within one row; do
not scatter token-consuming micro-slices across the backlog.

## 5. What counts as real implementation

Acceptable work changes the original production path and its contract. It may
include server/client logic, CLI behavior, database schema/migrations, route
authorization, tenant scoping, lifecycle/replay handling, release tooling,
package boundaries, CI workflows, browser behavior, or bounded evidence
generation.

The implementation must:

- use the canonical plan, identity, subject, policy, record, entitlement, and
  evidence contracts already established by the repositories;
- fail closed on missing, stale, malformed, unauthorized, cross-tenant,
  replayed, or unsupported input where the contract requires it;
- preserve source privacy, secret redaction, digest binding, and auditability;
- expose limitations instead of converting unavailable evidence into a pass;
- use real production code paths in qualification, with synthetic data only
  where the row explicitly permits it; and
- include regression coverage that would fail if the boundary were removed.

Do not close a row by editing a checkbox, adding a generated status paragraph,
renaming a fixture, manufacturing a customer/provider result, or making an
empty/duplicate commit.

## 6. Evidence and ledger reconciliation

Every completed batch must update the existing private records as applicable:

- `docs/shipping/STATUS.md`;
- `docs/shipping/EXECUTION_LEDGER.md`;
- `docs/shipping/TRACEABILITY.md`;
- `docs/shipping/DECISIONS.md`;
- `docs/shipping/RELEASE_GATES.md`; and
- `docs/shipping/VERGLOS_V1_BACKLOG.md`.

Evidence belongs under the private `docs/shipping/evidence/` area when it
contains restricted commands, deployment identifiers, hosted results, owner
decisions, customer/recipient information, or operational details. Do not add
irrelevant public Markdown files to increase contribution count. A ledger
entry must point to real code, tests, artifacts, and limitations; it must not
upgrade partial qualification into acceptance.

The evidence packet for a checked row must state:

- row ID and acceptance mapping;
- implementation repository and exact commit(s);
- commands and exact pass/fail/skip results;
- provider, deployment, package, browser, or artifact identity when relevant;
- digest/version/configuration information without secrets;
- privacy and authorization scope;
- failures, skips, residual risks, and rollback behavior; and
- why the row is now fully satisfied.

## 7. Commit and repository policy

Preserve normal granular history. Use separate substantive commits for
logical implementation, regression coverage, and an evidence/ledger
reconciliation when those are genuinely separate reviewable changes. Use
normal branches and normal merges.

Never squash, rebase, force-push, create empty or duplicate commits, or make
commits solely to inflate contribution counts. Do not spend time or tokens on
unrelated Markdown. Public repositories receive public-safe source and tests;
restricted evidence remains in the private shipping repository.

Use the existing authenticated Chrome session only when browser evidence is
actually required. Do not open another Chrome window or tab. Prefer local
commands, repository tests, and authorized CLI/API paths for all other work.
Do not expose secrets, customer source, raw credentials, or private tracker
contents in public commits, logs, or final responses.

## 8. Progress report required after each batch

Every continuation report must state, using current evidence:

- the backlog row fully implemented;
- rows newly checked, if any;
- rows still open and the exact non-AppSec reason;
- AppSec-held rows and their missing independent-review artifact;
- exact commits, normal merges, deployments, and evidence paths;
- commands and qualification results;
- public/private boundary and residual risks;
- the next unchecked row in file order; and
- the recomputed `checked / open / total` score.

“Implemented” and “qualified” are not synonyms for “checked.” A row remains
open when its own contract still requires an external artifact, even if its
code-side implementation is complete. That missing artifact must not be
mislabelled as AppSec.

## 9. Completion condition

This active goal is achieved only when:

1. every unchecked backlog row that is not AppSec-held has been implemented,
   qualified, evidenced, and checked;
2. every non-commit gate outside AppSec has a real decision or artifact and is
   reconciled in the private tracker;
3. all remaining unchecked rows are explicitly AppSec-held, with the exact
   independent review dependency recorded;
4. Web, CLI, package, release, entitlement, Studio, Enterprise, SCM, privacy,
   accessibility, acceptance, and final public-truth claims match the actual
   source and evidence;
5. no placeholder, owner assertion, local-only result, or artificial commit is
   being used as a substitute for a row contract; and
6. the final private score, evidence index, residual risks, and next AppSec
   action are recorded.

The goal must not be marked complete while any satisfiable non-AppSec row is
open. It is acceptable for the final score at that point to retain the
explicit AppSec hold rows as open; that is the intended completion boundary of
this goal.

## 10. Canonical files for every continuation

Read before changing backlog state:

- `docs/shipping/VERGLOS_V1_BACKLOG.md`
- `docs/shipping/EXECUTION_LEDGER.md`
- `docs/shipping/TRACEABILITY.md`
- `docs/shipping/DECISIONS.md`
- `docs/shipping/RELEASE_GATES.md`
- `docs/shipping/STATUS.md`
- `docs/shipping/FINAL_V1_PRODUCT_CONTRACT_APPROVAL_DRAFT_2026-10-12.md`
- `docs/shipping/FINAL_V1_PAYING_VALUE_BLUEPRINT_2026-10-13.md`
- `docs/shipping/FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md`

Implement only in the current `verglos-web` and `verglos-cli` repositories or
their clean worktrees. Keep this file as the single active goal and keep the
private ledger as the authoritative evidence and backlog record.
