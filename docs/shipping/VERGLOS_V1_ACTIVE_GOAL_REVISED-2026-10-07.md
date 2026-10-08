# Verglos V1 Active Shipping Goal — Backend-First Unchecked-Backlog Pass

Effective checkpoint: 2026-10-09. This is the operative replacement goal for
the remaining active shipping window. Replace the previous active goal with
this file when resuming.

## OBJECTIVE

  Ship the complete Verglos V1 across:

  - /Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli
  - /Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-web

  Continue from the verified current state. Never restart completed work, trust
  stale conversation summaries, or equate commit volume with product
  completion. The primary execution objective is to close the unchecked
  backlog through real implementation and qualification, backend/CLI first,
  while preserving Verglos' philosophy, security, privacy, evidence standards,
  business safety, and public/private boundary.

  Every active work turn must do one of the following:

  - implement or repair product code, tests, integration, or release tooling
    for an unchecked backlog item;
  - execute the smallest missing qualification needed by an unchecked item; or
  - establish and record the exact external blocker, owner, evidence gap, and
    next action, then immediately move to the next independent unchecked item.

  A status recap, repeated unchanged test run, helper-only change, arbitrary
  documentation edit, browser clicking without an acceptance purpose, or
  checkbox edit without current evidence is not progress.

  The final repository scans, external POC, false-positive review, and
  company-architecture validation happen only after all implementation,
  integration, qualification, release-gate, and release-candidate-freeze work
  is complete. Do not use repository scanning to create the appearance of
  shipping progress.

  Do not release or publish the final npm version until the complete V1 is actually qualified. The unreleased latest source tree is the product under test; the old
  published alpha is only a compatibility baseline where explicitly required.

  CURRENT OPERATING PRIORITY — 2026-10-09

  The remaining work is now backend/CLI-first. The primary objective is to
  clear genuinely executable unchecked backlog items in `verglos-cli` in
  coherent fat batches, with the private tracker count as the scoreboard. Do
  not move to frontend polish because it is easier. Continue backend work until
  each CLI item is either accepted with current evidence or has an explicit
  external owner, missing artifact, and release decision. Then complete the
  final `verglos-web` truth, browser, payment, production, and accessibility
  pass. Web work is allowed earlier only when it unblocks a backend contract or
  repairs a verified release blocker.

  Verglos is a product for local, CI, hosted, team, organization, and
  enterprise-shaped use cases; it is not a local-only product. That broad
  product scope must be earned by the corresponding contracts, authorization,
  isolation, entitlement, operational, billing, and release evidence. Do not
  claim Team, Studio, Enterprise, GitHub organization, or production payment
  capability merely because local substrate or a UI route exists.

  BACKEND-FIRST PRIORITY LOCK

  Do not spend the main execution path on frontend polish, marketing copy,
  pricing presentation, final metadata, public corpus scans, or speculative
  POC work while a dependency-ready CLI/backend item exists. For each batch:

  1. read the live unchecked backlog and select the largest coherent set of
     dependency-ready backend/CLI IDs;
  2. implement the missing code, tests, integration, or release surface;
  3. run the smallest focused qualification, then the required phase suite;
  4. inspect public/private boundaries, security behavior, and exact diffs;
  5. verify hosted PR/CI state when a PR exists;
  6. accept only IDs whose complete criteria are evidenced, and record all
     remaining external gates without pretending they passed;
  7. immediately take the next independent backend batch.

  Code-side progress is valuable but is not checkbox acceptance when the item
  still requires provider activation, legal approval, trusted publishing,
  independent review, customer authorization, production reconciliation, or
  hosted operational evidence. When one item is blocked, preserve the blocker
  and continue with the next executable item.

  The authoritative checkpoint for this resume is:

  - **218 checked / 62 unchecked / 280 total / 77.9%**;
  - CLI `origin/main`: `8bea4be2fa18533eafd088122be769e942965626`;
  - Web `origin/main`: `cedf199855a5c4734122ae4849253156328cff1b`;
  - Web PR #166 merged as `ff0dd15b3eada55eb898038bc66ea0c5394bead6`;
  - Web PR #167 merged as `9841236c64a816fc90402cd90ff2bc93ce35382c`;
  - Web PR #168 merged as `cedf199855a5c4734122ae4849253156328cff1b`;
  - CLI PR #85 merged as `80fa930` and CLI PR #86 merged as `fc452ba`;
  - private tracker current documentation head: `d95ede7`;
  - no open CLI or Web PR was present at this checkpoint;
  - no checkbox is accepted merely because implementation exists or tests are green.

  Current resume evidence already available:

  - CLI PR #85 and #86 passed their recorded focused/full/hosted checks and
    merged. The latest CLI changes harden private cache writes and private
    runner replay persistence, but the related operational, trusted-provenance,
    reviewer, publishing, and activation gates remain open where required.
  - Web payment/ledger/webhook qualification passed **31/31** against a
    disposable PostgreSQL 15 database migrated through all **38** migrations.
    A separate fresh-database serial run passed **885/887**, with **2 explicit
    skips and 0 failures**. Typecheck, migration ordering, schema checks,
    build, and the 45-route local runtime sweep passed.
  - The authenticated Chrome session is available on `127.0.0.1:9222` and
    Docker is available for bounded qualification. These are instruments, not
    acceptance evidence. The latest read-only production checkout rendered
    UPI, Cards, Netbanking, Wallets, EMI, and Pay Later without console errors;
    it did not prove Test Mode, order creation, capture, refund, webhook,
    entitlement, renewal, or cancellation.
  - No production database, migration, payment, provider, entitlement,
    deployment, or account write occurred during the latest qualification.
  - The remaining CLI queue must be re-read from the live private backlog at
    resume. Do not assume every item is blocked from an old note: inspect each
    acceptance criterion, complete any newly executable code-side batch, and
    record only the exact external gates that still remain.

  The exact open IDs at this checkpoint are:

  - CLI/backend and release: HUNT-008–011, PLAN-CLI-001–004,
    TEAM-CLI-001/002, STUDIO-CLI-001, ENT-CLI-001, LIC-002/003,
    DIST-001–003/006, QUAL-CLI-004, and QUAL-CLI-006;
  - Web/cross-repository: PLAN-WEB-011–015, PRO-008, TEAM-WEB-006,
    QUAL-WEB-005/006, ACCEPT-002/003, ACCEPT-005–010/011–014,
    FINAL-WEB-001–008, and GITHUB-WEB-001–004;
  - governance and release decisions: the nine remaining governance
    checkboxes covering plan hypotheses, queue/object-storage approval, legal
    and external-license approval, networked Hunt exceptions, independent Hunt
    review, authorized fixtures/consent, external-operation authorization, and
    the prohibition on claiming Team/Studio/Enterprise GA.

  Recompute this list from the authoritative private backlog before each batch;
  it is a checkpoint, not permission to assume that any item is accepted.

  The CLI queue must be driven from the live private backlog, not from memory.
  At each batch, select dependency-ready IDs, implement the missing product or
  qualification surface, run the required tests, inspect the public boundary,
  verify the PR, and reconcile private evidence. If an ID is blocked by a
  provider, legal approver, independent reviewer, customer authorization,
  production activation, or hosted integration, record that exact gap and move
  to the next executable CLI ID. Do not relabel a blocked gate as complete.

  Backend-first means the CLI queue is exhausted only when every remaining CLI
  item is either accepted with evidence or recorded as externally blocked with
  an owner and release decision. Until then, do not spend the main execution
  path on frontend polish, marketing, public pricing, or final corpus scans.

  INITIAL NEXT-THREE BATCH QUEUE

  Recompute this queue against the live backlog at resume; these are execution
  lanes, not accepted IDs:

  1. **CLI backend qualification:** dependency-ready work across HUNT-008–011,
     PLAN-CLI-001–004, TEAM-CLI-001/002, STUDIO-CLI-001, and ENT-CLI-001.
     Required evidence is exact source behavior, focused and full CLI tests,
     typecheck/build/lint, public-boundary and adversarial checks, and hosted
     PR verification. Trusted publisher roots, hosted activation, operational
     runner exchange, and independent review remain explicit blockers where
     required by the individual item.
  2. **CLI distribution and release gates:** LIC-002/003, DIST-001–003/006,
     and QUAL-CLI-006. Required evidence is deterministic package/archive,
     notice/SBOM, clean-consumer, rollback, supported-runtime, official-tool,
     legal, trusted-publishing, and release-identity qualification. Do not
     claim completion from local archive generation alone.
  3. **Final Web and cross-repository qualification:** PLAN-WEB-011–015,
     QUAL-WEB-005/006, TEAM-WEB-006, GITHUB-WEB-001–004, and FINAL-WEB-001–008.
     Required evidence is isolated Test Mode payment lifecycle, production
     preflight/reconciliation after credential rotation, authenticated browser
     and field/runtime evidence, final truth review, and the remaining hosted
     integrations. Keep this lane after the CLI-first pass except for a blocker
     that directly prevents a dependency-ready CLI batch.

  BACKEND COMPLETION CHECKPOINT

  “Backend complete” is not a feeling and is not the same as “the CLI builds.”
  Before leaving the backend track, produce a row for every unchecked CLI,
  governance, and release item with:

  - the exact implementation or qualification surface;
  - current source commit and private evidence path;
  - focused and required full test results;
  - security, adversarial, public-boundary, and supported-runtime results;
  - hosted PR/check/release evidence where required;
  - the remaining external dependency, named owner, expiry or review date,
    and release decision when it cannot be satisfied in this session.

  Close a checkbox only when all of its acceptance criteria are satisfied.
  If a backend item is blocked, do not spend a turn restating the same blocker:
  record it once, then take the next independent backend item. The main path
  moves to Web only after no dependency-ready backend item remains, not merely
  because a backend item is inconvenient to qualify.

  AUTHORITATIVE SOURCES

  Read `/Users/anuragyadav/Developer/TopNotchh-Workspace/brain` first. Its philosophy overrides convenience and assumptions.

  Before planning, inspect the current copies of:

  - `verglos-cli/SHIP_VERGLOS_FINAL.md`
  - `verglos-cli/docs/VERGLOS_COMPANY_USAGE_AND_FEATURE_MAP.md`
  - `verglos-cli/docs/VERGLOS_PRODUCT_ARCHITECTURE_BLUEPRINT.md`
  - `verglos-cli/docs/shipping/VERGLOS_V1_BACKLOG.md`
  - `verglos-cli/docs/shipping/TRACEABILITY.md`
  - `verglos-cli/docs/shipping/EXECUTION_LEDGER.md`
  - `verglos-cli/docs/shipping/STATUS.md`
  - `verglos-cli/docs/shipping/DECISIONS.md`
  - `verglos-cli/docs/shipping/RISKS.md`
  - `verglos-cli/docs/shipping/RELEASE_GATES.md`
  - `verglos-cli/docs/shipping/VERGLOS_TRUTH_REGISTRY.md`
  - `verglos-cli/docs/shipping/VERGLOS_COMMAND_AND_UI_CONTRACT.md`
  - `verglos-cli/docs/shipping/VERGLOS_AGENT_AND_MCP_CONTRACT.md`
  - `verglos-cli/docs/shipping/VERGLOS_FINAL_ACCEPTANCE_AND_POC.md`
  - `verglos-cli/docs/shipping/VERGLOS_DATA_AND_SCHEMA_MIGRATION_INVENTORY.md`
  - `verglos-web/docs/shipping/DATABASE_MIGRATION_RUNBOOK.md`
  - applicable `AGENTS.md`, `CLAUDE.md`, and repository instructions.

  The private authoritative tracker is:

  `/Users/anuragyadav/Developer/TopNotchh-Workspace/verglos-cli-private-shipping`

  Reconcile its backlog, traceability, execution ledger, status, decisions, risks, release gates, goal addendum, and evidence with local mirrors. If they differ,
  investigate and record the resolution. Never silently choose one.

  The backlog, traceability, and execution ledger are mandatory operating controls.

  CORE RULES

  - Never invent features, plans, pricing, permissions, customers, POC results, security properties, test results, CI status, completion, or timelines.
  - Current files, test output, PR state, hosted checks, deployment evidence, and runtime evidence outrank memory.
  - Do not edit blog, landing, homepage, pricing-marketing, campaign, metadata, or other public marketing surfaces until technical, hosted, qualification, truth, and
  release gates pass.
  - Keep internal shipping documents, founder assets, customer data, credentials, operational evidence, fixture contents, detailed findings, and secrets private and out of
  public repositories and PRs.
  - The public CLI must never contain customer data, credentials, proprietary source, private acceptance reports, private fixture contents, or competitive intelligence.
  - Public evidence may contain only sanitized claims, aggregate results, and non-sensitive hashes where explicitly approved.
  - Inspect staged diffs and PR file lists before every push.
  - Never rewrite public history or force-push without revalidating the exact approved scope and recovery consequences.
  - Preserve unrelated user changes and untracked founder assets.
  - Do not claim unattended/background work. Work only while the session is active.

  EXECUTION ACCELERATION WITHOUT LOWERING THE BAR

  - Run the CLI/backend track first and continuously. Run Web work in parallel only when its files and acceptance boundaries are independent or it is required to unblock a CLI contract.
  - Never let a pending provider, browser, customer, reviewer, or hosted check on one track idle the other.
  - Maintain a live queue of the next three independent batches, each with dependency, acceptance evidence, repository, PR boundary, and blocker.
  - Prefer one substantial phase PR per repository.
  - Do not wait for hosted CI before finishing the complete local batch.
  - Implement, run focused tests, run security/public-boundary checks, inspect the final diff, push once, then monitor the resulting checks.
  - Poll live PR/check handles with bounded intervals. If a check is pending, record its exact state and switch to the next dependency-ready batch.
  - Use focused tests during implementation and the full configured suite once per merged phase.
  - Do not rerun unchanged full suites merely to fill time.
  - Group tightly related route, schema, module, integration, security, test, and evidence changes into one reviewable batch.
  - A helper-only or documentation-only commit is not a shipping batch unless it is required for a verified gate.
  - Never bypass required checks, merge pending security checks, or mark a pure substrate as an accepted operational capability.
  - If a batch is externally blocked, record the exact blocker and immediately pursue the next independent batch.

  FAT-BATCH EXECUTION POLICY

  At the start of every batch identify:

  - exact backlog IDs;
  - acceptance criteria;
  - dependencies;
  - repository;
  - implementation boundary;
  - evidence required;
  - active phase PR;
  - known blockers;
  - production or external-state requirements.

  Then continue through:

  1. implementation;
  2. integration;
  3. focused tests;
  4. security/adversarial checks;
  5. typecheck/build/schema checks;
  6. acceptance review;
  7. PR/CI verification;
  8. private documentation reconciliation.

  Do not stop after a helper file, one test, a status recap, or a documentation-only change.

  Maintain one phase PR per repository. Reuse the active phase PR while it is open. Create a new PR only after the current one is merged/closed or a genuine phase boundary
  exists.

  BACKEND-FIRST BATCH POLICY

  Until the CLI/backend queue is exhausted or explicitly blocked, use this
  order:

  1. CLI implementation and qualification items that are dependency-ready,
     especially Hunt/agent authority, entitlement/catalog compatibility,
     policy/cache/check payloads, records/provenance, private-runner client
     behavior, and distribution/package safety.
  2. Cross-repository contracts required by those CLI items, using Web only for
     the smallest reviewed contract or test fixture needed to qualify them.
  3. CLI distribution, supported-runtime, adversarial, and release-gate work.
  4. Web final truth, hosted browser, payment-method/lifecycle, accessibility,
     performance, privacy, production-reconciliation, and release-candidate
     work.
  5. Founder-supplied company-shaped POC, held-out corpus evaluation,
     false-positive/false-truth correction, and final go/no-go.

  A CLI batch may strengthen several open IDs, but it may claim an accepted ID
  only when every criterion and external dependency for that ID is evidenced.
  Code-side progress, a fixture, a mocked provider, a local test, or a hosted
  platform matrix is recorded as progress—not acceptance—when the backlog says
  live activation, legal review, independent review, customer authorization, or
  production reconciliation is still required.

  BACKLOG ACCOUNTING

  After every substantial batch:

  1. Recalculate checked, unchecked, and total counts from the authoritative private backlog.
  2. Report exact accepted backlog IDs.
  3. Report every attempted-but-open ID and missing evidence.
  4. Do not use remembered counts or commit counts.
  5. Do not change a checkbox without direct, current acceptance evidence.
  6. Keep backlog, traceability, execution ledger, status, decisions, risks, release gates, truth registry, and affected evidence consistent.
  7. Make one compact private documentation commit per substantial batch.
  8. Never push private tracker documents to public remotes.

  Every batch report must include:

  - accepted/open backlog IDs;
  - exact checked / unchecked / total count;
  - code commits by repository;
  - pushed/not pushed status;
  - existing PR URL, exact head, CI state, review state, and mergeability;
  - tests, typecheck, build, migration/schema, security, adversarial, Docker, and cross-repository results actually run;
  - private documentation commit and files updated;
  - explicit production/database/payment/deployment read/write/migration status;
  - next fat batch or exact blocker.

  DATABASE, BILLING, AND PRODUCTION SAFETY

  Founder grants Codex standing authorization to perform required work across the
  Verglos CLI/Web repositories and their authorized providers, including
  production inspection, deployments, migrations, billing/payment qualification,
  provider configuration, rollback, and operational cutovers.

  Do not stop to request permission again for an operation that is within this
  shipping objective and has completed its operation-specific safety preflight.

  Standing authorization does not waive safety evidence. Before any irreversible
  production operation require:

  - exact reviewed SQL or provider operation;
  - dry-run results and row counts;
  - backup/snapshot evidence;
  - restore rehearsal;
  - reconciliation criteria;
  - rollback/forward-fix procedure;
  - bounded execution plan;
  - post-write verification.

  Use local environment mechanisms; never print or paste secrets.

  First inspect production schema, migration history, permissions, provider configuration, and aggregate evidence read-only.

  A provider-management token is not automatically a SQL credential.

  Never pass database or provider credentials in command-line arguments.

  Treat any exposed production credential as compromised and rotate it before further use.

  Never run production DDL, DML, migrations, backfills, cutovers, deletions, payment charges, billing changes, deployments, or other production writes without the reviewed
  operation-specific preflight above.

  If production access, backup evidence, provider configuration, or customer authorization is insufficient, pause only that operation, record the exact blocker, and
  immediately continue independent product work.

  Never stall the entire goal because of one provider, browser, customer, reviewer, credential, or production-state blocker.

  Codex must not invent browser sessions, bypass MFA/CAPTCHA, fabricate payment confirmation, or claim provider/customer/reviewer evidence that was not actually obtained.

  Never infer schema, migration status, tenant ownership, billing state, payment capture, entitlement state, or data correctness.

  RAZORPAY PAYMENT SCOPE

  Support only payment methods actually enabled and approved for the Razorpay account.

  The payment architecture must be server/catalog-driven and must not promise unavailable methods.

  Qualify every enabled method, including cards, UPI, netbanking, wallets, and any additional account-enabled method, across:

  - checkout creation;
  - success;
  - failure;
  - authorization/capture;
  - refund;
  - renewal;
  - cancellation;
  - replay;
  - duplicate delivery;
  - out-of-order events;
  - exactly-once entitlement/license behavior.

  Test mode must be used for qualification. Keep payment identifiers and webhook evidence private and redacted. Provider documentation is not runtime evidence.

  GITHUB ORGANIZATION SCOPE

  Verglos is GitHub-first, but must not claim complete GitHub organization integration until it has:

  - immutable GitHub account and repository IDs;
  - GitHub App installation identity;
  - multi-repository installation scope;
  - least-privilege permission verification;
  - signed App/JWT installation-token exchange;
  - token expiry and refresh handling;
  - install, uninstall, suspend, and reauthorization lifecycle;
  - delivery-ID replay protection;
  - repository, installation, commit, and artifact binding;
  - retry and reconciliation behavior;
  - authorized organization cutover evidence.

  Owner/name-only SCM binding is insufficient for the final claim.

  FINAL REPOSITORY CORPUS AND POC

  Do not clone or analyze the final company-shaped repository corpus until all shipping implementation, integration, qualification, release-gate, and release-candidate-
  freeze work is complete.

  After the shipping candidate is frozen:

  - use full, non-shallow public TypeScript/JavaScript repositories;
  - select repositories by architecture shape:
    - small product;
    - multi-user SaaS;
    - multi-tenant/team system;
    - large-scale or enterprise-like system;
  - record exact commit, license, scope, configuration, and reproducibility privately;
  - keep reports, findings, manifests, and feedback private;
  - use held-out repositories for false-positive and false-truth evaluation;
  - do not tune against the final holdout;
  - do not claim customer acceptance from public repositories;
  - do not add repository contents or competitive intelligence to the public CLI;
  - use the results for final regression, product correction, truth reconciliation, and go/no-go only.

  NODE AND APPLICATION-STANDARD QUALIFICATION

  At release, explicitly document the supported Node runtime baseline using currently supported LTS versions. Do not silently present an EOL runtime as the primary
  security baseline.

  Verify:

  - npm/pnpm installation;
  - clean consumer installation;
  - package exports;
  - lockfile and workspace behavior;
  - Node supported-runtime matrix;
  - Linux/macOS/Windows behavior;
  - CI integration;
  - JSON/machine-readable output;
  - monorepo and single-package repositories;
  - Next.js, React, Node API, npm package, serverless, worker, and CLI shapes where applicable.

  Native source analysis remains JavaScript/TypeScript-focused. Other languages may be represented through imported SARIF, SBOM, or external-engine evidence, but must not
  be advertised as native Verglos SAST.

  REPOSITORY AND PR WORKFLOW

  For `verglos-cli`:

  - preserve the public/private code boundary;
  - run package/public-boundary checks;
  - run affected tests, typecheck, build, process tests, adversarial tests, and platform checks;
  - inspect current CLI PRs before creating another;
  - do not publish internal shipping documents or fixture evidence.

  For `verglos-web`:

  - run affected tests, typecheck, build, migration ordering/schema checks, security checks, and integration tests;
  - treat migration files as production-impacting;
  - do not merge or deploy while required migrations, restore evidence, rollback qualification, or provider evidence are unresolved;
  - inspect current Web PRs before creating another.

  For both repositories:

  - fetch and inspect exact branch divergence;
  - inspect final diff and staged file list;
  - push grouped commits only;
  - preserve founder-owned untracked assets;
  - never publish private tracker documents.

  FULL SHIPPING SCOPE

  Complete all dependency-ordered phases:

  1. Truth, governance, licensing, risks, decisions, and release gates.
  2. CLI command, config, inspect, evidence, and compatibility foundations.
  3. Canonical records, signing, verification, provenance, and redaction.
  4. Agent/MCP authority and safe Hunt execution.
  5. Plans, entitlements, usage, quotas, and CLI/backend operations.
  6. Hosted receipt ingestion, tenant isolation, authorization, custody, billing,
     payment methods, monitoring, queues, and cross-repository contracts.
  7. GitHub App/org integration and SCM delivery qualification.
  8. Distribution, CI/CD, SBOM/notices, rollback, supported platforms, and
     adversarial qualification.
  9. Accessibility, performance, privacy, deletion, retention, backup, restore,
     payment lifecycle, and disaster-recovery qualification.
  10. Acceptance stories, independent review, truth reconciliation, and
      release-candidate freeze.
  11. Only after all prior gates pass: full repository corpus scans, external
      POC, false-positive correction, final regression, and go/no-go.
  12. Only after final go/no-go: public docs, pricing, metadata, blog,
      landing-page, npm publication, release tags, and launch operations.

  CURRENT EXECUTION LESSONS

  - Fat batches are preferred: combine tightly related implementation, integration, testing, and evidence boundaries.
  - A passing unit test or helper module is not acceptance evidence by itself.
  - Pure policy modules must not be represented as deployed operational capability.
  - Queue, webhook, retention, telemetry, backup, DLQ, billing, and payment code require integration, authorization, persistence, retry, recovery, and runtime evidence.
  - Migration preflight must compare actual production history and hashes, not only table presence.
  - Production schema expansion is not the same as current-data backfill, reconciliation, restore qualification, or cutover.
  - Hunt remains incomplete until trusted publisher roots, licensed recipe provenance, bounded execution, isolation evidence, and adversarial review exist.
  - GitHub SCM substrate is not equivalent to GitHub App/org production integration.
  - Provider payment documentation is not equivalent to payment-method runtime evidence.
  - Repository scans are post-shipping validation, not implementation acceptance.
  - Marketing truth remains frozen until final truth and release gates pass.
  - Do not create work solely to reduce the checkbox count; complete real acceptance criteria.
  - Do not use the public CLI repository as a place to store private evaluation intelligence.
  - The CLI is the current primary execution track. Existing CLI substrate is
    substantial, but open backlog IDs still require their stated operational,
    legal, reviewer, provider, and cross-repository evidence.
  - Chrome DevTools availability and Docker availability enable qualification;
    neither is evidence that a route, payment lifecycle, sandbox boundary, or
    production operation passed.
  - A founder statement of consent is not a substitute for a repository owner's
    written authorization, legal approval, an independent security review, or
    provider/account evidence where the backlog requires those artifacts.
  - Test Mode is not production evidence. Never lower a production price to
    `$1`, use a live-looking QR, edit a production row, or treat a polling
    response as payment success.
  - A merged PR must be verified through the hosting provider. Local worktree
    cleanup can fail independently because another worktree owns the local
    base branch; that does not change the remote merge state.
  - Do not spend the CLI-first critical path repeatedly rerunning unchanged
    suites. Use focused evidence for implementation, then one full configured
    suite for the completed phase.
  - The Web keyless-Preview middleware fix removed one real 500 path, but a
    fresh built-runtime sweep then found direct Clerk `auth()`/`currentUser()`
    calls still return 500 on `/activate`, `/cli-auth`, `/account`, and `/orgs`
    when Preview has no Clerk key. This is a concrete Web release defect to
    repair and requalify; it is not permission to weaken production auth or to
    mark the route sweep complete.
  - Production checkout currently renders UPI, Cards, Netbanking, Wallets,
    EMI, and Pay Later with no QR-only path, but the page does not identify as
    Test Mode. This is read-only rendering/configuration evidence only; it does
    not prove order creation, capture, refund, webhook, entitlement, renewal,
    or production payment acceptance.
  - The all-method payment decision supersedes QR-only emphasis: use the
    server/catalog-driven provider-hosted checkout and qualify every actually
    enabled method in isolated Test Mode. QR may remain optional, but cannot be
    the only payment path or a substitute for lifecycle evidence.

  SESSION LEARNINGS

  Update this section after every substantial batch with:

  - exact PR heads;
  - merge commits;
  - workflow IDs;
  - local command totals;
  - runtime versions;
  - skips and limitations;
  - production/provider/customer/reviewer evidence;
  - newly discovered risks;
  - decisions made;
  - whether public/private boundaries were checked.

  CURRENT SESSION LEARNINGS — 2026-10-09

  - The Web homepage contrast/key batch was implemented in Web commit `5b351a9`,
    passed local typecheck, truth-registry 25/25, serial 862 passed / 24
    environment-gated skips / 0 failures, 45-page build, and local mobile and
    desktop Lighthouse Accessibility/Best Practices 100/100 with a clean
    console. It merged as PR #165 / `c620c39` after Vercel, Preview Comments,
    GitGuardian, and typecheck/schema passed. No backlog checkbox changed.
  - The current next track is a fresh CLI worktree from the latest
    `origin/main` `8bea4be`; the first action is to choose a dependency-ready
    unchecked CLI batch from the private tracker, not to reopen merged Web work.
  - Current CLI open work includes implementation-progress items in Hunt,
    entitlement/catalog compatibility, organization policy/check payloads,
    client projection, private runner, licensing/distribution, and release
    qualification. Many remain open for external evidence; local code must be
    strengthened without claiming those external gates are satisfied.
  - No production database, migration, payment, provider, customer, or release
    write is implied by this phase. Local dependency installation, tests, builds,
    browser qualification, and PR operations remain separate from production
    acceptance.
  - The CLI backend qualification batch at exact origin/main
    `94829e1a4fc8e42dd67545e99cbe9a3a837b9482` passed the configured CLI tests,
    build, typecheck, lint, ordinary Hunt tests 45/45, pinned Docker
    adversarial evidence 60 pass / 1 explicit macOS namespace skip / 0 fail,
    package/public-boundary audits, packed manifests, and release-script tests
    12/12. `pnpm pack:public` passed after CI-equivalent all-platform optional
    package provisioning.
  - The strict release sequence correctly remains blocked by seven license
    review entries: six BlueOak-1.0.0 transitive packages and the nested
    `benchmark@1.0.0` conflict under `fast-uri@3.1.7`. A private package/source/
    digest review packet was added; it is not legal approval. Hunt trusted
    roots, recipe provenance, independent review, publishing identity, and
    operational gates remain open. No public code, production, provider,
    database, payment, deployment, registry, or npm state changed.
  - The CLI qualification worktree was left source-clean at exact
    `94829e1a4fc8e42dd67545e99cbe9a3a837b9482`; no CLI PR was open. The
    remaining CLI IDs were therefore not checked: their missing proof is
    hosted activation, trusted/legal provenance, independent review, official
    publishing identity, or another external acceptance dependency rather than
    an unverified local green test.
  - The private tracker was reconciled in commits `b242099f` and `fa75f12b`.
    These commits record the backend qualification result and the exact
    external blockers; they do not represent product acceptance or public
    release.
  - The operating decision for the next resume is explicit: inspect the live
    unchecked queue, take the next dependency-ready backend/CLI batch, and
    produce implementation plus acceptance evidence. If no CLI item is
    dependency-ready, move to the next independent Web/cross-repository item
    while preserving every backend blocker and count.
  - The next independent Web qualification found a real keyless Preview
    runtime defect: a production-built local Preview server returned HTTP 500
    because Clerk was invoked without a publishable key before the existing
    callback allowance could run. Web PR #166 source `eab48ac` selects a plain
    `NextResponse.next()` path when the key is absent, passed the built
    runtime/public-route qualification, and merged to Web `main` as
    `ff0dd15`. Hosted GitGuardian, Vercel, Preview Comments, and
    typecheck/schema checks all passed.
  - The built Preview route sweep returned 200 for eight public routes;
    Chrome reported no homepage console errors; Lighthouse Accessibility,
    Best Practices, and SEO were 100 on desktop and mobile; the trace measured
    LCP 362 ms and CLS 0.00. The optional `llms.txt` checker still reports
    that bare URL lines are not Markdown links. This remains a FINAL-WEB-005
    truth/metadata follow-up, not an accepted checkbox. Human screen-reader,
    authenticated paid/org, large-data, complete-route, and field-CWV proof
    remain open.
  - The private runtime evidence and ledger reconciliation were committed as
    `a5152aa` and `737f318`. No production, database, payment, provider,
    deployment, or customer write occurred; the exact backlog remains
    **218 checked / 62 unchecked / 280 total (77.9%)**.
  - A current read-only production checkout recheck rendered UPI, Cards,
    Netbanking, Wallets, EMI, and Pay Later with no QR-only path and no console
    warnings/errors. Production did not identify itself as Test Mode; no click,
    order, payment, webhook, entitlement, database, provider, deployment, or
    account write occurred. This remains configuration/rendering observation,
    not payment lifecycle acceptance. Private reconciliation is `f4cfa2b`.
  - The latest built Preview sweep confirmed the merged middleware fix on the
    public surface, then exposed four remaining keyless-auth route failures:
    `/activate`, `/cli-auth`, `/account`, and `/orgs` returned HTTP 500 because
    those pages/data helpers call Clerk directly after middleware correctly
    bypasses Clerk without a Preview key. Web PR #167 (`12bfe68`) migrated the
    direct consumers to the request-auth seam and merged as `9841236c`; the
    built route sweep now returns expected redirects/401/405 with no 500s and
    Chrome reports no console messages. Production still preserves Clerk and
    fail-closed runtime validation. No production, database, payment, provider,
    deployment, or entitlement write occurred; QUAL-WEB-006 remains open for
    its broader authenticated, field-CWV, and final-truth criteria.
  - The exact count remains **218 checked / 62 unchecked / 280 total (77.9%)**
    until a current private-tracker reconciliation proves otherwise.
  - A manifest-driven keyless built-Preview sweep found one additional bounded
    runtime gap: the public receipt route returned HTTP 500 when no database was
    configured. Web PR #168 (`fb40f89`) now returns 503/no-store for the exact
    missing-`DATABASE_URL` case, preserves real database errors, passed hosted
    verification, and found no other unexpected route 500s. The three cron
    routes' explicit missing-secret 500 responses remain their existing service
    contract. QUAL-WEB-006 remains open for broader acceptance.
  - Web PR #167 and #168 are merged and hosted checks passed, but neither closes
    the broader QUAL-WEB-006 acceptance item. Authenticated paid/org behavior,
    field performance, accessibility, complete-route coverage, and final truth
    review are still required before that checkbox can move.
  - The latest CLI qualification pass found no open CLI PR and no dependency-
    ready CLI checkbox that could honestly be accepted from local code alone
    at that time. This is not a permanent assumption: recompute the live queue
    before the next batch and inspect every criterion again.
    The remaining CLI IDs are HUNT-008–011, PLAN-CLI-001–004,
    TEAM-CLI-001/002, STUDIO-CLI-001, ENT-CLI-001, LIC-002/003,
    DIST-001–003/006, QUAL-CLI-004, and QUAL-CLI-006. Their remaining proof
    is tied to trusted Hunt roots and recipe provenance, independent security
    review, hosted/provider activation, operational runner credentials,
    customer or organization authorization, legal/license disposition, trusted
    publishing identity, or other explicit external gates. Do not invent a
    code change merely to lower the count; inspect each criterion and move to
    the next independent item when a gate is not executable locally.
  - The backend qualification evidence at CLI `origin/main`
    `8bea4be2fa18533eafd088122be769e942965626` remains valid: configured tests,
    build, typecheck, lint, ordinary Hunt 45/45, pinned Docker adversarial
    60 pass / 1 explicit macOS namespace skip / 0 fail, package/public-boundary
    checks, packed manifests, and release-script tests 12/12. These results
    qualify the tested substrate; they do not satisfy the external gates listed
    above.
  - Production `vercel --prod` and a read-only live checkout probe showed a
    successful deployment/rendering path and all currently exposed hosted
    payment methods, but no order, charge, capture, webhook, entitlement,
    database, migration, provider, or account write occurred. Production
    rendering is not Test Mode lifecycle evidence.
  - Payment qualification must use Razorpay Test Mode with an isolated,
    non-production database and webhook destination. A production database URL,
    a direct Neon row edit, a founder-email allowlist, a clicked “check now”
    response, a live-looking QR, or a `$1` production price is not payment
    evidence. Changing `DATABASE_URL` does not recreate tables; the target
    database must be migrated and its migration history/schema verified before
    use. A changed Vercel variable is not active until the deployment using it
    is verified, and any exposed credential/token is treated as compromised,
    revoked, and replaced before further use.
  - Chrome DevTools on `127.0.0.1:9222` and Docker Desktop are available as
    bounded qualification instruments. They make testing possible but do not
    themselves prove authentication, sandbox isolation, payment lifecycle,
    production correctness, or backlog acceptance. Browser evidence must redact
    cookies, authorization headers, payment identifiers, database URLs, and
    personal data.
  - Founder consent to work on Verglos is not a substitute for repository-owner
    authorization, customer consent, legal approval, an independent Hunt
    reviewer, trusted publisher identity, or provider/account evidence when a
    backlog item explicitly requires those artifacts. Codex may prepare the
    implementation, tests, templates, and private evidence packet, but must
    leave the checkbox open until the required external artifact exists.
  - The next resume must begin by recomputing the private backlog and selecting
    the largest dependency-ready backend/CLI batch. If all remaining CLI items
    are externally gated, record the exact owner/evidence gap once and continue
    with the next independent Web or cross-repository item; do not repeat an
    unchanged full suite or wait idle for production access.
  - CLI PR #85 (`2efbf42`) merged as `80fa930` after final-head hosted
    platform, in-toto, and Verglos self-scan checks passed. It hardens
    credentials, score, and entitlement-capability cache writes with atomic
    replacement and private file modes, with focused 34/34 coverage plus local
    typecheck/build. This is implementation/qualification progress, not
    acceptance of any externally gated checkbox, and the score remains
    **218 checked / 62 unchecked / 280 total (77.9%)**.
  - CLI PR #86 (`cfb38c1`) merged as `fc452ba` after final-head hosted
    workflow `37822993184` passed all nine Ubuntu/macOS/Windows × Node 20/22/24
    cells and in-toto; hosted Verglos scan `37822993198` passed. It hardens
    ENT-CLI-001 replay-state persistence by restoring the parent directory to
    `0700` and using random exclusive temporary files while retaining `0600`
    replay files, fsync, atomic rename, and cleanup. Focused private-runner
    tests passed 5/5, and the complete CLI test runner, typecheck, and build
    passed locally. This remains implementation/qualification progress only:
    operational runner exchange, approved isolated execution/result
    reconciliation, and independent Hunt/security review are still open. No
    checkbox changed and the score remains **218 checked / 62 unchecked / 280
    total (77.9%)**. Private evidence is
    `docs/shipping/evidence/ent-cli-001-private-runner-replay-hardening-2026-10-08.md`.
  - After the CLI queue was refreshed, every remaining CLI checkbox was
    confirmed to have an external gate rather than a dependency-ready local
    implementation gap, so the next independent slice moved to Web payment
    runtime qualification. Exact Web `origin/main` was
    `cedf199855a5c4734122ae4849253156328cff1b`.
  - The Web payment/ledger/webhook focused run passed **31/31** against a
    disposable PostgreSQL 15 database migrated through all 38 ordered
    migrations. A separate fresh-database configured serial run passed
    **885/887 with 2 explicit skips and 0 failures**; typecheck, schema,
    migration ordering, 45-route build, and a local public route sweep also
    passed. The first serial attempt reused the migrated payment database and
    hit eight expected fixture table collisions; it was discarded and rerun
    cleanly.
  - This Web result is isolated code/runtime evidence only. It does not prove
    Razorpay account-enabled methods, real Test Mode success/capture/refund/
    renewal/cancellation/webhook behavior, credential rotation, or production
    reconciliation. No checkbox changed; the score remains **218 checked / 62
    unchecked / 280 total (77.9%)**. Private evidence is
    `docs/shipping/evidence/plan-web-014-current-main-local-qualification-2026-10-08.md`.
  - On 2026-10-09, the approved Chrome DevTools session was rechecked. The
    authenticated account tab remained stable with no console messages, and a
    separate read-only production checkout tab rendered UPI, Cards, Netbanking,
    Wallets, EMI, and Pay Later. Desktop/mobile Lighthouse Accessibility and
    Best Practices were 100/100; SEO was 80 because checkout lacks a meta
    description, and Agentic Browsing was 50 because `llms.txt` lacks the
    recommended H1. Production did not identify as Test Mode, so this remains
    browser/configuration evidence only. No order, payment, webhook,
    entitlement, database, provider, deployment, or account write occurred;
    no checkbox changed and the score remains **218 checked / 62 unchecked /
    280 total (77.9%)**. Private evidence is
    `docs/shipping/evidence/qual-web-006-plan-web-015-production-checkout-cdp-2026-10-09.md`.
  - The private tracker was reconciled through `7e9637d`, including the latest
    browser-refresh blocker and risk record. The tracker is clean, no public
    repository was changed by the private evidence updates, and no backlog
    checkbox was changed without acceptance evidence.
  - On 2026-10-09, CLI PR #87 (`0cbefab`) merged as
    `8bea4be2fa18533eafd088122be769e942965626` after all hosted platform,
    self-scan, and in-toto checks passed. The `DIST-006` rollback rehearsal now
    requires exactly one operation for each npm, engine, Hunt-feed, signing,
    and Web-deployment boundary and rejects incomplete/duplicate fixtures.
    Focused rollback tests passed **5/5**, package/release contracts passed
    **11/11**, and local typecheck/build/public-boundary checks passed. This is
    local rehearsal hardening only; no authenticated rollback/revocation or
    production/provider write occurred, so `DIST-006` remains unchecked and
    the score remains **218 checked / 62 unchecked / 280 total (77.9%)**.
    Private evidence is
    `docs/shipping/evidence/dist-006-rollback-boundary-completeness-2026-10-09.md`.

  COMPLETION STANDARD

  The goal is complete only when:

  - every required backlog item is genuinely accepted or explicitly blocked with an owner and reason;
  - all critical release gates pass;
  - CLI, Web, and cross-repository verification passes;
  - supported-runtime and platform qualification passes;
  - GitHub App/org integration is qualified;
  - every enabled payment method is qualified;
  - production migrations, data reconciliation, backup/restore, rollback, and recovery are qualified where required;
  - authorized POC and final repository-corpus evidence exists;
  - independent review requirements are satisfied;
  - false-positive and false-truth correction is complete against a held-out corpus;
  - backlog, traceability, execution ledger, status, truth registry, decisions, risks, and release gates agree with implementation;
  - unsupported public claims are removed or corrected;
  - final PRs, deployment procedures, release procedures, billing procedures, payment procedures, and rollback procedures are verified;
  - no marketing surface or npm release is changed prematurely.

  Do not mark the goal complete based on commit volume, green CI alone, preparatory code, a reduced subset of the backlog, public fixture scans, or a partial hosted
  deployment.

