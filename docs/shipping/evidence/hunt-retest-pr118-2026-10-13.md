# HUNT remediation/retest contribution evidence — PR #118

## Identity and disposition

- Public PR: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/118
- Public source commits, preserved separately:
  - `83560121f678bfe40a555a729994a4bb05e3c518` — `fix(shared): bind remediation scope exactly`
  - `7c3f0203a069972fb65b7e3ce5949c5b1f954f1e` — `feat(hunt): expose approved remediation retest`
- Normal merge commit: `646bd9748910ebb16079ba8461ff7af6e2500799`
- Protected self-scan: `38382401345` — passed.
- Protected platform/in-toto run: `38382401289` — in-toto plus Ubuntu/macOS/Windows Node 20/22/24 all passed.
- No squash or force-push was used. The score remains **228 checked / 52 unchecked / 280 total (81.4%)**.

## Evidence-chain mapping

1. **Finding.** The retest accepts only the exact finding carried by the
   versioned Hunt Attack-Hypothesis. The public A1 qualification test uses a
   fixed first-party synthetic finding; it is not a customer finding.
2. **Target map.** The remediation proposal is bound to a distinct immutable
   `beforeSubjectId`; the hypothesis supplies the immutable post-remediation
   subject. Equal before/after subjects are rejected.
3. **Hypothesis.** `runSupportedHuntRetest` parses the canonical hypothesis,
   checks its finding identity, and reuses its registered recipe/playbook
   rather than accepting a caller command, payload, or patch bytes.
4. **Exact authority.** Execution remains behind `hunt.critical`, the signed
   recipe/trust store, an exact execute approval for the post-remediation
   subject, observation identity, and the existing target/finding binding.
   The separate remediation approval must be an approved `mutate` receipt for
   the exact before subject, exact relative file scope, exact policy effect,
   and an empty network scope.
5. **Bounded worker.** The worker accepts a non-mutating remediation proposal
   only. It never writes files, runs an arbitrary command, accepts patch bytes,
   or claims that the approved remediation was applied. The result records
   `approved: true`, `applied: false`, and the limitation explicitly.
6. **Proof/counterexample.** The retest invokes the same registered
   `runSupportedHuntProof` path, including its fixed A1 primary fixture and
   deterministic negative control. The public CLI test demonstrates a
   cleared result without exposing synthetic inputs or local paths.
7. **Remediation/retest.** The shared approval contract now rejects policy
   effect drift, network-enabled mutation receipts, unsafe file paths, and
   file-scope widening. Retest status is `cleared`, `still-reproduced`,
   `inconclusive`, or `not-attemptable`; it cannot be inferred from approval
   alone.
8. **`.vgl`.** No `.vgl` Release Record is produced by this contribution.
   Release Record binding, trusted/licensed roots, hosted entitlement,
   provider confirmation, required isolation qualification, and independent
   review remain open acceptance criteria.

## Local verification

- `pnpm build` — 8/8 tasks passed.
- `pnpm typecheck` — 14/14 tasks passed.
- `pnpm lint` — 6/6 tasks passed.
- `pnpm --filter @verglos/shared test` — passed.
- `pnpm --filter @verglos/hunt test` — 21 passed, 1 explicit environment-gated Docker target proof skip; adapter 10/10; target-harness 3 passed, 1 explicit skip.
- `pnpm --filter verglos test -- --test-name-pattern='Hunt retest|Hunt runtime|remediation'` — full CLI package suite passed; the direct retest test passed.
- `git diff --check` — passed.

The new focused assertions passed:

- `Hunt retest binds an approved remediation scope and clears a fixed A1 subject`.
- `public CLI retest binds mutate approval and reruns the same proof`.
- remediation proposals reject absolute, traversal, and backslash file paths.
- remediation approvals reject policy-effect mismatch and non-empty network scope.

## Boundary and acceptance disposition

Only first-party local synthetic/reference fixtures were used. No customer
source or data, provider state, hosted target, live MCP server, credential,
database, production system, arbitrary shell, source upload, or npm publish
was involved. Owner authorization is not independent review, provider
confirmation, customer acceptance, legal clearance, or final release
approval.

This is a dependency-ready implementation contribution for HUNT-008/HUNT-009
remediation/retest wiring. It does not close either counted row, does not
update the score, and does not establish Point-5 completion.
