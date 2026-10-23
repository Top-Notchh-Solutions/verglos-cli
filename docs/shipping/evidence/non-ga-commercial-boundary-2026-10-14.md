# Non-GA commercial boundary audit — 2026-10-14

## Scope

This evidence covers only the non-commit policy gate:

> Do not claim Team/Studio/Enterprise generally available until their
> end-to-end gates pass.

It does not qualify, activate, price, publish, or release any of those tiers.
The Hunt AppSec gate remains independent and open.

## Exact sources

- Public CLI `origin/main`:
  `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`
- Public Web `origin/main`:
  `a54d70dfacfaf9506b1336b788d9cd86c9ca74d7`

Both refs were read directly from their local Git objects. No working-tree
changes, deployment, provider operation, checkout, npm operation, or browser
operation was used for this audit.

## Reproducible checks

From the CLI repository:

```text
git grep -ni -E 'generally available|available now|\bGA\b' origin/main
```

Result: zero matches across tracked files.

From the Web repository:

```text
git grep -ni -E 'generally available|available now|\bGA\b' origin/main
```

Result: zero matches across tracked files.

The exact source also records the required maturity boundary:

- CLI plan limits mark Free and Pro `live`; Team, Studio, and Enterprise are
  `roadmap`.
- Web’s canonical plan catalog marks Team and Studio `inactive` and
  non-purchasable, and Enterprise `contracted` and non-purchasable; their
  prices are not verified.
- Web’s billing surface refuses checkout for a non-purchasable plan and says
  its price is not approved for purchase.
- Web’s truth-registry contract removes a price for an unverified or
  non-purchasable plan, corrects unqualified preview claims, and removes
  claims about capabilities that are not shipped.

The corresponding source-level tests are present at the exact Web ref:
`src/lib/entitlement/capabilities.test.ts` and
`src/lib/truth-registry/public-claim-registry.test.ts`. This record does not
claim that those tests qualify the commercial tiers; it records the static
boundary and the exact public-ref audit only.

## Acceptance decision

The policy row is complete because the current tracked public surfaces contain
no general-availability claim and the canonical catalog/truth registry
fail-closed for the unqualified, unverified, or non-shipped states covered by
the row. The row is checked in the private backlog only.

This does not check any Team, Studio, Enterprise, Hunt, AppSec, legal,
provider, customer, field, final-acceptance, npm-release, or GA-release row.
