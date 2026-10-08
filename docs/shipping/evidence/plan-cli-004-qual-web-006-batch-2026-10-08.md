# PLAN-CLI-004 + QUAL-WEB-006 batch evidence · 2026-10-08

## CLI compatibility rehearsal

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Source commit: `7c02099` (`test(cli): rehearse legacy entitlement activation fallback`)
- Pull request: #84 merged as `94829e1a4fc8e42dd67545e99cbe9a3a837b9482`
  after all hosted platform, self-scan, and in-toto checks passed
- Change: a process-level `activate` journey uses a loopback HTTP fixture where
  v1 validation returns a synthetic Pro entitlement and v2 token issuance returns
  bounded HTTP 503. The CLI exits successfully and persists the legacy v1 token.
- Focused suite: 63/63 passed, including the new process test.
- Repository gates: `pnpm test` 12/12 tasks; `pnpm typecheck` 13/13 tasks;
  `pnpm build` 8/8 tasks; `pnpm lint` 5/5 tasks; `git diff --check` passed.
- Safety: synthetic tokens only; no provider, registry, signer, deployment,
  database, payment, or production write.
- Boundary: this proves local fallback behavior only. Deployed signer/catalog
  alignment, supported-version migration across released CLI versions, hosted
  activation integration, and final PLAN-CLI-004 acceptance remain open.

## Web accessibility correction and route observation

- Repository: `anuragyadav-git/verglos-web`
- Source commit: `4e00cc3` (`fix(web): improve docs CTA contrast`)
- Pull request: #164 merged as `394d697903b7fa12ec537dc667f3807cdd75f588`
  after hosted typecheck/schema, Vercel, Vercel Preview Comments, and
  GitGuardian checks passed
- Change: the `/docs/2.0.0` Hunt docs CTA now uses dark text on the existing
  accent background. Local Lighthouse navigation moved Accessibility from 96
  to 100 and left Best Practices at 100.
- Local gates: typecheck passed; truth-registry 25/25 passed; serial suite
  862 passed / 24 environment-gated skips / 0 failures; production build
  generated 45 pages.
- Production read-only route sweep through Chrome DevTools CDP, with no forms,
  checkout actions, provider calls, or state changes:
  - `/`: Accessibility/Best Practices/SEO 100/100/100; Agentic Browsing 67;
    no console warnings/errors.
  - `/detectors`: 100/100/100; Agentic Browsing 67; no console warnings/errors.
  - `/verify`: Accessibility/Best Practices 100/100; SEO 91 in navigation
    mode (80 in snapshot mode); missing meta description and optional llms.txt
    recommendation were the failed audits; no console warnings/errors.
  - `/docs/2.0.0`: navigation Accessibility 96 before the PR fix; the local
    post-fix audit is 100 Accessibility / 100 Best Practices; remaining local
    failures are only meta description and optional llms.txt recommendation.
  - `/docs/hunt`, `/docs/attest`, `/docs/provenance`: Accessibility and Best
    Practices 100; SEO 92; Agentic Browsing 67; no console warnings/errors.
  - `/checkout`: navigation Accessibility 100, Best Practices 77, SEO 54,
    Agentic Browsing 67; a snapshot run was 100/100/80/50. No console
    warnings/errors. Provider iframe/navigation audit differences are not
    treated as lifecycle acceptance.
  - `/pricing` returned the framework 404 and is not a linked/sitemap route;
    no route was added during this batch because final public pricing/truth is
    frozen until the founder-authorized truth pass.
- Safety: no production account, database, payment, provider, deployment, or
  customer state changed. Temporary local server and browser tab were closed.
- Boundary: route-level browser observations remain partial. Human
  screen-reader, keyboard journey, authenticated paid/org data, large-data,
  responsive/reduced-motion, field/CrUX CWV, metadata truth, and complete
  QUAL-WEB-006 acceptance remain open. Public metadata/copy was not changed.

## Count

No checkbox changed. The authoritative private backlog remains **218 checked /
62 unchecked / 280 total (77.9%)**.
