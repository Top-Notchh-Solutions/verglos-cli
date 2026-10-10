# PLAN-CLI-004 plan/catalog compatibility acceptance

Date: 2026-10-10 IST  
Repository: private shipping ledger (`local/private-shipping-ledger`)  
Scope: CLI/server entitlement compatibility and old-token behavior

## Acceptance trace

The CLI compatibility contract is now complete for the supported server-shaped
catalog and token paths:

- Free, Pro, Team, Studio, and Enterprise catalog fixtures preserve opaque
  capability and allowance keys without recreating a client-side plan map;
- malformed, unknown-plan, future-dated, over-age, identity-mismatched, and
  unbound caches fail closed to Free;
- a signed v2 catalog token is the only paid offline fallback and is bound to
  the license key, tenant, catalog, capability list, allowances, and expiry;
- a legacy v1 token remains usable for the documented activation fallback when
  v2 issuance is unavailable, but a legacy tier-only token cannot grant paid
  capabilities offline; and
- the current isolated Preview activation trace proves the deployed server
  v2 issue→verify path for an authorized Pro tenant, including key binding and
  catalog projection.

No production signer, Production credential, database, payment, entitlement,
publish, or release write was needed for this compatibility acceptance. R-041
credential containment and protected release activation remain separate
release gates.

## Verification

- entitlement/catalog compatibility tests: **15/15**;
- focused CLI entitlement/whoami tests: **28/28**;
- machine-output process suite, including legacy activation fallback:
  **30/30**;
- full CLI test suite: passed;
- CLI typecheck and build: passed;
- hosted platform matrix, self-scan, and in-toto binding for the reviewed
  compatibility commits: passed at runs `37550255842`/`37550255844`; and
- current isolated Preview v2 issue→verify evidence: passed as recorded in
  `docs/shipping/evidence/plan-cli-001-preview-v2-issue-verify-2026-10-10.md`.

The hosted runs are existing evidence for the reviewed merged heads; no new
hosted run at this private branch head is claimed.

## Disposition

`PLAN-CLI-004` is accepted and checked. R-041, provider lifecycle, Production
activation, legal/release review, and the remaining external gates are not
silently closed by this compatibility result.
