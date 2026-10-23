# TEAM-CLI-001 policy fetch/cache integration — 2026-10-06

CLI PR #63 (`390b0c0`) merged as `04b48fbd0b8d19707589889cf37bf8c10aff60d9`.

The CLI now has a bounded authenticated policy fetch path that:

- limits response bytes and request time;
- verifies the existing organization/repository-bound signed envelope;
- writes only verified remote policy data through the atomic regular-file cache;
- resolves an unexpired verified cache explicitly in offline mode; and
- exposes `verglos policy organization fetch` with explicit trusted-key and
  cache paths and machine-readable output that omits credentials and policy
  contents.

Verification: focused fetch/cache tests 4/4, CLI typecheck, CLI build, and
diff check passed locally. Hosted platform matrix run `37454137213` passed all
nine Ubuntu/macOS/Windows × Node 20/22/24 cells; Self-scan `37454137272` and
in-toto binding passed.

TEAM-CLI-001 remains unchecked. The deployed Web policy endpoint, production
activation, and hosted SCM/provider integration evidence are still absent. No
production or database write occurred.

