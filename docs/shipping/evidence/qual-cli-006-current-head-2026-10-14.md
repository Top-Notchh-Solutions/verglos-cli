# QUAL-CLI-006 current merged-head qualification — 2026-10-14

## Scope

This record qualifies the exact public CLI merge commit
`ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a` in disposable detached worktree
`/private/tmp/verglos-cli-qual-006`. It was run after normal merge of CLI PR
#125; the contribution commits remain preserved in that merge:
`677233e57e514390afc44a5dd17222f156ca1b41` and
`b01f1a9d50063fe545cef11f46163033e2eb434b`.

The local host was macOS arm64, Node `v26.4.0`, pnpm `9.15.9`, and Python
`3.14.6`. The CI-only `supportedArchitectures` materialization used by the
repository platform workflow was applied temporarily in the disposable
worktree so license/SBOM checks saw every lockfile platform package; it was
removed before final status inspection. No public source file was changed.

No npm publication, tag, Production deployment, provider/payment request,
database or migration write, entitlement/account/customer write, or release
approval occurred.

## Results

- `pnpm install --frozen-lockfile`: passed.
- `pnpm typecheck`: **14/14** tasks passed.
- `pnpm build`: **8/8** tasks passed.
- `pnpm test`: **13/13** tasks passed with zero failures. The repository's
  explicit Docker/Linux environment-gated cases remained skipped on this
  macOS host; they were not counted as passes.
- Release-contract script tests: **26/26** passed, including standards
  corpus, package surface, clean-consumer, notices, license inventory, SBOM,
  release-artifact, platform workflow, and publish workflow contracts.
- `pnpm licenses:inventory --check`: exited 0 after the CI platform-entry
  setup. The current lockfile has **254 versions**, **250 package entries**,
  one separately recorded bundled component, and **7 review blockers**:
  `benchmark`, `glob`, `lru-cache`, `minimatch`, `minipass`,
  `minipass-flush`, and `path-scurry`.
- Public packaging produced and audited **7 npm archives**; packed-manifest
  verification passed.
- The clean consumer installed all seven archives, imported all public
  libraries, executed Verglos `2.0.0-alpha.1`, confirmed no implicit external
  engine installation, and executed the signed `a1-utf8-contains` fixture
  through the bounded restricted-process runtime.
- Upgrade/rollback passed the transition
  `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3`.
- Official `in-toto==3.0.0` verification passed for all seven archives with
  exact SHA-256 products.
- Public-boundary audit and `git diff --check` passed.

## Acceptance boundary

This is current-head implementation and artifact qualification evidence only.
`QUAL-CLI-006` remains unchecked because the row also requires trusted
keyless Sigstore/Fulcio/Rekor release identity, protected publication and
attestation, final legal/licensing clearance, independent review, supported
cross-platform hosted evidence for this release candidate, and final
acceptance. The local Node 26/macOS run does not replace the hosted
Ubuntu/macOS/Windows Node 20/22/24 matrix, and skipped Linux/Docker tests do
not become passes. `LIC-002` remains open with the seven blockers above.

No score changed: **228 checked / 52 unchecked / 280 total (81.4%)**.
