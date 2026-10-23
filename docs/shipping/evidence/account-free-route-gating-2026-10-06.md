# Authenticated Free account route gating — 2026-10-06

- Using the authorized signed-in browser session, `/account` rendered the
  current Free state and the explicit Pro boundary.
- Navigations to `/account/monitoring`, `/account/alerts`,
  `/account/history`, and `/account/activations` each returned to the overview
  route rather than exposing paid-only data.
- The overview retained named navigation links, signed-in identity, and the
  instruction to activate after checkout. No paid feature or fabricated data
  appeared for the Free account.

This is read-only production evidence. It supports the account entitlement
boundary but does not close PRO-008 or the paid lifecycle gates.
