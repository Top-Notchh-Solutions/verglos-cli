# LIC-002 upstream exact-source recheck — 2026-10-18

## Scope and boundary

This private evidence packet closes one factual source-verification gap in the
LIC-002 technical inventory. It is not legal advice, redistribution approval,
trademark clearance, or a release decision. No package, registry, provider,
database, Production, customer, or browser state changed.

## Source and observations

- Source snapshot retained by the existing LIC-002 packet:
  `ba6c75b4e1d11b59f1e6e7bf13edc3c4be02b13a`.
- `minipass-flush@1.0.7` exact upstream license:
  `https://raw.githubusercontent.com/isaacs/minipass-flush/v1.0.7/LICENSE.md`.
  The fetched file declares Blue Oak Model License 1.0.0 and has SHA-256
  `8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004`,
  matching the installed license-file digest in the transitive review packet.
- `fast-uri@3.1.7` nested benchmark metadata:
  `https://raw.githubusercontent.com/fastify/fast-uri/v3.1.7/benchmark/package.json`.
  The exact metadata declares `private: true`, version `1.0.0`, and license
  `ISC`; its SHA-256 is
  `463a034d344b042e495841b770ca69a812693087ee2053d7c18cc8497e020b58`.
- Blue Oak Model License 1.0.0:
  `https://blueoakcouncil.org/license/1.0.0`.
  The official text requires that recipients receive the license text or link
  and separately reserves the Blue Oak name/trademarks. This records the
  notice and wording obligations; it does not decide whether Verglos may
  redistribute the exact dependency snapshot.
- The existing Trivy v0.74.0, Sigstore, in-toto, fixture, and Hunt recipe
  source records remain the authoritative technical inputs for their separate
  decisions. No source page was treated as legal approval.

## Acceptance mapping

This recheck removes the earlier statement that the `minipass-flush` upstream
license page was unverified. It does not remove the six other Blue Oak review
entries, the nested-component distribution question, exact archive review,
required notice/source obligations, trademark restrictions, or the authorized
company/legal decision. `LIC-002` remains unchecked and the strict inventory
continues to fail closed until those decisions are recorded against the exact
release scope. `LIC-003`, `DIST-001`–`DIST-003`, and `QUAL-CLI-006` remain
downstream open.

## Reproduction

```text
curl -fsSL https://raw.githubusercontent.com/isaacs/minipass-flush/v1.0.7/LICENSE.md | sha256sum
curl -fsSL https://raw.githubusercontent.com/fastify/fast-uri/v3.1.7/benchmark/package.json | sha256sum
```

The upstream pages were also inspected through the official GitHub/raw and
Blue Oak Council URLs on 2026-10-18. No credentials, customer source, or
private provider payloads were accessed.
