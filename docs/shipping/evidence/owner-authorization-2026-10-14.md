# Verglos V1 owner authorization and review boundary · 2026-10-14

**Status:** owner authorization recorded; no backlog checkbox or release gate
is closed by this record.

## Authorizing owner

- **Name:** Anurag Yadav
- **Ownership:** Owner of Top Notchh Solutions and Verglos
- **Organization:** Top Notchh Solutions
- **Role:** Owner
- **Contact:** anuragyadav.work@gmail.com
- **Company/legal review role:** Designated company/legal reviewer for
  company-controlled Verglos shipping decisions. This is an owner/company
  decision record, not an outside-lawyer opinion.

## Authorization scope

The owner authorizes Codex to continue the private shipping workflow and to
perform the following in Preview, disposable local/Docker, or other explicitly
bounded non-production environments:

- use the existing public `Top-Notchh-Solutions/verglos-cli` repository and
  existing public-safe/internal fixtures;
- use the current Preview Web deployment and the already configured Preview
  organization-policy signer without disclosing secret values;
- use `anuragyadav-git/verglos-web` as the narrow Preview SCM test repository;
- create or test the least-privilege Preview SCM binding when the provider
  flow is ready;
- use an ephemeral GitHub Actions or equivalent disposable runner for the
  Enterprise protocol tests;
- use a synthetic Preview recipient for Studio technical qualification where
  the row permits it;
- prepare and execute protected dry-runs, legal/company review packets, and
  acceptance-study preparation within the current goal boundary.

## Explicit Hunt network decision

No networked Hunt recipe exception is approved for this goal. The default
network policy remains deny; any future exception would require a separately
recorded owner decision tied to a named recipe, target, scope, and window.

Default Hunt network policy remains deny. No customer source, production
database, production migration, npm publication, campaign, held-out POC, or
final public release decision is authorized by this record.

## Human-review boundary

The owner authorization removes the need for additional setup questions from
the owner. It does **not** substitute for an independent AppSec review, legal
opinion, provider-generated event, customer/recipient observation, field
performance observation, or participant/adjudication evidence.

No additional reviewer, operator, provider, customer, or approval identity is
required from the owner for this goal. The only separate human identity is the
independent Hunt AppSec reviewer, which is intentionally scheduled last. A
competent roommate may perform that review from a separate laptop against the
exact unreleased public CLI commit if they did not implement the reviewed Hunt
boundary.

The only additional human identity currently needed from the owner for the
next Hunt review is a genuinely independent AppSec/security reviewer. That
review is scoped to the Hunt execution and Docker/Linux isolation boundary,
not to the entire Verglos product. The reviewer will receive the public source
at one exact review commit and a private review packet; an npm publication is
not required.

The independent reviewer must not be Anurag Yadav, a person who implemented
the reviewed Hunt boundary, or an AI-generated identity. A roommate or other
person outside Top Notchh Solutions may qualify only if they have appropriate
AppSec/security competence and can independently run and report the review.

## Evidence and checkbox rule

This record authorizes execution; it does not assert that execution happened.
Provider, legal, recipient, runner, accessibility, field-CWV, customer,
commercial, release-provenance, and final-acceptance rows remain open until
their own acceptance artifacts exist. The live score is **229 checked / 51
unchecked / 280 total (81.8%)** after the explicit no-network decision.

## Reviewer workflow without an npm release

When the Hunt implementation is review-ready, the private packet is refreshed
to the exact public `main` commit. The reviewer then:

1. clones `https://github.com/Top-Notchh-Solutions/verglos-cli`;
2. checks out the exact commit named in the packet;
3. installs the repository workspace from its lockfile;
4. verifies the pinned Docker image digest;
5. runs the supplied Linux/Docker adversarial command;
6. inspects the relevant Hunt source, limits, egress controls, cleanup, and
   failure classification; and
7. returns a dated report with commands, environment, pass/skip/fail totals,
   findings, limitations, and `PASS`, `PASS WITH LIMITATIONS`, or `FAIL`.

The source tree contains the reviewable Hunt workspace and test harness. The
review is a pre-release source/commit review, so the reviewer does not need a
published npm version, production access, customer data, or private tracker
files. Linux is required for the full namespace qualification; a Mac-only
run may document those assertions as unavailable rather than passing them.

## Current disposition

- **Owner/company authorization:** recorded here.
- **AppSec reviewer:** not yet selected; do not mark the independent gate
  complete until the report exists.
- **Technical work:** may continue on dependency-ready rows.
- **Hunt rows depending on review:** remain parked until the exact review
  packet and signed report are complete.
