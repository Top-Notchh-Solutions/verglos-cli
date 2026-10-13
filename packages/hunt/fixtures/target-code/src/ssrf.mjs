const ALLOWED_ORIGIN = "https://api.example.test";

export function vulnerableRequestUrl(input) {
  return input;
}

export function safeRequestUrl(input) {
  const candidate = new URL(input, ALLOWED_ORIGIN);
  return candidate.origin === ALLOWED_ORIGIN ? candidate.toString() : ALLOWED_ORIGIN;
}
