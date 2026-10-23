# TEAM-CLI-002 CLI check-payload implementation evidence

Date: 2026-10-08
Status: implementation progress only; acceptance remains open.

## Scope

CLI PR #80 adds a bounded `verglos ci` command path for producing the source-free SCM check payload already defined by `@verglos/shared`.

The command accepts one local Release Decision projection, a verified Release Record manifest digest, an HTTPS record URL, and an exact commit. It validates the input before producing the payload. It does not upload source, fetch the record URL, call a provider, or deliver a check.

## Changes

- `packages/cli/src/ci-check-payload.ts` implements bounded regular-file input and stable `CI_CHECK_PAYLOAD_INPUT` failures.
- `packages/cli/src/index.ts` exposes `verglos ci --check-payload ... --record-manifest-digest ... --record-url ... --commit ...`.
- The command emits the shared deterministic payload in JSON or concise human output.
- CLI tests cover successful machine output, human output, malformed input, unsafe URL, missing arguments, and process-level behavior.

## Verification

- Focused check-payload/process tests: 7/7 pass.
- Full configured CLI package suite: exit 0.
- CLI package typecheck: pass.
- CLI package build: pass.
- `git diff --check`: pass.
- Public-boundary audit: pass.
- Latest implementation head: `58bb9383bdd1273e973620472ffc2d9255be7e9d`.
- Pull request: https://github.com/Top-Notchh-Solutions/verglos-cli/pull/80
- Hosted qualification passed all 9 OS/Node cells, self-scan, and in-toto;
  PR #80 merged by squash as `d865fb1809ad651fd6ae7e011f089dee07733d79`.

## Not accepted by this evidence

This does not prove signed organization-policy activation, hosted SCM/provider delivery, GitHub/GitLab installation authorization, live retry/replay behavior, or production activation. TEAM-CLI-001 and TEAM-CLI-002 therefore remain unchecked.
