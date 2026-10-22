# ACCEPT-005 Web security-header implementation qualification · 2026-10-22

## Scope

The Web source was qualified again at the exact normal merge head for PR #240
after adding the route-wide security-header baseline. This is owner-controlled
first-party technical evidence only. It is not independent AppSec review,
customer/recipient acceptance, provider acceptance, or a Production release.

- Web source: `/private/tmp/verglos-web-acceptance-20261022`
- Web merged commit: `f20dc426e310557a7693d1e2e18f693663943ce5`
- PR: [#240](https://github.com/anuragyadav-git/verglos-web/pull/240)
- Implementation commit: `7df61c0253751587a7a41b700773ab5e1abca12a`
- Regression commit: `4d28d527780799d8878846ff1138178f0f6cd73e`
- Branch was preserved; merge was a normal merge commit.
- Runtime configuration: telemetry disabled; provenance intentionally
  disabled for this bounded scan.

## Implementation and verification

`next.config.ts` now applies a global CSP scoped to the current Clerk and
Razorpay integrations, `X-Frame-Options`, `X-Content-Type-Options`, HSTS,
`Referrer-Policy`, and `Permissions-Policy`. A contract test covers the header
set and its route-wide attachment, and the test is included in the serial
suite.

- Header contract: **2/2**
- Typecheck: passed
- Production build: passed; **49/49** pages/routes generated
- Truth registry: **35/35**
- Public release smoke: **4/4**
- Landing release contract: **4/4**
- Hosted PR checks: **8/8**

The fresh owner-controlled Web scan exited **0**:

| Target | Findings | Score | Risk | Coverage | Report SHA-256 | Terminal SHA-256 |
| --- | ---: | ---: | --- | --- | --- | --- |
| Web | 21 | 75 | medium | incomplete | `2934834abdec36dd2598aa3293f51ff24c0413858bfa2710907c4fa7a1606752` | `9598e931f2fa879bb3620eba847cfcb3bf5018c4622ad621b257549ca583ddbe` |

The prior Web scan had 22 findings and reported D5-004. The merged-head scan
has no D5-004 finding. The scan still records incomplete coverage because
provenance was skipped; no security or AppSec conclusion is made. Raw reports
remain in the private temporary qualification directory and are not copied
into the ledger.

## Disposition

This closes the identified Web code-side security-header implementation gap,
but does not check ACCEPT-005 or QUAL-WEB-006. ACCEPT-005 still requires the
named external owner's consent, exact authorization, reproducible external
workflow/reconciliation, and fixture/evidence expiry or deletion proof.
QUAL-WEB-006 still requires its human, supported-environment, field-CWV, and
independent/customer acceptance gates. The live score remains **239 checked /
41 open / 280 total (85.4%)**. Nothing was deleted.
