# Hunt recipe catalog provenance snapshot — 2026-10-13

Status: **technical identity collected; approval and final legal release
treatment remain open**

This private packet records the exact public source used for the current Hunt
catalog. It is an identity/provenance snapshot, not a cryptographic signature,
supported-rule approval, independent security review, or permission to execute
unlisted recipes.

## Source and release identity

- Repository: `https://github.com/Top-Notchh-Solutions/verglos-cli`
- Exact public `main` commit: `1b1ea0b08ecad1b18cfd3736252fa81f0161aa49`
- Package: `@verglos/hunt`
- Package version: `2.0.0-alpha.1`
- Package SPDX metadata: `Apache-2.0`
- Catalog source path: `packages/hunt/src/supported-recipe-catalog.ts`
- Catalog source SHA-256:
  `sha256:4f1ad64b412fbbdef15b6548430d56bb7892f3f8df75142aa76b813132ea2ea0`
- Runtime descriptor count: **15**
- Recipe families: **7** (A1 and A2 descriptors cover the same approved
  family scopes at different bounded execution layers)
- A2 image digest:
  `sha256:0a7108bf6c7bf5de370ffb1a3ed6be93d405b43ff159f681a8d18c0e2bc2e402`

Descriptor digests below are SHA-256 over the deterministic JSON serialization
of the catalog descriptor exported by the exact source commit. They identify
the descriptor; they do not assert a signature or legal clearance.

## A1 deterministic fixture descriptors

| Recipe ID | Rule ID | Descriptor digest | Source/ownership classification |
|---|---|---|---|
| `a1-utf8-contains` | `hunt.a1.utf8-contains` | `sha256:00b1392a309dc42528f8f17a951f6761ee6b60aeab67139610e95a8cbf567841` | First-party Verglos catalog |
| `a1-path-traversal` | `hunt.a1.path-traversal` | `sha256:010b2259ee5f68079f9afd620e3135e330563ab70b183c2044d70337b4d192ca` | First-party Verglos catalog |
| `a1-command-injection` | `hunt.a1.command-injection` | `sha256:99ee402dd052cd4f39771ed4e1bcc3472a76c39ba675ede150d820366796a49` | First-party Verglos catalog |
| `a1-ssrf-target` | `hunt.a1.ssrf-target` | `sha256:becbbe483e3166ef13fabe219a48bb4fae1450d415ba5bff0328a447d3cec0a2` | First-party Verglos catalog |
| `a1-tenant-boundary` | `hunt.a1.tenant-boundary` | `sha256:ba5a1adbfa0b730763b89e9c1d89ac4d7aff2314b516d825c5f4b69e57de0f76` | First-party Verglos catalog |
| `a1-sql-injection` | `hunt.a1.sql-injection` | `sha256:6bd7e583432adf7fe6191be852595f659bcf86dd4c800178bedbdeecebb0830a` | First-party Verglos catalog |
| `a1-xss-safe` | `hunt.a1.xss-safe` | `sha256:932e7c1e15ac7679bcad2f7b58f93b23905e77ee72c0083b718bff3b899b3642` | First-party Verglos catalog |
| `a1-agent-boundary` | `hunt.a1.agent-boundary` | `sha256:f8b60ec946a53a17840cac875ab8ef84ff0e85f33cb8f770034d53fba5176da3` | First-party Verglos catalog |

A1 uses the bounded built-in `verglos-probe` adapter. It does not execute
customer source, arbitrary shell, network requests, databases, browsers, or
tools.

## A2 target-harness descriptors

| Recipe ID | Rule ID | Harness path | Descriptor digest | Harness file SHA-256 |
|---|---|---|---|---|
| `a2-sql-nosql-injection-harness` | `D1-001` | `.verglos/hunt/sql-nosql-injection.mjs` | `sha256:6a31dd97dd400b937026cc64e3d8d0ef649b0636178d996b8356367ca6245f6e` | `sha256:211162c6c63b71332f65e093afb26918e4c06774de3aef95557120b024bc6a9d` |
| `a2-command-injection-harness` | `D1-003` | `.verglos/hunt/command-injection.mjs` | `sha256:d694aa52502876b12b8b1d116aa578f32c620a7571113ea2f52e98fa7b33f936` | `sha256:fa4cb1998ea5f046c4a87058569bc38649b26b1e283d0c13b4985a90df837989` |
| `a2-path-traversal-harness` | `D1-006` | `.verglos/hunt/path-traversal.mjs` | `sha256:8b9f209c6a17d12a38ab35fdb2ad1dc8da44fdd5b026b632669dcadc6ececa7a` | `sha256:f7986c2a50966ac8489dfe632e41e4af0c380901d031026c101fefbe129d5bba` |
| `a2-ssrf-harness` | `D9-002` | `.verglos/hunt/ssrf.mjs` | `sha256:5234073ed3c0287a2047ee691cacef4e78e66770c8dd50af74366b75644367ba` | `sha256:98ae9502ba09097ec88e570d2582f17a10fd4a4b423425308c135687fe62dc69` |
| `a2-agent-mcp-harness` | `AGENT-001` | `.verglos/hunt/agent-mcp.mjs` | `sha256:3548fa89cbe8622d80360573b1e4c5891d54096290d3224bb0ba25683d73e5e2` | `sha256:919e33fdd4d417b4f71b3a592af4f78332ec3abdbbf4888aeecdef56486a60ba` |
| `a2-xss-harness` | `D1-004` | `.verglos/hunt/xss.mjs` | `sha256:a6ac900186f0491c44509e9500cd96ced40f9696a1cfa6914330169882826cad` | `sha256:00b0c941f508d63471f49750c4b858e3bf51998b395a4b38222df34aeadb167a` |
| `a2-authorization-harness` | `D3-001` | `.verglos/hunt/authorization.mjs` | `sha256:92f1249231109295dce617d362030af715105ad8f6b616b42cdd91dcf2471c14` | `sha256:a69ebaf4b6769e8cf1db297f908148dac3617296f2f0a0ac8d19c5265942ca83` |

The A2 harness files are public deterministic reference fixtures. They inspect
synthetic strings and emit a strict one-line result; they do not access a real
database, network, browser, credential, or customer repository.

## Approval and legal disposition

- Technical source/provenance: **recorded**.
- First-party ownership classification: **reported by Top Notchh Solutions;
  legal release record still required**.
- Supported-rule approval for the seven families: **open**.
- Modification/redistribution permission: **open in LIC-002/LIC-003 release
  treatment**.
- Trademark/endorsement restrictions and required notices: **open**.
- Independent Hunt/AppSec review: **open**.
- Hosted entitlement and target-code qualification: **open**.

This packet reduces the missing identity artifact but does not close HUNT-008
or any dependent row. The live private tracker remains **228 checked / 52
unchecked / 280 total (81.4%)**.
