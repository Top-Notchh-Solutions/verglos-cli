# Verglos Engine Run and Health Contract

Status: V1 contract implemented by `CONTRACT-003`

Owner: Evidence/Engine

Last reviewed: 2026-09-09

These contracts make producer state and execution outcomes explicit before observations or policy are introduced. They prevent a missing, stale, incompatible, failed, or partially executed producer from being represented as an empty successful scan.

## Versioned documents

- Engine health: `urn:verglos:schema:engine-health` version `1.0.0`.
- Tool run: `urn:verglos:schema:tool-run` version `1.0.0`.

Both use the shared bounded versioned JSON reader. Newer documents require an actionable reader upgrade; older major versions require an explicit migration.

## Producer and installed state

A producer has a stable namespaced ID, kind (`native`, `external`, `importer`, or `fixture`), bounded name, and exact reported version. Installed/runtime material is recorded as separately digested components:

- binary/runtime;
- configuration;
- advisory/database content;
- checks/rules.

Each present component records its name, optional version, SHA-256/SHA-512 digest, source (`bundled`, `managed`, `system`, `user`, `remote`, or `embedded`), and trust state. `verified` means a configured trust/checksum path validated the source; `computed-only` means the bytes were hashed without establishing publisher trust; `unverified` remains explicit. A healthy producer must identify its binary/runtime component.

Capabilities are stable IDs with supported subject kinds and `supported`, `degraded`, or `unsupported` status. IDs are unique within each health snapshot. Freshness references an existing component and states `current`, `stale`, `unknown`, or `not-applicable`; stale entries require their source update time.

## Health and incompleteness

Health is `healthy`, `degraded`, `unavailable`, `incompatible`, or `stale`.

- Healthy state cannot carry incomplete reasons or stale component freshness.
- Every non-healthy state requires at least one typed incomplete reason with scope, bounded explanation, and next action.
- Stale state additionally requires a stale component freshness entry.
- Reasons distinguish missing/incompatible engines, missing/stale databases or checks, invalid configuration, unsupported subject/language, permission, timeout, execution/parse/partial output, unavailable offline data, and cancellation.

These are evidence facts, not final policy decisions. `CONTRACT-008` later determines which required checks turn them into `INCOMPLETE`; it may never convert them into no findings or PASS.

## Tool-run invariant

A run binds a UUID URN to one validated subject ID and the exact engine-health snapshot observed for that run. It records requested/executed capabilities, execution class, network class, timestamps, measured duration, configured timeout, process result, outcome, and complete/incomplete coverage.

The validator enforces:

- executed capabilities are unique and were requested;
- completion does not precede start;
- a timed-out run reaches its configured timeout;
- successful outcome requires exit code zero;
- failed outcome cannot report exit code zero;
- `not-run` is the only outcome with a `not-started` process result;
- non-successful outcomes and non-healthy engines cannot report complete coverage;
- incomplete coverage has at least one typed reason, while complete coverage has none;
- a producer run may succeed at the process layer and remain explicitly incomplete;
- evidence producers cannot claim target-code execution. Bounded Hunt execution uses the later verification-attempt and recipe contracts.

Network state is recorded as `none`, `restricted`, or `unrestricted`; recording it does not grant consent or authorization. Adapter and command layers must apply the separate network/approval contract.

## Deferred boundaries

- `CONTRACT-004` attaches canonical observations and coverage to these runs.
- `ENGINE-001` implements adapter discovery, requirements, execution, normalization, and raw-output boundaries against these contracts.
- Engine manifests, installation verification, raw evidence storage, replay, freshness policy, and engine-exit drills remain their named backlog tasks.
- A digest records bytes; it does not by itself establish license, publisher, signature, safety, or authorization.

## Executable evidence

`packages/shared/src/engine.test.ts` covers healthy round trips, unavailable/incompatible reasons, stale dating, component/freshness references, duplicate IDs, failed/non-healthy coverage, successful-but-incomplete runs, process/outcome consistency, prohibited target execution, timeout bounds, capability subset rules, timestamp order, and future-version upgrade errors.
