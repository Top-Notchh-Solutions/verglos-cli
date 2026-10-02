# Public route accessibility/lab sweep · 2026-10-02

- **Method:** Existing Chrome remote-debugging session, read-only CDP. A temporary tab in the same browser loaded each public route and was closed afterward. No credentials, cookies, response bodies, or user identity were recorded.
- **Routes:** `/`, `/checkout`, `/docs`, `/detectors`, `/verify`.

| Route | Main | Focusables | Horizontal overflow | AX nodes | Selected roles | DOMContentLoaded − navigation start |
|---|---:|---:|---:|---:|---|---:|
| `/` | 1 | 57 | no | 1900 | banner, navigation, main, contentinfo, table, heading, link, button | 0.216s |
| `/checkout` | 1 | 4 | no | 53 | main, tablist, tab, heading, button, link | 0.434s |
| `/docs` | 1 | 85 | no | 1258 | banner, complementary, navigation, main, table, heading, link, button | 0.214s |
| `/detectors` | 1 | 2 | no | 317 | main, sectionheader, list, heading, link | 0.227s |
| `/verify` | 1 | 1 | no | 61 | main, sectionheader, heading, link, code | 0.547s |

These are lab accessibility-tree and DOM measurements, not field Core Web Vitals and not a human screen-reader review. The organization dashboard remains untested because the authenticated account has no organizations.
