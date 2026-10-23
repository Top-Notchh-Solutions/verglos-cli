# Authenticated account Lighthouse mobile audit — 2026-10-06

Page: `https://verglos.com/account`, authenticated production session.

- Accessibility: **100**
- Best Practices: **100**
- SEO: **58**
- Agentic Browsing: **67**
- Passed audits: 45; failed audits: 3

The three SEO failures are `is-crawlable`, `canonical`, and `llms-txt` on the
authenticated account route. This is an intentional private account surface,
not a public search landing page; no marketing or metadata change was made.
The audit does not replace field-CWV or human screen-reader evidence.
