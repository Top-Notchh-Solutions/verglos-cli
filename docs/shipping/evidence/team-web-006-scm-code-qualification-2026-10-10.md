# TEAM-WEB-006 SCM integration code qualification — 2026-10-10

## Scope

Web head `51e07f5` was tested locally against the bounded SCM/GitHub/GitLab
contract surface. This is code-side qualification only; no GitHub App or
GitLab installation, repository, webhook, provider check, or customer source
was accessed.

## Result

The focused SCM suite passed **24/24**, with zero failures and zero skips. It
covers:

- immutable GitHub/GitLab installation identity and bounded repository scope;
- raw-byte webhook authentication and body-size limits;
- tenant/organization/commit/subject/artifact binding;
- redacted, HTTPS-only check composition;
- idempotent delivery and replay-safe payload digests;
- fenced `SKIP LOCKED` delivery claims and bounded leases;
- GitHub App token exchange/refresh contracts;
- retry/terminal response classification without provider-body persistence;
- source-free worker projections; and
- authenticated cron/webhook route boundaries.

## Acceptance boundary

The live installation/cutover requirement remains open: an authorized company
test repository still needs installation, permission verification, webhook
delivery, check publication, replay/removal, and recovery evidence. No source,
credential, provider, database, Production, or customer state changed.

Backlog remains **219 checked / 61 unchecked / 280 total (78.2%)**; no
checkbox changed.

