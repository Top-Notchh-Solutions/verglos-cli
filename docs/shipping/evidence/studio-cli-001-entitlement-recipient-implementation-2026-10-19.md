# STUDIO-CLI-001 entitlement and recipient evidence implementation — 2026-10-19

## Disposition

Implementation qualification only. Keep `STUDIO-CLI-001` unchecked. The
current private-ledger score remains **239 checked / 41 open / 280 total
(85.4%)**. This batch does not change the independent Hunt/AppSec hold set.

## Product change

Product repository: `verglos-web`.

Branch: `codex/studio-entitlement-recipient-20261019`.

Base: `origin/main` at `8e06f6d43a35ed123c2a9ef169238beca202ff68`.

Normal, separate commits:

- `38d6eb0` — `feat(web): enforce Studio custody entitlement`
- `62a54b5` — `feat(web): publish recipient acknowledgement evidence`

The implementation now requires the server-resolved active organization
entitlement and the `white_label_report` capability before creating a client
workspace, issuing a client handoff, or uploading a client projection. An
inactive catalog row or inactive license cannot activate the capability, and
an unavailable entitlement source fails closed as an operational `503`.

Successful recipient acknowledgement now returns and audits a deterministic
`sha256:` evidence digest bound to the handoff, issuance digest, artifact
digest, normalized recipient, and server-recorded acknowledgement time. The
public acknowledgement response remains bounded and does not expose the
artifact, token, source, or free-form server error.

## Verification actually run

- Focused post-commit qualification: **35 passed, 0 failed, 0 skipped**.
- Full Web test command: **903 passed, 24 skipped, 0 failed**.
- Typecheck: passed.
- `git diff --check`: passed.
- Production build: not passed in this worktree. Next inferred the dirty
  parent checkout as the workspace root and read unresolved conflict markers
  from the parent `verglos-web/package.json`. The product worktree's own
  `package.json` is valid; the parent checkout was not modified.

## Evidence boundary

No Production, provider, payment, database, customer-source, credential, or
external-recipient write was made. Local tests prove the entitlement decision,
route binding, replay-safe acknowledgement logic, and digest construction;
they do not create a paid/non-production entitlement or fabricate customer or
recipient acceptance.

The remaining row action is to use an approved isolated Studio entitlement,
issue a real handoff, have the authorized recipient acknowledge it, and retain
the resulting hosted/audit evidence. Only that observation can satisfy the
row's customer/recipient acceptance requirement.