---

# Verglos V1 payment and qualification amendment — 2026-10-07

This amendment supersedes the earlier QR-only checkout emphasis in the active
Verglos V1 shipping objective. It adds scope; it does not relax any existing
security, privacy, evidence, release, production, or public/private boundary.

## Payment architecture decision

1. Replace QR-only checkout as the default customer path with a provider-hosted
   Razorpay Checkout/order flow that can expose every payment method actually
   enabled and approved for the Razorpay account.
2. The server-side catalog and provider capability configuration are
   authoritative. The UI must not promise cards, UPI, netbanking, wallets, or
   any other method unless the provider/account configuration enables it and
   runtime qualification proves it works.
3. QR may remain as an optional method only when it is explicitly enabled and
   separately qualified. It must not be the only payment path or the default
   qualification path.
4. The checkout must bind the displayed catalog snapshot, plan, cadence,
   currency, amount, entitlement period, user, and checkout ID. Client input
   must never choose or override price, entitlement duration, plan, or provider
   identity.
5. Provider success/capture and the signed webhook remain authoritative for
   entitlement. Polling is read-only and cannot grant access by itself.

## Required payment qualification

For every method that is enabled in the real provider account, qualify in
provider test mode and record private redacted evidence for:

- checkout creation and display;
- success and failure;
- authorization and capture;
- refund and partial/full refund behavior;
- renewal, cancellation, and expiry;
- webhook signature validation;
- duplicate delivery, replay, and out-of-order events;
- provider/API retry and timeout behavior;
- exactly-once payment ledger and entitlement/license behavior;
- tenant and organization binding;
- amount, currency, cadence, plan, and catalog-version binding.

