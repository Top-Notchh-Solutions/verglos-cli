# HUNT Attack-Hypothesis planner contribution — PR #114

## Shipping identity

- Public PR: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/114
- Public branch: `codex/hunt-attack-hypothesis-2026-10-13`
- Source commits preserved as ordinary substantive commits:
  - `a2c71f8db3dcdc1c3cb44279385777163e62c470` — `feat(hunt): add execution-free attack hypotheses`
  - `7063b21fa3da0285681e2ac6289180e45f29449c` — `feat(cli): expose Hunt hypothesis planning`
- Regular merge commit: `6ff8c6cb3157077b3eeb6b2ca5f9754cc1f9360e`.
- Merge parents: prior public `main`
  `a399d00317dc495613483b934bb01f30f3ec5bb8` and feature head
  `7063b21fa3da0285681e2ac6289180e45f29449c`.
- Merged at `2026-10-13T08:52:53Z`.
- No squash, force-push, or destructive history rewrite was used.

## Contract-aligned implementation

The public Hunt package now consumes the Scout target manifest and maps an
exact finding to a deterministic, versioned
`urn:verglos:schema:hunt-attack-hypothesis` document. The planner selects only
the fixed public bounded catalog, requires matching static target context,
records proposed target-context or recipe-fixture bindings, and reports
`supported`, `unsupported`, or `not_attemptable` explicitly. The CLI exposes
this through `verglos hunt hypothesis <manifestPath>` with required finding,
rule, and subject identity bindings.

The hypothesis document is execution-free: it sets `executes: false`, marks
every sequence step `not-run`, and preserves recipe trust, entitlement,
approval, worker, proof, and counterexample gates as not yet satisfied. The
CLI accepts only a bounded regular JSON file, supports a Scout envelope or raw
manifest, rejects subject mismatches before runtime loading, and emits no
absolute source roots or source bodies.

## Evidence

Validation was run in the isolated public feature worktree
`verglos-cli/.worktrees/cli-hunt-attack-hypothesis`:

- `pnpm install --frozen-lockfile` completed.
- Shared focused hypothesis tests passed `3/3`.
- Hunt focused hypothesis tests passed `2/2`.
- CLI focused hypothesis, runtime, Scout, and command-registration tests
  passed `12/12`.
- Full `@verglos/shared`, `@verglos/hunt`, and `verglos` test suites passed;
  the repository's documented Docker integration skips remained environment-
  gated and produced no failures.
- Forced dependency-graph build passed `7/7` Turbo tasks.
- Forced dependency-graph typecheck passed `13/13` Turbo tasks.
- `git diff --check` passed before commit and the staged diffs passed before
  each commit.

Protected verification for PR #114:

- Verglos self-scan run `38371072308` passed.
- Platform matrix run `38371072552` passed in-toto binding and all nine
  Ubuntu/macOS/Windows Node 20/22/24 cells.
- All eleven required PR checks passed before the regular merge.

## Privacy and boundary

This contribution reads a bounded local Scout manifest only. It does not
upload source, execute project code, execute a Hunt recipe, create a trust or
approval receipt, evaluate entitlement, contact a provider, use customer data,
write a database, access Production, or claim proof. Target paths are schema-
validated relative references; an envelope's private root is ignored. The
public catalog projection is metadata and is not a signed recipe or execution
authority.

Owner/operator authorization covered this public-safe contribution. That
authorization is not independent AppSec review, provider confirmation,
customer acceptance, legal clearance, or final release approval.

## Acceptance disposition

This is a Scout-to-Attack-Hypothesis implementation and shipping contribution
for HUNT-008 and HUNT-009. It advances the dependency-ready planner slice but
does not satisfy either counted row's complete acceptance criteria: supported
rule and trusted/licensed provenance treatment, hosted entitlement where
required, authorized target execution, positive/negative proof and retest,
isolation qualification, independent review, and final release acceptance all
remain open. No backlog checkbox changed.

Score unchanged: **228 checked / 52 unchecked / 280 total (81.4%)**.
