# Studio handoff nullable acknowledgement digest · Web PR #300 · 2026-10-24

## Scope

This packet records a client-side handoff-history contract correction. It is
implementation and provider/Production evidence only. It does not claim
recipient acknowledgement, customer acceptance, independent review,
AppSec/Hunt review, field performance, or final release sign-off.

## Implementation

- Pull request: `https://github.com/anuragyadav-git/verglos-web/pull/300`.
- Implementation commit: `dadfd5150b7ca1183f02c778bc7c113c90bb492b`.
- Normal merge commit: `069d4a2c4937c0e72eddbe22c0aa657d683bbc14`.
- Defect: the Studio handoff parser declared an acknowledgement digest as
  nullable but rejected an explicit `null`, which could filter a valid issued
  and not-yet-acknowledged receipt from the history view.
- Fix: `null` and omission are accepted for an unacknowledged receipt while
  actual acknowledgement digests retain the bounded SHA-256 validation.

## Verification

- Focused handoff/dashboard contracts passed **35/35**.
- Web typecheck passed.
- `git diff --check` passed.
- No customer, recipient, or Production database data was changed.

## Provider boundary

The merged Web commit reached Vercel Production:

- Deployment: `dpl_GszPddwswnPS7sD8mcgCMkLJqzYJ`.
- URL: `https://verglos-osdrrv297-anuragyadav20062002s-projects.vercel.app`.
- State: **READY**, target `production`.
- Read-only matrix: canonical `verglos.com` **6/6 HTTP 200**; `www` **6/6
  HTTP 308**; exact deployment hostname **6/6 HTTP 302** behind Vercel SSO.
- No GitHub Actions rerun was started for this change.

`STUDIO-CLI-001` remains unchecked for authorized recipient acknowledgement,
independent review, customer acceptance, and final release evidence. Score
remains **246 checked / 34 open / 280 total (87.9%)**, split **13
AppSec-dependent / 21 non-AppSec**. Nothing was deleted or overwritten.
