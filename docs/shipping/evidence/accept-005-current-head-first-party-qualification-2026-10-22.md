# ACCEPT-005 current-head first-party qualification · 2026-10-22

## Scope

The owner-controlled qualification command was rerun against the exact clean
merged CLI/Web heads. It is first-party technical qualification only; it is
not external consented-team/recipient acceptance, provider acceptance, or an
independent AppSec review.

- CLI source: `/private/tmp/verglos-cli-ent-current-20261022`
- CLI commit: `1d7844bd0fcfa4415e2c9462f9b5fb5293326915`
- Web source: `/private/tmp/verglos-web-acceptance-20261022`
- Web commit: `ba00d5d86fdbcaeeee817c2c66b86f0b3de01987`
- Runtime configuration: telemetry disabled; provenance intentionally
  disabled for this bounded run

## Results

Both scans completed with exit code **0**:

| Target | Findings | Score | Risk | Coverage | Report SHA-256 | Terminal SHA-256 |
| --- | ---: | ---: | --- | --- | --- | --- |
| CLI | 78 | 67 | high | incomplete | `e2f425804d305ef6862b709afeb15f48502ac2765e664d30e3f7f0aeeac86b5b` | `7da9bd45e85c472e1bd9b06265253a011a53b92615025c945970d639d88b1f95` |
| Web | 22 | 73 | medium | incomplete | `984f5be6020f555fa3c4eddbe59bb93957af6fe8a80886a99560053b17c916fc` | `285e4bd338201ec1a6fd8c578027c92c79c8a0efbe4f47876a588d1397a32e17` |

The raw reports remain in private temporary qualification directories and are
not copied into the ledger. The scanner explicitly records provenance as
skipped; this run therefore makes no complete-coverage or security-review
claim. No customer source, provider, Production database, deployment, or
external repository was accessed.

## Disposition

This refresh replaces stale first-party commit references for implementation
qualification only. Keep `ACCEPT-005` unchecked for the named external owner's
consent record, exact founder authorization, external workflow/reconciliation,
and fixture/evidence expiry or deletion proof.
