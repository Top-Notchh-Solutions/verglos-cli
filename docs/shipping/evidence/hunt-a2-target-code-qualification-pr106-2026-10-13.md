# HUNT-008 technical evidence — A2 target-code qualification PR #106

Date: 2026-10-13

## Result

Public CLI PR #106 was squash-merged into `main` as:

`a413df2f567e377130b1d4d492bf8a610c8b6040`

PR: `https://github.com/Top-Notchh-Solutions/verglos-cli/pull/106`

The change qualifies the seven public-safe A2 reference target modules through
the pinned Docker adapter. It is technical implementation evidence only. It
does not close HUNT-008.

## What was qualified

The seven A2 families are:

1. SQL/NoSQL injection
2. command injection
3. path traversal
4. SSRF
5. Agent/MCP boundary
6. safe XSS
7. authorization/tenant boundary

Each family has a sanitized local JavaScript target module under
`packages/hunt/fixtures/target-code/src/` and a corresponding harness under
`packages/hunt/fixtures/target-code/.verglos/hunt/`. The target modules do not
connect to a network, database, browser, MCP server, device, secret store, or
customer repository, and they do not execute arbitrary shell commands.

The Docker qualification exercises positive, negative, and unsupported cases
for all seven families: 21 family/case executions in total. The same harness
processes also expose deterministic timeout and adapter-failure outcomes for
the bounded-runner contract.

## Exact verification

The opt-in Docker qualification command was:

```text
VERGLOS_HUNT_DOCKER_TARGET_INTEGRATION=1 pnpm --filter @verglos/hunt test
```

Additional checks passed:

```text
pnpm --filter verglos test
pnpm build
git diff --check
```

The Hunt package suite passed with the Linux-only host integration cases
remaining explicit skips on the macOS development host. The public protected
workflow then passed its self-scan, in-toto binding, and all Ubuntu/macOS/
Windows Node 20/22/24 cells. The first Windows Node 20/22 attempts had
unrelated runner failures (MCP build process and temporary-directory cleanup);
the failed jobs were rerun successfully before merge.

Protected workflow references:

- platform matrix: run `38331231177` (including successful rerun jobs)
- self-scan: run `38331236288`
- merged public commit: `a413df2f567e377130b1d4d492bf8a610c8b6040`

## Public/private boundary

Only sanitized code and public-safe tests were added to the public repository.
No private tracker content, deployment details, credentials, customer source,
provider secrets, or consent records were added.

## Remaining HUNT-008 gates

This evidence does not prove or supply:

- supported-rule approval and final catalog acceptance;
- legal modification/redistribution treatment for every recipe dependency;
- hosted entitlement and organization/repository binding;
- independent Linux/Docker adversarial review;
- complete customer or authorized-repository target qualification; or
- final release/provenance treatment.

Therefore HUNT-008 remains unchecked. The private tracker score remains
**228 checked / 52 unchecked / 280 total (81.4%)**.
