import { join, resolve } from "node:path";

export function vulnerablePath(input) {
  return join("/srv/data", input);
}

export function safePath(input) {
  const root = resolve("/srv/data");
  const candidate = resolve(root, input);
  return candidate === root || candidate.startsWith(`${root}/`) ? candidate : root;
}
