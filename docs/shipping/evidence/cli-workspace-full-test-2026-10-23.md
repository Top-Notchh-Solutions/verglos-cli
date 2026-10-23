# CLI workspace full test · 2026-10-23

- Checkout: `verglos-cli-private-shipping`, branch
  `local/private-shipping-ledger` at the merged shipping-ledger state.
- Preparation: `pnpm install --frozen-lockfile` completed successfully and
  restored all workspace links.
- Command: `pnpm test` (`turbo run test`).
- Result: **13/13 Turbo tasks successful**, **0 failed tasks**, completed in
  **1m14.252s**.
- The standard suite reports explicit skips for Docker Hunt integration tests
  that require `VERGLOS_HUNT_DOCKER_INTEGRATION=1` and a pinned test image;
  those skips are not treated as passing adversarial host evidence.

This is local repository test evidence. It does not claim hosted CI,
independent AppSec review, provider/Production action, customer acceptance,
publication, or final release sign-off.
