# Hoppscotch Live API Key Disclosure Record

This is the public, sanitized evidence record for the Verglos finding described in the Top Notchh article "How Verglos found a live API key in a 79,000-star repo."

## Summary

- Repository: `hoppscotch/hoppscotch`
- Finding type: live hardcoded third-party API key
- Discovery method: default local Verglos scan
- Access used: public repository clone only
- Full secret published here: no
- Exact live-key value published here: no
- Exact vulnerable line published here: no

## What Verglos Proved

Verglos flagged a committed credential-shaped value in the Hoppscotch codebase. The finding was then manually validated by checking that the credential still authenticated with the associated third-party service.

The public lesson is not the credential value. The public lesson is the workflow:

1. Run the scan locally.
2. Confirm the finding without publishing the secret.
3. Coordinate privately with maintainers or credential owners.
4. Rotate the credential before public discussion.
5. Publish only a sanitized record after the secret is no longer useful.

## Why The Raw Report Is Not Published

Publishing the raw scan output would expose the exact credential location and surrounding implementation context. That is not useful for readers and can create unnecessary risk for maintainers, forks, mirrors, and downstream users.

The durable public proof is this record plus the broader scan-campaign artifacts under `docs/research/`.

## Related Artifacts

- `docs/research/icp-top-300-tsjs-analysis.md`
- `docs/research/icp-top-300-tsjs-methodology.md`
- `docs/research/icp-top-300-tsjs-repos.csv`

