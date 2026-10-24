# Web PR #297 production implementation evidence · 2026-10-24

## Scope

This packet records a production-code race fix in the Studio handoff workflow.
It is implementation evidence only. It does not claim recipient/customer
acceptance, independent review, AppSec/Hunt review, field performance, or final
release sign-off.

## Expiry-fenced revocation

- Pull request: `https://github.com/anuragyadav-git/verglos-web/pull/297`.
- Implementation commit: `4b3b6c7`.
- Normal merge commit: `ed60da0199ef6eba54faf5d387609e56c5b2ae8a`.
- Code change: the revocation compare-and-set now requires
  `expiresAt > revokedAt` inside the transaction. A request that passes the
  preflight check just before expiry cannot revoke the handoff after the exact
  expiry boundary.
- Focused handoff domain, route, and page contracts passed **33/33**.
- Web `pnpm typecheck` passed with the workstation Node 26.4.0 versus package
  Node 22.x engine warning.
- `git diff --check` passed.

## Provider and hosted boundary

The merged-head Vercel deployment reached Ready and passed a read-only public
surface matrix:

- Deployment: `dpl_4KErnPb4XCnzpGKCapjQwKHEEpAQ`.
- Target: `production`.
- URL: `verglos-5oe84xrc6-anuragyadav20062002s-projects.vercel.app`.
- State: `READY`.
- `https://verglos.com`: **6/6 HTTP 200** for `/`, `/proof`, `/checkout`,
  `/llms.txt`, `/robots.txt`, and `/sitemap.xml`.
- `https://www.verglos.com`: **6/6 HTTP 308** to the canonical host for the
  same paths.
- Exact deployment hostname: **6/6 HTTP 302** to Vercel SSO; no protection
  bypass was attempted.
- GitHub Actions checks were not rerun. The account budget/runners remain
  blocked; the code merge is independent of those checks.

`STUDIO-CLI-001` remains unchecked. This advances its implementation boundary;
authorized recipient acceptance, independent review, and final release
evidence remain absent. The score remains **246 checked / 34 open / 280 total
(87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**. Nothing was deleted
or overwritten.
