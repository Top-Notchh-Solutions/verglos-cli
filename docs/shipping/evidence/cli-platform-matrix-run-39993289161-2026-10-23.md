# CLI hosted platform-matrix receipt · 2026-10-23

## Observed provider result

- Provider: GitHub Actions
- Workflow: `Platform matrix`
- Run ID: `39993289161`
- URL: `https://github.com/Top-Notchh-Solutions/verglos-cli/actions/runs/39993289161`
- Event: `pull_request`
- Exact workflow head: `550451c50dd550937be139317a5a5712e98a78e8`
- Conclusion: `success`
- Updated: `2026-10-23T17:24:49Z`
- Retained non-expired artifacts observed: `30`

The run completed the in-toto release binding and all nine platform cells:

- Ubuntu Node 20, 22, and 24
- Windows Node 20, 22, and 24
- macOS Node 20, 22, and 24

Every listed job returned `completed / success`. This is a hosted validation
receipt for the exact merged workflow head above. It is not a new npm
publication, tag, Production CLI release, customer acceptance, independent
Hunt/AppSec review, or final go/no-go decision. ACCEPT-003 remains open for
reviewer sign-off and its external/provider/acceptance conditions.
