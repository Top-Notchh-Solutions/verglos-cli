# Authorized external workflow protocol

Status: frozen for V1 acceptance work. Private shipping document; never copy
into a public repository or send to an unconsenting party.

## Purpose and boundary

This protocol defines how Verglos may be evaluated against a real team's
authorized repository. It does not authorize contact, access, publication,
storage of findings, or a production deployment by itself. Every run needs a
completed consent record and founder authorization for the exact repository,
commit, operator, and expiry.

Public technical fixtures may be used for engineering regression, but they do
not count as customer acceptance, comprehension, commercial acceptance, or a
customer POC.

The separate owner-authorized public-OSS benchmark path uses
`subjectKind: owner-authorized-public-oss`. It binds the exact repository
commit, applicable license/terms evidence digest, owner authorization, bounded
scope, redaction, and retention/expiry record. It does not require a
third-party customer consent record because it is not presented as customer
acceptance. The validator must still emit `customerAcceptance: not-claimed`;
an external customer POC remains a separate gate.

## Recruitment and contact rules

- No scraping, bulk outreach, purchased lists, unsolicited scanning, or
  repository discovery.
- Contact only a named owner/consenting party who has an existing relationship
  with Top Notchh or has expressly invited evaluation.
- Use one written request that names the exact scope and asks the owner to
  complete the consent record. Do not request credentials, secrets, or broad
  organization access.
- Stop immediately on revocation, expiry, ambiguity about ownership, or a
  request to expand scope. Record the stop; do not retry through another
  account.

## Required consent record

The operator must complete `consent-record.template.md` before cloning or
scanning. Required fields are owner identity/contact, repository URL, exact
commit SHA, permitted paths and commands, whether findings may be stored,
retention/expiry, revocation contact, and founder approval. A blank, unsigned,
expired, or scope-mismatched record is a hard refusal.

## Data handling

- Clone the exact commit with a full clone only when the consent record allows
  it; otherwise use an owner-provided archive.
- Preflight and remove secrets, personal data, credentials, private keys, and
  unrelated source before scanning. Never place those materials in evidence.
- Run locally with network denied unless the consent record names a specific
  destination and the relevant gate explicitly allows it.
- Store only bounded redacted summaries, digests, command versions, and exit
  results in the private evidence directory. Never store raw source, raw
  findings, tokens, cookies, or customer-identifying paths unless the consent
  record explicitly permits a named artifact.
- Encrypt or access-restrict private evidence. Delete it at the earlier of
  the consent expiry, revocation, or the documented retention deadline.
- Customer-held signed records remain the customer's property; do not upload,
  publish, or use them as public proof without separate written permission.

## Fixed workflow

1. Verify the consent record and founder approval against the exact repository
   URL and commit SHA.
2. Capture repository digest, fixture manifest, CLI commit, Node version, and
   command configuration without printing secrets.
3. Run the bounded Free/CI/import/reconciliation stories selected in the
   acceptance plan. Hunt, hosted upload, billing, and deletion stories run
   only when their independent gates are already qualified.
4. Review output for source, secret, path, tenant, and customer-identity
   leakage before writing evidence.
5. Provide the owner a redacted result summary and correction contact. Do not
   describe a finding as a confirmed vulnerability without the prescribed
   adjudication evidence.
6. Reconcile failures separately as product defects, environment failures, or
   scope exclusions. Do not silently rerun with broader authority.
7. Expire/delete the fixture and evidence according to the consent record and
   record the deletion result privately.

## Success criteria

The external workflow is accepted only if all are true:

- exact authorized commit and scope were used;
- no unauthorized source, secret, or personal data was retained or emitted;
- the expected command exit and evidence coverage are reproducible;
- tenant/source isolation and redaction checks pass;
- limitations and unsupported engines are explicit;
- owner-facing summary is accurate and non-marketing;
- consent remains valid through the run and deletion/expiry is recorded.

Failure of any criterion is a failed run, not a partial PASS. ACCEPT-005,
ACCEPT-006, and ACCEPT-008 remain separate gates requiring an actual consented
team and recipient evidence.
