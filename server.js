const http = require("node:http");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const tls = require("node:tls");

const ROOT_DIR = __dirname;
loadDotEnv(path.join(ROOT_DIR, ".env"));

const DATA_DIR = process.env.OVERSEE_DATA_DIR || path.join(ROOT_DIR, "backend", "data");
const STORE_FILE = path.join(DATA_DIR, "store.json");
const OUTBOX_FILE = path.join(DATA_DIR, "email-outbox.jsonl");
const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || (process.env.RENDER || process.env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1");
const OTP_TTL_MINUTES = Number(process.env.OTP_TTL_MINUTES || 10);
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS || 30);
const MAX_JSON_BODY_BYTES = Number(process.env.MAX_JSON_BODY_BYTES || 65536);
const SUPABASE_URL = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_ENABLED = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
const IS_PRODUCTION = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);

const ACCESS_KEYS = ["engineering", "procurement", "accounting", "administrative"];
const PUBLIC_ACCOUNT_FIELDS = [
  "id",
  "name",
  "email",
  "gmailLinked",
  "role",
  "access",
  "invitedBy",
  "createdAt",
  "emailVerifiedAt",
  "lastLoginAt"
];

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

function emptyStore() {
  return {
    accounts: [],
    pendingSignups: [],
    sessions: [],
    invites: [],
    auditLog: [],
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
    "Cross-Origin-Resource-Policy": "same-origin",
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self' data:",
      "connect-src 'self'",
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

function notFound(req, res) {
  jsonResponse(req, res, 404, { ok: false, error: "Not found" });
}

async function readJsonBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_JSON_BODY_BYTES) {
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

function allAccess() {
  return ACCESS_KEYS.reduce((acc, key) => ({ ...acc, [key]: true }), {});
}

function noAccess() {
  return ACCESS_KEYS.reduce((acc, key) => ({ ...acc, [key]: false }), {});
}

function publicAccount(account) {
  return PUBLIC_ACCOUNT_FIELDS.reduce((result, field) => {
    result[field] = account[field];
    return result;
  }, {});
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
  store.auditLog.push({
    id: randomId("audit"),
    action,
    details,
    at: new Date().toISOString()
  });
  store.auditLog = store.auditLog.slice(-1000);
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
  const gmailUser = normalizeEmail(process.env.GMAIL_USER);
  const appPassword = String(process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");
  if (!validateEmail(gmailUser) || !appPassword) {
    throw new Error("Gmail SMTP is not configured correctly.");
  }

  const from = process.env.OVERSEE_EMAIL_FROM || `Oversee <${gmailUser}>`;
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

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    await sendGmailSmtpEmail({ email, subject, text });
    return { mode: "email", provider: "gmail-smtp" };
  }

  if (process.env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.OVERSEE_EMAIL_FROM || "Oversee <onboarding@resend.dev>",
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

  await ensureDataDir();
  await fs.appendFile(OUTBOX_FILE, `${JSON.stringify({ to: email, subject, text, otp, at: new Date().toISOString() })}\n`);
  return { mode: "dev-outbox", outbox: OUTBOX_FILE };
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

  if (!name) return jsonResponse(req, res, 400, { ok: false, error: "Full name is required." });
  if (!validateEmail(email)) return jsonResponse(req, res, 400, { ok: false, error: "A valid email is required." });
  if (password.length < 8) return jsonResponse(req, res, 400, { ok: false, error: "Password must be at least 8 characters." });

  const store = await readStore();
  if (store.accounts.some((account) => account.email === email)) {
    return jsonResponse(req, res, 409, { ok: false, error: "An account already exists with that email." });
  }

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

  const delivery = await sendOtpEmail({ email, name, otp });
  jsonResponse(req, res, 200, {
    ok: true,
    message: delivery.mode === "dev-outbox"
      ? "OTP created. Email sending is not configured, so check backend/data/email-outbox.jsonl."
      : "OTP sent to email.",
    delivery
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

  const invite = pending.inviteToken
    ? store.invites.find((item) => item.token === pending.inviteToken)
    : null;
  const isInvitedAccount = Boolean(invite);
  const account = {
    id: randomId("acct"),
    name: pending.name,
    email,
    passwordHash: pending.passwordHash,
    passwordSalt: pending.passwordSalt,
    gmailLinked: pending.gmailLinked,
    role: isInvitedAccount ? "member" : "owner",
    access: isInvitedAccount ? invite.access : allAccess(),
    invitedBy: invite ? invite.createdBy : null,
    createdAt: new Date().toISOString(),
    emailVerifiedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    requestMeta: pending.requestMeta
  };

  store.accounts.push(account);
  store.pendingSignups = store.pendingSignups.filter((item) => item.email !== email);
  if (invite) {
    invite.acceptedBy = account.id;
    invite.acceptedAt = new Date().toISOString();
  }

  const session = createSession(store, account.id, req);
  audit(store, "account_created", { accountId: account.id, email, role: account.role });
  await writeStore(store);

  jsonResponse(req, res, 201, { ok: true, account: publicAccount(account), session });
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

  const store = await readStore();
  const account = store.accounts.find((item) => item.email === email);
  if (!account || !verifyHash(password, { hash: account.passwordHash, salt: account.passwordSalt })) {
    audit(store, "login_failed", { email, meta: requestMeta(req) });
    await writeStore(store);
    return jsonResponse(req, res, 401, { ok: false, error: "Email or password is incorrect." });
  }

  account.lastLoginAt = new Date().toISOString();
  const session = createSession(store, account.id, req);
  audit(store, "login_succeeded", { accountId: account.id, email });
  await writeStore(store);

  jsonResponse(req, res, 200, { ok: true, account: publicAccount(account), session });
}

async function listAccounts(req, res) {
  const store = await readStore();
  const owner = requireOwner(req, res, store);
  if (!owner) return;
  audit(store, "accounts_listed", { accountId: owner.id, meta: requestMeta(req) });
  await writeStore(store);
  jsonResponse(req, res, 200, { ok: true, accounts: store.accounts.map(publicAccount) });
}

async function routeApi(req, res, url) {
  if (req.method === "OPTIONS") return jsonResponse(req, res, 204, {});
  try {
    if (req.method === "GET" && url.pathname === "/api/health") {
      return jsonResponse(req, res, 200, {
        ok: true,
        service: "oversee-backend",
        storage: SUPABASE_ENABLED ? "supabase" : "local-json",
        dataDir: SUPABASE_ENABLED ? null : DATA_DIR
      });
    }
    if (req.method === "POST" && url.pathname === "/api/auth/signup/request-otp") {
      return await requestSignupOtp(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/auth/signup/verify") {
      return await verifySignupOtp(req, res);
    }
    if (req.method === "POST" && url.pathname === "/api/auth/login") {
      return await login(req, res);
    }
    if (req.method === "GET" && url.pathname === "/api/accounts") {
      return await listAccounts(req, res);
    }
    return notFound(req, res);
  } catch (error) {
    console.error(error);
    jsonResponse(req, res, error.statusCode || 500, { ok: false, error: error.message || "Server error" });
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
    res.writeHead(200, responseHeaders({
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "no-store" : "no-cache"
    }));
    fsSync.createReadStream(filePath).pipe(res);
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
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    console.log("Email mode: Gmail SMTP");
  } else if (process.env.RESEND_API_KEY) {
    console.log("Email mode: Resend API");
  } else {
    console.log("Email mode: development outbox. OTP emails are written to backend/data/email-outbox.jsonl");
  }
});
