# DIST-006 rollback/revocation rehearsal · 2026-10-08

## Scope

CLI PR #83 added `verglos release rollback-rehearsal <manifestPath>`, a
bounded, local-only rehearsal over the shared fail-closed rollback decision
contract. It covers the five required boundaries:

- npm package rollback
- engine-manifest rollback
- Hunt recipe-feed rollback
- signing-identity revocation with a distinct replacement identity
- Web deployment rollback

The fixture also carries two historical record references. The command reports
whether those references remain unchanged and never contacts npm, a signing
provider, an engine/feed provider, Vercel, Razorpay, a database, or a
deployment API.

## Evidence

- Source commit: `d2a94d00a61cbfc98746b5989eabe7a52d956079`
- Merge commit: `c1a2856ca2eaf73a4abdcbb305ed2f790c767df7`
- PR: #83
- Focused rollback-plan/rehearsal tests: **4/4**
- Full CLI Turbo test tasks: **12/12 successful**
- Typecheck: **13/13 tasks successful**
- Build: **8/8 tasks successful**
- Lint: **5/5 tasks successful**
- Built command registration: `release --help` exposes `rollback-rehearsal`
- in-toto release binding: hosted run `37790974189` passed

## Negative coverage

An unapproved operation returns exit `78` and does not produce an admitted
transition. Invalid, oversized, duplicate, and unbounded fixture inputs fail
closed. Signing revocation without a distinct replacement is refused by the
shared contract.

## Limitations and disposition

The rehearsal proves the local decision boundary and fixture preservation only.
It does **not** prove an authenticated npm rollback, engine or Hunt-feed
rollback, signing-key revocation, Web deployment rollback, trusted publication,
or independent operational review. `DIST-006` therefore remains unchecked and
the authoritative count remains **218 checked / 62 unchecked / 280 total
(77.9%)**.

The repository license inventory also remains a separate pre-existing gate:
`pnpm licenses:inventory` fails because optional esbuild packages in the lock
resolution lack license metadata. No lockfile or dependency change was made by
this batch.
