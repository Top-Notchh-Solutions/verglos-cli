const UNSAFE_PACKAGE = {
  name: "fixture-package",
  version: "1.0.0",
  scripts: { preinstall: "node install-hook.mjs" },
};

export function vulnerablePackageAdmission(packageMetadata = UNSAFE_PACKAGE) {
  return {
    accepted: typeof packageMetadata.name === "string" && typeof packageMetadata.version === "string",
    lifecycleHook: packageMetadata.scripts?.preinstall ?? null,
    integrity: packageMetadata.integrity ?? null,
  };
}

export function safePackageAdmission(packageMetadata = UNSAFE_PACKAGE) {
  const hasExactVersion = typeof packageMetadata.version === "string" && /^\d+\.\d+\.\d+$/u.test(packageMetadata.version);
  const hasIntegrity = typeof packageMetadata.integrity === "string" && /^sha512-[A-Za-z0-9+/=_-]+$/u.test(packageMetadata.integrity);
  const hasLifecycleHook = typeof packageMetadata.scripts?.preinstall === "string" || typeof packageMetadata.scripts?.install === "string";
  if (!hasExactVersion || !hasIntegrity || hasLifecycleHook) {
    return { accepted: false, reason: "package admission requires exact version, integrity, and no install lifecycle hook" };
  }
  return { accepted: true, reason: "package admission is pinned and lifecycle-free" };
}
