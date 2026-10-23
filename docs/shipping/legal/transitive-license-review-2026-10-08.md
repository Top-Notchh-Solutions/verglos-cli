# Transitive license review packet — 2026-10-08

This private packet supports LIC-002/LIC-003 and the strict release gate. It
is an inventory and review request, not legal approval. The source snapshot is
CLI `94829e1a4fc8e42dd67545e99cbe9a3a837b9482`, installed with the lockfile's
all-platform optional dependency setup. No package was marked clear by this
packet.

## Review blockers

| Package | Declared license | Dependency path | Upstream repository | Local license-file SHA-256 |
| --- | --- | --- | --- | --- |
| `glob@13.0.6` | `BlueOak-1.0.0` | `sigstore → @sigstore/sign → make-fetch-happen → cacache → glob` | `git@github.com:isaacs/node-glob.git` | `a49c9ba464796f65b59fca3f1e6ca40912df1e859f575383223f7ec6c5baae09` |
| `lru-cache@11.5.2` | `BlueOak-1.0.0` | `sigstore → @sigstore/sign → make-fetch-happen → @npmcli/agent` and `cacache` | `git+ssh://git@github.com/isaacs/node-lru-cache.git` | `8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004` |
| `minimatch@10.2.6` | `BlueOak-1.0.0` | `sigstore → @sigstore/sign → make-fetch-happen → cacache → glob` | `git@github.com:isaacs/minimatch` | `2c7c5d22ed5a8ee968c64757710979afcd77438c48b4a265b94e615babd8a901` |
| `minipass@7.1.3` | `BlueOak-1.0.0` | `sigstore → @sigstore/sign → make-fetch-happen → fs-minipass/cacache` | `https://github.com/isaacs/minipass` | `8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004` |
| `minipass-flush@1.0.7` | `BlueOak-1.0.0` | `sigstore → @sigstore/sign → make-fetch-happen` | `git+https://github.com/isaacs/minipass-flush.git` | `8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004` |
| `path-scurry@2.0.2` | `BlueOak-1.0.0` | `sigstore → @sigstore/sign → make-fetch-happen → cacache → glob` | `git+https://github.com/isaacs/path-scurry` | `8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004` |
| `benchmark@1.0.0` nested under `fast-uri@3.1.7` | `ISC` | `@verglos/mcp → @modelcontextprotocol/sdk → ajv → fast-uri → benchmark` | containing package `https://github.com/fastify/fast-uri` | nested component; inventory reports license conflict with containing `BSD-3-Clause` package |

The license files were read from the installed package snapshot only. Their
digests are evidence identifiers, not a substitute for reviewing the exact
upstream text, package tarball, notice obligations, and redistribution terms.

## Required legal decision

An authorized reviewer must record, for each row:

- whether the declared license and exact version permit Verglos's intended
  source distribution and generated `THIRD_PARTY_NOTICES` use;
- whether the package is shipped, required only for build/test, or reachable
  in a clean consumer install;
- whether the upstream repository identity is sufficient or must be replaced
  by an HTTPS release/source reference;
- required license/notice text and attribution wording;
- whether the nested `benchmark` component must remain in notices or can be
  excluded because it is not part of Verglos's distributed package surface;
- reviewer name, organization, scope, approval date, expiry, and decision.

Until those fields are completed and independently reviewed, the strict
inventory must continue to fail closed. Do not add BlueOak to the permissive
allowlist, add source overrides, suppress the nested component, or publish
release artifacts solely to reduce the blocker count.

## Current disposition

- Owner: release/legal qualification.
- Status: **open — legal decision required**.
- Related backlog: LIC-002, LIC-003, DIST-001, DIST-002, DIST-003,
  QUAL-CLI-006.
- No production, registry, npm publication, deployment, database, provider,
  payment, or customer operation occurred.
