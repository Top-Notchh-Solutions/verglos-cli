# @verglos/hunt

`@verglos/hunt` is the local verification engine behind `verglos hunt`.

The scanner finds likely vulnerabilities. Hunt is the next step: execute only an explicitly trusted, approved, digest-pinned recipe in a declared sandbox and return bounded evidence. The alpha compatibility fields remain `true`, `false`, and `not_attemptable`; new runtime results also expose canonical V1 states: `confirmed`, `not-reproduced`, `inconclusive`, `not-supported`, and `environment-error`. Local sandbox verification is the product line because it preserves source privacy, repeatable evidence, and low latency inside a coding-agent loop.

The alpha package includes the recipe/trust/approval binding, planner, redaction and evidence-digest pipeline, bounded Docker adapter, and adversarial runtime harness. `runHunt(report, opts): Promise<HuntResult>` remains the stable contract, along with `HuntFindingOutcome` and `SandboxAdapter` in `src/types.ts`. Supported per-detector recipes and the fully enabled `verglos hunt` command remain gated for v2.0.0-beta; arbitrary model-generated shell is never accepted.

See [`docs/2.0.0-hunt-and-attest.md`](../../docs/2.0.0-hunt-and-attest.md).
