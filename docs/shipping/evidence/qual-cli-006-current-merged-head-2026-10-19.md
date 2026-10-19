# QUAL-CLI-006 current merged-head qualification · 2026-10-19

## Scope

This packet records current CLI qualification evidence for standard validation,
release artifacts, package boundaries, provenance binding, and supported
platforms. It does not publish npm, create a release tag, or claim trusted
publisher/legal/final acceptance.

## Source

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Exact merged source: `11734a45740a893c307606e8f3d3f316711abd9e`
- PR: #152, merged normally without squash at 2026-10-19T11:56:19Z
- Local qualification: clean detached worktree on macOS arm64, Node `v26.4.0`,
  pnpm `9.15.9`

## Verification

- `pnpm install --frozen-lockfile`: passed.
- `pnpm build`: **8/8** workspace tasks passed.
- Publish workflow, immutable tag, release artifact, package-surface, and
  rollback contract tests: **15/15**, zero failures/skips.
- `release-rollback-evidence.mjs`: exit `0`, five bounded operations, two
  historical records preserved; no provider or registry writes.
- `git diff --check`: passed.
- Hosted PR #152 checks: **12/12 SUCCESS** — Ubuntu, macOS, and Windows Node
  20/22/24; official standard/provenance validators; in-toto release binding;
  and Verglos self-scan.

Hosted check run references:

- Matrix run `39247182521`
- Official validators `39247182276`
- Self-scan `39247182292`
- Merge commit `11734a45740a893c307606e8f3d3f316711abd9e`

## Limitations and disposition

The qualification uses public source and synthetic fixtures only. It does not
prove trusted keyless Sigstore/Fulcio/Rekor identity enrollment, protected
publisher approval, legal clearance, independent Hunt/AppSec review, or final
acceptance. No npm publication, immutable release tag, registry mutation,
customer source, or production credential was used.

`QUAL-CLI-006` remains unchecked. The live score remains **239 checked / 41
open / 280 total (85.4%)**. AppSec/Hunt remains held separately.