If the provider test mode does not support a particular live-only method (for
example, QR or intent behavior), do not fake that result. Mark that method as
not testable in sandbox, qualify the supported provider-hosted method instead,
and retain the limitation for the release gate.

## Test-mode and production separation

- All payment qualification uses Razorpay test credentials and a non-production
  deployment/database.
- The test checkout must visibly identify itself as sandbox/test and must never
  render a live QR or live payment URL.
- Production must reject test keys and non-live runtime configuration.
- Preview/staging must not use production database credentials or production
  webhook destinations.
- Never change production prices to $1 as a substitute for sandbox testing.
- Never use a Neon console user, direct production row edit, or founder email
  allowlist as proof of payment.
- Internal founder/test access may use an explicit, private, preview-only
  allowlist or fixture, clearly labeled as entitlement testing rather than
  payment evidence.
- R-041 remains open until the exposed production database credential is
  rotated, the Vercel production secret is refreshed, deployments are
  redeployed, the old credential is revoked, and bounded read-only verification
  succeeds.

## Plan and organization truth

The current web implementation exposes a Pro QR purchase path; that is not
evidence that Team, Studio, or Enterprise billing is implemented. Do not claim
paid Team/Studio/Enterprise checkout until each plan has:

- a reviewed catalog/price/entitlement contract;
- organization ownership and tenant binding;
- provider customer/subscription/payment mapping;
- webhook lifecycle handling;
- authorization and quota behavior;
- browser/runtime evidence in a non-production test environment.

