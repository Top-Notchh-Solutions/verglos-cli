# FINAL-WEB-008 public route coverage enforcement · 2026-10-22

## Scope

This packet records the follow-up release-smoke hardening shipped in Web PR
#243. Source commit `c8e68e5` merged normally as
`619c31b9719c5284f6e90a9a1133c8515e015ed9` on `origin/main`; the source branch
`codex/public-route-coverage-20261022` remains preserved.

## Implementation

The public release smoke now discovers every App Router `src/app/**/page.tsx`
file and fails if a page is absent from the reviewed public route inventory.
Only explicitly classified authenticated account/organization and API source
prefixes are excluded. Regression coverage proves that an unclassified public
page fails while authenticated pages remain explicitly classified.

## Qualification

On the exact merged head `619c31b` in a clean detached worktree:

- `pnpm install --frozen-lockfile --force`: passed; lockfile remained current.
- `node --import tsx --test scripts/public-release-smoke.test.ts`: **6/6**.
- `pnpm public:release-smoke`: **18 routes**, **22/22 publishable claims**,
  **2 proof assets**, **0 issues**.
- `pnpm typecheck`: passed.

Hosted PR checks all passed: private-runner matrix and PostgreSQL lifecycle
run `39820225686`, Web type/schema/build run `39820225573`, Vercel, Vercel
Preview Comments, and GitGuardian.

## Boundary and disposition

No credentials, customer data, provider, database, migration, Production, or
deployment mutation occurred. No files were deleted. This is code-side
FINAL-WEB-008 progress; the row remains unchecked for ACCEPT-003/009/010,
founder truth-freeze, and final release acceptance.
