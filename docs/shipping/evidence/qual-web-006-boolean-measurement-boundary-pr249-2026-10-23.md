# QUAL-WEB-006 strict measurement types · Web PR #249 · 2026-10-23

## Implementation

Public `verglos-web` source commit `f01717a` makes the accessibility/performance
qualifier require literal booleans for keyboard operability, screen-reader
landmarks, and reduced-motion support. Truthy strings or other malformed JSON
values now fail closed with explicit measurement breaches instead of passing
JavaScript truthiness checks.

PR #249:

<https://github.com/anuragyadav-git/verglos-web/pull/249>

## Local verification

- Focused quality suite: **23 passed / 0 failed**.
- Full serial Web suite: **898 passed / 24 documented skips / 0 failures**.
- Typecheck: passed.
- Production build: **49/49 routes** generated.

## Hosted boundary and disposition

Hosted run `39847435687` has Ubuntu, Windows, and isolated PostgreSQL jobs
failed with `runner_id: null`, no runner name, and zero steps; run
`39847435658` typecheck/schema likewise failed with zero steps. macOS and Vercel
were pending at capture; GitGuardian and Vercel Preview Comments passed. No
hosted repository qualification is claimed, and no rerun, bypass, or
merge-around was attempted.

This is substantive repository-owned `QUAL-WEB-006` implementation progress.
The row remains unchecked for human screen-reader review, supported-browser
and field-CWV evidence, large-dataset qualification, independent review,
acceptance, and final release sign-off. Score remains **239 checked / 41 open /
280 total (85.4%)**. No database, provider, customer, Production, or
deployment action occurred; nothing was deleted.
