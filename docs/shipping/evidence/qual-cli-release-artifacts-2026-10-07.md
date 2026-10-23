# CLI release-artifact qualification — 2026-10-07

- **Source:** CLI worktree commit `ad6ee14` (`2.0.0-alpha.1`); the build was
  regenerated from source before packaging so ignored `dist` output could not
  contaminate the result.
- **Build:** `pnpm build` completed successfully for all eight workspace build
  tasks.
- **Package surface:** `pack-public-packages.mjs` produced exactly six public
  archives. `check-packed-manifests.mjs` passed; no forbidden public paths or
  unresolved workspace dependencies were found.
- **Clean consumer:** The six archives installed into an isolated consumer,
  all libraries imported, `Verglos 2.0.0-alpha.1` executed, and no external
  engine was installed implicitly.
- **Release assembly:** A temporary release directory contained the six
  archives, `THIRD_PARTY_NOTICES`, CycloneDX SBOM, SPDX SBOM,
  `dependency-license-inventory.json`, clean-consumer output, and
  `SHA256SUMS` (12 files total). Checksum generation completed.
- **Remaining verifier result:** `verify-release-artifacts.mjs` correctly
  failed only because the inventory has eight unresolved redistribution
  blockers: the nested `benchmark`/`fast-uri` license conflict, six BlueOak
  package reviews (`glob`, `lru-cache`, `minimatch`, `minipass`,
  `minipass-flush`, `path-scurry`), and missing source metadata for
  `minipass-pipeline`. These require legal/provenance review and were not
  bypassed.
- **Acceptance boundary:** Mechanical packaging is qualified, but LIC-002,
  LIC-003, DIST-001, DIST-002, DIST-003, and final publication remain open. No
  npm publish, tag, deployment, production, or credential operation occurred.

## Current-source follow-up

- After the release rebuild, `pnpm test` completed 12/12 workspace tasks with
  no failed task, and `pnpm typecheck` completed 13/13 workspace tasks with no
  failed task.
- These results strengthen the source/release-candidate evidence but do not
  change the eight-item legal/provenance blocker list or the acceptance count.
