export function vulnerableUpdate(requestBody) {
  return { ...requestBody };
}

export function safeUpdate(requestBody) {
  return { displayName: requestBody.displayName };
}
