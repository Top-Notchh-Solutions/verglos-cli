# Acceptance technical corpus — 2026-10-03

This is a private technical-fixture corpus, not a customer cohort. Every checkout is a full clone (`git rev-parse --is-shallow-repository=false`), and every fixture has a local `AUTHORIZATION.md` limiting use to non-destructive local scanning. Findings are not uploaded or published.

| fixture | upstream | commit | license | scan | result |
| --- | --- | --- | --- | --- | --- |
| `juice-shop` | `https://github.com/juice-shop/juice-shop` | `1618a611b173b4bf114028e6e02549950606e29d` | MIT | CLI `9554125`, provenance enabled | 906 files, 55 findings, score 0 / critical |
| `nodegoat` | `https://github.com/OWASP/NodeGoat` | `c5cb68a7084e4ae7dcc60e6a98768720a81841e8` | Apache-2.0 | CLI `9554125`, provenance enabled | 67 files, 31 findings, score 0 / critical |
| `dvna` | `https://github.com/appsecco/dvna` | `9ba473add536f66ac9007966acb2a775dd31277a` | MIT | CLI `9554125`, provenance enabled | 35 files, 17 findings, score 34 / critical |
| `nodejs-goof` | `https://github.com/snyk-labs/nodejs-goof` | `add14ba59e98240d9e00a235dd7d42cd61ae9912` | Apache-2.0 | CLI `9554125`, provenance enabled | 25 files, 29 findings, score 9 / critical |
| `damm-vulnerable-node` | `https://github.com/rdurlo/Damm-Vulnerable-Node-Application` | `1946570b36bf8e6dcac48142f072f40ee9cee160` | MIT | CLI `9554125`, provenance enabled | 38 files, 17 findings, score 34 / critical |
| `buggy-node` | `https://github.com/UtkarshGupta-CS/buggy-node` | `b1b9cbc8b86f81a1ecb0b142190d4fa4698518da` | ISC | CLI `9554125`, provenance enabled | 8 files, 57 findings, score 10 / critical |

Report artifacts remain under the ignored local `.local-evidence` directory:

- Juice Shop: `juice-shop-cli-9554125-provenance/` (complete coverage; hashes in its dedicated evidence record)
- NodeGoat JSON `5155a141b35bb878ef4fa47479f09ebf483ceded251965a4c1cfb5aa41e4f33d`; HTML `43303699f2d932b4a7f5d8888a6d561b16146cf7753497a29ecb27f65ca2f46d`
- DVNA JSON `1265db347cbbaf45640a4f47509f22714de9e9aaf03ad61042396582b3ebe433`; HTML `51cb1610928a09f91684d0f2d0b63d9b3c1e3aaa8dc6689ac51a58c71376bd30`
- NodeGoof JSON `34231e5b1e416658715ac2e109c1cbaea7448a432579fa11f9a992c785ace0bf`; HTML `4508cadb8da324b29e68fac7484320309d92e63281b5deafb577cfbfe1fbd6c2`
- Damm Vulnerable Node JSON `50fd847d6b3cc9372d8008a3fa9b717a7c77487d13044e5e8d55b2b093b9d51e`; HTML `c5d3329d2ba4fab8bf0e65e59f9c6274069456c5565096c46ba0868d679c736e`
- buggy-node JSON `3e6a807e04ef8a08c4e4ff0811798e89e5f85e13e8cb1e8717fcd3826236374e`; HTML `e4b9c256bd2ab2ef2b221031c1c62dc0f8dff7e89cb1c18ee7ef20928b3e690b`

All scans used `VERGLOS_TELEMETRY=0`, current unreleased CLI source commit `955412516b96cc09393e78c43bf7d02b9abd05d9`, and no network verification, exploit, fuzz, load, or Hunt execution. This corpus is progress toward `ACCEPT-001` only; it does not satisfy customer consent, independent review, or the 10–20-corpus final gate.
