# STUDIO-CLI-001 Preview catalog recheck — 2026-10-21

## Scope and authorization

This is a read-only check of the existing READY Preview deployment to verify
whether a supported numeric Studio entitlement fixture is available. It uses
the owner-authorized Preview path and performs no account, billing, database,
provider, recipient, or Production mutation.

## Exact target and command

- Deployment: `https://verglos-bmrs44bff-anuragyadav20062002s-projects.vercel.app`
- Deployment ID: `dpl_GGagEm4UQ56vYNEua74ButkaP1eh`
- Created: 2026-10-19 18:05:51 IST; state observed as READY.
- Command: `vercel curl /api/v1/entitlement/capabilities --deployment
  https://verglos-bmrs44bff-anuragyadav20062002s-projects.vercel.app`
- Catalog version returned: `2026-10-02.0`.

## Observed response boundary

The public capability response reported `plan=free`, `real_plan=free`,
`active=true`, and `simulated=false`. Its relevant catalog entries were:

| Plan | Status | Purchasable | Records/month | Studio custody capability |
| --- | --- | --- | --- | --- |
| Free | active | no | unset | absent |
| Pro | active | yes | 100 | absent |
| Studio | inactive | no | 2000 | present, but unavailable |
| Enterprise | contracted | no | contracted | present, but not numeric |

This confirms that the existing Preview fixture cannot admit the Studio
client-custody route: the numeric Studio allowance is not an active entitlement,
and the active numeric Pro plan does not contain `white_label_report`.

## Disposition

This strengthens the external blocker for `STUDIO-CLI-001`; it does not close
the row. An approved non-production entitlement fixture or supported payment/
migration qualification is still required, followed by the authorized hosted
receipt and recipient/customer acknowledgement. No deployment, environment,
database, billing, payment, customer, recipient, or AppSec state changed.
