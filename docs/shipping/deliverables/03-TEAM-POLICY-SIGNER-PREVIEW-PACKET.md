
# Team organization-policy signer and CLI fetch packet

**Private working packet — TEAM-CLI-001, TEAM-CLI-002**

## Plain-English meaning

Team needs a shared organization policy. The Web signs it. The CLI checks the
signature, confirms the organization/repository binding, shows the digest, and
uses a bounded offline cache.

This is not the entitlement key and not a customer-managed key.

## Technical facts already collected

Web runtime variables:

    VERGLOS_ORGANIZATION_POLICY_PRIVATE_KEY
    VERGLOS_ORGANIZATION_POLICY_SIGNER_ID
    VERGLOS_ORGANIZATION_POLICY_ISSUER

The Web policy route is:

    GET /api/v1/organizations/<organization-id>/repositories/<repository-id>/policy

The CLI implementation already has signed schema verification, digest binding,
bounded fetch, mode-0600 cache, offline TTL fallback, and the policy
organization command.

## Safe Preview setup

Generate a Preview-only Ed25519 key locally:

    openssl genpkey -algorithm ED25519 -out /tmp/verglos-policy-preview-private.pem
    openssl pkey -in /tmp/verglos-policy-preview-private.pem -pubout -out /tmp/verglos-policy-preview-public.pem

Enter the private key only into the Vercel Preview secret variable. Never
commit or paste it into chat. Use a different key for a future Production
activation.

Add in Vercel project verglos-web:

| Variable | Type | Environment |
|---|---|---|
| VERGLOS_ORGANIZATION_POLICY_PRIVATE_KEY | Secret | Preview |
| VERGLOS_ORGANIZATION_POLICY_SIGNER_ID | Config | Preview |
| VERGLOS_ORGANIZATION_POLICY_ISSUER | Config | Preview |

Then redeploy Preview.

## Qualification steps

1. Create/select a test Preview organization and project through the product.
2. Bind a test repository/project through the supported flow.
3. Create and publish a policy through the product; do not insert a row by hand.
4. Fetch it from the CLI using a test license.
5. Record policy ID, version, digest, signer ID, issuer, repository ID, result,
   and cache mode.
6. Repeat offline within the TTL.
7. Test a wrong repository, wrong digest, stale signature, and unavailable
   signer; each must fail closed.
8. Capture the source-free CI approval payload for TEAM-CLI-002.

## Evidence file to produce

    docs/shipping/evidence/team-cli-001-policy-preview-<date>.md

The report must include the exact Web deployment commit, CLI commit, Preview
deployment identifier, policy digest, test commands, results, and limitations.
Codex will populate the commits from the workspace and deployment records.

## Founder input

No commit is needed. The only founder choice is whether this Preview test
organization/repository may be created. The owner authorization recorded in the
collection index allows the technical setup; Production activation remains a
separate decision.

