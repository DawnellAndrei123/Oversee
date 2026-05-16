const fs = require("node:fs");
const path = require("node:path");

const ROOT_DIR = path.join(__dirname, "..");
loadDotEnv(path.join(ROOT_DIR, ".env"));

const SUPABASE_URL = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const email = String(process.argv[2] || "").trim().toLowerCase();

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env first.");
  process.exit(1);
}

if (!email) {
  console.error("Usage: node supabase/promote-account.js email@example.com");
  process.exit(1);
}

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  fs.readFileSync(filePath, "utf8").split(/\r?\n/).forEach((line) => {
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

async function supabaseRequest(pathname, { method = "GET", body, prefer } = {}) {
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (prefer) headers.Prefer = prefer;

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${pathname}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) throw new Error(await response.text());
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function main() {
  const rows = await supabaseRequest(`oversee_accounts?email=eq.${encodeURIComponent(email)}&select=id,data`);
  const row = rows && rows[0];
  if (!row) {
    console.error(`No account found for ${email}.`);
    process.exit(1);
  }

  const now = new Date().toISOString();
  const data = {
    ...row.data,
    role: "owner",
    access: {
      engineering: true,
      procurement: true,
      accounting: true,
      administrative: true
    },
    invitedBy: null,
    updatedAt: now
  };

  await supabaseRequest(`oversee_accounts?id=eq.${encodeURIComponent(row.id)}`, {
    method: "PATCH",
    body: {
      data,
      updated_at: now
    },
    prefer: "return=minimal"
  });

  console.log(`Promoted ${email} to owner.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
