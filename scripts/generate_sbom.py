#!/usr/bin/env python3
"""
ConversaIQ Software Bill of Materials (SBOM) Generator
Generates CycloneDX v1.5 JSON SBOM for backend and frontend components.
"""

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def generate_sbom():
    now_iso = datetime.now(timezone.utc).isoformat()
    serial_number = f"urn:uuid:{uuid.uuid4()}"

    sbom = {
        "$schema": "http://cyclonedx.org/schema/bom-1.5.json",
        "bomFormat": "CycloneDX",
        "specVersion": "1.5",
        "serialNumber": serial_number,
        "version": 1,
        "metadata": {
            "timestamp": now_iso,
            "tools": [
                {
                    "vendor": "ConversaIQ Engineering",
                    "name": "conversaiq-sbom-generator",
                    "version": "1.0.0"
                }
            ],
            "component": {
                "bom-ref": "pkg:conversaiq/platform@1.0.0",
                "type": "application",
                "name": "ConversaIQ Enterprise AI Platform",
                "version": "1.0.0",
                "description": "Enterprise AI Customer Support & Business Intelligence Platform",
                "licenses": [{"license": {"id": "Proprietary"}}]
            }
        },
        "components": []
    }

    # 1. Parse Backend Dependencies
    pyproject_path = ROOT / "backend" / "pyproject.toml"
    if pyproject_path.exists():
        import re
        text = pyproject_path.read_text(encoding="utf-8")
        dep_section = re.search(r"dependencies\s*=\s*\[(.*?)\]", text, re.DOTALL)
        if dep_section:
            deps = re.findall(r'"([a-zA-Z0-9_\-\[\]]+)([>=<~!]*[0-9a-zA-Z\.]*)"', dep_section.group(1))
            for name, version in deps:
                clean_name = name.split("[")[0]
                sbom["components"].append({
                    "bom-ref": f"pkg:pypi/{clean_name}@{version or 'latest'}",
                    "type": "library",
                    "name": clean_name,
                    "version": version.lstrip(">=<~!") or "1.0.0",
                    "purl": f"pkg:pypi/{clean_name}",
                    "scope": "required"
                })

    # 2. Parse Frontend Dependencies
    package_json_path = ROOT / "frontend" / "package.json"
    if package_json_path.exists():
        pkg_data = json.loads(package_json_path.read_text(encoding="utf-8"))
        for name, ver in pkg_data.get("dependencies", {}).items():
            clean_ver = ver.lstrip("^~>=<")
            sbom["components"].append({
                "bom-ref": f"pkg:npm/{name}@{clean_ver}",
                "type": "library",
                "name": name,
                "version": clean_ver,
                "purl": f"pkg:npm/{name}",
                "scope": "required"
            })

    output_dir = ROOT / "engineering" / "compliance"
    output_dir.mkdir(parents=True, exist_ok=True)
    output_file = output_dir / "sbom.json"
    output_file.write_text(json.dumps(sbom, indent=2), encoding="utf-8")

    print(f"Generated SBOM at {output_file} with {len(sbom['components'])} components.")
    return output_file


if __name__ == "__main__":
    generate_sbom()
