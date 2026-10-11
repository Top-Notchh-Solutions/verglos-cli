import assert from "node:assert/strict";
import { test } from "node:test";
import { ArchiveSafetyError, validateArchiveMembers } from "./archive-safety.js";

test("archive safety validates bounded members and safe links", () => { assert.equal(validateArchiveMembers([{ path: "bin/trivy", kind: "file", size: 10 }, { path: "bin", kind: "directory", size: 0 }]).length, 2); assert.throws(() => validateArchiveMembers([{ path: "../escape", kind: "file", size: 1 }]), (e: unknown) => e instanceof ArchiveSafetyError && e.code === "TRAVERSAL"); });
test("archive safety rejects link escapes, duplicates, and aggregate limits", () => { assert.throws(() => validateArchiveMembers([{ path: "link", kind: "symlink", size: 0, linkTarget: "../../etc" }]), (e: unknown) => e instanceof ArchiveSafetyError && e.code === "LINK_ESCAPE"); assert.throws(() => validateArchiveMembers([{ path: "a", kind: "file", size: 1 }, { path: "a", kind: "file", size: 1 }]), /duplicate/); assert.throws(() => validateArchiveMembers([{ path: "a", kind: "file", size: 10 }], { maxBytes: 1 }), /aggregate/); });

test("archive safety rejects POSIX, Windows, UNC, and normalized traversal paths", () => {
  for (const path of [".", "../outside", "a/../../outside", "/etc/passwd", "C:/Windows/system.ini", "C:\\\\Windows\\\\system.ini", "\\\\server\\\\share\\\\file", "a//b", "a/./b", "a/../b", "a\0b"]) {
    assert.throws(() => validateArchiveMembers([{ path, kind: "file", size: 1 }]), (error: unknown) => error instanceof ArchiveSafetyError && error.code === "TRAVERSAL", `accepted unsafe archive path ${path}`);
  }
});

test("archive safety rejects invalid member and aggregate resource declarations", () => {
  for (const size of [-1, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => validateArchiveMembers([{ path: "x", kind: "file", size }]), (error: unknown) => error instanceof ArchiveSafetyError && error.code === "LIMIT");
  }
  assert.throws(() => validateArchiveMembers([{ path: "x", kind: "file", size: 0 }, { path: "y", kind: "file", size: 0 }], { maxMembers: 1 }), (error: unknown) => error instanceof ArchiveSafetyError && error.code === "LIMIT");
  assert.throws(() => validateArchiveMembers([{ path: "x", kind: "file", size: Number.MAX_SAFE_INTEGER }]), (error: unknown) => error instanceof ArchiveSafetyError && error.code === "LIMIT");
  for (const limits of [{ maxMembers: 0 }, { maxMembers: Number.NaN }, { maxBytes: Number.POSITIVE_INFINITY }, { maxBytes: 0 }]) {
    assert.throws(() => validateArchiveMembers([], limits), (error: unknown) => error instanceof ArchiveSafetyError && error.code === "LIMIT");
  }
  for (const linkTarget of ["", "/etc/passwd", "C:/Windows/system.ini", "\\\\server\\\\share\\\\file", "../../outside"]) {
    assert.throws(() => validateArchiveMembers([{ path: "link", kind: "symlink", size: 0, linkTarget }]), (error: unknown) => error instanceof ArchiveSafetyError && error.code === "LINK_ESCAPE", `accepted unsafe link target ${linkTarget}`);
  }
});
