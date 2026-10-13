export function vulnerableQuery(input) {
  return `SELECT * FROM users WHERE id = ${input}`;
}

export function safeQuery(input) {
  return { text: "SELECT * FROM users WHERE id = $1", values: [input] };
}
