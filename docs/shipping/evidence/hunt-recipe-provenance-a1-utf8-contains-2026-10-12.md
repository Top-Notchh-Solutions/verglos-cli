
# Hunt recipe provenance — a1-utf8-contains

**Status: FIRST-PARTY CONFIRMED — technical approval and independent review pending**

Founder clarification recorded on 2026-10-12: a1-utf8-contains is owned by
Top Notchh Solutions and is part of Verglos. It is not being treated as a
copied third-party recipe for this V1 record.

## Technical identity collected from the workspace

- Recipe ID: a1-utf8-contains
- Rule ID: hunt.a1.utf8-contains
- Package surface: @verglos/hunt
- Adapter: restricted-process
- Command: verglos-probe utf8-contains
- Assertion: probe result is true
- Required inputs: needle, value
- Network mode: denied
- Maximum network requests: 0
- Cleanup: always
- Redaction: required
- Limits in the source fixture: timeout 1000 ms, CPU 900 ms,
  memory 64 MB, disk 16 MB, output 1024 bytes, processes 1
- Current local source observed: private shipping tracker Hunt catalog
- Current local tracker head: 8d8bf6a5e83645adb06a3ce7c0ca5303bcc634a0
- Public CLI main head observed separately: 74fd6cdc595ae6911792d0afb444dbbb5ca5985f
- Existing catalog evidence:
  docs/shipping/evidence/hunt-008-supported-recipe-catalog-2026-10-06.md
- Existing recheck evidence:
  docs/shipping/evidence/hunt-008-contract-recheck-2026-10-11.md

## Fixture contract already present in code

| Fixture | Expected verdict |
|---|---|
| positive | confirmed |
| negative | not-reproduced |
| timeout | inconclusive |
| adapter-failure | environment-error |

## Ownership/legal fields requiring confirmation

- Ownership classification: FIRST-PARTY
- Publisher/author: Top Notchh Solutions / Verglos
- Exact source URL or internal source path: Verglos Hunt catalog in the private
  shipping workspace; Codex records the exact source commit during qualification
- Exact source version/commit: [CODE WILL RECORD AT QUALIFICATION]
- Artifact digest, if copied: [CODE WILL CALCULATE]
- License/SPDX identifier: Verglos/TNS-owned first-party product code; final
  release license decision remains in LIC-002/LIC-003
- License/NOTICE URL: [LEGAL/RELEASE RECORD REQUIRED]
- Modification permission: TNS-controlled; final contributor/release policy
  record remains in LIC-002/LIC-003
- Redistribution permission: TNS-controlled; final V1 release decision remains
  in LIC-002/LIC-003
- Trademark/endorsement restrictions: [LEGAL/RELEASE RECORD REQUIRED]
- Required attribution/NOTICE text: [LEGAL/RELEASE RECORD REQUIRED]
- Approval reference: OPEN

## Important boundary

The technical catalog and founder ownership statement establish first-party
ownership for this rule. They do not by themselves complete the product
approval, independent Hunt/AppSec review, or final release/legal records.
Those separate gates remain open.
