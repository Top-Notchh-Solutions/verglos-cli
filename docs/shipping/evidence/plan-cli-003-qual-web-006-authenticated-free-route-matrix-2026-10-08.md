# Authenticated Free-account route matrix · 2026-10-08

## Scope

Bounded read-only Chrome DevTools run using the existing authenticated
production browser session. No checkbox, license, organization, payment,
privacy request, database row, or deployment state was changed.

## Results

- `/account` rendered the signed-in account as Free with no license key.
- `/account/history`, `/account/activations`, `/account/monitoring`, and
  `/account/alerts` redirected to `/account` behind the paid-plan fence.
- `/account/privacy` rendered the deletion explanation and disabled request
  control until explicit consent. Its authenticated `GET /api/v1/account/deletion`
  returned HTTP 200 with `Cache-Control: private, no-store` and zero requests.
- `/orgs` rendered the safe empty state `No organizations yet`; no tenant
  membership or organization was created.
- The tested pages emitted no console warnings or errors.

## Disposition

This proves only the current Free-account auth/plan boundary and privacy-read
projection. It does not qualify paid organization dashboards, tenant list /
search / export / private-record behavior, modified authenticated CLI calls,
or account-deletion execution. `PLAN-CLI-003` and `QUAL-WEB-006` remain open.
No backlog checkbox changed; backlog remains **218 checked / 62 unchecked /
280 total (77.9%)**.
