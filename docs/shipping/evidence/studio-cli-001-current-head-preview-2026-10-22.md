# STUDIO-CLI-001 current-head Preview boundary check — 2026-10-22

## Scope and authorization

This is a bounded read-only check of the owner-authorized exact-head Web
Preview. It verifies deployment readiness and public capability/auth
boundaries; it does not bypass Vercel protection or mutate billing, provider,
customer, Production, or database state.

## Exact source and deployment

- Web source: `cb2302179533a7bc73eccbcb17b0c350685cc5cc`
- Deployment: `dpl_49e1epaupXTR86hPjocf5m6Dkx4h`
- URL: `https://verglos-n7abjmokk-anuragyadav20062002s-projects.vercel.app`
- Deployment state: Ready; the remote build generated **49/49** static pages.
- Public `/docs` returned the documentation page successfully.
- The client-workspace route returned `{"ok":false,"reason":"authentication required"}` without credentials. Existing-tab navigation to protected `/orgs` reached the Vercel login/protection boundary; no bypass was used.

## Capability response

The public capability response returned catalog version `2026-10-02.0`,
current entitlement `plan=free`, `real_plan=free`, `active=true`, and
`simulated=false`. Free was active; Pro was active and purchasable with
100 records/month but no `white_label_report`; Studio was inactive and not
purchasable with 2,000 records/month and 20 clients; Enterprise was
contracted with contracted limits.

This confirms the deployment boundary but does not provide the approved
numeric non-production Studio entitlement or an authorized recipient/customer
acceptance artifact. `STUDIO-CLI-001` remains unchecked. No deployment,
provider, payment, customer, recipient, Production, legal, registry, or
AppSec state changed.
