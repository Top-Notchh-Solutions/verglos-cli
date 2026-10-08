# QUAL-WEB-006 authenticated account performance trace — 2026-10-09

## Scope

- Surface: `https://verglos.com/account`
- Deployment: Web commit `be4289f838b4cd53ed243979bfd7623262b69636`, as
  recorded by the Vercel metadata audit.
- Instrument: Chrome DevTools performance trace through the approved
  authenticated page.
- Conditions: cold reload, CPU 1x, no network throttling; read-only page load.

## Lab results

| Metric | Observed | Interpretation |
| --- | ---: | --- |
| LCP | **784 ms** | Good lab result |
| LCP TTFB | **100 ms** | Good lab result |
| LCP render delay | **684 ms** | Largest portion of this lab LCP |
| CLS | **0.00** | Good lab result |
| CrUX field data | **Unavailable** | No field evidence for this page |

The trace identified approximately **14.4 KiB** of legacy JavaScript in one
shared chunk, with **0 ms** estimated FCP/LCP savings. No optimization change
was justified by that finding alone.

## Trace limitations

The Chrome profile had a separate YouTube tab producing concurrent media
requests. DevTools therefore reported a cross-tab network dependency chain
containing YouTube URLs. That chain is excluded from Verglos product findings;
it does not establish a Verglos critical-path defect. No app interaction or
application mutation occurred.

## Disposition

This is fresh lab performance evidence for `QUAL-WEB-006`, not field/CrUX or
full performance acceptance. INP under a representative interaction set,
large-dataset behavior, responsive routes, human screen-reader review, and
complete dashboard coverage remain open. No production, database, migration,
payment, provider, deployment, account, entitlement, deletion, or
customer-data write occurred. The backlog remains **218 checked / 62
unchecked / 280 total (77.9%)**.
