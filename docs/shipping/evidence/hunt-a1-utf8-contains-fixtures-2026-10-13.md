# Hunt A1 `utf8-contains` four-case fixture evidence

**Status: TECHNICAL RUN COMPLETE — HUNT-008 remains open for approval and
independent/release gates**

## Exact public source

- Public repository: `Top-Notchh-Solutions/verglos-cli`
- Merged PR: #94
- Exact merged commit: `53448684f6c3004ee1490d40ea2cae74ee199af2`
- Package version: `@verglos/hunt@2.0.0-alpha.1`
- Verifier: `scripts/verify-hunt-fixtures.mjs`
- Verifier blob: `9564a425405bcc8fff99edab6d1115e606f886c5`
- Catalog source: `packages/hunt/src/supported-recipe-catalog.ts`
  (`2d2d81f2f76ed7602e1b13fcf936b0caf6d826c0`)
- Adapter source: `packages/hunt/src/restricted-process-adapter.ts`
  (`d308792c13093f52126120c527c33fb915540d80`)
- Worker source: `packages/hunt/src/restricted-probe-worker.ts`
  (`6d5b1131579a461b4ff601368fc5c07da71a4dc6`)
- Test trust-store helper: `packages/hunt/src/hunt-trust-test-support.ts`
  (`9505596f7e70b403609f4ea2f4ec5af0bd4ca17f`)

The rule is the first-party Top Notchh Solutions / Verglos rule already
recorded in the provenance packet. The verifier uses synthetic values only,
an ephemeral signed test feed, an exact approval receipt, a synthetic
artifact subject, and a local report. It does not use customer code, secrets,
provider credentials, or network access.

## Reproducible command

From a clean checkout of the exact commit:

```text
pnpm install --frozen-lockfile
pnpm build
node scripts/verify-hunt-fixtures.mjs
```

The command is a normal `.mjs` process rather than an inline
`--input-type=module` process, so the worker thread receives a valid Node
launch mode on all supported platforms.

## Four-case result

| Case | Canonical verdict | Execution status | Recipe digest | Evidence digest |
|---|---|---|---|---|
| positive | `confirmed` | `completed` | `sha256:ce022f0955d706b1ef5da926c26028e0eb78af2c770e7c5c621df6c413d3948b` | `sha256:925506f190d3060eba1e970a2d7612e6c41576f2a11591c2403ee557c805893a` |
| negative | `not-reproduced` | `completed` | `sha256:ae48eb1a53c54986d1b76827949cdc583e967c34191cc5f5b525e46b39982054` | `sha256:9977a17fd8982f446f058a4170ccb97041d6a926d84c7c4407f9a45e47af398f` |
| timeout | `inconclusive` | `timed-out` | `sha256:34f204001249ddf147c8bd6b04e6d0afd30d4429f71951205e8911da8ec56c85` | `sha256:4fd86a76483e9c8f18c2cf28d0d64401e5d0e721b2d442fa575fe22dd43a4793` |
| adapter-failure | `environment-error` | no clean execution status | `sha256:ce022f0955d706b1ef5da926c26028e0eb78af2c770e7c5c621df6c413d3948b` | no runtime evidence digest; generic failure only |

For positive, negative, and timeout, the result was marked redacted and
reported assurance class `A1`, `restricted-process`, network `denied`, source
access `none`, one process, and `securityBoundary: false`. The adapter-failure
case returned only the generic environment-error outcome; the synthetic
adapter error was not exposed.

## CI retention

PR #94 ran the verifier after build in both workflows:

- Self-scan passed.
- in-toto release binding passed.
- macOS, Ubuntu, and Windows on Node 20, 22, and 24 all passed.
- The workflow uploads a JSON log for the four-case result with 14-day CI
  retention.

## Acceptance boundary

This closes the previously missing direct four-case technical run. It does
not prove Linux/Docker namespace isolation, because A1 is deliberately not an
OS/security boundary. It does not by itself provide:

- final supported-rule/product approval;
- a legal/release decision for recipe redistribution and notices;
- an independent AppSec review of the exact CLI commit;
- hosted entitlement/payment evidence; or
- final Point-5/customer acceptance.

Therefore HUNT-008, HUNT-009, HUNT-010, HUNT-011, and QUAL-CLI-004 remain
unchecked. The authoritative score is unchanged at **228 checked / 52
unchecked / 280 total (81.4%)**.
