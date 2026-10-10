# Top-backlog queue transition — 2026-10-10

## Scope

This private record documents the first queue transition after the
`PLAN-WEB-014` Razorpay provider block. It does not close a checkbox and does
not change the backlog score.

## First unchecked item: HUNT-008

The fixed A1 `utf8-contains` recipe/catalog and positive, negative, timeout,
and adapter-failure fixture contracts are already recorded. Current CLI head
is `d0a3b21724bf1ee1763e183cb165c2f979e62a81`. The remaining acceptance
artifacts are not code-only:

- authenticated recipe publisher root and provenance/license record;
- supported-rule/content authorization and command/approval qualification;
- independent AppSec qualification of the execution boundary.

The public CLI tree does not itself supply those private publisher, legal, or
independent-review artifacts. HUNT-008 is therefore parked unchecked with
owner product/release qualification plus legal/content and independent AppSec
review, review date 2026-10-11 IST, and release decision to keep Hunt
release-disabled until the artifacts exist. HUNT-009 through HUNT-011 remain
downstream.

## Next dependency-ready item: PLAN-CLI-001

The CLI capability/allowance consumption and offline-safe fallback code is
implemented and tested. Its acceptance requires a deployed integration trace
that issues a v2 entitlement token for an authorized tenant, verifies it with
the pinned CLI key, and proves the catalog/capability/allowance projection.

`PLAN-CLI-001` is now the single active item. The next bounded action is a
read-only/deployment-scoped activation preflight; no Production entitlement,
account, or customer-data write is authorized by this transition.

## Score

The live backlog remains **219 checked / 61 unchecked / 280 total (78.2%)**.
No checkbox changed.
