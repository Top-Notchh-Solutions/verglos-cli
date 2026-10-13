const SYNTHETIC_CREDENTIAL = "fixture-credential-canary";

export function vulnerableCredentialUse(transport) {
  return transport({ authorization: `Bearer ${SYNTHETIC_CREDENTIAL}` });
}

export function safeCredentialUse(transport, environment = {}) {
  const credential = environment.SYNTHETIC_TOKEN;
  if (typeof credential !== "string" || credential.length === 0) {
    return { status: "blocked", reason: "credential unavailable" };
  }
  return transport({ authorization: `Bearer ${credential}` });
}
