# CLI public-package packing qualification — 2026-10-06

Source: exact current CLI tree at commit `955412516b96cc09393e78c43bf7d02b9abd05d9`.

`pnpm pack:public` completed successfully and produced six archives for
`2.0.0-alpha.1`. Each archive contains `LICENSE` and
`THIRD_PARTY_NOTICES`; the first distribution file was inspected in every
archive. SHA-256 digests:

```text
verglos-2.0.0-alpha.1.tgz            5a98979fdeb813447096a69070caa134f766083d8f7b8a8ae4bc85e1349642a6
verglos-entitlement-2.0.0-alpha.1.tgz a8bbbc4cc6511348620cd4f3c9e686f33415a7b6daee35a267da581c34d3e346
verglos-mcp-2.0.0-alpha.1.tgz        f399a2536357fbb88cb9aeece74fac0fcbe4cb1e96420daf66669059560b95f1
verglos-reporter-2.0.0-alpha.1.tgz   e5b875ce8a159c021c86fe99c0e965c76ff55c45d8e8574ba3c89e14bf02c65b
verglos-scanner-2.0.0-alpha.1.tgz    bd5ec859ea85d8eaf73b70e4429357240f501bd35a2960620690a580e0851d8b
verglos-shared-2.0.0-alpha.1.tgz     f4114e176e1b86607c77f903bfcd2c7b796132246ed4dc784a1b23452232cd6a
```

`pnpm licenses:inventory` completed with exit 0 but reports review blockers
(nested-license conflict, BlueOak review requirements, and one missing source).
Those blockers remain open and are not silently reclassified as approved.
This is packaging evidence, not a release/publication authorization.
