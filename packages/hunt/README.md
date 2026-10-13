# @verglos/hunt

`@verglos/hunt` is the local verification engine behind `verglos hunt`.

The scanner finds likely vulnerabilities. Hunt is the next step: execute only an explicitly trusted, approved, digest-pinned recipe in a declared sandbox and return bounded evidence. The alpha compatibility fields remain `true`, `false`, and `not_attemptable`; new runtime results also expose canonical V1 states: `confirmed`, `not-reproduced`, `inconclusive`, `not-supported`, and `environment-error`. Local sandbox verification is the product line because it preserves source privacy, repeatable evidence, and low latency inside a coding-agent loop.

The alpha package includes the recipe/trust/approval binding, execution-free planner, A1 restricted-process harness for a bounded built-in fixture-probe catalog (UTF-8 containment, path traversal, command-injection shape, SSRF private-target classification, tenant-boundary mismatch, SQL/NoSQL injection shape, safe XSS shape, and agent/MCP tool-boundary mismatch), redaction and evidence-digest pipeline, bounded Docker adapter, and adversarial runtime harness. A1 probes do not execute target code, have no source access or network, and are explicitly **not a security/OS isolation boundary**. The approved A2 target-code harness catalog covers SQL/NoSQL injection, command injection, path traversal, SSRF, Agent/MCP boundaries, XSS, authorization/tenant checks, prototype-pollution object merges, synthetic credential-use, and disposable supply-chain admission behavior. A2 harnesses run a customer-owned `.verglos/hunt/<family>.mjs` entrypoint from the read-only project mount in a pinned Node image, with network denied, dropped capabilities, bounded resources, and a strict one-line JSON result protocol; the harness does not receive secrets or host mounts. The secret and supply-chain fixtures use synthetic in-memory data only and never validate credentials, install packages, execute lifecycle hooks, or access a registry. Docker outcomes disclose an A2 assurance class and the remaining host-daemon/platform limitation. `runHunt(report, opts): Promise<HuntResult>` remains the stable contract, along with `HuntFindingOutcome` and `SandboxAdapter` in `src/types.ts`. The public CLI may execute only a supported signed recipe with an exact approval and subject binding; arbitrary model-generated shell is never accepted.

An A2 harness must print a final line such as `{"verglos":"hunt-result","verdict":"confirmed","summary":"bounded fixture reproduced"}` (or `not-reproduced` / `unsupported`) and exit with code `0`. The summary is bounded and redacted; it must not contain source, secrets, paths, or free-form command output. Missing, malformed, or non-zero-exit harnesses are reported as unsupported or environment failure rather than a security verdict.

The public repository also contains ten sanitized deterministic reference
harnesses under `fixtures/target-code/.verglos/hunt/`, one for each approved
A2 family, plus local target-code modules under `fixtures/target-code/src/`.
Each harness invokes only those local modules and evaluates the result in
memory: they do not scan customer source, access a database, make network
requests, render a browser, or invoke tools. For fixture qualification, each accepts the bounded
`positive`, `negative`, or `unsupported` case argument; timeout and execution
failure are produced by the Docker adapter and never fabricated by a harness.
Omitting the argument selects the positive case used by the admitted catalog
command.
They are qualification fixtures and examples, not a claim that every customer
repository has a supported target-code recipe.

The Agent/MCP fixture additionally emits a synthetic capability receipt bound
to the exact tool/input scope and demonstrates that a second use of the same
single-use receipt is rejected. This is a local replay-safety fixture, not a
live MCP server, credential, network, or customer-agent qualification.

The adapter test matrix also exercises timeout and infrastructure-failure
classification for every A2 family, while keeping those outcomes separate from
harness verdicts.

See [`docs/2.0.0-hunt-and-attest.md`](../../docs/2.0.0-hunt-and-attest.md).
