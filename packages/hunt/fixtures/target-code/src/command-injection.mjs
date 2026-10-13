export function vulnerableCommand(input) {
  return ["sh", "-c", input];
}

export function safeCommand(input) {
  return ["echo", input];
}
