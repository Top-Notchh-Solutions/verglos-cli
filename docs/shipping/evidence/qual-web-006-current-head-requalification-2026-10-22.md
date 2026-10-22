# QUAL-WEB-006 current merged-head requalification · 2026-10-22

## Verification

Exact merged Web head `02f5aba95c4172255cc522730c6ffecc1598cbda` passed the
current accessibility/performance/truth contract set **66/66** with zero
failures. The source public-release smoke passed with **16 routes**, **22/22
publishable claims**, **2 proof assets**, and **0 issues**. The contracts cover
keyboard/landmark and reduced-motion boundaries, bounded desktop/mobile CWV
qualification, malformed/non-finite measurement refusal, canonical public
claims, metadata/truth surfaces, and stale/ambiguous route refusal.

The direct landing qualifier was not claimed as browser evidence: when called
without an explicit browser capture it correctly exited **2** with its usage
guard. Existing browser-produced and hosted evidence remains separately
tracked; no new browser capture, field-CWV result, or human screen-reader
acceptance was invented.

## Disposition

`QUAL-WEB-006` remains unchecked for browser-produced supported-environment
coverage, human screen-reader acceptance, large/complete dashboard states,
field CWV, independent review, and final acceptance. No database, provider,
Production, customer, or AppSec state changed. Nothing was deleted.

Current score: **239 checked / 41 open / 280 total (85.4%)**.
