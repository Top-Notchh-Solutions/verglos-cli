# @verglos/hunt

`@verglos/hunt` is the planned local verification engine behind `verglos hunt`.

The scanner finds likely vulnerabilities. Hunt is the next step: synthesize a deterministic proof for each eligible finding, fire it in a local sandbox, and write back a verdict: `true`, `false`, or `not_attemptable`. Local sandbox verification is the product line because it beats cloud LLM triage on the properties Verglos cares about: source privacy, repeatable evidence, low latency inside a coding-agent loop, and no per-scan cloud token cost.

This alpha package is interface scaffolding only. The stable contract is `runHunt(report, opts): Promise<HuntResult>`, plus the `HuntFindingOutcome` and `SandboxAdapter` types in `src/types.ts`. The implementation, per-detector proof recipes, and sandbox adapters land in v2.0.0-beta.

See [`docs/2.0.0-hunt-and-attest.md`](../../docs/2.0.0-hunt-and-attest.md).
