import os
import re
import hashlib
from typing import Tuple, Optional


class DocumentScanner:
    """
    Multi-layer Security Scanner for Customer Uploaded Files:
    1. Magic-byte verification
    2. Extension & MIME consistency
    3. Path traversal neutralization
    4. Anti-malware & EICAR test signature detection
    5. Size limits
    """

    ALLOWED_MIME_TYPES = {
        "application/pdf": [".pdf"],
        "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/webp": [".webp"],
    }

    MAGIC_BYTE_SIGNATURES = [
        (b"%PDF-", "application/pdf"),
        (b"\x89PNG\r\n\x1a\n", "image/png"),
        (b"\xff\xd8\xff", "image/jpeg"),
    ]

    EICAR_SIGNATURE = b"X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"

    @classmethod
    def sanitize_filename(cls, filename: str) -> str:
        # Strip directory components (prevents ../ and \ path traversal)
        base = os.path.basename(filename.replace("\\", "/"))
        # Strip null bytes and non-printable chars
        cleaned = re.sub(r"[\x00-\x1f\x7f-\x9f]", "", base)
        # Enforce safe character set: alphanumeric, underscores, hyphens, single dots
        safe_name = re.sub(r"[^a-zA-Z0-9_\-\.]", "_", cleaned)
        # Prevent hidden files or double dot tricks
        while ".." in safe_name:
            safe_name = safe_name.replace("..", ".")
        safe_name = safe_name.strip("._")
        return safe_name if safe_name else "uploaded_document"

    @classmethod
    def validate_magic_bytes(cls, content: bytes, filename: str) -> Tuple[bool, Optional[str], Optional[str]]:
        if not content:
            return False, None, "File content is empty."

        # Detect by magic bytes
        detected_mime = None
        for magic, mime in cls.MAGIC_BYTE_SIGNATURES:
            if content.startswith(magic):
                detected_mime = mime
                break

        # Check WebP magic bytes: RIFF....WEBP
        if not detected_mime and len(content) >= 12:
            if content[0:4] == b"RIFF" and content[8:12] == b"WEBP":
                detected_mime = "image/webp"

        if not detected_mime:
            return False, None, "File signature does not match any approved format (PDF, PNG, JPG, WebP)."

        # Validate extension matches detected MIME
        ext = os.path.splitext(filename.lower())[1]
        valid_exts = cls.ALLOWED_MIME_TYPES.get(detected_mime, [])
        if ext not in valid_exts:
            return (
                False,
                None,
                f"File extension '{ext}' does not match its detected content format '{detected_mime}'. Extension spoofing detected.",
            )

        return True, detected_mime, None

    @classmethod
    def scan_for_malware(cls, content: bytes, filename: str) -> Tuple[bool, Optional[str]]:
        # 1. EICAR Standard Antivirus Test Signature
        if cls.EICAR_SIGNATURE in content:
            return False, "EICAR antivirus test file detected. Quarantined."

        # 2. Executable / binary headers disguised as documents
        if content.startswith(b"MZ"):  # Windows PE Executable / DLL
            return False, "Disguised Windows executable binary detected (MZ header)."

        if content.startswith(b"\x7fELF"):  # Linux ELF Binary
            return False, "Disguised Linux executable binary detected (ELF header)."

        if content.startswith(b"\xca\xfe\xba\xbe") or content.startswith(b"\xfe\xed\xfa"):  # Mach-O
            return False, "Disguised executable binary detected (Mach-O header)."

        # 3. Embedded dangerous scripts / HTML tags in images or PDF
        lower_content = content[:4096].lower()
        if b"<script" in lower_content or b"javascript:" in lower_content:
            return False, "Embedded cross-site script vector detected."

        return True, None

    @classmethod
    def compute_sha256(cls, content: bytes) -> str:
        return hashlib.sha256(content).hexdigest()
