# DIST-002 release tag commit-binding evidence

**Date:** 2026-10-22  
**Implementation repository:** `verglos-cli`  
**Source commit:** `9fba66ac386605174a98bea856b9f04ceda8cfa8`  
**Pull request:** [#159](https://github.com/Top-Notchh-Solutions/verglos-cli/pull/159)  
**Merge commit:** `285193a58be2c431fd5da865829d0fde08a9eb04`

## Implemented

- Added an exact commit-binding function to the release-tag verifier.
- The publish workflow now resolves `GITHUB_REF` with `git rev-list -n 1`
  and requires that commit to equal `GITHUB_SHA` before any release package
  preparation or publication step.
- Preserved the existing all-public-package version equality check and added
  regression/workflow-contract coverage for malformed and mismatched SHAs.

## Verification

- Focused release/tag/publication contract suite: **12/12 passed**.
- Workspace typecheck: **14/14 tasks passed**.
- Workspace tests: **13/13 tasks passed**.
- Workspace build: **8/8 tasks passed**.
- Hosted Platform matrix run `39778965080`: **9/9** Ubuntu/macOS/Windows ×
  Node 20/22/24 jobs passed.
- Hosted self-scan run `39778965079`: passed.
- Hosted in-toto release binding run `39778965080`: passed.
- Hosted standard/provenance validation run `39778965118`: passed.
- `git diff --check`: passed.

## Safety and disposition

No npm publication, registry, provider, production, customer, database, or
deployment state was changed. No file, branch, record, or deployment was
deleted. The source branch remains available on GitHub.

This is code-side `DIST-002` release-boundary evidence only. Keep `DIST-002`
unchecked for protected environment authorization, legal/license clearance,
trusted-publisher review, and an actual immutable publication/attestation
event. The workflow does not claim that publication occurred.

Live checklist score after this merge: **239 checked / 41 open / 280 total
(85.4%)**.
