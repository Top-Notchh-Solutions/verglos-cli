
# Verglos V1 deliverables collection index

**Private tracker — 2026-10-12**

## Authorization boundary

Founder statement recorded from Anurag Yadav:

- Company: Top Notchh Solutions
- Product: Verglos
- Ownership statement: Top Notchh Solutions owns Verglos.
- Authorized work: Codex may inspect the four local workspaces, write private
  Markdown/JSON evidence records, run in-scope technical tests, organize
  evidence, and prepare implementation changes.
- Human-only boundary: this authorization does not turn Codex into a legal
  reviewer, independent AppSec reviewer, customer, GitHub organization owner,
  or payment-provider representative. Those roles still need their real
  decision or run recorded.

This file and the packets beside it are working records. A DRAFT, an AI
summary, or a founder assertion is not silently promoted to a third-party
signature or legal approval.

## What Codex has already collected

| Workspace | Branch | Exact current local head | Use |
|---|---|---|---|
| verglos-cli | main | 74fd6cdc595ae6911792d0afb444dbbb5ca5985f | Public CLI current local source |
| verglos-web | codex/web-shipping-2026-10-11 | 399d5b8e6432af7b3d1deda39036d66ef7477b00 | Web current local working source |
| verglos-cli-shipping-worktree | codex/cli-process-entry-2026-10-11 | 04b9a2b333a7dab8370ab40ae26f46c6b10a0156 | CLI shipping worktree |
| verglos-cli-private-shipping | local/private-shipping-ledger | 8d8bf6a5e83645adb06a3ce7c0ca5303bcc634a0 | Private evidence tracker |

These are observations, not a release freeze. Each qualification run records
the exact head actually tested at that time.

## Ten packets created

| Packet | Covers | Current status |
|---|---|---|
| 01 Hunt rules | HUNT-008, HUNT-009, HUNT-010 | Technical rule exists; provenance/approval inputs remain |
| 02 Hunt review | HUNT-011, QUAL-CLI-004 | Engineering evidence exists; independent reviewer is missing |
| 03 Policy signer | TEAM-CLI-001, TEAM-CLI-002 | Code exists; hosted signer and live fetch evidence are missing |
| 04 SCM | TEAM-WEB-006, GITHUB-WEB-001 to GITHUB-WEB-004 | Code exists; live App installation/evidence are missing |
| 05 Studio/Enterprise | STUDIO-CLI-001, ENT-CLI-001 | Code and contract evidence exist; recipient/runner acceptance is missing |
| 06 Legal | LIC-002, LIC-003 | Inventory exists; authorized legal decision is missing |
| 07 Release | DIST-001 to DIST-003, DIST-006, QUAL-CLI-006 | Preparatory evidence exists; protected final release evidence is missing |
| 08 Web quality | QUAL-WEB-005, QUAL-WEB-006 | Automated evidence exists; human/hosted evidence is missing |
| 09 Acceptance | ACCEPT-002 to ACCEPT-010 | Substrate exists; authorized runs and sign-offs are missing |
| 10 Final POC | FINAL-WEB-001 to FINAL-WEB-008, ACCEPT-011 to ACCEPT-014 | Deliberately held until the candidate is frozen |

## What the founder does not need to provide

Codex can read these directly from the workspace:

- code commit SHAs;
- branch names and current heads;
- existing test names and result files;
- current private templates;
- package manifests, notices, SBOM generators, and route contracts;
- the existing Hunt review packet;
- the existing legal review addendum;
- existing backlog/evidence links.

## What only a human can provide

The following cannot be generated honestly by reading code:

1. A legal/company reviewer’s licensing decision and signature.
2. An independent AppSec reviewer’s run and recommendation.
3. A GitHub/GitLab owner’s actual App installation and repository authorization.
4. A private/customer repository owner’s consent, if such a repository is used.
5. A Studio recipient’s confirmation.
6. An Enterprise runner operator’s approved enrollment/run.
7. Founder decisions about pricing, provider choices, network exceptions, release,
   and general-availability claims.

The packets contain plain-language prompts for each one. You can answer the
founder questions in this tracker; you do not need to provide commit hashes.

## Working status vocabulary

- READY TO GENERATE: Codex can produce the technical record from local files.
- WAITING FOR FOUNDER: one product/company choice is required.
- WAITING FOR EXTERNAL PERSON: a legal, security, customer, or recipient action
  is required.
- READY TO QUALIFY: the inputs exist and Codex can run the technical check.
- COMPLETE: the row's full acceptance evidence exists and the backlog may be
  checked after ledger/traceability reconciliation.

## How we will work from here

For each packet Codex will:

1. read the existing implementation and evidence;
2. fill verified facts and exact commits automatically;
3. create or update the private record;
4. identify only the smallest human input still missing;
5. run the technical part when it is safe and authorized;
6. update the backlog, execution ledger, status, and traceability together;
7. check a backlog row only when its complete acceptance condition is met.

The next packet is 01-HUNT-RULES. No external reviewer, legal signature, or
customer consent is being fabricated by creating these files.

