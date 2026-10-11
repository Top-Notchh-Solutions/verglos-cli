#!/usr/bin/env python3
"""Verify that the current public release archives are bound to an in-toto link.

This is a local/CI provenance-shape check, not a Sigstore or release
certification claim. Both signing keys are generated ephemerally for the run;
the official in-toto verifier still checks the signed layout, functionary
threshold, link signature, and every archive's exact product digest.
"""

from __future__ import annotations

import hashlib
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import NoReturn

from cryptography.hazmat.primitives import serialization
from in_toto.models.layout import Layout, Step
from in_toto.models.link import Link
from in_toto.models.metadata import Metablock
from securesystemslib.signer import CryptoSigner


EXPECTED_PREFIXES = {
    "verglos-shared-",
    "verglos-scanner-",
    "verglos-reporter-",
    "verglos-mcp-",
    "verglos-entitlement-",
    "verglos-2.",
}


def fail(message: str) -> "NoReturn":
    raise SystemExit(message)


def main() -> int:
    if len(sys.argv) != 2:
        fail("release archive directory is required")
    archive_root = Path(sys.argv[1]).resolve()
    if not archive_root.is_dir() or archive_root.is_symlink():
        fail("release archive directory must be a regular directory")
    archives = {path.name: path for path in archive_root.glob("*.tgz")}
    prefixes = {next((prefix for prefix in EXPECTED_PREFIXES if name.startswith(prefix)), None) for name in archives}
    if len(archives) != len(EXPECTED_PREFIXES) or None in prefixes or len(prefixes) != len(EXPECTED_PREFIXES):
        fail(f"release archive set mismatch: expected one archive for each {sorted(EXPECTED_PREFIXES)}, found {sorted(archives)}")
    if any(not path.is_file() or path.is_symlink() for path in archives.values()):
        fail("release archive set contains a non-regular file")

    verifier = shutil.which("in-toto-verify")
    if verifier is None:
        fail("official in-toto-verify command is required")

    layout_signer = CryptoSigner.generate_ed25519()
    functionary_signer = CryptoSigner.generate_ed25519()
    functionary_key = functionary_signer.public_key.to_dict()
    functionary_key["keyid"] = functionary_signer.public_key.keyid

    with tempfile.TemporaryDirectory(prefix="verglos-in-toto-") as temp:
        evidence = Path(temp)
        for name, path in archives.items():
            shutil.copy2(path, evidence / name)

        layout = Layout(
            steps=[Step(
                name="release-archives",
                expected_command=["pnpm", "pack:public"],
                pubkeys=[functionary_signer.public_key.keyid],
                threshold=1,
            )],
            inspect=[],
        )
        layout.add_functionary_key(functionary_key)
        layout_metadata = Metablock(signed=layout)
        layout_metadata.create_signature(layout_signer)
        layout_metadata.dump(str(evidence / "root.layout"))

        products = {
            name: {"sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
            for name, path in archives.items()
        }
        link = Link(
            name="release-archives",
            materials={},
            products=products,
            byproducts={},
            command=["pnpm", "pack:public"],
            environment={},
        )
        link_metadata = Metablock(signed=link)
        link_metadata.create_signature(functionary_signer)
        link_metadata.dump(str(evidence / f"release-archives.{functionary_signer.public_key.keyid[:8]}.link"))

        layout_public_key = layout_signer._private_key.public_key().public_bytes(
            serialization.Encoding.PEM,
            serialization.PublicFormat.SubjectPublicKeyInfo,
        )
        (evidence / "layout.pub").write_bytes(layout_public_key)
        subprocess.run(
            [verifier, "--layout", str(evidence / "root.layout"), "--verification-keys", str(evidence / "layout.pub"), "--link-dir", str(evidence)],
            check=True,
        )

    print(f"in-toto release binding verified: {len(archives)} archives with exact SHA-256 products")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
