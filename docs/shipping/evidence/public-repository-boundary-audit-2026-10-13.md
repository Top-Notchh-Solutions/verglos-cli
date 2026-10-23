# Public repository boundary audit — 2026-10-13

## Purpose

Confirm that private shipping records, credentials, and deployment material are
not being added to the public `verglos-cli` repository while the final V1
contract is implemented across the private shipping tracker, CLI, shipping
worktree, and Web workspace.

## Scope

- Public repository: `Top-Notchh-Solutions/verglos-cli`
- Public `origin/main` at audit time: `53448684f6c3004ee1490d40ea2cae74ee199af2`
- Private tracker: `verglos-cli-private-shipping` at `6a521248`
- Public remote branches inspected:
  - `chore/next-shipping-slice` at `972a3b65e85b196ef9ea524a3d05952d906af2ee`
  - `chore/publish-alpha-2-0-0` at `b070c243c2c4b481fa9707586a00d17bd5386f73`

## Findings

1. The current public `origin/main` tree does not contain `docs/shipping/`.
2. The two older public remote branches above still contain 99 files under
   `docs/shipping/`, including internal-looking risk, traceability, and
   backlog records. They are not part of current `origin/main`, but they are
   still public branch history and must not be treated as an acceptable public
   documentation surface.
3. A literal-marker scan of the live public remote refs found no matching
   Vercel, Razorpay, GitHub/GitLab, private-key, or credentialed Postgres
   material. This is a bounded scan, not a substitute for provider rotation or
   secret-management policy.
4. The public worktree contains a local ignored `.env` and many untracked
   shipping documents. They remain outside Git tracking. They must not be
   staged with a broad `git add .`.
5. The tracked public research file
   `docs/research/active-credential-disclosure-withheld.md` contains no
   literal credential marker in the bounded scan, but its subject matter
   requires a deliberate public-content review before the next release.
6. The private tracker remains clean and is the only home for the full
   backlog, risks, traceability, execution ledger, evidence, legal packets,
   and founder deliverables.

## Public-boundary rule

The public CLI may receive only source, tests, sanitized user documentation,
and public-safe contract material. Do not copy the private backlog, active
goal, execution ledger, risk register, traceability matrix, evidence packets,
legal records, consent records, environment files, provider identifiers, or
deployment bypass material into it.

Before every public PR, inspect the staged file list and run the repository
secret scan. Never stage the whole workspace while private or generated files
are present.

## Disposition

- No public file was staged, committed, pushed, deleted, or rewritten by this
  audit.
- The two historical shipping branches remain a public-boundary cleanup item;
  deleting remote branches requires an explicit owner decision because it is
  an external destructive change.
- No backlog checkbox changed. Current private score remains **228 checked /
  52 unchecked / 280 total (81.4%)**.
- This evidence does not prove that the overall V1 release gates are complete.
