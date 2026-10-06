# License blocker dependency map — 2026-10-06

This is an engineering handoff for legal review, not an approval.

The current lockfile maps the unresolved packages as follows:

| Package | Version/license | Dependency path observed |
| --- | --- | --- |
| `benchmark` | 1.0.0 / ISC | private nested package under `fast-uri@3.1.7`; inventory flags nested-license conflict |
| `glob` | 13.0.6 / BlueOak-1.0.0 | `cacache@20.0.4` and npm transport graph |
| `lru-cache` | 11.5.2 / BlueOak-1.0.0 | `@npmcli/agent@4.0.2`, `cacache@20.0.4`, npm transport graph |
| `minimatch` | 10.2.6 / BlueOak-1.0.0 | `glob@13.0.6` |
| `minipass` | 7.1.3 / BlueOak-1.0.0 | `cacache`, `make-fetch-happen`, `glob`, and npm transport graph |
| `minipass-flush` | 1.0.7 / BlueOak-1.0.0 | `cacache@20.0.4`, `make-fetch-happen@15.0.6` |
| `minipass-pipeline` | 1.2.4 / ISC | `cacache@20.0.4`, `make-fetch-happen@15.0.6`; local package contains ISC license text but inventory cannot establish source metadata |
| `path-scurry` | 2.0.2 / BlueOak-1.0.0 | `glob@13.0.6` |

The package manifests identify the relevant upstream projects as the npm/Isaac
Schlueter package family (`node-glob`, `node-lru-cache`, `minimatch`,
`minipass-*`, and `path-scurry`). The local inventory intentionally keeps all
eight as blockers until a reviewer confirms BlueOak compatibility, nested
license treatment, source availability, attribution/notice obligations, and
whether these transitive packages are redistributed inside the public
archives.

No dependency was silently reclassified, removed, or replaced. Legal approval,
not engineering inference, is required before the release verifier can pass.
