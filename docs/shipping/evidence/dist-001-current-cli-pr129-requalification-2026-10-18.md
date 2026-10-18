# DIST-001 current CLI merge package requalification — 2026-10-18

## Scope

This packet records a current-head package/archive qualification after CLI PR
#129. It does not publish npm artifacts, create a tag, change a registry,
close the row, or establish Hunt/AppSec, release, legal, or final-acceptance
evidence.

## Source and history

- Repository: `Top-Notchh-Solutions/verglos-cli`
- Current normal merge: `9eba5102a1c0f9d7ee13b28bb2cc28bb50766eae`
- Preserved policy implementation commit: `36fb82f3`
- Preserved policy regression-test commit: `9d064603`
- `origin/main` matched the normal merge before qualification.

No squash, rebase, force-push, empty, duplicate, artificial, or irrelevant
public-document commit was used.

## Commands and results

The commands ran in a disposable worktree and wrote archives only under
`/tmp/verglos-dist-001-current-yvqaWf`:

```text
pnpm install --frozen-lockfile
node scripts/pack-public-packages.mjs /tmp/verglos-dist-001-current-yvqaWf
node scripts/check-packed-manifests.mjs /tmp/verglos-dist-001-current-yvqaWf
node scripts/verify-clean-consumer.mjs /tmp/verglos-dist-001-current-yvqaWf
```

The first attempt correctly failed before packing because the Mac Node 26
environment lacked optional cross-platform package metadata. The documented
temporary `pnpm.supportedArchitectures` selection was then applied only for
dependency installation, the qualification passed, and the setting was
removed. The worktree has `git diff --check` clean and no retained source
change.

Results:

- `pack-public-packages.mjs`: **7 archives created**.
- `check-packed-manifests.mjs`: **passed** for all 7 archives, including bin,
  exports, forbidden-file, and package-surface checks.
- `verify-clean-consumer.mjs`: **passed**; the clean consumer installed all 7
  archives, imported all libraries, executed Verglos `2.0.0-alpha.1`, found no
  implicit external-engine installation, and executed signed
  `a1-utf8-contains` through the bounded restricted-process runtime with an
  isolated Pro fixture.
- `git diff --check`: **passed**.

Archive SHA-256 values:

```text
aea22525743c952cdb4ebe3fa327245c267754d7af7346966fc3a8230faf98b4  verglos-2.0.0-alpha.1.tgz
b9e7cc8385de1e38d6f3114faa36f8df5cf3db2b4dbe4588d399cd3fa8a6e7bc  verglos-entitlement-2.0.0-alpha.1.tgz
3472ad4c640a64515c4778265db2124d052d3e6714a47d07c9d989092e429469  verglos-hunt-2.0.0-alpha.1.tgz
255f903e91f034b951807d32dd233eac98e326bc870c4ea4e500e62a67ca2092  verglos-mcp-2.0.0-alpha.1.tgz
be808cd929b022e2a95d80edf8e619143f8bc1695cc30c528c6ae6e30c1a5776  verglos-reporter-2.0.0-alpha.1.tgz
cb0cdf0810f213c4b899982849d8a814d03abc670ac3e5e9c071f7d2d4c390dd  verglos-scanner-2.0.0-alpha.1.tgz
15548bdb508773e4a99b32cace384c80eee0d7fd7880b837169bf9cc16139b3  verglos-shared-2.0.0-alpha.1.tgz
```

## Acceptance mapping

This advances the current package/archive evidence for `DIST-001`. The row
remains unchecked because LOCAL/HUNT/RECORD dependency acceptance and final
legal/release qualification remain open. The independent Hunt review remains
separate; no claim is made from this package run.

## Privacy boundary

No source corpus, customer data, credentials, private keys, provider payloads,
npm registry state, or deployment state is included. The disposable archive
directory is local evidence only.

