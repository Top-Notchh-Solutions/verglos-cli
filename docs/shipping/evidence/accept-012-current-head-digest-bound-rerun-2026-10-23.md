# ACCEPT-012 current-head digest-bound rerun · 2026-10-23

## Execution

After the strict report-binding implementation was corrected in private
commit `5b270197`, the actual six-fixture verification manifest was rerun
through the command wrapper:

```text
node scripts/triage-public-oss-corpus.mjs \
  /Users/anuragyadav/Developer/TopNotchh-Workspace/.local-evidence/public-oss-corpus-2026-10-23/verification.json \
  /tmp/verglos-public-oss-triage-2026-10-23-v4.json
```

The verification manifest is the retained exact-commit six-fixture manifest
with SHA-256
`826757c97e91fb6676211d358b923c212819bd087b7014662228ace0f128a69f`.
The digest-bound triage output is SHA-256
`83b429554405298592249132ec79dcba7a32d8324f629d70df3c951ea1b977af`.

## Result

- **6** exact fixtures;
- **207** observations;
- **19** rule-level feedback groups;
- **0** coverage gaps;
- `classificationStatus: complete`;
- `adjudicationStatus: open`;
- `customerAcceptance: not-claimed`; and
- `independentReview: required`.

The run proves that the current command wrapper accepts the authoritative
raw-hex report digests, verifies each report's size and bytes, and emits only
bounded digest-only triage. It does not adjudicate findings or create customer
acceptance.

## Boundary

This materially advances `ACCEPT-012` but does not close it. `ACCEPT-011`,
`QUAL-CLI-006`, held-out correction, independent review, and final acceptance
remain open. No provider, Production, customer, recipient, publication, or
release state changed; nothing was deleted. The live score remains **244
checked / 36 open / 280 total (87.1%)**.
