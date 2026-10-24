# ACCEPT-005 current merged-CLI public-OSS workflow receipt · 2026-10-24

The owner-authorized public-OSS benchmark path was rerun from the pinned
`buggy-node` fixture directory, rather than from the CLI worktree. This makes
the project-root binding explicit and prevents a wrong-working-directory scan
from entering the shipping record.

## Receipt

- Repository: `https://github.com/UtkarshGupta-CS/buggy-node`
- Exact fixture commit: `b1b9cbc8b86f81a1ecb0b142190d4fa4698518da`
- CLI candidate: `cd9d572e28462741103cb21a2274e5892939d5d4`
- Version: `2.0.0-alpha.4`
- Working directory: `acceptance-fixtures/buggy-node`
- Command: `VERGLOS_TELEMETRY=0 node packages/cli/dist/index.js scan --json --quiet --no-telemetry --output <private-output-dir>`
- Exit code: `0`
- Coverage: `complete`; `8` files walked; `59` findings; `1559 ms`
- JSON report bytes: `51533`
- JSON report SHA-256: `sha256:98ff1613de3782ed4553e1f806156f4437b6bbf29d55a195efd31a46f55b3830`
- HTML report SHA-256: `sha256:927cb5c347e0f1968f843a7f95c29f7309f9a7a841021980d8e5505a39ea5bd4`
- Scan time: `2026-10-24T05:06:23.982Z`

Telemetry and source upload were disabled. The derived report remains private;
no customer repository, provider/Production state, payment, publication,
redistribution, deletion, or public endorsement was involved.

## Boundary

This is current-candidate implementation/reproducibility evidence for the
owner-authorized public-OSS scope. It does not claim external customer or
recipient acceptance, independent review, AppSec/Hunt review, or final release
sign-off. `ACCEPT-005` remains unchecked and the score remains **245 checked /
35 open / 280 total (87.5%)**.
