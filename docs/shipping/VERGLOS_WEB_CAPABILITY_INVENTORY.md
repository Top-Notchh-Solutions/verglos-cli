# Verglos hosted capability inventory

Status: current implementation evidence for `TRUTH-002`

Reviewed: 2026-09-08

Web behavior baseline: `5044e77`

Scope: `verglos-web` routes, libraries, schema, authentication, operational jobs, account surfaces, and production dependencies. Homepage, campaign, landing-page, and blog changes remain explicitly out of scope.

This inventory records code that exists. A route, table, or UI label is not by itself proof that the full workflow is safe, deployed, configured, or exercised in production. End-to-end claims remain `partial` until the corresponding release gates have evidence.

## Runtime and dependency boundary

- Next.js `15.3.3`, React `19.1.0`, TypeScript `5.8.3`, Node `22.x`, pnpm `10.34.5`.
- Clerk provides browser identity and middleware protection.
- Neon Postgres plus Drizzle ORM/Kit provide hosted persistence.
- Razorpay provides the current Pro QR-payment path.
- `jose` signs/verifies legacy unlock JWTs; the web app also issues Ed25519 entitlement JWTs when a private key is configured.
- Zod validates selected public API payloads.
- Resend is called through raw HTTP for email; OSV is called through raw HTTP for advisory monitoring.
- GitHub Actions is the checked-in hourly monitor trigger; comments also refer to an externally configured cron-job.org fallback that this repository cannot prove.
- `@verglos/shared` and `@verglos/reporter` imports resolve to vendored source copies under `src/vendor`, not to installed CLI workspace packages. Cross-repository drift is therefore possible.

There is no test runner or test script in `package.json`, and no runnable application test files are present. The lockfile mentions Playwright only as an optional/transitive peer; the project does not declare or configure it.

## Route protection boundary

`src/middleware.ts` treats the marketing/docs pages, login/checkout/activate, license endpoints, telemetry, monitoring, cron, CLI-auth start/status, entitlement capabilities, verification pages, and attestation API as public at the Clerk layer. Those API routes are expected to apply their own bearer/signature controls.

- `/account/*`, `/reports/*`, `/cli-auth`, and `/api/v1/cli-auth/authorize` are Clerk-protected when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is configured.
- If that environment variable is absent, middleware returns without protecting any route. This is a fail-open configuration mode and must be prohibited by deployment gates.
- Monitor, score-history, attestation, and selected license routes accept the raw license key as a bearer credential.
- Public telemetry accepts an optional raw license bearer to associate score history and activations.

## API route inventory

The app contains 20 API route files and 21 HTTP handlers (telemetry exposes both `GET` and `POST`).

