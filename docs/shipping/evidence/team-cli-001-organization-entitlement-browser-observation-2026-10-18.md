# TEAM-CLI-001 organization entitlement browser observation — 2026-10-18

## Scope

This is a read-only observation from the already-authenticated Verglos Chrome
page 3. It uses the existing `Top Notchh Solutions` organization session and
does not open a window or tab, submit checkout, change billing, publish a
policy, or modify a project. The page was restored to `https://verglos.com/account`
after the observation.

## Organization and billing result

The organization route identified `Top Notchh Solutions` and role `Owner`.
The Billing page showed:

- effective plan: `free`;
- license state: `no active paid license`;
- entitlement expiry: `No recorded expiry`;
- new purchase state: `not purchasable`;
- catalog price evidence: `verified`, with no checkout offered;
- seats: `1 / 1`;
- hosted records: `Allowance is not configured; this is not unlimited`;
- no provider subscription ledger row and no provider payment rows.

This is direct hosted entitlement evidence. It explains why a valid personal
license read-back cannot be treated as a Team organization policy entitlement.

## Organization project and policy result

The Applications page showed two active Preview projects:

1. `Verglos SCM Qualification` / `verglos-scm-qualification-20261018`, bound
   to `https://github.com/Top-Notchh-Solutions/verglos-archive`;
2. `Verglos Web` / `verglos-web`, bound to
   `https://github.com/anuragyadav-git/verglos-web`.

The Policy page rendered the policy lifecycle contract but did not display a
policy version/list in the authenticated view. This observation therefore
does not claim that the previously published policy row is absent from the
database; it proves only that the current owner UI does not provide a visible
published-policy acceptance artifact in this session.

## Acceptance disposition

`TEAM-CLI-001` remains unchecked. The missing row-specific artifact is a
valid mapped paid/non-production entitlement for the organization, followed
by authenticated CLI signed fetch, visible digest, atomic cache, offline-TTL,
expiry, cross-tenant denial, and provider reconciliation evidence. Owner
authorization does not convert the displayed Free plan or unconfigured
allowance into a paid entitlement. No AppSec dependency is involved in this
boundary.

No Production billing or payment state changed. No public repository changed.
Evidence is private and contains no secrets, cookies, license keys, or
customer source.
