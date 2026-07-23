/**
 * @verglos/entitlement — Ed25519-signed JWT license flow.
 *
 * Client-side (verify) and server-side (sign) sit in separate
 * subpath exports so the CLI ship weight stays small: it only
 * pulls in the verify path plus the pinned public key, never the
 * signing code.
 *
 * Design invariants:
 *   - Ed25519 signatures (32-byte pubkey pinned in the CLI)
 *   - 24h TTL on activation tokens
 *   - 7-day offline grace once expired (arch §6: "Never block")
 *   - Every feature gate re-verifies signature + exp (arch §6:
 *     "Never trusts a client-side boolean")
 *
 * The client (verify + offline grace + cache) lands.
 * The server (sign + activation endpoint) lands.
 */
export * from "./types.js";
export * from "./keys.js";
export * from "./client.js";
export * from "./server.js";
export * from "./monitor.js";
