#!/usr/bin/env python3
"""Local Oversee app server.

Run this file from PyCharm or Terminal to use Oversee as a local desktop-style
web app backed by SQLite. It serves the existing HTML/CSS/JS UI and mirrors the
current backend API routes with local storage.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import hmac
import json
import mimetypes
import os
import re
import secrets
import shutil
import sqlite3
import sys
import uuid
import zlib
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT_DIR = Path(__file__).resolve().parent
DEFAULT_DATA_DIR = ROOT_DIR / "local_data"
SESSION_TTL_DAYS = int(os.environ.get("OVERSEE_LOCAL_SESSION_DAYS", "30"))
INVITE_TTL_DAYS = int(os.environ.get("OVERSEE_LOCAL_INVITE_DAYS", "7"))
MAX_JSON_BODY_BYTES = int(os.environ.get("OVERSEE_LOCAL_MAX_JSON_BYTES", str(128 * 1024)))
MAX_APP_DATA_BODY_BYTES = int(os.environ.get("OVERSEE_LOCAL_MAX_APP_DATA_BYTES", str(4 * 1024 * 1024)))
MAX_PDF_UPLOAD_BYTES = int(os.environ.get("OVERSEE_LOCAL_MAX_PDF_BYTES", str(12 * 1024 * 1024)))
PDF_TEXT_PREVIEW_LIMIT = 12000

ACCESS_KEYS = ["engineering", "procurement", "accounting", "administrative"]
ASSIGNABLE_ACCESS_KEYS = ["engineering", "procurement", "accounting"]
PUBLIC_ACCOUNT_FIELDS = [
    "id",
    "name",
    "email",
    "gmailLinked",
    "role",
    "access",
    "plan",
    "invitedBy",
    "createdAt",
    "emailVerifiedAt",
    "lastLoginAt",
]
APP_DATA_KEYS = [
    "projects",
    "swa",
    "estimateDraft",
    "estimateV2Draft",
    "estimateTemplates",
    "materialPrices",
    "procurement",
    "accounting",
    "subscription",
]
ENGINEERING_APP_DATA_KEYS = ["projects", "swa", "estimateDraft", "estimateV2Draft", "estimateTemplates", "materialPrices"]
PROCUREMENT_APP_DATA_KEYS = ["projects", "materialPrices", "procurement"]
ACCOUNTING_APP_DATA_KEYS = ["projects", "swa", "accounting"]

MATERIAL_TAKEOFF_TERMS = [
    {"description": "Concrete", "category": "Structural", "planTypes": ["Structural", "Civil", "Architectural"], "terms": ["concrete", "conc.", "reinforced concrete", "r.c.", "class a concrete"]},
    {"description": "Portland Cement", "category": "Concrete Mix", "planTypes": ["Structural", "Civil", "Architectural"], "terms": ["cement", "portland cement", "cement bag"]},
    {"description": "Fine Aggregate / Sand", "category": "Concrete Mix", "planTypes": ["Structural", "Civil", "Architectural"], "terms": ["sand", "fine aggregate", "washed sand"]},
    {"description": "Coarse Aggregate / Gravel", "category": "Concrete Mix", "planTypes": ["Structural", "Civil", "Architectural"], "terms": ["gravel", "coarse aggregate", "crushed gravel", "aggregate"]},
    {"description": "Rebar / Reinforcing Bar", "category": "Structural", "planTypes": ["Structural", "Civil"], "terms": ["rebar", "reinforcing bar", "deformed bar", "steel bar", "stirrups", "ties", "vertical bars", "db10", "db12", "db16", "db20"]},
    {"description": "Foundation / Footing", "category": "Structural Element", "planTypes": ["Structural", "Civil"], "terms": ["foundation", "footing", "footings", "foundation plan"]},
    {"description": "Column", "category": "Structural Element", "planTypes": ["Structural"], "terms": ["column", "columns", "col.", "schedule of columns"]},
    {"description": "Beam", "category": "Structural Element", "planTypes": ["Structural"], "terms": ["beam", "beams", "girder", "beam schedule"]},
    {"description": "Slab", "category": "Structural Element", "planTypes": ["Structural", "Architectural"], "terms": ["slab", "slabs", "suspended slab", "slab on grade"]},
    {"description": "Concrete Hollow Block", "category": "Masonry", "planTypes": ["Architectural", "Structural", "Civil"], "terms": ["concrete hollow block", "hollow block", "chb", "100mm chb", "150mm chb", "200mm chb"]},
    {"description": "Tiles", "category": "Architectural", "planTypes": ["Architectural"], "terms": ["tile", "tiles", "ceramic tile", "porcelain tile"]},
    {"description": "Doors", "category": "Architectural", "planTypes": ["Architectural"], "terms": ["door", "doors", "door jamb"]},
    {"description": "Windows", "category": "Architectural", "planTypes": ["Architectural"], "terms": ["window", "windows", "window frame"]},
    {"description": "PVC Pipe", "category": "Plumbing", "planTypes": ["Plumbing", "Fire Protection"], "terms": ["pvc pipe", "pvc pipes", "polyvinyl chloride"]},
    {"description": "Conduit", "category": "Electrical", "planTypes": ["Electrical", "Electronics"], "terms": ["conduit", "emt", "imc", "pvc conduit"]},
    {"description": "Wires / Cables", "category": "Electrical", "planTypes": ["Electrical", "Electronics"], "terms": ["wire", "wires", "cable", "cables", "thhn", "thwn"]},
    {"description": "Panel Board", "category": "Electrical", "planTypes": ["Electrical"], "terms": ["panel board", "panelboard", "distribution panel"]},
    {"description": "Lighting Fixture", "category": "Electrical", "planTypes": ["Electrical"], "terms": ["lighting fixture", "light fixture", "luminaire"]},
]


class ApiError(Exception):
    def __init__(self, message: str, status: int = 500):
        super().__init__(message)
        self.status = status


def utcnow() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def random_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4()}"


def normalize_email(value: object) -> str:
    return str(value or "").strip().lower()


def validate_email(email: str) -> bool:
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email))


def json_dumps(value: object) -> str:
    return json.dumps(value, separators=(",", ":"), ensure_ascii=False)


def json_loads(value: object, fallback: object) -> object:
    if value is None:
        return fallback
    try:
        return json.loads(str(value))
    except Exception:
        return fallback


def all_access() -> dict[str, bool]:
    return {key: True for key in ACCESS_KEYS}


def no_access() -> dict[str, bool]:
    return {key: False for key in ACCESS_KEYS}


def member_access(access: object) -> dict[str, bool]:
    source = access if isinstance(access, dict) else {}
    normalized = no_access()
    for key in ASSIGNABLE_ACCESS_KEYS:
        normalized[key] = bool(source.get(key))
    normalized["administrative"] = False
    return normalized


def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), bytes.fromhex(salt), 120000, dklen=32).hex()
    return digest, salt


def verify_password(password: str, saved_hash: str, salt: str) -> bool:
    current_hash, _salt = hash_password(password, salt)
    return hmac.compare_digest(current_hash, saved_hash)


def clean_file_name(value: object) -> str:
    name = Path(str(value or "plan.pdf")).name.strip() or "plan.pdf"
    return re.sub(r"[^A-Za-z0-9._ ()-]", "_", name)[:160]


def account_from_row(row: sqlite3.Row | None) -> dict | None:
    if row is None:
        return None
    return {
        "id": row["id"],
        "name": row["name"],
        "email": row["email"],
        "passwordHash": row["password_hash"],
        "passwordSalt": row["password_salt"],
        "gmailLinked": bool(row["gmail_linked"]),
        "role": row["role"],
        "access": json_loads(row["access_json"], no_access()),
        "plan": row["plan"],
        "invitedBy": row["invited_by"],
        "createdAt": row["created_at"],
        "emailVerifiedAt": row["email_verified_at"],
        "lastLoginAt": row["last_login_at"],
    }


def public_account(account: dict) -> dict:
    return {field: account.get(field) for field in PUBLIC_ACCOUNT_FIELDS}


def workspace_account_for(db: sqlite3.Connection, account: dict) -> dict:
    if account.get("role") == "owner" or not account.get("invitedBy"):
        return account
    owner = query_account(db, "id", account["invitedBy"])
    return owner or account


def has_engineering_access(account: dict) -> bool:
    return account.get("role") == "owner" or bool(account.get("access", {}).get("engineering"))


def has_paid_plan(account: dict) -> bool:
    return account.get("plan") != "free"


def app_data_read_keys(account: dict) -> list[str]:
    if account.get("role") == "owner":
        return list(APP_DATA_KEYS)
    keys: set[str] = set()
    access = account.get("access") or {}
    if access.get("engineering"):
        keys.update(ENGINEERING_APP_DATA_KEYS)
    if access.get("procurement"):
        keys.update(PROCUREMENT_APP_DATA_KEYS)
    if access.get("accounting"):
        keys.update(ACCOUNTING_APP_DATA_KEYS)
    return list(keys)


def app_data_write_keys(account: dict) -> list[str]:
    if account.get("role") == "owner":
        return list(APP_DATA_KEYS)
    keys: set[str] = set()
    access = account.get("access") or {}
    if access.get("engineering"):
        keys.update(ENGINEERING_APP_DATA_KEYS)
    if access.get("procurement"):
        keys.add("procurement")
    if access.get("accounting"):
        keys.add("accounting")
    return list(keys)


def normalize_app_data(data: object) -> dict:
    source = data if isinstance(data, dict) else {}
    normalized = {"savedAt": str(source.get("savedAt") or utcnow())}
    for key in APP_DATA_KEYS:
        if key in source:
            normalized[key] = source[key]
    return normalized


def filter_app_data(data: object, account: dict) -> dict:
    source = normalize_app_data(data)
    filtered = {"savedAt": source.get("savedAt") or utcnow()}
    for key in app_data_read_keys(account):
        if key in source:
            filtered[key] = source[key]
    return filtered


def merge_app_data(existing_data: object, submitted_data: object, account: dict) -> dict:
    existing = normalize_app_data(existing_data)
    submitted = normalize_app_data(submitted_data)
    merged = dict(existing)
    merged["savedAt"] = utcnow()
    for key in app_data_write_keys(account):
        if key in submitted:
            merged[key] = submitted[key]
    return merged


def app_data_summary(data: dict) -> dict:
    projects = data.get("projects") if isinstance(data.get("projects"), list) else []
    swa = data.get("swa") if isinstance(data.get("swa"), dict) else {}
    estimate = data.get("estimateDraft") if isinstance(data.get("estimateDraft"), dict) else {}
    estimate_v2 = data.get("estimateV2Draft") if isinstance(data.get("estimateV2Draft"), dict) else {}
    procurement = data.get("procurement") if isinstance(data.get("procurement"), dict) else {}
    accounting = data.get("accounting") if isinstance(data.get("accounting"), dict) else {}
    return {
        "projectCount": len(projects),
        "swaSheetCount": len(swa.get("sheets") if isinstance(swa.get("sheets"), list) else []),
        "estimateV1RowCount": len(estimate.get("rows") if isinstance(estimate.get("rows"), list) else []),
        "estimateV2TakeoffRowCount": len(estimate_v2.get("takeoffRows") if isinstance(estimate_v2.get("takeoffRows"), list) else []),
        "estimateV2MaterialRowCount": len(estimate_v2.get("materials") if isinstance(estimate_v2.get("materials"), list) else []),
        "estimateV2PlanFileName": str(estimate_v2.get("planFileName") or ""),
        "estimateV2PlanStored": bool(estimate_v2.get("planStoragePath")),
        "purchaseRequestCount": len(procurement.get("requests") if isinstance(procurement.get("requests"), list) else []),
        "purchaseOrderCount": len(procurement.get("orders") if isinstance(procurement.get("orders"), list) else []),
        "supplierCount": len(procurement.get("suppliers") if isinstance(procurement.get("suppliers"), list) else []),
        "billingCount": len(accounting.get("billings") if isinstance(accounting.get("billings"), list) else []),
        "expenseCount": len(accounting.get("expenses") if isinstance(accounting.get("expenses"), list) else []),
        "savedAt": str(data.get("savedAt") or utcnow()),
    }


def init_database(db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(db_path) as db:
        db.executescript(
            """
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS accounts (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                password_salt TEXT NOT NULL,
                gmail_linked INTEGER NOT NULL DEFAULT 0,
                role TEXT NOT NULL,
                access_json TEXT NOT NULL,
                plan TEXT NOT NULL,
                invited_by TEXT,
                created_at TEXT NOT NULL,
                email_verified_at TEXT,
                last_login_at TEXT
            );
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                account_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS invites (
                token TEXT PRIMARY KEY,
                email TEXT,
                access_json TEXT NOT NULL,
                created_by TEXT NOT NULL,
                created_at TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                accepted_by TEXT,
                accepted_at TEXT
            );
            CREATE TABLE IF NOT EXISTS app_data (
                account_id TEXT PRIMARY KEY,
                data_json TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                saved_by_account_id TEXT,
                saved_by_email TEXT,
                saved_by_name TEXT
            );
            CREATE TABLE IF NOT EXISTS gathered_app_data (
                account_id TEXT PRIMARY KEY,
                account_email TEXT,
                account_name TEXT,
                saved_by_account_id TEXT,
                saved_by_email TEXT,
                saved_by_name TEXT,
                data_json TEXT NOT NULL,
                summary_json TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS plan_files (
                id TEXT PRIMARY KEY,
                workspace_account_id TEXT NOT NULL,
                account_id TEXT NOT NULL,
                file_name TEXT NOT NULL,
                file_path TEXT NOT NULL,
                size INTEGER NOT NULL,
                uploaded_at TEXT NOT NULL,
                uploaded_by_email TEXT,
                uploaded_by_name TEXT
            );
            CREATE TABLE IF NOT EXISTS audit_log (
                id TEXT PRIMARY KEY,
                action TEXT NOT NULL,
                data_json TEXT,
                at TEXT NOT NULL
            );
            """
        )


def connect_db(db_path: Path) -> sqlite3.Connection:
    db = sqlite3.connect(db_path)
    db.row_factory = sqlite3.Row
    return db


def query_account(db: sqlite3.Connection, field: str, value: str) -> dict | None:
    if field not in {"id", "email"}:
        raise ValueError("Unsupported account lookup field")
    row = db.execute(f"SELECT * FROM accounts WHERE {field} = ?", (value,)).fetchone()
    return account_from_row(row)


def create_session(db: sqlite3.Connection, account_id: str) -> dict:
    token = secrets.token_hex(32)
    now = utcnow()
    expires_at = (datetime.now(timezone.utc) + timedelta(days=SESSION_TTL_DAYS)).isoformat(timespec="milliseconds").replace("+00:00", "Z")
    db.execute("DELETE FROM sessions WHERE expires_at <= ?", (now,))
    db.execute(
        "INSERT INTO sessions (token, account_id, created_at, expires_at) VALUES (?, ?, ?, ?)",
        (token, account_id, now, expires_at),
    )
    return {"token": token, "accountId": account_id, "createdAt": now, "expiresAt": expires_at}


def audit(db: sqlite3.Connection, action: str, data: object | None = None) -> None:
    db.execute(
        "INSERT INTO audit_log (id, action, data_json, at) VALUES (?, ?, ?, ?)",
        (random_id("audit"), action, json_dumps(data or {}), utcnow()),
    )


def read_app_data_record(db: sqlite3.Connection, account_id: str) -> dict | None:
    row = db.execute("SELECT data_json, updated_at FROM app_data WHERE account_id = ?", (account_id,)).fetchone()
    if not row:
        return None
    return {"data": normalize_app_data(json_loads(row["data_json"], {})), "updatedAt": row["updated_at"]}


def write_app_data_record(db: sqlite3.Connection, workspace_account: dict, saved_by: dict, data: dict, updated_at: str) -> None:
    data_json = json_dumps(data)
    db.execute(
        """
        INSERT INTO app_data (account_id, data_json, updated_at, saved_by_account_id, saved_by_email, saved_by_name)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(account_id) DO UPDATE SET
            data_json = excluded.data_json,
            updated_at = excluded.updated_at,
            saved_by_account_id = excluded.saved_by_account_id,
            saved_by_email = excluded.saved_by_email,
            saved_by_name = excluded.saved_by_name
        """,
        (
            workspace_account["id"],
            data_json,
            updated_at,
            saved_by["id"],
            saved_by.get("email") or "",
            saved_by.get("name") or "",
        ),
    )
    db.execute(
        """
        INSERT INTO gathered_app_data (
            account_id, account_email, account_name, saved_by_account_id, saved_by_email,
            saved_by_name, data_json, summary_json, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(account_id) DO UPDATE SET
            account_email = excluded.account_email,
            account_name = excluded.account_name,
            saved_by_account_id = excluded.saved_by_account_id,
            saved_by_email = excluded.saved_by_email,
            saved_by_name = excluded.saved_by_name,
            data_json = excluded.data_json,
            summary_json = excluded.summary_json,
            updated_at = excluded.updated_at
        """,
        (
            workspace_account["id"],
            workspace_account.get("email") or "",
            workspace_account.get("name") or "",
            saved_by["id"],
            saved_by.get("email") or "",
            saved_by.get("name") or "",
            data_json,
            json_dumps(app_data_summary(data)),
            updated_at,
        ),
    )


def server_swa_sheet_this_period_total(sheet: dict) -> float:
    total = 0.0
    rows = sheet.get("rows") if isinstance(sheet, dict) else []
    for row in rows if isinstance(rows, list) else []:
        quantity = max(0.0, float(row.get("thisQty") or 0)) if isinstance(row, dict) else 0.0
        unit_cost = max(0.0, float(row.get("unitCost") or 0)) if isinstance(row, dict) else 0.0
        total += quantity * unit_cost
    return round(total, 2)


def submitted_by_fields(existing: dict, account: dict) -> dict:
    return {
        "enteredById": existing.get("enteredById") or account["id"],
        "enteredByName": existing.get("enteredByName") or account.get("name") or "",
        "enteredByEmail": existing.get("enteredByEmail") or account.get("email") or "",
    }


def estimate_text(value: object, max_len: int) -> str:
    return str(value or "").strip()[:max_len]


def estimate_procurement_row(row_id: object, row: object, project_id: str) -> dict | None:
    if not isinstance(row, dict):
        return None
    description = estimate_text(row.get("description"), 300)
    try:
        quantity = round(max(0.0, float(row.get("quantity") or 0)), 4)
    except Exception:
        quantity = 0.0
    if not description or quantity <= 0:
        return None
    try:
        cost_per_unit = round(max(0.0, float(row.get("costPerUnit") or 0)), 2)
    except Exception:
        cost_per_unit = 0.0
    return {
        "id": estimate_text(row_id, 220) or random_id("estimate_row"),
        "description": description,
        "projectId": estimate_text(row.get("projectId"), 180) or project_id,
        "quantity": quantity,
        "unit": estimate_text(row.get("unit"), 80) or "unit",
        "costPerUnit": cost_per_unit,
    }


def server_estimate_procurement_rows(version: str, draft: dict) -> list[dict]:
    project_id = estimate_text(draft.get("selectedProjectId"), 180)
    rows: list[dict] = []
    if version == "v2":
        takeoff_rows = draft.get("takeoffRows") if isinstance(draft.get("takeoffRows"), list) else []
        material_rows = draft.get("materials") if isinstance(draft.get("materials"), list) else []
        for row in takeoff_rows:
            if isinstance(row, dict) and str(row.get("projectId") or "") == project_id:
                item = estimate_procurement_row(f"takeoff:{row.get('id') or ''}", row, project_id)
                if item:
                    rows.append(item)
        for row in material_rows:
            item = estimate_procurement_row(f"material:{row.get('id') if isinstance(row, dict) else ''}", row, project_id)
            if item:
                rows.append(item)
        return rows
    for row in draft.get("rows") if isinstance(draft.get("rows"), list) else []:
        item = estimate_procurement_row(row.get("id") if isinstance(row, dict) else "", row, project_id)
        if item:
            rows.append(item)
    return rows


def parse_pdf_upload(body: dict, max_bytes: int = MAX_PDF_UPLOAD_BYTES) -> tuple[str, str, bytes]:
    file_name = clean_file_name(body.get("fileName") or "plan.pdf")
    plan_type = str(body.get("planType") or "Other").strip() or "Other"
    data = str(body.get("data") or "").strip()
    if "," in data[:80]:
        data = data.split(",", 1)[1]
    try:
        pdf = base64.b64decode(data, validate=True)
    except Exception as exc:
        raise ApiError("The PDF upload could not be decoded.", 400) from exc
    if not pdf.startswith(b"%PDF"):
        raise ApiError("The uploaded file does not look like a PDF.", 400)
    if len(pdf) > max_bytes:
        raise ApiError(f"Use a PDF below {max_bytes // 1024 // 1024} MB.", 413)
    return file_name, plan_type, pdf


def decode_pdf_stream(buffer: bytes, dictionary: str) -> bytes | None:
    decoded = buffer.strip(b"\r\n")
    if "/ASCIIHexDecode" in dictionary:
        hex_text = re.sub(rb"[^0-9a-fA-F]", b"", decoded)
        if len(hex_text) % 2:
            hex_text += b"0"
        try:
            decoded = bytes.fromhex(hex_text.decode("ascii"))
        except Exception:
            return None
    if "/FlateDecode" in dictionary:
        try:
            decoded = zlib.decompress(decoded)
        except Exception:
            try:
                decoded = zlib.decompress(decoded, -15)
            except Exception:
                return None
    if any(marker in dictionary for marker in ["/DCTDecode", "/JPXDecode", "/CCITTFaxDecode"]):
        return None
    return decoded


def decode_pdf_literal(value: str) -> str:
    inner = value[1:-1]
    result: list[str] = []
    index = 0
    while index < len(inner):
        char = inner[index]
        if char != "\\":
            result.append(char)
            index += 1
            continue
        index += 1
        if index >= len(inner):
            break
        escaped = inner[index]
        mapping = {"n": "\n", "r": "\r", "t": "\t", "b": "\b", "f": "\f", "(": "(", ")": ")", "\\": "\\"}
        if escaped in mapping:
            result.append(mapping[escaped])
        elif escaped in "\n\r":
            pass
        elif escaped.isdigit():
            octal = escaped
            for _ in range(2):
                if index + 1 < len(inner) and inner[index + 1].isdigit():
                    index += 1
                    octal += inner[index]
            try:
                result.append(chr(int(octal, 8)))
            except Exception:
                pass
        else:
            result.append(escaped)
        index += 1
    return "".join(result)


def decode_pdf_hex(value: str) -> str:
    hex_text = re.sub(r"\s+", "", value)
    if len(hex_text) % 2:
        hex_text += "0"
    try:
        raw = bytes.fromhex(hex_text)
    except Exception:
        return ""
    for encoding in ("utf-16-be", "latin1"):
        try:
            text = raw.decode(encoding).replace("\x00", "")
            if text.strip():
                return text
        except Exception:
            continue
    return ""


def extract_text_from_pdf_content(content: str) -> str:
    sections = re.findall(r"BT[\s\S]*?ET", content) or [content]
    parts: list[str] = []
    for section in sections:
        for literal in re.findall(r"\((?:\\.|[^\\()])*\)", section):
            decoded = decode_pdf_literal(literal)
            if decoded.strip():
                parts.append(decoded)
        for hex_value in re.findall(r"<([0-9a-fA-F\s]{4,})>", section):
            decoded = decode_pdf_hex(hex_value)
            if decoded.strip():
                parts.append(decoded)
    return "\n".join(parts)


def clean_extracted_text(value: str) -> str:
    text = value.replace("\r", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    lines = [line.strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line)


def extract_readable_pdf_text(pdf: bytes) -> dict:
    raw_bytes = pdf
    raw = raw_bytes.decode("latin1", errors="ignore")
    page_count = len(re.findall(r"/Type\s*/Page\b", raw)) or 1
    layer_names: list[str] = []
    for name_match in re.findall(r"/Name\s*(\((?:\\.|[^\\()])*\))", raw):
        name = decode_pdf_literal(name_match).strip()
        if name and not name.isdigit() and name not in layer_names and not re.match(r"^(Adobe|UCS|Normal)$", name, re.I):
            layer_names.append(name)
    chunks: list[str] = []
    pattern = re.compile(rb"(\d+)\s+\d+\s+obj\s*([\s\S]*?)\s+stream\r?\n?([\s\S]*?)\r?\n?endstream")
    for match in pattern.finditer(raw_bytes):
        dictionary = match.group(2).decode("latin1", errors="ignore")
        decoded = decode_pdf_stream(match.group(3), dictionary)
        if not decoded:
            continue
        text = extract_text_from_pdf_content(decoded.decode("latin1", errors="ignore"))
        if text:
            chunks.append(text)
    if not chunks:
        text = extract_text_from_pdf_content(raw)
        if text:
            chunks.append(text)
    if layer_names:
        chunks.append(f"Detected PDF layers: {', '.join(layer_names)}")
    text = clean_extracted_text("\n".join(chunks))
    return {
        "pageCount": page_count,
        "layerNames": layer_names,
        "text": text,
        "lineCount": len([line for line in text.splitlines() if line.strip()]),
    }


def detect_materials_from_text(text: str, plan_type: str) -> list[dict]:
    haystack = f"\n{text.lower()}\n"
    include_all = plan_type == "Other"
    materials: list[dict] = []
    for material in MATERIAL_TAKEOFF_TERMS:
        if not include_all and plan_type not in material["planTypes"] and material["category"] != "General":
            continue
        hits: list[str] = []
        samples: list[str] = []
        for term in material["terms"]:
            pattern = re.compile(rf"(?<![A-Za-z0-9]){re.escape(term.lower())}(?![A-Za-z0-9])")
            matches = list(pattern.finditer(haystack))
            if not matches:
                continue
            hits.append(term)
            for match in matches[:2]:
                start = max(0, match.start() - 90)
                end = min(len(haystack), match.end() + 90)
                sample = clean_extracted_text(haystack[start:end])
                if sample and sample not in samples:
                    samples.append(sample[:220])
        if hits:
            confidence = "high" if len(hits) >= 2 else "medium"
            materials.append(
                {
                    "description": material["description"],
                    "category": material["category"],
                    "quantity": None,
                    "unit": "",
                    "mentions": len(hits),
                    "confidence": confidence,
                    "source": "Readable PDF",
                    "notes": f"Matched {', '.join(hits[:8])}",
                    "matchedTerms": hits[:12],
                    "sampleLines": samples[:3],
                }
            )
    return materials[:120]


class OverseeLocalHandler(BaseHTTPRequestHandler):
    server_version = "OverseeLocal/1.0"

    def log_message(self, fmt: str, *args: object) -> None:
        sys.stderr.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), fmt % args))

    @property
    def db_path(self) -> Path:
        return self.server.db_path  # type: ignore[attr-defined]

    @property
    def data_dir(self) -> Path:
        return self.server.data_dir  # type: ignore[attr-defined]

    def do_OPTIONS(self) -> None:
        self.send_response(HTTPStatus.NO_CONTENT)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/"):
            self.handle_api("GET", parsed.path)
            return
        self.serve_static(parsed.path)

    def do_POST(self) -> None:
        parsed = urlparse(self.path)
        if not parsed.path.startswith("/api/"):
            self.json_response({"ok": False, "error": "Not found"}, 404)
            return
        self.handle_api("POST", parsed.path)

    def send_cors_headers(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def json_response(self, payload: object, status: int = 200) -> None:
        body = json_dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def binary_response(self, body: bytes, content_type: str = "application/octet-stream", status: int = 200) -> None:
        self.send_response(status)
        self.send_cors_headers()
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_json_body(self, max_bytes: int = MAX_JSON_BODY_BYTES) -> dict:
        length = int(self.headers.get("Content-Length") or "0")
        if length > max_bytes:
            raise ApiError("Request body is too large.", 413)
        raw = self.rfile.read(length) if length else b""
        if not raw:
            return {}
        try:
            body = json.loads(raw.decode("utf-8"))
        except Exception as exc:
            raise ApiError("Invalid JSON body", 400) from exc
        if not isinstance(body, dict):
            raise ApiError("Invalid JSON body", 400)
        return body

    def open_db(self) -> sqlite3.Connection:
        return connect_db(self.db_path)

    def bearer_token(self) -> str:
        header = self.headers.get("Authorization") or ""
        match = re.match(r"^Bearer\s+(.+)$", header, re.I)
        return match.group(1).strip() if match else ""

    def authenticated_account(self, db: sqlite3.Connection) -> dict | None:
        token = self.bearer_token()
        if not token:
            return None
        now = utcnow()
        session = db.execute("SELECT account_id, expires_at FROM sessions WHERE token = ?", (token,)).fetchone()
        if not session:
            return None
        if session["expires_at"] <= now:
            db.execute("DELETE FROM sessions WHERE token = ?", (token,))
            db.commit()
            return None
        return query_account(db, "id", session["account_id"])

    def require_account(self, db: sqlite3.Connection) -> dict:
        account = self.authenticated_account(db)
        if not account:
            raise ApiError("Sign in is required.", 401)
        return account

    def require_owner(self, db: sqlite3.Connection) -> dict:
        account = self.require_account(db)
        if account.get("role") != "owner":
            raise ApiError("Owner access is required.", 403)
        return account

    def handle_api(self, method: str, path: str) -> None:
        try:
            if method == "GET" and path == "/api/health":
                return self.health()
            if method == "POST" and path == "/api/auth/signup":
                return self.signup()
            if method == "POST" and path == "/api/auth/signup/request-otp":
                return self.signup_request_otp()
            if method == "POST" and path == "/api/auth/signup/verify":
                return self.signup_verify_passthrough()
            if method == "POST" and path == "/api/auth/login":
                return self.login()
            if method == "POST" and path == "/api/auth/logout":
                return self.logout()
            if method == "GET" and path == "/api/accounts":
                return self.list_accounts()
            if method == "POST" and path == "/api/accounts/access":
                return self.update_account_access()
            if method == "POST" and path == "/api/invites/create":
                return self.create_invite()
            if method == "POST" and path == "/api/app-data/load":
                return self.load_app_data()
            if method == "POST" and path == "/api/app-data/save":
                return self.save_app_data()
            if method == "POST" and path == "/api/swa/submit-accounting":
                return self.submit_swa_to_accounting()
            if method == "POST" and path == "/api/estimate/submit-procurement":
                return self.submit_estimate_to_procurement()
            if method == "POST" and path == "/api/estimate-v2/extract-pdf":
                return self.extract_estimate_v2_pdf()
            if method == "POST" and path == "/api/estimate-v2/extract-ai":
                return self.extract_estimate_v2_ai()
            if method == "POST" and path == "/api/estimate-v2/plan/upload":
                return self.upload_estimate_v2_plan()
            if method == "POST" and path == "/api/estimate-v2/plan/download":
                return self.download_estimate_v2_plan()
            self.json_response({"ok": False, "error": "Not found"}, 404)
        except ApiError as exc:
            self.json_response({"ok": False, "error": str(exc)}, exc.status)
        except Exception as exc:
            print(f"Server error: {exc}", file=sys.stderr)
            self.json_response({"ok": False, "error": "Server error"}, 500)

    def serve_static(self, raw_path: str) -> None:
        path = unquote(raw_path or "/")
        if path == "/":
            path = "/index.html"
        file_path = (ROOT_DIR / path.lstrip("/")).resolve()
        if ROOT_DIR not in file_path.parents and file_path != ROOT_DIR:
            self.send_error(404)
            return
        if not file_path.is_file() or "local_data" in file_path.parts or file_path.suffix in {".db", ".env", ".py"}:
            self.send_error(404)
            return
        allowed = {".html", ".css", ".js", ".png", ".jpg", ".jpeg", ".svg", ".ico", ".json"}
        if file_path.suffix.lower() not in allowed:
            self.send_error(404)
            return
        body = file_path.read_bytes()
        content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
        if file_path.suffix.lower() in {".html", ".css", ".js", ".json"}:
            content_type += "; charset=utf-8"
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def health(self) -> None:
        self.json_response(
            {
                "ok": True,
                "service": "oversee-local-python",
                "storage": "sqlite",
                "database": str(self.db_path),
                "planStorage": str(self.data_dir / "estimate_plans"),
            }
        )

    def signup_request_otp(self) -> None:
        self.json_response(
            {
                "ok": True,
                "message": "Local SQLite mode does not require email OTP. Use Create Account to continue.",
                "delivery": {"mode": "local-no-otp"},
            }
        )

    def signup_verify_passthrough(self) -> None:
        raise ApiError("Local SQLite mode does not require OTP verification. Use Create Account instead.", 400)

    def signup(self) -> None:
        body = self.read_json_body()
        email = normalize_email(body.get("email"))
        name = str(body.get("name") or "").strip()
        password = str(body.get("password") or "")
        confirm = str(body.get("confirmPassword") or "")
        invite_token = str(body.get("inviteToken") or "").strip()
        if not name:
            raise ApiError("Full name is required.", 400)
        if len(name) > 120:
            raise ApiError("Full name must be 120 characters or fewer.", 400)
        if not validate_email(email):
            raise ApiError("A valid email is required.", 400)
        if len(password) < 8:
            raise ApiError("Password must be at least 8 characters.", 400)
        if len(password) > 128:
            raise ApiError("Password must be 128 characters or fewer.", 400)
        if confirm != password:
            raise ApiError("Passwords do not match.", 400)

        with self.open_db() as db:
            if query_account(db, "email", email):
                raise ApiError("An account already exists with that email.", 409)
            invite = None
            if invite_token:
                invite = db.execute("SELECT * FROM invites WHERE token = ?", (invite_token,)).fetchone()
                if not invite:
                    raise ApiError("Invitation link is invalid.", 404)
                if invite["accepted_by"]:
                    raise ApiError("Invitation link has already been used.", 409)
                if invite["expires_at"] <= utcnow():
                    raise ApiError("Invitation link has expired. Ask the owner for a new invitation.", 410)
                if invite["email"] and normalize_email(invite["email"]) != email:
                    raise ApiError("This invitation was sent to a different email address.", 403)
            password_hash, password_salt = hash_password(password)
            now = utcnow()
            account_id = random_id("acct")
            is_invited = invite is not None
            access = member_access(json_loads(invite["access_json"], {}) if invite else None) if is_invited else all_access()
            role = "member" if is_invited else "owner"
            plan = "free" if is_invited else "trial"
            db.execute(
                """
                INSERT INTO accounts (
                    id, email, name, password_hash, password_salt, gmail_linked, role,
                    access_json, plan, invited_by, created_at, email_verified_at, last_login_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    account_id,
                    email,
                    name,
                    password_hash,
                    password_salt,
                    1 if body.get("gmailLinked") else 0,
                    role,
                    json_dumps(access),
                    plan,
                    invite["created_by"] if invite else None,
                    now,
                    now,
                    now,
                ),
            )
            if invite:
                db.execute("UPDATE invites SET accepted_by = ?, accepted_at = ? WHERE token = ?", (account_id, now, invite_token))
            account = query_account(db, "id", account_id)
            session = create_session(db, account_id)
            audit(db, "local_account_created", {"accountId": account_id, "email": email, "role": role})
            db.commit()
        self.json_response({"ok": True, "message": "Account created.", "account": public_account(account), "session": session}, 201)

    def login(self) -> None:
        body = self.read_json_body()
        email = normalize_email(body.get("email"))
        password = str(body.get("password") or "")
        if not validate_email(email) or not password:
            raise ApiError("Email or password is incorrect.", 401)
        with self.open_db() as db:
            account = query_account(db, "email", email)
            if not account or not verify_password(password, account["passwordHash"], account["passwordSalt"]):
                audit(db, "local_login_failed", {"email": email})
                db.commit()
                raise ApiError("Email or password is incorrect.", 401)
            now = utcnow()
            db.execute("UPDATE accounts SET last_login_at = ? WHERE id = ?", (now, account["id"]))
            session = create_session(db, account["id"])
            audit(db, "local_login_succeeded", {"accountId": account["id"], "email": email})
            db.commit()
            account = query_account(db, "id", account["id"])
        self.json_response({"ok": True, "account": public_account(account), "session": session})

    def logout(self) -> None:
        token = self.bearer_token()
        if token:
            with self.open_db() as db:
                db.execute("DELETE FROM sessions WHERE token = ?", (token,))
                audit(db, "local_logout", {})
                db.commit()
        self.json_response({"ok": True})

    def list_accounts(self) -> None:
        with self.open_db() as db:
            owner = self.require_owner(db)
            rows = db.execute(
                "SELECT * FROM accounts WHERE id = ? OR invited_by = ? ORDER BY created_at",
                (owner["id"], owner["id"]),
            ).fetchall()
            invites = [
                {
                    "token": row["token"],
                    "email": row["email"],
                    "access": json_loads(row["access_json"], no_access()),
                    "createdBy": row["created_by"],
                    "createdAt": row["created_at"],
                    "expiresAt": row["expires_at"],
                    "acceptedBy": row["accepted_by"],
                }
                for row in db.execute("SELECT * FROM invites WHERE created_by = ? ORDER BY created_at DESC", (owner["id"],)).fetchall()
            ]
        self.json_response({"ok": True, "accounts": [public_account(account_from_row(row)) for row in rows], "invites": invites})

    def update_account_access(self) -> None:
        body = self.read_json_body()
        account_id = str(body.get("accountId") or "").strip()
        with self.open_db() as db:
            owner = self.require_owner(db)
            account = query_account(db, "id", account_id)
            if not account or account.get("invitedBy") != owner["id"] or account.get("role") == "owner":
                raise ApiError("Invited account was not found.", 404)
            access = member_access(body.get("access"))
            db.execute("UPDATE accounts SET access_json = ? WHERE id = ?", (json_dumps(access), account_id))
            audit(db, "local_account_access_updated", {"ownerId": owner["id"], "accountId": account_id, "access": access})
            db.commit()
            account = query_account(db, "id", account_id)
        self.json_response({"ok": True, "account": public_account(account)})

    def create_invite(self) -> None:
        body = self.read_json_body()
        email = normalize_email(body.get("email"))
        if email and not validate_email(email):
            raise ApiError("A valid invite email is required.", 400)
        with self.open_db() as db:
            owner = self.require_owner(db)
            if email and query_account(db, "email", email):
                raise ApiError("An account already exists with that email.", 409)
            now = utcnow()
            expires_at = (datetime.now(timezone.utc) + timedelta(days=INVITE_TTL_DAYS)).isoformat(timespec="milliseconds").replace("+00:00", "Z")
            invite = {
                "token": random_id("invite"),
                "email": email,
                "access": member_access(body.get("access")),
                "createdBy": owner["id"],
                "createdAt": now,
                "expiresAt": expires_at,
                "acceptedBy": None,
            }
            db.execute(
                "INSERT INTO invites (token, email, access_json, created_by, created_at, expires_at, accepted_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (invite["token"], email, json_dumps(invite["access"]), owner["id"], now, expires_at, None),
            )
            audit(db, "local_invite_created", {"ownerId": owner["id"], "email": email, "access": invite["access"]})
            db.commit()
        self.json_response({"ok": True, "invite": invite}, 201)

    def load_app_data(self) -> None:
        with self.open_db() as db:
            account = self.require_account(db)
            workspace = workspace_account_for(db, account)
            record = read_app_data_record(db, workspace["id"])
        self.json_response(
            {
                "ok": True,
                "empty": record is None,
                "data": filter_app_data(record["data"], account) if record else {},
                "updatedAt": record["updatedAt"] if record else None,
                "account": public_account(account),
                "workspaceAccountId": workspace["id"],
            }
        )

    def save_app_data(self) -> None:
        body = self.read_json_body(MAX_APP_DATA_BODY_BYTES)
        with self.open_db() as db:
            account = self.require_account(db)
            workspace = workspace_account_for(db, account)
            record = read_app_data_record(db, workspace["id"])
            data = merge_app_data(record["data"] if record else {}, body.get("data") if isinstance(body.get("data"), dict) else {}, account)
            updated_at = utcnow()
            write_app_data_record(db, workspace, account, data, updated_at)
            audit(db, "local_app_data_saved", {"accountId": account["id"], "workspaceAccountId": workspace["id"], "keys": app_data_write_keys(account)})
            db.commit()
        self.json_response({"ok": True, "updatedAt": updated_at, "account": public_account(account), "workspaceAccountId": workspace["id"]})

    def submit_swa_to_accounting(self) -> None:
        body = self.read_json_body()
        sheet_id = str(body.get("sheetId") or "").strip()
        if not sheet_id:
            raise ApiError("A valid saved SWA sheet is required.", 400)
        with self.open_db() as db:
            account = self.require_account(db)
            if not has_engineering_access(account):
                raise ApiError("Engineering access is required to submit an SWA.", 403)
            workspace = workspace_account_for(db, account)
            record = read_app_data_record(db, workspace["id"])
            data = normalize_app_data(record["data"] if record else {})
            swa = data.get("swa") if isinstance(data.get("swa"), dict) else {}
            sheets = swa.get("sheets") if isinstance(swa.get("sheets"), list) else []
            sheet = next((item for item in sheets if isinstance(item, dict) and item.get("id") == sheet_id), None)
            if not sheet:
                raise ApiError("Save and sync the SWA before submitting it to Accounting.", 404)
            amount = server_swa_sheet_this_period_total(sheet)
            if amount <= 0:
                raise ApiError("This SWA has no payment-period amount to submit.", 400)
            accounting = data.get("accounting") if isinstance(data.get("accounting"), dict) else {}
            billings = list(accounting.get("billings") if isinstance(accounting.get("billings"), list) else [])
            existing = next((item for item in billings if isinstance(item, dict) and item.get("sourceType") == "swa" and item.get("sourceSwaSheetId") == sheet_id), None)
            if existing and existing.get("status") in {"Approved", "Paid"}:
                raise ApiError(f"This billing is already {str(existing.get('status')).lower()} in Accounting and cannot be resubmitted.", 409)
            submitted_at = utcnow()
            billing = {
                **(existing or {}),
                "id": existing.get("id") if existing else random_id("billing"),
                "billingNumber": str(sheet.get("name") or "Progress Billing")[:180],
                "projectId": str(sheet.get("projectId") or "")[:180],
                "description": f"Statement of Work Accomplished - {str(sheet.get('name') or 'Progress Billing')}"[:300],
                "amount": amount,
                "dueDate": existing.get("dueDate") if existing else "",
                "status": "Submitted",
                "notes": existing.get("notes") if existing else "Submitted directly from the SWA Chart.",
                "sourceType": "swa",
                "sourceSwaSheetId": sheet_id,
                "sourceSwaProjectId": str(sheet.get("projectId") or "")[:180],
                "submittedAt": submitted_at,
                "submittedById": account["id"],
                "submittedByName": account.get("name") or "",
                "submittedByEmail": account.get("email") or "",
                **submitted_by_fields(existing or {}, account),
                "updatedById": account["id"],
                "updatedByName": account.get("name") or "",
                "updatedByEmail": account.get("email") or "",
                "updatedAt": submitted_at,
            }
            if existing:
                billings = [billing if item.get("id") == existing.get("id") else item for item in billings]
                action = "updated"
            else:
                billings.append(billing)
                action = "created"
            next_accounting = {**accounting, "billings": billings, "expenses": accounting.get("expenses") if isinstance(accounting.get("expenses"), list) else [], "updatedAt": submitted_at}
            next_swa = {**swa, "sheets": [{**item, "accountingBillingId": billing["id"], "accountingStatus": billing["status"], "submittedToAccountingAt": submitted_at, "submittedToAccountingByName": account.get("name") or "", "submittedToAccountingByEmail": account.get("email") or ""} if isinstance(item, dict) and item.get("id") == sheet_id else item for item in sheets]}
            next_data = {**data, "swa": next_swa, "accounting": next_accounting, "savedAt": submitted_at}
            write_app_data_record(db, workspace, account, next_data, submitted_at)
            audit(db, "local_swa_submitted_to_accounting", {"accountId": account["id"], "sheetId": sheet_id, "billingId": billing["id"]})
            db.commit()
        self.json_response(
            {
                "ok": True,
                "action": action,
                "accounting": next_accounting if "accounting" in app_data_read_keys(account) else None,
                "submission": {
                    "billingId": billing["id"],
                    "status": billing["status"],
                    "submittedAt": submitted_at,
                    "submittedByName": account.get("name") or "",
                    "submittedByEmail": account.get("email") or "",
                },
            }
        )

    def submit_estimate_to_procurement(self) -> None:
        body = self.read_json_body()
        version = "v2" if body.get("version") == "v2" else "v1" if body.get("version") == "v1" else ""
        submission_id = str(body.get("submissionId") or "").strip()
        if not version or not submission_id:
            raise ApiError("A valid Estimate v1 or v2 submission is required.", 400)
        with self.open_db() as db:
            account = self.require_account(db)
            if not has_engineering_access(account):
                raise ApiError("Engineering access is required to submit an estimate.", 403)
            workspace = workspace_account_for(db, account)
            record = read_app_data_record(db, workspace["id"])
            data = normalize_app_data(record["data"] if record else {})
            draft_key = "estimateV2Draft" if version == "v2" else "estimateDraft"
            draft = data.get(draft_key) if isinstance(data.get(draft_key), dict) else {}
            if str(draft.get("submissionId") or "") != submission_id:
                raise ApiError("Save and sync the estimate before submitting it to Procurement.", 404)
            rows = server_estimate_procurement_rows(version, draft)
            if not rows:
                raise ApiError("Add at least one material with a quantity before submitting to Procurement.", 400)
            procurement = data.get("procurement") if isinstance(data.get("procurement"), dict) else {}
            requests = list(procurement.get("requests") if isinstance(procurement.get("requests"), list) else [])
            submitted_at = utcnow()
            created_count = updated_count = locked_count = 0
            for row in rows:
                existing = next(
                    (
                        item
                        for item in requests
                        if isinstance(item, dict)
                        and item.get("sourceType") == "estimate"
                        and item.get("sourceEstimateVersion") == version
                        and item.get("sourceEstimateId") == submission_id
                        and item.get("sourceEstimateRowId") == row["id"]
                    ),
                    None,
                )
                if existing and existing.get("status") in {"Approved", "Ordered", "Received"}:
                    locked_count += 1
                    continue
                request = {
                    **(existing or {}),
                    "id": existing.get("id") if existing else random_id("request"),
                    "projectId": row["projectId"],
                    "item": row["description"],
                    "quantity": row["quantity"],
                    "unit": row["unit"],
                    "estimatedUnitCost": row["costPerUnit"],
                    "neededBy": existing.get("neededBy") if existing else "",
                    "priority": existing.get("priority") if existing else "Medium",
                    "status": "Pending",
                    "notes": existing.get("notes") if existing else f"Submitted directly from Estimate {version.upper()}.",
                    "sourceType": "estimate",
                    "sourceEstimateVersion": version,
                    "sourceEstimateId": submission_id,
                    "sourceEstimateRowId": row["id"],
                    "submittedAt": submitted_at,
                    "submittedById": account["id"],
                    "submittedByName": account.get("name") or "",
                    "submittedByEmail": account.get("email") or "",
                    **submitted_by_fields(existing or {}, account),
                    "createdAt": existing.get("createdAt") if existing else submitted_at,
                    "updatedById": account["id"],
                    "updatedByName": account.get("name") or "",
                    "updatedByEmail": account.get("email") or "",
                    "updatedAt": submitted_at,
                }
                if existing:
                    requests = [request if item.get("id") == existing.get("id") else item for item in requests]
                    updated_count += 1
                else:
                    requests.append(request)
                    created_count += 1
            next_draft = {
                **draft,
                "submittedToProcurementAt": submitted_at,
                "submittedToProcurementByName": account.get("name") or "",
                "submittedToProcurementByEmail": account.get("email") or "",
                "submittedRequestCount": len(rows),
            }
            next_procurement = {
                **procurement,
                "requests": requests,
                "orders": procurement.get("orders") if isinstance(procurement.get("orders"), list) else [],
                "suppliers": procurement.get("suppliers") if isinstance(procurement.get("suppliers"), list) else [],
                "updatedAt": submitted_at,
            }
            next_data = {**data, draft_key: next_draft, "procurement": next_procurement, "savedAt": submitted_at}
            write_app_data_record(db, workspace, account, next_data, submitted_at)
            audit(db, "local_estimate_submitted_to_procurement", {"accountId": account["id"], "version": version, "submissionId": submission_id, "requestCount": len(rows)})
            db.commit()
        self.json_response(
            {
                "ok": True,
                "procurement": next_procurement if "procurement" in app_data_read_keys(account) else None,
                "submission": {
                    "submittedAt": submitted_at,
                    "submittedByName": account.get("name") or "",
                    "submittedByEmail": account.get("email") or "",
                    "requestCount": len(rows),
                    "createdCount": created_count,
                    "updatedCount": updated_count,
                    "lockedCount": locked_count,
                },
            }
        )

    def require_engineering_plan(self, db: sqlite3.Connection) -> dict:
        account = self.require_account(db)
        if not has_engineering_access(account):
            raise ApiError("Engineering access is required.", 403)
        if not has_paid_plan(account):
            raise ApiError("Estimate v2 is available for subscribed accounts only.", 403)
        return account

    def extract_estimate_v2_pdf(self) -> None:
        body = self.read_json_body(MAX_PDF_UPLOAD_BYTES * 2)
        with self.open_db() as db:
            account = self.require_engineering_plan(db)
            file_name, plan_type, pdf = parse_pdf_upload(body)
            extracted = extract_readable_pdf_text(pdf)
            materials = detect_materials_from_text(extracted["text"], plan_type)
            audit(db, "local_estimate_v2_pdf_extracted", {"accountId": account["id"], "fileName": file_name, "planType": plan_type, "materialCount": len(materials)})
            db.commit()
        self.json_response(
            {
                "ok": True,
                "fileName": file_name,
                "planType": plan_type,
                "extractionMode": "Readable PDF",
                "extractedAt": utcnow(),
                "pageCount": extracted["pageCount"],
                "characterCount": len(extracted["text"]),
                "lineCount": extracted["lineCount"],
                "layerCount": len(extracted["layerNames"]),
                "textPreview": extracted["text"][:PDF_TEXT_PREVIEW_LIMIT],
                "materials": materials,
            }
        )

    def extract_estimate_v2_ai(self) -> None:
        self.read_json_body(MAX_PDF_UPLOAD_BYTES * 2)
        with self.open_db() as db:
            self.require_engineering_plan(db)
        self.json_response(
            {
                "ok": False,
                "error": "AI Vision is not included in the local SQLite build yet. Use Local Vision OCR or readable PDF extraction.",
            },
            503,
        )

    def upload_estimate_v2_plan(self) -> None:
        body = self.read_json_body(MAX_PDF_UPLOAD_BYTES * 2)
        with self.open_db() as db:
            account = self.require_engineering_plan(db)
            workspace = workspace_account_for(db, account)
            file_name, _plan_type, pdf = parse_pdf_upload(body, MAX_PDF_UPLOAD_BYTES)
            plan_id = random_id("plan")
            plan_dir = self.data_dir / "estimate_plans" / workspace["id"]
            plan_dir.mkdir(parents=True, exist_ok=True)
            file_path = plan_dir / f"{plan_id}.pdf"
            file_path.write_bytes(pdf)
            uploaded_at = utcnow()
            relative_path = str(file_path.relative_to(self.data_dir))
            db.execute(
                """
                INSERT INTO plan_files (
                    id, workspace_account_id, account_id, file_name, file_path, size,
                    uploaded_at, uploaded_by_email, uploaded_by_name
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    plan_id,
                    workspace["id"],
                    account["id"],
                    file_name,
                    relative_path,
                    len(pdf),
                    uploaded_at,
                    account.get("email") or "",
                    account.get("name") or "",
                ),
            )
            audit(db, "local_estimate_v2_plan_uploaded", {"accountId": account["id"], "workspaceAccountId": workspace["id"], "fileName": file_name, "path": relative_path, "size": len(pdf)})
            db.commit()
        self.json_response(
            {
                "ok": True,
                "plan": {
                    "path": relative_path,
                    "fileName": file_name,
                    "size": len(pdf),
                    "uploadedAt": uploaded_at,
                    "uploadedByName": account.get("name") or "",
                    "uploadedByEmail": account.get("email") or "",
                },
            },
            201,
        )

    def download_estimate_v2_plan(self) -> None:
        body = self.read_json_body()
        requested_path = str(body.get("path") or "").strip()
        with self.open_db() as db:
            account = self.require_engineering_plan(db)
            workspace = workspace_account_for(db, account)
            row = db.execute(
                "SELECT * FROM plan_files WHERE workspace_account_id = ? AND file_path = ?",
                (workspace["id"], requested_path),
            ).fetchone()
            if not row:
                raise ApiError("Stored PDF was not found.", 404)
            file_path = (self.data_dir / row["file_path"]).resolve()
            if self.data_dir.resolve() not in file_path.parents:
                raise ApiError("Stored PDF path is invalid.", 400)
            if not file_path.is_file():
                raise ApiError("Stored PDF file is missing from local storage.", 404)
            pdf = file_path.read_bytes()
            if not pdf.startswith(b"%PDF"):
                raise ApiError("The stored plan is not a valid PDF.", 500)
        self.binary_response(pdf, "application/pdf")


class OverseeThreadingServer(ThreadingHTTPServer):
    daemon_threads = True

    def __init__(self, server_address: tuple[str, int], handler_class: type[BaseHTTPRequestHandler], data_dir: Path):
        self.data_dir = data_dir
        self.db_path = data_dir / "oversee_local.db"
        super().__init__(server_address, handler_class)


def copy_starter_database_if_requested(data_dir: Path, starter: str | None) -> None:
    if not starter:
        return
    starter_path = Path(starter).expanduser().resolve()
    target = data_dir / "oversee_local.db"
    if not starter_path.is_file():
        raise SystemExit(f"Starter database was not found: {starter_path}")
    if target.exists():
        return
    data_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(starter_path, target)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run Oversee locally with Python and SQLite.")
    parser.add_argument("--host", default=os.environ.get("HOST", "127.0.0.1"))
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", "8010")))
    parser.add_argument("--data-dir", default=os.environ.get("OVERSEE_LOCAL_DATA_DIR", str(DEFAULT_DATA_DIR)))
    parser.add_argument("--starter-db", default=os.environ.get("OVERSEE_LOCAL_STARTER_DB"))
    args = parser.parse_args()

    data_dir = Path(args.data_dir).expanduser().resolve()
    copy_starter_database_if_requested(data_dir, args.starter_db)
    init_database(data_dir / "oversee_local.db")
    (data_dir / "estimate_plans").mkdir(parents=True, exist_ok=True)

    server = OverseeThreadingServer((args.host, args.port), OverseeLocalHandler, data_dir)
    url = f"http://{args.host}:{args.port}/"
    print("Oversee local app is running")
    print(f"Open: {url}")
    print(f"SQLite database: {server.db_path}")
    print("Press Ctrl+C to stop.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Oversee local app.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
