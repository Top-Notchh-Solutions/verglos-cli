# FINAL-WEB-004 public docs truth evidence — 2026-10-17

## Scope

This record covers one implementation slice of the public product/docs truth
pass. It does not claim that the full FINAL-WEB-004 acceptance scope is
complete.

## Public source

- Repository: `anuragyadav-git/verglos-web`
- Pull request: `https://github.com/anuragyadav-git/verglos-web/pull/177`
- Branch: `feat/final-web-001-truth-registry-20261017`
- Commit: `7a56141`
- Assignee: `anuragyadav-git`
- History: separate substantive commit; no squash, rebase, or force-push

## Implemented

- The public docs plan table now renders Free/Pro/Team/Studio/Enterprise.
- Plan prices and catalog status are derived from the canonical truth surface.
- Team is visible as an inactive validation-tier catalog entry.
- Stale `$29/mo` and `$199/mo` docs prices were removed.
- Attestation and white-label rows now say `Qualification-gated` rather than
  implying a currently planned delivery date.

## Verification

- `pnpm typecheck`: passed
- `pnpm build`: passed; **47/47** static pages generated
- `pnpm test:truth-registry`: **28 passed / 0 failed / 0 skipped** on the
  immediately preceding merged-head validation
- `git diff --check`: passed
- Local runtime warning: repository requests Node 22.x; this machine used
  Node 26.4.0 and pnpm 10.34.5. Checks passed despite that warning.

## Additional maturity-claim slice

Web PR #177 commit `bd50d84` extends the same public truth correction. It
changes unsupported public `Beta` labels for attest/public verify, white-label,
Firecracker, agency dashboard, and related capability rows to
`Qualification-gated`; it derives the docs tier table from the canonical
catalog and removes stale `$29`/`$199` tier values from that surface. The
commit is a separate substantive commit after the regular merge, assigned to
`anuragyadav-git`; no squash, rebase, force-push, empty, duplicate, or
artificial commit was used.

Verification for the clean commit included truth-registry **28/28**,
typecheck, diff check, and a **47/47** generated-page production build.
Qualification-gated wording is deliberately not represented as shipped
capability or final release acceptance.

## Remaining acceptance boundary

FINAL-WEB-004 remains unchecked for the complete command documentation,
language coverage, engine attribution, signing limitations, Hunt assurance,
dashboard capability, and final public truth sweep. The private score remains
**230 checked / 50 unchecked / 280 total (82.1%)**. The independent Hunt
AppSec/security review remains the only closed gate and stays scheduled last.