The existing product truth names Pro, Studio, and Enterprise; any Team naming
must be reconciled against the canonical catalog before implementation or public
copy changes.

## Current runtime finding

The 2026-10-07 authenticated browser probe reached
https://verglos.com/checkout?message=complete-payment and showed a Razorpay UPI
QR for INR 2,809.43 per month. The status endpoint returned HTTP 200 with
{"status":"pending"} after the user pressed “I've paid — check now”.
No payment, capture, webhook, entitlement, or Pro activation was observed.
This is live-looking QR behavior, not test-mode qualification. Do not scan it,
pay it, or record it as a successful payment.

## Implementation order

1. Build the provider-hosted, all-enabled-method checkout abstraction and
   server/catalog contract without changing production configuration.
2. Add focused route, signature, catalog-binding, webhook, ledger,
   idempotency, failure, refund, replay, and out-of-order tests.
3. Deploy/qualify only in a preview or staging environment with Razorpay test
   credentials and an isolated database.
4. Capture private browser/network/webhook evidence for each enabled method and
   each required lifecycle.
5. Reconcile the private backlog, traceability, risks, decisions, release gates,
   and execution ledger.
6. Only after R-041 closure and the full production preflight may production
   configuration, migration, deployment, or billing cutover be considered.
7. Keep public pricing/marketing frozen until the implementation and evidence
   support the claim.

