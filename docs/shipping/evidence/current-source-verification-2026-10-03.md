# Current CLI source verification — 2026-10-03

Source under test: CLI worktree commit
`955412516b96cc09393e78c43bf7d02b9abd05d9` (the merged cache-persistence
source, unreleased).

Commands and results:

```text
pnpm typecheck                         PASS
pnpm build                             PASS
pnpm --filter @verglos/shared test     PASS
```

The package-owned suite remains recorded separately as 236/236 passed.

The local macOS release-preparation checks were intentionally not treated as
passing:

```text
pnpm licenses:inventory                FAIL CLOSED
pnpm pack:public <temporary-directory> FAIL CLOSED
```

Both stop at the same inventory guard because pnpm's macOS install does not
materialize foreign-platform optional packages such as
`@esbuild/aix-ppc64@0.28.1`, while the lockfile requires their metadata. No
inventory bypass or synthetic metadata was added. Hosted Linux self-scan
`37109797227` remains the successful current-source public-pack evidence; this
local result is retained so a future cross-platform packaging fix can be
verified against the real failure.

No source, package, tag, publication, deployment, migration, or production
state changed during this verification.
## 2026-10-03 rerun

- Web `pnpm typecheck` passed on main `763aab07a19f054dee41dc83ab9ec9f0743b4925`.
- CLI current-source `pnpm --silent test` passed on `955412516b96cc09393e78c43bf7d02b9abd05d9` (12 Turbo tasks successful; package suites reported zero failures).
- Node emitted the repository's existing engine warning under local Node 26; hosted Node 20/22/24 evidence remains the compatibility authority.
