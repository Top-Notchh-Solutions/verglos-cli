# Hunt AppSec reviewer runbook — fresh-laptop setup evidence — 2026-10-14

## Recorded change

The private Hunt AppSec runbook now contains a from-zero setup for a
reformatted reviewer laptop. The authoritative path is Windows WSL2 with an
Ubuntu distribution and Docker Desktop’s WSL2 integration. A MacBook path is
included only for preliminary/source inspection because macOS cannot by
itself establish the Linux namespace qualification.

## Exact review inputs retained

- Public repository:
  `https://github.com/Top-Notchh-Solutions/verglos-cli.git`
- Review commit:
  `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`
- Package manager: `pnpm 9.15.9`
- Reviewer runtime: Node 22.x
- Pinned integration image:
  `postgres:15-alpine@sha256:2bf082886c059b4cf5af3f9e8d3a8916c35699062899061c13bc32d5921c631a`

## Fresh-laptop steps now documented

1. Install Ubuntu WSL2 from Administrator PowerShell and restart if Windows
   requests it.
2. Verify Ubuntu is WSL version 2.
3. Install and start Docker Desktop, enable the WSL2 engine, and enable
   Ubuntu integration.
4. Install Git, curl, certificates, and build tools in Ubuntu.
5. Install Node 22 with the pinned nvm installer and activate pnpm 9.15.9.
6. Verify Linux kernel, Docker client/server, Docker Linux server OS, and
   architecture before cloning the public source.
7. Clone the exact public commit, run the pinned Hunt suite, and return the
   reviewer report plus generated artifacts.

No GitHub token, npm credential, Vercel access, repository secret, private
tracker file, customer data, or `.env` file is required.

## Acceptance boundary

This is runbook/readiness evidence only. It does not mark the independent
AppSec gate complete and does not change the backlog score. The gate remains
open until a separate competent reviewer, who did not implement the reviewed
Hunt boundary, returns a dated report with the exact commit, environment,
source inspection, commands, findings, limitations, and recommendation.

Current score remains **229 checked / 51 unchecked / 280 total (81.8%)**.
