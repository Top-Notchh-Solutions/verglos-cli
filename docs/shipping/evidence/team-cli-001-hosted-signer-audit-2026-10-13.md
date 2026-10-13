# TEAM-CLI-001 hosted organization-policy signer audit — pre-deployment snapshot

Date: 2026-10-13
Project: `anuragyadav20062002s-projects/verglos-web`
Scope: read-only Vercel environment-name audit and source-route reconciliation

## What was checked

This is a historical read-only snapshot taken before the later Preview signer
deployment recorded in
`team-cli-001-preview-signer-deployment-2026-10-13.md`. It must not be read as
the current Preview environment state.

The linked Vercel project was queried with:

```text
vercel env ls --json | jq -r '.envs[].key' | sort -u
```

Only variable names were inspected. Values, encrypted values, database URLs,
credentials, and tokens were not printed or stored.

At the time of this snapshot, neither Preview nor Production exposed these
required hosted policy signing variables:

- `VERGLOS_ORGANIZATION_POLICY_PRIVATE_KEY`
- `VERGLOS_ORGANIZATION_POLICY_SIGNER_ID`
- `VERGLOS_ORGANIZATION_POLICY_ISSUER`

The Web source contract does define them in `.env.example`, and the policy
route correctly fails closed when the signer is absent or partial. The CLI
verification/cache path and Web repository-bound route therefore remain code-
complete but cannot produce a live signed envelope from the hosted project.

## Gate state at snapshot time

TEAM-CLI-001 remained **open** at snapshot time. This audit did not create a
signer, alter Preview or Production, write the database, install an SCM
provider, or close a backlog checkbox. The later Preview signer configuration
is recorded separately; the repository-binding and published-policy gates
remain open.

Owner: Top Notchh Solutions release owner
Missing artifact: a generated, backed-up Ed25519 organization-policy signing
key, its public trust-root distribution, signer ID/issuer configuration in the
intended isolated environment, a published canonical policy row, and an
authorized repository binding for the live fetch/cache/offline run.
Safe next action: configure the signer only in the isolated qualification
environment, publish the matching public key to the CLI trust fixture, and run
the repository-bound fetch/cache/offline/cross-tenant qualification before any
Production activation.
Review date: 2026-10-18
