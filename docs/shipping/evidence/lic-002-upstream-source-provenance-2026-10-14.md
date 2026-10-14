# LIC-002 upstream source provenance recheck — 2026-10-14

## Scope and boundary

This private record strengthens source provenance for the seven automated
LIC-002 blockers observed at CLI merge
`ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`. It records immutable upstream
source URLs and observations only. It is not legal advice, redistribution
permission, trademark clearance, or a reviewer decision.

## Exact source mapping

| Inventory item | Exact version | Upstream source | Observation status |
| --- | --- | --- | --- |
| `glob` | `13.0.6` | https://github.com/isaacs/node-glob/blob/v13.0.6/LICENSE.md | Tagged license page observed; declares Blue Oak Model License 1.0.0 for the project remainder and points recipients to the canonical license URL. |
| `lru-cache` | `11.5.2` | https://github.com/isaacs/node-lru-cache/blob/v11.5.2/LICENSE.md | Tagged license page observed; Blue Oak Model License 1.0.0 and notice/link obligation observed. |
| `minimatch` | `10.2.6` | https://github.com/isaacs/minimatch/blob/v10.2.6/LICENSE.md | Tagged license page observed; Blue Oak Model License 1.0.0 and notice/link obligation observed. |
| `minipass` | `7.1.3` | https://github.com/isaacs/minipass/blob/v7.1.3/LICENSE.md | Tagged license page observed; Blue Oak Model License 1.0.0 and notice/link obligation observed. |
| `minipass-flush` | `1.0.7` | https://github.com/isaacs/minipass-flush/blob/v1.0.7/LICENSE.md | Exact source URL recorded, but the upstream page was not retrievable in this recheck; remains unverified. |
| `path-scurry` | `2.0.2` | https://github.com/isaacs/path-scurry/blob/v2.0.2/LICENSE.md | Tagged license page observed; Blue Oak Model License 1.0.0 and notice/link obligation observed. |
| nested `benchmark` under `fast-uri` | `1.0.0` | https://raw.githubusercontent.com/fastify/fast-uri/v3.1.7/benchmark/package.json | Exact package metadata observed: `private: true` and `license: ISC`; this does not decide whether the nested component is distributed or how the containing package terms apply. |

Canonical Blue Oak references:

- https://blueoakcouncil.org/license/1.0.0
- https://blueoakcouncil.org/list

The local inventory's license-file digests and dependency paths remain the
authoritative identifiers for the installed snapshot:
`docs/shipping/legal/transitive-license-review-2026-10-08.md`.

## What this does not prove

The source pages do not by themselves determine Verglos's intended
redistribution treatment, required notices for the exact archives, source or
modification obligations, trademark wording, the nested-component package
boundary, or whether any external engine/fixture/recipe is included. Those
questions remain in the legal review addendum and require an authorized
decision against the exact release artifacts.

No BlueOak allowlist, source override, nested-component suppression, package
publication, registry operation, or release decision was performed.

## Acceptance disposition

`LIC-002` remains unchecked. The exact inventory still reports seven review
blockers, and the legal addendum has no completed decision, scope, conditions,
signature/verifiable reference, or date. No package, provider, database,
customer, Production, deployment, npm, or release state changed. Score
remains **230 checked / 50 unchecked / 280 total (82.1%)**.
