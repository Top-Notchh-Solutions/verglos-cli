# ENT-CLI-001 private-runner hosted transport · 2026-10-08

## Delivered

The Web and CLI transport substrate is merged after independent repository
checks:

- Web PR #158, source head `7b3cea6`, merged as `d5c91df3a78dfdab29cb6150864de2fd761db1aa`.
- CLI PR #81, source head `63fb714`, merged as `111d3aad9ddd89285c24aaec142aa71a72e22905`.

The Web side adds tenant-scoped private-runner enrollment, bounded management
job issuance, signed short-lived outbound polling, source-free result
reconciliation, and additive migration `0037_private_runner_transport`.
The CLI side adds bounded `verglos runner upload-result`, authenticated result
projection upload, request/response limits, timeout handling, and malformed
projection rejection before network access.

The hosted schema retains runner/job/result metadata only. It has no command,
source, or raw-output field. The enrollment route uses the authorized scoped
database and tenant helpers; it does not construct an unscoped database
client.

## Verification

- Web private-runner and transport contracts: **24/24**.
- Web tenant/access audit slice including the new organization route: **38/38**.
- Web typecheck: pass.
- Web Drizzle schema check: pass.
- Web migration ordering: pass, **38** ordered migrations.
- Web production build: pass, **45** generated static pages and the new
  private-runner routes compiled.
- CLI private-runner client tests: **5/5**.
- CLI hosted platform matrix: **9/9** Ubuntu/macOS/Windows × Node 20/22/24.
- CLI hosted self-scan: pass.
- CLI hosted in-toto release binding: pass.
- Web hosted type/schema, build, public-boundary, dependency/license,
  tracked-secret, GitGuardian, and Vercel checks: pass.

No production migration, database write, payment/provider call, entitlement
write, or deployment was performed for this batch. The Web migration remains
unapplied pending the normal isolated non-production migration gate.

## Disposition

This is implementation and repository qualification evidence only. It does
not close `ENT-CLI-001`. The following remain required:

- operational runner enrollment/credential exchange and an approved isolated
  non-production end-to-end job/result run;
- bounded private recipe execution and durable result reconciliation evidence;
- independent Hunt sandbox/security review and signed residual-risk decision;
- customer/enterprise acceptance where applicable.

Backlog remains **218 checked / 62 unchecked / 280 total (77.9%)**.
