# Verglos shipping decisions

## 2026-10-19 · retain FINAL-WEB-007 after qualification-substrate implementation

- **Decision:** Accept Web PR #227, merged normally as
  `47518c774a339e81ba66968e9cd6dbe0249b5e2`, as substantive original
  implementation and regression evidence, while retaining `FINAL-WEB-007`
  unchecked.
- **Observed:** Separate commits `d5a3f8f` and `330280d` add strict capture
  parsing and desktop/mobile landing qualification. Landing tests **4/4**,
  truth registry **34/34**, public smoke **22/22 claims / 0 issues**, public
  smoke tests **2/2**, typecheck, build **49/49**, diff check, and hosted PR
  checks **8/8** passed.
- **Reason:** Code and local fixture tests do not supply the real browser,
  screen-reader, field-CWV, customer, or final-acceptance evidence required by
  the row. The CLI deliberately fails closed until that capture exists.
- **Disposition:** Keep `FINAL-WEB-007` unchecked; score remains **239/41/280
  (85.4%)** and AppSec/Hunt state is unchanged.
- **Evidence:** `evidence/final-web-007-landing-release-qualification-2026-10-19.md`.

## 2026-10-19 · retain ACCEPT-002/003 after current-head substrate run

- **Decision:** Accept the current twelve-story verifier and private bundle as
  substantive product-contract evidence while retaining ACCEPT-002 and
  ACCEPT-003 open.
- **Observed:** CLI **310/312** with 2 skips, Web **949/979** with 30 skips,
  composed Web substrates **74/74**, all exit `0`; all twelve mappings
  executed; the 17-file bundle secret scan passed.
- **Reason:** The harness explicitly proves substrate execution only. It does
  not create hosted/provider/customer execution, reviewer sign-off, browser-
  human or field-CWV evidence, or AppSec qualification.
- **Disposition:** Keep ACCEPT-002/003 unchecked. Score remains **239/41/280
  (85.4%)**; AppSec/Hunt state and all external gates are unchanged.
- **Evidence:**
  `evidence/accept-002-003-current-head-substrate-bundle-2026-10-19.md`.

## 2026-10-19 · retain QUAL-WEB-005/006 after current-head qualification

- **Decision:** Accept the clean current Web-head qualification as substantive
  original-logic evidence while retaining both qualification rows open.
- **Observed:** Private-runner contracts passed **24/24**; privacy/deletion/
  retention contracts passed **46/46**; typecheck, 43-migration ordering,
  49-page production build, and diff check passed.
- **Boundary:** The run used a disposable worktree and synthetic/local
  fixtures. The package requested Node `22.x`, while this local run used Node
  `v26.4.0`; hosted supported-runtime checks remain separate. No Production,
  provider, customer, credential, or source-upload state changed.
- **Reason:** Code qualification does not supply QUAL-WEB-005 legal/consent,
  production migration/deletion, restore/rollback, reconciliation, or
  independent acceptance; nor QUAL-WEB-006 human screen-reader, complete
  authenticated paid/org, large-data, supported-browser, field-CWV, or
  independent/customer evidence.
- **Disposition:** Keep both rows unchecked. Score remains **239/41/280
  (85.4%)**; AppSec/Hunt state is unchanged.
- **Evidence:**
  `evidence/qual-web-005-006-current-merged-head-2026-10-19.md`.

## 2026-10-19 · retain QUAL-CLI-006 after current-head qualification

- **Decision:** Accept the current merged-head qualification as substantive
  evidence while retaining `QUAL-CLI-006` unchecked.
- **Observed:** CLI merge `11734a45740a893c307606e8f3d3f316711abd9e` passed
  build **8/8**, release/package contracts **15/15**, rollback rehearsal, and
  all **12/12** hosted checks covering the nine platform cells, official
  standard/provenance validation, in-toto binding, and self-scan.
- **Boundary:** No npm publish, tag, registry mutation, provider/signing
  operation, customer source use, or production write occurred.
- **Reason:** The row still requires trusted keyless publication identity,
  protected publisher approval, legal clearance, independent AppSec review,
  and final acceptance.
- **Disposition:** Score remains **239/41/280 (85.4%)**; no AppSec-held state
  changed.
- **Evidence:**
  `evidence/qual-cli-006-current-merged-head-2026-10-19.md`.

## 2026-10-19 · retain distribution rows after current-head qualification

- **Decision:** Accept the current-head release-contract qualification as
  substantive distribution evidence; retain `DIST-001`, `DIST-002`,
  `DIST-003`, and `DIST-006` unchecked.
- **Observed:** Exact merged CLI head `11734a45740a893c307606e8f3d3f316711abd9e`
  passed locked install, **8/8** build tasks, and **15/15** publish,
  release-tag, artifact, package-surface, and rollback contract tests. The
  local rollback rehearsal covered five boundaries and preserved two historical
  records with exit `0`.
- **Boundary:** No npm/registry publication, tag, signing provider, Hunt feed,
  Vercel deployment, or production rollback was performed. The pre-build test
  failure was an incomplete local setup and passed after the required build.
- **Reason:** Code-side qualification does not create protected publisher
  approval, legal/release clearance, immutable publication/attestation, or
  authenticated rollback/revocation acceptance.
- **Disposition:** Score remains **239/41/280 (85.4%)**; no AppSec-held state
  changed.
- **Evidence:**
  `evidence/dist-current-head-release-contracts-2026-10-19.md`.

## 2026-10-19 · retain ENT-CLI-001 after original credential exchange ships

- **Decision:** Accept Web PR #225 and CLI PR #152 as substantive original
  runner-enrollment implementation; retain the existing row state and score.
- **Observed:** Web now performs one-time token redemption, digest-only
  credential persistence, exact tenant/runner binding, expiry, and runner-only
  poll/result authentication. CLI now enrolls through the fixed route and uses
  the persisted runner bearer. Web passed 24/24 focused contracts and SQL
  lifecycle 1/1; CLI passed 10/10 focused tests; both hosted matrices and
  required security/provenance/release checks passed.
- **Shipping:** The PRs merged normally without squash as
  `2c07237845f0e52061dc52c99c21212615390177` (Web) and
  `11734a45740a893c307606e8f3d3f316711abd9e` (CLI).
- **Reason:** Repository code and CI cannot by themselves provide an
  authorized deployed-tenant enrollment, approved runner execution/result
  reconciliation, enterprise acceptance, or independent review. No production
  credential or customer runner was used.
- **Disposition:** Keep `ENT-CLI-001` unchecked. Score remains **239/41/280
  (85.4%)**. AppSec/Hunt remains the independent held set; this decision does
  not waive it or close unrelated external rows.
- **Evidence:**
  `evidence/ent-cli-001-runner-credential-exchange-pr152-pr225-2026-10-19.md`.

## 2026-10-19 · retain STUDIO-CLI-001 after allowance enforcement

- **Decision:** Accept Web PR #224 as substantive original-logic progress;
  retain the existing score and row state.
- **Observed:** Hosted client projection custody now reserves and commits the
  existing monthly record allowance with projection-digest idempotency and
  fail-closed 403/429/503 outcomes. Local 24/24 focused tests, disposable SQL
  route integration 1/1, typecheck, 48-page build, and all hosted checks pass.
  The initial PostgreSQL hosted attempt failed before tests on an ECR data-limit
  response; rerun job `118039169321` passed.
- **Reason:** Code-side allowance enforcement does not supply the row's required
  numeric paid/non-production entitlement or authorized Studio recipient/
  customer acceptance.
- **Disposition:** Keep `STUDIO-CLI-001` unchecked. Score remains **239/41/280
  (85.4%)**; AppSec/Hunt rows and unrelated external gates remain unchanged.
- **Evidence:**
`evidence/studio-cli-001-projection-allowance-pr224-2026-10-19.md`.

## 2026-10-19 · retain STUDIO-CLI-001 after hosted usage release hardening

- **Decision:** Accept Web commits `c9dd749` and `f26213c`, preserved by normal
  PR #226 merge `c8dc05a57a77d2332856085c70833ceced0599f6`, as substantive
  original-logic progress; retain the existing row state and score.
- **Observed:** Receipt and client-projection custody now have a scoped
  transaction boundary and deterministic hosted-record usage release on
  persistence failure or raced scope conflict. Full Web tests passed
  **894/918** with 24 skips and zero failures; both route integrations passed
  **1/1** against the pinned disposable PostgreSQL image; typecheck, 49-page
  build, and diff check passed.
- **Reason:** The implementation does not create the row's numeric
  paid/non-production entitlement or authorized Studio recipient/customer
  acceptance observation.
- **Disposition:** Keep `STUDIO-CLI-001` unchecked. Score remains
  **239/41/280 (85.4%)**; AppSec/Hunt rows and unrelated external gates remain
  unchanged.
- **Evidence:**
  `evidence/studio-cli-001-hosted-usage-release-2026-10-19.md`.

## 2026-10-19 · retain score after draft-first policy creation hardening

- **Decision:** Accept Web PR #223 as substantive original-logic hardening;
  retain the existing score and all row states.
- **Observed:** Policy creation now refuses direct `published`/`retired`
  insertion and creation-time `effectiveFrom`; the existing transition route
  remains the only publish/effective-date path. The focused contracts passed
  45/45, typecheck passed, and the production build generated 48/48 pages.
  PR #223 hosted checks passed after the isolated PostgreSQL job was rerun;
  the first attempt failed before tests on the GitHub Actions ECR data-limit
  response `toomanyrequests: Data limit exceeded`.
- **Shipping:** Merge PR #223 normally, without squash, as
  `a1854ad1cc5ba6fcb97d5784045ddd5e7ee7e001` after all required checks passed.
- **Reason:** `TEAM-WEB-003` was already checked, and this change does not
  produce numeric hosted entitlement, recipient/customer, provider, legal,
  release, field, or independent AppSec evidence.
- **Disposition:** No checkbox changes. Score remains **239/41/280 (85.4%)**;
  Hunt/AppSec rows remain held, while Studio/Enterprise/distribution and
  acceptance rows retain their exact external blockers.
- **Evidence:**
  `evidence/team-web-003-draft-first-policy-creation-2026-10-19.md`.

## 2026-10-19 · retain FINAL-WEB-007/008 after public-surface qualification

- **Decision:** Accept Web PR #222 as a substantive public release and
  accessibility-surface advance, while retaining `FINAL-WEB-007` and
  `FINAL-WEB-008` unchecked.
- **Observed:** The public Release Record receipt route now has explicit
  no-index metadata and is covered by the public release-smoke manifest. The
  global stylesheet now honors reduced-motion preferences. Focused
  route/smoke/motion tests passed **7/7**, command smoke reported 16 routes,
  22/22 publishable claims, 2 proof assets, and 0 issues; typecheck, the
  optimized 48-page build, and diff check passed.
- **Reason:** This proves code-side route truth, crawl-boundary behavior, and
  reduced-motion handling, not human/browser/field acceptance,
  hosted/customer acceptance, legal/release approval, final acceptance, or a
  production release decision.
- **Disposition:** Keep `FINAL-WEB-007`, `FINAL-WEB-008`, and dependent final
  rows open. No AppSec/Hunt state changed; score remains **239/41/280
  (85.4%)**.
- **Evidence:**
  `evidence/final-web-008-public-record-route-qualification-2026-10-19.md`.

## 2026-10-19 · retain QUAL-WEB-006 after dashboard boundary implementation

- **Decision:** Accept Web PR #220 as a substantive accessibility and failure
  state implementation advance; retain the backlog row open.
- **Observed:** Normal merge `96a6228` preserves `61d40ed`. Focused tests 2/2,
  typecheck, isolated 48/48-page build, public-boundary audit, hosted
  cross-platform matrix, isolated PostgreSQL, typecheck/schema, Vercel,
  Preview Comments, and GitGuardian passed.
- **Reason:** These checks do not replace human screen-reader verification,
  complete authenticated/large-dataset coverage, field-CWV observation, or
  final acceptance.
- **Disposition:** Keep `QUAL-WEB-006` unchecked. AppSec/Hunt remains held;
  score remains **235/45/280 (83.9%)**.
- **Evidence:**
  `evidence/qual-web-006-dashboard-boundaries-2026-10-19.md`.

## 2026-10-19 · retain ENT-CLI-001 after cross-platform qualification

- **Decision:** Accept Web PR #219 as a substantive implementation and
  qualification advance; preserve the row as open.
- **Observed:** Normal merge `bbe70d4f` preserves implementation `61d4ff7`.
  Hosted CI passed Ubuntu, macOS, Windows, isolated PostgreSQL, existing Web
  typecheck/schema, Vercel, Preview Comments, and GitGuardian. Local clean
  qualification passed 24/24 private-runner tests, typecheck, boundary audit,
  and isolated E2E 1/1.
- **Reason:** A reproducible CI matrix does not prove operational enrollment,
  approved enterprise execution and result reconciliation, independent review,
  or authorized enterprise acceptance. No credential or customer/Production
  runner was used.
- **Disposition:** Keep `ENT-CLI-001` unchecked. AppSec/Hunt remains held;
  score remains **235/45/280 (83.9%)**.
- **Evidence:**
  `evidence/ent-cli-001-cross-platform-qualification-2026-10-19.md`.

## 2026-10-19 · retain STUDIO-CLI-001 after TEAM-CLI-001 closure

- **Decision:** Confirm `TEAM-CLI-001` checked and advance the strict queue to
  `STUDIO-CLI-001`.
- **Observed:** The existing owner-controlled Billing page reports the
  organization as `free`, with no active paid license, no numeric hosted-record
  allowance, and no supported Studio checkout. The read-only checkout route
  offers only Pro at ₹2,809.43/month with Cards and no Test Mode control. The
  hosted custody route rejects a valid redacted receipt with
  `allowance_not_configured` before persistence.
- **Reason:** A code-side implementation pass or owner assertion cannot replace
  a supported non-production entitlement and an actual recipient acceptance
  observation. Activating inactive Studio or bypassing the provider would make
  the evidence false.
- **Disposition:** Keep `STUDIO-CLI-001` unchecked. AppSec/Hunt remains the
  explicit hold set. Score is **235/45/280 (83.9%)**; no public, billing,
  Production, customer, or AppSec state changed.
- **Evidence:** Existing Studio qualification packet plus the owner-session
  Billing/checkout observation in
  `evidence/studio-cli-001-checkout-boundary-2026-10-19.md`.

## 2026-10-18 · retain TEAM-WEB-006 after live SCM reconciliation

- **Decision:** Accept Web PR #204 and the production repository cutover as a
  substantive implementation advance, while retaining the parent row open.
- **Observed:** The qualification project now points to
  `Top-Notchh-Solutions/verglos-cli`. The owner-authorized reconciliation
  returned one created active binding and one revoked stale archive binding.
  The production dashboard shows the active CLI binding and revoked archive
  record without secrets or raw payloads.
- **Reason:** Reconciliation is necessary but does not prove provider check
  delivery, retry behavior, delivery evidence, or customer acceptance.
- **Disposition:** `TEAM-WEB-006` and `GITHUB-WEB-001` remain unchecked. No
  AppSec state changed; score remains **232/48/280 (82.9%)**.
- **Evidence:** `evidence/team-web-006-scm-reconciliation-pr204-production-2026-10-18.md`.

## 2026-10-18 · retain TEAM-WEB-006 after SCM dashboard implementation

- **Decision:** Accept Web PR #203 as a substantive implementation advance
  while retaining `TEAM-WEB-006` and `GITHUB-WEB-001` unchecked.
- **Observed:** The tenant-scoped SCM dashboard exposes bounded installation
  identity/lifecycle metadata and excludes encrypted secret/token fields and
  raw provider payloads. Normal merge, focused test, build, and hosted checks
  passed.
- **Reason:** A dashboard projection does not establish live provider
  delivery, retries, reconciliation, or customer acceptance.
- **Disposition:** No checkbox or AppSec state changes. Score remains
  **232/48/280 (82.9%)**.
- **Evidence:** `evidence/team-web-006-scm-dashboard-pr203-2026-10-18.md`.

## 2026-10-18 · retain TEAM-WEB-006 after webhook configuration check

- **Decision:** Accept the owner-visible App configuration as provider
  readiness evidence, but keep `TEAM-WEB-006` and GitHub lifecycle/delivery
  rows unchecked.
- **Observed:** App ID `5367509` has the active SSL-verified production webhook,
  Checks write/Metadata read permissions, and Check Run/Check Suite events. A
  configured secret was not exposed. Recent merge check-runs showed GitHub
  Actions only, not a provider check from this App.
- **Reason:** Configuration is not a delivered check, retry, or reconciliation
  record.
- **Disposition:** No checkbox or AppSec state changes. Score remains
  **232/48/280 (82.9%)**.
- **Evidence:** `evidence/team-web-006-github-app-webhook-config-2026-10-18.md`.

## 2026-10-18 · retain TEAM-WEB-006 after personal App scope verification

- **Decision:** Accept the personal-account scope observation as a provider
  configuration advance while retaining `TEAM-WEB-006` and `GITHUB-WEB-001`
  unchecked.
- **Observed:** Installation `172664847` owned by `anuragyadav-git` selects
  only `anuragyadav-git/verglos-web`; its metadata/check permissions match the
  organization installation's least-privilege boundary.
- **Reason:** Correct scope is necessary but does not establish live webhook or
  check delivery, retry/reconciliation, or acceptance.
- **Disposition:** No checkbox or AppSec state changes. Score remains
  **232/48/280 (82.9%)**.
- **Evidence:** `evidence/team-web-006-github-app-personal-scope-2026-10-18.md`.

## 2026-10-18 · retain TEAM-WEB-006 after GitHub App scope correction

- **Decision:** Accept the organization installation scope correction as
  provider-readiness progress, but keep `TEAM-WEB-006` unchecked.
- **Observed:** The owner session saved a successful update leaving only
  `Top-Notchh-Solutions/verglos-cli` selected, removing the stale archive, and
  retaining least-privilege metadata/check permissions. `verglos-web` was not
  offered by the organization picker.
- **Reason:** Scope configuration does not prove delivery to the working web
  repository, which is not available under this organization installation.
  Cutover, reconciliation, and complete acceptance remain open.
- **Disposition:** No checkbox or AppSec state changes. Score remains
  **232/48/280 (82.9%)**.
- **Evidence:** `evidence/team-web-006-github-app-scope-recheck-2026-10-18.md`.

## 2026-10-18 · retain TEAM-CLI-001 after signed offline-cache hardening

- **Decision:** Accept CLI PR #133 as a bounded implementation advance and keep
  `TEAM-CLI-001` unchecked.
- **Observed:** The normal merge `4aa62286` preserves implementation
  `df615be3` and regression test `77de3ab5`; offline cache use now re-verifies
  the original signed envelope. Local focused tests **15/15** and all 11 hosted
  protected checks passed.
- **Reason:** This closes a cache-authenticity code gap but does not establish
  the mapped entitlement, authenticated hosted policy matrix, provider delivery,
  reconciliation, or complete acceptance. Billing/provider observation remains
  free/no active paid license/no hosted-record allowance.
- **Disposition:** No checkbox or AppSec state changes. Score remains
  **232/48/280 (82.9%)**.
- **Evidence:** `evidence/team-cli-001-signed-offline-cache-pr133-2026-10-18.md`.

## 2026-10-18 · retain FINAL-WEB-006 after public proof implementation

- **Decision:** Accept Web PR #201 as a bounded public proof-surface
  implementation advance while keeping `FINAL-WEB-006` unchecked.
- **Observed:** Normal merge `72cff9bf` preserves three commits; the static
  `/proof` route renders source-free `real`/`demo` assets with exact
  date/version, public URL, accessible description, and limitation. Local and
  hosted verification passed.
- **Reason:** The route does not create customer acceptance, private-record
  evidence, or the required `ACCEPT-003`/`ACCEPT-009` acceptance state.
- **Disposition:** No checkbox or AppSec state changes. Score remains
  **232/48/280 (82.9%)**.
- **Evidence:** `evidence/final-web-006-public-proof-assets-pr201-2026-10-18.md`.

## 2026-10-18 · retain FINAL-WEB-006 after accessibility follow-up

- **Decision:** Accept Web PR #202 as a focused accessibility correction while
  keeping `FINAL-WEB-006` unchecked.
- **Observed:** Normal merge `6496814c` renders the registry `altText` through
  the public proof-card markup; local and hosted verification passed.
- **Disposition:** The acceptance bundle and external dependencies remain
  outstanding. No checkbox or AppSec state changes. Score remains
  **232/48/280 (82.9%)**.
- **Evidence:** `evidence/final-web-006-public-proof-assets-pr201-2026-10-18.md`.

## 2026-10-18 · retain TEAM-CLI-001 after policy redirect hardening

- **Decision:** Accept CLI PR #132 as a bounded implementation advance and
  keep `TEAM-CLI-001` unchecked.
- **Observed:** The organization-policy client refuses redirects on
  bearer-authenticated requests. The normal PR branch preserves implementation
  `39950bb6`, test `d7db7159`, and portability correction `e03f9582` as three
  separate commits. Local build **8/8**, typecheck **14/14**, and focused tests
  **8/8** passed. All 11 protected hosted checks passed, and the normal merge
  commit is `2682874c`.
- **Reason:** This protects credential routing but does not establish the
  mapped entitlement, authenticated CLI fetch/cache/offline/expiry/cross-tenant
  matrix, provider delivery, reconciliation, or complete acceptance.
- **Disposition:** No checkbox or AppSec state changes. Score remains
  **232/48/280 (82.9%)**.
- **Evidence:** `evidence/team-cli-001-policy-redirect-boundary-pr132-2026-10-18.md`.

## 2026-10-18 · retain TEAM-CLI-001 after hosted CLI-auth recheck

- **Decision:** Treat the hosted device-code redirect to checkout as a real
  entitlement boundary and keep the Team policy-fetch row unchecked.
- **Observed:** The existing authenticated owner session had no active license;
  no authorization success or credential response was produced. No payment was
  attempted.
- **Disposition:** The next required artifact is an approved mapped
  paid/non-production entitlement, followed by the complete signed CLI
  fetch/cache/offline/expiry/cross-tenant/provider matrix. This does not alter
  the independent Hunt/AppSec hold set.
- **Evidence:** `evidence/team-cli-001-cli-auth-entitlement-recheck-2026-10-18.md`.

## 2026-10-18 · accept authenticated dashboard Lighthouse qualification as partial

- **Decision:** Accept the existing authenticated organization-dashboard
  Lighthouse and lab-performance results as partial `QUAL-WEB-006` evidence.
- **Observed:** Desktop/mobile Lighthouse each passed 32/32 at
  Accessibility/Best Practices/SEO/Agentic Browsing **100/100/100/100**;
  desktop reload LCP was **853 ms** and CLS **0.00**.
- **Boundary:** No field data exists for the route. This does not substitute
  for human screen-reader testing, large-dataset interaction, or independent/
  customer acceptance. Keep the row unchecked.
- **Disposition:** No AppSec or other gate changed. Evidence remains private.
- **Evidence:** `evidence/qual-web-006-authenticated-org-lighthouse-2026-10-18.md`.

## 2026-10-18 · accept visible policy identity while retaining entitlement hold

- **Decision:** Accept the existing authenticated owner-session Policy page
  as real evidence for the bounded policy identity and repository-binding
  portion of `TEAM-CLI-001`.
- **Observed:** Published policy `verglos.policy.scm-qualification-20261018`
  version `1.0.0` rendered digest
  `sha256:c7327a70ded22a0e051b9da420c012e2ae5d105c430ebe665b82d1ac9399b698`
  with canonical-json-v1, effective time, project, and repository binding.
- **Boundary:** The same Billing view remains Free with no active paid license
  and no hosted-record allowance. Do not convert this dashboard observation
  into a paid entitlement or a CLI fetch/cache/offline/provider pass.
- **Disposition:** Keep `TEAM-CLI-001`, its dependent TEAM rows, and all
  AppSec-held rows unchanged. No public or Production state changed.
- **Evidence:** `evidence/team-cli-001-policy-dashboard-browser-recheck-2026-10-18.md`.

## 2026-10-18 · correct Preview auth failure before accepting dashboard evidence

- **Decision:** Treat the first HTTP 500 as a real implementation defect and
  fix it before relying on the policy-dashboard Preview evidence.
