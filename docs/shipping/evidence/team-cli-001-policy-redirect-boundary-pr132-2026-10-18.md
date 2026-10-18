# TEAM-CLI-001 policy redirect boundary — 2026-10-18

## Scope

This packet records a public implementation slice for the organization policy
client. It is not entitlement, provider delivery, customer acceptance, or
independent AppSec evidence, and it does not close `TEAM-CLI-001`.

## Public source and history

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: [#132](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/132)
- Head at capture: `e03f9582234e9e3ebd92206f29f5a172c9c7ef03`
- Implementation commit: `39950bb6` (`fix(cli): refuse redirected organization policy fetches`)
- Regression-test commit: `d7db7159` (`test(cli): cover organization policy redirect refusal`)
- Test-portability correction: `e03f9582` (`fix(cli): keep redirect test type portable`)

The branch contains three distinct commits and was pushed as a normal pull
request. No squash, rebase, force-push, empty, duplicate, artificial, or
irrelevant documentation-only commit was used.

## Implementation

Bearer-authenticated organization-policy requests now set `redirect: "error"`
on the CLI fetch. A policy endpoint or intermediary that attempts an HTTP
redirect therefore cannot cause the bearer credential to be forwarded to a
different location. The change preserves the existing trusted-origin,
endpoint, timeout, response-size, signature, and cache checks.

## Verification

Executed in `/private/tmp/verglos-cli-organization-policy-redirect-20261018`:

- `pnpm install --frozen-lockfile` — passed.
- `pnpm build` — passed, workspace build **8/8**.
- `pnpm typecheck` — passed, **14/14** tasks.
- `packages/cli/node_modules/.bin/tsx --test packages/cli/src/organization-policy-fetch.test.ts` — **8/8 passed**.
- `git diff --check` — passed.

The new regression test verifies that the bearer-authenticated request is
constructed with redirect refusal. No credential or policy document is stored
in this packet.

At evidence capture, the 11 protected GitHub checks on PR #132 were queued;
their eventual result must be recorded separately before treating hosted CI as
passed.

## Acceptance mapping and remaining work

This advances only the code-side bounded policy-fetch boundary. The row remains
unchecked for the mapped paid/non-production entitlement, authenticated signed
CLI fetch/cache/offline/expiry/cross-tenant observations, provider delivery,
reconciliation, and complete acceptance. Hunt/AppSec rows remain on their
separate hold.

## Privacy boundary

No policy document, source tree, credential, bearer value, private key,
provider payload, customer data, or browser state is included in this packet.
