# FINAL-WEB-007 public-home browser qualification · 2026-10-19

**Disposition:** current public browser evidence only; `FINAL-WEB-007` remains
unchecked because field-CWV, human screen-reader, and final acceptance evidence
are still required by the row contract.

## Exact qualification

- **Repository:** `anuragyadav-git/verglos-web`
- **Reviewed source:** Web merge `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
- **Browser:** existing authenticated Chrome owner session, page 4 only; no tab
  or window was created and no state-changing request was issued.
- **URL:** `https://verglos.com/`
- **Audit mode:** Lighthouse navigation audit, desktop and mobile.
- **Scope:** public-home accessibility, best practices, SEO, and agentic
  browsing audits. Performance trace, screen-reader usability, and field-user
  metrics are separate acceptance surfaces.

## Results

| Device | Passed | Failed | Accessibility | Best Practices | SEO | Agentic Browsing |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Desktop | 61 | 0 | 100 | 100 | 100 | 100 |
| Mobile | 60 | 0 | 100 | 100 | 100 | 100 |

Both reports resolved to `https://verglos.com/` and contained no failed audit.
The existing browser tab was restored to the authenticated owner billing page
after the read-only audit.

## Preserved artifacts

The raw JSON and HTML reports are preserved under:
`docs/shipping/evidence/artifacts/final-web-007-lighthouse-2026-10-19/`.

```text
desktop-report.json  sha256:920b2c4f85c2154ef5440dc334c39a84a9c8064b3fc09a83efe82269304c9b3c
desktop-report.html  sha256:9c8f0cf28c847fe6c96ff4272d530399fa1c804ebcf4b30a787506e55ba02d1b
mobile-report.json   sha256:03ef954868ac6024f58fcdce18ee1e6e9288665aebd426c52cca72ec1d90d08d
mobile-report.html   sha256:e632e02e1318f16490781da2829a7ff288de6a32d13eb57818a4035367c6a8a0
```

## Acceptance boundary

This evidence advances `FINAL-WEB-007` only. It does not claim field CWV,
human screen-reader acceptance, large-dataset behavior, provider/customer
acceptance, deployment approval, or AppSec/Hunt qualification. No backlog
checkbox changed; `TEAM-CLI-001` remains checked.

**Score:** **235 checked / 45 open / 280 total (83.9%)**.
