# GitHub App installation read-only preflight · 2026-10-07

The authenticated GitHub CLI identity is `anuragyadav-git` (user id
83834160). The account can read the `Top-Notchh-Solutions` organization
(organization id 287223982) and its repository inventory, including the
private `verglos-web` repository.

The read-only `GET /user/installations` request returned HTTP 403 with GitHub's
requirement that the access token be authorized to a GitHub App. This token
therefore cannot establish whether the Verglos App is installed, its
installation id, repository selection, permissions, or lifecycle state. No
installation, webhook, repository, check, or organization mutation was
attempted.

`GITHUB-WEB-001` through `GITHUB-WEB-004` remain open. The code-side Web
contracts are already qualified; live App installation/cutover evidence needs
an App-authorized credential and an authorized organization interaction.

Backlog at capture: **218 checked / 62 unchecked / 280 total (77.9%)**.
