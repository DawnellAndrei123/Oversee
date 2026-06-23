const http = require("node:http");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const tls = require("node:tls");
const zlib = require("node:zlib");

const ROOT_DIR = __dirname;
loadDotEnv(path.join(ROOT_DIR, ".env"));

const DATA_DIR = cleanEnvValue(process.env.OVERSEE_DATA_DIR) || path.join(ROOT_DIR, "backend", "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const OUTBOX_FILE = path.join(DATA_DIR, "email-outbox.jsonl");
const PORT = Number(process.env.PORT || 8000);
const HOST = cleanEnvValue(process.env.HOST) || (process.env.RENDER || process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS || 30);
const INVITE_TTL_DAYS = Number(process.env.INVITE_TTL_DAYS || 7);
const MAX_PASSWORD_LENGTH = Number(process.env.MAX_PASSWORD_LENGTH || 128);
const MAX_NAME_LENGTH = Number(process.env.MAX_NAME_LENGTH || 120);
const MAX_EMAIL_LENGTH = 254;
const MAX_JSON_BODY_BYTES = Number(process.env.MAX_JSON_BODY_BYTES || 65536);
const MAX_APP_DATA_BODY_BYTES = Number(process.env.MAX_APP_DATA_BODY_BYTES || 2 * 1024 * 1024);
const MAX_PDF_UPLOAD_BYTES = Number(process.env.MAX_PDF_UPLOAD_BYTES || 8 * 1024 * 1024);
const MAX_PDF_JSON_BODY_BYTES = Math.ceil(MAX_PDF_UPLOAD_BYTES * 1.38) + 4096;
const MAX_PLAN_PDF_BYTES = Number(process.env.MAX_PLAN_PDF_BYTES || 12 * 1024 * 1024);
const MAX_PLAN_PDF_JSON_BODY_BYTES = Math.ceil(MAX_PLAN_PDF_BYTES * 1.38) + 4096;
const PDF_TEXT_PREVIEW_LIMIT = 12000;
const OPENAI_API_KEY = cleanEnvValue(process.env.OPENAI_API_KEY);
const OPENAI_VISION_MODEL = cleanEnvValue(process.env.OPENAI_VISION_MODEL) || "gpt-4o";
const OPENAI_API_BASE_URL = String(cleanEnvValue(process.env.OPENAI_API_BASE_URL) || "https://api.openai.com").replace(/\/+$/, "");
const SUPABASE_URL = normalizeSupabaseUrl(cleanEnvValue(process.env.SUPABASE_URL));
const SUPABASE_SERVICE_ROLE_KEY = cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
const SUPABASE_ENABLED = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
const SUPABASE_PLAN_BUCKET = cleanEnvValue(process.env.SUPABASE_PLAN_BUCKET) || "oversee-estimate-plans";
const GOOGLE_CLIENT_ID = cleanEnvValue(process.env.GOOGLE_CLIENT_ID);
const GOOGLE_CLIENT_SECRET = cleanEnvValue(process.env.GOOGLE_CLIENT_SECRET);
const GOOGLE_REDIRECT_URI = cleanEnvValue(process.env.GOOGLE_REDIRECT_URI);
const GOOGLE_TOKEN_SECRET = cleanEnvValue(process.env.GOOGLE_TOKEN_SECRET)
  || SUPABASE_SERVICE_ROLE_KEY
  || cleanEnvValue(process.env.SESSION_SECRET)
  || "oversee-local-google-token-secret";
const GOOGLE_DRIVE_FOLDER_NAME = cleanEnvValue(process.env.GOOGLE_DRIVE_FOLDER_NAME) || "Oversee Construction Data";
const GOOGLE_SHEETS_SCOPE = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/spreadsheets"
].join(" ");
const IS_PRODUCTION = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);

const ACCESS_KEYS = ["engineering", "procurement", "accounting", "administrative"];
const ASSIGNABLE_ACCESS_KEYS = ACCESS_KEYS.filter((key) => key !== "administrative");
const PLAN_TYPES = ["Architectural", "Structural", "Plumbing", "Electrical", "Mechanical", "Electronics", "Civil", "Fire Protection", "Other"];
const MATERIAL_TAKEOFF_TERMS = [
  { description: "Concrete", category: "Structural", planTypes: ["Structural", "Civil", "Architectural"], terms: ["concrete", "conc.", "ready mix", "pcc", "reinforced concrete", "r.c.", "rc concrete", "f'c", "fc=", "class a concrete", "lean concrete"] },
  { description: "Portland Cement", category: "Concrete Mix", planTypes: ["Architectural", "Structural", "Civil"], terms: ["cement", "portland cement", "type 1 cement", "cement bag"] },
  { description: "Fine Aggregate / Sand", category: "Concrete Mix", planTypes: ["Architectural", "Structural", "Civil"], terms: ["sand", "fine aggregate", "washed sand", "concrete sand"] },
  { description: "Coarse Aggregate / Gravel", category: "Concrete Mix", planTypes: ["Architectural", "Structural", "Civil"], terms: ["gravel", "aggregate", "coarse aggregate", "crushed gravel", "crushed stone", "base course", "3/4 gravel", "3/4\" gravel"] },
  { description: "Rebar / Reinforcing Bar", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["rebar", "reinforcing bar", "deformed bar", "steel bar", "r.s.b.", "rsb", "rebars", "main bar", "stirrups", "ties", "vertical bars", "horizontal bars", "db10", "db12", "db16", "db20"] },
  { description: "Foundation / Footing", category: "Structural Element", planTypes: ["Structural", "Civil"], terms: ["foundation", "footing", "footings", "foundation plan"] },
  { description: "Structural Wall", category: "Structural Element", planTypes: ["Structural", "Civil", "Architectural"], terms: ["wall", "walls", "xwall", "xwalls", "shear wall", "retaining wall"] },
  { description: "Joist", category: "Structural Element", planTypes: ["Structural", "Architectural"], terms: ["joist", "joists"] },
  { description: "Wire Mesh", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["wire mesh", "welded wire mesh", "wwm"] },
  { description: "Formworks", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["formwork", "formworks", "forms", "plyform"] },
  { description: "Tie Wire", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["tie wire", "g.i. tie wire", "binding wire"] },
  { description: "Anchor Bolt", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["anchor bolt", "anchor bolts", "expansion bolt"] },
  { description: "Concrete Spacer", category: "Structural", planTypes: ["Structural", "Civil"], terms: ["concrete spacer", "bar chair", "chair bar", "dobie"] },
  { description: "Excavation", category: "Earthworks", planTypes: ["Structural", "Civil"], terms: ["excavation", "excavate", "earthworks", "earth work"] },
  { description: "Backfill / Compacted Fill", category: "Earthworks", planTypes: ["Structural", "Civil"], terms: ["backfill", "compacted fill", "selected fill", "structural fill"] },
  { description: "Gravel Bedding / Base", category: "Earthworks", planTypes: ["Structural", "Civil"], terms: ["gravel bedding", "gravel base", "base course", "aggregate base course"] },
  { description: "Plywood", category: "Architectural", planTypes: ["Architectural", "Structural"], terms: ["plywood", "phenolic board"] },
  { description: "Concrete Hollow Block", category: "Masonry", planTypes: ["Architectural", "Structural", "Civil"], terms: ["concrete hollow block", "hollow block", "chb", "100mm chb", "150mm chb", "200mm chb", "4\" chb", "6\" chb", "8\" chb"] },
  { description: "Masonry Mortar", category: "Masonry", planTypes: ["Architectural", "Structural", "Civil"], terms: ["mortar", "masonry mortar", "cement mortar", "plaster"] },
  { description: "Tiles", category: "Architectural", planTypes: ["Architectural"], terms: ["tile", "tiles", "ceramic tile", "porcelain tile"] },
  { description: "Paint", category: "Architectural", planTypes: ["Architectural"], terms: ["paint", "primer", "skim coat", "elastomeric"] },
  { description: "Gypsum Board", category: "Architectural", planTypes: ["Architectural"], terms: ["gypsum board", "drywall", "gypsum"] },
  { description: "Metal Stud / Framing", category: "Architectural", planTypes: ["Architectural"], terms: ["metal stud", "metal framing", "furring channel"] },
  { description: "Glass", category: "Architectural", planTypes: ["Architectural"], terms: ["glass", "tempered glass", "glazing"] },
  { description: "Aluminum", category: "Architectural", planTypes: ["Architectural"], terms: ["aluminum", "aluminium"] },
  { description: "Doors", category: "Architectural", planTypes: ["Architectural"], terms: ["door", "doors", "door jamb"] },
  { description: "Windows", category: "Architectural", planTypes: ["Architectural"], terms: ["window", "windows", "window frame"] },
  { description: "Roofing", category: "Architectural", planTypes: ["Architectural"], terms: ["roofing", "roof panel", "long span", "flashing"] },
  { description: "Waterproofing", category: "Architectural", planTypes: ["Architectural", "Civil"], terms: ["waterproofing", "membrane", "sealant"] },
  { description: "PVC Pipe", category: "Plumbing", planTypes: ["Plumbing", "Fire Protection"], terms: ["pvc pipe", "pvc pipes", "polyvinyl chloride"] },
  { description: "PPR Pipe", category: "Plumbing", planTypes: ["Plumbing"], terms: ["ppr pipe", "ppr pipes"] },
  { description: "HDPE Pipe", category: "Plumbing", planTypes: ["Plumbing", "Civil"], terms: ["hdpe pipe", "hdpe pipes"] },
  { description: "GI Pipe", category: "Plumbing", planTypes: ["Plumbing", "Fire Protection"], terms: ["gi pipe", "g.i. pipe", "galvanized iron pipe"] },
  { description: "Valves", category: "Plumbing", planTypes: ["Plumbing", "Mechanical", "Fire Protection"], terms: ["valve", "valves", "gate valve", "ball valve", "check valve"] },
  { description: "Floor Drain", category: "Plumbing", planTypes: ["Plumbing"], terms: ["floor drain", "fd"] },
  { description: "Water Closet", category: "Plumbing", planTypes: ["Plumbing", "Architectural"], terms: ["water closet", "toilet", "wc"] },
  { description: "Lavatory", category: "Plumbing", planTypes: ["Plumbing", "Architectural"], terms: ["lavatory", "lav.", "wash basin"] },
  { description: "Faucet", category: "Plumbing", planTypes: ["Plumbing", "Architectural"], terms: ["faucet", "tap"] },
  { description: "Conduit", category: "Electrical", planTypes: ["Electrical", "Electronics"], terms: ["conduit", "emt", "imc", "pvc conduit", "rigid conduit"] },
  { description: "Wires / Cables", category: "Electrical", planTypes: ["Electrical", "Electronics"], terms: ["wire", "wires", "cable", "cables", "thhn", "thwn"] },
  { description: "Panel Board", category: "Electrical", planTypes: ["Electrical"], terms: ["panel board", "panelboard", "distribution panel", "load center"] },
  { description: "Circuit Breaker", category: "Electrical", planTypes: ["Electrical"], terms: ["breaker", "circuit breaker", "mccb", "mcb"] },
  { description: "Outlet", category: "Electrical", planTypes: ["Electrical"], terms: ["outlet", "receptacle", "convenience outlet"] },
  { description: "Switch", category: "Electrical", planTypes: ["Electrical"], terms: ["switch", "switches", "light switch"] },
  { description: "Lighting Fixture", category: "Electrical", planTypes: ["Electrical"], terms: ["lighting fixture", "light fixture", "luminaire", "downlight"] },
  { description: "Junction Box", category: "Electrical", planTypes: ["Electrical", "Electronics"], terms: ["junction box", "pull box", "utility box"] },
  { description: "Duct", category: "Mechanical", planTypes: ["Mechanical"], terms: ["duct", "ducting", "air duct"] },
  { description: "Diffuser / Grille", category: "Mechanical", planTypes: ["Mechanical"], terms: ["diffuser", "grille", "return air grille", "supply air diffuser"] },
  { description: "Damper", category: "Mechanical", planTypes: ["Mechanical"], terms: ["damper", "fire damper", "volume damper"] },
  { description: "Insulation", category: "Mechanical", planTypes: ["Mechanical", "Architectural"], terms: ["insulation", "thermal insulation", "acoustic insulation"] },
  { description: "Exhaust Fan", category: "Mechanical", planTypes: ["Mechanical", "Electrical"], terms: ["exhaust fan", "ventilating fan"] },
  { description: "Copper Tube", category: "Mechanical", planTypes: ["Mechanical"], terms: ["copper tube", "copper pipe", "refrigerant pipe"] },
  { description: "Air Conditioning Unit", category: "Mechanical", planTypes: ["Mechanical"], terms: ["aircon", "air conditioning", "ahu", "fcu", "split type"] },
  { description: "CAT6 Cable", category: "Electronics", planTypes: ["Electronics"], terms: ["cat6", "cat 6", "utp cable", "data cable"] },
  { description: "Data Outlet", category: "Electronics", planTypes: ["Electronics"], terms: ["data outlet", "information outlet", "io outlet"] },
  { description: "CCTV Camera", category: "Electronics", planTypes: ["Electronics"], terms: ["cctv", "camera", "ip camera"] },
  { description: "Smoke Detector", category: "Electronics", planTypes: ["Electronics", "Fire Protection"], terms: ["smoke detector", "detector", "heat detector"] },
  { description: "Speaker", category: "Electronics", planTypes: ["Electronics"], terms: ["speaker", "pa speaker"] },
  { description: "Access Point", category: "Electronics", planTypes: ["Electronics"], terms: ["access point", "wireless access point", "wap"] },
  { description: "Cable Tray", category: "Electrical", planTypes: ["Electrical", "Electronics"], terms: ["cable tray", "ladder tray"] },
  { description: "Fire Sprinkler", category: "Fire Protection", planTypes: ["Fire Protection"], terms: ["sprinkler", "sprinkler head", "fire sprinkler"] },
  { description: "Fire Hose Cabinet", category: "Fire Protection", planTypes: ["Fire Protection"], terms: ["fire hose cabinet", "fhc"] }
];
const PUBLIC_ACCOUNT_FIELDS = [
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
  "lastLoginAt"
];

const APP_DATA_KEYS = [
  "projects",
  "swa",
  "estimateDraft",
  "estimateV2Draft",
  "estimateTemplates",
  "materialPrices",
  "procurement",
  "accounting",
  "subscription"
];
const ENGINEERING_APP_DATA_KEYS = ["projects", "swa", "estimateDraft", "estimateV2Draft", "estimateTemplates", "materialPrices"];
const PROCUREMENT_APP_DATA_KEYS = ["projects", "materialPrices", "procurement"];
const ACCOUNTING_APP_DATA_KEYS = ["projects", "swa", "accounting"];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon"
};

const PUBLIC_STATIC_FILES = new Set([
  "/index.html",
  "/app.js",
  "/styles.css",
  "/oversee-updates.js",
  "/oversee-updates.css",
  "/favicon.ico"
]);

const rateLimitBuckets = new Map();
const appDataSaveLocks = new Map();
const signupLocks = new Map();
const googleOAuthStates = new Map();
const MAX_RATE_LIMIT_BUCKETS = 5000;

