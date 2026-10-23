# DIST-006 rollback-input hardening · CLI PR #169 · 2026-10-23

## Implementation

Public `verglos-cli` source commit `4e06080904df4f4382f3de8b5d9af19839786010`
hardens the rollback-plan and rollback-rehearsal input boundary. The CLI now
opens validated regular files, rechecks file identity and size through the
opened handle, bounds the read, and rejects symlinked/non-regular inputs. The
regression contract covers both rollback references and rehearsal manifests.

PR #169 merged normally into `main` as merge commit
`50073bdf557a1e649352148c55e15b48037bb7fa`:

<https://github.com/Top-Notchh-Solutions/verglos-cli/pull/169>

## Verification

- Focused rollback suite: **7 passed / 0 failed**.
- CLI typecheck: passed.
- Full CLI package test command: exited **0**.
- Monorepo build: **8/8** tasks passed.
- Required hosted PR checks: **12/12 passed**, including all Ubuntu/macOS/Windows
  Node 20/22/24 cells, official validators, self-scan, and in-toto binding.
- Merge mode: normal merge commit; no squash, rebase, force push, or branch
  deletion.

## Boundary and disposition

This is substantive repository-owned DIST-006 implementation evidence. It does
not claim authenticated npm/registry, engine-feed, signing-identity, or Web
deployment rollback/revocation; provider execution, Production action,
customer/recipient acceptance, independent review, and final release mapping
remain open. The `DIST-006` backlog checkbox is therefore unchanged. Score
remains **239 checked / 41 open / 280 total (85.4%)**. No file, record,
database, provider, customer, deployment, or release state was deleted or
changed.
