# FINAL-WEB-004 security-layer demo truth — Web PR #180 — 2026-10-18

## Scope

This packet records one real public implementation slice for FINAL-WEB-004.
It aligns the hosted Web README and animated terminal hero with Verglos's
local-first security decision-layer position and removes invented Hunt runtime
findings from the public demo. It does not claim final-Web acceptance, hosted
signing, provider activation, customer-target evidence, legal approval, field
evidence, release acceptance, or independent Hunt AppSec review.

## Public source and history

- Repository: `Top-Notchh-Solutions/verglos-web`
- PR: [#180](https://github.com/anuragyadav-git/verglos-web/pull/180)
- Assignee: `anuragyadav-git`
- Base before implementation: `a85d6f360791baf09365b3308e34ea4fb1e2996c`
- Implementation commit: `e8ccfd226fb01f1cea31a0778ff5e8b105bc95f8`
- Normal merge commit: `71278209a3715080655135b5668d968b1494ac3c`
- Branch: `feat/final-web-004-security-layer-20261018`
- Public files changed: `README.md`, `src/components/terminal-hero.tsx`

The PR used one substantive implementation commit followed by a normal merge.
There was no squash, rebase, force-push, empty, duplicate, artificial, or
irrelevant public-documentation contribution commit.

## Implementation

- The README now positions Verglos as the local-first security decision layer
  between AI-generated code and release.
- The hero demo now shows local scan findings/provenance, an explicit policy
  decision, qualification-gated Hunt, bounded HTML/JSON evidence handoff, and
  source upload of zero bytes.
- The demo no longer presents fabricated “verified exploitable” findings,
  invented counts, or an unsupported beta preview claim.

## Verification

Clean disposable worktree: `/tmp/verglos-web-docs.p91MX0`.

- `pnpm install --frozen-lockfile`: passed. Local environment reported Node
  `v26.4.0` and pnpm `10.34.5`; the repository requested Node `22.x`, so the
  engine warning is retained as a limitation. Hosted verification is the
  authoritative repository check.
- `pnpm test:truth-registry`: **31 passed / 0 failed / 0 skipped**.
- `pnpm typecheck`: passed.
- `pnpm build`: passed; static generation reached **47/47** pages.
- `node scripts/check-public-boundary.mjs`: passed.
- `git diff --check`: passed.

Hosted PR evidence:

- GitHub Actions run `39061642513`, job `117480656644`,
  `typecheck-and-schema`: **passed** in 2m58s.
- Vercel: **passed**; deployment `AavTFzJyMUoD8hiC76YkmbBJr3RC`.
- GitGuardian Security Checks: **passed**.
- Vercel Preview Comments: **passed**.

## Acceptance boundary

No backlog checkbox changed. FINAL-WEB-004 remains open for the complete
command/docs truth contract and its FINAL-WEB/final-acceptance dependencies.
The AppSec hold set remains untouched and scheduled last. Current score stays
**230 checked / 50 open / 280 total (82.1%)**.

This public implementation is safe to expose because it states the current
qualification boundaries instead of implying that bounded Hunt, hosted
signing, or public verification are already generally available.

