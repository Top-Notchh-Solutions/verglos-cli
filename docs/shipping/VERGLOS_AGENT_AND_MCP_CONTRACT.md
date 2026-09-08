# Verglos agent and MCP safety contract

AI agents are callers, not owners. MCP, CLI, dashboard, and CI must share the same scanner, policy, entitlement, and authorization contracts.

## Allowed without extra approval

- inspect workspace metadata
- run ordinary local scan
- explain an existing finding
- propose a remediation without applying it
- import a user-selected artifact

## Explicit approval required

- write or modify source
- install or update an engine
- run Hunt or any process execution
- enable network access
- create an exception
- sign or publish a Release Record
- upload hosted evidence
- change policy or billing

## Forbidden

- arbitrary model-generated shell as a Hunt recipe
- silent source upload
- silent secret transmission
- approving its own exception
- signing on behalf of a user without the configured identity flow
- converting imported evidence into native Verglos findings without preserving source attribution

## Hunt recipe contract

Recipes are signed, versioned, reviewed, target-bound, time/resource limited, redaction-aware, and explicit about isolation (`none`, restricted process, container, gVisor, microVM). Network is denied by default. V1 outcomes are `confirmed`, `not_reproduced`, `inconclusive`, `not_supported`, `environment_error`, or `policy_denied`, with stdout/stderr redacted and limits recorded. The old `verified`/`false`/`not_attemptable` labels are legacy compatibility inputs, not V1 output truth.

## Agent UX

Show the requested action, target, policy effect, permission needed, and expected files/network before execution. After execution show what happened, what did not happen, and a link to the evidence. Human approval must be keyboard accessible and auditable.
