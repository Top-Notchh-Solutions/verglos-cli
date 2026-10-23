# ACCEPT-005 authorized-workflow version binding — 2026-10-23

Private shipping implementation commit `040aee22` binds the authorized
external-workflow execution record to the same bounded SemVer contract used by
candidate freeze, reconciliation, and final regression validation. A
malformed execution version such as `latest` now fails closed instead of being
recorded as a qualified CLI run.

Verification passed:

- adjacent acceptance/release contracts: **59/59**;
- the new authorized-workflow malformed-version regression passed;
- acceptance study protocol validation: passed;
- validator syntax and `git diff --check`: passed.

This is code-side integrity evidence only. `ACCEPT-005` remains unchecked for
an actual authorized external-repository workflow, recipient/customer
acceptance where required, independent review, provider/hosted evidence, and
final release decision. No external repository, provider, Production,
customer, deployment, publication, or release-sign-off state changed. Nothing
was deleted or overwritten. The live score remains **244 checked / 36 open /
280 total (87.1%)**.
