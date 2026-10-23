# CLI source-of-truth divergence audit · 2026-10-10

## Observed state

- Public CLI worktree local `main`: `d0a3b21724bf1ee1763e183cb165c2f979e62a81`.
- Public CLI `origin/main`: `f5686b5c5aa11f45f392e647bd9d7e31830654ba`.
- Merge base: `f3bc33a3ef2976db03a4f68163bf49c2b2469ca9`.
- Divergence: local `main` is **73 commits ahead and 883 commits behind**
  `origin/main`.
- Local `main` also contains founder-owned untracked shipping/product assets.

## Release decision

Do not merge, reset, force-push, or use the local `d0a3b217` line as the
release candidate. It remains preserved for the founder. The detached
upstream worktree at `origin/main` is the authoritative CLI qualification
surface until the owner explicitly reconciles the two histories.

The prior `d0a3b217` tests and standards-source restoration remain valid as
local implementation evidence, but they are not evidence that the upstream
release head contains those changes. Existing upstream evidence at
`f5686b5c` remains the release evidence. No source, public branch, or
founder-owned asset was modified by this audit.

## Acceptance and boundary

This is a source-control/release-boundary finding, not a backlog acceptance.
`QUAL-CLI-006`, `PLAN-CLI-001/002/003/004`, distribution, Hunt, independent
review, legal, trusted publishing, and final acceptance remain governed by
their existing evidence and external gates. Score remains **219 checked / 61
unchecked / 280 total (78.2%)**.

