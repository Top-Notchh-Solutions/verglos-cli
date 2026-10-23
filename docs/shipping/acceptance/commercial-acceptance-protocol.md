# Commercial acceptance evidence protocol

Status: frozen for V1 acceptance work. This protocol describes evidence
classification; it does not create a plan approval, payment, provider receipt,
recipient response, or final release decision.

Every commercial event must declare an `evidenceClass` and include that class
in its digest-bound payload:

- `owner-controlled-synthetic` is a fixture used for validator and integration
  contracts. It proves the code path can consume a bounded record; it is not an
  observed agreement, checkout, commercial use, or recipient acceptance.
- `observed-commercial-evidence` is a redacted record from an authorized
  Test-Mode or other permitted commercial observation, with its provider or
  system receipt retained privately and bound to the exact event facts.
- `consenting-recipient` is evidence supplied by a named consenting tester or
  recipient and must retain the applicable consent/retention record privately.

The validator may report structurally complete evidence for a synthetic
fixture, but `acceptanceStatus` remains `open` for every class until the row's
independent review and final acceptance requirements are separately satisfied.
Changing the class without regenerating the event digest must fail closed.

Do not store payment credentials, raw provider secrets, customer-identifying
material, or unredacted agreements in the evidence bundle.
