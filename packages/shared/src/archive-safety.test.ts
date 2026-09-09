import assert from "node:assert/strict";
import { test } from "node:test";
import { ArchiveSafetyError, validateArchiveMembers } from "./archive-safety.js";

test("archive safety validates bounded members and safe links", () => { assert.equal(validateArchiveMembers([{ path: "bin/trivy", kind: "file", size: 10 }, { path: "bin", kind: "directory", size: 0 }]).length, 2); assert.throws(() => validateArchiveMembers([{ path: "../escape", kind: "file", size: 1 }]), (e: unknown) => e instanceof ArchiveSafetyError && e.code === "TRAVERSAL"); });
test("archive safety rejects link escapes, duplicates, and aggregate limits", () => { assert.throws(() => validateArchiveMembers([{ path: "link", kind: "symlink", size: 0, linkTarget: "../../etc" }]), (e: unknown) => e instanceof ArchiveSafetyError && e.code === "LINK_ESCAPE"); assert.throws(() => validateArchiveMembers([{ path: "a", kind: "file", size: 1 }, { path: "a", kind: "file", size: 1 }]), /duplicate/); assert.throws(() => validateArchiveMembers([{ path: "a", kind: "file", size: 10 }], { maxBytes: 1 }), /aggregate/); });
