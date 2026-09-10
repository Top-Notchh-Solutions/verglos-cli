# Verglos AI-Change Context Contract

Status: V1 contract implemented by `CONTRACT-005`

Owner: Evidence/Provenance

Last reviewed: 2026-09-09

Schema `urn:verglos:schema:ai-change-context` version `1.0.0` records one provenance input against an exact subject and optional bounded path/range. It deliberately separates heuristic estimates, declarations, and cryptographically verified declarations.

## Evidence classes

| Basis | What it may say | Required presentation |
|---|---|---|
| `heuristic` | A reproducible likelihood estimate from named signals, method/config version, and input digest | `estimate` |
| `declared` | What a person, tool, organization, trailer, commit message, or metadata field claims | `declared-claim`; authenticity remains `not-cryptographically-verified` |
| `cryptographic` | That a signer signed exact statement bytes and a verifier evaluated them under an exact trust policy | `verified-declaration` only after verified status, time, and bundle digest; otherwise `unverified-declaration` |

Every class requires visible limitations. A heuristic cannot render as a fact. A Git trailer is not promoted to cryptographic evidence. An invalid or unverified signature cannot render as verified. A verified signature proves the declaration and binding allowed by its statement/trust policy; it does not independently prove that every changed line was produced by a particular person or model.

Cryptographic claims distinguish AI change, change authorship, build provenance, artifact provenance, and other claims. Build/artifact provenance must use `not-asserted` for AI classification, preventing a valid SLSA/in-toto statement from being relabeled as AI authorship evidence.

## Binding and reproducibility

Each document carries a UUID, immutable subject ID, subject/path/range scope, and observation time. Heuristics bind method ID/version/configuration digest, input digest, bounded signals/directions/strengths, likelihood, and confidence. Declarations bind their raw declaration digest and extraction method. Cryptographic evidence binds statement and optional verification-bundle digests, signer identity/issuer, exact trust-policy ID/version/digest, status, and verification time.

This schema does not combine inputs into one final classification, assign observation fingerprints, verify signatures, or migrate the current scanner's legacy likelihood buckets. Those operations require explicit adapters, aggregation policy, fixtures, and UI wording in their named downstream tasks.

`packages/shared/src/ai-change-context.test.ts` covers estimate-only heuristics, required limitations, declaration truth, verification evidence, invalid/unverified presentation, build-provenance non-inference, subject/range bounds, and future-version upgrades.
