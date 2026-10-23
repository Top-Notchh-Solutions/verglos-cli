# ACCEPT-012 public OSS finding triage · 2026-10-23

## Implementation and run

The private toolchain now exposes `acceptance:corpus:triage` through
`scripts/triage-public-oss-corpus.mjs`. It consumes the exact verification
manifest produced by `verify-public-oss-corpus.mjs`, classifies every observed
finding as an unadjudicated observation, aggregates rule-level product
feedback, and records coverage gaps without copying report snippets, source
paths, credentials, or customer data.

```text
node scripts/triage-public-oss-corpus.mjs \
  /Users/anuragyadav/Developer/TopNotchh-Workspace/.local-evidence/public-oss-corpus-2026-10-23/verification.json \
  /tmp/verglos-public-oss-triage-2026-10-23-v3.json
```

The exact six-fixture run produced:

- **207** observed findings;
- **19** rule-level feedback groups;
- **0** coverage gaps; and
- `adjudicationStatus: open`, `customerAcceptance: not-claimed`, and
  `independentReview: required`.

Triage output SHA-256:

```text
83b429554405298592249132ec79dcba7a32d8324f629d70df3c951ea1b977af  verglos-public-oss-triage-2026-10-23-v3.json
```

## Verification and boundary

The focused triage suite passed **3/3**; syntax validation and diff check
passed. Every finding is explicitly marked `unadjudicated-observation` with
the action `reproduce-and-review-detector-precision-before-product-change`.
This records product feedback candidates without asserting that any observed
finding is a confirmed vulnerability or customer result.

`ACCEPT-012` remains open for its `ACCEPT-011`/`QUAL-CLI-006` dependencies,
held-out correction/acceptance work, and final review. No provider, Production,
customer, or release state changed, and nothing was deleted.
