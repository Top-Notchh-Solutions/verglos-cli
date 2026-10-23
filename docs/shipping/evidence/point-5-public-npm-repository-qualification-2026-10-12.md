# Point 5 public npm-package qualification — 2026-10-12

**Evidence type:** repository-owned qualification batch
**Status:** partial Point-5 progress; not final POC or release acceptance
**CLI source commit:** `04b9a2b333a7dab8370ab40ae26f46c6b10a0156`
**Package version:** `2.0.0-alpha.1`

## Package boundary

The six local public archives were packed, audited, and installed in a clean
temporary consumer with `npm install --ignore-scripts`:

```text
pnpm pack:public
node scripts/check-packed-manifests.mjs .artifacts/public-packages
node scripts/verify-clean-consumer.mjs .artifacts/public-packages
```

Result: the packed-manifest audit passed for six archives; the clean consumer
installed all six, imported all libraries, executed the CLI, and confirmed no
external engine installation. The packaged CLI reported `2.0.0-alpha.1`.

## Public repositories tested

| Language | Repository | Exact commit | Result |
|---|---|---|---|
| JavaScript | `https://github.com/sahat/hackathon-starter` | `574a99344855a2f18dac7181636e400bd55ab578` | complete coverage; 97 files; score 86; 7 findings; risk medium; exit 0 |
| TypeScript | `https://github.com/ixartz/Next-js-Boilerplate` | `b83157a8018f55b926a3c25a4b7a7e14b0dfbc35` | complete coverage; 88 files; score 90; 4 findings; risk low; exit 0 |

Each scan was executed from the repository root using the packed CLI, with
`VERGLOS_TELEMETRY=0`, `--no-telemetry`, and an isolated temporary `HOME`/
`USERPROFILE`. No `--verify-secrets` option was used. The isolated-home check
reported zero findings outside the target repositories from the operator's
global `.cursor` configuration.

The repository-owned CLI/shared/MCP tests, including scan privacy and failure
contracts, passed on the same source commit. The exact test evidence is
`hunt-cli-mcp-path-2026-10-12.md`; Docker Hunt evidence is
`hunt-docker-adversarial-2026-10-12.md`.

## Limitations and next qualification work

This is a public-repository package qualification batch, not the held-out POC
corpus and not npm publication. It does not yet cover the full campaign corpus,
TopNotchh-owned forks, all plan/hosted entitlement paths, or final release
acceptance. No npm registry write occurred. Point 5 remains open until the
remaining authorized corpus and its evidence are complete.
