export function vulnerableSink(value) {
  return { property: "innerHTML", value };
}

export function safeSink(value) {
  return { property: "textContent", value };
}