| Route | Auth boundary | Current behavior | State | Evidence |
|---|---|---|---|---|
| `POST /api/heartbeat` | raw license key in JSON | inserts a heartbeat for any matching license; returns `{ok:true}` for parse/DB errors | partial legacy endpoint | `verglos-web/src/app/api/heartbeat/route.ts` |
| `POST /api/license/unlock` | raw license key in JSON | enforces active/expiry, two projects and five machines/day except founder; issues 1-hour HS256 unlock JWT | shipped legacy flow with security/config debt | `api/license/unlock/route.ts`, `lib/auth/jwt.ts` |
| `POST /api/razorpay/create-qr` | Clerk session | creates single-use UPI QR for env-selected monthly/annual Pro amount/duration | partial commercial integration | `api/razorpay/create-qr/route.ts` |
| `GET /api/razorpay/qr-status` | Clerk session | polls Razorpay and issues/extends one Pro license on observed payment | partial commercial integration | `api/razorpay/qr-status/route.ts` |
| `POST /api/webhooks/razorpay` | Razorpay signature when secret configured | issues/extends Pro license on QR/subscription events; attempts subscription deactivation | partial; missing-secret and subscription-link gaps | `api/webhooks/razorpay/route.ts` |
| `POST /api/v1/cli-auth/start` | public | creates 15-minute device/user code pair | shipped route, untested | `api/v1/cli-auth/start/route.ts` |
| `GET /api/v1/cli-auth/status` | opaque device code | returns pending/authorized/expired and the raw license key on authorization | shipped route, untested | `api/v1/cli-auth/status/route.ts` |
| `POST /api/v1/cli-auth/authorize` | Clerk session | binds an active existing license to a device code; founder identity may auto-provision | partial paid-login flow | `api/v1/cli-auth/authorize/route.ts` |
| `POST /api/v1/license/validate` | public license key body | checksum/DB/active validation and optional Ed25519 entitlement JWT issuance | shipped route, untested | `api/v1/license/validate/route.ts` |
| `GET /api/v1/license/status` | raw license key or unlock JWT bearer | returns owner email, full license key, plan, expiry, active state, activations | shipped route, untested | `api/v1/license/status/route.ts` |
| `GET /api/v1/entitlement/capabilities` | optional raw key/unlock JWT | anonymous Free response or active plan capabilities; founder-only plan simulation | shipped route with vocabulary drift | `api/v1/entitlement/capabilities/route.ts` |
| `POST /api/v1/entitlement/token` | raw license key bearer | renews Ed25519 entitlement JWT when signing key exists | partial deployment-dependent route | `api/v1/entitlement/token/route.ts` |
| `POST /api/v1/telemetry/scan` | public; optional raw license bearer | stores scan event; paid bearer also writes score history and activation | shipped ingestion route with privacy/abuse debt | `api/v1/telemetry/scan/route.ts` |
| `GET /api/v1/telemetry/scan` | public | liveness response | shipped | same route |
| `POST /api/v1/monitor/register` | active paid raw license bearer | validates/upserts fingerprint, label, up to 5,000 npm deps, and alert channels | partial monitoring workflow | `api/v1/monitor/register/route.ts` |
| `GET /api/v1/monitor/registrations` | active paid raw license bearer | lists caller-owned registrations and recent alert count | partial monitoring workflow | `api/v1/monitor/registrations/route.ts` |
| `DELETE /api/v1/monitor/registration/:fingerprint` | active paid raw license bearer | deletes caller-owned registration and cascades dispatch history | partial monitoring workflow | `api/v1/monitor/registration/[fingerprint]/route.ts` |
| `POST /api/v1/monitor/test-alert` | active paid raw license bearer | immediately attempts configured channels and inserts canary dispatch row | partial; repeat-canary conflict | `api/v1/monitor/test-alert/route.ts` |
| `GET /api/v1/score-history` | active paid raw license bearer | returns license-scoped history capped at 30/365/1095 days | partial hosted history | `api/v1/score-history/route.ts` |
| `GET /api/cron/monitor` | exact `CRON_SECRET` bearer | sequentially queries OSV for every active registration and dispatches unseen tuples | partial operational job | `api/cron/monitor/route.ts` |
| `POST /api/v1/attest` | active license with `attest` capability | stores caller-supplied summary under a random public hash and returns URL | partial unsigned publication endpoint | `api/v1/attest/route.ts` |

## Authentication, license, and entitlement truth

| Area | Current truth | Evidence | State |
|---|---|---|---|
| browser auth | Clerk session through middleware and server helpers | `src/middleware.ts`, account loaders | shipped dependency integration |
| CLI device auth | public start/status plus Clerk-protected authorize; authorized response exposes license key to holder of device code | `src/lib/cli-auth.ts`, route trio | partial, no abuse/rate-limit tests |
| license key | HMAC-checksummed `vg_` key; raw value stored in Postgres and returned by status/device auth | `src/lib/license.ts`, `licenses` table | partial secret-management model |
| unlock token | HS256 JWT embeds raw license key and fingerprint for one hour | `src/lib/auth/jwt.ts` | shipped legacy primitive |
| entitlement token | Ed25519 JWT contains license-key hash, tier, and feature strings | `src/lib/entitlement/sign.ts` | partial; disabled when private key absent |
| plans | `free | pro | studio | compliance | founder`; unknown becomes Free | `src/lib/entitlement/capabilities.ts` | non-canonical; no Team/Enterprise vocabulary |
| paid check | Pro, Studio, Compliance, and Founder all satisfy generic paid monitoring gates | same file | shipped current fence, target unresolved |
| super admin | configured Clerk IDs/emails are auto-issued unlimited Founder license | `src/lib/license.ts` | internal behavior |

Current security/configuration gaps that later tasks must close:

- Unlock JWT signing falls back to the literal `dev-secret-change-in-production` if `JWT_SECRET` is absent.
- Middleware protection fails open when the Clerk publishable key is absent.
- Raw license keys are bearer credentials across multiple public-at-middleware routes and are stored unencrypted in the database.
- CLI auth codes have no sweeper or rate limiting; expiry is logical only.
- Razorpay signature comparison uses ordinary string equality rather than a timing-safe comparison.
- A missing Razorpay webhook secret returns success and silently drops the event.
- Subscription webhook issuance does not persist `razorpaySubscriptionId`, so later cancellation lookup cannot reliably deactivate the issued license.

## Persistence inventory

The Drizzle schema declares 12 tables.

