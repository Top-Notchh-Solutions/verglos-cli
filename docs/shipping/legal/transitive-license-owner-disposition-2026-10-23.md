# Exact transitive-license owner disposition — 2026-10-23

**Decision ID:** `top-notchh-company-disposition-2026-10-23`

**Decision-maker:** Anurag Yadav, Owner of Top Notchh Solutions and Verglos

**Decision type:** company-level owner disposition for the exact current
Verglos CLI package boundary. This is not an outside-lawyer opinion, an
independent AppSec/Hunt review, or final release/go-no-go sign-off.

## Scope

This disposition applies only to the dependency graph at CLI commit
`2db1139337d60543fd59ec0b7e3130983d40e0a3`, with lockfile SHA-256
`549740faff4c1adc7983d1267030a0fa82d7b86ce790916d9e49c3f87507b9f4`, and
the exact package/version/license/source tuples below. The implementation
records the decision in `scripts/license-review-decisions.mjs`; any mismatch
continues to fail closed.

## Exact approved tuples

| Package | Version | Declared license | Exact source | Installed license-text SHA-256 |
| --- | --- | --- | --- | --- |
| `glob` | `13.0.6` | `BlueOak-1.0.0` | `https://github.com/isaacs/node-glob` | `a49c9ba464796f65b59fca3f1e6ca40912df1e859f575383223f7ec6c5baae09` |
| `lru-cache` | `11.5.2` | `BlueOak-1.0.0` | `https://github.com/isaacs/node-lru-cache` | `8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004` |
| `minimatch` | `10.2.6` | `BlueOak-1.0.0` | `https://github.com/isaacs/minimatch` | `2c7c5d22ed5a8ee968c64757710979afcd77438c48b4a265b94e615babd8a901` |
| `minipass` | `7.1.3` | `BlueOak-1.0.0` | `https://github.com/isaacs/minipass` | `8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004` |
| `minipass-flush` | `1.0.7` | `BlueOak-1.0.0` | `https://github.com/isaacs/minipass-flush` | `8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004` |
| `path-scurry` | `2.0.2` | `BlueOak-1.0.0` | `https://github.com/isaacs/path-scurry` | `8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004` |
| `benchmark` nested under `fast-uri@3.1.7` | `1.0.0` | `ISC`; containing package `BSD-3-Clause` | `https://github.com/fastify/fast-uri` | nested license and containing notice retained in generated notices |

## Owner disposition and controls

- Source/package redistribution is approved for these exact tuples, subject
  to retaining the applicable license text, NOTICE/attribution text, source
  link, and required attribution in every independently redistributable
  package archive.
- BlueOak is not added to the general permissive-license allowlist. The
  source entries are HTTPS provenance normalization, and the exact decision
  additionally requires matching name, version, declared license, source,
  and required notice obligation.
- The nested `benchmark` component remains visible and is not suppressed.
  Its ISC text and the containing `fast-uri` BSD-3-Clause context remain in
  `THIRD_PARTY_NOTICES`, SBOMs, and the inventory.
- No endorsement, sponsorship, certification, or affiliation claim may use
  BlueOak, Fastify, Isaacs, or any other upstream identity.
- Unknown, changed, missing, or mismatched metadata must remain a strict
  release blocker and requires a new owner/legal review.

This disposition is the current company-level resolution of the exact
transitive review packet `transitive-license-review-2026-10-08.md`, under the
conditions in `legal-company-decision-2026-10-18.md`. It does not authorize
trusted publication, provider execution, customer acceptance, independent
AppSec/Hunt review, or final release approval.

**Owner authorization date:** 2026-10-23 (IST), recorded at the owner's
direction in the current execution session.

