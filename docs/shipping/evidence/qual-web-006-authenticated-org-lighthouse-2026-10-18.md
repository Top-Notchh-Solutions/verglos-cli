# QUAL-WEB-006 authenticated organization dashboard qualification — 2026-10-18

## Scope

This is a read-only qualification of the existing authenticated Chrome page
3 at `https://verglos.com/orgs/top-notchh-solutions/home`. It used the
existing owner session, opened no window or tab, and made no application,
billing, provider, database, or Production write.

## Results

- Lighthouse snapshot, desktop: Accessibility **100**, Best Practices
  **100**, SEO **100**, Agentic Browsing **100**; **32 passed / 0 failed**.
- Lighthouse snapshot, mobile: Accessibility **100**, Best Practices **100**,
  SEO **100**, Agentic Browsing **100**; **32 passed / 0 failed**.
- Reload performance trace, desktop: lab LCP **853 ms**, CLS **0.00**;
  network and CPU throttling were disabled.
- CrUX field data: unavailable for this authenticated organization route.

The dashboard snapshot exposed a skip link, named organization navigation and
main content landmarks, the Owner role, two application rows, and bounded
empty-state release/exception messages. No source, policy document, cookie,
license key, or private credential was recorded.

## Preserved artifacts

- `qual-web-006-authenticated-org-lighthouse-2026-10-18-desktop.json`
  SHA-256 `bce8304a274b1ad093df560f4763ea6cb99522a5196a78ad6177fa5e5166460f`
- `qual-web-006-authenticated-org-lighthouse-2026-10-18-mobile.json`
  SHA-256 `78c47b00def58c1ccdf1735e2ff856f30567b9c7fdf4c8412520cbb446ff2771`

## Disposition

This advances `QUAL-WEB-006` only. It does not replace human screen-reader
testing, large-dataset interaction evidence, field Core Web Vitals, or
independent/customer acceptance. Keep the row unchecked until those contracts
are satisfied. No AppSec status changed; the Hunt-held rows remain parked.
