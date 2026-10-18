# TEAM-CLI-002 CI check record-link boundary — 2026-10-18

## Scope

This packet records a bounded implementation slice for the source-free CI
check payload. It is not live SCM delivery, provider cutover, entitlement
acceptance, or AppSec evidence.

## Public source

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: #130
- Normal merge commit: `efa64f5cf1ec9f6ff960c48f06f7bc3c1e239a0d`
- Parent merge: `9eba5102a1c0f9d7ee13b28bb2cc28bb50766eae`
- Implementation commit: `d5c44155c3b3e601ae9fff60cad3ab12255a3f6f`
- Regression-test commit: `81c885f6a2f30956cc1de572f8a3c6f0a11a0f21`
- Merged at: `2026-10-18T16:49:48Z`

The normal merge preserves separate implementation and test contributions. No
squash, rebase, force-push, empty, duplicate, artificial, or irrelevant
documentation-only commit was used.

## Implementation

The shared CI check payload composer now rejects a record link unless it is a
bounded HTTPS URL with no credentials, fragment, query string, control
characters, or length above 2,048 characters. This keeps secret-bearing query
links and unbounded provider-facing payload data outside the source-free SCM
projection. Existing exact subject, policy, manifest, commit, and payload
digest binding remains unchanged.

## Verification

Executed in the clean PR worktree:

- `pnpm install --frozen-lockfile` — passed.
- `pnpm build` — **8/8 packages passed**.
- `cd packages/shared && node --import tsx --test src/ci-check-payload.test.ts` — **3/3 passed**.
- `cd packages/cli && node --import tsx --test src/ci-check-payload.test.ts` — **3/3 passed** after the workspace build.
- `git diff --check` — passed.
- Protected PR checks all passed: Ubuntu Node 20/22/24, macOS Node 20/22/24, Windows Node 20/22/24, Verglos self-scan, and in-toto release binding.

The first CLI subprocess test invocation was run before the workspace build and
reported a missing generated scanner artifact; the required build then passed
and the complete CLI test file passed 3/3. No code failure was hidden.

## Acceptance mapping and remaining work

This advances the source-free payload and URL-input boundary portion of
`TEAM-CLI-002`. The row remains unchecked because its exact dependency
`TEAM-CLI-001` still lacks a mapped paid/non-production entitlement,
authenticated signed policy fetch/cache/offline/expiry/cross-tenant evidence,
and live provider delivery/reconciliation. No SCM provider request was sent by
this change.

## Privacy boundary

No customer source, release-decision contents beyond bounded test fixtures,
provider token, response body, credential, private key, browser cookie, or
payment data is included in this packet.
