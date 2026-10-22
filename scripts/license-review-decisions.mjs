// Exact, owner-approved redistribution decisions for the current package
// boundary. These records do not classify an unknown license as generally
// permissive: they clear only the exact version/source/license tuple after
// the generated notice retains the installed license text and source link.

const DECISION_ID = "top-notchh-company-disposition-2026-10-23";

const packageDecision = (name, version, license, source) => Object.freeze({
  id: DECISION_ID,
  name,
  version,
  license,
  source,
  noticeObligation: "retain-license-text-source-link-and-attribution",
});

const bundledDecision = (name, version, bundledBy, license, parentLicense, source) => Object.freeze({
  id: DECISION_ID,
  name,
  version,
  bundledBy,
  license,
  parentLicense,
  source,
  noticeObligation: "retain-nested-license-text-containing-notice-source-link-and-attribution",
});

export const LICENSE_REVIEW_DECISIONS = Object.freeze({
  packages: Object.freeze({
    "glob@13.0.6": packageDecision("glob", "13.0.6", "BlueOak-1.0.0", "https://github.com/isaacs/node-glob"),
    "lru-cache@11.5.2": packageDecision("lru-cache", "11.5.2", "BlueOak-1.0.0", "https://github.com/isaacs/node-lru-cache"),
    "minimatch@10.2.6": packageDecision("minimatch", "10.2.6", "BlueOak-1.0.0", "https://github.com/isaacs/minimatch"),
    "minipass@7.1.3": packageDecision("minipass", "7.1.3", "BlueOak-1.0.0", "https://github.com/isaacs/minipass"),
    "minipass-flush@1.0.7": packageDecision("minipass-flush", "1.0.7", "BlueOak-1.0.0", "https://github.com/isaacs/minipass-flush"),
    "path-scurry@2.0.2": packageDecision("path-scurry", "2.0.2", "BlueOak-1.0.0", "https://github.com/isaacs/path-scurry"),
  }),
  bundled: Object.freeze({
    "benchmark@1.0.0|fast-uri@3.1.7": bundledDecision("benchmark", "1.0.0", "fast-uri@3.1.7", "ISC", "BSD-3-Clause", "https://github.com/fastify/fast-uri"),
  }),
});
