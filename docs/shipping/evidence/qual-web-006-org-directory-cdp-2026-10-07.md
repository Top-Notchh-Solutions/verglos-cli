# QUAL-WEB-006 authenticated organization-directory CDP probe · 2026-10-07

## Scope

- Existing dedicated Chrome debug profile and existing page target only.
- Current target URL reduced to origin/path: `https://verglos.com/orgs`.
- Read-only direct CDP fallback was used because the Chrome DevTools MCP
  transport was closed; no navigation, reload, new tab, form submission, or
  state mutation was performed.
- No page text, cookies, authorization headers, response bodies, or personal
  organization data were captured.

## Aggregate observation

- One visible interactive element; zero unnamed visible interactive elements.
- Two visible landmarks, including one `main`; zero visible forms.
- Accessibility tree: 30 nodes; zero unnamed interactive AX nodes.
- Current-page layout-shift total: `0.0000`.
- Existing navigation timing: DOMContentLoaded `4939 ms`, load `5647 ms`;
  250 resource entries were present.
- Largest Contentful Paint was unavailable without a reload, and no field CWV
  data was collected.

## Disposition

This is a bounded organization-directory runtime observation only. It does not
close QUAL-WEB-006: authenticated Pro/organization data, keyboard sequence,
human screen-reader review, responsive/reduced-motion states, reload-based CWV,
large-data rendering, and field CWV evidence remain open. No production,
database, payment, deployment, migration, or browser-state write occurred.
