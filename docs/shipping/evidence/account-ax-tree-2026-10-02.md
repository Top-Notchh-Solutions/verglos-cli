# Authenticated account accessibility-tree evidence · 2026-10-02

- **Route:** `https://verglos.com/account`
- **Method:** Read-only Chrome DevTools Protocol attachment to the founder's existing authenticated Chrome tab; no cookies, identity values, or response bodies were recorded.
- **DOM checks:** one `main` landmark, seven focusable elements, no document horizontal overflow.
- **Accessibility tree:** 65 nodes; roles included `RootWebArea`, `navigation`, `main`, `heading`, `alert`, `link`, `paragraph`, and `StaticText`.
- **Interpretation:** This is automated accessibility-tree evidence for the authenticated personal account route. It is not a human VoiceOver/NVDA review and does not qualify the organization dashboard.
- **Organization boundary:** `GET /api/v1/organizations` in the same authenticated session returned `{ "organizations": [] }`; no organization was created or modified.
