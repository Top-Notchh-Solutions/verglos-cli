# Active Credential Disclosure Withheld

This is the public holding record for an active Verglos credential disclosure.

The affected repository name, exact credential type, file path, report output, validation detail, and surrounding implementation context are intentionally withheld until the maintainer or credential owner confirms rotation.

## Summary

- Repository: withheld during active disclosure
- Finding type: credential exposure
- Discovery method: default local Verglos scan
- Access used: public repository clone only
- Full secret published here: no
- Exact credential value published here: no
- Exact vulnerable line published here: no
- Public report artifact published here: no

## What Verglos Proved

Verglos flagged a committed credential-shaped value in application code. The finding was then manually triaged with the minimum validation needed to separate a real issue from a false positive.

The public lesson is not the credential value. The public lesson is the workflow:

1. Run the scan locally.
2. Confirm the finding without publishing the secret.
3. Coordinate privately with maintainers or credential owners.
4. Rotate the credential before public discussion.
5. Publish only a sanitized record after the secret is no longer useful.

## Why The Report Is Not Published

Publishing the scan output before rotation is confirmed would expose the exact location and surrounding implementation context. That is not useful for readers and can create unnecessary risk for maintainers, forks, mirrors, and downstream users.

The durable public proof can be expanded after the affected team confirms the credential is no longer usable.

## Related Artifacts

- `docs/research/icp-top-300-tsjs-analysis.md`
- `docs/research/icp-top-300-tsjs-methodology.md`
- `docs/research/icp-top-300-tsjs-repos.csv`
