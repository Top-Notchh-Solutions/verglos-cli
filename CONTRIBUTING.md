# Contributing to Verglos

Verglos is a security-evidence product. Contributions that ship in a public release become part of Top Notchh Solutions' shipping product; the terms below make ownership, license, and provenance explicit before any code you write leaves your machine.

## Inbound license

By opening a pull request, filing a patch, or otherwise submitting a contribution to a Top Notchh Solutions Verglos repository, you agree that:

1. **License.** Your contribution is licensed under the same license the file it modifies is published under. Public packages (see `packages/cli`, `packages/scanner`, `packages/reporter`, `packages/shared`, `packages/mcp`, `packages/entitlement`) are Apache-2.0. Private beta packages retain the license in each package's `LICENSE` file (currently non-open-source; see `docs/shipping/VERGLOS_OPEN_CORE_AND_COMMERCIAL_BOUNDARY.md` for the boundary).
2. **Ownership.** Copyright in your contribution belongs to you (or your employer, if the work was done under your employment agreement). You grant Top Notchh Solutions and downstream users a perpetual, worldwide, non-exclusive, royalty-free license to use, modify, and redistribute your contribution under the file's license, and you retain your own rights to your work.
3. **Provenance.** You have the right to grant the license above. If your work incorporates third-party material, that material must be under a compatible license and its provenance must be recorded in `THIRD_PARTY_NOTICES`.

## Sign your work — Developer Certificate of Origin

Every commit in a contribution must carry a `Signed-off-by:` trailer, e.g.:

```
Signed-off-by: Your Full Name <you@example.com>
```

The trailer means you certify each of the following, as stated in the [Developer Certificate of Origin (DCO) version 1.1](https://developercertificate.org/):

> By making a contribution to this project, I certify that:
>
> (a) The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or
>
> (b) The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications, whether created in whole or in part by me, under the same open source license (unless I am permitted to submit under a different license), as indicated in the file; or
>
> (c) The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.
>
> (d) I understand and agree that this project and the contribution are public and that a record of the contribution (including all personal information I submit with it, including my sign-off) is maintained indefinitely and may be redistributed consistent with this project or the open source license(s) involved.

Use `git commit -s` (or `-S -s` if you sign your commits) to add the trailer automatically. A CI check enforces the presence of a well-formed `Signed-off-by` line on every commit in a pull request.

## Attribution rule

No AI attribution appears in commits, PR titles, PR bodies, or code comments. Contributions authored with AI assistance are attributed to the human contributor whose `Signed-off-by:` line is on the commit. The DCO sign-off makes that attribution binding.

## Trademarks

"Verglos" and "Top Notchh Solutions" are unregistered trademarks of Top Notchh Solutions. Contributions may not use these marks in a way that suggests endorsement or affiliation beyond the DCO grant above. See [Verglos brand identity](https://topnotchhsolutions.com/brand) for the current usage policy.

## Reporting security issues

Do not open a public issue for a security vulnerability in Verglos. Instead, email `security@topnotchhsolutions.com` with a clear description and a reproduction. We will acknowledge receipt within three business days.

## Contributor entity assignment

Individual contributors retain their own copyright. If Top Notchh Solutions later needs a formal Contributor License Agreement (CLA) — for example, to relicense a package or to accept a substantial employer-owned contribution — we will contact existing significant contributors in advance and provide the exact CLA text. Until then, the DCO above is the operative agreement.
