# Vercel Production migration and post-deploy smoke · 2026-10-24

## Production action

- **Web source:** `verglos-web` commit `791500d4dbc495312287287f692a6fc39120e3a2`; its tree matches the merged Web `main` commit `98b5cf652623bf4f000ed93366b67a38154579e1`.
- **Command:** `vercel --prod --yes` from the clean Web worktree.
- **Deployment:** `dpl_EAgP2Crg4EmSJgWVLeQpMWCss9Uf` · `verglos-dpgi0zd9v-anuragyadav20062002s-projects.vercel.app`.
- **Provider receipt:** Vercel reported `READY`, target `production`, and aliased the deployment to `https://verglos.com`.
- **Build receipt:** runtime configuration passed; the explicit reviewed Production migration hook ran `pnpm db:migrate` and reported `[✓] migrations applied successfully!`; Next.js generated **49/49** routes and the deployment completed successfully.
- **Read-only database receipt:** the Production migration ledger contains **44** applied entries; all six QUAL-WEB-005 support tables are present. `account_deletion_requests=0`, `account_deletion_jobs=0`, and `account_deletion_receipts=0`.
- **One-shot safety:** `VERGLOS_RUN_PRODUCTION_MIGRATIONS=1` and `VERGLOS_PRODUCTION_MIGRATION_CONFIRMATION` were removed from the Vercel Production environment after the successful deployment. Future deploys do not run migrations implicitly.

## Post-deploy smoke

Captured at `2026-10-23T22:08:44Z` with unauthenticated GETs. Response bodies were hashed locally and no response was uploaded.

| URL | HTTP | Bytes | SHA-256 |
|---|---:|---:|---|
| `https://verglos.com/` | 200 | 215245 | `c6812180d7595ec5ced393fa9b25507b5fc57ecf721c77f8fedf36c95f187d02` |
| `https://verglos.com/proof` | 200 | 24892 | `eee9f35a48239e41ef2b9f5d0c0ff04bfe9dd6a6be5a8290ac4bc3a8e08a4d54` |
| `https://verglos.com/llms.txt` | 200 | 4380 | `eeaf3b3f7239d075ef2effcd49d5d80dfaee714c8c10faf274bf464c793c28e8` |
| `https://verglos.com/robots.txt` | 200 | 180 | `5e22ba5ed294bf64e20d8baa6f7808488d84190bd1297c8275a83120c218fa5c` |
| `https://verglos.com/sitemap.xml` | 200 | 1345 | `dc55c82771d3af4e46b616263679278f8dc19d6fd742ce9bf146ef2b2c4231a8` |
| `https://verglos.com/api/razorpay/create-qr` | 405 | 0 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

## Boundary

This is real provider/Production migration and read-only smoke evidence. It does
not claim account-deletion acceptance: no deletion request, job, or receipt was
created. It does not claim payment capture, customer acceptance, independent
AppSec/Hunt review, field-CWV review, npm publication, or final release sign-off.
No files, branches, customer records, or application data were deleted.

