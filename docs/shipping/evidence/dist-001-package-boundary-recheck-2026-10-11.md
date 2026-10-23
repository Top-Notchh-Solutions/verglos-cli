# DIST-001 package-boundary recheck — 2026-10-11

## Result

The private shipping source at commit `14d264dc76f82dad6a53fe929f80edc280ce9642`
was rebuilt with the public packer after a concrete boundary defect was found
and repaired. The packer now excludes compiled `cli-fixture`, `fixture-engine`,
and `fixture-validator` modules from public archives and includes the generated
`THIRD_PARTY_NOTICES` file in every archive.

The six candidate archives were created successfully:

| Archive | Notices | Forbidden fixture modules | SHA-256 |
|---|---:|---:|---|
| `verglos-2.0.0-alpha.1.tgz` | yes | no | `198dc19af2ac90809fd7a4deaac2cea64c40efd92f9d14ae7fb30a2edafe2bc0` |
| `verglos-entitlement-2.0.0-alpha.1.tgz` | yes | no | `b71b7dff8ea1af7e4e4f4ad36f7a2caeb80b8377fcf0f628960d7bf4c527ede5` |
| `verglos-mcp-2.0.0-alpha.1.tgz` | yes | no | `5b510cf3e16e9252a26439c9429ffda8339bfefb784b53d9066dc36fabc6463a` |
| `verglos-reporter-2.0.0-alpha.1.tgz` | yes | no | `a7ceb12a8ae32c0d107218ab371da3c1944713b3d7ee475b7b461a6f4f84597b` |
| `verglos-scanner-2.0.0-alpha.1.tgz` | yes | no | `f2173e5a720afc5b1e2894256ee51f1cb93287e5df97060d7bde11811d2fe929` |
| `verglos-shared-2.0.0-alpha.1.tgz` | yes | no | `21f21317b465f26b49c3f3748e77ed39edf26ec78e1c3831aa3b4332271550d7` |

## Verification

- `node --test scripts/pack-public-packages.test.mjs`: **1/1 passed**.
- `node scripts/verify-clean-consumer.mjs .artifacts/public-packages`:
  **passed**; all six archives installed together and the CLI ran as
  `2.0.0-alpha.1`.
- `node --test scripts/pack-public-packages.test.mjs scripts/verify-clean-consumer.test.mjs scripts/verify-release-artifacts.test.mjs`:
  **5/5 passed**.
- `pnpm --filter @verglos/shared typecheck`: **passed**.
- `pnpm --filter verglos typecheck`: **passed**.
- `git diff --check`: **passed**.

## Scope and remaining acceptance

This closes the code-side package-boundary defect only. `DIST-001` remains
unchecked because its declared `LOCAL/HUNT/RECORD` dependencies and final
release/legal qualification are not complete. The private tracker is expected
to contain `docs/shipping/**`; its public-boundary audit must be run from the
public CLI repository, not from this private shipping tracker.

No registry publication, Production deployment, payment write, entitlement
write, customer-data change, or legal approval was performed.
