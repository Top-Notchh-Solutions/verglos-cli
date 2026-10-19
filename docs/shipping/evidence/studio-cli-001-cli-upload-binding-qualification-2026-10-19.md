# STUDIO-CLI-001 latest CLI upload-binding qualification — 2026-10-19

## Scope

This packet records the latest merged CLI qualification for the Studio
projection upload path. It verifies that the client projection is redacted,
approval-bound, organization/workspace/record-bound, endpoint-bound, and
bounded before network use. It does not claim a paid Studio entitlement,
hosted custody, recipient acceptance, customer acceptance, or AppSec review.

## Source and history

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Exact source: `origin/main` at `0823b513f2b1810ad9f6afcb8806ba46f61feedb`
- Relevant implementation: `a55c1c66` (`fix(cli): bind Studio projection upload route`)
- Relevant regression tests: `ae40cdb4` (`test(cli): qualify Studio projection response binding`)
- These changes are preserved in normal merge history through CLI PR #146;
  no squash, rebase, force-push, empty, duplicate, or artificial commit was
  created for this qualification.

## Runtime and commands

The qualification ran in disposable worktree
`/private/tmp/verglos-cli-studio-upload-20261019` on Darwin 25.5.0 arm64.
The observed runtime was Node `v26.4.0` and pnpm `9.15.9`; Node 22 was not
installed in this local shell, so the existing hosted Node 22 evidence remains
the supported-runtime reference.

```text
pnpm install --frozen-lockfile
pnpm exec turbo run build --force
pnpm --filter verglos exec node --import tsx --test \
  src/client-projection.test.ts src/client-projection-upload.test.ts
pnpm --filter verglos typecheck
git diff --check
```

The first focused test attempt correctly stopped at setup because the clean
worktree had not yet built `@verglos/shared/dist`; the forced workspace build
was then run before repeating the same test command. That setup failure is not
counted as a product failure.

## Results

- Forced build: **8/8 packages passed**, zero cached tasks.
- Focused projection/upload tests: **7/7 passed**, zero failures/skips.
- Typecheck: passed.
- `git diff --check`: passed.
- The focused suite covered exact approved redacted upload, private-field
  refusal before network access, server digest mismatch, organization/project
  endpoint binding, unsafe or unbounded server identifiers, oversized streamed
  response cancellation, and exact approval-bound CLI projection admission.
- The disposable worktree was clean after qualification.

Private log SHA-256 values:

```text
focused:   1ec45484d5c9c9dbadf8159da3a2c37174da5c1eab243c5a0b644e932cec0ca3
build:     ff535ca775f7c4b1c78eaf6a3767f3a32c8cf4151561ca714e0092bf86ed5b7e
typecheck: 4da2d8794d161e7eee3f88e04f8600495b4e412e43900b17cfebfea0ef603310
setup:     b6c781ca3910518d5891b42b76668e3c9f3647ad49353de285bfb0d600c4ea22
```

## Acceptance boundary

This is a substantive CLI implementation qualification advance. It does not
close `STUDIO-CLI-001`: the row still requires an approved numeric paid or
non-production hosted-record allowance, successful hosted custody observation,
and authorized Studio recipient/customer acceptance. No provider, billing,
customer, Production, npm, or AppSec state changed.

The authoritative backlog remains **235 checked / 45 open / 280 total
(83.9%)**. `TEAM-CLI-001` is checked.
