# @verglos/hunt

`@verglos/hunt` is the local verification engine behind `verglos hunt`.

The scanner finds likely vulnerabilities. Hunt is the next step: execute only an explicitly trusted, approved, digest-pinned recipe in a declared sandbox and return bounded evidence. The alpha compatibility fields remain `true`, `false`, and `not_attemptable`; new runtime results also expose canonical V1 states: `confirmed`, `not-reproduced`, `inconclusive`, `not-supported`, and `environment-error`. Local sandbox verification is the product line because it preserves source privacy, repeatable evidence, and low latency inside a coding-agent loop.

The alpha package includes the recipe/trust/approval binding, execution-free planner, A1 restricted-process harness for a bounded built-in fixture-probe catalog (UTF-8 containment, path traversal, command-injection shape, SSRF private-target classification, tenant-boundary mismatch, SQL/NoSQL injection shape, safe XSS shape, and agent/MCP tool-boundary mismatch), redaction and evidence-digest pipeline, bounded Docker adapter, and adversarial runtime harness. These A1 probes do not execute target code, have no source access or network, and are explicitly **not a security/OS isolation boundary**. `runHunt(report, opts): Promise<HuntResult>` remains the stable contract, along with `HuntFindingOutcome` and `SandboxAdapter` in `src/types.ts`. The public CLI may execute only a supported signed recipe with an exact approval and subject binding; arbitrary model-generated shell is never accepted.

See [`docs/2.0.0-hunt-and-attest.md`](../../docs/2.0.0-hunt-and-attest.md).
