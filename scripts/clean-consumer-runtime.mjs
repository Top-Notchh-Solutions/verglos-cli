/**
 * Windows hosted runners can take longer to install local tarballs because
 * npm.cmd and the filesystem scanner run through the Windows compatibility
 * layer. Keep the consumer qualification bounded while giving that platform
 * enough time to complete the same seven-archive install.
 */
export function cleanConsumerInstallTimeoutMs(platform) {
  return platform === "win32" ? 300_000 : 180_000;
}
