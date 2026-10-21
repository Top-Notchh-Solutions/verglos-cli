# FINAL-WEB-007 six-path browser audit and source remediation — 2026-10-21

## Scope and boundary

- **Target:** public `https://verglos.com/`, audited read-only in the existing
  authenticated Chrome tab; no new tab/window, production write, deployment,
  provider action, or Preview-protection bypass was used.
- **Paths:** `/`, `/docs`, `/detectors`, `/proof`, `/verify`, and `/checkout`.
- **Conditions:** desktop `1440x900` and mobile `390x844`, cold reloads with
  Fast 4G and 4× CPU throttling, Lighthouse plus Chrome performance traces.
- **Preview boundary:** the exact protected Preview redirected to Vercel
  login. It was not bypassed, so this packet does not claim Preview identity.

## Production observations

| Path | Desktop | Mobile | Lighthouse findings |
| --- | --- | --- | --- |
| `/` | LCP 577 ms, CLS 0.00 | LCP 588 ms, CLS 0.00 | 61 pass / 0 fail; all audited categories 100 |
| `/docs` | LCP 486 ms, CLS 0.00 | LCP 546 ms, CLS 0.00 | 55 pass / 1 fail: `td-has-header` |
| `/detectors` | LCP 442 ms, CLS 0.00 | LCP 532 ms, CLS 0.00 | 50 pass / 0 fail; all audited categories 100 |
| `/proof` | LCP 496 ms, CLS 0.00 | LCP 542 ms, CLS 0.00 | 52 pass / 1 fail: `color-contrast` |
| `/verify` | LCP 728 ms, CLS 0.00 | LCP 838 ms, CLS 0.00 | 46 pass / 1 fail: `meta-description` |
| `/checkout` | LCP 988 ms, CLS 0.00 | LCP 1292 ms, CLS 0.00 | 46 pass / 4 fail: provider cookies/inspector issues, `meta-description`, intentional noindex crawl refusal |

The browser DOM observation found canonical metadata and crawlability on the
public routes. `/checkout` is intentionally disallowed by `src/app/robots.ts`
because it is a transactional route; Lighthouse's crawlability failure is
therefore an intentional boundary, not a new defect. No console errors or
warnings were observed and no network request failed during the audit. No
qualifying interaction occurred, so INP was not measured; CrUX field data was
unavailable.

## Source remediation

The current Web worktree implemented and committed the source fixes as
`70f69de` (`fix(web): close public surface audit gaps`):

- `/docs` now gives both plan tables explicit column headers and row headers,
  with a caption for the catalog terms table, closing the `td-has-header`
  source defect.
- `/proof` raises the Boundary label from `text-[#f5f2ea]/45` to `/60`,
  closing the observed 4.15:1 contrast failure against `#111513`.
- `/checkout` now declares metadata, canonical, and intentional noindex
  behavior. The eager `next/script` Razorpay load was removed; the existing
  client flow still inserts the hosted provider script only after explicit
  payment interaction, reducing unsolicited provider surface activity.
- `src/app/docs/truth-contract.test.ts` now regression-checks the table,
  contrast, metadata, noindex, and deferred-provider contracts.

## Qualification

From the clean Web worktree at `70f69de`:

- `pnpm test:truth-registry`: **35/35 passed**.
- `pnpm test:landing-release`: **4/4 passed**.
- `pnpm test:public-release-smoke`: **2/2 passed**.
- `pnpm public:release-smoke`: **passed**, 16 routes, 22/22 claims, 2 proof
  assets, 0 issues.
- `pnpm exec next typegen && pnpm typecheck`: **passed**.
- `git diff --check`: **passed**.
- `pnpm build`: **passed** from a fresh detached worktree at `70f69de`
  outside the conflicted parent checkout. Next compiled successfully, linted
  and type-checked, and generated **49/49** static pages. The original source
  worktree's failed build was an environment/layout artifact caused by the
  unrelated parent `package.json`; the parent checkout was not modified.

## Disposition

This advances current-source implementation and regression evidence, but it
does not retroactively change the deployed Production result. No deployment
was initiated, so the browser failures above remain Production follow-up until
the source commit is deployed and the six paths are requalified. FINAL-WEB-007
remains unchecked for deployed exact-head identity, actual INP/field-CWV,
human screen-reader/keyboard acceptance, supported-environment evidence, and
final release acceptance. FINAL-WEB-008 remains open for its acceptance and
release dependencies.

No raw credentials, cookies, customer data, or provider secrets are retained
in this packet.
