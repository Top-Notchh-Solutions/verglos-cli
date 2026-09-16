# `@verglos/attest` (retired alpha scaffold)

The old Ed25519 summary-bundle scaffold is retired. This private alpha package no longer exports `signBundle`, `SigningKey`, `VerifyChain`, or summary-shaped `AttestationBundle` types. Its remaining type exports are canonical Release Record types from `@verglos/shared`; those types alone do not assert that a record was signed, published, or verified.

Use the CLI's local workflow instead:

```text
verglos record create
verglos record sign
verglos record verify
```

The record workflow does not upload or publish by default. Hosted record receipt and public verification are separate, incomplete capabilities; do not treat legacy random-hash summary URLs as cryptographic verification.

See [`docs/2.0.0-hunt-and-attest.md`](../../docs/2.0.0-hunt-and-attest.md) for the alpha/beta boundary.
