# Verglos Repository Resolver

The repository resolver binds a target to Git's root, commit, tree, dirty
state, shallow state, and submodule state. A dirty worktree receives a SHA-256
digest over status, binary diff, and untracked file content; it is never
represented as a clean tree. Shallow repositories are explicitly incomplete.

Resolution invokes Git metadata commands only. It does not run package scripts,
builds, hooks, target binaries, or any other project code. Failures are typed
as not-a-repository, invalid-target, or Git errors so callers can preserve the
distinction between unsupported targets and infrastructure failure.