const SUPABASE_COLLECTIONS = [
  {
    storeKey: "accounts",
    table: "oversee_accounts",
    keyColumn: "id",
    recordKey: "id",
    columns: (account) => ({
      email: account.email || null,
      created_at: account.createdAt || new Date().toISOString(),
      updated_at: account.lastLoginAt || account.emailVerifiedAt || account.createdAt || new Date().toISOString()
    })
  },
  {
    storeKey: "pendingSignups",
    table: "oversee_pending_signups",
    keyColumn: "email",
    recordKey: "email",
    columns: (pending) => ({
      expires_at: pending.otpExpiresAt || null,
      created_at: pending.createdAt || new Date().toISOString()
    })
  },
  {
    storeKey: "sessions",
    table: "oversee_sessions",
    keyColumn: "token",
    recordKey: "token",
    columns: (session) => ({
      account_id: session.accountId || null,
      expires_at: session.expiresAt || null,
      created_at: session.createdAt || new Date().toISOString()
    })
  },
  {
    storeKey: "invites",
    table: "oversee_invites",
    keyColumn: "token",
    recordKey: "token",
    columns: (invite) => ({
      email: invite.email || null,
      created_by: invite.createdBy || null,
      accepted_by: invite.acceptedBy || null,
      created_at: invite.createdAt || new Date().toISOString()
    })
  },
  {
    storeKey: "auditLog",
    table: "oversee_audit_log",
    keyColumn: "id",
    recordKey: "id",
    columns: (event) => ({
      action: event.action || null,
      at: event.at || new Date().toISOString()
    })
  }
];

function loadDotEnv(filePath) {
  if (!fsSync.existsSync(filePath)) return;
  const lines = fsSync.readFileSync(filePath, "utf8").split(/\r?\n/);
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const separator = trimmed.indexOf("=");
    if (separator === -1) return;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  });
}

function cleanEnvValue(value) {
  let cleaned = String(value || "").trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

function normalizeSupabaseUrl(value) {
  return String(value || "")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/rest\/v1$/i, "");
}

function emptyStore() {
  return {
    accounts: [],
    pendingSignups: [],
    sessions: [],
    invites: [],
    auditLog: [],
    appData: [],
    createdAt: new Date().toISOString()
  };
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readStore() {
  if (SUPABASE_ENABLED) return readSupabaseStore();

  await ensureDataDir();
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    return { ...emptyStore(), ...JSON.parse(raw) };
  } catch (error) {
    if (error.code === "ENOENT") return emptyStore();
    throw error;
  }
}

async function writeStore(store) {
  if (SUPABASE_ENABLED) return writeSupabaseStore(store);

  await ensureDataDir();
  const tempFile = `${STORE_FILE}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(store, null, 2));
  await fs.rename(tempFile, STORE_FILE);
}

async function supabaseRequest(table, { method = "GET", query = "", body, prefer } = {}) {
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
  };

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (prefer) headers.Prefer = prefer;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}${query}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase ${method} ${table} failed: ${detail}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function supabaseStorageRequest(endpoint, { method = "GET", body, contentType, headers: extraHeaders = {} } = {}) {
  if (!SUPABASE_ENABLED) throw httpError("Supabase Storage is not configured.", 503);
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    ...extraHeaders
  };
  if (contentType) headers["Content-Type"] = contentType;

  const response = await fetch(`${SUPABASE_URL}/storage/v1/${endpoint}`, {
    method,
    headers,
    body
  });
  if (!response.ok) {
    const detail = await response.text();
    const error = new Error(`Supabase Storage ${method} failed: ${detail}`);
    error.statusCode = response.status;
    throw error;
  }
  return response;
}

async function ensureSupabasePlanBucket() {
  try {
    await supabaseStorageRequest(`bucket/${encodeURIComponent(SUPABASE_PLAN_BUCKET)}`);
  } catch (error) {
    const message = String(error && error.message || "");
    const missingBucket = Number(error && error.statusCode) === 404
      || (Number(error && error.statusCode) === 400 && /not found|does not exist|unknown/i.test(message));
    if (!missingBucket) throw error;
    await supabaseStorageRequest("bucket", {
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify({
        id: SUPABASE_PLAN_BUCKET,
        name: SUPABASE_PLAN_BUCKET,
        public: false,
        file_size_limit: MAX_PLAN_PDF_BYTES,
        allowed_mime_types: ["application/pdf"]
      })
    });
  }
}

function storageObjectEndpoint(objectPath) {
  const safePath = String(objectPath || "")
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `object/${encodeURIComponent(SUPABASE_PLAN_BUCKET)}/${safePath}`;
}

function assertWorkspacePlanPath(objectPath, workspaceAccount) {
  const value = String(objectPath || "").trim();
  const workspacePrefix = `${workspaceAccount && workspaceAccount.id || ""}/`;
  if (!value || !workspacePrefix || !value.startsWith(workspacePrefix) || value.includes("..")) {
    throw httpError("The stored PDF does not belong to this workspace.", 403);
  }
  return value;
}

async function readSupabaseStore() {
  const store = emptyStore();
  const collections = await Promise.all(
    SUPABASE_COLLECTIONS.map(async (collection) => {
      const rows = await supabaseRequest(collection.table, { query: "?select=data" });
      const records = (rows || [])
        .map((row) => row.data)
        .filter(Boolean)
        .sort((first, second) => String(first.createdAt || first.at || "").localeCompare(String(second.createdAt || second.at || "")));
      return [collection.storeKey, records];
    })
  );

  collections.forEach(([key, records]) => {
    store[key] = records;
  });

  return store;
}

async function writeSupabaseStore(store) {
  await Promise.all(
    SUPABASE_COLLECTIONS.map((collection) => {
      const records = Array.isArray(store[collection.storeKey]) ? store[collection.storeKey] : [];
      return syncSupabaseCollection(collection, records);
    })
  );
}

async function syncSupabaseCollection(collection, records) {
  const rows = records
    .filter((record) => record && record[collection.recordKey])
    .map((record) => ({
      [collection.keyColumn]: String(record[collection.recordKey]),
      data: record,
      ...collection.columns(record)
    }));

  if (rows.length) {
    await supabaseRequest(collection.table, {
      method: "POST",
      query: `?on_conflict=${collection.keyColumn}`,
      body: rows,
      prefer: "resolution=merge-duplicates,return=minimal"
    });
  }

  const existing = await supabaseRequest(collection.table, { query: `?select=${collection.keyColumn}` });
  const keepKeys = new Set(rows.map((row) => String(row[collection.keyColumn])));
  const staleRows = (existing || []).filter((row) => !keepKeys.has(String(row[collection.keyColumn])));

  await Promise.all(staleRows.map((row) => {
    const value = encodeURIComponent(String(row[collection.keyColumn]));
    return supabaseRequest(collection.table, {
      method: "DELETE",
      query: `?${collection.keyColumn}=eq.${value}`,
      prefer: "return=minimal"
    });
  }));
}

function securityHeaders() {
  const headers = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
    "Origin-Agent-Cluster": "?1",
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' https://cdn.jsdelivr.net 'wasm-unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self' https://cdn.jsdelivr.net https://tessdata.projectnaptha.com",
      "worker-src 'self' blob: https://cdn.jsdelivr.net",
      "base-uri 'none'",
      "form-action 'self'",
      "frame-ancestors 'none'"
    ].join("; ")
  };

  if (IS_PRODUCTION) {
    headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
  }

  return headers;
}

function responseHeaders(extraHeaders = {}) {
  return {
    ...securityHeaders(),
    ...extraHeaders
  };
}

function sameOriginAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return false;

  const allowedOrigins = new Set(
    String(process.env.APP_ORIGINS || process.env.APP_ORIGIN || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = req.headers["x-forwarded-proto"] || (IS_PRODUCTION ? "https" : "http");
  if (host) allowedOrigins.add(`${proto}://${host}`);
  if (!IS_PRODUCTION) {
    allowedOrigins.add(`http://${host}`);
    allowedOrigins.add("http://127.0.0.1:8000");
    allowedOrigins.add("http://127.0.0.1:8010");
    allowedOrigins.add("http://localhost:8000");
    allowedOrigins.add("http://localhost:8010");
  }

  return allowedOrigins.has(origin);
}

function corsHeaders(req) {
  if (!sameOriginAllowed(req)) return {};
  return {
    "Access-Control-Allow-Origin": req.headers.origin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Vary": "Origin"
  };
}

function shouldRedirectToHttps(req) {
  if (!IS_PRODUCTION) return false;
  const proto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const host = String(req.headers.host || "");
  if (!host || host.startsWith("localhost") || host.startsWith("127.0.0.1")) return false;
  return proto === "http";
}

function jsonResponse(reqOrRes, resOrStatus, statusOrBody, maybeBody) {
  const hasRequest = maybeBody !== undefined;
  const req = hasRequest ? reqOrRes : null;
  const res = hasRequest ? resOrStatus : reqOrRes;
  const statusCode = hasRequest ? statusOrBody : resOrStatus;
  const body = hasRequest ? maybeBody : statusOrBody;
  const payload = JSON.stringify(body);
  res.writeHead(statusCode, responseHeaders({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...(req ? corsHeaders(req) : {})
  }));
  res.end(payload);
}

function binaryResponse(req, res, statusCode, body, extraHeaders = {}) {
  res.writeHead(statusCode, responseHeaders({
    "Content-Type": "application/octet-stream",
    "Cache-Control": "no-store",
    ...corsHeaders(req),
    ...extraHeaders
  }));
  res.end(body);
}

function httpError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function publicErrorMessage(error) {
  if (!error) return "Server error";
  if (error.publicMessage) return error.publicMessage;
  return Number(error.statusCode) >= 400 && Number(error.statusCode) < 500
    ? error.message || "Request failed"
    : "Server error";
}

function notFound(req, res) {
  jsonResponse(req, res, 404, { ok: false, error: "Not found" });
}

async function readJsonBody(req, maxBytes = MAX_JSON_BODY_BYTES) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBytes) {
      const error = new Error("Request body is too large.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch (_error) {
    const error = new Error("Invalid JSON body");
    error.statusCode = 400;
    throw error;
  }
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateSignupInput({ name, email, password, confirmPassword, requireConfirmation = false }) {
  if (!name) return "Full name is required.";
  if (name.length > MAX_NAME_LENGTH) return `Full name must be ${MAX_NAME_LENGTH} characters or fewer.`;
  if (!validateEmail(email) || email.length > MAX_EMAIL_LENGTH) return "A valid email is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (password.length > MAX_PASSWORD_LENGTH) return `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.`;
  if (requireConfirmation && confirmPassword !== password) return "Passwords do not match.";
  return "";
}

function validateInviteForSignup(store, inviteToken, email) {
  if (!inviteToken) return null;
  const invite = store.invites.find((item) => item.token === inviteToken);
  if (!invite) throw httpError("Invitation link is invalid.", 404);
  if (invite.acceptedBy) throw httpError("Invitation link has already been used.", 409);
  if (invite.expiresAt && new Date(invite.expiresAt) <= new Date()) {
    throw httpError("Invitation link has expired. Ask the owner for a new invitation.", 410);
  }
  if (invite.email && normalizeEmail(invite.email) !== email) {
    throw httpError("This invitation was sent to a different email address.", 403);
  }
  return invite;
}

function allAccess() {
  return ACCESS_KEYS.reduce((acc, key) => ({ ...acc, [key]: true }), {});
}

function noAccess() {
  return ACCESS_KEYS.reduce((acc, key) => ({ ...acc, [key]: false }), {});
}

function memberAccess(access) {
  const normalized = noAccess();
  ASSIGNABLE_ACCESS_KEYS.forEach((key) => {
    normalized[key] = Boolean(access && access[key]);
  });
  normalized.administrative = false;
  return normalized;
}

function workspaceAccountFor(account, store) {
  if (!account || account.role === "owner" || !account.invitedBy) return account;
  return store.accounts.find((item) => item.id === account.invitedBy && item.role === "owner") || account;
}

function appDataReadKeysForAccount(account) {
  if (!account || account.role === "owner") return APP_DATA_KEYS;
  const keys = new Set();
  if (account.access && account.access.engineering) ENGINEERING_APP_DATA_KEYS.forEach((key) => keys.add(key));
  if (account.access && account.access.procurement) PROCUREMENT_APP_DATA_KEYS.forEach((key) => keys.add(key));
  if (account.access && account.access.accounting) ACCOUNTING_APP_DATA_KEYS.forEach((key) => keys.add(key));
  return [...keys];
}

function appDataWriteKeysForAccount(account) {
  if (!account || account.role === "owner") return APP_DATA_KEYS;
  const keys = new Set();
  if (account.access && account.access.engineering) ENGINEERING_APP_DATA_KEYS.forEach((key) => keys.add(key));
  if (account.access && account.access.procurement) keys.add("procurement");
  if (account.access && account.access.accounting) keys.add("accounting");
  return [...keys];
}

function filterAppDataForAccount(data, account) {
  const source = data && typeof data === "object" ? data : {};
  return appDataReadKeysForAccount(account).reduce((result, key) => {
    if (Object.prototype.hasOwnProperty.call(source, key)) result[key] = source[key];
    return result;
  }, { savedAt: source.savedAt || new Date().toISOString() });
}

function mergeAppDataForAccount(existingData, submittedData, account) {
  const existing = normalizeAccountAppData(existingData);
  const submitted = normalizeAccountAppData(submittedData);
  const merged = { ...existing, savedAt: new Date().toISOString() };
  appDataWriteKeysForAccount(account).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(submitted, key)) merged[key] = submitted[key];
  });
  return merged;
}

function publicAccount(account) {
  const result = PUBLIC_ACCOUNT_FIELDS.reduce((fields, field) => {
    fields[field] = account[field];
    return fields;
  }, {});
  result.googleDrive = publicGoogleDrive(account);
  return result;
}

function publicGoogleDrive(account) {
  const drive = account && account.googleDrive && typeof account.googleDrive === "object" ? account.googleDrive : null;
  return {
    connected: Boolean(drive && drive.refreshTokenSecret),
    email: drive && drive.email || "",
    folderId: drive && drive.folderId || "",
    spreadsheetId: drive && drive.spreadsheetId || "",
    spreadsheetUrl: drive && drive.spreadsheetUrl || "",
    connectedAt: drive && drive.connectedAt || "",
    lastSyncedAt: drive && drive.lastSyncedAt || "",
    lastError: drive && drive.lastError || ""
  };
}

function accountWithGoogleDrive(account, googleDrive) {
  return {
    ...account,
    googleDrive: {
      ...(account.googleDrive && typeof account.googleDrive === "object" ? account.googleDrive : {}),
      ...googleDrive
    }
  };
}

function updateStoreAccount(store, account) {
  store.accounts = store.accounts.map((item) => item.id === account.id ? account : item);
  return account;
}

function randomId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function hashValue(value, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(String(value), salt, 120000, 32, "sha256").toString("hex");
  return { salt, hash };
}

