# DIST-002 registry response boundary merged · 2026-10-23

CLI PR #193 merged normally into `main` as merge commit
`c0f0db6ab8ab223d0eead310bf827fc11da59bbd`, preserving source commit
`dedcc90dc38d4593eab72e86655e127416753ab7` and the source branch. All 12
required hosted checks passed: Ubuntu/macOS/Windows Node 20/22/24, official
standard/provenance validation, in-toto release binding, and Verglos
self-scan.

The merged implementation bounds npm registry metadata preflight responses to
1 MiB, uses bounded streaming UTF-8 decoding with reader cancellation, bounds
fallback text responses by encoded byte length, and fails closed on oversized
or invalid bytes. Local verification passed `pnpm build` (8 successful
tasks), `pnpm typecheck` (14 successful tasks), the complete release-contract
suite (**60/60**), and `git diff --check`.

No npm package was published, no tag or release was created, and no provider
write or workflow dispatch occurred. The owner-confirmed `NPM_TOKEN` remains
unused by the OIDC-protected publication path. DIST-002 remains open for the
provider/trusted-publisher lifecycle, actual immutable publication/provenance,
and final acceptance. The score remains **244 checked / 36 open / 280 total
(87.1%)**. Nothing was deleted or overwritten.
