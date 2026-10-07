# Organization creation CSRF hardening — 2026-10-07

## Batch

Web PR #152: https://github.com/anuragyadav-git/verglos-web/pull/152

- Head: `415ce17c0cf094f37212d1b8caa065d23befae4b`.
- Scope: `POST /api/v1/organizations` only.

## Change

The state-changing organization creation route now requires the request
`Origin` to exactly match the route URL origin before Clerk authentication,
`ensureUser`, parsing, slug generation, or organization/member persistence.
Cross-origin requests receive a bounded 403 response. A focused source
contract locks the ordering invariant.

## Verification

- Focused route contract: **1/1 pass, 0 fail, 0 skips**.
- `pnpm typecheck`: passed.
- `pnpm db:check`: passed.
- Preview production build: passed; 38 pages generated.
- GitGuardian and Preview Comments: pass.
- Hosted `typecheck-and-schema`: pass; workflow run `37557549508` completed successfully.
- Vercel preview: pass; deployment completed successfully.
- PR #152 merged at Web commit `6fccfb26ffb707e53c3ef44166b42280be29de55`.

No production/database/provider write, migration, payment action, or browser
mutation occurred. No backlog checkbox changed; this is a security-hardening
follow-up to the existing organization lifecycle surface.
The merge is remediation evidence only; it does not accept `QUAL-WEB-005` or
`QUAL-WEB-006`.
