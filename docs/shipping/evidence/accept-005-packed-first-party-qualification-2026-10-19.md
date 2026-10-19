# ACCEPT-005 packed first-party qualification addendum · 2026-10-19

**Disposition:** packed-artifact qualification evidence only;
`ACCEPT-005` remains unchecked. This addendum does not claim consented-team,
external recipient, customer, provider, legal, or independent-review
acceptance.

## Authority and scope

- **Authorizing owner:** Anurag Yadav, owner of Top Notchh Solutions and
  Verglos.
- **Authorization reference:**
  `docs/shipping/evidence/owner-authorization-2026-10-14.md`.
- **First-party targets:** `Top-Notchh-Solutions/verglos-cli` and
  `anuragyadav-git/verglos-web`.
- **Target commits:** CLI merge `0823b513f2b1810ad9f6afcb8806ba46f61feedb`
  (current `origin/main`); Web merge `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
  (current qualification worktree).
- **Packed CLI source:** CLI `0823b513f2b1810ad9f6afcb8806ba46f61feedb`,
  with the normal non-squashed merge history preserved in the source
  repository.
- **Runtime:** macOS Darwin arm64; Node `v26.4.0`; pnpm `9.15.9`.
- **Scope boundary:** seven local public package archives were generated,
  manifest-checked, installed by a clean consumer, and used to scan the two
  authorized first-party repositories. No npm publication, registry write,
  production write, customer data, credentials, or Hunt/AppSec campaign was
  used.

## Commands and qualification results

From the disposable CLI qualification worktree:

```text
npm install --legacy-peer-deps --ignore-scripts --no-audit --no-fund --no-package-lock <seven current archives> PASS
node <clean-consumer>/node_modules/verglos/dist/index.js --version PASS
node <clean-consumer> import check for all six libraries        PASS
VERGLOS_TELEMETRY=0 node <packed-cli> scan ... --no-provenance   PASS (CLI)
VERGLOS_TELEMETRY=0 node <packed-cli> scan ... --no-provenance   PASS (Web)
```

The clean consumer installed all seven current archives and imported
`@verglos/shared`, `@verglos/scanner`, `@verglos/reporter`, `@verglos/mcp`,
`@verglos/entitlement`, and `@verglos/hunt`. The packed CLI reported
`2.0.0-alpha.1` and scanned both authorized first-party worktrees through the
archive-installed front door. The scan runs used telemetry and provenance
disablement, and no network-backed verification or Hunt execution.

The first packaging attempt under Node 26 was an environment/setup failure
because optional platform license metadata was not installed. The successful
qualification used the repository's CI-equivalent supported-architecture
installation setup in the disposable worktree; that setup-only change was not
committed or pushed.

## Archive digests

These are the exact seven archives produced by `pnpm pack:public`:

| Archive | Bytes | SHA-256 |
| --- | ---: | --- |
| `verglos-2.0.0-alpha.1.tgz` | 212289 | `ab8e4684bb7c63e1040c0f08e797bff10a473b4074ada3dd2afd4b04309ce437` |
| `verglos-entitlement-2.0.0-alpha.1.tgz` | 52685 | `56e37b5d5fd648c83c4674fa1c025770e1c8a0ca251a8c85b260d6546e62e83a` |
| `verglos-hunt-2.0.0-alpha.1.tgz` | 72184 | `04c8abfa37cbb3a2b98d7b8e4aaa350c377e2fe24ab246fa04bbb7edcaa64698` |
| `verglos-mcp-2.0.0-alpha.1.tgz` | 75246 | `00df22a73ea75a695fab59a03c5e6e456928e48b478acdacd8f3b0904f0f8c16` |
| `verglos-reporter-2.0.0-alpha.1.tgz` | 48921 | `b391c7b6e00bc72b4d44972361eecc555e340c95a5901bb076683e014a2af31b` |
| `verglos-scanner-2.0.0-alpha.1.tgz` | 142612 | `e3b9f078f5fcd873fb33e6ddf5a67d8f3e8dbbc72ed151d229723551cb537cd9` |
| `verglos-shared-2.0.0-alpha.1.tgz` | 347219 | `3a03cb516ee9126b11596c1163c678cfb5fbe63897d53ef7a5c01ed117c846ea` |

## Packed-artifact scans

The packed CLI was run with telemetry and provenance disabled:

```text
VERGLOS_TELEMETRY=0 node <packed-cli>/packages/cli/dist/index.js scan \
  --json --no-provenance --quiet --output <temporary-output>
```

| Target | Exit | Files | Findings | Score | Risk | Report JSON SHA-256 | Report HTML SHA-256 | Terminal SHA-256 |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| CLI `0823b513…` | 0 | 555 | 78 | 67 | high | `016e13ae13c35fa56edc8396829479cde19952ab6ebec1ae9804cbb6acfa1c6f` | `40e59097f98eb6dac2760fa24d33f5332a33b50158fd42ae5783b2218597a467` | `7793c3da2aef24f171e7271f0eeb525ccef4e7db72e5aba9d462070bc0d878f8` |
| Web `0719074d…` | 0 | 493 | 22 | 73 | medium | `99e78a8818769c74b9311305c0cea0477ae2d3e05f7b7f42a8c89849b1dbb82c` | `85d3184e5c4af95a3661ee683c1d977cb4a4001673360b7dfb20afda0996c60a` | `9dc8f542e178e9fe6c5b811ba45ff040e21b4cc30da8c9b69f835d0961828c25` |

Both reports were complete enough to produce bounded summaries and exited
successfully. Both deliberately used `--no-provenance`, so coverage is marked
incomplete and provenance is not qualified here. The reports were kept in
temporary directories; no raw snippets, source, secrets, or personal data were
copied into this private ledger. The CLI scan also surfaced a user-level
Cursor configuration finding outside the repository scope; it is recorded only
as a scanner-scope observation, not as a first-party repository acceptance
claim.

## Acceptance boundary

This closes the packed first-party qualification subtask only. It does not
close `ACCEPT-005`, whose remaining evidence includes a completed consented
team workflow, owner-facing recipient acceptance, reproducible full coverage,
retention/deletion evidence, and any applicable independent review. It also
does not alter the separately parked Hunt/AppSec rows.

**Score after this addendum:** **235 checked / 45 open / 280 total (83.9%)**.
