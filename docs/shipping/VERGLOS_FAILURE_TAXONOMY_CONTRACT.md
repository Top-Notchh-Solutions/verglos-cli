# Verglos Typed Failure Taxonomy

Status: V1 contract implemented by `CONTRACT-011`

Owner: Reliability/Evidence

Last reviewed: 2026-09-09

Schema `urn:verglos:schema:failure` version `1.0.0` gives every operational failure a stable category, namespaced code, deterministic process exit, retry posture, safe message, limitation, recovery action, operation, and timestamp. It prevents a process error from being mistaken for no findings, a policy block, or a successful verification.

## Categories and exits

| Category | Meaning | Exit |
|---|---|---:|
| `usage` | Invalid command/configuration/input that requires caller correction. | 2 |
| `unsupported` | Capability, format, or target is not supported in this release. | 78 |
| `incomplete` | Required evidence or coverage is missing, stale, failed, or unresolved. | 3 |
| `policy-block` | Complete evidence violates an explicit policy block. | 1 |
| `infrastructure` | External runtime/provider/storage dependency failed. | 4 |
| `authorization` | Authentication, tenant, role, or approval did not permit the action. | 4 |
| `quota` | A bounded allowance or capacity prevented the action. | 4 |
| `integrity` | Bytes, digest, signature, or canonical structure cannot be trusted. | 70 |
| `internal` | Unexpected implementation failure; no stack or raw internals are exposed. | 70 |

Exit codes are intentionally not a substitute for the category; JSON callers must read the typed failure. The existing command contract remains authoritative for user-facing compatibility, including exit 0 for success, 1 for policy block/findings, 2 for usage, 3 for incomplete evidence, and 78 for unavailable alpha capabilities.

## Retry and truth boundaries

Each failure declares `never`, `safe`, `after-action`, or `after-window` retry posture. Usage, policy-block, authorization, and integrity failures cannot claim blind-safe retry. Infrastructure may be safely retried only when the operation is idempotent and the caller has the required action; quota waits for its declared window. A failure record does not assert that a retry occurred.

Failure records are strict, category-namespaced, bounded, and sanitized. They do not carry stack traces, source snippets, secrets, credentials, or unbounded provider responses. A failure is a process/error fact, not a policy decision, verification outcome, or evidence of absence.

`packages/shared/src/failure.test.ts` covers all nine categories and exit mappings, namespace/exit contradictions, unsafe retry claims, strict fields, and future-version handling.
