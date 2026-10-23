# GITHUB-WEB-004 cutover readiness and recovery boundary · 2026-10-19

## Current state

The existing authenticated GitHub organization installation remains active:

- application: `Verglos Organization SCM Checks`
- organization: `Top-Notchh-Solutions` (`287223982`)
- installation: `172686102`
- selected repository: `Top-Notchh-Solutions/verglos-cli`
- permissions: metadata read; checks read/write

The existing Chrome tab was used only; no tab or window was created. GitHub's
App settings → Install App page currently shows `Top-Notchh-Solutions` as
`Installed` and exposes the exact `Installation settings` link for
installation `172686102`. This confirms that the owner-controlled recovery
entry point is discoverable while the installation is active.

## Uninstall boundary

From the existing installation settings page, the owner-controlled
`Uninstall` action was opened. GitHub displayed the confirmation:

> This action cannot be undone. Are you sure you want to uninstall this GitHub
> App from 1 repository?

The confirmation was dismissed. No uninstall, repository-scope change,
webhook change, provider revocation, or production state change occurred.

## Acceptance disposition

`GITHUB-WEB-004` remains unchecked. Its required artifact is a completed
authorized organization cutover proving uninstall, recovery/reinstallation,
post-recovery permissions, webhook delivery, and check publication. The
current evidence proves only active-installation readiness and the exact
irreversible-action boundary; it must not be treated as a recovery result.

GITHUB-WEB-001, GITHUB-WEB-002, and GITHUB-WEB-003 are already checked. No
AppSec/Hunt state changed.
