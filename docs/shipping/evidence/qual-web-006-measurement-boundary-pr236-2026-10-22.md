# QUAL-WEB-006 measurement-boundary evidence · 2026-10-22

## Implementation

Web commit `ad05d2f7e9ce846c1f036740adf3b6fe4a4a7b21` was promoted through
PR [#236](https://github.com/anuragyadav-git/verglos-web/pull/236) and merged
normally as `dc8f4442df294558eb4d4cbcc1e9f39abeedcb16`. The source branch
`codex/qual-web-006-measurement-boundary-20261022` remains preserved.

The shared accessibility/performance qualifier now fails closed for invalid or
duplicate page paths and malformed runtime accessibility findings. This keeps
an ambiguous or type-erased browser evidence payload from being treated as a
qualified page set.

## Qualification

- Focused QUAL-WEB-006 suite: **21/21**.
- Web typecheck: passed.
- Direct Web test command: **895/919** passed, **24** explicit skips, **0**
  failures, plus the pretest graph **56/62** with 6 explicit skips.
- Merged-head acceptance verifier at Web `dc8f4442` and CLI
  `06c7897525caf499f5128ef0d98f866c17387018`: CLI **311/313** with 2 skips,
  Web **951/981** with 30 skips, composed substrates **75/75**, all **12/12**
  stories executed, exit 0.
- Verifier hashes: CLI output
  `6f6eda3d7e2431b5472e84350655c5bbb4e968bac13e93c4466956216609cc71`, Web
  output `28ddb5f7e0ba2fad1c27af8d16efb9c4d90c79bea0744d6cca68d08ecbd0ab08`,
  composed output `4838ef68fe86fbc8f0f35203b243be0c77288eaca4167f8a37f7f4176592ead0`.
- Vercel Preview Comments and GitGuardian passed. Required Web workflow jobs
  were queued at the final merge/status read and are not claimed as passed.

## Boundary and disposition

No database URL or external operation was used. No browser-human,
field-performance, customer, provider, Production, legal, trusted-publication,
or independent-review acceptance was claimed. No file, branch, record,
deployment, provider, customer, database, or release artifact was deleted or
changed.

Keep `QUAL-WEB-006` unchecked for authenticated dashboard runtime, human
screen-reader review, large-dataset qualification, complete field-CWV
evidence, independent review, and final acceptance. Score remains **239 checked
/ 41 open / 280 total (85.4%)**.
