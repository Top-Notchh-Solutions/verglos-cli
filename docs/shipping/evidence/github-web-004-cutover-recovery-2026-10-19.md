# GITHUB-WEB-004 authorized cutover and recovery · 2026-10-19

## Scope and boundary

This is provider-cutover evidence for the owner-authorized GitHub App
qualification. It is not an AppSec/Hunt review, a customer acceptance, or a
production migration. No source, customer repository contents, credentials, or
secret values were collected. The existing authenticated Chrome session was
used; no new browser tab or window was created.

## GitHub organization action

The existing installation `172686102` of `Verglos Organization SCM Checks` was
uninstalled from the owner-controlled `Top-Notchh-Solutions/verglos-cli`
repository. GitHub displayed the irreversible one-repository confirmation and
then reported that the uninstall job was queued; the installation disappeared
from the organization installation list.

The same App was reinstalled for `Top-Notchh-Solutions` with **Only select
repositories** and exactly `Top-Notchh-Solutions/verglos-cli` selected. GitHub
reported successful installation and assigned installation `172988022`.
The recovered scope showed account `287223982`, repository `1310272752`,
metadata read, and checks read/write permissions.

## Post-recovery hosted qualification

- Web source commit: `0719074d5a6f83198f5e36c0eeb064f2a12e1b1b`
- Preview deployment: `https://verglos-d4lbpqt1i-anuragyadav20062002s-projects.vercel.app`
- Deployment ID: `dpl_GHFjxsbZUQV93oFpgtD1Trucw2Yz`
- Deployment status: Ready, target Preview
- Qualification organization: `bca7f024-3053-4f56-af0a-207bf0138862`
- Qualification project: `3919e928-b680-430c-ba43-a68eeab89263`

The protected Preview reconciliation route exchanged the recovered GitHub App
installation and returned:

```json
{"ok":true,"reconciled":true,"result":{"createdCount":1,"refreshedCount":0,"revokedCount":0,"activeCount":1}}
```

The new binding was read back as active for installation `172988022`, account
`287223982`, repository `1310272752`, and the qualification project.

## Check delivery and replay evidence

A source-free synthetic PASS check was enqueued for commit
`5bf7ae70a0e8169f169750cfc188baf4d13685db`.

- Delivery ID: `8f055959-6416-43eb-ba3a-57a9d4aa1832`
- External key: `91509dc7d6842ed268831a4814e8c330`
- Payload digest: `sha256:71e2244dd8b8b3cbb78e6f0d5672d73cc5161d94852458a2afe4909b2f8c1268`
- First enqueue: `deliveryDecision=queued`, `providerStatus=queued`
- Delivery worker: `claimed=1`, `delivered=1`, `retried=0`, `failed=0`,
  `leaseLost=0`
- Identical replay: `deliveryDecision=noop`, same delivery ID and payload
  digest, provider status `delivered`
- GitHub readback: check `118014567306`, name `Verglos / release decision`,
  status `completed`, conclusion `success`, matching head SHA, and details URL
  `https://verglos.com/records/github-web-004-recovery-20261019`

This proves post-recovery provider delivery, publication, readback, and
duplicate safety without exposing target source or secrets.

## Qualification limitation

The isolated Preview qualification database retains the historical fixture row
for installation `172686102` as active alongside the newly reconciled row. The
reconciliation route is intentionally keyed by the provider installation ID;
the real GitHub uninstall lifecycle is handled by the signed installation
webhook path for `172686102`, while this Preview run exercised the newly
installed `172988022` path. This stale fixture row is not the live GitHub
organization state and is recorded here rather than silently presented as a
revocation result.

## Disposition

`GITHUB-WEB-004` is checked after the authorized uninstall/reinstall and
post-recovery delivery qualification. GITHUB-WEB-001, GITHUB-WEB-002, and
GITHUB-WEB-003 remain checked. No AppSec/Hunt row changed.

