# PLAN-CLI-003 · isolated Preview fixture organization — 2026-10-10

## Scope

This is a bounded authenticated Preview qualification slice for the
modified/untrusted-client backlog item. It used the existing isolated Preview
database and the explicit Preview-only test-auth seam. Production was not
used.

## Configuration repair

- A duplicate Preview auth-secret configuration was found: one entry was
  branch-scoped and one was general.
- The branch-scoped duplicate was removed and one general Preview-only secret
  was installed. No Production environment variable was changed.
- A new Preview deployment reached `READY` after the correction. The Vercel
  build passed the Preview runtime-config check, TypeScript build, and 47-page
  Next build.
- The raw secret, Vercel protection bypass, cookies, and personal identifiers
  were not recorded.

## Hosted results

- Authenticated `GET /account` returned HTTP 200.
- Authenticated `GET /api/v1/organizations` returned HTTP 200 with an empty
  directory before setup.
- A same-origin authenticated `POST /api/v1/organizations` created exactly one
  bounded acceptance organization in the isolated Preview database and
  returned HTTP 201.
- Authenticated capability projection returned `plan=free`, `real_plan=free`,
  `simulated=false`, and the current catalog version. The catalog's Pro entry
  is purchasable, but this fixture has no paid license.

## Disposition

This advances `PLAN-CLI-003` with a real authenticated organization fixture and
proves the Preview-only write boundary. It does **not** close the item: a paid
entitlement fixture and the complete modified-client list/search/export/
public-private runtime matrix are still required. No Production payment,
database, migration, entitlement, account, or customer-data write occurred.

Score remains **219 checked / 61 unchecked / 280 total (78.2%)**.