function timingSafeEqualText(first, second) {
  const firstBuffer = Buffer.from(String(first), "hex");
  const secondBuffer = Buffer.from(String(second), "hex");
  return firstBuffer.length === secondBuffer.length && crypto.timingSafeEqual(firstBuffer, secondBuffer);
}

function verifyHash(value, saved) {
  const current = hashValue(value, saved.salt);
  return timingSafeEqualText(current.hash, saved.hash);
}

function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

function requestMeta(req) {
  return {
    ip: clientIp(req),
    userAgent: req.headers["user-agent"] || null
  };
}

function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
    .split(",")[0]
    .trim() || "unknown";
}

function rateLimitKey(req, scope, identifier = "") {
  return `${scope}:${clientIp(req)}:${String(identifier).toLowerCase()}`;
}

function isRateLimited(key, { limit, windowMs }) {
  const now = Date.now();
  if (rateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS) {
    for (const [bucketKey, value] of rateLimitBuckets) {
      if (value.resetAt <= now) rateLimitBuckets.delete(bucketKey);
    }
    while (rateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS) {
      rateLimitBuckets.delete(rateLimitBuckets.keys().next().value);
    }
  }
  const bucket = rateLimitBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

function checkRateLimit(req, res, scope, identifier, options) {
  const key = rateLimitKey(req, scope, identifier);
  if (!isRateLimited(key, options)) return false;

  jsonResponse(req, res, 429, {
    ok: false,
    error: "Too many requests. Please wait a few minutes and try again."
  });
  return true;
}

function bearerToken(req) {
  const header = String(req.headers.authorization || "");
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

function safeTokenMatches(first, second) {
  const firstBuffer = Buffer.from(String(first));
  const secondBuffer = Buffer.from(String(second));
  return firstBuffer.length === secondBuffer.length && crypto.timingSafeEqual(firstBuffer, secondBuffer);
}

function googleDriveConfigured() {
  return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
}

function googleTokenKey() {
  return crypto.createHash("sha256").update(String(GOOGLE_TOKEN_SECRET)).digest();
}

function protectGoogleSecret(value) {
  if (!value) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", googleTokenKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("base64url")}:${tag.toString("base64url")}:${encrypted.toString("base64url")}`;
}

function unprotectGoogleSecret(value) {
  const secret = String(value || "");
  if (!secret) return "";
  if (!secret.startsWith("v1:")) return secret;
  const [, ivText, tagText, encryptedText] = secret.split(":");
  const decipher = crypto.createDecipheriv("aes-256-gcm", googleTokenKey(), Buffer.from(ivText, "base64url"));
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "base64url")),
    decipher.final()
  ]).toString("utf8");
}

function requestOrigin(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host || "127.0.0.1:8010";
  const proto = req.headers["x-forwarded-proto"] || (IS_PRODUCTION ? "https" : "http");
  return `${proto}://${host}`;
}

function googleRedirectUri(req) {
  return GOOGLE_REDIRECT_URI || `${requestOrigin(req)}/api/google/oauth/callback`;
}

function googleReturnUrl(req, status, message = "") {
  const url = new URL("/", requestOrigin(req));
  url.searchParams.set("googleDrive", status);
  if (message) url.searchParams.set("message", message.slice(0, 180));
  return url.toString();
}

function redirectResponse(req, res, location) {
  res.writeHead(302, responseHeaders({
    ...corsHeaders(req),
    Location: location,
    "Cache-Control": "no-store"
  }));
  res.end();
}

function googleAuthUrl(req, state) {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", googleRedirectUri(req));
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GOOGLE_SHEETS_SCOPE);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", state);
  return url.toString();
}

async function googleTokenRequest(body) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body)
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw httpError(payload.error_description || payload.error || "Google authorization failed.", 502);
  }
  return payload;
}

async function googleApiRequest(accessToken, url, { method = "GET", body, contentType = "application/json" } = {}) {
  const headers = { Authorization: `Bearer ${accessToken}` };
  if (body !== undefined && contentType) headers["Content-Type"] = contentType;
  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : (contentType === "application/json" ? JSON.stringify(body) : body)
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = payload && payload.error && (payload.error.message || payload.error_description)
      || payload && payload.error_description
      || `Google API request failed with status ${response.status}.`;
    throw httpError(message, response.status >= 400 && response.status < 500 ? 502 : 500);
  }
  return payload;
}

async function googleAccessTokenForAccount(account) {
  const drive = account && account.googleDrive && typeof account.googleDrive === "object" ? account.googleDrive : null;
  if (!drive || !drive.refreshTokenSecret) throw httpError("Connect Google Drive first.", 400);
  const refreshToken = unprotectGoogleSecret(drive.refreshTokenSecret);
  const token = await googleTokenRequest({
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token"
  });
  return token.access_token;
}

async function googleUserInfo(accessToken) {
  return googleApiRequest(accessToken, "https://www.googleapis.com/oauth2/v3/userinfo");
}

async function createGoogleDriveFolder(accessToken) {
  return googleApiRequest(accessToken, "https://www.googleapis.com/drive/v3/files?fields=id%2CwebViewLink", {
    method: "POST",
    body: {
      name: GOOGLE_DRIVE_FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder"
    }
  });
}

async function createGoogleSpreadsheetFile(accessToken, account, folderId) {
  const fileName = `Oversee Data - ${account.email || account.name || "Workspace"}`;
  return googleApiRequest(accessToken, "https://www.googleapis.com/drive/v3/files?fields=id%2CwebViewLink", {
    method: "POST",
    body: {
      name: fileName,
      mimeType: "application/vnd.google-apps.spreadsheet",
      parents: folderId ? [folderId] : undefined
    }
  });
}

function quoteSheetName(name) {
  return `'${String(name).replace(/'/g, "''")}'`;
}

function sheetCell(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return Number.isFinite(value) ? value : "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function rowsWithHeader(header, rows) {
  return [header, ...rows.map((row) => header.map((key) => sheetCell(row[key])))];
}

function projectNameLookup(data) {
  const projects = Array.isArray(data.projects) ? data.projects : [];
  return new Map(projects.map((project) => [String(project.id || ""), String(project.name || "")]));
}

function flattenOverseeDataForSheets(data, workspaceAccount, savedByAccount, updatedAt) {
  const source = normalizeAccountAppData(data);
  const projectNames = projectNameLookup(source);
  const projects = Array.isArray(source.projects) ? source.projects : [];
  const swa = source.swa && typeof source.swa === "object" ? source.swa : {};
  const estimateDraft = source.estimateDraft && typeof source.estimateDraft === "object" ? source.estimateDraft : {};
  const estimateV2Draft = source.estimateV2Draft && typeof source.estimateV2Draft === "object" ? source.estimateV2Draft : {};
  const materialPrices = source.materialPrices && typeof source.materialPrices === "object" ? source.materialPrices : {};
  const procurement = source.procurement && typeof source.procurement === "object" ? source.procurement : {};
  const accounting = source.accounting && typeof source.accounting === "object" ? source.accounting : {};

  const summaryRows = [
    { Field: "Workspace Owner", Value: workspaceAccount.name || "" },
    { Field: "Workspace Email", Value: workspaceAccount.email || "" },
    { Field: "Last Saved By", Value: savedByAccount.name || "" },
    { Field: "Last Saved Email", Value: savedByAccount.email || "" },
    { Field: "Last Synced", Value: updatedAt },
    { Field: "Project Count", Value: projects.length },
    { Field: "SWA Sheets", Value: Array.isArray(swa.sheets) ? swa.sheets.length : 0 },
    { Field: "Purchase Requests", Value: Array.isArray(procurement.requests) ? procurement.requests.length : 0 },
    { Field: "Billings", Value: Array.isArray(accounting.billings) ? accounting.billings.length : 0 }
  ];

  const projectRows = projects.map((project) => ({
    Id: project.id,
    Project: project.name,
    Type: project.type,
    Status: project.status,
    "Actual %": project.actualPercent,
    "Start Date": project.startDate,
    "Duration Days": project.duration,
    "Contract Amount": project.contractAmount,
    "Entered By": project.enteredByName || "",
    "Entered Email": project.enteredByEmail || ""
  }));

  const estimateRows = (Array.isArray(estimateDraft.rows) ? estimateDraft.rows : []).map((row) => ({
    Title: estimateDraft.title || "Estimate",
    Project: projectNames.get(String(estimateDraft.selectedProjectId || row.projectId || "")) || "",
    Description: row.description,
    Unit: row.unit,
    Quantity: row.quantity,
    "Cost Per Unit": row.costPerUnit,
    "Total Cost": (Number(row.quantity) || 0) * (Number(row.costPerUnit) || 0)
  }));

  const estimateV2Rows = [
    ...(Array.isArray(estimateV2Draft.takeoffRows) ? estimateV2Draft.takeoffRows : []).map((row) => ({
      Source: "Takeoff",
      Project: projectNames.get(String(row.projectId || estimateV2Draft.selectedProjectId || "")) || "",
      Description: row.description,
      Group: row.group || row.type || "",
      Unit: row.unit,
      Quantity: row.quantity,
      "Cost Per Unit": row.costPerUnit,
      "Total Cost": (Number(row.quantity) || 0) * (Number(row.costPerUnit) || 0),
      Notes: row.notes || ""
    })),
    ...(Array.isArray(estimateV2Draft.materials) ? estimateV2Draft.materials : []).map((row) => ({
      Source: "Material",
      Project: projectNames.get(String(estimateV2Draft.selectedProjectId || "")) || "",
      Description: row.description,
      Group: row.category || "",
      Unit: row.unit,
      Quantity: row.quantity,
      "Cost Per Unit": row.costPerUnit,
      "Total Cost": (Number(row.quantity) || 0) * (Number(row.costPerUnit) || 0),
      Notes: row.notes || row.source || ""
    }))
  ];

  const priceStores = Array.isArray(materialPrices.stores) ? materialPrices.stores : [];
  const materialRows = priceStores.flatMap((store) => (Array.isArray(store.rows) ? store.rows : []).map((row) => ({
    Store: store.name,
    Description: row.description,
    Unit: row.unit,
    "Cost Per Unit": row.costPerUnit
  })));

  const swaRows = (Array.isArray(swa.sheets) ? swa.sheets : []).flatMap((sheet) => {
    const rows = Array.isArray(sheet.rows) ? sheet.rows : [];
    return rows.map((row) => ({
      Sheet: sheet.name,
      Project: projectNames.get(String(sheet.projectId || "")) || "",
      Description: row.description,
      Quantity: row.quantity,
      Unit: row.unit,
      "Unit Cost": row.unitCost,
      "This Period Qty": row.thisQty,
      "This Period Cost": (Number(row.thisQty) || 0) * (Number(row.unitCost) || 0),
      "Previous Qty": row.previousQty,
      "Created At": sheet.createdAt
    }));
  });

  const requestRows = (Array.isArray(procurement.requests) ? procurement.requests : []).map((row) => ({
    Project: projectNames.get(String(row.projectId || "")) || "",
    Item: row.item,
    Quantity: row.quantity,
    Unit: row.unit,
    "Estimated Unit Cost": row.estimatedUnitCost,
    Status: row.status,
    Priority: row.priority,
    "Needed By": row.neededBy,
    "Submitted At": row.submittedAt,
    "Entered By": row.enteredByName || row.submittedByName || "",
    "Entered Email": row.enteredByEmail || row.submittedByEmail || ""
  }));

  const orderRows = (Array.isArray(procurement.orders) ? procurement.orders : []).map((row) => ({
    Project: projectNames.get(String(row.projectId || "")) || "",
    "PO Number": row.poNumber,
    Supplier: row.supplierId,
    Item: row.item,
    Quantity: row.quantity,
    Unit: row.unit,
    "Unit Cost": row.unitCost,
    Status: row.status,
    "Expected Date": row.expectedDate,
    "Entered By": row.enteredByName || ""
  }));

  const billingRows = (Array.isArray(accounting.billings) ? accounting.billings : []).map((row) => ({
    Project: projectNames.get(String(row.projectId || "")) || "",
    "Billing Number": row.billingNumber,
    Description: row.description,
    Amount: row.amount,
    Status: row.status,
    "Due Date": row.dueDate,
    "Submitted At": row.submittedAt,
    "Entered By": row.enteredByName || row.submittedByName || "",
    "Entered Email": row.enteredByEmail || row.submittedByEmail || ""
  }));

  const expenseRows = (Array.isArray(accounting.expenses) ? accounting.expenses : []).map((row) => ({
    Project: projectNames.get(String(row.projectId || "")) || "",
    Date: row.date,
    Category: row.category,
    Description: row.description,
    Payee: row.payee,
    Amount: row.amount,
    Status: row.status,
    "Entered By": row.enteredByName || "",
    "Entered Email": row.enteredByEmail || ""
  }));

  return {
    Summary: rowsWithHeader(["Field", "Value"], summaryRows),
    Projects: rowsWithHeader(["Id", "Project", "Type", "Status", "Actual %", "Start Date", "Duration Days", "Contract Amount", "Entered By", "Entered Email"], projectRows),
    "SWA Billings": rowsWithHeader(["Sheet", "Project", "Description", "Quantity", "Unit", "Unit Cost", "This Period Qty", "This Period Cost", "Previous Qty", "Created At"], swaRows),
    "Estimate V1": rowsWithHeader(["Title", "Project", "Description", "Unit", "Quantity", "Cost Per Unit", "Total Cost"], estimateRows),
    "Estimate V2": rowsWithHeader(["Source", "Project", "Description", "Group", "Unit", "Quantity", "Cost Per Unit", "Total Cost", "Notes"], estimateV2Rows),
    "Material Prices": rowsWithHeader(["Store", "Description", "Unit", "Cost Per Unit"], materialRows),
    Procurement: rowsWithHeader(["Project", "Item", "Quantity", "Unit", "Estimated Unit Cost", "Status", "Priority", "Needed By", "Submitted At", "Entered By", "Entered Email"], requestRows),
    "Purchase Orders": rowsWithHeader(["Project", "PO Number", "Supplier", "Item", "Quantity", "Unit", "Unit Cost", "Status", "Expected Date", "Entered By"], orderRows),
    Accounting: rowsWithHeader(["Project", "Billing Number", "Description", "Amount", "Status", "Due Date", "Submitted At", "Entered By", "Entered Email"], billingRows),
    Expenses: rowsWithHeader(["Project", "Date", "Category", "Description", "Payee", "Amount", "Status", "Entered By", "Entered Email"], expenseRows),
    RawData: [["JSON"], [JSON.stringify(source)]]
  };
}

async function ensureGoogleSpreadsheet(accessToken, account) {
  const drive = account.googleDrive && typeof account.googleDrive === "object" ? account.googleDrive : {};
  if (drive.spreadsheetId) return drive;

  const folder = drive.folderId ? { id: drive.folderId } : await createGoogleDriveFolder(accessToken);
  const spreadsheet = await createGoogleSpreadsheetFile(accessToken, account, folder.id);
  return {
    ...drive,
    folderId: folder.id,
    spreadsheetId: spreadsheet.id,
    spreadsheetUrl: spreadsheet.webViewLink || `https://docs.google.com/spreadsheets/d/${spreadsheet.id}/edit`
  };
}

