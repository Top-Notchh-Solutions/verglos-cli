
# Hunt recipe provenance — a1-utf8-contains

**Status: DRAFT — pending ownership/license confirmation**

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

- Ownership classification: [FOUNDER INPUT REQUIRED]
  FIRST-PARTY / THIRD-PARTY / OPERATOR-INSTALLED / EXCLUDED
- Publisher/author: [FOUNDER INPUT REQUIRED]
- Exact source URL or internal source path: [CODE/FOUNDER TO CONFIRM]
- Exact source version/commit: [CODE WILL RECORD AT QUALIFICATION]
- Artifact digest, if copied: [CODE WILL CALCULATE]
- License/SPDX identifier: [FOUNDER/LEGAL REQUIRED]
- License/NOTICE URL: [FOUNDER/LEGAL REQUIRED]
- Modification permission: [LEGAL REQUIRED]
- Redistribution permission: [LEGAL REQUIRED]
- Trademark/endorsement restrictions: [LEGAL REQUIRED]
- Required attribution/NOTICE text: [LEGAL REQUIRED]
- Approval reference: OPEN

## Important boundary

The technical catalog proves that the rule is bounded and recognized. It does
not prove that the content is legally redistributable or independently
security-reviewed. Keep this record DRAFT until those facts are confirmed.