- **Result:** Preview test-auth no longer invokes Clerk when its middleware is
  intentionally bypassed. The corrected protected route returns 307 to login
  without an error log; the complete auth/policy tests and hosted checks pass.
- **Boundary:** This correction does not create an entitlement, policy row,
  provider delivery, or authenticated CLI matrix. Keep `TEAM-CLI-001`
  unchecked.
- **Evidence:** `evidence/team-cli-001-policy-dashboard-auth-fix-pr194-2026-10-18.md`.

## 2026-10-18 · ship visible policy digest without claiming entitlement

- **Decision:** Accept Web PR #193 as the next real implementation slice for
  `TEAM-CLI-001`; preserve its separate implementation and test commits and
  regular merge.
- **Result:** The authenticated organization Policy page now exposes exact
  policy identity/digest through the existing tenant authorization path and
  excludes policy documents. Local and hosted verification passed.
- **Boundary:** Do not check `TEAM-CLI-001`. The current owner account still
  lacks the mapped paid/non-production entitlement and live CLI
  fetch/cache/offline/expiry/cross-tenant/provider reconciliation evidence.
  This is not an AppSec substitute or waiver.
- **Evidence:** `evidence/team-cli-001-policy-dashboard-digest-pr193-2026-10-18.md`.

## 2026-10-18 · retain TEAM-CLI-001 after organization entitlement observation

- **Decision:** Treat the authenticated organization Billing view as the
  authoritative current entitlement observation and keep `TEAM-CLI-001`
  unchecked.
- **Observed:** `Top Notchh Solutions` is owned by the session, but its
  effective plan is `free`, no active paid license exists, checkout is not
  purchasable, and hosted records have no configured allowance. The two
  Preview projects are visible; the Policy page does not show a visible
  published version/list.
- **Reason:** Owner authority permits company decisions but does not fabricate
  a paid entitlement or a signed CLI policy-fetch observation. Do not bypass
  the route or alter billing merely to satisfy the row.
- **Next action:** Use an already authorized paid/non-production entitlement
  fixture if one exists, then run and retain the complete CLI fetch/cache/
  offline/expiry/cross-tenant/provider matrix.
- **Evidence:** `evidence/team-cli-001-organization-entitlement-browser-observation-2026-10-18.md`.

## 2026-10-18 · retain TEAM-CLI-001 after isolated Preview fixture attempt

- **Decision:** Do not treat the isolated Preview test-auth organization as a
  substitute for the real organization-policy entitlement. Keep
  `TEAM-CLI-001` unchecked.
- **Reason:** The fixture organization had no project or policy row, while
  the real organization was denied by tenant authorization and the valid
  founder license was not mapped to the requested policy binding. The route's
  HTTP 404 `policy unavailable` is the correct fail-closed result.
- **Next action:** Use an authorized paid/non-production fixture or approved
  isolated Test Mode entitlement path, then capture the signed CLI fetch,
  visible digest, cache/offline/expiry, cross-tenant denial, and
  reconciliation matrix. Do not bypass the license or change Production.
- **Boundary:** This decision is unrelated to the held Hunt AppSec review and
  does not reopen any other gate. Score remains **232/48/280 (82.9%)**.
- **Evidence:** `evidence/team-cli-001-preview-fixture-scope-2026-10-18.md`.

## 2026-10-18 · accept organization App token/scope read-back as provider evidence

- **Decision:** Accept the signed App identity and installation repository
  read-back as provider evidence without treating it as live check delivery.
- **Observed:** GitHub `/app` returned HTTP `200`; the installation-token
  exchange returned HTTP `201`; and the installation listed exactly one private
  repository, `Top-Notchh-Solutions/verglos-archive` (`1305731597`). No write
  operation used the token and no token value was recorded.
- **Disposition:** Keep `TEAM-CLI-001`, `TEAM-CLI-002`, and `TEAM-WEB-006`
  open until their remaining fetch, reconciliation, provider-delivery, and
  acceptance contracts pass. Score remains **232/48/280 (82.9%)**.
- **Evidence:** `evidence/team-cli-001-organization-owner-policy-fix-2026-10-18.md`.

## 2026-10-18 · retain TEAM rows after hosted SCM check admission

- **Decision:** Accept the source-free SCM check admission, persistence,
  idempotent retry, and conflicting-payload refusal as real hosted evidence;
  keep `TEAM-CLI-001`, `TEAM-CLI-002`, and `TEAM-WEB-006` unchecked.
- **Observed:** Delivery `0787981d-e42e-41bc-804e-ab769b9f00e4` was queued by
  HTTP `201`; the identical retry returned `noop`; a conflicting payload for
  the same external identity returned HTTP `409` without overwriting it.
- **Reason:** The provider check has not been published and the queued row has
  not completed provider delivery. Completion requires the protected cron
  credential and provider token exchange, while the CLI policy matrix still
  lacks a valid license bearer.
- **Disposition:** Record this as hosted substrate only. Do not mark a row
  green from enqueue evidence, and do not bypass server-held credentials or
  entitlement checks. Score remains **232/48/280 (82.9%)**; keep Hunt/AppSec
  last.
- **Boundary:** Synthetic source-free identifiers only; no customer source,
  provider token, provider response, billing operation, or Production
  repository access was used. No squash merge or artificial documentation-only
  contribution was used.
- **Evidence:** `evidence/team-cli-001-organization-owner-policy-fix-2026-10-18.md`.

## 2026-10-18 · keep TEAM-CLI-001 open after organization SCM activation

- **Decision:** Record the organization SCM installation and server-held
  production configuration as real provider evidence, but keep
  `TEAM-CLI-001` unchecked.
- **Observed:** GitHub installation `172686102` belongs to
  `Top-Notchh-Solutions`, selects only `verglos-archive`, and grants metadata
  read/checks write. Vercel Production and Preview contain the three hidden
  provider variables, and deployment `dpl_8joQ1Xg3cXmk9UWs1DQyjSigQC9Z`
  reached READY with a successful Production smoke response.
- **Reason:** Installation and configuration do not by themselves prove the
  signed policy publication, authenticated CLI fetch/cache/offline/
  cross-tenant behavior, or reconciliation.
- **Disposition:** Continue with the bounded hosted CLI qualification before
  advancing dependent rows. Keep Hunt/AppSec last and unchanged. Score remains
  **232/48/280 (82.9%)**.
- **Boundary:** No Production repository was granted App access; no customer,
  billing, registry, database, or AppSec state changed. No squash merge or
  artificial documentation-only contribution was used.
- **Evidence:** `evidence/team-cli-001-organization-owner-policy-fix-2026-10-18.md`.

## 2026-10-18 · retain TEAM-CLI-001 after hosted Preview policy publication

- **Decision:** Accept the real Preview SCM binding, policy lifecycle, and
  fail-closed authorization response as qualification evidence, but keep
  `TEAM-CLI-001` unchecked.
- **Observed:** Project `verglos-scm-qualification-20261018` is bound to the
  active organization installation for `Top-Notchh-Solutions/verglos-archive`.
  Policy row `95f44933-cb7c-4cb3-87ae-51ed02d866da` reached `published` with
  canonical digest
  `sha256:c7327a70ded22a0e051b9da420c012e2ae5d105c430ebe665b82d1ac9399b698`.
  The enforcement request without a license bearer returned HTTP `401
  invalid authorization`.
- **Reason:** The authenticated account is Free and has no license key. The
  signed policy and provider binding do not establish authenticated CLI
  fetch/cache/offline/cross-tenant behavior or reconciliation.
- **Disposition:** Do not bypass the license guard or create billing state for
  qualification. Continue only with a valid authorized license fixture or
  retain the row open. Keep Hunt/AppSec last. Score remains
  **232/48/280 (82.9%)**.
- **Boundary:** No Production repository access, billing operation, customer
  data, registry state, database migration, or AppSec state changed. No squash
  merge or artificial documentation-only contribution was used.
- **Evidence:** `evidence/team-cli-001-organization-owner-policy-fix-2026-10-18.md`.

## 2026-10-18 · retain TEAM-CLI-001 after organization-owner policy fix

- **Decision:** Accept the organization-owner authorization correction as
  implementation evidence, but keep `TEAM-CLI-001` unchecked.
- **Observed:** The policy route now binds the license user to the exact
  requested active organization and owner role. Missing ownership remains a
  bounded unavailable response; database failures remain unavailable rather
  than leaking details.
- **Verification:** Web PR #192 merged normally as
  `188b4b01fd9d6c7c4292d8cdf55a3b348954e9d4`, preserving implementation
  `4579c27` and test `f8b420e`. Focused SCM/tenant tests passed **22/22**;
  typecheck, diff check, READY Preview build **47/47**, GitGuardian, Preview
  Comments, and hosted typecheck/schema all passed. Vercel then deployed the
  normal merge to Production as `dpl_6v94AE2iXisCWHKxQfrjKyD81NZ8`; the
  public `verglos.com` smoke request returned HTTP 200.
- **Reason:** This corrects a code-side blocker but does not create a provider
  installation, configure provider credentials, publish a live policy, or
  prove CLI fetch/cache/offline/cross-tenant behavior.
- **Disposition:** Keep `TEAM-CLI-001`, its dependent TEAM rows, and all
  customer/provider acceptance rows open. This is not an AppSec hold. Score
  remains **232/48/280 (82.9%)**.
- **Boundary:** Only the Web deployment target changed. No customer, billing,
  registry, provider, or AppSec state changed. No squash merge was used.
- **Evidence:** `evidence/team-cli-001-organization-owner-policy-fix-2026-10-18.md`.

## 2026-10-18 · retain QUAL-WEB-005 after hosted synthetic deletion

- **Decision:** Accept the isolated Preview deletion execution as qualification
  evidence, but keep `QUAL-WEB-005` unchecked.
- **Observed:** A same-origin synthetic `record_receipt` request completed
  through the real hosted worker; the customer-held signed-record digest stayed
  unchanged; the worker replay was empty; cross-origin and malformed
  confirmation requests failed closed.
- **Reason:** This narrow hosted run does not establish the legal/consent and
  customer-held-record disposition, full inventory reconciliation,
  restore/rollback acceptance, production migration authorization, or
  independent end-to-end acceptance required by the row.
- **Disposition:** Keep the row open and continue with the next eligible
  non-AppSec item. Do not interpret this as production deletion authority.
- **Boundary:** Preview-only synthetic state was used. No Production,
  customer, payment, provider, registry, or AppSec state changed. No squash
  merge was used. Score remains **232/48/280 (82.9%)**.
- **Evidence:** `evidence/qual-web-005-hosted-preview-deletion-2026-10-18.md`.

## 2026-10-18 · retain ENT-CLI-001 after hosted runner lifecycle

- **Decision:** Accept the real isolated Preview lifecycle as operational
  evidence, but keep `ENT-CLI-001` unchecked.
- **Observed:** Fresh synthetic auth/license validation, enrollment, outbound
  activation poll, bounded signed job, local signature verification and
  mutation rejection, source-free result reconciliation, exact replay
  idempotency, final empty poll, and fail-closed negative target/schema paths
  all passed.
- **Reason:** The row still requires cross-platform operational evidence,
  independent review of the runner/Hunt boundary, and authorized enterprise
  acceptance. Owner authorization does not replace those row-specific
  artifacts.
- **Disposition:** Keep `ENT-CLI-001` open; continue with the next eligible
  non-AppSec row and leave Hunt/AppSec-dependent rows untouched.
- **Boundary:** Preview-only synthetic state was used. No Production,
  customer, registry, billing, or AppSec state changed. No secret, enrollment
  token, license bearer, private key, or raw result was recorded. No squash
  merge was used. Score remains **232/48/280 (82.9%)**.
- **Evidence:** `evidence/ent-cli-001-hosted-runner-qualification-2026-10-18.md`.

## 2026-10-18 · retain STUDIO-CLI-001 after hosted recipient qualification

- **Decision:** Keep `STUDIO-CLI-001` open after exercising the real Preview
  custody boundary.
- **Reason:** The hosted receipt route correctly rejects a forbidden `source`
  field and denies cross-organization reads, but the fresh owner fixture has a
  founder/enterprise-style `contracted` records allowance. The route therefore
  refuses a valid receipt with `allowance_not_configured`; no recipient/customer
  acceptance state was created.
- **Disposition:** Do not weaken the allowance guard or check the row. Unblock
  with an existing isolated paid/non-production fixture or the supported
  Preview payment/migration qualification and then rerun the recipient flow.
- **Boundary:** No Production, customer, registry, billing, database, or
  AppSec state changed. No undocumented database connection was used. No
  squash merge was used. Score remains **232/48/280 (82.9%)**.
- **Evidence:** `evidence/studio-cli-001-hosted-recipient-qualification-2026-10-18.md`.

## 2026-10-18 · retain ENT-CLI-001 open after current-head requalification

- **Decision:** Accept the current merged-head runner protocol tests as
  implementation evidence, but do not check `ENT-CLI-001`.
- **Reason:** Shared/CLI suites, focused runner tests, build, typecheck, and
  diff check pass. The required operational enrollment credential exchange,
  approved runner execution/result reconciliation, cross-platform operational
  evidence, independent review, and enterprise acceptance are not established
  by local tests.
- **Disposition:** Keep the row open and leave AppSec-held and dependent rows
  untouched. Score remains **232/48/280 (82.9%)**.
- **Boundary:** No production, customer, provider, registry, account, database,
  or deployment state changed. No squash merge was used.
- **Evidence:** `evidence/ent-cli-001-current-merge-requalification-2026-10-18.md`.

## 2026-10-18 · retain STUDIO-CLI-001 open after custody merge

- **Decision:** Accept Web PR #188 as current code-side implementation evidence;
  do not check `STUDIO-CLI-001`.
- **Reason:** The normal merge `a94ff8e352f29f75860340fab69fb472af25924f`
  preserves implementation `112d7a9` and test `877665e`, and the route,
  migration, contract, local integration, and hosted checks pass. That does not
  establish an independent observation of the deployed recipient boundary or a
  real authorized Studio recipient/customer acceptance run.
- **Disposition:** Keep the row open and leave AppSec-held and dependent rows
  untouched. Score remains **232/48/280 (82.9%)**.
- **Boundary:** No production, customer, provider, registry, account, database,
  or deployment state changed. No squash merge was used.
- **Evidence:** `evidence/studio-cli-001-hosted-custody-implementation-pr-2026-10-18.md`.

## 2026-10-18 · retain TEAM-CLI-001 open after current-head revalidation

- **Decision:** Accept the exact current-merge policy tests as code-side
  evidence, but do not check `TEAM-CLI-001`.
- **Reason:** The required provider installation and live hosted observation
  cannot be established by local tests. The existing read-only provider audit
  found no dedicated Verglos SCM App installation or Preview GitHub App
  credential surface.
- **Disposition:** Keep `TEAM-CLI-001`, dependent TEAM rows, and downstream
  provider/customer acceptance rows open. Score remains **232/48/280 (82.9%)**.
- **Evidence:** `evidence/team-cli-001-policy-current-merge-revalidation-2026-10-18.md`.

## 2026-10-18 · retain DIST-001 open after current archive requalification

- **Decision:** Accept the current merged-head package/archive result as
  technical evidence, but do not check `DIST-001`.
- **Reason:** Seven archives, packed manifests, clean-consumer imports, the
  no-implicit-engine behavior, and bounded signed A1 execution all pass. The
  row still requires the LOCAL/HUNT/RECORD product surfaces and final-release
  acceptance; archive evidence alone cannot waive those dependencies.
- **Disposition:** Keep `DIST-001` and dependent `DIST-002`/`DIST-003` open.
  AppSec-held Hunt rows remain untouched. Score remains **232/48/280 (82.9%)**.
- **Evidence:** `evidence/dist-001-current-merge-requalification-2026-10-18.md`.

## 2026-10-18 · close LIC-003 notice contract

- **Decision:** Accept the deterministic `THIRD_PARTY_NOTICES` generator and
  its fail-closed review-marker behavior for the current package surface.
- **Reason:** The combined release-contract suite passed **18/18** and the
  generated output retains upstream identity, available license/NOTICE text,
  non-endorsement wording, missing-text warnings, the nested component
  blocker, and all Blue Oak review entries.
- **Disposition:** Check `LIC-003`. The notice result does not authorize
  publication or close DIST-001–003, trusted provenance, provider, customer,
  independent AppSec, or final-acceptance rows. Score is **232/48/280
  (82.9%)**.
- **Evidence:** `evidence/lic-003-notice-qualification-2026-10-18.md`.

## 2026-10-18 · close LIC-002 with scoped company conditions

- **Decision:** Record the owner/company licensing disposition as
  **approved with conditions** for the exact current non-published package
  and source boundary.
- **Reason:** The existing technical inventory, exact upstream-source
  rechecks, package qualification, and owner authorization now have a single
  per-area decision covering external engines, fixtures, Hunt content,
  notices, redistribution, and trademark restrictions. The treatment keeps
  unresolved mechanical classifications visible and does not authorize
  publication.
- **Disposition:** Check `LIC-002`. Keep `LIC-003`, distribution, trusted
  publication, provider, customer, independent AppSec, and final-acceptance
  rows open until their own criteria pass. Score is **231/49/280 (82.5%)**.
- **Evidence:** `docs/shipping/legal/legal-company-decision-2026-10-18.md`.

## 2026-10-18 · retain LIC-002 after exact upstream source recheck

- **Decision:** Accept the exact-source observation for
  `minipass-flush@1.0.7` and the nested `fast-uri@3.1.7` benchmark metadata
  as technical provenance evidence only.
- **Reason:** The `minipass-flush` license now matches the installed digest and
  declares Blue Oak Model License 1.0.0; the benchmark metadata explicitly
  marks the nested package private. Neither observation decides the
  distributed package surface or the company/legal release disposition.
- **Disposition:** Keep `LIC-002` unchecked. The remaining license, notice,
  source-offer, trademark, exact-archive, and authorized company/legal
  decisions remain required before downstream licensing/distribution rows can
  close. Score remains **230/50/280 (82.1%)**.
- **Evidence:**
  `evidence/lic-002-upstream-exact-source-recheck-2026-10-18.md`.

## 2026-10-18 · keep TEAM-CLI-001 open after current provider audit

- **Decision:** Treat the missing dedicated Verglos SCM App installation and
  Preview GitHub App credentials as a genuine provider prerequisite; do not
  synthesize a live policy fetch or close the row from signer-only evidence.
- **Reason:** The current read-only audit found only Vercel and Neon
  installations in the Top Notchh Solutions organization. Preview has the
  organization-policy signer keys, but no `VERGLOS_GITHUB_APP_ID`,
  `VERGLOS_GITHUB_APP_PRIVATE_KEY`, or `VERGLOS_GITHUB_WEBHOOK_SECRET` keys.
- **Next:** Install one least-privilege App on the authorized non-Production
  test repository, configure the three server-held Preview values, publish the
  bound policy, and run the authenticated fetch/cache/offline/cross-tenant
  qualification. No browser, provider, database, Production, npm, or
  customer state changed in the audit.
- **Disposition:** `TEAM-CLI-001`, `TEAM-CLI-002`, and `TEAM-WEB-006` remain
  open; this is not an AppSec hold. Score remains **230/50/280 (82.1%)**.
- **Evidence:**
  `evidence/team-cli-001-provider-readiness-audit-2026-10-18.md`.

## 2026-10-14 · Keep QUAL-CLI-006 open after hosted matrix

- **Decision:** Record the hosted platform matrix as valid technical evidence
  for the exact public CLI merge `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`.
- **Result:** GitHub Actions run `38550747564` passed Ubuntu, macOS, and
  Windows on Node 20/22/24 (**9/9**) plus the separate in-toto binding job.
- **Boundary:** This does not prove trusted keyless publication, protected
  publication, legal/redistribution clearance, independent AppSec review, or
  final acceptance. Keep `QUAL-CLI-006` unchecked; score remains
  **229/51/280 (81.8%)**.
- **Evidence:** `evidence/qual-cli-006-hosted-matrix-2026-10-14.md`.

## 2026-10-14 · make owner authority and AppSec-last sequencing explicit

- **Decision:** Treat Anurag Yadav, Owner of Top Notchh Solutions and Verglos
  (`anuragyadav.work@gmail.com`), as the standing company decision-maker and
  designated legal/company reviewer for this goal.
- **Operating rule:** Do not request additional reviewer, operator, provider,
  customer, or approval identities. Owner decisions and authorizations cover
  company-controlled non-AppSec work; record the actual row-specific result
  before checking any row.
- **AppSec sequence:** The only separate human identity is the independent
  Hunt AppSec reviewer. A competent roommate using a separate laptop may
  perform that review if they did not implement the reviewed boundary. Run it
  last, after all dependency-ready work that does not depend on AppSec.
- **Boundary:** This resolves the human-input/setup question, not the evidence
  contract. It does not turn permission into provider, customer, field, or
  independent-review evidence. No checkbox or score change.

## 2026-10-14 · no networked Hunt exceptions approved

- **Decision:** Approve no networked Hunt recipe exceptions for this goal;
  default network policy remains deny.
- **Evidence:** `evidence/owner-authorization-2026-10-14.md`.
- **Disposition:** The corresponding non-commit gate is checked. Hunt
  implementation and AppSec-dependent rows remain unchanged. Score is
  **229/51/280 (81.8%)**.

## 2026-10-14 · Keep LIC-002 open after current-head inventory

- **Decision:** Treat the current dependency and notice output as mechanical
  evidence, not as legal clearance.
- **Reason:** Seven review blockers remain and the legal packet has no
  reviewer decision, signature/reference, scope, conditions, or date. Owner
  authorization cannot substitute for that artifact.
- **Next:** Move to `QUAL-CLI-006` while retaining legal review as a release
  prerequisite; resolve the exact blockers against the exact release artifact
  before any publication or redistribution claim.
- **Disposition:** No checkbox or score change; **228/52/280 (81.4%)**.
- **Evidence:**
  `evidence/lic-002-current-head-technical-recheck-2026-10-14.md`.

## 2026-10-14 · Keep STUDIO-CLI-001 open after current-head recheck

- **Decision:** Treat the projection and receipt tests as implementation
  evidence only; do not convert them into recipient/customer acceptance.
- **Reason:** The local contract proves the allowlist, tenant/workspace/record
  binding, approval binding, and digest integrity, but only a recipient-side
  observation can prove the hosted redaction boundary.
- **Next:** Park `STUDIO-CLI-001` with its missing recipient/customer artifact
  and assess `LIC-002` independently. No hosted or customer write occurred.
- **Disposition:** No checkbox or score change; **228/52/280 (81.4%)**.
- **Evidence:**
  `evidence/studio-cli-001-current-head-recheck-2026-10-14.md`.

## 2026-10-14 · Keep TEAM-CLI-001 open after Preview provider audit

- **Decision:** Treat the missing dedicated GitHub App configuration and
  installation as a genuine external prerequisite; do not synthesize SCM rows
  or claim a live policy fetch from signer-only configuration.
- **Reason:** Preview has the policy signer and bounded test-auth variables,
  but no `VERGLOS_GITHUB_*` App keys, and the Top Notchh organization exposes
  no dedicated Verglos SCM App installation. The route contract requires
  provider-authoritative installation identity, repository/project binding, a
  published policy, and an authenticated signed fetch trace.
- **Next:** Install one least-privilege App only on an authorized
  non-Production repository, configure its server-held Preview secrets, and
  run the bounded application/provider flow. No browser tab, public
  repository, Production, database, npm, or customer state changes in this
  audit.
- **Disposition:** `TEAM-CLI-001` remains unchecked; score remains
  **228/52/280 (81.4%)**.
- **Evidence:**
  `evidence/team-cli-001-preview-provider-readiness-2026-10-14.md`.

## 2026-10-14 · record owner authorization without collapsing acceptance gates

- **Decision:** Record Anurag Yadav, Owner of Top Notchh Solutions and Verglos, as the
  authorized owner for bounded Preview/SCM tests, disposable-runner tests,
  synthetic Studio technical qualification, protected dry-runs, legal/company
  packets, and acceptance preparation.
- **Independent-review rule:** The only additional human identity needed for
  the Hunt review is a separate AppSec/security reviewer who did not implement
  the reviewed Hunt boundary. The reviewer receives an exact source commit
  and packet; an npm release is not required.
