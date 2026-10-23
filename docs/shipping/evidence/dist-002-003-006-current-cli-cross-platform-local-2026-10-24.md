# Distribution implementation verification — 2026-10-24

## Scope

- **Candidate:** CLI `aad2c74395a5c381c955ab9dfab7462295564840`
- **Target rows:** `DIST-002`, `DIST-003`, and `DIST-006`
- **Execution:** local only, with telemetry disabled and no GitHub Actions run
- **Safety boundary:** no npm publish, tag, provider/Production write, customer
  action, signing-key use, or release/go-no-go decision occurred

## Results

- `pnpm build`: **8/8** packages passed.
- Strict dependency-license inventory and `--require-clear`: passed. The
  inventory bound **254** lockfile package versions across **250** package
  entries, retained **1** bundled component, and reported **0** review
  blockers. `pnpm licenses:external` validated **8/8** external records.
- Public packaging: **7/7** expected npm archives generated.
- Packed-manifest audit: **7/7** archives passed.
- Clean-consumer verification: installed all seven archives, imported every
  public library, executed Verglos `2.0.0-alpha.4`, confirmed no external
  engine installation, and executed the bounded restricted-process fixture.
- Focused release contract tests: **29/29** passed, with zero failures,
  skips, cancellations, or todos. This covered license inventory, notices,
  release artifact verification, checksums, release-origin binding, rollback
  evidence, and rollback rehearsal.
- Rollback rehearsal: passed with **5** recorded boundaries, **2** historical
  records preserved, and manifest digest
  `sha256:664f70df2f2a0c063d43c767e602266b1adc1709a498dae7ef71825291b960b7`.

## Archive digests

The seven locally generated alpha.4 archives were hashed before the temporary
cross-platform install configuration was restored:

```text
f85418064b8ef6c6b95bd0d6d40b1deee7afab789aadc5c39dab5a3e559fe193  verglos-2.0.0-alpha.4.tgz
81bbaf3eb71e432c85d2826745872083651d846625ef3965697c99366ead3126  verglos-entitlement-2.0.0-alpha.4.tgz
5af8d6eb42ed2f9cb09da02e6bd81483f5ac1874ebe99c3e029868a06cd7cc46  verglos-hunt-2.0.0-alpha.4.tgz
c4b3a7027ffa9017717455b484b4287bee06b544814f737b1cf7e38df2134f87  verglos-mcp-2.0.0-alpha.4.tgz
ba85bbe72159c0a076ceab6d3081e6d35664b359324945072e60808e85f9f968  verglos-reporter-2.0.0-alpha.4.tgz
64a3cc8c7c0670e5c97b340aaf4ec52b0f938be33edab54fde487eeb63052c77  verglos-scanner-2.0.0-alpha.4.tgz
88b73ebca74dfe9463345ac12f91652d99dbc0e5b05fe547112a9542a45241d9  verglos-shared-2.0.0-alpha.4.tgz
```

The local install temporarily materialized the same broad `supportedArchitectures`
set used by the repository’s CI license workflows so optional platform packages
could be inspected. The lockfile did not change, and the temporary package
configuration was restored after verification. The generated `.artifacts/`
directory remains local and untracked.

## Shipping disposition

This closes the implementation verification slice for `DIST-002/003/006`, but
does not close the backlog rows. Trusted publication/registry receipt,
independent review, and final release authorization remain required by the
backlog contract. The authoritative score remains **245 checked / 35 open /
280 total (87.5%)**, partitioned as **13 AppSec-dependent / 22 non-AppSec**.