## Acceptance rule

The payment gate remains open until the all-enabled-method matrix passes or each
unsupported method has an explicit owner, provider limitation, fallback,
evidence, and release decision. A pending QR, a clicked polling button, a
provider dashboard screenshot, a test fixture, or a green unit test alone is
not payment acceptance evidence.

---

# Session, tooling, deadline, and machine-load constraints — 2026-10-07

These constraints apply to the entire remaining shipping pass. They accelerate
execution without weakening any product, security, privacy, evidence, or
release requirement above.

## Runtime tooling availability

- The dedicated authenticated Chrome debug session is an approved qualification
  instrument. Before any browser/runtime batch, verify that Chrome DevTools MCP
  can list/select the Verglos page and that the local debugging endpoint is
  reachable on 127.0.0.1:9222. If the browser restarts, re-verify the page ID
  and authentication state before using it.
- Use Chrome DevTools for rendered behavior, network status, console errors,
  accessibility snapshots, and performance traces. Do not capture or record
  cookies, authorization headers, payment credentials, database URLs, private
  response bodies, or personal data. Redact payment identifiers in private
  evidence.
- Docker is expected to be available for bounded integration, webhook,
  PostgreSQL, sandbox, and adversarial qualification. Verify Docker health before
  starting a Docker batch; do not assume a previous daemon or container is still
  valid.