async function ensureGoogleSheetTabs(accessToken, spreadsheetId, sheetNames) {
  const spreadsheet = await googleApiRequest(accessToken, `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=sheets.properties.title`);
  const existing = new Set((spreadsheet.sheets || []).map((sheet) => sheet.properties && sheet.properties.title).filter(Boolean));
  const missing = sheetNames.filter((name) => !existing.has(name));
  if (!missing.length) return;
  await googleApiRequest(accessToken, `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}:batchUpdate`, {
    method: "POST",
    body: {
      requests: missing.map((title) => ({ addSheet: { properties: { title } } }))
    }
  });
}

async function writeGoogleSheetsValues(accessToken, spreadsheetId, sheets) {
  const sheetNames = Object.keys(sheets);
  await ensureGoogleSheetTabs(accessToken, spreadsheetId, sheetNames);
  await googleApiRequest(accessToken, `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchClear`, {
    method: "POST",
    body: {
      ranges: sheetNames.map((name) => `${quoteSheetName(name)}!A:Z`)
    }
  });
  await googleApiRequest(accessToken, `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchUpdate`, {
    method: "POST",
    body: {
      valueInputOption: "RAW",
      data: sheetNames.map((name) => ({
        range: `${quoteSheetName(name)}!A1`,
        majorDimension: "ROWS",
        values: sheets[name]
      }))
    }
  });
}

async function syncWorkspaceToGoogleDrive(store, workspaceAccount, savedByAccount, data, updatedAt) {
  if (!googleDriveConfigured()) return { skipped: true, reason: "Google Drive is not configured." };
  if (!workspaceAccount || !workspaceAccount.googleDrive || !workspaceAccount.googleDrive.refreshTokenSecret) {
    return { skipped: true, reason: "Google Drive is not connected." };
  }

  const account = store.accounts.find((item) => item.id === workspaceAccount.id) || workspaceAccount;
  try {
    const accessToken = await googleAccessTokenForAccount(account);
    const nextDrive = await ensureGoogleSpreadsheet(accessToken, account);
    const sheets = flattenOverseeDataForSheets(data, account, savedByAccount || account, updatedAt);
    await writeGoogleSheetsValues(accessToken, nextDrive.spreadsheetId, sheets);
    const updatedAccount = accountWithGoogleDrive(account, {
      ...nextDrive,
      lastSyncedAt: updatedAt,
      lastError: ""
    });
    updateStoreAccount(store, updatedAccount);
    return { synced: true, account: updatedAccount, spreadsheetUrl: updatedAccount.googleDrive.spreadsheetUrl };
  } catch (error) {
    const updatedAccount = accountWithGoogleDrive(account, {
      lastError: error && error.message || publicErrorMessage(error) || "Google Drive sync failed."
    });
    updateStoreAccount(store, updatedAccount);
    return { synced: false, account: updatedAccount, error };
  }
}

function sessionAccountFromRequest(req, store) {
  const token = bearerToken(req);
  if (!token) return null;
  const now = new Date();
  const session = store.sessions.find((item) => {
    return item.token && safeTokenMatches(item.token, token) && new Date(item.expiresAt) > now;
  });
  if (!session) return null;
  return store.accounts.find((account) => account.id === session.accountId) || null;
}

function requireOwner(req, res, store) {
  const account = sessionAccountFromRequest(req, store);
  if (!account) {
    jsonResponse(req, res, 401, { ok: false, error: "Sign in is required." });
    return null;
  }
  if (account.role !== "owner") {
    jsonResponse(req, res, 403, { ok: false, error: "Owner access is required." });
    return null;
  }
  return account;
}

function audit(store, action, details = {}) {
  const event = {
    id: randomId("audit"),
    action,
    details,
    at: new Date().toISOString()
  };
  store.auditLog.push(event);
  store.auditLog = store.auditLog.slice(-1000);
  return event;
}

async function persistAuditEvent(store, event) {
  if (!SUPABASE_ENABLED) return writeStore(store);
  return supabaseRequest("oversee_audit_log", {
    method: "POST",
    body: [{
      id: event.id,
      action: event.action,
      data: event,
      at: event.at
    }],
    prefer: "return=minimal"
  });
}

function withKeyedLock(lockMap, key, task) {
  const previous = lockMap.get(key) || Promise.resolve();
  const run = previous.catch(() => undefined).then(task);
  lockMap.set(key, run);
  return run.finally(() => {
    if (lockMap.get(key) === run) lockMap.delete(key);
  });
}

function cleanHeader(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function dotStuff(message) {
  return message.replace(/\r?\n/g, "\r\n").replace(/^\./gm, "..");
}

function buildPlainEmail({ from, to, subject, text }) {
  return [
    `From: ${cleanHeader(from)}`,
    `To: ${cleanHeader(to)}`,
    `Subject: ${cleanHeader(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    `Date: ${new Date().toUTCString()}`,
    "",
    text
  ].join("\r\n");
}

function createSmtpSession(socket) {
  let buffer = "";
  let lines = [];
  const responses = [];
  const waiters = [];

  function flushWaiters() {
    while (responses.length && waiters.length) {
      const waiter = waiters.shift();
      waiter.resolve(responses.shift());
    }
  }

  function rejectWaiters(error) {
    while (waiters.length) {
      waiters.shift().reject(error);
    }
  }

  function parseChunk(chunk) {
    buffer += chunk;
    let index = buffer.indexOf("\n");
    while (index !== -1) {
      const line = buffer.slice(0, index).replace(/\r$/, "");
      buffer = buffer.slice(index + 1);
      lines.push(line);

      if (/^\d{3} /.test(line)) {
        responses.push(lines.join("\n"));
        lines = [];
        flushWaiters();
      }

      index = buffer.indexOf("\n");
    }
  }

  socket.setEncoding("utf8");
  socket.on("data", parseChunk);
  socket.on("error", rejectWaiters);
  socket.on("close", () => {
    rejectWaiters(new Error("SMTP connection closed before the email was accepted."));
  });

  function readResponse() {
    if (responses.length) return Promise.resolve(responses.shift());

    return new Promise((resolve, reject) => {
      const waiter = {
        resolve: (response) => {
          clearTimeout(timer);
          resolve(response);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        }
      };
      const timer = setTimeout(() => {
        const index = waiters.indexOf(waiter);
        if (index !== -1) waiters.splice(index, 1);
        reject(new Error("SMTP server timed out."));
      }, 15000);
      waiters.push(waiter);
      flushWaiters();
    });
  }

  async function command(commandText, expectedCodes) {
    if (commandText) socket.write(`${commandText}\r\n`);
    const response = await readResponse();
    const code = Number(response.slice(0, 3));
    if (!expectedCodes.includes(code)) {
      throw new Error(`SMTP command failed: ${response}`);
    }
    return response;
  }

  return { command };
}

function connectGmailSmtp() {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host: "smtp.gmail.com",
      port: 465,
      servername: "smtp.gmail.com"
    });

    function cleanup() {
      socket.off("secureConnect", handleConnect);
      socket.off("error", handleError);
      socket.off("timeout", handleTimeout);
    }

    function handleConnect() {
      cleanup();
      resolve(socket);
    }

    function handleError(error) {
      cleanup();
      reject(error);
    }

    function handleTimeout() {
      const error = new Error("Gmail SMTP connection timed out.");
      cleanup();
      socket.destroy(error);
      reject(error);
    }

    socket.setTimeout(15000);
    socket.once("secureConnect", handleConnect);
    socket.once("error", handleError);
    socket.once("timeout", handleTimeout);
  });
}

async function sendGmailSmtpEmail({ email, subject, text }) {
  const gmailUser = normalizeEmail(cleanEnvValue(process.env.GMAIL_USER));
  const appPassword = cleanEnvValue(process.env.GMAIL_APP_PASSWORD).replace(/\s+/g, "");
  if (!validateEmail(gmailUser) || !appPassword) {
    throw new Error("Gmail SMTP is not configured correctly.");
  }

  const from = cleanEnvValue(process.env.OVERSEE_EMAIL_FROM) || `Oversee <${gmailUser}>`;
  const message = buildPlainEmail({ from, to: email, subject, text });
  const socket = await connectGmailSmtp();
  const smtp = createSmtpSession(socket);

  try {
    await smtp.command(null, [220]);
    await smtp.command("EHLO oversee.local", [250]);
    await smtp.command("AUTH LOGIN", [334]);
    await smtp.command(Buffer.from(gmailUser).toString("base64"), [334]);
    await smtp.command(Buffer.from(appPassword).toString("base64"), [235]);
    await smtp.command(`MAIL FROM:<${gmailUser}>`, [250]);
    await smtp.command(`RCPT TO:<${email}>`, [250, 251]);
    await smtp.command("DATA", [354]);
    socket.write(`${dotStuff(message)}\r\n.\r\n`);
    await smtp.command(null, [250]);
    await smtp.command("QUIT", [221]);
  } finally {
    socket.end();
  }
}

async function sendOtpEmail({ email, name, otp }) {
  const subject = "Oversee account verification code";
  const text = [
    `Hi ${name || "there"},`,
    "",
    `Your Oversee verification code is ${otp}.`,
    `This code expires in ${OTP_TTL_MINUTES} minutes.`,
    "",
    "If you did not create an Oversee account, you can ignore this email."
  ].join("\n");

  if (cleanEnvValue(process.env.GMAIL_USER) && cleanEnvValue(process.env.GMAIL_APP_PASSWORD)) {
    await sendGmailSmtpEmail({ email, subject, text });
    return { mode: "email", provider: "gmail-smtp" };
  }

  const resendKey = cleanEnvValue(process.env.RESEND_API_KEY);
  if (resendKey) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: cleanEnvValue(process.env.OVERSEE_EMAIL_FROM) || "Oversee <onboarding@resend.dev>",
        to: [email],
        subject,
        text
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Email provider failed: ${detail}`);
    }

    return { mode: "email", provider: "resend" };
  }

  if (IS_PRODUCTION) {
    throw httpError("OTP email is not configured in Render. Add GMAIL_USER and GMAIL_APP_PASSWORD, then redeploy.", 503);
  }

  await ensureDataDir();
  await fs.appendFile(OUTBOX_FILE, `${JSON.stringify({ to: email, subject, text, otp, at: new Date().toISOString() })}\n`);
  return { mode: "dev-outbox", outbox: OUTBOX_FILE };
}

function configuredEmailMode() {
  if (cleanEnvValue(process.env.GMAIL_USER) && cleanEnvValue(process.env.GMAIL_APP_PASSWORD)) return "gmail-smtp";
  if (cleanEnvValue(process.env.RESEND_API_KEY)) return "resend";
  return IS_PRODUCTION ? "not-configured" : "dev-outbox";
}

function emailModeLabel() {
  const mode = configuredEmailMode();
  if (mode === "gmail-smtp") return "Gmail SMTP";
  if (mode === "resend") return "Resend API";
  if (mode === "not-configured") return "not configured";
  return "development outbox. OTP emails are written to backend/data/email-outbox.jsonl";
}

async function requestSignupOtp(req, res) {
  const body = await readJsonBody(req);
  const email = normalizeEmail(body.email);
  const name = String(body.name || "").trim();
  const password = String(body.password || "");
  const gmailLinked = Boolean(body.gmailLinked);
  const inviteToken = body.inviteToken ? String(body.inviteToken) : null;

  if (checkRateLimit(req, res, "signup-ip", "", { limit: 8, windowMs: 15 * 60 * 1000 })) return;
  if (email && checkRateLimit(req, res, "signup-email", email, { limit: 4, windowMs: 30 * 60 * 1000 })) return;

  const validationError = validateSignupInput({ name, email, password });
  if (validationError) return jsonResponse(req, res, 400, { ok: false, error: validationError });

  const store = await readStore();
  if (store.accounts.some((account) => account.email === email)) {
    return jsonResponse(req, res, 409, { ok: false, error: "An account already exists with that email." });
  }
  validateInviteForSignup(store, inviteToken, email);

  const otp = generateOtp();
  const passwordSecret = hashValue(password);
  const otpSecret = hashValue(otp);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

  store.pendingSignups = store.pendingSignups.filter((item) => item.email !== email);
  store.pendingSignups.push({
    id: randomId("pending"),
    name,
    email,
    passwordHash: passwordSecret.hash,
    passwordSalt: passwordSecret.salt,
    gmailLinked,
    inviteToken,
    otpHash: otpSecret.hash,
    otpSalt: otpSecret.salt,
    otpExpiresAt: expiresAt,
    attempts: 0,
    requestMeta: requestMeta(req),
    createdAt: now.toISOString()
  });
  audit(store, "signup_otp_requested", { email, gmailLinked, inviteToken: Boolean(inviteToken), meta: requestMeta(req) });
  await writeStore(store);

  let delivery;
  try {
    delivery = await sendOtpEmail({ email, name, otp });
  } catch (error) {
    console.error("OTP email delivery failed", error);
    store.pendingSignups = store.pendingSignups.filter((item) => item.email !== email);
    audit(store, "signup_otp_delivery_failed", {
      email,
      provider: configuredEmailMode(),
      message: publicErrorMessage(error)
    });
    await writeStore(store).catch((writeError) => console.error("Unable to clean failed pending signup", writeError));

    const deliveryError = httpError(
      "OTP email could not be sent. Please check the Gmail SMTP environment variables in Render, especially GMAIL_USER and GMAIL_APP_PASSWORD.",
      error.statusCode || 502
    );
    deliveryError.publicMessage = deliveryError.message;
    throw deliveryError;
  }
  jsonResponse(req, res, 200, {
    ok: true,
    message: delivery.mode === "dev-outbox"
      ? "OTP created. Email sending is not configured, so check backend/data/email-outbox.jsonl."
      : "OTP sent to email.",
    delivery
  });
}

async function signupDirect(req, res) {
  const body = await readJsonBody(req);
  const email = normalizeEmail(body.email);
  const name = String(body.name || "").trim();
  const password = String(body.password || "");
  const confirmPassword = String(body.confirmPassword || "");
  const gmailLinked = Boolean(body.gmailLinked);
  const inviteToken = body.inviteToken ? String(body.inviteToken) : null;

  if (checkRateLimit(req, res, "signup-ip", "", { limit: 8, windowMs: 15 * 60 * 1000 })) return;
  if (email && checkRateLimit(req, res, "signup-email", email, { limit: 4, windowMs: 30 * 60 * 1000 })) return;

  const validationError = validateSignupInput({ name, email, password, confirmPassword, requireConfirmation: true });
  if (validationError) return jsonResponse(req, res, 400, { ok: false, error: validationError });

  const { account, session } = await withKeyedLock(signupLocks, inviteToken || email, async () => {
    const store = await readStore();
    if (store.accounts.some((item) => item.email === email)) {
      throw httpError("An account already exists with that email.", 409);
    }
    const invite = validateInviteForSignup(store, inviteToken, email);
    const passwordSecret = hashValue(password);
    const createdAccount = addAccountToStore(store, {
      name,
      email,
      passwordHash: passwordSecret.hash,
      passwordSalt: passwordSecret.salt,
      gmailLinked,
      invite,
      plan: "free",
      requestMeta: requestMeta(req),
      emailVerified: false
    });
    const createdSession = createSession(store, createdAccount.id, req);
    audit(store, "account_created_without_otp", { accountId: createdAccount.id, email, role: createdAccount.role });
    await writeStore(store);
    return { account: createdAccount, session: createdSession };
  });

  jsonResponse(req, res, 201, {
    ok: true,
    message: "Account created.",
    account: publicAccount(account),
    session
  });
}

