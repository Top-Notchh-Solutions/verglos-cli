# QUAL-WEB-006 · built Preview runtime qualification · 2026-10-08

## Scope

- Repository: `verglos-web`
- Source under test: Web PR #166, commit `eab48accfe3aa45574435fbf445947c0747673b9`
- Worktree: `fix/web-keyless-preview-middleware`
- Runtime: Next.js `15.5.25`, Node `v26.4.0` (the repository declares Node 22.x;
  this local runtime mismatch is recorded, not hidden)
- Server: `next start --port 3012` with `VERCEL_ENV=preview` and no payment,
  database, Clerk, or provider credentials
- Browser: Chrome DevTools page 11, local Preview only

## Defect found and repaired

The production-built server previously returned HTTP 500 for `/` when the
Preview/local process omitted `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`. The Clerk
middleware wrapper threw before its callback could apply the existing keyless
allowance. The fix selects a plain `NextResponse.next()` middleware when the
key is absent. Production remains fail-closed through instrumentation/runtime
configuration, which requires the Clerk and payment/database configuration
before production requests are accepted.

## Verification

- `pnpm build`: passed; lint/typecheck passed; 45 static pages generated.
- Built Preview public-route sweep: `/`, `/docs`, `/docs/2.0.0`, `/verify`,
  `/detectors`, `/login`, `/checkout`, and `/llms.txt` all returned HTTP 200.
- `/llms.txt` returned `text/plain; charset=utf-8`; the document contains the
  Verglos H1 and factual product boundary text.
- Browser title: `Verglos — Security Evidence Agent for AI-Generated Code`.
- Browser description metadata present; document language is `en`.
- Chrome console: no warnings or errors on the homepage.
- Performance trace: LCP **362 ms**, TTFB **4 ms**, render delay **358 ms**,
  CLS **0.00**. No CrUX field data exists for localhost.
- Lighthouse desktop: Accessibility **100**, Best Practices **100**, SEO
  **100**, Agentic Browsing **67**.
- Lighthouse mobile: Accessibility **100**, Best Practices **100**, SEO
  **100**, Agentic Browsing **67**.
- The sole Lighthouse failure was `llms-txt`: its checker requires Markdown
  links and reported `File does not appear to contain any links`; the current
  route uses bare URL lines. This is retained as a FINAL-WEB-005 truth/metadata
  follow-up, not silently treated as accepted.

## Boundary and disposition

No database, migration, payment, provider, account, deployment, or production
write occurred. This evidence strengthens `QUAL-WEB-006` and the Web runtime
lane but does not close any backlog checkbox. Human screen-reader testing,
authenticated paid/org data, large-data behavior, complete route coverage, and
field/CrUX evidence remain open. The `llms.txt` format and final public truth
remain gated by the final Web truth/release pass.
