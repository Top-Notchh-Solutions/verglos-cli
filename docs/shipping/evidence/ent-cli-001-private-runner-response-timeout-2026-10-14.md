# ENT-CLI-001 private-runner response-body timeout evidence

Date: 2026-10-14

## Public implementation

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: [#123](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/123)
- Contribution commit: `dec59b6905208250fc288bf212725e6590596ff5`
- Normal merge commit: `e863307590f7bbecb8a2cb24b994f1825e1391d5`
- No squash, rebase, force-push, empty commit, or artificial contribution
  activity was used.

The private-runner client now keeps its bounded `AbortController` deadline
active through the complete response-body read for both GET job polling and
POST result upload. A response stream that stalls after sending headers is
classified as a bounded network failure rather than hanging or being reported
as malformed JSON. The existing tenant/runner/target binding, source-free
projection, and replay protections are unchanged.

## Verification

- Focused private-runner client suite: 7/7 passed, including poll and upload
  response-body stall regressions.
- Full CLI package test suite: exit 0, zero failures; the existing A2 Docker
  integration remains the documented explicit skip.
- Monorepo build: 8/8 successful.
- Monorepo typecheck: 14/14 successful.
- `git diff --check`: passed.
- Protected platform/in-toto run `38539111651`: all Ubuntu/macOS/Windows
  Node 20/22/24 cells and in-toto binding passed. The Windows Node 20 cell
  passed on rerun job `115772734817` after an unrelated temporary-directory
  cleanup flake in the first attempt.
- Public self-scan run `38539111751`: passed.

## Acceptance boundary

This is code-side protocol hardening only. It does not prove operational
enrollment credential exchange, an approved isolated runner execution and
result-reconciliation run, customer target qualification, cross-platform
operational evidence beyond protected CI, or independent review. ENT-CLI-001
therefore remains unchecked and the score remains **228 checked / 52
unchecked / 280 total (81.4%)**.

No private tracker, credentials, provider state, database, npm publication,
production deployment, or customer source was used or pushed to the public
repository.