async function verifySignupOtp(req, res) {
  const body = await readJsonBody(req);
  const email = normalizeEmail(body.email);
  const otp = String(body.otp || "").trim();

  if (checkRateLimit(req, res, "verify-ip", "", { limit: 20, windowMs: 15 * 60 * 1000 })) return;
  if (email && checkRateLimit(req, res, "verify-email", email, { limit: 10, windowMs: 15 * 60 * 1000 })) return;

  const store = await readStore();
  const pending = store.pendingSignups.find((item) => item.email === email);

  if (!pending) return jsonResponse(req, res, 404, { ok: false, error: "No pending signup was found for that email." });
  if (new Date(pending.otpExpiresAt) < new Date()) {
    store.pendingSignups = store.pendingSignups.filter((item) => item.email !== email);
    audit(store, "signup_otp_expired", { email });
    await writeStore(store);
    return jsonResponse(req, res, 410, { ok: false, error: "OTP expired. Please request a new code." });
  }
  if (pending.attempts >= 5) {
    return jsonResponse(req, res, 429, { ok: false, error: "Too many OTP attempts. Please request a new code." });
  }

  const otpMatches = verifyHash(otp, { hash: pending.otpHash, salt: pending.otpSalt });
  if (!otpMatches) {
    pending.attempts += 1;
    audit(store, "signup_otp_failed", { email, attempts: pending.attempts });
    await writeStore(store);
    return jsonResponse(req, res, 401, { ok: false, error: "OTP is incorrect." });
  }

  if (store.accounts.some((account) => account.email === email)) {
    store.pendingSignups = store.pendingSignups.filter((item) => item.email !== email);
    await writeStore(store);
    return jsonResponse(req, res, 409, { ok: false, error: "An account already exists with that email." });
  }
  const invite = validateInviteForSignup(store, pending.inviteToken, email);

  const account = addAccountToStore(store, {
    name: pending.name,
    email,
    passwordHash: pending.passwordHash,
    passwordSalt: pending.passwordSalt,
    gmailLinked: pending.gmailLinked,
    invite,
    plan: "free",
    requestMeta: pending.requestMeta,
    emailVerified: true
  });
  const session = createSession(store, account.id, req);
  audit(store, "account_created", { accountId: account.id, email, role: account.role });
  await writeStore(store);

  jsonResponse(req, res, 201, { ok: true, account: publicAccount(account), session });
}

function addAccountToStore(store, signup) {
  const invite = signup.invite || null;
  const isInvitedAccount = Boolean(invite);
  const now = new Date().toISOString();
  const account = {
    id: randomId("acct"),
    name: signup.name,
    email: signup.email,
    passwordHash: signup.passwordHash,
    passwordSalt: signup.passwordSalt,
    gmailLinked: signup.gmailLinked,
    role: isInvitedAccount ? "member" : "owner",
    access: isInvitedAccount ? memberAccess(invite.access) : allAccess(),
    plan: signup.plan || "free",
    invitedBy: invite ? invite.createdBy : null,
    createdAt: now,
    emailVerifiedAt: signup.emailVerified ? now : null,
    lastLoginAt: now,
    requestMeta: signup.requestMeta
  };

  store.accounts.push(account);
  store.pendingSignups = store.pendingSignups.filter((item) => item.email !== signup.email);
  if (invite) {
    invite.acceptedBy = account.id;
    invite.acceptedAt = now;
  }
  return account;
}

function createSession(store, accountId, req) {
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const session = {
    token,
    accountId,
    createdAt: now.toISOString(),
    expiresAt,
    meta: requestMeta(req)
  };
  store.sessions.push(session);
  store.sessions = store.sessions.filter((item) => new Date(item.expiresAt) > now);
  return session;
}

async function login(req, res) {
  const body = await readJsonBody(req);
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");

  if (checkRateLimit(req, res, "login-ip", "", { limit: 20, windowMs: 15 * 60 * 1000 })) return;
  if (email && checkRateLimit(req, res, "login-email", email, { limit: 8, windowMs: 15 * 60 * 1000 })) return;
  if (!validateEmail(email) || email.length > MAX_EMAIL_LENGTH || !password || password.length > MAX_PASSWORD_LENGTH) {
    return jsonResponse(req, res, 401, { ok: false, error: "Email or password is incorrect." });
  }

  const store = await readStore();
  const account = store.accounts.find((item) => item.email === email);
  if (!account || !verifyHash(password, { hash: account.passwordHash, salt: account.passwordSalt })) {
    const event = audit(store, "login_failed", { email, meta: requestMeta(req) });
    await persistAuditEvent(store, event);
    return jsonResponse(req, res, 401, { ok: false, error: "Email or password is incorrect." });
  }

  account.lastLoginAt = new Date().toISOString();
  const session = createSession(store, account.id, req);
  audit(store, "login_succeeded", { accountId: account.id, email });
  await writeStore(store);

  jsonResponse(req, res, 200, { ok: true, account: publicAccount(account), session });
}

async function logout(req, res) {
  const store = await readStore();
  const token = bearerToken(req);
  if (!token) return jsonResponse(req, res, 200, { ok: true });

  const account = sessionAccountFromRequest(req, store);
  const sessionCount = store.sessions.length;
  store.sessions = store.sessions.filter((item) => !item.token || !safeTokenMatches(item.token, token));
  if (store.sessions.length !== sessionCount) {
    audit(store, "logout_succeeded", { accountId: account && account.id || null, meta: requestMeta(req) });
    await writeStore(store);
  }
  jsonResponse(req, res, 200, { ok: true });
}

async function listAccounts(req, res) {
  const store = await readStore();
  const owner = requireOwner(req, res, store);
  if (!owner) return;
  const event = audit(store, "accounts_listed", { accountId: owner.id, meta: requestMeta(req) });
  await persistAuditEvent(store, event);
  jsonResponse(req, res, 200, {
    ok: true,
    accounts: store.accounts.filter((account) => account.id === owner.id || account.invitedBy === owner.id).map(publicAccount),
    invites: store.invites.filter((invite) => invite.createdBy === owner.id)
  });
}

async function updateAccountAccess(req, res) {
  const store = await readStore();
  const owner = requireOwner(req, res, store);
  if (!owner) return;
  const body = await readJsonBody(req);
  const accountId = String(body.accountId || "").trim();
  const account = store.accounts.find((item) => item.id === accountId && item.invitedBy === owner.id);
  if (!account || account.role === "owner") {
    return jsonResponse(req, res, 404, { ok: false, error: "Invited account was not found." });
  }
  account.access = memberAccess(body.access);
  account.updatedAt = new Date().toISOString();
  audit(store, "account_access_updated", { accountId, ownerId: owner.id, access: account.access, meta: requestMeta(req) });
  await writeStore(store);
  jsonResponse(req, res, 200, { ok: true, account: publicAccount(account) });
}

async function createOwnerInvite(req, res) {
  const store = await readStore();
  const owner = requireOwner(req, res, store);
  if (!owner) return;
  const body = await readJsonBody(req);
  const email = normalizeEmail(body.email);
  if (email && (!validateEmail(email) || email.length > MAX_EMAIL_LENGTH)) {
    return jsonResponse(req, res, 400, { ok: false, error: "A valid invite email is required." });
  }
  if (email && store.accounts.some((account) => account.email === email)) {
    return jsonResponse(req, res, 409, { ok: false, error: "An account already exists with that email." });
  }
  const invite = {
    token: randomId("invite"),
    email,
    access: memberAccess(body.access),
    createdBy: owner.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    acceptedBy: null
  };
  store.invites.push(invite);
  audit(store, "invite_created", { ownerId: owner.id, email, access: invite.access, meta: requestMeta(req) });
  await writeStore(store);
  jsonResponse(req, res, 201, { ok: true, invite });
}

async function googleDriveStatus(req, res) {
  const store = await readStore();
  const account = sessionAccountFromRequest(req, store);
  if (!account) return jsonResponse(req, res, 401, { ok: false, error: "Sign in is required." });
  const workspaceAccount = workspaceAccountFor(account, store);
  jsonResponse(req, res, 200, {
    ok: true,
    configured: googleDriveConfigured(),
    googleDrive: publicGoogleDrive(workspaceAccount),
    account: publicAccount(account),
    workspaceAccountId: workspaceAccount.id
  });
}

async function createGoogleDriveAuthUrl(req, res) {
  if (!googleDriveConfigured()) {
    return jsonResponse(req, res, 503, {
      ok: false,
      error: "Google Drive sync is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET on the server."
    });
  }

  const store = await readStore();
  const account = sessionAccountFromRequest(req, store);
  if (!account) return jsonResponse(req, res, 401, { ok: false, error: "Sign in is required." });
  const workspaceAccount = workspaceAccountFor(account, store);
  if (account.id !== workspaceAccount.id && account.role !== "owner") {
    return jsonResponse(req, res, 403, { ok: false, error: "Only the workspace owner can connect Google Drive storage." });
  }

  const state = randomId("google_state");
  googleOAuthStates.set(state, {
    accountId: workspaceAccount.id,
    createdAt: Date.now(),
    expiresAt: Date.now() + 10 * 60 * 1000,
    origin: requestOrigin(req)
  });
  jsonResponse(req, res, 200, { ok: true, authUrl: googleAuthUrl(req, state) });
}

async function handleGoogleOAuthCallback(req, res, url) {
  if (!googleDriveConfigured()) return redirectResponse(req, res, googleReturnUrl(req, "error", "Google is not configured."));
  const code = String(url.searchParams.get("code") || "").trim();
  const state = String(url.searchParams.get("state") || "").trim();
  const error = String(url.searchParams.get("error") || "").trim();
  if (error) return redirectResponse(req, res, googleReturnUrl(req, "error", error));
  const savedState = googleOAuthStates.get(state);
  googleOAuthStates.delete(state);
  if (!code || !savedState || savedState.expiresAt < Date.now()) {
    return redirectResponse(req, res, googleReturnUrl(req, "error", "Google connection expired. Try again."));
  }

  try {
    const token = await googleTokenRequest({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: googleRedirectUri(req),
      grant_type: "authorization_code"
    });
    if (!token.refresh_token) {
      return redirectResponse(req, res, googleReturnUrl(req, "error", "Google did not return offline access. Try Connect again."));
    }

    const profile = token.access_token ? await googleUserInfo(token.access_token).catch(() => ({})) : {};
    const store = await readStore();
    const account = store.accounts.find((item) => item.id === savedState.accountId);
    if (!account) return redirectResponse(req, res, googleReturnUrl(req, "error", "Account was not found."));
    const updatedAccount = accountWithGoogleDrive(account, {
      email: profile.email || account.email || "",
      refreshTokenSecret: protectGoogleSecret(token.refresh_token),
      connectedAt: new Date().toISOString(),
      lastError: ""
    });
    updateStoreAccount(store, updatedAccount);
    audit(store, "google_drive_connected", {
      accountId: updatedAccount.id,
      accountEmail: updatedAccount.email,
      googleEmail: profile.email || ""
    });
    await writeStore(store);
    return redirectResponse(req, res, googleReturnUrl(req, "connected"));
  } catch (callbackError) {
    console.error(callbackError);
    return redirectResponse(req, res, googleReturnUrl(req, "error", callbackError.message || "Google connection failed."));
  }
}

async function syncGoogleDriveNow(req, res) {
  const store = await readStore();
  const account = sessionAccountFromRequest(req, store);
  if (!account) return jsonResponse(req, res, 401, { ok: false, error: "Sign in is required." });
  const workspaceAccount = workspaceAccountFor(account, store);
  const record = await readAccountAppData(workspaceAccount.id, store);
  if (!record) {
    return jsonResponse(req, res, 404, { ok: false, error: "Save app data first before syncing to Google Drive." });
  }
  const syncedAt = new Date().toISOString();
  const result = await syncWorkspaceToGoogleDrive(store, workspaceAccount, account, record.data, syncedAt);
  await writeStore(store);
  const refreshedAccount = store.accounts.find((item) => item.id === account.id) || account;
  if (result.skipped) {
    return jsonResponse(req, res, 200, {
      ok: true,
      skipped: true,
      message: result.reason,
      account: publicAccount(refreshedAccount),
      googleDrive: publicGoogleDrive(workspaceAccountFor(refreshedAccount, store))
    });
  }
  if (!result.synced) {
    return jsonResponse(req, res, 502, {
      ok: false,
      error: result.error && result.error.message || "Google Drive sync failed.",
      account: publicAccount(refreshedAccount)
    });
  }
  jsonResponse(req, res, 200, {
    ok: true,
    syncedAt,
    spreadsheetUrl: result.spreadsheetUrl,
    account: publicAccount(refreshedAccount),
    googleDrive: publicGoogleDrive(store.accounts.find((item) => item.id === workspaceAccount.id) || workspaceAccount)
  });
}

async function disconnectGoogleDrive(req, res) {
  const store = await readStore();
  const account = sessionAccountFromRequest(req, store);
  if (!account) return jsonResponse(req, res, 401, { ok: false, error: "Sign in is required." });
  const workspaceAccount = workspaceAccountFor(account, store);
  if (account.id !== workspaceAccount.id && account.role !== "owner") {
    return jsonResponse(req, res, 403, { ok: false, error: "Only the workspace owner can disconnect Google Drive storage." });
  }
  const updatedAccount = {
    ...workspaceAccount,
    googleDrive: {
      disconnectedAt: new Date().toISOString()
    }
  };
  updateStoreAccount(store, updatedAccount);
  audit(store, "google_drive_disconnected", { accountId: updatedAccount.id, email: updatedAccount.email });
  await writeStore(store);
  jsonResponse(req, res, 200, { ok: true, account: publicAccount(account.id === updatedAccount.id ? updatedAccount : account) });
}

async function loadAccountAppData(req, res) {
  const store = await readStore();
  const account = sessionAccountFromRequest(req, store);
  if (!account) return jsonResponse(req, res, 401, { ok: false, error: "Sign in is required." });

  const workspaceAccount = workspaceAccountFor(account, store);
  const record = await readAccountAppData(workspaceAccount.id, store);
  jsonResponse(req, res, 200, {
    ok: true,
    empty: !record,
    data: record ? filterAppDataForAccount(record.data, account) : {},
    updatedAt: record ? record.updatedAt : null,
    account: publicAccount(account),
    workspaceAccountId: workspaceAccount.id
  });
}

