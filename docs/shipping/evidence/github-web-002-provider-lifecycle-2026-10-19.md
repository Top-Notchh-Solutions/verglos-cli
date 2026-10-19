# GITHUB-WEB-002 provider lifecycle qualification · 2026-10-19

## Disposition

`GITHUB-WEB-002` is complete and checked. The current Web implementation
provides the signed App/JWT exchange, installation-token expiry/refresh,
permission projection, and fail-closed lifecycle/reauthorization decisions;
the focused provider contract suite passed. The existing owner-controlled
GitHub installation also completed a real suspend/unsuspend observation in
the authenticated organization UI. GITHUB-WEB-003 remains open for live
delivery/replay/reconciliation, and GITHUB-WEB-004 remains open for the
complete organization cutover, uninstall, and recovery qualification.

## Exact implementation qualification

- **Repository:** `anuragyadav-git/verglos-web`
- **Source commit:** `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
- **Worktree:** disposable clean qualification worktree
  `/private/tmp/verglos-web-qual-web-005-route-e2e-20261019`
- **Focused result:** 25/25 passed, 0 failed, 0 skipped, exit 0

The focused contracts cover server-held App/JWT token exchange, immutable
provider identity, least-privilege permission verification, expiring-token
refresh, lifecycle transitions for install/suspend/reauthorization/uninstall,
and fail-closed refusal of unsafe or broad provider state. The preserved log
is the existing artifact from the identity/lifecycle contract run; its SHA-256
is `4b9f00fc6ceea9867be8fb8ea98eb61d933b250b71eb67e03a13f6c394f68ce2`.

## Live suspend/unsuspend observation

The observation used only the existing authenticated Chrome page for the
owner-controlled installation. No tab or window was created, no token or
cookie was copied, and no repository contents were accessed.

- Organization: `Top-Notchh-Solutions` (account ID `287223982`)
- Application: `Verglos Organization SCM Checks`, developed by
  `Top-Notchh-Solutions`
- Installation: `172686102`
- Selected repository: `Top-Notchh-Solutions/verglos-cli`
- Permissions retained: metadata read; checks read/write

The page initially showed the active installation with the selected
repository and the `Suspend` control. The owner-controlled `Suspend` action
was invoked and GitHub displayed the suspended state, including the message
that the installation had been suspended by the owner on 2026-10-19 at
11:27 IST. After the owner authentication/passkey step completed, the same
installation page was used to invoke `Unsuspend`. GitHub displayed the alert
`Your app has been unsuspended`; the resulting page again showed `Installed`,
the `Suspend` control, the same selected repository, and the same permission
scope.

This proves the provider's bounded suspend-to-active lifecycle observation
for the exact installation identity. It does not claim a live webhook
delivery, provider check publication, uninstall, or recovery cutover.

## Acceptance boundary

This evidence closes the implementation and provider lifecycle contract in
`GITHUB-WEB-002`. `GITHUB-WEB-003` remains unchecked for live delivery,
duplicate replay, cross-tenant rejection, retry, and reconciliation evidence.
`GITHUB-WEB-004` remains unchecked for the complete authorized organization
cutover, including uninstall and recovery. Hunt/AppSec state is unchanged.

## Score

This closure changes the private backlog from **236 checked / 44 open / 280
total (84.3%)** to **237 checked / 43 open / 280 total (84.6%)**.
