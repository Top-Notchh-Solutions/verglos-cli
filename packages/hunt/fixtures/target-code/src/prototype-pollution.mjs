const BLOCKED_KEYS = new Set(["__proto__", "constructor", "prototype"]);

export function vulnerableMerge(request) {
  return Object.assign({}, request.body);
}

export function safeMerge(request) {
  const output = Object.create(null);
  for (const [key, value] of Object.entries(request.body)) {
    if (!BLOCKED_KEYS.has(key)) output[key] = value;
  }
  return output;
}
