# Verglos Policy Loader

Policy layers resolve in explicit order: defaults, organization, config, then
CLI. Check IDs merge by identity, later layers replace earlier definitions,
and the resulting checks are sorted before validation. Unknown fields are
rejected and the effective policy receives a canonical digest.
