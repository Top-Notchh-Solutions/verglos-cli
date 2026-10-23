# Acceptance report-comprehension protocol

Status: preregistered private protocol. This document does not contain
participant results and does not close ACCEPT-006.

## Objective

Test whether a developer, lead, or report recipient can correctly understand a
Verglos evidence artifact without coaching or marketing language.

## Participant and procedure

- Recruit only named, consenting participants; no scraping or bulk outreach.
- Every recorded participant must declare `participantKind:
  consenting-participant`; `owner-controlled-synthetic` is permitted only for
  engineering contract fixtures and is never participant acceptance.
- Use the same redacted artifact and task instructions for every participant.
- Do not show the answer key, product copy, or implementation source before
  responses are recorded.
- Record participant role, date, artifact digest, time-to-answer, answer text,
  and consent/retention choice in the private evidence store.
- Delete participant-identifying material at consent expiry; retain only the
  bounded aggregate result unless the participant explicitly permits more.

## Required questions

1. What exact artifact and subject does this report describe?
2. What release decision was made, and what evidence supports it?
3. What changed from the preceding release, if anything?
4. What remaining risk or limitation must the operator act on?
5. What makes the artifact authentic or unverifiable?
6. Which claims are explicitly outside the artifact's coverage?

## Scoring and gate

An answer is correct only when it identifies the canonical field or limitation
without adding an unsupported claim. The run requires at least five of six
questions correct for every participant, with zero critical hallucinations
(invented PASS, signer, customer, coverage, or remediation). Any ambiguity is
recorded as a comprehension failure, not silently corrected.

ACCEPT-006 remains open until the preregistered participant run, raw answer
redaction, aggregate scoring, and independent review of the scoring record are
complete.
