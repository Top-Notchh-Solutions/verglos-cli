# Verglos Remediation Approval Gate

Applying a remediation proposal requires an approved, unexpired `mutate`
receipt whose target and file scope exactly match the proposal. This module is
an authorization predicate only; it never writes files or runs tests.
