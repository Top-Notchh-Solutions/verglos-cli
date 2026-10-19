# DIST-001 exact-merge package qualification — 2026-10-19

## Verification

The exact CLI merge `50bcab42eadfa8796d86d1f7a8aaee3010c65647` was checked in
a disposable detached worktree with the same cross-platform optional-package
setup used by protected CI (`pnpm.supportedArchitectures` for all supported
OS/CPU entries). After `pnpm install --frozen-lockfile`:

- workspace build: **8/8 tasks passed**;
- public package packing: **7 archives produced**;
- packed manifest/public-surface audit: passed for all **7 archives**;
- clean consumer: installed all 7 archives, imported all public libraries,
  reported `verglos 2.0.0-alpha.1`, created no external-engine cache without an
  explicit install request, and executed the signed A1 fixture through the
  bounded `restricted-process` runtime with the isolated Pro capability fixture;
- `git diff --check`: passed.

The first attempt stopped before archive creation because the disposable
worktree had not yet received the CI cross-platform optional-package setup.
After applying that documented setup, the qualification completed cleanly.

## Disposition

This confirms the package/archive/front-door contract at the exact merge. It
does not close `DIST-001`: the row explicitly remains dependent on the
remaining LOCAL/HUNT/RECORD product surfaces and final legal/release
qualification. No package was published and no Production state changed.
AppSec/Hunt remains unchanged.

The ledger score remains **235 checked / 45 open / 280 total (83.9%)**.
