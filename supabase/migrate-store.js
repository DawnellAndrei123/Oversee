const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT_DIR = path.join(__dirname, "..");
const STORE_FILE = process.env.OVERSEE_STORE_FILE || path.join(ROOT_DIR, "backend", "data", "store.json");
const SUPABASE_URL = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const COLLECTIONS = [
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

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this migration.");
  process.exit(1);
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
    throw new Error(`Supabase ${method} ${table} failed: ${await response.text()}`);
  }
}

async function syncCollection(collection, records) {
  const rows = records
    .filter((record) => record && record[collection.recordKey])
    .map((record) => ({
      [collection.keyColumn]: String(record[collection.recordKey]),
      data: record,
      ...collection.columns(record)
    }));

  if (!rows.length) {
    console.log(`${collection.table}: no records to migrate`);
    return;
  }

  await supabaseRequest(collection.table, {
    method: "POST",
    query: `?on_conflict=${collection.keyColumn}`,
    body: rows,
    prefer: "resolution=merge-duplicates,return=minimal"
  });

  console.log(`${collection.table}: migrated ${rows.length} record(s)`);
}

async function main() {
  const raw = await fs.readFile(STORE_FILE, "utf8");
  const store = JSON.parse(raw);

  for (const collection of COLLECTIONS) {
    await syncCollection(collection, Array.isArray(store[collection.storeKey]) ? store[collection.storeKey] : []);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