async function saveAccountAppData(req, res) {
  const store = await readStore();
  const account = sessionAccountFromRequest(req, store);
  if (!account) return jsonResponse(req, res, 401, { ok: false, error: "Sign in is required." });

  const body = await readJsonBody(req, MAX_APP_DATA_BODY_BYTES);
  const workspaceAccount = workspaceAccountFor(account, store);
  const updatedAt = await withKeyedLock(appDataSaveLocks, workspaceAccount.id, async () => {
    const existing = await readAccountAppData(workspaceAccount.id, store);
    const data = mergeAppDataForAccount(existing && existing.data, body.data, account);
    const savedAt = new Date().toISOString();
    await writeAccountAppData(workspaceAccount, account, data, savedAt, store);
    const event = audit(store, "app_data_saved", {
      accountId: account.id,
      workspaceAccountId: workspaceAccount.id,
      keys: appDataWriteKeysForAccount(account),
      meta: requestMeta(req)
    });
    await persistAuditEvent(store, event);
    return savedAt;
  });
  jsonResponse(req, res, 200, { ok: true, updatedAt, account: publicAccount(account), workspaceAccountId: workspaceAccount.id });
}

async function submitSwaToAccounting(req, res) {
  const store = await readStore();
  const account = sessionAccountFromRequest(req, store);
  if (!account) return jsonResponse(req, res, 401, { ok: false, error: "Sign in is required." });
  if (!hasEngineeringAccess(account)) {
    return jsonResponse(req, res, 403, { ok: false, error: "Engineering access is required to submit an SWA." });
  }

  const body = await readJsonBody(req);
  const sheetId = String(body.sheetId || "").trim();
  if (!sheetId || sheetId.length > 180) {
    return jsonResponse(req, res, 400, { ok: false, error: "A valid saved SWA sheet is required." });
  }

  const workspaceAccount = workspaceAccountFor(account, store);
  const result = await withKeyedLock(appDataSaveLocks, workspaceAccount.id, async () => {
    const activeStore = SUPABASE_ENABLED ? store : await readStore();
    const record = await readAccountAppData(workspaceAccount.id, activeStore);
    const data = normalizeAccountAppData(record && record.data);
    const swa = data.swa && typeof data.swa === "object" ? data.swa : {};
    const sheets = Array.isArray(swa.sheets) ? swa.sheets : [];
    const sheet = sheets.find((item) => item && item.id === sheetId);
    if (!sheet) throw httpError("Save and sync the SWA before submitting it to Accounting.", 404);

    const amount = serverSwaSheetThisPeriodTotal(sheet);
    if (amount <= 0) throw httpError("This SWA has no payment-period amount to submit.", 400);

    const accounting = data.accounting && typeof data.accounting === "object" ? data.accounting : {};
    const billings = Array.isArray(accounting.billings) ? accounting.billings : [];
    const expenses = Array.isArray(accounting.expenses) ? accounting.expenses : [];
    const existing = billings.find((item) => item && item.sourceType === "swa" && item.sourceSwaSheetId === sheet.id) || null;
    if (existing && ["Approved", "Paid"].includes(existing.status)) {
      throw httpError(`This billing is already ${String(existing.status).toLowerCase()} in Accounting and cannot be resubmitted.`, 409);
    }

    const submittedAt = new Date().toISOString();
    const billing = {
      ...(existing || {}),
      id: existing && existing.id || randomId("billing"),
      billingNumber: String(sheet.name || "Progress Billing").slice(0, 180),
      projectId: String(sheet.projectId || "").slice(0, 180),
      description: `Statement of Work Accomplished - ${String(sheet.name || "Progress Billing")}`.slice(0, 300),
      amount,
      dueDate: existing && existing.dueDate || "",
      status: "Submitted",
      notes: existing && existing.notes || "Submitted directly from the SWA Chart.",
      sourceType: "swa",
      sourceSwaSheetId: sheet.id,
      sourceSwaProjectId: String(sheet.projectId || "").slice(0, 180),
      submittedAt,
      submittedById: account.id,
      submittedByName: account.name || "",
      submittedByEmail: account.email || "",
      enteredById: existing && existing.enteredById || account.id,
      enteredByName: existing && existing.enteredByName || account.name || "",
      enteredByEmail: existing && existing.enteredByEmail || account.email || "",
      createdAt: existing && existing.createdAt || submittedAt,
      updatedById: account.id,
      updatedByName: account.name || "",
      updatedByEmail: account.email || "",
      updatedAt: submittedAt
    };
    const action = existing ? "updated" : "created";
    const nextSheets = sheets.map((item) => item.id === sheet.id ? {
      ...item,
      accountingBillingId: billing.id,
      accountingStatus: billing.status,
      submittedToAccountingAt: submittedAt,
      submittedToAccountingByName: account.name || "",
      submittedToAccountingByEmail: account.email || ""
    } : item);
    const nextAccounting = {
      ...accounting,
      billings: existing
        ? billings.map((item) => item.id === existing.id ? billing : item)
        : [...billings, billing],
      expenses,
      updatedAt: submittedAt
    };
    const nextData = {
      ...data,
      swa: { ...swa, sheets: nextSheets },
      accounting: nextAccounting,
      savedAt: submittedAt
    };

    await writeAccountAppData(workspaceAccount, account, nextData, submittedAt, activeStore);
    const event = audit(activeStore, "swa_submitted_to_accounting", {
      accountId: account.id,
      workspaceAccountId: workspaceAccount.id,
      sheetId: sheet.id,
      billingId: billing.id,
      projectId: billing.projectId,
      amount,
      action,
      meta: requestMeta(req)
    });
    await persistAuditEvent(activeStore, event);
    return {
      action,
      accounting: appDataReadKeysForAccount(account).includes("accounting") ? nextAccounting : null,
      submission: {
        billingId: billing.id,
        status: billing.status,
        submittedAt,
        submittedByName: account.name || "",
        submittedByEmail: account.email || ""
      }
    };
  });

  jsonResponse(req, res, 200, { ok: true, ...result });
}

async function submitEstimateToProcurement(req, res) {
  const store = await readStore();
  const account = sessionAccountFromRequest(req, store);
  if (!account) return jsonResponse(req, res, 401, { ok: false, error: "Sign in is required." });
  if (!hasEngineeringAccess(account)) {
    return jsonResponse(req, res, 403, { ok: false, error: "Engineering access is required to submit an estimate." });
  }

  const body = await readJsonBody(req);
  const version = body.version === "v2" ? "v2" : body.version === "v1" ? "v1" : "";
  const submissionId = String(body.submissionId || "").trim();
  if (!version || !submissionId || submissionId.length > 180) {
    return jsonResponse(req, res, 400, { ok: false, error: "A valid Estimate v1 or v2 submission is required." });
  }

  const workspaceAccount = workspaceAccountFor(account, store);
  const result = await withKeyedLock(appDataSaveLocks, workspaceAccount.id, async () => {
    const activeStore = SUPABASE_ENABLED ? store : await readStore();
    const record = await readAccountAppData(workspaceAccount.id, activeStore);
    const data = normalizeAccountAppData(record && record.data);
    const draftKey = version === "v2" ? "estimateV2Draft" : "estimateDraft";
    const draft = data[draftKey] && typeof data[draftKey] === "object" ? data[draftKey] : {};
    if (String(draft.submissionId || "") !== submissionId) {
      throw httpError("Save and sync the estimate before submitting it to Procurement.", 404);
    }

    const rows = serverEstimateProcurementRows(version, draft);
    if (!rows.length) throw httpError("Add at least one material with a quantity before submitting to Procurement.", 400);

    const procurement = data.procurement && typeof data.procurement === "object" ? data.procurement : {};
    let requests = Array.isArray(procurement.requests) ? [...procurement.requests] : [];
    const orders = Array.isArray(procurement.orders) ? procurement.orders : [];
    const suppliers = Array.isArray(procurement.suppliers) ? procurement.suppliers : [];
    const submittedAt = new Date().toISOString();
    let createdCount = 0;
    let updatedCount = 0;
    let lockedCount = 0;

    rows.forEach((row) => {
      const existing = requests.find((item) => item
        && item.sourceType === "estimate"
        && item.sourceEstimateVersion === version
        && item.sourceEstimateId === submissionId
        && item.sourceEstimateRowId === row.id) || null;
      if (existing && ["Approved", "Ordered", "Received"].includes(existing.status)) {
        lockedCount += 1;
        return;
      }

      const request = {
        ...(existing || {}),
        id: existing && existing.id || randomId("request"),
        projectId: row.projectId,
        item: row.description,
        quantity: row.quantity,
        unit: row.unit,
        estimatedUnitCost: row.costPerUnit,
        neededBy: existing && existing.neededBy || "",
        priority: existing && existing.priority || "Medium",
        status: "Pending",
        notes: existing && existing.notes || `Submitted directly from Estimate ${version.toUpperCase()}.`,
        sourceType: "estimate",
        sourceEstimateVersion: version,
        sourceEstimateId: submissionId,
        sourceEstimateRowId: row.id,
        submittedAt,
        submittedById: account.id,
        submittedByName: account.name || "",
        submittedByEmail: account.email || "",
        enteredById: existing && existing.enteredById || account.id,
        enteredByName: existing && existing.enteredByName || account.name || "",
        enteredByEmail: existing && existing.enteredByEmail || account.email || "",
        createdAt: existing && existing.createdAt || submittedAt,
        updatedById: account.id,
        updatedByName: account.name || "",
        updatedByEmail: account.email || "",
        updatedAt: submittedAt
      };
      requests = existing
        ? requests.map((item) => item.id === existing.id ? request : item)
        : [...requests, request];
      if (existing) updatedCount += 1;
      else createdCount += 1;
    });

    const nextDraft = {
      ...draft,
      submittedToProcurementAt: submittedAt,
      submittedToProcurementByName: account.name || "",
      submittedToProcurementByEmail: account.email || "",
      submittedRequestCount: rows.length
    };
    const nextProcurement = {
      ...procurement,
      requests,
      orders,
      suppliers,
      updatedAt: submittedAt
    };
    const nextData = {
      ...data,
      [draftKey]: nextDraft,
      procurement: nextProcurement,
      savedAt: submittedAt
    };

    await writeAccountAppData(workspaceAccount, account, nextData, submittedAt, activeStore);
    const event = audit(activeStore, "estimate_submitted_to_procurement", {
      accountId: account.id,
      workspaceAccountId: workspaceAccount.id,
      version,
      submissionId,
      requestCount: rows.length,
      createdCount,
      updatedCount,
      lockedCount,
      meta: requestMeta(req)
    });
    await persistAuditEvent(activeStore, event);
    return {
      procurement: appDataReadKeysForAccount(account).includes("procurement") ? nextProcurement : null,
      submission: {
        submittedAt,
        submittedByName: account.name || "",
        submittedByEmail: account.email || "",
        requestCount: rows.length,
        createdCount,
        updatedCount,
        lockedCount
      }
    };
  });

  jsonResponse(req, res, 200, { ok: true, ...result });
}

function serverEstimateProcurementRows(version, draft) {
  const projectId = serverEstimateText(draft && draft.selectedProjectId, 180);
  if (version === "v2") {
    const takeoffRows = Array.isArray(draft && draft.takeoffRows) ? draft.takeoffRows : [];
    const materialRows = Array.isArray(draft && draft.materials) ? draft.materials : [];
    return [
      ...takeoffRows
        .filter((row) => serverSameEstimateProject(row && row.projectId, projectId))
        .map((row) => serverEstimateProcurementRow(`takeoff:${row && row.id || ""}`, row, projectId)),
      ...materialRows.map((row) => serverEstimateProcurementRow(`material:${row && row.id || ""}`, row, projectId))
    ].filter(Boolean);
  }
  const rows = Array.isArray(draft && draft.rows) ? draft.rows : [];
  return rows.map((row) => serverEstimateProcurementRow(row && row.id, row, projectId)).filter(Boolean);
}

function serverEstimateProcurementRow(id, row, projectId) {
  const description = serverEstimateText(row && row.description, 300);
  const quantity = Math.round(Math.max(0, Number(row && row.quantity) || 0) * 10000) / 10000;
  if (!description || quantity <= 0) return null;
  return {
    id: serverEstimateText(id, 220) || randomId("estimate_row"),
    description,
    projectId: serverEstimateText(row && row.projectId, 180) || projectId,
    quantity,
    unit: serverEstimateText(row && row.unit, 80) || "unit",
    costPerUnit: Math.round(Math.max(0, Number(row && row.costPerUnit) || 0) * 100) / 100
  };
}

function serverEstimateText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function serverSameEstimateProject(firstProjectId, secondProjectId) {
  return String(firstProjectId || "") === String(secondProjectId || "");
}

function serverSwaSheetThisPeriodTotal(sheet) {
  const rows = Array.isArray(sheet && sheet.rows) ? sheet.rows : [];
  const amount = rows.reduce((total, row) => {
    const quantity = Math.max(0, Number(row && row.thisQty) || 0);
    const unitCost = Math.max(0, Number(row && row.unitCost) || 0);
    return total + (quantity * unitCost);
  }, 0);
  return Math.round(amount * 100) / 100;
}

async function readAccountAppData(accountId, store) {
  if (SUPABASE_ENABLED) {
    try {
      const rows = await supabaseRequest("oversee_app_data", {
        query: `?account_id=eq.${encodeURIComponent(accountId)}&select=data,updated_at&limit=1`
      });
      const row = rows && rows[0];
      return row ? { data: normalizeAccountAppData(row.data), updatedAt: row.updated_at || null } : null;
    } catch (error) {
      throw appDataStorageError(error);
    }
  }

  const records = Array.isArray(store.appData) ? store.appData : [];
  const record = records.find((item) => item.accountId === accountId);
  return record ? { data: normalizeAccountAppData(record.data), updatedAt: record.updatedAt || null } : null;
}

async function writeAccountAppData(workspaceAccount, savedByAccount, data, updatedAt, store) {
  const accountId = workspaceAccount && workspaceAccount.id;
  if (SUPABASE_ENABLED) {
    try {
      await supabaseRequest("oversee_app_data", {
        method: "POST",
        query: "?on_conflict=account_id",
        body: [{
          account_id: accountId,
          data,
          updated_at: updatedAt
        }],
        prefer: "resolution=merge-duplicates,return=minimal"
      });
      await writeGatheredAppData(workspaceAccount, savedByAccount, data, updatedAt);
      return;
    } catch (error) {
      throw appDataStorageError(error);
    }
  }

  const records = Array.isArray(store.appData) ? store.appData : [];
  const record = {
    accountId,
    accountEmail: workspaceAccount && workspaceAccount.email || null,
    accountName: workspaceAccount && workspaceAccount.name || null,
    savedByAccountId: savedByAccount && savedByAccount.id || null,
    savedByEmail: savedByAccount && savedByAccount.email || null,
    savedByName: savedByAccount && savedByAccount.name || null,
    data,
    dataSummary: summarizeAccountAppData(data),
    updatedAt
  };
  store.appData = records.some((item) => item.accountId === accountId)
    ? records.map((item) => item.accountId === accountId ? record : item)
    : [...records, record];
}

