# Public npm Hunt runtime qualification — 2026-10-12

**Evidence type:** repository-owned packed-package qualification
**Status:** technical Point-3/Point-5 progress; not release acceptance
**Public runtime commit:** `6762bf41` (`feat(cli): ship bounded Hunt runtime in public packages`)
**Qualified public head:** `78251d1b` (package-content and release-tag audit fixes)
**Public PR:** `https://github.com/Top-Notchh-Solutions/verglos-cli/pull/91`
**Package version:** `2.0.0-alpha.1`

## What changed

The public CLI now ships the audited bounded `@verglos/hunt` package. The
public packer, clean-consumer verifier, package-surface audit, release
verifier, rollback verifier, and publish workflow all require the reviewed
seven-package set. The CLI and MCP host bridge load this package only for the
supported signed recipe path; arbitrary model-generated shell is not exposed.

## Qualification

The runtime checks exited `0` on the runtime commit. The final package-content
and release-tag audits plus release/package regression checks exited `0` again
on qualified head `78251d1b` after the self-scan caught and fixed stale
six-package lists in the audit and release-tag paths.

```text
pnpm --filter @verglos/shared test
pnpm --filter @verglos/hunt test
pnpm --filter @verglos/mcp test
pnpm --filter verglos test
node --test scripts/pack-public-packages.test.mjs scripts/verify-clean-consumer.test.mjs scripts/package-surface-audit.test.mjs scripts/verify-release-artifacts.test.mjs
node scripts/check-package-contents.mjs
pnpm pack:public
node scripts/check-packed-manifests.mjs .artifacts/public-packages
node scripts/verify-clean-consumer.mjs .artifacts/public-packages
```

The MCP suite reported 29 passing tests. The Hunt package suite passed all
executable tests and explicitly skipped 16 Linux/Docker integration cases on
macOS because host namespace coverage is not equivalent. The clean consumer
installed and imported all seven local archives and confirmed that no
external engine was installed implicitly.

## Packed CLI execution

In the clean consumer at `/tmp/verglos-npm-hunt-consumer-LsurN9`, the packed
`verglos` binary executed the signed `a1-utf8-contains` recipe with:

- exact recipe, trust-store, approval, rule, subject, and UUID observation
  bindings;
- a temporary local-only capability cache shaped as `plan=pro` with
  `hunt.critical`, `scan`, and `mcp_server` capabilities;
- isolated `HOME`/`USERPROFILE`, telemetry disabled, and no hosted account
  or Production write.

The result was:

```text
process exit: 1 (expected: the fixture finding was confirmed)
status: completed
executionAuthorized: true
recipeId: a1-utf8-contains
sandbox: restricted-process
canonicalVerdict: confirmed
network: denied
processLimit: 1
sourceAccess: none
```

The public CLI first refused the same execution without the paid capability
with `CAPABILITY_REQUIRED`. `VERGLOS_AS_PLAN=pro` by itself did not grant
access. This proves the local capability gate and packed runtime wiring; it
does **not** prove a hosted Pro entitlement or payment lifecycle.

The projection explicitly reported `legalClearance: false` for the synthetic
fixture feed and disclosed that A1 is a trusted pure probe in a bounded worker
harness, not an OS/security isolation boundary. The fixture feed and license
URLs are test placeholders, not approved customer recipe provenance.

## Disposition

This closes the previously missing public package/runtime wiring and provides
stronger technical evidence for Point 3 and Point 5. It does not close a
backlog checkbox. The following remain required for their rows:

- trusted, licensed, approved customer-facing Hunt recipe provenance;
- Linux/Docker namespace qualification and independent AppSec review;
- hosted Preview/Production entitlement evidence;
- final public release/legal/provenance qualification and acceptance.

Live private score remains **228 checked / 52 unchecked / 280 total (81.4%)**.
