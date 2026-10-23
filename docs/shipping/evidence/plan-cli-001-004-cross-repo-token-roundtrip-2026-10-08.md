# PLAN-CLI-001/004 cross-repository entitlement roundtrip — 2026-10-08

## Boundary

- **Web source:** `verglos-web` exact commit
  `1e2b392e3e4d15da0b9544931419f1088e24292f`.
- **CLI source:** `verglos-cli` exact worktree commit
  `7d060b2852551cc017bbb2b5f70bad22843e7273`.
- **Environment:** one bounded Node process with an ephemeral Ed25519 key
  pair, synthetic active Pro license, synthetic tenant/owner scope, and a
  temporary entitlement cache directory. Temporary material was removed after
  the run.
- **Capture policy:** token and key material were never printed or retained;
  only boolean outcomes and non-sensitive claim summaries were recorded.
- **External state:** no production, Preview, provider, payment, database,
  deployment, customer, or entitlement write.

## Results

- Web v2 issuer returned HTTP **200** with token version **2**, Pro plan, and
  catalog version `2026-10-02.0`.
- Exact CLI verifier accepted the token with `schemaVersion=2`, `plan=pro`,
  synthetic tenant binding, owner role, matching catalog version, and 21
  capabilities.
- Payload tamper changing the signed plan to Enterprise was rejected with
  `signature failed to verify`.
- Verification with an unrelated public key was rejected with
  `signature failed to verify`.

## Disposition

This proves the current Web v2 issuer and current CLI verifier agree on the
v2 wire format, successor-key header/pin path, tenant/role/catalog claims, and
signature failure behavior in an isolated synthetic roundtrip. It does not
close `PLAN-CLI-001/004`: production signer/public-pin alignment, deployed
tenant mapping and activation, supported-version migration evidence, and
hosted acceptance remain open. No backlog checkbox changed; backlog remains
**218 checked / 62 unchecked / 280 total (77.9%)**.
