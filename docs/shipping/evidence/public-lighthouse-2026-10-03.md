# Public Verglos production Lighthouse evidence — 2026-10-03

This is a read-only lab run against the deployed public site. It is not field
CrUX data, authenticated-dashboard evidence, or a substitute for human
screen-reader review. The run used the installed Google Chrome binary and
Lighthouse's default mobile-style lab emulation; network variance is expected.

| URL | Performance | Accessibility | Best Practices | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `https://verglos.com/` | 100 | 97 | 100 | 1.3 s | 0 | 70 ms |
| `https://verglos.com/checkout` | 78 | 100 | 100 | 4.3 s | 0 | 220 ms |
| `https://verglos.com/detectors` | 84 | 100 | 100 | 4.0 s | 0 | 120 ms |
| `https://verglos.com/docs` | 81 | 100 | 100 | 4.4 s | 0 | 120 ms |

The checkout response was unauthenticated (`x-clerk-auth-status: signed-out`)
and exposed the verified Pro INR catalog with monthly and annual cadence only;
Team, Studio, and Enterprise are not purchasable checkout offers in this
deployment. That is consistent with the server catalog boundary and is not
evidence that those plans are commercially activated.

These measurements support public lab regression tracking only. QUAL-WEB-006
and FINAL-WEB-007 remain open for authenticated organization-dashboard runtime,
human screen-reader review, large datasets, and complete field-CWV evidence.
