# ACCEPT-012 triage integrity boundary · 2026-10-23

## Implementation

Private commit `c46bbdfd` binds public-OSS triage to the exact report artifact
declared by the verification manifest. The bounded file reader now exposes the
parsed value together with its byte count and SHA-256 digest; triage requires
and compares both `reportJson.bytes` and `reportJson.sha256` before classifying
findings. A changed or substituted report is rejected before any feedback is
emitted.

The input validator also requires an exact fixture-count match, a bounded
hexadecimal CLI/fixture commit, and a valid verification timestamp. The output
remains digest-only and continues to mark observations as unadjudicated; this
change does not turn public fixtures into customer evidence or an independent
review.

## Verification

```text
node --test scripts/read-bounded-json.test.mjs scripts/triage-public-oss-corpus.test.mjs
node --test scripts/read-bounded-json.test.mjs scripts/triage-public-oss-corpus.test.mjs scripts/freeze-release-candidate.test.mjs scripts/reconcile-release-gates.test.mjs scripts/run-final-regression.test.mjs scripts/score-comprehension-test.test.mjs scripts/validate-commercial-acceptance.test.mjs scripts/build-acceptance-evidence-bundle.test.mjs scripts/validate-authorized-workflow.test.mjs
pnpm acceptance:study-protocols:check
node --check scripts/read-bounded-json.mjs
node --check scripts/triage-public-oss-corpus.mjs
git diff --check
```

The focused read/triage set passed **6/6** and the adjacent acceptance set
passed **43/43**. Study-protocol, syntax, and diff checks passed. Regression
coverage includes report digest mismatch, report-size mismatch, and fixture
count mismatch. No provider, Production, customer, recipient, publication, or
release state changed; nothing was deleted.

The additive private evidence bundle contains **137 unique hashed files**. Its
content-manifest digest is
`sha256:080873aa5fc877e469686691881cd89ca025cf412c9dc79e6e6f225bf77f250a`;
the bundle file digest is
`sha256:0efb1ab8a378df91dde9336071f566e0ddd2874bb31227490231a5ebee287f37`.
The bundle secret scan passed and provider lifecycle, customer consent,
independent review, authenticated browser, field-CWV, and account-deletion
boundaries remain open.

## Boundary

This closes the report-integrity implementation slice for `ACCEPT-012`. It
does not close `ACCEPT-012`, because the exact frozen corpus still requires
its re-run under the strengthened binding, dependent `ACCEPT-011`/
`QUAL-CLI-006` conditions, held-out correction, independent review, and final
acceptance. The live backlog remains **244 checked / 36 open / 280 total
(87.1%)**.