- **Non-collapse rule:** Owner authorization removes setup questions but does
  not become a provider event, legal opinion, customer consent, field
  observation, or independent signature. Unrelated backlog rows remain
  governed by their own evidence.
- **Disposition:** `evidence/owner-authorization-2026-10-14.md` is the
  private authorization record. No checkbox or score change.

## 2026-10-13 · Make paying value explicit across every plan and surface

- **Decision:** Adopt `FINAL_V1_PAYING_VALUE_BLUEPRINT_2026-10-13.md` as the
  commercial and acceptance companion to the Final V1 product contract.
- **Reason:** Hunt alone is not a product. Customers pay for the complete loop
  from a trustworthy finding through proof, remediation/retest, release
  evidence, collaboration, and governance. The blueprint makes that outcome
  explicit for Free, Pro, Team, Studio, and Enterprise.
- **Required rule:** No named agent, fixture, dashboard, provider event, or
  price table is treated as customer value without an implementation path,
  acceptance metric, and limitation.
- **Economic rule:** Local work remains customer-run where possible; hosted
  models, runners, storage, retention, public verification, and campaigns use
  explicit allowances or contracted terms.
- **Disposition:** Contract/matrix/goal/backlog/ledger/traceability/status/
  risks synchronized. No checkbox or score change.

## 2026-10-13 · Adopt the researched code-to-proof product bar

- **Decision:** Expand the Final V1 implementation target from bounded fixture
  Hunt to a scanner-connected, agentic-but-controlled code-to-proof workflow
  for authorized TypeScript/JavaScript applications.
- **Required value:** Real target mapping, finding-guided attack hypotheses,
  bounded workers, independent counterexamples, remediation/retest, portable
  evidence, and release decisions across CLI, MCP, Web, and SCM.
- **Plan rule:** Free provides useful local value; Pro provides the complete
  local loop; Team adds shared policy/SCM/private targets; Studio adds client
  campaigns/handoffs; Enterprise adds private governance and custom adapters.
- **Economic rule:** Local work is not metered like hosted work; managed model,
  runner, retention, public-verification, and campaign costs are explicit.
- **Evidence rule:** No “better than competitors” claim without the held-out
  benchmark defined in the research packet.
- **Disposition:** Contract, matrix, goal, and private research packet updated;
  no checkbox or score change.

## 2026-10-13 · Preserve Web contract-alignment commits

- **Decision:** Merge Web PR #174 with a regular merge commit and preserve
  its three substantive commits; do not squash or rewrite history.
- **Reason:** The Web public surfaces must stop describing the implemented
  bounded Hunt path as an absent alpha shell while retaining honest hosted
  qualification boundaries.
- **Disposition:** PR #174 merged as
  `63de97be6b180c560ef06d9cbccb62eea20beb4a`; no checkbox or score change.
- **Evidence:** `evidence/hunt-web-contract-alignment-pr174-2026-10-13.md`.

## 2026-10-13 · Preserve the all-family A2 test as a separate public merge

- **Decision:** Merge the all-family A2 CLI qualification test with a regular
  merge commit and preserve its source commit; do not squash or rewrite the
  public history.
- **Reason:** The seven-family test is a substantive public implementation
  and cross-platform qualification slice, and the project wants each logical
  contribution visible in the repository history.
- **Boundary:** This proves sanitized reference-harness execution only. It
  does not create supported-rule approval, hosted entitlement, independent
  review, legal clearance, or final release evidence.
- **Disposition:** PR #109 merged as
  `16fdafd814e0ee2d161243cf53d86a425075800e`; no checkbox or score change.
- **Score:** **228/52/280 (81.4%)**.
- **Evidence:** `evidence/hunt-a2-cli-all-families-pr109-2026-10-13.md`.

## 2026-10-13 · Keep A2 as the active Hunt track and correct stale instructions

- **Decision:** Continue from the merged A2 implementation before selecting a
  different product epic. Align public agent instructions with the approved
  feature matrix, while keeping HUNT-008 through HUNT-011 open until their
  complete acceptance evidence exists.
- **Reason:** The public code has bounded A1/A2 technical paths, but the old
  alpha-only wording made the implementation state appear absent. The matrix
  distinguishes implementation progress from final acceptance.
- **Boundary:** Four Hunt roles are controlled flow responsibilities, not
  autonomous AI services. Do not claim general DAST, complete customer-code
  coverage, or host/OS isolation from the current reference fixtures.
- **Disposition:** Documentation alignment only; no checkbox or score change.
- **Score:** 228/52/280 (81.4%).
- **Evidence:** `evidence/hunt-a2-contract-alignment-2026-10-13.md`.

## 2026-10-13 · Cover all approved Hunt sub-scopes with bounded fixture probes

- **Decision:** Extend the first-party A1 fixture catalog from five to eight
  deterministic probes by adding SQL injection shape, safe XSS shape, and
  Agent/MCP tool-boundary mismatch.
- **Reason:** This gives every one of the seven approved Hunt sub-scopes a
  concrete, testable fixture-level shape while keeping the public runtime
  honest about what it does and does not execute.
- **Safety:** The probes do not access target source, network, databases,
  browsers, tools, arbitrary shell, or model-generated commands. They run only
  through the exact restricted built-in command catalog.
- **Disposition:** Public PR #97 merged at
  `f207240b3370222ee8c36b0dd13029b7d5a1c4ee`; HUNT-008 remains open for
  target-code recipes and all provenance, approval, hosted, isolation, review,
  and release gates. No checkbox changed; score remains **228/52/280
  (81.4%)**.
- **Evidence:**
  `docs/shipping/evidence/hunt-a1-recipe-family-catalog-pr97-2026-10-13.md`.

## 2026-10-13 · Expand A1 with deterministic fixture probes

- **Decision:** Keep the A1 execution family bounded and first-party while
  adding five deterministic fixture probes: UTF-8 containment, path
  traversal, command-injection shape, private/local SSRF classification, and
  tenant-boundary mismatch.
- **Reason:** This creates useful, testable Hunt coverage without pretending
  that fixture classification is target-code attack execution or an autonomous
  AI agent.
- **Safety:** The worker remains no-network, no-source-access, one-process,
  bounded, redacted, and restricted to the exact built-in command catalog.
- **Disposition:** Public PR #96 merged; HUNT-008 remains open for the real
  target-code recipe families and its external/release evidence gates. No
  checkbox changed; score remains **228 checked / 52 unchecked / 280 total
  (81.4%)**.
- **Evidence:**
  `docs/shipping/evidence/hunt-a1-fixture-catalog-pr96-2026-10-13.md`.

## 2026-10-13 · Make the feature coverage matrix the cross-reference

- **Decision:** Keep the approved Final V1 contract, existing 280 counted
  backlog rows, and Point-5 stop boundary. Add one private feature matrix to
  map every product surface and plan to its existing rows and evidence.
- **Reason:** The contract had been approved but the implementation queue did
  not have one readable map for all scanner domains, engines, Hunt scopes,
  records, plans, Web/SCM, and acceptance work. A matrix closes that
  traceability gap without duplicating or inflating the backlog.
- **Hunt truth at that earlier synchronization:** Four Hunt roles are
  controlled architecture roles, not four already-running AI agents. The
  supported catalog then contained only `a1-utf8-contains`; the other recipe
  sub-scopes remained open at that point.
- **Boundary:** No checkbox, entitlement, provider state, public-repository
  content, or release state changed.
- **Score:** **228 checked / 52 unchecked / 280 total (81.4%)**.
- **Authority:** `docs/shipping/FINAL_V1_FEATURE_COVERAGE_MATRIX_2026-10-13.md`.

## 2026-10-11 · Keep QUAL-WEB-006 open after clean account recheck

- **Decision:** Record the current account-shell accessibility/performance
  evidence but do not check `QUAL-WEB-006`.
- **Evidence:** Desktop/mobile Lighthouse Accessibility and Best Practices
  100/100; keyboard reached all nine named controls with visible focus; mobile
  `390x844` had no overflow; console clean; focused contracts 37/37; clean
  account trace LCP 483 ms, TTFB 72 ms, CLS 0.00.
- **Reason:** The row still requires an authorized human screen-reader pass,
  paid organization/large-dataset rendering, and field CWV. A browser tree or
  Lighthouse score must not be represented as human screen-reader evidence.
- **Boundary:** No Production/provider/database/entitlement/customer-data
  write and no code change from this run.
- **Score:** **228/52/280 (81.4%)**.
- **Evidence:**
  `docs/shipping/evidence/qual-web-006-account-recheck-2026-10-11.md`.

- **Queue decision:** After documenting the genuine external remainder,
  `QUAL-WEB-006` stays open. Do not repeat the same automated account probe;
  assess `TEAM-CLI-001` next while retaining `HUNT-008` as a parked external
  blocker. No checkbox changed.

## 2026-10-11 · synchronize public Web/CLI repositories before next batch

- **Decision:** Merge only the public-safe changes that were waiting in the
  active shipping worktrees, then pause backlog selection until the sync was
  complete.
- **Web:** PR #173 merged at
  `1fb7f9c36b9b64a6c9bfa33b8139b13d04021e53`; focused test 2/2, typecheck,
  and 47-page build passed.
- **CLI:** PR #90 merged at
  `5077add10fb6a9f065748b83cf96e3a93da92746`; local 34/34 qualification and
  the complete hosted self-scan, in-toto, and platform matrix passed.
- **Safety decision:** The candidate containing private `docs/shipping`
  history was closed. The replacement was based on current public `main` and
  contains no private tracker material.
- **Disposition:** Sync complete; no checkbox changed. Score remains
  **228/52/280 (81.4%)**; next dependency-ready assessment is `QUAL-WEB-006`.
- **Boundary:** No npm publication, registry write, Production/provider/
  database/entitlement/customer write, or release promotion.
- **Evidence:**
  `docs/shipping/evidence/public-repository-sync-2026-10-11.md`.

## 2026-10-11 · Keep DIST-001 open after package-boundary qualification

- **Decision:** Record the six-package public boundary as qualified progress;
  do not check `DIST-001`.
- **Evidence:** CLI `0ef96caa`; build 6/6; source and packed audits passed;
  package contracts 8/8; clean consumer passed with all six archives and no
  implicit engine cache.
- **Reason:** LOCAL/HUNT/RECORD dependencies and final legal,
  trusted-publishing, and release qualification remain incomplete.
- **Next:** `QUAL-WEB-006` is the next dependency-ready assessment.
- **Boundary:** No npm publication, registry write, Production/provider/
  database/entitlement/customer write, or release promotion.
- **Score:** 228/52/280 (81.4%).
- **Evidence:**
  `docs/shipping/evidence/dist-001-package-boundary-current-2026-10-11.md`.

## 2026-10-11 · Keep ACCEPT-002/003 open after current substrate recheck

- **Decision:** Record the current shipping-worktree verifier as substrate
  progress only; do not check `ACCEPT-002` or `ACCEPT-003`.
- **Evidence:** CLI 274/274 at `0ef96caa`; Web 923/953 with 30 explicit
  skips at `d4dd7f9`; composed acceptance substrates 74/74; all commands exit
  0.
- **Reason:** Hosted/provider/customer, human browser/field-CWV,
  account-deletion, legal, independent-review, and final acceptance evidence
  are not produced by this verifier.
- **Boundary:** No Production/provider/database/entitlement/customer write.
- **Score:** 228/52/280 (81.4%).
- **Evidence:**
  `docs/shipping/evidence/accept-002-current-shipping-worktree-2026-10-11.md`.

## 2026-10-11 · Keep QUAL-CLI-006 open after process-entry repair

- **Decision:** Accept the shared CLI process-entry repair as qualification
  progress only; do not check `QUAL-CLI-006`.
- **Evidence:** Commit `0ef96caa`; record create/verify 11/11; focused
  QUAL-CLI-006 set 34/34; Turbo typecheck/build 12/12; diff check passed.
- **Reason:** The live release still lacks trusted keyless Fulcio/Rekor
  provenance, protected publishing, licensing clearance, independent review,
  and final acceptance.
- **Boundary:** No npm publication, Production/provider/database/entitlement
  write, or release promotion occurred.
- **Score:** 228/52/280 (81.4%).
- **Evidence:**
  `docs/shipping/evidence/qual-cli-006-process-entry-repair-2026-10-11.md`.

## 2026-10-11 · Accept PRO-008 under Final V1 billing contract

- Decision: Check PRO-008 for the server-enforced Pro member and
  billing/usage view. Final V1 exposes Cards-only prepaid fixed-term access
  and customer-initiated manual renewal; legacy subscription rows are
  reconciliation-only.
- Implementation: Web d4dd7f9 adds the explicit owner-managed renewal path and
  truthful billing boundary on top of the existing server-side
  member/allowance/threshold/payment/provider-metadata implementation.
- Verification: Focused commercial/payment suites pass 39/40 and 29/30 with
  one explicit environment-gated skip each; isolated Docker
  commercial-state/billing integration passed 7/7; typecheck/build/diff
  passed.
- Boundary: No Production or provider/database/entitlement/customer-data
  write. V1 does not claim tax-invoice documents, provider download URLs, or
  automatic recurring renewal.
- Score: 228/52/280 (81.4%).
- Evidence:
  docs/shipping/evidence/pro-008-final-v1-billing-view-2026-10-11.md.

## 2026-10-11 · Accept PLAN-WEB-012 under Final V1 billing contract

- **Decision:** Check `PLAN-WEB-012` against Cards-only prepaid fixed-term
  billing with manual renewal. Treat automatic recurring subscription renewal
  as compatibility-only, not as a V1 customer promise.
- **Evidence:** Isolated Preview signed capture/failure/refund delivery and
  manual second-order reconciliation combine with Docker 6/6 and focused
  payment 29/29 evidence for replay, ordering, retry, expiry, and exactly-once
  behavior.
- **Boundary:** No Production billing/database/entitlement write occurred;
  old subscription cancellation/replay evidence remains a compatibility
  check only.
