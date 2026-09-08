# Verglos shipping decisions

## 2026-09-08 — Build before external validation

The founder sequence is feature-complete implementation and internal qualification first, then frozen-repository POC/Reddit validation and campaign. Internal tests are continuous; external validation does not define unfinished capabilities as shipped.

## 2026-09-08 — One npm package

Free, Pro, Team, and Studio use one signed npm front door. Local capabilities remain independently usable; hosted value is protected by server-side authorization, not hidden client checks.

## 2026-09-08 — Evidence producers versus Verglos contracts

Trivy, detect-secrets, Docker, IaC, SARIF, SBOM, and provenance are evidence producers. Versioned Verglos subjects, observations, policy, lineage, and Release Records are the stable product contracts.

## 2026-09-08 — UX hierarchy

The first dashboard view answers “can this exact release ship?” and progressively discloses scanner details, raw evidence, and history. This follows GitHub/GitLab security-report patterns and progressive-disclosure guidance.

## 2026-09-08 — Canonical plan catalog and legacy aliases

The target public ladder is Free, Pro, Team, Studio, and Enterprise. Founder becomes an internal override, Compliance remains a read-compatible legacy alias for Enterprise, and Sentinel remains a retired alias for Pro. A versioned server-side catalog owns price, period, currency, allowances, capabilities, status, and effective dates. CLI gates consume opaque entitlement data; server authorization protects hosted value.

Current Pro remains $29/month or $290/year, subject to proving the gateway charge matches display. Team $99/$990 and Studio $249/$2,490 are inactive launch hypotheses until founder activation and acceptance. A $79 Team or $199 Studio offer may exist only as a named, time-bounded founding cohort. Enterprise remains contract-priced; entry ARR is a hypothesis, not a quote.

Migration is dual-read and reversible. Existing licenses retain access; Sentinel maps to Pro, Compliance maps to Enterprise, unknown writes are rejected, and Founder status moves outside the public plan field. See `VERGLOS_PLAN_AND_CAPABILITY_RECONCILIATION.md`.

## 2026-09-08 — Language truth

V1 is language-neutral at artifact, policy, record, and import layers, but native deep SAST remains JS/TS. Imported or external coverage must be labeled separately.
