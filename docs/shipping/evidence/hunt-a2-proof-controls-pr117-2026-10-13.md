# HUNT A2 proof/control contribution evidence · PR #117 · 2026-10-13

## Identity and publication

- Public repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: [#117](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/117)
- Feature branch: `codex/hunt-a2-proof-2026-10-13`
- Source commit 1: `19b4ece56aaaa2fe21bde6bf6619eee2b3b8dead`
  (`feat(hunt): qualify A2 proof controls`)
- Source commit 2: `ca2cffdbe696da939d6e2ba3d6b85070d46001d0`
  (`test(cli): qualify Hunt A2 proof surface`)
- Regular merge commit: `cd59d5633088934d01b6087966b6795a840ac21d`
- Merge parents: `870ffb52421abb3bf045ad224043cdc5e2605975` and
  `ca2cffdbe696da939d6e2ba3d6b85070d46001d0`
- Publication: pushed to `origin` and merged with GitHub's regular merge
  strategy. No squash merge, force-push, npm publish, or final release was
  performed.

## Implemented contract slice

The public Hunt runtime now extends the bounded Proof/Counterexample slice to
the registered A2 target-harness adapter:

- `runSupportedHuntProof` reuses the exact digest-verified hypothesis, catalog
  recipe, trust policy, approval, target/finding identity, and observation
  binding for both executions.
- For a registered container recipe, the primary run selects only the fixed
  `positive` case and the counterexample selects only the fixed `negative`
  case of the pinned first-party target harness. The adapter appends that
  case only after validating the exact target-harness command and assertion;
  caller-provided commands, payloads, or fixture selectors are not accepted.
- The result remains privacy-limited and structured: bounded outcomes,
  evidence/binding digests, counterexample status, and explicit A2 limits.
  The limitation states that this is reference-harness evidence, not
  independent human review, customer-target proof, or an approved remediation
  retest.
- Unsupported registered adapters remain explicit `not-attemptable`; no
  unsupported path is converted into a verdict.
- The public `verglos hunt proof` command reaches the same A2 path behind the
  existing `hunt.critical` and signed approval/trust gates.

## Verification evidence

Commands were run in the clean public feature worktree at the pushed source
head:

```text
pnpm install --frozen-lockfile                         PASS
pnpm build                                             PASS (8/8 tasks)
pnpm typecheck                                         PASS (14/14 tasks)
pnpm lint                                              PASS (6/6 tasks)
pnpm test                                              PASS (13/13 tasks; 0 failures)
git diff --check                                       PASS
```

Opted-in local qualification:

```text
VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 pnpm --filter @verglos/hunt test
  core Hunt tests: 21/21 PASS
  Docker adapter tests: 10/10 PASS
  target-harness fixture tests: 4/4 PASS
  pinned Docker target-harness coverage includes all ten registered A2 families

VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 pnpm --filter verglos test
  public HUNT-009 execution matrix: 6/6 PASS, including all ten signed A2 families
  direct public `hunt proof` A2 test: 1/1 PASS
```

The separate Docker runtime adversarial tests that require
`VERGLOS_HUNT_DOCKER_INTEGRATION=1` remained explicit environment-gated skips;
they were not counted as proof or acceptance.

Local A2 proof assertions for the direct SQL/NoSQL reference-harness path:

```text
sandbox: docker
primary verdict: confirmed
counterexample verdict: not-reproduced
negative control: passed
proof status: confirmed
```

Protected PR checks all passed:

- Self-scan run `38380150118`: `Verglos scans Verglos` passed.
- Platform/in-toto run `38380150147`: in-toto release binding and all nine
  Ubuntu/macOS/Windows Node 20/22/24 cells passed.

## Scope, privacy, and authority boundary

This was a public-safe implementation and sanitized local reference-harness
qualification. No customer source or data, provider system, hosted target,
database, credential, live MCP server, production system, npm registry
publication, or external target was used. The path does not upload source,
accept arbitrary shell authority, or claim independent review. Owner/operator
authorization covered this contribution, but is not independent review,
provider confirmation, customer acceptance, legal clearance, or final release
approval.

## Limitations and acceptance mapping

This evidence advances the A2 Proof/Counterexample dependency slice; it does
not close a counted backlog row:

- `HUNT-008`: remains open for complete per-family approval and provenance,
  trusted/licensed publisher roots, authorized target qualification, required
  Linux/Docker isolation qualification, independent review, remediation/retest,
  `.vgl` binding, and final release acceptance.
- `HUNT-009`: now has bounded A2 proof plumbing and direct public CLI coverage,
  but remains open for its HUNT-008 dependency, hosted entitlement and
  provider confirmation, required environment qualification, independent
  review, remediation/retest, and full row acceptance.
- `HUNT-010` and `HUNT-011`: unchanged and remain open.

The A2 result is first-party reference-harness evidence, not customer-target
proof or independent adjudication. Remediation, approved retest, generic
verification-attempt publication, `.vgl` Release Record binding, and release
decision were not run.

## Score disposition

The backlog row checkboxes were intentionally unchanged. Recomputed after this
record:

```text
228 checked / 52 open / 280 total (81.4%)
```