- **Score:** **227/53/280 (81.1%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-web-012-final-v1-lifecycle-reconciliation-2026-10-11.md`.

## 2026-10-11 · Accept PLAN-WEB-015 Production Cards-only contract

- **Decision:** Check `PLAN-WEB-015` after the read-only Production method
  catalog and live checkout display matched the Final V1 prepaid Cards-only
  contract.
- **Evidence:** Production returned HTTP 200; the configured method set was
  exactly `card`; the page showed Cards and no Test Mode or non-card method.
- **Boundary:** No checkout submission or Production payment, database,
  migration, entitlement, account, organization, or customer-data write.
  Provider lifecycle evidence is isolated Preview evidence under
  `PLAN-WEB-014`.
- **Score:** **226/54/280 (80.7%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-web-015-production-cards-only-display-2026-10-11.md`.

## 2026-10-11 · Accept PLAN-CLI-003 after isolated paid matrix

- **Decision:** Check `PLAN-CLI-003` after the isolated Preview authenticated
  modified-client and paid Bearer matrices completed without a scope or plan
  elevation.
- **Evidence:** The matrix covered forged plan/capability/tenant/query values,
  organization/project and record lists, search, download/export, and
  public/private cache boundaries. The active Pro Bearer path kept
  `real_plan=pro` and `active=true` under forged Enterprise selection.
- **Boundary:** Only the isolated Preview database was written, for one
  acceptance organization and test project. No Production payment, database,
  entitlement, account, provider, or customer-data write occurred.
- **Remaining:** Gate 5 live GitHub/GitLab organization evidence, Hunt
  provenance and independent review, legal approval, protected release/
  rollback, and final acceptance remain separate. Score is **225/55/280
  (80.4%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-cli-003-preview-paid-modified-client-matrix-2026-10-11.md`.

## PLAN-WEB-014 accepted and Gate 4 passed · 2026-10-11

- **Evidence:** Two isolated Preview/Test Mode Cards-only captures reached
  signed webhooks and the payment→ledger→license path. One completed a full
  refund; the second was a customer-initiated manual-renewal order and
  completed a partial refund. Failed order rows have no license.
- **Qualification:** Fresh Docker PostgreSQL payment integration passed 6/6;
  focused payment/handler tests passed 29/29 with one explicit environment-
  gated skip and zero failures. Replay, ordering/conflict, retry, expiry, and
  exactly-once behavior are covered.
- **Decision:** Check PLAN-WEB-014 and pass Gate 4 against the Final V1
  prepaid/manual-renewal contract. Do not revive automatic recurring-card
  billing as a V1 requirement.
- **Remaining:** PLAN-WEB-015 still governs the separate read-only Production
  Cards-only contract/reconciliation checkpoint; no Production billing write is
  authorized by this decision.
- **Score:** **224 checked / 56 unchecked / 280 total (80.0%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-prepaid-cards-lifecycle-2026-10-11.md`.

## Full refund is now reconciled; lifecycle remains open · 2026-10-11

- **Observation:** The isolated Razorpay Test Mode full refund is now
  provider-reported as `processed`; the current Preview accepted the signed
  `refund.processed` webhook with HTTP **200**; and the isolated payment row is
  `refunded` with the full refund watermark.
- **Contract result:** The linked license remains active through its existing
  paid-time expiry. The refund did not create a new grant or silently remove
  already granted paid time.
- **Decision:** Supersede the pending-refund observation, but keep
  PLAN-WEB-014, PLAN-WEB-015, and Gate 4 open for failure/recovery, expiry,
  manual renewal, replay/out-of-order, timeout/retry, and exactly-once proof.
- **Boundary:** Test Mode and isolated Preview only; no direct database edit,
  fake provider event, Production payment, or Production state change.
- **Score:** **223 checked / 57 unchecked / 280 total (79.6%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-cards-refund-processed-2026-10-11.md`.

## Preview capture and signed webhook are proven; full lifecycle remains open · 2026-10-11

- **Observation:** After enabling the isolated Preview target, the official
  Razorpay Test Mode Cards-only payment was captured. The signed webhook and
  order-status routes returned HTTP 200, and the browser reached Pro
  activation. A full Test Mode refund was issued, but the provider reports it
  as processing.
- **Decision:** Accept this as valid success-path lifecycle evidence, but keep
  `PLAN-WEB-014`, `PLAN-WEB-015`, and Gate 4 open. Do not mark the item complete
  until processed-refund delivery/revocation and the remaining failure,
  expiry, manual-renewal, replay, timeout, and exactly-once cases are proven.
- **Boundary:** Test Mode and isolated Preview only; no fake event, direct
  database edit, Production payment, or Production state change occurred.
- **Score:** **223 checked / 57 unchecked / 280 total (79.6%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-cards-capture-webhook-2026-10-11.md`.

## Preview Cards capture is not signed entitlement evidence · 2026-10-11

- **Observation:** The official Razorpay Test Mode card fixture completed and
  the provider dashboard showed the canonical Pro monthly payment as Captured.
  The exact Preview webhook target was enabled after the payment, so no
  historical signed event was delivered.
- **Decision:** Keep `PLAN-WEB-014`, `PLAN-WEB-015`, and Gate 4 open. Do not
  treat provider capture alone as ledger credit or entitlement evidence.
- **Next proof:** Run a fresh official Test Mode card payment after the enabled
  Preview target is in place, then reconcile signed capture, refund, expiry,
  manual renewal, replay/out-of-order, timeout/retry, and exactly-once cases.
- **Boundary:** No fake event, direct database edit, Production payment, or
  Production state change occurred.
- **Score:** **223 checked / 57 unchecked / 280 total (79.6%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-cards-capture-webhook-boundary-2026-10-11.md`.

## Preview prepaid card provider terminal boundary · 2026-10-11

- **Observation:** Two official Razorpay domestic Test Mode card attempts in
  isolated Preview reached hosted Checkout, but the provider returned its own
  payment-failure result before any signed terminal event. No OTP was guessed.
- **Disposition:** This proves the provider failure presentation and keeps the
  payment path fail-closed, but it does not prove capture, ledger credit,
  entitlement, refund, expiry, manual renewal, or exactly-once reconciliation.
  Keep `PLAN-WEB-014`, `PLAN-WEB-015`, and Gate 4 open.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-prepaid-provider-terminal-failure-2026-10-11.md`.
- **Score:** **223 checked / 57 unchecked / 280 total (79.6%)**; no checkbox
  changed.

## Preview prepaid order creation is qualified; Gate 4 remains open · 2026-10-11

- **Decision:** Treat the current isolated Preview Cards-only order response as
  valid hosted implementation progress under the Final V1 prepaid/manual-
  renewal contract.
- **Evidence:** Web `887249d`; canonical monthly order HTTP 200; INR 280,943
  minor units, 30 days, catalog `2026-10-02.0`, Test Mode, and only Cards;
  focused payment tests passed 42 with three explicit local-PostgreSQL skips.
- **Boundary:** The order was created in Test Mode, but no terminal provider
  payment, signed webhook, ledger/entitlement transition, expiry, or second
  manual-renewal order was observed. No Production state changed.
- **Disposition:** Do not check `PLAN-WEB-014` or Gate 4 yet. The next proof
  must be provider-supported terminal card evidence and isolated signed
  reconciliation. The historical recurring-card fixture requirement is
  retired by the current product contract.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-prepaid-order-creation-2026-10-11.md`.

## 2026-10-11 · Keep Hunt backlog rows open after current-main qualification

- **Decision:** Record the bounded Hunt runtime and package tests as valid
  implementation evidence, but do not check HUNT-008/009/010/011.
- **Reason:** The test suite proves code-side boundaries and fixed-recipe
  behavior. It does not establish trusted/licensed publisher provenance,
  independent AppSec sign-off, legal approval, or the required hosted/customer
  qualification.
- **Boundary:** No Production, provider, database, entitlement, payment,
  registry, or customer-data state changed.
- **Evidence:**
  `docs/shipping/evidence/cli-current-main-reconciliation-2026-10-11.md`.
- **Score:** **223 checked / 57 unchecked / 280 total (79.6%)**.

## 2026-10-11 · Keep PLAN-WEB-014 open after Preview hosted card run

- **Decision:** Accept the isolated Preview order and hosted-card results as
  genuine implementation/provider-boundary evidence; do not check the row.
- **Reason:** Razorpay Test Mode accepted the canonical order and card/consent
  requests but remained at provider-owned `Sending OTP`. There is no signed
  terminal capture/failure/refund event, payment-ledger transition,
  entitlement grant, or manual-renewal second order.
- **Boundary:** No Production payment, database, entitlement, migration,
  account, organization, or customer-data write occurred. No guessed OTP,
  fabricated webhook, or direct row edit was used.
- **Next:** Use only an authorized provider OTP/fixture or supported replay
  control, then reconcile the complete one-time card lifecycle in isolated
  Preview. Keep the final V1 prepaid/manual-renewal contract; do not revive
  the deferred recurring-subscription promise.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-prepaid-card-hosted-qualification-2026-10-11.md`.

## 2026-10-11 · Keep PLAN-WEB-015 open after cards-only display check

- **Decision:** Accept the Production checkout display as contract evidence;
  do not check `PLAN-WEB-015`.
- **Reason:** Displayed methods do not prove order, signed webhook, refund,
  expiry, or manual-renewal reconciliation.
- **Boundary:** No checkout submission or Production payment/database/
  entitlement/account/organization/customer-data write occurred.
- **Evidence:**
  `docs/shipping/evidence/plan-web-015-production-cards-only-display-2026-10-11.md`.

## 2026-10-11 · Keep ACCEPT-002 open after current-head substrate pass

- **Decision:** Accept the fresh harness results as regression/substrate
  evidence only; do not check `ACCEPT-002`.
- **Reason:** The remaining story statuses require hosted, provider,
  customer, human-review, or account-deletion qualification that the harness
  explicitly does not claim.
- **Boundary:** No external, Production, provider, database, payment,
  entitlement, migration, or customer state changed.
- **Evidence:**
  `docs/shipping/evidence/accept-002-current-head-substrate-recheck-2026-10-11.md`.

## 2026-10-11 · Keep QUAL-WEB-006 open after Production read-only run

- **Decision:** Accept the authenticated browser, Lighthouse, accessibility
  snapshot, network, and performance results as qualification evidence only;
  do not check `QUAL-WEB-006`.
- **Reason:** Human screen-reader, large authenticated dataset, and field-CWV
  evidence are still required by the row.
- **Boundary:** No Production write, payment, database, entitlement,
  organization, membership, or account-data mutation occurred.
- **Evidence:**
  `docs/shipping/evidence/qual-web-006-production-readonly-cdp-2026-10-11.md`.

## 2026-10-11 · Keep DIST-001 open after package recheck

- **Decision:** Accept the repaired public packer and six-archive inspection
  as code-side evidence, but do not check `DIST-001`.
- **Reason:** The package surface is clean and installable, while the declared
  `LOCAL/HUNT/RECORD` dependencies and final legal/release qualification are
  still open.
- **Boundary:** No registry publication, Production deployment, payment,
  database, entitlement, customer-data, or legal-review state changed.
- **Next:** Reassess `DIST-001` only after its dependencies are qualified;
  package evidence alone does not open `DIST-002`.
- **Evidence:**
  `docs/shipping/evidence/dist-001-package-boundary-recheck-2026-10-11.md`.

## 2026-10-11 · Keep LIC-003 open after notice recheck

- **Decision:** Accept deterministic notice generation as mechanical evidence
  only; do not check `LIC-003`.
- **Reason:** No final `.tgz` archives are present for package-surface
  qualification, and the dependent external-content/legal decisions in
  `LIC-002` remain open.
- **Boundary:** No package, registry, release, Production, provider,
  database, entitlement, account, or customer-data state changed.
- **Next:** Assess `DIST-001` after parking this boundary.
- **Evidence:**
  `docs/shipping/evidence/lic-003-notice-generator-recheck-2026-10-11.md`.

## 2026-10-11 · Keep LIC-002 open after mechanical inventory

- **Decision:** Accept the automated inventory and notice tests as mechanical
  evidence only; do not check `LIC-002`.
- **Reason:** Permission to redistribute or modify external engines, image
  layers/databases, fixtures, rules/recipes, and trademarks requires an
  authorized review of exact artifacts. The current legal packet has no
  reviewer, signature, decision, or approval date.
- **Boundary:** No release, registry, package, Production, provider,
  database, entitlement, account, or customer-data state changed.
- **Next:** Assess `LIC-003`.
- **Evidence:** `docs/shipping/evidence/lic-002-technical-recheck-2026-10-11.md`.

## 2026-10-11 · Keep STUDIO-CLI-001 open after code revalidation

- **Decision:** Accept the local projection and hosted-custody code evidence
  only; do not check `STUDIO-CLI-001`.
- **Reason:** The contract requires independent recipient-side redaction proof
  and a real authorized Studio recipient/customer acceptance run. Local tests
  and founder consent do not prove what the hosted recipient preserves.
- **Boundary:** No Production, provider, entitlement, account, customer, or
  public deployment write occurred.
- **Next:** Assess `LIC-002` as the next dependency-ready item.
- **Evidence:**
  `docs/shipping/evidence/studio-cli-001-code-revalidation-2026-10-11.md`.

## 2026-10-11 · Keep TEAM-CLI-001 open after code revalidation

- **Decision:** Accept the current CLI verification as implementation evidence
  only; do not check `TEAM-CLI-001`.
- **Reason:** The live acceptance contract needs a hosted organization-policy
  signer/trust root, mapped paid/non-production tenant, authorized GitHub
  repository binding, canonical policy row, and signed fetch/cache/offline/
  cross-tenant evidence. Local tests cannot create those facts.
- **Boundary:** No Production, database, provider, entitlement, account,
  repository, or customer-data write occurred.
- **Next:** Assess `STUDIO-CLI-001` as the next dependency-ready item.
- **Evidence:**
  `docs/shipping/evidence/team-cli-001-code-revalidation-2026-10-11.md`.

## 2026-10-11 · Final V1 product contract

- **Decision:** Final V1 remains one CLI across Free, Pro, Team, Studio, and
  Enterprise, with TypeScript/JavaScript as the initial native scanner
  surface; Hunt enabled through bounded signed recipes; Attest/portable
  Release Records required for Pro+; TopNotchh GitHub organization plus
  forked public TS/JS repositories as the authorized SCM test corpus; and
  Cards-only prepaid fixed-term billing with manual renewal.
- **Rationale:** This preserves the complete product value while removing the
  provider-specific automatic-renewal simulator dependency and avoiding
  customer-managed cryptographic roots in ordinary V1.
- **Boundary:** This is an implementation decision, not acceptance evidence.
  Hunt distribution, Attest completion, SCM integration, payment/entitlement
  reconciliation, AppSec review, legal approval, protected release, and final
  acceptance remain separately gated.
- **Authority:**
  `docs/shipping/FINAL_V1_PRODUCT_CONTRACT_2026-10-11.md`.

## 2026-10-10 · Do not treat scheduled Test Mode charges as renewal acceptance

- **Decision:** Keep `PLAN-WEB-014` and Gate 4 open after the current provider
  inventory recheck.
- **Observation:** Test Mode returned 5 active, 15 created/awaiting
  authorization, and 22 cancelled subscriptions; the earliest active charge
  is scheduled for 2026-11-08T18:30:00Z.
- **Reason:** A created subscription has no paid cycle, and a future scheduled
  charge has not produced a signed renewal, failure, retry, replay, or
  payment-to-ledger-to-license reconciliation.
- **Boundary:** No charge-now/replay call, provider update, Production write,
  database edit, entitlement grant, or customer-data mutation occurred.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-testmode-subscription-inventory-recheck-2026-10-10.md`.

## 2026-10-10 · Keep PLAN-CLI-003 open after authenticated Production probe

- **Decision:** Accept the current authenticated Production probe as boundary
  evidence only; do not check `PLAN-CLI-003`.
- **Evidence:** Forged paid-plan selection remained Free, the account had zero
  organizations, and forged organization/project/search/usage/receipt/policy/
  release/SCM reads were bounded without a state-changing request.
- **Missing:** An authorized isolated paid fixture plus complete public/private
  list/search/export runtime evidence from the modified/untrusted CLI client.
- **Production boundary:** Production is Cards-only and recurring billing is
  fail-closed because plan IDs/total-count configuration are absent. The local
  `.env.gates.testing` file was not deployed or printed.
- **Score:** **223/57/280 (79.6%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/plan-cli-003-production-authenticated-readonly-revalidation-2026-10-10.md`.

## 2026-10-10 · Do not treat ordinary Card capture as recurring acceptance

- **Decision:** Keep recurring billing fail-closed. A successful one-off Card
  payment does not satisfy the recurring tokenization/mandate gate.
- **Evidence:** Test Mode Subscriptions exposes no supported charge-now or
  replay control; Razorpay's official documentation describes saved-card
  tokenization as an on-demand Support-enabled feature.
- **Required unblock:** Account owner/provider Support must provide the enabled
  recurring-card fixture or supported renewal/delivery control, followed by
  signed webhook and complete payment/ledger/license reconciliation.
- **Boundary:** No undocumented provider call, guessed OTP, synthetic event,
  direct row edit, entitlement grant, or Production write.

## 2026-10-10 · Keep recurring checkout Cards-only in Production

- **Decision:** Recurring subscription creation and its hosted display must
  fail closed unless `card` is present in the server-owned method catalog.
- **Reason:** The release candidate is Cards-only; a broader order catalog must
  not accidentally expose unsupported recurring methods or create a provider
  subscription under an unqualified method.
- **Evidence:** Web `9a3c32a`, display **4/4**, isolated route integration
  **2/2**, Production `dpl_12hRaACdnE4SvGmFHZFXpcUCTsC2` READY, and read-only
  root/checkout HTTP 200 checks.
- **Disposition:** Keep `PLAN-WEB-014` and Gate 4 open until the remaining
  provider-generated lifecycle and signed reconciliation evidence exists.
- **Boundary:** No `.env.gates.testing` values were deployed; no provider,
  payment, database, entitlement, account, or customer-data write occurred.

## 2026-10-10 · Test Mode webhook ingress uses temporary Vercel bypass

For isolated Preview qualification only, one Razorpay Test Mode webhook URL
may carry a temporary Vercel Protection Bypass for Automation query parameter
when the Preview deployment is otherwise protected. The bypass is platform
reachability only; Razorpay HMAC verification remains mandatory and Production
URLs must not receive the parameter. The value is never stored in source,
evidence, chat, or logs and must be revoked/removed after qualification.

This decision was validated by a signed Test Mode pause/resume pair that
projected `active → paused → active` in the isolated database. It does not
authorize synthetic events, direct database edits, Production writes, or a
Gate 4 completion claim.

## 2026-10-10 · Keep Gate 4 open after Test Mode card activation boundary

- **Decision:** Treat the known Test Mode card-form interaction as an
  activation limitation, not a payment success. Keep Cards-only scope and
  Production recurring billing fail-closed.
- **Evidence:** The provider checkout remained on the card form after the
  official test-card fixture and two bounded activation attempts; read-only
  provider and isolated application aggregates were unchanged.
- **Next owner/action:** Authorized payment-test operator with Razorpay Test
  Mode operations must provide a changed supported subscription fixture or
  complete a real operator activation/OTP path. Then reconcile the signed
  webhook, payment, ledger, license, entitlement, and access state.
- **Release decision:** `PLAN-WEB-014` and Gate 4 remain open. Do not guess
  OTPs, edit rows, grant entitlements, or advance to another item/gate. Review
  by 2026-10-11 IST or on provider-fixture change.
- **Boundary:** No Production, manual database, entitlement, account, or
  customer-data write; score remains **219/61/280 (78.2%)**.
- **Evidence:** `docs/shipping/evidence/plan-web-014-testmode-card-activation-boundary-2026-10-10.md`.

## 2026-10-10 · Keep Cards-only route boundary qualified, not Gate 4 complete

- **Decision:** Keep the release candidate's declared hosted method set at
  `card`. Accept the protected Preview route result as evidence that the
  server-owned catalog returns only Cards; do not claim provider lifecycle
  acceptance from that response.
- **Evidence:** Web `445d8ed`, Preview `dpl_36zQf2zEsVCrxpic8rcrjFJbQbK7`,
  HTTP 200 Test Mode create-order response, catalog `2026-10-02.0`, method
  set `card`, focused checkout tests **12/12**, and passing 47-page builds.
- **Disposition:** `PLAN-WEB-014` and Gate 4 remain open. The next acceptance
  artifact must be provider-backed card authorization/capture followed by a
  signed webhook and exactly-once payment/ledger/license reconciliation, then
  the remaining replay/order, renewal, failure/expiry, refund, timeout/retry,
  and tenant-binding evidence.
- **Boundary:** No Production billing/database/entitlement/account/customer
  write. No manual isolated-row edit or entitlement grant. Score remains
  **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:** `docs/shipping/evidence/plan-web-014-cards-only-preview-route-and-hosted-display-2026-10-10.md`.

## 2026-10-10 · Keep Gate 4 open after provider/application reconciliation

- **Observation:** Read-only Razorpay Test Mode reconciliation matched all
  34/34 provider subscription IDs to isolated application rows, but 8
  provider-cancelled rows remain application-pending. Of 33 provider payment
  records, 9 have application rows and 24 remain provider-only.
- **Decision:** Record this as concrete reconciliation progress, not complete
  payment acceptance. Do not manually repair rows, grant entitlements, or
  claim provider-only payments as application fulfillment.
- **Next owner/action:** Authorized provider operation must deliver or replay
  the exact missing signed lifecycle events to the isolated webhook, followed
  by fresh read-only reconciliation.
- **Boundary:** No Production/provider/payment/database/entitlement/account/
  customer write occurred. Score remains **219/61/280 (78.2%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-provider-isolated-reconciliation-2026-10-10.md`.

## 2026-10-10 · Preserve divergent local CLI and qualify upstream release head

- **Decision:** Treat CLI `origin/main` `f5686b5c` as the release
  qualification head. Preserve local `main` `d0a3b217` without merge, reset,
  or force-push because it is 73 commits ahead and 883 behind and contains
  founder-owned untracked assets.
- **Reason:** Tests on a divergent local line cannot prove the remote release
  candidate. An isolated detached worktree at the upstream head preserves the
  owner’s work while keeping release evidence attributable.
- **Disposition:** Existing local `d0a3b217` evidence is labeled local-only;
  upstream `f5686b5c` evidence remains authoritative for CLI acceptance.
  `QUAL-CLI-006` and all dependent external gates stay open.
- **Boundary:** Read-only source inspection and isolated worktree only; no
  public source, deploy, package, provider, database, payment, entitlement,
  account, customer, or release state changed. Score remains
  **219/61/280 (78.2%)**.
- **Evidence:** `docs/shipping/evidence/cli-source-divergence-2026-10-10.md`.

## 2026-10-10 · Merge the Cardless EMI repair and use a pinned CI mirror

- **Decision:** Merge Web PR #172 as `98dd571` after replacing the
  rate-limited Docker Hub Postgres service with the matching Docker Official
  Image through ECR Public at a pinned image-index digest. Keep the observed
  `cardless_emi` to canonical `emi` mapping narrow and bound to the signed
  method snapshot.
- **Reason:** The provider representation was real and captured, while the
  prior literal comparison rejected it; the hosted verification failure was
  infrastructure-only and the official ECR mirror restored reproducible CI.
- **Verification:** Hosted run `37991101222` / job `114025167923` passed all
  required Web checks. Production deployment
  `dpl_EtggBABkjCRWS9NWHozgH6qbvr5J` passed runtime configuration and bounded
  read-only smoke.
- **Gate decision:** This advances Gate 4 and Production code rollout only.
  The full payment lifecycle, reconciliation, and Production activation gates
  remain open. Score remains **219/61/280 (78.2%)**; no checkbox changed.
- **Boundary:** No Production database, migration, payment, provider,
  entitlement, account, or customer-data write.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-cardless-emi-merge-production-2026-10-10.md`.

## 2026-10-10 · Bind provider Cardless EMI to canonical hosted EMI

- **Decision:** Accept only the observed provider representation
  `cardless_emi` as canonical `emi` when `emi` is explicitly present in the
  signed hosted-order snapshot. Do not add Cardless EMI to the enabled
  checkout catalog or loosen other method checks.
- **Reason:** The Test Mode account returned one captured `cardless_emi`
  payment for an order whose server-owned snapshot contained `emi`; literal
  comparison would reject a valid captured payment, while broad method
  acceptance would weaken commercial binding.
- **Evidence:** Web commit `210d880`, PR #172, focused tests **25/25**, full
  serial **900 total / 876 pass / 24 explicit skips / 0 fail**, typecheck,
  build, and read-only provider observation. Hosted schema verification is
  held by the Docker Hub Postgres pull-rate limit before test execution.
- **Disposition:** Keep Gate 4 and `PLAN-WEB-011/012/014/015` open until the
  complete method/lifecycle/reconciliation matrix is evidenced. Score remains
  **219/61/280 (78.2%)**; no checkbox changed.
- **Boundary:** No Production, provider, payment, database, entitlement,
  account, or customer-data write.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-cardless-emi-binding-2026-10-10.md`.

## 2026-10-09 · Record authoritative CLI transport hardening

- **Decision:** Treat CLI commit
  `1972af3abe648312a427c20dc96bbcce54db55a` as the authoritative API-origin
  hardening source. The earlier `439b782d` remains a stale-checkout
  historical record and is not a release claim.
- **Result:** All bearer-bearing configured API transports reject unsafe bases
  before request construction; the focused and complete CLI suites pass
  **24/24** and **44/44**, with workspace typecheck/build **12/12** each.
- **Production boundary:** Production remains in scope, but this CLI-only
  batch required no Web redeploy and made no npm, provider/payment, plan,
  database/migration, entitlement, account, or customer-data write.
- **Disposition:** Keep `PLAN-CLI-003`, `QUAL-CLI-006`, Gate 4, and the
  external reviewer/legal/protected-release/rollback/final-acceptance gates
  open. Score remains **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/cli-api-origin-hardening-authoritative-2026-10-09.md`.

## 2026-10-09 · Restore standards importer source before claiming validation

- **Decision:** Restore the missing bounded parser/importer source and public
  exports required by the existing standards-validation corpus.
- **Reason:** The checked-out public `main` tree contained the corpus test but
  lacked the source modules it imported; generated `dist` files are not a
  source or release qualification substitute.
- **Evidence:** Public CLI `d0a3b21`; standards corpus **7/7**, focused CLI
  suite **17/17**, root Turbo test/typecheck/build graphs **8/8**, **11/11**,
  and **6/6**.
- **Gate decision:** Keep `QUAL-CLI-006` open for official validators,
  trusted release provenance, cross-platform clean-consumer evidence,
  protected publishing, legal approval, and independent acceptance.
- **Production boundary:** This code-only batch made no Production deploy or
  plan/provider, payment, database/migration, entitlement, account, or
  customer-data write. The Production scope remains end-to-end in the active
  goal; current operation remains fail-closed.
- **Score:** **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/qual-cli-006-standards-source-restoration-2026-10-09.md`.

## 2026-10-09 · Reject unsafe saved CLI API origins

- **Decision:** Require every CLI network helper to resolve its configured API
  base to a bare HTTPS origin before building a request. Preserve explicit
  custom/self-hosted HTTPS origins; reject HTTP and URL components that could
  redirect or reinterpret a request target.
- **Reason:** A locally editable credentials file must not be able to cause a
  license bearer to be sent to an unsafe destination. The boundary is enforced
  before fetch, not only by response handling.
- **Evidence:** CLI `439b782d`, focused tests **17/17**, typecheck, build,
  and `docs/shipping/evidence/cli-api-origin-hardening-and-provider-renewal-limit-2026-10-09.md`.
- **Provider decision:** Do not fabricate renewal/expiry events. The current
  Test Mode inventory has no due active subscription, and the official
  provider material does not document an immediate trigger. Keep the provider
  lifecycle rows open and continue independent backend work.
- **Boundary:** No Production or provider write, database/migration write,
  entitlement/account/customer-data mutation, deployment, or release occurred
  in this CLI batch. Score remains **219/61/280 (78.2%)**.

## 2026-10-09 · Keep Gate 4 open after lifecycle ordering repair

- **Decision:** Ship Web `6f932d4` to Production as a fail-closed code-only
  correction because the observed provider lifecycle regression could stale
  billing projections without requiring Production activation.
- **Evidence:** Focused tests **38/38**, typecheck, 47-page build, remote
  runtime-config/build, and read-only smoke passed. Production deployment
  `dpl_CvNvt9YEQLMhnEB8htL7eiCocbmG` is READY.
- **Isolated qualification:** Fresh Test Mode hosted active and cancellation
  reconciled to isolated active/cancelled rows; captured payment and paid time
  were preserved. Signed application-path replay repaired the prior stale
  rows, with aggregate binding **5 active→active, 7 cancelled→cancelled, 9
  created→pending**.
- **Gate decision:** This is not a complete Gate 4 pass. Provider-generated
  renewal, expiry, failure/refund, external delivery ordering, timeout/retry,
  exactly-once, and complete enabled-method evidence remain open.
- **Boundary:** No Production plan, provider/payment, database/migration,
  entitlement, account, or customer-data write occurred.
- **Score:** **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-lifecycle-ordering-reconciliation-2026-10-09.md`.

## 2026-10-09 · Deploy hosted retry repair to Production without activation

- **Decision:** Deploy Web `0bafe73` to Production because the hosted
  `payment.failed` retry defect is customer-facing and the change preserves
  the fail-closed billing boundary.
- **Evidence:** Focused tests **20/20**, typecheck, 47-page build, remote
  Production validation, and read-only smoke passed. Deployment
  `dpl_GnVheZKWyqbMX2zdDfsHmy8y9xHB` is READY and aliased to
  `https://verglos.com`.
- **Boundary:** Do not add Production plan IDs or Test Mode values and do not
  perform Production provider/payment, database/migration, entitlement,
  account, or customer-data writes.
- **Gate decision:** Keep Gate 4 open. Exact isolated reconciliation found
  five provider `active` rows projected as `authenticated`, in addition to
  the still-missing renewal, failure/expiry, refund, replay/out-of-order,
  exactly-once, and complete-method evidence.
- **Score:** **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-hosted-retry-production-rollout-2026-10-09.md`.

## 2026-10-09 · Deploy Web `7373c8b` to Production as fail-closed code only

- **Decision:** Ship the checkout-origin repair to Production because it fixes
  a reproducible browser integration defect, while keeping Production billing
  and persistent writes disabled.
- **Reason:** The browser debug profile reached the checkout page but its
  same-origin POST omitted `Origin`; Next reconstructed the request URL with a
  different loopback host, causing a false 403. The new helper is covered by
  focused tests and preserves foreign-origin rejection.
- **Evidence:** Deployment `dpl_CLo119NrTffsbLiaNKw4Pq7K2kCA` is READY and
  aliased to `https://verglos.com`; runtime-config/build validation and
  read-only smoke passed.
- **Boundary:** No Production plan IDs, Test Mode values, provider/payment
  calls, migrations, database writes, entitlement changes, account changes,
  or customer-data mutations. Do not interpret the code rollout as billing
  activation.
- **Disposition:** Keep Gate 4 and the Production activation,
  current-backup/RPO, migration, reconciliation, monitoring, rollback,
  reviewer, legal, protected-release, and final-acceptance stages open. An
  isolated Test Mode card attempt returned to provider retry and is not
  counted as success. Score remains **219/61/280 (78.2%)**.
- **Evidence:**
  `docs/shipping/evidence/production-code-rollout-7373c8b-2026-10-09.md`.

## 2026-10-09 · Deploy Web `fa1b9f5` to Production as fail-closed code only

- **Decision:** Include and execute the Production code-rollout stage now,
  without activating billing or hosted data mutation.
- **Evidence:** Vercel deployment `dpl_4cb7vvAA88aZe3FKXftdmYfSbGJN` is READY
  and aliased to `https://verglos.com`; runtime-config/build validation and
  read-only smoke passed. Previous READY deployment
  `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` is retained as rollback target.
- **Boundary:** Do not copy Test Mode plan IDs, credentials, Preview database
  URLs, webhook secrets, or fixture identities into Production. No Production
  plan, payment/provider, migration, database, entitlement, account, or
  customer-data write occurred. Source migration `0038` was not executed.
- **Disposition:** Treat this as a completed Production code-rollout slice,
  not as live billing activation. Keep Gate 4, migration/RPO/reconciliation,
  rollback, monitoring, independent review, legal, protected release, and
  final acceptance rows open until their evidence exists. Score remains
  **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/production-code-rollout-fa1b9f5-2026-10-09.md`.

## 2026-10-09 · Record partial hosted cancellation evidence without closing Gate 4

- **Decision:** Record the corrected isolated Preview Test Mode cancellation,
  replay, out-of-order, owner-binding, and provider/database reconciliation
  results as partial Gate 4 evidence.
- **Reason:** The provider-bound signed event was accepted, an exact replay was
  deduplicated, an older activation did not resurrect state, and the isolated
  database matched the provider. The malformed first harness payload was
  correctly rejected and is excluded from acceptance.
- **Boundary:** This does not prove renewal/charge, failure/expiry, refund,
  timeout/retry, complete payment-method coverage, or full exactly-once
  entitlement reconciliation. Production remains code-only and fail-closed.
- **Disposition:** Keep Gate 4 open and leave the backlog score at
  **219/61/280 (78.2%)** until the missing lifecycle evidence exists.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-hosted-subscription-cancel-replay-2026-10-09.md`.

## 2026-10-09 · Accept checkout terminal-state repair without closing Gate 4

- **Decision:** Accept Web `fa1b9f5` as a code-side repair for terminal
  subscription UX: cancelled/completed/expired/halted responses stop polling
  and offer a bounded restart; paid/refunded responses remain authoritative.
- **Reason:** The behavior was exposed by real isolated Test Mode cancellation
  evidence. The fix prevents a customer from being trapped in an indefinite
  processing state, while the actual hosted provider lifecycle remains
  unqualified.
- **Boundary:** Focused/local/hosted checks passed. No Production plan,
  provider/payment, database/migration, entitlement, account, or customer-data
  state changed.
- **Disposition:** Keep Gate 4 and `PLAN-WEB-011`, `PLAN-WEB-012`,
  `PLAN-WEB-014`, and `PLAN-WEB-015` open until hosted authorization/capture,
  lifecycle delivery, and complete reconciliation evidence exists. Score
  remains **219/61/280 (78.2%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-checkout-terminal-lifecycle-2026-10-09.md`.

## 2026-10-09 · Accept the isolated Test Mode cancellation slice, keep Gate 4 open

- **Decision:** Accept the real Test Mode subscription creation/cancellation,
  signed local webhook, replay, and out-of-order result as partial Gate 4
  evidence only.
- **Reason:** The provider credential now returns HTTP 200 inventory and the
  local isolated route reconciles cancellation correctly, but Vercel
  Authentication blocks the deployed Preview before application execution.
  Hosted authorization/capture, provider delivery, renewal/failure/expiry,
  refund, and full entitlement reconciliation are not proven.
- **Boundary:** Test Mode and `TEST_DATABASE_URL` only. No Production plan,
  payment/provider, database/migration, entitlement, account, or customer-data
  state changed.
- **Disposition:** Keep `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`,
  `PLAN-WEB-015`, and Gate 4 open. The next external action is authenticated
  access to the protected Preview (or an approved bounded protection setting)
  followed by hosted subscription authorization and webhook delivery; no
  protection bypass is permitted. Score remains **219/61/280 (78.2%)**.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-local-testmode-subscription-cancellation-2026-10-09.md`.

## 2026-10-09 · Keep Production complete but staged

- **Decision:** Treat Production as a full staged workstream. The current
  operation may be a fail-closed code rollout only, but later configuration,
  billing/database/entitlement activation, monitoring, reconciliation, and
  rollback remain required in the same shipping goal.
- **Reason:** A green hosted build does not prove migration compatibility,
  current-backup RPO, provider lifecycle correctness, or safe write recovery.
  The current Web candidate `315a432` is migration-bearing and its restore
  rehearsal has a stale approximately 441-hour snapshot.
- **Boundary:** Keep the known Production deployment
  `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` fail-closed. No Production plan IDs,
  payment/provider writes, database/migration writes, entitlement changes,
  account changes, or customer-data mutations occurred in this batch. Do not
  copy Test Mode or Preview values into Production.
- **Disposition:** Do not promote the migration-bearing candidate until the
  operation-specific migration, current-backup, reconciliation, and rollback
  preflight is complete. No checkbox changed; score remains
  **219/61/280 (78.2%)**.
- **Evidence:**
  `docs/shipping/evidence/production-and-preview-auth-rollout-2026-10-09.md`.

## 2026-10-09 · Prepare, but do not approve, the legal addendum

- **Decision:** Use a private structured addendum for Gate 7 review; keep all
  legal/licensing and dependent release rows open until an authorized reviewer
  completes the exact decisions and sign-off.
- **Reason:** Existing technical inventories identify versions, digests, and
  unresolved restrictions but are not legal approval. The new packet makes the
  required decision surface explicit without inventing counsel or clearance.
- **Boundary:** No license was marked clear, no notice was suppressed, and no
  package, registry, Production, provider, database, payment, deployment, or
  customer state changed.
- **Evidence:** `docs/shipping/legal/legal-review-addendum-2026-10-09.md`.
- **Score:** **219/61/280 (78.2%)**; no checkbox changed.

## 2026-10-09 · Use a superseding exact-head Hunt review packet

- **Decision:** Keep the 2026-10-02 packet as historical evidence and use the
  superseding 2026-10-09 packet for any independent review.
- **Reason:** The old packet targeted CLI `b781bc4`; the current reviewed CLI
  head is `8bea4be2`, with current hosted self-scan `37827269372` and pinned
  Docker evidence. A reviewer must inspect the exact current commit.
- **Boundary:** Packet preparation does not constitute independent review.
  Codex will not sign it and no reviewer identity or recommendation is
  invented. No external or Production state changed.
- **Disposition:** `HUNT-011` and `QUAL-CLI-004` remain open until the real
  reviewer report and the remaining trusted/licensed provenance evidence
  exist. Score remains **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/hunt-independent-review-packet-2026-10-09.md`.

## 2026-10-09 · Keep provider lifecycle gate open after invoice-failure qualification

- **Decision:** Accept the invoice-only failed subscription path as isolated
  code/database qualification, but do not close Gate 4 or payment backlog
  checkboxes.
- **Reason:** The handler and reconciliation path now pass, but the current
  gate-testing plan and subscription inventory calls return HTTP 401. Real
  provider-generated lifecycle evidence cannot be inferred from local tests or
  Preview code.
- **Boundary:** No provider write was attempted after the 401. Production
  remains a fail-closed code-only rollout; no Production plan, payment,
  database/migration, entitlement, account, or customer-data write occurred.
- **Next owner/action:** Authorized Web/release operator corrects the isolated
  Razorpay Test Mode credential configuration without sending secrets in chat;
  then rerun read-only inventory before any Test Mode lifecycle write.
- **Score:** **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-failed-subscription-invoice-binding-2026-10-09.md`.

## 2026-10-09 · Qualify expiry in Preview before Production migration preflight

- **Decision:** Accept the Web code-side `expired` lifecycle qualification in
  isolated Preview, but do not promote migration `0037_billing_subscription_expired.sql`
  to Production yet.
- **Reason:** The fresh database, focused integrations, full Web suite, and
  protected Preview deployment pass. Production promotion would change the
  database schema and therefore needs an operation-specific migration
  preflight, backup/restore or recovery evidence, reconciliation, and
  rollback/forward-fix decision.
- **Boundary:** Production remains a real, active fail-closed code-rollout
  track. No Production plan IDs, payment/provider writes, database or
  migration writes, entitlement changes, account changes, or customer-data
  mutations occurred.
- **Disposition:** Provider-generated expiry and the rest of Gate 4 remain
  open. Score remains **219/61/280 (78.2%)**; no checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-expired-lifecycle-preview-2026-10-09.md`.

## 2026-10-09 · Cancellation preserves already-paid entitlement time

- **Decision:** Treat a provider `subscription.cancelled` event as a
  cancellation of future subscription charging, while preserving the license
  period already granted by a captured payment.
- **Evidence:** Isolated Razorpay Test Mode cancellation returned HTTP 200 and
  reconciled to a cancelled subscription with one captured payment and one
  active license in the isolated Preview database. No direct row edit occurred.
- **Boundary:** Test Mode and isolated Preview only; Production remained
  fail-closed with no plan, payment, database, entitlement, account, or
  customer-data writes.
- **Disposition:** This validates one Gate 4 lifecycle slice but does not
  close the complete matrix. Score remains **219/61/280 (78.2%)**; no
  checkbox changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-test-mode-subscription-cancellation-2026-10-09.md`.

## 2026-10-09 · Supersede stale Production deployment reference

- **Decision:** Treat Web source `a95deef` and Production deployment
  `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` as the current Production code-rollout
  record. Older deployment identifiers remain historical and must not be used
  as the current state.
- **Boundary:** The rollout is fail-closed and code-only. No Production plan
  IDs, payment/provider writes, database or migration writes, entitlement
  changes, account changes, or customer-data mutations occurred. Billing and
  database activation remain included later stages with operation-specific
  preflight, recovery, reconciliation, and rollback evidence.
- **Score:** **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-subscription-invoice-reconciliation-and-production-rollout-2026-10-09.md`.

## 2026-10-09 · Promote reviewed code to Production without activation writes

- **Decision:** Deploy the reviewed Web source to Production as a complete
  fail-closed code rollout. Production is included in the shipping objective;
  the current operation does not activate billing or mutate hosted state.
- **Evidence:** Deployment `dpl_HRbg2hLmHe2WTFxvupkewdw3u9hg` is READY and
  aliased to `https://verglos.com`; local and remote build/config checks passed;
  public smoke passed for the documented routes and method/auth boundaries.
- **Boundary:** Do not add Test Mode plan IDs, test credentials, Preview
  database URLs, or test webhook secrets to Production. No Production
  database, migration, payment/provider, entitlement, account, or
  customer-data write occurred. Live activation remains an included later
  stage requiring its own exact preflight, recovery, reconciliation, and
  rollback/forward-fix decision.
- **Score:** **219 checked / 61 unchecked / 280 total (78.2%)**; no checkbox
  changed.
- **Evidence:**
  `docs/shipping/evidence/production-code-rollout-dpl-HRbg2hLmHe2WTFxvupkewdw3u9hg-2026-10-09.md`.

## 2026-10-09 · Make Production a first-class staged shipping track

- **Decision:** Production work is included in the active goal. Ship reviewed
  code and run read-only smoke/monitoring/reconciliation work when the
  code-rollout preflight passes; activate Production billing or database
  writes only after the operation-specific backup, restore, dry-run,
  reconciliation, and rollback preflight passes.
- **Reason:** Production cannot be treated as irrelevant, but Test Mode
  credentials, Test Mode plan IDs, Preview databases, and test webhook
  fixtures must never be copied into Production. A fail-closed Production
  code rollout is a real shipping step, not a final billing acceptance.
- **Evidence:** Web Production deployment
  `dpl_E3Xr4UZe1ZXaZfRB7ygvS8HvmQTs` is READY and aliased to
  `https://verglos.com`; `/` and `/checkout` returned HTTP 200. Preview
  deployment `dpl_CwmAKov2aoDJmyk9o5LqHS849TEJ` is READY with the canonical
  Test Mode plan IDs.
- **Boundary:** No Production database, migration, payment, provider,
  entitlement, account, or customer write occurred. Score remains
  **219/61/280 (78.2%)** and no checkbox changed.

## 2026-10-09 · Use the valid Test Mode pair and create canonical plans

- **Decision:** Do not rotate the Razorpay Test Mode key. The pair in the
  local gate-testing file is accepted by Razorpay with HTTP 200. Create and
  use canonical Pro monthly/yearly plans in Test Mode, configure only
  isolated Preview with their non-secret IDs, and keep Production separate.
- **Reason:** The earlier 401 was caused by the stale/different local test
  file, not by the dashboard pair used for this batch. Rotation would add no
  value once a valid pair is available.
- **Evidence:**
  `docs/shipping/evidence/plan-web-011-015-test-mode-plans-production-rollout-2026-10-09.md`.
- **Boundary:** No secret was printed or committed; no Production provider,
  database, payment, entitlement, account, or customer state changed.

## 2026-10-09 · Accept PLAN-WEB-013; keep the complete payment gate open

- **Decision:** Accept `PLAN-WEB-013` only. The server-owned payment catalog,
  hosted order abstraction, signed commercial binding, fail-closed method
  surface, and captured-only fulfillment are now evidenced for the four
  provider-testable methods.
- **Evidence:** Preview and Production expose `card`, `netbanking`, `wallet`,
  and `emi`; the canonical-amount Test Mode aggregate, isolated database
  matrix, focused tests, typecheck, and build are in the private payment
  lifecycle evidence.
- **Boundary:** This does not close Gate 4 or `PLAN-WEB-011/012/014/015`.
  Provider subscription renewal/cancellation/expiry and full Production
  reconciliation remain unproven; no such evidence is inferred from local
  fixtures or the absence of provider rows. Score is **219/61/280 (78.2%)**.

## 2026-10-09 · Apply the provider-testable payment method set to Production

- **Decision:** Apply the narrowed method set to Vercel Production:
  `card,netbanking,wallet,emi`. The Production environment variable was
  overridden and deployed through the normal Vercel production path.
- **Evidence:** Production deployment `dpl_J1kkum4myNwMnt96EpCQwKtfvnB9`
  reached READY, the `verglos.com` alias was updated, `/checkout` returned
  HTTP 200, and the deployment response exposed only the four enabled method
  names.
- **Boundary:** No Production database, Razorpay key, webhook secret,
  payment, entitlement, or customer record was changed. UPI/Pay Later remain
  unavailable until an approved provider flow exists. PLAN-WEB-014 remains
  open for the four-method lifecycle matrix and remaining lifecycle cases.
  Count remains **218/62/280 (77.9%)**.

## 2026-10-09 · Narrow Preview payment methods to provider-testable set

- **Decision:** Remove `upi`, `upi_qr`, and `paylater` from the isolated
  Preview/Test configuration after the provider exposed only a QR-only UPI
  surface and rejected the Pay Later fixture. Keep `card`, `netbanking`,
  `wallet`, and `emi` enabled.
- **Reason:** A rendered method label or an unusable QR/OTP screen is not
  provider lifecycle evidence. Razorpay Test Mode produced captured provider
  records for the four remaining methods, while UPI and Pay Later produced no
  payment row.
- **Evidence:** Preview variable and local `.env.test.local` now agree; the
  Preview deployment `dpl_H7cXmiGNqddiEvwY9Dgf8rWLeZEK` built successfully and
  its checkout response contains only the four enabled method names.
- **Boundary:** Production was subsequently narrowed to the same four methods
  and redeployed. PLAN-WEB-014 remains open for the four-method lifecycle matrix and renewal,
  cancellation, expiry, replay, timeout, refund, and tenant evidence. Count
  remains **218/62/280 (77.9%)**.

## 2026-10-09 · Accept code-side payment qualification; retain provider lifecycle gate

- **Decision:** Accept the isolated database and code-side payment
  qualification rerun as evidence, but do not mark PLAN-WEB-014 complete.
- **Evidence:** Razorpay Test Mode has 16 canonical-amount payment rows with
  captured card/netbanking/wallet/`cardless_emi` outcomes, failed
  card/netbanking/wallet outcomes, and two processed full refunds. The
  isolated Docker PostgreSQL hosted-order, ledger, webhook-handler, and
  webhook-claim integrations pass 6/6; focused payment/runtime tests pass
  55/55 with one intentional skip; typecheck and the 43-route build pass.
- **Boundary:** The provider account has zero Test Mode subscriptions and the
  current Web surface has no subscription-creation route. Therefore provider
  renewal/cancellation/expiry evidence cannot be claimed, and the remaining
  provider-side matrix stays open. No production payment, database,
  entitlement, customer record, or backlog checkbox changed.

## 2026-10-09 · Qualify the isolated hosted capture/refund slice and keep the full matrix open

- **Decision:** Accept the protected Preview capture → signed webhook →
  entitlement → full-refund reconciliation result as a qualified lifecycle
  slice, but keep PLAN-WEB-014 open until every enabled method and the
  remaining lifecycle/replay/tenant cases are documented.
- **Reason:** The first provider capture exposed that the runtime Neon HTTP
  driver cannot execute the billing ledger's interactive transactions. Web
  commit `d8dc35a` switched the application runtime to the existing
  transaction-capable PostgreSQL driver, after which deployed Preview capture
  and refund paths returned HTTP 200 and the isolated database reconciled both
  payment and license state.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-hosted-payment-lifecycle-2026-10-09.md`.
- **Boundary:** Razorpay remained in Test Mode and all state was isolated to
  Preview/test infrastructure. No production payment, database, deployment,
  entitlement, or backlog checkbox changed. Count remains **218/62/280
  (77.9%)**.

## 2026-10-09 · Require complete release-boundary rollback rehearsals

- **Decision:** A `DIST-006` rollback rehearsal is invalid unless it covers
  exactly one npm-package, engine-manifest, Hunt-feed, signing-identity, and
  Web-deployment operation. Duplicate or missing boundary kinds fail closed.
- **Reason:** A partial fixture could previously report a successful rehearsal
  without exercising every boundary named by the backlog acceptance criteria.
- **Evidence:** CLI PR #87 merged as `8bea4be`; focused rollback tests **5/5**,
  package/release contracts **11/11**, CLI checks, and all hosted checks pass.
- **Boundary:** This is local fixture/parser hardening only. It does not
  authorize or execute provider/registry/signing/deployment rollback,
  revocation, production writes, or release publication. `DIST-006` remains
  open.

## 2026-10-08 · Accept only the bounded accessibility correction from the route sweep

- **Decision:** Keep the `/docs/2.0.0` contrast correction in Web PR #164, but
  do not change public metadata, pricing, copy, or the unlinked `/pricing`
  route during this batch.
- **Evidence:** Local post-fix Lighthouse is Accessibility 100 / Best Practices
  100; Web typecheck, truth-registry 25/25, serial 862/24/0, and 45-page
  build pass. Remaining route findings are the held meta-description and
  optional llms.txt recommendation.
- **Reason:** The contrast defect is a concrete WCAG-affecting styling issue;
  metadata and pricing changes are explicitly reserved for the founder-
  authorized truth pass.
- **Hosted result:** Web PR #164 merged as
  `394d697903b7fa12ec537dc667f3807cdd75f588` after hosted typecheck/schema,
  Vercel, Preview Comments, and GitGuardian passed.
- **Boundary:** QUAL-WEB-006 remains open for human screen-reader, keyboard,
  paid/org data, large-data, responsive, field-CWV, and complete route
  evidence. No production state changed.

## 2026-10-08 · Preserve legacy entitlement activation during v2 unavailability

- **Decision:** Keep legacy v1 entitlement persistence as the compatibility
  fallback when v1 validation succeeds but v2 issuance returns a bounded
  unavailable response.
- **Evidence:** CLI PR #84 source `7c02099`; focused process/entitlement suite
  63/63 and local full test/typecheck/build/lint gates pass.
- **Hosted result:** PR #84 merged as
  `94829e1a4fc8e42dd67545e99cbe9a3a837b9482` after all hosted platform,
  self-scan, and in-toto checks passed.
- **Boundary:** This is local synthetic compatibility evidence only. Deployed
  signer/catalog alignment, released-version migration, and hosted activation
  remain required before PLAN-CLI-004 acceptance.

## 2026-10-08 · Resolve truth-registry mirror divergence

- **Observation:** The objective names `VERGLOS_TRUTH_REGISTRY.md`, but the
  private tracker has no current mirrored file. The public CLI worktree has an
  older untracked founder-owned copy with stale checkpoints and must remain
  untouched.
- **Resolution:** Treat the private backlog, evidence, status, risks,
  decisions, traceability, execution ledger, and release gates as the current
  shipping authority. Preserve the public untracked asset and schedule a
  reviewed truth-registry reconciliation before any final public-copy edit.
- **Reason:** This prevents a stale public mirror from silently overriding
  current production, Web, CLI, and private evidence.
- **Boundary:** No public file, price, deployment, database, provider, payment,
  or production state changed.

## 2026-10-08 · Hold public docs price correction for final truth pass

- **Observation:** Read-only production `/docs` passed Accessibility, Best
  Practices, and SEO at 100 with no console warnings/errors, but its plan table
  still shows legacy `$29/mo` and `$199/mo` rows. Production currently exposes
  the verified INR Pro catalog.
- **Decision:** Record the contradiction and defer public copy/pricing edits
  until the objective's truth-registry and final-public-pass gates authorize
  them. Do not invent Team/Studio/Enterprise prices from the stale rows.
- **Other finding:** Lighthouse's optional Agentic Browsing score was 67 due
  only to the `llms.txt` recommended-H1 audit.
- **Boundary:** No public copy, price, provider, database, or deployment write
  occurred. FINAL-WEB and QUAL-WEB-006 remain open.

## 2026-10-08 · Keep rollback rehearsal local and history-preserving

- **Decision:** Add a bounded `release rollback-rehearsal` command that
  exercises every release rollback/revocation kind through the shared
  fail-closed decision contract and verifies historical record references stay
  unchanged.
- **Reason:** This advances DIST-006 without inventing provider credentials or
  performing an irreversible registry, signing, deployment, database, or
  production operation.
- **Evidence:** CLI PR #83 merged as `c1a2856`; focused **4/4**, full CLI test
  tasks **12/12**, typecheck, build, lint, and hosted in-toto binding passed.
- **Boundary:** This is not authenticated provider rollback/revocation or
  trusted release acceptance. DIST-002/003/006 and independent operational
  review remain open; no checkbox changed.

## 2026-10-08 · Preserve payment identity across out-of-order failure/capture

- **Decision:** A failed Razorpay observation must not permanently poison the
  same exact provider-payment identity. A later bound capture promotes that
  row and grants once; a late failure after capture/refund is an idempotent
  no-op.
- **Evidence:** Web PR #161 merged as
  `ec02cacf69f3adb0d8df5ccb36a1a4eb5ef4cc3f`; isolated ledger/webhook
  integration **3/3**, focused payment suite **54/54**, and hosted Verify
  `37781035716` passed.
- **Boundary:** This is code-side lifecycle hardening only. Live provider
  method/lifecycle, production reconciliation, and payment release gates
  remain open. No production/provider/database/deployment write occurred.


## 2026-10-08 · Keep CI payload generation source-free and delivery-neutral

The CLI command may validate and emit the shared check payload locally, but it
must not infer delivery success, upload source, fetch a hosted record URL, or
contact a provider. Provider delivery stays behind the signed organization
policy, installation authorization, tenant binding, bounded retry/replay, and
hosted qualification gates.

Evidence: CLI PR #80 head
`58bb9383bdd1273e973620472ffc2d9255be7e9d` and
`docs/shipping/evidence/team-cli-002-cli-check-payload-2026-10-08.md`.

## CLI entitlement cache and reporting · 2026-10-08

Bind local capability cache reuse to license plus API endpoint and preserve
server-side authorization as the security boundary. Reject legacy unbound
caches until refresh instead of attributing them to whichever account happens
to be current. whoami plan represents effective capability authority; retain
licensePlan for the server/cached license label. Evidence: PR #80 (`8f731b3`),
103/103 focused tests and successful configured CLI suite.
Evidence: `docs/shipping/evidence/plan-cli-cache-identity-whoami-2026-10-08.md`.

## 2026-10-08 · Keep Preview test identity strictly non-production

- **Decision:** Permit an explicit internal fixture identity only when the
  runtime is non-production Preview, all fixture fields are bounded, and the
  request carries the operator-supplied secret. Keep normal Clerk auth and
  production auth unchanged.
- **Evidence:** Web PR #157 merged as
  `51bb6fe701b65ffcb2a322e1ff5d67eeb99df3fe`; focused auth tests and the full
  hosted verification suite passed. The local browser reached the real order
  route, while the flagged Test Mode provider credential failed before order
  creation.
- **Boundary:** This is an internal qualification instrument, not founder
  access, payment acceptance, or an entitlement bypass. PLAN-WEB-014/015 remain
  open; no provider, production, database, payment, webhook, or entitlement
  write occurred.

## 2026-10-08 · Freeze the failing Test Mode credential after bounded route attempt

- **Correction:** The local browser qualification made one bounded hosted-order
  request through the app after the Preview fixture authenticated. Razorpay
  returned the app’s bounded provider-failure response before an order was
  created; this was not a successful payment or lifecycle event.
- **Decision:** Make no further provider requests with this credential until it
  is repaired or rotated. Preserve the failure as a limitation, not as a
  provider-method result.
- **Boundary:** Local database counts stayed zero for users, licenses,
  payments, subscriptions, and webhook events. No production or deployment
  write occurred.

## 2026-10-07 · Keep production fail-closed on unknown payment methods

- **Decision:** Do not guess or add `RAZORPAY_ENABLED_PAYMENT_METHODS` in
  production. Keep the hosted payment rollout blocked until R-041 is closed
  and the provider account-enabled method set is established from an approved
  source.
- **Evidence:** Web PR #155 merged as
  `f00b7225ae0c0b8f518e404828aa6247c97dd322`; the automatic production
  deployment `dpl_Btjq8knubUab1ENgF7CEtzdUFV7G` failed in
  `pnpm config:check` because the variable is absent. The live alias remains
  the legacy QR-only checkout.
- **Boundary:** No production configuration, provider, database, payment, or
  customer-state write was made. Test Mode disclosure is code evidence only;
  PLAN-WEB-014/015 remain open.

## 2026-10-07 · Show Test Mode before hosted checkout

- **Decision:** A Test Mode checkout must disclose sandbox/no-real-charge
  status before a user opens Razorpay Checkout; the indicator exposes only a
  boolean and fails closed on public/server key drift.
- **Evidence:** Web PR #155 head `6b0c4f9`; host and Node 22 focused checks,
  typecheck, and 43-page preview build passed. Hosted Verify, GitGuardian, and
  Vercel Preview Comments later passed and the PR merged; see the merge
  decision above.
- **Boundary:** This improves payment disclosure but is not provider lifecycle
  acceptance. The automatic production deployment failed closed on the
  missing method allowlist; no production configuration or provider state
  changed.

## 2026-10-07 · Freeze flagged Razorpay Test Mode credential

- **Decision:** Treat the final redacted read-only inventory as historical
  context only and make no more provider requests with this credential until
  it is rotated/repaired.
- **Evidence:** 10 created orders, 4 payments (3 created/1 captured), 0
  subscriptions, 0 plans, and 1 webhook configuration; no identifiers or
  response bodies retained.
- **Boundary:** This does not qualify enabled methods or any payment
  lifecycle, and no provider or production write occurred. `PLAN-WEB-014/015`
  remain open.

## PLAN-WEB-014 Test Mode credential preflight · 2026-10-07

- **Decision:** Treat the test key and HTTP 200 Orders response as a usable
  precondition only; do not treat it as payment acceptance.
- **Boundary:** The seven method names come from application configuration, not
  provider-account truth. Browser qualification was deferred after Chrome
  DevTools and Playwright MCP returned `Transport closed`. A fallback probe
  attempted one Test Mode order creation but returned no usable result; no
  lifecycle evidence was accepted and no production write occurred.
- **Next:** Restore a bounded browser instrument, observe the provider-hosted
  Checkout in Test Mode, and qualify each actually enabled method and lifecycle
  before revisiting PLAN-WEB-014.

## Web current-main Node 22 qualification · 2026-10-07

- **Decision:** Accept the exact-head Node 22 and disposable-database results
  as supporting evidence; do not close payment, production, or final release
  gates.
- **Evidence:** Web main
  `14988371cdae94d66d068b49d07cc31f0b26c5ea`; serial pretest **49/49**, main
  **879/880**, one explicit skip, zero failures; 37 migrations, schema,
  negative-boundary **2/2**, truth registry **25/25**, and typecheck passed.
- **Boundary:** Provider lifecycle, production reconciliation, deployment
  acceptance, and final independent review remain open. Disposable database
  and worktree only; no checkbox or external state changed.

## QUAL-CLI-006 Node 22 current-main qualification · 2026-10-07

- **Decision:** Accept the pinned Node 22 run as supporting runtime evidence;
  do not close QUAL-CLI-006 or authorize release publication.
- **Evidence:** Exact CLI head
  `7d060b2852551cc017bbb2b5f70bad22843e7273`; fresh install; Turbo test
  **12/12**, typecheck **13/13**, build **8/8**, all exit `0`.
- **Boundary:** The container was removed cleanly. Official/trusted/legal/
  independent release gates remain open; no source, production, provider,
  database, deployment, payment, publication, or customer-state mutation
  occurred. No checkbox changed.

## PLAN-WEB-015 production preflight · 2026-10-07

- **Decision:** Do not promote or configure the hosted-order checkout until
  the production method set is explicitly established and R-041 is closed.
- **Evidence:** Vercel deployment `dpl_H2eqnEqCY96yAAPphch9S2dvUKeK` at Web
  commit `1498837` failed because `RAZORPAY_ENABLED_PAYMENT_METHODS` is
  absent; live `/checkout` remains the QR-only surface.
- **Boundary:** No guessed method list, production price change, provider
  request, database read/write, environment-variable write, or deployment
  cutover occurred. `PLAN-WEB-015` and R-041 remain open.

## PLAN-WEB-013/014 current-main hosted order qualification · 2026-10-07

- **Decision:** Accept the current-main hosted-order and isolated PostgreSQL
  results as implementation evidence; do not represent them as provider or
  production payment acceptance.
- **Evidence:** Exact Web main `14988371cdae94d66d068b49d07cc31f0b26c5ea`;
  payment-focused **28/28**; 37 migrations; typecheck/schema; negative-boundary
  **2/2**; truth-registry **25/25**; 43-page preview build.
- **Boundary:** No provider API, payment, production database, migration,
  deployment, credential, or customer-state write occurred. Real Test Mode
  lifecycle, production reconciliation, and Node 22 acceptance remain open;
  no checkbox changed.

## PLAN-WEB-014 migration-bootstrap revalidation · 2026-10-07

- **Decision:** Treat the local migration-bootstrap uncertainty as resolved for
  the documented current-main rehearsal, but keep production migration and
  release acceptance open.
- **Evidence:** Web main `14988371cdae94d66d068b49d07cc31f0b26c5ea`; guarded
  empty-database bootstrap; all **37** ordered migrations; isolated checks
  **22/22**; typecheck, schema validation, and 43-page preview build passed.
- **Boundary:** Production legacy history/cutover, backup/restore, rollback,
  Node 22 acceptance, provider lifecycle, and production reconciliation remain
  unverified. No checkbox or production state changed.

## QUAL-CLI-006 current-main artifact and format validation · 2026-10-07

- **Decision:** Accept the exact-head artifact and format-validator results as
  supporting release evidence only; do not close QUAL-CLI-006 or authorize
  publication.
- **Evidence:** CLI `origin/main` `7d060b2`; cross-platform install/build
  **8/8**; six public archives; official `in-toto==3.0.0` exact-product
  verification; CycloneDX CLI `0.33.1`; SPDX Tools `0.8.5`; inventory with 7
  review blockers.
- **Reason:** Mechanical validity does not establish trusted keyless identity,
  legal redistribution clearance, protected publishing approval, independent
  acceptance, or a complete release candidate.
- **Boundary:** Disposable worktrees/containers only; no production,
  provider, payment, database, deployment, migration, credential, or
  publication mutation occurred. No checkbox changed.

## Web GitHub App server-side exchange · 2026-10-07

- **Decision:** GitHub installation tokens and immutable installation identity
  must come from the server-held App JWT/provider API, not browser input.
- **Evidence:** PR #154 reconciled head `9032bda`, merged as `1498837`; focused
  SCM/deletion **46/46**; serial Web **857/880** with 23 explicit skips and
  zero failures; hosted typecheck/schema, Vercel, and Preview Comments passed.
- **Security boundary:** The route accepts only installation/repository
  selection intent, validates least-privilege permissions and provider-owned
  IDs, encrypts token/expiry, refreshes through the App exchange, and takes the
  GitHub webhook secret only from `VERGLOS_GITHUB_WEBHOOK_SECRET`.
- **Limit:** No live App credential/org/webhook/cutover or independent review
  evidence exists, so TEAM-WEB-006 and the GitHub release gates remain open.

## CLI origin/main reconciliation and Hunt adversarial qualification · 2026-10-07

- **Decision:** Treat the exact remote-head and pinned Docker run as current
  CLI/Hunt qualification evidence only; do not close HUNT or independent-review
  gates.
- **Evidence:** Clean `origin/main` head `7d060b2`; forced Turbo validation
  **23/23**; Docker `29.7.2`; Hunt **60 passed / 1 skipped / 0 failed**.
- **Reason:** The run is macOS local/CI harness evidence. The namespace
  assertion requires Linux, and no independent reviewer, official validator,
  trusted publisher-root, or legal review was performed.
- **Boundary:** Founder-owned untracked assets were preserved; no production,
  provider, payment, database, deployment, migration, credential, or browser
  mutation occurred. No checkbox changed.

## PLAN-WEB-013/012 webhook-handler PostgreSQL integration · 2026-10-07

- **Decision:** Accept the direct handler/database harness as implementation and
  integration progress only; keep payment and release acceptance open.
- **Evidence:** PR #149 head `9fd22d8`, handler **2/2**, route **2/2**, ledger
  **1/1**, claim **1/1**, unit handler **8/8**, and hosted Verify **37642113170**.
- **Reason:** The harness proves persistence and exactly-once behavior across
  capture, replay, failed order, and monotonic refunds using real handler and
  ledger functions. It does not prove real Razorpay lifecycle events, every
  enabled method, or production reconciliation.
- **Migration finding:** A fresh empty database cannot apply legacy-dependent
  migration `0000` because `licenses` is absent. Do not bypass this with an
  unsafe CI/production push; track it as a migration-bootstrap risk.

## PLAN-WEB-013 isolated hosted-order route · 2026-10-07

- **Decision:** Accept the route harness as qualification progress only; do not
  mark the hosted payment or release backlog complete.
- **Evidence:** PR #149 head `1605340`, hosted Verify **37640983179** green,
  route integration **2/2**, focused payment/quality **44/44**, and local
  typecheck/database/migration/build checks green.
- **Reason:** The harness proves server-side catalog, auth/origin/validation
  boundaries, signed notes, user binding, and provider projection without
  production writes. It does not prove real provider lifecycle or entitlement
  reconciliation. Local full-suite results are also limited by shared fixture
  interference and are not claimed as green.

## QUAL-WEB-006 organization-directory CDP probe · 2026-10-07

- **Decision:** Treat the current `/orgs` aggregate CDP observation as partial
  runtime evidence only; do not claim accessibility/performance acceptance.
- **Evidence:** Existing dedicated Chrome target, direct CDP fallback after
  closed MCP transport, one named visible interactive control, two landmarks
  including `main`, zero visible forms, zero unnamed interactive AX nodes, and
  CLS `0.0000`; existing navigation timing was DOMContentLoaded `4939 ms` and
  load `5647 ms`.
- **Boundary:** No navigation, reload, tab creation, browser-state mutation,
  private-data capture, production/database/payment/deployment/migration
  operation occurred. QUAL-WEB-006 remains open for the missing runtime and
  field evidence.

## QUAL-CLI-006 current-head standards run · 2026-10-07

- **Decision:** Accept the 448/448 shared standards-corpus, license, and SBOM
  run as qualification progress only; keep QUAL-CLI-006 open.
- **Evidence:** Exact CLI head `13d1444`; 113 package test files, shared
  typecheck/build, Docker `29.7.2`, and the documented temporary
  cross-platform package setup pass. License inventory and CycloneDX/SPDX SBOM
  generation passed for 254 lockfile packages; temporary changes were reverted.
- **Boundary:** This does not establish official-validator, trusted keyless
  provenance, legal, cross-platform consumer, or independent-review evidence.
  No source/lockfile/public/production change occurred.

## PLAN-WEB-013 Checkout retry-state hardening · 2026-10-07

- **Decision:** Hosted Checkout failures and pre-confirmation dismissal must
  clear stale order state and return to the actual offer/retry screen; the UI
  must not imply a submitted payment when the provider rejected `open()`.
- **Evidence:** PR #149 exact head `aa34127`; focused 27/27, typecheck, build,
  and diff checks pass. Verify `37637158955`, Vercel, and Preview Comments pass.
- **Boundary:** This changes presentation state only and does not grant access
  or replace webhook authority. PLAN-WEB-013/014/015 remain open; no provider,
  production, database, or deployment mutation occurred.

## PLAN-WEB-014 Test Mode method-display probe · 2026-10-07

- **Decision:** Record the direct Test Mode run as provider UI evidence only;
  do not promote it to app payment, entitlement, or lifecycle acceptance.
- **Evidence:** One isolated Test Mode order rendered the configured hosted
  method surfaces. UPI contact validation stopped the run before a provider
  outcome; no callback, capture, refund, webhook, or ledger reconciliation was
  produced.
- **Boundary:** The existing blank CDP target was reused and restored to
  `about:blank`. PLAN-WEB-014/015 remain open; no production or live-payment
  operation and no checkbox change occurred.

## PLAN-WEB-014 provider iframe qualification attempt · 2026-10-07

- **Decision:** Treat the provider iframe observation as incomplete runtime
  evidence only. Do not infer payment success, failure, capture, or entitlement
  from a loaded Checkout frame.
- **Evidence:** Six provider method selectors were visible; the UPI field was
  unavailable to the bounded CDP interaction after selection and no callback
  or ledger result occurred. The target was restored to `about:blank`.
- **Boundary:** PLAN-WEB-014/015 remain open; no production, database, payment,
  migration, deployment, or customer-state operation occurred.

## QUAL-WEB-005 hold state at completion boundary · 2026-10-07

- **Decision:** A deletion worker must feed the post-delete hold state into its
  final qualification decision; a hold appearing during execution blocks the
  job from completing.
- **Reason:** The initial hold check cannot protect the entire destructive
  interval. An audit receipt must never claim completion after a hold becomes
  active.
- **Evidence:** Web PR #153 commit `d7deec1`; focused 36/36 and disposable
  PostgreSQL 1/1 passed.
- **Boundary:** This closes a code-side race only. `QUAL-WEB-005` remains open
  for authenticated E2E, legal/customer-held disposition, reconciliation,
  restore/rollback, and independent review. No destructive operation occurred.

## PLAN-WEB-013/014 monotonic refund watermark · 2026-10-07

- **Decision:** Treat a signed, valid refund observation lower than the durable
  refund watermark as an idempotent no-op; continue rejecting negative and
  over-amount values.
- **Reason:** Provider deliveries and retries can be out of order. Moving the
  watermark backwards or failing an already-reflected observation would create
  retry churn without changing entitlement truth.
- **Evidence:** Web PR #149 commit `238ec74`; focused tests, typecheck, and a
  disposable schema-fixture billing integration passed.
- **Boundary:** This is ledger hardening, not provider lifecycle acceptance.
  PLAN-WEB-013/014/015, production reconciliation, and release gates remain
  open; no provider or production operation occurred.

## Razorpay Test Mode subscription-plan inventory · 2026-10-07

- **Decision:** Keep the current order-based hosted Checkout path; do not
  create subscription plans or add speculative plan IDs.
- **Evidence:** Read-only Test Mode plan inventory returned zero plans, and no
  plan-ID variable exists in the production environment-name inventory.
- **Reason:** Provider plans are immutable configuration and must bind an
  approved catalog amount, cadence, currency, entitlement period, owner, and
  reconciliation procedure before creation.
- **Consequence:** PLAN-WEB-014/015 remain open for recurring lifecycle and
  production reconciliation evidence.

## QUAL-WEB-005 protected deletion hold authority · 2026-10-07

- **Decision:** Accept the super-admin hold routes as implementation progress;
  keep `QUAL-WEB-005` and merge/deployment gates open.
- **Evidence:** PR #153 exact head
  `929da1907f001c8db71df0e601e08014590fd580`; focused 10/10; serial
  872/849/23/0; hosted Verify `37608932973` passed.
- **Safety:** Only a configured super-admin identity may activate or release
  a hold. Mutations require same-origin, target/request ownership is checked,
  customer-deletion holds require a request reference, and release uses an
  unreleased-row predicate to prevent concurrent double release.
- **Boundary:** This does not qualify production migration, deletion E2E,
  legal/customer-held disposition, consent inventory, reconciliation,
  restore/RPO, deployment rollback, or independent acceptance. No production
  or destructive operation occurred; no checkbox changed.

## QUAL-WEB-005 supporting executor disposable integration · 2026-10-07

- **Decision:** Accept the disposable PostgreSQL integration as stronger
  runtime qualification; keep `QUAL-WEB-005` and production gates open.
- **Evidence:** Web PR #153 current source; PostgreSQL 18 `verglos_test`
  integration **1/1 pass** covering the supporting graph, per-kind deletes,
  holds, leases, receipts, runner, replay, and approval blocking. The exact
  test container was removed after execution.
- **Boundary:** This does not prove production migration/cutover,
  authenticated browser E2E, consent/legal/customer-held approval,
  production reconciliation, restore/RPO, rollback, or independent review.
  No production or destructive operation occurred; no checkbox changed.

## QUAL-WEB-005 customer-held digest registration route · 2026-10-07

- **Decision:** Accept the authenticated customer-held digest registration
  boundary as implementation progress; keep `QUAL-WEB-005` and all merge/
  deployment gates open.
- **Evidence:** PR #153 exact head
  `03d60e99ccf895b3122c4ae6641c3d12b44169bf`; focused 11/11; serial
  870/847/23/0; hosted Verify `37608270504` passed.
- **Safety:** The route is user-scoped, same-origin, bounded, canonical,
  idempotent, and stores only a digest plus fixed record kind. It never accepts
  record bytes. Legal and contract holds are not user-controlled.
- **Boundary:** This does not qualify authenticated deletion E2E, legal/
  customer-held disposition, consent inventory, production migration,
  reconciliation, restore/RPO, deployment rollback, or independent acceptance.
  No production or destructive operation occurred; no checkbox changed.

## QUAL-WEB-005 preview browser boundary · 2026-10-07

- **Decision:** Treat the protected-preview redirect as an access blocker, not
  as a failed product request or acceptance result; keep QUAL-WEB-005 open.
- **Evidence:** Chrome CDP reached the preview URL and observed Vercel login;
  no Verglos response or mutation was reached. The tab was returned to
  production `/orgs`.
- **Boundary:** Do not bypass deployment protection or capture credentials.

## QUAL-WEB-005 privacy surface · 2026-10-07

- **Decision:** Accept the new account privacy surface as implementation
  progress; keep QUAL-WEB-005 and merge/deploy gates open.
- **Evidence:** PR #153 head `db27d793d890929f642ed0d5b5b9bd056a732bc`, local
  23/23 focused tests and required checks, hosted Verify `37607448915` green.
- **Boundary:** The UI records requests but does not claim hosted deletion
  completion. No authenticated E2E, legal/held-record disposition,
  rollback/restore acceptance, or production operation occurred.

## Exact production migration preflight · 2026-10-07

- **Decision:** Keep production migration and PR #153 merge gates closed.
- **Evidence:** Read-only audit found all 42 allowlisted tables, 26 applied
  rows versus 35 expected, and pending migrations 0026–0034; exact counts are
  licenses 1, legacy mappings 3, webhook events 4, payments 0, and
  subscriptions 0.
- **Boundary:** No production DDL, DML, migration, deployment, payment,
  entitlement, deletion, or backlog checkbox change occurred.

## Fresh production snapshot/restore rehearsal · 2026-10-07

- **Decision:** Accept the fresh snapshot and disposable restore as RPO/
  migration-rehearsal evidence, but keep QUAL-WEB-005 and production cutover
  gates open.
- **Evidence:** 150,515-byte snapshot at `2026-10-07T10:17:27.005Z`; restore
  and PR #153 migration tail succeeded; clone history reached 35 rows with
  deletion/payments/subscriptions 0 and webhook events 4.
- **Boundary:** No production write, migration, deployment, payment,
  entitlement, or deletion occurred; hosted deletion E2E, legal/customer
  disposition, rollback, and independent review remain required.

## Preview environment preflight · 2026-10-07

- **Decision:** Do not use the current Vercel Preview for payment qualification.
- **Evidence:** Its key values were not recognizable test/live prefixes, its
  database value was not a PostgreSQL URL, and the hosted method variable was
  absent.
- **Boundary:** No Preview provider/database call or configuration mutation
  occurred; provision an isolated test environment before lifecycle testing.

## Production read-only billing/migration audit · 2026-10-07

- **Decision:** Keep production payment, migration, and deletion gates closed.
  Do not add a guessed method list or apply the 31-migration candidate to the
  26-migration production database.
- **Evidence:** Production variable inventory lacks
  `RAZORPAY_ENABLED_PAYMENT_METHODS`; the read-only audit found 42 tables,
  26 migration rows, zero billing payments/subscriptions, zero deletion
  requests, and four webhook-event rows.
- **Boundary:** No row contents/identifiers were selected and no production
  DDL, DML, migration, deployment, payment, entitlement, or deletion occurred.

## Razorpay method preflight · 2026-10-07

- **Decision:** Keep the payment-method and lifecycle gates open until a valid
  test-account method response is obtained. Do not infer enabled methods from
  documentation or local configuration.
- **Evidence:** SDK method lookup returned HTTP 401 authentication failure,
  while read-only `/v1/orders` and `/v1/payments` calls with the same test
  pair returned HTTP 200; the 401 is endpoint-specific and the method set is
  still unknown. Exact PR #149 payment tests passed 27/28 with one explicit
  environment-gated skip; isolated config exposed five hosted method IDs.
- **Boundary:** No live-key fallback, payment, refund, webhook, entitlement,
  database, deployment, or production operation occurred.

## SCM/payment qualification batch · 2026-10-07

- **Decision:** Record the SCM 48/48 and Razorpay test-order results as
  qualification evidence, but keep all live integration and payment gates
  open.
- **Evidence:** Exact Web `origin/main` passed the focused GitHub/SCM suite
  48/48. `.env.test.local` created one Razorpay test-mode monthly Pro order at
  INR 280,943 paise, status `created`, with no capture or fulfillment.
- **Boundary:** No live GitHub installation, provider lifecycle, webhook,
  entitlement, production reconciliation, database write, deployment, or
  credential rotation occurred. No backlog checkbox changed.

## PLAN-WEB-013 hosted verification refresh · 2026-10-07

- **Decision:** Treat PR #149 as hosted code-qualified but do not merge or
  close payment gates from CI alone.
- **Evidence:** Exact head `db68157da039d8aab939818f9023f867028e4432`, Verify
  `37563023349`: serial 871/872 pass with one explicit skip, negative-boundary
  2/2, truth-registry 25/25, 31 migrations, build and security/public-boundary
  checks green.
- **Boundary:** Razorpay account-enabled method and test-mode lifecycle evidence
  are still required. No provider, production, database, deployment, or merge
  operation occurred.

## Production payment-surface truth recheck · 2026-10-07

- **Decision:** Treat the live checkout as legacy QR-only runtime truth and keep
  all payment release gates open. Do not scan, pay, or use it as test evidence.
- **Evidence:** Read-only Chrome DevTools `/checkout` load: HTTP 200, clean
  console, INR 2,809.43/month, UPI-only copy, and `Show UPI QR code`; no
  mutation request. PR #149 remains a non-production open PR.
- **Boundary:** No payment, provider, database, entitlement, deployment, or
  production configuration operation occurred.

## Razorpay production method preflight · 2026-10-07

- **Decision:** Keep production payment configuration and cutover closed. The
  account-enabled method set must be obtained from a valid provider response;
  it must not be inferred from Test Mode UI, documentation, or code catalogs.
- **Evidence:** Vercel Production has no `RAZORPAY_ENABLED_PAYMENT_METHODS`;
  the read-only SDK method lookup with the pulled live-key pair returned HTTP
  401 `BAD_REQUEST_ERROR`. The deploy from main `8b843da` consequently failed
  runtime-config validation before build completion.
- **Boundary:** No secret value, provider payload, payment, deployment
  promotion, environment mutation, database, or customer-state write occurred.

## QUAL-CLI-006 official in-toto artifact binding · 2026-10-07

- **Decision:** Record the official in-toto result as a qualified artifact
  binding sub-check, but keep QUAL-CLI-006 and release gates open.
- **Evidence:** Exact CLI `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`; official
  `in-toto==3.0.0` verifier passed six public archives with exact SHA-256
  products in a bounded disposable Python 3.12 container.
- **Boundary:** Ephemeral keys do not establish trusted keyless
  Sigstore/Fulcio/Rekor identity, legal clearance, protected npm publishing,
  or final release acceptance. No publication, tag, deployment, or production
  operation occurred.

## PLAN-WEB-013 exact-head payment qualification · 2026-10-07

- **Decision:** Record the exact-head payment tests as code-side qualification
  and keep the payment gate open. Do not merge PR #149 or claim method/lifecycle
  acceptance from these tests.
- **Evidence:** Web PR #149 head
  `db68157da039d8aab939818f9023f867028e4432`; focused payment tests 18/18;
  typecheck, schema, 31-migration, and 3/3 license checks pass; hosted checks
  are green and the PR is CLEAN/MERGEABLE.
- **Boundary:** Account-enabled Razorpay methods, test-mode runtime lifecycle,
  provider replay/order timing, production reconciliation, and payment
  acceptance remain open. No production/provider/database/deployment write.

## CLI PR #75 hosted qualification and merge · 2026-10-07

- **Decision:** Merge the isolated public/private Hunt runtime packaging
  correction after its complete hosted matrix and release-binding checks
  passed. Do not treat the merge as Hunt product acceptance.
- **Evidence:** PR #75 exact head `c4beecb3525256cd2956660af8e3e6b49292b65f`;
  all 11 checks passed; squash merge commit
  `6bde945c60ac34351c02a70f6e7a2cb24f98ae1d`.
- **Boundary:** Keep HUNT-008, HUNT-009, and QUAL-CLI-004 open for trusted
  recipe provenance, complete isolation qualification, independent review,
  and authorized functional acceptance. No provider, payment, database,
  deployment, or credential operation.

## QUAL-WEB-006 authenticated account browser probe · 2026-10-07

- **Decision:** Record the browser results as partial authenticated-surface
  evidence only. Do not promote them to full accessibility/performance
  acceptance because the session has no paid entitlement or organization.
- **Evidence:** Lighthouse desktop/mobile Accessibility 100 and Best Practices
  100; Tab focus reached Overview; console clean; navigation 200/304; LCP
  1,111ms; CLS 0.00; no CrUX field data.
- **Boundary:** QUAL-WEB-006 remains open for paid/org runtime, human
  screen-reader, large-data, and field-CWV evidence. No entitlement, payment,
  database, deployment, or production configuration change.

## Hunt public/private runtime boundary · 2026-10-07

- **Decision:** Accept the optional-runtime boundary as a real packaging
  correction, not as Hunt product acceptance. The public CLI may execute only
  when the separately provisioned private runtime satisfies the validated
  protocol; otherwise it denies with exit 78.
- **Evidence:** CLI `c4beecb`; focused 6/6, full configured CLI suite,
  packaging/license/surface 17/17, six archives, package-content and public
  boundary audits pass. PR #75 exact head is OPEN/UNSTABLE with 11 hosted
  checks pending at capture.
- **Boundary:** Keep HUNT-008, HUNT-009, and QUAL-CLI-004 open for recipe
  provenance, isolation, independent review, and acceptance. No production,
  provider, payment, database, migration, deployment, or credential action.

## Restore/recovery harness qualification · 2026-10-07

- **Decision:** Record the disposable restore path as partial recovery
  evidence only. Do not treat it as a clean DR or QUAL-WEB-005 acceptance
  result because the snapshot is approximately 396h old and exceeds the
  critical 48h RPO threshold.
- **Evidence:** Web PR #153 head `250313e`; restore, 35 migrations, writer
  passes, `reconciled` manifest, and fail-closed simulation passed; RTO 3.09s.
- **Boundary:** Current production backup/restore, Vercel rollback,
  authenticated deletion E2E, and provider/payment qualifications remain open.
  No production operation or checkbox change.

## QUAL-WEB-005 rollback/retry qualification · 2026-10-07

- **Decision:** Treat the injected PostgreSQL failure/savepoint result as
  transaction rollback/retry evidence only; do not equate it with production
  restore or deployment rollback.
- **Evidence:** Web PR #153 head `2127924e418fdca4094fa88bab02656952f4488b`,
  disposable integration 1/1, serial Web 868/1/0, and hosted Verify
  `37567278851` pass.
- **Boundary:** Keep QUAL-WEB-005 open for production-grade restore,
  deployment rollback, authenticated non-production E2E, and final privacy/
  retention acceptance. No production operation is authorized by this result.

## QUAL-WEB-005 supporting disposition executor · 2026-10-07

- **Decision:** Allow the deletion worker to execute only the reviewed
  user/license-scoped supporting dispositions, with one durable idempotency
  receipt per table and the existing lease fence.
- **Safety:** Preserve users, licenses, accounting/provider rows, unscoped
  telemetry, legacy public rows, customer-held digests, and the deletion audit
  ledger. Check approval-gated channel credentials before deleting dependent
  alert or monitor rows; block closed if credentials remain.
- **Boundary:** Local worker 4/4, disposable PostgreSQL 1/1, serial Web
  868/1/0, typecheck/build/schema/35-migration checks pass. Hosted Verify
  `37566730804`, Vercel, GitGuardian, and Preview Comments pass. Retained-row
  reconciliation, restore/rollback rehearsal,
  authenticated non-production E2E, and final gate acceptance remain open; no
  production migration or deletion is authorized.

## QUAL-WEB-005 supporting inventory gate · 2026-10-07

- **Decision:** Accept the read-only supporting inventory/disposition contract
  as progress only; keep the destructive worker gate closed.
- **Evidence:** Web PR #153 head `37c8a07ef2c1d4f914c0ace03864d60fb2649a82`
  passed Verify `37564973546`; focused 9/9, disposable PostgreSQL 1/1,
  serialized 846/23/0, typecheck/build/schema/migration/diff checks pass.
- **Boundary:** `supportingInventoryComplete=false` remains required until
  executable disposition operations, receipts, retained-row reconciliation,
  restore/rollback rehearsal, and authenticated E2E exist. No production write,
  migration, deletion, deployment, or provider operation occurred.

## HUNT-009 hosted boundary result · 2026-10-07

- **Decision:** Close CLI PR #74 without merge and keep HUNT-009 unchecked.
- **Evidence:** Local execution tests/build/typecheck/full test graph passed,
  but hosted platform matrix `37565750571` and self-scan `37565750527` failed
  at public archive qualification because the public six-package packer cannot
  resolve private/alpha `@verglos/hunt`.
- **Boundary:** Do not make the private Hunt package public implicitly, copy it
  into the CLI archive, or weaken the packer. A reviewed packaging design,
  licensed recipe provenance, approval chain, and independent qualification
  are still required before HUNT-009 can ship.

## CLI license-source metadata merge · 2026-10-07

- **Decision:** Accept the exact-version HTTPS provenance repair into CLI
  `main` after the complete platform matrix, self-scan, and in-toto checks
  passed.
- **Boundary:** The merge changes mechanical inventory provenance only. It is
  not legal approval, redistribution clearance, npm publication, or a release
  go/no-go; the remaining seven review blockers stay fail-closed.

## Exact-version license source metadata · 2026-10-07

- **Decision:** Permit a narrowly scoped source-metadata override only for an
  exact package/version key when the installed manifest omits provenance and
  immutable registry metadata identifies the upstream HTTPS repository.
- **Controls:** Validate HTTPS, keep the override version-pinned, preserve the
  existing redistribution classifier, and keep `--require-clear` fail-closed
  for non-permissive licenses and nested conflicts.
- **Boundary:** This is mechanical provenance repair, not legal approval or
  redistribution clearance. PR #73 must pass hosted checks before any merge;
  no release/publication or production operation is authorized by this
  decision.

## Serialized PostgreSQL qualification path · 2026-10-07

- **Decision:** Use the repository's existing `test:serial` command as the
  authoritative local PostgreSQL qualification path while fixtures share one
  disposable database. Do not credit a parallel shared-database run that can
  race on extension/schema setup.
- **Evidence:** Pretest 48/48, configured Web suite 867/867 with one
  intentional migrated-billing skip, and separate migrated billing integration
  1/1. The prior queue/worker failures do not reproduce serially.
- **Boundary:** This is a local test execution decision, not production or
  release acceptance. No gate or backlog checkbox changed.

## Shared test-database initialization · 2026-10-07

- **Decision:** Do not count the concurrent full Web PostgreSQL run as green
  while independent Node test workers share a database and race on extension
  setup. Preserve the failure/hang as qualification evidence and use isolated
  per-file runs for diagnosis until the harness is serialized or initialization
  is made concurrency-safe.
- **Evidence:** Queue/worker-crash integration passes 7/7; threshold-outbox
  and usage-ledger each pass 1/1 alone. The paired usage run reproduces
  PostgreSQL `23505` on `pg_extension_name_index` and a pending worker.
- **Boundary:** This is a testing decision only. It does not close any Web
  qualification, acceptance, or release gate, and no production operation
  occurred.

This file is newly created because no tracked `DECISIONS.md` existed in the private shipping worktree when checked on 2026-09-14. It is local-only and must not be pushed to the public CLI or Web repositories.

## Razorpay hosted order default · 2026-10-07

- **Decision:** Use Razorpay hosted Checkout/order flow as the default customer
  path. The server-side catalog and explicit provider method configuration are
  authoritative; hosted UPI, cards, netbanking, and wallets are not promised
  unless declared. QR is a separately qualified, explicit opt-in adapter.
- **Evidence:** Web PR #149, commit `eb7e55a`; signed order snapshots, provider
  order binding, read-only status, webhook-authoritative capture/failure, and
  order-success uniqueness are locally verified.
- **Boundary:** Code-side implementation is not account capability or payment
  lifecycle acceptance. Isolated Razorpay test-mode evidence for each enabled
  method, production reconciliation, and R-041 credential rotation remain
  open. No production operation occurred.

## PLAN-CLI-001 opaque catalog/cache boundary · 2026-10-06

- **Decision:** Treat `catalog_version` and capability identifiers from the Web
  entitlement response as server-owned opaque data. Validate only the bounded
  wire shape; do not reconstruct plan capability or allowance maps in the CLI.
- **Cache rule:** A stale cached response is eligible only for the same founder
  `as_plan` simulation scope that produced it. A request for a different
  simulation scope falls back to Free when the server is unreachable.
- **Boundary:** This improves offline safety and observability but does not
  authorize production signer activation, token issuance, or any production
  operation. PLAN-CLI-001/004 remain open pending hosted and activation
  evidence, with R-041 still enforced.

## HUNT-009 packaging boundary · 2026-10-06

- **Decision:** Keep the public alpha CLI on its beta shell until a reviewed packaging design exists for private Hunt execution. Do not add a private workspace package as a public CLI dependency and do not copy private runtime implementation into public archives as an implicit workaround.
- **Rationale:** The public packer intentionally fails closed on private workspace dependencies. Enabling a command that cannot be installed from the public six-package release would create a false release surface and violate the repository code split.
- **Follow-up:** Resolve the private-runtime distribution boundary only after trusted publisher roots, licensed recipe provenance, bounded execution, isolation/adversarial evidence, and independent review are complete.

## TEAM-CLI-001 hosted policy authority boundary · 2026-10-06

- **Repository binding:** A policy fetch is eligible only when an active GitHub
  SCM installation row carries the immutable `repositoryId` and an explicit,
  same-organization `projectId` binding. Repository owner/name or a free-form
  project external ID must never be used as an implicit policy binding. A
  missing or ambiguous binding fails closed without revealing adjacent tenant
  state. GitLab policy fetch remains out of scope until it has an immutable
  provider repository ID contract.
- **Signer custody:** Organization policies use a dedicated Ed25519 signing
  key, separate from entitlement JWT keys. The private key is a server-only
  runtime secret; the envelope key ID is derived from the public SPKI bytes and
  the corresponding public key is pinned in the CLI trusted-key bundle. The
  endpoint is unavailable when the dedicated signer is absent or malformed.
- **Payload contract:** Only a stored `published` policy with
  `canonical-json-v1` digest, valid effective time, and a document conforming
  to the CLI `PolicyDocument` schema may be emitted. The bearer license must
  be active and resolve to an owner mapping for the exact organization UUID.
- **Activation boundary:** Implement and qualify the endpoint, binding, signer,
  and cross-repository fixtures in code first. Do not provision or activate the
  production signer, rewrite production policy rows, or run a hosted fetch
  until R-041 credential rotation and the separate PLAN-CLI-001 activation
  evidence are complete.

## Pro INR catalog activation review frame (2026-10-02)

- **Problem/evidence:** sandbox Standard Checkout completed at ₹2,809.43 (`280943` paise), with captured payment and signed webhook replay idempotency. Production previously failed closed because the canonical Pro catalog was unverified USD.
- **Change:** Web PR #123 (`23a83f0`) changes only the versioned Pro catalog and checkout rendering: monthly ₹2,809.43 / 30 days, annual ₹28,094.30 / 365 days, INR, verified and purchasable. No schema, migration, or database code changes.
- **Rollback:** revert `23a83f0` or roll back the resulting Vercel deployment; the prior catalog makes `checkoutOfferFor` return null and restores the fail-closed checkout. No customer data rollback is required.
- **Verification:** local full suite/build/typecheck/schema/migration/security gates passed; hosted Verify run `36979422192` passed every required step. Merge/deploy remains a deliberate production activation because live Razorpay credentials would create real charges.

## Founder authorization for final acceptance work (2026-10-02)

- **Authorization:** Founder approved proceeding with the final public truth/copy pass after its prerequisite acceptance gates, a real billing/provider checkout test, authorized customer-repository acceptance workflows, legal/licensing review, and independent Hunt isolation review.
- **Evidence boundary:** This authorization does not itself supply the required external artifacts. Current inspection found no local Razorpay credentials, no authorized Vercel project access, no customer repository/fixture package, no legal/licensing approval record, and no independent Hunt reviewer/evidence package. No production checkout, deployment, customer workflow, legal assertion, or independent-review claim is made until those artifacts exist.
- **Next action:** Continue code-side and hosted qualification work; execute provider/customer/legal/review gates only against supplied, verifiable inputs and their documented preflight/rollback controls.

## Shipping-ledger authority and public mirror divergence (2026-09-20)

- **Decision:** `verglos-cli-private-shipping/docs/shipping/` on branch `local/private-shipping-ledger` is the authoritative V1 shipping record. The untracked `verglos-cli/docs/shipping/` copy is a stale local mirror, not an alternate source of truth.
- **Observed divergence:** the public-repository mirror predates accepted OPS-001-014, HUNT-002/003/004/007, and LIC-005 updates. Its backlog/status/traceability/ledger hashes and checkbox totals differ from the private ledger.
- **Resolution:** preserve the mirror as founder-owned untracked material; do not overwrite it silently, use it for acceptance counts, stage it, or push it publicly. Reconciliation occurs only in this private ledger. Any future mirror refresh must be an explicit private/local copy operation and must still remain excluded from public commits.
- **Related exclusion:** `packages/shared/src/spec-validation-corpus.test.ts` in the CLI worktree is an untracked draft and is not QUAL-CLI-006 acceptance evidence because it explicitly avoids the official validators required by that item.

## Mirror recheck (2026-10-03)

- **Observed:** the public CLI checkout remains `main...origin/main [ahead 70, behind 844]` with an untracked `docs/shipping/` mirror and founder-owned assets; its seven shipping-document hashes differ from the private ledger. Neither public nor Web has an open PR.
- **Resolution:** the private branch remains authoritative. No mirror copy, public commit, reset, force-push, or public documentation change was performed. The divergence is expected and remains recorded rather than silently reconciled.

## OPS-001 · Queue/provider decision — Neon PostgreSQL (founder-authorized 2026-09-16)

- **Status:** Selected. Founder authorized bucket B resolution 2026-09-16 with the explicit reasoning that pre-launch (zero paying users) the architecture-decision-set gates for representative workload / measured throughput / recovery drill / actual-cost comparison do not apply. Post-launch, if measured evidence shows Neon/PostgreSQL is inadequate, the interface remains provider-neutral and a replacement can be swapped in behind the `DurableQueueProvider` contract without touching call sites.
- **Selected provider:** Neon PostgreSQL, using the existing `jobs` and `outbox_events` tables on the same database as the tenant model. Implementation lives at `verglos-web/src/lib/queue/postgres-provider.ts`.
- **Contract satisfied:**
  - Idempotent enqueue via the `jobs_org_kind_idempotency_idx` unique index; duplicate enqueue returns the original row and does not mutate lease state.
  - Atomic claim with `SELECT ... FOR UPDATE SKIP LOCKED`; a second concurrent lease sees zero due rows.
  - Lease fencing via `lease_owner` + `lease_expires_at` + `attempts` as monotonic generation; a stale fence rejects acknowledge, fail, and any state mutation.
  - Retry with configurable `retryAt` (default 60 s) until `attempts >= maxAttempts`, then automatic dead-letter (`status = 'dead-letter'`).
  - Opaque fairness cursor (base64url tenant id) so no single tenant can starve another across sweeps.
- **Evidence:** five DB-integration tests in `postgres-provider.integration.test.ts` (skipped without `TEST_DATABASE_URL`) prove enqueue idempotency, atomic claim / no double-lease, stale-fence rejection, retry-to-dead-letter transition, and fairness cursor advance. Nine input-validation unit tests always run.
- **Non-goals for V1:** no separate queue service, no external message broker, no cross-region replication. The unified DB avoids operational complexity while paying users are zero. Provider swap remains cheap because the interface is stable.
- **Post-launch action:** collect real measurements once users exist; if throughput or contention exceeds Neon's practical limit, evaluate an external queue against the same interface and swap without call-site changes.

## OPS-002 · Scheduler / due-job producer (accepted 2026-09-16)

- **Status:** Accepted with OPS-001. Implementation at `verglos-web/src/lib/queue/monitor-producer.ts`.
- **Contract:** deterministic idempotency key `monitor-check:<registration_id>:<YYYY-MM-DD>` — a second producer run in the same UTC day is a no-op on the unique index. Bounded sweep (default 500 registrations per run) enforces backpressure at the schedule layer; per-tenant static ceiling (default 50 outstanding jobs) prevents a single tenant from filling the queue. Ownership resolves through the personal organization `external_id = 'personal-user:<user_id>'` (HOSTED-013 target); registrations whose license user has no personal org are counted as `ownerUnresolvable` and never enqueued against the wrong tenant.
- **Observable lag:** producer manifest reports `observableLagSeconds` (max age of oldest due registration inside the sweep window) and `nextDueAfter` (earliest recently-checked registration outside the window). Owner of OPS-013 metrics wires these to alerting.

## Blanket authorization scope (2026-09-16)

Founder authorized: agent-selected durable queue provider (bucket B), agent-selected object-storage strategy (deferred to Studio implementation window; V1 uses Neon jsonb columns), agent-drafted contributor DCO policy (LIC-005 accepted at CLI PR #41), and routine branch/push/PR/merge/shipping actions without additional approval pauses. Production DB writes remain subject to the separately documented exact-operation preflight and postflight contract; blanket shipping authorization does not replace that evidence boundary.

## GitHub App contract implementation boundary · 2026-10-06

- **Decision:** Implement the GitHub App identity/lifecycle contract as a
  dependency-ready Web phase PR before attempting any live installation or
  organization cutover.
- **Evidence:** Web PR #144 (`afb48dc`) and private evidence
  `github-app-identity-contract-2026-10-06.md` record the immutable identity,
  multi-repository, permission, token, lifecycle, replay, tenant, and redaction
  checks plus the local/hosted check state.
- **Boundary:** The phase is not acceptance of GITHUB-WEB-001..004. Live App
  authorization, provider token exchange, production migration/deployment,
  customer use, and release claims remain gated and require their own reviewed
  preflight and postflight evidence.

## Founder scope decision · 2026-10-06

Verglos remains GitHub-first, but “GitHub-aligned” means a real App/org model:
immutable account and repository IDs, installation permissions/tokens, multiple
repositories, delivery-id replay protection, lifecycle events, and bounded
cutover evidence. The existing provider-neutral SCM substrate is not sufficient
for that claim. Razorpay support is expanded to every payment method actually
enabled in the account/test configuration, represented by a server-side catalog;
we will not advertise unavailable methods or infer support from documentation.
Final validation will use private manifests and full non-shallow public
TypeScript/JavaScript fixtures chosen by architecture shape. Public CLI history
must never contain customer data, credentials, proprietary source, private
reports, or competitive intelligence. The faster path is fat, dependency-ready
phase PRs with one acceptance boundary at a time, not helper-only checkbox work.

## Canonical policy digest rollout boundary · 2026-10-06

- **Decision:** Resolve the Web/CLI nested-policy digest mismatch with an
  explicit versioned algorithm field. Preserve `legacy-top-level-v1` for
  existing rows and use `canonical-json-v1` for new policy writes.
- **Evidence:** Web PR #146 (`5763632`) merged as `88a7791`; hosted Verify
  `37488304350` and the local 864/842/22/0 regression run passed. The additive
  migration is `0027_policy_digest_algorithm.sql`.
- **Rollback/boundary:** The change is additive and does not rewrite stored
  documents. Hosted policy activation, production migration/reconciliation,
  TEAM-CLI-001, and PLAN-CLI-001 remain gated until row inventory, rollout,
  rollback, and endpoint evidence are reviewed. No production operation ran.

## Account deletion worker boundary · 2026-10-07

- **Decision:** Do not implement or run a destructive hosted deletion worker
  until the legal-hold/customer-held authority and complete user-to-owned-data
  inventory are durable and reviewed.
- **Reason:** Existing hold and deletion modules are pure decision surfaces;
  `account_deletion_requests` is only a request ledger. The generic queue is
  organization-scoped, but account deletion is user-scoped and crosses legacy,
  personal-organization, and organization-owned rows. There is no authoritative
  hosted inventory of offline customer-held signed-record digests.
- **Consequence:** `QUAL-WEB-005` remains open. The route continues to record
  requests honestly as pending; no rows are deleted and no production migration
  or cron worker is added by this batch.
- **Evidence:**
  `docs/shipping/evidence/qual-web-005-deletion-worker-boundary-2026-10-07.md`.

## Account deletion inventory substrate · 2026-10-07

- **Decision:** Treat Web PR #153 only as a dependency substrate, not as
  `QUAL-WEB-005` acceptance. The versioned inventory and fail-closed gate may
  precede the operational worker while the remaining authority and recovery
  contracts are designed.
- **Evidence:** PR #153 head
  `718aadcaa384dcfd8a5fc4789c3b62c23c9e3858`; local focused tests 22/22,
  typecheck, database/schema checks, ordered migration validation, diff check,
  and 38-page build pass. Hosted workflow `37559045448` was still pending at
  capture.
- **Boundary:** no deletion worker, legal-hold persistence, customer-held
  digest registration, migration, production write, payment action, browser
  mutation, or checkbox change is authorized by this substrate. The existing
  `QUAL-WEB-005` boundary record remains controlling.

## Durable deletion hold authority substrate · 2026-10-07

- **Decision:** Add the durable hold table and pure release contract as a
  prerequisite, but keep deletion execution disabled. A hold is active only
  while unreleased and unexpired; release requires an actor, timestamp, and
  bounded reason.
- **Evidence:** Web PR #153 head
  `adf9a23b395a2c35208bd7d9cfcc7973300c2827`; local hold tests 3/3, combined
  focus 25/25, serial 846/22/0, typecheck/schema/migration/diff/build pass.
- **Boundary:** migration `0029` is not applied; no API, cron worker,
  destructive deletion, customer-held digest proof, restore rehearsal, or
  checkbox acceptance is supplied by this substrate.

## Customer-held digest registry substrate · 2026-10-07

- **Decision:** Store only canonical SHA-256 identities for customer-held
  signed `.vgl` records and compare the registered set before/after deletion;
  never store or mutate the offline record bytes in the hosted deletion path.
- **Evidence:** Web PR #153 head `4c5966f`; focus 28/28, serial 846/22/0,
  typecheck/schema/migration/diff/build pass, and 31 ordered migrations.
- **Boundary:** migrations `0029`/`0030` are unapplied; no authenticated
  writer, worker, destructive operation, restore rehearsal, or checkbox
  acceptance is supplied.

## Bounded deletion worker contract · 2026-10-07

- **Decision:** Keep the worker user-scoped and adapter-driven. The
  organization-scoped generic queue is not used as an account-deletion
  authority; the adapter must own transactional SQL, claims, retries,
  idempotency, reconciliation, and audit persistence.
- **Evidence:** Web PR #153 head `aef06b7`; worker focus 31/31, negative
  boundary 2/2, serial 846/22/0, typecheck/diff/build pass.
- **Boundary:** no production adapter, cron route, destructive operation,
  migration, restore rehearsal, or checkbox acceptance is supplied by this
  contract. Hosted workflow `37560432960` was in progress.

## Bounded deletion worker scope fence · 2026-10-07

- **Decision:** A worker invocation must match the persisted user identity on
  the claimed job before it may read deletion state or invoke any adapter.
- **Evidence:** Web PR #153 head `ade21b6`; worker/deletion focus 32/32,
  negative boundary 2/2, typecheck/diff pass, and hosted workflow
  `37560704115` with job `112597060041` passed.
- **Boundary:** This closes only the contract-level scope check. The store
  adapter, deletion-job persistence/wiring, row-count and audit reconciliation,
  restore rehearsal, and non-production E2E remain open; no production or
  destructive operation occurred.

## User-scoped deletion job persistence · 2026-10-07

- **Decision:** Pair every accepted deletion request with a durable job in the
  same transaction, using a dedicated user-scoped table rather than the
  organization-scoped generic queue.
- **Evidence:** Web PR #153 head `b91222a`; focused 16/16, disposable
  PostgreSQL integration 1/1, serial 846/23/0, typecheck/schema/migration/
  build/diff pass.
- **Boundary:** Migration `0031` is source-only. This supplies enqueue state
  but not claim/retry SQL, per-kind deletion, reconciliation/audit receipt,
  restore/rollback rehearsal, or acceptance; hosted checks were pending at
  capture and no production operation occurred.

## Fenced deletion job adapter boundary · 2026-10-07

- **Decision:** Implement only the durable user-scoped claim/retry/block state
  first. Use `SKIP LOCKED` plus worker/attempt fences; fail closed for all
  inventory, destructive, and audit operations until separately qualified.
- **Evidence:** Web PR #153 head `654c78c`; disposable PostgreSQL integration
  1/1, serial 846/23/0, typecheck/schema/migration/negative/build/diff pass;
  hosted workflow `37561862519` was queued at capture.
- **Boundary:** No runtime route or cron wires this adapter, migration 0031 is
  unapplied, and `QUAL-WEB-005` remains open pending inventory-backed reads,
  per-kind transactions, reconciliation/audit, restore/rollback, and E2E.

## Deletion inventory read boundary · 2026-10-07

- **Decision:** Read hosted-kind counts only while the job fence is live and
  keep the operational completeness bit false until supporting user/license/
  retention tables and legal dispositions are covered.
- **Evidence:** Web PR #153 head `4656013`; disposable PostgreSQL integration
  1/1, serial 846/23/0, typecheck/schema/migration/negative/build/diff pass;
  hosted workflow `37562115786` was pending at capture.
- **Boundary:** No per-kind deletion, audit receipt, restore rehearsal,
production migration, or acceptance is supplied by this read path.

## Fenced deletion receipt boundary · 2026-10-07

- **Decision:** Persist only bounded terminal decision metadata, and complete
  the request/job atomically under the live worker/attempt fence. Enforce
  unique request and audit-idempotency identity; stale or replayed fences must
  not claim completion.
- **Evidence:** Web PR #153 exact head `52be606`; disposable PostgreSQL
  integration 1/1, serial 846/23/0, typecheck/schema/33-migration/build/diff
  pass; hosted workflow `37562587132` passed.
- **Boundary:** Migration `0032` is source-only and no destructive adapter or
  runtime worker is wired. Complete ownership/retention inventory,
  per-kind deletion, reconciliation, restore/rollback, and E2E remain open.

## Hosted payment method catalog boundary · 2026-10-07

- **Decision:** Represent the broader Razorpay hosted method surface in the
  server catalog, but expose only methods that are both configured and
  code-supported; keep QR and approval-dependent methods fail-closed until
  separately qualified for the account and lifecycle.
- **Evidence:** Web PR #149 exact head `db68157`; local payment/runtime
  25/25, negative boundary 2/2, truth registry 25/25, serial 850/22/0,
  typecheck/schema/build/diff pass; hosted workflow `37563023349` passed.
- **Boundary:** This does not prove account enablement, provider test
  transactions, webhook/replay behavior, production reconciliation, or
  acceptance. The PR remains open and no provider, payment, production,
  database, deployment, or browser mutation occurred.

## Fenced per-kind deletion transactions · 2026-10-07

- **Decision:** Persist one request/kind operation and deleted-row count in the
  same transaction as each scoped deletion. Replays return the original count;
  a stale lease cannot mutate data or record a receipt.
- **Evidence:** Web PR #153 exact head `9476e5d`; focused 29/29, disposable
  PostgreSQL 1/1, serial 846/23/0, typecheck/schema/34-migration/build/diff
  pass; hosted workflow `37563632682` passed.
- **Boundary:** Only the seven hosted projections are implemented. Supporting
  account/license/billing/retention dispositions, runtime wiring,
  reconciliation, restore/rollback, and E2E remain open; migration `0033` is
source-only and no production or destructive operation occurred.

## Bounded deletion runtime runner · 2026-10-07

- **Decision:** Expose only a bounded, authenticated cron adapter for due
  deletion jobs. Enforce a maximum batch of 10, validate the frozen seven-kind
  allowlist, delegate to the fenced worker, and always close the database
  client. Keep malformed jobs untouched and preserve the inventory fail-closed
  boundary.
- **Evidence:** Web PR #153 exact head `1f8571b`; route contract 2/2,
  disposable PostgreSQL integration 1/1, serial 846/23/0, typecheck/schema/
  34-migration/build/diff pass; hosted workflow `37563987818` passed.
- **Boundary:** This wires the runtime contract but does not authorize
  deployment or production invocation. Supporting data dispositions,
  reconciliation, restore/rollback, and authenticated non-production E2E
remain open; `QUAL-WEB-005` is not accepted.

## Supporting deletion dispositions · 2026-10-07

- **Decision:** Enumerate every supporting deletion table with one bounded
  disposition, rationale, and approval flag. Fail closed on omissions,
  duplicate/unknown tables, or blank rationale. Keep the registry separate from
  destructive SQL until every disposition is executable and recoverable.
- **Evidence:** Web PR #153 exact head `f83af5c`; focused deletion/hold/
  inventory 11/11, serial 846/23/0, typecheck/schema/34-migration/build/diff
  pass; hosted workflow `37564437899` passed.
- **Boundary:** This is an omission-detection contract, not deletion
  authorization. Provider/accounting retention, legacy public records,
  customer-held digest handling, reconciliation, restore/rollback, and
  authenticated non-production E2E remain open.

## HUNT-009 supported recipe execution requalification · 2026-10-07

- **Decision:** Record PR #75 as merged implementation and regression
  evidence; keep `HUNT-009` open.
- **Evidence:** Merge `6bde945c`; hosted Ubuntu/macOS/Windows Node 20/22/24,
  self-scan, and in-toto checks all passed. The exact requalification worktree
  package suite exited 0, including focused trust/approval, positive/negative,
  binding-drift, symlink, and unavailable-runtime cases.
- **Boundary:** HUNT-008 trusted/licensed provenance and independent Hunt
  isolation/review remain acceptance gates. No checkbox changed and no external
  recipe or production operation was performed.

## PLAN-WEB-013 test-mode hosted order probe · 2026-10-07

- **Decision:** Accept the test-mode order/read-back as provider binding
  evidence; keep PLAN-WEB-013/014/015 open.
- **Evidence:** Web PR #149 head `db68157`; one bounded Razorpay test order
  used the canonical INR 280,943 Pro monthly offer and returned `created` with
  exact amount/currency and signed checkout notes. Focused billing/config
  suite **38/38 pass**. One observed `netbanking` payment is retained only as
  an aggregate observation.
- **Boundary:** This does not prove account-enabled method discovery or any
  payment lifecycle. No payment/capture/refund/webhook/entitlement or
  production operation occurred; no checkbox changed.

The approved Chrome CDP display probe opened hosted Checkout twice in test
mode and closed without submission. Its child execution context did not expose
stable method labels to the bounded projection, so the result is recorded as
checkout-open evidence only and does not alter the payment decision.

A direct provider-checkout target observation later exposed selectable UPI,
card, netbanking, wallet, EMI, and Pay Later radios, with no QR radio. Record
this as account-level method observation only; keep PLAN-WEB-014/015 open until
each observed method has lifecycle and reconciliation evidence.

## GitHub App installation read-only preflight · 2026-10-07

- **Decision:** Keep GITHUB-WEB-001 through GITHUB-WEB-004 open; do not infer
  installation or cutover state from organization repository access.
- **Evidence:** Organization reads succeed, but `GET /user/installations`
  returns 403 because the current GitHub token is not App-authorized.
- **Boundary:** No GitHub provider mutation or production operation occurred.
## PLAN-WEB-013 hosted Pay Later alignment · 2026-10-07

- **Decision:** Expose Pay Later through the same hosted Checkout adapter as
  the other directly observed methods; keep methods without an equivalent
  qualification observation fail-closed.
- **Evidence:** PR #149 commit `f734acc`; direct test-mode hosted Checkout
  observation showed a selectable Pay Later radio; focused payment/route/runtime
  tests pass 30/30 and typecheck passes.
- **Boundary:** This does not qualify Pay Later success, failure, capture,
  refund, renewal, replay, or entitlement behavior. PLAN-WEB-013/014/015 stay
  open and no payment or production operation occurred.
- **Hosted result:** Exact head `f734acc8d4b03625b96cb90b628be04d4713d91d`
  passed Verify `37611750797` plus GitGuardian, Vercel, and Preview Comments.
  This permits code-side qualification only; it does not authorize merging
  while payment lifecycle and reconciliation gates remain open.
## PLAN-WEB-014 card sandbox contact validation · 2026-10-07

- **Decision:** Treat the card probe as incomplete provider UI evidence only;
  do not claim success, failure, capture, or lifecycle acceptance.
- **Evidence:** Cards rendered in Razorpay test-mode hosted Checkout, but the
  sandbox rejected the synthetic contact input before continuation. The single
  persistent page was restored to `about:blank` and production was untouched.
- **Boundary:** No payment or webhook was produced; PLAN-WEB-014 remains open.
## HUNT-009 execution entitlement gate · 2026-10-07

- **Decision:** Require `hunt.critical` at the CLI execution boundary before
  reading any execution input. A paid plan alone is insufficient; signed
  recipe, approval, supported catalog, exact bindings, and bounded runtime
  gates remain required.
- **Evidence:** PR #76 exact head `17d0813737cda980ccb366c5adf948bda2e293a3`;
  focused 54/54; typecheck passes; Free-plan process denial is verified.
- **Boundary:** This closes a code-side authorization gap only. HUNT-009 and
  HUNT-008 remain open for hosted/requalification, trusted/licensed provenance,
  and independent review.

## PLAN-WEB-014 Cards and Netbanking hosted probes · 2026-10-07

- **Decision:** Keep the all-method hosted order architecture and record the
  Cards/Netbanking runs as incomplete provider UI evidence only. Do not grant
  entitlement or mark any payment lifecycle as passed.
- **Evidence:** Razorpay Test Mode on PR #149 exact head `b73fdd3` reached the
  Cards save-card/confirming state and the Netbanking bank-selection screen.
  Focused payment/runtime contracts remain 47/47 passed.
- **Boundary:** No success/failure callback, capture, refund, webhook,
  renewal, replay, out-of-order, entitlement, database, production, or
  deployment evidence was produced. PLAN-WEB-014/015 remain open; the CDP
  blank target was restored.

## QUAL-WEB-006 mobile/focus runtime probe · 2026-10-07

- **Decision:** Record the `/orgs` desktop/mobile and accessibility-tree
  observations as partial runtime evidence only; do not mark accessibility,
  responsive, or performance acceptance from an empty state.
- **Evidence:** Existing authenticated CDP target; no horizontal overflow at
  1710x985 or 390x844; AX trees 30/18 named and 32/20 named; one focusable
  link; desktop layout/style/task/heap metrics
  0.000059s/0.000669s/0.001557s/6,530,812 bytes.
- **Boundary:** Programmatic focus does not prove keyboard-visible focus or
  screen-reader usability. Data states, field-CWV, large datasets, and human
  review remain open. No checkbox or production state changed.

## Web empty-Postgres regression qualification · 2026-10-07

- **Decision:** Treat the empty-database serial run as local runtime-regression
  evidence only; do not promote it to production or release acceptance.
- **Evidence:** PR #153 exact head `929da1907f001c8db71df0e601e08014590fd580`,
  disposable Docker `postgres:15`, `pnpm test:serial` exit 0, pretest 48/48,
  main 871/872 with one explicit billing-environment skip and zero failures.
- **Boundary:** No migration, `db:push`, production/provider/payment/
  deployment/browser mutation, or backlog checkbox change occurred. The
  deletion, payment, restore/rollback, reconciliation, and independent
  acceptance gates remain open.

## QUAL-WEB-005 hold serialization · 2026-10-07

- **Decision:** Use a user-scoped PostgreSQL transaction advisory lock as the
  shared serialization boundary for hold activation/release and each
  destructive deletion/terminal-receipt transaction. Recheck active holds
  inside that boundary and return a bounded block reason.
- **Reason:** A worker-level recheck alone could observe a hold only after an
  earlier destructive transaction had already committed. Shared locking makes
  the check and each protected mutation orderable without holding a database
  connection across the complete worker attempt.
- **Evidence:** Web PR #153 commit `85faba9`; focused tests **35/35** and
  disposable PostgreSQL integration **1/1**. Verify `37633633802` completed
  successfully at exact head. This is not full deletion acceptance.

## Migration bootstrap safety boundary · 2026-10-07

- **Decision:** Do not edit the applied `0000` migration or silently push an
  empty/partial schema. Route `db:migrate` through a read-only preflight and
  permit the reviewed legacy baseline only for an explicitly confirmed local
  empty database; CI and production refuse that bootstrap path.
- **Reason:** The numbered journal begins after the historical `users` and
  `licenses` baseline, and later application code also depends on legacy
  tables. A direct Drizzle run against an empty database fails before proving
  what it would write; an unconditional bootstrap would risk an unknown or
  production schema.
- **Evidence:** Web PR #149 `3f05b0a`; focused 12/12, serial 855/878/23/0,
  typecheck/schema/31-migration/build/public-boundary/SBOM/license checks, and
  disposable PostgreSQL refusal + explicit 31-migration rehearsal. See
  `docs/shipping/evidence/migration-bootstrap-guard-2026-10-07.md`.
- **Boundary:** This is migration code-side safety only. Production history,
  snapshot/restore, R-041 credential rotation, and deployment authorization
  remain open; no backlog checkbox changed.

## Production checkout post-redeploy smoke · 2026-10-08

- **Observation:** `https://verglos.com/checkout` returned HTTP 200 from Vercel
  and rendered the hosted method projection `UPI · Cards · Netbanking · Wallets
  · EMI · Pay Later` with the current Pro INR catalog. Chrome DevTools found no
  console warnings or errors; Razorpay hosted assets loaded successfully.
- **Mode:** The initial production surface did not show the Razorpay Test Mode
  banner. Treat production as live-key checkout and do not use it for payment
  qualification. Test-mode lifecycle qualification remains a Preview/staging
  operation.
- **Boundary:** No order creation, payment, webhook, entitlement, database,
  provider configuration, price, or migration write occurred. This does not
  close PLAN-WEB-011/012/013/014/015 or R-041. Evidence:
  `docs/shipping/evidence/production-checkout-post-redeploy-2026-10-08.md`.

## Preview payment safety correction · 2026-10-08

- **Decision:** Keep Preview payment checkout fail-closed until it has an
  isolated non-production database and Razorpay Test Mode credentials.
- **Evidence:** Preview deployment `dpl_CHmsR3ZVBsNDngm5D3z5Bb95h9tw` passed the
  build and renders no approved payment methods. The temporary deployment that
  rendered methods with `testMode: false` was deleted. Evidence:
  `docs/shipping/evidence/preview-payment-safety-2026-10-08.md`.
- **Boundary:** No test or live payment, order, webhook, entitlement, database,
  provider, or production write occurred. PLAN-WEB-014 remains open.

## QUAL-WEB-005 request-auth seam for route qualification · 2026-10-08

- **Decision:** Use the existing `requestAuth()` and `requestCurrentUser()` seam
  for account deletion, customer-held digest, and operator hold routes. Keep
  Clerk as the production resolver and permit the provider only in explicit
  non-production integration tests.
- **Reason:** Direct Clerk imports bypassed the reviewed isolated test seam and
  prevented authenticated route qualification without weakening production
  authentication. The seam makes the boundary testable while preserving the
  production path.
- **Evidence:** Web PR #162 merged from exact head
  `3061b9a14bd01ba22e0076b8c30d71d387483ade` as
  `b34376bb02525737830f1d075778ebce774ed006`; focused route integration 8/8,
  deletion/hold/inventory/worker contracts 23/23; isolated 38-migration
  database run; safe-default serial 861/885 with 24 explicit skips and zero
  failures; hosted Verify 37785153399; preview-safe 45-page build.
- **Boundary:** This is not deletion acceptance. Legal/customer-held
  disposition, destructive-worker execution, reconciliation, restore/rollback,
  production authorization, and independent review remain open.

## QUAL-CLI Hunt fixture build boundary · 2026-10-08

- **Decision:** Build the private Hunt package explicitly in the CLI package's
  test script before HUNT-009 execution tests load its local fixture.
- **Reason:** A fresh checkout had no `packages/hunt/dist`, so two valid
  success-path tests incorrectly exercised the intended unavailable-runtime
  response (`78`). The change keeps Hunt out of the public CLI dependency graph
  and does not alter the production loader.
- **Evidence:** CLI PR #82 exact head
  `806f2352f0f95d023a87ef8832a5a23aa47789a1` merged as
  `b852c263fe5aa26f593e4f815532a7ddb6e8d9ff`; local 924-test run with 908
  passes, 0 failures, and 16 explicit skips; focused HUNT-009 5/5; typecheck
  and build pass; platform matrix `37786406937`, self-scan `37786406760`, and
  in-toto binding passed after the isolated Windows Node 20 runner failure was
  rerun.
- **Boundary:** This is test-fixture qualification only. Hunt provenance,
  legal clearance, adversarial completion, independent review, and acceptance
  remain open. No backlog checkbox changed.

## Credential containment after local inspection error · 2026-10-08

- **Decision:** Treat the Razorpay/test and production-encrypted values emitted
  by the malformed environment-inspection command as compromised; do not use
  them for qualification or production operations.
- **Required correction:** Rotate/revoke the affected provider credentials,
  refresh the Vercel production secret, redeploy only after the provider and
  deployment preflight is reviewed, and verify the old values are unusable
  without recording any secret.
- **Boundary:** No provider call, payment, deployment, database, or production
  write was made after the incident. PLAN-WEB-014/015 and R-041 remain open.

## Hosted payment methods remain contract-qualified, not provider-accepted · 2026-10-08

- **Decision:** Preserve hosted checkout as the all-method path and keep QR as
  a separate opt-in adapter. Lock the six currently supported hosted methods
  into synthetic captured/failed/replay tests and reject methods absent from
  the signed checkout snapshot.
- **Evidence:** Web PR #163 merged as `d88aa7b9b219df414707143bc8c6b9c6e9b18193`;
  focused 21/21, serial 862/886 with 24 skips, hosted Verify `37789719564`,
  schema/migration/type/build gates green.
- **Boundary:** Synthetic tests do not prove Razorpay provider lifecycle,
  refunds, renewals, entitlement reconciliation, or production truth. R-041
  credential containment and PLAN-WEB-014/015 remain open.

## Invoice-bound subscription captures and Production code rollout · 2026-10-09

- **Decision:** Bind Razorpay subscription captures through the provider's paid
  invoice when the payment entity omits `subscription_id`; normalize only the
  observed string boolean representation of `captured` and retain all exact
  commercial, signature, status, and refund checks.
- **Evidence:** Web `a95deef`; focused webhook 13/13; full Web 891 total,
  868 pass, 23 explicit skips, 0 failures; isolated Preview invoice/payment/
  subscription/ledger/license reconciliation; Production deployment
  `dpl_72ptf8YQyLxxXvJHVQDg2vUfh3CN` with runtime-config, build, and read-only
  smoke passing.
- **Production boundary:** Production receives the reviewed code only. No
  Production plan IDs, payment/provider writes, database/migration writes,
  entitlement changes, account changes, or customer-data mutations occurred.
- **Disposition:** The observed first-charge subscription defect is fixed. The
  full Gate 4 lifecycle matrix and provider/ledger/entitlement reconciliation
  remain open; no backlog checkbox is accepted from this batch.

## Preview subscription mandate/OTP limitation · 2026-10-09

- **Decision:** Treat the bounded Test Mode subscription mandate/OTP failure as
  a provider-qualification limitation, not as payment success and not as a
  product acceptance failure. Do not repeat the same OTP interaction without
  a changed provider fixture or documented provider control.
- **Evidence:** The catalog-bound Preview route returned 200 and reached the
  provider mandate step; the bounded OTP and bank-like OTP paths failed. The
  isolated database was reconciled read-only with 38 migrations, 4 captured
  subscription payments, 2 active Pro licenses, and cumulative subscription
  and webhook aggregates recorded in the dated evidence file.
- **Boundary:** No Production plan, provider/payment, database/migration,
  entitlement, account, or customer-data write occurred. Gate 4 and
  `PLAN-WEB-011`, `PLAN-WEB-012`, `PLAN-WEB-014`, and `PLAN-WEB-015` remain
  open until the missing provider lifecycle and reconciliation evidence exists.

## Test Mode renewal trigger and replay boundary · 2026-10-10

- **Decision:** Do not use an undocumented charge endpoint or synthetic
  webhook. The supported subscription update was attempted once and rejected
  because the selected subscription's cycle start is in the future.
- **Next permitted action:** Use Razorpay's official Dashboard replay flow for
  an unacknowledged Subscription/Invoice event within seven days, selecting
  only the isolated Preview webhook. Replayed payloads must retain the
  provider signature and pass the existing idempotency path.
- **Boundary:** No provider write was accepted and no application or
  Production state changed. Gate 4 and `PLAN-WEB-014` remain open.
- **Evidence:**
`docs/shipping/evidence/plan-web-014-testmode-renewal-replay-boundary-2026-10-10.md`.

## Preview ingress repaired; recurring-card acceptance remains open · 2026-10-10

- **Decision:** Replace the stale protection bypass only on the isolated Test
  Mode Preview webhook, then qualify the route with a provider-controlled
  pause/resume pair. Keep Production untouched and fail-closed.
- **Result:** The endpoint reached the application route, both signed lifecycle
  events completed exactly once, and the application subscription returned to
  `active`. A bounded hosted-card attempt still did not authorize/capture; the
  provider remained at recurring-card eligibility/tokenization/OTP.
- **Boundary:** No OTP was guessed, no synthetic webhook or direct database
  edit was used, and no Production payment, database, entitlement, or account
  write occurred.
- **Disposition:** This is qualified ingress/lifecycle progress, not Gate 4
  acceptance. Keep `PLAN-WEB-014` open until recurring-card authorization/
  capture and payment/ledger/license reconciliation are evidenced.
- **Evidence:**
  `docs/shipping/evidence/plan-web-014-preview-webhook-bypass-pause-resume-2026-10-10.md`.

## Cards-only deployed truth and provider boundary · 2026-10-10

- **Decision:** Keep the release candidate Cards-only. Fresh Production
  responses expose Cards-only with subscription creation disabled; isolated
  Preview exposes Cards-only with Test Mode subscription creation enabled.
- **Provider boundary:** The authenticated Test Mode dashboard confirms the
  repaired webhook deliveries return HTTP 200, but provides no replay or
  charge-now control for the selected target. Do not use undocumented APIs,
  synthetic events, guessed OTPs, or direct database edits.
- **Release decision:** Keep Gate 4 and `PLAN-WEB-014` open until a supported
  recurring-card tokenization/authorization fixture or provider control
  yields capture and complete payment/ledger/license reconciliation. Owner is
  the Verglos release owner with the Razorpay Test Mode account owner; review
  by 2026-10-17.

## Final V1 scope and Hunt/business model decision candidate · 2026-10-12

- **Decision candidate:** Verglos remains a local-first TypeScript/JavaScript
  security decision and evidence layer. Free keeps a complete local scanner and
  receives a limited safe Hunt starter pack; Pro receives the complete V1 Hunt
  recipe catalogue, full MCP Hunt, CI Hunt, advanced rule packs, monitoring,
  and signed `.vgl` Release Records. Team, Studio, and Enterprise add shared
  policy/SCM, client evidence, and private governance respectively.
- **Hunt boundary:** Planner/Scout, bounded Attack Worker, deterministic Proof
  Adjudicator, and Release Auditor are controlled roles. No arbitrary
  model-generated shell, public-internet exploitation, credential guessing, or
  claim that one probe proves an application secure.
- **Recipe candidate:** SQL/NoSQL injection, command injection, path traversal,
  SSRF, XSS, mass assignment, authorization/tenant isolation, and Agent/MCP
  boundary. The first implementation slice is SQL/NoSQL, command, path,
  SSRF, and Agent/MCP; each needs positive, negative, timeout, failure,
  cleanup, redaction, and limitation fixtures.
- **Status:** Documentation only. This does not implement code, change plan
  entitlements, or close a backlog item. It must be reviewed before the next
  execution goal and then synchronized across the contract, feature map,
  architecture, CLI/Web/MCP capabilities, backlog, and public claims.
- **Context:** See
  `docs/shipping/VERGLOS_FINAL_V1_SCOPE_AND_HUNT_DECISION_2026-10-12.md`.