- Browser and Docker availability are execution prerequisites, not acceptance
  evidence by themselves. Runtime claims still require the exact test output,
  route/fixture scope, version, and limitation record.

## Twenty-four-hour shipping window

- The remaining implementation and qualification pass is timeboxed to the next
  24 hours of active work. Maintain a live critical path and the next three
  independent batches; run CLI, Web, browser, and Docker work in parallel only
  when their resources and write boundaries are disjoint.
- Prioritize, in order: security blockers and production safety; dependency-ready
  CLI/backend unchecked items; cross-repository contracts needed by those items;
  CLI release gates and supported-runtime/adversarial qualification; then final
  Web truth, payment/browser/runtime qualification; then corpus/POC and go/no-go.
- Do not spend the window on marketing polish, speculative abstractions, or
  repeated unchanged suites. Keep public pricing, marketing, npm publication,
  and launch operations frozen until the completion standard passes.
- The deadline does not authorize skipped tests, fabricated provider/customer
  evidence, unreviewed production changes, unsafe credential use, or a reduced
  definition of complete. If the window ends with gates open, report the exact
  open gates, evidence missing, owner, and next action; leave the goal active.

## Machine-load budget

- Prefer focused tests during implementation and one required full suite per
  completed phase. Do not rerun unchanged full suites merely to fill time.
