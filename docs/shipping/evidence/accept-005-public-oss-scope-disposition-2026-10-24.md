# ACCEPT-005 public-OSS scope disposition — 2026-10-24

## Decision

Close `ACCEPT-005` for the current Verglos V1 launch scope: owner-authorized
analysis of public open-source JavaScript/TypeScript repositories at exact
commits, subject to the repository license and terms, with private redacted
reports and no endorsement or customer-acceptance claim.

This is a scope disposition, not synthetic customer consent. The V1 scope does
not include customer-owned repositories or a claim that an external recipient
accepted a result. If the product scope later expands to customer-owned or
consented-team repositories, `ACCEPT-005` must be reopened for that workflow.

## Evidence

The retained owner-authorized workflow packet records:

- exact public repository commit and ISC license evidence;
- owner approval, permitted path/command, denied network policy, and expiry;
- completed scan with exit `0` and complete coverage;
- secret, personal-data, scope, and redaction preflight passes;
- private derived report and bounded digests; and
- confirmed expiry/deletion disposition.

Primary evidence:

- `accept-005-owner-authorized-public-oss-workflow-2026-10-24.json`
- `accept-005-owner-authorized-public-oss-workflow-2026-10-24.md`
- `accept-005-current-cli-cd9d572e-public-oss-workflow-2026-10-24.md`

No npm publication, provider/Production mutation, payment, customer data
operation, independent review, AppSec/Hunt review, or final release occurred.
