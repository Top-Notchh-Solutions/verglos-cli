# DIST-002/DIST-003 exact license disposition and release artifacts — 2026-10-23

## Source and decision

- CLI candidate commit: `d2211a674e7d097d9ff6bca335edf7078411bb14`
- Normal merge: PR #181, merge commit `74c9b4ff79c4b8f80e022c8f25f1d321357f9cf5`
- Pushed branch: `codex/license-disposition-20261023`
- Lockfile SHA-256: `549740faff4c1adc7983d1267030a0fa82d7b86ce790916d9e49c3f87507b9f4`
- Exact owner decision: `top-notchh-company-disposition-2026-10-23`
- Decision record: `docs/shipping/legal/transitive-license-owner-disposition-2026-10-23.md`

The release inventory now clears only the six exact BlueOak package tuples and
the exact nested `benchmark@1.0.0|fast-uri@3.1.7` tuple recorded by that
decision. It does not add a general BlueOak allowlist or hide the nested
component. Any version, license, source, parent, or notice mismatch remains a
blocker.

## Local verification

The following commands were run from the exact candidate source commit:

```text
node --test scripts/license-inventory.test.mjs scripts/generate-third-party-notices.test.mjs scripts/verify-release-artifacts.test.mjs scripts/publish-workflow-contract.test.mjs scripts/verify-release-tag.test.mjs
node scripts/license-inventory.mjs --require-clear
node scripts/pack-public-packages.mjs /tmp/verglos-release-artifacts-d10c96
node scripts/verify-clean-consumer.mjs /tmp/verglos-release-artifacts-d10c96
node scripts/generate-release-origin.mjs /tmp/verglos-release-artifacts-d10c96 --source-commit d2211a674e7d097d9ff6bca335edf7078411bb14 --release-tag v2.0.0-alpha.1
node scripts/verify-release-artifacts.mjs /tmp/verglos-release-artifacts-d10c96 --require-seven
node scripts/verify-upgrade-rollback.mjs /tmp/verglos-release-artifacts-d10c96
```

Results:

- Focused release/license tests: **24/24 passed**; `git diff --check` passed.
- Build: **8/8** workspace packages passed.
- Inventory: **254** lockfile package IDs, **250** package entries, one nested
  component, and **zero** unresolved review blockers.
- Release verifier: **14 artifacts** verified — seven npm archives, seven
  sidecars (including external-license records and `RELEASE_METADATA.json`),
  and identical notices inside every archive.
- Clean consumer: seven archives installed, all libraries imported, CLI
  executed as `2.0.0-alpha.1`, no external engine was implicitly installed,
  and the signed `a1-utf8-contains` Hunt fixture executed through the bounded
  restricted-process runtime.
- Upgrade/rollback: `1.8.3 -> 2.0.0-alpha.1 -> 1.8.3` passed.

## Artifact checksums

The reproducible local output directory was
`/tmp/verglos-release-artifacts-d10c96`; `SHA256SUMS` was verified by the
release verifier. The generated package artifacts are not treated as a
publication or customer acceptance event.

```text
4975f582e4071c52bb7d512e03c53386c781c5f97022bb8beadef38e325ede63  verglos-2.0.0-alpha.1.tgz
4ed8c22c0baf958f57a4a922fc66a45516a3df4f272d5834cbb669171bda58bd  verglos-entitlement-2.0.0-alpha.1.tgz
d1889aadce3414af4f94537bfed4947a55f0c2b908ef1a391fb0f14979f4944b  verglos-hunt-2.0.0-alpha.1.tgz
5f9492e0934a7b3bbb7cf9ebd6c086e506fc7f8ed1e1ae1e6f989372085f0541  verglos-mcp-2.0.0-alpha.1.tgz
9c1c6f505f2f32152d1f7a6033971648e7e646cec3eadd24878e7383e3d9c1d2  verglos-reporter-2.0.0-alpha.1.tgz
82a1d6f2da999b3f091a5a5601d7db80b2fb26462692a14460535eae44187e77  verglos-scanner-2.0.0-alpha.1.tgz
3c21c215362681da248c3599997692693f131dd3f4d074234a717bf4e1bfd361  verglos-shared-2.0.0-alpha.1.tgz
5f21dbbd6e95d108095d04d65536df5478c13842cbf78891ffe07c08d0b2664a  THIRD_PARTY_NOTICES
602623e823682e644a208602264ec4730bf9dee8a6f6e6a6f247825bda17061f  SBOM.cdx.json
45cbddbe4275735a20a7303e488ba01d50afd02acbb78bc0cb815c3a2e20e103  SBOM.spdx.json
0dad476f2388ea7ab9ba57f212b29d0adafb16ed84e86baf826ce274f9aae037  dependency-license-inventory.json
b54809c18447f437af49295291e17292f89bd2f88d0e5bb257af9ce0952a3c8a  external-license-records.json
977dae5a5eb0c71ae92d34885525553737fb4bbd9c2c7502e75dded296beeede  clean-consumer-verification.txt
f0bd01bd92d1e62b60ca27adb43b107433c1ff9b4009ca67eeccdff2e1c057ac  RELEASE_METADATA.json
```

## Boundary

This closes the code-side license-inventory blocker for the current package
boundary and provides reproducible local release evidence. `DIST-002`,
`DIST-003`, `DIST-006`, and `QUAL-CLI-006` remain unchecked for their separate
trusted/protected publication, immutable attestation/provider, operational or
independent review, and final acceptance contracts. No npm/registry/provider/
Production/customer operation or final release sign-off occurred. Nothing was
deleted.
