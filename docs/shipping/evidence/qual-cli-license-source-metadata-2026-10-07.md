# CLI license-source metadata follow-up — 2026-10-07

- **Source:** CLI PR #73, tested head `d34ac4f`, based on `origin/main`
  `c1f1cd7`, merged to `origin/main` as `d63bf7a07c4dc421096b44593cd996aef40320d2`.
- **Change:** Adds an exact-version provenance override for
  `minipass-pipeline@1.2.4`, whose installed manifest omits repository
  metadata. The override is HTTPS-only and points to the upstream repository
  recorded by the npm registry metadata for that immutable version.
- **Safety:** The override is metadata only. It does not change the license
  classifier, legal-review policy, nested-component conflict handling, or
  `--require-clear` behavior.
- **Verification:** `node --test scripts/license-inventory.test.mjs` passed
  6/6; `pnpm test` passed 12/12 workspace tasks; `pnpm typecheck` passed
  13/13 tasks. The inventory contains 254 lockfile package versions and one
  nested component, with seven remaining review blockers. `--require-clear`
  exits 2 as expected.
- **Remaining blockers:** `benchmark@1.0.0` nested license conflict and six
  BlueOak-1.0.0 legal reviews (`glob`, `lru-cache`, `minimatch`, `minipass`,
  `minipass-flush`, `path-scurry`). No blocker was suppressed.
- **Hosted state:** PR #73 merged after all hosted checks passed: Ubuntu,
  macOS, and Windows Node 20/22/24 matrix cells, self-scan run
  `37554811352`, and in-toto release binding in run `37554811372`. No npm
  publication or release tag was created.
- **Install limitation:** A fresh macOS-only pnpm install did not link
  foreign-platform optional manifests, so the focused inventory/SBOM test was
  rerun against the already-qualified local dependency store. The inventory
  completeness check was not weakened; hosted platform jobs remain the
  authoritative cross-platform check.
- **Boundary:** No production, database, payment, provider, deployment, npm
  publication, or credential write occurred. Backlog remains **218 checked /
  62 unchecked / 280 total**.
