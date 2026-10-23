# CLI license inventory and public-package qualification — 2026-10-06

- Source: pinned CLI worktree `955412516b96cc09393e78c43bf7d02b9abd05d9`.
- Dependency inventory: `pnpm licenses:inventory` passed with schema
  `1.2.0`; 254 lockfile packages and 250 package entries were inspected.
- Inventory correctly reports **8 review blockers**: nested `benchmark` license
  conflict, BlueOak-licensed `glob`, `lru-cache`, `minimatch`, `minipass`,
  `minipass-flush`, and `path-scurry`, plus source-missing `minipass-pipeline`.
  These remain legal/release review work, not silently accepted licenses.
- Public packaging: `node scripts/pack-public-packages.mjs` produced all six
  current `2.0.0-alpha.1` archives (`verglos`, `shared`, `scanner`,
  `reporter`, `mcp`, `entitlement`).
- Archive inspection: all six include `package/THIRD_PARTY_NOTICES`; no archive
  contained private-key patterns, test-file entries, or `cli-fixture` paths.
  SHA-256 values:
  - `verglos`: `5a98979fdeb813447096a69070caa134f766083d8f7b8a8ae4bc85e1349642a6`
  - `verglos-entitlement`: `a8bbbc4cc6511348620cd4f3c9e686f33415a7b6daee35a267da581c34d3e346`
  - `verglos-mcp`: `f399a2536357fbb88cb9aeece74fac0fcbe4cb1e96420daf66669059560b95f1`
  - `verglos-reporter`: `e5b875ce8a159c021c86fe99c0e965c76ff55c45d8e8574ba3c89e14bf02c65b`
  - `verglos-scanner`: `bd5ec859ea85d8eaf73b70e4429357240f501bd35a2960620690a580e0851d8b`
  - `verglos-shared`: `f4114e176e1b86607c77f903bfcd2c7b796132246ed4dc784a1b23452232cd6a`

This is preparatory distribution evidence. LIC-002/003, DIST-001/002/003,
trusted publishing, independent legal review, and final release gates remain
open because the inventory blockers are unresolved.
