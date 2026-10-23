# Web Vercel Production and Preview receipts · 2026-10-23

## Scope

This record binds the current Web candidate to observed Vercel provider
receipts. It records provider execution only; it does not claim authenticated
customer acceptance, human screen-reader review, field CWV, independent
AppSec/Hunt review, npm publication, or final release approval.

## Production receipt

- Provider: Vercel project `verglos-web`
- Deployment ID: `dpl_Cij5ABETkTpdRz2hmAs7Yfhtxz3Y`
- Deployment URL: `https://verglos-17fyunms9-anuragyadav20062002s-projects.vercel.app`
- Environment: `production`
- Provider state: `READY`
- Created: `2026-10-23 21:48:27 IST`
- Git repository/ref: `anuragyadav-git/verglos-web` / `main`
- Exact source commit: `bfb3413516e8f11e6dcef04040387b3dbb130c8b`
- Commit verification: `verified`
- Assigned aliases: `https://verglos.com`, `https://www.verglos.com`,
  `https://verglos-web.vercel.app`

The Vercel deployment API returned the source binding, `target: production`,
and `readyState: READY`. A protected read-only request through `vercel curl`
to `/` returned HTTP **200**. The observed response was HTML served by Vercel
and included `x-matched-path: /`, `strict-transport-security`,
`content-security-policy`, `x-content-type-options: nosniff`,
`x-frame-options: DENY`, and `referrer-policy: strict-origin-when-cross-origin`.

## Preview receipt

- Deployment ID: `dpl_CxJs2TbwEB1SnxTt74Bb1NsTneA5`
- Deployment URL: `https://verglos-4hgfx2gy7-anuragyadav20062002s-projects.vercel.app`
- Environment: `preview`
- Provider state: `READY`
- Git ref: `codex/qual-web-006-dashboard-capture-20261023`
- Exact source commit: `edb6af106a43e48b4ef98b8e7eaa92aba9431c9b`
- Pull request metadata: `#257`

A protected read-only request through `vercel curl` to the Preview `/` route
also returned HTTP **200**.

## Verification commands

```text
vercel api /v13/deployments/dpl_Cij5ABETkTpdRz2hmAs7Yfhtxz3Y --raw
vercel api /v13/deployments/dpl_CxJs2TbwEB1SnxTt74Bb1NsTneA5 --raw
vercel curl / --deployment https://verglos-17fyunms9-anuragyadav20062002s-projects.vercel.app -- -I
vercel curl / --deployment https://verglos-4hgfx2gy7-anuragyadav20062002s-projects.vercel.app -- -I
```

No new npm version, tag, or public CLI release was created by this receipt
capture. Web qualification rows remain open for their separately declared
authenticated browser, human, supported-browser/field-CWV, deletion,
acceptance, independent-review, and final-release contracts.