| Table | Current contents/use | Material constraints/gaps |
|---|---|---|
| `users` | Clerk ID and email | one Clerk ID; email stored directly |
| `licenses` | one license per user, raw key, plan, Razorpay identifiers, expiry/active | free-text plan; raw secret; one license per user |
| `activations` | fingerprint, optional machine/project name, last seen | no unique `(license,fingerprint)` constraint; lookup-then-insert can race |
| `reports` | full findings JSON plus score/project | no current ingestion API identified; authorization edge case on read route |
| `heartbeats` | machine/fingerprint event rows | no retention/sweeper; public endpoint accepts inactive license |
| `cli_auth_codes` | device/user codes, Clerk/license binding, expiry/consumption | no retention/sweeper or attempt counter |
| `monitor_registrations` | full dependency JSON and destination channel data | up to 5,000 deps; webhook URLs/addresses stored in plain JSON |
| `alert_dispatches` | advisory/canary attempts and per-channel results | unique tuple does not exclude canaries and records failed deliveries as deduped |
| `score_history` | license/project score, critical/high counts, CLI version | no event ID/dedup or retention enforcement |
| `scan_events` | telemetry counts/version/platform/fingerprint | schema does not store accepted `project_name`; no retention or rate limit |
| `attestations` | caller-supplied score/count summary and random URL hash | no report digest, signature, signer, policy, verification, or evidence binding |
| `attestation_verifications` | public hash plus daily salted IP digest | default public salt if env absent; no retention enforcement |

Only migrations `0000` through `0004` are checked in. They alter/backfill licenses and create scan events, CLI auth, Pro backing tables, and attestation tables. They do not establish a clean-database migration for the initial users/licenses/activations/reports/heartbeats tables in this repository, so reproducible bootstrap is not proven.

## Monitoring and alert delivery truth

The checked-in GitHub Actions workflow calls the cron endpoint hourly at minute 5 with a secret. The route loads every active registration sequentially, sends one OSV `querybatch` of up to 5,000 packages per registration, and then attempts email, Slack, and generic webhook delivery concurrently for each returned advisory.

Current operational limitations:

1. There is no durable queue, outbox, lease, attempt counter, retry schedule, dead-letter state, or reconciliation worker.
2. Fetches to OSV, Resend, Slack, and generic webhooks have no explicit timeout.
3. Every OSV finding, including medium and low, is sent immediately. The CLI statement that medium/low findings are batched into a Sunday digest has no matching implementation.
4. A dispatch row is inserted even when every configured channel fails or skips. The unique advisory tuple then suppresses the next cron, so transient delivery failures are not retried despite source comments claiming they are.
5. Concurrent schedulers can both pass the pre-dispatch lookup and both send the same alert before one insert loses the unique-index race. The database prevents duplicate rows, not duplicate delivery.
6. The unique index is `(registration_id, cve_id, package_name)` without a partial `is_canary=false` predicate. A second fixed canary for the same registration can fail insertion.
7. The generic webhook validator requires HTTPS but does not block loopback, link-local, private-network, redirect, or DNS-rebinding targets; dispatch therefore has an SSRF boundary.
8. Dedup ignores package version and advisory updates, so a changed advisory or newly affected version may remain suppressed forever.
9. Deleting a registration cascades its complete alert history.

These limitations keep monitoring `partial` until the operations, security, and retention gates pass.

## Telemetry and score-history truth

The public telemetry route accepts the CLI fields inventoried in `VERGLOS_CLI_CAPABILITY_INVENTORY.md`. It stores all accepted fields except `project_name` in `scan_events`. When a valid paid license bearer and fingerprint are present, it also:

- appends `score_history` when a score exists; and
- updates or inserts an `activation`, including the accepted project name.

The endpoint always returns `204`, including schema and database failures. `event_id` deduplicates only `scan_events`; retrying after scan-event success but before the two paid writes can skip the first table while still append another score row. There is no IP/license rate limit, retention policy enforcement, deletion workflow, or operational failure signal in this code.

Account history windows are 30 days for Pro, 365 for Studio, and 1095 for Compliance/Founder. The API returns rows sorted oldest-to-newest even though its comment says most recent first.

## Account and hosted UI inventory