async function writeGatheredAppData(workspaceAccount, savedByAccount, data, updatedAt) {
  if (!SUPABASE_ENABLED || !workspaceAccount || !workspaceAccount.id || !savedByAccount) return;
  try {
    await supabaseRequest("oversee_gathered_app_data", {
      method: "POST",
      query: "?on_conflict=account_id",
      body: [{
        account_id: workspaceAccount.id,
        account_email: workspaceAccount.email || null,
        account_name: workspaceAccount.name || null,
        saved_by_account_id: savedByAccount.id,
        saved_by_email: savedByAccount.email || null,
        saved_by_name: savedByAccount.name || null,
        data,
        data_summary: summarizeAccountAppData(data),
        saved_at: updatedAt,
        updated_at: updatedAt
      }],
      prefer: "resolution=merge-duplicates,return=minimal"
    });
  } catch (error) {
    const message = String(error && error.message || "");
    if (/oversee_gathered_app_data|relation .* does not exist|schema cache/i.test(message)) {
      console.warn("Supabase gathered app data table is not created yet. Run supabase/schema.sql to enable it.");
      return;
    }
    throw error;
  }
}

function summarizeAccountAppData(data) {
  const source = data && typeof data === "object" && !Array.isArray(data) ? data : {};
  const projects = Array.isArray(source.projects) ? source.projects : [];
  const estimateTemplates = Array.isArray(source.estimateTemplates) ? source.estimateTemplates : [];
  const materialPrices = Array.isArray(source.materialPrices) ? source.materialPrices : [];
  const swa = source.swa && typeof source.swa === "object" ? source.swa : {};
  const estimateDraft = source.estimateDraft && typeof source.estimateDraft === "object" ? source.estimateDraft : {};
  const estimateV2Draft = source.estimateV2Draft && typeof source.estimateV2Draft === "object" ? source.estimateV2Draft : {};
  const estimateRows = Array.isArray(estimateDraft.rows) ? estimateDraft.rows : [];
  const takeoffRows = Array.isArray(estimateV2Draft.takeoffRows) ? estimateV2Draft.takeoffRows : [];
  const procurement = source.procurement && typeof source.procurement === "object" ? source.procurement : {};
  const accounting = source.accounting && typeof source.accounting === "object" ? source.accounting : {};
  const swaSheets = Object.values(swa).reduce((total, projectSwa) => {
    if (!projectSwa || typeof projectSwa !== "object") return total;
    if (Array.isArray(projectSwa.sheets)) return total + projectSwa.sheets.length;
    if (Array.isArray(projectSwa.billings)) return total + projectSwa.billings.length;
    return total;
  }, 0);

  return {
    projectCount: projects.length,
    swaProjectCount: Object.keys(swa).length,
    swaSheetCount: swaSheets,
    estimateTemplateCount: estimateTemplates.length,
    materialStoreCount: materialPrices.length,
    estimateRowCount: estimateRows.length,
    estimateV2TakeoffRowCount: takeoffRows.length,
    estimateV2PlanFileName: String(estimateV2Draft.planFileName || ""),
    estimateV2PlanStored: Boolean(estimateV2Draft.planStoragePath),
    purchaseRequestCount: Array.isArray(procurement.requests) ? procurement.requests.length : 0,
    purchaseOrderCount: Array.isArray(procurement.orders) ? procurement.orders.length : 0,
    supplierCount: Array.isArray(procurement.suppliers) ? procurement.suppliers.length : 0,
    billingCount: Array.isArray(accounting.billings) ? accounting.billings.length : 0,
    expenseCount: Array.isArray(accounting.expenses) ? accounting.expenses.length : 0,
    savedAt: String(source.savedAt || new Date().toISOString())
  };
}

function normalizeAccountAppData(data) {
  const source = data && typeof data === "object" && !Array.isArray(data) ? data : {};
  return APP_DATA_KEYS.reduce((result, key) => {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      result[key] = source[key];
    }
    return result;
  }, {
    savedAt: String(source.savedAt || new Date().toISOString())
  });
}

function appDataStorageError(error) {
  const message = String(error && error.message || "");
  if (/oversee_app_data|relation .* does not exist|schema cache/i.test(message)) {
    const nextError = httpError("Supabase app data table is not created yet. Run the updated supabase/schema.sql in Supabase SQL Editor, then redeploy.", 503);
    nextError.publicMessage = nextError.message;
    return nextError;
  }
  return error;
}

async function extractEstimateV2Pdf(req, res) {
  const { store, account } = await requireEngineeringAccount(req, res);
  if (!account) return;
  if (!hasPaidPlan(account)) return jsonResponse(req, res, 403, { ok: false, error: "Estimate v2 is available for subscribed accounts only." });
  if (checkRateLimit(req, res, "estimate_v2_pdf", account.id, { limit: 20, windowMs: 15 * 60 * 1000 })) return;

  const body = await readJsonBody(req, MAX_PDF_JSON_BODY_BYTES);
  const upload = parseEstimatePdfUpload(body);
  if (upload.error) return jsonResponse(req, res, upload.statusCode || 400, { ok: false, error: upload.error });

  const extracted = extractReadablePdfText(upload.pdfBuffer);
  const materials = detectMaterialsFromText(extracted.text, upload.planType);
  const event = audit(store, "estimate_v2_pdf_extracted", {
    accountId: account.id,
    fileName: upload.fileName,
    planType: upload.planType,
    pageCount: extracted.pageCount,
    materialCount: materials.length,
    meta: requestMeta(req)
  });
  await persistAuditEvent(store, event);

  jsonResponse(req, res, 200, {
    ok: true,
    fileName: upload.fileName,
    planType: upload.planType,
    extractionMode: "Readable PDF",
    extractedAt: new Date().toISOString(),
    pageCount: extracted.pageCount,
    characterCount: extracted.text.length,
    lineCount: extracted.lineCount,
    layerCount: extracted.layerNames.length,
    textPreview: extracted.text.slice(0, PDF_TEXT_PREVIEW_LIMIT),
    materials
  });
}

async function extractEstimateV2Ai(req, res) {
  const { store, account } = await requireEngineeringAccount(req, res);
  if (!account) return;
  if (!hasPaidPlan(account)) return jsonResponse(req, res, 403, { ok: false, error: "Estimate v2 is available for subscribed accounts only." });
  if (!OPENAI_API_KEY) {
    return jsonResponse(req, res, 503, {
      ok: false,
      error: "AI Vision is not configured yet. Add OPENAI_API_KEY in Render environment variables."
    });
  }
  if (checkRateLimit(req, res, "estimate_v2_ai", account.id, { limit: 8, windowMs: 60 * 60 * 1000 })) return;

  const body = await readJsonBody(req, MAX_PDF_JSON_BODY_BYTES);
  const upload = parseEstimatePdfUpload(body);
  if (upload.error) return jsonResponse(req, res, upload.statusCode || 400, { ok: false, error: upload.error });

  const extracted = extractReadablePdfText(upload.pdfBuffer);
  const aiResult = await detectMaterialsWithOpenAiVision({
    fileName: upload.fileName,
    planType: upload.planType,
    base64: upload.base64,
    readableText: extracted.text
  });
  const materials = normalizeAiMaterials(aiResult.materials);

  const event = audit(store, "estimate_v2_ai_extracted", {
    accountId: account.id,
    fileName: upload.fileName,
    planType: upload.planType,
    pageCount: extracted.pageCount,
    materialCount: materials.length,
    model: OPENAI_VISION_MODEL,
    meta: requestMeta(req)
  });
  await persistAuditEvent(store, event);

  jsonResponse(req, res, 200, {
    ok: true,
    fileName: upload.fileName,
    planType: upload.planType,
    extractionMode: `AI Vision (${OPENAI_VISION_MODEL})`,
    extractedAt: new Date().toISOString(),
    pageCount: extracted.pageCount,
    characterCount: extracted.text.length,
    lineCount: extracted.lineCount,
    layerCount: extracted.layerNames.length,
    textPreview: buildAiTextPreview(extracted, aiResult),
    materials
  });
}

async function uploadEstimateV2Plan(req, res) {
  const { store, account } = await requireEngineeringAccount(req, res);
  if (!account) return;
  if (!hasPaidPlan(account)) return jsonResponse(req, res, 403, { ok: false, error: "Estimate v2 is available for subscribed accounts only." });
  if (checkRateLimit(req, res, "estimate_v2_plan_upload", account.id, { limit: 20, windowMs: 15 * 60 * 1000 })) return;
  if (!SUPABASE_ENABLED) return jsonResponse(req, res, 503, { ok: false, error: "Supabase Storage is required to save Estimate v2 PDFs." });

  const body = await readJsonBody(req, MAX_PLAN_PDF_JSON_BODY_BYTES);
  const upload = parseStoredPlanUpload(body);
  if (upload.error) return jsonResponse(req, res, upload.statusCode || 400, { ok: false, error: upload.error });

  const workspaceAccount = workspaceAccountFor(account, store);
  const objectPath = `${workspaceAccount.id}/${randomId("plan")}.pdf`;
  await ensureSupabasePlanBucket();
  await supabaseStorageRequest(storageObjectEndpoint(objectPath), {
    method: "POST",
    contentType: "application/pdf",
    headers: { "x-upsert": "false" },
    body: upload.pdfBuffer
  });

  const uploadedAt = new Date().toISOString();
  const event = audit(store, "estimate_v2_plan_uploaded", {
    accountId: account.id,
    workspaceAccountId: workspaceAccount.id,
    fileName: upload.fileName,
    objectPath,
    size: upload.pdfBuffer.length,
    meta: requestMeta(req)
  });
  await persistAuditEvent(store, event);
  jsonResponse(req, res, 201, {
    ok: true,
    plan: {
      path: objectPath,
      fileName: upload.fileName,
      size: upload.pdfBuffer.length,
      uploadedAt,
      uploadedByName: account.name || "",
      uploadedByEmail: account.email || ""
    }
  });
}

async function downloadEstimateV2Plan(req, res) {
  const { store, account } = await requireEngineeringAccount(req, res);
  if (!account) return;
  if (!hasPaidPlan(account)) return jsonResponse(req, res, 403, { ok: false, error: "Estimate v2 is available for subscribed accounts only." });
  if (!SUPABASE_ENABLED) return jsonResponse(req, res, 503, { ok: false, error: "Supabase Storage is required to load Estimate v2 PDFs." });

  const body = await readJsonBody(req);
  const workspaceAccount = workspaceAccountFor(account, store);
  const objectPath = assertWorkspacePlanPath(body.path, workspaceAccount);
  const storageResponse = await supabaseStorageRequest(storageObjectEndpoint(objectPath));
  const pdfBuffer = Buffer.from(await storageResponse.arrayBuffer());
  if (!pdfBuffer.length || !pdfBuffer.slice(0, 5).toString("latin1").startsWith("%PDF")) {
    throw httpError("The stored plan is not a valid PDF.", 500);
  }
  binaryResponse(req, res, 200, pdfBuffer, {
    "Content-Type": "application/pdf",
    "Content-Length": String(pdfBuffer.length),
    "Content-Disposition": "inline"
  });
}

async function requireEngineeringAccount(req, res) {
  const store = await readStore();
  const account = sessionAccountFromRequest(req, store);
  if (!account) {
    jsonResponse(req, res, 401, { ok: false, error: "Sign in is required." });
    return { store, account: null };
  }
  if (!hasEngineeringAccess(account)) {
    jsonResponse(req, res, 403, { ok: false, error: "Engineering access is required." });
    return { store, account: null };
  }
  return { store, account };
}

function parseEstimatePdfUpload(body) {
  const fileName = String(body.fileName || "Uploaded Plan.pdf").trim().slice(0, 180);
  const planType = PLAN_TYPES.includes(body.planType) ? body.planType : PLAN_TYPES[0];
  const base64 = String(body.data || "").replace(/^data:application\/pdf;base64,/i, "").trim();
  if (!base64) return { error: "PDF data is required." };

  const pdfBuffer = Buffer.from(base64, "base64");
  if (!pdfBuffer.length || !pdfBuffer.slice(0, 5).toString("latin1").startsWith("%PDF")) {
    return { error: "The uploaded file does not look like a PDF." };
  }
  if (pdfBuffer.length > MAX_PDF_UPLOAD_BYTES) {
    return { statusCode: 413, error: "PDF is too large for this extractor." };
  }
  return { fileName, planType, base64, pdfBuffer };
}

function parseStoredPlanUpload(body) {
  const fileName = String(body.fileName || "Uploaded Plan.pdf").trim().slice(0, 180);
  const base64 = String(body.data || "").replace(/^data:application\/pdf;base64,/i, "").trim();
  if (!base64) return { error: "PDF data is required." };
  const pdfBuffer = Buffer.from(base64, "base64");
  if (!pdfBuffer.length || !pdfBuffer.slice(0, 5).toString("latin1").startsWith("%PDF")) {
    return { error: "The uploaded file does not look like a PDF." };
  }
  if (pdfBuffer.length > MAX_PLAN_PDF_BYTES) {
    return { statusCode: 413, error: `Use a PDF below ${Math.floor(MAX_PLAN_PDF_BYTES / 1024 / 1024)} MB.` };
  }
  return { fileName, pdfBuffer };
}

function hasEngineeringAccess(account) {
  return account.role === "owner" || Boolean(account.access && account.access.engineering);
}

function hasPaidPlan(account) {
  return account.plan !== "free";
}

function extractReadablePdfText(pdfBuffer) {
  const raw = pdfBuffer.toString("latin1");
  const pageCount = (raw.match(/\/Type\s*\/Page\b/g) || []).length;
  const layerNames = extractPdfLayerNames(raw);
  const chunks = [];
  const streamPattern = /(\d+)\s+\d+\s+obj\s*([\s\S]*?)\s+stream\r?\n?([\s\S]*?)\r?\n?endstream/g;
  let match;

  while ((match = streamPattern.exec(raw)) !== null) {
    const dictionary = match[2] || "";
    const streamBuffer = trimPdfStreamBuffer(Buffer.from(match[3] || "", "latin1"));
    const decoded = decodePdfStream(streamBuffer, dictionary);
    if (!decoded || !decoded.length) continue;
    const text = extractTextFromPdfContent(decoded.toString("latin1"));
    if (text) chunks.push(text);
  }

  if (!chunks.length) {
    const fallbackText = extractTextFromPdfContent(raw);
    if (fallbackText) chunks.push(fallbackText);
  }

  if (layerNames.length) {
    chunks.push(`Detected PDF layers: ${layerNames.join(", ")}`);
  }

  const text = cleanExtractedText(chunks.join("\n"));
  return {
    pageCount,
    layerNames,
    text,
    lineCount: text ? text.split(/\n+/).filter(Boolean).length : 0
  };
}

function extractPdfLayerNames(raw) {
  const layerNames = [];
  const namePattern = /\/Name\s*\((?:\\.|[^\\()])*\)/g;
  let match;
  while ((match = namePattern.exec(raw)) !== null) {
    const name = decodePdfLiteralString(match[0].replace(/^\/Name\s*/, "")).trim();
    if (!name || /^\d+$/.test(name)) continue;
    if (/^(Adobe|UCS|Normal)$/i.test(name)) continue;
    layerNames.push(name);
  }
  return [...new Set(layerNames)];
}

