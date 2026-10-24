# ACCEPT-006 current scorer regression · 2026-10-24

## Verification

The current comprehension scorer regression suite passed **11/11** with zero
failures, cancellations, or skips. It covers the exact six-question rubric,
caller-flag resistance, consent-window bounds, unique-question enforcement,
secret-like answer rejection, non-overwrite behavior, future completion
rejection, duplicate participant identity rejection, artifact/protocol secret
boundaries, synthetic provenance classification, missing/unknown provenance,
and rubric-digest binding.

The study-protocol validator also passed and reported the frozen comprehension
and Hunt protocols with `participantRun: open` and `huntAdjudication: open`.

## Boundary and disposition

This is scorer/protocol implementation evidence only. No participant was
recruited or run in this batch, no answer data was recorded, and no independent
scoring review or final acceptance exists. `ACCEPT-006` remains unchecked for
the preregistered consenting participant run, redacted aggregate, independent
review, and final acceptance. Score remains **246 checked / 34 open / 280
total (87.9%)**, split **13 AppSec-dependent / 21 non-AppSec**.
