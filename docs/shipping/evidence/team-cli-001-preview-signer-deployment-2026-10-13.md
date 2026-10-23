# TEAM-CLI-001 Preview signer deployment and hosted-policy result

Date: 2026-10-13  
Web project: `anuragyadav20062002s-projects/verglos-web`  
Environment: Preview only

## Change made

The Preview environment now has the organization-policy signer configuration:

- `VERGLOS_ORGANIZATION_POLICY_PRIVATE_KEY`: configured as a Vercel Secret;
- `VERGLOS_ORGANIZATION_POLICY_SIGNER_ID`: `tns-preview-policy-2026-10-13`;
- `VERGLOS_ORGANIZATION_POLICY_ISSUER`: `https://verglos.com`.

The private key value is intentionally not recorded here, in Git, or in chat.
Its public key fingerprint is:

```text
sha256:d77adc7859fb586f92deb9bdf933bbb48a6b8448ec5a14f33da54060efcb4d43
```

Production was not changed.

## Deployment

Preview deployment:

```text
Deployment: dpl_CRK55VBFXboK3dEiDmk9Uxg7X21W
URL: https://verglos-5h5slhwcp-anuragyadav20062002s-projects.vercel.app
Build: passed; 47 static pages generated
```

## Hosted route result

The signed policy route was requested for the existing isolated test
organization and its repository path:

```text
/api/v1/organizations/b520c693-9c2f-4644-8310-c13ea214a133/repositories/1/policy
```

The route was reached and returned:

```text
HTTP 503
{"ok":false,"reason":"policy unavailable"}
```

This is the expected fail-closed result when the required canonical policy
and SCM binding are absent.

## Database inspection

The isolated Preview/test database was inspected without changing data:

- users: 8;
- licenses: 6;
- organizations: 9;
- projects: 1;
- `scm_installations`: 0;
- `policies`: 0.

The existing Preview test user has an active Pro license, but the database has
no GitHub/GitLab installation, numeric repository binding, or published
canonical organization policy to sign.

## Acceptance state

This deployment proves the signer configuration and fail-closed route wiring,
not TEAM-CLI-001 acceptance. The row remains open pending:

1. an authorized GitHub/GitLab application installation;
2. a repository binding in the isolated organization;
3. a published canonical policy row;
4. signed fetch, CLI verification, cache, offline, and cross-tenant evidence.

No Production, payment, entitlement, or database write was performed. The
private tracker remains at **228 checked / 52 unchecked / 280 total (81.4%)**.