| Route | Data/behavior | State |
|---|---|---|
| `/account` | Clerk identity, license/paywall, score/project summary, registrations, activations, recent alerts | partial Pro dashboard |
| `/account/monitoring` | license-scoped registrations | partial |
| `/account/alerts` | up to 200 license-scoped dispatch rows from last 14 days | partial |
| `/account/history` | license-scoped per-project score series within plan window | partial |
| `/account/history/:fingerprint` | one license-scoped project series | partial |
| `/account/activations` | fingerprints/project names using the license | partial |
| `/account/dashboard` | redirects to `/account` | compatibility redirect |
| `/account/docs` | redirects to `/docs` | compatibility redirect |
| `/activate` | shows active license key or redirects to checkout | partial hosted activation |
| `/cli-auth` | Clerk-authenticated device-code confirmation | partial hosted login |
| `/reports/:id` | renders stored findings in vendored HTML reporter | partial legacy report viewer with authorization gap |
| `/verify/:hash` | public caller-supplied attestation summary; writes IP-derived view ledger | partial unsigned summary page |
| `/verify` | public aggregate counts and recent summaries | partial public ledger UI |

The total 22-page surface also includes homepage, checkout, login, detectors, and public docs. Those pages are not modified by this audit; marketing and landing changes remain held until the final founder command.

## Attestation and public verification truth

The hosted attestation route does not accept or verify a CLI report, `.vgl` record, subject digest, signature, signer identity, policy decision, imported evidence, or Hunt result. It trusts a Studio-capability bearer to submit a score, four counts, fingerprint, optional name, and CLI version. It then creates a random 72-bit URL identifier and stores the supplied fields.

The current CLI `verglos attest` is a shell and does not call this endpoint. Therefore the checked-in CLI-to-hosted attestation journey is not functional.

The public `/verify/:hash` page proves only that a matching database row exists and renders consistently. The random hash is an identifier, not a digest or signature. Current page language such as “verified attestation,” “independently verifiable evidence,” “was scanned by Verglos,” and “no way to fake the number” is not supported by cryptographic evidence and must not be carried into the final V1 contract.

Verification views store a daily-salted IP hash, with a hard-coded fallback salt. The same visitor can be counted again on another UTC day. This is a view ledger, not signature verification.

## Report truth and authorization gap

The `reports` table can hold full findings JSON, but this repository exposes no report-ingestion handler. `/reports/:id` requires a Clerk session, then looks up the report by UUID. Its ownership condition is:

`!report || (dbUser && report.userId !== dbUser.id)`

If an authenticated Clerk user has no corresponding `users` row, `dbUser` is null and the ownership mismatch check is skipped. A guessed/obtained report UUID can therefore render. This route must be treated as a security blocker until an explicit owner/license predicate is enforced and tested.

The reconstructed `ScanResult` sets all severity counts to zero and does not set `testFileFindings.included`, so rendered hosted report metadata can differ from the stored findings and current shared contract.

## Existing verification evidence

- `pnpm typecheck` and `pnpm build` were previously reported passing for the current branch; `TRUTH-013` will rerun and record the exact baseline.
- There are zero application tests, zero API integration tests, zero authorization tests, zero database migration tests, zero webhook/cron tests, and zero browser journeys.
- Deployment state, environment completeness, actual scheduler configuration, Clerk/Razorpay/Neon/Resend production health, and data contents are not proven by repository inspection.

## Truth corrections raised by this inventory

1. Hosted capability presence is substantial but almost entirely untested.
2. Current web plans are `Free/Pro/Studio/Compliance/Founder`, not the final `Free/Pro/Team/Studio/Enterprise` contract.
3. Current payment code issues only Pro and uses environment amounts/durations with one-rupee fallbacks; displayed USD pricing does not prove charged pricing.
4. Device login is an active-paid-license acquisition flow, not general Free account authentication.
5. Monitoring is hourly in checked-in automation, while capability names and some copy say daily.
6. Medium/low monitoring digest behavior is not implemented.
7. Failed deliveries are not retried, and concurrent triggers can duplicate delivery.
8. Generic webhook delivery has an SSRF boundary.
9. Telemetry is public, rate-unlimited, fail-silent, and can associate a project name/fingerprint with a paid license.
10. No storage retention, deletion, regional, encryption, backup, or recovery contract is implemented in code.
11. The reports table has no identified ingestion route and the report reader has an authorization edge case.
12. Hosted attestation is an unsigned caller assertion; current CLI Attest cannot publish it.
13. Public verification is a random-hash database lookup plus view counter, not offline or cryptographic verification.
14. Vendor copies of CLI shared/reporter code can drift from the CLI repository.
15. Clean-database migration completeness is not proven.

These findings feed `TRUTH-003`, `TRUTH-004`, `TRUTH-007`, `TRUTH-008`, `TRUTH-011`, `TRUTH-012`, `TRUTH-013`, hosted operations, authorization, record, and acceptance tasks. No web runtime, landing page, or blog behavior changed in this inventory.
