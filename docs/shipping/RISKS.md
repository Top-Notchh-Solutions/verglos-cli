# Verglos V1 risks

| Risk | Impact | Mitigation / gate | Owner |
|---|---|---|---|
| Public copy outruns implementation | Trust/legal damage | Truth registry and copy tests | Product |
| Apache CLI fork bypasses local checks | Paid value leakage | Server-side hosted authorization | Platform |
| Trivy becomes hidden dependency | Vendor lock-in/outage | Adapter contract, mirrors, engine-exit drill | Engine |
| Missing engine yields false PASS | Security failure | Explicit INCOMPLETE and fail-closed policy | Security |
| Artifact/commit mismatch | False assurance | Immutable subject resolver and digest tests | Evidence |
| Imported scanner noise | Low adoption | Stable fingerprints, lineage, deduplication | Evidence |
| Hunt executes unsafe code | Host compromise | Signed recipes, default-deny network, isolation tests | Runtime |
| Unbounded hosted/managed compute | Margin collapse | Local-first defaults, quotas, cost ledger | Finance |
| Dashboard exposes private evidence | Confidentiality breach | Tenant authorization, redaction, negative tests | Platform |
| Premium rules lack clear license | IP/compliance risk | Separate content license and notices | Legal |
| Too many dashboard metrics | User confusion | Decision-first progressive disclosure | Design |
| Real POC selection bias | False market signal | Frozen corpus plus authorized customer fixtures | Research |
