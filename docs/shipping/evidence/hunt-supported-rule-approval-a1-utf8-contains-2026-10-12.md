
# Hunt supported-rule approval — a1-utf8-contains

**Status: DRAFT — technical fields collected; approval pending**

## Rule contract

- Rule ID: hunt.a1.utf8-contains
- Recipe ID: a1-utf8-contains
- Supported language/use: bounded UTF-8 text probe; currently used as the
  evidence-backed A1 Hunt surface, not a general JavaScript execution rule
- Adapter: restricted-process
- Command: verglos-probe utf8-contains
- Inputs: needle, value
- Assertion: probe result is true
- Network: denied; zero network requests
- Cleanup: always
- Redaction: required
- Resource limits: timeout 1000 ms, CPU 900 ms, memory 64 MB, disk 16 MB,
  output 1024 bytes, one process

## Required approval decision

The approver must confirm:

- this rule is supported for the stated input and no broader input;
- positive/negative/timeout/adapter-failure verdicts are correct;
- the rule does not grant arbitrary command or network authority;
- the exact source/provenance record is complete;
- the enabled release scope is clear;
- any limitations are copied into the product truth registry.

## Technical evidence already present

- Existing catalog test enumerates all four fixture names and verdicts.
- Catalog validation rejects unknown recipes, arbitrary commands, and allowed
  network.
- Existing Hunt evidence records package tests and platform qualification.
- Current independent-review requirement remains open.

## Approval record

- Approver name/role: [FOUNDER OR AUTHORIZED PRODUCT APPROVER]
- Approval date UTC: [PENDING]
- Exact CLI commit reviewed: [CODE WILL RECORD]
- Catalog digest: [CODE WILL RECORD FROM THE SIGNED RECIPE]
- License record: hunt-recipe-provenance-a1-utf8-contains-2026-10-12.md
- Decision: OPEN
- Conditions: [PENDING]
- Signature/reference: [PENDING]

This file can be completed by Codex only for technical facts. The approval
decision must be made by the authorized human.

