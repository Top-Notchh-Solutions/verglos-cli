const tools = Object.freeze({
  get: (value) => `get:${value}`,
  summarize: (value) => `summarize:${value}`,
});

export function vulnerableDispatch(toolName, input) {
  return tools[toolName]?.(input) ?? `unapproved:${toolName}:${input}`;
}

export function safeDispatch(toolName, input) {
  if (toolName !== "get" && toolName !== "summarize") return undefined;
  return tools[toolName](input);
}
