# Verglos shipping decisions

## 2026-09-08 — Build before external validation

The founder sequence is feature-complete implementation and internal qualification first, then frozen-repository POC/Reddit validation and campaign. Internal tests are continuous; external validation does not define unfinished capabilities as shipped.

## 2026-09-08 — One npm package

Free, Pro, Team, and Studio use one signed npm front door. Local capabilities remain independently usable; hosted value is protected by server-side authorization, not hidden client checks.

## 2026-09-08 — Evidence producers versus Verglos contracts

Trivy, detect-secrets, Docker, IaC, SARIF, SBOM, and provenance are evidence producers. Versioned Verglos subjects, observations, policy, lineage, and Release Records are the stable product contracts.

## 2026-09-08 — UX hierarchy

The first dashboard view answers “can this exact release ship?” and progressively discloses scanner details, raw evidence, and history. This follows GitHub/GitLab security-report patterns and progressive-disclosure guidance.

## 2026-09-08 — Language truth

V1 is language-neutral at artifact, policy, record, and import layers, but native deep SAST remains JS/TS. Imported or external coverage must be labeled separately.
