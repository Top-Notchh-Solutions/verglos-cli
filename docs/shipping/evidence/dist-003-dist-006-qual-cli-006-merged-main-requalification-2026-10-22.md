# DIST-003 / DIST-006 / QUAL-CLI-006 exact merged-head requalification — 2026-10-22

## Scope

- **Rows:** `DIST-003`, `DIST-006`, `QUAL-CLI-006`.
- **Implementation repository:** `verglos-cli`.
- **Exact merged source:** `c1f5e9b72d54467fc606da00735b704ada74f24c` (`origin/main`, PR #168 normal merge).
- **Qualification worktree:** clean detached worktree at the exact merged source. The workflow's cross-platform `supportedArchitectures` install hint was applied only to this ephemeral worktree's `package.json`; it was not committed or pushed.
- **Privacy boundary:** no database URL or `.env.test.local` value was read or sourced; no customer, provider, Production, registry, npm, signing-service, Hunt-provider, Vercel, tag, or deployment operation occurred; nothing was deleted.

## Qualification results

All commands exited successfully unless explicitly stated otherwise:

1. `pnpm typecheck` — **14/14 Turbo tasks**.
2. `pnpm build` — **8/8 Turbo tasks**.
3. `pnpm test` — **13/13 Turbo tasks**, **0 failures**. Two Hunt A2 Docker target tests were explicitly skipped because `VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1` was not enabled; no skip was treated as a pass.
4. Release/artifact contract command covering `verify-release-artifacts`, release-origin, checksums, notices, license inventory, package surface, packed manifests, external-license records, public-package publication preflight, and publish-workflow contracts — **43 passed, 0 failed, 0 skipped**.
5. `node scripts/pack-public-packages.mjs /tmp/verglos-dist003-merged-c1f5e9b7` — **7/7** public archives; `check-packed-manifests.mjs` passed.
6. Clean consumer contract tests — **2/2**; clean consumer installed all seven archives, imported all libraries, executed Verglos `2.0.0-alpha.1`, confirmed no implicit engine installation, and executed the bounded signed A1 fixture.
7. `release-rollback-evidence.mjs` and `verify-release-rollback-rehearsal.mjs` — **passed** at source commit `c1f5e9b`; five bounded boundaries were covered (`npm`, engine manifest, Hunt feed, signing identity, Web deployment), and two historical records were preserved.
8. `verify-in-toto-release.py` using in-toto **3.0.0** — **passed** for all seven archives with exact SHA-256 product bindings.
9. Strict official standard validation — **4/4**, exit **0**: SARIF Multitool **5.8.0**, CycloneDX CLI **0.33.1**, SPDX Tools Java **2.0.7** under Temurin 17, and Cosign **2.6.0** offline bundle verification.
10. `git diff --check` — exit **0**.

The standard-validation result artifact is `standard-validation.json` with
SHA-256 `672455dbd6b5b66ace549edc74afc688f01102fff1c73e17700e0cd80f5077e7`.
The release archive set is the seven `2.0.0-alpha.1` packages generated in
the bounded local artifact directory; in-toto bound the exact bytes. The
rollback fixture digest was:
`sha256:664f70df2f2a0c063d43c767e602266b1adc1709a498dae7ef71825291b960b`.

## Remaining gates

The strict license inventory intentionally exited **2** with **7** review
blockers across **254** lockfile package entries and one bundled component:

- `benchmark@1.0.0` bundled by `fast-uri@3.1.7` (`nested-license-conflicts-with-container`);
- BlueOak review required for `glob@13.0.6`, `lru-cache@11.5.2`,
  `minimatch@10.2.6`, `minipass@7.1.3`, `minipass-flush@1.0.7`, and
  `path-scurry@2.0.2`.

This requalification closes no backlog checkbox. `DIST-003` remains open for
trusted/protected publication, legal/license clearance, immutable release
attestation, independent review where required, and final acceptance.
`DIST-006` remains open for an authenticated provider/registry/engine/feed/
signing/deployment rollback or revocation operation and final acceptance.
`QUAL-CLI-006` remains open for trusted keyless identity, protected
publication, legal/license clearance, independent review, hosted/customer
evidence, and final acceptance. Local ephemeral keys and fixtures are not
keyless release trust or live rollback evidence.

**Disposition:** code-owned implementation and local qualification are green;
the rows remain unchecked because their non-code contracts are not satisfied.
