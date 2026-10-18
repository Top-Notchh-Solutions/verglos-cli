# TEAM-CLI-002 hosted CLI check-payload/provider qualification — 2026-10-19

## Disposition

`TEAM-CLI-002` is checked after the exact CLI `ci --check-payload` command
was executed against a bounded Release Decision fixture and its source-free
identity was admitted, delivered, replayed, and read back through the
isolated Preview SCM integration. The qualification used no customer source,
provider credential, license value, private key, production state, or archive
repository. No AppSec/Hunt state changed.

## Implementation and local verification

- CLI implementation: PR #147 merged normally as
  `5bf7ae70a0e8169f169750cfc188baf4d13685db`; the command path binds
  `ci --check-payload`, `--record-manifest-digest`, `--record-url`, and
  `--commit` to the bounded projector.
- `@verglos/shared` and the CLI were rebuilt successfully with their locked
  TypeScript build commands.
- The resulting CLI advertised `--check-payload` in `ci --help`, and the
  executed command returned exit code `0` with JSON only.
- Existing focused coverage remains **3/3** for the CLI command path: valid
  source-free projection, fail-closed malformed/symlink input, and the
  bounded machine-readable process path.

The command executed was equivalent to:

```text
node packages/cli/dist/index.js ci --check-payload <bounded temporary decision> --record-manifest-digest sha256:0000000000000000000000000000000000000000000000000000000000000003 --record-url https://verglos.com/records/team-cli-002-20261019 --commit 5bf7ae70a0e8169f169750cfc188baf4d13685db --json --quiet
```

The temporary Release Decision contained only sanitized fixture identities.
The emitted CLI payload was:

```text
decision=PASS
subject=urn:verglos:subject:artifact:sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
subjectDigest=sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
policy=verglos.policy.team@1.0.0
policyDigest=sha256:055bd90bca9822faa7219224aeba42ed4c201ab9ed81df9ca9efa167a9ad8a02
recordManifestDigest=sha256:0000000000000000000000000000000000000000000000000000000000000003
recordUrl=https://verglos.com/records/team-cli-002-20261019
commit=5bf7ae70a0e8169f169750cfc188baf4d13685db
payloadDigest=sha256:4b2e28bfe306b49958b9f965a4279ac7599765c339125dfae828ee75dee3d4be
externalKey=67443f6f769fc3aa675142b2bc51922e
```

The policy digest matches the signed Preview organization-policy envelope
qualified under TEAM-CLI-001. The CLI payload contains no source paths,
findings, secrets, or arbitrary record members.

## Hosted SCM admission and provider delivery

The source-free projection was mapped to the owner-authorized isolated
Preview fixture:

- organization: `bca7f024-3053-4f56-af0a-207bf0138862`
- installation: `172686102`
- GitHub account: `287223982`
- repository: `Top-Notchh-Solutions/verglos-cli`
- repository ID: `1310272752`
- Preview deployment: `dpl_CENtuqYXgX4mMrFbdzH4BbQkDtoX`

The protected enqueue returned:

- delivery ID: `2b0bf9db-02e2-4f9e-a66b-373baa2cad04`
- external key: `3961513fe4044771aff5017a36331f9c`
- provider payload digest: `sha256:749537ee0402dde616913209277fcca4d3f2b7d82014f8c324ffad174ce700a7`
- initial decision: `queued`

The protected `GET /api/cron/scm` delivery worker returned:

```json
{"ok":true,"result":{"claimed":1,"delivered":1,"retried":0,"failed":0,"leaseLost":0}}
```

An identical protected enqueue then returned `providerStatus=delivered` and
`deliveryDecision=noop` for the same delivery and provider payload digest.
The CLI `payloadDigest` and hosted provider `payloadDigest` are deliberately
distinct layers: the former covers the full CLI source-free contract, while
the latter covers the Web provider request projection.

GitHub read-back for commit `5bf7ae70a0e8169f169750cfc188baf4d13685db`
returned exactly one `Verglos / release decision` check with:

- check ID: `117825133730`
- status: `completed`
- conclusion: `success`
- details URL: `https://verglos.com/records/team-cli-002-20261019`
- bounded output title: `Verglos release decision`
- bounded summary containing only the decision, subject digest, and artifact
  digest

## Boundary and limitations

This is a bounded isolated Preview qualification of the implemented CLI
payload and hosted SCM path. It is not production certification, customer
acceptance, an independent AppSec review, or permission to upload source.
The fixture used identical sanitized subject/artifact digests and did not
exercise a customer repository. AppSec/Hunt remains the separate independent
gate.

## Score

This closure changes the private backlog from **233 checked / 47 open / 280
total (83.2%)** to **234 checked / 46 open / 280 total (83.6%)**. Dependent
rows remain open until their own contracts are satisfied.
