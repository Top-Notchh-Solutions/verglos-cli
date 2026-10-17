# TEAM-WEB-006 stable GitHub App webhook entrypoint — 2026-10-18

## Scope

This packet records a real public Web implementation slice for SCM provider
readiness. It does not claim provider activation, a GitHub App installation,
signed webhook delivery, customer repository binding, or acceptance evidence.
It does not change any AppSec/Hunt disposition.

## Public change

- Repository: `anuragyadav-git/verglos-web` (public remote remains the
  Top-Notchh-Solutions repository alias).
- Branch: `feat/scm-stable-webhook-20261018`.
- Pull request: [#186](https://github.com/anuragyadav-git/verglos-web/pull/186).
- Assignee: `anuragyadav-git`.
- Implementation commit: `75f0a87ee092bd54ff7155163423b5600fb5b3e3`.
- Contract-test commit: `c2f92f96ba2b7389589c37ddd5043e3f860b0837`.
- Branch head at capture: `c2f92f96ba2b7389589c37ddd5043e3f860b0837`.
- Public base at branch creation: `c2210cde0fce81e344da4399865734635a035b99`.

## Implemented behavior

The Web app now has a stable app-level POST entrypoint at
`/api/v1/webhooks/scm/github`. The entrypoint accepts only the supported
provider, caps the raw request body at 256 KiB, extracts a bounded GitHub
installation ID from the envelope, and delegates the original raw bytes and
headers to the existing installation-bound handler. The installation-bound
handler remains authoritative for signature verification, lifecycle checks,
tenant/repository binding, idempotency, redaction, and persistence. The new
entrypoint does not log or persist webhook secrets or raw payloads.

The contract test covers the stable route, bounded envelope extraction,
delegation, and rejection of unbounded bodies. The public boundary check
passed.

## Verification captured

Local commands in the clean Web worktree `/tmp/verglos-web-docs.p91MX0`:

- `pnpm exec tsx --test src/lib/organizations/scm-route-contract.test.ts` —
  **8 passed, 0 failed**.
- `pnpm typecheck` — passed.
- `pnpm build` — passed; **47/47** generated pages.
- `node scripts/check-public-boundary.mjs` — passed.
- `git diff --check` — passed.

The local shell used Node `v26.4.0` and pnpm `10.34.5`, while the repository
normally expects Node 22 and pnpm 9.15.9. This is recorded as a local-runtime
limitation; hosted CI is the canonical compatibility check.

At the latest PR observation, GitGuardian Security Checks and Vercel Preview
Comments were successful, the Vercel deployment was successful, and hosted
`typecheck-and-schema` run `39066991842` / job `117496612635` was still in
progress. PR #186 was open and no merge commit had been claimed.

## Gate disposition

This is implementation progress for the SCM Web surface only. `TEAM-WEB-006`
remains open because its contract requires the provider-side installation,
hosted credential configuration, signed live delivery, and reconciliation
evidence. `TEAM-CLI-001` remains open for the separate provider activation and
policy/provider qualification. Hunt/AppSec rows remain parked for independent
AppSec evidence. No backlog checkbox changed.

Live score at capture: **230 checked / 50 open / 280 total (82.1%)**.

No credentials, private keys, webhook secrets, customer data, or private
provider values were stored in this packet.

