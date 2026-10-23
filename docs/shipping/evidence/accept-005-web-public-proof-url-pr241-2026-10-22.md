# Web public-proof URL boundary qualification · 2026-10-22

## Scope

The public proof URL validator was tightened and merged through PR #241. The
validator now uses explicit value identity checks while preserving the same
HTTPS-only, credential-free, query-free contract. This is owner-controlled
first-party technical evidence only; it is not independent AppSec review,
customer/recipient acceptance, provider acceptance, or a Production release.

- Web source: `/private/tmp/verglos-web-public-proof-merged-20261022`
- Web merged commit: `02f5aba95c4172255cc522730c6ffecc1598cbda`
- PR: [#241](https://github.com/anuragyadav-git/verglos-web/pull/241)
- Implementation commit: `ff50b24cb03cea8148b0ba2dd593bec7a1418c71`
- Regression commit: `d7f4ce77b67160daa7aabc4ff264dbde5de3ed82`
- Branch was preserved; merge was a normal merge commit.

## Verification

- Public proof URL contract: **3/3**
- Public release smoke: **4/4**
- Typecheck: passed
- Production build: passed; **49/49** pages/routes generated
- Hosted PR checks: **8/8**

The exact merged-head owner-controlled Web scan exited **0**:

| Target | Findings | Score | Risk | Coverage | Report SHA-256 | Terminal SHA-256 |
| --- | ---: | ---: | --- | --- | --- | --- |
| Web | 20 | 81 | medium | incomplete | `98c1ae65f0b613ec07652f4d8e71bfff1548a61e656b79edb6fc8f3615cd8ce0` | `c24d89a705ba2c4b1c76c09a19f45384a412e3a4810a66be7abf089384d2dbea` |

The merged-head scan reports neither AUTH-003 nor D5-004. Coverage remains
incomplete because provenance was intentionally skipped; no security or AppSec
conclusion is made. Raw reports remain private and are not copied into the
ledger.

## Disposition

This advances the code-side public-proof implementation mapped to FINAL-WEB-006
and the Web secure-default qualification. It does not check FINAL-WEB-006,
QUAL-WEB-006, or ACCEPT-005; their customer, human, field, independent, and
final acceptance gates remain open. The live score remains **239 checked / 41
open / 280 total (85.4%)**. Nothing was deleted.
