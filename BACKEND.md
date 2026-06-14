# Oversee Backend Notes

This prototype now includes a small Node backend in `server.js`. It serves the app files and exposes account APIs:

- `POST /api/auth/signup/request-otp`
- `POST /api/auth/signup/verify`
- `POST /api/auth/login`
- `GET /api/accounts`
- `GET /api/health`

## Data Storage

By default, the backend stores data in `backend/data/store.json`.

If these environment variables are set, the backend stores data in Supabase instead:

```txt
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

The Supabase service role key must stay on the server only. Do not put it in `app.js`, `index.html`, GitHub Pages, or any browser-visible file.

Stored account data includes:

- full name
- email
- password hash and salt
- Gmail-linked preference
- owner/member role
- access permissions
- invite reference
- email verification time
- created and last-login timestamps
- request metadata for audit review

The backend also stores pending OTP signups, sessions, invites, and a small audit log.

## Supabase Setup

1. Create a Supabase project.
2. Open Supabase Dashboard > SQL Editor.
3. Run this file:

```txt
supabase/schema.sql
```

4. Open Supabase Dashboard > Project Settings > API.
5. Copy the Project URL and the `service_role` key.
6. Start the backend with Supabase enabled:

```bash
SUPABASE_URL="https://your-project-ref.supabase.co" SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" PORT=8010 node server.js
```

You can also copy `.env.example` to `.env`, fill in your values, and then run:

```bash
node server.js
```

With Gmail OTP also enabled:

```bash
SUPABASE_URL="https://your-project-ref.supabase.co" SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" GMAIL_USER="yourgmail@gmail.com" GMAIL_APP_PASSWORD="your-app-password" PORT=8010 node server.js
```

Then open:

```txt
http://127.0.0.1:8010/
```

Account data will appear in Supabase Table Editor under:

- `oversee_accounts`
- `oversee_pending_signups`
- `oversee_sessions`
- `oversee_invites`
- `oversee_audit_log`
- `oversee_app_data`
- `oversee_gathered_app_data`

`oversee_app_data` stores each owner's shared workspace data, including projects, SWA data, Estimate v1 and Estimate v2 drafts, takeoff rows, estimate templates, material price lists, Procurement records, Accounting records, and subscription state. This is what lets authorized users log in on another device and see the same workspace data.

`oversee_gathered_app_data` mirrors that saved app data with searchable owner columns: `account_email`, `account_name`, `saved_by_email`, and `saved_by_name`. Use this table in Supabase Table Editor when you want to see who entered the data.

Estimate v2 PDF files are stored separately in the private Supabase Storage bucket named `oversee-estimate-plans`. The synced Estimate v2 draft stores only the secure object path and upload details. The backend creates the private bucket on the first upload when permitted, and `supabase/schema.sql` also creates it during setup.

Most app details are stored in the `data` JSONB column. The tables also include searchable helper columns such as `email`, `account_id`, `account_email`, `account_name`, `expires_at`, and `at`.

To migrate your current local `backend/data/store.json` into Supabase after creating the tables:

```bash
SUPABASE_URL="https://your-project-ref.supabase.co" SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" node supabase/migrate-store.js
```

## Email OTP

For development, OTP emails are written to:

```txt
backend/data/email-outbox.jsonl
```

That outbox file is only a local testing fallback. The backend stores the OTP in `store.json` as a hash, but the development outbox includes the readable OTP so you can test signup without sending real mail.

For Gmail delivery, use a Gmail App Password. Do not use your normal Gmail password.

1. Turn on 2-Step Verification in the Gmail account.
2. Create an App Password for Mail.
3. Start the backend with these environment variables:

```bash
GMAIL_USER="yourgmail@gmail.com" GMAIL_APP_PASSWORD="your-app-password" npm run dev
```

Google sometimes displays app passwords with spaces. The backend accepts either spaced or unspaced values.

You can also use Resend instead of Gmail by setting these environment variables before running the server:

```txt
RESEND_API_KEY=your_resend_api_key
OVERSEE_EMAIL_FROM=Oversee <verified-sender@yourdomain.com>
```

Without Gmail or Resend credentials, no real email is sent. That is intentional so local testing does not accidentally email users.

## Run Locally

The current Python static server on port 8000 cannot run backend APIs. Use the Node server instead:

```bash
npm start
```

If port 8000 is already busy:

```bash
npm run dev
```

Then open:

```txt
http://127.0.0.1:8010/
```

## Production Recommendations

Before using this for real users, move from JSON files to a managed database such as PostgreSQL, MySQL, Firebase, or Supabase.

Add these production pieces:

- HTTPS-only hosting
- environment secrets for email and database credentials
- real email provider with a verified sender domain
- password reset flow
- session cookies with `HttpOnly`, `Secure`, and `SameSite`
- rate limiting for login and OTP attempts
- owner-only authorization on account list and access updates
- database backups
- audit log export
- Google OAuth if Gmail linking should mean real Google account verification
- subscription billing through Stripe, Paddle, or another payment provider

GitHub Pages can host the frontend only. A backend must be deployed to a server platform such as Render, Railway, Fly.io, AWS, Azure, Google Cloud, or a VPS.
