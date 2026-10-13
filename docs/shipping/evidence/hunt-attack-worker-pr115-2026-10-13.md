# HUNT Attack Worker contribution evidence · PR #115 · 2026-10-13

## Identity and publication

- Public repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: [#115](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/115)
- Feature branch: `codex/hunt-attack-worker-2026-10-13`
- Source commit 1: `c24f3555c7533139cf2a050aa38760fa30d961b4`
  (`feat(hunt): connect hypotheses to bounded workers`)
- Source commit 2: `8ac34aa7baf9d0376731612de98339e296759826`
  (`feat(cli): expose approved hypothesis worker execution`)
- Regular merge commit: `e726dacce46fda46024f38e0c68005dcadcd5eb5`
- Merge parents: `6ff8c6cb3157077b3eeb6b2ca5f9754cc1f9360e` and
  `8ac34aa7baf9d0376731612de98339e296759826`
- Publication: pushed to `origin` and merged with GitHub's regular merge
  strategy. No squash merge, force-push, npm publish, or final release was
  performed.

## Implemented contract slice

The public implementation connects the exact Scout-to-Attack-Hypothesis
document to one bounded Attack Worker run:

- `parseHuntAttackHypothesis` now verifies the SHA-256 digest over canonical
  unsigned hypothesis content before execution.
- `runSupportedHuntAttack` requires the exact `hunt.critical` entitlement,
  supported hypothesis, signed/trusted catalog recipe, exact target subject,
  finding, rule, optional location/line/severity, approval receipt, and
  observation binding.
- The worker compares the hypothesis playbook to the fixed public bounded
  catalog and selects only the registered restricted-process or pinned Docker
  adapter. Caller-provided commands, shell text, payloads, and model-created
  recipes are not accepted.
- The CLI exposes `verglos hunt worker <hypothesisPath>` with bounded JSON
  reads, required report/recipe/trust/approval/observation inputs, the existing
  capability gate, structured machine output, and fail-closed exit behavior.
- The returned projection contains the bound identities and bounded outcome;
  source contents, fixture inputs, project roots, and finding bodies are not
  emitted. It explicitly records proof/counterexample and remediation/retest as
  not run.

## Verification evidence

Local commands were run in the clean feature worktree at the exact source
head before push:

```text
pnpm install --frozen-lockfile                         PASS
pnpm exec turbo run build --filter=verglos... --force  PASS (7/7 tasks)
pnpm exec turbo run typecheck --filter=verglos... --force PASS (13/13 tasks)
pnpm --filter @verglos/shared test                    PASS
pnpm --filter @verglos/hunt test                      PASS
pnpm --filter verglos test                             PASS (full CLI suite;
                                                         1 environment-gated
                                                         Docker skip, 0 failures)
pnpm --filter verglos exec node --import tsx --test \
  src/hunt-worker.test.ts src/hunt-runtime.test.ts \
  src/local-command-options.test.ts                    PASS (9/9)
git diff --check                                      PASS
```

The Hunt suite reported only its existing environment-gated Docker
qualification tests as skipped because the pinned integration environment was
not enabled; no skipped test was counted as acceptance. The focused worker
test executed a current-window signed fixture and confirmed a bounded
candidate result; the negative test denied a report without the exact planned
finding.

Protected PR checks all passed:

- Self-scan run `38373188747`: `Verglos scans Verglos` passed.
- Platform/in-toto run `38373188782`: in-toto release binding and all nine
  Ubuntu/macOS/Windows Node 20/22/24 cells passed.

## Scope, privacy, and authority boundary

This was a public-safe implementation and sanitized local fixture
qualification. No customer source or data, provider system, hosted target,
database, credential, live MCP server, production system, npm registry
publication, or external target was used. The public worker does not upload
source or accept arbitrary shell authority. The owner/operator authorization
covered this contribution, but is not independent review, provider
confirmation, customer acceptance, legal clearance, or final release approval.

## Limitations and acceptance mapping

This evidence advances the dependency-ready Attack Worker implementation; it
does not close a counted backlog row:

- `HUNT-008`: remains open for the complete evidence-backed recipe set,
  supported-rule approval, trusted/licensed publisher roots, real per-family
  target qualification, isolation evidence, independent review, and release
  acceptance.
- `HUNT-009`: now has the worker-connected functional command slice, but
  remains open for its HUNT-008 trust/licensing dependency, hosted entitlement
  evidence, required Linux/Docker qualification, independent review, and full
  row acceptance.
- `HUNT-010` and `HUNT-011`: unchanged and remain open.

The worker result is a candidate execution outcome only. Independent
proof/counterexample, negative-control adjudication, remediation, approved
retest, Release Record binding, and release decision were not run. A1's
restricted-process worker is explicitly not an OS/security isolation boundary;
the existing A2 Docker qualification and adversarial/independent review gates
remain separate.

## Score disposition

The backlog row checkboxes were intentionally unchanged. Recomputed after this
record:

```text
228 checked / 52 open / 280 total (81.4%)
```
