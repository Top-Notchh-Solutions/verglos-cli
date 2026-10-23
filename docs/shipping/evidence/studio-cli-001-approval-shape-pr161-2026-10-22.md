# STUDIO-CLI-001 approval-shape hardening and normal merge — 2026-10-22

## Implementation

The CLI client-projection admission boundary now validates approval JSON before
reading approval properties. `null` and absent approvals remain
`approval_required`; arrays, empty objects, wrong field types, invalid IDs, and
invalid digests fail closed as `approval_mismatch`. This protects the public
upload path, which receives approval JSON at runtime and previously could throw
on malformed values instead of returning a bounded denial.

The implementation commit is
`0d566b8017ff9b576e3551a7528cc89ac1e91265`. It adds the approval-shape guard
and regression coverage for `null`, empty-object, and wrong-type approvals in
`packages/shared/src/client-projection.test.ts`.

PR [#161](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/161)
passed its required hosted checks and merged normally as
`613eb22b5601eaead153105cc9de7ebbb7802fff`. The source branch
`codex/studio-cli-001-approval-shape-20261022` remains preserved. No file,
branch, record, deployment, provider, customer, database, or release artifact
was deleted or changed by qualification.

## Verification

- Focused approval/projection contract: **5/5** passed.
- Forced CLI workspace test/typecheck/build graph: **23/23** tasks passed with
  zero failures; existing Hunt Docker/A2 cases remained explicit skips.
- Hosted PR #161 checks: **12/12** passed, including the rerun Windows/Node 24
  platform job; platform matrix run `39787922943` is green.
- Private current-head verifier: CLI **310/312** passed with 2 explicit skips
  and 0 failures; Web **950/980** passed with 30 explicit skips and 0
  failures; composed substrates **74/74** passed; all **12/12** stories
  executed with exit 0.
- Current-head output hashes: CLI
  `68cd8a18440aa72d61c4dfbf240cef3675adcff731a0ff8441b21aa2e909b09a`, Web
  `230b3ddffba010b877df7ea29fb294b8f73450e295eae481a1e565bc7fed64a3`, and
  composed substrates
  `4b042c2f176d2086c1cdc999c44df743409a80011434092d1b19613691145853`.
- `git diff --check` passed on the implementation worktree.

No `TEST_DATABASE_URL` was supplied. No hosted HTTP, provider, customer,
reviewer, browser-human, field-CWV, migration, or Production operation was
performed.

This closes the approval-shape implementation slice only.
`STUDIO-CLI-001` remains unchecked for the numeric paid/non-production hosted
allowance and authorized Studio recipient/customer acceptance with the
required hosted/audit evidence. Score remains **239 checked / 41 open / 280
total (85.4%)**.