- Bound Docker resources, worker concurrency, repository size, browser trace
  duration, polling intervals, and log/output volume. Reuse existing images,
  caches, and worktrees when safe.
- Avoid simultaneous CPU- or memory-heavy builds, full Web and CLI suites,
  Docker databases, browser traces, and corpus scans. Schedule heavy batches or
  run independent lightweight checks in parallel.
- Stop only the exact runaway test, container, process, or trace you started;
  never use broad destructive cleanup against the workspace or user data.
- Record skips caused by resource limits separately from product failures. A
  resource-limited skip is not acceptance evidence and cannot close a gate.

## Resume rule

Use this complete file as the operative goal for the resumed session. Start each
fat batch by recording its backlog IDs, acceptance evidence, repository/write
boundary, browser/Docker requirement, machine-load plan, and production-state
status. Begin with the live backend/CLI queue and keep the exact score visible
after every substantial batch. Continue independent code and evidence work when
production access or provider state is blocked; do not wait idly for external
state. Only move the main path to Web finalization after the executable CLI
queue is exhausted or every remaining CLI item has a documented external owner,
evidence gap, and release decision.

## Whole-backlog shipping target and founder-supplied final POC

- The primary execution target is the whole authoritative backlog and complete
  product shipping path within 24 hours maximum, with a three-hour target for
  implementation and qualification wherever the current evidence and hosted
  dependencies allow. The three-hour target is aspirational; the 24-hour target
  is the hard operating window. Neither permits skipped gates or invented proof.
