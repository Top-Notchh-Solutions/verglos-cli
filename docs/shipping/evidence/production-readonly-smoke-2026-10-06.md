# Production read-only smoke — 2026-10-06

Read-only requests to `https://verglos.com`:

- `/` — HTTP 200, HTML.
- `/checkout` — HTTP 200, private no-store HTML.
- `/docs` — HTTP 200, HTML.
- `/api/v1/entitlement/capabilities` — HTTP 200, private no-store JSON.

The unauthenticated capability response reports `plan=free`, `real_plan=free`,
`simulated=false`, catalog `2026-10-02.0`, and the complete server catalog:
Pro is active/purchasable with INR pricing; Team and Studio are inactive and
Enterprise is contracted. This is consistent with the current production
truth and explains why only Pro is offered in checkout. No credentials,
cookies, payment identifiers, or response secrets were recorded. No write,
checkout creation, migration, or deployment occurred.
