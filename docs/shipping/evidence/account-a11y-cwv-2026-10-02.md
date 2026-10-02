# Authenticated account accessibility/performance evidence

Date: 2026-10-02
Surface: `https://verglos.com/account`
Deployment: Web commit `89056c3a0114e10c505110fb36ef50130d148280`, Vercel deployment `dpl_9ogo3RhLmyvDiPueWDM2HBLHN9B3`
Browser: existing authenticated Chrome session via Chrome DevTools MCP

## Results

- Desktop Lighthouse navigation: Accessibility 100, Best Practices 100.
- Mobile Lighthouse navigation: Accessibility 100, Best Practices 100.
- Desktop performance trace: LCP 551 ms, CLS 0.00, TTFB 89 ms, render delay 462 ms; no CrUX field data exists for this route.
- Accessibility snapshot exposed a `main` landmark, persistent navigation, account identity, plan state, and a live alert region.

## Defect corrected

Before Web PR #126, Lighthouse identified the `SIGNED IN AS` label at 4.15:1 against the account card background (10px text; required 4.5:1). Commit `f66d32b` raised the text opacity from `/45` to `/55`; the merged production deployment above re-audited at Accessibility 100.

## Boundary

This evidence covers the legacy authenticated `/account` surface only. It does not qualify the organization dashboard, screen-reader traversal, reduced-motion behavior, large datasets, or complete field Core Web Vitals; QUAL-WEB-006 remains open. SEO failures on this authenticated noindex route are expected and are not treated as public discoverability claims.