function trimPdfStreamBuffer(buffer) {
  let start = 0;
  let end = buffer.length;
  if (buffer[start] === 13 && buffer[start + 1] === 10) start += 2;
  else if (buffer[start] === 10 || buffer[start] === 13) start += 1;
  if (buffer[end - 2] === 13 && buffer[end - 1] === 10) end -= 2;
  else if (buffer[end - 1] === 10 || buffer[end - 1] === 13) end -= 1;
  return buffer.subarray(start, end);
}

function decodePdfStream(buffer, dictionary) {
  let decoded = buffer;
  if (/\/ASCIIHexDecode\b/.test(dictionary)) {
    decoded = decodeAsciiHexBuffer(decoded);
  }
  if (/\/FlateDecode\b/.test(dictionary)) {
    try {
      decoded = zlib.inflateSync(decoded);
    } catch (_error) {
      try {
        decoded = zlib.inflateRawSync(decoded);
      } catch (__error) {
        return null;
      }
    }
  }
  if (/\/(?:DCTDecode|JPXDecode|CCITTFaxDecode)\b/.test(dictionary)) return null;
  return decoded;
}

function decodeAsciiHexBuffer(buffer) {
  const hex = buffer.toString("latin1").replace(/[^0-9a-fA-F]/g, "");
  const padded = hex.length % 2 ? `${hex}0` : hex;
  return Buffer.from(padded, "hex");
}

function extractTextFromPdfContent(content) {
  const sections = content.match(/BT[\s\S]*?ET/g) || [content];
  const parts = [];
  sections.forEach((section) => {
    const literalPattern = /\((?:\\.|[^\\()])*\)/g;
    const hexPattern = /<([0-9a-fA-F\s]{4,})>/g;
    let match;
    while ((match = literalPattern.exec(section)) !== null) {
      const decoded = decodePdfLiteralString(match[0]);
      if (decoded) parts.push(decoded);
    }
    while ((match = hexPattern.exec(section)) !== null) {
      const decoded = decodePdfHexString(match[1]);
      if (decoded) parts.push(decoded);
    }
  });
  return parts.join("\n");
}

function decodePdfLiteralString(value) {
  const inner = String(value || "").slice(1, -1);
  const bytes = [];
  for (let index = 0; index < inner.length; index += 1) {
    const char = inner[index];
    if (char !== "\\") {
      bytes.push(inner.charCodeAt(index) & 0xff);
      continue;
    }
    const next = inner[index + 1];
    if (next === undefined) break;
    if (next === "n") bytes.push(10);
    else if (next === "r") bytes.push(13);
    else if (next === "t") bytes.push(9);
    else if (next === "b") bytes.push(8);
    else if (next === "f") bytes.push(12);
    else if (next === "\n") {
      index += 1;
      continue;
    } else if (next === "\r") {
      if (inner[index + 2] === "\n") index += 1;
      index += 1;
      continue;
    } else if (/[0-7]/.test(next)) {
      const octal = inner.slice(index + 1).match(/^[0-7]{1,3}/)[0];
      bytes.push(parseInt(octal, 8));
      index += octal.length;
      continue;
    } else {
      bytes.push(next.charCodeAt(0) & 0xff);
    }
    index += 1;
  }
  return decodePdfStringBuffer(Buffer.from(bytes));
}

function decodePdfHexString(hexValue) {
  const hex = String(hexValue || "").replace(/\s+/g, "");
  if (!hex) return "";
  const padded = hex.length % 2 ? `${hex}0` : hex;
  return decodePdfStringBuffer(Buffer.from(padded, "hex"));
}

function decodePdfStringBuffer(buffer) {
  if (!buffer.length) return "";
  if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) {
    const codes = [];
    for (let index = 2; index + 1 < buffer.length; index += 2) {
      codes.push(buffer.readUInt16BE(index));
    }
    return String.fromCharCode(...codes);
  }
  return buffer.toString("latin1");
}

function cleanExtractedText(text) {
  const lines = String(text || "")
    .replace(/\u0000/g, "")
    .replace(/[^\S\r\n]+/g, " ")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, " ")
    .split(/\r?\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 1 && /[A-Za-z0-9]/.test(line));
  return [...new Set(lines)].join("\n");
}

function detectMaterialsFromText(text, planType) {
  const normalizedText = String(text || "");
  const searchableText = normalizedText.toLowerCase();
  const lines = normalizedText.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const includeAll = planType === "Other";

  return MATERIAL_TAKEOFF_TERMS
    .filter((material) => includeAll || material.planTypes.includes(planType) || material.category === "General")
    .map((material) => {
      const matchedTerms = material.terms.filter((term) => countMaterialMatches(searchableText, term) > 0);
      const mentions = matchedTerms.reduce((total, term) => total + countMaterialMatches(searchableText, term), 0);
      return {
        description: material.description,
        category: material.category,
        mentions,
        matchedTerms,
        sampleLines: sampleMaterialLines(lines, matchedTerms)
      };
    })
    .filter((material) => material.mentions > 0)
    .sort((first, second) => second.mentions - first.mentions || first.description.localeCompare(second.description))
    .slice(0, 80);
}

function countMaterialMatches(text, term) {
  const escapedTerm = escapeRegExp(term).replace(/\s+/g, "\\s+");
  const pattern = new RegExp(`(^|[^a-z0-9])${escapedTerm}([^a-z0-9]|$)`, "gi");
  return (text.match(pattern) || []).length;
}

function sampleMaterialLines(lines, terms) {
  if (!terms.length) return [];
  const lowerTerms = terms.map((term) => term.toLowerCase());
  const samples = [];
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (!lowerTerms.some((term) => lowerLine.includes(term))) continue;
    samples.push(line.slice(0, 220));
    if (samples.length >= 3) break;
  }
  return samples;
}

async function detectMaterialsWithOpenAiVision({ fileName, planType, base64, readableText }) {
  const prompt = [
    "You are an assistant for construction estimate takeoff.",
    `Analyze this ${planType} PDF plan using both the visible drawing and any readable text.`,
    "Goal: identify materials or construction elements used in the sheet. Do not estimate prices.",
    "If exact quantities are visible in schedules, labels, callouts, or notes, include the quantity and unit.",
    "If exact quantities are not visible, set quantity to null and explain the evidence in notes.",
    "Return only JSON with this shape:",
    "{\"materials\":[{\"description\":\"\",\"category\":\"\",\"unit\":\"\",\"quantity\":null,\"confidence\":\"high|medium|low\",\"source\":\"\",\"notes\":\"\"}],\"warnings\":[\"\"]}",
    "Use concise material names. Include structural items such as concrete, reinforcing bars, footings, foundations, slabs, beams, columns, walls, joists, wire mesh, formworks, and embedded steel when visible.",
    readableText ? `Readable text/layers extracted from the PDF:\n${readableText.slice(0, 6000)}` : "No reliable readable text was extracted before vision analysis."
  ].join("\n\n");

  const response = await fetch(`${OPENAI_API_BASE_URL}/v1/responses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: OPENAI_VISION_MODEL,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              filename: fileName,
              file_data: `data:application/pdf;base64,${base64}`
            },
            {
              type: "input_text",
              text: prompt
            }
          ]
        }
      ],
      max_output_tokens: 4000
    }),
    signal: AbortSignal.timeout(90000)
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload.error && payload.error.message ? payload.error.message : "AI Vision request failed.";
    const error = new Error(message);
    error.statusCode = response.status;
    throw error;
  }

  const outputText = openAiOutputText(payload);
  const parsed = parseJsonFromModelOutput(outputText);
  return {
    materials: Array.isArray(parsed.materials) ? parsed.materials : [],
    warnings: Array.isArray(parsed.warnings) ? parsed.warnings : [],
    rawText: outputText
  };
}

function openAiOutputText(payload) {
  if (payload.output_text) return String(payload.output_text);
  const parts = [];
  (payload.output || []).forEach((item) => {
    (item.content || []).forEach((content) => {
      if (content.text) parts.push(content.text);
      if (content.type === "output_text" && content.text) parts.push(content.text);
    });
  });
  return parts.join("\n");
}

function parseJsonFromModelOutput(outputText) {
  const text = String(outputText || "").trim();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch (_error) {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      try {
        return JSON.parse(fenced[1].trim());
      } catch (__error) {
        return {};
      }
    }
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(text.slice(start, end + 1));
      } catch (__error) {
        return {};
      }
    }
    return {};
  }
}

function normalizeAiMaterials(materials) {
  return (materials || [])
    .map((material) => {
      const quantity = Number(material.quantity);
      const notes = String(material.notes || "").trim();
      const source = String(material.source || "AI Vision").trim();
      return {
        description: String(material.description || "").trim(),
        category: String(material.category || "General").trim(),
        unit: String(material.unit || "").trim(),
        quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : null,
        mentions: 0,
        confidence: normalizeConfidence(material.confidence),
        source,
        notes,
        matchedTerms: [],
        sampleLines: [source, notes].filter(Boolean).slice(0, 3)
      };
    })
    .filter((material) => material.description)
    .slice(0, 120);
}

function normalizeConfidence(value) {
  const confidence = String(value || "").trim().toLowerCase();
  if (["high", "medium", "low"].includes(confidence)) return confidence;
  return confidence || "medium";
}

function buildAiTextPreview(extracted, aiResult) {
  const warnings = (aiResult.warnings || []).filter(Boolean);
  const sections = [];
  if (warnings.length) sections.push(`AI warnings:\n${warnings.join("\n")}`);
  if (extracted.text) sections.push(`Readable PDF text/layers:\n${extracted.text}`);
  if (!sections.length && aiResult.rawText) sections.push(aiResult.rawText);
  return sections.join("\n\n").slice(0, PDF_TEXT_PREVIEW_LIMIT);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function routeApi(req, res, url) {
  if (req.method === "OPTIONS") return jsonResponse(req, res, 204, {});
  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      return jsonResponse(req, res, 200, {
        ok: true,
        service: "oversee-backend",
        storage: SUPABASE_ENABLED ? "supabase" : "local-json",
        planStorage: SUPABASE_ENABLED ? SUPABASE_PLAN_BUCKET : null,
        googleDrive: googleDriveConfigured(),
        email: configuredEmailMode(),
        dataDir: SUPABASE_ENABLED ? null : DATA_DIR
      });
    }
    if (req.method === "GET" && url.pathname === "/api/google/oauth/callback") {
      return await handleGoogleOAuthCallback(req, res, url);
    }
    if (req.method === "POST" && url.pathname === "/api/auth/signup/request-otp") {
      return await requestSignupOtp(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/auth/signup") {
      return await signupDirect(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/auth/signup/verify") {
      return await verifySignupOtp(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      return await login(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/auth/logout") {
      return await logout(req, res);
    }
    if (req.method === "GET" && url.pathname === "/api/accounts") {
      return await listAccounts(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/accounts/access") {
      return await updateAccountAccess(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/invites/create") {
      return await createOwnerInvite(req, res);
    }
    if (req.method === "GET" && url.pathname === "/api/google/drive/status") {
      return await googleDriveStatus(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/google/drive/auth-url") {
      return await createGoogleDriveAuthUrl(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/google/drive/sync") {
      return await syncGoogleDriveNow(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/google/drive/disconnect") {
      return await disconnectGoogleDrive(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/app-data/load") {
      return await loadAccountAppData(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/app-data/save") {
      return await saveAccountAppData(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/swa/submit-accounting") {
      return await submitSwaToAccounting(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/estimate/submit-procurement") {
      return await submitEstimateToProcurement(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/estimate-v2/extract-pdf") {
      return await extractEstimateV2Pdf(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/estimate-v2/extract-ai") {
      return await extractEstimateV2Ai(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/estimate-v2/plan/upload") {
      return await uploadEstimateV2Plan(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/estimate-v2/plan/download") {
      return await downloadEstimateV2Plan(req, res);
    }
    return notFound(req, res);
  } catch (error) {
    const statusCode = Number(error && error.statusCode) || 500;
    if (statusCode >= 500) console.error(error);
    jsonResponse(req, res, statusCode, { ok: false, error: publicErrorMessage(error) });
  }
}

async function serveStatic(req, res, url) {
  let rawPath;
  try {
    rawPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  } catch (_error) {
    res.writeHead(400, responseHeaders({ "Content-Type": "text/plain; charset=utf-8" }));
    res.end("Bad request");
    return;
  }

  if (!PUBLIC_STATIC_FILES.has(rawPath)) {
    res.writeHead(404, responseHeaders({ "Content-Type": "text/plain; charset=utf-8" }));
    res.end("Not found");
    return;
  }

  const filePath = path.resolve(ROOT_DIR, `.${rawPath}`);
  const relativePath = path.relative(ROOT_DIR, filePath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    res.writeHead(403, responseHeaders({ "Content-Type": "text/plain; charset=utf-8" }));
    res.end("Forbidden");
    return;
  }

  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) {
      res.writeHead(404, responseHeaders({ "Content-Type": "text/plain; charset=utf-8" }));
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const cacheControl = ext === ".html"
      ? "no-store"
      : [".js", ".css"].includes(ext)
        ? "public, max-age=300, must-revalidate"
        : "public, max-age=3600";
    const shouldGzip = /\bgzip\b/i.test(String(req.headers["accept-encoding"] || ""))
      && [".html", ".css", ".js", ".json", ".svg"].includes(ext);
    res.writeHead(200, responseHeaders({
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": cacheControl,
      ...(shouldGzip ? { "Content-Encoding": "gzip", Vary: "Accept-Encoding" } : {})
    }));
    const stream = fsSync.createReadStream(filePath);
    if (shouldGzip) {
      stream.pipe(zlib.createGzip({ level: zlib.constants.Z_BEST_SPEED })).pipe(res);
    } else {
      stream.pipe(res);
    }
  } catch (error) {
    if (error.code === "ENOENT") {
      res.writeHead(404, responseHeaders({ "Content-Type": "text/plain; charset=utf-8" }));
      res.end("Not found");
      return;
    }
    console.error(error);
    res.writeHead(500, responseHeaders({ "Content-Type": "text/plain; charset=utf-8" }));
    res.end("Server error");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (shouldRedirectToHttps(req)) {
    res.writeHead(308, responseHeaders({ Location: `https://${req.headers.host}${url.pathname}${url.search}` }));
    res.end();
    return;
  }
  if (url.pathname.startsWith("/api/")) {
    await routeApi(req, res, url);
    return;
  }
  await serveStatic(req, res, url);
});

server.listen(PORT, HOST, () => {
  console.log(`Oversee app and backend running at http://${HOST}:${PORT}`);
  if (SUPABASE_ENABLED) {
    console.log(`Data storage: Supabase (${SUPABASE_URL})`);
  } else {
    console.log(`Data storage: ${DATA_DIR}`);
  }
  console.log(`Email mode: ${emailModeLabel()}`);
  console.log(`AI Vision: ${OPENAI_API_KEY ? `enabled (${OPENAI_VISION_MODEL})` : "not configured"}`);
});
