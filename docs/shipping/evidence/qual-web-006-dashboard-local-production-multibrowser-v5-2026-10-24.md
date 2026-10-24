# QUAL-WEB-006 local production-build multi-browser qualification v5 · 2026-10-24

## Bound execution

- Web source under test: merged PR #280 implementation `21f9cfb`.
- Server: local `next start` production build, served on loopback with the
  Preview-only authenticated capture seam enabled.
- Database: fresh local PostgreSQL 16 container
  `verglos-qual-web-006-local-20261024`, migrated through the repository's
  reviewed migration path. The owner-controlled synthetic organization
  `qual-web-006-synthetic-20261024` was seeded additively with 100 rows per
  dashboard dataset; no existing row was overwritten or deleted.
- Browsers: Chromium and Firefox; desktop 1440×900 and mobile 390×844;
  reduced motion enabled.
- Capture shape: 13 authenticated dashboard routes × ready desktop/mobile,
  loading desktop, and error desktop = **52 measurements per browser**.

## Results

Both browser captures passed `pnpm qualify:dashboard-release` with **zero
source issues and zero decision gaps**.

| Browser | TTFB max | FCP max | LCP max | INP max | CLS max | Axe | Ready rows | State announcements |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Chromium | 113.2 ms | 140 ms | 356 ms | 24 ms | 0 | 0 | 100 on 26/26 | loading 13/13, error 13/13 |
| Firefox | 41 ms | 130 ms | 366 ms | 40 ms | 0 | 0 | 100 on 26/26 | loading 13/13, error 13/13 |

The browser captures also reported keyboard operability, screen-reader
landmarks, responsive layout, and reduced-motion compliance for every
measurement. Raw captures are retained as:

- `qual-web-006-dashboard-synthetic-2026-10-24-v5.json`, SHA-256
  `18d2bca663bbd12c0a6eb34cc3ca6b291152bdaffc546722730d6fe6f31a6c5e`;
- `qual-web-006-dashboard-synthetic-2026-10-24-v5-firefox.json`, SHA-256
  `b3ee471b87c0cd77a313aa11bb430292a1457651cfd671f6c90e99dcbd9419d9`.

## Boundary

This closes the local automated implementation/qualification portion of
QUAL-WEB-006 for Chromium and Firefox. It does not claim a human screen-reader
review, field CWV/real-user data, independent review, or final release
acceptance. A separate WebKit headless attempt remains unclaimed because its
runtime did not expose an INP observation for the first route; the strict
qualifier correctly rejected that incomplete capture.

No GitHub Actions run, paid provider workflow, customer repository, customer
data, payment, Production database write, publication, deletion, or final npm
release was used.
