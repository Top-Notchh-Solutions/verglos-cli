
# Web privacy, deletion, accessibility, and performance packet

**Private working packet — QUAL-WEB-005, QUAL-WEB-006**

## Privacy/deletion

Use isolated Preview and a disposable database. Record:

- user-facing collection/consent explanation;
- privacy request creation/history/status;
- worker execution, retry, idempotency, and concurrency;
- hosted private data removal;
- customer-held digest retention without raw record bytes when required;
- hold/release behavior;
- cross-tenant refusal;
- legal/customer-held-record decision.

Suggested report:

    docs/shipping/evidence/qual-web-005-privacy-deletion-<date>.md

## Accessibility/performance

Existing automated evidence includes Lighthouse, keyboard, responsive,
console/resource, and focused contract results. The remaining human/hosted
deliverables are:

- human screen-reader pass with browser/OS and page list;
- authenticated organization keyboard/focus/landmark pass;
- paid organization and large dataset browser run;
- 390px/mobile and desktop result;
- reduced-motion/loading/empty/error/long-table result;
- field or approved real-user Core Web Vitals evidence;
- console/network result;
- reviewer/date/limitations.

Baseline records:

    docs/shipping/evidence/account-a11y-cwv-2026-10-02.md
    docs/shipping/evidence/account-a11y-cwv-2026-10-06.md
    docs/shipping/evidence/authenticated-dashboard-runtime-2026-10-06.md

Codex can run browser tests and write the report. A human screen-reader
observation must be identified honestly as automated, assisted, or human; they
must not be mislabeled.

