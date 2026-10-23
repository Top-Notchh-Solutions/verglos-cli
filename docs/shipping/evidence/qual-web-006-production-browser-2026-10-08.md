# QUAL-WEB-006 production browser qualification — 2026-10-08

## Scope and boundary

- Read-only Chrome DevTools MCP observation against `https://verglos.com/`
  and authenticated `https://verglos.com/account`
- Desktop and mobile viewport observations; no form submission, checkout
  order, payment, deletion, database, provider, or deployment mutation
- Lighthouse/a11y snapshots and performance traces are field observations,
  not a substitute for human screen-reader review or real-user CrUX data

## Observed results

| Surface | View | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `/` | desktop | 100 | 100 | 100 | 249 ms | 0.00 |
| `/account` | desktop | 100 | 100 | authenticated surface | 605 ms | 0.00 |
| `/account` | mobile 390×844 | 100 | 100 | authenticated surface | 893 ms | 0.00 |

The authenticated snapshot exposed named navigation links, a main landmark,
headings, status content, and no missing primary route content. The public
homepage passed the desktop accessibility, best-practices, and SEO audits.

An additional read-only navigation audit of `/docs` on the same Chrome CDP
session passed Accessibility **100**, Best Practices **100**, and SEO **100**;
there were no console warnings or errors. The optional Agentic Browsing score
was **67** because the `llms.txt` recommendation audit failed: the existing
file does not meet that tool's recommended H1 shape. The docs page also visibly
shows legacy `$29/mo` and `$199/mo` plan rows, which conflict with the current
verified INR Pro catalog and must be corrected only in the held final truth/
pricing pass.

## Remaining evidence gates

- Human screen-reader and keyboard acceptance remains outstanding.
- Large-dataset runtime evidence remains outstanding for authenticated
  dashboards.
- Complete dashboard/viewer route coverage and field/CrUX evidence remain
  outstanding.
- Public docs pricing/truth reconciliation remains outstanding; the observed
  legacy dollar rows are recorded as a defect, not accepted product truth.
- The account page's SEO audit findings are expected for an authenticated
  surface and are not converted into a public-copy claim.

No QUAL-WEB-006 checkbox changed. This evidence strengthens the field browser
slice only; it does not accept the item.
