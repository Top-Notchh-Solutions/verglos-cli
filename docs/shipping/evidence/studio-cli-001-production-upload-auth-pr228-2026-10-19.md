# STUDIO-CLI-001 production upload authorization evidence — 2026-10-19

## Scope

This evidence records the original production path that connects the shipped
CLI client-projection upload to the hosted Web authorization and tenant
boundary. It does not qualify a paid allowance, a customer recipient, or the
independent Hunt/AppSec review.

## Implementation identity

- Repository: `https://github.com/anuragyadav-git/verglos-web`
- PR: `#228`
- Implementation commit: `3cc4e077850f3e19794549906ec3c3fce7a6feea`
- Regression commit: `7f5556ee14af265f754d30f41ab75f53b01a98cc`
- Normal merge commit: `f321695c385dc5427696f1187b73cf033c400b26`
- Merge mode: regular merge, no squash; both commits are first-parent merge
  ancestors of `origin/main`.

## Original logic verified

- CLI upload requests carrying `Authorization: Bearer ...` now resolve through
  the active license bearer lookup and the exact active organization owner.
- The upload route accepts the stable external organization/project identifiers
  emitted by the CLI, resolves them to internal records, and returns only a
  tenant/project-scoped database surface.
- The organization owner check and the requested `publish_record` action run
  before body admission, usage reservation, or custody persistence.
- Browser dashboard requests without a bearer preserve the existing UUID-only
  Clerk path; malformed bearer requests do not fall through to that path.
- Unknown, inactive, cross-tenant, malformed, and unavailable authorization
  states remain bounded denials or a fixed 503; raw exception details are not
  returned.

## Verification

Local verification in the isolated Web worktree:

- `pnpm test`: **897 passed / 24 skipped / 0 failed**.
- `pnpm typecheck`: passed.
- `pnpm build`: passed; **49/49** static pages generated.
- `git diff --check`: passed before both commits.
- Local runtime warning: the worktree used Node `v26.4.0` and pnpm
  `10.34.5`; the package requests Node `22.x`. Hosted CI supplied the
  supported-runtime check.

Hosted PR verification:

- Workflow run `39253319662`: macOS, Ubuntu, and Windows protocol/client
  jobs passed; isolated PostgreSQL runner passed; GitGuardian passed.
- Workflow run `39253319842`: `typecheck-and-schema` passed.
- Vercel preview deployment and Preview Comments passed.
- No production promotion or customer-source upload was performed as part of
  this qualification.

## Disposition

This is substantive original-logic implementation and hosted CI evidence.
`STUDIO-CLI-001` remains unchecked because its contract still requires a real
numeric paid/non-production hosted allowance and authorized Studio
recipient/customer acceptance. AppSec/Hunt state is unchanged. The private
score remains **239 checked / 41 open / 280 total (85.4%)**.
