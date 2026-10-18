# DIST-006 current CLI rollback/revocation rehearsal — 2026-10-18

## Scope

This packet records the local rollback/revocation decision and rehearsal
qualification on the current CLI merge. It does not contact npm, an engine
registry, a Hunt feed, a signing provider, Vercel, or any deployment service.
No rollback, revocation, tag, or release state was changed.

## Source

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Normal merge: `9eba5102a1c0f9d7ee13b28bb2cc28bb50766eae`
- Disposable worktree: CLI PR #129 qualification worktree

## Verification

Package-context commands:

```text
cd packages/shared
node --import tsx --test src/release-rollback.test.ts
cd ../cli
node --import tsx --test src/release-rollback-plan.test.ts
```

Results:

- Shared rollback decision contract: **6/6 passed**.
- CLI rollback-plan/rehearsal contract: **5/5 passed**.
- Combined: **11/11 passed**, zero failures or skips.
- The rehearsal covers npm package, engine manifest, Hunt feed, signing
  identity, and Web deployment boundaries; it preserves historical records,
  refuses missing approval, rejects mutable/same references, and requires a
  distinct replacement signing identity for revocation.

## Acceptance mapping

This advances the local implementation and rehearsal portion of `DIST-006`.
The row remains unchecked because authenticated provider/registry/engine/feed/
signing/deployment rollback or revocation has not been executed, and final
release acceptance remains open.

## Privacy boundary

No credentials, provider tokens, registry payloads, private keys, customer
source, deployment cookies, or external service state were recorded.

