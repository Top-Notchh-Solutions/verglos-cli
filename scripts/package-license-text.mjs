import { lstat, readFile } from "node:fs/promises";
import { join } from "node:path";

const MAX_LICENSE_TEXT_BYTES = 512 * 1024;
const FILE_GROUPS = Object.freeze([
  Object.freeze({ kind: "License", names: Object.freeze(["LICENSE", "LICENSE.md", "LICENSE.txt", "COPYING"]) }),
  Object.freeze({ kind: "Notice", names: Object.freeze(["NOTICE", "NOTICE.md", "NOTICE.txt"]) }),
]);

/** Read bounded regular license and notice files across every installed version path. */
export async function readPackageLicenseTexts(packagePaths) {
  const output = [];
  const seen = new Set();
  const paths = (Array.isArray(packagePaths) ? packagePaths : [packagePaths])
    .filter((value) => typeof value === "string")
    .sort();
  for (const packagePath of paths) {
    for (const group of FILE_GROUPS) {
      for (const name of group.names) {
        const path = join(packagePath, name);
        let entry;
        try { entry = await lstat(path); }
        catch (error) {
          if (error?.code === "ENOENT") continue;
          output.push({ kind: group.kind, file: name, text: `[not included: ${group.kind} source could not be read; review required]` });
          break;
        }
        if (entry.isSymbolicLink() || !entry.isFile()) {
          output.push({ kind: group.kind, file: name, text: `[not included: ${group.kind} source is not a regular file; review required]` });
          break;
        }
        if (entry.size > MAX_LICENSE_TEXT_BYTES) {
          output.push({ kind: group.kind, file: name, text: `[not included: ${group.kind} source exceeds 512 KiB; review required]` });
          break;
        }
        let bytes;
        try { bytes = await readFile(path); }
        catch {
          output.push({ kind: group.kind, file: name, text: `[not included: ${group.kind} source could not be read; review required]` });
          break;
        }
        if (bytes.byteLength > MAX_LICENSE_TEXT_BYTES) {
          output.push({ kind: group.kind, file: name, text: `[not included: ${group.kind} source exceeds 512 KiB; review required]` });
          break;
        }
        const text = bytes.toString("utf8").trim();
        if (text) {
          const key = `${group.kind}\0${name}\0${text}`;
          if (!seen.has(key)) {
            seen.add(key);
            output.push({ kind: group.kind, file: name, text });
          }
        }
        break;
      }
    }
  }
  return output.sort((a, b) => a.kind.localeCompare(b.kind) || a.file.localeCompare(b.file) || a.text.localeCompare(b.text));
}
