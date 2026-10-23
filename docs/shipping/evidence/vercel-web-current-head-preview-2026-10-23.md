# Vercel Web current-head Preview receipt · 2026-10-23

## Provider receipt

The clean Web `origin/main` checkout at source commit
`42fe33eefd2d2ce23ec89512381af2b767de4e54` was deployed to the owner-managed
Vercel project `verglos-web` as a non-Production Preview:

- deployment ID: `dpl_8aTPJdicafq8zSduHUYwiQcQHg7D`;
- Preview URL: `https://verglos-i91i0ulp6-anuragyadav20062002s-projects.vercel.app`;
- provider state: `READY`;
- Vercel build: Next.js build completed with **49/49** static pages generated;
- runtime configuration and deployment build checks passed.

The deployment was created from a clean checkout at the source commit above.
Vercel's CLI-source inspection reports no provider `gitSource` object, so this
record binds the source SHA to the deployment command locally; it does not
pretend that Vercel supplied a Git commit binding.

## Read-only smoke

Vercel's protected curl path returned **HTTP 200** for `/`, `/proof`,
`/llms.txt`, `/sitemap.xml`, and `/robots.txt`. The root response included
`content-security-policy`, `strict-transport-security`, `x-content-type-options`,
`x-frame-options`, `referrer-policy`, and `permissions-policy` headers. The
root, proof, and llms responses contained their expected Verglos markers.

## Boundary

This is current Preview provider/build evidence only. It is not a Production
promotion, customer/recipient acceptance, human screen-reader or field-CWV
result, independent review, or final go/no-go. No CLI publication, tag,
Production mutation, database mutation, or deletion occurred.