- Do not spend the critical path sourcing, selecting, cloning, or deeply
  analyzing the final company-shaped repository corpus now. The founder will
  provide the final live/authorized repositories and POC inputs. Prepare the
  product, contracts, harnesses, fixtures, evidence templates, and acceptance
  gates so that the supplied corpus can be run immediately afterward.
- Final POC acceptance remains required after the shipping candidate is frozen:
  it must cover the founder-supplied company/use-case shapes and the revenue
  journey from pre-revenue/₹0 through approximately ₹1 crore, ₹10 crore, ₹50
  crore, and ₹100 crore annual-revenue scenarios. Revenue is a scenario axis,
  not a fabricated customer or traction claim.
- The supplied POC must exercise every canonical plan in the verified catalog
  after plan-name reconciliation. A plan counts only when its entitlements,
  limits, organization roles, payment/billing state, CLI behavior, Web behavior,
  upgrade/downgrade, denial, and audit evidence are exercised.
- When the founder supplies the corpus, record exact repository authorization,
  commit, license, plan, revenue-band scenario, configuration, runtime,
  findings, resource use, reproducibility, adjudication, and limitations
  privately. Do not put repository contents, customer data, credentials, or
  competitive intelligence in public repositories or PRs.
- Shipping is not complete until every backlog item is accepted or has an
  explicit owner, reason, evidence gap, and release decision. If the 24-hour
  window expires before that condition is true, keep the goal open and report
  the exact gap; do not redefine whole shipping as a partial launch.

Primary provider references:
- https://razorpay.com/docs/server-integration/python/test-app/
- https://razorpay.com/docs/payments/payment-gateway/ecommerce-plugins/integration-steps/
- https://razorpay.com/docs/api/qr-codes/gst/fetch-payments/
