# Verglos Package Resolver

Package resolution reads `package.json` and supported lockfiles as data. It
binds the package subject to the exact metadata bytes and records ecosystem,
name, version, and content digest. Missing lockfiles are explicit incomplete
coverage; the resolver never runs scripts, lifecycle hooks, installers, or
build commands and does not infer dependency state from a missing lockfile.
