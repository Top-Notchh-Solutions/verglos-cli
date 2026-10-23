# ACCEPT-002/003 current merged-head substrate refresh — 2026-10-22

## Source identity

- CLI source: `6ae6a2a525ecc061e6fef99b91a44fc00504214f` from the preserved
  PR #160 source branch; PR #160 merged to `main` as
  `56b3535a1feffdac74a202259433d8f8536890e7`.
- Web source: `e1b20ac864ff4f6e005382e8792f3abe0aadbf2a` from the preserved
  PR #234 source branch; PR #234 merged to `main` as
  `b640b7fb8492bdf851dbde339be5841e7fdd7232`.
- Both selected source roots were clean at verification time.

## Verification

The private repository-owned verifier exited **0**:

- CLI package suite: **310/312 passed**, **2 explicit skips**, **0 failures**;
  output SHA-256 `7fabd6be6fd0b7f263e209f0ef04eefc004cf595558a66f9bf2b5d4873a3cd8a`.
- Web full suite: **950/980 passed**, **30 explicit skips**, **0 failures**;
  output SHA-256 `d6f7f7d5420bb915892635ee5a61482e106b3d9862f4b2e5d80492139a86f9a8`.
- Composed Studio/Enterprise/Team/quality substrates: **74/74 passed**;
  output SHA-256 `1eb3b58682994a74c3d71f7e7dc9df296343a9cd4d348dcf6ec8fc215c6f2bb8`.
- Frozen acceptance story coverage: **12/12** mappings executed and complete.

No `TEST_DATABASE_URL` was supplied. No hosted HTTP, provider, customer,
reviewer, browser-human, field-CWV, migration, or Production operation was
performed. This is current-head substrate/regression evidence only;
`ACCEPT-002/003` remain open for their external/hosted/provider/customer/
reviewer gates. Score remains **239 checked / 41 open / 280 total (85.4%)**.
