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

function summarizeAccountAppData(data) {
  const source = data && typeof data === "object" && !Array.isArray(data) ? data : {};
  const projects = Array.isArray(source.projects) ? source.projects : [];
  const estimateTemplates = Array.isArray(source.estimateTemplates) ? source.estimateTemplates : [];
  const materialPrices = Array.isArray(source.materialPrices) ? source.materialPrices : [];
  const swa = source.swa && typeof source.swa === "object" ? source.swa : {};
  const estimateV2Draft = source.estimateV2Draft && typeof source.estimateV2Draft === "object" ? source.estimateV2Draft : {};
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
    estimateV2TakeoffRowCount: takeoffRows.length,
    purchaseRequestCount: Array.isArray(procurement.requests) ? procurement.requests.length : 0,
    purchaseOrderCount: Array.isArray(procurement.orders) ? procurement.orders.length : 0,
    supplierCount: Array.isArray(procurement.suppliers) ? procurement.suppliers.length : 0,
    billingCount: Array.isArray(accounting.billings) ? accounting.billings.length : 0,
    expenseCount: Array.isArray(accounting.expenses) ? accounting.expenses.length : 0,
    savedAt: String(source.savedAt || new Date().toISOString())
  };
}

async function syncAppData(store) {
  const records = Array.isArray(store.appData) ? store.appData : [];
  if (!records.length) {
    console.log("oversee_app_data: no records to migrate");
    console.log("oversee_gathered_app_data: no records to migrate");
    return;
  }

  const accounts = Array.isArray(store.accounts) ? store.accounts : [];
  const rows = records
    .filter((record) => record && record.accountId)
    .map((record) => {
      const account = accounts.find((item) => item.id === record.accountId) || {};
      return {
        account_id: String(record.accountId),
        account_email: account.email || record.accountEmail || null,
        account_name: account.name || record.accountName || null,
        saved_by_account_id: record.savedByAccountId || String(record.accountId),
        saved_by_email: record.savedByEmail || account.email || record.accountEmail || null,
        saved_by_name: record.savedByName || account.name || record.accountName || null,
        data: record.data || {},
        data_summary: record.dataSummary || summarizeAccountAppData(record.data),
        saved_at: record.updatedAt || new Date().toISOString(),
        updated_at: record.updatedAt || new Date().toISOString()
      };
    });

  if (!rows.length) {
    console.log("oversee_app_data: no valid records to migrate");
    console.log("oversee_gathered_app_data: no valid records to migrate");
    return;
  }

  await supabaseRequest("oversee_app_data", {
    method: "POST",
    query: "?on_conflict=account_id",
    body: rows.map((row) => ({
      account_id: row.account_id,
      data: row.data,
      updated_at: row.updated_at
    })),
    prefer: "resolution=merge-duplicates,return=minimal"
  });
  console.log(`oversee_app_data: migrated ${rows.length} record(s)`);

  await supabaseRequest("oversee_gathered_app_data", {
    method: "POST",
    query: "?on_conflict=account_id",
    body: rows,
    prefer: "resolution=merge-duplicates,return=minimal"
  });
  console.log(`oversee_gathered_app_data: migrated ${rows.length} record(s)`);
}

async function main() {
  const raw = await fs.readFile(STORE_FILE, "utf8");
  const store = JSON.parse(raw);

  for (const collection of COLLECTIONS) {
    await syncCollection(collection, Array.isArray(store[collection.storeKey]) ? store[collection.storeKey] : []);
  }

  await syncAppData(store);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
