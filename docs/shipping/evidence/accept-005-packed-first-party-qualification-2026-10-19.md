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
- **Target commits:** CLI merge `07cb117e3796b693c71c3f937d5935e0e2abb694`
  (PR #151); Web merge `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
  (PR #221).
- **Packed CLI source:** implementation commit `562ea84e` from PR #151,
  merged normally without squash, rebase, or force-push.
- **Runtime:** macOS Darwin arm64; Node `v22.23.3`; pnpm `9.15.9`.
- **Scope boundary:** seven local public package archives were generated,
  manifest-checked, installed by a clean consumer, and used to scan the two
  authorized first-party repositories. No npm publication, registry write,
  production write, customer data, credentials, or Hunt/AppSec campaign was
  used.

## Commands and qualification results

From the disposable CLI qualification worktree:

```text
pnpm install --frozen-lockfile                         PASS
pnpm pack:public                                      PASS
node scripts/check-packed-manifests.mjs .artifacts/public-packages PASS
node scripts/verify-clean-consumer.mjs .artifacts/public-packages PASS
```

The clean consumer reported that it installed all seven archives, imported
all libraries, executed Verglos `2.0.0-alpha.1`, confirmed no external engine
installation, and executed the signed A1 UTF-8 fixture through the bounded
restricted-process runtime with an isolated Pro capability fixture.

The first packaging attempt under Node 26 was an environment/setup failure
because optional platform license metadata was not installed. The successful
qualification used the repository's CI-equivalent supported-architecture
installation setup in the disposable worktree; that setup-only change was not
committed or pushed.

## Archive digests

These are the exact seven archives produced by `pnpm pack:public`:

| Archive | Bytes | SHA-256 |
| --- | ---: | --- |
| `verglos-2.0.0-alpha.1.tgz` | 212343 | `b3242dd32d990907e30da2d25c7553280a3749d1691bc75563743e3c0d6ebcf5` |
| `verglos-entitlement-2.0.0-alpha.1.tgz` | 52753 | `476ccd29f5150960c088d6d940d6fb8a8aa8a7cd45723322bf6ee7e5be050cdc` |
| `verglos-hunt-2.0.0-alpha.1.tgz` | 72216 | `6586aac3369f77aacec9b16391826a9cdb62cef72327374d801b33066cf12a3e` |
| `verglos-mcp-2.0.0-alpha.1.tgz` | 75393 | `c8e0272cad577ac667bab0774d83e41978a566cc52dfd1c1d49dfb0895d16bab` |
| `verglos-reporter-2.0.0-alpha.1.tgz` | 49024 | `e3d6a5bfd38c14bf0de2a587baa7d4979c87509b59bd08e8554a59f11eeb46a0` |
| `verglos-scanner-2.0.0-alpha.1.tgz` | 142735 | `94d78d7b8ee05a792bdf5591835217e96706e12faa79b336821061107da80809` |
| `verglos-shared-2.0.0-alpha.1.tgz` | 346918 | `f4d2bf156ef9a3ab851639bde631bcd99a0692b45125239228074ce2b27f632a` |

## Packed-artifact scans

The packed CLI was run with telemetry and provenance disabled:

```text
VERGLOS_TELEMETRY=0 node <packed-cli>/packages/cli/dist/index.js scan \
  --json --no-provenance --quiet --output <temporary-output>
```

| Target | Exit | Files | Findings | Score | Risk | Report JSON SHA-256 | Report HTML SHA-256 | Terminal SHA-256 |
| --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| CLI `07cb117e…` | 0 | 557 | 78 | 67 | high | `07c2538c9563e9dbc236c47f8046270046b8e8d80b7da6c1ceafb2f7fae6e70b` | `2ad6568705194e5bdec5c14b77812dd639aa76e8b12fb8538648628619d6ee61` | `6e03db0f37142683959cec4751495a4d5fdf3c6104da789f6a914a99b5c56ab2` |
| Web `0719074d…` | 0 | 493 | 22 | 73 | medium | `596df229dde543a01fdee8d71590bf48ed59ac35cb25ae8fa4678fdd183b8376` | `4232623e292347b3f99c16195ce32ab54d9b70fb0362b4345feadaab3f2550e7` | `0492e2e66fbee7b5015b42d163da20ecfdf9014ac61de05f59090b2425347708` |

Both reports were complete enough to produce bounded summaries and exited
successfully. Both deliberately used `--no-provenance`, so coverage is marked
incomplete and provenance is not qualified here. The reports were kept in
temporary directories; no raw snippets, source, secrets, or personal data were
copied into this private ledger.

## Acceptance boundary

This closes the packed first-party qualification subtask only. It does not
close `ACCEPT-005`, whose remaining evidence includes a completed consented
team workflow, owner-facing recipient acceptance, reproducible full coverage,
retention/deletion evidence, and any applicable independent review. It also
does not alter the separately parked Hunt/AppSec rows.

**Score after this addendum:** **235 checked / 45 open / 280 total (83.9%)**.
