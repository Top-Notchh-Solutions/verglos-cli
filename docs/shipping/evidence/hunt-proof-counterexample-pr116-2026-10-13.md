# HUNT Proof/Counterexample contribution evidence · PR #116 · 2026-10-13

## Identity and publication

- Public repository: `Top-Notchh-Solutions/verglos-cli`
- Pull request: [#116](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/116)
- Feature branch: `codex/hunt-proof-counterexample-2026-10-13`
- Source commit 1: `77693919bf8c44a9a35f2ff2cd8dcfa05fa11cc6`
  (`feat(hunt): replay bounded proof controls`)
- Source commit 2: `6a88e715a320819088e890d9ed1a0dc6e8f015ab`
  (`feat(cli): expose bounded Hunt proof`)
- Regular merge commit: `870ffb52421abb3bf045ad224043cdc5e2605975`
- Merge parents: `e726dacce46fda46024f38e0c68005dcadcd5eb5` and
  `6a88e715a320819088e890d9ed1a0dc6e8f015ab`
- Publication: pushed to `origin` and merged with GitHub's regular merge
  strategy. No squash merge, force-push, npm publish, or final release was
  performed.

## Implemented contract slice

The public Hunt runtime now has a bounded Proof/Counterexample step after the
Attack Worker implementation:

- `runSupportedHuntProof` reuses the exact digest-verified hypothesis,
  catalog recipe, trust policy, approval, target/finding identity, and
  observation binding.
- First-party A1 restricted-process recipes execute the primary synthetic
  fixture and a fixed safe negative control through the same pure built-in
  worker. The control is derived internally by the runtime; caller-provided
  control payloads and arbitrary commands are not accepted.
- The result is privacy-limited and structured: primary outcome,
  counterexample outcome, evidence digests, binding digests, control status,
  and explicit limitations. Fixture values, source, absolute project paths,
  and finding bodies are not emitted.
- Container-backed recipes return `status: not-attemptable`, `executes: false`,
  and `negativeControl: not-run` until the pinned target runtime and required
  independent review evidence are available. The runtime does not claim proof
  from a skipped or unavailable container boundary.
- The CLI exposes `verglos hunt proof <hypothesisPath>` behind the existing
  `hunt.critical` capability gate and the same bounded report/recipe/trust/
  approval/observation inputs as the worker command.

## Verification evidence

Commands were run in the clean public feature worktree at the exact source
head before push and after the final test addition:

```text
pnpm install --frozen-lockfile                         PASS
pnpm --filter @verglos/hunt test                       PASS
  A1 proof/control assertions PASS
  container not-attemptable assertion PASS
  existing Docker qualification remained explicitly environment-gated
pnpm build                                             PASS (8/8 tasks)
pnpm typecheck                                         PASS (14/14 tasks)
pnpm test                                              PASS (13/13 tasks; 0 failures)
git diff --check                                       PASS
```

Local proof assertions recorded:

```text
A1 primary verdict: confirmed
A1 counterexample verdict: not-reproduced
A1 negative control: passed
A2/container proof: not-attemptable; executes=false; negativeControl=not-run
```

Protected PR checks all passed:

- Self-scan run `38376762150`: `Verglos scans Verglos` passed.
- Platform/in-toto run `38376762231`: in-toto release binding and all nine
  Ubuntu/macOS/Windows Node 20/22/24 cells passed.

The local Hunt test suite retained its explicit environment-gated Docker
qualification skips; no skipped test was counted as proof or acceptance.

## Scope, privacy, and authority boundary

This was a public-safe implementation and sanitized local fixture
qualification. No customer source or data, provider system, hosted target,
database, credential, live MCP server, production system, npm registry
publication, or external target was used. The proof path does not upload
source, execute arbitrary target code, or accept model-created shell
authority. Owner/operator authorization covered this contribution, but is not
independent review, provider confirmation, customer acceptance, legal
clearance, or final release approval.

## Limitations and acceptance mapping

This evidence advances the Proof/Counterexample dependency slice; it does not
close a counted backlog row:

- `HUNT-008`: remains open for complete per-family positive/negative/
  timeout/failure acceptance, supported-rule approval, trusted/licensed
  publisher roots, target qualification, required isolation, independent
  review, and final release acceptance.
- `HUNT-009`: now has worker plus bounded A1 proof command wiring, but remains
  open for its HUNT-008 trust/licensing dependency, hosted entitlement,
  required Linux/Docker qualification, independent review, and full row
  acceptance.
- `HUNT-010` and `HUNT-011`: unchanged and remain open.

This A1 proof is synthetic first-party replay, not target-code proof or
independent adjudication. Remediation, approved retest, generic verification
attempt publication, `.vgl` Release Record binding, and release decision were
not run. The existing A1 assurance disclosure remains `securityBoundary: false`.

## Score disposition

The backlog row checkboxes were intentionally unchanged. Recomputed after this
record:

```text
228 checked / 52 open / 280 total (81.4%)
```
